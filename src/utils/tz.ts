// Time-zone helpers on Intl, in the shape HA's frontend uses (its
// `resolveTimeZone` and `useAmPm` in src/common/datetime). A dashboard is
// not always viewed from the zone the prices belong to -- a UTC kiosk, a
// phone abroad -- so every hour-of-day the card computes goes through a
// `ZonedClock` for the resolved zone instead of `Date.getHours()`.
import type { HomeAssistant } from "../types";

export const HOUR_MS = 3_600_000;
export const DAY_MS = 86_400_000;

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number;
  second: number;
  weekday: number; // 0-6, Sunday = 0, as Date.getDay()
}

export function browserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

// HA: the profile's "local" uses the browser's zone, anything else the
// server's. Without a server zone (older HA, tests) the browser's wins.
export function resolveTimeZone(
  hass: Pick<HomeAssistant, "locale" | "config"> | undefined,
): string {
  const server = hass?.config?.time_zone;
  if (!server || hass?.locale?.time_zone === "local") return browserTimeZone();
  return server;
}

// HA's `useAmPm`: the profile's time format, or what the UI language (or,
// for "system", the browser) would do on its own.
export function useAmPm(locale: HomeAssistant["locale"] | undefined, language: string): boolean {
  const tf = locale?.time_format;
  if (tf === "12") return true;
  if (tf === "24") return false;
  try {
    const f = new Intl.DateTimeFormat(tf === "system" ? undefined : language, { hour: "numeric" });
    return f.resolvedOptions().hour12 ?? false;
  } catch {
    return false;
  }
}

const WEEKDAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function makeFormatter(tz: string): Intl.DateTimeFormat {
  const opts: Intl.DateTimeFormatOptions = {
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "short",
  };
  try {
    return new Intl.DateTimeFormat("en-US", { ...opts, timeZone: tz });
  } catch {
    // An unknown zone name: fall back to the browser's zone, as HA does.
    return new Intl.DateTimeFormat("en-US", opts);
  }
}

/** Wall-clock arithmetic in one zone, with the per-day lookups cached. */
export class ZonedClock {
  private readonly _fmt: Intl.DateTimeFormat;
  // Start-of-day by local date (y*10000 + m*100 + d): the analytics ask for
  // the same few days hundreds of times.
  private readonly _dayStarts = new Map<number, number>();

  public constructor(public readonly timeZone: string) {
    this._fmt = makeFormatter(timeZone);
  }

  public parts(t: number): ZonedParts {
    const out: ZonedParts = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      weekday: 0,
    };
    for (const p of this._fmt.formatToParts(t)) {
      switch (p.type) {
        case "year":
          out.year = Number(p.value);
          break;
        case "month":
          out.month = Number(p.value);
          break;
        case "day":
          out.day = Number(p.value);
          break;
        case "hour":
          // Some engines print 24 for midnight even with h23.
          out.hour = Number(p.value) % 24;
          break;
        case "minute":
          out.minute = Number(p.value);
          break;
        case "second":
          out.second = Number(p.value);
          break;
        case "weekday":
          out.weekday = WEEKDAYS[p.value] ?? 0;
          break;
        default:
          break;
      }
    }
    return out;
  }

  // Zone offset at t, in ms (positive east of UTC).
  private _offset(t: number): number {
    const p = this.parts(t);
    const wall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return wall - (t - (t % 1000));
  }

  /** Local midnight of the day containing t. */
  public startOfDay(t: number): number {
    const p = this.parts(t);
    const key = p.year * 10_000 + p.month * 100 + p.day;
    const cached = this._dayStarts.get(key);
    if (cached !== undefined) return cached;
    const wallMidnight = Date.UTC(p.year, p.month - 1, p.day);
    // The offset at t may differ from the one at midnight (a DST day), so
    // take the offset at the first guess and correct once.
    let start = wallMidnight - this._offset(t);
    const atStart = this._offset(start);
    if (wallMidnight - atStart !== start) start = wallMidnight - atStart;
    this._dayStarts.set(key, start);
    return start;
  }

  /** Local midnight `days` days before (negative: after) the day containing t. */
  public shiftDays(t: number, days: number): number {
    // Midday keeps a 23- or 25-hour day from landing on the wrong date.
    return this.startOfDay(this.startOfDay(t) - days * DAY_MS + 12 * HOUR_MS);
  }

  /** The instant of `hour`:00 on the local day containing t. */
  public atHour(t: number, hour: number): number {
    const day = this.startOfDay(t);
    let x = day + hour * HOUR_MS;
    const h = this.parts(x).hour;
    if (h !== hour) x += (hour - h) * HOUR_MS;
    return x;
  }

  /** Local midnight of the Monday of the week containing t. */
  public mondayKey(t: number): number {
    const wd = this.parts(t).weekday;
    const back = wd === 0 ? 6 : wd - 1;
    return back ? this.shiftDays(t, back) : this.startOfDay(t);
  }
}

const clocks = new Map<string, ZonedClock>();

export function zonedClock(tz: string | undefined): ZonedClock {
  const zone = tz ?? browserTimeZone();
  let c = clocks.get(zone);
  if (!c) {
    c = new ZonedClock(zone);
    clocks.set(zone, c);
  }
  return c;
}
