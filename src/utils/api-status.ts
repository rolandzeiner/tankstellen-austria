// E-Control maintenance probe for the card.
//
// An unavailable entity carries no attributes, so the card can't read *why*
// it is unavailable off the state object. The backend keeps the answer in one
// install-wide place and serves it over `tankstellen_austria/api_status`. The
// card polls it every API_STATUS_RECHECK_MS, and only while an entity it shows
// is unavailable, so a healthy dashboard never sends it.

import type { HomeAssistant } from "../types";

/** Poll period for the status command while an entity is unavailable. */
export const API_STATUS_RECHECK_MS = 60_000;

/**
 * Ask the backend whether E-Control is down for maintenance. False on any
 * transport error: a backend without the command shows no notice, which is
 * exactly how the card behaved before the command existed.
 */
export async function fetchApiMaintenance(
  hass: Pick<HomeAssistant, "callWS">,
): Promise<boolean> {
  try {
    const r = await hass.callWS<{ maintenance?: boolean }>({
      type: "tankstellen_austria/api_status",
    });
    return r?.maintenance === true;
  } catch {
    return false;
  }
}
