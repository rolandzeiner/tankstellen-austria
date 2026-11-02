// Best-refuel-time analytics — bucketed by hour-of-day and weekday.
//
// Clock: hours and weekdays are read in the zone the caller passes (the
// card resolves it the way HA does: the profile's "local" is the browser's
// zone, otherwise the server's), falling back to the browser's zone. The
// recommendation is framed in that clock ("Tuesday morning is typically
// cheapest"), so a dashboard viewed from another zone with the "server"
// setting still speaks Vienna time. Do NOT cache results across sessions
// or share them between users without re-running the analysis.
//
// DST: chunks are split at UTC hour boundaries and labelled with the
// local clock-hour at the chunk start. Vienna's offset is always integer
// hours, so the splits align with local hour boundaries on normal days.
// On the spring-forward day the local 02:00 bucket gets *less* total
// duration that week (the 02–03 wall-clock hour vanishes); on fall-back
// the 02:00 bucket gets *double* duration (two UTC hours both label as
// 02:00 local). Real elapsed time is counted correctly in either case —
// only the per-bucket coverage shifts, by at most one hour-of-data per
// year per affected hour-of-day. Negligible over a 28-day window.
//
// Bucket population uses *duration-weighted chunks*, not hour-boundary
// samples. For each step-function price interval we split at every hour
// boundary it crosses and credit each (hour, weekday) bucket with the
// active price weighted by the milliseconds spent in that bucket. This
// removes the phase bias that hour-boundary sampling has when stations
// update mid-hour (e.g. the legal 12:00 hike that lands at 12:14): the
// 12:00 bucket now reflects ~14min × pre-hike + ~46min × post-hike
// instead of being attributed entirely to the pre-hike price.
//
// IMPORTANT — aggregate min-of-N input: the upstream `HistoryPoint[]` for
// this card is *not* a single station's posted price. It is the running
// minimum over N nearby stations (Tankstellen Austria sensors expose this
// as `station_count`). Consequences this code does **not** try to undo:
//   • An apparent "price hike" in the stream can simply mean the
//     previously-cheapest station got uncovered (its competitor is now
//     cheaper or it briefly went `unavailable`) — no single station may
//     have raised its price at that instant.
//   • The composition of the N stations can change over weeks; recency
//     decay assumes the stream is from a stable source, which it is not.
//   • Per-week winsorise + delta-from-mean shrink genuine composition
//     shifts toward zero, since they look like outliers.
// We treat the stream as opaque on purpose: the card surfaces "when is
// the aggregate cheapest", which is the actionable question for a driver
// choosing among the N stations. Do not interpret the medians or the
// recommendation as statements about any individual station's pricing.
//
// The integration's `best_refuel.py` is a line-for-line port of this file,
// held to it by tests/fixtures/best_refuel_parity.json. Change both.

import type { HistoryPoint } from "../history";
import type { WeightedEntry } from "../utils/math";
import { clamp, weightedPercentile } from "../utils/math";
import { zonedClock, type ZonedClock } from "../utils/tz";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const HALF_LIFE_MS = 14 * DAY_MS;

// Skip per-week aggregation when fewer than this many ms of observed time
// fell in the week. The first and last ISO weeks of a 28-day window are
// usually partial; below ~3 days of chunks the per-week winsorise (p05/p95)
// and weekMean become unstable enough to contaminate every bucket entry
// derived from that week.
const MIN_WEEK_MS = 3 * DAY_MS;

// A bucket needs this many chunks before its median counts.
const MIN_BUCKET_COUNT = 3;

// Confidence: the window's lead over the rest of the day saturates the gap
// score at this many cents, and the share of window time at or below the
// day's median maps 50 % (chance) → 0 and 90 % → 1.
const GAP_REF_CENTS = 1.5;
const CONSISTENCY_CHANCE = 0.5;
const CONSISTENCY_FULL = 0.9;

// A day counts for the consistency check once this much of it was observed.
const MIN_DAY_MS = 20 * HOUR_MS;

// Weekday: the cheapest weekday is named when its lead over the typical
// weekday is at least this much and a permutation test of the day labels
// finds a lead that large in at most 5 % of shuffles.
const MIN_WEEKDAY_GAP_EUR = 0.005;
const WEEKDAY_PERMUTATIONS = 200;
const WEEKDAY_P_MAX = 0.05;
const WEEKDAY_SEED = 0x5eed;

export interface HourlyEnvelope {
  // Per hour-of-day (0-23). null when that hour has no samples.
  minByHour: Array<number | null>;
  maxByHour: Array<number | null>;
}

export type Confidence = "high" | "medium" | "low";

