import { describe, expect, it } from "vite-plus/test";

import { DAY_MS, HOUR_MS, ZonedClock, pad2, resolveTimeZone, useAmPm } from "./tz";

const vienna = new ZonedClock("Europe/Vienna");

describe("ZonedClock", () => {
  it("reads wall-clock parts in the zone, not the process's", () => {
    // 2026-07-01T10:30:00Z is 12:30 CEST on a Wednesday.
    const p = vienna.parts(Date.UTC(2026, 6, 1, 10, 30));
    expect(p).toMatchObject({ year: 2026, month: 7, day: 1, hour: 12, minute: 30, weekday: 3 });
    expect(new ZonedClock("America/New_York").parts(Date.UTC(2026, 6, 1, 10, 30)).hour).toBe(6);
  });

  it("finds local midnight on the day DST ends, when the offset differs at midnight", () => {
    // 2026-10-25: clocks go back at 03:00 CEST. 14:00 CET is 13:00Z;
    // midnight that day was 00:00 CEST = 22:00Z the evening before.
    const start = vienna.startOfDay(Date.UTC(2026, 9, 25, 13));
    expect(start).toBe(Date.UTC(2026, 9, 24, 22));
    expect(vienna.parts(start)).toMatchObject({ day: 25, hour: 0, minute: 0 });
    // The day is 25 hours long.
    expect(vienna.startOfDay(start + 26 * HOUR_MS) - start).toBe(25 * HOUR_MS);
  });

  it("pins atHour to the wall clock across the spring-forward day", () => {
    // 2026-03-29: clocks go forward at 02:00 CET. Noon is 10:00Z, not 11:00Z.
    const noon = vienna.atHour(Date.UTC(2026, 2, 29, 6), 12);
    expect(noon).toBe(Date.UTC(2026, 2, 29, 10));
    expect(vienna.parts(noon).hour).toBe(12);
  });

  it("shifts by calendar days, so a 23-hour day still lands on midnight", () => {
    const sunday = Date.UTC(2026, 2, 29, 15); // after the spring-forward
    const saturday = vienna.shiftDays(sunday, 1);
    expect(vienna.parts(saturday)).toMatchObject({ day: 28, hour: 0 });
    expect(vienna.shiftDays(saturday, -1)).toBe(vienna.startOfDay(sunday));
  });

  it("keys a week by its Monday's midnight", () => {
    const wed = Date.UTC(2026, 6, 1, 10); // Wednesday
    const sun = Date.UTC(2026, 6, 5, 10); // the Sunday after
    const monday = Date.UTC(2026, 5, 28, 22); // Mon 2026-06-29 00:00 CEST
    expect(vienna.mondayKey(wed)).toBe(monday);
    expect(vienna.mondayKey(sun)).toBe(monday);
    expect(vienna.mondayKey(monday + 6 * DAY_MS + 23 * HOUR_MS)).toBe(monday);
  });

  it("falls back to the browser's zone for an unknown name", () => {
    const bogus = new ZonedClock("Mars/Olympus_Mons");
    const t = Date.UTC(2026, 6, 1, 10, 30);
    expect(bogus.parts(t).hour).toBe(new Date(t).getHours());
  });
});

describe("resolveTimeZone", () => {
  const browser = Intl.DateTimeFormat().resolvedOptions().timeZone;
  it("follows the profile like HA: local is the browser's, otherwise the server's", () => {
    expect(resolveTimeZone({ config: { time_zone: "Europe/Vienna" } })).toBe("Europe/Vienna");
    expect(
      resolveTimeZone({ config: { time_zone: "Europe/Vienna" }, locale: { time_zone: "server" } }),
    ).toBe("Europe/Vienna");
    expect(
      resolveTimeZone({ config: { time_zone: "Europe/Vienna" }, locale: { time_zone: "local" } }),
    ).toBe(browser);
    expect(resolveTimeZone(undefined)).toBe(browser);
  });
});

describe("useAmPm", () => {
  it("obeys an explicit profile setting and otherwise asks the language", () => {
    expect(useAmPm({ time_format: "12" }, "de")).toBe(true);
    expect(useAmPm({ time_format: "24" }, "en-US")).toBe(false);
    expect(useAmPm({ time_format: "language" }, "de")).toBe(false);
    expect(useAmPm({ time_format: "language" }, "en-US")).toBe(true);
    expect(useAmPm(undefined, "de")).toBe(false);
  });
});

describe("pad2", () => {
  it("pads a clock field to two digits", () => {
    expect(pad2(7)).toBe("07");
    expect(pad2(23)).toBe("23");
    expect(pad2(0)).toBe("00");
  });
});
