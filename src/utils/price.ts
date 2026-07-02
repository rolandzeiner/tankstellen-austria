import type { MapLinkKind } from "../utils";
import type { StationLocation } from "../types";

// Format a price in EUR as "€ 1,749" (German-style decimal comma, 3 decimals).
export function formatPrice(price: number | null | undefined): string {
  if (price == null || !Number.isFinite(Number(price))) return "–";
  return `€ ${Number(price).toFixed(3).replace(".", ",")}`;
}

// Format a price without the currency symbol, e.g. for compact displays.
export function formatPriceShort(price: number | null | undefined): string {
  if (price == null || !Number.isFinite(Number(price))) return "–";
  return Number(price).toFixed(3).replace(".", ",");
}

// Format an as-the-crow-flies distance (Luftlinie). Metres under 1 km render
// as a rounded integer ("850 m"); 1 km and above switch to one decimal with a
// German decimal comma to match formatPrice ("12,3 km"). Returns "" for
// missing/invalid input so the caller can render `nothing` rather than a
// stray unit. Negative values are treated as invalid.
export function formatDistance(meters: number | null | undefined): string {
  if (meters == null || !Number.isFinite(meters) || meters < 0) return "";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

// Build a navigation URL for a station, falling back to a web search when
// the API address lacks a street number (many rural stations). Returns
// null when the inputs would yield nothing useful — caller should render
// the link as `nothing` rather than an empty <a href> (which the
// safeNavUri allowlist would otherwise collapse to "" → page reload
// on click).
//
// Only the precise-address branch honours `linkKind` (resolved from the
// `map_provider` config by `resolveMapLinkKind`); the fuzzy fallbacks
// stay a Google *search* on every platform — a maps pin for a
// number-less address would drop the user somewhere wrong, and the
// magnify icon at the call site promises a search.
export function mapsUrl(
  loc: StationLocation | null | undefined,
  stationName: string,
  linkKind: MapLinkKind = "google",
): string | null {
  if (!loc) {
    if (!stationName) return null;
    return `https://www.google.com/search?q=${encodeURIComponent(stationName)}`;
  }
  const hasStreetNumber = /\d/.test(loc.address ?? "");
  if (hasStreetNumber) {
    const query = `${loc.postalCode ?? ""} ${loc.city ?? ""} ${loc.address ?? ""}`.trim();
    const q = encodeURIComponent(query);
    if (linkKind === "apple") return `https://maps.apple.com/?q=${q}`;
    if (linkKind === "geo") return `geo:0,0?q=${q}`;
    return `https://maps.google.com/?q=${q}`;
  }
  const parts = [stationName, loc.address, loc.postalCode, loc.city].filter(
    (p): p is string | number => p != null && p !== "",
  );
  if (parts.length === 0) return null;
  return `https://www.google.com/search?q=${encodeURIComponent(parts.join(" "))}`;
}
