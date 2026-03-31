"""Tankstellen Austria – fuel price integration for Austria."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.components.http import StaticPathConfig

from .const import DOMAIN
from .coordinator import TankstellenCoordinator

_LOGGER = logging.getLogger(__name__)
PLATFORMS = [Platform.SENSOR]

CARD_URL = "/tankstellen-austria/tankstellen-austria-card.js"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Tankstellen Austria from a config entry."""
    coordinator = TankstellenCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Register the custom card as a static resource
    card_path = Path(__file__).parent / "www" / "tankstellen-austria-card.js"
    if card_path.is_file():
        try:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(CARD_URL, str(card_path), True)]
            )
            _LOGGER.debug("Registered card resource at %s", CARD_URL)
        except Exception:  # noqa: BLE001
            _LOGGER.warning("Could not register card static path – add manually")

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        hass.data[DOMAIN].pop(entry.entry_id)
    return unload_ok
