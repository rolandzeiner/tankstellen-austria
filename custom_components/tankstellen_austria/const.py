"""Constants for Tankstellen Austria."""
import json
from pathlib import Path
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

# Integration version — read from manifest.json at module import so the
# string can never drift from HACS's authoritative source. The manifest
# read is sync at import time (~one filesystem stat of a 600-byte file),
# runs once, and is required for HACS anyway.
INTEGRATION_VERSION: Final = json.loads(
    (Path(__file__).parent / "manifest.json").read_text(encoding="utf-8")
)["version"]

# Aliased to INTEGRATION_VERSION so a manifest-only bump propagates
# automatically — the parity test against `src/const.ts CARD_VERSION`
# catches one-sided card bumps in CI before they ship.
CARD_VERSION: Final = INTEGRATION_VERSION

# Static-path mount + Lovelace-resource URL. URL_BASE is the directory
# we expose under HA's HTTP layer so the bundle and any sibling assets
# (e.g. e-control_logo.svg) all resolve under the same prefix.
URL_BASE: Final = "/tankstellen-austria"
CARD_FILENAME: Final = "tankstellen-austria-card.js"
CARD_URL: Final = f"{URL_BASE}/{CARD_FILENAME}"

# Canonical HTTP User-Agent for upstream API calls. RFC-9110 format:
# `<product>/<version> <product>/<version>` with a single space between
# tokens — parsers treat the string as one opaque identifier if the first
# slash is missing. The trailing "(+<repo-url>)" comment follows RFC-9110
# product-token-comment convention so E-Control has a direct contact point
# for abuse / coordination without having to find the repo by guessing.
USER_AGENT: Final = (
    f"HomeAssistant/{_HA_VERSION} {DOMAIN}/{INTEGRATION_VERSION} "
    f"(+https://github.com/rolandzeiner/tankstellen-austria)"
)

# E-Control attribution string (Spritpreisrechner §3 attribution
# practice). Surfaced on every entity via `_attr_attribution` and in the
# card footer so the upstream data source is always visible to the user.
ATTRIBUTION: Final = "Datenquelle: E-Control"

# Retry delay when the API returns no station data (e.g. mid-update window)
NO_DATA_RETRY_MINUTES = 10
