// Schema-driven Lovelace editor for the Tankstellen Austria card.
//
// Design notes
// ------------
// * The static sections (entity picker, then one expandable per option
//   group: stations, header, chart, cars, footer) use
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
// * **Grouped YAML** — the editor reads and writes the v2 shape
//   (`stations`, `header`, `chart`, `cars`, `footer`). `setConfig` runs
//   a v1 config through `toGrouped`, so an old dashboard is rewritten
//   into groups on its first save. Each expandable is named after its
//   group and *not* flattened, so ha-form keeps its values under
//   `data[group]`, which is the YAML shape as it is.
//
// * **Labels by path** — `show` sits in four groups, so labels are
//   looked up as `editor.<group>_<field>`; ha-form-expandable hands
//   the group names to `computeLabel` / `computeHelper` as `path`.
//
// * **Defaults are drawn, not written** — a toggle whose key is unset
//   gets its effective default as `default` (ha-selector-boolean draws
//   `value ?? placeholder`), so the editor shows what the card does
//   without putting the default into the YAML. Selects and the station
//   count can't draw a placeholder, so `render()` puts their defaults
//   into the form data, and `_onFormChanged` takes them out again.
//
// * **Bespoke below ha-form** — three sections stay hand-rolled because
//   their row lists are data-driven (the schema would have to be
//   regenerated on every keystroke):
//     - Tab labels: one row per resolved entity
//     - Payment-filter chips: live keys from sensor + custom add
//     - Cars roster: Add / Delete / per-row inputs / icon picker
//   Same pattern wiener-linien-austria uses for its per-line section.
//
// * **Never `ha-textfield`** — it was deleted from the HA frontend on
//   2026-04-01 (frontend PR #30349, "Migrate all from ha-textfield to
//   ha-input"). An unregistered custom element is not an error: the
//   browser renders it as an unknown inline element with no box and logs
//   nothing, so the field is simply absent from the editor. Free-form
//   text goes through `<ha-selector>` with a `{ text: {} }` selector,
//   which delegates to whatever HA's current text control is (today
//   `<ha-input>`) and lazy-loads it itself. Going through the selector
//   layer rather than naming a concrete tag is what survives the next
//   rename.

