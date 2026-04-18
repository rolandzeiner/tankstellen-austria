"""Tests for the Tankstellen Austria coordinator."""
from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
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
    "location": {"latitude": 48.1478, "longitude": 16.5147},
    "prices": [{"amount": 1.459}],
    "openingHours": [],
}

BASE_ENTRY_DATA = {
    CONF_LATITUDE: 48.1478,
    CONF_LONGITUDE: 16.5147,
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

    mock_fetch.assert_any_call("DIE", 48.1478, 16.5147)


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


async def test_config_entry_not_ready_on_first_refresh_failure(
    hass: HomeAssistant,
) -> None:
    """When the API fails on first setup, the entry ends up in SETUP_RETRY state."""
    from homeassistant.config_entries import ConfigEntryState

    entry = _make_entry()
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        side_effect=Exception("connection refused"),
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.SETUP_RETRY


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
    assert coordinator._should_update(48.15, 16.51) is True


async def test_should_update_distance_below_threshold(hass: HomeAssistant) -> None:
    """_should_update returns False when moved less than threshold."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Simulate a previous fetch nearby (< 1500 m away)
    coordinator._last_fetch_lat = 48.1478
    coordinator._last_fetch_lng = 16.5147
    coordinator._last_fetch_time = dt_util.utcnow() - timedelta(hours=1)

    # Move only ~10 m
    assert coordinator._should_update(48.1479, 16.5148) is False


async def test_should_update_distance_above_threshold(hass: HomeAssistant) -> None:
    """_should_update returns True when moved more than threshold and cooldown passed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._last_fetch_lat = 48.1478
    coordinator._last_fetch_lng = 16.5147
    coordinator._last_fetch_time = dt_util.utcnow() - timedelta(hours=1)

    # Move ~15 km
    assert coordinator._should_update(48.25, 16.6) is True


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

    assert coordinator._should_update(48.15, 16.51) is False


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


# ---------------------------------------------------------------------------
# include_closed API param
# ---------------------------------------------------------------------------


async def test_include_closed_true_passed_to_api(hass: HomeAssistant) -> None:
    """includeClosed=true is sent to the API when CONF_INCLUDE_CLOSED is True."""
    entry = _make_entry({CONF_INCLUDE_CLOSED: True})
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    mock_resp = MagicMock()
    mock_resp.raise_for_status = MagicMock()
    mock_resp.json = AsyncMock(return_value=[MOCK_STATION])

    with patch.object(coordinator._session, "get", new=AsyncMock(return_value=mock_resp)) as mock_get:
        await coordinator._fetch("DIE", 48.1478, 16.5147)

    _, kwargs = mock_get.call_args
    assert kwargs["params"]["includeClosed"] == "true"


async def test_include_closed_false_passed_to_api(hass: HomeAssistant) -> None:
    """includeClosed=false is sent to the API when CONF_INCLUDE_CLOSED is False."""
    entry = _make_entry({CONF_INCLUDE_CLOSED: False})
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    mock_resp = MagicMock()
    mock_resp.raise_for_status = MagicMock()
    mock_resp.json = AsyncMock(return_value=[MOCK_STATION])

    with patch.object(coordinator._session, "get", new=AsyncMock(return_value=mock_resp)) as mock_get:
        await coordinator._fetch("DIE", 48.1478, 16.5147)

    _, kwargs = mock_get.call_args
    assert kwargs["params"]["includeClosed"] == "false"


# ---------------------------------------------------------------------------
# No-data retry
# ---------------------------------------------------------------------------


async def test_no_data_preserves_previous_data_and_schedules_retry(
    hass: HomeAssistant,
) -> None:
    """When all fuel types return empty stations, previous data is kept and retry scheduled."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.data = {"DIE": [MOCK_STATION], "SUP": [MOCK_STATION]}

    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new_callable=AsyncMock,
            return_value=[],
        ),
        patch(
            "custom_components.tankstellen_austria.coordinator.async_call_later"
        ) as mock_call_later,
    ):
        result = await coordinator._async_update_data()

    assert result == {"DIE": [MOCK_STATION], "SUP": [MOCK_STATION]}
    mock_call_later.assert_called_once()


async def test_no_data_without_previous_returns_empty(hass: HomeAssistant) -> None:
    """When all fuel types return empty and there is no previous data, empty is returned."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)

    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new_callable=AsyncMock,
            return_value=[],
        ),
        patch("custom_components.tankstellen_austria.coordinator.async_call_later"),
    ):
        result = await coordinator._async_update_data()

    assert result == {"DIE": [], "SUP": []}


async def test_async_teardown_cancels_pending_no_data_retry(hass: HomeAssistant) -> None:
    """async_teardown cancels a scheduled no-data retry."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    mock_cancel = MagicMock()
    coordinator._no_data_retry_cancel = mock_cancel

    coordinator.async_teardown()

    mock_cancel.assert_called_once()
    assert coordinator._no_data_retry_cancel is None
