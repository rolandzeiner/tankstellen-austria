/**
 * @vitest-environment happy-dom
 *
 * Component-level smoke coverage for the card and its editor.
 *
 * Two jobs, neither of which a green build proves on its own:
 *
 * 1. **The decorator check.** The build and this suite both read
 *    `experimentalDecorators` / `useDefineForClassFields` out of
 *    tsconfig.json and lower Lit's legacy decorators from it. If that ever
 *    regresses, plain class fields overwrite Lit's generated accessors,
 *    reactivity dies silently, and the build still succeeds. Reading
 *    `elementProperties` back off each constructor is what catches it.
 *
 * 2. **Render-path coverage.** The card entrypoint is the largest file in
 *    the tree and no other test imports it.
 *
 * `ha-card`, `ha-icon` and friends are HA-provided elements that do not
 * exist here. happy-dom renders them as inert containers, which is fine:
 * this suite asserts that rendering completes and produces the expected
 * content, not that HA's own components behave.
 */

import type { LitElement } from "lit";
import { afterEach, beforeAll, describe, expect, it, vi } from "vite-plus/test";

import type { HomeAssistant, Station, TankstellenAustriaCardConfig } from "./types";

type Card = LitElement & {
  hass: HomeAssistant;
  setConfig: (c: unknown) => void;
  getCardSize: () => number;
  getGridOptions: () => { columns: number | "full"; rows: number | "auto" };
};

type Editor = LitElement & {
  hass: HomeAssistant;
  setConfig: (c: TankstellenAustriaCardConfig) => void;
};

beforeAll(async () => {
  await import("./tankstellen-austria-card");
});

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

const STATIONS: Station[] = [
  {
    name: "Teststation Nord",
    price: 1.539,
    open: true,
    distance_m: 1200,
    location: { address: "Teststraße 1", postalCode: "1010", city: "Wien" },
    opening_hours: [{ day: "MO", from: "06:00", to: "22:00" }],
    payment_methods: { cash: true, debit_card: true, others: ["Routex"] },
  },
  {
    name: "Teststation Süd",
    price: 1.589,
    open: true,
    distance_m: 400,
    location: { address: "Testgasse 2", postalCode: "1100", city: "Wien" },
  },
];

function hass(overrides: Partial<HomeAssistant> = {}): HomeAssistant {
  return {
    language: "en",
    states: {
      "sensor.tankstellen_diesel": {
        entity_id: "sensor.tankstellen_diesel",
        state: "1.539",
        last_updated: "2026-10-21T10:00:00+00:00",
        attributes: {
          friendly_name: "Diesel",
          fuel_type: "DIE",
          stations: STATIONS,
          attribution: "Datenquelle: E-Control",
        },
      },
      "light.kitchen": {
        entity_id: "light.kitchen",
        state: "on",
        attributes: {},
      },
    },
    callWS: vi.fn(async () => []),
    callService: vi.fn(async () => undefined),
    ...overrides,
  } as unknown as HomeAssistant;
}

