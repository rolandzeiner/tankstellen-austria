import { describe, expect, it } from "vitest";
import type { HistoryPoint } from "../history";
import { analyzeBestRefuel, buildHourlyEnvelope } from "./best-refuel";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const CHEAP = 1.5;
const EXPENSIVE = 1.6;

// Anchor the synthetic `now` to the most recent past Monday at midnight
// local time. With a 28-day fixture window this guarantees the data spans
// exactly four ISO weeks (Mon→Sun ×4) with no partial weeks at either
// edge — so MIN_WEEK_MS = 3 days never trims fixture data and the test
// produces the same buckets regardless of the day-of-week the suite runs.
function deterministicNow(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0=Sun, 1=Mon
  const daysBackToMonday = dow === 0 ? 6 : dow - 1;
  d.setDate(d.getDate() - daysBackToMonday);
  return d.getTime();
}

function buildHistory(
  days: number,
  now: number,
  patternForDayStart: (
    dayStart: number,
  ) => Array<{ offsetMs: number; price: number }>,
): HistoryPoint[] {
  const points: HistoryPoint[] = [];
  const startMidnight = new Date(now - days * DAY_MS);
  startMidnight.setHours(0, 0, 0, 0);
  for (let d = 0; d < days; d++) {
    const dayStart = startMidnight.getTime() + d * DAY_MS;
    for (const ev of patternForDayStart(dayStart)) {
      points.push({ time: dayStart + ev.offsetMs, value: ev.price });
    }
  }
  return points;
}

// Pattern: cheap from 00:00 until 12:HH, expensive from 12:HH until 23:00,
// cheap from 23:00 onwards. The minute offset of the hike is configurable.
function noonHikePattern(hikeMinute: number) {
  return (dayStart: number): Array<{ offsetMs: number; price: number }> => {
    void dayStart; // anchor only — offsets are within-day
    return [
      { offsetMs: 0, price: CHEAP },
      { offsetMs: 12 * HOUR_MS + hikeMinute * 60_000, price: EXPENSIVE },
      { offsetMs: 23 * HOUR_MS, price: CHEAP },
    ];
  };
}

describe("analyzeBestRefuel — duration-weighted bucketing", () => {
  it("recommends the full cheap zone (no length cap) with a 12:14 hike", () => {
    // Cheap zone: hours 0..11 and 23 (13 hours total, contiguous with wrap
    // around midnight). With no length cap, the algorithm should return
    // the entire 13-hour cheap zone — every truly-cheap hour included,
    // every expensive hour (12..22) excluded.
    const now = deterministicNow();
    const data = buildHistory(28, now, noonHikePattern(14));
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(true);

    const cheapHours = new Set([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23,
    ]);
    const start = result!.hour!;
    const end = result!.hour_end!;
    const span = ((end - start + 24) % 24) || 24;
    expect(span).toBe(13);
    for (let i = 0; i < span; i++) {
      const h = (start + i) % 24;
      expect(cheapHours.has(h)).toBe(true);
    }
  });

  it("excludes hour 12 with an on-the-hour hike too (sanity)", () => {
    const now = deterministicNow();
    const data = buildHistory(28, now, noonHikePattern(0));
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(true);
    const start = result!.hour!;
    const end = result!.hour_end!;
    const span = ((end - start + 24) % 24) || 24;
    for (let i = 0; i < span; i++) {
      expect((start + i) % 24).not.toBe(12);
    }
  });

  it("returns hasEnoughData=false for less than a week of data", () => {
    const now = deterministicNow();
    const data = buildHistory(3, now, noonHikePattern(0));
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(false);
  });

  it("recommends a 3-hour window when 11:00–14:00 is the cheap stretch", () => {
    const now = deterministicNow();
    const data = buildHistory(28, now, () => [
      { offsetMs: 0, price: EXPENSIVE },
      { offsetMs: 11 * HOUR_MS, price: CHEAP },
      { offsetMs: 14 * HOUR_MS, price: EXPENSIVE },
    ]);
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(true);
    expect(result?.hour).toBe(11);
    expect(result?.hour_end).toBe(14);
  });
});

describe("buildHourlyEnvelope — duration-weighted band", () => {
  it("widens the band only at the transition hour", () => {
    const now = deterministicNow();
    const data = buildHistory(28, now, noonHikePattern(14));
    const env = buildHourlyEnvelope(data);
    expect(env).not.toBeNull();
    // Hour 12 straddles the hike → band spans CHEAP → EXPENSIVE.
    expect(env!.minByHour[12]).toBeCloseTo(CHEAP, 5);
    expect(env!.maxByHour[12]).toBeCloseTo(EXPENSIVE, 5);
    // Hour 11 is fully CHEAP — band collapses to a point.
    expect(env!.minByHour[11]).toBeCloseTo(CHEAP, 5);
    expect(env!.maxByHour[11]).toBeCloseTo(CHEAP, 5);
    // Hour 14 is fully EXPENSIVE.
    expect(env!.minByHour[14]).toBeCloseTo(EXPENSIVE, 5);
    expect(env!.maxByHour[14]).toBeCloseTo(EXPENSIVE, 5);
  });
});
