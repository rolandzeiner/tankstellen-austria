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
from collections.abc import Callable, Iterator, Sequence
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, tzinfo
from itertools import pairwise
from typing import Literal

HOUR_MS = 3_600_000
DAY_MS = 86_400_000
HALF_LIFE_MS = 14 * DAY_MS

# The hour window, the day facts and today's rank read the last four weeks.
# Older history, when the caller has it (long-term statistics), only feeds
# the weekday test, where four observations per weekday are too few.
WINDOW_DAYS = 28
WINDOW_MS = WINDOW_DAYS * DAY_MS

# A price change at noon smaller than this is float noise, not a rise.
NOON_RISE_MIN_EUR = 0.001

# Weeks with less observed time are skipped: their p05/p95 and mean are too
# unstable and would contaminate every bucket entry derived from them.
MIN_WEEK_MS = 3 * DAY_MS

# Adjacent hours within 0.5 ct/l of the cheapest hour join the window.
EXPAND_TOLERANCE_EUR = 0.005

# A bucket needs this many chunks before its median counts.
MIN_BUCKET_COUNT = 3

# Confidence: the window's lead over the rest of the day saturates the gap
# score at this many cents, and the share of window time at or below the
# day's median maps 50 % (chance) -> 0 and 90 % -> 1.
GAP_REF_CENTS = 1.5
CONSISTENCY_CHANCE = 0.5
CONSISTENCY_FULL = 0.9

# A day counts for the consistency check once this much of it was observed.
MIN_DAY_MS = 20 * HOUR_MS

# Weekday: the cheapest weekday is named when its lead over the typical
# weekday is at least this much and a permutation test of the day labels
# finds a lead that large in at most 5 % of shuffles.
MIN_WEEKDAY_GAP_EUR = 0.005
WEEKDAY_PERMUTATIONS = 200
WEEKDAY_P_MAX = 0.05
WEEKDAY_SEED = 0x5EED

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
    gap_cents: float
    consistency_pct: int


@dataclass(frozen=True, slots=True)
class DayFacts:
    """Counted facts about the last four weeks, shown next to the tip.

    Each is a plain measurement with its sample size, not a model output:
    how much the price moves over a typical day, on how many days it rose
    at noon and by how much, and where today's price sits in the four
    weeks of prices (the share of time that was dearer, and cheaper).
    """

    daily_range_cents: float
    noon_days: int
    noon_rise_days: int
    noon_rise_cents: float
    cheaper_than_pct: int
    dearer_than_pct: int


@dataclass(frozen=True, slots=True)
class BestRefuelResult:
    """The recommended window.

    Only `has_enough_data` is set when the history is short. With enough
    data but no hour of the day cheaper than the rest, `hour` stays None:
    there is no window to recommend. `alt_hour` names a second, disjoint
    run of hours that is about as cheap as the window, when there is one.
    """

    has_enough_data: bool
    hour: int | None = None
    hour_end: int | None = None
    alt_hour: int | None = None
    alt_hour_end: int | None = None
    weekday: int | None = None
    confidence: Confidence | None = None
    facts: DayFacts | None = None


@dataclass(frozen=True, slots=True)
class _Chunk:
    price: float
    t: float
    hour: int
    weekday: int
    day_key: int
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
                    day_key=local.date().toordinal(),
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


