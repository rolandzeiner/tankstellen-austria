/**
 * Vite's `?raw` suffix, which vitest honours.
 *
 * Lets a test read a source file as a string without pulling in
 * `@types/node` for `fs` — the project ships no node types, and a test
 * tripwire is not a reason to add a dependency.
 */
declare module "*?raw" {
  const content: string;
  export default content;
}
