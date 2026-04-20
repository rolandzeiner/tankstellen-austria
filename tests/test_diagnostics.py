"""Tests for the Tankstellen Austria diagnostics module."""
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria.const import (
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DOMAIN,
)
from custom_components.tankstellen_austria.diagnostics import (
    async_get_config_entry_diagnostics,
)

MOCK_STATION = {
    "id": 1,
    "name": "Test Tankstelle",
    "open": True,
    "location": {"latitude": 48.1478, "longitude": 16.5147},
    "prices": [{"amount": 1.459}],
    "openingHours": [],
}

BASE_DATA = {
    CONF_LATITUDE: 48.1478,
    CONF_LONGITUDE: 16.5147,
    CONF_FUEL_TYPES: ["DIE", "SUP"],
    CONF_INCLUDE_CLOSED: True,
    CONF_SCAN_INTERVAL: 30,
    CONF_DYNAMIC_ENTITY: None,
}


async def test_diagnostics_redacts_lat_lng(hass: HomeAssistant) -> None:
    """Home coordinates are redacted from the diagnostics output."""
    entry = MockConfigEntry(domain=DOMAIN, data=BASE_DATA, options={}, title="Home")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    diag = await async_get_config_entry_diagnostics(hass, entry)

    assert diag["entry"]["data"][CONF_LATITUDE] == "**REDACTED**"
    assert diag["entry"]["data"][CONF_LONGITUDE] == "**REDACTED**"
    assert diag["entry"]["title"] == "Home"


async def test_diagnostics_includes_coordinator_state(hass: HomeAssistant) -> None:
    """Coordinator state is present and reflects the current fetch status."""
    entry = MockConfigEntry(domain=DOMAIN, data=BASE_DATA, options={}, title="Home")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    diag = await async_get_config_entry_diagnostics(hass, entry)

    coord = diag["coordinator"]
    assert coord["last_update_success"] is True
    assert coord["dynamic_mode"] is False
    assert sorted(coord["fuel_types"]) == ["DIE", "SUP"]
    assert coord["station_counts"]["DIE"] == 1
    assert coord["station_counts"]["SUP"] == 1


async def test_diagnostics_dynamic_mode_entity_not_redacted(hass: HomeAssistant) -> None:
    """The dynamic_entity id is operator-visible and must not be redacted."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={**BASE_DATA, CONF_DYNAMIC_ENTITY: "device_tracker.phone"},
        options={},
        title="Phone",
    )
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    diag = await async_get_config_entry_diagnostics(hass, entry)
    assert diag["coordinator"]["dynamic_entity"] == "device_tracker.phone"
    assert diag["entry"]["data"][CONF_DYNAMIC_ENTITY] == "device_tracker.phone"
