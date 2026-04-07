"""Tankstellen Austria – fuel price integration for Austria."""
from __future__ import annotations

import logging
from pathlib import Path

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import CoreState, HomeAssistant
from homeassistant.helpers import config_validation as cv

from .const import CARD_VERSION, DOMAIN as DOMAIN
from .coordinator import TankstellenCoordinator

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.SENSOR]

CARD_URL = "/tankstellen-austria/tankstellen-austria-card.js"


@websocket_api.websocket_command({vol.Required("type"): "tankstellen_austria/card_version"})
@websocket_api.async_response
async def _websocket_card_version(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Return the current card version so the frontend can detect mismatches."""
    connection.send_result(msg["id"], {"version": CARD_VERSION})


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Register the card JS and WebSocket command once when the domain is loaded."""
    hass.data.setdefault(DOMAIN, {})
    websocket_api.async_register_command(hass, _websocket_card_version)

    async def _register_frontend(_event=None) -> None:
        await _async_register_card(hass)

    if hass.state == CoreState.running:
        await _register_frontend()
    else:
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _register_frontend)

    return True


async def _async_register_card(hass: HomeAssistant) -> None:
    """Serve the card JS and add it to Lovelace resources."""
    card_path = Path(__file__).parent / "www" / "tankstellen-austria-card.js"
    if not card_path.is_file():
        _LOGGER.warning("Card JS not found at %s", card_path)
        return

    # Serve the file over HTTP
    try:
        await hass.http.async_register_static_paths(
            [StaticPathConfig(CARD_URL, str(card_path), False)]
        )
    except Exception:  # noqa: BLE001
        _LOGGER.debug("Static path already registered or unavailable")

    # Register in Lovelace resource storage (storage mode only)
    try:
        lovelace = hass.data.get("lovelace")
        if lovelace is None or lovelace.mode != "storage":
            return

        resources = lovelace.resources
        await resources.async_load()

        versioned_url = f"{CARD_URL}?v={CARD_VERSION}"

        for item in resources.async_items():
            existing_base = item.get("url", "").split("?")[0]
            if existing_base == CARD_URL:
                if item.get("url") == versioned_url:
                    return  # already up to date
                # Try update; fall back to delete + recreate for HA version compat
                try:
                    await resources.async_update_item(
                        item["id"],
                        {"res_type": "module", "url": versioned_url},
                    )
                except Exception as update_err:  # noqa: BLE001
                    _LOGGER.debug(
                        "async_update_item failed (%s), trying delete+recreate", update_err
                    )
                    await resources.async_delete_item(item["id"])
                    await resources.async_create_item(
                        {"res_type": "module", "url": versioned_url}
                    )
                _LOGGER.info("Updated Lovelace resource to %s", versioned_url)
                return

        await resources.async_create_item({"res_type": "module", "url": versioned_url})
        _LOGGER.info("Registered Lovelace resource %s", versioned_url)

    except Exception as err:  # noqa: BLE001
        _LOGGER.warning(
            "Could not register Lovelace resource (%s) – add manually: "
            "Settings → Dashboards → Resources → %s (JavaScript module)",
            err,
            CARD_URL,
        )


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Tankstellen Austria from a config entry."""
    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.async_setup()
    entry.async_on_unload(coordinator.async_teardown)
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload_entry))

    return True


async def _async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the config entry when options are updated."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
