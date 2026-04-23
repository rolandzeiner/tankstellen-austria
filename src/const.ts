// Must match CARD_VERSION in custom_components/tankstellen_austria/const.py byte-for-byte.
// If they drift the WS check sees a mismatch, shows a reload banner, the reload
// re-serves the same JS, and the banner reappears — infinite loop.
//
// Bump both in the same commit. The README badge + manifest.json stay at the
// clean version; this constant + const.py can carry a `-beta-N` suffix during
// development.
export const CARD_VERSION = "1.7.0";

export const DOMAIN = "tankstellen_austria";

// Backend safety interval between manual refreshes in dynamic mode.
export const DYNAMIC_MANUAL_COOLDOWN_MS = 2 * 60 * 1000;

// How often the card refetches history (short so the sparkline picks up
// overnight price changes without needing a page reload).
export const HISTORY_REFRESH_MS = 30 * 60 * 1000;

// Icons offered in the editor's car-icon picker.
export const CAR_ICONS = [
  "mdi:car",
  "mdi:car-sports",
  "mdi:car-hatchback",
  "mdi:car-estate",
  "mdi:car-convertible",
  "mdi:car-pickup",
  "mdi:car-electric",
  "mdi:car-electric-outline",
  "mdi:car-side",
  "mdi:van-passenger",
  "mdi:motorbike",
  "mdi:bus",
  "mdi:truck",
  "mdi:rv-truck",
] as const;
