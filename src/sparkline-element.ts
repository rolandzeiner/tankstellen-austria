// <tankstellen-austria-sparkline>: the 7-day price chart as its own
// element, the way HA draws its sensor-card graph (`hui-graph-base`). The
// card hands it the history, the overlays and the clock settings; the
// element computes the geometry once per change in `willUpdate` and keeps
// the hover as its own state, so following the pointer re-renders a few
// attributes here instead of the whole card.

import { LitElement, css, html, nothing, svg, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import type { BestRefuelResult, HourlyEnvelope } from "./analytics/best-refuel";
import type { HistoryPoint } from "./history";
import { computeSparkline, hoverPointAt, type HoverPoint, type SparklineModel } from "./sparkline";
import { formatPrice, formatPriceShort } from "./utils/price";

export interface SparklineTranslations {
  min_label: string;
  max_label: string;
  last_7_days: string;
  // Delta-vs-median label templates with `{c}` placeholder.
  median_delta_below: string;
  median_delta_above: string;
  median_delta_equal: string;
  // Full aria-label template for the SVG, with `{min}`, `{max}`,
  // `{median}` placeholders. The `_simple` variant is used when the
  // median-line overlay is disabled.
  sparkline_aria_summary: string;
  sparkline_aria_simple: string;
}

// One gradient id per instance for the page's lifetime, so a re-render
// never rewrites the <linearGradient> and the fill that points at it.
let instances = 0;

const timeFormatters = new Map<string, Intl.DateTimeFormat>();

// "Mo., 2.11., 14:30" / "Mon, 11/2, 2:30 PM": the UI language picks the
// order and separators, the profile picks 12- or 24-hour and the zone.
function timeFormatter(lang: string, timeZone: string, hour12: boolean): Intl.DateTimeFormat {
  const key = `${lang}|${timeZone}|${hour12 ? 12 : 24}`;
  let fmt = timeFormatters.get(key);
  if (!fmt) {
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: hour12 ? "h12" : "h23",
    };
    try {
      fmt = new Intl.DateTimeFormat(lang, { ...opts, timeZone });
    } catch {
      fmt = new Intl.DateTimeFormat(undefined, opts);
    }
    timeFormatters.set(key, fmt);
  }
  return fmt;
}

@customElement("tankstellen-austria-sparkline")
export class TankstellenAustriaSparkline extends LitElement {
  @property({ attribute: false }) public points: HistoryPoint[] = [];
  @property({ attribute: false }) public envelope: HourlyEnvelope | null = null;
  @property({ attribute: false }) public analysis: BestRefuelResult | null = null;
  @property({ attribute: false }) public showMedianLine = false;
  @property({ attribute: false }) public showHourEnvelope = false;
  @property({ attribute: false }) public showNoonMarkers = false;
  @property({ attribute: false }) public showMinMax = true;
  @property({ attribute: false }) public timeZone = "UTC";
  @property({ attribute: false }) public language = "de";
  @property({ attribute: false }) public hour12 = false;
  @property({ attribute: false }) public translations: SparklineTranslations | null = null;

  @state() private _hover: HoverPoint | null = null;

  private _model: SparklineModel | null = null;
  private readonly _gradId = `spark-grad-${++instances}`;

  protected override willUpdate(changed: PropertyValues): void {
    // Anything but the hover changes the geometry; the hover never does.
    let geometry = false;
    for (const key of changed.keys()) {
      if (key !== "_hover") geometry = true;
    }
    if (!geometry) return;
    this._model = computeSparkline({
      points: this.points,
      showMedianLine: this.showMedianLine,
      showHourEnvelope: this.showHourEnvelope,
      showNoonMarkers: this.showNoonMarkers,
      hourEnvelope: this.envelope,
      analysis: this.analysis,
      timeZone: this.timeZone,
    });
    // New data under a resting pointer: keep the hover on the same spot.
    if (this._hover) this._hover = this._model ? hoverPointAt(this._model, this._hover.x) : null;
  }

  protected override updated(changed: PropertyValues): void {
    if (!changed.has("_hover") || !this._hover) return;
    // Centre the tooltip over the hovered change and keep it inside the
    // chart. One read of its width after the render, then one write.
    const tooltip = this.renderRoot.querySelector<HTMLElement>(".sparkline-tooltip");
    const wrap = this.renderRoot.querySelector<HTMLElement>(".sparkline-svg-wrap");
    if (!tooltip || !wrap || !this._model) return;
    const width = wrap.clientWidth;
    const desired = (this._hover.x / this._model.width) * width - tooltip.offsetWidth / 2;
    tooltip.style.left = `${Math.max(0, Math.min(width - tooltip.offsetWidth, desired))}px`;
  }

  private _onPointerMove = (ev: PointerEvent): void => {
    const model = this._model;
    if (!model) return;
    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
    const next = hoverPointAt(model, ratio * model.width);
    if (next !== this._hover) this._hover = next;
  };

  private _onPointerLeave = (): void => {
    this._hover = null;
  };

  private _t(key: keyof SparklineTranslations): string {
    return this.translations?.[key] ?? key;
  }

