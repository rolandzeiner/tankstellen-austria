"""DataUpdateCoordinator for Tankstellen Austria."""
from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

import aiohttp

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant, State, callback
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.debounce import Debouncer
from homeassistant.helpers.event import (
    EventStateChangedData,
    async_call_later,
    async_track_state_change_event,
)
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util
from homeassistant.util.location import distance

from .const import (
    API_BASE_URL,
    API_ENDPOINT,
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
    USER_AGENT,
)

_LOGGER = logging.getLogger(__name__)


class TankstellenCoordinator(DataUpdateCoordinator[dict[str, list[dict[str, Any]]]]):
    """Fetch fuel station data from E-Control API.

    Supports two modes:
    - Fixed mode (default): polls on a regular interval from a fixed location.
    - Dynamic mode: triggers updates on device_tracker location changes,
      guarded by distance threshold and rate limits.
    """

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialise the coordinator."""
        config = {**entry.data, **entry.options}
        self._entry = entry
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
        self._unsubscribe_tracker: Callable[[], None] | None = None
        self._tracker_issue_raised: bool = False

        # No-data retry state
        self._no_data_retry_cancel: Callable[[], None] | None = None

        if self._dynamic_entity:
            interval = timedelta(hours=DYNAMIC_SAFETY_INTERVAL_HOURS)
        else:
            scan = config.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)
            interval = timedelta(minutes=scan)

        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            config_entry=entry,
            update_interval=interval,
            # Absorb request storms (options-flow save, manual reload,
            # dashboard edit-mode flip) so the E-Control API isn't hit
            # multiple times in quick succession during routine UI activity.
            request_refresh_debouncer=Debouncer(
                hass,
                _LOGGER,
                cooldown=15,
                immediate=False,
            ),
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
    def _handle_tracker_update(self, event: Event[EventStateChangedData]) -> None:
        """Handle a device_tracker state change event."""
        new_state = event.data.get("new_state")
        lat, lng = self._get_entity_coords(new_state)
        if not self._should_update(lat, lng):
            return
        # Update domain-level timestamp before scheduling so concurrent
        # entries see it immediately.
        self.hass.data.setdefault(DOMAIN, {})[DOMAIN_LAST_API_CALL_KEY] = dt_util.utcnow()
        self.hass.async_create_task(self.async_refresh())

    def _get_entity_coords(
        self, state: State | None
    ) -> tuple[float, float]:
        """Extract lat/lng from an entity state, with fallback to HA defaults.

        Always returns a usable pair — if the tracker has no coordinates we
        fall back to the HA instance location (which is always set).
        """
        if state is not None:
            lat = state.attributes.get("latitude")
            lng = state.attributes.get("longitude")
            if lat is not None and lng is not None:
                self._clear_tracker_issue()
                return float(lat), float(lng)
        # Fallback: HA instance location. Log every fallback at DEBUG so the
        # trail is visible even after the Repairs issue is dismissed; raise
        # the issue itself on the first occurrence (idempotent inside
        # _raise_tracker_issue).
        if self._dynamic_entity:
            _LOGGER.debug(
                "device_tracker %s missing coordinates — using HA home location",
                self._dynamic_entity,
            )
            self._raise_tracker_issue()
        return self.hass.config.latitude, self.hass.config.longitude

    def _raise_tracker_issue(self) -> None:
        """Raise a Repairs issue when the configured device_tracker is unavailable."""
        if self._tracker_issue_raised:
            return
        self._tracker_issue_raised = True
        _LOGGER.warning(
            "device_tracker %s unavailable or missing coordinates — "
            "falling back to HA home location for this update",
            self._dynamic_entity,
        )
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            f"tracker_missing_{self._entry.entry_id}",
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key="tracker_missing",
            translation_placeholders={
                "entity_id": self._dynamic_entity or "",
                "entry_title": self._entry.title,
            },
        )

    def _clear_tracker_issue(self) -> None:
        """Clear the tracker-missing Repairs issue once coordinates return."""
        if not self._tracker_issue_raised:
            return
        self._tracker_issue_raised = False
        ir.async_delete_issue(
            self.hass, DOMAIN, f"tracker_missing_{self._entry.entry_id}"
        )

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
            if dist_m is not None and dist_m < DYNAMIC_DISTANCE_THRESHOLD_M:
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

    async def _async_update_data(self) -> dict[str, list[dict[str, Any]]]:
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

        # Fan out per fuel type in parallel — they are independent requests
        # against the same host. Sequentially awaiting each adds up (3 fuel
        # types × 30 s timeout = 90 s wall-clock worst case). gather() with
        # return_exceptions captures per-type failures so the partial-failure
        # branch below still works; the loop re-raises any non-Exception
        # BaseException (CancelledError etc.) to preserve cancellation
        # semantics.
        fetched = await asyncio.gather(
            *(self._fetch(ft, lat, lng) for ft in self._fuel_types),
            return_exceptions=True,
        )
        results: dict[str, list[dict[str, Any]]] = {}
        errors: dict[str, Exception] = {}
        for fuel_type, outcome in zip(self._fuel_types, fetched, strict=True):
            if isinstance(outcome, BaseException) and not isinstance(
                outcome, Exception
            ):
                raise outcome
            if isinstance(outcome, Exception):
                errors[fuel_type] = outcome
                _LOGGER.warning(
                    "Fetch failed for fuel type %s: %s", fuel_type, outcome
                )
            else:
                results[fuel_type] = outcome

        if errors and not results:
            # All fuel types failed — coordinator goes unavailable.
            # Report the first error for the UI; per-type errors were logged above.
            first_ft, first_err = next(iter(errors.items()))
            if was_available:
                _LOGGER.warning("E-Control API unavailable: %s", first_err)
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_all_failed",
                translation_placeholders={
                    "failed_count": str(len(errors)),
                    "total_count": str(len(self._fuel_types)),
                    "fuel_type": first_ft,
                    "error": str(first_err),
                },
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
    def _retry_no_data_fetch(self, _now: datetime) -> None:
        """Fire a refresh after the no-data retry delay."""
        self._no_data_retry_cancel = None
        _LOGGER.info("Retrying fetch after no-data response")
        # async_request_refresh debounces against any concurrent refresh
        # (e.g. a card-side manual refresh that landed during the retry
        # window) so we don't double-fire.
        self.hass.async_create_task(self.async_request_refresh())

    async def _fetch(
        self, fuel_type: str, lat: float, lng: float
    ) -> list[dict[str, Any]]:
        """Call the E-Control API for one fuel type.

        Raises UpdateFailed with a translated message for each failure class so
        HA logs and UI can distinguish timeouts, HTTP errors and malformed
        responses.
        """
        url = f"{API_BASE_URL}{API_ENDPOINT}"
        params: dict[str, str] = {
            "latitude": str(lat),
            "longitude": str(lng),
            "fuelType": fuel_type,
            "includeClosed": str(self._include_closed).lower(),
        }
        headers = {"User-Agent": USER_AGENT}
        timeout = aiohttp.ClientTimeout(total=30)
        try:
            resp = await self._session.get(url, params=params, headers=headers, timeout=timeout)
            resp.raise_for_status()
        except asyncio.TimeoutError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_timeout",
                translation_placeholders={"fuel_type": fuel_type},
            ) from err
        except aiohttp.ClientResponseError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_http_error",
                translation_placeholders={
                    "status": str(err.status),
                    "fuel_type": fuel_type,
                    "reason": err.message,
                },
            ) from err
        except aiohttp.ClientError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_connection_error",
                translation_placeholders={
                    "fuel_type": fuel_type,
                    "error_type": type(err).__name__,
                    "error": str(err),
                },
            ) from err

        try:
            data = await resp.json()
        except aiohttp.ContentTypeError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_invalid_content_type",
                translation_placeholders={
                    "fuel_type": fuel_type,
                    "status": str(resp.status),
                    "reason": err.message,
                },
            ) from err
        except ValueError as err:  # json.JSONDecodeError is a ValueError subclass
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_invalid_json",
                translation_placeholders={
                    "fuel_type": fuel_type,
                    "status": str(resp.status),
                    "error": str(err),
                },
            ) from err

        if not isinstance(data, list):
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="api_invalid_response",
                translation_placeholders={
                    "fuel_type": fuel_type,
                    "status": str(resp.status),
                    "got": type(data).__name__,
                },
            )

        # API returns array of stations; first 5 have prices, rest don't
        stations: list[dict[str, Any]] = []
        for station in data:
            if not station.get("prices"):
                continue
            stations.append(station)
            if len(stations) >= 5:
                break
        return stations


# Typed ConfigEntry alias — parameterises the generic ConfigEntry with the
# runtime_data payload so `entry.runtime_data` is `TankstellenCoordinator`
# without an explicit annotation at every call site. Defined after the class
# so the forward reference resolves naturally. PEP 695 `type` statement
# uses lazy evaluation, so Python 3.12+ only.
type TankstellenConfigEntry = ConfigEntry[TankstellenCoordinator]
