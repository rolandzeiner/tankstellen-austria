import type { Station } from "../types";

// Returns true if the station is open but will close within 30 minutes (based
// on the current local-time). E-Control groups Mon–Fri under the "MO" day code.
export function isClosingSoon(station: Station, now: Date = new Date()): boolean {
  if (station.open === false) return false;
  const hours = station.opening_hours ?? [];
  if (!hours.length) return false;

  const dayOfWeek = now.getDay();
  const dayCode =
    dayOfWeek === 0 ? "SO" : dayOfWeek === 6 ? "SA" : "MO";

  const today = hours.find((h) => h.day === dayCode);
  if (!today || !today.to) return false;

  // 00:00→24:00 means 24/7 — never closing soon.
  if (today.from === "00:00" && today.to === "24:00") return false;

  const [hStr, mStr] = today.to.split(":");
  if (hStr === undefined || mStr === undefined) return false;
  const closeHour = parseInt(hStr, 10);
  const closeMin = parseInt(mStr, 10);
  if (!Number.isFinite(closeHour) || !Number.isFinite(closeMin)) return false;

  const closing = new Date(now);
  if (closeHour === 0 && closeMin === 0) {
    // Closing at 00:00 means "midnight next day".
    closing.setDate(closing.getDate() + 1);
    closing.setHours(0, 0, 0, 0);
  } else {
    closing.setHours(closeHour, closeMin, 0, 0);
  }

  const diffMinutes = (closing.getTime() - now.getTime()) / 60000;
  return diffMinutes > 0 && diffMinutes <= 30;
}
