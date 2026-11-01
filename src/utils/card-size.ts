import type { TankstellenAustriaCardConfig } from "../types";

// What the config alone can't say: how many fuel tabs, stations and matching
// cars there are, and whether the active entry is in dynamic mode (no
// sparkline). The card fills these in from hass when it has it.
export interface CardSizeFacts {
  entityCount: number;
  stationCount: number;
  carCount: number;
  dynamic: boolean;
}

// Heights in px, measured on the rendered card at a full section width
// (525 px, 2026-11-01). A narrow card wraps station names and runs taller,
// so these are the low end.
const BASE = 173; // padding, header, cheapest price and footer
const TABS = 45;
const HEADER_PRICE = 68;
const FOOTER = 41;
const SPARKLINE = 99;
const REFUEL_TIP = 19;
const CARS = 12; // the block's gap, once
const CAR = 46;
const STATION = 65;

// The card's natural height in px for this config. getCardSize() divides it
// by 50: HA turns that into the starting rows when "Fit height to content"
// is switched off, and masonry balances its columns with it.
export function estimateCardHeight(
  cfg: Partial<TankstellenAustriaCardConfig>,
  facts: CardSizeFacts,
): number {
  let px = BASE;
  if (facts.entityCount > 1) px += TABS;
  if (cfg.hide_header_price === true) px -= HEADER_PRICE;
  if (cfg.hide_attribution === true) px -= FOOTER;
  // Counted before the history arrives: HA asks for the size once, at
  // layout, and the sparkline shows up a moment later.
  if (cfg.show_history !== false && !facts.dynamic) {
    px += SPARKLINE;
    if (cfg.show_best_refuel !== false) px += REFUEL_TIP;
  }
  const carsShown =
    cfg.show_cars === true && (cfg.show_car_fillup !== false || cfg.show_car_consumption !== false);
  if (carsShown && facts.carCount > 0) px += CARS + CAR * facts.carCount;
  const maxStations = cfg.max_stations ?? 5;
  px += STATION * Math.min(maxStations, facts.stationCount);
  return px;
}
