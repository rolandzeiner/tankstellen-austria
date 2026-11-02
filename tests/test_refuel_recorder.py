"""The cheap-window history reads, against a real (in-memory) recorder.

Its own module because the recorder must start before `hass`, and the
conftest's autouse fixture starts `hass` first; the override below puts
`recorder_mock` ahead of it for this module only.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.components.recorder.models import (
    StatisticData,
    StatisticMeanType,
    StatisticMetaData,
)
from homeassistant.components.recorder.statistics import async_import_statistics
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.components.recorder.common import (
    async_wait_recording_done,
)

from custom_components.tankstellen_austria import refuel


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock, enable_custom_integrations):
    """Start the recorder before `hass`, then enable custom integrations."""


async def test_history_points_from_the_recorder(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    start = datetime(2026, 10, 1, tzinfo=ZoneInfo("Europe/Vienna"))
    entity_id = "sensor.price"
    for offset, value in (
        (timedelta(days=-1), "1.519"),
        (timedelta(hours=2), "unavailable"),
        (timedelta(hours=3), "1.499"),
        (timedelta(hours=4), "inf"),
    ):
        freezer.move_to(start + offset)
        hass.states.async_set(entity_id, value)
        await hass.async_block_till_done()
    await async_wait_recording_done(hass)

    points = await refuel.get_instance(hass).async_add_executor_job(
        refuel._history_points, hass, entity_id, start, start + timedelta(hours=5)
    )
    start_ms = start.timestamp() * 1000
    # The state already in force at `start` is dated `start`; states that
    # are not a finite number are left out.
    assert points == [(start_ms, 1.519), (start_ms + 3 * 3_600_000, 1.499)]


async def test_statistics_points_from_the_recorder(hass: HomeAssistant) -> None:
    start = datetime(2026, 10, 1, tzinfo=ZoneInfo("Europe/Vienna"))
    entity_id = "sensor.price"
    async_import_statistics(
        hass,
        StatisticMetaData(
            has_sum=False,
            mean_type=StatisticMeanType.ARITHMETIC,
            name=None,
            source="recorder",
            statistic_id=entity_id,
            unit_class=None,
            unit_of_measurement="€/l",
        ),
        [
            StatisticData(start=start, mean=1.519, min=1.5, max=1.53),
            StatisticData(
                start=start + timedelta(hours=1), mean=1.499, min=1.49, max=1.5
            ),
        ],
    )
    await async_wait_recording_done(hass)

    points = await refuel.get_instance(hass).async_add_executor_job(
        refuel._statistics_points, hass, entity_id, start, start + timedelta(hours=5)
    )
    start_ms = start.timestamp() * 1000
    assert points == [(start_ms, 1.519), (start_ms + 3_600_000, 1.499)]
