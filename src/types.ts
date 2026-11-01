// Local mirror of the HA / Lovelace types this card actually uses.
// Replaces the `custom-card-helpers` dependency — the package is
// effectively unmaintained and bundled HA-internal types drift faster
// than its release cadence. We only depend on a handful of fields, so
// pinning a local shape is cheaper than a transitive npm dep.

/** Single entity in `hass.states`. The attributes bag is open-ended —
 *  the integration's coordinator emits the keys this card reads
 *  (`stations`, `fuel_type`, `attribution`, `dynamic_mode`, …). HA
 *  always populates `last_updated`, so it stays non-optional here to
 *  satisfy the card's `_resolveEntities` mapper without an extra guard. */
export interface HassEntity {
  state: string;
  attributes: Record<string, unknown> & TankstellenEntityAttributes;
  last_changed?: string;
  last_updated: string;
  entity_id?: string;
}

/** Minimal HA shape — only the fields this card touches. `language` is
 *  the user-profile locale; `localize` is HA's own UI translation
 *  lookup (the editor reuses it for built-in field names so we don't
 *  carry duplicates); `callWS` powers both the card-version probe and
 *  the history fetch; `callService` powers the manual-refresh button;
 *  `themes.darkMode` is reserved for future adaptive logo work.
 *  `callWS` and `callService` are non-optional — the card requires
 *  both at runtime (history view + manual refresh would silently fail
 *  otherwise) and HA core has shipped both since well before our
 *  `requirements.txt` floor. Anything beyond these lives untyped and
 *  is read with a cast at the call site. */
/** Minimal entity-registry shape. Both fields survive a sensor going
 *  unavailable, which its state attributes don't. `platform` gates the card
 *  picker's `getEntitySuggestion` and entity auto-discovery to this
 *  integration's own sensors; `translation_key` (`fuel_die` …) gives the
 *  fuel type back while E-Control is down (see utils/entities.ts). */
export interface RegistryEntity {
  platform?: string;
  translation_key?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, RegistryEntity>;
  language?: string;
  themes?: { darkMode?: boolean } & Record<string, unknown>;
  config?: { time_zone?: string } & Record<string, unknown>;
  localize?: (key: string, ...args: unknown[]) => string;
  callWS<T = unknown>(msg: { type: string; [key: string]: unknown }): Promise<T>;
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ): Promise<unknown> | void;
}

/** Marker every card config extends. */
export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

/** Custom-card editor contract — Lovelace expects an HTMLElement that
 *  accepts `setConfig(config)` and reads `hass`. */
export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

/** Local `fireEvent` shim — same shape as the helper from
 *  custom-card-helpers. `bubbles: true` + `composed: true` are required
 *  so the event crosses the editor's shadow boundary and reaches the
 *  dashboard's card-editor listener. */
export function fireEvent<T>(node: HTMLElement, type: string, detail: T): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}

// Register your editor element with the global HTMLElementTagNameMap so
// TypeScript autocompletes it in templates.
declare global {
  interface HTMLElementTagNameMap {
    "tankstellen-austria-card-editor": LovelaceCardEditor;
  }
}

export type FuelType = "DIE" | "SUP" | "GAS";

export interface CarConfig {
  name: string;
  fuel_type: FuelType;
  tank_size: number; // litres, 1..200
  consumption?: number; // l / 100km, 0..30; optional
  icon?: string; // mdi:*
}