export interface BestRefuelResult {
  hasEnoughData: boolean;
  // Start of the recommended window (0-23). null with enough data but no
  // hour of the day cheaper than the rest: nothing to recommend.
  hour?: number | null;
  hour_end?: number | null; // exclusive end of the window (wraps past 23)
  // A second, disjoint run of hours about as cheap as the window.
  alt_hour?: number | null;
  alt_hour_end?: number | null;
  weekday?: number | null; // 0-6 (Sun..Sat), only when its lead is significant
  confidence?: {
    level: Confidence;
    score: number;
    span_days: number;
    gap_cents: number;
    consistency_pct: number;
  } | null;
}

interface Chunk {
  price: number;
  t: number; // chunk start (epoch ms, local-clock-relevant)
  hour: number; // 0-23 in local time
  weekday: number; // 0-6 in local time
  dayKey: number; // local-midnight epoch ms of the chunk's day
  weekKey: number; // Monday-aligned local-midnight epoch ms
  durationMs: number;
}

// Walk every step-function price interval and emit one chunk per hour the
// interval crosses. The chunk's hour/weekday are determined by its *start*
// — since we always split at hour boundaries, that uniquely identifies the
// hour-of-day for the whole chunk's duration.
//
// Defensive non-finite filter: upstream history.ts already drops `unavailable`
// rows, but a NaN price leaking through (e.g. a malformed sensor value during
// a brief integration glitch) would poison the per-week mean for the entire
// week it landed in. Skip the chunk silently — a missed segment is far less
// damaging than a NaN-poisoned weekMean.
function walkChunks(data: HistoryPoint[], now: number, clock: ZonedClock): Chunk[] {
  const out: Chunk[] = [];
  const emit = (price: number, start: number, end: number): void => {
    if (end <= start) return;
    if (!Number.isFinite(price)) return;
    let cursor = start;
    while (cursor < end) {
      const nextHour = Math.floor(cursor / HOUR_MS) * HOUR_MS + HOUR_MS;
      const chunkEnd = Math.min(end, nextHour);
      const at = clock.parts(cursor);
      out.push({
        price,
        t: cursor,
        hour: at.hour,
        weekday: at.weekday,
        dayKey: clock.startOfDay(cursor),
        weekKey: clock.mondayKey(cursor),
        durationMs: chunkEnd - cursor,
      });
      cursor = chunkEnd;
    }
  };
  for (let i = 0; i < data.length - 1; i++) {
    emit(data[i]!.value, data[i]!.time, data[i + 1]!.time);
  }
  const last = data[data.length - 1]!;
  emit(last.value, last.time, now);
  return out;
}

function groupBy(chunks: Chunk[], key: (c: Chunk) => number): Map<number, Chunk[]> {
  const groups = new Map<number, Chunk[]>();
  for (const c of chunks) {
    const k = key(c);
    const arr = groups.get(k);
    if (arr) arr.push(c);
    else groups.set(k, [c]);
  }
  return groups;
}

interface WinsorisedWeek {
  weekChunks: Chunk[];
  totalMs: number; // observed time in the week, already >= MIN_WEEK_MS
  p05: number; // duration-weighted 5th percentile of the week's prices
  p95: number; // duration-weighted 95th percentile
}

// Weeks with enough observed time to be representative, each paired with its
// duration-weighted winsorise bounds. The recommendation and the hourly
// envelope qualify weeks identically and clip against the same p05/p95 — only
// what they do with the clipped prices differs — so the rule lives here once.
function* winsorisedWeeks(chunks: Chunk[]): Generator<WinsorisedWeek> {
  for (const weekChunks of groupBy(chunks, (c) => c.weekKey).values()) {
    let totalMs = 0;
    for (const c of weekChunks) totalMs += c.durationMs;
    if (totalMs < MIN_WEEK_MS) continue;

    const priceEntries: WeightedEntry[] = weekChunks.map((c) => ({
      value: c.price,
      weight: c.durationMs,
    }));
    yield {
      weekChunks,
      totalMs,
      p05: weightedPercentile(priceEntries, 0.05),
      p95: weightedPercentile(priceEntries, 0.95),
    };
  }
}

interface BestPick {
  medians: number[];
  bestIdx: number; // index of the seed bucket: the first absolute minimum
  minVal: number; // minimum across all valid bucket medians
}

function pickBest(buckets: WeightedEntry[][]): BestPick {
  const medians = buckets.map((b) =>
    b.length >= MIN_BUCKET_COUNT ? weightedPercentile(b, 0.5) : NaN,
  );
  let bestIdx = -1;
  let minVal = Infinity;
  medians.forEach((m, i) => {
    if (!Number.isNaN(m) && m < minVal) {
      minVal = m;
      bestIdx = i;
    }
  });
  return { medians, bestIdx, minVal };
}

