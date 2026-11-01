/**
 * @vitest-environment happy-dom
 *
 * The editor writes the grouped v2 YAML. `ha-form` is an HA element that
 * doesn't exist here, so the tests read the schema and data the editor
 * hands it, and play its `value-changed` events back.
 */

import type { LitElement } from "lit";
import { afterEach, beforeAll, describe, expect, it, vi } from "vite-plus/test";

import type { HaFormPath, HaFormSchema, HomeAssistant, TankstellenCardYaml } from "./types";

type Editor = LitElement & { hass: HomeAssistant; setConfig: (c: unknown) => void };
type Form = HTMLElement & {
  schema: ReadonlyArray<HaFormSchema>;
  data: Record<string, unknown>;
  computeLabel: (field: { name: string }, data?: unknown, options?: HaFormPath) => string;
};

beforeAll(async () => {
  await import("./editor");
});

afterEach(() => {
  document.body.replaceChildren();
});

function hass(language = "en"): HomeAssistant {
  return { language, states: {}, callWS: vi.fn(async () => []) } as unknown as HomeAssistant;
}

async function mount(config: Record<string, unknown>, language = "en") {
  const el = document.createElement("tankstellen-austria-card-editor") as Editor;
  el.hass = hass(language);
  el.setConfig({ type: "custom:tankstellen-austria-card", ...config });
  const changes: TankstellenCardYaml[] = [];
  el.addEventListener("config-changed", (e) =>
    changes.push((e as CustomEvent<{ config: TankstellenCardYaml }>).detail.config),
  );
  document.body.appendChild(el);
  await el.updateComplete;
  const form = el.shadowRoot!.querySelector("ha-form") as Form;
  return { el, form, changes };
}

function change(form: Form, value: Record<string, unknown>): void {
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value } }));
}

/** Every field with the groups it sits in, outermost first. */
function fields(schema: ReadonlyArray<HaFormSchema>, path: string[] = []) {
  const out: Array<{ name: string; path: string[]; schema: HaFormSchema }> = [];
  for (const item of schema) {
    if ("type" in item && item.type === "expandable") {
      out.push(...fields(item.schema, [...path, item.name]));
    } else {
      out.push({ name: item.name, path, schema: item });
    }
  }
  return out;
}

const ALL_ON = {
  stations: { payment_filter: ["UTA"] },
  chart: { show: true },
  cars: { show: true },
};

describe("editor schema", () => {
  it("has one unflattened expandable per group", async () => {
    const { form } = await mount({});
    const groups = form.schema.filter((s) => "type" in s);
    expect(groups.map((g) => g.name)).toEqual(["stations", "header", "chart", "cars", "footer"]);
    expect(groups.every((g) => !("flatten" in g) || !g.flatten)).toBe(true);
  });

  it("gives every toggle its default, so an unset key draws what the card does", async () => {
    const { form } = await mount(ALL_ON);
    const toggles = fields(form.schema).filter(
      (f) => "selector" in f.schema && "boolean" in f.schema.selector,
    );
    expect(toggles.length).toBeGreaterThan(10);
    expect(
      toggles.filter((t) => typeof (t.schema as { default?: unknown }).default !== "boolean"),
    ).toEqual([]);
  });

  it("hides the sub-options of a group that is off", async () => {
    const { form } = await mount({
      chart: { show: false },
      header: { show: false },
      footer: { show: false },
    });
    const names = fields(form.schema).map((f) => `${f.path.join(".")}.${f.name}`);
    expect(names).toContain("chart.show");
    expect(names).not.toContain("chart.best_refuel");
    expect(names).not.toContain("header.price");
    expect(names).not.toContain("cars.fill_up");
    expect(names).toContain("footer.show");
    expect(names).not.toContain("footer.adaptive_logo");
  });

  it("gives every section an icon", async () => {
    const { form } = await mount({});
    const sections = form.schema.filter((s) => "type" in s && s.type === "expandable");
    expect(sections.map((s) => ("icon" in s ? s.icon : undefined))).toEqual([
      expect.stringMatching(/^mdi:/),
      expect.stringMatching(/^mdi:/),
      expect.stringMatching(/^mdi:/),
      expect.stringMatching(/^mdi:/),
      expect.stringMatching(/^mdi:/),
    ]);
  });

  it.each(["en", "de"])("has a %s label for every field and option", async (language) => {
    const { form } = await mount(ALL_ON, language);
    const missing: string[] = [];
    for (const f of fields(form.schema)) {
      const label = form.computeLabel({ name: f.name }, form.data, { path: f.path });
      if (label === f.name || label.startsWith("editor.")) missing.push(f.name);
      if ("selector" in f.schema && "select" in f.schema.selector) {
        for (const o of f.schema.selector.select.options) {
          if (o.label.startsWith("editor.")) missing.push(`${f.name}=${o.value}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("labels the same field name by its group", async () => {
    const { form } = await mount({});
    const label = (group: string) => form.computeLabel({ name: "show" }, {}, { path: [group] });
    expect(label("header")).toBe("Show header");
    expect(label("footer")).toBe("Show attribution");
  });
});

describe("editor output", () => {
  it("rewrites a v1 config into groups on the first change", async () => {
    const { form, changes } = await mount({ max_stations: 3, hide_header: true, show_cars: true });
    expect(form.data.stations).toMatchObject({ count: 3 });
    change(form, { ...form.data, chart: { show: false } });
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
    const { form, changes } = await mount({});
    expect(form.data.stations).toEqual({
      count: 5,
      sort: "price",
      tile_shape: "square",
      map_provider: "auto",
      payment_mode: "filter",
    });
    change(form, { ...form.data, header: { price: false } });
    expect(changes[0]).toEqual({
      type: "custom:tankstellen-austria-card",
      header: { price: false },
    });
  });

  it("drops an option set back to its default, and the group it leaves empty", async () => {
    const { form, changes } = await mount({ chart: { min_max: false } });
    change(form, { ...form.data, header: { price: false } });
    change(form, { ...form.data, header: { price: true }, chart: { min_max: true } });
    expect(changes.at(-1)).toEqual({ type: "custom:tankstellen-austria-card" });
  });

  it("keeps a select that differs from its default", async () => {
    const { form, changes } = await mount({});
    const stations = form.data.stations as Record<string, unknown>;
    change(form, { ...form.data, stations: { ...stations, sort: "distance" } });
    expect(changes[0]?.stations).toEqual({ sort: "distance" });
  });

  it("adds a car under cars.items", async () => {
    const { el, changes } = await mount({ cars: { show: true } });
    el.shadowRoot!.querySelector<HTMLButtonElement>(".car-add-btn")!.click();
    expect(changes[0]?.cars).toEqual({
      show: true,
      items: [{ name: "", fuel_type: "DIE", tank_size: 50, icon: "mdi:car" }],
    });
  });
});
