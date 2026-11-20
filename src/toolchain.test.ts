/**
 * Guards the one hand-maintained pin in package.json.
 *
 * The `vite` override points every Vite consumer at Vite+'s core, so npm
 * installs one Vite instead of hoisting upstream vite next to it. It names
 * an exact core version, and Dependabot bumps `vite-plus` without touching
 * overrides. Left behind, npm would quietly run the new Vite+ CLI on the
 * old core. Bump both in the same commit. Since Vite+ 1.7.0 the core is
 * versioned after the Vite it wraps (`8.3.8000`), not after Vite+, so the
 * pin is compared with the core the installed vite-plus itself depends on.
 */
import { describe, expect, it } from "vite-plus/test";

import pkg from "../package.json";
import vitePlusPkg from "../node_modules/vite-plus/package.json";

describe("toolchain pins", () => {
  it("keeps the vite override on the core the installed vite-plus uses", () => {
    expect(vitePlusPkg.version).toBe(pkg.devDependencies["vite-plus"]);
    expect(pkg.overrides.vite).toBe(vitePlusPkg.dependencies.vite);
  });
});
