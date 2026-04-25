"""Constants for Tankstellen Austria."""
from typing import Final

from homeassistant.const import __version__ as _HA_VERSION

DOMAIN = "tankstellen_austria"
CONF_LATITUDE = "latitude"
CONF_LONGITUDE = "longitude"
CONF_FUEL_TYPES = "fuel_types"
CONF_INCLUDE_CLOSED = "include_closed"
CONF_SCAN_INTERVAL = "scan_interval"
CONF_DYNAMIC_ENTITY = "dynamic_entity"

API_BASE_URL = "https://api.e-control.at/sprit/1.0"
API_ENDPOINT = "/search/gas-stations/by-address"

FUEL_TYPES = {
    "DIE": "Diesel",
    "SUP": "Super 95",
    "GAS": "CNG Erdgas",
}

DEFAULT_SCAN_INTERVAL = 30
DEFAULT_INCLUDE_CLOSED = True

# Dynamic mode rate-limiting
DYNAMIC_DISTANCE_THRESHOLD_M = 1500    # metres moved before triggering update
DYNAMIC_COOLDOWN_MINUTES = 10          # min between auto-updates per entry
DYNAMIC_MANUAL_COOLDOWN_MINUTES = 2    # min between manual card refreshes
DYNAMIC_DOMAIN_COOLDOWN_MINUTES = 5    # min between ANY update across all entries
DYNAMIC_SAFETY_INTERVAL_HOURS = 6      # fallback timer when no movement detected

# Key inside hass.data[DOMAIN] for cross-entry rate limiting
DOMAIN_LAST_API_CALL_KEY = "last_api_call"

CARD_VERSION = "1.8.0"

# Integration version — tracks manifest.json "version" (always the clean
# release name, never a beta suffix). Kept separate from CARD_VERSION so the
# served JS bundle and the Python integration can be released independently
# without breaking the frontend WS version check.
INTEGRATION_VERSION: Final = "1.7.0"

# Canonical HTTP User-Agent for upstream API calls. RFC-9110 format:
# `<product>/<version> <product>/<version>` with a single space between
# tokens — parsers treat the string as one opaque identifier if the first
# slash is missing.
USER_AGENT: Final = f"HomeAssistant/{_HA_VERSION} {DOMAIN}/{INTEGRATION_VERSION}"

# Retry delay when the API returns no station data (e.g. mid-update window)
NO_DATA_RETRY_MINUTES = 10
