"""Tests for the Tankstellen Austria coordinator."""
import asyncio
from datetime import timedelta
from unittest.mock import AsyncMock, MagicMock, patch

import aiohttp
import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import UpdateFailed
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria.const import (
    CONF_DYNAMIC_ENTITY,
    CONF_FUEL_TYPES,
    CONF_INCLUDE_CLOSED,
    CONF_SCAN_INTERVAL,
    DOMAIN,
    DOMAIN_LAST_API_CALL_KEY,
    DYNAMIC_COOLDOWN_MINUTES,
)
from custom_components.tankstellen_austria.coordinator import TankstellenCoordinator

from .conftest import BASE_ENTRY_DATA as _BASE_ENTRY_DATA, MOCK_STATION


def _make_entry(data: dict | None = None) -> MockConfigEntry:
    # Coordinator tests historically default to two fuel types (DIE+SUP)
    # to exercise the fan-out path; merge that on top of the shared base.
    entry_data = {**_BASE_ENTRY_DATA, CONF_FUEL_TYPES: ["DIE", "SUP"], **(data or {})}
    return MockConfigEntry(domain=DOMAIN, data=entry_data, options={})


# ---------------------------------------------------------------------------
# Fixed mode
# ---------------------------------------------------------------------------


async def test_fixed_mode_fetch_success(hass: HomeAssistant, mock_fetch) -> None:
    """Coordinator returns station data for each fuel type."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    await coordinator.async_refresh()

    assert "DIE" in coordinator.data
    assert "SUP" in coordinator.data
    assert coordinator.data["DIE"] == [MOCK_STATION]


async def test_fixed_mode_uses_configured_coordinates(hass: HomeAssistant, mock_fetch) -> None:
    """Coordinator fetches using the fixed lat/lng from config."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    await coordinator.async_refresh()

    mock_fetch.assert_any_call("DIE", 48.1478, 16.5147)


async def test_fixed_mode_uses_poll_interval(hass: HomeAssistant) -> None:
    """Fixed mode coordinator uses the configured scan interval."""
    entry = _make_entry({CONF_SCAN_INTERVAL: 60})
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.update_interval == timedelta(minutes=60)


async def test_api_failure_raises_update_failed(hass: HomeAssistant) -> None:
    """When the API raises, coordinator raises UpdateFailed."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            side_effect=Exception("connection refused"),
        ),
        pytest.raises(UpdateFailed),
    ):
        await coordinator._async_update_data()


async def test_fetch_rejects_non_list_payload(hass: HomeAssistant) -> None:
    """Non-list JSON (e.g. a dict error envelope) must raise UpdateFailed.

    Guards against silently returning [] when E-Control ever changes its
    response shape — a dict would otherwise iterate over its keys and
    produce an empty station list.
    """
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    resp = MagicMock()
    resp.raise_for_status = MagicMock()
    resp.json = AsyncMock(return_value={"error": "upstream_format_change"})
    resp.status = 200
    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(return_value=resp)

    with pytest.raises(UpdateFailed) as exc:
        await coordinator._fetch("DIE", 48.0, 16.0)
    assert exc.value.translation_key == "api_invalid_response"


async def test_coordinator_fetch_sends_canonical_user_agent(hass: HomeAssistant) -> None:
    """coordinator._fetch sends RFC-9110 UA: HomeAssistant/<ver> tankstellen_austria/<int_ver>.

    Regression guard. Before v1.7.0 the integration's outbound User-Agent was
    derived from CARD_VERSION (which carries a -beta-N suffix during card
    development), leaking card betas into the backend UA. The canonical
    constant in const.py decouples the two. If someone later inlines a
    different header string here, this test fails loudly.
    """
    from homeassistant.const import __version__ as HA_VERSION

    from custom_components.tankstellen_austria.const import (
        DOMAIN as TS_DOMAIN,
        INTEGRATION_VERSION,
        USER_AGENT,
    )

    # Canonical format: two space-separated product tokens, each with a slash.
    assert USER_AGENT == f"HomeAssistant/{HA_VERSION} {TS_DOMAIN}/{INTEGRATION_VERSION}"

    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Substitute a session mock whose .get() is awaitable and returns an empty
    # station list — enough for _fetch to reach the resp.json() path without
    # raising, so we can inspect the outgoing headers.
    resp = MagicMock()
    resp.raise_for_status = MagicMock()
    resp.json = AsyncMock(return_value=[])
    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(return_value=resp)

    await coordinator._fetch("DIE", 48.0, 16.0)

    assert coordinator._session.get.called
    headers = coordinator._session.get.call_args.kwargs["headers"]
    assert headers == {"User-Agent": USER_AGENT}


async def test_config_entry_not_ready_on_first_refresh_failure(
    hass: HomeAssistant,
) -> None:
    """When the API fails on first setup, the entry ends up in SETUP_RETRY state."""
    from homeassistant.config_entries import ConfigEntryState

    entry = _make_entry()
    entry.add_to_hass(hass)

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        side_effect=Exception("connection refused"),
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    assert entry.state is ConfigEntryState.SETUP_RETRY


# ---------------------------------------------------------------------------
# Dynamic mode — properties
# ---------------------------------------------------------------------------


async def test_dynamic_mode_property_false_for_fixed(hass: HomeAssistant) -> None:
    """dynamic_mode returns False when no tracker entity is configured."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.dynamic_mode is False
    assert coordinator.dynamic_entity is None


