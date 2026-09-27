import { describe, expect, it } from "vitest";
import type { HomeAssistant, RegistryEntity } from "../types";
import { findTankstellenEntities, fuelTypeOf } from "./entities";

const NOW = "2026-09-27T12:00:00Z";

// What HA shows for one of our sensors while it is unavailable (or restored
// during setup retry): no fuel_type, no stations — only generic attributes.
const unavailable: { state: string; attributes: Record<string, unknown>; last_updated: string } = {
  state: "unavailable",
  attributes: { friendly_name: "Wieselburg Diesel", unit_of_measurement: "€/L" },
  last_updated: NOW,
};

const available = {
  state: "1.459",
  attributes: { fuel_type: "SUP", stations: [] },
  last_updated: NOW,
};

function makeHass(
  states: Record<string, unknown>,
  entities?: Record<string, RegistryEntity>,
): HomeAssistant {
  return { states, entities } as unknown as HomeAssistant;
}

describe("findTankstellenEntities — auto-discovery", () => {
  it("finds an unavailable sensor through the entity registry", () => {
    const hass = makeHass(
      { "sensor.wieselburg_diesel": unavailable },
      { "sensor.wieselburg_diesel": { platform: "tankstellen_austria" } },
    );
    expect(findTankstellenEntities(hass)).toEqual(["sensor.wieselburg_diesel"]);
  });

  it("falls back to the attributes when the frontend has no registry", () => {
    const hass = makeHass({ "sensor.home_super_95": available });
    expect(findTankstellenEntities(hass)).toEqual(["sensor.home_super_95"]);
  });

  it("ignores other integrations' sensors", () => {
    const hass = makeHass(
      { "sensor.outdoor_temp": unavailable },
      { "sensor.outdoor_temp": { platform: "met" } },
    );
    expect(findTankstellenEntities(hass)).toEqual([]);
  });
});

describe("fuelTypeOf — fuel code that survives unavailability", () => {
  it("uses the fuel_type attribute while the sensor is available", () => {
    expect(fuelTypeOf(undefined, "sensor.x", { fuel_type: "DIE" })).toBe("DIE");
  });

  it("recovers the code from the registry translation key", () => {
    const hass = makeHass(
      {},
      { "sensor.x": { platform: "tankstellen_austria", translation_key: "fuel_sup" } },
    );
    expect(fuelTypeOf(hass, "sensor.x", unavailable.attributes)).toBe("SUP");
  });

  it("returns an empty string when neither source knows", () => {
    const hass = makeHass({}, { "sensor.x": { translation_key: "something_else" } });
    expect(fuelTypeOf(hass, "sensor.x", {})).toBe("");
    expect(fuelTypeOf(undefined, "sensor.x", undefined)).toBe("");
  });
});
