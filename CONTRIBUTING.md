# Contributing to Tankstellen Austria

Thanks for taking the time to look. This file is the single answer to "how do I work on this repo?" — read it once and you'll have everything you need.

## Dev setup

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements_test.txt pre-commit
pre-commit install      # runs ruff + mypy + checks on every commit

npm ci                  # Lovelace card deps
npm run build           # produces custom_components/tankstellen_austria/www/tankstellen-austria-card.js
```

## Branching & releases

- Work on `dev`. PRs target `dev`.
- Releases are tagged from `main` after merging `dev → main`.
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

## Card-version sync

`src/const.ts` `CARD_VERSION` and `custom_components/tankstellen_austria/const.py` `CARD_VERSION` **must stay byte-identical** — `tests/test_card_version.py` enforces it. Bump both in the same commit. If they drift, users get an infinite reload-banner loop.

`README.md` badge + `manifest.json` stay at the clean (non-beta) version; `const.py` + the TS constant can carry a `-beta-N` suffix during development.

## Tooling & config

- `pyproject.toml` — source of truth for ruff (target-version, line-length), mypy (strict, ignore_missing_imports, files), and coverage config. Change rules here, not in CI flags.
- `pytest.ini` — pytest config and the **`--cov-fail-under=90` coverage gate**. `pytest tests/` automatically runs with coverage; CI fails fast if a new commit drops coverage below the gate. Current measurement sits ~93%, so you have ~3pts of headroom before the gate bites.
- `ATTRIBUTION` — canonical data-source statement (E-Control Spritpreisrechner) and licence terms; matches the `attribution` attribute every sensor emits. Update when the upstream API or licence wording changes.

View per-file coverage locally:

```bash
pytest tests/ --cov-report=term-missing
```

## Verification gate (must pass before pushing)

```bash
pytest tests/ -v                                               # Python integration
mypy --strict --ignore-missing-imports custom_components/tankstellen_austria
ruff check .
npx tsc --noEmit                                               # TypeScript card type-check
npm test                                                       # Vitest — frontend analytics
npm run build                                                  # Rollup card bundle
```

The frontend tests live in `src/**/*.test.ts` (vitest, no config file — picks up the `*.test.ts` convention). The current focus is `src/analytics/best-refuel.test.ts`, which pins the duration-weighted bucketing against a synthetic noon-hike fixture and is anchored to a Monday-aligned `now` so it's deterministic regardless of the day-of-week the suite runs.

CI runs the same checks plus hassfest + HACS validation. Failing locally wastes a push.

## Reporting issues

Open an issue with:
- HA version + Tankstellen Austria version
- Diagnostics download (Settings → Devices & Services → Tankstellen Austria → Download diagnostics) — secrets are auto-redacted
- Steps to reproduce
