import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import type { TankstellenAustriaCardConfig } from "../types";
import { normaliseConfig } from "./config";

const base = { type: "custom:tankstellen-austria-card" };

/** normaliseConfig takes the typed config, but its job is to rescue YAML
 *  that does not match the type, so the tests feed it loose objects. */
const normalise = (raw: Record<string, unknown>): TankstellenAustriaCardConfig =>
  normaliseConfig({ ...base, ...raw });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("normaliseConfig", () => {
  it("throws on a missing config", () => {
    expect(() => normaliseConfig(undefined as unknown as TankstellenAustriaCardConfig)).toThrow();
  });

  it("does not mutate its input", () => {
    const input = { ...base, max_stations: 9 } as TankstellenAustriaCardConfig;
    normaliseConfig(input);
    expect(input.max_stations).toBe(9);
  });

  describe("entities", () => {
    it("wraps a single string", () => {
      expect(normalise({ entities: "sensor.diesel" }).entities).toEqual(["sensor.diesel"]);
    });

    it("drops items that are not entity IDs", () => {
      expect(normalise({ entities: ["sensor.diesel", 3, "nodot", null] }).entities).toEqual([
        "sensor.diesel",
      ]);
    });

    it("drops a value of the wrong shape and warns", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(normalise({ entities: { a: 1 } })).not.toHaveProperty("entities");
      expect(warn).toHaveBeenCalledOnce();
    });
  });

  describe("max_stations", () => {
    it("clamps to 0..5 and parses strings", () => {
      expect(normalise({ max_stations: 9 }).max_stations).toBe(5);
      expect(normalise({ max_stations: -1 }).max_stations).toBe(0);
      expect(normalise({ max_stations: 0 }).max_stations).toBe(0);
      expect(normalise({ max_stations: "3" }).max_stations).toBe(3);
    });

    it("falls back to 5 on garbage and stays absent when unset", () => {
      expect(normalise({ max_stations: "many" }).max_stations).toBe(5);
      expect(normalise({})).not.toHaveProperty("max_stations");
    });
  });

  describe("payment_filter", () => {
    it("keeps only non-empty strings", () => {
      expect(normalise({ payment_filter: ["cash", "", 4, "Routex"] }).payment_filter).toEqual([
        "cash",
        "Routex",
      ]);
    });

    it("drops a non-array value", () => {
      expect(normalise({ payment_filter: "cash" })).not.toHaveProperty("payment_filter");
    });
  });

  describe("cars", () => {
    it("drops a non-array value and non-object items", () => {
      expect(normalise({ cars: "golf" })).not.toHaveProperty("cars");
      expect(normalise({ cars: [null, "golf", 3] }).cars).toEqual([]);
    });

    it("fills defaults for a bare car", () => {
      expect(normalise({ cars: [{}] }).cars).toEqual([
        { name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" },
      ]);
    });

    it("keeps valid fields and clamps the rest", () => {
      const [car] = normalise({
        cars: [
          {
            name: "x".repeat(60),
            fuel_type: "SUP",
            tank_size: "500",
            consumption: 42,
            icon: "mdi:car-sports",
          },
        ],
      }).cars!;
      expect(car).toEqual({
        name: "x".repeat(50),
        fuel_type: "SUP",
        tank_size: 200,
        consumption: 30,
        icon: "mdi:car-sports",
      });
    });

    it("replaces an unknown fuel type, a tiny tank and a non-mdi icon", () => {
      const [car] = normalise({
        cars: [{ fuel_type: "LPG", tank_size: 0, icon: "car.png" }],
      }).cars!;
      expect(car).toMatchObject({ fuel_type: "DIE", tank_size: 50, icon: "mdi:car" });
    });

    it("parses consumption from a number or a numeric string", () => {
      const cars = normalise({ cars: [{ consumption: 6.5 }, { consumption: "7.2" }] }).cars!;
      expect(cars.map((c) => c.consumption)).toEqual([6.5, 7.2]);
    });

    it("drops consumption that is negative, non-numeric or not a scalar", () => {
      const cars = normalise({
        cars: [
          { consumption: -1 },
          { consumption: "lots" },
          { consumption: { l: 6 } },
          { consumption: true },
          { consumption: null },
        ],
      }).cars!;
      for (const car of cars) expect(car).not.toHaveProperty("consumption");
    });
  });
});
