"""DataUpdateCoordinator for Tankstellen Austria."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .const import (
    API_BASE_URL,
    API_ENDPOINT,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)


class TankstellenCoordinator(DataUpdateCoordinator):
    """Fetch fuel station data from E-Control API."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialise the coordinator."""
        self._latitude = entry.data[CONF_LATITUDE]
        self._longitude = entry.data[CONF_LONGITUDE]
        self._fuel_types: list[str] = entry.data[CONF_FUEL_TYPES]
        self._include_closed: bool = entry.data[CONF_INCLUDE_CLOSED]
        self._session = async_get_clientsession(hass)
        scan = entry.data.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(minutes=scan),
        )

    async def _async_update_data(self) -> dict[str, list[dict]]:
        """Fetch data for each configured fuel type."""
        results: dict[str, list[dict]] = {}
        for fuel_type in self._fuel_types:
            try:
                results[fuel_type] = await self._fetch(fuel_type)
            except Exception as err:
                raise UpdateFailed(
                    f"Error fetching {fuel_type} stations: {err}"
                ) from err
        return results

    async def _fetch(self, fuel_type: str) -> list[dict]:
        """Call the E-Control API for one fuel type."""
        url = f"{API_BASE_URL}{API_ENDPOINT}"
        params = {
            "latitude": self._latitude,
            "longitude": self._longitude,
            "fuelType": fuel_type,
            "includeClosed": str(self._include_closed).lower(),
        }
        resp = await self._session.get(url, params=params, timeout=30)
        resp.raise_for_status()
        data = await resp.json()

        # API returns array of stations; first 5 have prices, rest don't
        stations: list[dict] = []
        for station in data:
            if not station.get("prices"):
                continue
            stations.append(station)
            if len(stations) >= 5:
                break
        return stations
