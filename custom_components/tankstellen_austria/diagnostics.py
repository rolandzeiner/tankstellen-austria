"""Diagnostics support for Tankstellen Austria."""
from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from .coordinator import TankstellenConfigEntry

# CONF_LATITUDE/CONF_LONGITUDE are equal to the literal strings, so the
# set would collapse anyway — keeping just the literals for clarity.
# `lat`/`lon` mirror what upstream feeds use; `api_key` / `password` /
# `token` are defensive future-proofing — diagnostics dumps end up in
# public GitHub issues, so over-redacting is essentially free and
# protects against a future contributor adding a generically-named
# credential field without remembering to update this set. Treat the
# set as monotonically growing — never shrink.
TO_REDACT = {
    "latitude",
    "longitude",
    "lat",
    "lon",
    "api_key",
    "password",
    "token",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: TankstellenConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry.

    Redacts the user's home coordinates. Station IDs, names, and public
    location data are not redacted — they are operator-public and useful
    for reproducing issues.
    """
    coordinator = entry.runtime_data
    data = coordinator.data or {}
    return {
        "entry": {
            "title": entry.title,
            "version": entry.version,
            "unique_id_pattern": "dynamic" if entry.unique_id and entry.unique_id.startswith("dynamic_") else "fixed",
            "data": async_redact_data(dict(entry.data), TO_REDACT),
            "options": async_redact_data(dict(entry.options), TO_REDACT),
        },
        "coordinator": {
            "last_update_success": coordinator.last_update_success,
            "update_interval": str(coordinator.update_interval),
            "dynamic_mode": coordinator.dynamic_mode,
            "dynamic_entity": coordinator.dynamic_entity,
            "fuel_types": list(data.keys()),
            "station_counts": {ft: len(v) for ft, v in data.items()},
        },
    }
