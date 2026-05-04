// Best-refuel-time analytics — bucketed by hour-of-day and weekday.
//
// Locality assumption: ``Date.getHours()`` and ``Date.getDay()`` return
// values in the *browser's* local timezone, not UTC. The recommendation
// is therefore framed in the user's clock ("Tuesday morning is typically
// cheapest"), which matches the UX intent for an Austrian fuel-price
// integration where every user is on Europe/Vienna in practice. A
// dashboard viewed from another timezone will see the analysis re-bucket
// to that timezone's clock — do NOT cache results across sessions or
// share them between users without re-running the analysis.
//
// Bucket population uses *duration-weighted chunks*, not hour-boundary
// samples. For each step-function price interval we split at every hour
// boundary it crosses and credit each (hour, weekday) bucket with the
// active price weighted by the milliseconds spent in that bucket. This
// removes the phase bias that hour-boundary sampling has when stations
// update mid-hour (e.g. the legal 12:00 hike that lands at 12:14): the
// 12:00 bucket now reflects ~14min × pre-hike + ~46min × post-hike
// instead of being attributed entirely to the pre-hike price.

import type { HistoryPoint } from "../history";
import type { HourlyEnvelope } from "../sparkline";
import type { WeightedEntry } from "../utils/math";
import { clamp, weightedPercentile } from "../utils/math";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const HALF_LIFE_MS = 14 * DAY_MS;

// Skip per-week aggregation when fewer than this many ms of observed time
// fell in the week — partial-week slivers at the edges of the window.
const MIN_WEEK_MS = DAY_MS;

export type Confidence = "high" | "medium" | "low";

export interface BestRefuelResult {
  hasEnoughData: boolean;
  hour?: number; // 0-23, start of recommended window
  hour_end?: number; // 0-23, exclusive end of recommended window (wraps past 23)
  weekday?: number | null; // 0-6 (Sun..Sat), only set when weekday signal is strong
  confidence?: {
    level: Confidence;
    score: number;
    span_days: number;
    coverage_pct: number;
    gap_cents: number;
  };
}

interface Chunk {
  price: number;
  t: number; // chunk start (epoch ms, local-clock-relevant)
  hour: number; // 0-23 in local time
  weekday: number; // 0-6 in local time
  weekKey: number; // Monday-aligned local-midnight epoch ms
  durationMs: number;
}

// Monday-aligned week key (midnight on the Monday of the week containing t).
function mondayKey(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.getTime();
}

