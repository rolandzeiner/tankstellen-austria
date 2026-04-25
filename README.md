# Tankstellen Austria

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![HA min version](https://img.shields.io/badge/Home%20Assistant-%3E%3D2025.1-blue.svg)](https://www.home-assistant.io/)
[![Version](https://img.shields.io/badge/version-1.8.0-blue.svg)](https://github.com/rolandzeiner/tankstellen-austria/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![vibe-coded](https://img.shields.io/badge/vibe-coded-ff69b4?logo=musicbrainz&logoColor=white)](https://en.wikipedia.org/wiki/Vibe_coding)

Home Assistant integration for Austrian fuel prices via the
[E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner).
Shows the 5 cheapest stations near your location for Diesel, Super 95,
and CNG. No API key required.

## Features

- **Config-flow setup** with map picker for coordinates and per-entry options
- **One sensor per fuel type** — state = cheapest price, attributes carry all 5 stations (name, address, opening hours, payment methods, coordinates)
- **Custom Lovelace card** with fuel-type tabs, expandable station detail, map links, 7-day price sparkline, and best-refuel-time recommendation
- **Dynamic mode** — bind a `device_tracker` so prices follow you as you drive (with distance threshold and rate-limit guards)
- **Payment-method filter / highlight** — show only stations accepting your card, or keep all visible with matches highlighted in green
- **Car fill-up cost widget** — define cars and see total fill-up cost (and €/100 km) at the cheapest station for that fuel type
- **Closed / Closing-Soon flags** on stations that won't be open when you arrive
- **German + English** translations; visual card editor; no API key

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

In the card, dynamic tabs label as `Diesel · iPhone`, the header replaces prices with the last-updated time, and a refresh button (with 2-min cooldown countdown) triggers an immediate poll. The sparkline is hidden — history from varying locations isn't meaningful.

You can mix fixed and dynamic entries; both render as separate tabs in the same card.

## Best refuel time

The card analyses up to **4 weeks** of your sensor's recorded price history (refetched every 30 min) to find the hour-of-day that's consistently cheapest *relative to that week's prices*. A weekday is added to the tip only when its own signal is strong. A High / Medium / Low confidence badge shows next to the tip — hover for the breakdown.

Home Assistant's default `recorder.purge_keep_days` is **10**, so out of the box only ~10 days are available and confidence stays low until the window fills. Extend retention to get the full 28-day pipeline:

```yaml
# configuration.yaml
recorder:
  purge_keep_days: 30
```

The recommendation needs at least **7 days** of history before any tip appears. Granularity is one hour. Austrian public holidays are not modelled separately.

## Sensors

| Entity | State | Unit |
|---|---|---|
| `sensor.tankstellen_{name}_{fuel_type}` | Cheapest price | €/L |

**Attributes** (used by the card and available for templates / automations):

| Attribute | Description |
|---|---|
| `fuel_type` | `DIE` / `SUP` / `GAS` |
| `fuel_type_name` | Diesel / Super 95 / CNG Erdgas |
| `station_count` | Number of stations with prices |
| `average_price` | Average across the 5 cheapest |
| `stations` | List: `id`, `name`, `price`, `open`, `location`, `opening_hours`, `payment_methods` |
| `dynamic_mode` | `true` for entries that follow a tracker |
| `dynamic_entity` | Tracked `device_tracker` entity (dynamic mode only) |
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

- Fetch the 5 cheapest nearby stations per fuel type from the E-Control API (read-only, no service actions).
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
- Best-refuel recommendation needs ≥ 7 days of history; improves up to 28.
- Austrian public holidays are not modelled separately.
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