async def test_dynamic_mode_property_true_for_tracker(hass: HomeAssistant) -> None:
    """dynamic_mode returns True when a tracker entity is configured."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.dynamic_mode is True
    assert coordinator.dynamic_entity == "device_tracker.phone"


async def test_dynamic_mode_uses_safety_interval(hass: HomeAssistant) -> None:
    """Dynamic mode coordinator uses the 6-hour safety-net interval, not scan_interval."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone", CONF_SCAN_INTERVAL: 30})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator.update_interval == timedelta(hours=6)


# ---------------------------------------------------------------------------
# Dynamic mode — _should_update guards
# ---------------------------------------------------------------------------


async def test_should_update_first_call_no_prior_position(hass: HomeAssistant) -> None:
    """_should_update returns True on first call when there is no prior position."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    assert coordinator._should_update(48.15, 16.51) is True


async def test_should_update_distance_below_threshold(hass: HomeAssistant) -> None:
    """_should_update returns False when moved less than threshold.

    Steps the per-entry cooldown timestamp past ``DYNAMIC_COOLDOWN_MINUTES + 1``
    rather than a magic 1-hour offset — that way bumping the constant
    above 60 doesn't silently flip this test from a distance-gate
    assertion to a cooldown-gate one.
    """
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._last_fetch_lat = 48.1478
    coordinator._last_fetch_lng = 16.5147
    coordinator._last_fetch_time = dt_util.utcnow() - timedelta(
        minutes=DYNAMIC_COOLDOWN_MINUTES + 1
    )

    # Move only ~10 m
    assert coordinator._should_update(48.1479, 16.5148) is False


async def test_should_update_distance_above_threshold(hass: HomeAssistant) -> None:
    """_should_update returns True when moved more than threshold and cooldown passed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._last_fetch_lat = 48.1478
    coordinator._last_fetch_lng = 16.5147
    coordinator._last_fetch_time = dt_util.utcnow() - timedelta(
        minutes=DYNAMIC_COOLDOWN_MINUTES + 1
    )

    # Move ~15 km
    assert coordinator._should_update(48.25, 16.6) is True


async def test_should_update_per_entry_cooldown(hass: HomeAssistant) -> None:
    """_should_update returns False when per-entry cooldown has not elapsed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._last_fetch_lat = 48.0
    coordinator._last_fetch_lng = 15.0
    coordinator._last_fetch_time = dt_util.utcnow()  # just now → cooldown active

    # Even with large movement, cooldown blocks it
    assert coordinator._should_update(49.0, 16.0) is False


async def test_should_update_domain_cooldown(hass: HomeAssistant) -> None:
    """_should_update returns False when domain-wide cooldown has not elapsed."""
    from homeassistant.util import dt as dt_util

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Set domain-wide timestamp to just now
    hass.data.setdefault(DOMAIN, {})[DOMAIN_LAST_API_CALL_KEY] = dt_util.utcnow()

    assert coordinator._should_update(48.15, 16.51) is False


# ---------------------------------------------------------------------------
# Dynamic mode — teardown
# ---------------------------------------------------------------------------


async def test_async_teardown_unsubscribes(hass: HomeAssistant) -> None:
    """async_teardown cancels the state-change listener."""
    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.async_setup()

    assert coordinator._unsubscribe_tracker is not None
    coordinator.async_teardown()
    assert coordinator._unsubscribe_tracker is None


async def test_async_teardown_noop_for_fixed(hass: HomeAssistant) -> None:
    """async_teardown is a no-op for fixed mode."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.async_setup()  # no-op for fixed
    coordinator.async_teardown()  # should not raise
    assert coordinator._unsubscribe_tracker is None