def _lower_median(values: list[float]) -> float:
    ordered = sorted(values)
    return ordered[(len(ordered) - 1) // 2]


def _weekday_gap_cents(pick: _Pick) -> float | None:
    """Median of the weekday medians minus the cheapest one, in cents."""
    valid = [m for m in pick.medians if not math.isnan(m)]
    if len(valid) < 2 or pick.best_idx < 0:
        return None
    return (_lower_median(valid) - pick.min_val) * 100


def _window_gap_cents(medians: list[float], inside: list[bool]) -> float | None:
    """Median of the hour medians outside the window minus the one inside.

    Measured against the hours outside rather than against all 24: under
    the noon rule the cheap run is often half the day or more, and the
    median of all hours would then sit inside the window and read zero.
    """
    outside = [
        m for m, i in zip(medians, inside, strict=True) if not i and not math.isnan(m)
    ]
    within = [
        m for m, i in zip(medians, inside, strict=True) if i and not math.isnan(m)
    ]
    if not outside or not within:
        return None
    return (_lower_median(outside) - _lower_median(within)) * 100


def _consistency(chunks: list[_Chunk], inside: list[bool]) -> float | None:
    """Share of window time at or below its day's duration-weighted median.

    Pooled over the days with at least MIN_DAY_MS observed. Noise with no
    time-of-day pattern lands near 0.5, a pattern that holds every day
    near 1. Raw prices, so a week with an odd level counts like any other.
    """
    days: dict[int, list[_Chunk]] = {}
    for c in chunks:
        days.setdefault(c.day_key, []).append(c)
    below = 0.0
    total = 0.0
    for day_chunks in days.values():
        observed = 0.0
        for c in day_chunks:
            observed += c.duration_ms
        if observed < MIN_DAY_MS:
            continue
        day_median = weighted_percentile(
            [(c.price, c.duration_ms) for c in day_chunks], 0.5
        )
        for c in day_chunks:
            if inside[c.hour]:
                total += c.duration_ms
                if c.price <= day_median:
                    below += c.duration_ms
    return below / total if total > 0 else None


def _day_facts(chunks: list[_Chunk], current: float) -> DayFacts:
    """Measure the four-week facts; see DayFacts."""
    days: dict[int, list[_Chunk]] = {}
    for c in chunks:
        days.setdefault(c.day_key, []).append(c)
    ranges: list[float] = []
    noon_days = 0
    rise_days = 0
    rise_sum = 0.0
    for day_chunks in days.values():
        observed = 0.0
        for c in day_chunks:
            observed += c.duration_ms
        if observed < MIN_DAY_MS:
            continue
        ranges.append(
            max(c.price for c in day_chunks) - min(c.price for c in day_chunks)
        )
        # The price in force just before 12:00 against the one at 13:00,
        # when a legal noon rise has landed whatever its minute.
        before = [c for c in day_chunks if c.hour == 11]
        after = [c for c in day_chunks if c.hour == 13]
        if not before or not after:
            continue
        noon_days += 1
        diff = (
            min(after, key=lambda c: c.t).price - max(before, key=lambda c: c.t).price
        )
        if diff > NOON_RISE_MIN_EUR:
            rise_days += 1
            rise_sum += diff
    dearer_ms = 0.0
    cheaper_ms = 0.0
    total_ms = 0.0
    for c in chunks:
        total_ms += c.duration_ms
        if c.price > current:
            dearer_ms += c.duration_ms
        elif c.price < current:
            cheaper_ms += c.duration_ms
    return DayFacts(
        daily_range_cents=_js_round(_lower_median(ranges) * 1000) / 10 if ranges else 0,
        noon_days=noon_days,
        noon_rise_days=rise_days,
        noon_rise_cents=_js_round(rise_sum / rise_days * 1000) / 10 if rise_days else 0,
        cheaper_than_pct=_js_round(dearer_ms / total_ms * 100) if total_ms else 0,
        dearer_than_pct=_js_round(cheaper_ms / total_ms * 100) if total_ms else 0,
    )


def _mulberry32(seed: int) -> Callable[[], float]:
    """The card's PRNG, bit for bit, so both sides shuffle the same way."""
    a = seed & 0xFFFFFFFF

    def rnd() -> float:
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xFFFFFFFF
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xFFFFFFFF)) ^ t) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return rnd


def _weekday_if_significant(entries: list[tuple[float, float, int, int]]) -> int | None:
    """The cheapest weekday, when its lead survives a permutation test.

    `entries` are (value, weight, weekday, day_key). The test shuffles
    which calendar day carries which weekday label and asks how often a
    lead at least as large as the observed one appears by chance. With
    four weeks of history every weekday rests on about four days, so a
    lead alone says little; this is what keeps noise from naming a day.
    """
    buckets: list[list[tuple[float, float]]] = [[] for _ in range(7)]
    for value, weight, weekday, _ in entries:
        buckets[weekday].append((value, weight))
    pick = _pick_best(buckets)
    observed = _weekday_gap_cents(pick)
    if observed is None or observed < MIN_WEEKDAY_GAP_EUR * 100:
        return None

    days = sorted({e[3] for e in entries})
    label_of = {e[3]: e[2] for e in entries}
    labels = [label_of[d] for d in days]
    by_day: dict[int, list[tuple[float, float]]] = {d: [] for d in days}
    for value, weight, _, day_key in entries:
        by_day[day_key].append((value, weight))

    rnd = _mulberry32(WEEKDAY_SEED)
    at_least = 0
    for _ in range(WEEKDAY_PERMUTATIONS):
        for i in range(len(labels) - 1, 0, -1):
            j = math.floor(rnd() * (i + 1))
            labels[i], labels[j] = labels[j], labels[i]
        shuffled: list[list[tuple[float, float]]] = [[] for _ in range(7)]
        for d, label in zip(days, labels, strict=True):
            shuffled[label].extend(by_day[d])
        gap = _weekday_gap_cents(_pick_best(shuffled))
        if gap is not None and gap >= observed:
            at_least += 1
    p_value = (at_least + 1) / (WEEKDAY_PERMUTATIONS + 1)
    return pick.best_idx if p_value <= WEEKDAY_P_MAX else None


def _expand_hour_window(
    medians: list[float], seed: int, min_val: float
) -> tuple[int, int] | None:
    """Grow the window from the seed hour while neighbours stay within tolerance.

    None when every hour is within tolerance: then no time of day is
    cheaper than the rest and there is no window to recommend.
    """

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
    if forward + backward + 1 >= 24:
        return None
    return (seed - backward + 24) % 24, (seed + forward + 1) % 24


def _inside(start: int, end: int) -> list[bool]:
    return [in_window(h, start, end) for h in range(24)]


