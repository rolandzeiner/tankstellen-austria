import { describe, expect, it } from "vitest";
import { weightedPercentile, type WeightedEntry } from "./math";

describe("weightedPercentile — boundaries and edge cases", () => {
  it("returns NaN for an empty input", () => {
    expect(weightedPercentile([], 0.5)).toBeNaN();
  });

  it("returns the only value for a single entry", () => {
    const e: WeightedEntry[] = [{ value: 1.42, weight: 1 }];
    expect(weightedPercentile(e, 0.0)).toBe(1.42);
    expect(weightedPercentile(e, 0.5)).toBe(1.42);
    expect(weightedPercentile(e, 1.0)).toBe(1.42);
  });

  it("returns the smallest value at q=0", () => {
    const e: WeightedEntry[] = [
      { value: 3, weight: 1 },
      { value: 1, weight: 1 },
      { value: 2, weight: 1 },
    ];
    expect(weightedPercentile(e, 0)).toBe(1);
  });

  it("returns the largest value at q=1", () => {
    const e: WeightedEntry[] = [
      { value: 3, weight: 1 },
      { value: 1, weight: 1 },
      { value: 2, weight: 1 },
    ];
    expect(weightedPercentile(e, 1)).toBe(3);
  });

  it("uses weights, not counts, for cumulative-weight crossing", () => {
    // 99% of mass at value 1, 1% at value 100 → median should land at 1.
    const e: WeightedEntry[] = [
      { value: 1, weight: 99 },
      { value: 100, weight: 1 },
    ];
    expect(weightedPercentile(e, 0.5)).toBe(1);
    expect(weightedPercentile(e, 0.99)).toBe(1);
    // Once cumulative weight passes 99% the next value (100) takes over.
    expect(weightedPercentile(e, 1)).toBe(100);
  });

  it("drops non-finite values and non-positive weights", () => {
    const e: WeightedEntry[] = [
      { value: Number.NaN, weight: 5 },
      { value: 7, weight: 0 },
      { value: 3, weight: 1 },
      { value: Number.POSITIVE_INFINITY, weight: 2 }, // dropped
      { value: 9, weight: 1 },
    ];
    // After filtering: [3, 9]. Median (lower convention at exact middle) = 3.
    expect(weightedPercentile(e, 0.5)).toBe(3);
  });

  it("returns the same value when all entries are equal regardless of weights", () => {
    const e: WeightedEntry[] = [
      { value: 1.5, weight: 0.001 },
      { value: 1.5, weight: 1_000_000 },
      { value: 1.5, weight: 1 },
    ];
    expect(weightedPercentile(e, 0)).toBe(1.5);
    expect(weightedPercentile(e, 0.5)).toBe(1.5);
    expect(weightedPercentile(e, 1)).toBe(1.5);
  });
});
