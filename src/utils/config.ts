import type {
  CarConfig,
  FuelType,
  TankstellenAustriaCardConfig,
  TankstellenCardYaml,
} from "../types";

const ALLOWED_FUEL: readonly FuelType[] = ["DIE", "SUP", "GAS"];

function normaliseCar(raw: unknown): CarConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const src = raw as Record<string, unknown>;

  const name = typeof src.name === "string" ? src.name.slice(0, 50) : "";
  const fuelType: FuelType = ALLOWED_FUEL.includes(src.fuel_type as FuelType)
    ? (src.fuel_type as FuelType)
    : "DIE";

  const tankRaw = parseInt(String(src.tank_size), 10);
  const tank_size = Number.isFinite(tankRaw) && tankRaw >= 1 ? Math.min(200, tankRaw) : 50;

  let consumption: number | undefined;
  if (typeof src.consumption === "number" || typeof src.consumption === "string") {
    const c = parseFloat(String(src.consumption));
    if (Number.isFinite(c) && c >= 0) consumption = Math.min(30, c);
  }

  const icon = typeof src.icon === "string" && src.icon.startsWith("mdi:") ? src.icon : "mdi:car";

  const out: CarConfig = { name, fuel_type: fuelType, tank_size, icon };
  if (consumption != null) out.consumption = consumption;
  return out;
}

// Coerce/clamp user-supplied config so bad YAML doesn't crash render or behave
// weirdly. Normalise in place instead of throwing — the card stays usable even
// with partially-broken config.
export function normaliseConfig(input: TankstellenAustriaCardConfig): TankstellenAustriaCardConfig {
  if (!input) {
    throw new Error("tankstellen-austria-card: config missing");
  }
  const cfg: TankstellenAustriaCardConfig = { ...input };

  // entities: accept a single string as a one-item array; drop non-entity items.
  if (typeof cfg.entities === "string") {
    cfg.entities = [cfg.entities];
  }
  if (Array.isArray(cfg.entities)) {
    cfg.entities = cfg.entities.filter(
      (e): e is string => typeof e === "string" && e.includes("."),
    );
  } else if (cfg.entities != null) {
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
    cfg.cars = cfg.cars.map((c) => normaliseCar(c)).filter((c): c is CarConfig => c !== null);
  } else if (cfg.cars != null) {
    delete cfg.cars;
  }

  return cfg;
}

// --- Grouped YAML ---------------------------------------------------------

/** What the card does with an unset key, per group. The card's reads hold
 *  their own defaults (`=== true` is off, `!== false` is on); the editor
 *  draws these, and `card-smoke.test.ts` checks that they match. */
export const OPTION_DEFAULTS = {
  stations: {
    count: 5,
    sort: "price",
    index: true,
    brand: false,
    tile_shape: "square",
    map_links: true,
    map_provider: "auto",
    distance: false,
    opening_hours: true,
    payment_methods: true,
    payment_mode: "filter",
  },
  header: { show: true, price: true },
  chart: {
    show: true,
    median_line: false,
    hour_envelope: false,
    noon_markers: false,
    min_max: true,
    best_refuel: true,
  },
  cars: { show: false, fill_up: true, consumption: true },
  footer: { adaptive_logo: false, show: true },
} as const;

const GROUPS = ["stations", "header", "chart", "cars", "footer"] as const;
type Group = (typeof GROUPS)[number];

interface Rule {
  flat: keyof TankstellenAustriaCardConfig;
  group: Group;
  key: string;
  // How a flat value becomes the grouped one and back; identity if absent.
  toGroup?: (v: unknown) => unknown;
  toFlat?: (v: unknown) => unknown;
}

// v1's hide_* keys are the opposite of the groups' `show`.
const invert = (v: unknown): unknown => (typeof v === "boolean" ? !v : v);

