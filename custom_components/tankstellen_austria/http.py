"""HTTP helpers for the Tankstellen Austria integration.

Single source of truth for outbound request headers. Centralised so the
two call sites (`coordinator.py` price fetches, `config_flow.py` connection
probe) can't drift in what they send to E-Control. The accompanying
`tests/test_user_agent.py` parametrised regression test asserts both
sites emit byte-identical headers.

Why `Accept-Encoding: gzip`: aiohttp does NOT auto-add it, so without an
explicit header E-Control sees no client preference and ships the JSON
uncompressed. Diesel/SUP/CNG payloads at urban hotspots are 50-200 KB
JSON arrays — gzip typically compresses 4-6x on price-list payloads.
aiohttp's response decompression is transparent so call sites need no
changes beyond the header.
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
