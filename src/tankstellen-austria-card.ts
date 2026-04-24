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
import {
  CARD_VERSION,
  DYNAMIC_MANUAL_COOLDOWN_MS,
  HISTORY_REFRESH_MS,
} from "./const";
import { normaliseConfig } from "./utils/config";
import { findTankstellenEntities } from "./utils/entities";
import {
  hasPaymentMethods,
  matchesPaymentFilter,
  matchingPaymentMethods,
} from "./utils/payment";
import { isClosingSoon } from "./utils/station";
import { escHtml } from "./utils/html";
import { formatPrice, mapsUrl } from "./utils/price";
import {
  getFuelName,
  getWeekdays,
  localize,
  resolveLang,
  translate,
  type TranslateContext,
} from "./localize/localize";
import { fetchHistory, type HistoryPoint } from "./history";
import {
  attachSparklineHover,
  buildSparkline,
  type HourlyEnvelope,
} from "./sparkline";
import {
  analyzeBestRefuel,
  buildHourlyEnvelope,
  type BestRefuelResult,
} from "./analytics/best-refuel";
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
  @state() private _history: Record<string, HistoryPoint[]> = {};
  @state() private _versionMismatch: string | null = null;
  @state() private _lastManualRefresh = 0;
  @state() private _noNewData = false;
  // Incremented by the cooldown interval so the countdown re-renders each
  // second while a refresh is on cooldown. Reactive, but never read —
  // shouldUpdate gates on it via `changed.has("_cooldownTick")`.
  @state() private _cooldownTick = 0;

  // Non-reactive instance fields.
  private _initDone = false;
  private _historyInterval: number | undefined;
  private _cooldownInterval: number | undefined;
  private _sparklineCleanup: (() => void) | undefined;

  public setConfig(config: TankstellenAustriaCardConfig): void {
    this._config = normaliseConfig(config);
  }

  public getCardSize(): number {
    return 6;
  }

  public getGridOptions(): {
    columns: number | "full";
    rows: number | "auto";
    min_columns: number;
    min_rows: number;
  } {
    return {
      columns: 12,
      rows: "auto",
      min_columns: 6,
      min_rows: 4,
    };
  }

  // Fingerprint-based gate. The default `hasConfigOrEntityChanged` only
  // watches a single `config.entity`, which this multi-entity card doesn't
  // have. Re-render on: config change, UI state change, history arrival,
  // version-mismatch discovery, cooldown tick, or a tracked-entity state
  // object reference change. Without this gate the card re-renders on every
  // entity state change anywhere in the HA install.
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (
      changed.has("_config") ||
      changed.has("_activeTab") ||
      changed.has("_expandedStations") ||
      changed.has("_history") ||
      changed.has("_versionMismatch") ||
      changed.has("_lastManualRefresh") ||
      changed.has("_noNewData") ||
      changed.has("_cooldownTick")
    ) {
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

  // --- Lifecycle ---

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._historyInterval !== undefined) {
      clearInterval(this._historyInterval);
      this._historyInterval = undefined;
    }
    if (this._cooldownInterval !== undefined) {
      clearInterval(this._cooldownInterval);
      this._cooldownInterval = undefined;
    }
    if (this._sparklineCleanup) {
      this._sparklineCleanup();
      this._sparklineCleanup = undefined;
    }
    // Let the next updated() re-start the history interval. Matters during
    // dashboard edit mode which rapidly disconnects/reconnects the card.
    this._initDone = false;
  }

  protected updated(_changed: PropertyValues): void {
    // One-shot bootstrap on first hass arrival.
    if (!this._initDone && this.hass && this._config) {
      this._initDone = true;
      void this._fetchAllHistory();
      this._historyInterval = window.setInterval(() => {
        void this._fetchAllHistory();
      }, HISTORY_REFRESH_MS);
      void this._checkCardVersion();
    }
    // Re-wire sparkline hover after every render (cheap; entity may have
    // changed with a tab click).
    this._reattachSparklineHover();
  }

  private async _fetchAllHistory(): Promise<void> {
    try {
      const entities = this._resolveEntities();
      await Promise.all(
        entities.map(async (e) => {
          const points = await fetchHistory(this.hass, e.entity_id);
          this._history = { ...this._history, [e.entity_id]: points };
        }),
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[Tankstellen Austria] history refresh failed", err);
    }
  }

  private async _checkCardVersion(): Promise<void> {
    if (!this.hass?.callWS) return;
    try {
      const r = await this.hass.callWS<{ version?: string }>({
        type: "tankstellen_austria/card_version",
      });
      if (r?.version && r.version !== CARD_VERSION) {
        this._versionMismatch = r.version;
      }
    } catch {
      // Backend may not support this WS command yet — silent.
    }
  }

  private _reattachSparklineHover(): void {
    if (this._sparklineCleanup) {
      this._sparklineCleanup();
      this._sparklineCleanup = undefined;
    }
    const container = this.shadowRoot?.querySelector<HTMLElement>(
      ".sparkline-container[data-entity]",
    );
    if (!container) return;
    const weekdays = getWeekdays(this._ctx());
    const lang = resolveLang(this._ctx());
    const formatTime = (ts: number): string => {
      const d = new Date(ts);
      const wd = weekdays[d.getDay()]?.slice(0, 2) ?? "";
      const date =
        lang === "de"
          ? `${d.getDate()}.${d.getMonth() + 1}.`
          : `${d.getMonth() + 1}/${d.getDate()}`;
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${wd} ${date} ${hh}:${mm}`;
    };
    this._sparklineCleanup = attachSparklineHover(container, {
      formatTime,
      formatPrice,
    });
  }

  // --- Render ---

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
          ${this._renderVersionBanner()}
          <div class="empty">${this._t("no_data")}</div>
        </ha-card>
      `;
    }

    const active = entities[activeTab] ?? entities[0];

    return html`
      <ha-card>
        ${this._renderVersionBanner()}
        ${this._renderTabs(entities, activeTab)}
        ${this._renderHeader(active)}
        ${this._renderCars(active)}
        ${this._renderStationList(active, activeTab)}
      </ha-card>
    `;
  }

  private _renderVersionBanner(): TemplateResult | typeof nothing {
    if (!this._versionMismatch) return nothing;
    const msg = this._t("version_update", { v: this._versionMismatch });
    return html`
      <div class="version-notice" role="alert" aria-live="assertive">
        <span>${msg}</span>
        <button
          class="version-reload-btn"
          type="button"
          @click=${this._onVersionReload}
        >
          ${this._t("version_reload")}
        </button>
      </div>
    `;
  }

  private _renderTabs(
    entities: TankstellenEntity[],
    activeTab: number,
  ): TemplateResult | typeof nothing {
    if (entities.length <= 1) return nothing;
    const customLabels: Record<string, string> = this._config.tab_labels ?? {};
    return html`
      <div class="tabs" role="tablist">
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
          const selected = i === activeTab;
          return html`
            <button
              type="button"
              role="tab"
              class=${classMap({ tab: true, active: selected })}
              aria-selected=${selected ? "true" : "false"}
              tabindex=${selected ? "0" : "-1"}
              @click=${() => this._onTabClick(i)}
              @keydown=${(ev: KeyboardEvent) =>
                this._onTabKeydown(ev, i, entities.length)}
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
    const showHistory = this._config.show_history !== false;

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
        ${showHistory && !isDynamic ? this._renderSparkline(active) : nothing}
      </div>
    `;
  }

  private _renderDynamicHeader(active: TankstellenEntity): TemplateResult {
    const lastUpdated = active.last_updated
      ? new Date(active.last_updated).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    const remainingMs =
      DYNAMIC_MANUAL_COOLDOWN_MS - (Date.now() - this._lastManualRefresh);
    const cooling = remainingMs > 0;
    const countdownText = cooling
      ? (() => {
          const s = Math.ceil(remainingMs / 1000);
          return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
        })()
      : "";

    return html`
      <div class="dynamic-meta">
        <div class="dynamic-meta-inner" aria-live="polite">
          ${lastUpdated
            ? html`<span class="last-updated">${this._t("last_updated")} ${lastUpdated}</span>`
            : nothing}
          ${this._noNewData
            ? html`<span class="no-new-data" role="status">${this._t("no_new_data")}</span>`
            : nothing}
        </div>
      </div>
      <button
        class=${classMap({ "refresh-btn": true, cooling })}
        type="button"
        aria-label=${this._t("refresh")}
        aria-disabled=${cooling ? "true" : "false"}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" class="refresh-icon"></ha-icon>
        ${cooling ? countdownText : this._t("refresh")}
      </button>
    `;
  }

  private _renderSparkline(
    active: TankstellenEntity,
  ): TemplateResult | typeof nothing {
    const entityId = active.entity_id;
    const points = this._history[entityId] ?? [];
    if (points.length < 2) return nothing;

    const showMedianLine = this._config.show_median_line === true;
    const showHourEnvelope = this._config.show_hour_envelope === true;
    const showNoonMarkers = this._config.show_noon_markers === true;
    const envelope: HourlyEnvelope | null = showHourEnvelope
      ? buildHourlyEnvelope(points)
      : null;

    const showBestRefuel = this._config.show_best_refuel !== false;
    const analysis = showBestRefuel ? analyzeBestRefuel(points) : null;

    const result = buildSparkline({
      points,
      showMedianLine,
      showHourEnvelope,
      showNoonMarkers,
      hourEnvelope: envelope,
      analysis,
      translations: {
        min_label: this._t("min_label"),
        max_label: this._t("max_label"),
        last_7_days: this._t("last_7_days"),
        median_delta_below: this._t("median_delta_below"),
        median_delta_above: this._t("median_delta_above"),
        median_delta_equal: this._t("median_delta_equal"),
      },
    });
    if (result.template === nothing) return nothing;

    return html`
      <div
        class="sparkline-container"
        data-entity=${entityId}
        @click=${() => this._onSparklineClick(entityId)}
      >
        ${result.template}
        ${this._renderRecommendation(analysis)}
      </div>
    `;
  }

  private _renderRecommendation(
    analysis: BestRefuelResult | null,
  ): TemplateResult | typeof nothing {
    if (!analysis) return nothing;
    if (!analysis.hasEnoughData) {
      return html`
        <div class="refuel-hint">
          <ha-icon icon="mdi:information-outline" class="refuel-icon"></ha-icon>
          ${this._t("not_enough_data_hint")}
        </div>
      `;
    }
    const hour = analysis.hour ?? 0;
    const h1 = String(hour).padStart(2, "0");
    const h2 = String((hour + 1) % 24).padStart(2, "0");

    let text: string;
    if (analysis.weekday != null) {
      const weekdays = getWeekdays(this._ctx());
      const day = weekdays[analysis.weekday] ?? "";
      text = this._t("best_refuel_hour_weekday", { h1, h2, day });
    } else {
      text = this._t("best_refuel_hour", { h1, h2 });
    }

    const c = analysis.confidence;
    if (!c) {
      return html`
        <div class="refuel-recommendation">
          <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon"></ha-icon>
          <span class="refuel-text">${text}</span>
        </div>
      `;
    }

    const levelLabel = this._t(`confidence_${c.level}`);
    const tooltipLines: string[] = [
      `${this._t("confidence_title")}: ${levelLabel}`,
      `• ${this._t("confidence_span")}: ${c.span_days} ${this._t("confidence_days")}`,
      `• ${this._t("confidence_coverage")}: ${c.coverage_pct}%`,
      `• ${this._t("confidence_gap")}: ${c.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`,
    ];
    if (c.span_days < 14) {
      tooltipLines.push("", this._t("confidence_short_history_hint"));
    }
    const tooltip = escHtml(tooltipLines.join("\n"));
    const badgeClass = `refuel-confidence refuel-confidence-${c.level}`;

    return html`
      <div class="refuel-recommendation">
        <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon"></ha-icon>
        <span class="refuel-text">${text}</span>
        <span class=${badgeClass} title=${tooltip}>${levelLabel}</span>
      </div>
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
        ${cars.map((car) =>
          this._renderCarRow(car, effectiveCheapest, showCarFillup, showCarConsumption),
        )}
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

    // consumption-only mode — reuses .car-fillup-row styling
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

    const rowLabel = [
      s.name || "–",
      loc.city ?? "",
      formatPrice(s.price),
    ]
      .filter(Boolean)
      .join(", ");
    return html`
      <div class=${classMap({ station: true, "pm-highlight": highlighted })}>
        <div
          class="station-main"
          role=${hasDetail ? "button" : "group"}
          tabindex=${hasDetail ? "0" : "-1"}
          aria-expanded=${hasDetail ? (isExpanded ? "true" : "false") : nothing}
          aria-label=${rowLabel}
          @click=${() => this._onStationClick(key)}
          @keydown=${(ev: KeyboardEvent) =>
            this._onStationKeydown(ev, key, hasDetail)}
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
                  aria-label=${`${this._t("map")}: ${s.name ?? ""}`}
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

  // WAI-ARIA tab pattern: arrow keys move focus and activate; Home/End
  // jump to the first/last tab. After switching we focus the newly-active
  // tab so keyboard users see the focus ring follow their selection.
  private _onTabKeydown(ev: KeyboardEvent, index: number, count: number): void {
    let next = index;
    switch (ev.key) {
      case "ArrowRight":
        next = (index + 1) % count;
        break;
      case "ArrowLeft":
        next = (index - 1 + count) % count;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = count - 1;
        break;
      default:
        return;
    }
    ev.preventDefault();
    this._onTabClick(next);
    this.updateComplete.then(() => {
      const tabs = this.shadowRoot?.querySelectorAll<HTMLButtonElement>(
        '.tabs [role="tab"]',
      );
      tabs?.[next]?.focus();
    });
  }

  private _onStationClick(key: string): void {
    const next = new Set(this._expandedStations);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expandedStations = next;
  }

  private _onStationKeydown(
    ev: KeyboardEvent,
    key: string,
    hasDetail: boolean,
  ): void {
    if (!hasDetail) return;
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    this._onStationClick(key);
  }

  private _onMapLinkClick(e: Event): void {
    e.stopPropagation();
  }

  private _onSparklineClick(entityId: string): void {
    // Same behaviour as clicking a sensor in HA — open the more-info dialog.
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onRefresh(): void {
    if (!this.hass) return;
    const now = Date.now();
    if (now - this._lastManualRefresh < DYNAMIC_MANUAL_COOLDOWN_MS) return;
    this._lastManualRefresh = now;
    this._noNewData = false;

    const entities = this._resolveEntities();
    const active = entities[this._activeTab] ?? entities[0];
    const preRefreshTimestamp = active?.last_updated;

    for (const e of entities) {
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

    // After HA has had time to fetch, check if data actually changed.
    window.setTimeout(() => {
      try {
        const updated = this._resolveEntities();
        const updatedActive = updated[this._activeTab] ?? updated[0];
        if (updatedActive?.last_updated === preRefreshTimestamp) {
          this._noNewData = true;
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[Tankstellen Austria] post-refresh check failed", err);
      }
    }, 3000);

    // Per-second re-render so the countdown stays live.
    if (this._cooldownInterval !== undefined) {
      clearInterval(this._cooldownInterval);
    }
    this._cooldownInterval = window.setInterval(() => {
      if (Date.now() - this._lastManualRefresh >= DYNAMIC_MANUAL_COOLDOWN_MS) {
        if (this._cooldownInterval !== undefined) {
          clearInterval(this._cooldownInterval);
          this._cooldownInterval = undefined;
        }
      }
      this._cooldownTick = (this._cooldownTick + 1) % 1_000_000;
    }, 1000);
  }

  private async _onVersionReload(): Promise<void> {
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      // caches API requires HTTPS in some contexts; fall through to reload.
    }
    location.reload();
  }

  static styles: CSSResultGroup = cardStyles;
}
