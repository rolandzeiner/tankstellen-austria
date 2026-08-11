import { describe, expect, it } from "vitest";

import editorSource from "./editor.ts?raw";
import stylesSource from "./styles.ts?raw";

describe("editor element choice", () => {
  it("never uses ha-textfield", () => {
    // ha-textfield was deleted from the HA frontend on 2026-04-01
    // (frontend PR #30349, "Migrate all from ha-textfield to ha-input").
    // An unregistered custom element is not an error: the browser renders
    // it as an unknown inline element with no box and logs nothing. The
    // custom payment-method field was simply absent from the editor, and
    // the + button beside it read `.value` off that element and always
    // got undefined — so it silently did nothing.
    expect(editorSource).not.toMatch(/<ha-textfield/);
  });

  it("leaves no ha-textfield rule behind in the stylesheet", () => {
    // A selector for an element that can never exist is dead weight that
    // reads as intent — the next maintainer takes it as evidence the tag
    // is still in use.
    expect(stylesSource).not.toMatch(/ha-textfield/);
  });

  it("routes the custom payment-method field through a selector", () => {
    // Naming a concrete tag just resets the clock until the next rename.
    // ha-selector delegates to whatever HA's current text control is and
    // lazy-loads it itself, so the card survives the swap.
    expect(editorSource).toMatch(/<ha-selector/);
    expect(editorSource).toMatch(/PM_CUSTOM_SELECTOR/);
    expect(editorSource).toMatch(/text:\s*\{\}/);
  });
});

describe("design-token fallbacks", () => {
  // A var() fallback only renders when HA does not define the token, so a
  // wrong one is invisible until the day HA drops the token — at which
  // point the card silently shifts. These must equal the real values in
  // the frontend's resources/theme/*.globals.ts.
  const FONT_WEIGHTS: Record<string, string> = {
    light: "300",
    normal: "400",
    medium: "500",
    bold: "700",
  };

  it("declares the true value as every font-weight fallback", () => {
    const sites = [...stylesSource.matchAll(/--ha-font-weight-(\w+),\s*(\d+)/g)];
    expect(sites.length).toBeGreaterThan(0);
    for (const site of sites) {
      const name = site[1] ?? "";
      const fallback = site[2] ?? "";
      expect(
        FONT_WEIGHTS[name],
        `unknown token --ha-font-weight-${name}`,
      ).toBeDefined();
      expect(fallback, `--ha-font-weight-${name} fallback`).toBe(
        FONT_WEIGHTS[name],
      );
    }
  });
});
