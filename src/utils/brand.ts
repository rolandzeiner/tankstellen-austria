// Brand tiles for the station list: initials on the brand's colour, picked
// from the station name E-Control sends. Colours and initials only, never
// a logo. The list is the seventeen largest networks in the FVEK station
// count for the end of 2025 (wko.at, "Tankstellenstatistik 2025"), about
// 83 % of Austria's 2,694 stations; the "landwirtschaftliche
// Genossenschaften" row is Lagerhaus under another name. The colours were
// read from each chain's own logo files and Austrian website
// (2026-11-01). The text takes the brand's second colour
// where that stays readable and near-black or white otherwise;
// brand.test.ts holds every pair to 4.5:1.
//
// E-Control names are free text from the operators ("JET TANKSTELLE",
// "eni24", "AVANTI - Krems an der Donau Bertschingerstraße 6-8"), so a
// brand matches on a word anywhere in the name. An unknown station gets
// its own initials on the neutral default tile, so it never passes for a
// brand.

export interface BrandTile {
  initials: string;
  // Absent for an unknown station, which gets the neutral default tile.
  bg?: string;
  fg?: string;
}

interface Brand {
  match: RegExp;
  initials: string;
  bg: string;
  fg: string;
}

const DARK = "#1a1a1a";
const WHITE = "#ffffff";

// Order matters only where names could match two entries; none do today.
export const BRANDS: readonly Brand[] = [
  { match: /\bomv\b/i, initials: "OMV", bg: "#052759", fg: "#1fff5a" },
  { match: /\bavanti\b/i, initials: "AVA", bg: "#fbe800", fg: "#1d1d1b" },
  // Yellow on green, as on BP's old shield. Yellow on the logo's #009900
  // is 3:1, so the tile uses the same green darkened until it passes.
  { match: /\bbp\b/i, initials: "BP", bg: "#007700", fg: "#ffe600" },
  // Shell red on Shell yellow is 3.3:1.
  { match: /\bshell\b/i, initials: "SH", bg: "#fbce07", fg: DARK },
  { match: /\beni(?:\d+)?\b/i, initials: "ENI", bg: "#fab600", fg: DARK },
  { match: /\bjet\b/i, initials: "JET", bg: "#ffb700", fg: "#164194" },
  { match: /\bturm(?:ö|oe)l\b/i, initials: "TÖ", bg: "#f04e23", fg: DARK },
  { match: /\bavia\b/i, initials: "AV", bg: "#e30613", fg: WHITE },
  { match: /\bsocar\b/i, initials: "SO", bg: "#e4022c", fg: WHITE },
  // "LH Wies": the Styrian Lagerhaus stations abbreviate the name.
  { match: /\b(?:genol|lagerhaus|lh)\b/i, initials: "LH", bg: "#009e3c", fg: DARK },
  // The stations on Hofer car parks are named just "Diskont Tankstelle";
  // "Diskont" is a common word in independents' names too, so only the
  // bare name counts. White and black, as on their sign.
  {
    match: /^\s*diskont(?:[\s-]*tank(?:stelle|en))?\s*$/i,
    initials: "DT",
    bg: "#1d1d1b",
    fg: WHITE,
  },
  // Gutmann's DISK (Tirol, Vorarlberg). White on its orange is 3.2:1.
  { match: /\bdisk\b/i, initials: "DSK", bg: "#ec6623", fg: DARK },
  // Rumpold's yellow is Avanti's yellow, so the tile takes the site's dark
  // ground with the yellow on it.
  { match: /\brumpold\b/i, initials: "RU", bg: "#232323", fg: "#ffe800" },
  // The blue band with yellow text from the logo; its red is AVIA's.
  { match: /\bf\.?\s*leitner\b/i, initials: "FL", bg: "#153d8a", fg: "#ffcc00" },
  // IQ's yellow on its orange is 2.6:1, and the yellow alone is Avanti's,
  // so the tile is the orange with dark text.
  { match: /\biq\b/i, initials: "IQ", bg: "#ec6708", fg: DARK },
  // "LMEnergy Express".
  { match: /\blm[\s-]?energy\b/i, initials: "LM", bg: "#005a77", fg: "#d3d800" },
];

// Words that say nothing about who runs the station.
const GENERIC = new Set([
  "tankstelle",
  "tankstellen",
  "tanken",
  "diesel",
  "diskont",
  "shop",
  "quick",
  "austria",
  "gmbh",
  "co",
  "kg",
]);

function initialsOf(name: string): string {
  const words = name
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 0 && !GENERIC.has(w.toLowerCase()));
  const [first, second] = words;
  if (!first) return "";
  // "Landforst Obdach" → "LO"; one word or a number → its first two characters.
  const raw = second && !/^\d/.test(first) ? `${first[0]}${second[0]}` : first.slice(0, 2);
  return raw.toUpperCase();
}

export function brandTile(name: string | undefined): BrandTile {
  const text = name ?? "";
  const brand = BRANDS.find((b) => b.match.test(text));
  if (brand) return { initials: brand.initials, bg: brand.bg, fg: brand.fg };
  return { initials: initialsOf(text) || "–" };
}
