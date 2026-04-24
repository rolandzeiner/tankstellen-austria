import { html, svg, TemplateResult, nothing } from "lit";

import type { BestRefuelResult } from "./analytics/best-refuel";
import type { HistoryPoint } from "./history";
import {
  monotoneCubicPath,
  monotoneRibbonPath,
  type Point,
} from "./utils/math";
import { formatPriceShort } from "./utils/price";

export interface HourlyEnvelope {
  // Per hour-of-day (0-23). null when that hour has no samples.
  minByHour: Array<number | null>;
  maxByHour: Array<number | null>;
}

export interface MedianDelta {
  key: "median_delta_below" | "median_delta_above" | "median_delta_equal";
  cents: string; // already formatted as "1.2" etc.
  cls: "median-delta-good" | "median-delta-bad" | "median-delta-neutral";
}

export interface SparklineOpts {
  points: HistoryPoint[]; // all history for the entity (we slice to 7d ourselves)
  showMedianLine: boolean;
  showHourEnvelope: boolean;
  showNoonMarkers: boolean;
  showMinMax: boolean;
  hourEnvelope?: HourlyEnvelope | null;
  // Best-refuel analysis output. When provided and confident, the
  // sparkline draws the green dashed marker at the nearest point in the
  // *visible* 7-day slice — not the full 4-week history (index
  // semantics would be meaningless across the two arrays).
  analysis?: BestRefuelResult | null;
  translations: {
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
  };
}

export interface SparklineResult {
  // Ready-to-render template. Empty when there isn't enough history.
  template: TemplateResult | typeof nothing;
  // Visible points (within the 7-day window), annotated with SVG (x, y) +
  // original time + value. Used by the hover handler to resolve nearest-by-x.
  hoverPoints: Array<{ t: number; v: number; x: number; y: number }>;
  // Median delta annotation for the sparkline labels row.
  medianDelta: MedianDelta | null;
  // SVG viewBox width — hover math needs this to translate pixel x → data x.
  viewBoxWidth: number;
  // Same for height so tooltips can clamp.
  viewBoxHeight: number;
}

