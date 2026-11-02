# Contributing to Tankstellen Austria

Thanks for taking a look. This repo is a Home Assistant integration with a Lovelace card. Everything you need to work on it is on this page, and the gate in *Verification gate* has to pass before a change lands.

## Quick start

```bash
git clone https://github.com/rolandzeiner/tankstellen-austria.git
cd tankstellen-austria
uv venv --python 3.14 && source .venv/bin/activate
uv pip install -r requirements_test.txt pre-commit
pre-commit install
npm ci && npm run build
```

Before a PR, run the gate in *Verification gate*. It is what CI runs, so failing locally only costs you a push.

## Branching and releases

- Work on `dev`; PRs target `dev`. Nothing is committed or force-pushed to `main`.
- For anything bigger than a fix, open an issue first so the shape is agreed before the code is written.
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. A subject line, then bullets that say what changed and why.
- The built bundle is committed and travels with the `src/` change that produced it: users install through the Marketplace and never run `npm`, and CI fails when the committed bundle differs from a fresh build by a byte.
- Releases are the maintainer's: a `dev → main` PR, squash-merged, then a tag from `main`. Publishing the release runs `release.yml`, which attaches `tankstellen_austria.zip`, a flat archive of `custom_components/tankstellen_austria/`. `hacs.json` sets `zip_release`, so the Marketplace downloads that file, and a release without it can't be installed. If the job fails, `gh workflow run release.yml -f tag=vX.Y.Z` re-runs it against the existing tag.
- Contributions are accepted under the repo's MIT licence.

## Python environment

