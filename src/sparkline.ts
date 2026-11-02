// The 7-day price chart's geometry, with no DOM in it. `computeSparkline`
// turns history points and overlays into SVG path strings and positions in
// a fixed viewBox; `<tankstellen-austria-sparkline>` (sparkline-element.ts)
// renders them. Everything here is a pure function of its input and `now`,
// which is what lets the element compute it once per data change rather
// than once per render.
//
// Prices are a step function: a price holds until the next change, so the
// line is drawn as steps (`H` then `V`), not as a curve that would show a
// drift that never happened. The x axis is proportional to time, so a flat
// weekend takes two days of width whatever the number of samples in it.

import type { BestRefuelResult, HourlyEnvelope } from "./analytics/best-refuel";
import type { HistoryPoint } from "./history";
import { monotoneRibbonPath, type Point } from "./utils/math";
import { DAY_MS, HOUR_MS, zonedClock, type ZonedClock } from "./utils/tz";

export interface MedianDelta {
  key: "median_delta_below" | "median_delta_above" | "median_delta_equal";
  cents: string; // already formatted as "1.2" etc.
  cls: "median-delta-good" | "median-delta-bad" | "median-delta-neutral";
}

export interface SparklineInput {
  points: HistoryPoint[]; // all history for the entity; the last 7 days are drawn
  showMedianLine: boolean;
  showHourEnvelope: boolean;
  showNoonMarkers: boolean;
  hourEnvelope?: HourlyEnvelope | null;
  // Best-refuel analysis output. When confident, the most recent past
  // occurrence of its window is drawn as a band.
  analysis?: BestRefuelResult | null;
  // IANA zone the noon markers, the band and the envelope's hours use.
  timeZone: string;
  now?: number; // epoch ms; tests pin it
}

/** A price change the hover can land on. `time` is when the price took
 *  effect; `x` is where that is on the axis, clamped to the left edge for
 *  the change that was already in force when the window starts. */
export interface HoverPoint {
  time: number;
  value: number;
  x: number;
  y: number;
}

export interface SparklineModel {
  width: number;
  height: number;
  linePath: string;
  areaPath: string;
  envelopePath: string | null;
  noonXs: number[];
  medianY: number | null;
  bands: Array<{ x1: number; x2: number }>;
  hoverPoints: HoverPoint[];
  // The drawn 7-day line's own figures; the labels describe these even when
  // the envelope band widened the y axis.
  min: number;
  max: number;
  median: number;
  medianDelta: MedianDelta | null;
}

export const WIDTH = 280;
export const HEIGHT = 48;
const PAD_Y = 4;
const SEVEN_DAYS_MS = 7 * DAY_MS;

const f = (n: number): string => n.toFixed(2);

// Anchor the left edge with the most recent pre-window sample, keeping its
// real time (the hover says when the price took effect) but drawing it at
// the cutoff, so a price that last changed before the window still shows
// as in force from the first pixel. Both the window and the axis span
// exactly the 7 days before `now`.
export function sliceLast7Days(all: HistoryPoint[], now: number): HistoryPoint[] {
  const cutoff = now - SEVEN_DAYS_MS;
  const inside = all.filter((d) => d.time >= cutoff && d.time <= now);
  let lastKnown: HistoryPoint | null = null;
  for (const d of all) {
    if (d.time < cutoff) lastKnown = d;
    else break;
  }
  return lastKnown ? [lastKnown, ...inside] : inside;
}

/** Whether `points` give a chart at all. The card uses it to decide whether
 *  to render the chart block, before the element computes the geometry. */
export function hasSparklineData(points: HistoryPoint[], now = Date.now()): boolean {
  if (!points || points.length < 2) return false;
  return sliceLast7Days(points, now).length >= 2;
}

function median(values: number[]): number {
  const sorted = [...values];
  sorted.sort((a, b) => a - b);
  const mid = (sorted.length - 1) / 2;
  return (sorted[Math.floor(mid)]! + sorted[Math.ceil(mid)]!) / 2;
}

function medianDelta(current: number, med: number): MedianDelta {
  const deltaCents = (current - med) * 100;
  const cents = Math.abs(deltaCents).toFixed(1);
  if (deltaCents <= -0.05) return { key: "median_delta_below", cents, cls: "median-delta-good" };
  if (deltaCents >= 0.05) return { key: "median_delta_above", cents, cls: "median-delta-bad" };
  return { key: "median_delta_equal", cents, cls: "median-delta-neutral" };
}