const WIDTH = 280;
const HEIGHT = 48;
const PAD_Y = 4;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Walks the *visible* 7-day array and returns the index of the point
// nearest in time to the analysis's target hour (and weekday, when
// confident enough to surface). The vanilla card inlined this next to
// the rendering loop; keeping it here preserves the invariant that the
// marker index always refers to the same array that's rendered.
function resolveVisibleMarkerIdx(
  data: HistoryPoint[],
  analysis: BestRefuelResult | null | undefined,
): number {
  if (!analysis?.hasEnoughData || analysis.hour == null) return -1;
  if (data.length === 0) return -1;

  const now = new Date();
  const target = new Date(now);
  if (analysis.weekday != null) {
    let daysBack = (now.getDay() - analysis.weekday + 7) % 7;
    if (daysBack === 0 && now.getHours() < analysis.hour) daysBack = 7;
    target.setDate(target.getDate() - daysBack);
  } else if (now.getHours() < analysis.hour) {
    target.setDate(target.getDate() - 1);
  }
  target.setHours(analysis.hour, 0, 0, 0);
  const targetMs = target.getTime();

  let bestDist = Infinity;
  let bestIdx = -1;
  for (let i = 0; i < data.length; i++) {
    const dist = Math.abs(data[i].time - targetMs);
    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function sliceLast7Days(all: HistoryPoint[]): HistoryPoint[] {
  const cutoff = Date.now() - SEVEN_DAYS_MS;
  const inside = all.filter((d) => d.time >= cutoff);
  const prior = all.filter((d) => d.time < cutoff);
  const lastKnown = prior.length ? prior[prior.length - 1] : null;
  // Always prepend the most recent pre-window sample (if we have one)
  // so the sparkline's left edge anchors at the *start* of the 7-day
  // window with the correct pre-week value. Previously this only
  // happened when `inside.length < 2` — which meant stable-price
  // entities (e.g. Diesel whose last change was the prior Friday)
  // rendered a line that visibly "started on Monday" because the
  // prior-Friday row had been filtered out and no anchor prepended.
  if (lastKnown) return [lastKnown, ...inside];
  return inside;
}

function computeMedianDelta(values: number[]): MedianDelta | null {
  if (values.length < 2) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = (sorted.length - 1) / 2;
  const median = (sorted[Math.floor(mid)] + sorted[Math.ceil(mid)]) / 2;
  const current = values[values.length - 1];
  const deltaCents = (current - median) * 100;
  const absCents = Math.abs(deltaCents).toFixed(1);
  if (deltaCents <= -0.05) {
    return { key: "median_delta_below", cents: absCents, cls: "median-delta-good" };
  }
  if (deltaCents >= 0.05) {
    return { key: "median_delta_above", cents: absCents, cls: "median-delta-bad" };
  }
  return { key: "median_delta_equal", cents: absCents, cls: "median-delta-neutral" };
}

function medianY(values: number[], priceToY: (p: number) => number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = (sorted.length - 1) / 2;
  const median = (sorted[Math.floor(mid)] + sorted[Math.ceil(mid)]) / 2;
  return priceToY(median);
}

export function buildSparkline(opts: SparklineOpts): SparklineResult {
  const empty: SparklineResult = {
    template: nothing,
    hoverPoints: [],
    medianDelta: null,
    viewBoxWidth: WIDTH,
    viewBoxHeight: HEIGHT,
  };
  try {
    const all = opts.points;
    if (!all || all.length < 2) return empty;

    let data = sliceLast7Days(all);
    if (data.length < 2) return empty;

    // Extend a flat "tail" to now when the last recorded sample is
    // stale. Austrian fuel prices freeze for 1–2 days on weekends/
    // holidays (no significant change → no recorder sample → no
    // history row), so without this the hover tooltip stops at the
    // last weekday and the noon markers never reach Sat/Sun. The
    // synthetic point carries the last-known value, which is the
    // entity's current state too — accurate, not invented.
    const STALE_MS = 30 * 60 * 1000;
    const last = data[data.length - 1];
    if (last.time < Date.now() - STALE_MS) {
      data = [...data, { time: Date.now(), value: last.value }];
    }

    const values = data.map((d) => d.value);
    // Labels under the sparkline always describe the 7-day line — the data
    // the user actually sees traced. `min`/`max` below may expand to include
    // the 4-week envelope band so its ribbon fits in the Y axis, but that's
    // a layout concern, not a data one.
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);

    let min = dataMin;
    let max = dataMax;

    const envelope = opts.showHourEnvelope ? opts.hourEnvelope ?? null : null;
    if (envelope) {
      for (let h = 0; h < 24; h++) {
        const lo = envelope.minByHour[h];
        const hi = envelope.maxByHour[h];
        if (lo != null && hi != null) {
          min = Math.min(min, lo);
          max = Math.max(max, hi);
        }
      }
    }

    const range = max - min || 0.01;
    const priceToY = (p: number): number =>
      HEIGHT - PAD_Y - ((p - min) / range) * (HEIGHT - 2 * PAD_Y);

    const svgPoints: Point[] = data.map((d, i) => ({
      x: (i / (data.length - 1)) * WIDTH,
      y: priceToY(d.value),
    }));

    const linePath = monotoneCubicPath(svgPoints);
    const areaPath = linePath
      ? `${linePath} L ${WIDTH.toFixed(2)} ${HEIGHT.toFixed(2)} L 0 ${HEIGHT.toFixed(2)} Z`
      : "";

    // Overlay 1: hourly envelope band (4-week p10/p90 per hour-of-day).
    let envelopeTmpl: TemplateResult | typeof nothing = nothing;
    if (envelope) {
      const upper: Point[] = [];
      const lower: Point[] = [];
      for (let i = 0; i < data.length; i++) {
        const h = new Date(data[i].time).getHours();
        const hi = envelope.maxByHour[h];
        const lo = envelope.minByHour[h];
        if (hi == null || lo == null) continue;
        upper.push({ x: svgPoints[i].x, y: priceToY(hi) });
        lower.push({ x: svgPoints[i].x, y: priceToY(lo) });
      }
      if (upper.length >= 2) {
        const ribbon = monotoneRibbonPath(upper, lower);
        if (ribbon) {
          envelopeTmpl = svg`<path d=${ribbon} fill="var(--primary-color)" fill-opacity="0.08" stroke="none"/>`;
        }
      }
    }

    // Overlay 2: noon markers — one dashed vertical at each 12:00 local time
    // inside the 7-day window. Uniform-index sparkline, so we interpolate
    // visual x between the two surrounding data points.
    const noonLines: TemplateResult[] = [];
    if (opts.showNoonMarkers && data.length >= 2) {
      const tStart = data[0].time;
      const tEnd = data[data.length - 1].time;
      const first = new Date(tStart);
      first.setHours(12, 0, 0, 0);
      if (first.getTime() < tStart) first.setDate(first.getDate() + 1);

      const xForTime = (t: number): number | null => {
        if (t <= tStart || t >= tEnd) return null;
        let lo = 0;
        let hi = data.length - 1;
        while (lo < hi - 1) {
          const mid = (lo + hi) >> 1;
          if (data[mid].time <= t) lo = mid;
          else hi = mid;
        }
        const dt = data[lo + 1].time - data[lo].time;
        const frac = dt > 0 ? (t - data[lo].time) / dt : 0;
        return svgPoints[lo].x + frac * (svgPoints[lo + 1].x - svgPoints[lo].x);
      };

      for (let t = first.getTime(); t <= tEnd; t += 24 * 3600 * 1000) {
        const x = xForTime(t);
        if (x == null) continue;
        noonLines.push(svg`
          <line x1=${x.toFixed(1)} y1="0" x2=${x.toFixed(1)} y2=${HEIGHT}
                stroke="var(--secondary-text-color)" stroke-width="0.9"
                stroke-dasharray="2,3" opacity="0.55"/>
        `);
      }
    }

    // Overlay 3: 7-day median line.
    const medianDelta = opts.showMedianLine ? computeMedianDelta(values) : null;
    const medianLine: TemplateResult | typeof nothing = opts.showMedianLine
      ? svg`<line x1="0" y1=${medianY(values, priceToY).toFixed(1)}
                  x2=${WIDTH} y2=${medianY(values, priceToY).toFixed(1)}
                  stroke="var(--secondary-text-color)" stroke-width="0.8"
                  stroke-dasharray="4,3" opacity="0.55"/>`
      : nothing;

    // Best-refuel marker. Must be computed against the *visible* 7-day
    // `data` array, not the full history that `analysis` was derived
    // from — the indices don't correspond across the two arrays.
    const markerIdx = resolveVisibleMarkerIdx(data, opts.analysis);
    const marker: TemplateResult | typeof nothing =
      markerIdx >= 0 && markerIdx < svgPoints.length
        ? svg`
          <line x1=${svgPoints[markerIdx].x.toFixed(1)} y1="0"
                x2=${svgPoints[markerIdx].x.toFixed(1)} y2=${HEIGHT}
                stroke="var(--success-color,#4CAF50)" stroke-width="1"
                stroke-dasharray="3,2" opacity="0.8"/>
          <circle cx=${svgPoints[markerIdx].x.toFixed(1)}
                  cy=${svgPoints[markerIdx].y.toFixed(1)} r="3.5"
                  fill="var(--success-color,#4CAF50)"
                  stroke="var(--card-background-color,#fff)" stroke-width="1.5"/>`
        : nothing;

    const hoverPoints = data.map((d, i) => ({
      t: d.time,
      v: d.value,
      x: +svgPoints[i].x.toFixed(1),
      y: +svgPoints[i].y.toFixed(1),
    }));

    const gradId = `spark-grad-${Math.random().toString(36).slice(2, 8)}`;

    // Median-delta chip lives in the sparkline's label row (appended after
    // the "Last 7 days" text). Vanilla card concatenates raw HTML; Lit needs
    // a template, so we render it inline via the translation strings passed
    // in by the caller.
    const deltaTmpl: TemplateResult | typeof nothing = opts.showMedianLine
      ? (() => {
          const d = computeMedianDelta(values);
          if (!d) return nothing;
          const keyMap = {
            median_delta_below: opts.translations.median_delta_below,
            median_delta_above: opts.translations.median_delta_above,
            median_delta_equal: opts.translations.median_delta_equal,
          } as const;
          const text = keyMap[d.key].replace("{c}", d.cents);
          return html`
            <span class="median-delta ${d.cls}">${text}</span>
          `;
        })()
      : nothing;

    const sortedValues = [...values].sort((a, b) => a - b);
    const midIdx = (sortedValues.length - 1) / 2;
    const medianValue =
      sortedValues.length > 0
        ? (sortedValues[Math.floor(midIdx)] + sortedValues[Math.ceil(midIdx)]) /
          2
        : 0;
    const ariaLabel = (
      opts.showMedianLine
        ? opts.translations.sparkline_aria_summary
        : opts.translations.sparkline_aria_simple
    )
      .replace("{min}", formatPriceShort(dataMin))
      .replace("{max}", formatPriceShort(dataMax))
      .replace("{median}", formatPriceShort(medianValue));

    const template = html`
      <svg
        class="sparkline"
        viewBox="0 0 ${WIDTH} ${HEIGHT}"
        preserveAspectRatio="none"
        role="img"
        aria-label=${ariaLabel}
        data-points=${JSON.stringify(hoverPoints)}
        data-width=${WIDTH}
        data-height=${HEIGHT}
      >
        <title>${ariaLabel}</title>
        <defs>
          <linearGradient id=${gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${noonLines}
        ${envelopeTmpl}
        <path d=${areaPath} fill="url(#${gradId})" />
        ${marker}
        ${medianLine}
        <path
          d=${linePath}
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="1.5"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <line
          class="sparkline-hover-line"
          x1="0" y1="0" x2="0" y2=${HEIGHT}
          stroke="var(--primary-text-color)" stroke-width="0.6"
          stroke-dasharray="2,2" opacity="0" pointer-events="none"
        />
        <circle
          class="sparkline-hover-dot"
          cx="0" cy="0" r="3"
          fill="var(--primary-color)"
          stroke="var(--card-background-color,#fff)" stroke-width="1.5"
          opacity="0" pointer-events="none"
        />
      </svg>
      <div class="sparkline-tooltip" hidden>
        <span class="sparkline-tooltip-time"></span>
        <span class="sparkline-tooltip-price"></span>
      </div>
      <div class="sparkline-labels">
        ${opts.showMinMax
          ? html`<span>
              <span class="sparkline-minmax-label">${opts.translations.min_label}</span>
              ${formatPriceShort(dataMin)}
            </span>`
          : nothing}
        <span class="sparkline-period">
          ${opts.translations.last_7_days}${deltaTmpl === nothing ? nothing : html` · ${deltaTmpl}`}
        </span>
        ${opts.showMinMax
          ? html`<span>
              <span class="sparkline-minmax-label">${opts.translations.max_label}</span>
              ${formatPriceShort(dataMax)}
            </span>`
          : nothing}
      </div>
    `;

    return {
      template,
      hoverPoints,
      medianDelta,
      viewBoxWidth: WIDTH,
      viewBoxHeight: HEIGHT,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[Tankstellen Austria] sparkline render failed:", err);
    return empty;
  }
}

// Attach hover/touch handlers to a rendered sparkline container. Call from
// `updated()` in the main card after the container has been rendered. The
// container must have a `.sparkline` svg and a `.sparkline-tooltip` div as
// direct (shadow) children — exactly what `buildSparkline.template` emits.
export interface HoverSetupOpts {
  formatTime: (ts: number) => string;
  formatPrice: (price: number) => string;
}

export function attachSparklineHover(
  container: HTMLElement,
  opts: HoverSetupOpts,
): () => void {
  const noop = (): void => undefined;
  try {
    const svgEl = container.querySelector<SVGSVGElement>("svg.sparkline");
    const tooltip = container.querySelector<HTMLElement>(".sparkline-tooltip");
    if (!svgEl || !tooltip) return noop;

    const line = svgEl.querySelector<SVGLineElement>(".sparkline-hover-line");
    const dot = svgEl.querySelector<SVGCircleElement>(".sparkline-hover-dot");
    const timeEl = tooltip.querySelector<HTMLElement>(".sparkline-tooltip-time");
    const priceEl = tooltip.querySelector<HTMLElement>(".sparkline-tooltip-price");
    if (!line || !dot || !timeEl || !priceEl) return noop;

    type Pt = { t: number; v: number; x: number; y: number };
    let pts: Pt[];
    try {
      pts = JSON.parse(svgEl.dataset.points || "[]") as Pt[];
    } catch {
      pts = [];
    }
    if (!pts.length) return noop;

    const vbWidth = Number(svgEl.dataset.width) || 280;

    const show = (clientX: number): void => {
      const rect = svgEl.getBoundingClientRect();
      if (rect.width === 0) return;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetX = ratio * vbWidth;
      let best = pts[0];
      let bestDist = Math.abs(pts[0].x - targetX);
      for (const p of pts) {
        const d = Math.abs(p.x - targetX);
        if (d < bestDist) {
          best = p;
          bestDist = d;
        }
      }
      line.setAttribute("x1", String(best.x));
      line.setAttribute("x2", String(best.x));
      line.setAttribute("opacity", "0.5");
      dot.setAttribute("cx", String(best.x));
      dot.setAttribute("cy", String(best.y));
      dot.setAttribute("opacity", "1");

      timeEl.textContent = opts.formatTime(best.t);
      priceEl.textContent = opts.formatPrice(best.v);
      tooltip.hidden = false;

      const containerRect = container.getBoundingClientRect();
      const svgX = (best.x / vbWidth) * rect.width + (rect.left - containerRect.left);
      tooltip.style.left = "0px";
      const tipWidth = tooltip.offsetWidth;
      const desired = svgX - tipWidth / 2;
      const clamped = Math.max(0, Math.min(containerRect.width - tipWidth, desired));
      tooltip.style.left = `${clamped}px`;
    };

    const hide = (): void => {
      line.setAttribute("opacity", "0");
      dot.setAttribute("opacity", "0");
      tooltip.hidden = true;
    };

    // Attach to the SVG element directly — HA's Lovelace DOM swallows
    // mousemove bubbling between svg and container in practice.
    const onMove = (e: MouseEvent): void => show(e.clientX);
    const onTouch = (e: TouchEvent): void => {
      if (e.touches[0]) show(e.touches[0].clientX);
    };

    svgEl.addEventListener("mousemove", onMove);
    svgEl.addEventListener("mouseleave", hide);
    svgEl.addEventListener("touchstart", onTouch, { passive: true });
    svgEl.addEventListener("touchmove", onTouch, { passive: true });
    svgEl.addEventListener("touchend", hide);

    return (): void => {
      svgEl.removeEventListener("mousemove", onMove);
      svgEl.removeEventListener("mouseleave", hide);
      svgEl.removeEventListener("touchstart", onTouch);
      svgEl.removeEventListener("touchmove", onTouch);
      svgEl.removeEventListener("touchend", hide);
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[Tankstellen Austria] sparkline hover setup failed:", err);
    return noop;
  }
}
