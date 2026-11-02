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
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import pytest

from custom_components.tankstellen_austria import best_refuel
from custom_components.tankstellen_austria.best_refuel import (
    DAY_MS,
    HOUR_MS,
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
    assert (
        result.hour,
        result.hour_end,
        result.alt_hour,
        result.alt_hour_end,
        result.weekday,
    ) == (
        expected["hour"],
        expected["hour_end"],
        expected["alt_hour"],
        expected["alt_hour_end"],
        expected["weekday"],
    )
    facts = expected["facts"]
    assert result.facts is not None
    assert result.facts.daily_range_cents == pytest.approx(facts["daily_range_cents"])
    assert result.facts.noon_days == facts["noon_days"]
    assert result.facts.noon_rise_days == facts["noon_rise_days"]
    assert result.facts.noon_rise_cents == pytest.approx(facts["noon_rise_cents"])
    assert result.facts.cheaper_than_pct == facts["cheaper_than_pct"]
    assert result.facts.dearer_than_pct == facts["dearer_than_pct"]
    conf = expected["confidence"]
    if conf is None:
        assert result.confidence is None
        return
    assert result.confidence is not None
    assert result.confidence.level == conf["level"]
    assert result.confidence.score == pytest.approx(conf["score"], abs=1e-9)
    assert result.confidence.span_days == conf["span_days"]
    assert result.confidence.gap_cents == pytest.approx(conf["gap_cents"])
    assert result.confidence.consistency_pct == conf["consistency_pct"]


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


def test_the_fixture_covers_the_new_cases() -> None:
    """The snapshot must exercise a flat series and two tied clusters."""
    assert EXPECTED["flat price"]["hour"] is None
    assert EXPECTED["two cheap clusters"]["alt_hour"] is not None


def test_mulberry32_matches_the_card() -> None:
    """The first values of the card's PRNG for the shared seed.

    Taken from Node: `mulberry32(0x5eed)` called three times.
    """
    rnd = best_refuel._mulberry32(best_refuel.WEEKDAY_SEED)
    assert [rnd() for _ in range(3)] == pytest.approx(
        [0.7100320369936526, 0.286336648510769, 0.9519026265479624], abs=1e-15
    )


def _days(
    now: float, days: int, pattern: list[tuple[int, float]]
) -> list[tuple[float, float]]:
    points = []
    first = datetime.fromtimestamp(now / 1000, TZ) - timedelta(days=days)
    first = first.replace(hour=0, minute=0, second=0, microsecond=0)
    for d in range(days):
        day = first + timedelta(days=d)
        for hour, price in pattern:
            points.append(((day + timedelta(hours=hour)).timestamp() * 1000, price))
    return points


def test_flat_history_has_no_window_but_facts() -> None:
    now = datetime(2026, 6, 1, tzinfo=TZ).timestamp() * 1000
    result = analyze_best_refuel(_days(now, 28, [(0, 1.5), (12, 1.5)]), now, TZ)
    assert result is not None
    assert (result.hour, result.confidence) == (None, None)
    assert result.facts == best_refuel.DayFacts(
        daily_range_cents=0,
        noon_days=28,
        noon_rise_days=0,
        noon_rise_cents=0,
        cheaper_than_pct=0,
        dearer_than_pct=0,
    )


def test_day_facts_count_the_noon_rise() -> None:
    """Cheap until 12:00, 10 ct dearer until 23:00: a rise on every day."""
    now = datetime(2026, 6, 1, tzinfo=TZ).timestamp() * 1000
    result = analyze_best_refuel(
        _days(now, 28, [(0, 1.5), (12, 1.6), (23, 1.5)]), now, TZ
    )
    assert result is not None and result.facts is not None
    assert result.facts.daily_range_cents == pytest.approx(10)
    assert (result.facts.noon_days, result.facts.noon_rise_days) == (28, 28)
    assert result.facts.noon_rise_cents == pytest.approx(10)
    # The current price is the cheap one; the dear price held 11 of 24 hours.
    assert result.facts.cheaper_than_pct == 46
    assert result.facts.dearer_than_pct == 0


def test_older_history_feeds_only_the_weekday_test() -> None:
    """Twelve weeks: the window still spans 28 days, the weekday has 12 samples."""
    import random

    rnd = random.Random(4)
    now = datetime(2026, 6, 1, tzinfo=TZ).timestamp() * 1000
    first = datetime(2026, 6, 1, tzinfo=TZ) - timedelta(days=84)
    points = []
    for d in range(84):
        day = first + timedelta(days=d)
        level = (rnd.random() - 0.5) * 0.01 - (0.02 if day.weekday() == 1 else 0)
        points.append((day.timestamp() * 1000, 1.5 + level))
        points.append(((day + timedelta(hours=12)).timestamp() * 1000, 1.6 + level))
    result = analyze_best_refuel(points, now, TZ)
    assert result is not None and result.confidence is not None
    assert result.confidence.span_days == 28
    assert result.weekday == 2
    assert result.facts is not None and result.facts.noon_days == 28


def test_two_tied_clusters_cap_the_level_at_medium() -> None:
    now = datetime(2026, 6, 1, tzinfo=TZ).timestamp() * 1000
    pattern = [(0, 1.6), (3, 1.5), (6, 1.6), (21, 1.5), (23, 1.6)]
    result = analyze_best_refuel(_days(now, 28, pattern), now, TZ)
    assert result is not None and result.confidence is not None
    assert (result.hour, result.hour_end) == (3, 6)
    assert (result.alt_hour, result.alt_hour_end) == (21, 23)
    assert result.confidence.level == "medium"


def test_window_gap_is_measured_against_the_hours_outside() -> None:
    """A 13-hour cheap run used to read a gap of zero."""
    now = datetime(2026, 6, 1, tzinfo=TZ).timestamp() * 1000
    result = analyze_best_refuel(
        _days(now, 28, [(0, 1.5), (12, 1.6), (23, 1.5)]), now, TZ
    )
    assert result is not None and result.confidence is not None
    assert window_length(result.hour, result.hour_end) == 13  # type: ignore[arg-type]
    assert result.confidence.gap_cents == pytest.approx(10, abs=0.5)
    assert result.confidence.level == "high"


def test_next_window_start_takes_the_earlier_of_two_windows() -> None:
    now = datetime(2026, 10, 26, 8, 30, tzinfo=TZ)
    assert next_window_start(now, 22, 20) == datetime(2026, 10, 26, 20, tzinfo=TZ)
    assert next_window_start(now, 3, 20) == datetime(2026, 10, 26, 20, tzinfo=TZ)
    assert next_window_start(now, 3, 7) == datetime(2026, 10, 27, 3, tzinfo=TZ)


def test_constants_are_in_use() -> None:
    assert DAY_MS == 24 * HOUR_MS


def test_gap_helpers_need_two_sides() -> None:
    one = best_refuel._Pick(medians=[0.0] + [math.nan] * 6, best_idx=0, min_val=0.0)
    assert best_refuel._weekday_gap_cents(one) is None
    assert best_refuel._window_gap_cents([0.0] * 24, [True] * 24) is None
    assert best_refuel._window_gap_cents(
        [0.0] * 12 + [0.02] * 12, [True] * 12 + [False] * 12
    ) == pytest.approx(2)
