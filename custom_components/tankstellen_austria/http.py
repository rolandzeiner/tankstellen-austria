"""HTTP helpers for the Tankstellen Austria integration.

Single source of truth for outbound request headers. Centralised so the
two call sites (`coordinator.py` price fetches, `config_flow.py`
connection probe) can't drift in what they send to E-Control.

Deliberately **absent**: `Accept-Encoding`. `aiohttp` sends its own offer
(`ClientRequest.DEFAULT_HEADERS`, `gzip, deflate, zstd` on aiohttp 3.14.5),
and a value passed here *replaces* that default rather than adding to it, so
an explicit `gzip` would only narrow what reaches the server. E-Control's
Tomcat ignores the header today (verified 2026-05-08: identical-size plain
JSON, no `Content-Encoding`); if it ever starts compressing, the default
offer picks that up with no code change.
"""

from __future__ import annotations


def base_request_headers(user_agent: str) -> dict[str, str]:
    """Common request headers shared by every outbound call.

    The `User-Agent` value is the project-canonical identifier
    (`HomeAssistant/<ha-ver> tankstellen_austria/<our-ver> (+repo-url)`)
    so E-Control's abuse / coordination contact can reach the right
    repo from logs. Construction lives in `const.py:USER_AGENT`; this
    helper accepts the assembled string as a parameter so tests can
    pass a sentinel and still exercise the header shape.
    """
    return {
        "User-Agent": user_agent,
    }