// `M x0 y0 H x1 V y1 …`: each price holds until the next change.
function stepPath(pts: readonly Point[]): string {
  const first = pts[0];
  if (!first) return "";
  let d = `M ${f(first.x)} ${f(first.y)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]!;
    d += ` H ${f(p.x)}`;
    if (p.y !== pts[i - 1]!.y) d += ` V ${f(p.y)}`;
  }
  return d;
}

// The most recent past occurrence of a window starting at `hour`, in the
// chart's zone. Today's window counts once it has started; before that,
// yesterday's. The weekday is a statement about whole days and does not
// move the band.
function lastOccurrence(
  hour: number,
  hourEnd: number | null | undefined,
  now: number,
  clock: ZonedClock,
): { startMs: number; endMs: number } {
  const at = clock.parts(now);
  const day = at.hour < hour ? clock.shiftDays(now, 1) : now;
  const startMs = clock.atHour(day, hour);
  // hour_end is the exclusive end of the window (0-23). Defaults to a
  // single-hour window when older results without hour_end show up.
  const end = hourEnd ?? (hour + 1) % 24;
  const spanHours = (end - hour + 24) % 24 || 1;
  return { startMs, endMs: startMs + spanHours * HOUR_MS };
}

// The recommended window and, when the analysis names one, the second run
// of hours that is about as cheap.
function recommendationWindows(
  analysis: BestRefuelResult | null | undefined,
  now: number,
  timeZone: string,
): Array<{ startMs: number; endMs: number }> {
  if (!analysis?.hasEnoughData || analysis.hour == null) return [];
  const clock = zonedClock(timeZone);
  const out = [lastOccurrence(analysis.hour, analysis.hour_end, now, clock)];
  if (analysis.alt_hour != null) {
    out.push(lastOccurrence(analysis.alt_hour, analysis.alt_hour_end, now, clock));
  }
  return out;
}

export function computeSparkline(input: SparklineInput): SparklineModel | null {
  const now = input.now ?? Date.now();
  const data = sliceLast7Days(input.points ?? [], now);
  if (data.length < 2) return null;

  const tStart = now - SEVEN_DAYS_MS;
  const tEnd = now;
  const xForTime = (t: number): number => ((t - tStart) / SEVEN_DAYS_MS) * WIDTH;
  const clampX = (x: number): number => Math.max(0, Math.min(WIDTH, x));

  const values = data.map((d) => d.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const med = median(values);

  // The y axis covers the line and, when drawn, the envelope band.
  let min = dataMin;
  let max = dataMax;
  const envelope = input.showHourEnvelope ? (input.hourEnvelope ?? null) : null;
  if (envelope) {
    for (let h = 0; h < 24; h++) {
      const lo = envelope.minByHour[h];
      const hi = envelope.maxByHour[h];
      if (lo != null && hi != null) {
        min = Math.min(min, lo);
        max = Math.max(max, hi);
      }
    }
  }
  const range = max - min || 0.01;
  const priceToY = (p: number): number =>
    HEIGHT - PAD_Y - ((p - min) / range) * (HEIGHT - 2 * PAD_Y);

  const hoverPoints: HoverPoint[] = data.map((d) => ({
    time: d.time,
    value: d.value,
    x: +clampX(xForTime(d.time)).toFixed(1),
    y: +priceToY(d.value).toFixed(1),
  }));

  // The last price is in force until now, so the step runs to the right
  // edge; that end is drawn, not a change the hover could land on.
  const linePts: Point[] = hoverPoints.map((p) => ({ x: p.x, y: p.y }));
  const last = linePts[linePts.length - 1]!;
  if (last.x < WIDTH) linePts.push({ x: WIDTH, y: last.y });
  const linePath = stepPath(linePts);
  const areaPath = `${linePath} V ${f(HEIGHT)} H 0 Z`;

  // Hourly envelope band: the typical range at each hour of the day,
  // sampled at every hour boundary in the window so the band's shape does
  // not depend on how many price changes a day had.
  let envelopePath: string | null = null;
  if (envelope) {
    const clock = zonedClock(input.timeZone);
    const upper: Point[] = [];
    const lower: Point[] = [];
    const sample = (t: number): void => {
      const h = clock.parts(t).hour;
      const hi = envelope.maxByHour[h];
      const lo = envelope.minByHour[h];
      if (hi == null || lo == null) return;
      const x = xForTime(t);
      upper.push({ x, y: priceToY(hi) });
      lower.push({ x, y: priceToY(lo) });
    };
    sample(tStart);
    for (let t = Math.ceil(tStart / HOUR_MS) * HOUR_MS; t < tEnd; t += HOUR_MS) sample(t);
    sample(tEnd);
    if (upper.length >= 2) envelopePath = monotoneRibbonPath(upper, lower) || null;
  }

  // Noon markers: one per local 12:00 inside the window. Each is derived
  // from the day's midnight in the chart's zone, so DST days (23 or 25
  // hours long) keep their marker at 12:00 instead of drifting an hour.
  const noonXs: number[] = [];
  if (input.showNoonMarkers) {
    const clock = zonedClock(input.timeZone);
    for (let day = clock.startOfDay(tStart); day <= tEnd; day = clock.shiftDays(day, -1)) {
      const noon = clock.atHour(day, 12);
      if (noon > tStart && noon < tEnd) noonXs.push(+xForTime(noon).toFixed(1));
    }
  }

  const bands: SparklineModel["bands"] = [];
  for (const window of recommendationWindows(input.analysis, now, input.timeZone)) {
    const x1 = clampX(xForTime(window.startMs));
    const x2 = clampX(xForTime(window.endMs));
    if (x2 > x1) bands.push({ x1: +x1.toFixed(1), x2: +x2.toFixed(1) });
  }

  return {
    width: WIDTH,
    height: HEIGHT,
    linePath,
    areaPath,
    envelopePath,
    noonXs,
    medianY: input.showMedianLine ? +priceToY(med).toFixed(1) : null,
    bands,
    hoverPoints,
    min: dataMin,
    max: dataMax,
    median: med,
    medianDelta: input.showMedianLine ? medianDelta(values[values.length - 1]!, med) : null,
  };
}

/** The price in force at axis position x: the last change at or before it. */
export function hoverPointAt(model: SparklineModel, x: number): HoverPoint | null {
  const pts = model.hoverPoints;
  if (!pts.length) return null;
  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (pts[mid]!.x <= x) lo = mid;
    else hi = mid - 1;
  }
  return pts[lo]!;
}
