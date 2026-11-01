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
        {"confidence_score", "span_days", "coverage_pct", "gap_cents"}
    )

    @property
    def is_on(self) -> bool | None:
        """Whether the local clock hour is inside the window; unknown without one."""
        result = self.result
        if result is None or result.hour is None or result.hour_end is None:
            return None
        return in_window(dt_util.now().hour, result.hour, result.hour_end)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """The window, the cheapest weekday when it stands out, and the confidence."""
        result = self.result
        if result is None or result.confidence is None:
            return None
        conf = result.confidence
        return {
            "start_hour": result.hour,
            "end_hour": result.hour_end,
            "weekday": None
            if result.weekday is None
            else WEEKDAY_NAMES[result.weekday],
            "confidence": conf.level,
            "confidence_score": round(conf.score, 2),
            "span_days": conf.span_days,
            "coverage_pct": conf.coverage_pct,
            "gap_cents": conf.gap_cents,
        }
