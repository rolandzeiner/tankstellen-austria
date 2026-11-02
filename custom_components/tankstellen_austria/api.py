"""Client for E-Control's Spritpreisrechner API (``sprit/1.0``).

Owns everything about talking to E-Control: the endpoint, the request
parameters and headers, spotting the maintenance page, and turning every
failure into one of the exceptions below. Callers pass in the
``aiohttp.ClientSession`` and the User-Agent, so this module never needs
Home Assistant.

It deliberately imports nothing from Home Assistant or from the rest of the
package (``const.py`` pulls in HA for its User-Agent), and
``tests/test_api.py`` enforces that. Translating these exceptions into
``UpdateFailed`` and pacing the requests is the coordinator's job.
"""

from __future__ import annotations

from typing import Any, Final

import aiohttp

API_BASE_URL: Final = "https://api.e-control.at/sprit/1.0"
API_ENDPOINT: Final = "/search/gas-stations/by-address"
SEARCH_URL: Final = f"{API_BASE_URL}{API_ENDPOINT}"

FETCH_TIMEOUT_SECONDS: Final = 30
PROBE_TIMEOUT_SECONDS: Final = 10

# The API answers with a list of stations in which only the first five carry
# prices; the rest are bare locations.
PRICED_STATIONS_LIMIT: Final = 5

# --- E-Control maintenance page, measured 2026-09-27 ----------------------
#   From 2026-09-26 ~14:13 UTC every path under /sprit/1.0 — and
#   www.spritpreisrechner.at itself — answered `HTTP/1.0 507` with a 485-byte
#   text/html page titled "E-control Wartungsarbeiten" (meta refresh 15 s).
#   No Retry-After header, no JSON body. charge/1.0 and rc/1.0 on the same
#   host stayed up (401 without credentials), so the window is per service.
#   The page text is the signal, not the status: 507 means "Insufficient
#   Storage", and the next window may just as well answer 503 or 200.
# ----------------------------------------------------------------------------
MAINTENANCE_MARKER: Final = "Wartungsarbeiten"
# Most of an HTML body we read to look for the marker. The measured page is
# 485 B with the marker in <title>; the cap only guards against a huge page.
MAINTENANCE_SNIFF_BYTES: Final = 4096

# One station record exactly as E-Control sends it, plus the `distance_m` the
# coordinator stamps on. Nothing validates the shape, so every reader stays
# defensive (see `sensor._extract_price`); the card reads the same keys.
type Station = dict[str, Any]


class EControlError(Exception):
    """Base class for every failure talking to E-Control."""


class EControlTimeoutError(EControlError):
    """The request timed out."""


class EControlConnectionError(EControlError):
    """The request never got an HTTP answer (DNS, refused, reset, …)."""

    def __init__(self, err: aiohttp.ClientError) -> None:
        super().__init__(f"{type(err).__name__}: {err}")
        self.error_type = type(err).__name__
        self.error = str(err)


class EControlHttpError(EControlError):
    """E-Control answered with a non-2xx status."""

    def __init__(self, status: int, reason: str) -> None:
        super().__init__(f"HTTP {status}: {reason}")
        self.status = status
        self.reason = reason


class EControlMaintenanceError(EControlError):
    """E-Control answered with its maintenance page, whatever the status."""

    def __init__(self, status: int) -> None:
        super().__init__(f"maintenance page (HTTP {status})")
        self.status = status


class EControlPayloadError(EControlError):
    """A 2xx answer whose body is not a station list."""

    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


class EControlContentTypeError(EControlPayloadError):
    """The body isn't declared as JSON."""

    def __init__(self, status: int, reason: str) -> None:
        super().__init__(status, f"unexpected content type: {reason}")
        self.reason = reason


class EControlJsonError(EControlPayloadError):
    """The body claims to be JSON but doesn't parse."""

    def __init__(self, status: int, error: str) -> None:
        super().__init__(status, f"invalid JSON: {error}")
        self.error = error


class EControlResponseShapeError(EControlPayloadError):
    """The body parses, but isn't a list."""

    def __init__(self, status: int, got: str) -> None:
        super().__init__(status, f"expected a list, got {got}")
        self.got = got


