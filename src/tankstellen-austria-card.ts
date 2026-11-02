// Tankstellen Austria — Lovelace custom card
// https://github.com/rolandzeiner/tankstellen-austria
//
// Architecture: Lit 3 + Shadow DOM + Vite+, single-file HACS bundle.
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
import { styleMap } from "lit/directives/style-map.js";

import type {
  CarConfig,
  HomeAssistant,
  LovelaceCardEditor,
  OpeningHours,
  PaymentMethods,
  Station,
  TankstellenAustriaCardConfig,
  TankstellenCardYaml,
  TankstellenEntity,
} from "./types";
import {
  CARD_VERSION,
  DYNAMIC_MANUAL_COOLDOWN_MS,
  POST_REFRESH_CHECK_MS,
  HISTORY_REFRESH_MS,
} from "./const";
import { brandTile } from "./utils/brand";
import { estimateCardHeight } from "./utils/card-size";
import { fromGrouped, normaliseConfig, toGrouped } from "./utils/config";
import { findTankstellenEntities, fuelTypeOf } from "./utils/entities";
import { hasPaymentMethods, matchesPaymentFilter, matchingPaymentMethods } from "./utils/payment";
import { isClosingSoon } from "./utils/station";
import { formatDistance, formatPrice, formatPriceShort, mapsUrl } from "./utils/price";
import { API_STATUS_RECHECK_MS, fetchApiMaintenance } from "./utils/api-status";
import {
  getFuelName,
  getWeekdays,
  resolveLang,
  translate,
  type TranslateContext,
} from "./localize/localize";
import { appendCachedPoint, fetchHistory, getCachedHistory, type HistoryPoint } from "./history";
import { hasSparklineData } from "./sparkline";
import type { SparklineTranslations } from "./sparkline-element";
import "./sparkline-element";
import { resolveTimeZone, useAmPm } from "./utils/tz";
import {
  analyzeBestRefuel,
  buildHourlyEnvelope,
  type BestRefuelResult,
  type DayFacts,
  type HourlyEnvelope,
} from "./analytics/best-refuel";
import { cardStyles } from "./styles";
import { checkCardVersionWS, renderVersionBanner, reloadAfterCacheWipe } from "./shared-render";
import {
  detectNavPlatform,
  E_CONTROL_HOMEPAGE,
  E_CONTROL_LOGO_URL,
  resolveMapLinkKind,
  safeHttpsUri,
  safeNavUri,
} from "./utils";

// Eager-register the editor element. With `inlineDynamicImports: true` the
// editor code is already in this bundle — importing it at the top guarantees
// `customElements.define(…)` has run before `getConfigElement()` creates the
// element, avoiding a race where HA creates an unregistered element.
import "./editor";

// E-Control attribution string (§3 attribution practice). Hard-coded as a
// fallback so the footer stays correct even when a user-built template
// sensor strips the upstream `attribution` attribute. Mirrors the
// Ladestellen Austria card.
const ATTRIBUTION_REQUIRED = "Datenquelle: E-Control";

interface WindowWithCustomCards extends Window {
  customCards: Array<{
    type: string;
    name: string;
    description: string;
    preview?: boolean;
    documentationURL?: string;
    // Opt into the 2026.6 entity-first card picker. Additive key older HA
    // ignores; returns a one-entity stub for this integration's own sensors
    // (the user can extend `entities` afterwards).
    getEntitySuggestion?: (
      hass: HomeAssistant,
      entityId: string,
    ) => { config: Record<string, unknown> } | null;
  }>;
}

(window as unknown as WindowWithCustomCards).customCards =
  (window as unknown as WindowWithCustomCards).customCards || [];
(window as unknown as WindowWithCustomCards).customCards.push({
  type: "tankstellen-austria-card",
  name: "Tankstellen Austria",
  description: "Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",
  preview: true,
  documentationURL: "https://github.com/rolandzeiner/tankstellen-austria",
  getEntitySuggestion: (hass: HomeAssistant, entityId: string) => {
    if (!entityId.startsWith("sensor.")) return null;
    if (hass?.entities?.[entityId]?.platform !== "tankstellen_austria") return null;
    return {
      config: {
        type: "custom:tankstellen-austria-card",
        entities: [entityId],
      },
    };
  },
});

