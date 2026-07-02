import { describe, expect, it } from "vitest";
import { formatDistance, mapsUrl } from "./price";

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

describe("mapsUrl — link kind and fallbacks", () => {
  const precise = {
    address: "Hauptstraße 12",
    postalCode: "1010",
    city: "Wien",
  };
  const fuzzy = { address: "Ortsstraße", postalCode: "3300", city: "Amstetten" };

  it("builds the per-kind URL for a precise address", () => {
    const q = encodeURIComponent("1010 Wien Hauptstraße 12");
    expect(mapsUrl(precise, "OMV")).toBe(`https://maps.google.com/?q=${q}`);
    expect(mapsUrl(precise, "OMV", "google")).toBe(
      `https://maps.google.com/?q=${q}`,
    );
    expect(mapsUrl(precise, "OMV", "apple")).toBe(
      `https://maps.apple.com/?q=${q}`,
    );
    expect(mapsUrl(precise, "OMV", "geo")).toBe(`geo:0,0?q=${q}`);
  });

  it("keeps the Google-search fallback for number-less addresses on every kind", () => {
    const q = encodeURIComponent("OMV Ortsstraße 3300 Amstetten");
    const expected = `https://www.google.com/search?q=${q}`;
    expect(mapsUrl(fuzzy, "OMV", "google")).toBe(expected);
    expect(mapsUrl(fuzzy, "OMV", "apple")).toBe(expected);
    expect(mapsUrl(fuzzy, "OMV", "geo")).toBe(expected);
  });

  it("searches by name without a location, and returns null with nothing at all", () => {
    expect(mapsUrl(null, "OMV", "geo")).toBe(
      `https://www.google.com/search?q=${encodeURIComponent("OMV")}`,
    );
    expect(mapsUrl(null, "")).toBeNull();
    expect(mapsUrl({}, "")).toBeNull();
  });
});
