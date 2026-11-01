/**
 * @vitest-environment happy-dom
 *
 * The manual refresh on a dynamic-mode card: the button that asks HA to
 * update every tracked sensor, the two-minute cooldown that keeps a user
 * from hammering E-Control through it, the countdown it shows meanwhile,
 * and the "No new data" chip when the update brought nothing new.
 */

import type { LitElement } from "lit";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import { DYNAMIC_MANUAL_COOLDOWN_MS, HISTORY_REFRESH_MS, POST_REFRESH_CHECK_MS } from "./const";
import type { HomeAssistant } from "./types";

type Card = LitElement & { hass: HomeAssistant; setConfig: (c: unknown) => void };

const IDS = ["sensor.tankstellen_diesel", "sensor.tankstellen_super"];
const STAMP = "2026-11-01T10:00:00+00:00";

function sensor(entityId: string, lastUpdated: string) {
  return {
    entity_id: entityId,
    state: "1.539",
    last_updated: lastUpdated,
    attributes: {
      fuel_type: entityId.endsWith("diesel") ? "DIE" : "SUP",
      dynamic_mode: true,
      stations: [{ name: "Teststation", price: 1.539, open: true }],
      attribution: "Datenquelle: E-Control",
    },
  };
}

function hass(callService = vi.fn(async () => undefined), lastUpdated = STAMP): HomeAssistant {
  return {
    language: "en",
    states: Object.fromEntries(IDS.map((id) => [id, sensor(id, lastUpdated)])),
    callWS: vi.fn(async () => []),
    callService,
  } as unknown as HomeAssistant;
}

let reduceMotion = false;

beforeAll(async () => {
  await import("./tankstellen-austria-card");
});

beforeEach(() => {
  vi.useFakeTimers({ now: new Date("2026-11-01T12:00:00Z") });
  reduceMotion = false;
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) => ({ matches: reduceMotion && query.includes("reduce") }) as MediaQueryList,
  );
});

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

async function mount(h: HomeAssistant): Promise<Card> {
  const el = document.createElement("tankstellen-austria-card") as Card;
  el.setConfig({ type: "x", entities: IDS });
  el.hass = h;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const button = (el: Card) => el.shadowRoot!.querySelector<HTMLButtonElement>("button.btn-primary")!;
const label = (el: Card) => button(el).textContent?.trim();
const updateCalls = (fn: ReturnType<typeof vi.fn>) =>
  fn.mock.calls.filter((c) => c[0] === "homeassistant" && c[1] === "update_entity");

async function advance(el: Card, ms: number): Promise<void> {
  await vi.advanceTimersByTimeAsync(ms);
  await el.updateComplete;
}

describe("manual refresh", () => {
  it("asks HA to update every tracked sensor", async () => {
    const callService = vi.fn(async () => undefined);
    const el = await mount(hass(callService));
    button(el).click();
    expect(updateCalls(callService).map((c) => c[2])).toEqual(
      IDS.map((entity_id) => ({ entity_id })),
    );
  });

  it("ignores clicks during the cooldown and accepts one after it", async () => {
    const callService = vi.fn(async () => undefined);
    const el = await mount(hass(callService));
    button(el).click();
    await advance(el, DYNAMIC_MANUAL_COOLDOWN_MS - 1000);
    button(el).click();
    expect(updateCalls(callService)).toHaveLength(IDS.length);
    await advance(el, 1000);
    button(el).click();
    expect(updateCalls(callService)).toHaveLength(2 * IDS.length);
  });

  it("counts the cooldown down every second, then shows the label again", async () => {
    const el = await mount(hass());
    expect(label(el)).toBe("Refresh");
    button(el).click();
    await el.updateComplete;
    expect(label(el)).toBe("2:00");
    expect(button(el).getAttribute("aria-disabled")).toBe("true");
    await advance(el, 1000);
    expect(label(el)).toBe("1:59");
    await advance(el, DYNAMIC_MANUAL_COOLDOWN_MS);
    expect(label(el)).toBe("Refresh");
    expect(button(el).getAttribute("aria-disabled")).toBe("false");
  });

  it("with reduced motion, wakes once at the end instead of ticking", async () => {
    reduceMotion = true;
    const el = await mount(hass());
    button(el).click();
    await advance(el, 1000);
    // No per-second re-render: the countdown stays where it was drawn.
    expect(label(el)).toBe("2:00");
    await advance(el, DYNAMIC_MANUAL_COOLDOWN_MS);
    expect(label(el)).toBe("Refresh");
  });

  it("says so when the update brought no new data", async () => {
    const el = await mount(hass());
    button(el).click();
    await advance(el, POST_REFRESH_CHECK_MS);
    expect(el.shadowRoot!.textContent).toContain("No new data");
  });

  it("stays quiet when the sensor did update", async () => {
    const el = await mount(hass());
    button(el).click();
    el.hass = hass(undefined, "2026-11-01T12:00:05+00:00");
    await advance(el, POST_REFRESH_CHECK_MS);
    expect(el.shadowRoot!.textContent).not.toContain("No new data");
  });

  it("logs a failed update_entity instead of leaving the rejection unhandled", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const el = await mount(hass(vi.fn(async () => Promise.reject(new Error("boom")))));
    button(el).click();
    await advance(el, 0);
    expect(warn).toHaveBeenCalledWith(
      "[Tankstellen Austria] update_entity failed for",
      IDS[0],
      expect.any(Error),
    );
  });

  it("cancels its timers when the card leaves the page", async () => {
    const el = await mount(hass());
    button(el).click();
    el.remove();
    await advance(el, POST_REFRESH_CHECK_MS);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("history polling", () => {
  const historyCalls = (h: HomeAssistant) =>
    (h.callWS as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c) => (c[0] as { type: string }).type === "history/history_during_period",
    ).length;

  it("stops for good once the card is removed", async () => {
    const h = hass();
    const el = await mount(h);
    el.remove();
    // Lets the first fetch land on the detached card.
    await advance(el, 0);
    const before = historyCalls(h);
    await advance(el, 2 * HISTORY_REFRESH_MS);
    expect(historyCalls(h)).toBe(before);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("starts again when the card comes back", async () => {
    const h = hass();
    const el = await mount(h);
    el.remove();
    await advance(el, 0);
    document.body.appendChild(el);
    await el.updateComplete;
    const before = historyCalls(h);
    await advance(el, HISTORY_REFRESH_MS);
    expect(historyCalls(h)).toBeGreaterThan(before);
  });
});
