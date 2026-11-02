import { afterAll, beforeAll, describe, expect, it, vi } from "vite-plus/test";
import type { HistoryPoint } from "../history";
import { analyzeBestRefuel, buildHourlyEnvelope } from "./best-refuel";

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const CHEAP = 1.5;
const EXPENSIVE = 1.6;

// Anchor the synthetic `now` to a fixed Monday at midnight local time.
// With a 28-day fixture window this guarantees the data spans exactly four
// ISO weeks (Mon→Sun ×4) with no partial weeks at either edge — so
// MIN_WEEK_MS = 3 days never trims fixture data. A fixed date rather than
// "the most recent Monday": the fixtures place the hike at local-time
// offsets from midnight, so a window that straddles a DST change puts the
// transition into a different hour for part of the data and the envelope
// band widens where the test expects a point (seen on 2026-11-02, with
// the 2026-10-25 change inside the window). 1 June 2026 is a Monday with
// no DST change in the 28 days before it.
function deterministicNow(): number {
  return new Date(2026, 5, 1, 0, 0, 0, 0).getTime();
}

// Pin Date.now() to the fixture anchor for the whole file. analyzeBestRefuel
// and buildHourlyEnvelope both call walkChunks(data, Date.now()), and walk-
// Chunks emits a trailing segment from the last data point to that `now`.
// Without this pin, the trailing CHEAP segment at 23:00 of the last fixture
// day extends through real-clock days that follow the deterministic anchor —
// leaking CHEAP price-chunks into every hour after 23 (1, 2, … up to 22 if
// the suite runs late enough in the week). The hourly-envelope test then
// sees CHEAP samples in hour 14 and `minByHour[14]` collapses to CHEAP.
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(deterministicNow()));
});
afterAll(() => {
  vi.useRealTimers();
});

function buildHistory(
  days: number,
  now: number,
  patternForDayStart: (dayStart: number) => Array<{ offsetMs: number; price: number }>,
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

    const cheapHours = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 23]);
    const start = result!.hour!;
    const end = result!.hour_end!;
    const span = (end - start + 24) % 24 || 24;
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
    const span = (end - start + 24) % 24 || 24;
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

  it("names the second cluster when two disjoint cheap zones exist", () => {
    // Cheap morning (03:00–06:00) and cheap evening (21:00–23:00),
    // separated by an expensive midday/afternoon. Both clusters share
    // the same minimum delta-from-mean, so the seed = first absolute
    // minimum in iteration order = hour 3. The evening cluster is about
    // as cheap, so it is returned as the second window and the badge is
    // capped at Medium: a single day of history could swap the two.
    const now = deterministicNow();
    const data = buildHistory(28, now, () => [
      { offsetMs: 0, price: EXPENSIVE },
      { offsetMs: 3 * HOUR_MS, price: CHEAP },
      { offsetMs: 6 * HOUR_MS, price: EXPENSIVE },
      { offsetMs: 21 * HOUR_MS, price: CHEAP },
      { offsetMs: 23 * HOUR_MS, price: EXPENSIVE },
    ]);
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(true);
    expect(result?.hour).toBe(3);
    expect(result?.hour_end).toBe(6);
    expect(result?.alt_hour).toBe(21);
    expect(result?.alt_hour_end).toBe(23);
    expect(result?.confidence?.level).toBe("medium");
  });

  it("recommends nothing when every hour is within tolerance of the cheapest", () => {
    // A price that never moves has no cheap time of day. The two walks
    // used to meet and report a 23-hour window missing the seed hour.
    const now = deterministicNow();
    const data = buildHistory(28, now, () => [{ offsetMs: 0, price: CHEAP }]);
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(true);
    expect(result?.hour).toBeNull();
    expect(result?.hour_end).toBeNull();
    expect(result?.alt_hour).toBeNull();
    expect(result?.weekday).toBeNull();
    expect(result?.confidence).toBeNull();
  });

  it("returns a wrap-around window when the cheap zone crosses midnight", () => {
    // Cheap from 22:00 to next-day 04:00 (6 hours, wraps midnight).
    // Expensive 04:00–22:00. Seed = hour 0 (first absolute minimum in
    // iteration order). Expansion walks both directions across the
    // wrap. Result: hour > hour_end, signalling a wrap-around window.
    const now = deterministicNow();
    const data = buildHistory(28, now, () => [
      { offsetMs: 0, price: CHEAP },
      { offsetMs: 4 * HOUR_MS, price: EXPENSIVE },
      { offsetMs: 22 * HOUR_MS, price: CHEAP },
    ]);
    const result = analyzeBestRefuel(data);
    expect(result?.hasEnoughData).toBe(true);
    const start = result!.hour!;
    const end = result!.hour_end!;
    expect(start).toBeGreaterThan(end); // confirms the wrap
    expect(start).toBe(22);
    expect(end).toBe(4);
  });
});

// Deterministic pseudo-noise for the confidence tests: the same series on
// every run, with no hour-of-day or weekday structure.
function lcg(seed: number): () => number {
  let x = seed >>> 0;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}

