import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { fetchHistory, mergeStatistics } from "./history";
import type { HomeAssistant } from "./types";

const HOUR = 3_600_000;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("mergeStatistics", () => {
  // Same numbers as test_merge_statistics_fills_only_before_the_oldest_state
  // in tests/test_refuel.py: the card and the integration merge alike.
  it("fills only the hours before the oldest state", () => {
    const states = [
      { time: 10 * HOUR, value: 1.55 },
      { time: 12 * HOUR, value: 1.5 },
    ];
    const means = [
      { time: 8 * HOUR, value: 1.6 },
      { time: 9 * HOUR, value: 1.58 },
      { time: 10 * HOUR, value: 1.57 },
      { time: 11 * HOUR, value: 1.56 },
    ];
    expect(mergeStatistics(states, means)).toEqual([
      { time: 8 * HOUR, value: 1.6 },
      { time: 9 * HOUR, value: 1.58 },
      { time: 10 * HOUR, value: 1.55 },
      { time: 12 * HOUR, value: 1.5 },
    ]);
    expect(mergeStatistics([], means)).toEqual(means);
  });
});

describe("fetchHistory", () => {
  const now = Date.now();
  const states = [{ lu: (now - 2 * HOUR) / 1000, s: "1.539" }];

  function hass(entityId: string, stateClass: string | undefined, statistics: () => unknown) {
    const callWS = vi.fn(async (msg: { type: string }) =>
      msg.type === "history/history_during_period" ? { [entityId]: states } : statistics(),
    );
    const h = {
      callWS,
      states: { [entityId]: { attributes: stateClass ? { state_class: stateClass } : {} } },
    } as unknown as HomeAssistant;
    return { h, callWS };
  }

  const types = (callWS: ReturnType<typeof vi.fn>) =>
    callWS.mock.calls.map((c) => (c[0] as { type: string }).type);

  it("adds the hourly means of a sensor with statistics", async () => {
    const id = "sensor.with_statistics";
    const { h, callWS } = hass(id, "measurement", () => ({
      [id]: [
        { start: now - 30 * HOUR, mean: 1.6 },
        { start: new Date(now - 29 * HOUR).toISOString(), mean: 1.59 },
        { start: now - 28 * HOUR, mean: null },
      ],
    }));
    const points = await fetchHistory(h, id);
    expect(types(callWS)).toEqual([
      "history/history_during_period",
      "recorder/statistics_during_period",
    ]);
    expect(callWS.mock.calls[1]?.[0]).toMatchObject({
      statistic_ids: [id],
      period: "hour",
      types: ["mean"],
    });
    expect(points.map((p) => p.value)).toEqual([1.6, 1.59, 1.539]);
  });

  it("reads twelve weeks with statistics and four weeks without", async () => {
    const days = (msg: unknown): number => {
      const m = msg as { start_time: string; end_time: string };
      return (new Date(m.end_time).getTime() - new Date(m.start_time).getTime()) / (24 * HOUR);
    };
    const twelve = hass("sensor.twelve_weeks", "measurement", () => ({}));
    await fetchHistory(twelve.h, "sensor.twelve_weeks");
    expect(days(twelve.callWS.mock.calls[0]?.[0])).toBeCloseTo(84, 5);
    expect(days(twelve.callWS.mock.calls[1]?.[0])).toBeCloseTo(84, 5);
    const four = hass("sensor.four_weeks", undefined, () => ({}));
    await fetchHistory(four.h, "sensor.four_weeks");
    expect(days(four.callWS.mock.calls[0]?.[0])).toBeCloseTo(28, 5);
  });

  it("reads no statistics for a monetary sensor", async () => {
    const { h, callWS } = hass("sensor.monetary", undefined, () => ({}));
    expect(await fetchHistory(h, "sensor.monetary")).toHaveLength(1);
    expect(types(callWS)).toEqual(["history/history_during_period"]);
  });

  it("keeps the states when the statistics read fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const { h } = hass("sensor.failing", "measurement", () => {
      throw new Error("boom");
    });
    expect(await fetchHistory(h, "sensor.failing")).toHaveLength(1);
    expect(warn).toHaveBeenCalledWith(
      "[Tankstellen Austria] statistics fetch failed for",
      "sensor.failing",
      expect.any(Error),
    );
  });
});
