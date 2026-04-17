# Tankstellen Austria

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![HA min version](https://img.shields.io/badge/Home%20Assistant-%3E%3D2024.11-blue.svg)](https://www.home-assistant.io/)
[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](https://github.com/rolandzeiner/tankstellen-austria/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![vibe-coded](https://img.shields.io/badge/vibe-coded-ff69b4?logo=musicbrainz&logoColor=white)](https://en.wikipedia.org/wiki/Vibe_coding)

Home Assistant integration for Austrian fuel prices via the
[E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner).

Shows the 5 cheapest fuel stations near your location for Diesel, Super 95,
and/or CNG.

## Features

- **Config-flow UI** – set up via the HA integrations page (map picker for coordinates)
- **One sensor per fuel type** – state = cheapest price, attributes contain all 5 stations with name, address, opening hours, payment methods, and Google Maps link
- **Custom Lovelace card** – `tankstellen-austria-card` with fuel-type tabs, expandable detail panel (opening hours + payment methods), map links, and 7-day price sparkline
- **Payment method filter** *(1.4.2)* – filter or highlight stations by accepted payment methods (cash, Bankomat, credit card, Austrocard, UTA, DKV, …)
- **Payment highlight mode** *(1.4.3)* – switch between hiding non-matching stations (filter) and highlighting them with a green accent instead
- **Custom payment method values** *(1.4.3)* – add fleet cards or other values not listed by nearby stations (e.g. Routex, DKV) directly in the card editor
- **Car fill-up cost widget** *(1.5.0)* – define your cars (name, fuel type, tank size, optional ⌀ consumption in l/100 km) in the card editor and see the total fill-up cost at the cheapest nearby station, shown below the price header; when consumption is set, the cost per 100 km is shown as a second line; each car gets its own MDI icon picked from a built-in icon grid; per-row toggles ("Tankkosten anzeigen" / "Verbrauch anzeigen") let you show only the fill-up cost, only the per-100 km cost (cars without consumption are hidden in that mode), or both
- **Best refuel time recommendation** *(1.5.0)* – analyses up to 4 weeks of price history to identify the weekday and hour that is consistently cheapest *relative to that week's prices*; uses time-weighted hourly sampling and per-week normalisation so a slot that is always the weekly low point wins regardless of whether prices were generally high or low that week; shown below the sparkline with a green marker on the graph; requires data spanning at least 2 weeks before a recommendation is shown (a "not enough data" hint is displayed until then)
- **Auto-detection** – the card automatically finds all Tankstellen Austria sensors, no manual entity configuration needed
- **Visual card editor** – configure everything through the HA UI
- **Average price tracking** – average of all 5 stations as sensor attribute, tracked in HA history for long-term analysis
- **Dynamic mode** *(1.4.0)* – track a `device_tracker` entity (e.g. your phone) and automatically refresh nearby prices as you drive, with distance threshold and rate limiting
- **Closing Soon badge** *(1.4.0)* – amber badge on stations that close within the next 30 minutes
- **Translations** – German and English included
- **No API key required** – the E-Control API is public
- **Reconfigurable** – change location, fuel types, update interval, or dynamic mode any time via the "Configure" button

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

- Home Assistant **2024.11** or newer

## Installation

### HACS (recommended)

1. Open HACS → **Integrations** → three-dot menu → **Custom repositories**
2. Add `https://github.com/rolandzeiner/tankstellen-austria` as type **Integration**
3. Search for "Tankstellen Austria" and install
4. Restart Home Assistant

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=rolandzeiner&repository=tankstellen-austria&category=integration)

### Manual

1. Copy `custom_components/tankstellen_austria/` to your HA `config/custom_components/` directory
2. Restart Home Assistant

## Setup

[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=tankstellen_austria)

1. Go to **Settings → Devices & Services → + Add Integration**
2. Search for **Tankstellen Austria**
3. Enter a name, pick your location on the map, select fuel types, configure the update interval, and optionally select a dynamic location tracker
4. Save and restart if prompted

To change settings later, go to **Settings → Devices & Services**, find the integration, and click **Configure**.

## Dynamic Mode

Dynamic mode lets the integration follow you as you drive, refreshing nearby fuel prices based on your current GPS position rather than a fixed coordinate.

### How to enable

Select a **device tracker** entity (e.g. `device_tracker.your_iphone`) in the **"Dynamic location tracker"** field — either during initial setup or via the **Configure** button on an existing entry.

The fixed location you set during setup becomes the **fallback**: used when the tracker entity has no GPS coordinates (e.g. zone-based trackers or when the device is offline).

### Update logic

Updates are triggered by location-change events on the tracker entity, subject to these guards:

| Guard | Value | Purpose |
|-------|-------|---------|
| Distance threshold | 1.5 km | Ignore small movements (walking, parking drift) |
| Per-entry cooldown | 10 min | Prevent rapid re-queries after moving |
| Domain-wide cooldown | 5 min | Protect against multiple entries firing simultaneously |
| Safety-net timer | 6 hours | Keeps data fresh if the tracker stops reporting |

### Dynamic card behaviour

When a dynamic entry is active, the card header changes:

- Prices (cheapest / average) are **hidden** — not meaningful for a moving location
- **"Updated: HH:MM"** shows when the data was last fetched
- A **Refresh button** triggers an immediate update with a 2-minute cooldown; while cooling down the button shows a live countdown (`1:59 → 0:00`) so you always know when it will be available again
- In multi-tab cards, dynamic tabs are labelled **"Diesel · iPhone"** (tracker friendly name) to distinguish them from fixed tabs

> **Note:** The 7-day price sparkline is hidden in dynamic mode — history from varying locations is not meaningful.

### Using fixed and dynamic entries together

You can have both a fixed entry (e.g. home) and a dynamic entry (e.g. iPhone) active at the same time. Add both sensors to a single card and they appear as separate tabs — each tab behaves according to its own mode. For separate dashboards, configure each card's `entities` list manually to show only the desired sensors.

## Lovelace Card

The integration auto-registers the card JS on startup. If it wasn't picked up automatically, add it manually:

**Settings → Dashboards → Resources → Add Resource**

| URL | Type |
|-----|------|
| `/tankstellen-austria/tankstellen-austria-card.js` | JavaScript Module |

Then add the card to your dashboard. The simplest setup auto-detects all sensors:

```yaml
type: custom:tankstellen-austria-card
```

Or configure manually:

```yaml
type: custom:tankstellen-austria-card
entities:
  - sensor.tankstellen_wieselburg_diesel
  - sensor.tankstellen_wieselburg_super_95
max_stations: 3
show_map_links: true
show_opening_hours: true
show_payment_methods: true
show_history: true
payment_filter:
  - cash
  - Austrocard
payment_highlight_mode: true
show_cars: true
cars:
  - name: Golf TDI
    fuel_type: DIE
    tank_size: 50
    icon: mdi:car-hatchback
  - name: Familienauto
    fuel_type: SUP
    tank_size: 65
    icon: mdi:car-estate
```

### Card options

| Option | Default | Description |
|--------|---------|-------------|
| `entities` | auto-detect | List of Tankstellen Austria sensor entities |
| `max_stations` | `5` | Number of stations to show (1–5) |
| `language` | HA language | `de` or `en` |
| `show_map_links` | `true` | Show map link per station — opens Google Maps for addresses with a street number, Google Search otherwise |
| `show_opening_hours` | `true` | Show expandable opening hours on click |
| `show_payment_methods` | `true` | Show payment method badges in expandable detail |
| `show_history` | `true` | Show 7-day sparkline price graph with best refuel time marker and recommendation (fixed mode only) |
| `payment_filter` | `[]` | Show/highlight stations accepting **at least one** of the listed methods. Values: `cash`, `debit_card`, `credit_card`, or any string from the API `others` field (e.g. `Austrocard`, `UTA`, `DKV`, `Routex`). Configurable via the visual editor. |
| `payment_highlight_mode` | `true` | When `true`, matching stations are highlighted with a green accent instead of non-matching ones being hidden. |
| `show_cars` | `false` | Show the fill-up cost row below the price header. |
| `cars` | `[]` | List of car objects. Each entry: `name` (string), `fuel_type` (`DIE`/`SUP`/`GAS`), `tank_size` (litres), `icon` (MDI icon name, e.g. `mdi:car-sports`). Configurable via the visual editor. |

### What the card shows

**Fixed mode:**
- Fuel type header with cheapest price and average price (Ø)
- 7-day sparkline of cheapest price history with min/max labels, green dashed marker at the best refuel hour, and a recommendation below (e.g. "Tip: Cheapest on Monday between 11:00–12:00"); analyses up to 4 weeks of history using time-weighted hourly sampling and per-week price normalisation — identifies the slot that is consistently cheapest *relative to that week*, not just in weeks where prices happened to be low overall; shows a "not enough data" hint until at least 2 weeks of data are available
- Station list ranked by price with name, address, and map link
- Expandable detail panel per station (click to open): opening hours + payment method badges
- **Closed** badge (red) on currently closed stations
- **Closing Soon** badge (amber) on stations closing within 30 minutes
- Optional **payment filter** — hide stations that don't accept any of the required methods, or use **highlight mode** to keep all stations visible with matching ones accented in green
- Custom payment values can be added in the editor (e.g. `Routex`, `DKV`) — common API values: `Austrocard`, `UTA`, `DKV`, `Routex`, `Fleetcard`, `ADAC`
- Optional **fill-up cost row** — shows total cost to fill each configured car at the cheapest station; only cars matching the active fuel type tab are shown

**Dynamic mode (additional/different):**
- Tab label includes tracker name — e.g. "Diesel · iPhone"
- Header shows **"Updated: HH:MM"** instead of prices
- **Refresh** button with live countdown cooldown (2 min)
- Sparkline hidden

### How the best refuel time is calculated

The "Tip: Cheapest on \<day\> between HH:00–HH+1:00" recommendation is computed in the browser from up to **4 weeks** of your sensor's own price history (refetched every 30 minutes). Three steps:

1. **Time-weighted hourly expansion** — the sensor only records a value when the cheapest nearby price changes, so each event is held constant across every full hour until the next event. This turns a sparse event stream into a dense hourly sample series.
2. **Per-week normalisation** — samples are grouped into Monday-aligned weeks; each sample's delta (`price − week_avg`) is used instead of the raw price. Slots are then ranked by how cheap they are *relative to their own week*, so a slot that is consistently the weekly low wins even in weeks where the overall price level was high.
3. **(Weekday, hour) bucketing** — deltas are averaged across the 168 possible (7 days × 24 hours) buckets; the bucket with the lowest average delta is the tip.

**Limitations**
- At least 2 weeks of history are needed before any tip appears. Weeks with fewer than 24 hourly samples are skipped, and each bucket needs ≥ 2 distinct weekly appearances to count.
- Accuracy improves with more data — a 2-week recommendation is noisy, at 4 weeks it stabilises, and it continues to refine as new weeks accumulate.
- Granularity is one hour; no confidence interval or uncertainty is shown.
- The Austrian daily 12:00 max-price reset and public holidays are not modelled explicitly — they are averaged into the numbers along with everything else.
- The tip reflects the *cheapest nearby station at each point in time* (what the sensor records), not any single station's pattern.

Have an idea to improve the algorithm (e.g. weighting recent weeks more heavily, holiday awareness, confidence intervals)? Open an issue or discussion on GitHub — feedback is welcome.

## Sensors

Each fuel type creates one sensor:

| Sensor | State | Unit |
|--------|-------|------|
| `sensor.tankstellen_{name}_{fuel_type}` | Cheapest price | €/l |

**Attributes** on each sensor:

| Attribute | Description |
|-----------|-------------|
| `fuel_type` | DIE / SUP / GAS |
| `fuel_type_name` | Diesel / Super 95 / CNG Erdgas |
| `station_count` | Number of stations with prices |
| `average_price` | Average price across all stations |
| `stations` | List of station objects (id, name, price, open, location, opening_hours, payment_methods) |
| `dynamic_mode` | `true` when the entry tracks a device_tracker entity |
| `dynamic_entity` | Entity ID of the tracked device_tracker (dynamic mode only) |

Each station object in `stations` includes a `payment_methods` dict:

```yaml
payment_methods:
  cash: true
  debit_card: true
  credit_card: false
  others:
    - Austrocard
    - UTA
```

This can be used directly in automations and templates, e.g. to alert when the cheapest station doesn't accept your preferred card.

## API Info

- **Base URL**: `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address`
- **Rate limit**: Don't poll more than every 10 minutes (60 minutes is safe)
- **No API key** required
- Returns 5 cheapest stations (with prices) + surrounding stations (without)
- All requests include a `User-Agent` header identifying the integration and HA version

### Important Notes

* **Price vs. Distance**: The API returns the five cheapest stations in the area, not necessarily the ones closest to your coordinates.
* **Average Price Calculation**: The `average_price` attribute is calculated based only on the five cheapest stations retrieved. It is not a representative average for all stations in the region.
* **Geographic Scope**: Only stations located within Austria are included. Stations in neighbouring countries are not covered by the E-Control API.

## Removal

1. Go to **Settings → Devices & Services**, find the Tankstellen Austria integration, and click the three-dot menu → **Delete**
2. Restart Home Assistant
3. Remove the `custom_components/tankstellen_austria/` directory from your HA config (manual installs only — HACS removes it automatically)

## License

MIT – see [LICENSE](LICENSE)

## Disclaimer

This integration is not affiliated with or endorsed by E-Control Austria. All fuel price data is provided by the [E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner) and is subject to their terms and conditions. The developer assumes no liability for the accuracy, completeness, or timeliness of the displayed prices. Use at your own risk.

---

Diese Integration steht in keiner Verbindung zur E-Control Austria und wird von dieser nicht unterstützt. Alle Spritpreisdaten stammen von der [E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner). Für die Richtigkeit, Vollständigkeit und Aktualität der angezeigten Preise wird keine Haftung übernommen. Nutzung auf eigene Verantwortung.
