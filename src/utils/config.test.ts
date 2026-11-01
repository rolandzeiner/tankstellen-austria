import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import type { TankstellenAustriaCardConfig } from "../types";
import { fromGrouped, normaliseConfig, toGrouped } from "./config";

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
    expect(() => normaliseConfig(undefined as unknown as TankstellenAustriaCardConfig)).toThrow(
      "config missing",
    );
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

// Every v1 flat key, set away from its default where it has one.
const V1 = {
  type: "custom:tankstellen-austria-card",
  entities: ["sensor.diesel"],
  tab_labels: { "sensor.diesel": "D" },
  grid_options: { rows: 6 },
  max_stations: 3,
  sort_by_distance: true,
  show_index: false,
  show_distance: true,
  show_opening_hours: false,
  show_payment_methods: false,
  show_map_links: false,
  map_provider: "apple",
  payment_filter: ["UTA"],
  payment_highlight_mode: true,
  hide_header: true,
  hide_header_price: true,
  show_history: false,
  show_best_refuel: false,
  show_median_line: true,
  show_hour_envelope: true,
  show_noon_markers: true,
  show_minmax: false,
  show_cars: true,
  show_car_fillup: false,
  show_car_consumption: false,
  cars: [{ name: "Golf", fuel_type: "DIE", tank_size: 50 }],
  hide_attribution: true,
  logo_adapt_to_theme: true,
};

describe("toGrouped", () => {
  it("moves every v1 key into its group", () => {
    expect(toGrouped(V1)).toEqual({
      type: "custom:tankstellen-austria-card",
      entities: ["sensor.diesel"],
      tab_labels: { "sensor.diesel": "D" },
      grid_options: { rows: 6 },
      stations: {
        count: 3,
        sort: "distance",
        index: false,
        distance: true,
        opening_hours: false,
        payment_methods: false,
        map_links: false,
        map_provider: "apple",
        payment_filter: ["UTA"],
        payment_mode: "highlight",
      },
      header: { show: false, price: false },
      chart: {
        show: false,
        best_refuel: false,
        median_line: true,
        hour_envelope: true,
        noon_markers: true,
        min_max: false,
      },
      cars: {
        show: true,
        fill_up: false,
        consumption: false,
        items: [{ name: "Golf", fuel_type: "DIE", tank_size: 50 }],
      },
      footer: { show: false, adaptive_logo: true },
    });
  });

  it("maps the two-valued keys both ways", () => {
    expect(toGrouped({ ...base, sort_by_distance: false }).stations).toEqual({ sort: "price" });
    expect(toGrouped({ ...base, payment_highlight_mode: false }).stations).toEqual({
      payment_mode: "filter",
    });
    expect(toGrouped({ ...base, hide_header: false }).header).toEqual({ show: true });
  });

  it("leaves a grouped config as it is", () => {
    const grouped = toGrouped(V1);
    expect(toGrouped(grouped)).toEqual(grouped);
  });

  it("lets a grouped value win over a leftover flat key", () => {
    const mixed = { ...base, show_index: false, stations: { index: true } };
    expect(toGrouped(mixed)).toEqual({ ...base, stations: { index: true } });
  });

  it("adds no empty groups and keeps keys it doesn't know", () => {
    expect(toGrouped({ ...base, view_layout: { position: "main" } })).toEqual({
      ...base,
      view_layout: { position: "main" },
    });
  });

  it("drops a group that isn't an object", () => {
    expect(toGrouped({ ...base, chart: "yes", header: ["x"] })).toEqual(base);
  });
});

describe("fromGrouped", () => {
  it("reads every group back into the v1 keys", () => {
    expect(fromGrouped(toGrouped(V1))).toEqual(V1);
  });

  it("keeps unset keys unset, so the card's defaults apply", () => {
    expect(fromGrouped({ ...base, stations: {}, chart: { show: true } })).toEqual({
      ...base,
      show_history: true,
    });
  });

  it("ignores a group that isn't an object", () => {
    expect(fromGrouped({ ...base, cars: [] as never })).toEqual(base);
  });
});
