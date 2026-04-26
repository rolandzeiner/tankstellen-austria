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

## Local iteration against a live HA box

`./scripts/dev-push.sh` rsyncs the integration to a dev HA Docker container over SSH. The script auto-runs `npm run build` first (skip with `--no-build`), so you can never push stale `www/*.js` by accident. See the script header for prereqs.

After a push:
- **Card JS change** → hard-refresh the browser (⌘⇧R / Ctrl⇧R).
- **Python change** → restart the HA container.

## Verification gate (must pass before pushing)

```bash
pytest tests/ -v
mypy --strict --ignore-missing-imports custom_components/tankstellen_austria
ruff check .
npm run build
```

CI runs the same checks plus hassfest + HACS validation. Failing locally wastes a push.

## Reporting issues

Open an issue with:
- HA version + Tankstellen Austria version
- Diagnostics download (Settings → Devices & Services → Tankstellen Austria → Download diagnostics) — secrets are auto-redacted
- Steps to reproduce
