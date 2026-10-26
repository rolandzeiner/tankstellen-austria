"""Tests for the domain-wide upstream-outage Repairs issue (outage.py)."""

from __future__ import annotations

from collections.abc import Callable
from datetime import timedelta
from typing import Any
from unittest.mock import AsyncMock, MagicMock, patch

import aiohttp
import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.update_coordinator import UpdateFailed
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tankstellen_austria.const import (
    CONF_FUEL_TYPES,
    DOMAIN,
    MAINTENANCE_PROBE_MINUTES,
)
from custom_components.tankstellen_austria.coordinator import (
    TankstellenCoordinator,
    maintenance_window,
)
from custom_components.tankstellen_austria.outage import (
    OUTAGE_DATA,
    OUTAGE_ISSUE_ID,
    OUTAGE_MIN_SECONDS,
    Fault,
    async_clear_outage,
    async_note_fault,
    classify,
    classify_refresh,
)

from .conftest import BASE_ENTRY_DATA, MOCK_STATION, make_response_cm
from .test_coordinator import MAINTENANCE_PAGE

_PAST_THRESHOLD = timedelta(seconds=OUTAGE_MIN_SECONDS + 1)

# What E-Control answers one fuel type with: an HTTP status, a JSON payload,
# the recorded maintenance page, or a transport error raised on connect.
Answer = int | list[Any] | bytes | BaseException


def _response(answer: int | list[Any] | bytes) -> MagicMock:
    """Mock an aiohttp response the way `_fetch` reads it."""
    resp = MagicMock()
    if isinstance(answer, bytes):
        resp.status = 507
        resp.content_type = "text/html"
        resp.content.read = AsyncMock(return_value=answer)
    elif isinstance(answer, int):
        resp.status = answer
        resp.content_type = "text/plain"
    else:
        resp.status = 200
        resp.content_type = "application/json"
        resp.json = AsyncMock(return_value=answer)
    if resp.status >= 400:
        resp.raise_for_status = MagicMock(
            side_effect=aiohttp.ClientResponseError(
                request_info=MagicMock(),
                history=(),
                status=resp.status,
                message="error",
            )
        )
    else:
        resp.raise_for_status = MagicMock()
    return resp


class _FakeSession:
    """An aiohttp session stand-in answering per fuel type.

    `answer` is either one answer for every fuel type or a callable picking
    one by fuel type. Swap it between refreshes to script an outage.
    """

    def __init__(self, answer: Answer | Callable[[str], Answer]) -> None:
        self.answer = answer
        self.get = MagicMock(side_effect=self._get)

    def _get(self, url: str, *, params: dict[str, str], **_: Any) -> MagicMock:
        answer = self.answer
        if callable(answer) and not isinstance(answer, BaseException):
            answer = answer(params["fuelType"])
        if isinstance(answer, BaseException):
            cm = MagicMock()
            cm.__aenter__ = AsyncMock(side_effect=answer)
            cm.__aexit__ = AsyncMock(return_value=None)
            return cm
        return make_response_cm(_response(answer))


def _make_entry() -> MockConfigEntry:
    return MockConfigEntry(
        domain=DOMAIN,
        data={**BASE_ENTRY_DATA, CONF_FUEL_TYPES: ["DIE", "SUP"]},
        options={},
        title="Friedhof der Namenlosen",
    )


def _coordinator(
    hass: HomeAssistant, answer: Answer | Callable[[str], Answer]
) -> tuple[TankstellenCoordinator, _FakeSession]:
    entry = _make_entry()
    entry.add_to_hass(hass)
    coordinator = TankstellenCoordinator(hass, entry)
    session = _FakeSession(answer)
    coordinator._session = session  # type: ignore[assignment]
    return coordinator, session


def _issue(hass: HomeAssistant) -> ir.IssueEntry | None:
    return ir.async_get(hass).async_get_issue(DOMAIN, OUTAGE_ISSUE_ID)


def _failures(hass: HomeAssistant) -> int:
    state = hass.data.get(OUTAGE_DATA, {}).get("")
    return 0 if state is None else state.failures


def _failed(key: str, **placeholders: str) -> UpdateFailed:
    return UpdateFailed(
        translation_domain=DOMAIN,
        translation_key=key,
        translation_placeholders=placeholders or None,
    )


