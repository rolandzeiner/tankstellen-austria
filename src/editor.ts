// Schema-driven Lovelace editor for the Tankstellen Austria card.
//
// Design notes
// ------------
// * The static sections (entity picker, display toggles, history sub-
//   options, cars sub-options, payment highlight, branding) use
//   ``<ha-form>`` exclusively — schema-driven so ha-form picks up the
//   active theme, supports the standard label/helper localisation
//   chain, and keeps a11y / forced-colors / focus-visible behaviour in
//   lockstep with HA core.
//
// * **Editor `_config` lifecycle gotcha** — custom-card editors do
//   NOT receive a re-`setConfig()` after dispatching `config-changed`.
//   The form-handler must therefore set ``this._config = next`` *before*
//   firing the event; otherwise the next render reads stale state and
//   the form reverts to the pre-change value.
//
// * **`expandable` + `flatten: true`** — without ``flatten``, ha-form
//   scopes inner-schema values under ``data[name]`` and the card's
//   flat-key reads silently default. Every expandable in this file
//   ships ``flatten: true``; the ``HaFormExpandableSchema`` interface
//   in ``types.ts`` declares the field explicitly so a future
//   maintainer can't add a nested expandable by accident.
//
// * **Bespoke below ha-form** — three sections stay hand-rolled because
//   their row lists are data-driven (the schema would have to be
//   regenerated on every keystroke):
//     - Tab labels: one row per resolved entity
//     - Payment-filter chips: live keys from sensor + custom add
//     - Cars roster: Add / Delete / per-row inputs / icon picker
//   Same pattern wiener-linien-austria uses for its per-line section.

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
  type CarConfig,
  type FuelType,
  type HaFormSchema,
  type HomeAssistant,
  type LovelaceCardEditor,
  type TankstellenAustriaCardConfig,
} from "./types";
import { CAR_ICONS } from "./const";
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

  // ------------------------------------------------------------------
  // ha-form schema
  // ------------------------------------------------------------------

  /** Build the ha-form schema. Called per render so option labels pick
   *  up the current `hass.language` and conditionally-shown sub-options
   *  appear/disappear based on the parent toggle. */
  private _schema(): ReadonlyArray<HaFormSchema> {
    const showHistory = this._config.show_history !== false;
    const showCars = this._config.show_cars === true;
    const showPayment = this._config.show_payment_methods !== false;
    const paymentFilter = this._config.payment_filter ?? [];

    const schema: HaFormSchema[] = [
      {
        // Filter to tankstellen-austria sensors only — picking an
        // unrelated `sensor.*` would render an empty card.
        // `multiple: true` enables multi-fuel-type picking. Output is
        // a flat string[] which matches the storage shape (no
        // translation needed, unlike the nextbike Array<{entity}> form).
        name: "entities",
        selector: {
          entity: {
            domain: "sensor",
            integration: "tankstellen_austria",
            multiple: true,
          },
        },
      },
      {
        // `flatten: true` is non-negotiable. Without it every toggle
        // below would write to `data.display.<name>` and the card's
        // flat config-key reads would silently default. The
        // HaFormExpandableSchema interface in types.ts declares
        // `flatten?: boolean` explicitly so this can't be forgotten.
        type: "expandable",
        name: "display",
        title: this._et("section_display"),
        flatten: true,
        schema: [
          {
            name: "max_stations",
            selector: {
              number: { min: 0, max: 5, step: 1, mode: "slider" },
            },
          },
          { name: "hide_header", selector: { boolean: {} } },
          { name: "hide_header_price", selector: { boolean: {} } },
          { name: "show_index", selector: { boolean: {} } },
          { name: "show_map_links", selector: { boolean: {} } },
          { name: "show_opening_hours", selector: { boolean: {} } },
          { name: "show_payment_methods", selector: { boolean: {} } },
          { name: "show_history", selector: { boolean: {} } },
        ],
      },
    ];

    if (showHistory) {
      schema.push({
        type: "expandable",
        name: "history_options",
        title: this._et("section_history"),
        flatten: true,
        schema: [
          { name: "show_median_line", selector: { boolean: {} } },
          { name: "show_hour_envelope", selector: { boolean: {} } },
          { name: "show_noon_markers", selector: { boolean: {} } },
          { name: "show_minmax", selector: { boolean: {} } },
          { name: "show_best_refuel", selector: { boolean: {} } },
        ],
      });
    }

    {
      const carsSubSchema: HaFormSchema[] = [
        { name: "show_cars", selector: { boolean: {} } },
      ];
      if (showCars) {
        carsSubSchema.push(
          { name: "show_car_fillup", selector: { boolean: {} } },
          { name: "show_car_consumption", selector: { boolean: {} } },
        );
      }
      schema.push({
        type: "expandable",
        name: "cars_options",
        title: this._et("section_cars"),
        flatten: true,
        schema: carsSubSchema,
      });
    }

    if (showPayment && paymentFilter.length > 0) {
      // Highlight-mode is only meaningful when at least one filter chip
      // is active — gating the expandable entirely is clearer than
      // showing a disabled toggle.
      schema.push({
        type: "expandable",
        name: "payment_options",
        title: this._et("section_payment_filter"),
        flatten: true,
        schema: [
          { name: "payment_highlight_mode", selector: { boolean: {} } },
        ],
      });
    }

    schema.push({
      type: "expandable",
      name: "branding",
      title: this._et("section_branding"),
      flatten: true,
      schema: [
        { name: "logo_adapt_to_theme", selector: { boolean: {} } },
        { name: "hide_attribution", selector: { boolean: {} } },
      ],
    });

    return schema;
  }

  /** Field-label resolver. Three-step chain:
   *  1. HA core's own translations for common field names ("entities",
   *     "name", "icon"). `hass.localize` returns "" on miss, not the
   *     lookup key, so a falsy check is the correct miss signal.
   *  2. The card's editor-namespaced bundle (`editor.<field>`).
   *  3. Last resort: raw field name (still functional, dev sees the gap). */
  private _computeLabel = (field: { name: string }): string => {
    const haKey = `ui.panel.lovelace.editor.card.generic.${field.name}`;
    const ha = this.hass?.localize?.(haKey);
    if (ha) return ha;
    const localised = this._et(field.name);
    if (localised !== `editor.${field.name}`) return localised;
    return field.name;
  };

  /** Helper-text resolver. Only surfaces a helper when an
   *  `editor.<field>_helper` key actually exists in the bundle —
   *  otherwise ha-form's empty helper line eats vertical space. */
  private _computeHelper = (
    field: { name: string },
  ): string | undefined => {
    const key = `${field.name}_helper`;
    const localised = this._et(key);
    return localised === `editor.${key}` ? undefined : localised;
  };

  /** ha-form's value-changed handler. CRITICAL: set `this._config`
   *  BEFORE `fireEvent` — custom-card editors don't receive a
   *  re-setConfig after config-changed, so a fireEvent-only path
   *  leaves _config stale and the next render reverts the form to
   *  pre-change state. */
  private _onFormChanged = (
    ev: CustomEvent<{ value: Record<string, unknown> }>,
  ): void => {
    const value = ev.detail.value;
    // Spread on top of existing config so bespoke-section keys
    // (tab_labels, payment_filter, cars) survive form-only changes.
    const next: TankstellenAustriaCardConfig = {
      ...this._config,
      ...(value as Partial<TankstellenAustriaCardConfig>),
    };
    this._config = next;
    fireEvent(this, "config-changed", { config: next });
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  protected render(): TemplateResult {
    if (!this.hass) {
      // ha-form needs hass to translate field labels; render nothing
      // until it lands. setConfig already populated _config with a
      // minimal value so we don't need to gate on it.
      return html`<div class="editor"></div>`;
    }

    const showHistory = this._config.show_history !== false;
    const showBestRefuel = this._config.show_best_refuel !== false;
    const showRecorderHint = showHistory && showBestRefuel;

    return html`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config as Record<string, unknown>}
          .schema=${this._schema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._onFormChanged}
        ></ha-form>

        ${showRecorderHint ? this._renderRecorderHint() : nothing}
        ${this._renderTabLabelsSection()}
        ${this._renderPaymentChipsSection()}
        ${this._renderCarsRosterSection()}
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

  // -- Tab labels (bespoke: row list driven by entity selection) ------

  private _renderTabLabelsSection(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const selected = this._config.entities ?? [];
    const ids = selected;
    const resolvable = ids
      .map((eid) => ({ eid, state: this.hass!.states[eid] }))
      .filter(
        (x): x is { eid: string; state: NonNullable<typeof x.state> } =>
          !!x.state,
      );
    if (resolvable.length < 2) return nothing;

    const labels: Record<string, string> = this._config.tab_labels ?? {};
    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        ${resolvable.map(({ eid, state }) => {
          const ft = state.attributes?.fuel_type ?? "";
          let defaultLabel = getFuelName(ft, this._ctx());
          if (state.attributes?.dynamic_mode === true) {
            const trackerLabel = state.attributes.dynamic_tracker_label as
              | string
              | undefined;
            if (trackerLabel) defaultLabel += ` · ${trackerLabel}`;
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

  // -- Payment chips (bespoke: derived from live sensor attrs) --------

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

  private _renderPaymentChipsSection(): TemplateResult | typeof nothing {
    const showPayment = this._config.show_payment_methods !== false;
    if (!showPayment) return nothing;

    const apiPmKeys = this._collectApiPaymentKeys();
    const paymentFilter = this._config.payment_filter ?? [];
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

  // -- Cars roster (bespoke: data-driven row list with icon picker) ---

  private _renderCarsRosterSection(): TemplateResult | typeof nothing {
    const showCars = this._config.show_cars === true;
    if (!showCars) return nothing;

    const showCarFillup = this._config.show_car_fillup !== false;
    const showCarConsumption = this._config.show_car_consumption !== false;
    const cars = this._config.cars ?? [];

    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_cars")}</div>
        ${!showCarFillup && !showCarConsumption
          ? html`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>`
          : nothing}
        ${cars.map((car, idx) => this._renderCarRow(car, idx))}
        <button class="car-add-btn" type="button" @click=${this._onAddCar}>
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
            @change=${(e: Event) =>
              this._onCarFieldChange(idx, "consumption", e)}
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

  // ------------------------------------------------------------------
  // Bespoke event handlers (tab labels, payment chips, cars roster)
  // ------------------------------------------------------------------

  private _stop(e: Event): void {
    e.stopPropagation();
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
