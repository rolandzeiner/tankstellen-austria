"""Best-refuel-time analysis: when in the day is fuel typically cheapest.

A line-for-line port of the card's `src/analytics/best-refuel.ts`, so the
"Cheap window" entities and the card's refuel tip give the same answer for
the same history. `tests/fixtures/best_refuel_parity.json` holds cases run
through both; change one side and its parity test fails until the other
follows.

Like `api.py`, this module must not import Home Assistant: it takes the
price history, `now` and the local time zone as arguments, which keeps it
testable without a recorder.

What the input is: the price sensor's state history, which is the running
minimum over the nearby stations, not one station's posted price. The
TypeScript file explains what that means for reading the result.

Times are epoch milliseconds, as in the card, so every sum, threshold and
rounding runs on the same numbers. Weekdays use JavaScript's numbering
(0 = Sunday) for the same reason: the seed is the *first* minimum in index
order, and a different numbering would break ties differently.
"""

from __future__ import annotations

import math
from collections.abc import Iterator, Sequence
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, tzinfo
from itertools import pairwise
from typing import Literal

HOUR_MS = 3_600_000
DAY_MS = 86_400_000
HALF_LIFE_MS = 14 * DAY_MS

# Weeks with less observed time are skipped: their p05/p95 and mean are too
# unstable and would contaminate every bucket entry derived from them.
MIN_WEEK_MS = 3 * DAY_MS

# Adjacent hours within 0.5 ct/l of the cheapest hour join the window.
EXPAND_TOLERANCE_EUR = 0.005

# A bucket needs this many chunks before its median counts.
MIN_BUCKET_COUNT = 3

WEEKDAY_NAMES = (
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
)

type ConfidenceLevel = Literal["high", "medium", "low"]


@dataclass(frozen=True, slots=True)
class Confidence:
    """How much the recommendation can be trusted, and why."""

    level: ConfidenceLevel
    score: float
    span_days: int
    coverage_pct: int
    gap_cents: float


@dataclass(frozen=True, slots=True)
class BestRefuelResult:
    """The recommended window; only `has_enough_data` when the history is short."""

    has_enough_data: bool
    hour: int | None = None
    hour_end: int | None = None
    weekday: int | None = None
    confidence: Confidence | None = None


@dataclass(frozen=True, slots=True)
class _Chunk:
    price: float
    t: float
    hour: int
    weekday: int
    week_key: int
    duration_ms: float


@dataclass(frozen=True, slots=True)
class _Pick:
    medians: list[float]
    best_idx: int
    min_val: float


def _clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def _js_round(v: float) -> int:
    """Math.round: halves go up, where Python's round() goes to even."""
    return math.floor(v + 0.5)


def weighted_percentile(entries: Sequence[tuple[float, float]], q: float) -> float:
    """Weighted quantile of (value, weight) pairs, type-1 "lower" convention."""
    usable = [e for e in entries if math.isfinite(e[0]) and e[1] > 0]
    if not usable:
        return math.nan
    if len(usable) == 1:
        return usable[0][0]
    ordered = sorted(usable, key=lambda e: e[0])
    total = 0.0
    for e in ordered:
        total += e[1]
    target = _clamp(q, 0, 1) * total
    acc = 0.0
    for value, weight in ordered:
        acc += weight
        if acc >= target:
            return value
    return ordered[-1][0]


def _local(t_ms: float, tz: tzinfo) -> datetime:
    return datetime.fromtimestamp(t_ms / 1000, tz)


def _js_weekday(d: date) -> int:
    return (d.weekday() + 1) % 7


def _monday_key(local: datetime) -> int:
    day = local.date()
    return (day - timedelta(days=day.weekday())).toordinal()


def _walk_chunks(
    points: Sequence[tuple[float, float]], now: float, tz: tzinfo
) -> list[_Chunk]:
    """Split each step interval at every hour boundary it crosses."""
    out: list[_Chunk] = []

    def emit(price: float, start: float, end: float) -> None:
        if end <= start or not math.isfinite(price):
            return
        cursor = start
        while cursor < end:
            next_hour = math.floor(cursor / HOUR_MS) * HOUR_MS + HOUR_MS
            chunk_end = min(end, next_hour)
            local = _local(cursor, tz)
            out.append(
                _Chunk(
                    price=price,
                    t=cursor,
                    hour=local.hour,
                    weekday=_js_weekday(local.date()),
                    week_key=_monday_key(local),
                    duration_ms=chunk_end - cursor,
                )
            )
            cursor = chunk_end

    for (t, value), (t_next, _) in pairwise(points):
        emit(value, t, t_next)
    last_t, last_value = points[-1]
    emit(last_value, last_t, now)
    return out


def _winsorised_weeks(
    chunks: list[_Chunk],
) -> Iterator[tuple[list[_Chunk], float, float, float]]:
    """Yield (chunks, observed ms, p05, p95) for every week long enough to use."""
    weeks: dict[int, list[_Chunk]] = {}
    for c in chunks:
        weeks.setdefault(c.week_key, []).append(c)
    for week_chunks in weeks.values():
        total_ms = 0.0
        for c in week_chunks:
            total_ms += c.duration_ms
        if total_ms < MIN_WEEK_MS:
            continue
        entries = [(c.price, c.duration_ms) for c in week_chunks]
        yield (
            week_chunks,
            total_ms,
            weighted_percentile(entries, 0.05),
            weighted_percentile(entries, 0.95),
        )


