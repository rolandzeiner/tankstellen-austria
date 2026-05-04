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
  if (n === 1) return `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  if (n === 2) {
    return (
      `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)} ` +
      `L ${pts[1]!.x.toFixed(2)} ${pts[1]!.y.toFixed(2)}`
    );
  }

  const m = new Array<number>(n - 1);
  for (let k = 0; k < n - 1; k++) {
    const dx = pts[k + 1]!.x - pts[k]!.x;
    m[k] = dx === 0 ? 0 : (pts[k + 1]!.y - pts[k]!.y) / dx;
  }

  const d = new Array<number>(n);
  d[0] = m[0]!;
  d[n - 1] = m[n - 2]!;
  for (let k = 1; k < n - 1; k++) {
    d[k] = (m[k - 1]! + m[k]!) / 2;
  }

  // Fritsch-Carlson correction: flatten where data is flat, clip tangents
  // where monotonicity would be violated.
  for (let k = 0; k < n - 1; k++) {
    if (m[k] === 0) {
      d[k] = 0;
      d[k + 1] = 0;
      continue;
    }
    const a = d[k]! / m[k]!;
    const b = d[k + 1]! / m[k]!;
    const h = a * a + b * b;
    if (h > 9) {
      const t = 3 / Math.sqrt(h);
      d[k] = t * a * m[k]!;
      d[k + 1] = t * b * m[k]!;
    }
  }

  let out = `M ${pts[0]!.x.toFixed(2)} ${pts[0]!.y.toFixed(2)}`;
  for (let k = 0; k < n - 1; k++) {
    const dx = pts[k + 1]!.x - pts[k]!.x;
    const cp1x = pts[k]!.x + dx / 3;
    const cp1y = pts[k]!.y + (d[k]! * dx) / 3;
    const cp2x = pts[k + 1]!.x - dx / 3;
    const cp2y = pts[k + 1]!.y - (d[k + 1]! * dx) / 3;
    out +=
      ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ` +
      `${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ` +
      `${pts[k + 1]!.x.toFixed(2)} ${pts[k + 1]!.y.toFixed(2)}`;
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

export interface WeightedEntry {
  value: number;
  weight: number;
}

// Weighted quantile (type-1 / "lower" convention). Returns the value at
// which the cumulative weight first reaches `q × total`. Entries are
// sorted internally; non-finite values and non-positive weights are
// dropped.
//
// Note on q=0.5: when cumulative weight crosses exactly at a boundary,
// the *lower* of the two bracketing values is returned (no interpolation).
// This matches R's `quantile(..., type=1)` and NumPy's `interpolation='lower'`.
// For our use (per-week winsorise + bucket-median) the small downward
// bias on bit-exact ties is fine — `expandHourWindow` then folds in
// adjacent hours within ±0.5¢ of the unconditional minimum, which
// covers any near-tied bucket regardless of which side of the boundary
// the median landed on.
//
// q=0 returns sorted[0] on the first iteration (target=0, acc>=0 after
// one positive weight). q=1 falls through the loop to the trailing
// `return sorted[sorted.length - 1]` to absorb floating-point epsilon
// in `acc >= total` — the trailing return is the q=1 fallback, not
// dead code.
export function weightedPercentile(
  entries: readonly WeightedEntry[],
  q: number,
): number {
  const usable = entries.filter(
    (e) => Number.isFinite(e.value) && e.weight > 0,
  );
  if (usable.length === 0) return NaN;
  if (usable.length === 1) return usable[0]!.value;
  const sorted = [...usable].sort((a, b) => a.value - b.value);
  const total = sorted.reduce((s, e) => s + e.weight, 0);
  const target = clamp(q, 0, 1) * total;
  let acc = 0;
  for (const e of sorted) {
    acc += e.weight;
    if (acc >= target) return e.value;
  }
  return sorted[sorted.length - 1]!.value;
}
