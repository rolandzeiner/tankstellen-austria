"""The cheap-window entities and the recorder read behind them."""

from __future__ import annotations

from collections.abc import Iterator
from datetime import datetime, timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch
from zoneinfo import ZoneInfo

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.tankstellen_austria import refuel
from custom_components.tankstellen_austria.const import (
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
)

from .conftest import MOCK_STATION, make_entry

VIENNA = ZoneInfo("Europe/Vienna")
BINARY = "binary_sensor.test_diesel_cheap_window"
NEXT = "sensor.test_diesel_next_cheap_window"
CHEAP = 1.5
EXPENSIVE = 1.6


def _cheap_nights(now: datetime, days: int = 28) -> list[tuple[float, float]]:
    """Cheap from 22:00 to 04:00, local, for `days` days before `now`."""
    points: list[tuple[float, float]] = []
    first = (now - timedelta(days=days)).date()
    for d in range(days + 1):
        day = first + timedelta(days=d)
        for hour, price in ((0, CHEAP), (4, EXPENSIVE), (22, CHEAP)):
            t = datetime(day.year, day.month, day.day, hour, tzinfo=VIENNA)
            if t < now:
                points.append((t.timestamp() * 1000, price))
    return points


class _Recorder:
    """Stands in for the recorder instance: runs the job in HA's executor."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass

    def async_add_executor_job(self, target: Any, *args: Any) -> Any:
        return self._hass.async_add_executor_job(target, *args)


@pytest.fixture
def history() -> Iterator[MagicMock]:
    """Stub the recorder for the whole test, refreshes after setup included."""
    stub = MagicMock(return_value=[])
    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new_callable=AsyncMock,
            return_value=[MOCK_STATION],
        ),
        patch.object(refuel, "get_instance", side_effect=_Recorder),
        patch.object(refuel, "_history_points", stub),
    ):
        yield stub


async def _setup(
    hass: HomeAssistant,
    *,
    recorder: bool = True,
    fuel_types: list[str] | None = None,
    data: dict[str, Any] | None = None,
) -> None:
    await hass.config.async_set_time_zone("Europe/Vienna")
    if recorder:
        hass.config.components.add("recorder")
    entry = make_entry(data={CONF_FUEL_TYPES: fuel_types or ["DIE"], **(data or {})})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


async def test_on_inside_the_window_off_outside(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, history: MagicMock
) -> None:
    now = datetime(2026, 10, 26, 1, 30, tzinfo=VIENNA)
    freezer.move_to(now)
    history.return_value = _cheap_nights(now)
    await _setup(hass)

    state = hass.states.get(BINARY)
    assert state is not None
    assert state.state == "on"
    assert state.attributes["friendly_name"] == "Test Diesel cheap window"
    assert state.attributes["start_hour"] == 22
    assert state.attributes["end_hour"] == 4
    assert state.attributes["weekday"] is None
    assert state.attributes["confidence"] == "high"
    assert state.attributes["coverage_pct"] == 100
    nxt = hass.states.get(NEXT)
    assert nxt is not None
    assert dt_util.parse_datetime(nxt.state) == datetime(
        2026, 10, 26, 22, tzinfo=VIENNA
    )

    # The window closes at 04:00; the hourly tick writes the new state.
    four = datetime(2026, 10, 26, 4, 0, tzinfo=VIENNA)
    freezer.move_to(four)
    async_fire_time_changed(hass, four)
    await hass.async_block_till_done()
    assert hass.states.get(BINARY).state == "off"


async def test_unknown_with_too_little_history(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, history: MagicMock
) -> None:
    now = datetime(2026, 10, 26, 12, 0, tzinfo=VIENNA)
    freezer.move_to(now)
    history.return_value = _cheap_nights(now, days=3)
    await _setup(hass)

    assert hass.states.get(BINARY).state == "unknown"
    assert hass.states.get(NEXT).state == "unknown"
    assert "start_hour" not in hass.states.get(BINARY).attributes


@pytest.mark.usefixtures("history")
async def test_unknown_without_any_history(hass: HomeAssistant) -> None:
    await _setup(hass)
    assert hass.states.get(BINARY).state == "unknown"


async def test_unavailable_without_the_recorder(
    hass: HomeAssistant, history: MagicMock
) -> None:
    await _setup(hass, recorder=False)
    assert hass.states.get(BINARY).state == "unavailable"
    assert hass.states.get(NEXT).state == "unavailable"
    history.assert_not_called()


async def test_reads_each_price_sensor(hass: HomeAssistant, history: MagicMock) -> None:
    await _setup(hass, fuel_types=["DIE", "SUP"])

    called = sorted(call.args[1] for call in history.call_args_list)
    assert called == ["sensor.test_diesel", "sensor.test_super_95"]
    start, end = history.call_args_list[0].args[2:]
    assert end - start == timedelta(days=refuel.HISTORY_DAYS)


async def test_skips_a_fuel_type_whose_price_sensor_is_gone(
    hass: HomeAssistant, history: MagicMock
) -> None:
    await _setup(hass)
    entry = hass.config_entries.async_entries("tankstellen_austria")[0]
    er.async_get(hass).async_remove("sensor.test_diesel")
    history.reset_mock()
    await entry.runtime_data.best_refuel.async_refresh()
    history.assert_not_called()
    assert entry.runtime_data.best_refuel.data == {"DIE": None}


async def test_none_in_dynamic_mode(hass: HomeAssistant, history: MagicMock) -> None:
    hass.states.async_set(
        "device_tracker.phone", "home", {"latitude": 48.2, "longitude": 16.4}
    )
    await _setup(hass, data={CONF_DYNAMIC_ENTITY: "device_tracker.phone"})

    assert hass.states.get("sensor.test_diesel") is not None
    assert hass.states.get(BINARY) is None
    assert hass.states.get(NEXT) is None
    history.assert_not_called()
