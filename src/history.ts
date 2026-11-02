import type { HomeAssistant } from "./types";

export interface HistoryPoint {
  time: number; // epoch ms
  value: number; // price in EUR
}

// Minimal-response entries from HA's history WS API. `lu` is last_updated
// as either a unix-seconds float or an ISO string (depending on HA version),
// `s` is the state as a string. We normalise both shapes.
interface RawHistoryEntry {
  lu?: number | string;
  last_updated?: string;
  last_changed?: string;
  s?: string | number;
  state?: string | number;
}

// Hourly rows from recorder/statistics_during_period. `start` is epoch ms
// in current HA, an ISO string in older releases.
interface RawStatisticsRow {
  start?: number | string;
  mean?: number | null;
}

export interface HistoryFetchOptions {
  days?: number; // default: 28 (4 weeks)
}

// In-memory cache shared across all card instances on the page. Keyed by
// entity_id — refresh interval is 30 min so a second card for the same
// entity reuses the cached fetch instead of hitting the WS API again.
const cache = new Map<string, HistoryPoint[]>();
const inflight = new Map<string, Promise<HistoryPoint[]>>();

function parseTime(entry: RawHistoryEntry): number {
  if (typeof entry.lu === "number") return Math.round(entry.lu * 1000);
  const raw = entry.lu ?? entry.last_updated ?? entry.last_changed;
  return raw ? new Date(raw).getTime() : 0;
}

/** Fill the hours before the oldest kept state with hourly means.
 *
 *  Where both exist the states win: they carry the real change times,
 *  which the means smear over the hour. The integration's `refuel.py`
 *  merges the same way, so the cheap-window entities see this history. */
export function mergeStatistics(states: HistoryPoint[], means: HistoryPoint[]): HistoryPoint[] {
  const first = states[0]?.time ?? Infinity;
  return [...means.filter((p) => p.time < first), ...states];
}

function statisticsPoints(rows: RawStatisticsRow[] | undefined): HistoryPoint[] {
  return (rows ?? [])
    .map((r) => ({
      time: typeof r.start === "number" ? r.start : r.start ? new Date(r.start).getTime() : 0,
      value: typeof r.mean === "number" ? r.mean : Number.NaN,
    }))
    .filter((p) => Number.isFinite(p.value) && p.time > 0);
}

// A failed statistics read costs only the purged days, so it is logged and
// the states are used alone.
async function fetchMeans(
  hass: HomeAssistant,
  entityId: string,
  start: Date,
  end: Date,
): Promise<HistoryPoint[]> {
  try {
    const result = await hass.callWS<Record<string, RawStatisticsRow[]>>({
      type: "recorder/statistics_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      statistic_ids: [entityId],
      period: "hour",
      types: ["mean"],
    });
    return statisticsPoints(result?.[entityId]);
  } catch (err) {
    console.warn("[Tankstellen Austria] statistics fetch failed for", entityId, err);
    return [];
  }
}

export async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  options: HistoryFetchOptions = {},
): Promise<HistoryPoint[]> {
  if (!hass?.callWS) return [];

  // Coalesce concurrent fetches for the same entity so the card doesn't hit
  // the WS API twice when hass updates arrive back-to-back.
  const existing = inflight.get(entityId);
  if (existing) return existing;

  const days = options.days ?? 28;
  const now = new Date();
  const startTime = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // A sensor with long-term statistics on is a `measurement`; its hourly
  // means outlive the recorder's purge (10 days by default).
  const withStatistics = hass.states?.[entityId]?.attributes?.state_class === "measurement";

  const promise = (async (): Promise<HistoryPoint[]> => {
    try {
      const result = await hass.callWS<Record<string, RawHistoryEntry[]>>({
        type: "history/history_during_period",
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        entity_ids: [entityId],
        minimal_response: true,
        significant_changes_only: true,
      });
      const raw = result?.[entityId] ?? [];
      const points: HistoryPoint[] = raw
        .map((e) => ({
          time: parseTime(e),
          value: parseFloat(String(e.s ?? e.state ?? "")),
        }))
        .filter((p) => Number.isFinite(p.value) && p.time > 0);
      const merged = withStatistics
        ? mergeStatistics(points, await fetchMeans(hass, entityId, startTime, now))
        : points;
      cache.set(entityId, merged);
      return merged;
    } catch (err) {
      // Don't poison the cache on transient fetch failure — next call retries.
      console.warn(
        "[Tankstellen Austria] history fetch failed for",
        entityId,
        "— sparkline and best-refuel will be empty:",
        err,
      );
      return cache.get(entityId) ?? [];
    } finally {
      inflight.delete(entityId);
    }
  })();

  inflight.set(entityId, promise);
  return promise;
}

export function getCachedHistory(entityId: string): HistoryPoint[] {
  return cache.get(entityId) ?? [];
}

/** Add a state the card saw land live, so the chart shows it before the
 *  next refetch and a card mounted later starts with it. Kept only when it
 *  is newer than, and differs from, the last cached point: the recorder
 *  stores significant changes, and so does this. */
export function appendCachedPoint(entityId: string, point: HistoryPoint): boolean {
  const points = cache.get(entityId);
  if (!points?.length) return false;
  const last = points[points.length - 1]!;
  if (!(point.time > last.time) || point.value === last.value) return false;
  cache.set(entityId, [...points, point]);
  return true;
}
