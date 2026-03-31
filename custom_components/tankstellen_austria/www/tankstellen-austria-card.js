/**
 * Tankstellen Austria Card
 * Custom Lovelace card for displaying Austrian fuel prices.
 * https://github.com/rolandzeiner/tankstellen-austria
 */

const TRANSLATIONS = {
  de: {
    cheapest: "Günstigste",
    price: "Preis",
    closed: "Geschlossen",
    open_now: "Geöffnet",
    opening_hours: "Öffnungszeiten",
    no_data: "Keine Daten verfügbar",
    mon_fri: "Mo–Fr",
    sat: "Sa",
    sun: "So",
    holiday: "Feiertag",
    map: "Karte",
    per_liter: "/l",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG Erdgas" },
  },
  en: {
    cheapest: "Cheapest",
    price: "Price",
    closed: "Closed",
    open_now: "Open",
    opening_hours: "Opening hours",
    no_data: "No data available",
    mon_fri: "Mon–Fri",
    sat: "Sat",
    sun: "Sun",
    holiday: "Holiday",
    map: "Map",
    per_liter: "/l",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG" },
  },
};

class TankstellenAustriaCard extends HTMLElement {
  _config = {};
  _hass = null;
  _activeTab = 0;
  _expandedStations = new Set();

  setConfig(config) {
    if (!config.entities || !config.entities.length) {
      throw new Error("Please define at least one entity.");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _t(key) {
    const lang = this._config.language || this._hass?.language || "de";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.de;
    return dict[key] || TRANSLATIONS.de[key] || key;
  }

  _fuelName(code) {
    const lang = this._config.language || this._hass?.language || "de";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.de;
    return dict.fuel_types[code] || code;
  }

  _formatPrice(price) {
    if (price == null) return "–";
    return `€ ${Number(price).toFixed(3).replace(".", ",")}`;
  }

  _mapsUrl(loc) {
    if (!loc) return "#";
    return `https://maps.google.com/?q=${encodeURIComponent(
      `${loc.postalCode || ""} ${loc.city || ""} ${loc.address || ""}`
    )}`;
  }

  _getEntities() {
    if (!this._hass) return [];
    return (this._config.entities || [])
      .map((eid) => {
        const state = this._hass.states[eid];
        if (!state) return null;
        return {
          entity_id: eid,
          state: state.state,
          attributes: state.attributes,
        };
      })
      .filter(Boolean);
  }

  _render() {
    if (!this._hass || !this._config.entities) return;

    const entities = this._getEntities();
    if (!entities.length) return;

    const showMapLinks = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;

    // Build HTML
    let html = `<ha-card>`;

    // Tabs
    if (entities.length > 1) {
      html += `<div class="tabs">`;
      entities.forEach((e, i) => {
        const ft = e.attributes.fuel_type || "";
        const active = i === this._activeTab ? "active" : "";
        html += `<button class="tab ${active}" data-tab="${i}">${this._fuelName(ft)}</button>`;
      });
      html += `</div>`;
    }

    // Active entity
    const active = entities[this._activeTab] || entities[0];
    const stations = active?.attributes?.stations || [];

    if (!stations.length) {
      html += `<div class="empty">${this._t("no_data")}</div>`;
    } else {
      html += `<div class="stations">`;
      stations.forEach((s, idx) => {
        const loc = s.location || {};
        const isExpanded = this._expandedStations.has(`${this._activeTab}-${idx}`);
        const expandClass = isExpanded ? "expanded" : "";
        const openLabel = s.open === false ? `<span class="badge closed">${this._t("closed")}</span>` : "";

        html += `
          <div class="station">
            <div class="station-main" data-expand="${this._activeTab}-${idx}">
              <div class="rank">${idx + 1}</div>
              <div class="info">
                <div class="name">${s.name || "–"}${openLabel}</div>
                <div class="address">${loc.postalCode || ""} ${loc.city || ""}, ${loc.address || ""}</div>
              </div>
              <div class="price">${this._formatPrice(s.price)}</div>
              ${
                showMapLinks
                  ? `<a class="map-link" href="${this._mapsUrl(loc)}" target="_blank" rel="noopener noreferrer" title="${this._t("map")}">
                      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </a>`
                  : ""
              }
            </div>
            ${
              showHours
                ? `<div class="hours ${expandClass}">
                    ${this._renderHours(s.opening_hours || [])}
                  </div>`
                : ""
            }
          </div>`;
      });
      html += `</div>`;
    }

    html += `</ha-card>`;

    this.innerHTML = html + this._getStyles();
    this._attachListeners();
  }

  _renderHours(hours) {
    if (!hours.length) return "";
    const mo = hours.find((h) => h.day === "MO") || hours[0];
    const sa = hours.find((h) => h.day === "SA") || hours[5];
    const so = hours.find((h) => h.day === "SO") || hours[6];
    const fe = hours.find((h) => h.day === "FE");

    let html = `<div class="hours-grid">`;
    if (mo) html += `<span class="day">${this._t("mon_fri")}</span><span>${mo.from} – ${mo.to}</span>`;
    if (sa) html += `<span class="day">${this._t("sat")}</span><span>${sa.from} – ${sa.to}</span>`;
    if (so) html += `<span class="day">${this._t("sun")}</span><span>${so.from} – ${so.to}</span>`;
    if (fe) html += `<span class="day">${this._t("holiday")}</span><span>${fe.from} – ${fe.to}</span>`;
    html += `</div>`;
    return html;
  }

  _attachListeners() {
    // Tab clicks
    this.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this._activeTab = parseInt(e.target.dataset.tab, 10);
        this._expandedStations.clear();
        this._render();
      });
    });

    // Expand/collapse
    this.querySelectorAll(".station-main").forEach((el) => {
      el.addEventListener("click", (e) => {
        // Don't toggle when clicking map link
        if (e.target.closest(".map-link")) return;
        const key = el.dataset.expand;
        if (this._expandedStations.has(key)) {
          this._expandedStations.delete(key);
        } else {
          this._expandedStations.add(key);
        }
        this._render();
      });
    });
  }

  _getStyles() {
    return `<style>
      ha-card {
        padding: 0;
        overflow: hidden;
      }
      .tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      }
      .tab {
        flex: 1;
        padding: 12px 8px;
        background: none;
        border: none;
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.2s, border-color 0.2s;
        border-bottom: 2px solid transparent;
      }
      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }
      .tab:hover {
        color: var(--primary-text-color);
      }
      .stations {
        padding: 0;
      }
      .station {
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.06));
      }
      .station:last-child {
        border-bottom: none;
      }
      .station-main {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .station-main:hover {
        background: var(--secondary-background-color, rgba(255,255,255,0.04));
      }
      .rank {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .info {
        flex: 1;
        min-width: 0;
      }
      .name {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .address {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .price {
        font-weight: 700;
        font-size: 16px;
        color: var(--primary-text-color);
        white-space: nowrap;
      }
      .map-link {
        color: var(--secondary-text-color);
        transition: color 0.2s;
        flex-shrink: 0;
      }
      .map-link:hover {
        color: var(--primary-color);
      }
      .badge {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 4px;
        font-weight: 600;
      }
      .badge.closed {
        background: var(--error-color, #db4437);
        color: #fff;
      }
      .hours {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.25s ease, padding 0.25s ease;
        padding: 0 16px 0 52px;
      }
      .hours.expanded {
        max-height: 120px;
        padding: 0 16px 12px 52px;
      }
      .hours-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 2px 12px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      .hours-grid .day {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .empty {
        padding: 24px 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }
    </style>`;
  }

  getCardSize() {
    return 5;
  }

  // Visual editor support
  static getConfigElement() {
    return document.createElement("tankstellen-austria-card-editor");
  }

  static getStubConfig() {
    return { entities: [] };
  }
}

