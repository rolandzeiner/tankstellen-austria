import { LitElement, html, TemplateResult, CSSResultGroup, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  fireEvent,
  LovelaceCardEditor,
} from "custom-card-helpers";

import type { TankstellenAustriaCardConfig } from "./types";
import { editorStyles } from "./styles";
import { localize } from "./localize/localize";

// `fireEvent` from custom-card-helpers wraps dispatchEvent with the
// canonical `bubbles + composed` flags so the event crosses the shadow
// boundary into HA's dashboard editor. Don't roll your own — silently
// dropping `composed` is one of the easiest bugs to ship.

@customElement("tankstellen-austria-card-editor")
export class TankstellenAustriaCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: HomeAssistant;

  // IMPORTANT: initialize with a minimal valid config so the form always
  // renders. A bare `_config?: Config` can leave the editor stuck on
  // "Loading…" forever if HA's Lovelace panel is still finishing init
  // (e.g. a stale/404 resource rejected its _fetchConfig promise chain).
  @state() private _config: TankstellenAustriaCardConfig = { type: "tankstellen-austria-card" };

  public setConfig(config: TankstellenAustriaCardConfig): void {
    this._config = { ...config };
  }

  protected render(): TemplateResult {
    // Only gate on `_config` — hass may legitimately arrive a tick after
    // setConfig. The pickers below are conditionally rendered when hass
    // is available so their bindings don't choke on undefined.
    return html`
      <div class="editor">
        <div class="editor-section">
          <div class="section-header">${localize("editor.section_main")}</div>

          <ha-textfield
            label=${localize("editor.name")}
            .value=${this._config.name || ""}
            .configValue=${"name"}
            @input=${this._valueChanged}
          ></ha-textfield>

          ${this.hass
            ? html`
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ entity: {} }}
                  .value=${this._config.entity || undefined}
                  .configValue=${"entity"}
                  .label=${localize("editor.entity")}
                  .required=${false}
                  @value-changed=${this._valueChanged}
                ></ha-selector>
              `
            : html`<p>${localize("common.loading")}</p>`}
        </div>

        <div class="editor-section">
          <div class="section-header">${localize("editor.section_display")}</div>

          <div class="toggle-row">
            <label>${localize("editor.show_warning")}</label>
            <ha-switch
              .checked=${this._config.show_warning ?? false}
              .configValue=${"show_warning"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <div class="toggle-row">
            <label>${localize("editor.show_error")}</label>
            <ha-switch
              .checked=${this._config.show_error ?? false}
              .configValue=${"show_error"}
              @change=${this._valueChanged}
            ></ha-switch>
          </div>
        </div>
      </div>
    `;
  }

  // Single change handler keyed off `.configValue` set on each form
  // element — boilerplate-card pattern. Works for ha-textfield (string),
  // ha-select (string), ha-switch (boolean via .checked), ha-icon-picker
  // (string via @value-changed instead of @input), ha-area-picker (same).
  private _valueChanged(ev: Event): void {
    if (!this._config || !this.hass) return;
    const target = ev.target as EventTarget & {
      configValue?: keyof TankstellenAustriaCardConfig;
      value?: unknown;
      checked?: boolean;
    };
    if (!target.configValue) return;

    const newValue =
      target.checked !== undefined
        ? target.checked
        : (ev as CustomEvent).detail?.value ?? target.value;

    if (this._config[target.configValue] === newValue) return;

    this._config = { ...this._config, [target.configValue]: newValue };
    fireEvent(this, "config-changed", { config: this._config });
  }

  static styles: CSSResultGroup = editorStyles;
}