def _pick_best(buckets: list[list[tuple[float, float]]]) -> _Pick:
    medians = [
        weighted_percentile(b, 0.5) if len(b) >= MIN_BUCKET_COUNT else math.nan
        for b in buckets
    ]
    best_idx = -1
    best_val = math.inf
    for i, m in enumerate(medians):
        if not math.isnan(m) and m < best_val:
            best_val = m
            best_idx = i
    return _Pick(medians=medians, best_idx=best_idx, min_val=best_val)


def _gap_cents(pick: _Pick) -> float | None:
    """Median of the bucket medians minus the cheapest one, in cents."""
    valid = sorted(m for m in pick.medians if not math.isnan(m))
    if len(valid) < 2:
        return None
    return (valid[(len(valid) - 1) // 2] - pick.min_val) * 100


def _score_separation(pick: _Pick, ref_cents: float) -> float:
    gap = _gap_cents(pick)
    if gap is None or pick.best_idx < 0:
        return 0
    return _clamp(gap / ref_cents, 0, 1)


def _expand_hour_window(
    medians: list[float], seed: int, min_val: float
) -> tuple[int, int]:
    """Grow the window from the seed hour while neighbours stay within tolerance."""

    def within(m: float) -> bool:
        return not math.isnan(m) and m - min_val <= EXPAND_TOLERANCE_EUR

    forward = 0
    for step in range(1, 24):
        if not within(medians[(seed + step) % 24]):
            break
        forward = step
    backward = 0
    for step in range(1, 24):
        if not within(medians[(seed - step + 24) % 24]):
            break
        backward = step
    return (seed - backward + 24) % 24, (seed + forward + 1) % 24


def analyze_best_refuel(
    points: Sequence[tuple[float, float]], now: float, tz: tzinfo
) -> BestRefuelResult | None:
    """Recommend the cheapest hour window from (epoch ms, price) points.

    Points must be sorted by time. Returns None for fewer than two points
    and `has_enough_data=False` for under a week of history.
    """
    if len(points) < 2:
        return None

    span = now - points[0][0]
    if span < 7 * DAY_MS:
        return BestRefuelResult(has_enough_data=False)

    chunks = _walk_chunks(points, now, tz)
    if not chunks:
        return BestRefuelResult(has_enough_data=False)

    hour_buckets: list[list[tuple[float, float]]] = [[] for _ in range(24)]
    weekday_buckets: list[list[tuple[float, float]]] = [[] for _ in range(7)]

    for week_chunks, total_ms, p05, p95 in _winsorised_weeks(chunks):
        weighted_sum = 0.0
        for c in week_chunks:
            weighted_sum += _clamp(c.price, p05, p95) * c.duration_ms
        week_mean = weighted_sum / total_ms
        for c in week_chunks:
            recency = math.pow(0.5, (now - c.t) / HALF_LIFE_MS)
            entry = (_clamp(c.price, p05, p95) - week_mean, c.duration_ms * recency)
            hour_buckets[c.hour].append(entry)
            weekday_buckets[c.weekday].append(entry)

    hour_pick = _pick_best(hour_buckets)
    if hour_pick.best_idx < 0:
        return BestRefuelResult(has_enough_data=False)
    weekday_pick = _pick_best(weekday_buckets)

    # UX calibration constants, shared with the card: 1.5 ct and 0.8 ct
    # reference gaps, 0.75 / 0.5 level thresholds.
    span_days = span / DAY_MS
    span_score = min(1, span_days / 28)

    hour_coverage = sum(len(b) >= MIN_BUCKET_COUNT for b in hour_buckets) / 24
    hour_sep = _score_separation(hour_pick, 1.5)
    hour_gap = _gap_cents(hour_pick) or 0
    hour_confidence = (span_score + hour_coverage + hour_sep) / 3
    level: ConfidenceLevel = (
        "high"
        if hour_confidence >= 0.75
        else "medium"
        if hour_confidence >= 0.5
        else "low"
    )

    weekday_coverage = sum(len(b) >= MIN_BUCKET_COUNT for b in weekday_buckets) / 7
    weekday_sep = _score_separation(weekday_pick, 0.8)
    weekday_confidence = (
        (span_score + weekday_coverage + weekday_sep) / 3
        if weekday_pick.best_idx >= 0
        else 0
    )

    start, end = _expand_hour_window(
        hour_pick.medians, hour_pick.best_idx, hour_pick.min_val
    )
    return BestRefuelResult(
        has_enough_data=True,
        hour=start,
        hour_end=end,
        weekday=weekday_pick.best_idx if weekday_confidence >= 0.75 else None,
        confidence=Confidence(
            level=level,
            score=hour_confidence,
            span_days=_js_round(span_days),
            coverage_pct=_js_round(hour_coverage * 100),
            gap_cents=_js_round(hour_gap * 10) / 10,
        ),
    )


def window_length(start: int, end: int) -> int:
    """Hours in the circular window [start, end); equal ends mean all day."""
    return (end - start) % 24 or 24


def in_window(hour: int, start: int, end: int) -> bool:
    """Whether a local clock hour falls inside the circular window."""
    return (hour - start) % 24 < window_length(start, end)


def next_window_start(now: datetime, start: int) -> datetime:
    """The next local time, strictly after `now`, at which the window opens."""
    tz = now.tzinfo
    candidate = datetime.combine(now.date(), time(start), tzinfo=tz)
    if candidate <= now:
        candidate = datetime.combine(
            now.date() + timedelta(days=1), time(start), tzinfo=tz
        )
    return candidate
