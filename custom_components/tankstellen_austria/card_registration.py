"""Lovelace JS module registration for Tankstellen Austria.

Canonical pattern from the HA developer community guide:
https://community.home-assistant.io/t/developer-guide-embedded-lovelace-card-in-a-home-assistant-integration/974909

Storage-vs-yaml detection — the LovelaceData field name varies across
HA versions:

  * HA ≤ 2026.1: ``LovelaceData.mode: str``
    https://github.com/home-assistant/core/blob/2026.1.0/homeassistant/components/lovelace/__init__.py
  * HA ≥ 2026.2: ``LovelaceData.resource_mode: str``
    https://github.com/home-assistant/core/blob/2026.2.0/homeassistant/components/lovelace/__init__.py

``_is_storage_mode`` reads whichever attribute is present, preferring
``resource_mode`` when both happen to be defined — duck-typed by design
so we don't have to track every micro-rename across HA versions.
``resources`` itself is a
``ResourceYAMLCollection | ResourceStorageCollection`` union; the
type-only import + ``cast`` below narrow it for the storage-only
mutation calls without a runtime dependency on the typed class
existing on every HA version.

Tankstellen mounts the whole ``www/`` directory (not just the card JS)
so the E-Control logo SVG alongside resolves under the same URL_BASE.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_call_later

from .const import CARD_FILENAME, CARD_URL, CARD_VERSION, URL_BASE

# Typed access to LovelaceData via the public HassKey HA exposes since
# 2024.x. The string fallback covers HA versions that pre-date the key
# (very old installs that would also be missing other modern API surfaces
# we depend on, but the lookup itself shouldn't crash on import).
try:
    # Compound ignore covers both:
    #   - attr-defined: HA versions before LOVELACE_DATA shipped
    #   - unused-ignore: HA versions where the symbol IS exported and
    #     local mypy would otherwise grumble that the ignore is unused.
    from homeassistant.components.lovelace.const import (  # type: ignore[attr-defined,unused-ignore]
        LOVELACE_DATA,
    )
except ImportError:  # pragma: no cover — fallback for HA before LOVELACE_DATA shipped
    LOVELACE_DATA = None  # type: ignore[assignment,unused-ignore]

# `lovelace.resources` is a union of ResourceYAMLCollection (read-only)
# and ResourceStorageCollection (exposes async_create_item /
# async_update_item / async_delete_item). _is_storage_mode gates the
# branches that need the storage shape; the cast() at each call site
# narrows the union for mypy. Type-only import — the symbol is only
# referenced in the cast string literal, never at runtime, so older HA
# installs without this submodule layout still work.
if TYPE_CHECKING:
    from homeassistant.components.lovelace.resources import (
        ResourceStorageCollection,
    )

_LOGGER = logging.getLogger(__name__)

# Cap on _async_wait_for_lovelace_resources retry ticks. Each tick is 5s,
# so 60 ticks = 5 min. Reaching the cap means Lovelace's resource loader
# never flipped `loaded` — broken storage, YAML-mode race during reload,
# or future Lovelace internals change. Cheaper to surface the bad state
# with one warning than poll forever.
_LOVELACE_LOAD_RETRY_MAX = 60
_LOVELACE_LOAD_RETRY_INTERVAL_S = 5


class JSModuleRegistration:
    """Register the Tankstellen Austria card JS module for Lovelace.

    Storage mode: resources are created/updated via the Lovelace resources API.
    YAML mode: users must add the resource manually — registration is skipped.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the registrar."""
        self.hass = hass
        # Prefer the typed HassKey introduced in HA 2024.x — the bare
        # string lookup is what HA core can rename without notice (see
        # the LovelaceData `mode` → `resource_mode` rename across
        # HA 2026.1 → 2026.2 documented in the module docstring).
        if LOVELACE_DATA is not None:
            self.lovelace = self.hass.data.get(LOVELACE_DATA)
        else:
            self.lovelace = self.hass.data.get("lovelace")

    async def async_register(self) -> None:
        """Register frontend resources.

        Short-circuits the Lovelace mutation if the card JS file is
        missing — matching the safer pre-extraction behaviour. Without
        this check a dev environment without the built bundle would
        still rewrite the Lovelace resource pointing at a non-existent
        file.
        """
        # `http` is a soft dependency via manifest `after_dependencies`, so
        # it may not be loaded in the pytest env (pytest-homeassistant-custom-
        # component does not bootstrap `http` automatically). Skip instead of
        # crashing when absent — production installs always have it loaded.
        if getattr(self.hass, "http", None) is None:
            _LOGGER.debug(
                "http component not available; skipping card registration"
            )
            return
        if not (Path(__file__).parent / "www" / CARD_FILENAME).is_file():
            _LOGGER.warning(
                "Card JS not found at %s",
                Path(__file__).parent / "www" / CARD_FILENAME,
            )
            return
        await self._async_register_path()
        if self.lovelace is not None and self._is_storage_mode():
            await self._async_wait_for_lovelace_resources()

    def _is_storage_mode(self) -> bool:
        """Read the LovelaceData storage-vs-yaml field.

        The field was renamed across HA versions:
          - HA ≤ 2026.1: ``mode``
          - HA ≥ 2026.2: ``resource_mode``
        Whichever is present, we read it; the other won't exist on
        that HA version. See the module docstring for source links.
        Returns False if neither attribute is set (fail closed).
        """
        assert self.lovelace is not None
        for attr in ("resource_mode", "mode"):
            value = getattr(self.lovelace, attr, None)
            if value is not None:
                return bool(value == "storage")
        return False

    async def _async_register_path(self) -> None:
        """Mount the whole www/ directory under URL_BASE.

        Tankstellen serves the card bundle alongside ``e-control_logo.svg``
        (and any future static assets) from the same directory, so we
        register the directory rather than the single file. Caller is
        responsible for confirming the card JS file exists before
        invoking this method.
        """
        www_dir = Path(__file__).parent / "www"
        try:
            await self.hass.http.async_register_static_paths(
                [StaticPathConfig(URL_BASE, str(www_dir), False)]
            )
            _LOGGER.debug("Path registered: %s -> %s", URL_BASE, www_dir)
        except RuntimeError:
            _LOGGER.debug("Path already registered: %s", URL_BASE)

    async def _async_wait_for_lovelace_resources(self) -> None:
        """Wait for Lovelace resources to load, then register the module."""
        # Guarded by async_register(); narrow the Optional for mypy --strict.
        assert self.lovelace is not None
        attempts = 0

        async def _check_loaded(_now: Any) -> None:
            nonlocal attempts
            assert self.lovelace is not None
            if self.lovelace.resources.loaded:
                await self._async_register_module()
                return
            attempts += 1
            if attempts >= _LOVELACE_LOAD_RETRY_MAX:
                _LOGGER.warning(
                    "Lovelace resources never reported `loaded` after %d × %ds "
                    "(broken storage, YAML-mode race, or Lovelace internals "
                    "change?). Giving up — users on storage mode will need to "
                    "reload the integration once Lovelace is back online.",
                    _LOVELACE_LOAD_RETRY_MAX,
                    _LOVELACE_LOAD_RETRY_INTERVAL_S,
                )
                return
            _LOGGER.debug(
                "Lovelace resources not loaded, retrying in %ds (%d/%d)",
                _LOVELACE_LOAD_RETRY_INTERVAL_S,
                attempts,
                _LOVELACE_LOAD_RETRY_MAX,
            )
            async_call_later(
                self.hass, _LOVELACE_LOAD_RETRY_INTERVAL_S, _check_loaded
            )

        await _check_loaded(0)

    async def _async_register_module(self) -> None:
        """Register or update the JS module resource."""
        assert self.lovelace is not None
        # async_register() gates this method behind _is_storage_mode(),
        # so the resources collection is always the StorageCollection
        # variant. cast() tells mypy to treat the union as the narrow
        # type; runtime safety is the caller's _is_storage_mode() check.
        resources = cast("ResourceStorageCollection", self.lovelace.resources)
        versioned_url = f"{CARD_URL}?v={CARD_VERSION}"
        for item in resources.async_items():
            existing_base = str(item.get("url") or "").split("?")[0]
            if existing_base != CARD_URL:
                continue
            if item.get("url") == versioned_url:
                return  # already up to date
            try:
                await resources.async_update_item(
                    item["id"],
                    {"res_type": "module", "url": versioned_url},
                )
            except Exception as update_err:  # noqa: BLE001
                # Broad catch is deliberate. ResourceStorageCollection's
                # async_update_item can fail with HomeAssistantError,
                # KeyError (item evicted between async_items() and the
                # update call), or other exceptions whose precise class
                # has shifted across HA core versions. The recovery path
                # is the same regardless of cause: drop the existing row
                # and recreate, which costs a fresh resource id but
                # produces the same observable state for the dashboard
                # (resource at CARD_URL with the current ?v=). Narrowing
                # the catch risks regressions on a future HA version that
                # raises a different concrete class for the same failure
                # mode. The dashboard never holds these ids externally,
                # so the id churn is invisible to users.
                _LOGGER.debug(
                    "async_update_item failed (%s), trying delete+recreate",
                    update_err,
                )
                await resources.async_delete_item(item["id"])
                await resources.async_create_item(
                    {"res_type": "module", "url": versioned_url}
                )
            _LOGGER.info("Updated Lovelace resource to %s", versioned_url)
            return

        await resources.async_create_item(
            {"res_type": "module", "url": versioned_url}
        )
        _LOGGER.info("Registered Lovelace resource %s", versioned_url)

    async def async_unregister(self) -> None:
        """Remove the Lovelace resource owned by this integration."""
        if self.lovelace is None or not self._is_storage_mode():
            return
        resources = cast("ResourceStorageCollection", self.lovelace.resources)
        for item in list(resources.async_items()):
            if str(item.get("url") or "").split("?")[0] == CARD_URL:
                await resources.async_delete_item(item["id"])
                _LOGGER.info("Removed Lovelace resource %s", item.get("url"))