// One row per v1 flat key. `cars` is missing: its flat key is the group's
// own name, so `toGrouped` handles it before these rules run.
const RULES: readonly Rule[] = [
  { flat: "max_stations", group: "stations", key: "count" },
  {
    flat: "sort_by_distance",
    group: "stations",
    key: "sort",
    toGroup: (v) => (v === true ? "distance" : "price"),
    toFlat: (v) => v === "distance",
  },
  { flat: "show_index", group: "stations", key: "index" },
  { flat: "show_brand", group: "stations", key: "brand" },
  { flat: "tile_shape", group: "stations", key: "tile_shape" },
  { flat: "show_distance", group: "stations", key: "distance" },
  { flat: "show_opening_hours", group: "stations", key: "opening_hours" },
  { flat: "show_payment_methods", group: "stations", key: "payment_methods" },
  { flat: "show_map_links", group: "stations", key: "map_links" },
  { flat: "map_provider", group: "stations", key: "map_provider" },
  { flat: "payment_filter", group: "stations", key: "payment_filter" },
  {
    flat: "payment_highlight_mode",
    group: "stations",
    key: "payment_mode",
    toGroup: (v) => (v === true ? "highlight" : "filter"),
    toFlat: (v) => v === "highlight",
  },
  { flat: "hide_header", group: "header", key: "show", toGroup: invert, toFlat: invert },
  { flat: "hide_header_price", group: "header", key: "price", toGroup: invert, toFlat: invert },
  { flat: "show_history", group: "chart", key: "show" },
  { flat: "show_best_refuel", group: "chart", key: "best_refuel" },
  { flat: "show_median_line", group: "chart", key: "median_line" },
  { flat: "show_hour_envelope", group: "chart", key: "hour_envelope" },
  { flat: "show_noon_markers", group: "chart", key: "noon_markers" },
  { flat: "show_minmax", group: "chart", key: "min_max" },
  { flat: "show_cars", group: "cars", key: "show" },
  { flat: "show_car_fillup", group: "cars", key: "fill_up" },
  { flat: "show_car_consumption", group: "cars", key: "consumption" },
  { flat: "hide_attribution", group: "footer", key: "show", toGroup: invert, toFlat: invert },
  { flat: "logo_adapt_to_theme", group: "footer", key: "adaptive_logo" },
];

const isGroup = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** Move a v1 config's flat keys into the v2 groups. A grouped config passes
 *  through unchanged; where a config has both, the grouped value wins. */
export function toGrouped(input: Record<string, unknown>): TankstellenCardYaml {
  const out: Record<string, unknown> = { ...input };
  const groups: Record<string, Record<string, unknown>> = {};
  for (const g of GROUPS) {
    if (isGroup(input[g])) groups[g] = { ...input[g] };
    delete out[g];
  }
  // A v1 `cars` is the list itself.
  if (Array.isArray(input.cars)) {
    groups.cars = { items: input.cars, ...groups.cars };
  }
  for (const rule of RULES) {
    const value = input[rule.flat];
    delete out[rule.flat];
    if (value === undefined) continue;
    const group = (groups[rule.group] ??= {});
    if (group[rule.key] === undefined) {
      group[rule.key] = rule.toGroup ? rule.toGroup(value) : value;
    }
  }
  for (const g of GROUPS) {
    if (groups[g] && Object.keys(groups[g]).length > 0) out[g] = groups[g];
  }
  return out as TankstellenCardYaml;
}

/** Read the v2 groups back into the flat keys the card renders from. */
export function fromGrouped(yaml: TankstellenCardYaml): TankstellenAustriaCardConfig {
  const out: Record<string, unknown> = { ...yaml };
  const groups: Record<string, Record<string, unknown>> = {};
  for (const g of GROUPS) {
    if (isGroup(yaml[g])) groups[g] = yaml[g];
    delete out[g];
  }
  for (const rule of RULES) {
    const value = groups[rule.group]?.[rule.key];
    if (value !== undefined) out[rule.flat] = rule.toFlat ? rule.toFlat(value) : value;
  }
  if (groups.cars?.items !== undefined) out.cars = groups.cars.items;
  return out as TankstellenAustriaCardConfig;
}
