"""Regression test — every outbound request must carry the canonical User-Agent.

A malformed User-Agent is silent failure (the integration still works, only
upstream log parsers break). This test guards both call sites because they
build their own headers dict independently:

- the coordinator's per-fuel-type fetch (`_fetch`),
- `config_flow._test_api_connection` (live probe during entry creation).

The coordinator path is also covered in test_coordinator.py with an
additional RFC-9110 format assertion; this file is the cross-portfolio
peer of test_user_agent.py in the sibling repos.
"""
from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

from homeassistant.const import CONF_LATITUDE, CONF_LONGITUDE
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria.config_flow import _test_api_connection
from custom_components.tankstellen_austria.const import (
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    DOMAIN,
    USER_AGENT,
)
from custom_components.tankstellen_austria.coordinator import TankstellenCoordinator


def _ok_resp(body: object = None, status: int = 200) -> MagicMock:
    resp = MagicMock()
    resp.status = status
    resp.raise_for_status = MagicMock()
    resp.json = AsyncMock(return_value=body if body is not None else [])
    return resp


def _make_entry() -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        data={
            CONF_LATITUDE: 48.1478,
            CONF_LONGITUDE: 16.5147,
            CONF_FUEL_TYPES: ["DIE"],
            CONF_INCLUDE_CLOSED: True,
            CONF_DYNAMIC_ENTITY: None,
        },
        options={},
    )


async def test_coordinator_fetch_sends_user_agent(hass: HomeAssistant) -> None:
    """coordinator._fetch carries the canonical User-Agent."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(return_value=_ok_resp([]))

    await coordinator._fetch("DIE", 48.0, 16.0)

    sent = coordinator._session.get.call_args.kwargs["headers"]
    assert sent["User-Agent"] == USER_AGENT


async def test_config_flow_probe_sends_user_agent(hass: HomeAssistant) -> None:
    """config_flow._test_api_connection carries the canonical User-Agent."""
    session = MagicMock()
    session.get = AsyncMock(return_value=_ok_resp([]))
    with patch(
        "custom_components.tankstellen_austria.config_flow.async_get_clientsession",
        return_value=session,
    ):
        await _test_api_connection(hass, 48.0, 16.0, "DIE")

    sent = session.get.call_args.kwargs["headers"]
    assert sent["User-Agent"] == USER_AGENT
