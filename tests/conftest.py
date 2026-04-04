"""Shared pytest fixtures for Tankstellen Austria tests."""
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest

pytest_plugins = "pytest_homeassistant_custom_component"

MOCK_STATION = {
    "id": 1,
    "name": "Test Tankstelle",
    "open": True,
    "location": {"latitude": 48.2082, "longitude": 15.6256},
    "prices": [{"amount": 1.459}],
    "openingHours": [],
}


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable custom integrations for all tests in this package."""
    yield


@pytest.fixture(autouse=True)
def mock_aiohttp_session():
    """Mock the aiohttp session to prevent pycares DNS from starting its background thread."""
    with patch(
        "custom_components.tankstellen_austria.coordinator.async_get_clientsession",
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
