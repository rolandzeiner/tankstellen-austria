"""Config flow for Tankstellen Austria."""
from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.selector import (
    LocationSelector,
    LocationSelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    BooleanSelector,
    TextSelector,
)

from .const import (
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


class TankstellenConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Tankstellen Austria."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            location = user_input.get("location", {})
            lat = location.get("latitude")
            lng = location.get("longitude")
            fuel_types = user_input.get(CONF_FUEL_TYPES, ["DIE"])

            if not lat or not lng:
                errors["location"] = "invalid_location"
            elif not fuel_types:
                errors[CONF_FUEL_TYPES] = "no_fuel_type"
            else:
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
                    },
                )

        # Build default location from HA config
        ha_lat = self.hass.config.latitude
        ha_lng = self.hass.config.longitude

        schema = vol.Schema(
            {
                vol.Required("name", default="Tankstellen"): TextSelector(),
                vol.Required(
                    "location",
                    default={
                        "latitude": ha_lat,
                        "longitude": ha_lng,
                        "radius": 5000,
                    },
                ): LocationSelector(LocationSelectorConfig(radius=True)),
                vol.Required(
                    CONF_FUEL_TYPES, default=["DIE", "SUP"]
                ): SelectSelector(
                    SelectSelectorConfig(
                        options=[
                            {"value": k, "label": v}
                            for k, v in FUEL_TYPES.items()
                        ],
                        multiple=True,
                        mode=SelectSelectorMode.LIST,
                    )
                ),
                vol.Required(
                    CONF_INCLUDE_CLOSED, default=DEFAULT_INCLUDE_CLOSED
                ): BooleanSelector(),
                vol.Required(
                    CONF_SCAN_INTERVAL, default=DEFAULT_SCAN_INTERVAL
                ): NumberSelector(
                    NumberSelectorConfig(
                        min=10,
                        max=720,
                        step=5,
                        unit_of_measurement="min",
                        mode=NumberSelectorMode.BOX,
                    )
                ),
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )
