// Lovelace editor for the Tankstellen Austria card.
//
// Layout
// ------
// * The sensor picker sits bare at the top, with the tab labels under it
//   once two sensors resolve. Every other option lives in one panel per
//   group of the v2 YAML (`stations`, `header`, `chart`, `cars`, `footer`),
//   in that order: the parts people change most come first.
//
// * Each panel is an `ha-expansion-panel` with an icon, a title and a
//   one-line summary of what the group is set to, so nobody has to open
//   it to learn its state. A built-in `expandable` can't show a summary
//   or hold the car list, which is why the panels are placed by hand.
//
// * A panel holds one `ha-form` over its own group object, plus whatever
//   belongs to that part of the card: the recorder hint in Price history,
//   the car list in Cars. Everything is an HA selector, the live payment
//   methods included (a multi-select that takes typed values too), so
//   the editor follows the theme, dark mode and HA's own controls.
//
// * A panel's body is built only while it is open (`expanded-will-change`).
//   `expanded` is never bound: the panel owns its open state, and a bound
//   one keeps a pixel height that spills over the panels below.
//
// Config
// ------
// * **Editor `_config` lifecycle**: custom-card editors do NOT receive a
//   re-`setConfig()` after dispatching `config-changed`, so every change
//   sets `this._config` before firing the event; otherwise the next
//   render reads stale state and the form reverts.
//
// * **Grouped YAML**: `setConfig` runs a v1 config through `toGrouped`,
//   so an old dashboard is rewritten into groups on its first save.
//
// * **Defaults are drawn, not written**: a toggle gets its default as
//   `default` (ha-selector-boolean draws `value ?? placeholder`); selects
//   and the station count can't draw one, so their defaults go into the
//   form data. On save every value equal to its default is dropped, and a
//   group left empty goes with it.
//
// * **Never `ha-textfield`**: it was deleted from the HA frontend on
//   2026-04-01 (frontend PR #30349). An unregistered custom element renders
//   as nothing and logs nothing. Text goes through `ha-form` / `ha-selector`,
//   which delegate to whatever HA's current text control is.

import { LitElement, html, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  fireEvent,
  type CarConfig,
  type FuelType,
  type HaFormSchema,
  type HomeAssistant,
  type LovelaceCardEditor,
  type TankstellenCardYaml,
} from "./types";
import { fuelTypeOf } from "./utils/entities";
import { getFuelName, translate, type TranslateContext } from "./localize/localize";
import { editorStyles } from "./styles";
import { OPTION_DEFAULTS, toGrouped } from "./utils/config";

type Group = keyof typeof OPTION_DEFAULTS;
type Data = Record<string, unknown>;
type Label = (field: { name: string }) => string;
type Helper = (field: { name: string }) => string | undefined;

const GROUPS: readonly Group[] = ["stations", "header", "chart", "cars", "footer"];

// One outline icon per section, as in the sibling cards' editors.
const GROUP_ICONS = {
  stations: "mdi:gas-station-outline",
  header: "mdi:page-layout-header",
  chart: "mdi:chart-line",
  cars: "mdi:car-outline",
  footer: "mdi:page-layout-footer",
} as const satisfies Record<Group, string>;

// Fields that can't draw a default themselves: their defaults go into the
// form data for display and come out again on save.
const FILLED: Readonly<Partial<Record<Group, readonly string[]>>> = {
  stations: ["count", "sort", "tile_shape", "map_provider", "payment_mode"],
};

const FUEL_TYPES: readonly FuelType[] = ["DIE", "SUP", "GAS"];
const BUILT_IN_PAYMENT = ["cash", "debit_card", "credit_card"] as const;
const NEW_CAR: CarConfig = { name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" };

// Strip HTML-injection chars, cap length, trim. Applied to every free-form
// user-typed value before it lands in config.
function sanitizeShort(raw: string): string {
  return raw
    .replace(/[<>"'&]/g, "")
    .slice(0, 50)
    .trim();
}

const toggle = (group: Group, name: string): HaFormSchema => ({
  name,
  default: (OPTION_DEFAULTS[group] as Data)[name],
  selector: { boolean: {} },
});

/** Drop every group value equal to its default, an empty list, and a group
 *  left with nothing in it. */
function tidy(config: TankstellenCardYaml): TankstellenCardYaml {
  const out: Data = { ...config };
  for (const name of GROUPS) {
    const group = out[name];
    if (!group || typeof group !== "object" || Array.isArray(group)) continue;
    const defaults = OPTION_DEFAULTS[name] as Data;
    const cleaned: Data = {};
    for (const [key, value] of Object.entries(group as Data)) {
      if (value === undefined || value === null || value === defaults[key]) continue;
      if (Array.isArray(value) && value.length === 0) continue;
      cleaned[key] = value;
    }
    if (Object.keys(cleaned).length > 0) out[name] = cleaned;
    else delete out[name];
  }
  if (Array.isArray(out.entities) && out.entities.length === 0) delete out.entities;
  return out as TankstellenCardYaml;
}

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

  // Panels whose body is built: a record of what each panel did, never
  // bound back to it.
  @state() private _open: ReadonlySet<Group> = new Set();

  // The car whose fields are showing; at most one at a time.
  @state() private _openCar: number | null = null;

  // Transient "Copied" state for the recorder-snippet copy button.
  @state() private _copiedPulse = false;
  private _copiedTimeout: number | undefined;

  // ha-form re-renders when computeLabel changes identity; keep one per form.
  private _labels = new Map<string, Label>();
  private _helpers = new Map<string, Helper>();

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

  /** The editor string, or undefined when the bundle has none. */
  private _maybe(key: string): string | undefined {
    const text = this._et(key);
    return text === `editor.${key}` ? undefined : text;
  }

  private _commit(next: TankstellenCardYaml): void {
    this._config = tidy(next);
    // fireEvent sets bubbles + composed for us (crosses the shadow boundary).
    fireEvent(this, "config-changed", { config: this._config });
  }

  /** Effective value of a group option: the saved one, else the default. */
  private _opt(group: Group, key: string): unknown {
    const saved = (this._config[group] as Data | undefined)?.[key];
    return saved ?? (OPTION_DEFAULTS[group] as Data)[key];
  }

  // ------------------------------------------------------------------
  // Labels
  // ------------------------------------------------------------------

  /** Labels for one form. Group fields read `editor.<group>_<field>`; the
   *  top form tries HA's own translation first ("entities"). */
  private _labelFor(prefix: string | null): Label {
    const key = prefix ?? "";
    let fn = this._labels.get(key);
    if (!fn) {
      fn = (field) => {
        if (prefix === null) {
          const ha = this.hass?.localize?.(`ui.panel.lovelace.editor.card.generic.${field.name}`);
          if (ha) return ha;
        }
        return this._maybe(prefix === null ? field.name : `${prefix}_${field.name}`) ?? field.name;
      };
      this._labels.set(key, fn);
    }
    return fn;
  }

  /** Helper text only where the bundle has an `_helper` key; otherwise
   *  ha-form's empty helper line eats vertical space. */
  private _helperFor(prefix: string | null): Helper {
    const key = prefix ?? "";
    let fn = this._helpers.get(key);
    if (!fn) {
      fn = (field) => this._maybe(`${prefix === null ? "" : `${prefix}_`}${field.name}_helper`);
      this._helpers.set(key, fn);
    }
    return fn;
  }

  // ------------------------------------------------------------------
  // Schemas
  // ------------------------------------------------------------------

  private _select(name: string, values: readonly string[]): HaFormSchema {
    return {
      name,
      selector: {
        select: {
          mode: "dropdown",
          options: values.map((value) => ({ value, label: this._et(`${name}_${value}`) })),
        },
      },
    };
  }

  /** Inside each group the fields keep their v1 order: the ones most users
   *  change come first. A sub-option is left out while its switch is off. */
  private _groupSchema(group: Group): HaFormSchema[] {
    const on = (key: string): boolean => this._opt(group, key) === true;
    switch (group) {
      case "stations": {
        const filter = this._config.stations?.payment_filter ?? [];
        return [
          { name: "count", selector: { number: { min: 0, max: 5, step: 1, mode: "slider" } } },
          // Rank and brand share the tile: either one, or neither.
          toggle("stations", "index"),
          toggle("stations", "brand"),
          ...(on("index") || on("brand") ? [this._select("tile_shape", ["square", "circle"])] : []),
          toggle("stations", "map_links"),
          this._select("map_provider", ["auto", "google", "apple"]),
          toggle("stations", "distance"),
          this._select("sort", ["price", "distance"]),
          toggle("stations", "opening_hours"),
          toggle("stations", "payment_methods"),
          ...(on("payment_methods") ? [this._paymentFilterField()] : []),
          // What the filter does only matters once a method is picked.
          ...(on("payment_methods") && filter.length > 0
            ? [this._select("payment_mode", ["filter", "highlight"])]
            : []),
        ];
      }
      case "header":
        return [toggle("header", "show"), ...(on("show") ? [toggle("header", "price")] : [])];
      case "chart":
        return [
          toggle("chart", "show"),
          ...(on("show")
            ? (
                ["median_line", "hour_envelope", "noon_markers", "min_max", "best_refuel"] as const
              ).map((name) => toggle("chart", name))
            : []),
        ];
      case "cars":
        return [
          toggle("cars", "show"),
          ...(on("show") ? [toggle("cars", "fill_up"), toggle("cars", "consumption")] : []),
        ];
      case "footer":
        return [
          toggle("footer", "show"),
          ...(on("show") ? [toggle("footer", "adaptive_logo")] : []),
        ];
    }
  }

  /** The payment methods the sensors report, plus whatever was typed in. */
  private _paymentFilterField(): HaFormSchema {
    const keys = new Set<string>(BUILT_IN_PAYMENT);
    for (const eid of this._config.entities ?? []) {
      const stations = (this.hass?.states[eid]?.attributes?.stations ?? []) as Array<{
        payment_methods?: { others?: string[] };
      }>;
      for (const s of stations) for (const o of s.payment_methods?.others ?? []) keys.add(o);
    }
    for (const typed of this._config.stations?.payment_filter ?? []) keys.add(typed);
    const label = (key: string): string =>
      (BUILT_IN_PAYMENT as readonly string[]).includes(key) ? this._ct(key) : key;
    return {
      name: "payment_filter",
      selector: {
        select: {
          multiple: true,
          custom_value: true,
          options: [...keys].map((value) => ({ value, label: label(value) })),
        },
      },
    };
  }

  private _carSchema(): HaFormSchema[] {
    return [
      { name: "name", selector: { text: {} } },
      {
        name: "fuel_type",
        selector: {
          select: {
            mode: "dropdown",
            options: FUEL_TYPES.map((ft) => ({ value: ft, label: getFuelName(ft, this._ctx()) })),
          },
        },
      },
      {
        name: "tank_size",
        selector: { number: { min: 1, max: 200, step: 1, mode: "box", unit_of_measurement: "l" } },
      },
      {
        name: "consumption",
        selector: {
          number: { min: 0, max: 30, step: 0.1, mode: "box", unit_of_measurement: "l/100 km" },
        },
      },
      { name: "icon", selector: { icon: { placeholder: "mdi:car" } } },
    ];
  }

  // ------------------------------------------------------------------
  // Summaries
  // ------------------------------------------------------------------

  /** One line under a panel's title: what the group is set to. */
  private _summary(group: Group): string {
    const hidden = this._et("summary_hidden");
    const parts: string[] = [];
    switch (group) {
      case "stations": {
        const count = Number(this._opt("stations", "count"));
        if (count === 0) return hidden;
        parts.push(
          count === 1
            ? this._et("summary_stations_one")
            : this._et("summary_stations", { count: String(count) }),
        );
        parts.push(this._et(`sort_${String(this._opt("stations", "sort"))}`));
        const filter = this._config.stations?.payment_filter ?? [];
        if (filter.length > 0 && this._opt("stations", "payment_methods") === true) {
          parts.push(this._et("summary_filter", { methods: filter.join(", ") }));
        } else if (this._opt("stations", "brand") === true) {
          parts.push(this._et("summary_brand"));
        }
        break;
      }
      case "header":
        if (this._opt("header", "show") !== true) return hidden;
        parts.push(
          this._et(
            this._opt("header", "price") === true ? "summary_header_price" : "summary_header_title",
          ),
        );
        break;
      case "chart": {
        if (this._opt("chart", "show") !== true) return hidden;
        const extras = [
          "best_refuel",
          "min_max",
          "median_line",
          "hour_envelope",
          "noon_markers",
        ] as const;
        for (const key of extras) {
          if (this._opt("chart", key) === true) parts.push(this._et(`summary_chart_${key}`));
        }
        if (parts.length === 0) parts.push(this._et("summary_chart_plain"));
        break;
      }
      case "cars": {
        if (this._opt("cars", "show") !== true) return hidden;
        const n = this._config.cars?.items?.length ?? 0;
        parts.push(
          n === 0
            ? this._et("summary_cars_none")
            : n === 1
              ? this._et("summary_cars_one")
              : this._et("summary_cars", { count: String(n) }),
        );
        break;
      }
      case "footer":
        if (this._opt("footer", "show") !== true) return hidden;
        parts.push(this._et("summary_shown"));
        if (this._opt("footer", "adaptive_logo") === true) {
          parts.push(this._et("summary_adaptive_logo"));
        }
        break;
    }
    return parts.slice(0, 3).join(" · ");
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  protected override render(): TemplateResult {
    // Don't gate the whole render on `!this.hass`: if HA's hass property
    // arrives a tick after setConfig, the editor would be stuck empty.
    // ha-form re-renders when hass becomes truthy, and the code below
    // checks hass before reading states.

    // Saved entity_ids that no longer resolve (integration removed, sensor
    // disabled, a typo in YAML). The entity selector only outlines them in
    // red, which a screen reader never hears (WCAG 3.3.1), so each gets an
    // alert under the picker. The card itself skips them.
    const missingEntities = (this._config.entities ?? []).filter(
      (eid) => !!this.hass && !this.hass.states[eid],
    );

    return html`
      <div class="editor">
        <ha-form
          data-form="entities"
          .hass=${this.hass}
          .data=${{ entities: this._config.entities }}
          .schema=${[
            {
              // Only this integration's sensors: an unrelated `sensor.*`
              // would render an empty card.
              name: "entities",
              selector: {
                entity: {
                  multiple: true,
                  filter: { domain: "sensor", integration: "tankstellen_austria" },
                },
              },
            },
          ]}
          .computeLabel=${this._labelFor(null)}
          .computeHelper=${this._helperFor(null)}
          @value-changed=${this._onEntitiesChanged}
        ></ha-form>
        ${missingEntities.map(
          (eid) => html`
            <ha-alert alert-type="warning">${this._et("entity_missing", { entity: eid })}</ha-alert>
          `,
        )}
        ${this._renderTabLabels()} ${GROUPS.map((group) => this._renderPanel(group))}
      </div>
    `;
  }

  private _renderPanel(group: Group): TemplateResult {
    return html`
      <ha-expansion-panel
        outlined
        data-group=${group}
        .header=${this._et(`section_${group}`)}
        .secondary=${this._summary(group)}
        @expanded-will-change=${(ev: CustomEvent<{ expanded: boolean }>) =>
          this._setOpen(group, ev.detail.expanded)}
      >
        <ha-icon slot="leading-icon" icon=${GROUP_ICONS[group]}></ha-icon>
        ${this._open.has(group) ? this._renderBody(group) : nothing}
      </ha-expansion-panel>
    `;
  }

  private _renderBody(group: Group): TemplateResult {
    const filled = Object.fromEntries(
      (FILLED[group] ?? []).map((f) => [f, (OPTION_DEFAULTS[group] as Data)[f]]),
    );
    const showRecorderHint =
      group === "chart" &&
      this._opt("chart", "show") === true &&
      this._opt("chart", "best_refuel") === true;
    return html`
      <div class="panel-body">
        <ha-form
          data-form=${group}
          .hass=${this.hass}
          .data=${{ ...filled, ...(this._config[group] as Data | undefined) }}
          .schema=${this._groupSchema(group)}
          .computeLabel=${this._labelFor(group)}
          .computeHelper=${this._helperFor(group)}
          @value-changed=${(ev: CustomEvent<{ value: Data }>) => this._onGroupChanged(group, ev)}
        ></ha-form>
        ${showRecorderHint ? this._renderRecorderHint() : nothing}
        ${group === "cars" && this._opt("cars", "show") === true ? this._renderCars() : nothing}
      </div>
    `;
  }

  private _renderTabLabels(): TemplateResult | typeof nothing {
    if (!this.hass) return nothing;
    const resolvable = (this._config.entities ?? []).filter((eid) => !!this.hass!.states[eid]);
    if (resolvable.length < 2) return nothing;
    const defaults = new Map(resolvable.map((eid) => [eid, this._defaultTabLabel(eid)]));
    return html`
      <div class="tab-labels">
        <div class="section-header">${this._et("section_tab_labels")}</div>
        <ha-form
          data-form="tab_labels"
          .hass=${this.hass}
          .data=${this._config.tab_labels ?? {}}
          .schema=${resolvable.map((eid) => ({ name: eid, selector: { text: {} } }))}
          .computeLabel=${(field: { name: string }) => defaults.get(field.name) ?? field.name}
          @value-changed=${this._onTabLabelsChanged}
        ></ha-form>
        <div class="editor-hint">${this._et("tab_labels_hint")}</div>
      </div>
    `;
  }

  private _defaultTabLabel(eid: string): string {
    const stateObj = this.hass!.states[eid]!;
    let label = getFuelName(fuelTypeOf(this.hass, eid, stateObj.attributes), this._ctx());
    if (stateObj.attributes?.dynamic_mode === true) {
      const tracker = stateObj.attributes.dynamic_tracker_label;
      if (tracker) label += ` · ${tracker}`;
    }
    return label;
  }

  private _renderRecorderHint(): TemplateResult {
    const snippet = `recorder:\n  purge_keep_days: 30`;
    return html`
      <div class="recorder-hint">
        <div class="recorder-hint-text">${this._et("recorder_hint_intro")}</div>
        <pre class="recorder-snippet"><code>${snippet}</code></pre>
        <div class="recorder-hint-actions">
          <ha-button
            appearance="plain"
            size="small"
            aria-label=${this._et("copy_recorder_snippet")}
            @click=${() => this._onCopyRecorderSnippet(snippet)}
          >
            <ha-icon slot="start" icon="mdi:content-copy" aria-hidden="true"></ha-icon>
            ${this._copiedPulse ? this._et("copied") : this._et("copy")}
          </ha-button>
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

  // -- Cars: one outlined list, one car open at a time ----------------

  private _renderCars(): TemplateResult {
    const cars = this._config.cars?.items ?? [];
    const bothOff =
      this._opt("cars", "fill_up") !== true && this._opt("cars", "consumption") !== true;
    return html`
      ${bothOff ? html`<div class="editor-hint">${this._et("cars_both_off_hint")}</div>` : nothing}
      ${
        cars.length > 0
          ? html`<ul class="car-list">
            ${cars.map((car, idx) => this._renderCar(car, idx, cars.length))}
          </ul>`
          : nothing
      }
      <ha-button appearance="plain" class="car-add" @click=${this._onAddCar}>
        <ha-icon slot="start" icon="mdi:plus" aria-hidden="true"></ha-icon>
        ${this._et("add_car")}
      </ha-button>
    `;
  }

  private _renderCar(car: CarConfig, idx: number, total: number): TemplateResult {
    const open = this._openCar === idx;
    const bodyId = `tsa-car-${idx}`;
    const details = [
      getFuelName(car.fuel_type, this._ctx()),
      `${car.tank_size} l`,
      ...(car.consumption != null ? [`${car.consumption} l/100 km`] : []),
    ].join(" · ");
    const consumptionInvalid =
      car.consumption != null && (car.consumption < 0 || car.consumption > 30);
    return html`
      <li class="car-item">
        <div class="car-head">
          <button
            class="car-toggle"
            type="button"
            aria-expanded=${open ? "true" : "false"}
            aria-controls=${bodyId}
            @click=${() => (this._openCar = open ? null : idx)}
          >
            <ha-icon icon=${car.icon || "mdi:car"} aria-hidden="true"></ha-icon>
            <span class="car-text">
              <span class="car-name"
                >${car.name || this._et("car_unnamed", { n: String(idx + 1) })}</span
              >
              <span class="car-details">${details}</span>
            </span>
          </button>
          <ha-icon-button
            .label=${this._et("car_move_up")}
            .disabled=${idx === 0}
            @click=${() => this._moveCar(idx, -1)}
          >
            <ha-icon icon="mdi:arrow-up" aria-hidden="true"></ha-icon>
          </ha-icon-button>
          <ha-icon-button
            .label=${this._et("car_move_down")}
            .disabled=${idx === total - 1}
            @click=${() => this._moveCar(idx, 1)}
          >
            <ha-icon icon="mdi:arrow-down" aria-hidden="true"></ha-icon>
          </ha-icon-button>
          <ha-icon-button .label=${this._et("car_delete")} @click=${() => this._deleteCar(idx)}>
            <ha-icon icon="mdi:delete-outline" aria-hidden="true"></ha-icon>
          </ha-icon-button>
        </div>
        ${
          open
            ? html`<div class="car-body" id=${bodyId}>
              <ha-form
                data-form="car"
                .hass=${this.hass}
                .data=${car}
                .schema=${this._carSchema()}
                .computeLabel=${this._labelFor("car")}
                .computeHelper=${this._helperFor("car")}
                @value-changed=${(ev: CustomEvent<{ value: Data }>) => this._onCarChanged(idx, ev)}
              ></ha-form>
              ${
                consumptionInvalid
                  ? html`<ha-alert alert-type="error">${this._et("consumption_range_error")}</ha-alert>`
                  : nothing
              }
            </div>`
            : nothing
        }
      </li>
    `;
  }

  // ------------------------------------------------------------------
  // Changes
  // ------------------------------------------------------------------

  private _setOpen(group: Group, expanded: boolean): void {
    const next = new Set(this._open);
    if (expanded) next.add(group);
    else next.delete(group);
    this._open = next;
  }

  private _onEntitiesChanged = (ev: CustomEvent<{ value: Data }>): void => {
    ev.stopPropagation();
    const entities = ev.detail.value.entities as string[] | undefined;
    const next: TankstellenCardYaml = { ...this._config };
    if (entities && entities.length > 0) next.entities = entities;
    else delete next.entities;
    this._commit(next);
  };

  private _onTabLabelsChanged = (ev: CustomEvent<{ value: Data }>): void => {
    ev.stopPropagation();
    const labels: Record<string, string> = {};
    for (const [eid, raw] of Object.entries(ev.detail.value)) {
      const value = typeof raw === "string" ? sanitizeShort(raw) : "";
      if (value) labels[eid] = value;
    }
    const next: TankstellenCardYaml = { ...this._config };
    if (Object.keys(labels).length > 0) next.tab_labels = labels;
    else delete next.tab_labels;
    this._commit(next);
  };

  /** A group's form reports the whole group; merge it over the saved one so
   *  keys the form doesn't show (`cars.items`, a hidden sub-option) stay. */
  private _onGroupChanged(group: Group, ev: CustomEvent<{ value: Data }>): void {
    ev.stopPropagation();
    const merged: Data = { ...(this._config[group] as Data | undefined), ...ev.detail.value };
    if (group === "stations") {
      // Switching one of rank and brand on switches the other off.
      const was = (key: string): boolean => this._opt("stations", key) === true;
      if (merged.brand === true && !was("brand")) merged.index = false;
      else if (merged.index === true && !was("index")) merged.brand = false;
    }
    if (group === "stations" && Array.isArray(merged.payment_filter)) {
      const typed = (merged.payment_filter as unknown[]).map((v) => sanitizeShort(String(v)));
      merged.payment_filter = [...new Set(typed.filter(Boolean))];
    }
    this._commit({ ...this._config, [group]: merged });
  }

  private _onCarChanged(idx: number, ev: CustomEvent<{ value: Data }>): void {
    ev.stopPropagation();
    const cars = [...(this._config.cars?.items ?? [])];
    const existing = cars[idx];
    if (!existing) return;
    const value = ev.detail.value;
    const next: CarConfig = { ...existing };
    if (typeof value.name === "string") next.name = sanitizeShort(value.name);
    if (FUEL_TYPES.includes(value.fuel_type as FuelType)) {
      next.fuel_type = value.fuel_type as FuelType;
    }
    if (typeof value.tank_size === "number" && Number.isFinite(value.tank_size)) {
      // The card's contract is 1..200 l; clamp so the saved value is one it reads.
      next.tank_size = Math.min(200, Math.max(1, Math.round(value.tank_size)));
    }
    if (typeof value.consumption === "number" && Number.isFinite(value.consumption)) {
      // Kept as typed (to 0.1); out of range shows the alert under the form
      // instead of being clamped out of sight (WCAG 3.3.1 / 3.3.3).
      next.consumption = Math.round(value.consumption * 10) / 10;
    } else {
      delete next.consumption;
    }
    next.icon =
      typeof value.icon === "string" && value.icon.startsWith("mdi:") ? value.icon : "mdi:car";
    cars[idx] = next;
    this._setCars(cars);
  }

  private _onAddCar = (): void => {
    const cars = [...(this._config.cars?.items ?? []), { ...NEW_CAR }];
    this._openCar = cars.length - 1;
    this._setCars(cars);
  };

  private _moveCar(idx: number, by: -1 | 1): void {
    const cars = [...(this._config.cars?.items ?? [])];
    const to = idx + by;
    const car = cars[idx];
    if (!car || to < 0 || to >= cars.length) return;
    cars.splice(idx, 1);
    cars.splice(to, 0, car);
    // The open car moves with its row.
    if (this._openCar === idx) this._openCar = to;
    else if (this._openCar === to) this._openCar = idx;
    this._setCars(cars);
  }

  private _deleteCar(idx: number): void {
    const cars = [...(this._config.cars?.items ?? [])];
    cars.splice(idx, 1);
    if (this._openCar === idx) this._openCar = null;
    else if (this._openCar != null && this._openCar > idx) this._openCar -= 1;
    this._setCars(cars);
  }

  private _setCars(items: CarConfig[]): void {
    this._commit({ ...this._config, cars: { ...this._config.cars, items } });
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
      // Clipboard API unavailable (insecure context); the snippet stays
      // selectable on screen.
    }
  }

  static override styles: CSSResultGroup = editorStyles;
}
