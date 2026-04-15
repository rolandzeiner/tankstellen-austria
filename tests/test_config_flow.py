"""Tests for the Tankstellen Austria config flow."""
from unittest.mock import AsyncMock, patch

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType

from custom_components.tankstellen_austria.const import (
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    CONF_SCAN_INTERVAL,
    DOMAIN,
)

VALID_USER_INPUT = {
    "name": "Test Tankstelle",
    "location": {"latitude": 48.2082, "longitude": 15.6256},
    CONF_FUEL_TYPES: ["DIE", "SUP"],
    CONF_INCLUDE_CLOSED: True,
    CONF_SCAN_INTERVAL: 30,
}


async def test_form_shows(hass: HomeAssistant) -> None:
    """Test that the setup form is shown on init."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "user"
    assert result["errors"] == {}


async def test_form_no_fuel_type(hass: HomeAssistant) -> None:
    """Test that selecting no fuel types triggers a validation error."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {**VALID_USER_INPUT, CONF_FUEL_TYPES: []},
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"].get(CONF_FUEL_TYPES) == "no_fuel_type"


async def test_form_creates_entry(hass: HomeAssistant, mock_fetch) -> None:
    """Test that valid input creates a config entry."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        VALID_USER_INPUT,
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Test Tankstelle"
    assert result["data"][CONF_LATITUDE] == 48.2082
    assert result["data"][CONF_LONGITUDE] == 15.6256
    assert result["data"][CONF_FUEL_TYPES] == ["DIE", "SUP"]
    assert result["data"][CONF_INCLUDE_CLOSED] is True
    assert result["data"][CONF_SCAN_INTERVAL] == 30


async def test_form_accepts_zero_coordinates(hass: HomeAssistant, mock_fetch) -> None:
    """Test that 0,0 coordinates (Null Island) are accepted, not rejected."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {**VALID_USER_INPUT, "location": {"latitude": 0.0, "longitude": 0.0}},
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_LATITUDE] == 0.0
    assert result["data"][CONF_LONGITUDE] == 0.0


async def test_duplicate_entry_aborted(hass: HomeAssistant, mock_fetch) -> None:
    """Test that a second entry for the same location is aborted."""
    for _ in range(2):
        result = await hass.config_entries.flow.async_init(
            DOMAIN, context={"source": config_entries.SOURCE_USER}
        )
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            VALID_USER_INPUT,
        )

    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_flow_shows(hass: HomeAssistant, mock_fetch) -> None:
    """Test that the options form is shown."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], VALID_USER_INPUT)

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "init"


async def test_options_flow_updates(hass: HomeAssistant, mock_fetch) -> None:
    """Test that options flow saves updated settings."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], VALID_USER_INPUT)

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "location": {"latitude": 48.2082, "longitude": 15.6256},
            CONF_FUEL_TYPES: ["DIE"],
            CONF_INCLUDE_CLOSED: False,
            CONF_SCAN_INTERVAL: 60,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert entry.options[CONF_FUEL_TYPES] == ["DIE"]
    assert entry.options[CONF_SCAN_INTERVAL] == 60
    assert entry.options[CONF_INCLUDE_CLOSED] is False


async def test_form_cannot_connect(hass: HomeAssistant) -> None:
    """Test that an API failure shows a cannot_connect error."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    with patch(
        "custom_components.tankstellen_austria.config_flow._test_api_connection",
        new_callable=AsyncMock,
        return_value=False,
    ):
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            VALID_USER_INPUT,
        )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"].get("base") == "cannot_connect"


async def test_options_flow_no_fuel_type(hass: HomeAssistant, mock_fetch) -> None:
    """Test that clearing all fuel types in options flow shows an error."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.flow.async_configure(result["flow_id"], VALID_USER_INPUT)

    entry = hass.config_entries.async_entries(DOMAIN)[0]
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "location": {"latitude": 48.2082, "longitude": 15.6256},
            CONF_FUEL_TYPES: [],
            CONF_INCLUDE_CLOSED: True,
            CONF_SCAN_INTERVAL: 30,
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"].get(CONF_FUEL_TYPES) == "no_fuel_type"
