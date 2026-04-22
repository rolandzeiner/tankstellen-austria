// Tankstellen Austria — Lovelace custom card
// https://github.com/rolandzeiner/tankstellen-austria
//
// Architecture: Lit 3 + Shadow DOM + Rollup, single-file HACS bundle.
// Built from the ha-lovelace-card skill (which is faithfully derived from
// custom-cards/boilerplate-card).

import {
  LitElement,
  html,
  nothing,
  type TemplateResult,
  type PropertyValues,
  type CSSResultGroup,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { HomeAssistant, LovelaceCardEditor } from "custom-card-helpers";

import type {
  CarConfig,
  OpeningHours,
  PaymentMethods,
  Station,
  TankstellenAustriaCardConfig,
  TankstellenEntity,
} from "./types";
import { CARD_VERSION } from "./const";
import { normaliseConfig } from "./utils/config";
import { findTankstellenEntities } from "./utils/entities";
import {
  hasPaymentMethods,
  matchesPaymentFilter,
  matchingPaymentMethods,
} from "./utils/payment";
import { isClosingSoon } from "./utils/station";
import { formatPrice, mapsUrl } from "./utils/price";
import {
  getFuelName,
  localize,
  translate,
  type TranslateContext,
} from "./localize/localize";
import { cardStyles } from "./styles";

// Eager-register the editor element. With `inlineDynamicImports: true` the
// editor code is already in this bundle — importing it at the top guarantees
// `customElements.define(…)` has run before `getConfigElement()` creates the
// element, avoiding a race where HA creates an unregistered element.
import "./editor";

// Styled console banner for version-mismatch debugging in HA's console.
console.info(
  `%c  Tankstellen Austria Card  %c  ${localize("common.version")} ${CARD_VERSION}  `,
  "color: white; font-weight: bold; background: #DC2026",
  "color: white; font-weight: bold; background: dimgray",
);

interface WindowWithCustomCards extends Window {
  customCards: Array<{
    type: string;
    name: string;
    description: string;
    preview?: boolean;
    documentationURL?: string;
  }>;
}

(window as unknown as WindowWithCustomCards).customCards =
  (window as unknown as WindowWithCustomCards).customCards || [];
(window as unknown as WindowWithCustomCards).customCards.push({
  type: "tankstellen-austria-card",
  name: "Tankstellen Austria",
  description:
    "Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",
  preview: true,
  documentationURL: "https://github.com/rolandzeiner/tankstellen-austria",
});

@customElement("tankstellen-austria-card")
export class TankstellenAustriaCard extends LitElement {
  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement(
      "tankstellen-austria-card-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant | undefined): Record<string, unknown> {
    const entities = findTankstellenEntities(hass);
    return {
      entities: entities.length ? [entities[0]] : [],
      max_stations: 5,
      show_map_links: true,
      show_opening_hours: true,
      show_payment_methods: true,
      show_history: true,
      show_best_refuel: true,
      payment_filter: [],
      payment_highlight_mode: true,
      show_cars: false,
      cars: [],
    };
  }

  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: TankstellenAustriaCardConfig;
  @state() private _activeTab = 0;
  @state() private _expandedStations: Set<string> = new Set();

  public setConfig(config: TankstellenAustriaCardConfig): void {
    this._config = normaliseConfig(config);
  }

  public getCardSize(): number {
    return 6;
  }

  // Fingerprint-based gate. The default `hasConfigOrEntityChanged` only watches
  // a single `config.entity`, which this multi-entity card doesn't have. We
  // re-render when:
  //   • the config object itself changes (editor save)
  //   • the user switches tab or toggles a station detail
  //   • any *tracked* entity's state-object reference changes
  //     (HA state objects are immutable — a new object means new data)
  // Without this gate the card re-renders on every entity state change
  // anywhere in the HA install, which is a measurable CPU drag on busy
  // installs.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (changed.has("_config")) return true;
    if (changed.has("_activeTab") || changed.has("_expandedStations")) {
      return true;
    }
    const prev = changed.get("hass") as HomeAssistant | undefined;
    if (!prev) return true;
    const eids = this._trackedEntityIds();
    return eids.some((eid) => prev.states[eid] !== this.hass.states[eid]);
  }

  private _trackedEntityIds(): string[] {
    if (this._config.entities?.length) return this._config.entities;
    return findTankstellenEntities(this.hass);
  }

  private _resolveEntities(): TankstellenEntity[] {
    if (!this.hass) return [];
    const ids = this._trackedEntityIds();
    return ids
      .map((eid): TankstellenEntity | null => {
        const state = this.hass.states[eid];
        if (!state) return null;
        return {
          entity_id: eid,
          state: state.state,
          attributes: state.attributes as TankstellenEntity["attributes"],
          last_updated: state.last_updated,
        };
      })
      .filter((e): e is TankstellenEntity => e !== null);
  }

  private _ctx(): TranslateContext {
    return {
      configLanguage: this._config?.language,
      hassLanguage: this.hass?.language,
    };
  }

  private _t(key: string, replacements?: Record<string, string>): string {
    return translate(`card.${key}`, this._ctx(), replacements);
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html`<ha-card></ha-card>`;
    }

    const entities = this._resolveEntities();
    const activeTab =
      this._activeTab >= entities.length ? 0 : this._activeTab;

    if (!entities.length) {
      return html`
        <ha-card>
          <div class="empty">${this._t("no_data")}</div>
        </ha-card>
      `;
    }

    const active = entities[activeTab] ?? entities[0];

    return html`
      <ha-card>
        ${this._renderTabs(entities, activeTab)}
        ${this._renderHeader(active)}
        ${this._renderCars(active)}
        ${this._renderStationList(active, activeTab)}
      </ha-card>
    `;
  }

  private _renderTabs(
    entities: TankstellenEntity[],
    activeTab: number,
  ): TemplateResult | typeof nothing {
    if (entities.length <= 1) return nothing;
    const customLabels: Record<string, string> = this._config.tab_labels ?? {};
    return html`
      <div class="tabs">
        ${entities.map((e, i) => {
          const custom = customLabels[e.entity_id];
          let label: string;
          if (typeof custom === "string" && custom.trim().length > 0) {
            label = custom;
          } else {
            const ft = e.attributes.fuel_type ?? "";
            label = getFuelName(ft, this._ctx());
            if (e.attributes.dynamic_mode === true) {
              const trackerId = e.attributes.dynamic_entity;
              const trackerName = trackerId
                ? this.hass.states[trackerId]?.attributes?.friendly_name ||
                  trackerId.split(".")[1]
                : null;
              if (trackerName) label += ` · ${trackerName}`;
            }
          }
          return html`
            <button
              class=${classMap({ tab: true, active: i === activeTab })}
              @click=${() => this._onTabClick(i)}
            >
              ${label}
            </button>
          `;
        })}
      </div>
    `;
  }

  private _renderHeader(
    active: TankstellenEntity,
  ): TemplateResult | typeof nothing {
    const stations: Station[] = active.attributes.stations ?? [];
    if (!stations.length) return nothing;

    const fuelType = active.attributes.fuel_type ?? "";
    const fuelTypeName =
      active.attributes.fuel_type_name || getFuelName(fuelType, this._ctx());
    const avgPrice = active.attributes.average_price;
    const cheapest = stations[0]?.price;
    const isDynamic = active.attributes.dynamic_mode === true;

    return html`
      <div class="card-header">
        <div class="header-top">
          <div class="fuel-label">
            <ha-icon icon="mdi:gas-station" class="fuel-icon"></ha-icon>
            <span>${fuelTypeName}</span>
          </div>
          ${isDynamic
            ? this._renderDynamicHeader(active)
            : html`
                <div class="header-prices">
                  <div class="header-price-item">
                    <span class="header-price-label">${this._t("cheapest")}</span>
                    <span class="header-price-value">${formatPrice(cheapest)}</span>
                  </div>
                  ${avgPrice != null
                    ? html`
                        <div class="header-price-item">
                          <span class="header-price-label">${this._t("average")}</span>
                          <span class="header-price-value avg">${formatPrice(avgPrice)}</span>
                        </div>
                      `
                    : nothing}
                </div>
              `}
        </div>
      </div>
    `;
  }

  // Minimal dynamic-mode header — refresh button + last-updated.
  // B5.3 adds the cooldown countdown and the _noNewData hint.
  private _renderDynamicHeader(active: TankstellenEntity): TemplateResult {
    const lastUpdated = active.last_updated
      ? new Date(active.last_updated).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";
    return html`
      <div class="dynamic-meta">
        <div class="dynamic-meta-inner">
          ${lastUpdated
            ? html`<span class="last-updated">${this._t("last_updated")} ${lastUpdated}</span>`
            : nothing}
        </div>
      </div>
      <button class="refresh-btn" @click=${this._onRefresh}>
        <ha-icon icon="mdi:refresh" class="refresh-icon"></ha-icon>
        ${this._t("refresh")}
      </button>
    `;
  }

  private _renderCars(active: TankstellenEntity): TemplateResult | typeof nothing {
    const stations: Station[] = active.attributes.stations ?? [];
    if (!stations.length) return nothing;

    const showCars = this._config.show_cars === true;
    const showCarFillup = this._config.show_car_fillup !== false;
    const showCarConsumption = this._config.show_car_consumption !== false;
    if (!showCars || (!showCarFillup && !showCarConsumption)) return nothing;

    const fuelType = active.attributes.fuel_type ?? "";
    const paymentFilter = this._config.payment_filter ?? [];
    const highlightMode = this._config.payment_highlight_mode === true;

    // Cars must match the *active* fuel type. Backed by the full config list.
    const rawCars: CarConfig[] = (this._config.cars ?? []).filter(
      (c) => c.fuel_type === fuelType && c.tank_size > 0 && c.name,
    );
    const cars = showCarFillup
      ? rawCars
      : rawCars.filter((c) => Number(c.consumption) > 0);
    if (!cars.length) return nothing;

    // In filter mode use cheapest visible station (post-filter). In
    // highlight mode all stations are visible, so use overall cheapest.
    const filteredStations = highlightMode
      ? stations
      : stations.filter((s) => matchesPaymentFilter(s, paymentFilter));
    const effectiveCheapest = highlightMode
      ? stations[0]?.price
      : filteredStations[0]?.price;

    return html`
      <div class="cars-fillup">
        ${cars.map((car) => this._renderCarRow(car, effectiveCheapest, showCarFillup, showCarConsumption))}
      </div>
    `;
  }

  private _renderCarRow(
    car: CarConfig,
    cheapest: number | undefined,
    showCarFillup: boolean,
    showCarConsumption: boolean,
  ): TemplateResult {
    const consumption = Number(car.consumption);
    const consumptionStr =
      Number.isFinite(consumption) && consumption > 0
        ? consumption.toFixed(1).replace(".", ",")
        : "";

    if (showCarFillup) {
      const costStr =
        cheapest != null
          ? `€ ${(cheapest * Number(car.tank_size)).toFixed(2).replace(".", ",")}`
          : "–";
      const per100Str =
        cheapest != null && consumption > 0
          ? `€ ${(cheapest * consumption).toFixed(2).replace(".", ",")}`
          : "–";
      return html`
        <div class="car-fillup-row">
          <span class="car-fillup-name">
            <ha-icon icon=${car.icon || "mdi:car"} class="car-icon"></ha-icon>
            ${car.name}
            <span class="car-fillup-liters">${car.tank_size} L</span>
          </span>
          <span class="car-fillup-cost">${costStr}</span>
        </div>
        ${showCarConsumption && consumption > 0
          ? html`
              <div class="car-per100-row">
                <span class="car-per100-label">${consumptionStr} l/100 km</span>
                <span class="car-per100-cost">${per100Str} / 100 km</span>
              </div>
            `
          : nothing}
      `;
    }

    // consumption-only mode: reuses .car-fillup-row styling
    const per100Str =
      cheapest != null
        ? `€ ${(cheapest * consumption).toFixed(2).replace(".", ",")}`
        : "–";
    return html`
      <div class="car-fillup-row">
        <span class="car-fillup-name">
          <ha-icon icon=${car.icon || "mdi:car"} class="car-icon"></ha-icon>
          ${car.name}
          <span class="car-fillup-liters">${consumptionStr} l/100 km</span>
        </span>
        <span class="car-fillup-cost">${per100Str} / 100 km</span>
      </div>
    `;
  }

  private _renderStationList(
    active: TankstellenEntity,
    activeTab: number,
  ): TemplateResult | typeof nothing {
    const stations: Station[] = active.attributes.stations ?? [];
    const parsedMax = parseInt(String(this._config.max_stations), 10);
    const maxStations = Number.isFinite(parsedMax)
      ? Math.max(0, Math.min(5, parsedMax))
      : 5;
    const paymentFilter = this._config.payment_filter ?? [];
    const highlightMode = this._config.payment_highlight_mode === true;

    const filtered = highlightMode
      ? stations
      : stations.filter((s) => matchesPaymentFilter(s, paymentFilter));

    // 0 hides the station list entirely — don't show a fallback message.
    if (maxStations === 0) return nothing;

    if (!filtered.length && paymentFilter.length && stations.length) {
      return html`
        <div class="empty">
          ${this._t("payment_filter_active")} — ${this._t("no_data")}
        </div>
      `;
    }
    if (!filtered.length) {
      return html`<div class="empty">${this._t("no_data")}</div>`;
    }

    const display = filtered.slice(0, maxStations);
    return html`
      <div class="stations">
        ${display.map((s, idx) =>
          this._renderStation(s, idx, activeTab, paymentFilter, highlightMode),
        )}
      </div>
    `;
  }

  private _renderStation(
    s: Station,
    idx: number,
    activeTab: number,
    paymentFilter: readonly string[],
    highlightMode: boolean,
  ): TemplateResult {
    const showMapLinks = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showPayment = this._config.show_payment_methods !== false;
    const loc = s.location ?? {};

    const key = `${activeTab}-${idx}`;
    const isExpanded = this._expandedStations.has(key);
    const isClosed = s.open === false;
    const isClosingSoonFlag = !isClosed && isClosingSoon(s);

    const highlighted =
      highlightMode &&
      paymentFilter.length > 0 &&
      matchesPaymentFilter(s, paymentFilter);
    const matchChips = highlighted
      ? matchingPaymentMethods(s, paymentFilter, {
          cash: this._t("cash"),
          debit_card: this._t("debit_card"),
          credit_card: this._t("credit_card"),
        })
      : [];

    const hasHoursBlock = showHours && !!s.opening_hours?.length;
    const hasPaymentBlock = showPayment && hasPaymentMethods(s.payment_methods);
    const hasDetail = hasHoursBlock || hasPaymentBlock;

    return html`
      <div class=${classMap({ station: true, "pm-highlight": highlighted })}>
        <div
          class="station-main"
          @click=${() => this._onStationClick(key)}
        >
          <div class="rank">${idx + 1}</div>
          <div class="info">
            <div class="name">
              ${s.name || "–"}
              ${isClosed
                ? html`<span class="badge closed">${this._t("closed")}</span>`
                : isClosingSoonFlag
                  ? html`<span class="badge closing-soon">${this._t("closing_soon")}</span>`
                  : nothing}
              ${matchChips.map(
                (m) => html`<span class="pm-match-chip">${m}</span>`,
              )}
            </div>
            <div class="address">
              ${loc.postalCode ?? ""} ${loc.city ?? ""},
              ${loc.address ?? ""}
            </div>
          </div>
          <div class="price">${formatPrice(s.price)}</div>
          ${showMapLinks
            ? html`
                <a
                  class="map-link"
                  href=${mapsUrl(loc, s.name ?? "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  title=${this._t("map")}
                  @click=${this._onMapLinkClick}
                >
                  <ha-icon
                    icon=${/\d/.test(loc.address ?? "") ? "mdi:map-marker" : "mdi:magnify"}
                    class="map-icon"
                  ></ha-icon>
                </a>
              `
            : nothing}
        </div>
        ${hasDetail
          ? html`
              <div class=${classMap({ "station-detail": true, expanded: isExpanded })}>
                <div class="detail-cols">
                  ${hasHoursBlock
                    ? html`<div class="detail-col">${this._renderHours(s.opening_hours ?? [])}</div>`
                    : nothing}
                  ${hasPaymentBlock
                    ? html`<div class="detail-col">${this._renderPaymentMethods(s.payment_methods)}</div>`
                    : nothing}
                </div>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderHours(hours: OpeningHours[]): TemplateResult {
    // E-Control groups Mon-Fri under "MO". Fall back to positional indexing
    // when the day code isn't set (old feed shape).
    const mo = hours.find((h) => h.day === "MO") ?? hours[0];
    const sa = hours.find((h) => h.day === "SA") ?? hours[5];
    const so = hours.find((h) => h.day === "SO") ?? hours[6];
    const fe = hours.find((h) => h.day === "FE");
    return html`
      <div class="hours-grid">
        ${mo
          ? html`<span class="day">${this._t("mon_fri")}</span><span>${mo.from} – ${mo.to}</span>`
          : nothing}
        ${sa
          ? html`<span class="day">${this._t("sat")}</span><span>${sa.from} – ${sa.to}</span>`
          : nothing}
        ${so
          ? html`<span class="day">${this._t("sun")}</span><span>${so.from} – ${so.to}</span>`
          : nothing}
        ${fe
          ? html`<span class="day">${this._t("holiday")}</span><span>${fe.from} – ${fe.to}</span>`
          : nothing}
      </div>
    `;
  }

  private _renderPaymentMethods(
    pm: PaymentMethods | undefined,
  ): TemplateResult | typeof nothing {
    if (!pm) return nothing;
    const badges: TemplateResult[] = [];
    if (pm.cash) {
      badges.push(html`
        <span class="pm-badge">
          <ha-icon icon="mdi:cash" class="pm-icon"></ha-icon>
          ${this._t("cash")}
        </span>
      `);
    }
    if (pm.debit_card) {
      badges.push(html`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon>
          ${this._t("debit_card")}
        </span>
      `);
    }
    if (pm.credit_card) {
      badges.push(html`
        <span class="pm-badge">
          <ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon>
          ${this._t("credit_card")}
        </span>
      `);
    }
    for (const other of pm.others ?? []) {
      badges.push(html`<span class="pm-badge pm-other">${other}</span>`);
    }
    if (!badges.length) return nothing;
    return html`
      <div class="pm-section">
        <div class="pm-label">${this._t("payment")}</div>
        <div class="pm-badges">${badges}</div>
      </div>
    `;
  }

  // --- Event handlers ---

  private _onTabClick(index: number): void {
    if (this._activeTab === index) return;
    this._activeTab = index;
    // New Set so Lit's shouldUpdate sees a reference change and re-renders.
    this._expandedStations = new Set();
  }

  private _onStationClick(key: string): void {
    const next = new Set(this._expandedStations);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expandedStations = next;
  }

  private _onMapLinkClick(e: Event): void {
    // Don't expand the station row when the user clicks the map icon.
    e.stopPropagation();
  }

  // B5.3 will layer cooldown + _noNewData tracking on top. For now fire
  // update_entity for every resolved entity (what the vanilla card does at
  // the top of _handleRefresh).
  private _onRefresh(): void {
    if (!this.hass) return;
    for (const e of this._resolveEntities()) {
      const p = this.hass.callService("homeassistant", "update_entity", {
        entity_id: e.entity_id,
      });
      if (p && typeof (p as Promise<void>).catch === "function") {
        (p as Promise<void>).catch((err) => {
          // eslint-disable-next-line no-console
          console.warn(
            "[Tankstellen Austria] update_entity failed for",
            e.entity_id,
            err,
          );
        });
      }
    }
  }

  static styles: CSSResultGroup = cardStyles;
}
