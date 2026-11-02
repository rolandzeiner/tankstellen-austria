"""Tests for the HA-free E-Control client in api.py.

No `hass` fixture anywhere in this file: the client takes a session and a
User-Agent and must work without Home Assistant. The first test keeps it
that way.
"""

from __future__ import annotations

import ast
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import aiohttp
import pytest

from custom_components.tankstellen_austria import api
from custom_components.tankstellen_austria.api import (
    EControlConnectionError,
    EControlContentTypeError,
    EControlHttpError,
    EControlJsonError,
    EControlMaintenanceError,
    EControlResponseShapeError,
    EControlTimeoutError,
    check_connection,
    fetch_stations,
    priced_stations,
)

from .conftest import MOCK_STATION, make_response_cm

UA = "test-agent/1.0"


def test_api_module_imports_nothing_from_home_assistant() -> None:
    """api.py may import only the standard library and aiohttp.

    A relative import counts as a violation too: const.py imports Home
    Assistant for its User-Agent, so `from .const import …` would pull HA
    back in through the side door.
    """
    tree = ast.parse(Path(api.__file__).read_text(encoding="utf-8"))
    offenders: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom):
            if node.level > 0 or (node.module or "").startswith("homeassistant"):
                offenders.append(f"from {'.' * node.level}{node.module or ''}")
        elif isinstance(node, ast.Import):
            offenders += [
                a.name for a in node.names if a.name.startswith("homeassistant")
            ]
    assert offenders == []


def _session(resp: Any) -> MagicMock:
    session = MagicMock(spec=aiohttp.ClientSession)
    session.get = MagicMock(return_value=make_response_cm(resp))
    return session


def _raising_session(err: BaseException) -> MagicMock:
    session = MagicMock(spec=aiohttp.ClientSession)
    session.get = MagicMock(side_effect=err)
    return session


def _json_resp(payload: Any, status: int = 200) -> MagicMock:
    resp = MagicMock()
    resp.status = status
    resp.content_type = "application/json"
    resp.raise_for_status = MagicMock()
    resp.json = AsyncMock(return_value=payload)
    return resp


async def _fetch(session: MagicMock) -> list[api.Station]:
    return await fetch_stations(
        session,
        latitude=48.2,
        longitude=16.4,
        fuel_type="DIE",
        include_closed=False,
        user_agent=UA,
    )


async def test_fetch_sends_params_and_user_agent() -> None:
    session = _session(_json_resp([MOCK_STATION]))
    assert await _fetch(session) == [MOCK_STATION]

    args, kwargs = session.get.call_args
    assert args == (api.SEARCH_URL,)
    assert kwargs["params"] == {
        "latitude": "48.2",
        "longitude": "16.4",
        "fuelType": "DIE",
        "includeClosed": "false",
    }
    assert kwargs["headers"] == {"User-Agent": UA}
    assert kwargs["timeout"].total == api.FETCH_TIMEOUT_SECONDS


def test_priced_stations_drops_unpriced_and_caps_the_list() -> None:
    unpriced = {"id": 0, "prices": []}
    priced = [{"id": n, "prices": [{"amount": 1.5}]} for n in range(7)]
    kept = priced_stations([unpriced, *priced])
    assert [s["id"] for s in kept] == [0, 1, 2, 3, 4]
    assert unpriced not in kept


def test_priced_stations_lets_a_non_dict_entry_raise() -> None:
    """The coordinator counts this as inconclusive, so it must not be swallowed."""
    with pytest.raises(AttributeError):
        priced_stations(["not-a-station"])


async def test_fetch_detects_the_maintenance_page_whatever_the_status() -> None:
    resp = MagicMock()
    resp.status = 507
    resp.content_type = "text/html"
    resp.content.read = AsyncMock(
        return_value=b"<title>E-control Wartungsarbeiten</title>"
    )
    with pytest.raises(EControlMaintenanceError) as exc:
        await _fetch(_session(resp))
    assert exc.value.status == 507
    resp.content.read.assert_awaited_once_with(api.MAINTENANCE_SNIFF_BYTES)


async def test_fetch_html_without_marker_is_an_http_error() -> None:
    resp = MagicMock()
    resp.status = 502
    resp.content_type = "text/html"
    resp.content.read = AsyncMock(return_value=b"<title>Bad Gateway</title>")
    resp.raise_for_status = MagicMock(
        side_effect=aiohttp.ClientResponseError(
            MagicMock(), (), status=502, message="Bad Gateway"
        )
    )
    with pytest.raises(EControlHttpError) as exc:
        await _fetch(_session(resp))
    assert (exc.value.status, exc.value.reason) == (502, "Bad Gateway")


async def test_fetch_content_type_error() -> None:
    resp = _json_resp(None)
    resp.json = AsyncMock(
        side_effect=aiohttp.ContentTypeError(
            MagicMock(), (), status=200, message="text/plain"
        )
    )
    with pytest.raises(EControlContentTypeError) as exc:
        await _fetch(_session(resp))
    assert (exc.value.status, exc.value.reason) == (200, "text/plain")


async def test_fetch_invalid_json() -> None:
    resp = _json_resp(None)
    resp.json = AsyncMock(side_effect=ValueError("Expecting value"))
    with pytest.raises(EControlJsonError) as exc:
        await _fetch(_session(resp))
    assert (exc.value.status, exc.value.error) == (200, "Expecting value")


async def test_fetch_rejects_a_non_list_body() -> None:
    with pytest.raises(EControlResponseShapeError) as exc:
        await _fetch(_session(_json_resp({"error": "nope"})))
    assert exc.value.got == "dict"


@pytest.mark.parametrize("call", ["fetch", "probe"])
@pytest.mark.parametrize(
    ("raised", "expected"),
    [
        (TimeoutError(), EControlTimeoutError),
        (
            aiohttp.ClientResponseError(
                MagicMock(), (), status=429, message="Too Many"
            ),
            EControlHttpError,
        ),
        (aiohttp.ClientConnectionError("refused"), EControlConnectionError),
    ],
)
async def test_transport_errors_map_to_api_errors(
    call: str, raised: BaseException, expected: type[Exception]
) -> None:
    session = _raising_session(raised)
    with pytest.raises(expected) as exc:
        if call == "fetch":
            await _fetch(session)
        else:
            await check_connection(
                session, latitude=48.2, longitude=16.4, fuel_type="DIE", user_agent=UA
            )
    assert exc.value.__cause__ is raised


async def test_connection_error_keeps_its_type_name() -> None:
    with pytest.raises(EControlConnectionError) as exc:
        await _fetch(_raising_session(aiohttp.ClientConnectionError("refused")))
    assert (exc.value.error_type, exc.value.error) == (
        "ClientConnectionError",
        "refused",
    )


async def test_check_connection_succeeds_and_always_includes_closed() -> None:
    session = _session(_json_resp([]))
    await check_connection(
        session, latitude=48.2, longitude=16.4, fuel_type="SUP", user_agent=UA
    )
    kwargs = session.get.call_args.kwargs
    assert kwargs["params"]["includeClosed"] == "true"
    assert kwargs["params"]["fuelType"] == "SUP"
    assert kwargs["timeout"].total == api.PROBE_TIMEOUT_SECONDS