# ---------------------------------------------------------------------------
# include_closed API param
# ---------------------------------------------------------------------------


async def test_include_closed_true_passed_to_api(hass: HomeAssistant) -> None:
    """includeClosed=true is sent to the API when CONF_INCLUDE_CLOSED is True."""
    entry = _make_entry({CONF_INCLUDE_CLOSED: True})
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    mock_resp = MagicMock()
    mock_resp.raise_for_status = MagicMock()
    mock_resp.json = AsyncMock(return_value=[MOCK_STATION])

    with patch.object(coordinator._session, "get", new=AsyncMock(return_value=mock_resp)) as mock_get:
        await coordinator._fetch("DIE", 48.1478, 16.5147)

    _, kwargs = mock_get.call_args
    assert kwargs["params"]["includeClosed"] == "true"


async def test_include_closed_false_passed_to_api(hass: HomeAssistant) -> None:
    """includeClosed=false is sent to the API when CONF_INCLUDE_CLOSED is False."""
    entry = _make_entry({CONF_INCLUDE_CLOSED: False})
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    mock_resp = MagicMock()
    mock_resp.raise_for_status = MagicMock()
    mock_resp.json = AsyncMock(return_value=[MOCK_STATION])

    with patch.object(coordinator._session, "get", new=AsyncMock(return_value=mock_resp)) as mock_get:
        await coordinator._fetch("DIE", 48.1478, 16.5147)

    _, kwargs = mock_get.call_args
    assert kwargs["params"]["includeClosed"] == "false"


# ---------------------------------------------------------------------------
# No-data retry
# ---------------------------------------------------------------------------


async def test_no_data_preserves_previous_data_and_schedules_retry(
    hass: HomeAssistant,
) -> None:
    """When all fuel types return empty stations, previous data is kept and retry scheduled."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    coordinator.data = {"DIE": [MOCK_STATION], "SUP": [MOCK_STATION]}

    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new_callable=AsyncMock,
            return_value=[],
        ),
        patch(
            "custom_components.tankstellen_austria.coordinator.async_call_later"
        ) as mock_call_later,
    ):
        result = await coordinator._async_update_data()

    assert result == {"DIE": [MOCK_STATION], "SUP": [MOCK_STATION]}
    mock_call_later.assert_called_once()


async def test_no_data_without_previous_returns_empty(hass: HomeAssistant) -> None:
    """When all fuel types return empty and there is no previous data, empty is returned."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)

    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new_callable=AsyncMock,
            return_value=[],
        ),
        patch("custom_components.tankstellen_austria.coordinator.async_call_later"),
    ):
        result = await coordinator._async_update_data()

    assert result == {"DIE": [], "SUP": []}


async def test_async_teardown_cancels_pending_no_data_retry(hass: HomeAssistant) -> None:
    """async_teardown cancels a scheduled no-data retry."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    mock_cancel = MagicMock()
    coordinator._no_data_retry_cancel = mock_cancel

    coordinator.async_teardown()

    mock_cancel.assert_called_once()
    assert coordinator._no_data_retry_cancel is None


# ---------------------------------------------------------------------------
# Partial-update handling
# ---------------------------------------------------------------------------


async def test_partial_failure_keeps_previous_for_failed_type(
    hass: HomeAssistant,
) -> None:
    """When one fuel type fails but another succeeds, previous data is kept
    for the failed one and no UpdateFailed is raised."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    prior_sup = [{**MOCK_STATION, "name": "Previous SUP"}]
    coordinator.data = {"DIE": [MOCK_STATION], "SUP": prior_sup}

    new_die = [{**MOCK_STATION, "name": "Fresh DIE"}]

    async def fake_fetch(self, fuel_type, lat, lng):
        if fuel_type == "SUP":
            raise UpdateFailed("SUP upstream 500")
        return new_die

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new=fake_fetch,
    ):
        result = await coordinator._async_update_data()

    assert result["DIE"] == new_die
    assert result["SUP"] == prior_sup  # kept from previous data