  protected override render(): TemplateResult | typeof nothing {
    const m = this._model;
    if (!m) return nothing;
    const { width, height } = m;

    const ariaLabel = this._t(
      this.showMedianLine ? "sparkline_aria_summary" : "sparkline_aria_simple",
    )
      .replace("{min}", formatPriceShort(m.min))
      .replace("{max}", formatPriceShort(m.max))
      .replace("{median}", formatPriceShort(m.median));

    const hover = this._hover;
    const hoverTime = hover
      ? timeFormatter(this.language, this.timeZone, this.hour12).format(hover.time)
      : "";

    const delta = m.medianDelta;
    const deltaTmpl = delta
      ? html`<span class="median-delta ${delta.cls}"
          >${this._t(delta.key).replace("{c}", delta.cents)}</span
        >`
      : nothing;

    // Strokes carry vector-effect="non-scaling-stroke": the viewBox is
    // stretched to the card's width (preserveAspectRatio="none"), which
    // would otherwise draw a step's vertical run two or three times as
    // wide as its horizontal one. The dot stays an HTML overlay for the
    // same reason: a circle in this SVG would be an oval.
    return html`
      <div
        class="sparkline-svg-wrap"
        @pointermove=${this._onPointerMove}
        @pointerleave=${this._onPointerLeave}
        @pointercancel=${this._onPointerLeave}
      >
        <svg
          class="sparkline"
          viewBox="0 0 ${width} ${height}"
          preserveAspectRatio="none"
          role="img"
          aria-label=${ariaLabel}
        >
          <title>${ariaLabel}</title>
          <defs>
            <linearGradient id=${this._gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
            </linearGradient>
          </defs>
          ${m.noonXs.map(
            (x) => svg`<line x1=${x} y1="0" x2=${x} y2=${height}
                stroke="var(--secondary-text-color)" stroke-width="0.5"
                stroke-dasharray="2,3" opacity="0.55"
                vector-effect="non-scaling-stroke"/>`,
          )}
          ${
            m.envelopePath
              ? svg`<path d=${m.envelopePath} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`
              : nothing
          }
          <path d=${m.areaPath} fill="url(#${this._gradId})" />
          ${
            m.band
              ? svg`<rect x=${m.band.x1} y="0" width=${+(m.band.x2 - m.band.x1).toFixed(1)}
                  height=${height} fill="var(--success-color)" fill-opacity="0.10" stroke="none"/>`
              : nothing
          }
          ${
            m.medianY != null
              ? svg`<line x1="0" y1=${m.medianY} x2=${width} y2=${m.medianY}
                  stroke="var(--secondary-text-color)" stroke-width="0.5"
                  stroke-dasharray="4,3" opacity="0.55"
                  vector-effect="non-scaling-stroke"/>`
              : nothing
          }
          <path
            d=${m.linePath}
            fill="none"
            stroke="var(--primary-color)"
            stroke-width="1.5"
            stroke-linejoin="round"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
          ${
            hover
              ? svg`<line x1=${hover.x} y1="0" x2=${hover.x} y2=${height}
                  stroke="var(--primary-text-color)" stroke-width="0.6"
                  stroke-dasharray="2,2" opacity="0.5" pointer-events="none"
                  vector-effect="non-scaling-stroke"/>`
              : nothing
          }
        </svg>
        ${
          hover
            ? html`<div
                class="sparkline-hover-dot"
                style=${styleMap({
                  left: `${(hover.x / width) * 100}%`,
                  top: `${(hover.y / height) * 100}%`,
                })}
                aria-hidden="true"
              ></div>`
            : nothing
        }
      </div>
      <div class="sparkline-tooltip" ?hidden=${!hover} aria-hidden="true">
        <span class="sparkline-tooltip-time">${hoverTime}</span>
        <span class="sparkline-tooltip-price">${hover ? formatPrice(hover.value) : ""}</span>
      </div>
      <div class="sparkline-labels">
        ${
          this.showMinMax
            ? html`<span>
                <span class="sparkline-minmax-label">${this._t("min_label")}</span>
                ${formatPriceShort(m.min)}
              </span>`
            : nothing
        }
        <span class="sparkline-period">
          ${this._t("last_7_days")}${delta ? html` · ${deltaTmpl}` : nothing}
        </span>
        ${
          this.showMinMax
            ? html`<span>
                <span class="sparkline-minmax-label">${this._t("max_label")}</span>
                ${formatPriceShort(m.max)}
              </span>`
            : nothing
        }
      </div>
    `;
  }

  // The card's tokens (--tankst-*, --ts-sparkline-height) are custom
  // properties and inherit through the shadow boundary.
  public static override styles = css`
    :host {
      display: block;
      position: relative;
    }
    /* Tight wrap around the SVG, so the hover dot's percentage position
       resolves against the SVG's rendered box and not the labels below. */
    .sparkline-svg-wrap {
      position: relative;
      width: 100%;
    }
    .sparkline {
      width: 100%;
      height: var(--ts-sparkline-height, clamp(40px, 8vw + 24px, 72px));
      display: block;
    }
    .sparkline-hover-dot {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      border: 1.5px solid var(--card-background-color);
      background: var(--primary-color);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1;
      /* The dot follows the pointer, so it wants the shortest real
         duration HA ships: instant, not fast. */
      transition:
        left var(--ha-animation-duration-instant, 75ms) linear,
        top var(--ha-animation-duration-instant, 75ms) linear;
    }
    .sparkline-tooltip {
      position: absolute;
      top: -28px;
      display: flex;
      gap: 6px;
      padding: 3px 7px;
      background: var(--card-background-color);
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
    @media (prefers-reduced-motion: reduce) {
      .sparkline-hover-dot {
        transition: none;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "tankstellen-austria-sparkline": TankstellenAustriaSparkline;
  }
}