// Lower median, the type-1 convention `weightedPercentile` uses too. The
// copy is sorted in place: the card is built for ES2022, before toSorted.
function lowerMedian(values: number[]): number {
  const ordered = [...values];
  ordered.sort((a, b) => a - b);
  return ordered[Math.floor((ordered.length - 1) / 2)]!;
}

// Median of the weekday medians minus the cheapest one, in cents.
function weekdayGapCents(pick: BestPick): number | null {
  const valid = pick.medians.filter((m) => !Number.isNaN(m));
  if (valid.length < 2 || pick.bestIdx < 0) return null;
  return (lowerMedian(valid) - pick.minVal) * 100;
}

// Median of the hour medians outside the window minus the one inside.
// Measured against the hours outside rather than against all 24: under the
// noon rule the cheap run is often half the day or more, and the median of
// all hours would then sit inside the window and read zero.
function windowGapCents(medians: number[], inside: boolean[]): number | null {
  const outside = medians.filter((m, h) => !inside[h] && !Number.isNaN(m));
  const within = medians.filter((m, h) => inside[h] && !Number.isNaN(m));
  if (outside.length === 0 || within.length === 0) return null;
  return (lowerMedian(outside) - lowerMedian(within)) * 100;
}

// Share of window time at or below its day's duration-weighted median,
// pooled over the days with at least MIN_DAY_MS observed. Noise with no
// time-of-day pattern lands near 0.5, a pattern that holds every day near
// 1. Raw prices, so a week with an odd level counts like any other.
function consistency(chunks: Chunk[], inside: boolean[]): number | null {
  let below = 0;
  let total = 0;
  for (const dayChunks of groupBy(chunks, (c) => c.dayKey).values()) {
    let observed = 0;
    for (const c of dayChunks) observed += c.durationMs;
    if (observed < MIN_DAY_MS) continue;
    const dayMedian = weightedPercentile(
      dayChunks.map((c) => ({ value: c.price, weight: c.durationMs })),
      0.5,
    );
    for (const c of dayChunks) {
      if (!inside[c.hour]) continue;
      total += c.durationMs;
      if (c.price <= dayMedian) below += c.durationMs;
    }
  }
  return total > 0 ? below / total : null;
}

// mulberry32: a small PRNG the Python port reproduces bit for bit, so both
// sides shuffle the same way and the parity fixture holds.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface WeekdayEntry extends WeightedEntry {
  weekday: number;
  dayKey: number;
}

// The cheapest weekday, when its lead survives a permutation test. The test
// shuffles which calendar day carries which weekday label and asks how often
// a lead at least as large as the observed one appears by chance. With four
// weeks of history every weekday rests on about four days, so a lead alone
// says little; this is what keeps noise from naming a day.
function weekdayIfSignificant(entries: WeekdayEntry[]): number | null {
  const buckets: WeightedEntry[][] = Array.from({ length: 7 }, () => []);
  for (const e of entries) buckets[e.weekday]!.push(e);
  const pick = pickBest(buckets);
  const observed = weekdayGapCents(pick);
  if (observed === null || observed < MIN_WEEKDAY_GAP_EUR * 100) return null;

  const byDay = groupByDay(entries);
  const days = [...byDay.keys()];
  days.sort((a, b) => a - b);
  const labels = days.map((d) => byDay.get(d)!.weekday);

  const rnd = mulberry32(WEEKDAY_SEED);
  let atLeast = 0;
  for (let n = 0; n < WEEKDAY_PERMUTATIONS; n++) {
    for (let i = labels.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = labels[i]!;
      labels[i] = labels[j]!;
      labels[j] = tmp;
    }
    const shuffled: WeightedEntry[][] = Array.from({ length: 7 }, () => []);
    days.forEach((d, i) => {
      shuffled[labels[i]!]!.push(...byDay.get(d)!.entries);
    });
    const gap = weekdayGapCents(pickBest(shuffled));
    if (gap !== null && gap >= observed) atLeast++;
  }
  const pValue = (atLeast + 1) / (WEEKDAY_PERMUTATIONS + 1);
  return pValue <= WEEKDAY_P_MAX ? pick.bestIdx : null;
}

function groupByDay(
  entries: WeekdayEntry[],
): Map<number, { weekday: number; entries: WeightedEntry[] }> {
  const byDay = new Map<number, { weekday: number; entries: WeightedEntry[] }>();
  for (const e of entries) {
    const day = byDay.get(e.dayKey);
    if (day) day.entries.push(e);
    else byDay.set(e.dayKey, { weekday: e.weekday, entries: [e] });
  }
  return byDay;
}

