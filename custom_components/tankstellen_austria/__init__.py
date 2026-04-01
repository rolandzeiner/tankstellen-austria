"""Tankstellen Austria – fuel price integration for Austria."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_extra_module_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import CARD_VERSION, DOMAIN
from .coordinator import TankstellenCoordinator

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.SENSOR]

CARD_URL = "/tankstellen-austria/tankstellen-austria-card.js"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Tankstellen Austria from a config entry."""
    coordinator = TankstellenCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload_entry))

    # Register the JS file and load it in the frontend – runs once per session.
    if not hass.data.get(f"{DOMAIN}_card_registered"):
        card_path = Path(__file__).parent / "www" / "tankstellen-austria-card.js"
        if card_path.is_file():
            try:
                await hass.http.async_register_static_paths(
                    [StaticPathConfig(CARD_URL, str(card_path), True)]
                )
            except Exception:  # noqa: BLE001
                _LOGGER.warning("Could not register card static path")

            # Inject the card module into every frontend page load.
            # This is the official HA API – works regardless of Lovelace mode
            # (storage or YAML) and does not require manual resource setup.
            versioned_url = f"{CARD_URL}?v={CARD_VERSION}"
            async_register_extra_module_url(hass, versioned_url)
            _LOGGER.debug("Registered frontend module %s", versioned_url)

        hass.data[f"{DOMAIN}_card_registered"] = True

    return True


async def _async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the config entry when options are updated."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