export interface TankstellenAustriaCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  entities?: string[];

  language?: "de" | "en";

  max_stations?: number; // 0..5

  show_index?: boolean;
  // The rank tile shows the brand's initials and colour instead (v2).
  show_brand?: boolean;
  // The rank tile's shape: HA's small-radius square (default) or a circle.
  tile_shape?: "square" | "circle";
  show_map_links?: boolean;
  // Where the navigation link opens. "auto" (also the absent-key default)
  // routes per device: Apple Maps on iOS, geo: chooser on Android, Google
  // Maps on desktop. "google" / "apple" force that provider everywhere
  // (Apple Maps falls back to its web app on non-Apple devices).
  map_provider?: "auto" | "google" | "apple";
  show_distance?: boolean;
  // Order the station list by `distance_m` (nearest first) instead of the
  // integration's cheapest-first order. Independent of `show_distance` —
  // sorting works even when the caption is hidden. Defaults to false.
  sort_by_distance?: boolean;
  show_opening_hours?: boolean;
  show_payment_methods?: boolean;
  show_history?: boolean;
  show_best_refuel?: boolean;
  show_median_line?: boolean;
  show_hour_envelope?: boolean;
  show_noon_markers?: boolean;
  show_minmax?: boolean;

  payment_filter?: string[];
  payment_highlight_mode?: boolean;

  tab_labels?: Record<string, string>;

  show_cars?: boolean;
  show_car_fillup?: boolean;
  show_car_consumption?: boolean;
  cars?: CarConfig[];

  // Hide the hero metric block (cheapest + "/ avg" + UPPERCASE label)
  // from the header strip. Defaults to false: the hero is visible.
  // Useful when stations list is the focus and the prices below are
  // sufficient.
  hide_header_price?: boolean;

  // Brand-coloured E-Control logo by default. When true, the logo
  // renders as a theme-adaptive silhouette (black on light themes,
  // white on dark themes) — same vocabulary as the Ladestellen card.
  logo_adapt_to_theme?: boolean;

  // Hide the card header (icon-tile + station name + subtitle +
  // refresh / icon-action cluster). Defaults to false: the header
  // is visible by default. Useful for stripped-down dashboards.
  hide_header?: boolean;

  // Hide the attribution footer (logo + "Datenquelle: E-Control"
  // line). Defaults to false: the footer is visible by default,
  // matching E-Control §3 attribution practice.
  hide_attribution?: boolean;
}

// --- The YAML a dashboard stores (since v2.0.0). ---
//
// Options sit in groups, by the part of the card they change. The card
// still runs on the flat `TankstellenAustriaCardConfig` above:
// `utils/config.ts` moves the flat keys of a v1 config into these groups
// (`toGrouped`) and reads the groups back into flat keys (`fromGrouped`).
// Absent keys stay absent both ways, so every default lives in one place,
// the card's render code.

export interface StationsOptions {
  count?: number; // 0..5
  sort?: "price" | "distance";
  index?: boolean;
  // Brand initials and colour in the rank tile instead of the rank.
  brand?: boolean;
  // Rank tile shape, for the rank and the brand alike.
  tile_shape?: "square" | "circle";
  distance?: boolean;
  opening_hours?: boolean;
  payment_methods?: boolean;
  map_links?: boolean;
  map_provider?: "auto" | "google" | "apple";
  payment_filter?: string[];
  // What the payment filter does to the stations without a match.
  payment_mode?: "filter" | "highlight";
}

export interface HeaderOptions {
  show?: boolean;
  price?: boolean;
}

export interface ChartOptions {
  show?: boolean;
  best_refuel?: boolean;
  median_line?: boolean;
  hour_envelope?: boolean;
  noon_markers?: boolean;
  min_max?: boolean;
}

export interface CarsOptions {
  show?: boolean;
  fill_up?: boolean;
  consumption?: boolean;
  items?: CarConfig[];
}

export interface FooterOptions {
  show?: boolean;
  adaptive_logo?: boolean;
}

export interface TankstellenCardYaml extends LovelaceCardConfig {
  type: string;
  name?: string;
  entities?: string[];
  language?: "de" | "en";
  tab_labels?: Record<string, string>;
  stations?: StationsOptions;
  header?: HeaderOptions;
  chart?: ChartOptions;
  cars?: CarsOptions;
  footer?: FooterOptions;
}

// --- Upstream API shapes, as surfaced on the HA sensor's `.attributes`. ---

export interface OpeningHours {
  day: string; // "MO" | "SA" | "SO" | "FE" etc.
  from: string; // "HH:MM"
  to: string; // "HH:MM" — "24:00" means closes at midnight next day
}

export interface PaymentMethods {
  cash?: boolean;
  debit_card?: boolean;
  credit_card?: boolean;
  others?: string[];
}

