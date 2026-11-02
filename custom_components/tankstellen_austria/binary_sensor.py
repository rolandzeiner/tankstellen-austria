"""Binary sensor platform: is now the typically cheapest time of day."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .best_refuel import WEEKDAY_NAMES, in_window
from .const import CONF_FUEL_TYPES
from .coordinator import TankstellenConfigEntry
from .refuel import BestRefuelEntity

# Read-only; the coordinator does the work.
PARALLEL_UPDATES = 0


async def async_setup_entry(
    hass: HomeAssistant,
    entry: TankstellenConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Add one cheap-window sensor per configured fuel type.

    None in dynamic mode: prices from wherever the tracker was don't add up
    to one place's daily pattern, which is why the card hides its tip there.
    """
    if entry.runtime_data.dynamic_mode:
        return
    coordinator = entry.runtime_data.best_refuel
    config = {**entry.data, **entry.options}
    async_add_entities(
        CheapWindowSensor(coordinator, entry, fuel_type, "cheap_window")
        for fuel_type in config[CONF_FUEL_TYPES]
    )


class CheapWindowSensor(BestRefuelEntity, BinarySensorEntity):
    """On during the hours the price history says are cheapest."""

    # These move with every re-analysis and say nothing worth a history row.
    _unrecorded_attributes = frozenset(
        {
            "confidence_score",
            "span_days",
            "gap_cents",
            "consistency_pct",
            "daily_range_cents",
            "noon_days",
            "noon_rise_days",
            "noon_rise_cents",
        }
    )

    @property
    def is_on(self) -> bool | None:
        """Whether the local clock hour is inside a window; unknown without one.

        The second window, when the analysis names one, counts too: it is
        about as cheap, and an automation should not miss it.
        """
        result = self.result
        if result is None or result.hour is None or result.hour_end is None:
            return None
        hour = dt_util.now().hour
        if in_window(hour, result.hour, result.hour_end):
            return True
        if result.alt_hour is not None and result.alt_hour_end is not None:
            return in_window(hour, result.alt_hour, result.alt_hour_end)
        return False

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """The windows, the weekday, the confidence and the four-week facts.

        The facts are there with enough history even when no hour of the
        day is cheaper: the state is unknown then, but how much the price
        moves and how often it rises at noon still tell an automation
        something.
        """
        result = (self.coordinator.data or {}).get(self._fuel_type)
        if result is None or not result.has_enough_data or result.facts is None:
            return None
        conf = result.confidence
        return {
            "start_hour": result.hour,
            "end_hour": result.hour_end,
            "alt_start_hour": result.alt_hour,
            "alt_end_hour": result.alt_hour_end,
            "weekday": None
            if result.weekday is None
            else WEEKDAY_NAMES[result.weekday],
            "confidence": None if conf is None else conf.level,
            "confidence_score": None if conf is None else round(conf.score, 2),
            "span_days": None if conf is None else conf.span_days,
            "gap_cents": None if conf is None else conf.gap_cents,
            "consistency_pct": None if conf is None else conf.consistency_pct,
            "daily_range_cents": result.facts.daily_range_cents,
            "noon_days": result.facts.noon_days,
            "noon_rise_days": result.facts.noon_rise_days,
            "noon_rise_cents": result.facts.noon_rise_cents,
        }
