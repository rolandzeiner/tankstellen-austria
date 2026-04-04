/**
 * Tankstellen Austria Card v1.4.0
 * Custom Lovelace card for displaying Austrian fuel prices.
 * https://github.com/rolandzeiner/tankstellen-austria
 */

const TRANSLATIONS = {
  de: {
    cheapest: "Günstigster Preis",
    average: "Ø Preis",
    price: "Preis",
    closed: "Geschlossen",
    closing_soon: "Schließt bald",
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
    refresh: "Aktualisieren",
    last_updated: "Aktualisiert:",
    no_new_data: "Keine neuen Daten",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG Erdgas" },
    editor: {
      entities: "Sensoren",
      entities_hint: "Leer lassen für automatische Erkennung",
      max_stations: "Anzahl Tankstellen",
      show_map_links: "Google Maps Links anzeigen",
      show_opening_hours: "Öffnungszeiten anzeigen",
      show_history: "Preisverlauf anzeigen",
    },
  },
  en: {
    cheapest: "Cheapest price",
    average: "Avg. price",
    price: "Price",
    closed: "Closed",
    closing_soon: "Closing soon",
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
    refresh: "Refresh",
    last_updated: "Updated:",
    no_new_data: "No new data",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG" },
    editor: {
      entities: "Sensors",
      entities_hint: "Leave empty for auto-detection",
      max_stations: "Number of stations",
      show_map_links: "Show Google Maps links",
      show_opening_hours: "Show opening hours",
      show_history: "Show price history",
    },
  },
};

// Helper: find all tankstellen_austria sensors in hass states
function _findTankstellenEntities(hass) {
  if (!hass || !hass.states) return [];
  return Object.keys(hass.states).filter((eid) => {
    const state = hass.states[eid];
    return (
      eid.startsWith("sensor.") &&
      state.attributes &&
      state.attributes.fuel_type &&
      state.attributes.stations &&
      Array.isArray(state.attributes.stations)
    );
  });
}

const DYNAMIC_MANUAL_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes, matches backend

class TankstellenAustriaCard extends HTMLElement {
  _config = {};
  _hass = null;
  _activeTab = 0;
  _expandedStations = new Set();
  _historyData = {};
  _historyLoading = {};
  _lastManualRefresh = 0;
  _cooldownInterval = null;
  _noNewData = false;

  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    const prevHass = this._hass;
    this._hass = hass;

    if (!prevHass && hass) {
      this._fetchAllHistory();
    }