def _alt_window(
    medians: list[float], inside: list[bool], min_val: float
) -> tuple[int, int] | None:
    """A second run of hours, outside the window, about as cheap as it.

    Seeded at the cheapest such hour and grown with the same tolerance; it
    cannot reach the window, since the hours between were out of tolerance.
    """
    seed = -1
    seed_val = math.inf
    for h, m in enumerate(medians):
        if inside[h] or math.isnan(m) or m - min_val > EXPAND_TOLERANCE_EUR:
            continue
        if m < seed_val:
            seed_val = m
            seed = h
    if seed < 0:
        return None
    return _expand_hour_window(medians, seed, min_val)


def analyze_best_refuel(
    points: Sequence[tuple[float, float]], now: float, tz: tzinfo
) -> BestRefuelResult | None:
    """Recommend the cheapest hour window from (epoch ms, price) points.

    Points must be sorted by time. Returns None for fewer than two points
    and `has_enough_data=False` for under a week of history. Points older
    than WINDOW_DAYS only strengthen the weekday test.
    """
    if len(points) < 2:
        return None

    span = min(now - points[0][0], WINDOW_MS)
    if span < 7 * DAY_MS:
        return BestRefuelResult(has_enough_data=False)

    chunks = _walk_chunks(points, now, tz)
    recent = [c for c in chunks if c.t >= now - WINDOW_MS]
    if not recent:
        return BestRefuelResult(has_enough_data=False)
    facts = _day_facts(recent, points[-1][1])

    hour_buckets: list[list[tuple[float, float]]] = [[] for _ in range(24)]
    weekday_entries: list[tuple[float, float, int, int]] = []

    for week_chunks, total_ms, p05, p95 in _winsorised_weeks(chunks):
        weighted_sum = 0.0
        for c in week_chunks:
            weighted_sum += _clamp(c.price, p05, p95) * c.duration_ms
        week_mean = weighted_sum / total_ms
        for c in week_chunks:
            recency = math.pow(0.5, (now - c.t) / HALF_LIFE_MS)
            value = _clamp(c.price, p05, p95) - week_mean
            weight = c.duration_ms * recency
            if c.t >= now - WINDOW_MS:
                hour_buckets[c.hour].append((value, weight))
            weekday_entries.append((value, weight, c.weekday, c.day_key))

    hour_pick = _pick_best(hour_buckets)
    if hour_pick.best_idx < 0:
        return BestRefuelResult(has_enough_data=False)

    window = _expand_hour_window(
        hour_pick.medians, hour_pick.best_idx, hour_pick.min_val
    )
    if window is None:
        return BestRefuelResult(has_enough_data=True, facts=facts)
    start, end = window
    inside = _inside(start, end)
    alt = _alt_window(hour_pick.medians, inside, hour_pick.min_val)
    covered = inside
    if alt is not None:
        covered = [a or b for a, b in zip(inside, _inside(*alt), strict=True)]

    # Confidence: sample size (span) and effect size (gap) are averaged,
    # then scaled by how reliably the window beat its day. Noise with no
    # time-of-day pattern sits at chance there and scores zero however
    # large its gap looks.
    span_days = span / DAY_MS
    span_score = min(1, span_days / 28)
    gap = _window_gap_cents(hour_pick.medians, inside) or 0
    gap_score = _clamp(gap / GAP_REF_CENTS, 0, 1)
    consistency = _consistency(recent, covered)
    consistency_score = (
        0
        if consistency is None
        else _clamp(
            (consistency - CONSISTENCY_CHANCE)
            / (CONSISTENCY_FULL - CONSISTENCY_CHANCE),
            0,
            1,
        )
    )
    score = (span_score + gap_score) / 2 * consistency_score
    level: ConfidenceLevel = (
        "high" if score >= 0.75 else "medium" if score >= 0.5 else "low"
    )
    # A second run as cheap as the window: a single day of history can
    # swap which one is named, so the badge never claims High.
    if alt is not None and level == "high":
        level = "medium"

    return BestRefuelResult(
        has_enough_data=True,
        hour=start,
        hour_end=end,
        alt_hour=None if alt is None else alt[0],
        alt_hour_end=None if alt is None else alt[1],
        weekday=_weekday_if_significant(weekday_entries),
        confidence=Confidence(
            level=level,
            score=score,
            span_days=_js_round(span_days),
            gap_cents=_js_round(gap * 10) / 10,
            consistency_pct=_js_round((consistency or 0) * 100),
        ),
        facts=facts,
    )


def window_length(start: int, end: int) -> int:
    """Hours in the circular window [start, end); equal ends mean all day."""
    return (end - start) % 24 or 24


def in_window(hour: int, start: int, end: int) -> bool:
    """Whether a local clock hour falls inside the circular window."""
    return (hour - start) % 24 < window_length(start, end)


def next_window_start(now: datetime, *starts: int) -> datetime:
    """The next local time, strictly after `now`, at which a window opens."""
    tz = now.tzinfo
    candidates: list[datetime] = []
    for start in starts:
        candidate = datetime.combine(now.date(), time(start), tzinfo=tz)
        if candidate <= now:
            candidate = datetime.combine(
                now.date() + timedelta(days=1), time(start), tzinfo=tz
            )
        candidates.append(candidate)
    return min(candidates)
