# Tankstellen Austria

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![HA min version](https://img.shields.io/badge/Home%20Assistant-%3E%3D2025.1-blue.svg)](https://www.home-assistant.io/)
[![Version](https://img.shields.io/github/v/release/rolandzeiner/tankstellen-austria?include_prereleases&label=version&color=blue)](https://github.com/rolandzeiner/tankstellen-austria/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![vibe-coded](https://img.shields.io/badge/vibe-coded-ff69b4?logo=musicbrainz&logoColor=white)](https://en.wikipedia.org/wiki/Vibe_coding)
[![Live demo](https://img.shields.io/badge/live-demo-2196F3.svg)](https://demo.rolandzeiner.at/#tankstellen)

Home Assistant integration for Austrian fuel prices via the
[E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner).
Shows the 5 cheapest stations near your location for Diesel, Super 95,
and CNG. No API key required.

## Features

- **Config-flow setup** with map picker for coordinates and per-entry options
- **One sensor per fuel type** — state = cheapest price, attributes carry all 5 stations (name, address, opening hours, payment methods, coordinates)
- **Custom Lovelace card** with fuel-type tabs, expandable station detail, map links, 7-day price sparkline, hour-of-day envelope band, and a best-refuel-time **window** highlighted on the chart
- **Dynamic mode** — bind a `device_tracker` so prices follow you as you drive (with distance threshold and rate-limit guards)
- **Payment-method filter / highlight** — show only stations accepting your card, or keep all visible with matches highlighted in green
- **Car fill-up cost widget** — define cars and see total fill-up cost (and €/100 km) at the cheapest station for that fuel type
- **Closed / Closing-Soon flags** on stations that won't be open when you arrive
- **German + English** translations and visual card editor

## Screenshots

<table>
  <tr>
    <td align="center"><img src="screenshots/card.webp" height="320" alt="Lovelace card" /></td>
    <td align="center"><img src="screenshots/card-config.webp" height="320" alt="Card editor" /></td>
    <td align="center"><img src="screenshots/config-flow.webp" height="320" alt="Config flow" /></td>
  </tr>
  <tr>
    <td align="center"><em>Lovelace card</em></td>
    <td align="center"><em>Card editor</em></td>
    <td align="center"><em>Config flow</em></td>
  </tr>
</table>

## Requirements

- Home Assistant **2025.1** or newer

## Installation

### HACS (recommended)

1. HACS → **Integrations** → ⋯ → **Custom repositories**
2. Add `https://github.com/rolandzeiner/tankstellen-austria` as type **Integration**
3. Search for "Tankstellen Austria", install, restart HA

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=rolandzeiner&repository=tankstellen-austria&category=integration)

### Manual

Copy `custom_components/tankstellen_austria/` to your HA `config/custom_components/`, then restart.

## Setup

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=tankstellen_austria)

**Settings → Devices & Services → + Add Integration → Tankstellen Austria.** Enter a name, pick your location, select fuel types, set the update interval, and optionally pick a `device_tracker` for dynamic mode. Reconfigure later via the entry's **Configure** button.

### Setup parameters

| Field | Description |
|---|---|
| Name | Display name; entity IDs derive from this |
| Latitude / Longitude | Reference coordinates (map picker) |
| Fuel types | Any combination of Diesel / Super 95 / CNG |
| Update interval | 10–720 min (default 30) |
| Include closed | Include currently closed stations in results |
| Dynamic location tracker | Optional `device_tracker` for follow-me mode |

## Lovelace card

The card auto-registers on integration start (storage-mode dashboards). For YAML dashboards, add the resource manually:

| URL | Type |
|-----|------|
| `/tankstellen-austria/tankstellen-austria-card.js` | JavaScript Module |

Minimal config (auto-detects all sensors):

```yaml
type: custom:tankstellen-austria-card
```

### Common card options

The visual editor exposes all options. Most-used flags:

| Option | Default | Description |
|---|---|---|
| `entities` | auto-detect | List of `sensor.tankstellen_*` entities |
| `max_stations` | `5` | Stations to show (0–5; `0` hides the list) |
| `language` | HA language | `de` or `en` |
| `show_map_links` | `true` | Per-station map link |
| `show_opening_hours` | `true` | Opening hours in the expandable detail |
| `show_payment_methods` | `true` | Payment-method chips in the expandable detail |
| `show_history` | `true` | 7-day sparkline (fixed mode only) |
| `show_best_refuel` | `true` | Best-refuel-time tip + sparkline marker |
| `payment_filter` | `[]` | List of methods (`cash`, `debit_card`, `credit_card`, or any API string e.g. `Austrocard`, `UTA`, `DKV`, `Routex`) |
| `payment_highlight_mode` | `true` | Highlight matches instead of hiding non-matches |
| `tab_labels` | `{}` | Override fuel-type tab labels per entity |
| `show_cars` / `cars` | `false` / `[]` | Fill-up cost widget; each car: `name`, `fuel_type` (`DIE`/`SUP`/`GAS`), `tank_size`, optional `consumption`, `icon` |
| `hide_header_price` | `false` | Hide the cheapest / average price hero |
| `logo_adapt_to_theme` | `false` | Render the E-Control footer logo as a theme silhouette |
| `hide_attribution` | `false` | Hide the E-Control attribution footer |

## Dynamic mode

Bind a `device_tracker` to follow your phone. The fixed coordinates from setup are the fallback when the tracker has no GPS.

| Guard | Value | Purpose |
|---|---|---|
| Distance threshold | 1.5 km | Ignore parking / walking drift |
| Per-entry cooldown | 10 min | Prevent rapid re-queries |
| Domain-wide cooldown | 5 min | Throttle across all entries |
| Safety-net poll | 6 hours | Keeps data fresh if the tracker stops reporting |

In the card, dynamic tabs label as `Diesel · iPhone`, the header replaces prices with the last-updated time, and a refresh button triggers an immediate poll. The 2-min cooldown shown on the button is a UI-side guard against accidental rapid clicks — clicks always poll fresh data. The sparkline is hidden in dynamic mode (history from varying locations isn't meaningful).

You can mix fixed and dynamic entries; both render as separate tabs in the same card.

## Best refuel time

The card analyses up to **4 weeks** of your sensor's recorded price history (refetched every 30 min) to find the **window of consecutive hours** that's consistently cheapest *relative to that week's prices*. The window is whatever length the data dictates — a single hour when one hour clearly stands out, or 18 hours of "anytime except midday" when the station only spikes around the legal noon-hike window. The same window is rendered as a translucent green band on the sparkline so the visual matches the text tip. A weekday is added only when its own signal is strong. A High / Medium / Low confidence badge shows next to the tip — hover for the breakdown.

Home Assistant's default `recorder.purge_keep_days` is **10**, so out of the box only ~10 days are available and confidence stays low until the window fills. Extend retention to get the full 28-day pipeline:

```yaml
# configuration.yaml
recorder:
  purge_keep_days: 30
```

### How it works

Austrian law (Preisauszeichnungsgesetz) lets prices rise only once a day at 12:00 noon and drop at any time. Combined with the sensor being the **min over N nearby stations** (`station_count` in the attributes), the aggregate price stream isn't a clean daily sawtooth — it's a combined signal of every station's noon hike, every station's evening drops, and the cheapest-of-N rolling over as different stations cross. The card extracts the time-of-day signal from this stream in six steps:

1. **Duration-weighted chunk walk** — each step-function price interval is split at every hour boundary it crosses; each (hour-of-day, weekday) bucket is credited with the active price weighted by milliseconds spent in it. Eliminates the phase bias hour-boundary sampling has when stations update mid-hour (e.g. a noon hike that lands at 12:14 no longer attributes the entire 12:00 bucket to the pre-hike price).
2. **Per-week winsorising** — values outside the 5th–95th percentile of each Monday-aligned week are clipped. Kills sensor glitches and stops the noon-reset spike from poisoning the per-week mean.
3. **Per-week normalisation** — each chunk becomes `price − week_mean`, so a slot that's consistently the weekly low wins regardless of absolute price level.
4. **Independent bucketing** — deltas aggregated separately into 24 hour-of-day and 7 weekday buckets (a single 168-cell grid would mix strong + weak signals).
5. **Weighted median per bucket** — entry weights are duration × recency, with recency `0.5^(age_in_days / 14)`. A chunk from 2 weeks ago counts half a chunk from today; 4 weeks ago, a quarter.
6. **Cheap-window expansion** — pick the bucket with the unconditional minimum median (no daytime tiebreaker — see below), then walk circularly outward in both directions, including every adjacent hour whose median is within ~0.5¢/L of that minimum. **No length cap** — the window is whatever length the data dictates. A station with a sharp single cheap hour returns a 1-hour window; a station with a flat overnight + drop-only behaviour returns whatever the cluster spans, even if that's most of the day.

There is deliberately **no daytime preference baked into the seed**. An earlier version of this code preferred the most-daytime hour among ties near the minimum, but in real aggregate fuel data many hours frequently share an identical post-winsorise median (winsorise collapses several distinct prices into the same clipped value, then per-week mean produces the same delta). The tiebreaker would then yank the seed across that tied cluster — say from hour 22 to hour 05 — and silently drop the truly cheapest hours. We chose the honest answer over the friendlier-looking one.

**Confidence** averages three components: data span (28-day window coverage), hour coverage (≥3 chunks per hour), and separation (gap between the cheapest bucket median and the cross-bucket median in cents, against a 1.5¢ reference). Maps to **High / Medium / Low** — these thresholds are UX calibration constants tuned against real Austrian price histories, not statistical thresholds.

The recommendation reflects the *cheapest nearby station at each point in time*, **not any single station's pattern** — a recommendation of "21:00–03:00" can mean one station drops in the evening and another comes in cheap at midnight, not that any single station is following that schedule. The min-of-N stream means apparent price hikes can also be station-uncovering events rather than real hikes.

## Sensors

Entity IDs follow HA's `_attr_has_entity_name` + `translation_key` pattern: the entry name is the device name, and each fuel-type sensor's name is translated. For an entry named "Home" with Diesel + Super 95 + CNG enabled, you get `sensor.home_diesel`, `sensor.home_super_95`, `sensor.home_cng_erdgas`.

| Entity | State | Unit |
|---|---|---|
| `sensor.{entry_name}_{translated_fuel_type}` | Cheapest price | €/L |

**Attributes** (used by the card and available for templates / automations):

| Attribute | Description |
|---|---|
| `fuel_type` | `DIE` / `SUP` / `GAS` |
| `fuel_type_name` | Diesel / Super 95 / CNG Erdgas |
| `station_display_name` | Locale-agnostic display name (matches the entry title) |
| `station_count` | Number of stations with prices |
| `average_price` | Average across the 5 cheapest |
| `stations` | List: `id`, `name`, `price`, `open`, `location`, `opening_hours`, `payment_methods` |
| `dynamic_mode` | `true` for entries that follow a tracker |
| `dynamic_tracker_label` | Friendly name of the bound tracker (dynamic mode only — the entity_id is intentionally not exposed) |
| `attribution` | `Datenquelle: E-Control` |

`payment_methods` per station: `cash`, `debit_card`, `credit_card` (booleans), and `others` (list of API strings like `Austrocard`, `UTA`).

## Data updates

| Mode | Default interval | Configurable |
|---|---|---|
| Fixed | 30 min | 10–720 min |
| Dynamic | Triggered by tracker movement; 6-h safety-net | Guards not user-configurable |

**E-Control's daily refresh window** (~12:05–12:07 Europe/Vienna) sometimes returns empty results. The integration keeps previous values and retries automatically after 10 minutes — sensors don't blip unavailable around noon.

**Partial failures** keep the working fuel types live and the failing one on its previous value. Only when *every* fuel type fails does the entry go unavailable.

## Supported functions

- Fetch the 5 cheapest nearby stations *with prices* per fuel type from the E-Control API (read-only, no service actions).
- One sensor per fuel type with full station list in attributes.
- Fixed coordinates **or** dynamic `device_tracker` follow-me, mixable across entries.
- Multiple simultaneous entries (e.g. home + work + phone).
- Reconfigure flow for changing location / fuel types without losing entity history.
- Diagnostics download with coordinate redaction.
- Repairs issue when a configured tracker disappears.

## Use cases

- **Price-threshold notifications** — alert when the cheapest Diesel drops below a target.
- **Follow-me prices while driving** — dynamic mode for road trips.
- **Home + work monitoring** — two fixed entries, compare side-by-side.
- **Payment-aware automations** — template on `payment_methods` to skip stations that don't accept your card.
- **Pin a favourite station** — template sensor that filters `stations` by name (see examples below).

## Examples

> Template sensors go into `configuration.yaml` under a top-level `template:` key (restart after editing). The HA UI Template helper works for single-line state expressions; multi-line examples below are easier in YAML.

**Notify when the cheapest Diesel drops below 1.50 €/L:**

```yaml
alias: "Notify on cheap Diesel"
trigger:
  - platform: numeric_state
    entity_id: sensor.tankstellen_home_diesel
    below: 1.50
action:
  - service: notify.mobile_app_phone
    data:
      title: "Cheap Diesel nearby"
      message: >
        {{ state_attr('sensor.tankstellen_home_diesel', 'stations')[0].name }}
        — {{ states('sensor.tankstellen_home_diesel') }} €/L
```

**Pin a favourite station — track its price even when it isn't currently in the top 5:**

```yaml
template:
  - sensor:
      - name: "Favourite station Diesel"
        unit_of_measurement: "€/L"
        state: >
          {{ state_attr('sensor.tankstellen_home_diesel', 'stations')
             | selectattr('name', 'search', 'Essmeister')
             | map(attribute='price') | list | first | default(none) }}
```

The API only returns the 5 cheapest stations with prices, so a pinned station that's not currently in the top 5 will show as `unavailable` for that update cycle. `| default(none)` is important — returning the string `'unavailable'` would trip the `€/L` numeric-unit validation.

**Same sensor via the UI Template helper.** Prefer clicking to editing YAML? Go to **Settings → Devices & Services → Helpers → + Create Helper → Template → Template a sensor** and fill in:

| Field | Value |
|---|---|
| Name | `Favourite Station Diesel` |
| State template | (paste the state expression below) |
| Unit of measurement | `€/L` |
| State class | `measurement` *(optional — enables history graphs)* |

```jinja
{{ state_attr('sensor.tankstellen_home_diesel', 'stations')
   | selectattr('name', 'search', 'Essmeister')
   | map(attribute='price') | list | first | default(none) }}
```

The helper stores its config in HA's internal storage (not `configuration.yaml`), so no restart is needed — the entity appears immediately and behaves identically to the YAML version.

## Troubleshooting

- **"Cannot connect to the E-Control API" during setup** — usually a transient network issue. Retry. Verify reachability of `https://api.e-control.at/sprit/1.0/...` from the HA host.
- **Sensors unavailable around 12:00–12:15** — expected (E-Control's daily refresh window). The integration retries after 10 minutes.
- **Repairs issue "Location tracker unavailable"** — the configured `device_tracker` is gone. Restore it, or **Reconfigure** the entry to pick a different one (or none).
- **Card not in the resource picker** — the integration auto-registers on storage-mode dashboards. For YAML dashboards add the resource manually (URL above).
- **Diagnostics for a bug report** — Settings → Devices & Services → Tankstellen Austria → ⋯ → **Download diagnostics**. Coordinates are redacted; paste into the issue.
- **Debug logging:**

  ```yaml
  # configuration.yaml
  logger:
    default: info
    logs:
      custom_components.tankstellen_austria: debug
  ```

## Known limitations

- API covers **Austria only** — neighbouring countries are not returned.
- Each query returns at most **5 stations with prices** for the requested fuel type.
- Don't poll faster than every 10 minutes (informal API rate limit).
- Best-refuel recommendation needs ≥ 7 days of history; improves up to 28. Window length is unbounded — it's whatever contiguous run of hours sits within ~0.5¢/L of the cheapest bucket median. 1-hour granularity inside it.
- Austrian public holidays are not modelled separately in the best-refuel pipeline.
- The DST transitions twice a year alias the local-clock label of one hour (skipped in spring, doubled in autumn). Real elapsed time is counted correctly; the label aliasing is negligible over a 28-day window.
- `average_price` is the average of the 5 cheapest only — not a regional average.

## Removal

1. **Settings → Devices & Services**, find the integration, ⋯ → **Delete**
2. Restart Home Assistant
3. (Manual installs only) remove `custom_components/tankstellen_austria/` from your config

## Development

Card sources live in `src/`, bundled by Rollup into `custom_components/tankstellen_austria/www/tankstellen-austria-card.js`. End users install via HACS and never run `npm`; contributors:

```bash
npm install
npm run build       # production bundle
npm run dev         # watch mode
```

`CARD_VERSION` lives in **both** `src/const.ts` and `custom_components/tankstellen_austria/const.py` — they must stay byte-identical or the WS version-check shows an infinite reload banner. Bump together.

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

This integration is not affiliated with or endorsed by E-Control Austria. All fuel price data is provided by the [E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner) and is subject to their terms. The developer assumes no liability for accuracy, completeness, or timeliness of displayed prices. Use at your own risk.

---

Diese Integration steht in keiner Verbindung zur E-Control Austria und wird von dieser nicht unterstützt. Alle Spritpreisdaten stammen von der [E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner). Für Richtigkeit, Vollständigkeit und Aktualität wird keine Haftung übernommen. Nutzung auf eigene Verantwortung.
