"""Sensor platform for Tankstellen Austria."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import ATTRIBUTION, CONF_FUEL_TYPES, DOMAIN, FUEL_TYPES
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


# Coordinator drives all updates in a single fan-out; per-platform parallelism
# limit is unnecessary and would only constrain HA's state-write throughput.
PARALLEL_UPDATES = 0


def _extract_price(station: Any) -> float | None:
    """Pull the first-price amount from a station dict, defensively.

    The E-Control payload is mostly stable but the card and sensor both
    blow up if an unexpected shape slips through (prices is None, the
    first entry isn't a dict, amount is a string that can't cast). We
    log once and return None rather than propagate.
    """
    if not isinstance(station, dict):
        return None
    prices = station.get("prices")
    if not isinstance(prices, list) or not prices:
        return None
    first = prices[0]
    if not isinstance(first, dict):
        return None
    amount = first.get("amount")
    if amount is None:
        return None
    try:
        return float(amount)
    except (TypeError, ValueError):
        return None


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

    _attr_attribution = ATTRIBUTION
    _attr_device_class = SensorDeviceClass.MONETARY
    _attr_native_unit_of_measurement = "€/l"
    _attr_has_entity_name = True

    # Excluded from the recorder: `stations` is the per-station detail list
    # whose entries rotate on every poll (prices, open flag) — and at large
    # radii / urban density it can exceed the recorder's 16 KB attribute
    # cap. Embedded opening_hours + payment_methods are mostly immutable
    # but they're carried inside the variable list so dedup never kicks
    # in. Frontend (card, templates) still receives the full list live —
    # only history is skipped. E-Control's portal keeps authoritative
    # price history if a user wants to look back.
    _unrecorded_attributes = frozenset({"stations"})

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
        self._price_drift_warned = False
        self._attr_unique_id = f"{entry.entry_id}_{fuel_type}"
        self._attr_translation_key = f"fuel_{fuel_type.lower()}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=entry.title,
            manufacturer="E-Control",
            model="Spritpreisrechner",
            configuration_url="https://www.spritpreisrechner.at/",
        )
        # Cache populated from coordinator data once per refresh; the
        # `native_value` and `extra_state_attributes` properties read from
        # this rather than re-walking `coordinator.data` (which used to call
        # `_extract_price` on the first station twice per state write).
        self._attr_extra_state_attributes: dict[str, Any] = {}
        self._recompute_from_coordinator()

    async def async_added_to_hass(self) -> None:
        """Recompute on add so the first state-write reflects current data."""
        await super().async_added_to_hass()
        self._recompute_from_coordinator()

    @callback
    def _handle_coordinator_update(self) -> None:
        """Recompute cached state once per coordinator refresh."""
        self._recompute_from_coordinator()
        super()._handle_coordinator_update()

    def _recompute_from_coordinator(self) -> None:
        """Walk the station list once and stash the derived state.

        Computes the cheapest price, the per-station attribute list, and
        the dynamic-mode label in a single pass — keeping `native_value`
        and `extra_state_attributes` as O(1) dict lookups instead of two
        independent O(n) walks per HA state read.
        """
        stations = self._stations
        if not stations:
            self._attr_native_value = None
            self._attr_extra_state_attributes = self._build_attrs([])
            return

        price = _extract_price(stations[0])
        if price is None:
            # First time we see a malformed payload for this entity, surface
            # it at WARNING so API drift gets noticed; subsequent occurrences
            # drop to DEBUG so logs don't fill up if the drift persists.
            if not self._price_drift_warned:
                self._price_drift_warned = True
                _LOGGER.warning(
                    "No price for %s: unexpected API payload shape — "
                    "suppressing further warnings for this entity",
                    self.entity_id or self._fuel_type,
                )
            else:
                _LOGGER.debug(
                    "No price for %s: unexpected API payload shape",
                    self.entity_id or self._fuel_type,
                )
        self._attr_native_value = price

        attr_stations: list[dict[str, Any]] = []
        for s in stations:
            if not isinstance(s, dict):
                continue
            attr_stations.append({
                "id": s.get("id"),
                "name": s.get("name"),
                "price": _extract_price(s),
                "open": s.get("open"),
                "location": s.get("location", {}),
                "opening_hours": s.get("openingHours", []),
                "payment_methods": _parse_payment_methods(s.get("paymentMethods")),
            })
        self._attr_extra_state_attributes = self._build_attrs(attr_stations)

    def _build_attrs(self, attr_stations: list[dict[str, Any]]) -> dict[str, Any]:
        """Compose the public attributes dict from a precomputed station list."""
        prices = [s["price"] for s in attr_stations if s.get("price") is not None]
        avg_price = round(sum(prices) / len(prices), 3) if prices else None

        # Locale-agnostic display name from entry.title (user-chosen at
        # config-flow time). Card consumes this instead of stripping a
        # localised `friendly_name` regex.
        attrs: dict[str, Any] = {
            "fuel_type": self._fuel_type,
            "fuel_type_name": FUEL_TYPES.get(self._fuel_type, self._fuel_type),
            "station_display_name": self._entry.title,
            "station_count": len(attr_stations),
            "stations": attr_stations,
            "average_price": avg_price,
            "dynamic_mode": self.coordinator.dynamic_mode,
        }
        # Dynamic-mode UX preserved without leaking the device_tracker
        # entity_id: publish the user-chosen friendly name only. The
        # entity_id stays internal to the coordinator and inside the
        # (redacted) diagnostics block.
        if self.coordinator.dynamic_mode:
            tracker_id = self.coordinator.dynamic_entity
            label: str | None = None
            if tracker_id and self.hass is not None:
                tracker_state = self.hass.states.get(tracker_id)
                if tracker_state is not None:
                    raw = tracker_state.attributes.get("friendly_name")
                    if isinstance(raw, str) and raw:
                        label = raw
            if label:
                attrs["dynamic_tracker_label"] = label
        return attrs

    @property
    def _stations(self) -> list[dict[str, Any]]:
        """Get current station list from coordinator."""
        if not self.coordinator.data:
            return []
        return self.coordinator.data.get(self._fuel_type, [])