export interface StationLocation {
  address?: string;
  postalCode?: string | number;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface Station {
  name?: string;
  price?: number;
  open?: boolean;
  location?: StationLocation;
  // As-the-crow-flies distance (metres) from the reference point, stamped by
  // the coordinator. Absent when the station has no usable coordinates.
  distance_m?: number;
  opening_hours?: OpeningHours[];
  payment_methods?: PaymentMethods;
}

export interface TankstellenEntityAttributes {
  friendly_name?: string;
  fuel_type?: string;
  fuel_type_name?: string;
  stations?: Station[];
  average_price?: number;
  dynamic_mode?: boolean;
  // User-chosen friendly_name of the bound device_tracker (NOT its
  // entity_id — the integration scrubs the entity_id for privacy).
  // Used for the dynamic-mode tab subtitle and header chip.
  dynamic_tracker_label?: string;
  attribution?: string;
}

export interface TankstellenEntity {
  entity_id: string;
  state: string;
  attributes: TankstellenEntityAttributes;
  last_updated?: string;
}

// ---------------------------------------------------------------------------
// <ha-form> schema types
// ---------------------------------------------------------------------------
//
// These mirror the HA core editor types so the form editor stays
// strictly typed. The editor's expandables are not flattened: ha-form
// then keeps each one's values under `data[name]`, which is exactly the
// grouped YAML shape (`stations`, `chart`, ...).

export interface DeviceSelectorFilter {
  integration?: string;
  manufacturer?: string;
  model?: string;
  model_id?: string;
}

// Entity picker filter. Keys inside one object are ANDed; a list of objects
// is ORed. Matching is exact, case-sensitive string equality. `device` needs
// HA 2026.8+ — older frontends ignore the key, so the picker simply narrows
// less rather than erroring, which is safe under this repo's HA floor.
export interface EntitySelectorFilter {
  integration?: string;
  domain?: string | string[];
  device_class?: string | string[];
  supported_features?: string[];
  unit_of_measurement?: string | string[];
  device?: DeviceSelectorFilter;
}

// Filters belong under `filter`. The flat `domain` / `integration` /
// `device_class` keys are deprecated upstream (LegacyEntitySelector) and are
// dropped without warning when a `filter` key is present, so never mix them.
export interface EntitySelectorConfig {
  filter?: EntitySelectorFilter | ReadonlyArray<EntitySelectorFilter>;
  multiple?: boolean;
  reorder?: boolean;
  include_entities?: string[];
  exclude_entities?: string[];
}

export type HASelector =
  | { entity: EntitySelectorConfig }
  | { boolean: Record<string, never> }
  | { text: { type?: "text" | "password" | "url" | "email"; multiline?: boolean } }
  | {
      number: {
        min?: number;
        max?: number;
        step?: number;
        mode?: "box" | "slider";
        unit_of_measurement?: string;
      };
    }
  | {
      select: {
        mode?: "dropdown" | "list";
        multiple?: boolean;
        custom_value?: boolean;
        options: ReadonlyArray<{ value: string; label: string }>;
      };
    };

export interface HaFormBaseSchema {
  name: string;
  required?: boolean;
  // Shown while the key is unset; for a toggle, the state it draws.
  default?: unknown;
}

export interface HaFormSelectorSchema extends HaFormBaseSchema {
  selector: HASelector;
}

export interface HaFormExpandableSchema {
  type: "expandable";
  name: string;
  title?: string;
  /** MDI icon drawn before the title. */
  icon?: string;
  /** When true, ha-form keeps the inner schema's values flat in `data`
   *  instead of under `data[name]`. The editor leaves it off. */
  flatten?: boolean;
  schema: ReadonlyArray<HaFormSchema>;
}

export type HaFormSchema = HaFormSelectorSchema | HaFormExpandableSchema;

/** The names of the expandables a field sits in, outermost first. */
export interface HaFormPath {
  path?: string[];
}

// `<ha-form>` element shape — mirror the props the editor sets so
// `vp check` validates the template at compile time.
interface HaFormElement extends HTMLElement {
  hass?: HomeAssistant;
  data?: Record<string, unknown>;
  schema?: ReadonlyArray<HaFormSchema>;
  computeLabel?: (field: { name: string }, data?: unknown, options?: HaFormPath) => string;
  computeHelper?: (field: { name: string }, options?: HaFormPath) => string | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-form": HaFormElement;
  }
}
