import { describe, expect, it } from "vitest";
import { formatDistance } from "./price";

describe("formatDistance — units and boundaries", () => {
  it("renders sub-kilometre values as rounded metres", () => {
    expect(formatDistance(0)).toBe("0 m");
    expect(formatDistance(849.4)).toBe("849 m");
    expect(formatDistance(999)).toBe("999 m");
  });

  it("switches to km with a German decimal comma at 1 km", () => {
    expect(formatDistance(1000)).toBe("1,0 km");
    expect(formatDistance(1234)).toBe("1,2 km");
    expect(formatDistance(12345)).toBe("12,3 km");
  });

  it("returns an empty string for missing or invalid input", () => {
    expect(formatDistance(null)).toBe("");
    expect(formatDistance(undefined)).toBe("");
    expect(formatDistance(NaN)).toBe("");
    expect(formatDistance(-5)).toBe("");
  });
});
