"""Tankstellen Austria – fuel price integration for Austria."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.components.websocket_api import async_register_command
from homeassistant.components.websocket_api.connection import ActiveConnection
from homeassistant.components.websocket_api.decorators import (
    async_response,
    websocket_command,
)
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import CoreState, Event, HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers import device_registry as dr

from .card_registration import JSModuleRegistration
from .const import CARD_VERSION, DOMAIN
from .coordinator import TankstellenConfigEntry, TankstellenCoordinator

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)
PLATFORMS: list[Platform] = [Platform.SENSOR]


@websocket_command(
    {vol.Required("type"): "tankstellen_austria/card_version"}
)
@async_response
async def _websocket_card_version(
    hass: HomeAssistant,
    connection: ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the current card version so the frontend can detect mismatches."""
    connection.send_result(msg["id"], {"version": CARD_VERSION})


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Register the card JS and WebSocket command once when the domain is loaded."""
    hass.data.setdefault(DOMAIN, {})
    # WS commands registered here survive integration removal — HA's
    # websocket_api has no public deregister hook. Pragmatic given the
    # API surface, harmless in practice (a stray handler that no caller
    # invokes once the bundle is gone). Behaviour on duplicate
    # registration is HA-core internal; we never reach that branch
    # since `async_setup` only runs once per HA startup.
    async_register_command(hass, _websocket_card_version)

    registration = JSModuleRegistration(hass)

    async def _register_card(_event: Event | None = None) -> None:
        await registration.async_register()

    if hass.state == CoreState.running:
        await _register_card()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _register_card)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: TankstellenConfigEntry) -> bool:
    """Set up Tankstellen Austria from a config entry."""
    coordinator = TankstellenCoordinator(hass, entry)
    # First refresh raises ConfigEntryNotReady on fetch failure. Wire
    # teardown only AFTER it succeeds — running async_teardown on a
    # half-initialised coordinator that raised would leak the
    # device_tracker listener.
    await coordinator.async_config_entry_first_refresh()

    # Tracker listener registration depends on coordinator state being
    # populated (dynamic mode reads CONF_DYNAMIC_ENTITY); safe to call
    # after first_refresh.
    coordinator.async_setup()
    entry.async_on_unload(coordinator.async_teardown)

    entry.runtime_data = coordinator

    # Ensure a device exists up-front so the Devices panel shows the entry
    # even before any entity state is available.
    dr.async_get(hass).async_get_or_create(
        config_entry_id=entry.entry_id,
        identifiers={(DOMAIN, entry.entry_id)},
        name=entry.title,
        manufacturer="E-Control",
        model="Spritpreisrechner",
        configuration_url="https://www.spritpreisrechner.at/",
    )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload_entry))

    return True


async def _async_reload_entry(hass: HomeAssistant, entry: TankstellenConfigEntry) -> None:
    """Reload the config entry when options are updated."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: TankstellenConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: TankstellenConfigEntry) -> None:
    """Drop the Lovelace resource when the LAST config entry is removed.

    Card registration is component-level (one resource per HA install,
    not per entry), so this only runs when no other entries of this
    integration remain. Reload goes through async_unload_entry, not
    here, so the card stays registered across reloads.
    """
    remaining = [
        e
        for e in hass.config_entries.async_entries(DOMAIN)
        if e.entry_id != entry.entry_id
    ]
    if remaining:
        return
    await JSModuleRegistration(hass).async_unregister()
