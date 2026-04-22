import type {
  ActionConfig,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "custom-card-helpers";

// Register your editor element + the built-in error card with the global
// HTMLElementTagNameMap so TypeScript autocompletes them in templates.
declare global {
  interface HTMLElementTagNameMap {
    "tankstellen-austria-card-editor": LovelaceCardEditor;
    "hui-error-card": LovelaceCard;
  }
}

// TODO: Replace these fields with your own.
// `type` is required by HA — leave it. The rest is yours.
export interface TankstellenAustriaCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  entity?: string;
  show_warning?: boolean;
  show_error?: boolean;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
