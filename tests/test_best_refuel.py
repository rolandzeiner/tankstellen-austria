"""The Python best-refuel port gives the card's answers.

`fixtures/best_refuel_parity.json` holds the cases, and
`fixtures/__snapshots__/best_refuel_expected.json` what the card's
`analyzeBestRefuel` makes of them in Europe/Vienna. The card's
`src/analytics/best-refuel.parity.test.ts` writes and checks that file.
"""

from __future__ import annotations

import ast
import json
import math
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from custom_components.tankstellen_austria import best_refuel
from custom_components.tankstellen_austria.best_refuel import (
    analyze_best_refuel,
    in_window,
    next_window_start,
    weighted_percentile,
    window_length,
)

FIXTURES = Path(__file__).parent / "fixtures"
FIXTURE = json.loads((FIXTURES / "best_refuel_parity.json").read_text())
EXPECTED = json.loads(
    (FIXTURES / "__snapshots__" / "best_refuel_expected.json").read_text()
)
TZ = ZoneInfo(FIXTURE["time_zone"])
CASES = {c["name"]: c for c in FIXTURE["cases"]}


def test_every_case_has_a_recorded_result() -> None:
    assert set(EXPECTED) == set(CASES)


@pytest.mark.parametrize("name", list(CASES))
def test_matches_the_card(name: str) -> None:
    case = CASES[name]
    points = [(float(t), float(v)) for t, v in case["points"]]
    result = analyze_best_refuel(points, case["now"], TZ)
    expected = EXPECTED[name]
    if expected is None:
        assert result is None
        return
    assert result is not None
    assert result.has_enough_data is expected["hasEnoughData"]
    if not expected["hasEnoughData"]:
        assert result.confidence is None
        return
    assert (result.hour, result.hour_end, result.weekday) == (
        expected["hour"],
        expected["hour_end"],
        expected["weekday"],
    )
    conf = expected["confidence"]
    assert result.confidence is not None
    assert result.confidence.level == conf["level"]
    assert result.confidence.score == pytest.approx(conf["score"], abs=1e-9)
    assert result.confidence.span_days == conf["span_days"]
    assert result.confidence.coverage_pct == conf["coverage_pct"]
    assert result.confidence.gap_cents == pytest.approx(conf["gap_cents"])


def test_the_fixture_covers_both_dst_switches() -> None:
    # 2026-03-29 and 2026-10-25 are Vienna's switch days.
    def covers(name: str, day: str) -> bool:
        case = CASES[name]
        moment = datetime.fromisoformat(day).replace(tzinfo=TZ).timestamp() * 1000
        return case["points"][0][0] < moment < case["now"]

    assert covers("noisy across spring DST", "2026-03-29T12:00")
    assert covers("noisy across autumn DST", "2026-10-25T12:00")


def test_weighted_percentile_edges() -> None:
    assert math.isnan(weighted_percentile([], 0.5))
    assert math.isnan(weighted_percentile([(math.nan, 1), (1.0, 0)], 0.5))
    assert weighted_percentile([(2.0, 1)], 0.9) == 2.0
    entries = [(3.0, 1.0), (1.0, 1.0), (2.0, 1.0)]
    assert weighted_percentile(entries, 0) == 1.0
    assert weighted_percentile(entries, 0.5) == 2.0
    assert weighted_percentile(entries, 1) == 3.0
    # Float error leaves acc a hair under the target: the last value wins.
    assert weighted_percentile([(1.0, 0.1), (2.0, 0.2)], 1) == 2.0


def test_short_history_without_usable_chunks() -> None:
    # Prices that are not numbers produce no chunks at all.
    now = 1_000 * best_refuel.DAY_MS
    t = now - 8 * best_refuel.DAY_MS
    result = analyze_best_refuel([(t, math.nan), (t + 1, math.nan)], now, TZ)
    assert result == best_refuel.BestRefuelResult(has_enough_data=False)


def test_no_week_long_enough_means_not_enough_data() -> None:
    # Ten days of span, but the price was unknown for all but the last day.
    now = 1_000 * best_refuel.DAY_MS
    points = [
        (now - 10 * best_refuel.DAY_MS, math.nan),
        (now - best_refuel.DAY_MS, 1.5),
    ]
    result = analyze_best_refuel(points, now, TZ)
    assert result == best_refuel.BestRefuelResult(has_enough_data=False)


@pytest.mark.parametrize(
    ("start", "end", "inside", "outside"),
    [
        (11, 14, [11, 12, 13], [10, 14]),
        (22, 4, [22, 23, 0, 3], [4, 21]),
        (5, 5, list(range(24)), []),
    ],
)
def test_in_window(start: int, end: int, inside: list[int], outside: list[int]) -> None:
    assert all(in_window(h, start, end) for h in inside)
    assert not any(in_window(h, start, end) for h in outside)


def test_window_length() -> None:
    assert window_length(11, 14) == 3
    assert window_length(22, 4) == 6
    assert window_length(7, 7) == 24


def test_next_window_start() -> None:
    now = datetime(2026, 11, 1, 10, 30, tzinfo=TZ)
    assert next_window_start(now, 22) == datetime(2026, 11, 1, 22, tzinfo=TZ)
    assert next_window_start(now, 6) == datetime(2026, 11, 2, 6, tzinfo=TZ)
    on_the_hour = datetime(2026, 11, 1, 22, tzinfo=TZ)
    assert next_window_start(on_the_hour, 22) == datetime(2026, 11, 2, 22, tzinfo=TZ)


def test_next_window_start_across_the_autumn_switch() -> None:
    # 2026-10-25 has 25 hours; the next 06:00 is still 06:00 local.
    now = datetime(2026, 10, 24, 23, 0, tzinfo=TZ)
    nxt = next_window_start(now, 6)
    assert nxt == datetime(2026, 10, 25, 6, tzinfo=TZ)
    assert (nxt.timestamp() - now.timestamp()) / 3600 == 8


def test_module_stays_free_of_home_assistant() -> None:
    tree = ast.parse(Path(best_refuel.__file__).read_text())
    imported = {
        node.module or "" for node in ast.walk(tree) if isinstance(node, ast.ImportFrom)
    } | {
        alias.name
        for node in ast.walk(tree)
        if isinstance(node, ast.Import)
        for alias in node.names
    }
    assert not any(m.startswith(("homeassistant", ".")) for m in imported)
