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

// Build a Google Maps URL for a station, falling back to a web search when
// the API address lacks a street number (many rural stations).
export interface StationLocation {
  address?: string;
  postalCode?: string | number;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export function mapsUrl(
  loc: StationLocation | null | undefined,
  stationName: string,
): string {
  if (!loc) return "#";
  const hasStreetNumber = /\d/.test(loc.address ?? "");
  if (hasStreetNumber) {
    const query = `${loc.postalCode ?? ""} ${loc.city ?? ""} ${loc.address ?? ""}`.trim();
    return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
  }
  const parts = [stationName, loc.address, loc.postalCode, loc.city].filter(
    (p): p is string | number => p != null && p !== "",
  );
  return `https://www.google.com/search?q=${encodeURIComponent(parts.join(" "))}`;
}
