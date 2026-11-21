import { css } from "lit";

// Card-side styles. Live in the card's shadow root via
// `static styles = cardStyles` — fully isolated from page CSS.
//
// One left rail: the fuel name, the big price, the facts, the station
// names and the open detail panel all start at the same x; the icon tile
// and the brand tiles share the gutter left of it. The chart is the one
// block that bleeds to the card edge, as HA's sensor card does. Tokens
// live on `:host` so a single override flips the whole card.
export const cardStyles = css`
  :host {
    display: block;

    /* Brand accent and the three state colours, layered over HA's flat
       semantic palette so a theme recolours the whole portfolio at once. */
    --tankst-accent:  var(--primary-color);
    --tankst-good:    var(--success-color, #4caf50);
    --tankst-warning: var(--warning-color, #ffa000);
    --tankst-error:   var(--error-color,   #db4437);

    /* One horizontal padding and one tile size; everything else is HA's.
       Verified against core.globals.ts: --ha-space-N is a 4 px grid,
       --ha-border-radius-{sm,md} are 4 / 8 px, --ha-animation-duration-fast
       is 150 ms. A var() on a token HA does not define silently takes the
       fallback, so check the file before adopting a new name. */
    --tankst-pad:  var(--ha-space-4, 16px);
    --tankst-tile: 40px;
    /* The rail: where every text block starts. Tile plus its gap. */
    --tankst-rail: calc(var(--tankst-pad) + var(--tankst-tile) + var(--ha-space-3, 12px));
  }
  ha-card {
    /* Clips content to the card; in a grid cell the gated rule below puts
       that edge at the cell's height. */
    overflow: hidden;
    /* The card responds to its own width, not the viewport. */
    container-type: inline-size;
    container-name: tscard;
    /* A column, so that in a fixed-height cell the tabs and footer keep
       their size and .body between them scrolls. */
    display: flex;
    flex-direction: column;
  }
  /* Fill the grid cell the dashboard hands us. A sections view puts a fixed
     pixel height on the cell wrapper when rows is numeric (a user's drag
     stores grid_options that override getGridOptions()) and styles nothing
     inside it. :host is display: block, so it is ha-card's containing
     block, and the two declarations only work as a pair. Gated on the
     layout HA sets ("grid" in a sections view and its edit dialog, "panel"
     in a panel view): the add-card picker sets none and centres each
     preview in a tile as tall as the tallest in its row, which an ungated
     100% would stretch the card down to. */
  :host([layout="grid"]),
  :host([layout="panel"]) {
    block-size: 100%;
  }
  :host([layout="grid"]) ha-card,
  :host([layout="panel"]) ha-card {
    block-size: 100%;
  }
  /* The one scroller: whatever height the tabs and footer leave. */
  .body {
    flex: 1 1 auto;
    min-block-size: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  ha-alert {
    display: block;
    margin: var(--ha-space-3, 12px) var(--tankst-pad) 0;
  }
  .empty {
    padding: 24px var(--tankst-pad);
    text-align: center;
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 0.857rem);
  }
  .empty-title {
    color: var(--primary-text-color);
    font-weight: var(--ha-font-weight-medium, 500);
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
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .version-reload-btn {
    flex-shrink: 0;
    background: #fff;
    color: var(--tankst-warning);
    border: none;
    border-radius: var(--ha-border-radius-pill, 999px);
    padding: 6px 14px;
    font-weight: 600;
    font-size: var(--ha-font-size-s, 0.857rem);
    cursor: pointer;
    min-height: 32px;
    font-family: inherit;
  }

  /* ── Tabs ───────────────────────────────────────────────────────── */
  .tabs {
    display: flex;
    flex-shrink: 0;
    border-bottom: 1px solid var(--divider-color);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar {
    display: none;
  }
  /* 48 px like HA's tab bar; colour, weight and underline mark the active
     one, so the state survives any single-channel deficit. */
  .tab {
    flex: 1;
    min-width: 0;
    height: 48px;
    padding: 0 12px;
    border: 0;
    background: none;
    color: var(--secondary-text-color);
    font: inherit;
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    box-shadow: inset 0 -2px 0 transparent;
    transition:
      color var(--ha-animation-duration-fast, 150ms) ease,
      box-shadow var(--ha-animation-duration-fast, 150ms) ease;
  }
  .tab:hover {
    color: var(--primary-text-color);
  }
  .tab.active {
    color: var(--tankst-accent);
    font-weight: var(--ha-font-weight-bold, 700);
    box-shadow: inset 0 -2px 0 var(--tankst-accent);
  }

  /* ── Head: tile, fuel name, the big price under the name ────────── */
  .head {
    display: grid;
    grid-template-columns: var(--tankst-tile) 1fr auto;
    grid-template-areas:
      "tile name  act"
      "tile price price";
    column-gap: var(--ha-space-3, 12px);
    align-items: center;
    padding: var(--tankst-pad) var(--tankst-pad) var(--ha-space-2, 8px);
  }
  .head.no-title {
    grid-template-areas: "price price act";
    grid-template-columns: 1fr auto;
  }
  .tile {
    grid-area: tile;
    align-self: start;
    width: var(--tankst-tile);
    height: var(--tankst-tile);
    border-radius: var(--ha-border-radius-md, 8px);
    display: grid;
    place-items: center;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
    --mdc-icon-size: 22px;
  }
  .title {
    grid-area: name;
    margin: 0;
    min-width: 0;
    font-size: var(--ha-font-size-l, 1.143rem);
    font-weight: var(--ha-font-weight-medium, 500);
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .subtitle {
    display: block;
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: var(--ha-font-weight-normal, 400);
    color: var(--secondary-text-color);
  }
  .price-line {
    grid-area: price;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 8px;
    line-height: 1.1;
    margin-top: 2px;
  }
  .price-big {
    font-size: 32px;
    font-weight: var(--ha-font-weight-bold, 700);
    letter-spacing: -0.5px;
    font-variant-numeric: tabular-nums;
  }
  .price-ctx {
    font-size: var(--ha-font-size-s, 0.857rem);
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .price-ctx b {
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
  }
  /* Dynamic mode: refresh button with the last-updated chip under it. */
  .head-actions {
    grid-area: act;
    align-self: start;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  /* ── Chips (dynamic-mode status, payment match) ───────────────────
     The state colour goes on the tint, the words stay in primary text:
     as text, HA's state colours miss 4.5:1 (amber on its tint is 1.8:1
     in the light theme). --tankst-tint carries the colour, so a plate can
     put the same tint on an opaque ground. */
  .chip-row {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: var(--ha-border-radius-pill, 999px);
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: 600;
    line-height: 1;
    background: color-mix(in srgb, var(--tankst-tint) 16%, transparent);
    color: var(--primary-text-color);
    font-variant-numeric: tabular-nums;
    --mdc-icon-size: 14px;
    --tankst-tint: var(--secondary-text-color);
  }
  .chip.warn {
    --tankst-tint: var(--tankst-warning);
  }
  .chip.match {
    --tankst-tint: var(--tankst-good);
  }

  /* ── Filled CTA (dynamic-mode refresh) ──────────────────────────── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 14px;
    height: 32px;
    border: none;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: var(--tankst-accent);
    color: var(--text-primary-color, #fff);
    font: inherit;
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    --mdc-icon-size: 16px;
    transition: opacity var(--ha-animation-duration-fast, 150ms) ease;
  }
  .btn-primary.cooling {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }

  /* ── Chart: full-bleed like hui-sensor-card, opens more-info ────── */
  .chart {
    display: block;
    width: 100%;
    padding: 0;
    margin: 0 0 var(--ha-space-1, 4px);
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  /* ── Facts under the chart: icon column at the pad, text on the rail ─ */
  .facts {
    list-style: none;
    margin: 0;
    padding: var(--ha-space-2, 8px) var(--tankst-pad) var(--ha-space-3, 12px);
    display: grid;
    grid-template-columns: 20px 1fr auto;
    row-gap: 4px;
    column-gap: 8px;
    font-size: var(--ha-font-size-s, 0.857rem);
    color: var(--secondary-text-color);
  }
  .facts li {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
  }
  .facts ha-icon {
    --mdc-icon-size: 16px;
    justify-self: center;
  }
  .facts .lead {
    color: var(--tankst-good);
    font-weight: var(--ha-font-weight-medium, 500);
  }
  .conf {
    font-size: var(--ha-font-size-xs, 0.714rem);
    font-weight: var(--ha-font-weight-bold, 700);
    letter-spacing: 0.3px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: var(--ha-border-radius-pill, 999px);
    cursor: help;
    white-space: nowrap;
  }
  .conf-high {
    background: color-mix(in srgb, var(--tankst-good) 18%, transparent);
    color: var(--tankst-good);
  }
  .conf-medium {
    background: color-mix(in srgb, var(--tankst-warning) 18%, transparent);
    color: var(--tankst-warning);
  }
  .conf-low {
    background: color-mix(in srgb, var(--secondary-text-color) 15%, transparent);
    color: var(--secondary-text-color);
  }

  /* ── Cars: the same three columns as the facts ──────────────────── */
  .cars {
    list-style: none;
    margin: 0;
    padding: var(--ha-space-2, 8px) var(--tankst-pad) var(--ha-space-3, 12px);
    border-top: 1px solid var(--divider-color);
    display: grid;
    grid-template-columns: 20px 1fr auto;
    row-gap: 6px;
    column-gap: 8px;
  }
  .cars li {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: baseline;
    min-width: 0;
  }
  .cars ha-icon {
    --mdc-icon-size: 16px;
    color: var(--secondary-text-color);
    justify-self: center;
    align-self: center;
  }
  .cars small {
    color: var(--secondary-text-color);
    font-size: var(--ha-font-size-s, 0.857rem);
  }
  .cars .num {
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  /* ── Stations: one <li> per station, row button and map link side by
        side, the detail panel under both ───────────────────────────── */
  .stations {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--divider-color);
  }
  .st {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: stretch;
    border-bottom: 1px solid var(--divider-color);
  }
  .st:last-child {
    border-bottom: 0;
  }
  .st.pm-highlight {
    box-shadow: inset 3px 0 0 var(--tankst-good);
    background: color-mix(in srgb, var(--tankst-good) 6%, transparent);
  }
  /* Two lines on four columns: tile, name over address, price over
     distance, chevron. Carries a narrow card without a second layout. */
  .st-row {
    grid-column: 1;
    display: grid;
    grid-template-columns: 28px 1fr auto 20px;
    grid-template-areas:
      "tile name price chev"
      "tile addr dist  chev";
    column-gap: 12px;
    row-gap: 1px;
    align-items: center;
    padding: 10px 0 10px var(--tankst-pad);
    min-height: 56px;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: start;
    cursor: pointer;
    transition: background-color var(--ha-animation-duration-fast, 150ms) ease;
  }
  .st-row.no-map {
    padding-inline-end: var(--tankst-pad);
  }
  /* Rank and brand both off: no tile column, the text starts at the pad. */
  .st-row.no-tile {
    grid-template-columns: 1fr auto 20px;
    grid-template-areas:
      "name price chev"
      "addr dist  chev";
  }
  .st-row.no-tile ~ .st-detail > div {
    padding-left: var(--tankst-pad);
  }
  .st-row:not([aria-expanded]) {
    cursor: default;
  }
  .st-row:hover,
  .st-map:hover {
    background: color-mix(in srgb, var(--tankst-accent) 6%, transparent);
  }
  /* The rank, or the brand's initials on its colour. */
  .st-tile {
    grid-area: tile;
    width: 28px;
    height: 28px;
    border-radius: var(--ha-border-radius-sm, 4px);
    display: grid;
    place-items: center;
    font-size: var(--ha-font-size-s, 0.857rem);
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
    background: color-mix(in srgb, var(--tankst-accent) 18%, transparent);
    color: var(--tankst-accent);
  }
  .st-tile.circle {
    border-radius: 50%;
  }
  .st-tile.brand {
    font-size: 10px;
    letter-spacing: -0.02em;
  }
  /* A station without a known brand: neutral, so it never passes for one. */
  .st-tile.brand:not(.brand-known) {
    background: color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    color: var(--primary-text-color);
  }
  .st-tile.brand-known {
    background: var(--tankst-tile-bg);
    color: var(--tankst-tile-fg);
  }
  .st-name {
    grid-area: name;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: var(--ha-font-weight-medium, 500);
    white-space: nowrap;
  }
  /* The name gives way, not the flag after it. */
  .st-name > span[lang] {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .st-addr {
    grid-area: addr;
    min-width: 0;
    font-size: var(--ha-font-size-s, 0.857rem);
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .st-price {
    grid-area: price;
    font-size: var(--ha-font-size-l, 1.143rem);
    font-weight: var(--ha-font-weight-bold, 700);
    font-variant-numeric: tabular-nums;
    text-align: end;
    white-space: nowrap;
  }
  .st-dist {
    grid-area: dist;
    font-size: var(--ha-font-size-xs, 0.714rem);
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
    text-align: end;
    white-space: nowrap;
  }
  .chev {
    grid-area: chev;
    --mdc-icon-size: 20px;
    color: var(--secondary-text-color);
    transition: transform var(--ha-animation-duration-fast, 150ms) ease;
  }
  .st-row[aria-expanded="true"] .chev {
    transform: rotate(180deg);
  }
  .st-map {
    grid-column: 2;
    display: grid;
    place-items: center;
    width: 44px;
    color: var(--secondary-text-color);
    text-decoration: none;
    --mdc-icon-size: 20px;
    transition:
      background-color var(--ha-animation-duration-fast, 150ms) ease,
      color var(--ha-animation-duration-fast, 150ms) ease;
  }
  .st-map:hover {
    color: var(--tankst-accent);
  }
  .flag {
    font-size: var(--ha-font-size-xs, 0.714rem);
    font-weight: var(--ha-font-weight-bold, 700);
    padding: 2px 7px;
    border-radius: var(--ha-border-radius-pill, 999px);
    white-space: nowrap;
    flex-shrink: 0;
    /* Words in primary text, colour on the tint: see Chips. */
    --tankst-tint: var(--tankst-warning);
    background: color-mix(in srgb, var(--tankst-tint) 18%, transparent);
    color: var(--primary-text-color);
  }
  .flag.closed {
    --tankst-tint: var(--tankst-error);
  }
  /* Detail drawer: 0fr ↔ 1fr animates to intrinsic height, so long content
     is never clipped. Hours and payment sit side by side when there is
     room, aligned to the row's name and to the top: stretched, the hours
     grid spreads its rows over the height of a long chip list. */
  .st-detail {
    grid-column: 1 / -1;
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--ha-animation-duration-normal, 250ms) ease;
  }
  .st-detail > div {
    overflow: hidden;
    min-height: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px 28px;
    padding: 0 var(--tankst-pad) 0 calc(var(--tankst-pad) + 40px);
    font-size: var(--ha-font-size-s, 0.857rem);
  }
  .st-detail.expanded {
    grid-template-rows: 1fr;
  }
  /* The top gap keeps the first line off the row's hover tint, which
     ends where the drawer starts. */
  .st-detail.expanded > div {
    padding-top: 6px;
    padding-bottom: 12px;
  }
  /* Offset by the chips' vertical padding, so the first day sits on the
     line of the first chip's text. */
  .hours {
    margin: 0;
    padding-top: 3px;
    display: grid;
    grid-template-columns: auto auto;
    gap: 1px 12px;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }
  .hours dt {
    font-weight: var(--ha-font-weight-medium, 500);
    color: var(--primary-text-color);
  }
  .hours dd {
    margin: 0;
  }
  /* Takes the width left beside the hours and wraps its chips inside it;
     only under 180 px of room does the whole block drop below. Without a
     basis its natural width is all chips in one line, and a station with
     many cards pushed the block under the hours. */
  .pay {
    flex: 1 1 180px;
    min-width: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 5px;
  }
  .pay span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: var(--ha-border-radius-pill, 999px);
    background: color-mix(in srgb, var(--secondary-text-color) 12%, transparent);
    --mdc-icon-size: 13px;
  }
  .pay .pm-other {
    font-style: italic;
  }

  /* ── Plates (stations.row_style) ────────────────────────────────────
     Each station on its own plate, inset from the card edge. The rail
     stays put: a plate's pad is the card's minus the inset. Every text on
     a coloured plate takes one colour with a known ratio to its ground:
     the brand's own pair on the filled plate (brand.test.ts holds each to
     4.5:1), the theme's primary text on the fading wash (brand.test.ts
     holds the wash's strongest point to 4.5:1 in HA's light and dark
     theme). The theme's secondary grey is never used there: on even a 4 %
     wash of a dark brand it drops under 4.5:1 in the light theme. */
  .stations.plates {
    --tankst-inset: var(--ha-space-2, 8px);
    --tankst-plate-pad: calc(var(--tankst-pad) - var(--tankst-inset));
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: var(--tankst-inset);
  }
  /* A station without a known brand: outlined on the card's own ground. */
  .plates .st {
    --tankst-pad: var(--tankst-plate-pad);
    /* Where hover and payment-match rings sit, inside the plate edge. */
    --tankst-ring-inset: -2px;
    border-bottom: 0;
    border-radius: var(--ha-border-radius-md, 8px);
    overflow: hidden;
    outline: 1px solid var(--divider-color);
    outline-offset: -1px;
  }
  .st.plate-brand {
    /* Rings take the plate's text colour, which can be the card's own:
       a band of brand colour keeps them apart. */
    --tankst-ring-inset: -5px;
    outline-color: transparent;
    background: var(--tankst-row-bg);
    color: var(--tankst-row-fg);
  }
  /* The brand's full colour as a stripe on the left edge, then a wash
     that is gone by the price. The stripe carries the brand: a dark
     theme turns any strong yellow wash olive. The wash peaks at 24 %. */
  .st.plate-fade {
    outline-color: transparent;
    background: linear-gradient(
      to right,
      var(--tankst-row-bg) 0 5px,
      color-mix(in srgb, var(--tankst-row-bg) 24%, transparent) 5px,
      transparent 90%
    );
  }
  .plate-brand :is(.st-addr, .st-dist, .chev, .st-map, .st-map:hover, .hours, .hours dt) {
    color: inherit;
  }
  .plate-fade :is(.st-addr, .st-dist, .chev, .st-map, .st-map:hover, .hours, .hours dt) {
    color: var(--primary-text-color);
  }
  /* The tile on the filled plate turns inside out; on the wash it takes
     the brand's pair, rank and initials alike. */
  .plate-brand .st-tile {
    background: var(--tankst-row-fg);
    color: var(--tankst-row-bg);
  }
  .plate-fade .st-tile {
    background: var(--tankst-row-bg);
    color: var(--tankst-row-fg);
  }
  /* Flags and chips get a ground of their own, so their contrast never
     depends on the plate: inverted on the filled plate, and on the wash
     their usual tint over the card's own colour. */
  .plate-brand :is(.flag, .chip.match) {
    background: var(--tankst-row-fg);
    color: var(--tankst-row-bg);
  }
  .plate-brand .pay span {
    background: none;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 55%, transparent);
  }
  .plate-fade :is(.flag, .chip.match) {
    background:
      linear-gradient(color-mix(in srgb, var(--tankst-tint) 18%, transparent) 0 0),
      var(--ha-card-background, var(--card-background-color, #fff));
  }
  .plate-fade .pay span {
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  /* A payment match rings the plate; the list's edge bar would cover
     the brand stripe. */
  .plates .st.pm-highlight {
    box-shadow: none;
    background-color: transparent;
    outline: 2px solid var(--tankst-good);
    outline-offset: var(--tankst-ring-inset);
  }
  .plates .st.plate-brand.pm-highlight {
    background-color: var(--tankst-row-bg);
    outline-color: var(--tankst-row-fg);
  }
  /* Hover rings the plate instead of tinting it: a tint moves the ground
     towards the text and eats into the contrast. */
  .plates .st-row:hover,
  .plates .st-map:hover {
    background: none;
  }
  .plates .st:has(> :is(.st-row:not(:disabled), .st-map):hover) {
    outline: 2px solid color-mix(in srgb, currentColor 45%, transparent);
    outline-offset: var(--tankst-ring-inset);
  }
  .plate-brand :is(button, a):focus-visible {
    outline-color: var(--tankst-row-fg);
  }

  /* ── Footer: E-Control logo-link + attribution ──────────────────── */
  .footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px var(--tankst-pad);
    border-top: 1px solid var(--divider-color);
  }
  .brand-link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
  }
  .brand-logo {
    display: block;
    height: 20px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
  }
  /* Theme-following silhouette when logo_adapt_to_theme is on. */
  .brand-logo.adaptive.adaptive-light {
    filter: brightness(0);
  }
  .brand-logo.adaptive.adaptive-dark {
    filter: brightness(0) invert(1);
  }
  .attribution-text {
    font-size: var(--ha-font-size-xs, 0.714rem);
    color: var(--secondary-text-color);
    letter-spacing: 0.03em;
  }

  /* ── Density: two steps ─────────────────────────────────────────── */
  @container tscard (inline-size < 360px) {
    .price-big {
      font-size: 28px;
    }
    .st-row {
      column-gap: 10px;
    }
    .st-detail > div {
      padding-left: var(--tankst-pad);
    }
    .st-name {
      white-space: normal;
      flex-wrap: wrap;
    }
    .st-name > span[lang] {
      overflow: visible;
    }
    .cars .num {
      grid-column: 2;
    }
  }
  /* Under 300 px (half a section) the price column leaves the name about
     40 px, and a word or a flag wider than that ran under the price. The
     name and the address take the whole text width, the price moves to a
     line of its own at the rail with the distance at its end. Measured:
     the two-line row holds from 300 px up. */
  @container tscard (inline-size < 300px) {
    .st-row {
      grid-template-areas:
        "tile name  name chev"
        "tile addr  addr chev"
        "tile price dist chev";
    }
    .st-row.no-tile {
      grid-template-areas:
        "name  name chev"
        "addr  addr chev"
        "price dist chev";
    }
    .st-price {
      text-align: start;
    }
  }
  @container tscard (inline-size > 480px) {
    .price-big {
      font-size: 36px;
    }
    .st-row {
      min-height: 60px;
    }
  }

  /* ── Accessibility ──────────────────────────────────────────────── */
  :is(button, a):focus-visible {
    outline: 2px solid var(--tankst-accent);
    outline-offset: 2px;
    border-radius: 6px;
  }
  /* These sit flush with a clipping edge, so the ring goes inside. */
  .tab:focus-visible,
  .st-row:focus-visible,
  .st-map:focus-visible,
  .chart:focus-visible {
    outline-offset: -2px;
  }
  @media (forced-colors: active) {
    :is(button, a):focus-visible {
      outline-color: CanvasText;
    }
    .tile,
    .st-tile,
    .chip,
    .flag,
    .btn-primary,
    .pay span,
    .conf {
      forced-color-adjust: none;
    }
  }
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

// Editor-side styles. The editor is its own element with its own shadow
// root, so none of the card's --tankst-* tokens reach it: it styles with
// HA's variables directly.
export const editorStyles = css`
  :host {
    /* No color-scheme here: the editor inherits HA's, and declaring
       "light dark" would hand the choice to the OS setting. */
    display: block;
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
    outline: 2px solid var(--primary-color);
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
