/**
 * @vitest-environment happy-dom
 *
 * The chart element's hover tooltip: the time it shows follows the zone and
 * the profile's 12/24-hour setting, and an unknown zone falls back to the
 * browser's locale and zone instead of throwing in render.
 */

import type { LitElement } from "lit";
import { afterEach, beforeAll, describe, expect, it } from "vite-plus/test";

import type { HistoryPoint } from "./history";

type Sparkline = LitElement & {
  points: HistoryPoint[];
  timeZone: string;
  language: string;
  hour12: boolean;
};

// Hourly points over the last week, so the chart has geometry to hover. The
// chart keeps only the last seven days by the real clock, so the points are
// placed relative to the current hour: a fixed date drew an empty chart, and
// failed every test here, from a week after it was written.
const NOW = Math.floor(Date.now() / 3_600_000) * 3_600_000;
const POINTS: HistoryPoint[] = Array.from({ length: 24 * 7 }, (_, i) => ({
  time: NOW - (24 * 7 - i) * 3_600_000,
  value: 1.5 + 0.05 * Math.sin(i / 4),
}));

beforeAll(async () => {
  await import("./sparkline-element");
});

afterEach(() => {
  document.body.replaceChildren();
});

async function hovered(setup: (el: Sparkline) => void): Promise<string> {
  const el = document.createElement("tankstellen-austria-sparkline") as Sparkline;
  el.points = POINTS;
  setup(el);
  document.body.appendChild(el);
  await el.updateComplete;
  const wrap = el.shadowRoot?.querySelector<HTMLElement>(".sparkline-svg-wrap");
  if (!wrap) throw new Error("no .sparkline-svg-wrap rendered");
  // happy-dom lays nothing out, so give the chart a width to hover over.
  wrap.getBoundingClientRect = () =>
    ({ left: 0, width: 300, top: 0, height: 60, right: 300, bottom: 60 }) as DOMRect;
  wrap.dispatchEvent(new PointerEvent("pointermove", { clientX: 290, bubbles: true }));
  await el.updateComplete;
  return el.shadowRoot?.querySelector(".sparkline-tooltip-time")?.textContent?.trim() ?? "";
}

describe("hover time", () => {
  it("formats the hovered change in the zone, 24-hour by default", async () => {
    const vienna = await hovered((el) => {
      el.language = "en";
      el.timeZone = "Europe/Vienna";
    });
    expect(vienna).toMatch(/\d{2}:\d{2}/);
    expect(vienna).not.toMatch(/AM|PM/);
    // Fourteen hours east of UTC: the same instant reads as another hour.
    const kiritimati = await hovered((el) => {
      el.language = "en";
      el.timeZone = "Pacific/Kiritimati";
    });
    expect(kiritimati).not.toBe(vienna);
  });

  it("switches to 12-hour with the profile", async () => {
    const text = await hovered((el) => {
      el.language = "en";
      el.timeZone = "Europe/Vienna";
      el.hour12 = true;
    });
    expect(text).toMatch(/AM|PM/);
  });

  it("falls back to the browser's zone for an unknown one", async () => {
    const text = await hovered((el) => {
      el.language = "en";
      el.timeZone = "Not/AZone";
    });
    expect(text).toMatch(/\d{1,2}:\d{2}/);
  });
});
