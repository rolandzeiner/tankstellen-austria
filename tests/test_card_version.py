"""Invariant: Python CARD_VERSION must match the card bundle's TS constant.

If these drift, HA's frontend WebSocket check sees a mismatch, shows a
reload banner, the reload re-serves the same mismatched JS, and the
banner reappears — infinite loop for every user on an old card.
Locking the equality in a test catches one-sided bumps in CI before they
ship.
"""
from __future__ import annotations

import re
from pathlib import Path

from custom_components.tankstellen_austria.const import CARD_VERSION

_TS_CONST = Path(__file__).parent.parent / "src" / "const.ts"
_TS_PATTERN = re.compile(r'CARD_VERSION\s*=\s*"([^"]+)"')


def test_card_version_matches_ts() -> None:
    """`const.py:CARD_VERSION` must be byte-identical to `src/const.ts:CARD_VERSION`."""
    assert _TS_CONST.is_file(), f"expected TS const at {_TS_CONST}"
    ts_source = _TS_CONST.read_text(encoding="utf-8")
    match = _TS_PATTERN.search(ts_source)
    assert match is not None, (
        f"CARD_VERSION literal not found in {_TS_CONST}; regex may be stale"
    )
    ts_version = match.group(1)
    assert ts_version == CARD_VERSION, (
        f"CARD_VERSION drift: const.py={CARD_VERSION!r} vs "
        f"src/const.ts={ts_version!r} — bump both in the same commit"
    )
