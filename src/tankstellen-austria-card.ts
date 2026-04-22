// Tankstellen Austria — Lovelace custom card
// https://github.com/rolandzeiner/tankstellen-austria
//
// Architecture: Lit 3 + Shadow DOM + Rollup, single-file HACS bundle.
// Built from the ha-lovelace-card skill (which is faithfully derived from
// custom-cards/boilerplate-card).

import {
  LitElement,
  html,
  TemplateResult,
  PropertyValues,
  CSSResultGroup,
  nothing,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
} from "custom-card-helpers";

import type { TankstellenAustriaCardConfig } from "./types";
import { actionHandler } from "./action-handler-directive";
import { CARD_VERSION } from "./const";
import { localize } from "./localize/localize";
import { cardStyles } from "./styles";

// Eagerly register the editor's custom element. With
// `inlineDynamicImports: true` the editor code is already in this bundle —
// importing it at the top guarantees `customElements.define(…)` has run
// before `getConfigElement`'s `createElement(...)` call, avoiding a race
// where HA creates an unregistered element and silently falls back to
// YAML-mode editing.
import "./editor";

// Styled console banner — easy to spot in the browser console for
// version-mismatch debugging in HA. Stays in production builds.
console.info(
  `%c  Tankstellen Austria Card  %c  ${localize("common.version")} ${CARD_VERSION}  `,
  "color: white; font-weight: bold; background: #DC2026",
  "color: white; font-weight: bold; background: dimgray",
);

// Make the card show up in the Lovelace "Add Card" picker.
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
  description: "Austrian fuel prices from E-Control with sparklines and best-refuel analytics.",
  preview: true,
  documentationURL: "https://github.com/rolandzeiner/tankstellen-austria",
});

@customElement("tankstellen-austria-card")
export class TankstellenAustriaCard extends LitElement {
  // The editor element is registered via the top-level `import "./editor"`
  // above. No await here — `customElements.define("tankstellen-austria-card-editor", …)`
  // has already run by the time this method is called.
  public static getConfigElement(): LovelaceCardEditor {
    return document.createElement(
      "tankstellen-austria-card-editor",
    ) as LovelaceCardEditor;
  }

  // Returned when the user adds this card from the picker without
  // opening the editor first. TODO: include any required fields.
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // Set by HA on every state change anywhere in the system.
  // attribute: false — too large to round-trip as a serialised attribute.
  @property({ attribute: false }) public hass!: HomeAssistant;

  // Internal-only — won't show up as a public attribute.
  @state() private config!: TankstellenAustriaCardConfig;

  public setConfig(config: TankstellenAustriaCardConfig): void {
    if (!config) {
      throw new Error(localize("common.invalid_configuration"));
    }
    // Spread defaults first so the user's config overrides them.
    this.config = {
      name: "Tankstellen Austria",
      ...config,
    };
  }

  // Performance gate — without this, every entity change anywhere in HA
  // re-renders the card. `hasConfigOrEntityChanged` returns true only
  // when config changed or the tracked `config.entity` state changed.
  // For multi-entity cards, replace this with your own fingerprint:
  //   const old = changedProps.get('hass') as HomeAssistant | undefined;
  //   if (!old) return true;
  //   return ['sensor.a', 'sensor.b'].some(id =>
  //     old.states[id] !== this.hass.states[id]);
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) return false;
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // The HA card layout uses this to decide how many grid rows to allocate.
  // Roughly: 1 = "tile-sized", 3 = "small", 6 = "medium", 12 = "large".
  public getCardSize(): number {
    return 3;
  }

  protected render(): TemplateResult {
    if (this.config.show_warning) {
      return this._showWarning(localize("common.show_warning"));
    }
    if (this.config.show_error) {
      return this._showError(localize("common.show_error"));
    }
    if (!this.hass) {
      return html`<ha-card><div class="card-content empty-state">…</div></ha-card>`;
    }

    const stateObj = this.config.entity
      ? this.hass.states[this.config.entity]
      : undefined;

    const actionHandlerConfig = {
      hasHold: hasAction(this.config.hold_action),
      hasDoubleClick: hasAction(this.config.double_tap_action),
    };

    return html`
      <ha-card
        .header=${this.config.name}
        @action=${this._handleAction}
        .actionHandler=${actionHandler(actionHandlerConfig)}
        tabindex="0"
      >
        <div class="card-content">
          ${stateObj
            ? html`
                <div class="header">${stateObj.attributes.friendly_name}</div>
                <div>${stateObj.state}${stateObj.attributes.unit_of_measurement || ""}</div>
              `
            : html`<div class="empty-state">${localize("common.show_warning")}</div>`}
        </div>
      </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html`<hui-warning>${warning}</hui-warning>`;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement("hui-error-card");
    // hui-error-card is registered globally by HA at runtime.
    (errorCard as unknown as { setConfig: (c: object) => void }).setConfig({
      type: "error",
      error,
      origConfig: this.config,
    });
    return html`${errorCard}`;
  }

  static styles: CSSResultGroup = cardStyles;
}