async function mount<T extends LitElement>(tag: string, setup: (el: T) => void): Promise<T> {
  const el = document.createElement(tag) as T;
  setup(el);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const text = (el: LitElement): string => el.shadowRoot?.textContent ?? "";

describe("custom element registration", () => {
  it.each(["tankstellen-austria-card", "tankstellen-austria-card-editor"])(
    "registers %s",
    (tag) => {
      expect(customElements.get(tag)).toBeTypeOf("function");
    },
  );

  it("advertises the card to the Lovelace picker", () => {
    const cards = (window as unknown as { customCards?: Array<{ type: string }> }).customCards;
    expect((cards ?? []).map((c) => c.type)).toContain("tankstellen-austria-card");
  });
});

describe("Lit reactive properties survive decorator lowering", () => {
  it.each([
    ["tankstellen-austria-card", ["hass", "_config", "_activeTab"]],
    ["tankstellen-austria-card-editor", ["hass"]],
  ])("%s declares %j", (tag, expected) => {
    const ctor = customElements.get(tag) as unknown as {
      elementProperties?: Map<string | symbol, unknown>;
    };
    const props = [...(ctor.elementProperties?.keys() ?? [])].map(String);
    for (const name of expected) expect(props).toContain(name);
  });
});

describe("tankstellen-austria-card", () => {
  it("rejects a config that is not an object, or entities of the wrong shape", () => {
    const el = document.createElement("tankstellen-austria-card") as Card;
    expect(() => el.setConfig(null)).toThrow();
    expect(() => el.setConfig([])).toThrow();
    expect(() => el.setConfig({ type: "x", entities: 42 })).toThrow();
  });

  it("fills its grid cell", () => {
    const el = document.createElement("tankstellen-austria-card") as Card;
    expect(el.getGridOptions()).toMatchObject({ columns: 12, rows: "auto" });
    expect(el.getCardSize()).toBeGreaterThan(0);
  });

  it("shows the loading state before hass arrives", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => e.setConfig({ type: "x" }));
    expect(el.shadowRoot?.querySelector(".empty")).not.toBeNull();
  });

  it("auto-discovers its sensors and renders their stations", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x" });
      e.hass = hass();
    });
    expect(text(el)).toContain("Teststation Nord");
    expect(text(el)).toContain("Teststation Süd");
  });

  it("keeps the E-Control attribution in the footer", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x" });
      e.hass = hass();
    });
    expect(text(el)).toContain("E-Control");
  });

  it("lists the nearest station first with sort_by_distance", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x", sort_by_distance: true });
      e.hass = hass();
    });
    const t = text(el);
    expect(t.indexOf("Teststation Süd")).toBeLessThan(t.indexOf("Teststation Nord"));
  });

  it("shows the no-data state when no sensor is found", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x", entities: ["sensor.missing"] });
      e.hass = hass();
    });
    expect(el.shadowRoot?.querySelector(".empty")).not.toBeNull();
  });

  it("re-renders for a tracked sensor and ignores unrelated state changes", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x", entities: ["sensor.tankstellen_diesel"] });
      e.hass = hass();
    });
    // The first render kicks off the history fetch and the version probe;
    // let both land (each may re-render once) before counting renders.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    const render = vi.spyOn(el as unknown as { render: () => unknown }, "render");

    const unrelated = hass();
    unrelated.states = {
      ...el.hass.states,
      "light.kitchen": { ...el.hass.states["light.kitchen"]!, state: "off" },
    };
    el.hass = unrelated;
    await el.updateComplete;
    expect(render).not.toHaveBeenCalled();

    const tracked = hass();
    tracked.states = {
      ...el.hass.states,
      "sensor.tankstellen_diesel": {
        ...el.hass.states["sensor.tankstellen_diesel"]!,
        state: "1.499",
      },
    };
    el.hass = tracked;
    await el.updateComplete;
    expect(render).toHaveBeenCalledOnce();
  });

  it("renders a car row with its fill-up cost when cars are configured", async () => {
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({
        type: "x",
        show_cars: true,
        cars: [{ name: "Golf", fuel_type: "DIE", tank_size: 50, consumption: 6 }],
      });
      e.hass = hass();
    });
    expect(text(el)).toContain("Golf");
  });

  it("draws the sparkline once history arrives", async () => {
    // Hourly prices over the last week, in the minimal-response shape.
    const now = Date.now() / 1000;
    const points = Array.from({ length: 24 * 7 }, (_, i) => ({
      lu: now - (24 * 7 - i) * 3600,
      s: (1.5 + 0.05 * Math.sin(i / 4)).toFixed(3),
    }));
    const callWS = vi.fn(async (msg: { type: string; entity_ids?: string[] }) =>
      msg.type === "history/history_during_period" ? { [msg.entity_ids?.[0] ?? ""]: points } : {},
    );
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x", entities: ["sensor.tankstellen_sparkline"] });
      const h = hass({ callWS } as unknown as Partial<HomeAssistant>);
      h.states["sensor.tankstellen_sparkline"] = {
        ...h.states["sensor.tankstellen_diesel"]!,
        entity_id: "sensor.tankstellen_sparkline",
      };
      e.hass = h;
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await el.updateComplete;
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({ type: "history/history_during_period" }),
    );
    expect(el.shadowRoot?.querySelector("svg.sparkline path")).not.toBeNull();
  });

  it("survives a station payload missing optional fields", async () => {
    const bare = hass();
    bare.states["sensor.tankstellen_diesel"]!.attributes = {
      fuel_type: "DIE",
      stations: [{ name: "Bare" }],
    };
    const el = await mount<Card>("tankstellen-austria-card", (e) => {
      e.setConfig({ type: "x" });
      e.hass = bare;
    });
    expect(text(el)).toContain("Bare");
  });
});

describe("tankstellen-austria-card-editor", () => {
  it("renders with a config and hass", async () => {
    const el = await mount<Editor>("tankstellen-austria-card-editor", (e) => {
      e.hass = hass();
      e.setConfig({ type: "custom:tankstellen-austria-card" });
    });
    expect(el.shadowRoot?.childElementCount).toBeGreaterThan(0);
  });
});