@customElement("tankstellen-austria-card")
export class TankstellenAustriaCard extends LitElement {
  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement("tankstellen-austria-card-editor");
  }

  public static getStubConfig(hass: HomeAssistant | undefined): Record<string, unknown> {
    const entities = findTankstellenEntities(hass);
    // Only what differs from the defaults: a new card shows the distance
    // and highlights payment-filter matches instead of hiding the rest.
    return {
      entities: entities.length ? [entities[0]] : [],
      stations: { distance: true, payment_mode: "highlight" },
    };
  }

  @property({ attribute: false }) public hass!: HomeAssistant;

  // Set by HA: "grid" in a sections view and the edit-card dialog, "panel"
  // in a panel view, unset in the add-card picker and masonry. Reflected so
  // the styles fill the cell only when there is one -- see the grid-cell
  // rules in styles.ts.
  @property({ reflect: true }) public layout?: string;

  // Set by HA to true while the card is the live preview in the edit-card
  // dialog. The version banner stays out of it: its Reload button would
  // reload the page and throw away the edit in progress.
  @property({ type: Boolean }) public preview = false;

  @state() private _config!: TankstellenAustriaCardConfig;
  @state() private _activeTab = 0;
  @state() private _expandedStations: Set<string> = new Set();
  @state() private _history: Record<string, HistoryPoint[]> = {};
  @state() private _versionMismatch: string | null = null;
  @state() private _lastManualRefresh = 0;
  @state() private _noNewData = false;
  @state() private _historyError = false;
  // E-Control maintenance, as reported by the backend. Only polled while an
  // entity the card shows is unavailable — see _syncApiStatus.
  @state() private _apiMaintenance = false;
  // Incremented by the cooldown interval so the countdown re-renders each
  // second while a refresh is on cooldown. Reactive, but never read —
  // shouldUpdate gates on it via `changed.has("_cooldownTick")`.
  @state() private _cooldownTick = 0;

  // Non-reactive instance fields.
  private _initDone = false;
  private _historyInterval: number | undefined;
  private _cooldownInterval: number | undefined;
  // Manual-refresh post-fetch check (3s after the update_entity calls) and
  // the reduce-motion cooldown wake-up are one-shot setTimeouts. Stored on
  // the instance so disconnectedCallback can cancel them — otherwise a
  // dashboard edit-mode flip leaves a pending callback that fires against
  // a detached element and writes to a now-unobserved reactive prop.
  private _postRefreshTimeout: number | undefined;
  private _cooldownTimeout: number | undefined;
  // The 28-day analytics behind the chart, computed once per history
  // array and zone; every other re-render reuses them.
  private _analysisMemo:
    | {
        points: HistoryPoint[];
        timeZone: string;
        envelope?: HourlyEnvelope | null;
        analysis?: BestRefuelResult | null;
      }
    | undefined;
  private _sparklineI18n: { lang: string; strings: SparklineTranslations } | undefined;
  private _apiStatusInterval: number | undefined;

  public setConfig(config: TankstellenCardYaml): void {
    if (!config || typeof config !== "object" || Array.isArray(config)) {
      throw new Error("tankstellen-austria-card: config must be an object");
    }
    // entities is optional (auto-discovery fallback), but if provided it
    // must be a string or string[] — silently dropping a typo'd shape
    // hides the misconfiguration behind the empty-state.
    const ent = (config as Record<string, unknown>).entities;
    if (ent !== undefined && typeof ent !== "string" && !Array.isArray(ent)) {
      throw new Error(
        "tankstellen-austria-card: config.entities must be a string or array of entity IDs",
      );
    }
    // v1's flat keys go through the groups too, so both shapes render alike.
    this._config = normaliseConfig(fromGrouped(toGrouped(config)));
    // Editor-preview rebuilds the card instance on every config change.
    // Without this seed, each rebuild starts with empty `_history` and
    // the sparkline returns `nothing` until the async `_fetchAllHistory`
    // completes — visible flicker. The module-scope cache in history.ts
    // survives across instances, so reading it synchronously here means
    // the FIRST render of a fresh instance already has data.
    if (this._config.entities) {
      const seed: Record<string, HistoryPoint[]> = {};
      let any = false;
      for (const eid of this._config.entities) {
        const cached = getCachedHistory(eid);
        if (cached.length >= 2) {
          seed[eid] = cached;
          any = true;
        }
      }
      if (any) this._history = { ...this._history, ...seed };
    }
  }

  // In 50 px units, from the config and whatever hass already says. See
  // estimateCardHeight for what HA does with it.
  public getCardSize(): number {
    const cfg: Partial<TankstellenAustriaCardConfig> = this._config ?? {};
    const entities = this.hass && this._config ? this._resolveEntities() : [];
    const active = entities[this._activeTab] ?? entities[0];
    const fuelType = active
      ? fuelTypeOf(this.hass, active.entity_id, active.attributes)
      : undefined;
    const cars = (cfg.cars ?? []).filter((c) => fuelType === undefined || c.fuel_type === fuelType);
    const px = estimateCardHeight(cfg, {
      entityCount: Math.max(1, entities.length),
      stationCount: active?.attributes.stations?.length ?? 5,
      carCount: cars.length,
      dynamic: active?.attributes.dynamic_mode === true,
    });
    return Math.ceil(px / 50);
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

  // Render gate. Lit re-renders on every `hass` assignment, and HA assigns a
  // new `hass` for every state change anywhere in the install. Re-render
  // only on: config change, UI state change, history arrival, a history or
  // maintenance notice changing, version-mismatch discovery, cooldown tick,
  // a layout or preview change from HA, or a new state object for an entity
  // this card tracks.
  protected override shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return false;
    if (
      changed.has("_config") ||
      changed.has("_activeTab") ||
      changed.has("_expandedStations") ||
      changed.has("_history") ||
      changed.has("_historyError") ||
      changed.has("_apiMaintenance") ||
      changed.has("_versionMismatch") ||
      changed.has("_lastManualRefresh") ||
      changed.has("_noNewData") ||
      changed.has("_cooldownTick")
    ) {
      return true;
    }
    // Lit writes reflected attributes in update(), so returning false in the
    // cycle that changes layout leaves the attribute stale until some later
    // change gets through, and the grid-cell rules in styles.ts don't match
    // until then. preview hides the version banner.
    if (changed.has("layout") || changed.has("preview")) return true;
    const prev = changed.get("hass") as HomeAssistant | undefined;
    if (!prev) return true;
    // A language switch changes no entity state; without this the card keeps
    // the old language until its sensor next updates.
    if (prev.language !== this.hass.language) return true;
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
        const stateObj = this.hass.states[eid];
        if (!stateObj) return null;
        return {
          entity_id: eid,
          state: stateObj.state,
          attributes: stateObj.attributes,
          last_updated: stateObj.last_updated,
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

  public override connectedCallback(): void {
    super.connectedCallback();
    // disconnectedCallback stops the status poll; a dashboard edit-mode flip
    // reconnects without a tracked state change, so restart it from here.
    if (this.hass && this._config) this._syncApiStatus();
    // updated() restarts the history interval, and a reconnect alone
    // changes nothing that would run it.
    if (!this._initDone) this.requestUpdate();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopApiStatusPoll();
    if (this._historyInterval !== undefined) {
      clearInterval(this._historyInterval);
      this._historyInterval = undefined;
    }
    if (this._cooldownInterval !== undefined) {
      clearInterval(this._cooldownInterval);
      this._cooldownInterval = undefined;
    }
    if (this._postRefreshTimeout !== undefined) {
      clearTimeout(this._postRefreshTimeout);
      this._postRefreshTimeout = undefined;
    }
    if (this._cooldownTimeout !== undefined) {
      clearTimeout(this._cooldownTimeout);
      this._cooldownTimeout = undefined;
    }
    // Let updated() re-start the history interval on reconnect. Matters
    // during dashboard edit mode which rapidly disconnects/reconnects the
    // card.
    this._initDone = false;
  }

  protected override willUpdate(changed: PropertyValues): void {
    // shouldUpdate only lets a hass change through when a tracked entity's
    // state moved, which is when availability can have flipped, or when the
    // language changed, where the re-check is a cheap no-op.
    if (changed.has("hass")) {
      this._syncApiStatus();
      this._appendLiveStates(changed.get("hass") as HomeAssistant | undefined);
    }
  }

  /**
   * A new sensor state is also the newest history point. Append it as it
   * lands, so the chart shows a price change within seconds rather than
   * at the next 30-minute refetch; the refetch then reconciles. Only a
   * changed value counts, as in the recorder's significant changes.
   */
  private _appendLiveStates(prev: HomeAssistant | undefined): void {
    if (!prev) return;
    let next: Record<string, HistoryPoint[]> | undefined;
    for (const eid of this._trackedEntityIds()) {
      const cur = this.hass.states[eid];
      if (!cur || cur === prev.states[eid]) continue;
      const points = this._history[eid];
      if (!points?.length) continue;
      const value = Number(cur.state);
      const time = new Date(cur.last_changed ?? cur.last_updated).getTime();
      if (!Number.isFinite(value) || !Number.isFinite(time)) continue;
      const last = points[points.length - 1]!;
      if (!(time > last.time) || value === last.value) continue;
      const point = { time, value };
      appendCachedPoint(eid, point);
      next ??= { ...this._history };
      next[eid] = [...points, point];
    }
    if (next) this._history = next;
  }

  /**
   * Poll the backend's maintenance flag while any shown entity is
   * unavailable, and stop as soon as data is back. A healthy dashboard never
   * sends the command.
   */
  private _syncApiStatus(): void {
    const unavailable = this._resolveEntities().some((e) => e.state === "unavailable");
    if (!unavailable) {
      this._stopApiStatusPoll();
      this._apiMaintenance = false;
      return;
    }
    if (this._apiStatusInterval !== undefined) return;
    void this._checkApiStatus();
    this._apiStatusInterval = window.setInterval(() => {
      void this._checkApiStatus();
    }, API_STATUS_RECHECK_MS);
  }

  private async _checkApiStatus(): Promise<void> {
    this._apiMaintenance = await fetchApiMaintenance(this.hass);
  }

  private _stopApiStatusPoll(): void {
    if (this._apiStatusInterval !== undefined) {
      clearInterval(this._apiStatusInterval);
      this._apiStatusInterval = undefined;
    }
  }

  protected override updated(_changed: PropertyValues): void {
    // One-shot bootstrap on first hass arrival. Only while connected: a
    // history or version answer that lands after removal still updates the
    // detached card, and without the check that update would start an
    // interval nothing ever clears.
    if (!this._initDone && this.isConnected && this.hass && this._config) {
      this._initDone = true;
      void this._fetchAllHistory();
      this._historyInterval = window.setInterval(() => {
        void this._fetchAllHistory();
      }, HISTORY_REFRESH_MS);
      void this._checkCardVersion();
    }
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
      this._historyError = false;
    } catch (err) {
      console.warn("[Tankstellen Austria] history refresh failed", err);
      this._historyError = true;
    }
  }

  private async _checkCardVersion(): Promise<void> {
    const mismatch = await checkCardVersionWS(
      this.hass,
      "tankstellen_austria/card_version",
      CARD_VERSION,
    );
    if (mismatch) this._versionMismatch = mismatch;
  }

  // --- Render ---

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html`
        <ha-card>
          <div class="empty" role="status" aria-live="polite">
            ${this._t("loading")}
          </div>
          ${this._renderFooter(undefined)}
        </ha-card>
      `;
    }

    const entities = this._resolveEntities();
    const activeTab = this._activeTab >= entities.length ? 0 : this._activeTab;

    if (!entities.length) {
      return html`
        <ha-card>
          ${this._renderVersionBanner()}
          <div class="empty">${this._t("no_data")}</div>
          ${this._renderFooter(undefined)}
        </ha-card>
      `;
    }

    // entities.length > 0 was just checked above, so entities[0] is defined.
    const active = entities[activeTab] ?? entities[0]!;
    const attribution = active.attributes.attribution;

    return html`
      <ha-card>
        ${this._renderTabs(entities, activeTab)}
        <div class="body">
          ${this._renderVersionBanner()}
          ${
            this._apiMaintenance && active.state === "unavailable"
              ? html`<ha-alert alert-type="info" role="status">
                ${this._t("api_maintenance")}
              </ha-alert>`
              : nothing
          }
          ${
            this._historyError
              ? html`<ha-alert alert-type="warning" role="alert">
                ${this._t("history_fetch_error")}
              </ha-alert>`
              : nothing
          }
          ${this._renderHead(active)}
          ${this._renderSparklineBlock(active)}
          ${this._renderCars(active)}
          ${this._renderStationList(active, activeTab)}
        </div>
        ${this._renderFooter(attribution)}
      </ha-card>
    `;
  }

  // E-Control attribution + brand-link footer. Mirrors the Ladestellen
  // Austria card. When logo_adapt_to_theme is on, the SVG renders as a
  // theme-following silhouette; otherwise it stays in its native colour.
  // Suppressed entirely when hide_attribution is true.
  private _renderFooter(attribution: string | undefined): TemplateResult | typeof nothing {
    if (this._config?.hide_attribution === true) return nothing;
    const adaptive = this._config?.logo_adapt_to_theme === true;
    const darkMode = Boolean((this.hass?.themes as { darkMode?: boolean } | undefined)?.darkMode);
    const logoClasses = adaptive
      ? `brand-logo adaptive ${darkMode ? "adaptive-dark" : "adaptive-light"}`
      : "brand-logo";
    const text =
      attribution && attribution.includes("E-Control") ? attribution : ATTRIBUTION_REQUIRED;
    return html`
      <div class="footer">
        <a
          class="brand-link"
          href=${safeHttpsUri(E_CONTROL_HOMEPAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="E-Control"
          @click=${(ev: Event) => ev.stopPropagation()}
        >
          <img
            class=${logoClasses}
            src=${E_CONTROL_LOGO_URL}
            alt="E-Control"
          />
        </a>
        <span class="attribution-text">${text}</span>
      </div>
    `;
  }

  private _renderVersionBanner(): TemplateResult | typeof nothing {
    if (this.preview) return nothing;
    // If the user already clicked reload in this session and the version
    // we just saw from the backend is still ahead of CARD_VERSION, the
    // reload didn't pick up the new bundle (likely a stuck SW/CDN cache).
    // Switch the banner to a stuck-state message so the user isn't
    // trapped in a reload → banner → reload loop.
    const stuck =
      this._versionMismatch !== null &&
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(`tsa-reload-attempted-${this._versionMismatch}`) === "1";
    return renderVersionBanner({
      mismatchVersion: this._versionMismatch,
      stuck,
      t: (key, repl) => this._t(key, repl),
      onReload: this._onVersionReload,
      onDismiss: this._onDismissVersionBanner,
    });
  }

  private _onDismissVersionBanner = (): void => {
    this._versionMismatch = null;
  };

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
            const ft = fuelTypeOf(this.hass, e.entity_id, e.attributes);
            label = getFuelName(ft, this._ctx());
            if (e.attributes.dynamic_mode === true) {
              const trackerLabel = e.attributes.dynamic_tracker_label;
              if (trackerLabel) label += ` · ${trackerLabel}`;
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
              @keydown=${(ev: KeyboardEvent) => this._onTabKeydown(ev, i, entities.length)}
            >
              ${label}
            </button>
          `;
        })}
      </div>
    `;
  }

  // Tile, fuel name and the big cheapest price as one block: the number
  // sits on the rail under the name. hide_header drops the tile and the
  // name, hide_header_price the number; the grid keeps whichever is left.
  private _renderHead(active: TankstellenEntity): TemplateResult | typeof nothing {
    const showTitle = this._config.hide_header !== true;
    const isDynamic = active.attributes.dynamic_mode === true;
    const stations: Station[] = active.attributes.stations ?? [];
    const cheapest = stations[0]?.price;
    const showPrice = !isDynamic && this._config.hide_header_price !== true && cheapest != null;
    if (!showTitle && !showPrice && !isDynamic) return nothing;

    const fuelType = fuelTypeOf(this.hass, active.entity_id, active.attributes);
    const fuelTypeName = active.attributes.fuel_type_name || getFuelName(fuelType, this._ctx());
    const subtitle = isDynamic ? (active.attributes.dynamic_tracker_label ?? null) : null;
    const avgPrice = active.attributes.average_price;

    return html`
      <header class=${classMap({ head: true, "no-title": !showTitle })}>
        ${
          showTitle
            ? html`
              <div class="tile" aria-hidden="true">
                <ha-icon icon="mdi:gas-station"></ha-icon>
              </div>
              <h2 class="title">
                ${fuelTypeName}
                ${subtitle ? html`<span class="subtitle">${subtitle}</span>` : nothing}
              </h2>
            `
            : nothing
        }
        ${
          showPrice
            ? html`
              <p class="price-line">
                <span class="price-big">${formatPrice(cheapest)}</span>
                <span class="price-ctx">
                  ${this._t("cheapest")}${
                    avgPrice != null
                      ? html` · ${this._t("average")} <b>${formatPriceShort(avgPrice)}</b>`
                      : nothing
                  }
                </span>
              </p>
            `
            : nothing
        }
        ${
          isDynamic
            ? html`
              <div class="head-actions">
                ${this._renderRefreshButton()}
                ${this._renderDynamicChips(active)}
              </div>
            `
            : nothing
        }
      </header>
    `;
  }

  private _renderDynamicChips(active: TankstellenEntity): TemplateResult | typeof nothing {
    const hasLastUpdated = !!active.last_updated;
    if (!hasLastUpdated && !this._noNewData) return nothing;
    return html`
      <div class="chip-row" aria-live="polite">
        ${
          hasLastUpdated
            ? html`<span class="chip">
              <ha-icon icon="mdi:clock-outline" aria-hidden="true"></ha-icon>
              <ha-relative-time
                .hass=${this.hass}
                .datetime=${new Date(active.last_updated as string)}
              ></ha-relative-time>
            </span>`
            : nothing
        }
        ${
          this._noNewData
            ? html`<span class="chip warn" role="status">
              <ha-icon icon="mdi:alert-circle-outline" aria-hidden="true"></ha-icon>
              ${this._t("no_new_data")}
            </span>`
            : nothing
        }
      </div>
    `;
  }

  private _renderRefreshButton(): TemplateResult {
    const remainingMs = DYNAMIC_MANUAL_COOLDOWN_MS - (Date.now() - this._lastManualRefresh);
    const cooling = remainingMs > 0;
    const countdownText = cooling
      ? (() => {
          const s = Math.ceil(remainingMs / 1000);
          return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
        })()
      : "";

    return html`
      <button
        class=${classMap({ "btn-primary": true, cooling })}
        type="button"
        aria-label=${this._t("refresh")}
        aria-disabled=${cooling ? "true" : "false"}
        @click=${this._onRefresh}
      >
        <ha-icon icon="mdi:refresh" aria-hidden="true"></ha-icon>
        <span>${cooling ? countdownText : this._t("refresh")}</span>
      </button>
    `;
  }

  private _renderSparklineBlock(active: TankstellenEntity): TemplateResult | typeof nothing {
    const isDynamic = active.attributes.dynamic_mode === true;
    if (isDynamic) return nothing;
    if (this._config.show_history === false) return nothing;
    return this._renderSparkline(active);
  }

  private _renderSparkline(active: TankstellenEntity): TemplateResult | typeof nothing {
    const entityId = active.entity_id;
    const points = this._history[entityId] ?? [];
    if (!hasSparklineData(points)) return nothing;

    const showMedianLine = this._config.show_median_line === true;
    const showHourEnvelope = this._config.show_hour_envelope === true;
    const showNoonMarkers = this._config.show_noon_markers === true;
    const showMinMax = this._config.show_minmax !== false;
    const showBestRefuel = this._config.show_best_refuel !== false;

    const timeZone = resolveTimeZone(this.hass);
    const envelope = showHourEnvelope ? this._envelope(points, timeZone) : null;
    const analysis = showBestRefuel ? this._analysis(points, timeZone) : null;
    const lang = resolveLang(this._ctx()).replace("_", "-");

    return html`
      <button
        class="chart"
        type="button"
        data-entity=${entityId}
        aria-label=${this._t("sparkline_open_more_info")}
        @click=${() => this._onSparklineClick(entityId)}
      >
        <tankstellen-austria-sparkline
          .points=${points}
          .envelope=${envelope}
          .analysis=${analysis}
          .showMedianLine=${showMedianLine}
          .showHourEnvelope=${showHourEnvelope}
          .showNoonMarkers=${showNoonMarkers}
          .showMinMax=${showMinMax}
          .timeZone=${timeZone}
          .language=${lang}
          .hour12=${useAmPm(this.hass.locale, lang)}
          .translations=${this._sparklineTranslations(lang)}
        ></tankstellen-austria-sparkline>
      </button>
      ${this._renderFacts(analysis)}
    `;
  }

  private _analysisFor(
    points: HistoryPoint[],
    timeZone: string,
  ): NonNullable<TankstellenAustriaCard["_analysisMemo"]> {
    const memo = this._analysisMemo;
    if (memo && memo.points === points && memo.timeZone === timeZone) return memo;
    this._analysisMemo = { points, timeZone };
    return this._analysisMemo;
  }

  private _envelope(points: HistoryPoint[], timeZone: string): HourlyEnvelope | null {
    const memo = this._analysisFor(points, timeZone);
    memo.envelope ??= buildHourlyEnvelope(points, timeZone);
    return memo.envelope;
  }

  private _analysis(points: HistoryPoint[], timeZone: string): BestRefuelResult | null {
    const memo = this._analysisFor(points, timeZone);
    memo.analysis ??= analyzeBestRefuel(points, timeZone);
    return memo.analysis;
  }

  // One strings object per language: a fresh literal on every render would
  // make the chart element recompute its geometry each time.
  private _sparklineTranslations(lang: string): SparklineTranslations {
    if (this._sparklineI18n?.lang === lang) return this._sparklineI18n.strings;
    const strings: SparklineTranslations = {
      min_label: this._t("min_label"),
      max_label: this._t("max_label"),
      last_7_days: this._t("last_7_days"),
      window_label: this._t("window_label"),
      median_delta_below: this._t("median_delta_below"),
      median_delta_above: this._t("median_delta_above"),
      median_delta_equal: this._t("median_delta_equal"),
      sparkline_aria_summary: this._t("sparkline_aria_summary"),
      sparkline_aria_simple: this._t("sparkline_aria_simple"),
    };
    this._sparklineI18n = { lang, strings };
    return strings;
  }

  // The tip and the two counted facts as one list: the window with its
  // confidence, the noon rise with the days it rests on, and where today's
  // price sits in the last four weeks. One line each, the icon column on
  // the pad and the text on the rail.
  private _renderFacts(analysis: BestRefuelResult | null): TemplateResult | typeof nothing {
    if (!analysis) return nothing;
    const row = (
      icon: string,
      text: string,
      cls = "",
      badge: TemplateResult | typeof nothing = nothing,
    ): TemplateResult => html`
      <li class=${cls}>
        <ha-icon icon=${icon} aria-hidden="true"></ha-icon>
        <span>${text}</span>
        ${badge}
      </li>
    `;
    if (!analysis.hasEnoughData) {
      return html`<ul class="facts">
        ${row("mdi:information-outline", this._t("not_enough_data_hint"))}
      </ul>`;
    }

    const rows: TemplateResult[] = [];
    const hh = (h: number): string => String(h).padStart(2, "0");
    if (analysis.hour == null) {
      // Enough history, but no hour of the day cheaper than the rest.
      rows.push(
        row(
          "mdi:information-outline",
          this._t("no_pattern_hint", {
            range: (analysis.facts?.daily_range_cents ?? 0).toFixed(1),
          }),
        ),
      );
    } else {
      const hour = analysis.hour;
      let text = this._t("best_refuel_hour", {
        h1: hh(hour),
        h2: hh(analysis.hour_end ?? (hour + 1) % 24),
      });
      if (analysis.alt_hour != null && analysis.alt_hour_end != null) {
        text += `, ${this._t("best_refuel_alt", {
          a1: hh(analysis.alt_hour),
          a2: hh(analysis.alt_hour_end),
        })}`;
      }
      // The weekday is a statement about whole days, kept apart from the
      // window: a window that crosses midnight has no single weekday.
      if (analysis.weekday != null) {
        text += ` · ${getWeekdays(this._ctx())[analysis.weekday] ?? ""}`;
      }
      rows.push(row("mdi:lightbulb-outline", text, "lead", this._renderConfidence(analysis)));
    }
    rows.push(...this._factRows(analysis.facts));
    return html`<ul class="facts">${rows}</ul>`;
  }

  // The confidence pill. One breakdown string drives both `title` (hover)
  // and `aria-label` (screen-reader name); the title attribute collapses
  // newlines, so ". " separates the parts.
  private _renderConfidence(analysis: BestRefuelResult): TemplateResult | typeof nothing {
    const c = analysis.confidence;
    if (!c) return nothing;
    const levelLabel = this._t(`confidence_${c.level}`);
    const parts: string[] = [
      `${this._t("confidence_title")}: ${levelLabel}`,
      `${this._t("confidence_span")}: ${c.span_days} ${this._t("confidence_days")}`,
      `${this._t("confidence_gap")}: ${c.gap_cents.toFixed(1)} ${this._t("confidence_cents")}`,
      `${this._t("confidence_consistency")}: ${c.consistency_pct}%`,
    ];
    if (analysis.alt_hour != null) parts.push(this._t("confidence_tied_hint"));
    if (c.span_days < 14) parts.push(this._t("confidence_short_history_hint"));
    const breakdown = parts.join(". ");
    return html`<span
      class="conf conf-${c.level}"
      title=${breakdown}
      aria-label=${breakdown}
    >${levelLabel}</span>`;
  }

  // Two descriptions of the history, not forecasts, so they are shown
  // whatever the confidence in the window.
  private _factRows(facts: DayFacts | null | undefined): TemplateResult[] {
    if (!facts) return [];
    const rows: TemplateResult[] = [];
    const fact = (icon: string, text: string): TemplateResult => html`
      <li>
        <ha-icon icon=${icon} aria-hidden="true"></ha-icon>
        <span>${text}</span>
      </li>
    `;
    if (facts.noon_days >= 7) {
      const vars = {
        n: String(facts.noon_rise_days),
        d: String(facts.noon_days),
        c: facts.noon_rise_cents.toFixed(1),
      };
      if (facts.noon_rise_days === 0) {
        rows.push(fact("mdi:trending-neutral", this._t("noon_none", vars)));
      } else if (facts.noon_rise_days * 2 >= facts.noon_days) {
        rows.push(fact("mdi:trending-up", this._t("noon_before", vars)));
      } else {
        rows.push(fact("mdi:trending-up", this._t("noon_some", vars)));
      }
    }
    const { cheaper_than_pct: cheaper, dearer_than_pct: dearer } = facts;
    if (cheaper >= dearer && cheaper >= 25) {
      rows.push(fact("mdi:arrow-down-thin", this._t("now_cheaper", { pct: String(cheaper) })));
    } else if (dearer > cheaper && dearer >= 25) {
      rows.push(fact("mdi:arrow-up-thin", this._t("now_dearer", { pct: String(dearer) })));
    } else {
      rows.push(fact("mdi:approximately-equal", this._t("now_usual")));
    }
    return rows;
  }

  private _renderCars(active: TankstellenEntity): TemplateResult | typeof nothing {
    const stations: Station[] = active.attributes.stations ?? [];
    if (!stations.length) return nothing;

    const showCars = this._config.show_cars === true;
    const showCarFillup = this._config.show_car_fillup !== false;
    const showCarConsumption = this._config.show_car_consumption !== false;
    if (!showCars || (!showCarFillup && !showCarConsumption)) return nothing;

    const fuelType = fuelTypeOf(this.hass, active.entity_id, active.attributes);
    const paymentFilter = this._config.payment_filter ?? [];
    const highlightMode = this._config.payment_highlight_mode === true;

    // Cars must match the *active* fuel type. Backed by the full config list.
    const rawCars: CarConfig[] = (this._config.cars ?? []).filter(
      (c) => c.fuel_type === fuelType && c.tank_size > 0 && c.name,
    );
    const cars = showCarFillup ? rawCars : rawCars.filter((c) => Number(c.consumption) > 0);
    if (!cars.length) return nothing;

    // In filter mode use the cheapest visible station (post-filter). In
    // highlight mode all stations are visible, so use the overall cheapest.
    const filteredStations = highlightMode
      ? stations
      : stations.filter((s) => matchesPaymentFilter(s, paymentFilter));
    const cheapest = highlightMode ? stations[0]?.price : filteredStations[0]?.price;

    return html`
      <ul class="cars">
        ${cars.map((car) => this._renderCar(car, cheapest, showCarFillup, showCarConsumption))}
      </ul>
    `;
  }

  // One line per car: name, then its litres and consumption small; the
  // fill-up cost as the number, the cost per 100 km small beside it. With
  // the fill-up off, the per-100-km figure is the number.
  private _renderCar(
    car: CarConfig,
    cheapest: number | undefined,
    showCarFillup: boolean,
    showCarConsumption: boolean,
  ): TemplateResult {
    const consumption = Number(car.consumption);
    const hasConsumption = Number.isFinite(consumption) && consumption > 0;
    const euro = (n: number): string => `€ ${n.toFixed(2).replace(".", ",")}`;
    const consumptionStr = hasConsumption
      ? `${consumption.toFixed(1).replace(".", ",")} l/100 km`
      : "";
    const fillup = cheapest != null ? euro(cheapest * Number(car.tank_size)) : "–";
    const per100 = cheapest != null && hasConsumption ? euro(cheapest * consumption) : "–";
    const showPer100 = showCarConsumption && hasConsumption;

    const meta = [showCarFillup ? `${car.tank_size} l` : "", consumptionStr]
      .filter(Boolean)
      .join(" · ");
    const num = showCarFillup
      ? html`${fillup}${showPer100 ? html` <small>· ${per100} / 100 km</small>` : nothing}`
      : html`${per100} <small>/ 100 km</small>`;
    return html`
      <li>
        <ha-icon icon=${car.icon || "mdi:car"} aria-hidden="true"></ha-icon>
        <span>${car.name}${meta ? html` <small>${meta}</small>` : nothing}</span>
        <span class="num">${num}</span>
      </li>
    `;
  }

  private _renderStationList(
    active: TankstellenEntity,
    activeTab: number,
  ): TemplateResult | typeof nothing {
    const stations: Station[] = active.attributes.stations ?? [];
    const parsedMax = parseInt(String(this._config.max_stations), 10);
    const maxStations = Number.isFinite(parsedMax) ? Math.max(0, Math.min(5, parsedMax)) : 5;
    const paymentFilter = this._config.payment_filter ?? [];
    const highlightMode = this._config.payment_highlight_mode === true;

    const filtered = highlightMode
      ? stations
      : stations.filter((s) => matchesPaymentFilter(s, paymentFilter));

    // An unavailable sensor carries no stations, so without this the list
    // would say "No data available", which makes an outage look like a
    // broken install. Shown whatever `max_stations` is, or a header-only
    // card would give no hint at all. Doesn't say whose fault it is; the
    // integration's Repairs issue does that, and the maintenance alert above
    // stays for the one cause E-Control announces itself.
    if (active.state === "unavailable") {
      return html`<div class="empty" role="status" aria-live="polite">
        <div class="empty-title">${this._t("unreachable")}</div>
        <div class="empty-detail">${this._t("unreachable_detail")}</div>
      </div>`;
    }

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

    // Opt-in re-sort: the integration delivers stations cheapest-first;
    // when enabled, order by Luftlinie instead. `sort` is stable, so
    // stations without a stamped `distance_m` sink to the tail while
    // keeping their cheapest-first order among themselves.
    let ordered = filtered;
    if (this._config.sort_by_distance === true) {
      ordered = [...filtered];
      ordered.sort(
        (a, b) =>
          (a.distance_m ?? Number.POSITIVE_INFINITY) - (b.distance_m ?? Number.POSITIVE_INFINITY),
      );
    }

    const display = ordered.slice(0, maxStations);
    return html`
      <ol class="stations">
        ${display.map((s, idx) =>
          this._renderStation(s, idx, activeTab, paymentFilter, highlightMode),
        )}
      </ol>
    `;
  }

  // The rank, or with stations.brand the brand's initials on its colour.
  // Decorative either way: the row's aria-label names the station.
  private _renderIndexTile(s: Station, idx: number): TemplateResult {
    const circle = this._config.tile_shape === "circle";
    if (this._config.show_brand !== true) {
      return html`<span class=${classMap({ "st-tile": true, circle })} aria-hidden="true">
        ${idx + 1}
      </span>`;
    }
    const tile = brandTile(s.name);
    const colours = tile.bg
      ? { "--tankst-tile-bg": tile.bg, "--tankst-tile-fg": tile.fg ?? "" }
      : {};
    return html`<span
      class=${classMap({ "st-tile": true, brand: true, "brand-known": !!tile.bg, circle })}
      style=${styleMap(colours)}
      aria-hidden="true"
    >
      ${tile.initials}
    </span>`;
  }

  // One <li> per station: the row is a real <button> (so Enter and Space
  // come for free), the map link sits beside it as a sibling rather than
  // inside it, and the detail panel spans both.
  private _renderStation(
    s: Station,
    idx: number,
    activeTab: number,
    paymentFilter: readonly string[],
    highlightMode: boolean,
  ): TemplateResult {
    // The tile shows the rank or the brand; either one draws it.
    const showIndex = this._config.show_index !== false || this._config.show_brand === true;
    const showMapLinks = this._config.show_map_links !== false;
    // Opt-in: an existing config predating the feature has no key, so the
    // caption stays hidden; getStubConfig turns it on for new cards.
    const showDistance = this._config.show_distance === true;
    const showHours = this._config.show_opening_hours !== false;
    const showPayment = this._config.show_payment_methods !== false;
    const loc = s.location ?? {};

    // Expanded state is keyed on station identity, not list position:
    // positions shift whenever prices update. The tab prefix keeps state
    // per fuel type even though _onTabClick already clears the set.
    const key = `${activeTab}|${s.name ?? ""}|${loc.address ?? ""}`;
    const isExpanded = this._expandedStations.has(key);
    const isClosed = s.open === false;
    const isClosingSoonFlag = !isClosed && isClosingSoon(s);

    const highlighted =
      highlightMode && paymentFilter.length > 0 && matchesPaymentFilter(s, paymentFilter);
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
    const detailId = hasDetail ? `tsa-station-detail-${activeTab}-${idx}` : undefined;

    // Locality (PLZ + city) and street each get their own lang span and
    // join with ", " only when both are present: rural stations often
    // carry only a postal code.
    const localityText = [loc.postalCode, loc.city]
      .filter((p): p is string | number => p != null && p !== "")
      .join(" ");
    const addressText = loc.address ?? "";
    const localityTpl = localityText ? html`<span lang="de">${localityText}</span>` : nothing;
    const addressTpl = addressText ? html`<span lang="de">${addressText}</span>` : nothing;
    const addressSeparator = localityTpl !== nothing && addressTpl !== nothing ? ", " : "";

    // Map link, or nothing: mapsUrl returns null without a name or any
    // location field, safeNavUri "" outside its allowlist. geo: URIs open
    // in-tab so the OS intercepts them as an intent.
    let mapUrl = "";
    if (showMapLinks) {
      const linkKind = resolveMapLinkKind(
        this._config.map_provider ?? "auto",
        detectNavPlatform(navigator.userAgent, navigator.maxTouchPoints),
      );
      mapUrl = safeNavUri(mapsUrl(loc, s.name ?? "", linkKind));
    }

    return html`
      <li class=${classMap({ st: true, "pm-highlight": highlighted })}>
        <button
          class=${classMap({ "st-row": true, "no-map": !mapUrl, "no-tile": !showIndex })}
          type="button"
          aria-expanded=${hasDetail ? (isExpanded ? "true" : "false") : nothing}
          aria-controls=${detailId ?? nothing}
          ?disabled=${!hasDetail}
          @click=${() => this._onStationClick(key)}
        >
          ${showIndex ? this._renderIndexTile(s, idx) : nothing}
          <span class="st-name">
            ${s.name ? html`<span lang="de">${s.name}</span>` : "–"}
            ${
              isClosed
                ? html`<span class="flag closed">${this._t("closed")}</span>`
                : isClosingSoonFlag
                  ? html`<span class="flag">${this._t("closing_soon")}</span>`
                  : nothing
            }
            ${matchChips.map((m) => html`<span class="chip match">${m}</span>`)}
          </span>
          <span class="st-addr">${localityTpl}${addressSeparator}${addressTpl}</span>
          <span class="st-price">${formatPrice(s.price)}</span>
          ${
            showDistance && s.distance_m != null
              ? html`<span class="st-dist" lang="de">${formatDistance(s.distance_m)}</span>`
              : nothing
          }
          ${
            hasDetail
              ? html`<ha-icon class="chev" icon="mdi:chevron-down" aria-hidden="true"></ha-icon>`
              : nothing
          }
        </button>
        ${
          mapUrl
            ? html`
              <a
                class="st-map"
                href=${mapUrl}
                target=${mapUrl.startsWith("geo:") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                aria-label=${`${this._t("map")}: ${s.name ?? ""}`}
                title=${this._t("map")}
              >
                <ha-icon
                  icon=${/\d/.test(addressText) ? "mdi:map-marker" : "mdi:magnify"}
                  aria-hidden="true"
                ></ha-icon>
              </a>
            `
            : nothing
        }
        ${
          hasDetail
            ? html`
              <div id=${detailId!} class=${classMap({ "st-detail": true, expanded: isExpanded })}>
                <div>
                  ${hasHoursBlock ? this._renderHours(s.opening_hours ?? []) : nothing}
                  ${hasPaymentBlock ? this._renderPaymentMethods(s.payment_methods) : nothing}
                </div>
              </div>
            `
            : nothing
        }
      </li>
    `;
  }

  private _renderHours(hours: OpeningHours[]): TemplateResult {
    // E-Control groups Mon-Fri under "MO". Fall back to positional indexing
    // when the day code isn't set (old feed shape).
    const rows: Array<[string, OpeningHours | undefined]> = [
      [this._t("mon_fri"), hours.find((h) => h.day === "MO") ?? hours[0]],
      [this._t("sat"), hours.find((h) => h.day === "SA") ?? hours[5]],
      [this._t("sun"), hours.find((h) => h.day === "SO") ?? hours[6]],
      [this._t("holiday"), hours.find((h) => h.day === "FE")],
    ];
    return html`
      <dl class="hours">
        ${rows.map(([label, h]) =>
          h ? html`<dt>${label}</dt><dd>${h.from} – ${h.to}</dd>` : nothing,
        )}
      </dl>
    `;
  }

  private _renderPaymentMethods(pm: PaymentMethods | undefined): TemplateResult | typeof nothing {
    if (!pm) return nothing;
    const chips: TemplateResult[] = [];
    const chip = (icon: string, label: string): TemplateResult => html`
      <span><ha-icon icon=${icon} aria-hidden="true"></ha-icon>${label}</span>
    `;
    if (pm.cash) chips.push(chip("mdi:cash", this._t("cash")));
    if (pm.debit_card) chips.push(chip("mdi:credit-card", this._t("debit_card")));
    if (pm.credit_card) chips.push(chip("mdi:credit-card", this._t("credit_card")));
    for (const other of pm.others ?? []) chips.push(html`<span class="pm-other">${other}</span>`);
    if (!chips.length) return nothing;
    return html`<div class="pay">${chips}</div>`;
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
    void this.updateComplete.then(() => {
      const tabs = this.shadowRoot?.querySelectorAll<HTMLButtonElement>('.tabs [role="tab"]');
      tabs?.[next]?.focus();
    });
  }

  private _onStationClick(key: string): void {
    const next = new Set(this._expandedStations);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expandedStations = next;
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

  private _onRefresh = (): void => {
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
          console.warn("[Tankstellen Austria] update_entity failed for", e.entity_id, err);
        });
      }
    }

    // After HA has had time to fetch, check if data actually changed.
    if (this._postRefreshTimeout !== undefined) {
      clearTimeout(this._postRefreshTimeout);
    }
    this._postRefreshTimeout = window.setTimeout(() => {
      this._postRefreshTimeout = undefined;
      try {
        const updated = this._resolveEntities();
        const updatedActive = updated[this._activeTab] ?? updated[0];
        if (updatedActive?.last_updated === preRefreshTimestamp) {
          this._noNewData = true;
        }
      } catch (err) {
        console.warn("[Tankstellen Austria] post-refresh check failed", err);
      }
    }, POST_REFRESH_CHECK_MS);

    // Per-second re-render so the countdown stays live. Skipped when the
    // user prefers reduced motion — WCAG 2.2.2 (animation > 5s needs a way
    // to pause); a single wake-up at the end of the cooldown is enough.
    if (this._cooldownInterval !== undefined) {
      clearInterval(this._cooldownInterval);
    }
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (this._cooldownTimeout !== undefined) {
        clearTimeout(this._cooldownTimeout);
      }
      this._cooldownTimeout = window.setTimeout(() => {
        this._cooldownTimeout = undefined;
        this._cooldownTick = (this._cooldownTick + 1) % 1_000_000;
      }, DYNAMIC_MANUAL_COOLDOWN_MS);
    } else {
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
  };

  private _onVersionReload = async (): Promise<void> => {
    // Flag this target version as "user tried reload" before the page
    // unloads, so on re-render the banner flips to the stuck-state
    // variant instead of a second reload button.
    if (this._versionMismatch) {
      try {
        sessionStorage.setItem(`tsa-reload-attempted-${this._versionMismatch}`, "1");
      } catch {
        // sessionStorage can be disabled in private browsing — fall through.
      }
    }
    await reloadAfterCacheWipe();
  };

  static override styles: CSSResultGroup = cardStyles;
}