import { LitElement, html, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import {
  fireEvent,
  type CarConfig,
  type CarsOptions,
  type FuelType,
  type HaFormPath,
  type HaFormSchema,
  type HomeAssistant,
  type LovelaceCardEditor,
  type StationsOptions,
  type TankstellenCardYaml,
} from "./types";
import { CAR_ICONS } from "./const";
import { fuelTypeOf } from "./utils/entities";
import { getFuelName, translate, type TranslateContext } from "./localize/localize";
import { editorStyles } from "./styles";
import { OPTION_DEFAULTS, toGrouped } from "./utils/config";

// Strip HTML-injection chars, cap length, trim. Applied to every free-form
// user-typed value before it lands in config.
function sanitizeShort(raw: string): string {
  return raw
    .replace(/[<>"'&]/g, "")
    .slice(0, 50)
    .trim();
}

// Fields that can't draw a default themselves (see the header comment).
const FILLED: Readonly<Record<string, readonly string[]>> = {
  stations: ["count", "sort", "map_provider", "payment_mode"],
};

const toggle = (group: keyof typeof OPTION_DEFAULTS, name: string): HaFormSchema => ({
  name,
  default: (OPTION_DEFAULTS[group] as Record<string, unknown>)[name],
  selector: { boolean: {} },
});

// Hoisted so the object identity is stable across renders — ha-selector
// memoises its element resolution on the selector reference, and a fresh
// literal each render defeats that.
const PM_CUSTOM_SELECTOR = { text: {} } as const;

@customElement("tankstellen-austria-card-editor")
export class TankstellenAustriaCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  // IMPORTANT: initialize with a minimal valid config so the form always
  // renders even before setConfig fires. A bare `_config?: Config` can leave
  // the editor stuck on "Loading…" forever if HA's Lovelace panel is still
  // finishing init.
  @state() private _config: TankstellenCardYaml = {
    type: "tankstellen-austria-card",
  };

  // Which car row has the icon picker expanded (index into cars[]).
  @state() private _expandedCarIcon: number | null = null;

  // Two-click-confirm gate for removing a *custom* (user-typed) payment
  // filter chip — built-in chips toggle immediately.
  @state() private _pendingRemove: string | null = null;

  // Draft text in the "add custom payment method" field. ha-selector is a
  // controlled input — it reports through `value-changed` and renders back
  // whatever we bind, so the draft has to live here rather than being read
  // off the DOM node at submit time.
  @state() private _pmDraft = "";

  // Transient "Copied" state for the recorder-snippet copy button.
  @state() private _copiedPulse = false;
  private _copiedTimeout: number | undefined;

  public setConfig(config: TankstellenCardYaml): void {
    this._config = toGrouped(config);
  }

  public override disconnectedCallback(): void {
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
   *  appear/disappear based on the parent toggle. Inside each group the
   *  fields keep their v1 order: the ones most users change come first. */
  private _schema(): ReadonlyArray<HaFormSchema> {
    const { stations = {}, header = {}, chart = {}, cars = {} } = this._config;
    const select = (name: string, values: readonly string[]): HaFormSchema => ({
      name,
      selector: {
        select: {
          mode: "dropdown",
          options: values.map((value) => ({ value, label: this._et(`${name}_${value}`) })),
        },
      },
    });

    const stationFields: HaFormSchema[] = [
      { name: "count", selector: { number: { min: 0, max: 5, step: 1, mode: "slider" } } },
      toggle("stations", "index"),
      toggle("stations", "map_links"),
      select("map_provider", ["auto", "google", "apple"]),
      toggle("stations", "distance"),
      select("sort", ["price", "distance"]),
      toggle("stations", "opening_hours"),
      toggle("stations", "payment_methods"),
    ];
    // What the filter does only matters once a chip is on.
    if (stations.payment_methods !== false && (stations.payment_filter ?? []).length > 0) {
      stationFields.push(select("payment_mode", ["filter", "highlight"]));
    }

    const group = (name: string, schema: HaFormSchema[]): HaFormSchema => ({
      type: "expandable",
      name,
      title: this._et(`section_${name}`),
      schema,
    });

    return [
      {
        // Filter to tankstellen-austria sensors only — picking an
        // unrelated `sensor.*` would render an empty card.
        // `multiple: true` enables multi-fuel-type picking. Output is
        // a flat string[] which matches the storage shape (no
        // translation needed, unlike the nextbike Array<{entity}> form).
        name: "entities",
        selector: {
          entity: {
            multiple: true,
            filter: { domain: "sensor", integration: "tankstellen_austria" },
          },
        },
      },
      group("stations", stationFields),
      group("header", [
        toggle("header", "show"),
        ...(header.show === false ? [] : [toggle("header", "price")]),
      ]),
      group("chart", [
        toggle("chart", "show"),
        ...(chart.show === false
          ? []
          : (
              ["median_line", "hour_envelope", "noon_markers", "min_max", "best_refuel"] as const
            ).map((name) => toggle("chart", name))),
      ]),
      group("cars", [
        toggle("cars", "show"),
        ...(cars.show === true ? [toggle("cars", "fill_up"), toggle("cars", "consumption")] : []),
      ]),
      group("footer", [toggle("footer", "adaptive_logo"), toggle("footer", "show")]),
    ];
  }

  /** Field-label resolver. Three-step chain:
   *  1. HA core's own translations for common field names ("entities",
   *     "name", "icon"). `hass.localize` returns "" on miss, not the
   *     lookup key, so a falsy check is the correct miss signal.
   *  2. The card's editor-namespaced bundle (`editor.<field>`).
   *  3. Last resort: raw field name (still functional, dev sees the gap). */
  private _computeLabel = (
    field: { name: string },
    _data?: unknown,
    options?: HaFormPath,
  ): string => {
    const key = this._fieldKey(field.name, options);
    if (key === field.name) {
      const ha = this.hass?.localize?.(`ui.panel.lovelace.editor.card.generic.${field.name}`);
      if (ha) return ha;
    }
    const localised = this._et(key);
    if (localised !== `editor.${key}`) return localised;
    return field.name;
  };

  /** `count` in `stations` → `stations_count`; a top-level field keeps its name. */
  private _fieldKey(name: string, options?: HaFormPath): string {
    return [...(options?.path ?? []), name].join("_");
  }

  /** Helper-text resolver. Only surfaces a helper when an
   *  `editor.<field>_helper` key actually exists in the bundle —
   *  otherwise ha-form's empty helper line eats vertical space. */
  private _computeHelper = (field: { name: string }, options?: HaFormPath): string | undefined => {
    const key = `${this._fieldKey(field.name, options)}_helper`;
    const localised = this._et(key);
    return localised === `editor.${key}` ? undefined : localised;
  };

  /** ha-form's value-changed handler. CRITICAL: set `this._config`
   *  BEFORE `fireEvent` — custom-card editors don't receive a
   *  re-setConfig after config-changed, so a fireEvent-only path
   *  leaves _config stale and the next render reverts the form to
   *  pre-change state. */
  private _onFormChanged = (ev: CustomEvent<{ value: Record<string, unknown> }>): void => {
    const value = ev.detail.value as Partial<TankstellenCardYaml>;
    // Spread on top of existing config so keys the form doesn't show
    // (tab_labels, or a group's payment_filter / items) survive.
    const next: Record<string, unknown> = { ...this._config, ...value };
    for (const [name, fields] of Object.entries(FILLED)) {
      const group = next[name];
      if (!group || typeof group !== "object") continue;
      const cleaned: Record<string, unknown> = { ...group };
      const defaults = OPTION_DEFAULTS[name as keyof typeof OPTION_DEFAULTS] as Record<
        string,
        unknown
      >;
      // render() filled these in for display; a value equal to the default
      // stays out of the saved YAML.
      for (const field of fields) {
        if (cleaned[field] === defaults[field]) delete cleaned[field];
      }
      if (Object.keys(cleaned).length > 0) next[name] = cleaned;
      else delete next[name];
    }
    this._config = next as TankstellenCardYaml;
    fireEvent(this, "config-changed", { config: this._config });
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  protected override render(): TemplateResult {
    // Don't gate the whole render on `!this.hass` — if HA's hass property
    // arrives a tick after setConfig (which happens routinely when
    // Lovelace's _fetchConfig promise chain is disrupted) the editor would
    // be stuck on the empty placeholder. ha-form re-renders when hass
    // becomes truthy, and the bespoke sections below already gate on hass
    // internally before dereferencing states.
    const chart = this._config.chart ?? {};
    const showRecorderHint = chart.show !== false && chart.best_refuel !== false;
    const filledStations = Object.fromEntries(
      (FILLED.stations ?? []).map((f) => [
        f,
        OPTION_DEFAULTS.stations[f as keyof typeof OPTION_DEFAULTS.stations],
      ]),
    );

    // Saved entity_ids that no longer resolve in hass.states (integration
    // removed, sensor disabled, typo in saved YAML). ha-form's entity
    // selector only flags this with a red outline — silent for screen
    // readers and easy to miss visually. WCAG 3.3.1 (Error
    // Identification): surface each missing entity as a user-readable
    // alert under the sensors selector. The card render path already
    // skips them (see _renderTabLabelsSection's `!!x.state` filter).
    const missingEntities = (this._config.entities ?? []).filter(
      (eid) => !!this.hass && !this.hass.states[eid],
    );

    return html`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${{
            ...this._config,
            stations: { ...filledStations, ...this._config.stations },
          }}
          .schema=${this._schema()}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._onFormChanged}
        ></ha-form>

        ${missingEntities.map(
          (eid) => html`
            <ha-alert alert-type="warning">
              ${this._et("entity_missing", { entity: eid })}
            </ha-alert>
          `,
        )}

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
        <div class="recorder-hint-actions">
          <button
            class="recorder-copy-btn"
            type="button"
            aria-label=${this._et("copy_sensor_id")}
            @click=${() => this._onCopyRecorderSnippet(snippet)}
          >
            <ha-icon icon="mdi:content-copy" aria-hidden="true"></ha-icon>
            <span class="recorder-copy-label">${label}</span>
          </button>
          <a
            class="recorder-docs-link"
            href="https://www.home-assistant.io/integrations/recorder/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ha-icon icon="mdi:open-in-new" aria-hidden="true"></ha-icon>
            <span>${this._et("recorder_hint_docs")}</span>
          </a>
        </div>
      </div>
    `;
  }

  // -- Tab labels (bespoke: row list driven by entity selection) ------

  private _renderTabLabelsSection(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const selected = this._config.entities ?? [];
    const ids = selected;
    const resolvable = ids
      .map((eid) => ({ eid, stateObj: this.hass!.states[eid] }))
      .filter((x): x is { eid: string; stateObj: NonNullable<typeof x.stateObj> } => !!x.stateObj);
    if (resolvable.length < 2) return nothing;

    const labels: Record<string, string> = this._config.tab_labels ?? {};
    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        ${resolvable.map(({ eid, stateObj }) => {
          const ft = fuelTypeOf(this.hass, eid, stateObj.attributes);
          let defaultLabel = getFuelName(ft, this._ctx());
          if (stateObj.attributes?.dynamic_mode === true) {
            const trackerLabel = stateObj.attributes.dynamic_tracker_label;
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
      const stations = (this.hass.states[eid]?.attributes?.stations ?? []) as Array<{
        payment_methods?: { others?: string[] };
      }>;
      for (const s of stations) {
        for (const o of s.payment_methods?.others ?? []) keys.add(o);
      }
    }
    return keys;
  }

  private _renderPaymentChipsSection(): TemplateResult | typeof nothing {
    if (this._config.stations?.payment_methods === false) return nothing;

    const apiPmKeys = this._collectApiPaymentKeys();
    const paymentFilter = this._config.stations?.payment_filter ?? [];
    // User-typed filter values that aren't in live data still need chips.
    const allPmKeys = new Set<string>(apiPmKeys);
    for (const f of paymentFilter) allPmKeys.add(f);

    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_payment_filter")}</div>
        <div class="pm-filter-chips">
          ${[...allPmKeys].map((key) => this._renderPaymentChip(key, paymentFilter, apiPmKeys))}
        </div>
        <div class="pm-custom-row">
          <ha-selector
            .hass=${this.hass}
            .selector=${PM_CUSTOM_SELECTOR}
            .value=${this._pmDraft}
            .label=${this._et("payment_filter_custom_placeholder")}
            .required=${false}
            @value-changed=${this._onCustomPmChanged}
            @keydown=${this._onCustomPmKeydown}
            @keyup=${this._stop}
            @keypress=${this._stop}
          ></ha-selector>
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
    const opts = this._config.cars ?? {};
    if (opts.show !== true) return nothing;

    const showCarFillup = opts.fill_up !== false;
    const showCarConsumption = opts.consumption !== false;
    const cars = opts.items ?? [];

    return html`
      <div class="editor-section">
        <div class="section-header">${this._et("section_cars")}</div>
        ${
          !showCarFillup && !showCarConsumption
            ? html`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>`
            : nothing
        }
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
    const tankInvalid = car.tank_size != null && (car.tank_size < 1 || car.tank_size > 200);
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
        ${
          tankInvalid
            ? html`<ha-alert
              id=${tankErrorId}
              alert-type="error"
            >${this._et("tank_size_range_error")}</ha-alert>`
            : nothing
        }
        ${
          consumptionInvalid
            ? html`<ha-alert
              id=${consumptionErrorId}
              alert-type="error"
            >${this._et("consumption_range_error")}</ha-alert>`
            : nothing
        }
        ${
          iconExpanded
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
            : nothing
        }
      </div>
    `;
  }

  // ------------------------------------------------------------------
  // Bespoke event handlers (tab labels, payment chips, cars roster)
  // ------------------------------------------------------------------

  private _stop = (e: Event): void => {
    e.stopPropagation();
  };

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
      // Clipboard API unavailable (insecure context) — fail silent.
    }
  }

  private _onTabLabelChange(eid: string, e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLInputElement;
    const val = sanitizeShort(target.value);
    const labels: Record<string, string> = { ...this._config.tab_labels };
    if (val) labels[eid] = val;
    else delete labels[eid];
    const next: TankstellenCardYaml = { ...this._config };
    if (Object.keys(labels).length) next.tab_labels = labels;
    else delete next.tab_labels;
    this._config = next;
    this._fireChanged();
  }

  private _togglePaymentChip(key: string, isCustom: boolean): void {
    const current = [...(this._config.stations?.payment_filter ?? [])];
    const isActive = current.includes(key);

    if (isActive && isCustom) {
      if (this._pendingRemove === key) {
        // Second click: confirmed, remove.
        this._pendingRemove = null;
        this._setStations({ payment_filter: current.filter((k) => k !== key) });
      } else {
        // First click: enter confirm state.
        this._pendingRemove = key;
      }
      return;
    }

    // Built-in chip or adding — toggle directly, cancel any pending.
    this._pendingRemove = null;
    const next = isActive ? current.filter((k) => k !== key) : [...current, key];
    this._setStations({ payment_filter: next });
  }

  private _onCustomPmChanged = (e: CustomEvent<{ value?: string }>): void => {
    // ha-selector re-fires its child's event; let it stop here rather than
    // bubbling on to the editor's own config-changed listeners.
    e.stopPropagation();
    // Clearing the field reports `undefined`, not "" — normalise.
    this._pmDraft = e.detail?.value ?? "";
  };

  private _onCustomPmKeydown = (e: KeyboardEvent): void => {
    // Stop HA global shortcuts from stealing focus when typing here.
    e.stopPropagation();
    if (e.key === "Enter") this._onAddCustomPm();
  };

  private _onAddCustomPm = (): void => {
    const val = sanitizeShort(this._pmDraft);
    if (!val) return;

    this._pendingRemove = null;
    const current = [...(this._config.stations?.payment_filter ?? [])];
    if (!current.includes(val)) {
      current.push(val);
      this._setStations({ payment_filter: current });
    }
    this._pmDraft = "";
  };

  private _onToggleIconPicker(e: Event, idx: number): void {
    e.stopPropagation();
    this._expandedCarIcon = this._expandedCarIcon === idx ? null : idx;
  }

  private _onPickCarIcon(e: Event, idx: number, icon: string): void {
    e.stopPropagation();
    const cars = [...(this._config.cars?.items ?? [])];
    if (!cars[idx]) return;
    cars[idx] = { ...cars[idx], icon };
    this._expandedCarIcon = null;
    this._setCars(cars);
  }

  private _onCarFieldChange(
    idx: number,
    field: "name" | "fuel_type" | "tank_size" | "consumption",
    e: Event,
  ): void {
    e.stopPropagation();
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const raw = target.value;
    const cars = [...(this._config.cars?.items ?? [])];
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
      // Clamp on both sides so the stored value never drifts outside the
      // 1..200 contract enforced by `utils/config.ts` and the aria-invalid
      // threshold in `_renderCarRow`. Lower-only clamping let users save
      // an out-of-range value that the UI then flagged invalid forever.
      next.tank_size = Math.min(200, Math.max(1, Number.isFinite(parsed) ? parsed : 1));
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
    this._setCars(cars);
  }

  private _onDeleteCar(e: Event, idx: number): void {
    e.stopPropagation();
    const cars = [...(this._config.cars?.items ?? [])];
    cars.splice(idx, 1);
    // Keep _expandedCarIcon in sync — reset if the deleted row was expanded.
    if (this._expandedCarIcon === idx) {
      this._expandedCarIcon = null;
    } else if (this._expandedCarIcon != null && this._expandedCarIcon > idx) {
      this._expandedCarIcon = this._expandedCarIcon - 1;
    }
    this._setCars(cars);
  }

  private _onAddCar = (e: Event): void => {
    e.stopPropagation();
    const cars = [...(this._config.cars?.items ?? [])];
    cars.push({ name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" });
    this._setCars(cars);
  };

  private _setStations(patch: Partial<StationsOptions>): void {
    this._config = { ...this._config, stations: { ...this._config.stations, ...patch } };
    this._fireChanged();
  }

  private _setCars(items: CarConfig[]): void {
    const cars: CarsOptions = { ...this._config.cars, items };
    this._config = { ...this._config, cars };
    this._fireChanged();
  }

  static override styles: CSSResultGroup = editorStyles;
}