// Adjacent hours whose median is within 0.5¢/L (= 0.005 EUR/L) of the
// unconditional minimum are folded into the recommended window. Roughly
// the smallest gap a driver would notice as cheaper. Inclusive boundary
// — `m - minVal <= EXPAND_TOLERANCE_EUR` — so an hour exactly on the
// edge is included.
const EXPAND_TOLERANCE_EUR = 0.005;

// Why no daytime tiebreaker on the seed: an earlier version of this code
// preferred the most-daytime hour among any hours tied near the minimum.
// On real aggregate fuel data many hours frequently share an identical
// post-winsorise median (the per-week winsorise collapses several distinct
// prices into the same clipped value, then per-week mean produces the same
// delta). The tiebreaker would then yank the seed across the cluster — say
// from hour 22 to hour 05 — and silently drop the truly cheapest hours
// from the recommended window. We choose the honest answer over the
// friendlier-looking one: seed = first absolute minimum, expand from
// there, let the window land where the data says.

// Walk circularly from the seed hour in both directions, including every
// adjacent hour whose median is within EXPAND_TOLERANCE_EUR of the
// unconditional minimum. The window is whatever length the data dictates
// — no UX cap. A station with a flat overnight pattern will return a wide
// window (e.g. 18 hours covering "anytime except midday"); a station with
// a sharp single cheap hour returns a 1-hour window.
//
// null when every hour is within tolerance: then no time of day is cheaper
// than the rest and there is no window to recommend. (Without this check
// the two walks met and the result was a 23-hour window missing the seed.)
function expandHourWindow(
  medians: number[],
  seedIdx: number,
  minVal: number,
): { start: number; end: number } | null {
  const withinTolerance = (m: number | undefined): boolean =>
    m !== undefined && !Number.isNaN(m) && m - minVal <= EXPAND_TOLERANCE_EUR;

  let forward = 0;
  for (let step = 1; step <= 23; step++) {
    if (!withinTolerance(medians[(seedIdx + step) % 24])) break;
    forward = step;
  }
  let backward = 0;
  for (let step = 1; step <= 23; step++) {
    if (!withinTolerance(medians[(seedIdx - step + 24) % 24])) break;
    backward = step;
  }
  if (forward + backward + 1 >= 24) return null;

  const start = (seedIdx - backward + 24) % 24;
  const end = (seedIdx + forward + 1) % 24;
  return { start, end };
}

/** Hours in the circular window [start, end). */
function windowLength(start: number, end: number): number {
  return (end - start + 24) % 24 || 24;
}

function insideWindow(start: number, end: number): boolean[] {
  const len = windowLength(start, end);
  return Array.from({ length: 24 }, (_, h) => (h - start + 24) % 24 < len);
}

// A second run of hours, outside the window, about as cheap as it. Seeded
// at the cheapest such hour and grown with the same tolerance; it cannot
// reach the window, since the hours between were out of tolerance. Two
// disjoint cheap runs (cheap morning + cheap evening around an expensive
// midday) are common on aggregate data; naming only one of them let a
// single day of history swap which was shown.
function altWindow(
  medians: number[],
  inside: boolean[],
  minVal: number,
): { start: number; end: number } | null {
  let seed = -1;
  let seedVal = Infinity;
  medians.forEach((m, h) => {
    if (inside[h] || Number.isNaN(m) || m - minVal > EXPAND_TOLERANCE_EUR) return;
    if (m < seedVal) {
      seedVal = m;
      seed = h;
    }
  });
  if (seed < 0) return null;
  return expandHourWindow(medians, seed, minVal);
}