@pytest.mark.parametrize(
    ("err", "expected"),
    [
        (_failed("api_http_error", status="502"), Fault.OUTAGE),
        (_failed("api_http_error", status="500"), Fault.OUTAGE),
        (_failed("api_http_error", status="503"), Fault.OUTAGE),
        (_failed("api_invalid_json", status="200"), Fault.OUTAGE),
        (_failed("api_invalid_content_type", status="200"), Fault.OUTAGE),
        (_failed("api_invalid_response", status="200"), Fault.OUTAGE),
        (_failed("api_maintenance", status="507"), Fault.OUTAGE),
        (_failed("api_http_error", status="404"), Fault.ANSWERED),
        (_failed("api_http_error", status="429"), Fault.ANSWERED),
        (_failed("api_http_error", status="400"), Fault.ANSWERED),
        (_failed("api_http_error"), Fault.INCONCLUSIVE),
        (_failed("api_timeout", fuel_type="DIE"), Fault.INCONCLUSIVE),
        (_failed("api_connection_error", fuel_type="DIE"), Fault.INCONCLUSIVE),
        (_failed("api_all_failed"), Fault.INCONCLUSIVE),
        (AttributeError("'str' object has no attribute 'get'"), Fault.INCONCLUSIVE),
        (RuntimeError("unforeseen"), Fault.INCONCLUSIVE),
    ],
)
def test_classify(err: Exception, expected: Fault) -> None:
    """Only failures that prove a broken server count against E-Control."""
    assert classify(err) is expected


@pytest.mark.parametrize(
    ("answered", "errors", "expected"),
    [
        # One fuel type answered: the service is up, whatever the others did.
        (True, [_failed("api_http_error", status="503")], Fault.ANSWERED),
        # A 4xx for one fuel type is a real answer too.
        (
            False,
            [
                _failed("api_http_error", status="503"),
                _failed("api_http_error", status="404"),
            ],
            Fault.ANSWERED,
        ),
        # One provable fault is enough when nothing answered.
        (
            False,
            [_failed("api_http_error", status="503"), _failed("api_timeout")],
            Fault.OUTAGE,
        ),
        (False, [_failed("api_timeout"), _failed("api_timeout")], Fault.INCONCLUSIVE),
        (False, [], Fault.INCONCLUSIVE),
    ],
)
def test_classify_refresh(
    answered: bool, errors: list[Exception], expected: Fault
) -> None:
    """A refresh is one look at E-Control, reduced to a single note."""
    assert classify_refresh(answered, errors) is expected


