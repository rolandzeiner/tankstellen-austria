"""Tests for the top-level ``custom_components.tankstellen_austria`` setup.

Covers the surface ``__init__.py`` exposes that isn't exercised by the
config-flow or coordinator tests:

* the ``tankstellen_austria/card_version`` WebSocket command,
* ``async_unload_entry`` happy path,
* ``_async_register_card`` static-path + Lovelace-resource branches.
"""
from __future__ import annotations

from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria import (
    CARD_URL,
    _async_register_card,
)
from custom_components.tankstellen_austria.const import (
    CARD_VERSION,
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
    "location": {"latitude": 48.1478, "longitude": 16.5147},
    "prices": [{"amount": 1.459}],
    "openingHours": [],
}

_BASE_DATA = {
    CONF_LATITUDE: 48.1478,
    CONF_LONGITUDE: 16.5147,
    CONF_FUEL_TYPES: ["DIE"],
    CONF_INCLUDE_CLOSED: True,
    CONF_SCAN_INTERVAL: 30,
    CONF_DYNAMIC_ENTITY: None,
}


def _make_entry() -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        data=_BASE_DATA,
        options={},
        title="Test",
        unique_id="48.148_16.515",
    )


# ---------------------------------------------------------------------
# WebSocket command
# ---------------------------------------------------------------------


async def test_websocket_card_version_returns_const(hass: HomeAssistant) -> None:
    """The WebSocket command echoes the bundled card version.

    Without this assertion, a typo in either ``send_result`` or the
    payload key would break the frontend's drift detector silently —
    the reload-banner loop would re-emerge.

    We invoke the inner async handler directly via its wrapped attribute
    rather than spinning up the real ``http`` + ``websocket_api`` stack —
    the latter leaves daemon threads behind that fail the
    ``pytest-homeassistant-custom-component`` thread-leak teardown check.
    The ``send_result`` payload is the contract; the dispatch wrapper is
    HA-owned and not what we're guarding here.
    """
    from custom_components.tankstellen_austria import _websocket_card_version

    # _websocket_card_version is wrapped by websocket_api.async_response;
    # the underlying coroutine is exposed on the wrapper as a closure cell.
    inner = _websocket_card_version.__wrapped__  # type: ignore[attr-defined]

    connection = MagicMock()
    connection.send_result = MagicMock()
    msg = {"id": 7, "type": "tankstellen_austria/card_version"}

    await inner(hass, connection, msg)

    connection.send_result.assert_called_once_with(7, {"version": CARD_VERSION})


# ---------------------------------------------------------------------
# async_unload_entry
# ---------------------------------------------------------------------


async def test_async_unload_entry_returns_true(hass: HomeAssistant) -> None:
    """Setup → unload leaves the entry NOT_LOADED, no exceptions."""
    from homeassistant.config_entries import ConfigEntryState

    entry = _make_entry()
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new_callable=AsyncMock,
        return_value=[MOCK_STATION],
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.LOADED

        assert await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.NOT_LOADED


# ---------------------------------------------------------------------
# _async_register_card
# ---------------------------------------------------------------------


def _stub_static(hass: HomeAssistant) -> AsyncMock:
    """Replace ``hass.http.async_register_static_paths`` with an AsyncMock."""
    static = AsyncMock()
    hass.http = MagicMock(spec_set=("async_register_static_paths",))
    hass.http.async_register_static_paths = static
    return static


def _build_lovelace(items: list[dict[str, Any]], mode: str = "storage") -> MagicMock:
    """Build a fake Lovelace store exposing the surface ``_async_register_card`` needs."""
    resources = MagicMock()
    resources.async_load = AsyncMock()
    resources.async_items = MagicMock(return_value=list(items))
    resources.async_create_item = AsyncMock()
    resources.async_update_item = AsyncMock()
    resources.async_delete_item = AsyncMock()
    lovelace = MagicMock()
    lovelace.mode = mode
    lovelace.resources = resources
    return lovelace


@pytest.fixture
def _disable_card_path_skip():
    """Override the autouse ``mock_card_path`` fixture so card_path.is_file() returns True.

    The autouse fixture in conftest.py forces ``is_file`` to False for any
    path containing ``tankstellen-austria-card.js`` so the integration setup
    skips static-path registration. These tests want the opposite — the
    happy path through ``_async_register_card``.
    """
    with patch("pathlib.Path.is_file", return_value=True):
        yield


