import type { HistoryPoint } from "../history";
import type { HourlyEnvelope } from "../sparkline";
import { clamp, percentile } from "../utils/math";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const HALF_LIFE_MS = 14 * DAY_MS;

export type Confidence = "high" | "medium" | "low";

export interface BestRefuelResult {
  hasEnoughData: boolean;
  hour?: number; // 0-23, the best hour of day
  weekday?: number | null; // 0-6 (Sun..Sat), only set when weekday signal is strong
  confidence?: {
    level: Confidence;
    score: number;
    span_days: number;
    coverage_pct: number;
    gap_cents: number;
  };
}

interface HourlySample {
  t: number;
  price: number;
}

interface Delta {
  t: number;
  delta: number;
  weight: number;
}

interface BucketEntry {
  value: number;
  weight: number;
}

// Monday-aligned week key (midnight on the Monday of the week containing t).
function mondayKey(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.getTime();
}

// Step-function hourly expansion — each price event stays active until the
// next. Emits one sample per hour boundary from the first event onwards.
function expandHourly(data: HistoryPoint[], now: number): HourlySample[] {
  const out: HourlySample[] = [];
  const add = (price: number, start: number, end: number): void => {
    const first = Math.ceil(start / HOUR_MS) * HOUR_MS;
    for (let t = first; t < end; t += HOUR_MS) out.push({ t, price });
  };
  for (let i = 0; i < data.length - 1; i++) {
    add(data[i]!.value, data[i]!.time, data[i + 1]!.time);
  }
  const last = data[data.length - 1]!;
  add(last.value, last.time, now);
  return out;
}

function groupByWeek(hourly: HourlySample[]): Map<number, HourlySample[]> {
  const weeks = new Map<number, HourlySample[]>();
  for (const s of hourly) {
    const wk = mondayKey(s.t);
    const bucket = weeks.get(wk);
    if (bucket) bucket.push(s);
    else weeks.set(wk, [s]);
  }
  return weeks;
}

function weightedMedianOfBucket(entries: BucketEntry[]): number {
  if (entries.length === 0) return NaN;
  const sorted = [...entries].sort((a, b) => a.value - b.value);
  const total = sorted.reduce((s, e) => s + e.weight, 0);
  let cumulative = 0;
  for (const e of sorted) {
    cumulative += e.weight;
    if (cumulative >= total / 2) return e.value;
  }
  return sorted[sorted.length - 1]!.value;
}

interface BestPick {
  medians: number[];
  bestIdx: number;
  bestVal: number;
}

function pickBest(buckets: BucketEntry[][], minCount: number): BestPick {
  const medians = buckets.map((b) =>
    b.length >= minCount ? weightedMedianOfBucket(b) : NaN,
  );
  let bestIdx = -1;
  let bestVal = Infinity;
  medians.forEach((m, i) => {
    if (!Number.isNaN(m) && m < bestVal) {
      bestVal = m;
      bestIdx = i;
    }
  });
  return { medians, bestIdx, bestVal };
}

function scoreSeparation(pick: BestPick, refCents: number): number {
  const valid = pick.medians
    .filter((m) => !Number.isNaN(m))
    .sort((a, b) => a - b);
  if (valid.length < 2 || pick.bestIdx < 0) return 0;
  const mid = percentile(valid, 0.5);
  const gapCents = (mid - pick.bestVal) * 100;
  return clamp(gapCents / refCents, 0, 1);
}

export function analyzeBestRefuel(data: HistoryPoint[]): BestRefuelResult | null {
  if (!data || data.length < 2) return null;

  const now = Date.now();
  const span = now - data[0]!.time;
  if (span < 7 * DAY_MS) return { hasEnoughData: false };

  const hourly = expandHourly(data, now);
  if (hourly.length === 0) return { hasEnoughData: false };

  const weeks = groupByWeek(hourly);

  // Per-week winsorise (p05/p95) → normalise as (price − week_mean)
  // → weight by recency (exponential decay, 14-day half-life).
  const deltas: Delta[] = [];
  for (const samples of weeks.values()) {
    if (samples.length < 24) continue; // skip partial-week slivers
    const sortedPrices = samples.map((s) => s.price).sort((a, b) => a - b);
    const p05 = percentile(sortedPrices, 0.05);
    const p95 = percentile(sortedPrices, 0.95);
    let sum = 0;
    const clipped = samples.map((s) => {
      const price = clamp(s.price, p05, p95);
      sum += price;
      return { t: s.t, price };
    });
    const mean = sum / clipped.length;
    for (const { t, price } of clipped) {
      deltas.push({
        t,
        delta: price - mean,
        weight: Math.pow(0.5, (now - t) / HALF_LIFE_MS),
      });
    }
  }
  if (deltas.length === 0) return { hasEnoughData: false };

  // Bucket deltas independently by hour-of-day and weekday.
  const hourBuckets: BucketEntry[][] = Array.from({ length: 24 }, () => []);
  const weekdayBuckets: BucketEntry[][] = Array.from({ length: 7 }, () => []);
  for (const { t, delta, weight } of deltas) {
    const dt = new Date(t);
    hourBuckets[dt.getHours()]!.push({ value: delta, weight });
    weekdayBuckets[dt.getDay()]!.push({ value: delta, weight });
  }

  const hourPick = pickBest(hourBuckets, 3);
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
      ? (percentile(validHour, 0.5) - hourPick.bestVal) * 100
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

  return {
    hasEnoughData: true,
    hour: hourPick.bestIdx,
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
// 7-day sparkline. null when too sparse.
export function buildHourlyEnvelope(
  allData: HistoryPoint[],
): HourlyEnvelope | null {
  if (!allData || allData.length < 2) return null;

  const now = Date.now();
  if (now - allData[0]!.time < 7 * DAY_MS) return null;

  const hourly = expandHourly(allData, now);
  if (hourly.length === 0) return null;

  const weeks = groupByWeek(hourly);

  const byHour: number[][] = Array.from({ length: 24 }, () => []);
  for (const samples of weeks.values()) {
    if (samples.length < 24) continue;
    const sorted = samples.map((s) => s.price).sort((a, b) => a - b);
    const p05 = percentile(sorted, 0.05);
    const p95 = percentile(sorted, 0.95);
    for (const s of samples) {
      const price = clamp(s.price, p05, p95);
      byHour[new Date(s.t).getHours()]!.push(price);
    }
  }

  const minByHour: Array<number | null> = new Array(24).fill(null);
  const maxByHour: Array<number | null> = new Array(24).fill(null);
  let filled = 0;
  for (let h = 0; h < 24; h++) {
    const bucket = byHour[h]!;
    if (bucket.length < 3) continue;
    const sorted = [...bucket].sort((a, b) => a - b);
    // p10/p90 of already-clipped samples → middle 80% of typical values at
    // this hour. Robust against sparse weeks.
    minByHour[h] = percentile(sorted, 0.1);
    maxByHour[h] = percentile(sorted, 0.9);
    filled++;
  }
  if (filled < 6) return null;
  return { minByHour, maxByHour };
}
