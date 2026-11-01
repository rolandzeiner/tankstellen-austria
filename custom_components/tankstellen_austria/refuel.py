"""Feeds the best-refuel analysis from the price sensors' recorder history."""

from __future__ import annotations

import logging
import math
from datetime import datetime, timedelta, tzinfo

from homeassistant.components.recorder import history
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.recorder import get_instance
from homeassistant.helpers.update_coordinator import (
    CoordinatorEntity,
    DataUpdateCoordinator,
    UpdateFailed,
)
from homeassistant.util import dt as dt_util

from .best_refuel import BestRefuelResult, analyze_best_refuel
from .const import CONF_FUEL_TYPES, DOMAIN, FUEL_TYPES

_LOGGER = logging.getLogger(__name__)

# The card reads the same 28 days and refreshes on the same 30 minutes, so
# the entities and the card's refuel tip move together.
HISTORY_DAYS = 28
REFRESH_INTERVAL = timedelta(minutes=30)

type BestRefuelData = dict[str, BestRefuelResult | None]


def _history_points(
    hass: HomeAssistant, entity_id: str, start: datetime, end: datetime
) -> list[tuple[float, float]]:
    """(epoch ms, price) for every numeric state, as the card's history.ts builds them.

    Runs in the recorder's executor. The state in force at `start` is dated
    `start`, matching what the history WebSocket hands the card.
    """
    states = history.state_changes_during_period(
        hass, start, end, entity_id, no_attributes=True, include_start_time_state=True
    ).get(entity_id, [])
    start_ms = start.timestamp() * 1000
    points: list[tuple[float, float]] = []
    for state in states:
        try:
            value = float(state.state)
        except ValueError:
            continue
        if not math.isfinite(value):
            continue
        points.append((max(start_ms, state.last_changed_timestamp * 1000), value))
    return points


def _analyse(
    hass: HomeAssistant,
    entity_ids: dict[str, str | None],
    now: datetime,
    tz: tzinfo,
) -> BestRefuelData:
    start = now - timedelta(days=HISTORY_DAYS)
    now_ms = now.timestamp() * 1000
    out: BestRefuelData = {}
    for fuel_type, entity_id in entity_ids.items():
        if entity_id is None:
            out[fuel_type] = None
            continue
        points = _history_points(hass, entity_id, start, now)
        out[fuel_type] = analyze_best_refuel(points, now_ms, tz)
    return out


class BestRefuelCoordinator(DataUpdateCoordinator[BestRefuelData]):
    """Re-runs the analysis for every fuel type of one entry."""

    config_entry: ConfigEntry

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Set up the coordinator; it polls nothing outside the recorder."""
        super().__init__(
            hass,
            _LOGGER,
            name=f"{DOMAIN} best refuel",
            config_entry=entry,
            update_interval=REFRESH_INTERVAL,
        )

    async def _async_update_data(self) -> BestRefuelData:
        if "recorder" not in self.hass.config.components:
            raise UpdateFailed(
                translation_domain=DOMAIN, translation_key="recorder_unavailable"
            )
        config = {**self.config_entry.data, **self.config_entry.options}
        registry = er.async_get(self.hass)
        entity_ids = {
            fuel_type: registry.async_get_entity_id(
                Platform.SENSOR, DOMAIN, f"{self.config_entry.entry_id}_{fuel_type}"
            )
            for fuel_type in config[CONF_FUEL_TYPES]
        }
        return await get_instance(self.hass).async_add_executor_job(
            _analyse,
            self.hass,
            entity_ids,
            dt_util.utcnow(),
            dt_util.get_default_time_zone(),
        )


class BestRefuelEntity(CoordinatorEntity[BestRefuelCoordinator]):
    """Base for the per-fuel-type entities built on the analysis."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: BestRefuelCoordinator,
        entry: ConfigEntry,
        fuel_type: str,
        key: str,
    ) -> None:
        """Name the entity after its fuel type and tie it to the entry's device."""
        super().__init__(coordinator)
        self._fuel_type = fuel_type
        self._attr_unique_id = f"{entry.entry_id}_{fuel_type}_{key}"
        self._attr_translation_key = key
        self._attr_translation_placeholders = {
            "fuel": FUEL_TYPES.get(fuel_type, fuel_type)
        }
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, entry.entry_id)})

    @property
    def result(self) -> BestRefuelResult | None:
        """The analysis for this fuel type, or None while there is too little history."""
        result = (self.coordinator.data or {}).get(self._fuel_type)
        if result is None or not result.has_enough_data or result.hour is None:
            return None
        return result

    async def async_added_to_hass(self) -> None:
        """Re-write the state on every hour, when the window can open or close."""
        await super().async_added_to_hass()
        self.async_on_remove(
            async_track_time_change(self.hass, self._on_hour, minute=0, second=0)
        )

    @callback
    def _on_hour(self, _now: datetime) -> None:
        self.async_write_ha_state()
