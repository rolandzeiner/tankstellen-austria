# Contributing to Tankstellen Austria

## Dev setup

```bash
uv venv --python 3.14 && source .venv/bin/activate
uv pip install -r requirements_test.txt pre-commit
pre-commit install      # runs ruff, mypy and `vp check` on every commit

npm ci                  # Lovelace card deps; Node ^24.11 or 26+, npm 11+
npm run build           # produces custom_components/tankstellen_austria/www/tankstellen-austria-card.js
npm run dev             # watch mode (development build with sourcemaps)
```

CI installs the same way (`astral-sh/setup-uv` + `uv pip install --system`), so a locally passing gate matches what CI resolves. Plain `python -m venv` + `pip` still works if you don't have `uv`.

## Branching & releases

- Work on `dev`. PRs target `dev`.
- Releases are tagged from `main` after merging `dev → main`.
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

## Card-version sync

Bump `manifest.json` `version` and `src/const.ts` `CARD_VERSION` together — `const.py` reads `CARD_VERSION` from the manifest at import, and `tests/test_card_version.py` enforces parity with the TS constant. If they drift, users get an infinite reload-banner loop.

## Tooling & config

- `vite.config.ts` — the whole card toolchain, run through [Vite+](https://viteplus.dev/) (`vp`): `vp build` (Vite library mode on Rolldown), `vp test` (Vitest), and `vp check` (Oxfmt + Oxlint + type-check). The only card `devDependency` is `vite-plus`. Vitest, Rolldown and the type-checker all ship inside it, and `typescript` is not installed. Five things there fail silently if you change them:
  - The banner must be a **legal** comment — `/*! ... */` — with `comments: { legal: true }`. A `//` banner is stripped by the minifier and nothing tells you; only the built file's first bytes do.
  - **`minify` lives on `rolldownOptions.output`, with `dropConsole: false`.** Vite's library mode skips whitespace minification for ES output, so `build.minify` alone ships the bundle with its whitespace left in. `dropConsole` is all-or-nothing, and most `console.*` calls here sit in `catch` blocks where dropping them turns a caught error into a silent one.
  - **Dev vs prod comes from `--mode development`** (`npm run dev`). A plain `vp build` is production: minified, no sourcemap.
  - **`fmt.embeddedLanguageFormatting` stays `"off"`.** Otherwise Oxfmt reformats Lit `html`/`css` templates and changes the whitespace inside rendered elements, which is a DOM change, not a style change.
  - **Decorators are not configured.** Rolldown reads `tsconfig.json` itself and enables Lit's legacy decorators from it. If that ever regresses, class fields overwrite Lit's accessors and reactivity dies while the build stays green — diff a built bundle's Lit reactive-property list to catch it.
- **The `vite` override in `package.json` must name the same version as `vite-plus`.** It keeps npm from installing upstream Vite next to Vite+'s core. Dependabot bumps `vite-plus` but not the override, and `src/toolchain.test.ts` fails until you bump both.
- **The build does not type-check.** `vp check` is the only thing between a type error and a green build, which is why the gate runs it as its own step.
- `pyproject.toml` — source of truth for ruff (target-version, line-length), mypy (strict, ignore_missing_imports, files), and coverage config. Change rules here, not in CI flags.
  - **`target-version` tracks the oldest Python we support, never the one CI runs.** `hacs.json` promises HA ≥ 2025.1.0, which runs on Python 3.12, so `target-version = "py312"` — even though the venv and CI are on 3.14. Pointing it at the CI interpreter lets ruff rewrite code into syntax our users cannot parse and then stay silent about it; that is how wiener-linien-austria v1.7.1 shipped a SyntaxError. The `compile-floor-python` CI job byte-compiles the shipped package on 3.12 as an independent backstop. Raise all three together or not at all.
- `pytest.ini` — pytest config and the **`--cov-fail-under=90` coverage gate**. `pytest tests/` automatically runs with coverage; CI fails fast if a new commit drops coverage below the gate. It measured ~94% in September 2026, so there are about 4 points of headroom.
- `ATTRIBUTION` in `const.py` — the data-source statement ("Datenquelle: E-Control") that every sensor emits as its `attribution` and the card shows in its footer. Update it if E-Control changes its attribution wording.

View per-file coverage locally:

```bash
pytest tests/ --cov-report=term-missing
```

## Verification gate (must pass before pushing)

```bash
pytest tests/ -v                                               # Python integration
mypy --strict --ignore-missing-imports custom_components/tankstellen_austria
ruff check .
ruff format --check .                                          # ruff check ignores formatting
uv run --python 3.12 --no-project python -m compileall -q custom_components/tankstellen_austria  # oldest supported Python
npx vp check                                                   # card format, lint and type-check
npm test                                                       # vp test run — card unit tests
npm run build                                                  # vp build — card bundle
node -c custom_components/tankstellen_austria/www/tankstellen-austria-card.js
```

Commit the rebuilt `custom_components/tankstellen_austria/www/tankstellen-austria-card.js` together with the `src/` change that produced it. HACS users never run `npm`, and CI fails if the committed bundle differs from a fresh build.

The frontend tests live next to the code as `src/**/*.test.ts` (Vitest inside Vite+, node environment, imports from `vite-plus/test`). `src/analytics/best-refuel.test.ts` anchors its fixture to a Monday-aligned `now`, so it passes whatever day the suite runs.

The card side has no coverage gate, so the v8 coverage provider is not a dependency. To see which branches a change left unexercised, install it for one run at the Vitest version Vite+ bundles (`--no-save` leaves `package.json` and the lockfile alone):

```bash
V=$(npx vp toolchain vitest | grep -oE 'vitest@[0-9.]+' | head -1 | cut -d@ -f2)
npm i --no-save @vitest/coverage-v8@"$V"
npx vp test run --coverage --coverage.provider=v8 --coverage.reporter=text \
  '--coverage.include=src/**/*.ts' '--coverage.exclude=src/**/*.test.ts'
```

CI runs the same checks, plus hassfest, HACS validation and `npm audit` on the card's runtime dependencies. Failing locally wastes a push.

## Reporting issues

Open an issue with:
- HA version + Tankstellen Austria version
- Diagnostics download (Settings → Devices & Services → Tankstellen Austria → Download diagnostics) — secrets are auto-redacted
- Steps to reproduce
