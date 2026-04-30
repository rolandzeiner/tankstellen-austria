"""Tests for the Tankstellen Austria diagnostics module."""
from __future__ import annotations

import json
from unittest.mock import AsyncMock, patch

from homeassistant.core import HomeAssistant

from custom_components.tankstellen_austria.const import (
    ATTRIBUTION,
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
)
from custom_components.tankstellen_austria.diagnostics import (
    async_get_config_entry_diagnostics,
)

from .conftest import MOCK_STATION, make_entry


async def test_diagnostics_redacts_lat_lng(hass: HomeAssistant) -> None:
    """Home coordinates are redacted in both ``data`` and ``options``.

    Asserting both maps catches a regression where TO_REDACT only fires
    for one of them (e.g. someone forgets to thread the redact through
    ``options``). Also asserts non-coordinate fields stay untouched so
    a future overzealous redact set fails this test.
    """
    options_with_coords = {CONF_LATITUDE: 47.0, CONF_LONGITUDE: 15.0}
    entry = make_entry(options=options_with_coords, title="Home")
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
    assert diag["entry"]["options"][CONF_LATITUDE] == "**REDACTED**"
    assert diag["entry"]["options"][CONF_LONGITUDE] == "**REDACTED**"
    # Non-coordinate fields must not be redacted.
    assert diag["entry"]["title"] == "Home"
    assert diag["entry"]["data"][CONF_FUEL_TYPES] == ["DIE"]
    assert diag["entry"]["data"][CONF_INCLUDE_CLOSED] is True


async def test_diagnostics_includes_envelope_keys(hass: HomeAssistant) -> None:
    """Coordinator state is present and reflects the current fetch status.

    Locks the canonical envelope shape: ``attribution`` at the top, and
    ``last_update_success`` + ``last_exception`` inside ``coordinator``.
    Sentinel test against a future refactor that drops one of them.
    """
    entry = make_entry(title="Home")
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    diag = await async_get_config_entry_diagnostics(hass, entry)

    assert diag["attribution"] == ATTRIBUTION

    coord = diag["coordinator"]
    assert coord["last_update_success"] is True
    # Successful first refresh → exception is None → repr is "None".
    assert coord["last_exception"] == "None"
    assert coord["dynamic_mode"] is False
    assert sorted(coord["fuel_types"]) == ["DIE"]
    assert coord["station_counts"]["DIE"] == 1


async def test_diagnostics_redacts_dynamic_entity(hass: HomeAssistant) -> None:
    """The dynamic_entity device_tracker id is treated as PII and redacted.

    Earlier in the integration's history this field surfaced raw both in
    diagnostics and in the sensor's ``extra_state_attributes`` — it's
    the user's bound device-tracker entity_id, which automations elsewhere
    in the install reference. A diag dump in a public GitHub issue
    must not expose it.
    """
    entry = make_entry(
        data={CONF_DYNAMIC_ENTITY: "device_tracker.phone"},
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
    # entry.data carries the entity_id but it must come back redacted.
    assert diag["entry"]["data"][CONF_DYNAMIC_ENTITY] == "**REDACTED**"
    # Coordinator block must not republish it under any key.
    assert "dynamic_entity" not in diag["coordinator"]
    # Bool flag is fine — that's the non-PII signal the card needs.
    assert diag["coordinator"]["dynamic_mode"] is True


async def test_diagnostics_no_sentinel_leak(hass: HomeAssistant) -> None:
    """A sentinel value stuffed into options must not appear in the dump.

    Belt-and-braces against a future contributor wiring a new field
    through diagnostics without updating TO_REDACT. Pairs with the
    redact tests above so any pure-passthrough on a credential-shaped
    field would fail this test.
    """
    sentinel = "ZqK7xC3-sentinel-7f2a-DO-NOT-LEAK"
    entry = make_entry(
        options={
            CONF_LATITUDE: 47.0,
            CONF_LONGITUDE: 15.0,
            "api_key": sentinel,
            "token": sentinel,
        },
        title="Home",
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
    # Whole envelope serialised; substring search is the strictest form.
    dump = json.dumps(diag)
    assert sentinel not in dump