// Walk every step-function price interval and emit one chunk per hour the
// interval crosses. The chunk's hour/weekday are determined by its *start*
// — since we always split at hour boundaries, that uniquely identifies the
// hour-of-day for the whole chunk's duration.
function walkChunks(data: HistoryPoint[], now: number): Chunk[] {
  const out: Chunk[] = [];
  const emit = (price: number, start: number, end: number): void => {
    if (end <= start) return;
    let cursor = start;
    while (cursor < end) {
      const nextHour = Math.floor(cursor / HOUR_MS) * HOUR_MS + HOUR_MS;
      const chunkEnd = Math.min(end, nextHour);
      const dt = new Date(cursor);
      out.push({
        price,
        t: cursor,
        hour: dt.getHours(),
        weekday: dt.getDay(),
        weekKey: mondayKey(cursor),
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

function groupByWeek(chunks: Chunk[]): Map<number, Chunk[]> {
  const weeks = new Map<number, Chunk[]>();
  for (const c of chunks) {
    const arr = weeks.get(c.weekKey);
    if (arr) arr.push(c);
    else weeks.set(c.weekKey, [c]);
  }
  return weeks;
}

interface BestPick {
  medians: number[];
  bestIdx: number;
  bestVal: number;
}

// Two bucket medians within this many EUR/L are treated as a tie. Kept very
// tight (well below any real station's hour-to-hour variation but well above
// float noise) so the daytime tiebreaker only kicks in for genuinely
// identical hours — e.g. a flat-overnight pattern where many hours produce
// bit-identical medians. A looser tolerance hijacks the seed away from the
// truly-cheapest hour and biases the recommended window toward daytime even
// when overnight is meaningfully cheaper.
const TIE_TOLERANCE_EUR = 0.0001;

// Adjacent hours within this many EUR/L (≈ 0.5¢) of the best hour are folded
// into the recommended window. Looser than the tiebreaker tolerance because
// "also a good time to refuel" is a softer bar than "essentially identical".
const EXPAND_TOLERANCE_EUR = 0.005;

// Cap on the recommended-window length. A window longer than this means
// the data has no real signal and a six-hour band is already past useful.
const MAX_WINDOW_HOURS = 6;

// Lower = more customer-friendly. Circular distance from 13:00 (early
// afternoon), so daytime hours score low and the small hours of the night
// score high. Used only to break near-ties between hour buckets.
function hourUnfriendliness(hour: number): number {
  const center = 13;
  const d = Math.abs(hour - center);
  return Math.min(d, 24 - d);
}

// Walk circularly from the seed hour in both directions, including any
// adjacent hour whose median is within EXPAND_TOLERANCE_EUR of the seed
// median. Caps total length at MAX_WINDOW_HOURS, trimming preferentially
// from whichever side has more slack.
function expandHourWindow(
  medians: number[],
  seedIdx: number,
  seedVal: number,
): { start: number; end: number } {
  let forward = 0;
  for (let step = 1; step <= 23; step++) {
    const i = (seedIdx + step) % 24;
    const m = medians[i];
    if (m === undefined || Number.isNaN(m)) break;
    if (m - seedVal > EXPAND_TOLERANCE_EUR) break;
    forward = step;
  }
  let backward = 0;
  for (let step = 1; step <= 23; step++) {
    const i = (seedIdx - step + 24) % 24;
    const m = medians[i];
    if (m === undefined || Number.isNaN(m)) break;
    if (m - seedVal > EXPAND_TOLERANCE_EUR) break;
    backward = step;
  }
  const total = 1 + forward + backward;
  if (total > MAX_WINDOW_HOURS) {
    const excess = total - MAX_WINDOW_HOURS;
    const trimFwd = Math.min(forward, Math.ceil(excess / 2));
    const trimBack = Math.min(backward, excess - trimFwd);
    forward -= trimFwd;
    backward -= trimBack;
  }
  const start = (seedIdx - backward + 24) % 24;
  const end = (seedIdx + forward + 1) % 24;
  return { start, end };
}

function pickBest(
  buckets: WeightedEntry[][],
  minCount: number,
  tiebreaker?: (idx: number) => number,
): BestPick {
  const medians = buckets.map((b) =>
    b.length >= minCount ? weightedPercentile(b, 0.5) : NaN,
  );
  let bestIdx = -1;
  let bestVal = Infinity;
  medians.forEach((m, i) => {
    if (!Number.isNaN(m) && m < bestVal) {
      bestVal = m;
      bestIdx = i;
    }
  });
  if (bestIdx < 0 || !tiebreaker) return { medians, bestIdx, bestVal };

  const minVal = bestVal;
  let bestTb = tiebreaker(bestIdx);
  medians.forEach((m, i) => {
    if (Number.isNaN(m) || m - minVal > TIE_TOLERANCE_EUR) return;
    const tb = tiebreaker(i);
    if (tb < bestTb) {
      bestTb = tb;
      bestIdx = i;
      bestVal = m;
    }
  });
  return { medians, bestIdx, bestVal };
}

function scoreSeparation(pick: BestPick, refCents: number): number {
  const valid = pick.medians
    .filter((m) => !Number.isNaN(m))
    .sort((a, b) => a - b);
  if (valid.length < 2 || pick.bestIdx < 0) return 0;
  const mid = valid[Math.floor((valid.length - 1) / 2)]!;
  const gapCents = (mid - pick.bestVal) * 100;
  return clamp(gapCents / refCents, 0, 1);
}

export function analyzeBestRefuel(data: HistoryPoint[]): BestRefuelResult | null {
  if (!data || data.length < 2) return null;

  const now = Date.now();
  const span = now - data[0]!.time;
  if (span < 7 * DAY_MS) return { hasEnoughData: false };

  const chunks = walkChunks(data, now);
  if (chunks.length === 0) return { hasEnoughData: false };

  const weeks = groupByWeek(chunks);

  // Per-week duration-weighted winsorise (p05/p95) → normalise as
  // (clipped_price − week_mean) → bucket entry weighted by
  // duration × recency-decay (14-day half-life).
  const hourBuckets: WeightedEntry[][] = Array.from({ length: 24 }, () => []);
  const weekdayBuckets: WeightedEntry[][] = Array.from({ length: 7 }, () => []);

  for (const weekChunks of weeks.values()) {
    let totalMs = 0;
    for (const c of weekChunks) totalMs += c.durationMs;
    if (totalMs < MIN_WEEK_MS) continue;

    const priceEntries: WeightedEntry[] = weekChunks.map((c) => ({
      value: c.price,
      weight: c.durationMs,
    }));
    const p05 = weightedPercentile(priceEntries, 0.05);
    const p95 = weightedPercentile(priceEntries, 0.95);

    let weightedSum = 0;
    for (const c of weekChunks) {
      weightedSum += clamp(c.price, p05, p95) * c.durationMs;
    }
    const weekMean = weightedSum / totalMs;

    for (const c of weekChunks) {
      const clipped = clamp(c.price, p05, p95);
      const recency = Math.pow(0.5, (now - c.t) / HALF_LIFE_MS);
      const entry: WeightedEntry = {
        value: clipped - weekMean,
        weight: c.durationMs * recency,
      };
      hourBuckets[c.hour]!.push(entry);
      weekdayBuckets[c.weekday]!.push(entry);
    }
  }

  const hourPick = pickBest(hourBuckets, 3, hourUnfriendliness);
  if (hourPick.bestIdx < 0) return { hasEnoughData: false };
  const weekdayPick = pickBest(weekdayBuckets, 3);

  // Confidence scoring: average of span, coverage, and separation.
  const spanDays = span / DAY_MS;
  const span_score = Math.min(1, spanDays / 28);

  const hourCoverage = hourBuckets.filter((b) => b.length >= 3).length / 24;
  const hourSep = scoreSeparation(hourPick, 1.5); // 1.5¢ gap = full confidence
  const validHour = hourPick.medians
    .filter((m) => !Number.isNaN(m))
    .sort((a, b) => a - b);
  const hourGapCents =
    validHour.length >= 2
      ? (validHour[Math.floor((validHour.length - 1) / 2)]! -
          hourPick.bestVal) *
        100
      : 0;
  const hourConfidence = (span_score + hourCoverage + hourSep) / 3;
  const hourLevel: Confidence =
    hourConfidence >= 0.75 ? "high" : hourConfidence >= 0.5 ? "medium" : "low";

  const weekdayCoverage =
    weekdayBuckets.filter((b) => b.length >= 3).length / 7;
  const weekdaySep = scoreSeparation(weekdayPick, 0.8);
  const weekdayConfidence =
    weekdayPick.bestIdx >= 0
      ? (span_score + weekdayCoverage + weekdaySep) / 3
      : 0;
  const showWeekday = weekdayConfidence >= 0.75;

  const window = expandHourWindow(
    hourPick.medians,
    hourPick.bestIdx,
    hourPick.bestVal,
  );

  return {
    hasEnoughData: true,
    hour: window.start,
    hour_end: window.end,
    weekday: showWeekday ? weekdayPick.bestIdx : null,
    confidence: {
      level: hourLevel,
      score: hourConfidence,
      span_days: Math.round(spanDays),
      coverage_pct: Math.round(hourCoverage * 100),
      gap_cents: Math.round(hourGapCents * 10) / 10,
    },
  };
}

// Per-hour price envelope across the analysable window. Returns absolute
// p10/p90 bounds per hour-of-day, suitable for drawing a band behind the
// 7-day sparkline. null when too sparse. Uses the same duration-weighted
// chunk walker as the recommendation so the band stays consistent with it.
export function buildHourlyEnvelope(
  allData: HistoryPoint[],
): HourlyEnvelope | null {
  if (!allData || allData.length < 2) return null;

  const now = Date.now();
  if (now - allData[0]!.time < 7 * DAY_MS) return null;

  const chunks = walkChunks(allData, now);
  if (chunks.length === 0) return null;

  const weeks = groupByWeek(chunks);

  const byHour: WeightedEntry[][] = Array.from({ length: 24 }, () => []);
  for (const weekChunks of weeks.values()) {
    let totalMs = 0;
    for (const c of weekChunks) totalMs += c.durationMs;
    if (totalMs < MIN_WEEK_MS) continue;

    const priceEntries: WeightedEntry[] = weekChunks.map((c) => ({
      value: c.price,
      weight: c.durationMs,
    }));
    const p05 = weightedPercentile(priceEntries, 0.05);
    const p95 = weightedPercentile(priceEntries, 0.95);

    for (const c of weekChunks) {
      byHour[c.hour]!.push({
        value: clamp(c.price, p05, p95),
        weight: c.durationMs,
      });
    }
  }

  const minByHour: Array<number | null> = new Array(24).fill(null);
  const maxByHour: Array<number | null> = new Array(24).fill(null);
  let filled = 0;
  for (let h = 0; h < 24; h++) {
    const bucket = byHour[h]!;
    if (bucket.length < 3) continue;
    // p10/p90 of already-clipped, duration-weighted chunks → middle 80% of
    // typical values at this hour.
    minByHour[h] = weightedPercentile(bucket, 0.1);
    maxByHour[h] = weightedPercentile(bucket, 0.9);
    filled++;
  }
  if (filled < 6) return null;
  return { minByHour, maxByHour };
}
