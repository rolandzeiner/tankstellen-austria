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

// Editor-side styles — kept minimal; B6 rewrite will fill in proper sections.
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
