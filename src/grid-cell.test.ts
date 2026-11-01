/**
 * The card fills its sections-view grid cell instead of painting over the
 * card below it -- and only there, so the add-card picker preview keeps its
 * own height.
 *
 * A sections view gives the card a fixed-height cell whenever rows is numeric
 * -- which the USER causes by dragging the height or width handle, since a
 * stored grid_options overrides getGridOptions(). rows: "auto" exempts
 * nobody. Only the PAIR below makes the card take that height; see
 * references/layout-and-grid.md, "A card whose :host is display: block ...".
 *
 * The pair is gated on the layout attribute HA sets ("grid" in a sections
 * view, "panel" in a panel view). The add-card picker sets none and centres
 * each preview in a tile as tall as the tallest one in its row, so an
 * ungated 100% stretches the preview down to it. The selectors only match if
 * the card declares @property({ reflect: true }) layout; importing the card
 * here would need a DOM, so card-smoke.test.ts checks that.
 *
 * happy-dom and node do no layout, so the guard is on the CSS text. It needs
 * no DOM: import it into any vitest suite, or run it on its own. The
 * portfolio lost the pair four times, each time in a card whose styles were
 * written by hand instead of copied from styles.ts.template -- which is why
 * this ships as a test rather than as advice.
 */
import { describe, expect, it } from "vite-plus/test";

import { cardStyles } from "./styles";

/** The declarations of the first rule whose selector list starts a line with
 *  `selector`, up to its closing brace. Anchoring on the line keeps "ha-card"
 *  from matching the tail of `:host([layout="panel"]) ha-card`. */
const rule = (selector: string): string => {
  const css = cardStyles.cssText;
  const start = css.indexOf(`\n  ${selector} {`);
  return start < 0 ? "" : css.slice(start, css.indexOf("}", start));
};

describe("the grid cell", () => {
  it("is a block on the host", () => {
    expect(rule(":host")).toMatch(/display:\s*block/);
  });

  it("takes the cell's height on the host in grid and panel layouts", () => {
    expect(rule(':host([layout="grid"]),\n  :host([layout="panel"])')).toMatch(
      /block-size:\s*100%/,
    );
  });

  it("resolves ha-card against it there, and clips inside the card", () => {
    expect(rule(':host([layout="grid"]) ha-card,\n  :host([layout="panel"]) ha-card')).toMatch(
      /block-size:\s*100%/,
    );
    expect(rule("ha-card")).toMatch(/overflow:\s*hidden/);
  });

  it("never fills ungated, so the picker preview keeps its own height", () => {
    expect(rule(":host")).not.toMatch(/block-size|height:\s*100%/);
    expect(rule("ha-card")).not.toMatch(/block-size|height:\s*100%/);
  });
});
