/**
 * Tankstellen Austria Card v1.1.0
 * Custom Lovelace card for displaying Austrian fuel prices.
 * https://github.com/rolandzeiner/tankstellen-austria
 */

const TRANSLATIONS = {
  de: {
    cheapest: "Günstigster Preis",
    average: "Ø Preis",
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
    last_7_days: "Letzte 7 Tage",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG Erdgas" },
  },
  en: {
    cheapest: "Cheapest price",
    average: "Avg. price",
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
    last_7_days: "Last 7 days",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG" },
  },
};

class TankstellenAustriaCard extends HTMLElement {
  _config = {};
  _hass = null;
  _activeTab = 0;
  _expandedStations = new Set();
  _historyData = {};
  _historyLoading = {};

  setConfig(config) {
    if (!config.entities || !config.entities.length) {
      throw new Error("Please define at least one entity.");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    const prevHass = this._hass;
    this._hass = hass;

    // Fetch history on first load
    if (!prevHass && hass) {
      this._fetchAllHistory();
    }

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

  _formatPriceShort(price) {
    if (price == null) return "–";
    return Number(price).toFixed(3).replace(".", ",");
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

  // --- History fetching via HA WebSocket API ---
  async _fetchHistory(entityId) {
    if (!this._hass || !this._hass.callWS) return;
    if (this._historyLoading[entityId]) return;

    this._historyLoading[entityId] = true;
    const now = new Date();
    const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    try {
      const result = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: startTime.toISOString(),
        end_time: now.toISOString(),
        entity_ids: [entityId],
        minimal_response: true,
        significant_changes_only: true,
      });

      if (result && result[entityId]) {
        this._historyData[entityId] = result[entityId]
          .map((entry) => ({
            time: new Date(entry.lu || entry.last_updated || entry.last_changed).getTime(),
            value: parseFloat(entry.s || entry.state),
          }))
          .filter((d) => !isNaN(d.value));
        this._render();
      }
    } catch (e) {
      console.debug("Tankstellen Austria: Could not fetch history for", entityId, e);
    } finally {
      this._historyLoading[entityId] = false;
    }
  }

  _fetchAllHistory() {
    (this._config.entities || []).forEach((eid) => this._fetchHistory(eid));
    clearInterval(this._historyInterval);
    this._historyInterval = setInterval(() => {
      (this._config.entities || []).forEach((eid) => this._fetchHistory(eid));
    }, 30 * 60 * 1000);
  }

  disconnectedCallback() {
    clearInterval(this._historyInterval);
  }

  // --- Sparkline SVG rendering ---
  _renderSparkline(entityId) {
    const data = this._historyData[entityId];
    if (!data || data.length < 2) return "";

    const width = 280;
    const height = 48;
    const padY = 4;

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 0.01;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - padY - ((d.value - min) / range) * (height - 2 * padY);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const polyline = points.join(" ");
    const areaPoints = `${polyline} ${width},${height} 0,${height}`;
    const gradId = `spark-grad-${entityId.replace(/\./g, "_")}`;

    return `
      <svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <polygon points="${areaPoints}" fill="url(#${gradId})" />
        <polyline points="${polyline}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
      </svg>
      <div class="sparkline-labels">
        <span>${this._formatPriceShort(min)}</span>
        <span class="sparkline-period">${this._t("last_7_days")}</span>
        <span>${this._formatPriceShort(max)}</span>
      </div>`;
  }

  _render() {
    if (!this._hass || !this._config.entities) return;

    const entities = this._getEntities();
    if (!entities.length) return;

    const showMapLinks = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showHistory = this._config.show_history !== false;

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
    const fuelType = active?.attributes?.fuel_type || "";
    const fuelTypeName = active?.attributes?.fuel_type_name || this._fuelName(fuelType);
    const avgPrice = active?.attributes?.average_price;

    // Header
    if (stations.length) {
      const cheapest = stations[0]?.price;
      html += `
        <div class="card-header">
          <div class="header-top">
            <div class="fuel-label">
              <svg viewBox="0 0 24 24" width="18" height="18" class="fuel-icon"><path fill="currentColor" d="M18 10a1 1 0 0 1-1-1 1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1m-6 0H8V5h4m7.77 2.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1 1 0 0 1-1 1 1 1 0 0 1-1-1V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16h10v-7.5h1.5v5A2.5 2.5 0 0 0 20 21a2.5 2.5 0 0 0 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z"/></svg>
              <span>${fuelTypeName}</span>
            </div>
            <div class="header-prices">
              <div class="header-price-item">
                <span class="header-price-label">${this._t("cheapest")}</span>
                <span class="header-price-value">${this._formatPrice(cheapest)}</span>
              </div>
              ${avgPrice != null ? `
              <div class="header-price-item">
                <span class="header-price-label">${this._t("average")}</span>
                <span class="header-price-value avg">${this._formatPrice(avgPrice)}</span>
              </div>` : ""}
            </div>
          </div>
          ${showHistory ? `<div class="sparkline-container">${this._renderSparkline(active.entity_id)}</div>` : ""}
        </div>`;
    }

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
    this.querySelectorAll(".tab").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this._activeTab = parseInt(e.target.dataset.tab, 10);
        this._expandedStations.clear();
        this._render();
      });
    });

    this.querySelectorAll(".station-main").forEach((el) => {
      el.addEventListener("click", (e) => {
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
      .card-header {
        padding: 16px 16px 8px;
      }
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
      }
      .fuel-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 15px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .fuel-icon {
        color: var(--primary-color);
      }
      .header-prices {
        display: flex;
        gap: 16px;
        text-align: right;
      }
      .header-price-item {
        display: flex;
        flex-direction: column;
      }
      .header-price-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-weight: 400;
      }
      .header-price-value {
        font-size: 18px;
        font-weight: 700;
        color: var(--primary-text-color);
      }
      .header-price-value.avg {
        font-size: 15px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }
      .sparkline-container {
        margin-top: 8px;
      }
      .sparkline {
        width: 100%;
        height: 48px;
        display: block;
      }
      .sparkline-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: var(--secondary-text-color);
        padding: 2px 0 0;
      }
      .sparkline-period {
        font-size: 10px;
        opacity: 0.6;
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
    return 6;
  }

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
