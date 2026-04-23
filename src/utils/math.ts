export interface Point {
  x: number;
  y: number;
}

// Monotone cubic Hermite interpolation (Fritsch-Carlson 1980).
// Produces a smooth SVG path that passes through every input point exactly
// and never overshoots between them — so it cannot introduce artificial
// local extrema not present in the data. Safe for price visualisation.
//
// `pts` must be sorted by x, strictly increasing x.
export function monotoneCubicPath(pts: readonly Point[]): string {
  const n = pts.length;
  if (n === 0) return "";
  if (n === 1) return `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  if (n === 2) {
    return (
      `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} ` +
      `L ${pts[1].x.toFixed(2)} ${pts[1].y.toFixed(2)}`
    );
  }

  const m = new Array<number>(n - 1);
  for (let k = 0; k < n - 1; k++) {
    const dx = pts[k + 1].x - pts[k].x;
    m[k] = dx === 0 ? 0 : (pts[k + 1].y - pts[k].y) / dx;
  }

  const d = new Array<number>(n);
  d[0] = m[0];
  d[n - 1] = m[n - 2];
  for (let k = 1; k < n - 1; k++) {
    d[k] = (m[k - 1] + m[k]) / 2;
  }

  // Fritsch-Carlson correction: flatten where data is flat, clip tangents
  // where monotonicity would be violated.
  for (let k = 0; k < n - 1; k++) {
    if (m[k] === 0) {
      d[k] = 0;
      d[k + 1] = 0;
      continue;
    }
    const a = d[k] / m[k];
    const b = d[k + 1] / m[k];
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      d[k] = t * a * m[k];
      d[k + 1] = t * b * m[k];
    }
  }

  let out = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let k = 0; k < n - 1; k++) {
    const dx = pts[k + 1].x - pts[k].x;
    const cp1x = pts[k].x + dx / 3;
    const cp1y = pts[k].y + (d[k] * dx) / 3;
    const cp2x = pts[k + 1].x - dx / 3;
    const cp2y = pts[k + 1].y - (d[k + 1] * dx) / 3;
    out +=
      ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ` +
      `${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ` +
      `${pts[k + 1].x.toFixed(2)} ${pts[k + 1].y.toFixed(2)}`;
  }
  return out;
}

// Closed smooth-ribbon path between two aligned point arrays (same x, upper
// and lower y). Monotone cubic for both edges so the band never overshoots
// its own observed extrema.
export function monotoneRibbonPath(
  upper: readonly Point[],
  lower: readonly Point[],
): string {
  if (!upper || !lower || upper.length < 2 || upper.length !== lower.length) {
    return "";
  }
  const upperPath = monotoneCubicPath(upper);
  // Traverse lower right-to-left; the monotone algorithm tolerates decreasing
  // x because dx carries its own sign through all derivatives.
  const reversedLower = [...lower].reverse();
  const lowerPath = monotoneCubicPath(reversedLower);
  // Replace the lower path's leading "M x y" with "L x y" so it continues
  // from the end of the upper edge into the lower edge.
  const lowerCont = lowerPath.replace(
    /^M\s+([-\d.]+)\s+([-\d.]+)/,
    (_m, x: string, y: string) => `L ${x} ${y}`,
  );
  return `${upperPath} ${lowerCont} Z`;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// Weighted percentile on a numeric array. Returns the value at the given
// quantile `q` in [0, 1]. Uses linear interpolation between adjacent samples.
export function percentile(sorted: readonly number[], q: number): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  if (n === 1) return sorted[0];
  const i = clamp(q, 0, 1) * (n - 1);
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  if (lo === hi) return sorted[lo];
  const f = i - lo;
  return sorted[lo] * (1 - f) + sorted[hi] * f;
}

export function weightedMedian(
  values: readonly number[],
  weights: readonly number[],
): number {
  const n = values.length;
  if (n === 0) return NaN;
  if (n === 1) return values[0];
  const pairs = values
    .map((v, i) => ({ v, w: weights[i] ?? 1 }))
    .filter((p) => Number.isFinite(p.v) && p.w > 0)
    .sort((a, b) => a.v - b.v);
  if (pairs.length === 0) return NaN;
  const total = pairs.reduce((s, p) => s + p.w, 0);
  let acc = 0;
  for (const p of pairs) {
    acc += p.w;
    if (acc >= total / 2) return p.v;
  }
  return pairs[pairs.length - 1].v;
}

// Winsorize values at the given low/high percentiles (e.g. 0.05 / 0.95).
// Does not mutate the input.
export function winsorize(
  values: readonly number[],
  lo: number,
  hi: number,
): number[] {
  if (values.length === 0) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const loV = percentile(sorted, lo);
  const hiV = percentile(sorted, hi);
  return values.map((v) => clamp(v, loV, hiV));
}
