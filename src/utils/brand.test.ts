import { describe, expect, it } from "vite-plus/test";

import { cardStyles } from "../styles";
import { BRANDS, brandTile } from "./brand";

// WCAG relative luminance and contrast ratio of two #rrggbb colours.
function luminance(hex: string): number {
  const channel = (i: number): number => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}
const contrast = (a: string, b: string): number => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

describe("brandTile", () => {
  // Names as E-Control sent them to the live box on 2026-11-01.
  it.each([
    ["JET TANKSTELLE", "JET"],
    ["eni", "ENI"],
    ["eni24", "ENI"],
    ["Shell Austria", "SH"],
    ["Turmöl Quick", "TÖ"],
    ["AVIA Krems B37", "AV"],
    ["AVANTI - Krems an der Donau Bertschingerstraße 6-8", "AVA"],
    ["OMV", "OMV"],
    ["BP", "BP"],
    ["SOCAR", "SO"],
    ["Lagerhaus Genol", "LH"],
    ["LH Wies", "LH"],
    ["Diskont Tankstelle", "DT"],
    ["DISKONT", "DT"],
    ["DISK", "DSK"],
    ["Disk Eisinger", "DSK"],
    ["disk tank Heindl", "DSK"],
    ["Rumpold", "RU"],
    ["F. LEITNER", "FL"],
    ["IQ", "IQ"],
    ["IQ Tankautomat Trofaiach", "IQ"],
    ["LMEnergy Express", "LM"],
  ])("knows %s", (name, initials) => {
    const tile = brandTile(name);
    expect(tile.initials).toBe(initials);
    expect(tile.bg).toMatch(/^#[0-9a-f]{6}$/);
  });

  it.each([
    ["Essmeister Diskont", "ES"],
    // An independent with "Diskont" in its name isn't the Hofer chain.
    ["Diskont Rainer", "RA"],
    ["Wildenhofer Diesel Tankstelle", "WI"],
    ["24 tanken + shop", "24"],
    ["", "–"],
  ])("gives %s its initials on the default tile", (name, initials) => {
    expect(brandTile(name)).toEqual({ initials });
  });

  it("doesn't read a brand out of the middle of a word", () => {
    expect(brandTile("Benimarkt").bg).toBeUndefined();
    expect(brandTile("Jetzinger").bg).toBeUndefined();
    expect(brandTile("Diskonttankstelle Glauninger").bg).toBeUndefined();
    expect(brandTile("Bleitner").bg).toBeUndefined();
    expect(brandTile("Liquid Shop").bg).toBeUndefined();
  });

  it("keeps every brand's text readable", () => {
    const weak = BRANDS.filter((b) => contrast(b.bg, b.fg) < 4.5).map((b) => b.initials);
    expect(weak).toEqual([]);
  });

  // stations.row_style: gradient lays the brand at this strength under
  // the row's text, which then takes the theme's primary colour. Read from
  // the shipped CSS, so raising the wash fails here first.
  it("keeps primary text readable on every brand's wash", () => {
    const peak = /\.st\.plate-fade\s*\{[^}]*?var\(--tankst-row-bg\) (\d+)%/.exec(
      cardStyles.cssText,
    );
    expect(peak).not.toBeNull();
    const share = Number(peak?.[1]) / 100;
    const mix = (fg: string, bg: string): string =>
      "#" +
      [1, 3, 5]
        .map((i) => {
          const c = parseInt(fg.slice(i, i + 2), 16) * share;
          return Math.round(c + parseInt(bg.slice(i, i + 2), 16) * (1 - share));
        })
        .map((c) => c.toString(16).padStart(2, "0"))
        .join("");
    // Home Assistant's default themes: card background and primary text.
    const themes = [
      ["#ffffff", "#212121"],
      ["#1c1c1c", "#e1e1e1"],
    ] as const;
    const weak = BRANDS.flatMap((b) =>
      themes
        .filter(([card, text]) => contrast(text, mix(b.bg, card)) < 4.5)
        .map(([card]) => `${b.initials} on ${card}`),
    );
    expect(weak).toEqual([]);
  });
});
