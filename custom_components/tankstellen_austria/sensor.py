"""Sensor platform for Tankstellen Austria."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import CONF_FUEL_TYPES, DOMAIN, FUEL_TYPES
from .coordinator import TankstellenConfigEntry, TankstellenCoordinator

_LOGGER = logging.getLogger(__name__)


def _parse_payment_methods(raw: dict[str, Any] | None) -> dict[str, Any]:
    """Normalise the paymentMethods API dict into a consistent structure."""
    if not raw:
        return {"cash": False, "debit_card": False, "credit_card": False, "others": []}
    others_raw = raw.get("others") or ""
    others = [o.strip() for o in others_raw.split(",") if o.strip()]
    return {
        "cash": bool(raw.get("cash")),
        "debit_card": bool(raw.get("debitCard")),
        "credit_card": bool(raw.get("creditCard")),
        "others": others,
    }


PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: TankstellenConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor entities from a config entry."""
    # Alias carries the runtime_data type — no local annotation needed.
    coordinator = entry.runtime_data
    config = {**entry.data, **entry.options}
    fuel_types: list[str] = config[CONF_FUEL_TYPES]

    entities = [
        TankstellenSensor(coordinator, entry, ft)
        for ft in fuel_types
    ]
    async_add_entities(entities)


class TankstellenSensor(CoordinatorEntity[TankstellenCoordinator], SensorEntity):
    """Sensor for one fuel type – state is cheapest price, attrs hold all stations."""

    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_native_unit_of_measurement = "€/l"
    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: TankstellenCoordinator,
        entry: ConfigEntry,
        fuel_type: str,
    ) -> None:
        """Initialise the sensor."""
        super().__init__(coordinator)
        self._fuel_type = fuel_type
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_{fuel_type}"
        self._attr_translation_key = f"fuel_{fuel_type.lower()}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            manufacturer="E-Control",
            model="Spritpreisrechner",
            configuration_url="https://www.spritpreisrechner.at/",
        )

    @property
    def native_value(self) -> float | None:
        """Return the cheapest price."""
        stations = self._stations
        if not stations:
            return None
        try:
            amount = stations[0]["prices"][0]["amount"]
        except (KeyError, IndexError) as err:
            _LOGGER.debug(
                "No price for %s: API payload missing expected field (%s: %s)",
                self.entity_id or self._fuel_type,
                type(err).__name__,
                err,
            )
            return None
        return float(amount) if amount is not None else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return all station data as attributes."""
        stations = self._stations
        attr_stations: list[dict[str, Any]] = []
        for s in stations:
            price = None
            if s.get("prices"):
                price = s["prices"][0].get("amount")
            attr_stations.append({
                "id": s.get("id"),
                "name": s.get("name"),
                "price": price,
                "open": s.get("open"),
                "location": s.get("location", {}),
                "opening_hours": s.get("openingHours", []),
                "payment_methods": _parse_payment_methods(s.get("paymentMethods")),
            })
        prices = [s["price"] for s in attr_stations if s.get("price") is not None]
        avg_price = round(sum(prices) / len(prices), 3) if prices else None
        return {
            "fuel_type": self._fuel_type,
            "fuel_type_name": FUEL_TYPES.get(self._fuel_type, self._fuel_type),
            "station_count": len(attr_stations),
            "stations": attr_stations,
            "average_price": avg_price,
            "dynamic_mode": self.coordinator.dynamic_mode,
            "dynamic_entity": self.coordinator.dynamic_entity,
        }

    @property
    def _stations(self) -> list[dict[str, Any]]:
        """Get current station list from coordinator."""
        if not self.coordinator.data:
            return []
        return self.coordinator.data.get(self._fuel_type, [])
