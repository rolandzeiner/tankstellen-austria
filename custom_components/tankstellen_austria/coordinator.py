"""DataUpdateCoordinator for Tankstellen Austria."""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Callable

import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util
from homeassistant.util.location import distance

from .const import (
    API_BASE_URL,
    API_ENDPOINT,
    CARD_VERSION,
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    DOMAIN_LAST_API_CALL_KEY,
    DYNAMIC_COOLDOWN_MINUTES,
    DYNAMIC_DISTANCE_THRESHOLD_M,
    DYNAMIC_DOMAIN_COOLDOWN_MINUTES,
    DYNAMIC_SAFETY_INTERVAL_HOURS,
    NO_DATA_RETRY_MINUTES,
)

_LOGGER = logging.getLogger(__name__)


class TankstellenCoordinator(DataUpdateCoordinator):
    """Fetch fuel station data from E-Control API.

    Supports two modes:
    - Fixed mode (default): polls on a regular interval from a fixed location.
    - Dynamic mode: triggers updates on device_tracker location changes,
      guarded by distance threshold and rate limits.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialise the coordinator."""
        config = {**entry.data, **entry.options}
        self._latitude: float = config[CONF_LATITUDE]
        self._longitude: float = config[CONF_LONGITUDE]
        self._fuel_types: list[str] = config[CONF_FUEL_TYPES]
        self._include_closed: bool = config[CONF_INCLUDE_CLOSED]
        self._session = async_get_clientsession(hass)

        self._dynamic_entity: str | None = config.get(CONF_DYNAMIC_ENTITY) or None

        # Dynamic mode state
        self._last_fetch_lat: float | None = None
        self._last_fetch_lng: float | None = None
        self._last_fetch_time: datetime | None = None
        self._unsubscribe_tracker: Callable | None = None
        self._logged_tracker_missing: bool = False

        # No-data retry state
        self._no_data_retry_cancel: Callable | None = None

        if self._dynamic_entity:
            interval = timedelta(hours=DYNAMIC_SAFETY_INTERVAL_HOURS)
        else:
            scan = config.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
            interval = timedelta(minutes=scan)

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=interval,
        )

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------

    @property
    def dynamic_mode(self) -> bool:
        """Return True when tracking a device_tracker entity."""
        return self._dynamic_entity is not None

    @property
    def dynamic_entity(self) -> str | None:
        """Return the tracked device_tracker entity ID, or None in fixed mode."""
        return self._dynamic_entity

    def async_setup(self) -> None:
        """Register the device_tracker state-change listener (dynamic mode only)."""
        if not self._dynamic_entity:
            return
        self._unsubscribe_tracker = async_track_state_change_event(
            self.hass,
            [self._dynamic_entity],
            self._handle_tracker_update,
        )
        _LOGGER.debug(
            "Dynamic mode: watching %s for location changes", self._dynamic_entity
        )

    @callback
    def async_teardown(self) -> None:
        """Unsubscribe the device_tracker listener on unload."""
        if self._unsubscribe_tracker:
            self._unsubscribe_tracker()
            self._unsubscribe_tracker = None
        if self._no_data_retry_cancel:
            self._no_data_retry_cancel()
            self._no_data_retry_cancel = None

    # ------------------------------------------------------------------
    # Dynamic mode internals
    # ------------------------------------------------------------------

    @callback
    def _handle_tracker_update(self, event) -> None:
        """Handle a device_tracker state change event."""
        new_state = event.data.get("new_state")
        lat, lng = self._get_entity_coords(new_state)
        if lat is None or lng is None:
            return
        if not self._should_update(lat, lng):
            return
        # Update domain-level timestamp before scheduling so concurrent
        # entries see it immediately.
        self.hass.data.setdefault(DOMAIN, {})[DOMAIN_LAST_API_CALL_KEY] = dt_util.utcnow()
        self.hass.async_create_task(self.async_refresh())

    def _get_entity_coords(
        self, state
    ) -> tuple[float | None, float | None]:
        """Extract lat/lng from an entity state, with fallback to HA defaults."""
        if state is not None:
            lat = state.attributes.get("latitude")
            lng = state.attributes.get("longitude")
            if lat is not None and lng is not None:
                self._logged_tracker_missing = False
                return float(lat), float(lng)
        # Fallback: HA instance location. Log once per degradation so the user
        # notices their tracker-based setup has silently fallen back to fixed.
        if self._dynamic_entity and not self._logged_tracker_missing:
            self._logged_tracker_missing = True
            _LOGGER.warning(
                "device_tracker %s unavailable or missing coordinates — "
                "falling back to HA home location for this update",
                self._dynamic_entity,
            )
        return self.hass.config.latitude, self.hass.config.longitude

    def _should_update(self, lat: float, lng: float) -> bool:
        """Return True only when all rate-limit guards pass."""
        now = dt_util.utcnow()

        # 1. Domain-wide cooldown (protects against multiple entries firing at once)
        last_domain = self.hass.data.get(DOMAIN, {}).get(DOMAIN_LAST_API_CALL_KEY)
        if last_domain is not None:
            age_min = (now - last_domain).total_seconds() / 60
            if age_min < DYNAMIC_DOMAIN_COOLDOWN_MINUTES:
                _LOGGER.debug(
                    "Dynamic update skipped: domain cooldown (%.1f min remaining)",
                    DYNAMIC_DOMAIN_COOLDOWN_MINUTES - age_min,
                )
                return False

        # 2. Per-entry cooldown
        if self._last_fetch_time is not None:
            age_min = (now - self._last_fetch_time).total_seconds() / 60
            if age_min < DYNAMIC_COOLDOWN_MINUTES:
                _LOGGER.debug(
                    "Dynamic update skipped: entry cooldown (%.1f min remaining)",
                    DYNAMIC_COOLDOWN_MINUTES - age_min,
                )
                return False

        # 3. Distance threshold (skip on very first call when no prior position)
        if self._last_fetch_lat is not None and self._last_fetch_lng is not None:
            dist_m = distance(
                lat, lng, self._last_fetch_lat, self._last_fetch_lng
            )
            if dist_m < DYNAMIC_DISTANCE_THRESHOLD_M:
                _LOGGER.debug(
                    "Dynamic update skipped: only moved %.0f m (threshold %d m)",
                    dist_m,
                    DYNAMIC_DISTANCE_THRESHOLD_M,
                )
                return False

        return True

    # ------------------------------------------------------------------
    # Core data fetch
    # ------------------------------------------------------------------

    async def _async_update_data(self) -> dict[str, list[dict]]:
        """Fetch data for each configured fuel type."""
        if self._dynamic_entity:
            state = self.hass.states.get(self._dynamic_entity)
            lat, lng = self._get_entity_coords(state)
            self._last_fetch_lat = lat
            self._last_fetch_lng = lng
            self._last_fetch_time = dt_util.utcnow()
        else:
            lat = self._latitude
            lng = self._longitude

        was_available = self.last_update_success
        results: dict[str, list[dict]] = {}
        errors: dict[str, Exception] = {}
        for fuel_type in self._fuel_types:
            try:
                results[fuel_type] = await self._fetch(fuel_type, lat, lng)
            except Exception as err:  # noqa: BLE001 - capture per-type, decide below
                errors[fuel_type] = err
                _LOGGER.warning(
                    "Fetch failed for fuel type %s: %s", fuel_type, err
                )

        if errors and not results:
            # All fuel types failed — coordinator goes unavailable.
            # Report the first error for the UI; per-type errors were logged above.
            first_ft, first_err = next(iter(errors.items()))
            if was_available:
                _LOGGER.warning("E-Control API unavailable: %s", first_err)
            raise UpdateFailed(
                f"All fuel types failed ({len(errors)}/{len(self._fuel_types)}); "
                f"first error on {first_ft}: {first_err}"
            ) from first_err

        if errors:
            # Partial failure — keep previous data for failed types so entities
            # stay available with the last known values.
            if self.data:
                for fuel_type in errors:
                    if self.data.get(fuel_type):
                        results[fuel_type] = self.data[fuel_type]

        if not was_available:
            _LOGGER.info("E-Control API is back online")

        # If the API returned no stations for any fuel type, it may be in the
        # middle of its own data update (~12:05–12:07). Schedule a retry in
        # NO_DATA_RETRY_MINUTES and keep the previous data alive in the meantime.
        if all(not v for v in results.values()):
            _LOGGER.info(
                "API returned no station data — scheduling retry in %d min",
                NO_DATA_RETRY_MINUTES,
            )
            self._schedule_no_data_retry()
            if self.data:
                return self.data

        return results

    def _schedule_no_data_retry(self) -> None:
        """Schedule a one-shot retry when the API returned empty data."""
        if self._no_data_retry_cancel:
            self._no_data_retry_cancel()
        self._no_data_retry_cancel = async_call_later(
            self.hass,
            NO_DATA_RETRY_MINUTES * 60,
            self._retry_no_data_fetch,
        )

    @callback
    def _retry_no_data_fetch(self, _now) -> None:
        """Fire a refresh after the no-data retry delay."""
        self._no_data_retry_cancel = None
        _LOGGER.info("Retrying fetch after no-data response")
        self.hass.async_create_task(self.async_refresh())

    async def _fetch(self, fuel_type: str, lat: float, lng: float) -> list[dict]:
        """Call the E-Control API for one fuel type.

        Raises UpdateFailed with a specific message for each failure class so
        HA logs can distinguish timeouts, HTTP errors and malformed responses.
        """
        url = f"{API_BASE_URL}{API_ENDPOINT}"
        params = {
            "latitude": lat,
            "longitude": lng,
            "fuelType": fuel_type,
            "includeClosed": str(self._include_closed).lower(),
        }
        headers = {
            "User-Agent": f"HomeAssistant/{HA_VERSION} tankstellen_austria/{CARD_VERSION}",
        }
        try:
            resp = await self._session.get(url, params=params, headers=headers, timeout=30)
            resp.raise_for_status()
        except asyncio.TimeoutError as err:
            raise UpdateFailed(
                f"E-Control API timed out for {fuel_type} after 30s"
            ) from err
        except aiohttp.ClientResponseError as err:
            raise UpdateFailed(
                f"E-Control API returned HTTP {err.status} for {fuel_type}: {err.message}"
            ) from err
        except aiohttp.ClientError as err:
            raise UpdateFailed(
                f"E-Control API connection error for {fuel_type}: {type(err).__name__}: {err}"
            ) from err

        try:
            data = await resp.json()
        except aiohttp.ContentTypeError as err:
            raise UpdateFailed(
                f"E-Control API returned unexpected content-type for {fuel_type} "
                f"(status {resp.status}): {err.message}"
            ) from err
        except ValueError as err:  # json.JSONDecodeError is a ValueError subclass
            raise UpdateFailed(
                f"E-Control API returned invalid JSON for {fuel_type} "
                f"(status {resp.status}): {err}"
            ) from err

        # API returns array of stations; first 5 have prices, rest don't
        stations: list[dict] = []
        for station in data:
            if not station.get("prices"):
                continue
            stations.append(station)
            if len(stations) >= 5:
                break
        return stations