// ------ Simple visual editor ------
class TankstellenAustriaCardEditor extends HTMLElement {
  _config = {};
  _hass = null;

  setConfig(config) {
    this._config = config;
    this._render();
  }
  set hass(hass) {
    this._hass = hass;
  }

  _render() {
    this.innerHTML = `
      <div style="padding:16px;">
        <p><b>Tankstellen Austria Card</b></p>
        <p style="font-size:13px;color:var(--secondary-text-color);">
          Add your Tankstellen Austria sensor entities below (one per fuel type).
        </p>
        <ha-textfield
          label="Entities (comma-separated)"
          value="${(this._config.entities || []).join(", ")}"
          style="width:100%;"
        ></ha-textfield>
      </div>
    `;
    this.querySelector("ha-textfield").addEventListener("change", (e) => {
      const entities = e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      this._config = { ...this._config, entities };
      this.dispatchEvent(
        new CustomEvent("config-changed", { detail: { config: this._config } })
      );
    });
  }
}

customElements.define("tankstellen-austria-card", TankstellenAustriaCard);
customElements.define("tankstellen-austria-card-editor", TankstellenAustriaCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "tankstellen-austria-card",
  name: "Tankstellen Austria",
  description: "Display Austrian fuel prices from E-Control Spritpreisrechner.",
  preview: false,
});