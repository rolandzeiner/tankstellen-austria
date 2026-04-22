import type { HomeAssistant } from "custom-card-helpers";

// Find all tankstellen_austria sensors in hass states.
// Key heuristic: sensor.* with both `fuel_type` and `stations` (array) attrs.
export function findTankstellenEntities(hass: HomeAssistant | undefined): string[] {
  if (!hass || !hass.states) return [];
  return Object.keys(hass.states).filter((eid) => {
    const state = hass.states[eid];
    return (
      eid.startsWith("sensor.") &&
      state?.attributes?.fuel_type &&
      Array.isArray(state.attributes.stations)
    );
  });
}
