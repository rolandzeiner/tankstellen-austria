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

/** Trust-boundary guard for navigation links specifically. Same contract
 *  as ``safeHttpsUri``, widened by exactly one non-http scheme: the
 *  Android ``geo:0,0?q=`` maps-chooser URI that ``mapsUrl`` emits. The
 *  prefix is matched verbatim (not ``geo:`` generally) so the allowlist
 *  stays as narrow as what we actually generate. */
export function safeNavUri(raw: unknown): string {
  if (typeof raw !== "string") return "";
  if (raw.startsWith("geo:0,0?q=")) return raw;
  return safeHttpsUri(raw);
}

/** Where a navigation link should land, resolved from config + device. */
export type MapLinkKind = "google" | "apple" | "geo";

/** The card-config choice: force a provider, or pick per device. */
export type MapProvider = "auto" | "google" | "apple";

export type NavPlatform = "ios" | "android" | "desktop";

/** Detect the device family for map-link routing. Pure — UA string and
 *  touch-point count are injected so tests don't need to stub
 *  ``navigator``. The ``Macintosh`` + multi-touch branch catches iPads,
 *  which report a macOS UA since iPadOS 13 (real Macs report
 *  ``maxTouchPoints`` 0). */
export function detectNavPlatform(
  ua: string,
  maxTouchPoints: number,
): NavPlatform {
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Macintosh/.test(ua) && maxTouchPoints > 1) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/** Resolve the configured provider to a concrete link kind. ``auto``
 *  routes per device: Apple Maps universal link on iOS (the HA iOS app
 *  doesn't forward ``geo:`` URIs), the ``geo:`` chooser on Android
 *  (native app picker, works in Chrome and the HA companion app), and
 *  Google Maps on the desktop. A forced provider ignores the device —
 *  Apple Maps degrades to its web app off-Apple. */
export function resolveMapLinkKind(
  provider: MapProvider,
  platform: NavPlatform,
): MapLinkKind {
  if (provider === "google" || provider === "apple") return provider;
  if (platform === "ios") return "apple";
  if (platform === "android") return "geo";
  return "google";
}
