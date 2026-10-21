/**
 * Guards the one hand-maintained pin in package.json.
 *
 * The `vite` override points every Vite consumer at Vite+'s core, so npm
 * installs one Vite instead of hoisting upstream vite next to it. It names
 * an exact core version, and Dependabot bumps `vite-plus` without touching
 * overrides. Left behind, npm would quietly run the new Vite+ CLI on the
 * old core. Bump both in the same commit.
 */
import { describe, expect, it } from "vite-plus/test";

import pkg from "../package.json";

describe("toolchain pins", () => {
  it("keeps the vite override on the installed vite-plus version", () => {
    expect(pkg.overrides.vite).toBe(
      `npm:@voidzero-dev/vite-plus-core@${pkg.devDependencies["vite-plus"]}`,
    );
  });
});