async def test_issue_appears_only_after_the_threshold(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """A 503 starts the clock; the issue waits until it has run out."""
    coordinator, _ = _coordinator(hass, 503)
    await coordinator.async_refresh()
    assert _issue(hass) is None

    freezer.tick(timedelta(seconds=OUTAGE_MIN_SECONDS - 60))
    await coordinator.async_refresh()
    assert _issue(hass) is None

    freezer.tick(timedelta(seconds=61))
    await coordinator.async_refresh()
    issue = _issue(hass)
    assert issue is not None
    assert issue.translation_key == OUTAGE_ISSUE_ID
    assert issue.severity is ir.IssueSeverity.WARNING
    assert issue.is_fixable is False
    assert issue.is_persistent is False


async def test_one_refresh_is_one_note_however_many_fuel_types(
    hass: HomeAssistant,
) -> None:
    """Two fuel types failing in one refresh count once, not twice."""
    coordinator, session = _coordinator(hass, 503)
    await coordinator.async_refresh()
    assert session.get.call_count == 2
    assert _failures(hass) == 1


async def test_one_fault_never_raises_however_long_ago_it_began(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """The time alone isn't enough; the outage needs a second fault."""
    async_note_fault(hass, Fault.OUTAGE)
    freezer.tick(_PAST_THRESHOLD * 10)
    assert _issue(hass) is None
    assert hass.data[OUTAGE_DATA][""].failures == 1


async def test_two_faults_inside_the_window_raise_nothing(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """Back-to-back setup retries after a restart must not raise the issue."""
    async_note_fault(hass, Fault.OUTAGE)
    freezer.tick(timedelta(seconds=10))
    async_note_fault(hass, Fault.OUTAGE)
    freezer.tick(timedelta(seconds=20))
    async_note_fault(hass, Fault.OUTAGE)
    assert _issue(hass) is None


async def test_recovery_clears_the_issue(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """The first good answer ends the outage and removes the issue."""
    coordinator, session = _coordinator(hass, 503)
    await coordinator.async_refresh()
    freezer.tick(_PAST_THRESHOLD)
    await coordinator.async_refresh()
    assert _issue(hass) is not None

    session.answer = [MOCK_STATION]
    await coordinator.async_refresh()
    assert coordinator.last_update_success
    assert _issue(hass) is None
    assert "" not in hass.data[OUTAGE_DATA]

    # The next outage has to earn its own threshold again.
    session.answer = 503
    await coordinator.async_refresh()
    assert _issue(hass) is None


async def test_one_fuel_type_answering_ends_the_outage(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """A partial failure is a working service with one bad answer."""
    coordinator, session = _coordinator(hass, 503)
    await coordinator.async_refresh()
    freezer.tick(_PAST_THRESHOLD)
    session.answer = lambda fuel_type: [MOCK_STATION] if fuel_type == "DIE" else 503
    await coordinator.async_refresh()
    assert coordinator.last_update_success
    assert _issue(hass) is None
    assert _failures(hass) == 0


@pytest.mark.parametrize(
    "body",
    [{"not": "a list"}, "<html>Fehler</html>"],
    ids=["wrong-shape", "not-json"],
)
async def test_an_unusable_body_counts_as_an_outage(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, body: object
) -> None:
    """A 200 whose body isn't a station list is a fault on E-Control's side."""
    coordinator, session = _coordinator(hass, 503)
    if isinstance(body, str):
        resp = _response([])
        resp.json = AsyncMock(side_effect=ValueError("Expecting value"))
    else:
        resp = _response([])
        resp.json = AsyncMock(return_value=body)
    session.get = MagicMock(return_value=make_response_cm(resp))
    await coordinator.async_refresh()
    freezer.tick(_PAST_THRESHOLD)
    await coordinator.async_refresh()
    assert _issue(hass) is not None


async def test_network_errors_never_start_the_clock(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """Timeouts and connection errors can be the user's own network."""
    coordinator, session = _coordinator(hass, TimeoutError())
    await coordinator.async_refresh()
    freezer.tick(_PAST_THRESHOLD)
    session.answer = aiohttp.ClientConnectionError("refused")
    await coordinator.async_refresh()
    session.answer = 502
    await coordinator.async_refresh()
    assert _issue(hass) is None


async def test_network_errors_keep_a_running_outage_going(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """A timeout in the middle of an outage doesn't reset its clock."""
    coordinator, session = _coordinator(hass, 502)
    await coordinator.async_refresh()
    freezer.tick(_PAST_THRESHOLD)
    session.answer = TimeoutError()
    await coordinator.async_refresh()
    session.answer = 502
    await coordinator.async_refresh()
    assert _issue(hass) is not None


@pytest.mark.parametrize("status", [404, 429])
async def test_a_real_client_error_answer_ends_the_outage(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory, status: int
) -> None:
    """A 4xx comes from a working server, so the clock starts over."""
    coordinator, session = _coordinator(hass, 502)
    await coordinator.async_refresh()
    freezer.tick(_PAST_THRESHOLD)
    session.answer = status
    await coordinator.async_refresh()
    session.answer = 502
    await coordinator.async_refresh()
    assert _issue(hass) is None


async def test_a_local_parse_bug_is_not_an_outage(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """A crash while reading a valid list must not read as E-Control's fault."""
    coordinator, _ = _coordinator(hass, ["not a station"])
    async_note_fault(hass, Fault.OUTAGE)
    freezer.tick(_PAST_THRESHOLD)
    await coordinator.async_refresh()
    assert not coordinator.last_update_success
    assert _issue(hass) is None
    assert _failures(hass) == 1


async def test_maintenance_probes_feed_the_clock_and_the_window_does_not(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """Each real probe counts once; the fast-fails between them never do.

    The maintenance page is E-Control announcing downtime, so it is an
    outage. Inside the window no request goes out, and a refresh that made
    no request must not count as one.
    """
    coordinator, session = _coordinator(hass, MAINTENANCE_PAGE)
    await coordinator.async_refresh()
    assert maintenance_window(hass) is not None
    assert _failures(hass) == 1

    for _ in range(3):
        freezer.tick(timedelta(minutes=1))
        await coordinator.async_refresh()
    assert session.get.call_count == 2  # the first probe, both fuel types
    assert _failures(hass) == 1

    freezer.tick(timedelta(minutes=MAINTENANCE_PROBE_MINUTES))
    await coordinator.async_refresh()
    assert session.get.call_count == 4
    assert _failures(hass) == 2
    assert _issue(hass) is not None

    session.answer = [MOCK_STATION]
    freezer.tick(timedelta(minutes=MAINTENANCE_PROBE_MINUTES))
    await coordinator.async_refresh()
    assert maintenance_window(hass) is None
    assert _issue(hass) is None


async def test_issue_is_created_once(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """Later failures leave the raised issue alone instead of re-creating it."""
    async_note_fault(hass, Fault.OUTAGE)
    freezer.tick(_PAST_THRESHOLD)
    with patch(
        "custom_components.tankstellen_austria.outage.ir.async_create_issue"
    ) as create:
        async_note_fault(hass, Fault.OUTAGE)
        async_note_fault(hass, Fault.OUTAGE)
    assert create.call_count == 1


async def test_scopes_keep_separate_clocks_and_issues(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """A scoped outage gets its own issue id and doesn't touch the others."""
    async_note_fault(hass, Fault.OUTAGE, scope="a", placeholders={"name": "A"})
    async_note_fault(hass, Fault.OUTAGE, scope="b")
    freezer.tick(_PAST_THRESHOLD)
    async_note_fault(hass, Fault.OUTAGE, scope="a", placeholders={"name": "A"})
    registry = ir.async_get(hass)
    issue = registry.async_get_issue(DOMAIN, f"{OUTAGE_ISSUE_ID}_a")
    assert issue is not None
    assert issue.translation_placeholders == {"name": "A"}
    assert registry.async_get_issue(DOMAIN, f"{OUTAGE_ISSUE_ID}_b") is None

    async_clear_outage(hass, "a")
    assert registry.async_get_issue(DOMAIN, f"{OUTAGE_ISSUE_ID}_a") is None
    assert set(hass.data[OUTAGE_DATA]) == {"b"}


async def test_clear_outage_forgets_state_and_issue(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """Removing the last entry drops both the clock and the issue."""
    async_note_fault(hass, Fault.OUTAGE)
    freezer.tick(_PAST_THRESHOLD)
    async_note_fault(hass, Fault.OUTAGE)
    assert _issue(hass) is not None

    async_clear_outage(hass)
    assert _issue(hass) is None
    assert OUTAGE_DATA not in hass.data


def _patch_session(session: _FakeSession) -> Any:
    """Hand `session` to every coordinator built by a real entry setup."""
    return patch(
        "custom_components.tankstellen_austria.coordinator.async_get_clientsession",
        return_value=session,
    )


async def test_removing_the_last_entry_clears_the_outage(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """The issue can't outlive the integration: the last removal drops it."""
    entry = _make_entry()
    entry.add_to_hass(hass)
    with _patch_session(_FakeSession(502)):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        freezer.tick(_PAST_THRESHOLD)
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
    assert _issue(hass) is not None

    with patch(
        "custom_components.tankstellen_austria."
        "card_registration.JSModuleRegistration.async_unregister",
    ):
        assert await hass.config_entries.async_remove(entry.entry_id)
        await hass.async_block_till_done()
    assert _issue(hass) is None
    assert OUTAGE_DATA not in hass.data


async def test_entries_in_setup_retry_raise_and_clear_the_issue(
    hass: HomeAssistant, freezer: FrozenDateTimeFactory
) -> None:
    """An upstream outage, end to end through real config-entry setups.

    The shape of the 2026-10-21 Wiener Linien incident, replayed against
    E-Control: the API answers 503 for as long as it lasts, so every entry
    sits in setup retry and no coordinator timer runs. The setup attempts
    themselves have to feed the clock, or the issue never appears in exactly
    the case it was built for. Pinned here because nobody can stage a real
    outage to check.
    """
    session = _FakeSession(503)
    entry = _make_entry()
    entry.add_to_hass(hass)
    with _patch_session(session):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.SETUP_RETRY
        assert _issue(hass) is None

        freezer.tick(_PAST_THRESHOLD)
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.SETUP_RETRY
        assert _issue(hass) is not None

        session.answer = [MOCK_STATION]
        await hass.config_entries.async_reload(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.LOADED
        assert _issue(hass) is None