    this._render();
  }

  // Resolve entities: use config or auto-detect
  _resolveEntities() {
    if (!this._hass) return [];
    let entityIds = this._config.entities;

    // Auto-detect if no entities configured
    if (!entityIds || !entityIds.length) {
      entityIds = _findTankstellenEntities(this._hass);
    }

    return entityIds
      .map((eid) => {
        const state = this._hass.states[eid];
        if (!state) return null;
        return {
          entity_id: eid,
          state: state.state,
          attributes: state.attributes,
          last_updated: state.last_updated,
        };
      })
      .filter(Boolean);
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

  // --- History ---
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
    const entities = this._resolveEntities();
    entities.forEach((e) => this._fetchHistory(e.entity_id));
    clearInterval(this._historyInterval);
    this._historyInterval = setInterval(() => {
      const ents = this._resolveEntities();
      ents.forEach((e) => this._fetchHistory(e.entity_id));
    }, 30 * 60 * 1000);
  }

  disconnectedCallback() {
    clearInterval(this._historyInterval);
    clearInterval(this._cooldownInterval);
  }

  // --- Sparkline ---
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

  _handleRefresh() {
    const now = Date.now();
    if (now - this._lastManualRefresh < DYNAMIC_MANUAL_COOLDOWN_MS) return;
    this._lastManualRefresh = now;
    this._noNewData = false;
    const entities = this._resolveEntities();
    const active = entities[this._activeTab] || entities[0];
    const preRefreshTimestamp = active?.last_updated;
    entities.forEach((e) => {
      this._hass.callService("homeassistant", "update_entity", {
        entity_id: e.entity_id,
      });
    });
    // After HA has had time to fetch, check if data actually changed
    setTimeout(() => {
      const updated = this._resolveEntities();
      const updatedActive = updated[this._activeTab] || updated[0];
      if (updatedActive?.last_updated === preRefreshTimestamp) {
        this._noNewData = true;
        this._render();
      }
    }, 3000);
    // Start per-second re-render so the countdown stays live
    clearInterval(this._cooldownInterval);
    this._cooldownInterval = setInterval(() => {
      if (Date.now() - this._lastManualRefresh >= DYNAMIC_MANUAL_COOLDOWN_MS) {
        clearInterval(this._cooldownInterval);
        this._cooldownInterval = null;
      }
      this._render();
    }, 1000);
    this._render();
  }

  // Returns true if the station is open but will close within 30 minutes.
  _isClosingSoon(station) {
    if (station.open === false) return false;
    const hours = station.opening_hours || [];
    if (!hours.length) return false;

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon … 6=Sat

    let dayCode;
    if (dayOfWeek === 0) dayCode = "SO";
    else if (dayOfWeek === 6) dayCode = "SA";
    else dayCode = "MO"; // E-Control groups Mon–Fri under "MO"

    const todayHours = hours.find((h) => h.day === dayCode);
    if (!todayHours || !todayHours.to) return false;

    const parts = todayHours.to.split(":");
    const closeHour = parseInt(parts[0], 10);
    const closeMin = parseInt(parts[1], 10);
    if (isNaN(closeHour) || isNaN(closeMin)) return false;

    const closing = new Date(now);
    // "00:00" closing time means the station closes at midnight (next day)
    if (closeHour === 0 && closeMin === 0) {
      closing.setDate(closing.getDate() + 1);
      closing.setHours(0, 0, 0, 0);
    } else {
      closing.setHours(closeHour, closeMin, 0, 0);
    }

    const diffMinutes = (closing - now) / 60000;
    return diffMinutes > 0 && diffMinutes <= 30;
  }

  // --- Main render ---
  _render() {
    if (!this._hass) return;

    const entities = this._resolveEntities();
    if (!entities.length) {
      this.innerHTML = `<ha-card><div class="empty">${TRANSLATIONS[(this._config.language || "de")].no_data
        }</div></ha-card>${this._getStyles()}`;
      return;
    }

    const showMapLinks = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showHistory = this._config.show_history !== false;
    const maxStations = Math.min(5, Math.max(1, parseInt(this._config.max_stations, 10) || 5));

    let html = `<ha-card>`;

    // Tabs
    if (entities.length > 1) {
      html += `<div class="tabs">`;
      entities.forEach((e, i) => {
        const ft = e.attributes.fuel_type || "";
        const activeClass = i === this._activeTab ? "active" : "";
        let label = this._fuelName(ft);
        if (e.attributes.dynamic_mode === true) {
          const trackerId = e.attributes.dynamic_entity;
          const trackerName = trackerId
            ? (this._hass.states[trackerId]?.attributes?.friendly_name || trackerId.split(".")[1])
            : null;
          if (trackerName) label += ` · ${trackerName}`;
        }
        html += `<button class="tab ${activeClass}" data-tab="${i}">${label}</button>`;
      });
      html += `</div>`;
    }

    // Active entity
    const active = entities[this._activeTab] || entities[0];

    // Dynamic mode: based on the active tab only, so fixed tabs are unaffected
    const isDynamic = active?.attributes?.dynamic_mode === true;
    const remainingMs = DYNAMIC_MANUAL_COOLDOWN_MS - (Date.now() - this._lastManualRefresh);
    const refreshCoolingDown = isDynamic && remainingMs > 0;
    const countdownText = (() => {
      if (!refreshCoolingDown) return "";
      const s = Math.ceil(remainingMs / 1000);
      return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    })();

    // Last-updated time for dynamic header
    const lastUpdatedTime = (() => {
      if (!isDynamic || !active?.last_updated) return "";
      return new Date(active.last_updated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    })();

    const allStations = active?.attributes?.stations || [];
    const stations = allStations.slice(0, maxStations);
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
            ${isDynamic ? `
            <div class="dynamic-meta">
              ${lastUpdatedTime ? `<span class="last-updated">${this._t("last_updated")} ${lastUpdatedTime}</span>` : ""}
              ${this._noNewData ? `<span class="no-new-data">${this._t("no_new_data")}</span>` : ""}
            </div>
            <button class="refresh-btn${refreshCoolingDown ? " cooling" : ""}" data-refresh>
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
              ${refreshCoolingDown ? countdownText : this._t("refresh")}
            </button>` : `
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
            </div>`}
          </div>
          ${showHistory && !isDynamic ? `<div class="sparkline-container">${this._renderSparkline(active.entity_id)}</div>` : ""}
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
        const isClosed = s.open === false;
        const isClosingSoon = !isClosed && this._isClosingSoon(s);
        const openLabel = isClosed
          ? `<span class="badge closed">${this._t("closed")}</span>`
          : isClosingSoon
            ? `<span class="badge closing-soon">${this._t("closing_soon")}</span>`
            : "";

        html += `
          <div class="station">
            <div class="station-main" data-expand="${this._activeTab}-${idx}">
              <div class="rank">${idx + 1}</div>
              <div class="info">
                <div class="name">${s.name || "–"}${openLabel}</div>
                <div class="address">${loc.postalCode || ""} ${loc.city || ""}, ${loc.address || ""}</div>
              </div>
              <div class="price">${this._formatPrice(s.price)}</div>
              ${showMapLinks
            ? `<a class="map-link" href="${this._mapsUrl(loc)}" target="_blank" rel="noopener noreferrer" title="${this._t("map")}">
                      <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </a>`
            : ""
          }
            </div>
            ${showHours
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

    const refreshBtn = this.querySelector("[data-refresh]");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => this._handleRefresh());
    }

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
      .badge.closing-soon {
        background: var(--warning-color, #ff9800);
        color: #fff;
      }
      .dynamic-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        flex: 1;
        gap: 2px;
      }
      .last-updated {
        font-size: 11px;
        color: var(--secondary-text-color);
      }
      .no-new-data {
        font-size: 11px;
        color: var(--warning-color, #ff9800);
      }
      .refresh-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
        padding: 4px 8px;
        background: none;
        border: 1px solid var(--primary-color);
        border-radius: 6px;
        color: var(--primary-color);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }
      .refresh-btn.cooling {
        opacity: 0.4;
        cursor: default;
        pointer-events: none;
      }
      .refresh-btn:hover:not(.cooling) {
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
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

  static getStubConfig(hass) {
    const entities = _findTankstellenEntities(hass);
    return {
      entities: entities.length ? entities : [],
      max_stations: 5,
      show_map_links: true,
      show_opening_hours: true,
      show_history: true,
    };
  }
}

// ============================================================
// Visual Card Editor
// ============================================================
class TankstellenAustriaCardEditor extends HTMLElement {
  _config = {};
  _hass = null;

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _lang() {
    return this._hass?.language || "de";
  }

  _et(key) {
    const lang = this._lang();
    const dict = TRANSLATIONS[lang]?.editor || TRANSLATIONS.de.editor;
    return dict[key] || TRANSLATIONS.de.editor[key] || key;
  }

  _fireChanged() {
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: { ...this._config } } })
    );
  }

  _render() {
    if (!this._hass) return;

    // Find available tankstellen entities
    const available = _findTankstellenEntities(this._hass);
    const selected = this._config.entities || [];
    const maxStations = this._config.max_stations ?? 5;
    const showMap = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showHistory = this._config.show_history !== false;

    this.innerHTML = `
      <div class="editor">
        <style>
          .editor {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .editor-title {
            font-weight: 600;
            font-size: 16px;
            color: var(--primary-text-color);
          }
          .editor-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .editor-label {
            font-size: 13px;
            font-weight: 500;
            color: var(--primary-text-color);
          }
          .editor-hint {
            font-size: 12px;
            color: var(--secondary-text-color);
            margin-top: -4px;
          }
          .entity-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .entity-chip {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 16px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.15s;
            border: 1px solid var(--divider-color);
            background: transparent;
            color: var(--primary-text-color);
          }
          .entity-chip.selected {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: var(--primary-color);
          }
          .entity-chip:hover {
            opacity: 0.85;
          }
          .entity-chip .fuel-name {
            font-weight: 500;
          }
          .toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 0;
          }
          .toggle-row label {
            font-size: 13px;
            color: var(--primary-text-color);
            cursor: pointer;
          }
          .slider-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .slider-row input[type="range"] {
            flex: 1;
            accent-color: var(--primary-color);
          }
          .slider-value {
            min-width: 20px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
            color: var(--primary-text-color);
          }
        </style>

        <div class="editor-title">Tankstellen Austria</div>

        <!-- Entity selection -->
        <div class="editor-section">
          <div class="editor-label">${this._et("entities")}</div>
          <div class="editor-hint">${this._et("entities_hint")}</div>
          <div class="entity-chips">
            ${available.map((eid) => {
      const state = this._hass.states[eid];
      const ft = state?.attributes?.fuel_type || "";
      const ftName = (TRANSLATIONS[this._lang()] || TRANSLATIONS.de).fuel_types[ft] || ft;
      const isSelected = selected.includes(eid);
      return `<button class="entity-chip ${isSelected ? "selected" : ""}" data-entity="${eid}">
                <span class="fuel-name">${ftName}</span>
                <span style="font-size:11px;opacity:0.7;">${eid.split(".")[1]}</span>
              </button>`;
    }).join("")}
          </div>
        </div>

        <!-- Max stations slider -->
        <div class="editor-section">
          <div class="editor-label">${this._et("max_stations")}</div>
          <div class="slider-row">
            <input type="range" min="1" max="5" step="1" value="${maxStations}" data-field="max_stations" />
            <span class="slider-value">${maxStations}</span>
          </div>
        </div>

        <!-- Toggles -->
        <div class="editor-section">
          <div class="toggle-row">
            <label for="toggle-map">${this._et("show_map_links")}</label>
            <ha-switch id="toggle-map" ${showMap ? "checked" : ""} data-field="show_map_links"></ha-switch>
          </div>
          <div class="toggle-row">
            <label for="toggle-hours">${this._et("show_opening_hours")}</label>
            <ha-switch id="toggle-hours" ${showHours ? "checked" : ""} data-field="show_opening_hours"></ha-switch>
          </div>
          <div class="toggle-row">
            <label for="toggle-history">${this._et("show_history")}</label>
            <ha-switch id="toggle-history" ${showHistory ? "checked" : ""} data-field="show_history"></ha-switch>
          </div>
        </div>
      </div>
    `;

    // --- Attach listeners ---

    // Entity chip toggles
    this.querySelectorAll(".entity-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const eid = chip.dataset.entity;
        let current = [...(this._config.entities || [])];
        if (current.includes(eid)) {
          current = current.filter((e) => e !== eid);
        } else {
          current.push(eid);
        }
        this._config = { ...this._config, entities: current };
        this._fireChanged();
        this._render();
      });
    });

    // Range slider
    this.querySelectorAll('input[type="range"]').forEach((input) => {
      input.addEventListener("input", (e) => {
        const field = e.target.dataset.field;
        this._config = { ...this._config, [field]: parseInt(e.target.value, 10) };
        this._fireChanged();
        // Update the displayed value
        e.target.nextElementSibling.textContent = e.target.value;
      });
    });

    // Toggle switches
    this.querySelectorAll("ha-switch").forEach((sw) => {
      sw.addEventListener("change", (e) => {
        const field = e.target.dataset.field;
        this._config = { ...this._config, [field]: e.target.checked };
        this._fireChanged();
      });
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
  documentationURL: "https://github.com/rolandzeiner/tankstellen-austria",
});