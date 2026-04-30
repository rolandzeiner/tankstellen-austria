"""Tests for the Tankstellen Austria sensor platform."""
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from custom_components.tankstellen_austria.const import (
    ATTRIBUTION,
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
)

from .conftest import MOCK_STATION, MOCK_STATION_2, make_entry


async def _setup_entry(hass: HomeAssistant, data: dict | None = None):
    """Set up a config entry and return (entry, coordinator)."""
    entry = make_entry(data=data)
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
    entry = make_entry(data={CONF_FUEL_TYPES: ["DIE", "SUP"]})
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


async def test_sensor_state_unknown_when_no_stations(hass: HomeAssistant) -> None:
    """When the coordinator returns an empty station list, sensor.state == 'unknown'.

    HA renders ``native_value is None`` as the literal state ``"unknown"``
    — distinct from ``"unavailable"`` (which would require the coordinator
    itself to be down). This test guards the empty-list branch in
    ``TankstellenSensor.native_value``.
    """
    entry = make_entry()
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
    """Sensor attributes contain all expected keys.

    Critical leak guard: ``dynamic_entity`` (a ``device_tracker.*`` id)
    must NOT appear in entity attributes — the recorder + frontend would
    then surface the user's bound tracker. The bool ``dynamic_mode`` is
    fine; the entity_id is not.
    """
    await _setup_entry(hass)
    state = hass.states.get("sensor.test_diesel")
    attrs = state.attributes

    assert attrs["fuel_type"] == "DIE"
    assert attrs["fuel_type_name"] == "Diesel"
    assert attrs["station_display_name"] == "Test"
    assert attrs["station_count"] == 1
    assert attrs["average_price"] == pytest.approx(1.459)
    assert attrs["dynamic_mode"] is False
    assert "dynamic_entity" not in attrs
    # CoordinatorEntity surfaces _attr_attribution as the standard
    # ATTR_ATTRIBUTION key on extra state attributes.
    assert attrs.get("attribution") == ATTRIBUTION


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
    entry = make_entry()
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


async def test_sensor_include_closed_false_saved(hass: HomeAssistant) -> None:
    """CONF_INCLUDE_CLOSED=False is correctly stored on the coordinator."""
    entry = await _setup_entry(hass, {CONF_INCLUDE_CLOSED: False})
    from custom_components.tankstellen_austria.coordinator import TankstellenCoordinator
    coordinator: TankstellenCoordinator = entry.runtime_data
    assert coordinator._include_closed is False


async def test_sensor_include_closed_true_saved(hass: HomeAssistant) -> None:
    """CONF_INCLUDE_CLOSED=True (the default) is correctly stored on the coordinator."""
    entry = await _setup_entry(hass, {CONF_INCLUDE_CLOSED: True})
    from custom_components.tankstellen_austria.coordinator import TankstellenCoordinator
    coordinator: TankstellenCoordinator = entry.runtime_data
    assert coordinator._include_closed is True


async def test_sensor_dynamic_mode_attributes(hass: HomeAssistant) -> None:
    """Sensors expose dynamic_mode=True and a friendly tracker label.

    The user-chosen friendly_name is fine to surface; the entity_id is
    the leak we removed. Card consumes ``dynamic_tracker_label`` for
    its tab subtitle without ever seeing the tracker entity_id.
    """
    # Pre-seed the tracker state so the sensor can resolve its
    # friendly_name when building extra_state_attributes.
    hass.states.async_set(
        "device_tracker.phone",
        "home",
        {"friendly_name": "iPhone Alex"},
    )
    entry = make_entry(data={CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    state = hass.states.get("sensor.test_diesel")
    attrs = state.attributes
    assert attrs["dynamic_mode"] is True
    assert "dynamic_entity" not in attrs
    assert attrs["dynamic_tracker_label"] == "iPhone Alex"


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


# ---------------------------------------------------------------------------
# Defensive payload parsing — _extract_price + warn-once drift logging
# ---------------------------------------------------------------------------


def test_extract_price_handles_malformed_payloads() -> None:
    """``_extract_price`` returns None for every shape we've seen drift to.

    The card and sensor both blow up if an unexpected shape slips through,
    so the helper is the single place we tolerate API drift. Any new
    shape added here must keep ``native_value`` returning ``None`` rather
    than raising.
    """
    from custom_components.tankstellen_austria.sensor import _extract_price

    assert _extract_price(None) is None
    assert _extract_price("not a dict") is None
    assert _extract_price({}) is None
    assert _extract_price({"prices": None}) is None
    assert _extract_price({"prices": []}) is None
    assert _extract_price({"prices": "scalar"}) is None
    assert _extract_price({"prices": ["not-a-dict"]}) is None
    assert _extract_price({"prices": [{}]}) is None
    assert _extract_price({"prices": [{"amount": None}]}) is None
    assert _extract_price({"prices": [{"amount": "abc"}]}) is None
    # Happy path still works.
    assert _extract_price({"prices": [{"amount": 1.5}]}) == 1.5
    # Numeric-string amount is coerced — the API has been seen to send "1,499"-
    # style values in some locales, but plain numeric strings should still parse.
    assert _extract_price({"prices": [{"amount": "1.5"}]}) == 1.5


async def test_sensor_warns_once_on_price_drift(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """First malformed payload emits WARNING; subsequent ones drop to DEBUG.

    Without this guard, an upstream shape change could either flood the
    log with WARNINGs (one per refresh) or stay completely silent. The
    warn-once-then-debug pattern is the integration's contract.
    """
    bad_station = {
        "id": 99,
        "name": "Bad Payload",
        "open": True,
        "location": {},
        "prices": [{"amount": "not-a-number"}],
        "openingHours": [],
    }
    entry = make_entry()
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[bad_station],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

        # Re-read native_value once more to fire a second access.
        coordinator = entry.runtime_data
        from custom_components.tankstellen_austria.sensor import TankstellenSensor

        sensor = next(
            e for e in hass.data["entity_components"]["sensor"].entities  # type: ignore[attr-defined]
            if isinstance(e, TankstellenSensor)
        )
        caplog.clear()
        with caplog.at_level("DEBUG"):
            _ = sensor.native_value
            _ = sensor.native_value

        warnings = [r for r in caplog.records if r.levelname == "WARNING"]
        debugs = [r for r in caplog.records if r.levelname == "DEBUG"]
        # First attempt happened during setup → already warned. Both
        # subsequent reads must NOT emit WARNING (they may emit DEBUG).
        assert len(warnings) == 0
        assert any("unexpected API payload shape" in r.message for r in debugs)
        # Coordinator presence is a sanity check — keeps the test
        # readable and asserts setup actually wired up runtime_data.
        assert coordinator is not None


async def test_sensor_payment_methods_missing(hass: HomeAssistant) -> None:
    """Stations without paymentMethods get a safe all-false fallback."""
    station_no_pm = {
        "id": 2,
        "name": "Kein Payment",
        "open": True,
        "location": {"latitude": 48.15, "longitude": 16.51},
        "prices": [{"amount": 1.499}],
        "openingHours": [],
    }
    entry = make_entry()
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