async def test_all_fuel_types_failing_raises_update_failed(
    hass: HomeAssistant,
) -> None:
    """When every fuel type fails, coordinator raises UpdateFailed."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)

    async def always_fail(self, fuel_type, lat, lng):
        raise UpdateFailed(f"{fuel_type} failed")

    with (
        patch(
            "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
            new=always_fail,
        ),
        pytest.raises(UpdateFailed),
    ):
        await coordinator._async_update_data()


async def test_partial_failure_without_previous_data_drops_failed_type(
    hass: HomeAssistant,
) -> None:
    """If there is no previous data and one fuel type fails, the coordinator
    returns only the fuel types that succeeded (no stale keys)."""
    entry = _make_entry()
    entry.add_to_hass(hass)

    coordinator = TankstellenCoordinator(hass, entry)
    # no coordinator.data yet — fresh start

    async def one_fails(self, fuel_type, lat, lng):
        if fuel_type == "SUP":
            raise UpdateFailed("SUP down")
        return [MOCK_STATION]

    with patch(
        "custom_components.tankstellen_austria.coordinator.TankstellenCoordinator._fetch",
        new=one_fails,
    ):
        result = await coordinator._async_update_data()

    assert result == {"DIE": [MOCK_STATION]}


# ---------------------------------------------------------------------------
# Repairs issue — dynamic tracker missing
# ---------------------------------------------------------------------------


async def test_tracker_missing_raises_repair_issue(hass: HomeAssistant) -> None:
    """When the dynamic device_tracker has no coords, a Repairs issue is raised."""
    from homeassistant.helpers import issue_registry as ir

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Simulate state with no latitude/longitude attributes
    coordinator._get_entity_coords(None)

    registry = ir.async_get(hass)
    issue = registry.async_get_issue(DOMAIN, f"tracker_missing_{entry.entry_id}")
    assert issue is not None
    assert issue.translation_key == "tracker_missing"
    assert coordinator._tracker_issue_raised is True


async def test_tracker_restored_clears_repair_issue(hass: HomeAssistant) -> None:
    """When the tracker returns with coordinates, the Repairs issue is cleared."""
    from homeassistant.helpers import issue_registry as ir

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    # Raise the issue
    coordinator._get_entity_coords(None)
    registry = ir.async_get(hass)
    assert registry.async_get_issue(DOMAIN, f"tracker_missing_{entry.entry_id}") is not None

    # Now simulate the tracker returning with fresh coordinates
    state = MagicMock()
    state.attributes = {"latitude": 48.2, "longitude": 16.4}
    coordinator._get_entity_coords(state)

    assert registry.async_get_issue(DOMAIN, f"tracker_missing_{entry.entry_id}") is None
    assert coordinator._tracker_issue_raised is False


# ---------------------------------------------------------------------------
# _fetch — payload shaping + error translation keys
# ---------------------------------------------------------------------------


def _stub_session_returning(coordinator: TankstellenCoordinator, payload: object) -> None:
    """Replace coordinator._session.get with a stub returning ``payload`` as JSON."""
    resp = MagicMock()
    resp.raise_for_status = MagicMock()
    resp.status = 200
    resp.json = AsyncMock(return_value=payload)
    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(return_value=resp)


async def test_fetch_caps_results_at_five_stations(hass: HomeAssistant) -> None:
    """_fetch returns at most 5 priced stations even if the API sends more.

    The E-Control API attaches prices only to the first five entries of
    its response and pads the rest with priceless siblings; the cap is
    what makes the priced-vs-priceless boundary deterministic for the
    sensor and card.
    """
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    payload = [
        {**MOCK_STATION, "id": i, "prices": [{"amount": 1.0 + i / 100}]}
        for i in range(10)
    ]
    _stub_session_returning(coordinator, payload)

    stations = await coordinator._fetch("DIE", 48.0, 16.0)
    assert len(stations) == 5
    assert [s["id"] for s in stations] == [0, 1, 2, 3, 4]


async def test_fetch_drops_priceless_stations(hass: HomeAssistant) -> None:
    """Stations without a ``prices`` array are filtered out before the cap.

    The API mixes priced + priceless entries; the sensor relies on the
    coordinator to pre-filter so cheapest-price logic doesn't see a
    ``None`` price.
    """
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    no_prices_key = {k: v for k, v in MOCK_STATION.items() if k != "prices"}
    payload = [
        {**MOCK_STATION, "id": 1, "prices": [{"amount": 1.5}]},
        {**MOCK_STATION, "id": 2, "prices": []},  # filtered (empty)
        {**no_prices_key, "id": 3},  # filtered (no key)
        {**MOCK_STATION, "id": 4, "prices": [{"amount": 1.6}]},
    ]
    _stub_session_returning(coordinator, payload)

    stations = await coordinator._fetch("DIE", 48.0, 16.0)
    assert [s["id"] for s in stations] == [1, 4]


async def test_fetch_timeout_uses_translation_key(hass: HomeAssistant) -> None:
    """asyncio.TimeoutError → UpdateFailed(translation_key='api_timeout')."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(side_effect=asyncio.TimeoutError())

    with pytest.raises(UpdateFailed) as exc:
        await coordinator._fetch("DIE", 48.0, 16.0)
    assert exc.value.translation_key == "api_timeout"


