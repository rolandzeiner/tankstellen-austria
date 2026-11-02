/**
 * @vitest-environment happy-dom
 *
 * The editor writes the grouped v2 YAML. `ha-form` and
 * `ha-expansion-panel` are HA elements that don't exist here, so the tests
 * open a panel by firing the event it fires, read the schema and data the
 * editor hands each form, and play its `value-changed` events back.
 */

import type { LitElement } from "lit";
import { afterEach, beforeAll, describe, expect, it, vi } from "vite-plus/test";

import type { HaFormSchema, HomeAssistant, TankstellenCardYaml } from "./types";

type Editor = LitElement & { hass: HomeAssistant; setConfig: (c: unknown) => void };
type Form = HTMLElement & {
  schema: ReadonlyArray<HaFormSchema>;
  data: Record<string, unknown>;
  computeLabel: (field: { name: string }) => string;
};
type Panel = HTMLElement & { header: string; secondary: string };

const GROUPS = ["stations", "header", "chart", "cars", "footer"] as const;

beforeAll(async () => {
  await import("./editor");
});

afterEach(() => {
  document.body.replaceChildren();
});

function hass(language = "en", states: Record<string, unknown> = {}): HomeAssistant {
  return { language, states, callWS: vi.fn(async () => []) } as unknown as HomeAssistant;
}

async function mount(
  config: Record<string, unknown>,
  { language = "en", states = {} }: { language?: string; states?: Record<string, unknown> } = {},
) {
  const el = document.createElement("tankstellen-austria-card-editor") as Editor;
  el.hass = hass(language, states);
  el.setConfig({ type: "custom:tankstellen-austria-card", ...config });
  const changes: TankstellenCardYaml[] = [];
  el.addEventListener("config-changed", (e) =>
    changes.push((e as CustomEvent<{ config: TankstellenCardYaml }>).detail.config),
  );
  document.body.appendChild(el);
  await el.updateComplete;
  return { el, changes };
}

const $ = <T extends Element>(el: Editor, selector: string): T | null =>
  el.shadowRoot!.querySelector<T>(selector);

const panel = (el: Editor, group: string): Panel => $<Panel>(el, `[data-group="${group}"]`)!;

/** Open a panel the way HA's does, and return its form. */
async function open(el: Editor, group: string, expanded = true): Promise<Form> {
  panel(el, group).dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded } }));
  await el.updateComplete;
  return $<Form>(el, `ha-form[data-form="${group}"]`)!;
}

async function change(el: Editor, form: Form, value: Record<string, unknown>): Promise<void> {
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value } }));
  await el.updateComplete;
}

const names = (form: Form): string[] => form.schema.map((f) => f.name);

const ALL_ON = {
  stations: { payment_filter: ["UTA"] },
  chart: { show: true },
  cars: { show: true, items: [{ name: "Golf", fuel_type: "DIE", tank_size: 50 }] },
};

describe("editor layout", () => {
  it("has one panel per group, each with an icon", async () => {
    const { el } = await mount({});
    const panels = [...el.shadowRoot!.querySelectorAll<Panel>("ha-expansion-panel")];
    expect(panels.map((p) => p.dataset.group)).toEqual([...GROUPS]);
    for (const p of panels) {
      expect(p.querySelector('ha-icon[slot="leading-icon"]')?.getAttribute("icon")).toMatch(
        /^mdi:/,
      );
    }
  });

  it("builds a panel's body only while it is open", async () => {
    const { el } = await mount({});
    expect($(el, 'ha-form[data-form="stations"]')).toBeNull();
    expect(await open(el, "stations")).not.toBeNull();
    expect(await open(el, "stations", false)).toBeNull();
  });

  it("keeps the sensor picker outside the panels", async () => {
    const { el } = await mount({});
    const form = $<Form>(el, 'ha-form[data-form="entities"]')!;
    expect(names(form)).toEqual(["entities"]);
    expect(form.closest("ha-expansion-panel")).toBeNull();
  });

  it("says in each panel's summary what the group is set to", async () => {
    const summary = async (config: Record<string, unknown>) => {
      const { el } = await mount(config);
      return Object.fromEntries(GROUPS.map((g) => [g, panel(el, g).secondary]));
    };
    expect(await summary({})).toEqual({
      stations: "Up to 5 stations · Cheapest first",
      header: "With prices",
      chart: "Refuel tip · Min/max",
      cars: "Hidden",
      footer: "Shown",
    });
    expect(
      await summary({
        stations: { count: 1, sort: "distance", payment_filter: ["UTA", "DKV"] },
        header: { price: false },
        chart: { show: false },
        cars: { show: true, items: [{}, {}] },
        footer: { show: false },
      }),
    ).toEqual({
      stations: "1 station · Nearest first · Only UTA, DKV",
      header: "Title only",
      chart: "Hidden",
      cars: "2 cars",
      footer: "Hidden",
    });
  });
});

