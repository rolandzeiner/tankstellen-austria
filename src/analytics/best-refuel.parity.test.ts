// Runs the card's analysis over the cases in
// tests/fixtures/best_refuel_parity.json and records the results, which
// the integration's Python port (`best_refuel.py`, tests/test_best_refuel.py)
// must reproduce too. The results are for Europe/Vienna, and the analysis buckets by
// the process's local clock, so the zone is pinned before any Date is made
// (Node reads TZ again on every Date operation after it changes). The card
// has no @types/node, hence the local declaration.
declare const process: { env: Record<string, string | undefined> };
process.env.TZ = "Europe/Vienna";

import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import fixture from "../../tests/fixtures/best_refuel_parity.json";
import { analyzeBestRefuel } from "./best-refuel";

afterEach(() => {
  vi.useRealTimers();
});

describe("best-refuel parity fixture", () => {
  it("runs in the fixture's time zone", () => {
    expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(fixture.time_zone);
  });

  // The results are a file snapshot so the Python suite can read them:
  // after a deliberate change to the algorithm, `vp test run -u` rewrites
  // the file, and tests/test_best_refuel.py then holds best_refuel.py to it.
  it("gives the recorded result for every case", async () => {
    vi.useFakeTimers();
    const results = Object.fromEntries(
      fixture.cases.map((c) => {
        vi.setSystemTime(c.now);
        const points = c.points.map(([time, value]) => ({ time: time!, value: value! }));
        return [c.name, analyzeBestRefuel(points)];
      }),
    );
    await expect(`${JSON.stringify(results, null, 2)}\n`).toMatchFileSnapshot(
      "../../tests/fixtures/__snapshots__/best_refuel_expected.json",
    );
  });
});