async def test_fetch_http_error_uses_translation_key(hass: HomeAssistant) -> None:
    """ClientResponseError → UpdateFailed(translation_key='api_http_error')."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    request_info = MagicMock()
    request_info.real_url = "https://example.invalid"
    err = aiohttp.ClientResponseError(
        request_info=request_info,
        history=(),
        status=500,
        message="Internal Server Error",
    )
    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(side_effect=err)

    with pytest.raises(UpdateFailed) as exc:
        await coordinator._fetch("DIE", 48.0, 16.0)
    assert exc.value.translation_key == "api_http_error"


async def test_fetch_connection_error_uses_translation_key(hass: HomeAssistant) -> None:
    """Generic ClientError → UpdateFailed(translation_key='api_connection_error')."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(side_effect=aiohttp.ClientError("DNS"))

    with pytest.raises(UpdateFailed) as exc:
        await coordinator._fetch("DIE", 48.0, 16.0)
    assert exc.value.translation_key == "api_connection_error"


async def test_fetch_invalid_json_uses_translation_key(hass: HomeAssistant) -> None:
    """ValueError from resp.json() → UpdateFailed(translation_key='api_invalid_json')."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    resp = MagicMock()
    resp.raise_for_status = MagicMock()
    resp.status = 200
    resp.json = AsyncMock(side_effect=ValueError("not JSON"))
    coordinator._session = MagicMock()
    coordinator._session.get = AsyncMock(return_value=resp)

    with pytest.raises(UpdateFailed) as exc:
        await coordinator._fetch("DIE", 48.0, 16.0)
    assert exc.value.translation_key == "api_invalid_json"


# ---------------------------------------------------------------------------
# _retry_no_data_fetch + tracker-fallback to HA home location
# ---------------------------------------------------------------------------


async def test_retry_no_data_fetch_clears_handle_and_requests_refresh(
    hass: HomeAssistant,
) -> None:
    """The scheduled callback clears its handle and requests a refresh.

    The handle clear is what allows a *next* no-data response to schedule
    again; the refresh request is what actually re-tries the fetch. If
    either is dropped, the no-data retry mechanism silently breaks.
    """
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    coordinator._no_data_retry_cancel = MagicMock()

    with patch.object(
        coordinator, "async_request_refresh", new=AsyncMock()
    ) as mock_request_refresh:
        coordinator._retry_no_data_fetch(None)
        await hass.async_block_till_done()

    assert coordinator._no_data_retry_cancel is None
    mock_request_refresh.assert_awaited_once()


async def test_get_entity_coords_falls_back_to_home_location(
    hass: HomeAssistant,
) -> None:
    """When the tracker is missing coords, _get_entity_coords returns hass.config.lat/lng.

    The Repairs-issue branch is already covered; this test guards the
    *return* contract. If someone refactors the fallback to return None,
    the dynamic coordinator will start fetching with stale coords
    instead of the home location and this test fails.
    """
    hass.config.latitude = 47.5
    hass.config.longitude = 13.5

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    lat, lng = coordinator._get_entity_coords(None)
    assert (lat, lng) == (47.5, 13.5)


async def test_tracker_issue_raised_only_once(hass: HomeAssistant) -> None:
    """Repeated calls with missing tracker do not duplicate the issue."""
    from homeassistant.helpers import issue_registry as ir

    entry = _make_entry({CONF_DYNAMIC_ENTITY: "device_tracker.phone"})
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)

    coordinator._get_entity_coords(None)
    coordinator._get_entity_coords(None)
    coordinator._get_entity_coords(None)

    registry = ir.async_get(hass)
    issues = [
        i for i in registry.issues.values()
        if i.domain == DOMAIN and i.issue_id.startswith("tracker_missing_")
    ]
    assert len(issues) == 1
