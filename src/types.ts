import type {
  ActionConfig,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";

// Register your editor element + the built-in error card with the global
// HTMLElementTagNameMap so TypeScript autocompletes them in templates.
declare global {
  interface HTMLElementTagNameMap {
    "tankstellen-austria-card-editor": LovelaceCardEditor;
    "hui-error-card": LovelaceCard;
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
  show_map_links?: boolean;
  show_opening_hours?: boolean;
  show_payment_methods?: boolean;
  show_history?: boolean;
  show_best_refuel?: boolean;
  show_median_line?: boolean;
  show_hour_envelope?: boolean;
  show_noon_markers?: boolean;

  payment_filter?: string[];
  payment_highlight_mode?: boolean;

  tab_labels?: Record<string, string>;

  show_cars?: boolean;
  show_car_fillup?: boolean;
  show_car_consumption?: boolean;
  cars?: CarConfig[];

  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
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
  opening_hours?: OpeningHours[];
  payment_methods?: PaymentMethods;
}

export interface TankstellenEntityAttributes {
  friendly_name?: string;
  fuel_type?: FuelType | string;
  fuel_type_name?: string;
  stations?: Station[];
  average_price?: number;
  dynamic_mode?: boolean;
  dynamic_entity?: string;
}

export interface TankstellenEntity {
  entity_id: string;
  state: string;
  attributes: TankstellenEntityAttributes;
  last_updated?: string;
}
