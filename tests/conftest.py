"""Shared pytest fixtures for Tankstellen Austria tests."""
from __future__ import annotations

from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import aiohttp
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria.const import (
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DOMAIN,
)

pytest_plugins = ["pytest_homeassistant_custom_component"]


def make_response_cm(resp: Any) -> MagicMock:
    """Wrap a mock response as an async context manager.

    Production code uses ``async with session.get(...) as resp:`` so the
    return value of ``session.get`` must support ``__aenter__`` / ``__aexit__``.
    Real aiohttp's ``_RequestContextManager`` is both awaitable and a context
    manager; mocks need to mimic the context-manager half.
    """
    cm = MagicMock()
    cm.__aenter__ = AsyncMock(return_value=resp)
    cm.__aexit__ = AsyncMock(return_value=None)
    return cm


# Test fixtures use the coordinates of the Friedhof der Namenlosen in Vienna.
MOCK_STATION = {
    "id": 1,
    "name": "Test Tankstelle",
    "open": True,
    "location": {"latitude": 48.1478, "longitude": 16.5147},
    "prices": [{"amount": 1.459}],
    "openingHours": [{"day": "MO-FR", "from": "06:00", "to": "22:00"}],
    "paymentMethods": {
        "cash": True,
        "debitCard": True,
        "creditCard": False,
        "others": "Austrocard, UTA",
    },
}

MOCK_STATION_2 = {
    "id": 2,
    "name": "Zweite Tankstelle",
    "open": False,
    "location": {"latitude": 48.15, "longitude": 16.52},
    "prices": [{"amount": 1.519}],
    "openingHours": [],
}

# Hoisted base entry data — every test merges via {**BASE_ENTRY_DATA, ...}.
# Single source of truth so a CONF_* rename can't leave stale duplicates.
BASE_ENTRY_DATA: dict[str, Any] = {
    CONF_LATITUDE: 48.1478,
    CONF_LONGITUDE: 16.5147,
    CONF_FUEL_TYPES: ["DIE"],
    CONF_INCLUDE_CLOSED: True,
    CONF_SCAN_INTERVAL: 30,
    CONF_DYNAMIC_ENTITY: None,
}


def make_entry(
    data: dict[str, Any] | None = None,
    options: dict[str, Any] | None = None,
    title: str = "Test",
) -> MockConfigEntry:
    """Build a MockConfigEntry with sensible Tankstellen defaults merged in."""
    entry_data = {**BASE_ENTRY_DATA, **(data or {})}
    return MockConfigEntry(
        domain=DOMAIN, data=entry_data, options=options or {}, title=title
    )


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable custom integrations for all tests in this package."""
    yield


@pytest.fixture(autouse=True)
def mock_aiohttp_session():
    """Replace the aiohttp session factory with a typed MagicMock.

    Prevents pycares DNS from starting its background thread for every
    test. Returning a ``MagicMock(spec=aiohttp.ClientSession)`` rather
    than a bare MagicMock makes attribute typos surface during testing
    instead of producing more MagicMocks silently. ``session.get`` is a
    plain ``MagicMock`` returning an empty async context manager so the
    ``async with session.get(...) as resp:`` shape used by production
    code doesn't crash before tests have a chance to override it.
    """
    fake_session = MagicMock(spec=aiohttp.ClientSession)
    fake_session.get = MagicMock(return_value=make_response_cm(MagicMock()))
    with patch(
        "custom_components.tankstellen_austria.coordinator.async_get_clientsession",
        return_value=fake_session,
    ):
        yield


@pytest.fixture(autouse=True)
def mock_card_path():
    """Skip card JS registration to avoid starting the HTTP server in tests."""
    original_is_file = Path.is_file

    def _is_file(self: Path) -> bool:
        if "tankstellen-austria-card.js" in self.name:
            return False
        return original_is_file(self)

    with patch.object(Path, "is_file", _is_file):
        yield


@pytest.fixture
def mock_fetch():
    """Mock the E-Control API _fetch and config flow test to avoid real HTTP requests."""
    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new_callable=AsyncMock,
            return_value=[MOCK_STATION],
        ) as mock_fetch_call,
        patch(
            "custom_components.tankstellen_austria.config_flow._test_api_connection",
            new_callable=AsyncMock,
            return_value=True,
        ),
    ):
        yield mock_fetch_call
