"""Config flow for Tankstellen Austria."""
from __future__ import annotations

import asyncio
import logging
from typing import Any

import aiohttp
import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    LocationSelector,
    LocationSelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    API_BASE_URL,
    API_ENDPOINT,
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DEFAULT_INCLUDE_CLOSED,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    FUEL_TYPES,
    USER_AGENT,
)

_LOGGER = logging.getLogger(__name__)


async def _test_api_connection(
    hass: HomeAssistant, lat: float, lng: float, fuel_type: str
) -> bool:
    """Return True if the E-Control API is reachable with the given coordinates."""
    session = async_get_clientsession(hass)
    url = f"{API_BASE_URL}{API_ENDPOINT}"
    params: dict[str, str] = {
        "latitude": str(lat),
        "longitude": str(lng),
        "fuelType": fuel_type,
        "includeClosed": "true",
    }
    try:
        resp = await session.get(
            url,
            params=params,
            headers={"User-Agent": USER_AGENT},
            timeout=aiohttp.ClientTimeout(total=10),
        )
        resp.raise_for_status()
    except asyncio.TimeoutError:
        _LOGGER.warning("API connection test timed out after 10s (%s)", url)
        return False
    except aiohttp.ClientResponseError as err:
        _LOGGER.warning(
            "API connection test failed with HTTP %s: %s (%s)",
            err.status, err.message, url,
        )
        return False
    except aiohttp.ClientError as err:
        _LOGGER.warning(
            "API connection test failed: %s: %s (%s)",
            type(err).__name__, err, url,
        )
        return False
    except Exception:  # noqa: BLE001 - final safety net so UI still gets cannot_connect
        _LOGGER.exception("Unexpected error in API connection test (%s)", url)
        return False
    return True


def _build_schema(
    defaults: dict[str, Any],
    include_name: bool = False,
    include_dynamic: bool = False,
) -> vol.Schema:
    """Build the shared config/options form schema."""
    fields: dict[Any, Any] = {}
    if include_name:
        fields[vol.Required("name", default=defaults.get("name", "Tankstellen"))] = (
            TextSelector()
        )
    fields[
        vol.Required(
            "location",
            default={
                "latitude": defaults[CONF_LATITUDE],
                "longitude": defaults[CONF_LONGITUDE],
                "radius": 5000,
            },
        )
    ] = LocationSelector(LocationSelectorConfig(radius=True))
    fuel_options: list[SelectOptionDict] = [
        SelectOptionDict(value=k, label=v) for k, v in FUEL_TYPES.items()
    ]
    fields[
        vol.Required(CONF_FUEL_TYPES, default=defaults.get(CONF_FUEL_TYPES, ["DIE", "SUP"]))
    ] = SelectSelector(
        SelectSelectorConfig(
            options=fuel_options,
            multiple=True,
            mode=SelectSelectorMode.LIST,
        )
    )
    fields[
        vol.Required(CONF_INCLUDE_CLOSED, default=defaults.get(CONF_INCLUDE_CLOSED, DEFAULT_INCLUDE_CLOSED))
    ] = BooleanSelector()
    fields[
        vol.Required(CONF_SCAN_INTERVAL, default=defaults.get(CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))
    ] = NumberSelector(
        NumberSelectorConfig(
            min=10,
            max=720,
            step=5,
            unit_of_measurement="min",
            mode=NumberSelectorMode.BOX,
        )
    )
    if include_dynamic:
        existing = defaults.get(CONF_DYNAMIC_ENTITY) or None
        key = (
            vol.Optional(CONF_DYNAMIC_ENTITY, default=existing)
            if existing
            else vol.Optional(CONF_DYNAMIC_ENTITY)
        )
        fields[key] = EntitySelector(EntitySelectorConfig(domain="device_tracker"))
    return vol.Schema(fields)


def _validate_user_input(
    user_input: dict[str, Any],
) -> tuple[float | None, float | None, list[str], dict[str, str]]:
    """Extract + validate location + fuel types from form input.

    Returns (lat, lng, fuel_types, errors). If errors is non-empty the caller
    should show the form again.
    """
    errors: dict[str, str] = {}
    location = user_input.get("location", {})
    lat = location.get("latitude")
    lng = location.get("longitude")
    fuel_types: list[str] = user_input.get(CONF_FUEL_TYPES, [])

    if lat is None or lng is None:
        errors["location"] = "invalid_location"
    elif not fuel_types:
        errors[CONF_FUEL_TYPES] = "no_fuel_type"
    return lat, lng, fuel_types, errors


