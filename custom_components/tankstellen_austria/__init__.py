"""Tankstellen Austria – fuel price integration for Austria."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STARTED, Platform
from homeassistant.core import CoreState, HomeAssistant

from .const import CARD_VERSION, DOMAIN
from .coordinator import TankstellenCoordinator

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.SENSOR]

CARD_URL = "/tankstellen-austria/tankstellen-austria-card.js"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Register the card JS once when the integration is first loaded."""

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
            [StaticPathConfig(CARD_URL, str(card_path), True)]
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
                if item.get("url") != versioned_url:
                    await resources.async_update_item(
                        item["id"],
                        {"res_type": "module", "url": versioned_url},
                    )
                    _LOGGER.info("Updated Lovelace resource to %s", versioned_url)
                return

        await resources.async_create_item({"res_type": "module", "url": versioned_url})
        _LOGGER.info("Registered Lovelace resource %s", versioned_url)

    except Exception:  # noqa: BLE001
        _LOGGER.warning(
            "Could not register Lovelace resource – add manually: "
            "Settings → Dashboards → Resources → %s (JavaScript module)",
            CARD_URL,
        )


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Tankstellen Austria from a config entry."""
    coordinator = TankstellenCoordinator(hass, entry)
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
