// Bundler note: this was Rollup + @rollup/plugin-{swc,terser,node-resolve,json}
// until 2026-09. That whole stack came from the rollup/plugins monorepo, which
// has had no commits since 2026-05-29 — and the swc plugin only existed because
// @rollup/plugin-typescript died on TypeScript 7 (the Go-native compiler no
// longer ships the JS compiler API). Rolldown does transpilation, minification,
// module resolution and JSON natively, so all four plugins and @swc/core are
// gone rather than replaced. Rolldown does NOT type-check, exactly as swc did
// not: `tsc --noEmit` remains the only type-check in the pipeline.
//
// Decorators are deliberately not configured here. Rolldown reads tsconfig.json
// itself and turns on Lit's legacy (experimental) decorators from it, so the
// swc block that used to derive target / experimentalDecorators /
// useDefineForClassFields by hand is gone. Verified per bundle by diffing the
// Lit reactive-property list before and after the migration.
import { defineConfig } from "rolldown";

// Verified empirically against rolldown 1.2.7: `rolldown -c -w` sets BOTH
// ROLLDOWN_WATCH and ROLLUP_WATCH to "true", and a plain `rolldown -c` sets
// neither. Reading both means this keeps working whichever name rolldown
// settles on — and the failure mode it guards against is silent (dev builds
// shipping minified, prod builds shipping sourcemaps).
const dev = !!(process.env.ROLLDOWN_WATCH || process.env.ROLLUP_WATCH);

// MUST be a legal comment — `/*! ... */` — not `//`. Rolldown's minifier
// strips ordinary comments including a `//` banner, silently, and the only
// way to notice is to look at the first bytes of the built file. `comments:
// { legal: true }` below is the other half of the same requirement: it keeps
// comments that start with /*! or contain @license / @preserve.
const banner =
  "/*! Tankstellen Austria Card — bundled by Rolldown. Edit sources in src/, then `npm run build`. */";

export default defineConfig({
  input: "src/tankstellen-austria-card.ts",
  output: {
    file: "custom_components/tankstellen_austria/www/tankstellen-austria-card.js",
    format: "es",
    sourcemap: dev,
    banner,
    // HACS users get a single .js file, not a chunked dist/. The editor's
    // dynamic import (getConfigElement) gets inlined into the main bundle.
    // Replaces the deprecated `inlineDynamicImports: true`.
    codeSplitting: false,
    comments: { legal: true },
    minify: dev
      ? false
      : {
          // Keep console.* — do NOT flip this to true. The cards' console calls
          // are their only client-side failure signal: most sit in catch blocks
          // where dropping the call turns a caught error into a silent one, and
          // the console.info version banner is how you confirm which bundle the
          // browser actually loaded — the exact question the stale-cache
          // WebSocket version check exists to answer. Rolldown's dropConsole is
          // all-or-nothing (boolean, unlike terser's drop_console array), so
          // keeping warn/error means keeping everything.
          compress: { dropConsole: false },
          mangle: true,
          codegen: true,
        },
  },
});
