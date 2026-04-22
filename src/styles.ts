import { css } from "lit";

// Card-side styles. Live in the card's shadow root via
// `static styles = cardStyles` — fully isolated from page CSS.
//
// Theme variables (CSS custom properties) pierce shadow boundaries, so
// `var(--primary-color)` etc. resolve to the user's active HA theme.
//
// Prefer the 2025+ token set where it exists, with fallbacks for older
// themes: --ha-card-*, --ha-space-1..6, --ha-border-radius-sm/md/lg,
// --ha-font-size-*, --ha-font-weight-*, --ha-line-height-*.
export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    overflow: hidden;
  }
  .card-content {
    padding: var(--ha-space-4, 16px);
  }
  .header {
    font-size: var(--ha-font-size-l, 1rem);
    font-weight: var(--ha-font-weight-medium, 500);
    margin-bottom: var(--ha-space-2, 8px);
  }
  .empty-state {
    padding: var(--ha-space-5, 20px) 0;
    text-align: center;
    color: var(--secondary-text-color);
  }
  /* Add your own styles below. */
`;

// Editor-side styles. Live in the editor's shadow root.
// HA form components (ha-textfield, ha-switch, etc.) bring their own
// theming — keep editor CSS to layout + spacing.
export const editorStyles = css`
  :host {
    display: block;
  }
  .editor {
    padding: var(--ha-space-4, 16px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
  }
  .editor-section {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border-radius: var(--ha-border-radius-lg, 12px);
    padding: var(--ha-space-3, 14px) var(--ha-space-4, 16px);
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-2, 10px);
  }
  .section-header {
    font-size: var(--ha-font-size-xs, 11px);
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .editor-hint {
    font-size: var(--ha-font-size-s, 12px);
    color: var(--secondary-text-color);
    line-height: 1.4;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
