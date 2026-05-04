"""Invariants: Python CARD_VERSION must match both the manifest version
(INTEGRATION_VERSION) AND the card bundle's TS constant.

If CARD_VERSION drifts from the served bundle, HA's frontend WebSocket
check sees a mismatch, shows a reload banner, the reload re-serves the
same mismatched JS, and the banner reappears — infinite loop for every
user on an old card. If CARD_VERSION drifts from manifest.json, a
manifest-only release ships a stale card. Locking both equalities in CI
catches one-sided bumps before they ship.
"""
from __future__ import annotations

import re
from pathlib import Path

from custom_components.tankstellen_austria.const import (
    CARD_VERSION,
    INTEGRATION_VERSION,
)

_TS_CONST = Path(__file__).parent.parent / "src" / "const.ts"
# `\b` word boundaries so a future MY_CARD_VERSION etc. doesn't cross-match.
_TS_PATTERN = re.compile(r'\bCARD_VERSION\b\s*=\s*"([^"]+)"')


def test_card_version_matches_manifest() -> None:
    """`const.py:CARD_VERSION` is the alias `= INTEGRATION_VERSION` — assert it."""
    assert CARD_VERSION == INTEGRATION_VERSION, (
        f"CARD_VERSION drift: const.py={CARD_VERSION!r} vs "
        f"manifest.json={INTEGRATION_VERSION!r} — CARD_VERSION should be "
        "aliased to INTEGRATION_VERSION in const.py"
    )


def test_card_version_matches_ts() -> None:
    """`const.py:CARD_VERSION` must be byte-identical to `src/const.ts:CARD_VERSION`."""
    assert _TS_CONST.is_file(), f"expected TS const at {_TS_CONST}"
    ts_source = _TS_CONST.read_text(encoding="utf-8")
    match = _TS_PATTERN.search(ts_source)
    assert match is not None, (
        f"CARD_VERSION literal not found in {_TS_CONST}; regex may be stale"
    )
    ts_version = match.group(1)
    # Derive expected from INTEGRATION_VERSION (manifest), not from the
    # local const, so a manifest-only bump that forgets src/const.ts
    # also trips this test.
    assert ts_version == INTEGRATION_VERSION, (
        f"CARD_VERSION drift: manifest.json={INTEGRATION_VERSION!r} vs "
        f"src/const.ts={ts_version!r} — bump src/const.ts in the same commit"
    )
