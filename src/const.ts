// Must match CARD_VERSION in custom_components/tankstellen_austria/const.py byte-for-byte.
// If they drift the WS check sees a mismatch, shows a reload banner, the reload
// re-serves the same JS, and the banner reappears — infinite loop.
//
// Bump both in the same commit. The README badge + manifest.json stay at the
// clean version; this constant + const.py can carry a `-beta-N` suffix during
// development.
export const CARD_VERSION = "1.6.0";
