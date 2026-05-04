// Cross-cutting helpers + URL constants shared by the card and editor.
// Top-level (NOT under utils/) so the import path matches sibling
// integrations (nextbike-austria, wiener-linien-austria) and the
// portfolio-design "URL trust boundary" rule has a single owner.

/** Centralised E-Control URLs. The integration mounts the logo SVG
 *  alongside the card bundle under URL_BASE; the homepage is the
 *  attribution footer's link target. Centralising them keeps the
 *  string in one place so a future redirect or domain change is a
 *  one-line edit. */
export const E_CONTROL_HOMEPAGE = "https://www.e-control.at/";
export const E_CONTROL_LOGO_URL = "/tankstellen-austria/e-control_logo.svg";

/** Trust-boundary guard for URIs that the card renders into ``href``
 *  attributes. Lit's ``${}`` interpolation is safe against tag/
 *  attribute injection but does NOT block ``javascript:`` or ``data:``
 *  URIs — a compromised upstream feed could otherwise execute
 *  arbitrary JS in HA's frontend origin when the user clicks the link.
 *  Allowlist HTTP/HTTPS only; everything else collapses to an empty
 *  string and the call site treats it as "no link available".
 *
 *  Accepts ``unknown`` so the helper doubles as a runtime type-narrow
 *  for upstream-derived data structures. */
export function safeHttpsUri(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return /^https?:\/\//i.test(raw) ? raw : "";
}