describe("editor schema", () => {
  it("gives every toggle its default, so an unset key draws what the card does", async () => {
    const { el } = await mount(ALL_ON);
    const toggles: HaFormSchema[] = [];
    for (const g of GROUPS) {
      const form = await open(el, g);
      toggles.push(...form.schema.filter((f) => "selector" in f && "boolean" in f.selector));
    }
    expect(toggles.length).toBeGreaterThan(10);
    expect(
      toggles.filter((t) => typeof (t as { default?: unknown }).default !== "boolean"),
    ).toEqual([]);
  });

  it("hides the sub-options of a group that is off", async () => {
    const { el } = await mount({
      chart: { show: false },
      header: { show: false },
      footer: { show: false },
    });
    expect(names(await open(el, "chart"))).toEqual(["show"]);
    expect(names(await open(el, "header"))).toEqual(["show"]);
    expect(names(await open(el, "cars"))).toEqual(["show"]);
    expect(names(await open(el, "footer"))).toEqual(["show"]);
  });

  it("offers the payment methods the sensors report, and the typed ones", async () => {
    const states = {
      "sensor.diesel": {
        attributes: { stations: [{ payment_methods: { others: ["Routex", "UTA"] } }] },
      },
    };
    const { el } = await mount(
      { entities: ["sensor.diesel"], stations: { payment_filter: ["Fleetcard"] } },
      { states },
    );
    const field = (await open(el, "stations")).schema.find((f) => f.name === "payment_filter")!;
    expect("selector" in field && field.selector).toMatchObject({
      select: { multiple: true, custom_value: true },
    });
    const options =
      "selector" in field && "select" in field.selector ? field.selector.select.options : [];
    expect(options.map((o) => o.value)).toEqual([
      "cash",
      "debit_card",
      "credit_card",
      "Routex",
      "UTA",
      "Fleetcard",
    ]);
  });

  it.each(["en", "de"])("has a %s label for every field and option", async (language) => {
    const { el } = await mount(ALL_ON, { language });
    const forms = [$<Form>(el, 'ha-form[data-form="entities"]')!];
    for (const g of GROUPS) forms.push(await open(el, g));
    el.shadowRoot!.querySelector<HTMLButtonElement>(".car-toggle")!.click();
    await el.updateComplete;
    forms.push($<Form>(el, 'ha-form[data-form="car"]')!);
    const missing: string[] = [];
    for (const form of forms) {
      for (const f of form.schema) {
        const label = form.computeLabel({ name: f.name });
        if (label === f.name || label.startsWith("editor.")) missing.push(f.name);
        if ("selector" in f && "select" in f.selector) {
          for (const o of f.selector.select.options) {
            if (o.label.startsWith("editor.") || o.label.startsWith("card.")) {
              missing.push(`${f.name}=${o.value}`);
            }
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("labels the same field name by its group", async () => {
    const { el } = await mount({});
    expect((await open(el, "header")).computeLabel({ name: "show" })).toBe("Show header");
    expect((await open(el, "footer")).computeLabel({ name: "show" })).toBe("Show attribution");
  });
});

describe("editor output", () => {
  it("rewrites a v1 config into groups on the first change", async () => {
    const { el, changes } = await mount({ max_stations: 3, hide_header: true, show_cars: true });
    expect((await open(el, "stations")).data).toMatchObject({ count: 3 });
    const chart = await open(el, "chart");
    await change(el, chart, { ...chart.data, show: false });
    expect(changes).toEqual([
      {
        type: "custom:tankstellen-austria-card",
        stations: { count: 3 },
        header: { show: false },
        cars: { show: true },
        chart: { show: false },
      },
    ]);
  });

  it("fills the select defaults in for display and leaves them out of the YAML", async () => {
    const { el, changes } = await mount({});
    const stations = await open(el, "stations");
    expect(stations.data).toEqual({
      count: 5,
      sort: "price",
      tile_shape: "square",
      map_provider: "auto",
      payment_mode: "filter",
    });
    await change(el, stations, { ...stations.data, distance: true });
    expect(changes[0]).toEqual({
      type: "custom:tankstellen-austria-card",
      stations: { distance: true },
    });
  });

  it("drops an option set back to its default, and the group it leaves empty", async () => {
    const { el, changes } = await mount({ chart: { min_max: false } });
    const header = await open(el, "header");
    await change(el, header, { price: false });
    await change(el, header, { price: true });
    const chart = await open(el, "chart");
    await change(el, chart, { ...chart.data, min_max: true });
    expect(changes.at(-1)).toEqual({ type: "custom:tankstellen-austria-card" });
  });

  it("makes rank and brand either-or, and lets both be off", async () => {
    const { el, changes } = await mount({});
    let stations = await open(el, "stations");
    expect(names(stations)).toEqual(expect.arrayContaining(["index", "brand", "tile_shape"]));
    await change(el, stations, { ...stations.data, brand: true });
    expect(changes.at(-1)?.stations).toEqual({ index: false, brand: true });
    stations = await open(el, "stations");
    await change(el, stations, { ...stations.data, index: true });
    expect(changes.at(-1)).toEqual({ type: "custom:tankstellen-austria-card" });
    stations = await open(el, "stations");
    await change(el, stations, { ...stations.data, index: false });
    expect(changes.at(-1)?.stations).toEqual({ index: false });
    // With neither tile there is no shape to pick.
    expect(names(await open(el, "stations"))).not.toContain("tile_shape");
  });

  it("keeps a select that differs from its default", async () => {
    const { el, changes } = await mount({});
    const stations = await open(el, "stations");
    await change(el, stations, { ...stations.data, sort: "distance" });
    expect(changes[0]?.stations).toEqual({ sort: "distance" });
  });

  it("cleans typed payment methods and drops an empty filter", async () => {
    const { el, changes } = await mount({});
    const stations = await open(el, "stations");
    await change(el, stations, {
      ...stations.data,
      payment_filter: [" Routex ", "UTA", "UTA", ""],
    });
    expect(changes.at(-1)?.stations).toEqual({ payment_filter: ["Routex", "UTA"] });
    await change(el, stations, { ...stations.data, payment_filter: [] });
    expect(changes.at(-1)).toEqual({ type: "custom:tankstellen-austria-card" });
  });

  it("keeps the cars when the Cars form changes", async () => {
    const items = [{ name: "Golf", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" }];
    const { el, changes } = await mount({ cars: { show: true, items } });
    const cars = await open(el, "cars");
    await change(el, cars, { ...cars.data, fill_up: false });
    expect(changes.at(-1)?.cars).toEqual({ show: true, fill_up: false, items });
  });

  it("adds a car and opens it", async () => {
    const { el, changes } = await mount({ cars: { show: true } });
    await open(el, "cars");
    $<HTMLElement>(el, ".car-add")!.click();
    await el.updateComplete;
    expect(changes[0]?.cars).toEqual({
      show: true,
      items: [{ name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" }],
    });
    expect($(el, 'ha-form[data-form="car"]')).not.toBeNull();
    expect($(el, ".car-toggle")?.getAttribute("aria-expanded")).toBe("true");
  });

  it("cleans a car's fields on save", async () => {
    const { el, changes } = await mount({
      cars: { show: true, items: [{ name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" }] },
    });
    await open(el, "cars");
    $<HTMLButtonElement>(el, ".car-toggle")!.click();
    await el.updateComplete;
    const car = $<Form>(el, 'ha-form[data-form="car"]')!;
    await change(el, car, {
      ...car.data,
      name: " Golf <TDI> ",
      fuel_type: "SUP",
      tank_size: 500,
      consumption: 6.54,
      icon: "",
    });
    expect(changes.at(-1)?.cars?.items).toEqual([
      { name: "Golf TDI", fuel_type: "SUP", tank_size: 200, consumption: 6.5, icon: "mdi:car" },
    ]);
  });

  it("moves and deletes cars", async () => {
    const a = { name: "A", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" };
    const b = { name: "B", fuel_type: "SUP", tank_size: 40, icon: "mdi:car" };
    const { el, changes } = await mount({ cars: { show: true, items: [a, b] } });
    await open(el, "cars");
    const buttons = () => [
      ...el.shadowRoot!.querySelectorAll<HTMLElement>(".car-head ha-icon-button"),
    ];
    // Each row: move up, move down, delete.
    buttons()[1]!.click();
    await el.updateComplete;
    expect(changes.at(-1)?.cars?.items).toEqual([b, a]);
    buttons()[2]!.click();
    await el.updateComplete;
    expect(changes.at(-1)?.cars?.items).toEqual([a]);
  });

  it("removes the sensors key when the last sensor goes", async () => {
    const { el, changes } = await mount({ entities: ["sensor.diesel"] });
    const form = $<Form>(el, 'ha-form[data-form="entities"]')!;
    await change(el, form, { entities: [] });
    expect(changes.at(-1)).toEqual({ type: "custom:tankstellen-austria-card" });
  });

  it("saves only the tab labels that differ from the default", async () => {
    const states = {
      "sensor.diesel": { attributes: { fuel_type: "DIE" } },
      "sensor.super": { attributes: { fuel_type: "SUP" } },
    };
    const { el, changes } = await mount(
      { entities: ["sensor.diesel", "sensor.super"] },
      { states },
    );
    const form = $<Form>(el, 'ha-form[data-form="tab_labels"]')!;
    expect(names(form)).toEqual(["sensor.diesel", "sensor.super"]);
    expect(form.computeLabel({ name: "sensor.diesel" })).toBe("Diesel");
    await change(el, form, { "sensor.diesel": " Mein Diesel ", "sensor.super": "" });
    expect(changes.at(-1)?.tab_labels).toEqual({ "sensor.diesel": "Mein Diesel" });
  });
});