- The project uses [`uv`](https://docs.astral.sh/uv/) for Python environments, the same tool CI installs with (`astral-sh/setup-uv` and `uv pip install --system`), so a gate that passes locally resolves what CI resolves. Plain `python -m venv` and `pip` work too.
- `3.14` is the CI interpreter and what `pytest-homeassistant-custom-component` requires. It is also the support floor today, but only by coincidence; see *Two Python versions*.
- `pre-commit install` runs ruff, ruff-format, mypy and `vp check` on every commit, plus the whitespace hooks, from which the built bundle is excluded (see *Card toolchain*).
- A venv built months ago drifts from `requirements_test.txt`. Re-run `uv pip install -U -r requirements_test.txt` after a pin bump and whenever you come back to the repo; the `-U` is what moves a floating range such as PHACC's.
- `requirements_test.txt` carries its own rules in its header comment: PHACC governs the test stack, and nothing it pins is declared again.
- `custom_components/tankstellen_austria/_dev_fixture.py` is gitignored and the `no-dev-fixture` CI job fails if it ever lands. It injects synthetic data for local card work.

## Two Python versions

Every change has to respect both, and conflating them has shipped a broken release in this portfolio.

| Axis | Version | Where it is declared |
|---|---|---|
| **Runtime**: what we develop and test on | 3.14 | `validate.yml` `tests` job, your local venv |
| **Floor**: the oldest Python we must still run on | 3.14 | `pyproject.toml` `[tool.ruff] target-version`, the `compile-floor-python` CI job |

The floor is whatever `hacs.json`'s `homeassistant` value requires. HA 2026.3.0 declares `REQUIRED_PYTHON_VER = (3, 14, …)`, which you can check rather than remember:

```bash
gh api "repos/home-assistant/core/contents/homeassistant/const.py?ref=2026.3.0" \
  --jq .content | base64 -d | grep REQUIRED_PYTHON_VER
```

The two are equal right now, which is exactly when the distinction is easiest to lose: the next CI interpreter bump must not move `target-version` with it. Setting `target-version` to the CI interpreter lets `ruff format` emit syntax the floor cannot parse and then stay silent about it; that is how a sibling once shipped a `SyntaxError` with green CI, because every check ran on the newer interpreter. Raise the floor only by changing all three declarations in one commit, plus the README's requirement line and badge.

## Card toolchain

The card lives in `src/` and builds to `custom_components/tankstellen_austria/www/tankstellen-austria-card.js`. Its whole toolchain runs through [Vite+](https://viteplus.dev/) (`vp`), configured in `vite.config.ts`: `vp build` (Vite library mode on Rolldown), `vp test` (Vitest) and `vp check` (Oxfmt, Oxlint and the type-check). The only card `devDependencies` are `vite-plus` and `happy-dom`; Vitest, Rolldown and the type-checker ship inside `vite-plus`, and `typescript` is not installed. `npx vp` runs the copy in `node_modules`; a global `vp` works too.

| Command | What it does |
|---|---|
| `npm run dev` | Watches `src/` and rebuilds the bundle on save, with a sourcemap (`--mode development`). |
| `npm run build` | Production build into `www/`. |
| `npm test` | `vp test run`: the card suites. |
| `npm run check` | `vp check`: Oxfmt, Oxlint and the type-check. `npx vp check --fix` rewrites what it can. |

Node 24.11 or newer (26 works too) and npm 11.

Commit the built bundle. End users install through the Marketplace and never run `npm`, so `custom_components/tankstellen_austria/www/tankstellen-austria-card.js` is tracked. CI asserts the committed bundle matches a fresh build byte for byte; a stale bundle is the infinite reload-banner bug. A dev build writes a `.map` file next to it; it is gitignored.

Things in `vite.config.ts` that fail silently if you change them:

- The banner must be a **legal** comment, `/*! ... */`, with `comments: { legal: true }`. The minifier strips a `//` banner without a word; only the built file's first bytes show it.
- **`minify` lives on `rolldownOptions.output`, with `dropConsole: false`.** Vite's library mode skips whitespace minification for ES output, so `build.minify` alone ships the bundle with its whitespace left in. `dropConsole` is all-or-nothing, and the `console.*` calls here sit in `catch` blocks, where dropping them turns a caught error into a silent one.
- **Dev vs prod comes from `--mode development`** (`npm run dev`). A plain `vp build` is production: minified, no sourcemap.
- **`fmt.embeddedLanguageFormatting` stays `"off"`.** Otherwise Oxfmt reformats Lit `html` and `css` templates and changes the whitespace inside rendered elements, which is a DOM change, not a style change.
- **Decorators are not configured.** Rolldown reads `tsconfig.json` itself and enables Lit's legacy decorators from it. If that ever regresses, class fields overwrite Lit's accessors and reactivity dies while the build stays green; `src/card-smoke.test.ts` reads `elementProperties` back off both elements and catches it.
- **`lint.plugins` replaces Oxlint's defaults.** It names `typescript`, `unicorn` and `oxc` next to `vitest`; drop one and its rules stop running without a word. The `vitest/*` rules fail a committed `.only` or `.skip`, a test without an assertion, a duplicate title, an `expect` inside an `if` and a bare `toThrow()`, and `reportUnusedDisableDirectives` fails a disable comment that no longer suppresses anything.
- **`lint.options.denyWarnings: true`.** Without it `vp check` exits 0 on warnings, and CI and pre-commit let them through.
- **`codeSplitting: false`.** The card is one file; a dashboard resource can't load a second chunk the bundler decided on. The editor's dynamic import is inlined by it.
- **`emptyOutDir: false`.** Vite empties the output directory before each build by default, and `www/` sits inside the integration package.

The `vite` override in `package.json` must name the same version as `vite-plus`. It keeps npm from installing upstream Vite next to Vite+'s core. Dependabot bumps `vite-plus` but not the override, and `src/toolchain.test.ts` fails until both match. Bump with `npx --package=vite-plus@<new> vp migrate --no-interactive`, which moves both; `npm install vite-plus@<new>` fails with ERESOLVE.

The build does not type-check. `vp check` is the only thing between a type error and a green build, which is why the gate runs it as its own step. It also catches a backtick inside a Lit `css` or `html` template, comments included, which ends the template early and fails the card at load while the build stays green.

The bundle is excluded from the `end-of-file-fixer` and `trailing-whitespace` hooks: the bundler emits no trailing newline, and a hook that fixes the file after the build leaves it out of sync with a fresh one, which CI asserts byte for byte. `vp check` runs as a local hook on card source; don't switch to Vite+'s own `vp staged` hooks, which take over `core.hooksPath` and silently disable ruff and mypy.

`tsconfig.json`'s `lib` is the card's browser floor: ES2022. That is why a copy is sorted in place rather than with `toSorted()`, and why the ES2023 array methods stay out: the bundle doesn't polyfill them. Raising it is a browser requirement for users; say so in the README's Requirements section in the same commit.

### Trying it in Home Assistant

Copy `custom_components/tankstellen_austria/` into your Home Assistant config's `custom_components/` and restart Home Assistant. After a card change, copy the rebuilt `www/` file the same way and hard-refresh the browser: the resource URL only changes with the version.

## Verification gate

```bash
# Python
pytest tests/ -v
mypy --strict --ignore-missing-imports custom_components/tankstellen_austria
ruff check .
ruff format --check .                     # separate: `ruff check` never inspects formatting

# The oldest Python we support, derived from pyproject.toml, never hardcoded
FLOOR=$(sed -n 's/^target-version = "py3\([0-9]*\)"/3.\1/p' pyproject.toml)
uv run --python "$FLOOR" --no-project python -m compileall -q custom_components/tankstellen_austria

# Card
npx vp check                              # format, lint and the only type-check
npm test                                  # vp test run
npm run build                             # commit the rebuilt bundle with the src/ change
git diff --exit-code -- custom_components/tankstellen_austria/www/*.js
node -c custom_components/tankstellen_austria/www/tankstellen-austria-card.js
```

CI runs the same checks plus hassfest, HACS validation, `npm audit --omit=dev --audit-level=high`, a check that the committed bundle matches a fresh build, the dev-fixture guard and CodeQL. Failing locally only costs you a push.

Two of these are easy to skip and expensive to skip:

- **`ruff format --check`** is separate from `ruff check`, which never inspects formatting. Without it the formatter drifts silently until someone runs it.
- **`npx vp check`** is the only type-check anywhere. The build strips types without checking them, so a type error builds cleanly all the way to a shipped bundle.

**Keep `--no-project`** on the `compileall` line. Without it `uv` treats the repo root as a project, finds no `requires-python`, and rebuilds `.venv` on the floor interpreter, taking every tool in it along. Recover with `uv venv --clear --python 3.14 && uv pip install -r requirements_test.txt pre-commit`.

## Tests

**Python.** `pytest tests/` runs on `pytest-homeassistant-custom-component`. `tests/conftest.py` holds what a new test starts from: `make_entry()` builds a config entry, the `mock_fetch` fixture stands in for the upstream, and three autouse fixtures (`mock_aiohttp_session`, `mock_card_path` and `no_deprecated_ha_api`) are on in every test. Two tests are AST guards: `test_api.py` fails on any Home Assistant or package import in `api.py`, and `test_best_refuel.py` does the same for `best_refuel.py`. The harness traps that cost an afternoon:

- The autouse `no_deprecated_ha_api` fixture fails any test that trips Home Assistant's deprecation channel, in both of HA's message shapes. A test that exercises a deprecated API on purpose takes `@pytest.mark.allow_deprecated_ha_api`; don't weaken the fixture.
- Unknown markers fail the run (`strict_markers`), a hung fixture fails after 15 s, and a `DeprecationWarning` reached through our own code is an error (`pytest.ini` says which libraries are exempt and how to add one).
- `test_api_errors_keep_their_translation_contract` pins the keys and placeholders that `strings.json` and `outage.py` depend on; a new API error joins it.

**Card.** The suites sit beside the sources as `src/**/*.test.ts` and import from `vite-plus/test`, not `vitest`. Pure functions run in plain Node: the config normalisers and defaults (`utils/config.test.ts`), the price, distance and map-link formatters (`utils/price.test.ts`, `utils.test.ts`), the chart geometry (`sparkline.test.ts`, `utils/math.test.ts`), the zoned clock (`utils/tz.test.ts`), the history fetch and cache (`history.test.ts`), the language packs (`localize/localize.test.ts`), the cheap-window analysis (`analytics/best-refuel.test.ts`, anchored to a Monday-aligned `now`, and `analytics/best-refuel.parity.test.ts`, which pins `TZ` to Europe/Vienna itself). Anything that needs a DOM opts in with a `@vitest-environment happy-dom` line in the file's leading comment: `card-smoke.test.ts` mounts the card and the editor and renders a card with no options next to one with every `OPTION_DEFAULTS` entry spelled out, so the defaults the editor draws can't drift from the card's; `card-refresh.test.ts` runs on fake timers to cover the manual-refresh cooldown and the history polling; `editor-form.test.ts` plays `ha-form` events back to check the grouped YAML the editor writes and that every field has a label in both languages; `sparkline-element.test.ts` covers the chart's hover tooltip. `grid-cell.test.ts` checks the CSS text of the grid-cell rules, `utils/card-size.test.ts` holds `getCardSize()` to heights measured on the rendered card, and `toolchain.test.ts` pins the Vite+ pins named in *Card toolchain*.

- The HA components the card and editor host (`ha-card`, `ha-form`, `ha-icon`, `ha-alert`) are deliberately never defined in tests. An undefined element is inert, Lit renders straight through it, and not stubbing them is what keeps this layer free of a test harness.
- happy-dom lays nothing out: `getBoundingClientRect()` is all zeros, so a test that hovers the chart stubs it on the element first, as `sparkline-element.test.ts` does.
- The history cache in `src/history.ts` is module-level and shared across a file's tests; give each test its own entity id.

A change to what the card does comes with a test that fails without it.

### Snapshots

The cheap-window analysis exists twice, in `src/analytics/best-refuel.ts` and its Python port `custom_components/tankstellen_austria/best_refuel.py`, and one snapshot keeps them in agreement. `tests/fixtures/best_refuel_parity.json` holds the input cases; `src/analytics/best-refuel.parity.test.ts` records what the TypeScript version makes of them in `tests/fixtures/__snapshots__/best_refuel_expected.json`, a Vitest file snapshot that `tests/test_best_refuel.py` holds the Python version to. After an intended change to the algorithm, change both files, regenerate with `npx vp test run -u`, review the diff, and run `pytest` to see whether the port still agrees. Commit the snapshot with the code.

### Coverage

`pytest.ini` enforces `--cov-fail-under=95` on the package total; `pytest tests/ --cov-report=term-missing` gives the per-file view. The card side has no gate and the provider is not a dependency. To see which branches a change left unexercised, install it for one run at the Vitest version Vite+ bundles:

```bash
V=$(npx vp toolchain vitest | grep -oE 'vitest@[0-9.]+' | head -1 | cut -d@ -f2)
npm i --no-save @vitest/coverage-v8@"$V"
npx vp test run --coverage --coverage.provider=v8 --coverage.reporter=text \
  '--coverage.include=src/**/*.ts' '--coverage.exclude=src/**/*.test.ts'
```

`--no-save` leaves `package.json` and the lockfile alone; the next `npm ci` removes the provider.

## Version sync

`manifest.json` `version` and `src/const.ts` `CARD_VERSION` must match byte for byte. `const.py` derives its value from the manifest at import, so the Python side needs no edit, and `tests/test_card_version.py` enforces the pair. The failure mode: the card's version check sees a mismatch, shows the reload banner, the reload re-serves the same bundle, and the banner comes back, for every user. A bump edits both files, rebuilds the bundle and commits all three together. Neither carries a `-beta` suffix: a pre-release has the final release's number and GitHub's pre-release flag. The README badge reads the latest release tag and needs no edit.

## Dependencies

| Package | Pin | Why |
|---|---|---|
| `ruff`, `mypy` | exact, `requirements_test.txt` | CI runs nightly; a floating linter turns the build red with no code change. The `rev:` in `.pre-commit-config.yaml` must match; check both tools when bumping either. |
| `pytest-homeassistant-custom-component` | `>=` floor with a `<` cap | it tracks HA core; pinning it would freeze the HA version tested against |
| `vite-plus` | exact, `package.json` | it decides what the committed bundle looks like; the `vite` override names the same version |
| `happy-dom` | exact | it decides what the DOM suites see; the siblings keep one version |
| `lit` | caret | maintained, keeps semver |

- **Dependabot's blind spots.** It bumps the `requirements_test.txt` pin and leaves the hook `rev` alone (it is told to); it bumps `vite-plus` and leaves the override alone. The toolchain test catches the second; nothing catches the first except reading both files.
- **Runtime vs dev.** What the build inlines into the bundle is a `dependency`; a build-time tool is a `devDependency` even though the build needs it. CI's `npm audit --omit=dev` only means something because of that split.
- **Adding a dependency.** The bundle loads on every dashboard, so a new runtime dependency is discussed in an issue first; today the card has `lit` alone. Its licence must be compatible with MIT and its notice must survive the build (`comments: { legal: true }` keeps the `@license` comments). Prefer vendoring a few constants with a provenance comment over depending on a package that exports thousands.

## Translations

Adding or changing a user-visible string means touching four files together: `strings.json`, `translations/en.json`, `translations/de.json`, and `icons.json` for a new entity. hassfest checks the keys in CI, and the German copy uses **du**, never **Sie**.

The card's strings live in `src/localize/languages/{de,en}.json`, with `card` and `editor` namespaces. `src/localize/localize.ts` resolves the language from the card config first, then Home Assistant's, then German, and a missing key falls back to German. `src/editor-form.test.ts` fails on an editor field without a label in either language.

## Home Assistant conventions

- Every `UpdateFailed` and `ConfigEntryNotReady` carries `translation_domain`, `translation_key` and placeholders; never a bare string. The coordinator turns the API's exceptions into them, and `outage.py` turns a sustained upstream failure into the translated states the sensors show.
- Icons live in `icons.json`; `_attr_icon = "mdi:…"` appears nowhere.
- Every platform module sets `PARALLEL_UPDATES = 0`.
- `api.py` imports nothing from Home Assistant or the package: it owns the endpoint, parameters, headers, the maintenance-page check and the `EControlError` hierarchy, and returns decoded bodies and nothing more. Callers pass in the session and the User-Agent, because `const.py` imports HA. `tests/test_api.py` fails on any such import. Outside `api.py`, catch `EControlError`, never `aiohttp`'s errors. `best_refuel.py` is HA-free the same way, so the parity test can run it without Home Assistant.
- The `User-Agent` constant goes on every outbound call and no `Accept-Encoding` is pinned (aiohttp's own offer already gets gzip). The poll floor, the per-entry and domain-wide dynamic cooldowns and the manual-refresh cooldown in the card are fair use towards E-Control, who ask for no more than one request every ten minutes: don't lower them without thinking about the multi-entry install.
- `unique_id` formulas are frozen: changing one wipes every existing install.
- `ATTRIBUTION` in `const.py` is the data-source statement every entity emits and the card shows in its footer. Update it if E-Control changes its wording.
- Diagnostics redact the fields in `TO_REDACT` in `diagnostics.py`, coordinates among them; the set only grows. Test payloads are synthetic: never a real id or credential, not even in a fixture.

## Where things are

| Module | Owns |
|---|---|
| `api.py` | Transport to E-Control's Spritpreisrechner API. HA-free. |
| `coordinator.py` | The poll per entry, the dynamic-mode cooldowns, backoff and the maintenance window. |
| `outage.py` | Sustained-outage detection across entries and the translated states it produces. |
| `best_refuel.py`, `refuel.py` | The cheap-window analysis (a port of the card's) and the recorder history that feeds it. |
| `sensor.py`, `binary_sensor.py` | The price sensors with their station attributes; the cheap-window binary sensors. |
| `config_flow.py`, `diagnostics.py`, `card_registration.py` | The setup and options flows, diagnostics, and the Lovelace resource registration for the bundle. |
| `src/tankstellen-austria-card.ts`, `src/styles.ts` | The card and its styles. |
| `src/editor.ts` | The grouped `ha-form` editor. |
| `src/sparkline.ts`, `src/sparkline-element.ts`, `src/history.ts` | The 7-day chart's geometry, its element, and the history fetch and cache behind it. |
| `src/analytics/best-refuel.ts` | The cheap-window analysis the chart and the facts list read. |
| `src/utils/`, `src/utils.ts` | Pure helpers: config normalisers, entity discovery, price and distance formatting, payment filters, the zoned clock, map links. |
| `src/localize/` | The card strings and their test. |
| `src/shared-render.ts` | The version banner and cache-wipe reload. |

### Adding a card option

Add the key to `TankstellenAustriaCardConfig` in `src/types.ts`, its default to `OPTION_DEFAULTS` in `src/utils/config.ts`, and a field to the group's schema in `src/editor.ts`, with an `editor.*` label in both language packs. The config is grouped on disk (`stations`, `header`, `chart`, `cars`, `footer`); `normaliseConfig` accepts the flat v1 keys too, so an old dashboard keeps working. `card-smoke.test.ts` renders every default and fails when the editor's and the card's disagree.

## Style

- TypeScript strict; the `tsconfig.json` flags are not negotiable, and `vp check` reports no warnings (`denyWarnings`).
- Comments say why, not what; identifiers carry the what.
- The browser floor is ES2022: a copy is sorted in place rather than with `toSorted()`, and no other ES2023 built-in. Imports carry no extension; the bundler resolves them.
- Runtime dependencies are `lit` alone; adding one goes through *Dependencies*.
- Python: `pyproject.toml` is the source of truth for ruff, mypy and coverage; change rules there, never in CI flags or hook args. A rule that is noise in tests goes into `per-file-ignores`, not off.
- German copy uses du.

## Reporting issues

Open an issue with:

- your Home Assistant version and the Tankstellen Austria version
- the diagnostics download: **Settings → Devices & services → Tankstellen Austria** → ⋮ → **Download diagnostics**. Coordinates and the other fields in `TO_REDACT` are redacted before the file is written.
- the steps to reproduce, and the log lines from `custom_components.tankstellen_austria`

A security problem goes through **Report a vulnerability** under the repository's **Security** tab, not a public issue.
