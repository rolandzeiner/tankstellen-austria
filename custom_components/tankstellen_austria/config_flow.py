"""Config flow for Tankstellen Austria."""
from __future__ import annotations

import asyncio
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import callback
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
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

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
    DEFAULT_INCLUDE_CLOSED,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    FUEL_TYPES,
)


async def _test_api_connection(hass, lat: float, lng: float, fuel_type: str) -> bool:
    """Return True if the E-Control API is reachable with the given coordinates."""
    session = async_get_clientsession(hass)
    try:
        resp = await session.get(
            f"{API_BASE_URL}{API_ENDPOINT}",
            params={"latitude": lat, "longitude": lng, "fuelType": fuel_type, "includeClosed": "true"},
            headers={"User-Agent": f"HomeAssistant tankstellen_austria/{CARD_VERSION}"},
            timeout=10,
        )
        resp.raise_for_status()
    except (asyncio.TimeoutError, Exception):  # noqa: BLE001
        return False
    return True


def _build_schema(
    defaults: dict[str, Any],
    include_name: bool = False,
    include_dynamic: bool = False,
) -> vol.Schema:
    """Build the shared config/options form schema."""
    fields: dict = {}
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
    fields[
        vol.Required(CONF_FUEL_TYPES, default=defaults.get(CONF_FUEL_TYPES, ["DIE", "SUP"]))
    ] = SelectSelector(
        SelectSelectorConfig(
            options=[{"value": k, "label": v} for k, v in FUEL_TYPES.items()],
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


class TankstellenConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Tankstellen Austria."""

    VERSION = 1

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: Any) -> TankstellenOptionsFlow:
        """Return the options flow handler."""
        return TankstellenOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            location = user_input.get("location", {})
            lat = location.get("latitude")
            lng = location.get("longitude")
            fuel_types = user_input.get(CONF_FUEL_TYPES, [])

            if lat is None or lng is None:
                errors["location"] = "invalid_location"
            elif not fuel_types:
                errors[CONF_FUEL_TYPES] = "no_fuel_type"
            else:
                if not await _test_api_connection(self.hass, lat, lng, fuel_types[0]):
                    errors["base"] = "cannot_connect"
                else:
                    dynamic_entity = user_input.get(CONF_DYNAMIC_ENTITY) or None
                    if dynamic_entity:
                        unique_id = f"dynamic_{dynamic_entity}"
                    else:
                        unique_id = f"{round(lat, 3)}_{round(lng, 3)}"
                    await self.async_set_unique_id(unique_id)
                    self._abort_if_unique_id_configured()

                    title = user_input.get("name", "Tankstellen")
                    return self.async_create_entry(
                        title=title,
                        data={
                            CONF_LATITUDE: lat,
                            CONF_LONGITUDE: lng,
                            CONF_FUEL_TYPES: fuel_types,
                            CONF_INCLUDE_CLOSED: user_input.get(
                                CONF_INCLUDE_CLOSED, DEFAULT_INCLUDE_CLOSED
                            ),
                            CONF_SCAN_INTERVAL: user_input.get(
                                CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
                            ),
                            CONF_DYNAMIC_ENTITY: dynamic_entity,
                        },
                    )

        defaults = {
            "name": "Tankstellen",
            CONF_LATITUDE: self.hass.config.latitude,
            CONF_LONGITUDE: self.hass.config.longitude,
        }
        return self.async_show_form(
            step_id="user",
            data_schema=_build_schema(defaults, include_name=True, include_dynamic=True),
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
            location = user_input.get("location", {})
            lat = location.get("latitude")
            lng = location.get("longitude")
            fuel_types = user_input.get(CONF_FUEL_TYPES, [])

            if lat is None or lng is None:
                errors["location"] = "invalid_location"
            elif not fuel_types:
                errors[CONF_FUEL_TYPES] = "no_fuel_type"
            else:
                dynamic_entity = user_input.get(CONF_DYNAMIC_ENTITY) or None
                return self.async_create_entry(
                    data={
                        CONF_LATITUDE: lat,
                        CONF_LONGITUDE: lng,
                        CONF_FUEL_TYPES: fuel_types,
                        CONF_INCLUDE_CLOSED: user_input.get(
                            CONF_INCLUDE_CLOSED, DEFAULT_INCLUDE_CLOSED
                        ),
                        CONF_SCAN_INTERVAL: user_input.get(
                            CONF_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL
                        ),
                        CONF_DYNAMIC_ENTITY: dynamic_entity,
                    }
                )

        return self.async_show_form(
            step_id="init",
            data_schema=_build_schema(config, include_dynamic=True),
            errors=errors,
        )