def request_headers(user_agent: str) -> dict[str, str]:
    """Headers sent with every request.

    Deliberately **absent**: `Accept-Encoding`. `aiohttp` sends its own offer
    (`ClientRequest.DEFAULT_HEADERS`, `gzip, deflate, zstd` on aiohttp
    3.14.5), and a value passed here *replaces* that default rather than
    adding to it, so an explicit `gzip` would only narrow what reaches the
    server. E-Control's Tomcat ignores the header today (verified 2026-05-08:
    identical-size plain JSON, no `Content-Encoding`); if it ever starts
    compressing, the default offer picks that up with no code change.
    """
    return {"User-Agent": user_agent}


def _search_params(
    latitude: float, longitude: float, fuel_type: str, include_closed: bool
) -> dict[str, str]:
    return {
        "latitude": str(latitude),
        "longitude": str(longitude),
        "fuelType": fuel_type,
        "includeClosed": str(include_closed).lower(),
    }


async def _is_maintenance_page(resp: aiohttp.ClientResponse) -> bool:
    """Return True when E-Control answered with its maintenance page.

    Only an HTML response is read, so the JSON happy path pays nothing. The
    status code is deliberately ignored (see MAINTENANCE_MARKER above). A
    short read is fine: the marker sits in the page's <title>.
    """
    if resp.content_type != "text/html":
        return False
    head = await resp.content.read(MAINTENANCE_SNIFF_BYTES)
    return MAINTENANCE_MARKER in head.decode("utf-8", errors="replace")


def priced_stations(data: list[Any]) -> list[Station]:
    """Keep the stations that carry prices, at most PRICED_STATIONS_LIMIT.

    A non-dict entry raises AttributeError on purpose: that is a payload we
    can't read, and the coordinator counts it as inconclusive, not as an
    E-Control outage.
    """
    stations: list[Station] = []
    for station in data:
        if not station.get("prices"):
            continue
        stations.append(station)
        if len(stations) >= PRICED_STATIONS_LIMIT:
            break
    return stations


async def fetch_stations(
    session: aiohttp.ClientSession,
    *,
    latitude: float,
    longitude: float,
    fuel_type: str,
    include_closed: bool,
    user_agent: str,
) -> list[Station]:
    """Return the priced stations around a point for one fuel type.

    Raises an EControlError subclass for every failure class, so callers can
    tell timeouts, HTTP errors, maintenance and malformed answers apart.
    """
    try:
        async with session.get(
            SEARCH_URL,
            params=_search_params(latitude, longitude, fuel_type, include_closed),
            headers=request_headers(user_agent),
            timeout=aiohttp.ClientTimeout(total=FETCH_TIMEOUT_SECONDS),
        ) as resp:
            if await _is_maintenance_page(resp):
                raise EControlMaintenanceError(resp.status)
            resp.raise_for_status()
            try:
                data = await resp.json()
            except aiohttp.ContentTypeError as err:
                raise EControlContentTypeError(resp.status, err.message) from err
            except ValueError as err:  # json.JSONDecodeError is a ValueError
                raise EControlJsonError(resp.status, str(err)) from err
            if not isinstance(data, list):
                raise EControlResponseShapeError(resp.status, type(data).__name__)
    except TimeoutError as err:
        raise EControlTimeoutError("request timed out") from err
    except aiohttp.ClientResponseError as err:
        raise EControlHttpError(err.status, err.message) from err
    except aiohttp.ClientError as err:
        raise EControlConnectionError(err) from err
    return priced_stations(data)


async def check_connection(
    session: aiohttp.ClientSession,
    *,
    latitude: float,
    longitude: float,
    fuel_type: str,
    user_agent: str,
) -> None:
    """Probe the search endpoint once; raise an EControlError if it fails.

    Only the status is checked: the config flow wants to know that E-Control
    answers for this point, not what it answers.
    """
    try:
        async with session.get(
            SEARCH_URL,
            params=_search_params(latitude, longitude, fuel_type, True),
            headers=request_headers(user_agent),
            timeout=aiohttp.ClientTimeout(total=PROBE_TIMEOUT_SECONDS),
        ) as resp:
            resp.raise_for_status()
    except TimeoutError as err:
        raise EControlTimeoutError("request timed out") from err
    except aiohttp.ClientResponseError as err:
        raise EControlHttpError(err.status, err.message) from err
    except aiohttp.ClientError as err:
        raise EControlConnectionError(err) from err
