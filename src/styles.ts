import { css } from "lit";

// Card-side styles. Live in the card's shadow root via
// `static styles = cardStyles` — fully isolated from page CSS.
//
// Port of the vanilla card's <style> block. Uses HA theme variables so the
// user's light/dark theme flows through.
export const cardStyles = css`
  :host {
    display: block;
  }
  ha-card {
    padding: 0;
    overflow: hidden;
  }
  .empty {
    padding: 24px 16px;
    text-align: center;
    color: var(--secondary-text-color);
  }

  /* Version-mismatch banner */
  .version-notice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 16px;
    background: var(--warning-color, #ff9800);
    color: #fff;
    font-size: 13px;
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
    padding: 4px 12px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
  }
  .tab {
    flex: 1;
    padding: 12px 8px;
    background: none;
    border: none;
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    border-bottom: 2px solid transparent;
    font-family: inherit;
  }
  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }
  .tab:hover {
    color: var(--primary-text-color);
  }

  /* Card header */
  .card-header {
    padding: 16px 16px 8px;
  }
  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .fuel-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .fuel-icon {
    color: var(--primary-color);
    --mdc-icon-size: 18px;
  }
  .refresh-icon {
    --mdc-icon-size: 16px;
    vertical-align: middle;
  }
  .map-icon {
    --mdc-icon-size: 20px;
  }
  .pm-icon {
    --mdc-icon-size: 13px;
    vertical-align: middle;
  }
  .header-prices {
    display: flex;
    gap: 16px;
    text-align: right;
  }
  .header-price-item {
    display: flex;
    flex-direction: column;
  }
  .header-price-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 400;
  }
  .header-price-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-text-color);
  }
  .header-price-value.avg {
    font-size: 15px;
    font-weight: 500;
    color: var(--secondary-text-color);
  }

  /* Cars fill-up block */
  .cars-fillup {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .car-fillup-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .car-fillup-name {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .car-icon {
    --mdc-icon-size: 14px;
    color: var(--secondary-text-color);
  }
  .car-fillup-liters {
    font-size: 11px;
    opacity: 0.65;
  }
  .car-fillup-cost {
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-text-color);
  }
  .car-per100-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 19px;
    margin-top: -2px;
  }
  .car-per100-label {
    font-size: 11px;
    color: var(--secondary-text-color);
    opacity: 0.75;
  }
  .car-per100-cost {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  /* Sparkline */
  .sparkline-container {
    margin-top: 8px;
    cursor: pointer;
    position: relative;
  }
  .sparkline {
    width: 100%;
    height: 48px;
    display: block;
  }
  .sparkline-tooltip {
    position: absolute;
    top: -28px;
    display: flex;
    gap: 6px;
    padding: 3px 7px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    font-size: 11px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 2;
  }
  .sparkline-tooltip[hidden] {
    display: none;
  }
  .sparkline-tooltip-time {
    color: var(--secondary-text-color);
  }
  .sparkline-tooltip-price {
    color: var(--primary-text-color);
    font-weight: 600;
  }
  .sparkline-labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--secondary-text-color);
    padding: 2px 0 0;
  }
  .sparkline-period {
    font-size: 10px;
    opacity: 0.6;
  }
  .sparkline-minmax-label {
    opacity: 0.6;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .median-delta {
    font-weight: 500;
    opacity: 0.9;
  }
  .median-delta-good {
    color: var(--success-color, #4caf50);
  }
  .median-delta-bad {
    color: var(--warning-color, #ff9800);
  }
  .median-delta-neutral {
    color: var(--secondary-text-color);
  }

  /* Best-refuel recommendation */
  .refuel-recommendation {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    color: var(--success-color, #4caf50);
    margin-top: 5px;
    line-height: 1.3;
  }
  .refuel-hint {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-top: 5px;
  }
  .refuel-icon {
    --mdc-icon-size: 13px;
    flex-shrink: 0;
  }
  .refuel-text {
    flex: 1;
    min-width: 0;
  }
  .refuel-confidence {
    flex-shrink: 0;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 1px 5px;
    border-radius: 3px;
    cursor: help;
    white-space: nowrap;
  }
  .refuel-confidence-high {
    background: color-mix(in srgb, var(--success-color, #4caf50) 18%, transparent);
    color: var(--success-color, #4caf50);
  }
  .refuel-confidence-medium {
    background: color-mix(in srgb, var(--warning-color, #ffa726) 18%, transparent);
    color: var(--warning-color, #ffa726);
  }
  .refuel-confidence-low {
    background: color-mix(in srgb, var(--secondary-text-color, #888) 15%, transparent);
    color: var(--secondary-text-color, #888);
  }

  /* Station list */
  .stations {
    padding: 0;
  }
  .station {
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
  }
  .station:last-child {
    border-bottom: none;
  }
  .station.pm-highlight {
    border-left: 3px solid var(--success-color, #4caf50);
    background: rgba(76, 175, 80, 0.06);
  }
  .station.pm-highlight .station-main:hover {
    background: rgba(76, 175, 80, 0.12);
  }
  .station-main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .station-main:hover {
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
  }
  .rank {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-weight: 500;
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .address {
    font-size: 12px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    font-weight: 700;
    font-size: 16px;
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .map-link {
    color: var(--secondary-text-color);
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .map-link:hover {
    color: var(--primary-color);
  }
  .badge {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 600;
  }
  .badge.closed {
    background: var(--error-color, #db4437);
    color: #fff;
  }
  .badge.closing-soon {
    background: var(--warning-color, #ff9800);
    color: #fff;
  }
  .pm-match-chip {
    font-size: 10px;
    padding: 1px 6px;
    border: 1px solid var(--success-color, #4caf50);
    border-radius: 8px;
    color: var(--success-color, #4caf50);
    font-weight: 500;
    line-height: 14px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Dynamic mode meta + refresh */
  .dynamic-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    flex: 1;
  }
  .last-updated {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .dynamic-meta-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.2;
  }
  .no-new-data {
    font-size: 11px;
    color: var(--warning-color, #ff9800);
  }
  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    padding: 4px 8px;
    background: none;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    color: var(--primary-color);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: opacity 0.2s;
    flex-shrink: 0;
    font-family: inherit;
  }
  .refresh-btn.cooling {
    opacity: 0.4;
    cursor: default;
    pointer-events: none;
  }
  .refresh-btn:hover:not(.cooling) {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }

  /* Station-detail drawer */
  .station-detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 16px 0 52px;
  }
  .station-detail.expanded {
    max-height: 200px;
    padding: 0 16px 12px 52px;
  }
  .detail-cols {
    display: flex;
    gap: 16px;
  }
  .detail-col {
    flex: 1;
    min-width: 0;
  }
  .hours-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .hours-grid .day {
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .pm-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pm-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
  }
  .pm-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .pm-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px;
    border-radius: 10px;
    font-size: 11px;
    background: var(--secondary-background-color, #f5f5f5);
    color: var(--secondary-text-color);
    border: 1px solid var(--divider-color, #e0e0e0);
  }
  .pm-badge.pm-other {
    font-style: italic;
  }
`;

