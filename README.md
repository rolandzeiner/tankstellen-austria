# Tankstellen Austria

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

Home Assistant integration for Austrian fuel prices via the
[E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner).

Shows the 5 cheapest fuel stations near your location for Diesel, Super 95,
and/or CNG.

## Features

- **Config-flow UI** – set up via the HA integrations page (map picker for
  coordinates)
- **One sensor per fuel type** – state = cheapest price, attributes contain
  all 5 stations with name, address, opening hours, and Google Maps link
- **Custom Lovelace card** – `tankstellen-austria-card` with fuel-type tabs,
  expandable opening hours, and map links
- **Translations** – German and English included, easy to extend
- **No API key required** – the E-Control API is public

## Installation

### HACS (recommended)

1. Open HACS → **Integrations** → three-dot menu → **Custom repositories**
2. Add `https://github.com/rolandzeiner/tankstellen-austria` as type
   **Integration**
3. Search for "Tankstellen Austria" and install
4. Restart Home Assistant

[![Add to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=rolandzeiner&repository=tankstellen-austria&category=integration)

### Manual

1. Copy `custom_components/tankstellen_austria/` to your HA
   `config/custom_components/` directory
2. Restart Home Assistant

## Setup

1. Go to **Settings → Devices & Services → + Add Integration**
2. Search for **Tankstellen Austria**
3. Enter a name, pick your location on the map, select fuel types, and
   configure the update interval

## Lovelace Card

The integration auto-registers the card JS. Add the resource if it wasn't
picked up automatically:

**Settings → Dashboards → Resources → Add Resource**

| URL | Type |
|-----|------|
| `/tankstellen-austria/tankstellen-austria-card.js` | JavaScript Module |

Then add the card to your dashboard:

```yaml
type: custom:tankstellen-austria-card
entities:
  - sensor.tankstellen_wieselburg_diesel
  - sensor.tankstellen_wieselburg_super_95
# Optional:
# language: de  (defaults to HA language, falls back to 'de')
# show_map_links: true
# show_opening_hours: true
```

The card auto-detects fuel types from the entity attributes and shows tabs.

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
| `stations` | List of station objects (id, name, price, open, location, opening_hours) |

## API Info

- **Base URL**: `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address`
- **Rate limit**: Don't poll more than every 10 minutes
- **No API key** required
- Returns 5 cheapest stations (with prices) + surrounding stations (without)

## License

MIT – see [LICENSE](LICENSE)

## Disclaimer

This integration is not affiliated with or endorsed by E-Control Austria. All fuel price data is provided by the [E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner) and is subject to their terms and conditions. The developer assumes no liability for the accuracy, completeness, or timeliness of the displayed prices. Use at your own risk.

---

Diese Integration steht in keiner Verbindung zur E-Control Austria und wird von dieser nicht unterstützt. Alle Spritpreisdaten stammen von der [E-Control Spritpreisrechner API](https://www.e-control.at/spritpreisrechner). Für die Richtigkeit, Vollständigkeit und Aktualität der angezeigten Preise wird keine Haftung übernommen. Nutzung auf eigene Verantwortung.