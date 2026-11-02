import { describe, expect, it } from "vite-plus/test";

import type { BestRefuelResult } from "./analytics/best-refuel";
import type { HistoryPoint } from "./history";
import { HEIGHT, WIDTH, computeSparkline, hasSparklineData, hoverPointAt } from "./sparkline";
import { DAY_MS, HOUR_MS } from "./utils/tz";

// Fri 2026-10-30 12:00 CET, so the window is Fri 23 Oct 12:00 → Fri 30 Oct
// 12:00 and includes the DST change on Sunday 25 Oct.
const NOW = Date.UTC(2026, 9, 30, 11);
const TZ = "Europe/Vienna";

const base = {
  showMedianLine: false,
  showHourEnvelope: false,
  showNoonMarkers: false,
  timeZone: TZ,
  now: NOW,
};

// One price change per day at local noon, plus one change before the window.
function dailyNoonChanges(): HistoryPoint[] {
  const points: HistoryPoint[] = [{ time: NOW - 9 * DAY_MS, value: 1.5 }];
  for (let d = 6; d >= 1; d--) points.push({ time: NOW - d * DAY_MS, value: 1.5 + d * 0.01 });
  return points;
}

describe("computeSparkline", () => {
  it("needs two points inside the window", () => {
    expect(hasSparklineData([], NOW)).toBe(false);
    expect(hasSparklineData([{ time: NOW - DAY_MS, value: 1.5 }], NOW)).toBe(false);
    expect(
      computeSparkline({ ...base, points: [{ time: NOW - 30 * DAY_MS, value: 1.5 }] }),
    ).toBeNull();
    expect(hasSparklineData(dailyNoonChanges(), NOW)).toBe(true);
  });

  it("places points by time, not by index", () => {
    // Three changes in the first hour and one on the last day: the sparse
    // part still takes most of the width.
    const points: HistoryPoint[] = [
      { time: NOW - 7 * DAY_MS, value: 1.5 },
      { time: NOW - 7 * DAY_MS + 20 * 60_000, value: 1.51 },
      { time: NOW - 7 * DAY_MS + 40 * 60_000, value: 1.52 },
      { time: NOW - DAY_MS, value: 1.49 },
    ];
    const m = computeSparkline({ ...base, points })!;
    const xs = m.hoverPoints.map((p) => p.x);
    expect(xs[0]).toBe(0);
    expect(xs[3]).toBeCloseTo((6 / 7) * WIDTH, 0);
    expect(xs[2]! - xs[0]!).toBeLessThan(2);
  });

  it("draws a step line that runs to the right edge, closed as an area", () => {
    const m = computeSparkline({ ...base, points: dailyNoonChanges() })!;
    expect(m.linePath.startsWith("M 0.00")).toBe(true);
    expect(m.linePath).toMatch(/^M [\d.]+ [\d.]+( H [\d.]+( V [\d.]+)?)+$/);
    expect(m.linePath.endsWith(`H ${WIDTH.toFixed(2)}`)).toBe(true);
    expect(m.areaPath).toBe(`${m.linePath} V ${HEIGHT.toFixed(2)} H 0 Z`);
    // The anchor before the window is drawn at x = 0 but keeps its time.
    expect(m.hoverPoints[0]).toMatchObject({ x: 0, time: NOW - 9 * DAY_MS, value: 1.5 });
  });

  it("describes the drawn line in min, max and median", () => {
    const m = computeSparkline({ ...base, points: dailyNoonChanges(), showMedianLine: true })!;
    expect(m.min).toBeCloseTo(1.5);
    expect(m.max).toBeCloseTo(1.56);
    expect(m.medianDelta).toMatchObject({ key: "median_delta_below", cls: "median-delta-good" });
    expect(m.medianY).not.toBeNull();
    const plain = computeSparkline({ ...base, points: dailyNoonChanges() })!;
    expect(plain.medianY).toBeNull();
    expect(plain.medianDelta).toBeNull();
  });

  it("puts a noon marker at local 12:00 of every full day, through the DST change", () => {
    const m = computeSparkline({ ...base, points: dailyNoonChanges(), showNoonMarkers: true })!;
    // Sat 24 … Thu 29: six noons strictly inside the window.
    expect(m.noonXs).toHaveLength(6);
    // A day is 1/7 of the width, except that the clocks go back at 03:00 on
    // Sunday 25 Oct: Saturday noon to Sunday noon is 25 hours, one hour wider.
    const gaps = m.noonXs.slice(1).map((x, i) => x - m.noonXs[i]!);
    const day = WIDTH / 7;
    const hour = (HOUR_MS / (7 * DAY_MS)) * WIDTH;
    expect(gaps[0]).toBeCloseTo(day + hour, 0);
    for (const g of gaps.slice(1)) expect(g).toBeCloseTo(day, 0);
  });

  it("samples the hour envelope at every hour of the window", () => {
    const minByHour = Array.from({ length: 24 }, (_, h) => 1.4 + h * 0.001);
    const maxByHour = minByHour.map((v) => v + 0.1);
    const m = computeSparkline({
      ...base,
      points: dailyNoonChanges(),
      showHourEnvelope: true,
      hourEnvelope: { minByHour, maxByHour },
    })!;
    expect(m.envelopePath).toMatch(/^M .* Z$/);
    // 169 hour boundaries plus the two edges: a cubic segment per step.
    expect(m.envelopePath!.split(" C ").length).toBeGreaterThan(300);
    // The band widened the y axis: the line's own min is above the bottom.
    expect(m.min).toBeCloseTo(1.5);
  });

  it("draws the recommended window as a band in the chart's zone", () => {
    const analysis: BestRefuelResult = { hasEnoughData: true, hour: 10, hour_end: 12 };
    const m = computeSparkline({ ...base, points: dailyNoonChanges(), analysis })!;
    // Today's 10:00–12:00 CET has started: the band ends at the right edge.
    expect(m.bands).toEqual([
      {
        x1: +(((7 * DAY_MS - 2 * HOUR_MS) / (7 * DAY_MS)) * WIDTH).toFixed(1),
        x2: WIDTH,
      },
    ]);
    // Before 10:00 the latest occurrence was yesterday's.
    const early = computeSparkline({
      ...base,
      points: dailyNoonChanges(),
      analysis,
      now: NOW - 3 * HOUR_MS,
    })!;
    expect(early.bands[0]!.x2).toBeLessThan(WIDTH - 20);
    // The weekday is a statement about whole days and does not move the band.
    const tue = computeSparkline({
      ...base,
      points: dailyNoonChanges(),
      analysis: { ...analysis, weekday: 2 },
    })!;
    expect(tue.bands).toEqual(m.bands);
    // A second window gets its own band.
    const two = computeSparkline({
      ...base,
      points: dailyNoonChanges(),
      analysis: { ...analysis, alt_hour: 20, alt_hour_end: 23 },
    })!;
    expect(two.bands).toHaveLength(2);
    expect(two.bands[1]!.x2).toBeLessThan(two.bands[0]!.x1);
    expect(
      computeSparkline({ ...base, points: dailyNoonChanges(), analysis: { hasEnoughData: false } })!
        .bands,
    ).toEqual([]);
    // Enough data but no window: nothing to draw.
    expect(
      computeSparkline({
        ...base,
        points: dailyNoonChanges(),
        analysis: { hasEnoughData: true, hour: null },
      })!.bands,
    ).toEqual([]);
  });

  it("hover resolves to the price in force at x", () => {
    const m = computeSparkline({ ...base, points: dailyNoonChanges() })!;
    expect(hoverPointAt(m, 0)).toBe(m.hoverPoints[0]);
    expect(hoverPointAt(m, WIDTH)).toBe(m.hoverPoints[m.hoverPoints.length - 1]);
    // Halfway between the first two changes the earlier price holds.
    const mid = (m.hoverPoints[1]!.x + m.hoverPoints[2]!.x) / 2;
    expect(hoverPointAt(m, mid)).toBe(m.hoverPoints[1]);
  });
});
