"""HTTP helpers for the Tankstellen Austria integration.

Single source of truth for outbound request headers. Centralised so the
two call sites (`coordinator.py` price fetches, `config_flow.py`
connection probe) can't drift in what they send to E-Control.

About `Accept-Encoding: gzip`: verified 2026-05-08 that E-Control's
Tomcat server currently ignores the header — both `--compressed` and
plain requests against `/search/gas-stations/by-address` return
identical-size plain JSON, no `Content-Encoding: gzip` in the response.
The header is kept anyway as defensive forward-compatibility (every
modern HTTP client sends it; if E-Control ever enables compression we
get the wire-size win automatically with zero code changes). aiohttp
decompresses transparently when the server does respond compressed.
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
        "Accept-Encoding": "gzip",
    }
