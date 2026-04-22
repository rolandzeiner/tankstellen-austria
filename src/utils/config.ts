import type { CarConfig, FuelType, TankstellenAustriaCardConfig } from "../types";

const ALLOWED_FUEL: readonly FuelType[] = ["DIE", "SUP", "GAS"];

function normaliseCar(raw: unknown): CarConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const src = raw as Record<string, unknown>;

  const name = typeof src.name === "string" ? src.name.slice(0, 50) : "";
  const fuelType: FuelType = ALLOWED_FUEL.includes(src.fuel_type as FuelType)
    ? (src.fuel_type as FuelType)
    : "DIE";

  const tankRaw = parseInt(String(src.tank_size), 10);
  const tank_size =
    Number.isFinite(tankRaw) && tankRaw >= 1 ? Math.min(200, tankRaw) : 50;

  let consumption: number | undefined;
  if (src.consumption != null) {
    const c = parseFloat(String(src.consumption));
    if (Number.isFinite(c) && c >= 0) consumption = Math.min(30, c);
  }

  const icon =
    typeof src.icon === "string" && src.icon.startsWith("mdi:")
      ? src.icon
      : "mdi:car";

  const out: CarConfig = { name, fuel_type: fuelType, tank_size, icon };
  if (consumption != null) out.consumption = consumption;
  return out;
}

// Coerce/clamp user-supplied config so bad YAML doesn't crash render or behave
// weirdly. Normalise in place instead of throwing — the card stays usable even
// with partially-broken config.
export function normaliseConfig(
  input: TankstellenAustriaCardConfig,
): TankstellenAustriaCardConfig {
  if (!input) {
    throw new Error("tankstellen-austria-card: config missing");
  }
  const cfg: TankstellenAustriaCardConfig = { ...input };

  // entities: accept a single string as a one-item array; drop non-entity items.
  if (typeof cfg.entities === "string") {
    cfg.entities = [cfg.entities as unknown as string];
  }
  if (Array.isArray(cfg.entities)) {
    cfg.entities = cfg.entities.filter(
      (e): e is string => typeof e === "string" && e.includes("."),
    );
  } else if (cfg.entities != null) {
    // eslint-disable-next-line no-console
    console.warn(
      "[Tankstellen Austria] config.entities must be an array of entity IDs — ignoring",
      cfg.entities,
    );
    delete cfg.entities;
  }

  // max_stations: clamp to [0, 5], fall back to 5 on garbage. Zero is allowed
  // so users can hide the station list and show only cars/history.
  if (cfg.max_stations != null) {
    const n = parseInt(String(cfg.max_stations), 10);
    cfg.max_stations = Number.isFinite(n) ? Math.max(0, Math.min(5, n)) : 5;
  }

  // payment_filter: must be array of non-empty strings.
  if (Array.isArray(cfg.payment_filter)) {
    cfg.payment_filter = cfg.payment_filter.filter(
      (p): p is string => typeof p === "string" && p.length > 0,
    );
  } else if (cfg.payment_filter != null) {
    delete cfg.payment_filter;
  }

  // cars: validate per-item; drop items that can't be rescued.
  if (Array.isArray(cfg.cars)) {
    cfg.cars = cfg.cars
      .map((c) => normaliseCar(c))
      .filter((c): c is CarConfig => c !== null);
  } else if (cfg.cars != null) {
    delete cfg.cars;
  }

  return cfg;
}
