import { DOMAIN } from "../const";
import type { HomeAssistant } from "../types";

// sensor.py sets each sensor's translation key to `fuel_<code>` (fuel_die,
// fuel_sup, fuel_gas), so the fuel code is recoverable from the registry.
const FUEL_KEY_PREFIX = "fuel_";

// Find all tankstellen_austria sensors.
//
// The entity registry (`hass.entities`) comes first because it survives
// unavailability: HA drops a sensor's extra attributes while it is
// unavailable, and an entry stuck in setup retry (e.g. during E-Control
// maintenance) only has restored states. Attribute sniffing — sensor.* with
// both `fuel_type` and `stations` — stays as the fallback for a frontend
// that doesn't expose `hass.entities`.
export function findTankstellenEntities(hass: HomeAssistant | undefined): string[] {
  if (!hass || !hass.states) return [];
  return Object.keys(hass.states).filter((eid) => {
    if (!eid.startsWith("sensor.")) return false;
    if (hass.entities?.[eid]?.platform === DOMAIN) return true;
    const state = hass.states[eid];
    return Boolean(
      state?.attributes?.fuel_type && Array.isArray(state.attributes.stations),
    );
  });
}

// Fuel code (DIE / SUP / GAS) for one of our sensors: its `fuel_type`
// attribute while it is available, otherwise the registry translation key,
// which keeps tab labels and the header title while E-Control is down.
// "" when neither is known.
export function fuelTypeOf(
  hass: HomeAssistant | undefined,
  entityId: string,
  attributes: { fuel_type?: unknown } | undefined,
): string {
  const attr = attributes?.fuel_type;
  if (typeof attr === "string" && attr) return attr;
  const key = hass?.entities?.[entityId]?.translation_key;
  if (typeof key === "string" && key.startsWith(FUEL_KEY_PREFIX)) {
    return key.slice(FUEL_KEY_PREFIX.length).toUpperCase();
  }
  return "";
}
