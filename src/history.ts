import type { HomeAssistant } from "custom-card-helpers";

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
      cache.set(entityId, points);
      return points;
    } catch (err) {
      // Don't poison the cache on transient fetch failure — next call retries.
      // eslint-disable-next-line no-console
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

export function clearHistoryCache(): void {
  cache.clear();
  inflight.clear();
}