export function analyzeBestRefuel(
  data: HistoryPoint[],
  timeZone?: string,
): BestRefuelResult | null {
  if (!data || data.length < 2) return null;

  const now = Date.now();
  const span = now - data[0]!.time;
  if (span < 7 * DAY_MS) return { hasEnoughData: false };

  const chunks = walkChunks(data, now, zonedClock(timeZone));
  if (chunks.length === 0) return { hasEnoughData: false };

  // Per-week duration-weighted winsorise (p05/p95) → normalise as
  // (clipped_price − week_mean) → bucket entry weighted by
  // duration × recency-decay (14-day half-life).
  const hourBuckets: WeightedEntry[][] = Array.from({ length: 24 }, () => []);
  const weekdayEntries: WeekdayEntry[] = [];

  for (const { weekChunks, totalMs, p05, p95 } of winsorisedWeeks(chunks)) {
    let weightedSum = 0;
    for (const c of weekChunks) {
      weightedSum += clamp(c.price, p05, p95) * c.durationMs;
    }
    const weekMean = weightedSum / totalMs;

    for (const c of weekChunks) {
      const clipped = clamp(c.price, p05, p95);
      const recency = Math.pow(0.5, (now - c.t) / HALF_LIFE_MS);
      const value = clipped - weekMean;
      const weight = c.durationMs * recency;
      hourBuckets[c.hour]!.push({ value, weight });
      weekdayEntries.push({ value, weight, weekday: c.weekday, dayKey: c.dayKey });
    }
  }

  const hourPick = pickBest(hourBuckets);
  if (hourPick.bestIdx < 0) return { hasEnoughData: false };

  const window = expandHourWindow(hourPick.medians, hourPick.bestIdx, hourPick.minVal);
  if (!window) {
    return {
      hasEnoughData: true,
      hour: null,
      hour_end: null,
      alt_hour: null,
      alt_hour_end: null,
      weekday: null,
      confidence: null,
    };
  }
  const inside = insideWindow(window.start, window.end);
  const alt = altWindow(hourPick.medians, inside, hourPick.minVal);
  const covered = alt ? inside.map((a, h) => a || insideWindow(alt.start, alt.end)[h]!) : inside;

  // Confidence: sample size (span) and effect size (gap) are averaged, then
  // scaled by how reliably the window beat its day. Noise with no
  // time-of-day pattern sits at chance there and scores zero however large
  // its gap looks. The 0.75 / 0.5 level thresholds are a display choice.
  const spanDays = span / DAY_MS;
  const spanScore = Math.min(1, spanDays / 28);
  const gap = windowGapCents(hourPick.medians, inside) || 0;
  const gapScore = clamp(gap / GAP_REF_CENTS, 0, 1);
  const cons = consistency(chunks, covered);
  const consistencyScore =
    cons === null
      ? 0
      : clamp((cons - CONSISTENCY_CHANCE) / (CONSISTENCY_FULL - CONSISTENCY_CHANCE), 0, 1);
  const score = ((spanScore + gapScore) / 2) * consistencyScore;
  let level: Confidence = score >= 0.75 ? "high" : score >= 0.5 ? "medium" : "low";
  // A second run as cheap as the window: a single day of history can swap
  // which one is named, so the badge never claims High.
  if (alt && level === "high") level = "medium";

  return {
    hasEnoughData: true,
    hour: window.start,
    hour_end: window.end,
    alt_hour: alt ? alt.start : null,
    alt_hour_end: alt ? alt.end : null,
    weekday: weekdayIfSignificant(weekdayEntries),
    confidence: {
      level,
      score,
      span_days: Math.round(spanDays),
      // Rounded to 0.1¢ for display only; the level uses the raw values.
      gap_cents: Math.round(gap * 10) / 10,
      consistency_pct: Math.round((cons || 0) * 100),
    },
  };
}

// Per-hour price envelope across the analysable window. Returns absolute
// p10/p90 bounds per hour-of-day, suitable for drawing a band behind the
// 7-day sparkline. null when too sparse. Uses the same duration-weighted
// chunk walker as the recommendation so the band stays consistent with it.
export function buildHourlyEnvelope(
  allData: HistoryPoint[],
  timeZone?: string,
): HourlyEnvelope | null {
  if (!allData || allData.length < 2) return null;

  const now = Date.now();
  if (now - allData[0]!.time < 7 * DAY_MS) return null;

  const chunks = walkChunks(allData, now, zonedClock(timeZone));
  if (chunks.length === 0) return null;

  const byHour: WeightedEntry[][] = Array.from({ length: 24 }, () => []);
  for (const { weekChunks, p05, p95 } of winsorisedWeeks(chunks)) {
    for (const c of weekChunks) {
      byHour[c.hour]!.push({
        value: clamp(c.price, p05, p95),
        weight: c.durationMs,
      });
    }
  }

  const minByHour: Array<number | null> = Array.from({ length: 24 }, () => null);
  const maxByHour: Array<number | null> = Array.from({ length: 24 }, () => null);
  let filled = 0;
  for (let h = 0; h < 24; h++) {
    const bucket = byHour[h]!;
    if (bucket.length < MIN_BUCKET_COUNT) continue;
    // p10/p90 of already-clipped, duration-weighted chunks → middle 80% of
    // typical values at this hour.
    minByHour[h] = weightedPercentile(bucket, 0.1);
    maxByHour[h] = weightedPercentile(bucket, 0.9);
    filled++;
  }
  if (filled < 6) return null;
  return { minByHour, maxByHour };
}
