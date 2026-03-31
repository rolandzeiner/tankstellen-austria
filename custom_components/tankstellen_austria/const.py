"""Constants for Tankstellen Austria."""

DOMAIN = "tankstellen_austria"
CONF_LATITUDE = "latitude"
CONF_LONGITUDE = "longitude"
CONF_FUEL_TYPES = "fuel_types"
CONF_INCLUDE_CLOSED = "include_closed"
CONF_SCAN_INTERVAL = "scan_interval"

API_BASE_URL = "https://api.e-control.at/sprit/1.0"
API_ENDPOINT = "/search/gas-stations/by-address"

FUEL_TYPES = {
    "DIE": "Diesel",
    "SUP": "Super 95",
    "GAS": "CNG Erdgas",
}

DEFAULT_SCAN_INTERVAL = 30
DEFAULT_INCLUDE_CLOSED = True
