// Shared render helpers + small utilities used by the Tankstellen Austria
// card. Extracted so the version-banner + the WS card-version probe live
// in one place — the card stays focused on station rendering rather than
// carrying its own copy of the integration-upgrade plumbing.
//
// Conventions:
// - Pure functions: no `this`, take what they need as arguments,
//   return a TemplateResult or a Promise. The card keeps its own
//   reactive state (@state _versionMismatch) and calls these helpers
//   from render() / firstUpdated().
// - Localisation goes through the card's `t(key, repl?)` shape so the
//   helper does not own a hidden module-level language state.
// - Tankstellen ships a `stuck` branch (sessionStorage-flagged after a
//   user-initiated reload that didn't pick up the new bundle); the
//   helper renders both states based on the `stuck` flag passed in.
//   The sessionStorage write itself stays in the card — it knows the
//   target version key.

import { html, nothing, type TemplateResult } from "lit";
import type { HomeAssistant } from "custom-card-helpers";

/**
 * Probe the backend's card-version WebSocket command. Returns the
 * server-reported version when it differs from the bundled CARD_VERSION
 * (i.e. banner should appear), or null otherwise. Silent on transport
 * error — older HA installs without the handler simply don't surface a
 * mismatch, which is correct (the cache-buster URL still applies).
 */
export async function checkCardVersionWS(
  hass: HomeAssistant | undefined,
  type: string,
  bundleVersion: string,
): Promise<string | null> {
  if (!hass?.callWS) return null;
  try {
    const r = await hass.callWS<{ version?: string }>({ type });
    if (r?.version && r.version !== bundleVersion) return r.version;
  } catch {
    // Silent: older backend without the WS handler.
  }
  return null;
}

/**
 * Best-effort cache-storage wipe followed by a hard reload. The reload
 * picks up the freshly-cached JS bundle so the version-mismatch banner
 * clears on next mount.
 *
 * `caches` requires HTTPS in some contexts, hence the try/catch — fall
 * through to the reload regardless.
 */
export async function reloadAfterCacheWipe(): Promise<void> {
  try {
    if (typeof window !== "undefined" && "caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // best-effort cache wipe
  }
  location.reload();
}

export interface VersionBannerOpts {
  /** Server-reported version that doesn't match the bundle, or null. */
  mismatchVersion: string | null;
  /** True when a previous reload attempt didn't pick up the new bundle
   *  (caller tracks this via sessionStorage). Switches the banner to a
   *  "stuck" state with a dismiss button instead of looping reload. */
  stuck: boolean;
  /** Card's flat-key translate callback. Required keys:
   *  ``version_update`` (with `{v}` placeholder), ``version_reload``,
   *  ``version_reload_stuck``, ``version_dismiss``. */
  t: (key: string, repl?: Record<string, string>) => string;
  /** Click handler for the reload button (active state). */
  onReload: () => void;
  /** Click handler for the dismiss button (stuck state). */
  onDismiss: () => void;
}

/**
 * Render the version-mismatch banner. Returns the lit `nothing` sentinel
 * when there is no mismatch so call sites can splat it unconditionally
 * into their template.
 */
export function renderVersionBanner(
  opts: VersionBannerOpts,
): TemplateResult | typeof nothing {
  if (!opts.mismatchVersion) return nothing;
  if (opts.stuck) {
    return html`
      <div class="version-notice" role="alert" aria-live="assertive">
        <span>${opts.t("version_reload_stuck")}</span>
        <button
          class="version-reload-btn"
          type="button"
          @click=${opts.onDismiss}
        >
          ${opts.t("version_dismiss")}
        </button>
      </div>
    `;
  }
  const msg = opts.t("version_update", { v: opts.mismatchVersion });
  return html`
    <div class="version-notice" role="alert" aria-live="assertive">
      <span>${msg}</span>
      <button
        class="version-reload-btn"
        type="button"
        @click=${opts.onReload}
      >
        ${opts.t("version_reload")}
      </button>
    </div>
  `;
}