describe("analyzeBestRefuel — confidence", () => {
  it("is High for a pattern that holds every day", () => {
    const now = deterministicNow();
    const result = analyzeBestRefuel(buildHistory(28, now, noonHikePattern(0)));
    expect(result?.confidence?.level).toBe("high");
    expect(result?.confidence?.gap_cents).toBeCloseTo(10, 0);
    expect(result?.confidence?.consistency_pct).toBe(100);
  });

  it("is Low for noise, however large its gap looks", () => {
    const now = deterministicNow();
    const rnd = lcg(7);
    // A fresh price every 30 minutes, 2 ct standard deviation, no pattern.
    const points: HistoryPoint[] = [];
    for (let t = now - 28 * DAY_MS; t < now; t += 30 * 60_000) {
      const u = rnd();
      const v = rnd();
      const gauss = Math.sqrt(-2 * Math.log(u || 1e-12)) * Math.cos(2 * Math.PI * v);
      points.push({ time: t, value: 1.5 + 0.02 * gauss });
    }
    const result = analyzeBestRefuel(points);
    expect(result?.hasEnoughData).toBe(true);
    expect(result?.hour).not.toBeNull();
    expect(result?.confidence?.level).toBe("low");
    // The window beat its day about as often as a coin toss would.
    expect(result?.confidence?.consistency_pct).toBeLessThan(70);
    expect(result?.weekday).toBeNull();
  });

  it("grows with the span of history", () => {
    const now = deterministicNow();
    const ten = analyzeBestRefuel(buildHistory(10, now, noonHikePattern(0)));
    const full = analyzeBestRefuel(buildHistory(28, now, noonHikePattern(0)));
    expect(ten!.confidence!.score).toBeLessThan(full!.confidence!.score);
    expect(ten?.confidence?.level).toBe("medium");
  });
});

describe("analyzeBestRefuel — day facts", () => {
  it("counts the noon rise and ranks today's price", () => {
    const now = deterministicNow();
    const result = analyzeBestRefuel(buildHistory(28, now, noonHikePattern(0)));
    expect(result?.facts).toEqual({
      daily_range_cents: 10,
      noon_days: 28,
      noon_rise_days: 28,
      noon_rise_cents: 10,
      // The current price is the cheap one; the dear price held 11 of 24 hours.
      cheaper_than_pct: 46,
      dearer_than_pct: 0,
    });
  });

  it("reports a flat series as a zero range with no noon rise", () => {
    const now = deterministicNow();
    const result = analyzeBestRefuel(buildHistory(28, now, () => [{ offsetMs: 0, price: CHEAP }]));
    expect(result?.hour).toBeNull();
    expect(result?.facts).toEqual({
      daily_range_cents: 0,
      noon_days: 28,
      noon_rise_days: 0,
      noon_rise_cents: 0,
      cheaper_than_pct: 0,
      dearer_than_pct: 0,
    });
  });
});

describe("analyzeBestRefuel — weekday", () => {
  // Real days never tie exactly, so every day gets its own level within
  // ±0.5 ct. Without it the weighted medians tie on the bit and the test
  // is conservative, which is the right failure mode but not this case.
  const withTuesdays = (discount: number) => {
    const rnd = lcg(3);
    return (dayStart: number) => {
      const off = (new Date(dayStart).getDay() === 2 ? discount : 0) - (rnd() - 0.5) * 0.01;
      return [
        { offsetMs: 0, price: CHEAP - off },
        { offsetMs: 12 * HOUR_MS, price: EXPENSIVE - off },
      ];
    };
  };

  it("names a weekday whose lead survives the permutation test", () => {
    const now = deterministicNow();
    const result = analyzeBestRefuel(buildHistory(28, now, withTuesdays(0.05)));
    expect(result?.weekday).toBe(2);
  });

  it("uses history older than four weeks for the weekday only", () => {
    const now = deterministicNow();
    const rnd = lcg(5);
    const result = analyzeBestRefuel(
      buildHistory(84, now, (dayStart) => {
        const off = (new Date(dayStart).getDay() === 2 ? 0.02 : 0) - (rnd() - 0.5) * 0.01;
        return [
          { offsetMs: 0, price: CHEAP - off },
          { offsetMs: 12 * HOUR_MS, price: EXPENSIVE - off },
        ];
      }),
    );
    expect(result?.confidence?.span_days).toBe(28);
    expect(result?.facts?.noon_days).toBe(28);
    expect(result?.weekday).toBe(2);
  });

  it("names no weekday when the days only differ by noise", () => {
    const now = deterministicNow();
    const rnd = lcg(11);
    const result = analyzeBestRefuel(
      buildHistory(28, now, () => {
        const level = (rnd() - 0.5) * 0.02;
        return [
          { offsetMs: 0, price: CHEAP + level },
          { offsetMs: 12 * HOUR_MS, price: EXPENSIVE + level },
        ];
      }),
    );
    expect(result?.hour).toBe(0);
    expect(result?.weekday).toBeNull();
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