def _build_entry_data(
    user_input: dict[str, Any],
    lat: float,
    lng: float,
    fuel_types: list[str],
) -> dict[str, Any]:
    """Pack validated input into the ConfigEntry data dict shape."""
    return {
        CONF_LATITUDE: lat,
        CONF_LONGITUDE: lng,
        CONF_FUEL_TYPES: fuel_types,
        CONF_INCLUDE_CLOSED: user_input.get(
            CONF_INCLUDE_CLOSED, DEFAULT_INCLUDE_CLOSED
        ),
        CONF_SCAN_INTERVAL: user_input.get(
            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
        ),
        CONF_DYNAMIC_ENTITY: user_input.get(CONF_DYNAMIC_ENTITY) or None,
    }


def _compute_unique_id(dynamic_entity: str | None, lat: float, lng: float) -> str:
    """Same formula used since v1.0 — must not change or existing entries break."""
    if dynamic_entity:
        return f"dynamic_{dynamic_entity}"
    return f"{round(lat, 3)}_{round(lng, 3)}"


class TankstellenConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Tankstellen Austria."""

    # Bump + add async_migrate_entry when entry.data shape changes.
    # Tracks the config-entry schema, NOT the integration release version.
    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> TankstellenOptionsFlow:
        """Return the options flow handler."""
        return TankstellenOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            lat, lng, fuel_types, errors = _validate_user_input(user_input)
            if not errors:
                assert lat is not None and lng is not None
                if not await _test_api_connection(self.hass, lat, lng, fuel_types[0]):
                    errors["base"] = "cannot_connect"
                else:
                    dynamic_entity = user_input.get(CONF_DYNAMIC_ENTITY) or None
                    await self.async_set_unique_id(
                        _compute_unique_id(dynamic_entity, lat, lng)
                    )
                    self._abort_if_unique_id_configured()

                    title = user_input.get("name", "Tankstellen")
                    return self.async_create_entry(
                        title=title,
                        data=_build_entry_data(user_input, lat, lng, fuel_types),
                    )

        defaults: dict[str, Any] = {
            "name": "Tankstellen",
            CONF_LATITUDE: self.hass.config.latitude,
            CONF_LONGITUDE: self.hass.config.longitude,
        }
        return self.async_show_form(
            step_id="user",
            data_schema=_build_schema(defaults, include_name=True, include_dynamic=True),
            errors=errors,
        )

    async def async_step_reconfigure(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle reconfiguration of an existing entry.

        Lets the user change location/fuel types/dynamic tracker without
        deleting the entry. Entity unique_ids stay the same; only the entry's
        data and unique_id are rewritten.
        """
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}

        if user_input is not None:
            lat, lng, fuel_types, errors = _validate_user_input(user_input)
            if not errors:
                assert lat is not None and lng is not None
                if not await _test_api_connection(self.hass, lat, lng, fuel_types[0]):
                    errors["base"] = "cannot_connect"
                else:
                    dynamic_entity = user_input.get(CONF_DYNAMIC_ENTITY) or None
                    new_unique_id = _compute_unique_id(dynamic_entity, lat, lng)
                    # Allow no-op reconfigure (same unique_id). Abort only if
                    # the new unique_id matches a *different* existing entry.
                    await self.async_set_unique_id(new_unique_id)
                    self._abort_if_unique_id_mismatch()
                    return self.async_update_reload_and_abort(
                        entry,
                        data=_build_entry_data(user_input, lat, lng, fuel_types),
                    )

        current = {**entry.data, **entry.options}
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=_build_schema(current, include_dynamic=True),
            errors=errors,
        )


class TankstellenOptionsFlow(OptionsFlow):
    """Handle options for Tankstellen Austria."""

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle options."""
        errors: dict[str, str] = {}
        config = {**self.config_entry.data, **self.config_entry.options}

        if user_input is not None:
            lat, lng, fuel_types, errors = _validate_user_input(user_input)
            if not errors:
                assert lat is not None and lng is not None
                if not await _test_api_connection(self.hass, lat, lng, fuel_types[0]):
                    errors["base"] = "cannot_connect"
                else:
                    return self.async_create_entry(
                        data=_build_entry_data(user_input, lat, lng, fuel_types)
                    )

        return self.async_show_form(
            step_id="init",
            data_schema=_build_schema(config, include_dynamic=True),
            errors=errors,
        )
