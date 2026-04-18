"""Constants for Tankstellen Austria."""

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

CARD_VERSION = "1.5.0"

# Retry delay when the API returns no station data (e.g. mid-update window)
NO_DATA_RETRY_MINUTES = 10