// Editor-side styles. Port of the vanilla editor's <style> block.
export const editorStyles = css`
  :host {
    display: block;
  }
  .editor {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .editor-section {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .section-header {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }
  .editor-hint {
    font-size: 12px;
    color: var(--secondary-text-color);
    line-height: 1.4;
  }

  /* Entity chips */
  .entity-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .entity-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border-radius: 16px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-family: inherit;
  }
  .entity-chip.selected {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }
  .entity-chip:hover {
    opacity: 0.85;
  }
  .entity-chip .fuel-name {
    font-weight: 500;
  }
  .entity-chip-suffix {
    font-size: 11px;
    opacity: 0.7;
  }

  /* Toggle rows */
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0;
  }
  .toggle-row label {
    font-size: 13px;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .toggle-row-sub {
    padding-left: 16px;
  }
  .toggle-row-sub label {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  /* Recorder hint + copy button */
  .recorder-hint {
    margin: 4px 0 2px 16px;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    border: 1px solid var(--divider-color);
  }
  .recorder-hint-text {
    font-size: 11px;
    line-height: 1.4;
    color: var(--secondary-text-color);
    margin-bottom: 6px;
  }
  .recorder-snippet {
    margin: 0;
    padding: 8px;
    border-radius: 4px;
    background: var(--code-editor-background-color, var(--primary-background-color, #0e0e0e));
    font-family: var(--code-font-family, monospace);
    font-size: 11px;
    line-height: 1.35;
    color: var(--primary-text-color);
    overflow-x: auto;
    white-space: pre;
  }
  .recorder-copy-btn {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 4px;
    background: transparent;
    border: 1px solid var(--divider-color);
    color: var(--primary-text-color);
    font-size: 11px;
    cursor: pointer;
    font-family: inherit;
  }
  .recorder-copy-btn:hover {
    background: var(--primary-background-color);
  }
  .recorder-copy-btn ha-icon {
    --mdc-icon-size: 14px;
  }

  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 2px 0;
  }

  /* Max-stations slider */
  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .slider-row input[type="range"] {
    flex: 1;
    accent-color: var(--primary-color);
  }
  .slider-value {
    min-width: 20px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: var(--primary-color);
  }

  /* Tab labels */
  .tab-label-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tab-label-default {
    flex: 0 0 40%;
    font-size: 13px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tab-label-input {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 13px;
    font-family: inherit;
  }
  .tab-label-input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  /* Payment filter chips */
  .pm-filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .pm-filter-chip {
    padding: 4px 12px;
    border-radius: 14px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    transition: all 0.15s;
    font-family: inherit;
  }
  .pm-filter-chip.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }
  .pm-filter-chip:hover {
    opacity: 0.85;
  }
  .pm-filter-chip.confirm {
    background: var(--error-color, #db4437);
    color: #fff;
    border-color: var(--error-color, #db4437);
  }
  .pm-custom-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .pm-custom-row ha-textfield {
    flex: 1;
  }
  .pm-custom-row ha-icon-button {
    color: var(--primary-color);
    flex-shrink: 0;
  }

  /* Cars editor */
  .car-editor-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .car-editor-row {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }
  .car-input {
    background: var(--input-fill-color, rgba(0, 0, 0, 0.06));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 6px 8px;
    font-size: 13px;
    color: var(--primary-text-color);
    outline: none;
    font-family: inherit;
    min-width: 0;
  }
  .car-input:focus {
    border-color: var(--primary-color);
  }
  .car-name-input {
    flex: 1 1 50px;
    min-width: 50px;
  }
  .car-tank-input {
    width: 54px;
    flex-shrink: 0;
  }
  .car-consumption-input {
    width: 60px;
    flex-shrink: 0;
  }
  .car-select {
    background: var(--input-fill-color, rgba(0, 0, 0, 0.06));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    padding: 6px 2px;
    font-size: 13px;
    color: var(--primary-text-color);
    cursor: pointer;
    font-family: inherit;
    flex-shrink: 0;
    max-width: 90px;
  }
  .car-delete-btn {
    background: none;
    border: none;
    color: var(--error-color, #db4437);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: auto;
  }
  .car-delete-btn:hover {
    background: rgba(219, 68, 55, 0.1);
  }
  .car-add-btn {
    align-self: flex-start;
    background: none;
    border: 1px dashed var(--divider-color);
    border-radius: 8px;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 13px;
    padding: 8px 14px;
    width: 100%;
    font-family: inherit;
    transition: background 0.15s;
  }
  .car-add-btn:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  .car-icon-btn {
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    color: var(--primary-color);
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s;
    --mdc-icon-size: 20px;
  }
  .car-icon-btn.active {
    border-color: var(--primary-color);
    background: rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
  }
  .car-icon-btn:hover {
    border-color: var(--primary-color);
  }
  .car-icon-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 6px 8px;
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }
  .car-icon-option {
    background: none;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    --mdc-icon-size: 20px;
  }
  .car-icon-option:hover {
    background: var(--card-background-color, #fff);
    color: var(--primary-color);
    border-color: var(--divider-color);
  }
  .car-icon-option.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }
`;
