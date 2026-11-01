import { css } from "lit";

// Card-side styles. Live in the card's shadow root via
// `static styles = cardStyles` — fully isolated from page CSS.
//
// Modern HA "tile-card" visual language: rounded square `.icon-tile`
// header, stacked hero metric, chip-row vocabulary, container-query
// density ladder. Tokens live on `:host` so a single override flips the
// whole card.
export const cardStyles = css`
  :host {
    /* color-scheme enables light-dark() and steers forced-colors palette
       selection (WCAG 1.4.11). HA's active theme drives the resolution. */
    color-scheme: light dark;
    display: block;

    /* Brand accent — domain-specific, no HA equivalent. */
    --tankst-accent: var(--primary-color);

    /* Semantic state tokens layered over HA's official semantic palette
       so theme authors can recolour the whole portfolio in one place;
       hard-coded fallbacks for older HA versions. NOTE: editorStyles
       :host also needs these — duplicated there. See ha-portfolio-design
       § 4 "Multi-card integrations — every shadow scope needs the
       tokens" for why. */
    --tankst-rt:      var(--success-color, #4caf50);
    --tankst-warning: var(--warning-color, #ffa000);
    --tankst-error:   var(--error-color,   #db4437);
    --tankst-info:    var(--info-color,    #1565c0);

    /* Spacing / radius / sizing — layered over the HA Design System
       so the card moves with HA when tokens evolve. Hard-coded values
       are the fallback for older HA versions. */
    /* These names were wrong until v1.9.4 and nothing complained: var()
       on a token HA does not define is not an error, it just resolves to
       the fallback. So the card ran entirely on its own literals while
       looking theme-aware — which is how --ha-spacing-3 came to mean
       14px on one line and 12px on the next.

       Verified against the frontend's src/resources/theme/core.globals.ts:
         --ha-space-N          4px grid, 1…20   (was --ha-spacing-N)
         --ha-font-size-*      xs 10 / s 12 / m 14 / l 16 / xl 20px.
                               typography.globals.ts sets the root to
                               font-size:14px, so -m is 1rem, NOT 0.875 —
                               do the rem maths at 14px or just write px.
         --ha-border-radius-*  sm 4 / md 8 / lg 12 / xl 16 / pill / circle
                                                (was --ha-radius-*)
         --ha-animation-duration-*  none 1 / instant 75 / fast 150 /
                                    normal 250 / slow 350ms
                                                (was --ha-transition-duration-*)
       There is no easing token — --ha-transition-easing-standard never
       existed either, so easings are now named directly.

       Fallbacks are kept and now match the token they stand in for.
       Adopting a new --ha-* token means checking core.globals.ts first;
       a typo here is invisible. */
    --tankst-radius-sm: var(--ha-border-radius-sm, 4px);
    --tankst-radius-md: var(--ha-border-radius-md, 8px);
    --tankst-radius-lg: var(--ha-card-border-radius, var(--ha-border-radius-lg, 12px));
    --tankst-pad-x:     var(--ha-space-4, 16px);
    --tankst-pad-y:     var(--ha-space-3, 12px);
    --tankst-row-gap:   var(--ha-space-3, 12px);
    --tankst-tile-size: 40px;
  }
  ha-card {
    /* Clips content to the card; in a grid cell the gated rule below puts
       that edge at the cell's height. */
    overflow: hidden;
    /* Card responds to its own width, not the viewport — narrow
       dashboard columns trigger the compact density tier even on wide
       screens. */
    container-type: inline-size;
    container-name: tscard;
    /* A column, so that in a fixed-height cell the tabs and footer keep
       their size and the content between them scrolls (.wrap). In an
       auto-height cell nothing is short of room and nothing changes. */
    display: flex;
    flex-direction: column;
  }
  /* Fill the grid cell the dashboard hands us. A sections view puts a fixed
     pixel height on the cell WRAPPER when rows is numeric -- which dragging
     a resize handle causes even here, since the stored grid_options
     overrides getGridOptions()'s rows: "auto" -- and styles nothing inside
     it.
     Because :host is display: block, it is ha-card's containing block, so
     the two declarations only work as a pair: without the host's, ha-card's
     100% computes to auto and the card renders at content height on top of
     the card beneath it.
     Gated on the layout HA sets on the card ("grid" in a sections view and
     its edit dialog, "panel" in a panel view), the way Mushroom and HA's tile
     card gate it. The add-card picker sets none and centres each preview in
     a tile as tall as the tallest preview in its row; an ungated 100%
     resolves against that tile and stretches the card down to it. */
  :host([layout="grid"]),
  :host([layout="panel"]) {
    block-size: 100%;
  }
  :host([layout="grid"]) ha-card,
  :host([layout="panel"]) ha-card {
    block-size: 100%;
  }
  .wrap {
    padding: var(--tankst-pad-y) var(--tankst-pad-x);
    display: flex;
    flex-direction: column;
    gap: var(--tankst-row-gap);
    /* The one scroller: takes whatever height the tabs and footer leave,
       and when the user dragged the cell shorter than the card, header and
       stations scroll together. Pinning the header instead leaves no room:
       with the sparkline and tip it is about 300 px on its own.
       min-block-size: 0 is what lets this flex child shrink at all. */
    flex: 1 1 auto;
    min-block-size: 0;
    overflow-y: auto;
  }
  .empty {
    padding: 24px 0;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 0.875rem;
  }
  /* "Can't reach E-Control": a headline the eye can find, so it doesn't
     read as one more quiet empty-list remark. */
  .empty-title {
    color: var(--primary-text-color);
    font-weight: 500;
  }
  .empty-detail {
    margin-block-start: var(--ha-space-1, 4px);
    font-size: 0.875em;
  }

  /* ── Version-mismatch banner ────────────────────────────────────── */
  .version-notice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: var(--tankst-warning);
    color: #fff;
    padding: 10px 14px;
    margin: calc(var(--tankst-pad-y) * -1) calc(var(--tankst-pad-x) * -1) 0;
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: #fff;
    color: var(--tankst-warning);
    border: none;
    border-radius: 999px;
    padding: 6px 14px;
    font-weight: 600;
    font-size: 0.75rem;
    cursor: pointer;
    min-height: 32px;
    font-family: inherit;
  }

  /* ── Tabs ───────────────────────────────────────────────────────── */
  /* Direct child of <ha-card>, flush with the card edges. The .wrap
     padding handles the breathing room to the first content row. */
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    overflow-x: auto;
    scrollbar-width: none;
    /* overflow-x makes its automatic minimum height 0, so in ha-card's
       flex column a short cell would squash the tabs first. */
    flex-shrink: 0;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  .tab {
    /* 44px tall tap target, three independent active cues (colour,
       weight, underline) so the active state survives any single-channel
       deficit (low vision, protanopia, grayscale). */
    flex: 1;
    min-width: 0;
    height: 44px;
    padding: 0 14px;
    background: none;
    border: none;
    box-shadow: inset 0 -2px 0 transparent;
    color: var(--secondary-text-color);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition:
      color var(--ha-animation-duration-fast, 150ms) ease,
      box-shadow var(--ha-animation-duration-fast, 150ms) ease,
      background-color var(--ha-animation-duration-fast, 150ms) ease;
    font-family: inherit;
  }
  .tab:hover {
    color: var(--primary-text-color);
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }
  .tab.active {
    color: var(--primary-color);
    font-weight: var(--ha-font-weight-bold, 700);
    box-shadow: inset 0 -2px 0 var(--primary-color);
  }

  /* ── Section + Header ───────────────────────────────────────────── */
  .station-section {
    display: flex;
    flex-direction: column;
    gap: var(--tankst-row-gap);
  }
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .icon-tile {
    /* Modern HA tile-card vocabulary: rounded square, accent-tinted
       background, accent-coloured icon. Gives the card immediate visual
       identity in dashboards. */
    width: var(--tankst-tile-size);
    height: var(--tankst-tile-size);
    border-radius: var(--tankst-radius-md);
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
    --mdc-icon-size: 22px;
  }
  .header-text {
    min-width: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .title {
    /* <h2> override: nuke UA heading margins. */
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .subtitle {
    /* <p> override. */
    margin: 0;
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    font-weight: 400;
    letter-spacing: 0.1px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .header-actions {
    /* Right-side cluster in dynamic mode: refresh button on top, the
       last-updated + no_new_data chips below — visually grouped with
       the action they relate to. */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }
  .header-actions .chip-row {
    /* Right-align the wrapped chip overflow under the button. */
    justify-content: flex-end;
  }
  .icon-action {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--secondary-text-color);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition:
      background-color var(--ha-animation-duration-fast, 150ms) ease,
      color var(--ha-animation-duration-fast, 150ms) ease;
    --mdc-icon-size: 20px;
    font-family: inherit;
  }
  .icon-action:hover {
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    color: var(--primary-color);
  }

  /* Map-pin action and its distance caption stacked as one column, so the
     Luftlinie value reads as an annotation to the pin rather than a
     free-floating number. The pin keeps the only interactive affordance;
     the caption stays quiet (muted, tabular so values align down the list,
     tight line-height so it tucks under the pin circle — which shrinks via
     .has-distance below so the column never exceeds the 40px standalone
     pin and the row height stays put). */
  .map-action {
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .distance {
    font-size: 0.68rem;
    line-height: 1;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }
  /* With the caption present, shrink the pin circle so the stacked column
     (28px pin + 1px gap + ~11px caption) matches the 40px standalone pin —
     toggling show_distance must not change the row height. 28px keeps the
     tap target above the WCAG 2.2 24px minimum. */
  .map-action.has-distance .icon-action {
    width: 28px;
    height: 28px;
    --mdc-icon-size: 16px;
  }

  /* ── Hero metric ────────────────────────────────────────────────── */
  .hero {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .metric {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .metric-value {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    line-height: 1;
  }
  .metric-num {
    font-size: 2.25rem;
    font-weight: var(--ha-font-weight-bold, 700);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.5px;
  }
  .metric-of {
    font-size: 1rem;
    color: var(--secondary-text-color);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .metric-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    font-weight: 500;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }

  /* ── Chips ──────────────────────────────────────────────────────── */
  .chip-row {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
    color: var(--primary-color);
    font-variant-numeric: tabular-nums;
  }
  .chip ha-icon {
    --mdc-icon-size: 14px;
  }
  .chip.muted {
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    color: var(--secondary-text-color);
  }
  .chip.warn {
    background: color-mix(in srgb, var(--tankst-warning) 16%, transparent);
    color: var(--tankst-warning);
  }
  .chip.match {
    /* Payment-method match highlight chip (filter mode + highlight
       toggle). Same accent vocabulary as the hero metric. */
    background: color-mix(in srgb, var(--tankst-rt) 16%, transparent);
    color: var(--tankst-rt);
  }

  /* ── Status flags (closed / closing-soon) ───────────────────────── */
  .flag {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    color: var(--secondary-text-color);
    white-space: nowrap;
    flex-shrink: 0;
  }
  .flag.closed {
    background: color-mix(in srgb, var(--tankst-error) 16%, transparent);
    color: var(--tankst-error);
  }
  .flag.closing-soon {
    background: color-mix(in srgb, var(--tankst-warning) 16%, transparent);
    color: var(--tankst-warning);
  }

  /* ── Filled CTA (dynamic-mode refresh) ──────────────────────────── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 14px;
    height: 32px;
    border: none;
    border-radius: 999px;
    background: var(--tankst-accent);
    color: var(--text-primary-color, #fff);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 1px 2px color-mix(in srgb, #000 12%, transparent);
    transition:
      filter var(--ha-animation-duration-fast, 150ms) ease,
      transform var(--ha-animation-duration-fast, 150ms) ease,
      opacity var(--ha-animation-duration-fast, 150ms) ease;
    flex-shrink: 0;
    font-family: inherit;
    font-variant-numeric: tabular-nums;
  }
  .btn-primary:hover:not(.cooling) {
    filter: brightness(1.08);
  }
  .btn-primary:active:not(.cooling) {
    transform: translateY(1px);
  }
  .btn-primary.cooling {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }
  .btn-primary ha-icon {
    --mdc-icon-size: 16px;
  }

  /* ── Sparkline ──────────────────────────────────────────────────── */
  .sparkline-container {
    cursor: pointer;
    position: relative;
  }
  /* Tight wrap around the SVG that gives marker + hover-dot HTML
     overlays a positioning context EQUAL to the SVG's rendered box.
     If the markers were positioned against .sparkline-container
     directly, their percentage top/left would resolve against a
     taller container that also includes tooltip + labels — dot
     would land below the line. */
  .sparkline-svg-wrap {
    position: relative;
    width: 100%;
  }
  .sparkline {
    width: 100%;
    height: var(--ts-sparkline-height, clamp(40px, 8vw + 24px, 72px));
    display: block;
  }
  /* Cheapest-refill marker + hover dot. Both live OUTSIDE the SVG
     (HTML overlays positioned via percentage left/top inside
     .sparkline-svg-wrap) because the SVG uses preserveAspectRatio
     "none" to stretch the line across the card width — circles
     inside that SVG get squashed into ovals on wide cards. As regular
     HTML elements with border-radius: 50%, these stay true circles
     regardless of card width. */
  .sparkline-marker,
  .sparkline-hover-dot {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    border: 1.5px solid var(--card-background-color, #fff);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
  }
  .sparkline-marker {
    background: var(--tankst-rt);
  }
  .sparkline-hover-dot {
    background: var(--primary-color);
    /* The dot follows the pointer, so it wants the shortest real
       duration HA ships — instant, not fast. The old 60ms literal
       was aiming at the same thing. */
    transition:
      left var(--ha-animation-duration-instant, 75ms) linear,
      top var(--ha-animation-duration-instant, 75ms) linear,
      opacity var(--ha-animation-duration-fast, 150ms) ease;
  }
  .sparkline-tooltip {
    position: absolute;
    top: -28px;
    display: flex;
    gap: 6px;
    padding: 3px 7px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--divider-color);
    border-radius: var(--tankst-radius-sm);
    box-shadow: 0 2px 6px color-mix(in srgb, #000 12%, transparent);
    font-size: 0.75rem;
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
    font-size: 0.6875rem;
    color: var(--secondary-text-color);
    padding: 2px 0 0;
  }
  .sparkline-period {
    font-size: 0.6875rem;
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
    color: var(--tankst-rt);
  }
  .median-delta-bad {
    color: var(--tankst-warning);
  }
  .median-delta-neutral {
    color: var(--secondary-text-color);
  }

  /* ── Best-refuel recommendation ─────────────────────────────────── */
  .refuel-recommendation {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--tankst-rt);
    line-height: 1.3;
  }
  .refuel-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.85;
  }
  .refuel-icon {
    --mdc-icon-size: 14px;
    flex-shrink: 0;
  }
  .refuel-text {
    flex: 1;
    min-width: 0;
  }
  .refuel-confidence {
    flex-shrink: 0;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 3px 8px;
    border-radius: 999px;
    cursor: help;
    white-space: nowrap;
  }
  .refuel-confidence-high {
    background: color-mix(in srgb, var(--tankst-rt) 18%, transparent);
    color: var(--tankst-rt);
  }
  .refuel-confidence-medium {
    background: color-mix(in srgb, var(--tankst-warning) 18%, transparent);
    color: var(--tankst-warning);
  }
  .refuel-confidence-low {
    background: color-mix(in srgb, var(--secondary-text-color, #888) 15%, transparent);
    color: var(--secondary-text-color, #888);
  }

  /* ── Cars fill-up block ─────────────────────────────────────────── */
  .cars-fillup {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-top: var(--tankst-row-gap);
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
  }
  .car-fillup-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .car-fillup-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.875rem;
    color: var(--primary-text-color);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .car-icon {
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .car-fillup-liters {
    font-size: 0.75rem;
    opacity: 0.7;
    color: var(--secondary-text-color);
  }
  .car-fillup-cost {
    font-size: 0.9375rem;
    font-weight: var(--ha-font-weight-bold, 700);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  .car-per100-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 22px;
    margin-top: -4px;
  }
  .car-per100-label {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    opacity: 0.85;
  }
  .car-per100-cost {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }

  /* ── Stations list ──────────────────────────────────────────────── */
  .stations {
    display: flex;
    flex-direction: column;
    /* Negative side + bottom margins so the list bleeds to the card's
       edges (full-bleed list look) while the rest of the section
       content stays inside .wrap's padding. Keeps the gap-rhythm above
       intact. */
    margin: 0 calc(var(--tankst-pad-x) * -1) calc(var(--tankst-pad-y) * -1);
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
  }
  /* The list runs edge to edge of the scrolling .wrap, so a ring drawn
     outside the row would be cut at both sides. Draw it inside. */
  .stations .station-main:focus-visible {
    outline-offset: -2px;
  }
  .station {
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.1));
  }
  .station:last-child {
    border-bottom: none;
  }
  .station.pm-highlight {
    box-shadow: inset 3px 0 0 var(--tankst-rt);
    background: color-mix(in srgb, var(--tankst-rt) 6%, transparent);
  }
  .station.pm-highlight .station-main:hover {
    background: color-mix(in srgb, var(--tankst-rt) 12%, transparent);
  }
  .station-main {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px var(--tankst-pad-x);
    cursor: pointer;
    transition: background-color var(--ha-animation-duration-fast, 150ms) ease;
  }
  .station-main:hover {
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }
  .index-tile {
    /* Rounded-square index badge. Same vocabulary as the header
       .icon-tile but smaller and label-bearing. */
    width: 28px;
    height: 28px;
    border-radius: var(--tankst-radius-sm);
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
    font-size: 0.8125rem;
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
  }
  /* stations.tile_shape: circle. Three 10 px letters still fit inside
     a 28 px circle. */
  .index-tile.circle {
    border-radius: 50%;
  }
  /* Brand initials run to three letters ("OMV", "JET"). */
  .index-tile.brand {
    font-size: 0.625rem;
    letter-spacing: -0.02em;
  }
  /* A station without a known brand: neutral, so it never passes for one
     (the accent blue would read as SOCAR or OMV). */
  .index-tile.brand:not(.brand-known) {
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--primary-text-color);
  }
  .index-tile.brand-known {
    background: var(--tankst-tile-bg);
    color: var(--tankst-tile-fg);
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  /* The name gives way, not the Closed / Closing-soon flag after it: as a
     flex item the span would otherwise keep its full width and push the
     flag out past .name's overflow, unseen. */
  .name > span[lang] {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .address {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .price {
    font-weight: var(--ha-font-weight-bold, 700);
    font-size: 1.125rem;
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    flex-shrink: 0;
  }
  /* Chevron arrow indicating collapsibility. Rotates 180° on
     aria-expanded="true" so the cue follows the WAI-ARIA state without
     a bespoke CSS class — same pattern as wiener-linien-austria. */
  .expander-chevron {
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    transition: transform var(--ha-animation-duration-fast, 150ms) ease;
    flex-shrink: 0;
  }
  .station-main[aria-expanded="true"] .expander-chevron {
    transform: rotate(180deg);
  }

  /* Station-detail drawer.
     grid-template-rows 0fr ↔ 1fr animates to intrinsic height — long
     content (many opening-hour lines + payment methods) is not clipped.
     The single direct child gets overflow:hidden + min-height:0 so the
     row collapse actually hides it. */
  .station-detail {
    display: grid;
    grid-template-rows: 0fr;
    transition:
      grid-template-rows 0.3s ease,
      padding 0.3s ease;
    padding: 0 var(--tankst-pad-x) 0 calc(var(--tankst-pad-x) + 28px + 12px);
  }
  .station-detail > * {
    overflow: hidden;
    min-height: 0;
  }
  .station-detail.expanded {
    grid-template-rows: 1fr;
    padding: 0 var(--tankst-pad-x) 12px calc(var(--tankst-pad-x) + 28px + 12px);
  }
  .detail-cols {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .detail-col {
    flex: 1 1 140px;
    min-width: 0;
  }
  .hours-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
  }
  .hours-grid .day {
    font-weight: 600;
    color: var(--primary-text-color);
  }

  /* Payment methods — chip vocabulary. */
  .pm-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pm-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .pm-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .pm-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.2;
    background: color-mix(in srgb, var(--secondary-text-color) 10%, transparent);
    color: var(--primary-text-color);
  }
  .pm-badge ha-icon {
    --mdc-icon-size: 13px;
    color: var(--secondary-text-color);
  }
  .pm-badge.pm-other {
    font-style: italic;
  }

  /* ── Brand footer (E-Control logo-link + attribution) ──────────── */
  /* Mirrors the Ladestellen Austria card's footer vocabulary —
     adaptive logo silhouette (filter brightness(0) [invert(1)]) so
     a brand-coloured PNG/SVG follows hass.themes.darkMode when the
     user enables logo_adapt_to_theme. */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px var(--tankst-pad-x);
    border-top: 1px solid var(--divider-color);
  }
  .brand-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.16s ease;
  }
  .brand-link:hover {
    opacity: 0.7;
  }
  .brand-logo {
    display: block;
    height: 20px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
    transition: filter 0.16s ease;
  }
  .brand-logo.adaptive.adaptive-light {
    filter: brightness(0);
  }
  .brand-logo.adaptive.adaptive-dark {
    filter: brightness(0) invert(1);
  }
  .attribution-text {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    letter-spacing: 0.03em;
    opacity: 0.85;
  }

  /* ── Density ladder (container queries, not viewport) ───────────── */
  /* Compact: narrow phone columns, side-by-side panels. */
  @container tscard (inline-size < 360px) {
    :host {
      --tankst-pad-x: 14px;
      --tankst-pad-y: 12px;
      --tankst-tile-size: 36px;
    }
    .metric-num {
      font-size: 2rem;
    }
    .icon-tile {
      --mdc-icon-size: 20px;
    }
    .address {
      white-space: normal;
    }
    .price {
      font-size: 1rem;
    }
    .station-main {
      gap: 8px;
    }
    .footer {
      padding: 8px 14px;
    }
    .brand-logo {
      height: 18px;
    }
  }
  /* Two lines per station, only at half a section (~240 px): index, name
     and address on top, price and actions underneath. There one row left
     the name a few characters next to the price, map pin and chevron.
     Wider than this one row reads better: the price stays beside its
     station and the card stays a third shorter. Areas with no element (no
     index, no map link) stay empty. */
  @container tscard (inline-size < 280px) {
    .station-main {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      grid-template-areas:
        "idx info info info"
        ".   price map  chev";
      align-items: center;
      gap: 2px 8px;
    }
    .index-tile {
      grid-area: idx;
    }
    .info {
      grid-area: info;
    }
    .station-main .price {
      grid-area: price;
    }
    .map-action {
      grid-area: map;
    }
    .expander-chevron {
      grid-area: chev;
    }
    /* 32 px keeps the second line short; still above the 24 px target
       minimum (WCAG 2.5.8). */
    .station-main .icon-action {
      width: 32px;
      height: 32px;
    }
    .name {
      white-space: normal;
      flex-wrap: wrap;
    }
  }
  /* Wide: sidebar / panel mode / 2-column section view. */
  @container tscard (inline-size > 480px) {
    :host {
      --tankst-pad-x: 20px;
      --tankst-pad-y: 16px;
      --tankst-tile-size: 44px;
    }
    .metric-num {
      font-size: 2.5rem;
    }
    .icon-tile {
      --mdc-icon-size: 24px;
    }
  }

  /* ── Accessibility primitives ───────────────────────────────────── */
  .tab:focus-visible,
  .station-main:focus-visible,
  .sparkline-container:focus-visible,
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 6px;
  }
  .btn-primary:focus-visible {
    outline-offset: 3px;
  }
  /* .tabs scrolls sideways, which clips a ring drawn outside the tab. */
  .tab:focus-visible {
    outline-offset: -2px;
  }

  /* Forced-colors fallback (Windows High Contrast). */
  @media (forced-colors: active) {
    .tab:focus-visible,
    .station-main:focus-visible,
    .sparkline-container:focus-visible,
    a:focus-visible,
    button:focus-visible {
      outline-color: CanvasText;
    }
    .icon-tile,
    .index-tile,
    .chip,
    .flag,
    .btn-primary,
    .pm-badge,
    .refuel-confidence {
      forced-color-adjust: none;
    }
  }

  /* Honour user motion preference (catch-all). */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// Editor-side styles — separate shadow root from the card so tokens are
// duplicated on `:host` rather than inherited (see :host comment below).
export const editorStyles = css`
  :host {
    /* color-scheme enables light-dark() and steers forced-colors palette
       selection. The editor is its own Lit element with its own shadow
       root — CSS custom properties don't bleed across shadow boundaries,
       so the semantic tokens below are duplicated from the cardStyles
       :host. Keep both blocks in sync. See ha-portfolio-design § 4
       "Multi-card integrations — every shadow scope needs the tokens". */
    color-scheme: light dark;
    display: block;

    --tankst-rt:      var(--success-color, #4caf50);
    --tankst-warning: var(--warning-color, #ffa000);
    --tankst-error:   var(--error-color,   #db4437);
    --tankst-info:    var(--info-color,    #1565c0);
  }
  .editor {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .section-header {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin-bottom: 2px;
  }
  .editor-hint {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
    line-height: 1.4;
  }

  /* Recorder hint + copy button */
  .recorder-hint {
    margin: 0;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--secondary-background-color, rgba(255, 255, 255, 0.04));
    border: 1px solid var(--divider-color);
  }
  .recorder-hint-text {
    font-size: 0.75rem;
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
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--primary-text-color);
    overflow-x: auto;
    white-space: pre;
  }
  .recorder-hint-actions {
    margin-top: 6px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .recorder-docs-link ha-icon {
    --mdc-icon-size: 14px;
  }
  .recorder-docs-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--primary-color);
    text-decoration: none;
  }
  .recorder-docs-link:hover {
    text-decoration: underline;
  }

  /* Tab labels, under the sensor picker */
  .tab-labels {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* Section panels: the body pads the form the way HA's own editors do. */
  ha-expansion-panel {
    --expansion-panel-content-padding: 0 16px 16px;
  }
  ha-expansion-panel ha-icon[slot="leading-icon"] {
    color: var(--secondary-text-color);
  }
  .panel-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Cars: one outlined list, a row per car, one open at a time */
  .car-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
  }
  .car-item + .car-item {
    border-top: 1px solid var(--divider-color);
  }
  .car-head {
    display: flex;
    align-items: center;
    gap: 2px;
    padding-inline-end: 4px;
  }
  .car-toggle {
    flex: 1;
    min-width: 0;
    min-height: 56px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }
  .car-toggle:focus-visible {
    outline: 2px solid var(--tankst-accent, var(--primary-color));
    outline-offset: -2px;
  }
  .car-toggle ha-icon {
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .car-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .car-name,
  .car-details {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .car-details {
    font-size: 0.8125rem;
    color: var(--secondary-text-color);
  }
  .car-body {
    padding: 4px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .car-add {
    align-self: flex-start;
  }
`;
