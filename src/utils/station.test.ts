import { describe, expect, it } from "vite-plus/test";

import type { Station } from "../types";
import { isClosingSoon } from "./station";

// 2026-10-21 is a Wednesday, 2026-10-24 a Saturday, 2026-10-25 a Sunday.
// Local-time constructors, because isClosingSoon reads local wall-clock time.
const WED = (h: number, m: number): Date => new Date(2026, 9, 21, h, m);
const SAT = (h: number, m: number): Date => new Date(2026, 9, 24, h, m);
const SUN = (h: number, m: number): Date => new Date(2026, 9, 25, h, m);

function station(hours: Station["opening_hours"], open?: boolean): Station {
  const s: Station = { name: "Test" };
  if (open !== undefined) s.open = open;
  if (hours !== undefined) s.opening_hours = hours;
  return s;
}

const WEEK = [
  { day: "MO", from: "06:00", to: "20:00" },
  { day: "SA", from: "07:00", to: "18:00" },
  { day: "SO", from: "08:00", to: "12:00" },
];

describe("isClosingSoon", () => {
  it("is true inside the last 30 minutes before closing", () => {
    expect(isClosingSoon(station(WEEK), WED(19, 30))).toBe(true);
    expect(isClosingSoon(station(WEEK), WED(19, 59))).toBe(true);
  });

  it("is false more than 30 minutes before closing", () => {
    expect(isClosingSoon(station(WEEK), WED(19, 29))).toBe(false);
  });

  it("is false at and after closing time", () => {
    expect(isClosingSoon(station(WEEK), WED(20, 0))).toBe(false);
    expect(isClosingSoon(station(WEEK), WED(21, 0))).toBe(false);
  });

  it("picks the Saturday and Sunday rows by day code", () => {
    expect(isClosingSoon(station(WEEK), SAT(17, 45))).toBe(true);
    expect(isClosingSoon(station(WEEK), SUN(11, 45))).toBe(true);
    // The weekday closing time does not apply on a Sunday.
    expect(isClosingSoon(station(WEEK), SUN(19, 45))).toBe(false);
  });

  it("is false for a station reported closed", () => {
    expect(isClosingSoon(station(WEEK, false), WED(19, 45))).toBe(false);
  });

  it("is false without opening hours or without a row for today", () => {
    expect(isClosingSoon(station(undefined), WED(19, 45))).toBe(false);
    expect(isClosingSoon(station([]), WED(19, 45))).toBe(false);
    expect(isClosingSoon(station([{ day: "SA", from: "07:00", to: "20:00" }]), WED(19, 45))).toBe(
      false,
    );
  });

  it("never flags a 24/7 station", () => {
    const allDay = [{ day: "MO", from: "00:00", to: "24:00" }];
    expect(isClosingSoon(station(allDay), WED(23, 45))).toBe(false);
  });

  it("treats a 00:00 closing time as midnight at the end of the day", () => {
    const late = [{ day: "MO", from: "06:00", to: "00:00" }];
    expect(isClosingSoon(station(late), WED(23, 45))).toBe(true);
    expect(isClosingSoon(station(late), WED(23, 0))).toBe(false);
  });

  it("ignores a malformed closing time", () => {
    expect(isClosingSoon(station([{ day: "MO", from: "06:00", to: "8pm" }]), WED(19, 45))).toBe(
      false,
    );
    expect(isClosingSoon(station([{ day: "MO", from: "06:00", to: "" }]), WED(19, 45))).toBe(false);
  });
});