async def test_register_card_creates_resource_when_absent(
    hass: HomeAssistant, _disable_card_path_skip
) -> None:
    """Storage-mode + no existing resource → async_create_item is called once."""
    static = _stub_static(hass)
    lovelace = _build_lovelace([])
    hass.data["lovelace"] = lovelace

    await _async_register_card(hass)

    static.assert_awaited_once()
    lovelace.resources.async_create_item.assert_awaited_once()
    created = lovelace.resources.async_create_item.await_args.args[0]
    assert created["url"] == f"{CARD_URL}?v={CARD_VERSION}"
    assert created["res_type"] == "module"


async def test_register_card_updates_outdated_resource(
    hass: HomeAssistant, _disable_card_path_skip
) -> None:
    """An existing resource with a stale ?v=… is upserted to the current version."""
    _stub_static(hass)
    stale = {"id": "abc", "url": f"{CARD_URL}?v=0.0.0", "res_type": "module"}
    lovelace = _build_lovelace([stale])
    hass.data["lovelace"] = lovelace

    await _async_register_card(hass)

    lovelace.resources.async_update_item.assert_awaited_once_with(
        "abc",
        {"res_type": "module", "url": f"{CARD_URL}?v={CARD_VERSION}"},
    )
    lovelace.resources.async_create_item.assert_not_awaited()


async def test_register_card_skips_when_already_current(
    hass: HomeAssistant, _disable_card_path_skip
) -> None:
    """Existing resource matching ``CARD_URL?v=CARD_VERSION`` → no writes."""
    _stub_static(hass)
    current = {
        "id": "abc",
        "url": f"{CARD_URL}?v={CARD_VERSION}",
        "res_type": "module",
    }
    lovelace = _build_lovelace([current])
    hass.data["lovelace"] = lovelace

    await _async_register_card(hass)

    lovelace.resources.async_update_item.assert_not_awaited()
    lovelace.resources.async_create_item.assert_not_awaited()


async def test_register_card_noop_in_yaml_mode(
    hass: HomeAssistant, _disable_card_path_skip
) -> None:
    """YAML-mode Lovelace must not be mutated — user manages the resource."""
    _stub_static(hass)
    lovelace = _build_lovelace([], mode="yaml")
    hass.data["lovelace"] = lovelace

    await _async_register_card(hass)

    lovelace.resources.async_create_item.assert_not_awaited()
    lovelace.resources.async_update_item.assert_not_awaited()


async def test_register_card_warns_when_card_missing(
    hass: HomeAssistant, caplog: pytest.LogCaptureFixture
) -> None:
    """A missing card JS file logs a warning and returns before mutating Lovelace.

    Uses the autouse ``mock_card_path`` fixture from conftest.py which
    already forces ``is_file`` False for the card filename — perfect for
    this test, hostile for the others which override it.
    """
    static = _stub_static(hass)
    lovelace = _build_lovelace([])
    hass.data["lovelace"] = lovelace

    caplog.clear()
    with caplog.at_level("WARNING"):
        await _async_register_card(hass)

    assert any(
        "Card JS not found" in rec.message for rec in caplog.records
    ), "expected warning when card JS file is missing"
    static.assert_not_awaited()
    lovelace.resources.async_create_item.assert_not_awaited()
    lovelace.resources.async_update_item.assert_not_awaited()


async def test_register_card_delete_recreate_when_update_fails(
    hass: HomeAssistant, _disable_card_path_skip
) -> None:
    """If async_update_item raises, the code falls back to delete+recreate.

    Some HA versions raise on update for resources they don't own; the
    integration must still leave a current resource in place.
    """
    _stub_static(hass)
    stale = {"id": "abc", "url": f"{CARD_URL}?v=0.0.0", "res_type": "module"}
    lovelace = _build_lovelace([stale])
    lovelace.resources.async_update_item.side_effect = RuntimeError("not supported")
    hass.data["lovelace"] = lovelace

    await _async_register_card(hass)

    lovelace.resources.async_delete_item.assert_awaited_once_with("abc")
    lovelace.resources.async_create_item.assert_awaited_once_with(
        {"res_type": "module", "url": f"{CARD_URL}?v={CARD_VERSION}"}
    )
