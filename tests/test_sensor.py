"""Tests for the Tankstellen Austria sensor platform."""
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
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

MOCK_STATION = {
    "id": 1,
    "name": "Test Tankstelle",
    "open": True,
    "location": {"latitude": 48.2082, "longitude": 15.6256},
    "prices": [{"amount": 1.459}],
    "openingHours": [{"day": "MO-FR", "from": "06:00", "to": "22:00"}],
    "paymentMethods": {
        "cash": True,
        "debitCard": True,
        "creditCard": False,
        "others": "Austrocard, UTA",
    },
}

MOCK_STATION_2 = {
    "id": 2,
    "name": "Zweite Tankstelle",
    "open": False,
    "location": {"latitude": 48.21, "longitude": 15.63},
    "prices": [{"amount": 1.519}],
    "openingHours": [],
}

BASE_ENTRY_DATA = {
    CONF_LATITUDE: 48.2082,
    CONF_LONGITUDE: 15.6256,
    CONF_FUEL_TYPES: ["DIE"],
    CONF_INCLUDE_CLOSED: True,
    CONF_SCAN_INTERVAL: 30,
    CONF_DYNAMIC_ENTITY: None,
}


async def _setup_entry(hass: HomeAssistant, data: dict | None = None):
    """Set up a config entry and return (entry, coordinator)."""
    entry_data = {**BASE_ENTRY_DATA, **(data or {})}
    entry = MockConfigEntry(domain=DOMAIN, data=entry_data, options={}, title="Test")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    return entry


# ---------------------------------------------------------------------------
# Entity registration
# ---------------------------------------------------------------------------


async def test_sensor_created_per_fuel_type(hass: HomeAssistant) -> None:
    """One sensor entity is created for each configured fuel type."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={**BASE_ENTRY_DATA, CONF_FUEL_TYPES: ["DIE", "SUP"]},
        options={},
        title="Test",
    )
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    registry = er.async_get(hass)
    entities = er.async_entries_for_config_entry(registry, entry.entry_id)
    assert len(entities) == 2


# ---------------------------------------------------------------------------
# Sensor state
# ---------------------------------------------------------------------------


async def test_sensor_state_is_cheapest_price(hass: HomeAssistant) -> None:
    """Sensor state equals the price of the first (cheapest) station."""
    await _setup_entry(hass)
    state = hass.states.get("sensor.test_diesel")
    assert state is not None
    assert float(state.state) == pytest.approx(1.459)


async def test_sensor_state_unavailable_when_no_data(hass: HomeAssistant) -> None:
    """Sensor is unavailable when coordinator returns no stations."""
    entry = MockConfigEntry(domain=DOMAIN, data=BASE_ENTRY_DATA, options={}, title="Test")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    state = hass.states.get("sensor.test_diesel")
    assert state is not None
    assert state.state == "unknown"


# ---------------------------------------------------------------------------
# Sensor attributes
# ---------------------------------------------------------------------------


async def test_sensor_attributes_structure(hass: HomeAssistant) -> None:
    """Sensor attributes contain all expected keys."""
    await _setup_entry(hass)
    state = hass.states.get("sensor.test_diesel")
    attrs = state.attributes

    assert attrs["fuel_type"] == "DIE"
    assert attrs["fuel_type_name"] == "Diesel"
    assert attrs["station_count"] == 1
    assert attrs["average_price"] == pytest.approx(1.459)
    assert attrs["dynamic_mode"] is False
    assert attrs["dynamic_entity"] is None


async def test_sensor_stations_attribute(hass: HomeAssistant) -> None:
    """Sensor stations attribute maps API data to expected dict keys."""
    await _setup_entry(hass)
    state = hass.states.get("sensor.test_diesel")
    stations = state.attributes["stations"]

    assert len(stations) == 1
    s = stations[0]
    assert s["id"] == 1
    assert s["name"] == "Test Tankstelle"
    assert s["price"] == pytest.approx(1.459)
    assert s["open"] is True
    assert "location" in s
    assert "opening_hours" in s
    assert "payment_methods" in s


async def test_sensor_average_price_multiple_stations(hass: HomeAssistant) -> None:
    """average_price is the mean of all station prices."""
    entry = MockConfigEntry(domain=DOMAIN, data=BASE_ENTRY_DATA, options={}, title="Test")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION, MOCK_STATION_2],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    state = hass.states.get("sensor.test_diesel")
    avg = state.attributes["average_price"]
    expected = round((1.459 + 1.519) / 2, 3)
    assert avg == pytest.approx(expected)


# ---------------------------------------------------------------------------
# Dynamic mode attributes
# ---------------------------------------------------------------------------


async def test_sensor_include_closed_saved(hass: HomeAssistant) -> None:
    """CONF_INCLUDE_CLOSED=False is correctly stored on the coordinator."""
    entry = await _setup_entry(hass, {CONF_INCLUDE_CLOSED: False})
    from custom_components.tankstellen_austria.coordinator import TankstellenCoordinator
    coordinator: TankstellenCoordinator = entry.runtime_data
    assert coordinator._include_closed is False


async def test_sensor_dynamic_mode_attributes(hass: HomeAssistant) -> None:
    """Sensors expose dynamic_mode=True and dynamic_entity when in dynamic mode."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={**BASE_ENTRY_DATA, CONF_DYNAMIC_ENTITY: "device_tracker.phone"},
        options={},
        title="Test",
    )
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    state = hass.states.get("sensor.test_diesel")
    assert state.attributes["dynamic_mode"] is True
    assert state.attributes["dynamic_entity"] == "device_tracker.phone"


# ---------------------------------------------------------------------------
# Payment methods
# ---------------------------------------------------------------------------


async def test_sensor_payment_methods_parsed(hass: HomeAssistant) -> None:
    """paymentMethods API dict is normalised into a structured payment_methods attribute."""
    await _setup_entry(hass)
    state = hass.states.get("sensor.test_diesel")
    pm = state.attributes["stations"][0]["payment_methods"]

    assert pm["cash"] is True
    assert pm["debit_card"] is True
    assert pm["credit_card"] is False
    assert pm["others"] == ["Austrocard", "UTA"]


async def test_sensor_payment_methods_missing(hass: HomeAssistant) -> None:
    """Stations without paymentMethods get a safe all-false fallback."""
    station_no_pm = {
        "id": 2,
        "name": "Kein Payment",
        "open": True,
        "location": {"latitude": 48.2, "longitude": 15.6},
        "prices": [{"amount": 1.499}],
        "openingHours": [],
    }
    entry = MockConfigEntry(domain=DOMAIN, data=BASE_ENTRY_DATA, options={}, title="Test")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[station_no_pm],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    pm = hass.states.get("sensor.test_diesel").attributes["stations"][0]["payment_methods"]
    assert pm["cash"] is False
    assert pm["debit_card"] is False
    assert pm["credit_card"] is False
    assert pm["others"] == []
