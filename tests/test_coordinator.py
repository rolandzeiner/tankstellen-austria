"""Tests for the Tankstellen Austria coordinator."""
from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import UpdateFailed
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria.const import (
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DOMAIN,
    DOMAIN_LAST_API_CALL_KEY,
)
from custom_components.tankstellen_austria.coordinator import TankstellenCoordinator

MOCK_STATION = {
    "id": 1,
    "name": "Test Tankstelle",
    "open": True,
    "location": {"latitude": 48.2082, "longitude": 15.6256},
    "prices": [{"amount": 1.459}],
    "openingHours": [],
}

BASE_ENTRY_DATA = {
    CONF_LATITUDE: 48.2082,
    CONF_LONGITUDE: 15.6256,
    CONF_FUEL_TYPES: ["DIE", "SUP"],
    CONF_INCLUDE_CLOSED: True,
    CONF_SCAN_INTERVAL: 30,
    CONF_DYNAMIC_ENTITY: None,
}


def _make_entry(data: dict | None = None) -> MockConfigEntry:
    entry_data = {**BASE_ENTRY_DATA, **(data or {})}
    return MockConfigEntry(domain=DOMAIN, data=entry_data, options={})


# ---------------------------------------------------------------------------
# Fixed mode
# ---------------------------------------------------------------------------


async def test_fixed_mode_fetch_success(hass: HomeAssistant, mock_fetch) -> None:
    """Coordinator returns station data for each fuel type."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    await coordinator.async_refresh()

    assert "DIE" in coordinator.data
    assert "SUP" in coordinator.data
    assert coordinator.data["DIE"] == [MOCK_STATION]


async def test_fixed_mode_uses_configured_coordinates(hass: HomeAssistant, mock_fetch) -> None:
    """Coordinator fetches using the fixed lat/lng from config."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    await coordinator.async_refresh()

    mock_fetch.assert_any_call("DIE", 48.2082, 15.6256)


async def test_fixed_mode_uses_poll_interval(hass: HomeAssistant) -> None:
    """Fixed mode coordinator uses the configured scan interval."""
    entry = _make_entry({CONF_SCAN_INTERVAL: 60})
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.update_interval == timedelta(minutes=60)


async def test_api_failure_raises_update_failed(hass: HomeAssistant) -> None:
    """When the API raises, coordinator raises UpdateFailed."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            side_effect=Exception("connection refused"),
        ),
        pytest.raises(UpdateFailed),
    ):
        await coordinator._async_update_data()


# ---------------------------------------------------------------------------
# Dynamic mode — properties
# ---------------------------------------------------------------------------


async def test_dynamic_mode_property_false_for_fixed(hass: HomeAssistant) -> None:
    """dynamic_mode returns False when no tracker entity is configured."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.dynamic_mode is False
    assert coordinator.dynamic_entity is None


async def test_dynamic_mode_property_true_for_tracker(hass: HomeAssistant) -> None:
    """dynamic_mode returns True when a tracker entity is configured."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.dynamic_mode is True
    assert coordinator.dynamic_entity == "device_tracker.phone"


async def test_dynamic_mode_uses_safety_interval(hass: HomeAssistant) -> None:
    """Dynamic mode coordinator uses the 6-hour safety-net interval, not scan_interval."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone", CONF_SCAN_INTERVAL: 30})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.update_interval == timedelta(hours=6)


# ---------------------------------------------------------------------------
# Dynamic mode — _should_update guards
# ---------------------------------------------------------------------------


async def test_should_update_first_call_no_prior_position(hass: HomeAssistant) -> None:
    """_should_update returns True on first call when there is no prior position."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator._should_update(48.2, 15.6) is True


async def test_should_update_distance_below_threshold(hass: HomeAssistant) -> None:
    """_should_update returns False when moved less than threshold."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Simulate a previous fetch nearby (< 1500 m away)
    coordinator._last_fetch_lat = 48.2082
    coordinator._last_fetch_lng = 15.6256
    coordinator._last_fetch_time = dt_util.utcnow() - timedelta(hours=1)

    # Move only ~10 m
    assert coordinator._should_update(48.2083, 15.6257) is False


async def test_should_update_distance_above_threshold(hass: HomeAssistant) -> None:
    """_should_update returns True when moved more than threshold and cooldown passed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._last_fetch_lat = 48.2082
    coordinator._last_fetch_lng = 15.6256
    coordinator._last_fetch_time = dt_util.utcnow() - timedelta(hours=1)

    # Move ~15 km
    assert coordinator._should_update(48.3, 15.7) is True


async def test_should_update_per_entry_cooldown(hass: HomeAssistant) -> None:
    """_should_update returns False when per-entry cooldown has not elapsed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._last_fetch_lat = 48.0
    coordinator._last_fetch_lng = 15.0
    coordinator._last_fetch_time = dt_util.utcnow()  # just now → cooldown active

    # Even with large movement, cooldown blocks it
    assert coordinator._should_update(49.0, 16.0) is False


async def test_should_update_domain_cooldown(hass: HomeAssistant) -> None:
    """_should_update returns False when domain-wide cooldown has not elapsed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Set domain-wide timestamp to just now
    hass.data.setdefault(DOMAIN, {})[DOMAIN_LAST_API_CALL_KEY] = dt_util.utcnow()

    assert coordinator._should_update(48.2, 15.6) is False


# ---------------------------------------------------------------------------
# Dynamic mode — teardown
# ---------------------------------------------------------------------------


async def test_async_teardown_unsubscribes(hass: HomeAssistant) -> None:
    """async_teardown cancels the state-change listener."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.async_setup()

    assert coordinator._unsubscribe_tracker is not None
    coordinator.async_teardown()
    assert coordinator._unsubscribe_tracker is None


async def test_async_teardown_noop_for_fixed(hass: HomeAssistant) -> None:
    """async_teardown is a no-op for fixed mode."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.async_setup()  # no-op for fixed
    coordinator.async_teardown()  # should not raise
    assert coordinator._unsubscribe_tracker is None
