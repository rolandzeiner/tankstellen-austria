import {
  LitElement,
  html,
  nothing,
  type TemplateResult,
  type CSSResultGroup,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import {
  fireEvent,
  type HomeAssistant,
  type LovelaceCardEditor,
} from "custom-card-helpers";

import type {
  CarConfig,
  FuelType,
  TankstellenAustriaCardConfig,
} from "./types";
import { CAR_ICONS } from "./const";
import { findTankstellenEntities } from "./utils/entities";
import {
  getFuelName,
  translate,
  type TranslateContext,
} from "./localize/localize";
import { editorStyles } from "./styles";

// Sanitisation mirror of the vanilla editor: strip HTML-injection chars,
// cap length, trim. Applied to every free-form user-typed value.
function sanitizeShort(raw: string): string {
  return raw.replace(/[<>"'&]/g, "").slice(0, 50).trim();
}

@customElement("tankstellen-austria-card-editor")
export class TankstellenAustriaCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  // IMPORTANT: initialize with a minimal valid config so the form always
  // renders even before setConfig fires. A bare `_config?: Config` can leave
  // the editor stuck on "Loading…" forever if HA's Lovelace panel is still
  // finishing init.
  @state() private _config: TankstellenAustriaCardConfig = {
    type: "tankstellen-austria-card",
  };

  // Which car row has the icon picker expanded (index into cars[]).
  @state() private _expandedCarIcon: number | null = null;

  // Two-click-confirm gate for removing a *custom* (user-typed) payment
  // filter chip — built-in chips toggle immediately.
  @state() private _pendingRemove: string | null = null;

  // Transient "Copied" state for the recorder-snippet copy button.
  @state() private _copiedPulse = false;
  private _copiedTimeout: number | undefined;

  public setConfig(config: TankstellenAustriaCardConfig): void {
    this._config = { ...config };
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._copiedTimeout !== undefined) {
      clearTimeout(this._copiedTimeout);
      this._copiedTimeout = undefined;
    }
  }

  private _ctx(): TranslateContext {
    return {
      configLanguage: this._config?.language,
      hassLanguage: this.hass?.language,
    };
  }

  private _et(key: string, replacements?: Record<string, string>): string {
    return translate(`editor.${key}`, this._ctx(), replacements);
  }

  private _ct(key: string, replacements?: Record<string, string>): string {
    return translate(`card.${key}`, this._ctx(), replacements);
  }

  // fireEvent sets bubbles + composed for us (crosses the shadow boundary).
  private _fireChanged(): void {
    fireEvent(this, "config-changed", { config: { ...this._config } });
  }

  protected render(): TemplateResult {
    // Only gate on _config (minimal-init above). HA pickers conditionally
    // render inside each section, gated on hass.
    const available = findTankstellenEntities(this.hass);
    const selected = this._config.entities ?? [];

    const apiPmKeys = this._collectApiPaymentKeys();

    return html`
      <div class="editor">
        ${this._renderSensorsSection(available, selected)}
        ${this._renderTabLabelsSection(available, selected)}
        ${this._renderDisplaySection()}
        ${this._renderPaymentSection(apiPmKeys)}
        ${this._renderCarsSection()}
        ${this._renderBrandingSection()}
      </div>
    `;
  }

  private _renderBrandingSection(): TemplateResult {
    const adaptLogo = this._config.logo_adapt_to_theme === true;
    const hideAttr = this._config.hide_attribution === true;
    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_branding")}</div>
        ${this._renderToggle(
          "logo_adapt_to_theme",
          this._et("logo_adapt_to_theme"),
          adaptLogo,
        )}
        ${this._renderToggle(
          "hide_attribution",
          this._et("hide_attribution"),
          hideAttr,
        )}
      </div>
    `;
  }

  private _collectApiPaymentKeys(): Set<string> {
    const keys = new Set<string>(["cash", "debit_card", "credit_card"]);
    if (!this.hass) return keys;
    for (const eid of this._config.entities ?? []) {
      const stations = (this.hass.states[eid]?.attributes?.stations ??
        []) as Array<{ payment_methods?: { others?: string[] } }>;
      for (const s of stations) {
        for (const o of s.payment_methods?.others ?? []) keys.add(o);
      }
    }
    return keys;
  }

  // --- Section renderers ---

  private _renderSensorsSection(
    available: string[],
    selected: string[],
  ): TemplateResult {
    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_sensors")}</div>
        <div class="entity-chips">
          ${available.map((eid) => this._renderEntityChip(eid, selected))}
        </div>
        <div class="editor-hint">${this._et("entities_hint")}</div>
      </div>
    `;
  }

  private _renderEntityChip(
    eid: string,
    selected: string[],
  ): TemplateResult {
    const state = this.hass?.states[eid];
    const ft = state?.attributes?.fuel_type ?? "";
    const ftName = getFuelName(ft, this._ctx());
    const isSelected = selected.includes(eid);
    return html`
      <button
        class=${classMap({ "entity-chip": true, selected: isSelected })}
        type="button"
        aria-pressed=${isSelected ? "true" : "false"}
        @click=${() => this._toggleEntity(eid)}
      >
        <span class="fuel-name">${ftName}</span>
        <span class="entity-chip-suffix">${eid.split(".")[1] ?? eid}</span>
      </button>
    `;
  }

  private _renderTabLabelsSection(
    available: string[],
    selected: string[],
  ): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const ids = selected.length ? selected : available;
    const resolvable = ids
      .map((eid) => ({ eid, state: this.hass!.states[eid] }))
      .filter((x): x is { eid: string; state: NonNullable<typeof x.state> } => !!x.state);
    if (resolvable.length < 2) return nothing;

    const labels: Record<string, string> = this._config.tab_labels ?? {};
    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        ${resolvable.map(({ eid, state }) => {
          const ft = state.attributes?.fuel_type ?? "";
          let defaultLabel = getFuelName(ft, this._ctx());
          if (state.attributes?.dynamic_mode === true) {
            const trackerId = state.attributes.dynamic_entity as
              | string
              | undefined;
            const trackerName = trackerId
              ? this.hass!.states[trackerId]?.attributes?.friendly_name ||
                trackerId.split(".")[1]
              : null;
            if (trackerName) defaultLabel += ` · ${trackerName}`;
          }
          const current = typeof labels[eid] === "string" ? labels[eid] : "";
          const inputId = `tablbl-${eid.replace(/[^a-z0-9_-]/gi, "-")}`;
          return html`
            <div class="tab-label-row">
              <label class="tab-label-default" for=${inputId} title=${defaultLabel}>${defaultLabel}</label>
              <input
                id=${inputId}
                class="tab-label-input"
                type="text"
                autocomplete="off"
                maxlength="50"
                placeholder=${defaultLabel}
                .value=${current}
                @click=${this._stop}
                @pointerdown=${this._stop}
                @keydown=${this._stop}
                @keyup=${this._stop}
                @keypress=${this._stop}
                @change=${(e: Event) => this._onTabLabelChange(eid, e)}
              />
            </div>
          `;
        })}
        <div class="editor-hint">${this._et("tab_labels_hint")}</div>
      </div>
    `;
  }

  private _renderDisplaySection(): TemplateResult {
    const hideHeader = this._config.hide_header === true;
    const hideHeaderPrice = this._config.hide_header_price === true;
    const showIndex = this._config.show_index !== false;
    const showMap = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showPayment = this._config.show_payment_methods !== false;
    const showHistory = this._config.show_history !== false;
    const showBestRefuel = this._config.show_best_refuel !== false;
    const showMedianLine = this._config.show_median_line === true;
    const showHourEnvelope = this._config.show_hour_envelope === true;
    const showNoonMarkers = this._config.show_noon_markers === true;
    const showMinMax = this._config.show_minmax !== false;
    const showCars = this._config.show_cars === true;

    const maxStations = this._config.max_stations ?? 5;

    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_display")}</div>
        ${this._renderToggle(
          "hide_header",
          this._et("hide_header"),
          hideHeader,
        )}
        <div class="divider"></div>
        ${this._renderToggle(
          "hide_header_price",
          this._et("hide_header_price"),
          hideHeaderPrice,
        )}
        <div class="divider"></div>
        ${this._renderToggle("show_index", this._et("show_index"), showIndex)}
        <div class="divider"></div>
        ${this._renderToggle("show_map_links", this._et("show_map_links"), showMap)}
        <div class="divider"></div>
        ${this._renderToggle("show_opening_hours", this._et("show_opening_hours"), showHours)}
        <div class="divider"></div>
        ${this._renderToggle("show_payment_methods", this._et("show_payment_methods"), showPayment)}
        <div class="divider"></div>
        ${this._renderToggle("show_history", this._et("show_history"), showHistory)}
        ${showHistory
          ? html`
              ${this._renderToggle("show_median_line", this._et("show_median_line"), showMedianLine, true)}
              ${this._renderToggle("show_hour_envelope", this._et("show_hour_envelope"), showHourEnvelope, true)}
              ${this._renderToggle("show_noon_markers", this._et("show_noon_markers"), showNoonMarkers, true)}
              ${this._renderToggle("show_minmax", this._et("show_minmax"), showMinMax, true)}
              ${this._renderToggle("show_best_refuel", this._et("show_best_refuel"), showBestRefuel, true)}
              ${showBestRefuel ? this._renderRecorderHint() : nothing}
            `
          : nothing}
        <div class="divider"></div>
        ${this._renderToggle("show_cars", this._et("show_cars"), showCars)}
        <div class="divider"></div>
        <div class="toggle-row" style="padding-top:4px">
          <label for="slider-stations">${this._et("max_stations")}</label>
        </div>
        <div class="slider-row">
          <input
            id="slider-stations"
            type="range"
            min="0"
            max="5"
            step="1"
            .value=${String(maxStations)}
            @input=${this._onSliderInput}
            @change=${this._onSliderChange}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
          />
          <span class="slider-value">${maxStations}</span>
        </div>
      </div>
    `;
  }

  private _renderToggle(
    field: keyof TankstellenAustriaCardConfig,
    label: string,
    checked: boolean,
    sub = false,
  ): TemplateResult {
    const switchId = `toggle-${String(field)}`;
    return html`
      <div class=${classMap({ "toggle-row": true, "toggle-row-sub": sub })}>
        <label for=${switchId}>${label}</label>
        <ha-switch
          id=${switchId}
          .checked=${checked}
          @change=${(e: Event) => this._onBooleanToggle(field, e)}
        ></ha-switch>
      </div>
    `;
  }

  private _renderRecorderHint(): TemplateResult {
    const snippet = `recorder:\n  purge_keep_days: 30`;
    const label = this._copiedPulse ? this._et("copied") : this._et("copy");
    return html`
      <div class="recorder-hint">
        <div class="recorder-hint-text">${this._et("recorder_hint_intro")}</div>
        <pre class="recorder-snippet"><code>${snippet}</code></pre>
        <button
          class="recorder-copy-btn"
          type="button"
          aria-label=${this._et("copy_sensor_id")}
          @click=${() => this._onCopyRecorderSnippet(snippet)}
        >
          <ha-icon icon="mdi:content-copy" aria-hidden="true"></ha-icon>
          <span class="recorder-copy-label">${label}</span>
        </button>
      </div>
    `;
  }

  private _renderPaymentSection(
    apiPmKeys: Set<string>,
  ): TemplateResult | typeof nothing {
    const showPayment = this._config.show_payment_methods !== false;
    if (!showPayment) return nothing;

    const paymentFilter = this._config.payment_filter ?? [];
    const highlightMode = this._config.payment_highlight_mode === true;

    // User-typed filter values that aren't in live data still need chips.
    const allPmKeys = new Set<string>(apiPmKeys);
    for (const f of paymentFilter) allPmKeys.add(f);

    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_payment_filter")}</div>
        <div class="pm-filter-chips">
          ${[...allPmKeys].map((key) =>
            this._renderPaymentChip(key, paymentFilter, apiPmKeys),
          )}
        </div>
        <div class="pm-custom-row">
          <ha-textfield
            id="pm-custom-input"
            label=${this._et("payment_filter_custom_placeholder")}
            autocomplete="off"
            @keydown=${this._onCustomPmKeydown}
            @keyup=${this._stop}
            @keypress=${this._stop}
          ></ha-textfield>
          <ha-icon-button
            .label=${this._et("payment_filter_add_custom")}
            title=${this._et("payment_filter_add_custom")}
            @click=${this._onAddCustomPm}
          >
            <ha-icon icon="mdi:plus-circle" aria-hidden="true"></ha-icon>
          </ha-icon-button>
        </div>
        <div class="editor-hint">${this._et("payment_filter_custom_hint")}</div>
        ${paymentFilter.length
          ? html`
              <div class="divider"></div>
              ${this._renderToggle(
                "payment_highlight_mode",
                this._et("payment_highlight_mode"),
                highlightMode,
              )}
            `
          : nothing}
      </div>
    `;
  }

  private _renderPaymentChip(
    key: string,
    paymentFilter: readonly string[],
    apiPmKeys: Set<string>,
  ): TemplateResult {
    const isActive = paymentFilter.includes(key);
    const isPending = key === this._pendingRemove;
    const isCustom = !apiPmKeys.has(key);
    const label =
      key === "cash"
        ? this._ct("cash")
        : key === "debit_card"
          ? this._ct("debit_card")
          : key === "credit_card"
            ? this._ct("credit_card")
            : key;
    return html`
      <button
        class=${classMap({
          "pm-filter-chip": true,
          active: isActive,
          confirm: isPending,
        })}
        type="button"
        aria-pressed=${isActive ? "true" : "false"}
        @click=${() => this._togglePaymentChip(key, isCustom)}
      >
        ${isPending ? `✕ ${label}?` : label}
      </button>
    `;
  }

  private _renderCarsSection(): TemplateResult | typeof nothing {
    const showCars = this._config.show_cars === true;
    if (!showCars) return nothing;

    const showCarFillup = this._config.show_car_fillup !== false;
    const showCarConsumption = this._config.show_car_consumption !== false;
    const cars = this._config.cars ?? [];

    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_cars")}</div>
        ${this._renderToggle("show_car_fillup", this._et("show_car_fillup"), showCarFillup)}
        ${this._renderToggle(
          "show_car_consumption",
          this._et("show_car_consumption"),
          showCarConsumption,
        )}
        ${!showCarFillup && !showCarConsumption
          ? html`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>`
          : nothing}
        <div class="divider"></div>
        ${cars.map((car, idx) => this._renderCarRow(car, idx))}
        <button
          class="car-add-btn"
          type="button"
          @click=${this._onAddCar}
        >
          ${this._et("add_car")}
        </button>
      </div>
    `;
  }

  private _renderCarRow(car: CarConfig, idx: number): TemplateResult {
    const iconExpanded = this._expandedCarIcon === idx;
    const currentIcon = car.icon || "mdi:car";
    const pickerId = `tsa-car-icon-picker-${idx}`;
    const tankInvalid =
      car.tank_size != null && (car.tank_size < 1 || car.tank_size > 200);
    const consumptionInvalid =
      car.consumption != null && (car.consumption < 0 || car.consumption > 30);
    const tankErrorId = `tsa-car-tank-err-${idx}`;
    const consumptionErrorId = `tsa-car-consumption-err-${idx}`;
    return html`
      <div class="car-editor-group">
        <div class="car-editor-row">
          <button
            class=${classMap({ "car-icon-btn": true, active: iconExpanded })}
            type="button"
            aria-label=${this._et("car_choose_icon")}
            aria-expanded=${iconExpanded ? "true" : "false"}
            aria-controls=${pickerId}
            title=${this._et("car_choose_icon")}
            @click=${(e: Event) => this._onToggleIconPicker(e, idx)}
          >
            <ha-icon icon=${currentIcon} aria-hidden="true"></ha-icon>
          </button>
          <input
            class="car-input car-name-input"
            type="text"
            autocomplete="off"
            aria-label=${this._et("car_name_placeholder")}
            placeholder=${this._et("car_name_placeholder")}
            .value=${car.name ?? ""}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${(e: Event) => this._onCarFieldChange(idx, "name", e)}
          />
          <select
            class="car-select"
            aria-label=${this._et("car_fuel_type")}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @change=${(e: Event) => this._onCarFieldChange(idx, "fuel_type", e)}
          >
            ${(["DIE", "SUP", "GAS"] as FuelType[]).map(
              (ft) => html`
                <option value=${ft} ?selected=${car.fuel_type === ft}>
                  ${getFuelName(ft, this._ctx())}
                </option>
              `,
            )}
          </select>
          <input
            class="car-input car-tank-input"
            type="number"
            min="1"
            max="200"
            autocomplete="off"
            aria-label=${this._et("car_tank_placeholder")}
            aria-invalid=${tankInvalid ? "true" : "false"}
            aria-describedby=${tankInvalid ? tankErrorId : nothing}
            placeholder=${this._et("car_tank_placeholder")}
            .value=${car.tank_size != null ? String(car.tank_size) : ""}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${(e: Event) => this._onCarFieldChange(idx, "tank_size", e)}
          />
          <input
            class="car-input car-consumption-input"
            type="number"
            min="0"
            max="30"
            step="0.1"
            autocomplete="off"
            aria-label=${this._et("car_consumption_placeholder")}
            aria-invalid=${consumptionInvalid ? "true" : "false"}
            aria-describedby=${consumptionInvalid ? consumptionErrorId : nothing}
            placeholder=${this._et("car_consumption_placeholder")}
            .value=${car.consumption != null ? String(car.consumption) : ""}
            @click=${this._stop}
            @pointerdown=${this._stop}
            @keydown=${this._stop}
            @keyup=${this._stop}
            @keypress=${this._stop}
            @change=${(e: Event) => this._onCarFieldChange(idx, "consumption", e)}
          />
          <button
            class="car-delete-btn"
            type="button"
            aria-label=${this._et("car_delete")}
            title=${this._et("car_delete")}
            @click=${(e: Event) => this._onDeleteCar(e, idx)}
          >
            <ha-icon icon="mdi:delete-outline" aria-hidden="true"></ha-icon>
          </button>
        </div>
        ${tankInvalid
          ? html`<ha-alert
              id=${tankErrorId}
              alert-type="error"
            >${this._et("tank_size_range_error")}</ha-alert>`
          : nothing}
        ${consumptionInvalid
          ? html`<ha-alert
              id=${consumptionErrorId}
              alert-type="error"
            >${this._et("consumption_range_error")}</ha-alert>`
          : nothing}
        ${iconExpanded
          ? html`
              <div id=${pickerId} class="car-icon-picker">
                ${CAR_ICONS.map(
                  (icon) => html`
                    <button
                      class=${classMap({
                        "car-icon-option": true,
                        active: currentIcon === icon,
                      })}
                      type="button"
                      aria-label=${icon.replace("mdi:", "")}
                      aria-pressed=${currentIcon === icon ? "true" : "false"}
                      title=${icon.replace("mdi:", "")}
                      @click=${(e: Event) => this._onPickCarIcon(e, idx, icon)}
                    >
                      <ha-icon icon=${icon} aria-hidden="true"></ha-icon>
                    </button>
                  `,
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  // --- Event handlers ---

  private _stop(e: Event): void {
    e.stopPropagation();
  }

  private _toggleEntity(eid: string): void {
    const current = [...(this._config.entities ?? [])];
    const next = current.includes(eid)
      ? current.filter((e) => e !== eid)
      : [...current, eid];
    this._config = { ...this._config, entities: next };
    this._fireChanged();
  }

  private _onBooleanToggle(
    field: keyof TankstellenAustriaCardConfig,
    e: Event,
  ): void {
    const target = e.target as HTMLInputElement & { checked?: boolean };
    const checked = !!target.checked;
    this._config = { ...this._config, [field]: checked };
    this._fireChanged();
  }

  // Range slider: firing config-changed on every `input` event re-renders
  // the editor mid-drag and makes the slider thumb feel sticky. Update only
  // the visible label on input; commit on change (pointer release).
  private _onSliderInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const label = input.nextElementSibling as HTMLElement | null;
    if (label) label.textContent = input.value;
  }

  private _onSliderChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!Number.isFinite(value)) return;
    this._config = { ...this._config, max_stations: value };
    this._fireChanged();
  }

  private async _onCopyRecorderSnippet(snippet: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(snippet);
      this._copiedPulse = true;
      if (this._copiedTimeout !== undefined) clearTimeout(this._copiedTimeout);
      this._copiedTimeout = window.setTimeout(() => {
        this._copiedPulse = false;
        this._copiedTimeout = undefined;
      }, 1500);
    } catch {
      // clipboard unavailable (insecure context) — silent match with vanilla.
    }
  }

  private _onTabLabelChange(eid: string, e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    const val = sanitizeShort(target.value);
    const labels: Record<string, string> = { ...(this._config.tab_labels ?? {}) };
    if (val) labels[eid] = val;
    else delete labels[eid];
    const next: TankstellenAustriaCardConfig = { ...this._config };
    if (Object.keys(labels).length) next.tab_labels = labels;
    else delete next.tab_labels;
    this._config = next;
    this._fireChanged();
  }

  private _togglePaymentChip(key: string, isCustom: boolean): void {
    const current = [...(this._config.payment_filter ?? [])];
    const isActive = current.includes(key);

    if (isActive && isCustom) {
      if (this._pendingRemove === key) {
        // Second click: confirmed, remove.
        this._pendingRemove = null;
        this._config = {
          ...this._config,
          payment_filter: current.filter((k) => k !== key),
        };
        this._fireChanged();
      } else {
        // First click: enter confirm state.
        this._pendingRemove = key;
      }
      return;
    }

    // Built-in chip or adding — toggle directly, cancel any pending.
    this._pendingRemove = null;
    const next = isActive ? current.filter((k) => k !== key) : [...current, key];
    this._config = { ...this._config, payment_filter: next };
    this._fireChanged();
  }

  private _onCustomPmKeydown(e: KeyboardEvent): void {
    // Stop HA global shortcuts from stealing focus when typing here.
    e.stopPropagation();
    if (e.key === "Enter") this._onAddCustomPm();
  }

  private _onAddCustomPm(): void {
    const input = this.shadowRoot?.getElementById(
      "pm-custom-input",
    ) as (HTMLElement & { value?: string }) | null;
    if (!input) return;
    const val = sanitizeShort(String(input.value ?? ""));
    if (!val) return;

    this._pendingRemove = null;
    const current = [...(this._config.payment_filter ?? [])];
    if (!current.includes(val)) {
      current.push(val);
      this._config = { ...this._config, payment_filter: current };
      this._fireChanged();
    }
    input.value = "";
  }

  private _onToggleIconPicker(e: Event, idx: number): void {
    e.stopPropagation();
    this._expandedCarIcon = this._expandedCarIcon === idx ? null : idx;
  }

  private _onPickCarIcon(e: Event, idx: number, icon: string): void {
    e.stopPropagation();
    const cars = [...(this._config.cars ?? [])];
    if (!cars[idx]) return;
    cars[idx] = { ...cars[idx], icon };
    this._config = { ...this._config, cars };
    this._expandedCarIcon = null;
    this._fireChanged();
  }

  private _onCarFieldChange(
    idx: number,
    field: "name" | "fuel_type" | "tank_size" | "consumption",
    e: Event,
  ): void {
    e.stopPropagation();
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const raw = target.value;
    const cars = [...(this._config.cars ?? [])];
    const existing = cars[idx];
    if (!existing) return;
    const next: CarConfig = { ...existing };

    if (field === "consumption") {
      const trimmed = raw.trim();
      if (trimmed === "") {
        delete next.consumption;
      } else {
        const num = parseFloat(trimmed);
        if (Number.isFinite(num) && num > 0) {
          // Store user's value as typed (rounded to 0.1). Values outside
          // 0..30 surface through the aria-invalid + ha-alert pair in
          // _renderCarRow; clamping here would hide the error from the
          // user and break 3.3.1 / 3.3.3.
          next.consumption = Math.round(num * 10) / 10;
        } else {
          delete next.consumption;
        }
      }
    } else if (field === "tank_size") {
      const parsed = parseInt(raw, 10);
      next.tank_size = Math.max(1, Number.isFinite(parsed) ? parsed : 1);
    } else if (field === "fuel_type") {
      const allowed: readonly FuelType[] = ["DIE", "SUP", "GAS"];
      if (allowed.includes(raw as FuelType)) {
        next.fuel_type = raw as FuelType;
      }
    } else {
      // name
      next.name = sanitizeShort(raw);
    }

    cars[idx] = next;
    this._config = { ...this._config, cars };
    this._fireChanged();
  }

  private _onDeleteCar(e: Event, idx: number): void {
    e.stopPropagation();
    const cars = [...(this._config.cars ?? [])];
    cars.splice(idx, 1);
    this._config = { ...this._config, cars };
    // Keep _expandedCarIcon in sync — reset if the deleted row was expanded.
    if (this._expandedCarIcon === idx) {
      this._expandedCarIcon = null;
    } else if (this._expandedCarIcon != null && this._expandedCarIcon > idx) {
      this._expandedCarIcon = this._expandedCarIcon - 1;
    }
    this._fireChanged();
  }

  private _onAddCar(e: Event): void {
    e.stopPropagation();
    const cars = [...(this._config.cars ?? [])];
    cars.push({ name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" });
    this._config = { ...this._config, cars };
    this._fireChanged();
  }

  static styles: CSSResultGroup = editorStyles;
}
