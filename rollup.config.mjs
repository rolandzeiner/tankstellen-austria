// Transpiler note: this was @rollup/plugin-typescript until TypeScript 7.
// TS 7 is the Go-native compiler and its npm package no longer ships the JS
// compiler API - `require("typescript")` now resolves to lib/version.cjs, so
// ts.createProgram / ts.ScriptTarget are undefined and that plugin dies at
// load with "Cannot read properties of undefined (reading 'ES2015')".
// swc transpiles instead; `tsc --noEmit` still type-checks (and is now the
// only type-check there is, because swc strips types without checking them).
import { readFileSync } from "node:fs";

import { swc } from "@rollup/plugin-swc";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const dev = !!process.env.ROLLUP_WATCH;

// Derive swc's transpile settings from tsconfig.json rather than restating
// them. swc has its own decorator implementation, so if these ever disagree
// with tsconfig the bundle silently stops matching what tsc type-checked -
// and the failure mode (Lit reactivity quietly dead) does not look like a
// config bug. Reading them here makes that class of drift impossible.
const tsconfig = JSON.parse(readFileSync("./tsconfig.json", "utf8"));
const { target, experimentalDecorators, useDefineForClassFields } =
  tsconfig.compilerOptions;

const banner =
  "// Tankstellen Austria Card — bundled by Rollup. Edit sources in src/, then `npm run build`.";

export default {
  input: "src/tankstellen-austria-card.ts",
  output: {
    file: "custom_components/tankstellen_austria/www/tankstellen-austria-card.js",
    format: "es",
    sourcemap: dev,
    banner,
    // HACS users get a single .js file, not a chunked dist/. The editor's
    // dynamic import (getConfigElement) gets inlined into the main bundle.
    inlineDynamicImports: true,
  },
  plugins: [
    nodeResolve({ extensions: [".ts", ".mjs", ".js", ".json"] }),
    swc({
      // Scope to .ts only, or swc also grabs the JSON that nodeResolve's
      // `extensions` just made resolvable and parses it as TypeScript.
      include: /\.ts$/,
      swc: {
        jsc: {
          // Lit 3's @customElement / @property are LEGACY (experimental)
          // decorators, and useDefineForClassFields must stay false or class
          // fields overwrite Lit's accessors and reactivity silently dies.
          // Both are read from tsconfig above, never restated.
          target,
          parser: { syntax: "typescript", decorators: experimentalDecorators },
          transform: {
            legacyDecorator: experimentalDecorators,
            decoratorMetadata: false,
            useDefineForClassFields,
          },
        },
      },
    }),
    json(),
    !dev && terser({ format: { comments: /Tankstellen Austria Card/ } }),
  ].filter(Boolean),
};
