/**
 * Tankstellen Austria Card v1.5.0-beta-3
 * Custom Lovelace card for displaying Austrian fuel prices.
 * https://github.com/rolandzeiner/tankstellen-austria
 */

const CARD_VERSION = "1.5.0-beta-4";

const TRANSLATIONS = {
  de: {
    cheapest: "Günstigster Preis",
    average: "Ø Preis",
    price: "Preis",
    closed: "Geschlossen",
    closing_soon: "Schließt bald",
    open_now: "Geöffnet",
    opening_hours: "Öffnungszeiten",
    payment: "Zahlungsarten",
    cash: "Bar",
    debit_card: "Bankomat",
    credit_card: "Kreditkarte",
    payment_filter_active: "Zahlungsfilter aktiv",
    payment_highlight_active: "Zahlungsfilter (Hervorhebung)",
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
    version_update: "Tankstellen Austria wurde auf v{v} aktualisiert — bitte neu laden",
    version_reload: "Neu laden",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG Erdgas" },
    fill_up: "Volltanken",
    best_refuel: "Tipp: Am {day} zwischen {h1}:00–{h2}:00 am günstigsten tanken",
    not_enough_data_hint: "Noch zu wenig Daten für Empfehlung (mind. 7 Tage)",
    weekdays: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    editor: {
      entities: "Sensoren",
      entities_hint: "Leer lassen für automatische Erkennung",
      max_stations: "Anzahl Tankstellen",
      show_map_links: "Google Maps Links anzeigen",
      show_opening_hours: "Öffnungszeiten anzeigen",
      show_payment_methods: "Zahlungsarten anzeigen",
      show_history: "Preisverlauf anzeigen",
      payment_filter: "Nur Tankstellen mit",
      payment_filter_custom_placeholder: "Benutzerdefiniert, z.B. Routex",
      payment_filter_custom_hint: "Der Wert muss exakt dem API-String entsprechen. Häufige Werte: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",
      payment_highlight_mode: "Hervorheben statt filtern",
      section_sensors: "Sensoren",
      section_display: "Anzeige",
      section_payment_filter: "Zahlungsfilter",
      section_cars: "Fahrzeuge",
      show_cars: "Tankkosten anzeigen",
      car_name_placeholder: "Name (z.B. Golf TDI)",
      car_tank_placeholder: "Liter",
      add_car: "+ Fahrzeug hinzufügen",
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
    payment: "Payment",
    cash: "Cash",
    debit_card: "Debit card",
    credit_card: "Credit card",
    payment_filter_active: "Payment filter active",
    payment_highlight_active: "Payment filter (highlight)",
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
    version_update: "Tankstellen Austria updated to v{v} — please reload",
    version_reload: "Reload",
    fuel_types: { DIE: "Diesel", SUP: "Super 95", GAS: "CNG" },
    fill_up: "Fill up",
    best_refuel: "Tip: Cheapest on {day} between {h1}:00–{h2}:00",
    not_enough_data_hint: "Not enough data yet for a tip (min. 7 days)",
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    editor: {
      entities: "Sensors",
      entities_hint: "Leave empty for auto-detection",
      max_stations: "Number of stations",
      show_map_links: "Show Google Maps links",
      show_opening_hours: "Show opening hours",
      show_payment_methods: "Show payment methods",
      show_history: "Show price history",
      payment_filter: "Only stations with",
      payment_filter_custom_placeholder: "Custom, e.g. Routex",
      payment_filter_custom_hint: "Must match the API string exactly. Common values: Routex, UTA, DKV, Austrocard, Fleetcard, ADAC",
      payment_highlight_mode: "Highlight instead of filter",
      section_sensors: "Sensors",
      section_display: "Display",
      section_payment_filter: "Payment filter",
      section_cars: "Cars",
      show_cars: "Show fill-up costs",
      car_name_placeholder: "Name (e.g. Golf TDI)",
      car_tank_placeholder: "Liters",
      add_car: "+ Add car",
    },
  },
};

const CAR_ICONS = [
  "mdi:car", "mdi:car-sports", "mdi:car-hatchback", "mdi:car-estate",
  "mdi:car-convertible", "mdi:car-pickup", "mdi:car-electric",
  "mdi:car-electric-outline", "mdi:car-side", "mdi:van-passenger",
  "mdi:motorbike", "mdi:bus", "mdi:truck", "mdi:rv-truck",
];

// Shared HTML escape — safe for both attribute values and text content.
const _escHtml = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

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
  _historyInterval = null;
  _lastManualRefresh = 0;
  _cooldownInterval = null;
  _noNewData = false;
  _versionMismatch = null;

  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    const prevHass = this._hass;
    this._hass = hass;

    if (!prevHass && hass) {
      this._fetchAllHistory();
      this._checkCardVersion();
      this._render();
      return;
    }

    // Skip re-render when none of the relevant entity states changed.
    // HA state objects are immutable — a new object means new data.
    if (prevHass) {
      const eids = this._config.entities?.length
        ? this._config.entities
        : _findTankstellenEntities(hass);
      const changed = eids.some((eid) => prevHass.states[eid] !== hass.states[eid]);
      if (!changed) return;
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

  _mapsUrl(loc, stationName) {
    if (!loc) return "#";
    const hasStreetNumber = /\d/.test(loc.address || "");
    if (hasStreetNumber) {
      return `https://maps.google.com/?q=${encodeURIComponent(
        `${loc.postalCode || ""} ${loc.city || ""} ${loc.address || ""}`.trim()
      )}`;
    }
    // No street number — fall back to Google search with station name + what we have
    const parts = [stationName, loc.address, loc.postalCode, loc.city].filter(Boolean);
    return `https://www.google.com/search?q=${encodeURIComponent(parts.join(" "))}`;
  }

  // --- History ---
  async _fetchHistory(entityId) {
    if (!this._hass || !this._hass.callWS) return;
    if (this._historyLoading[entityId]) return;

    this._historyLoading[entityId] = true;
    const now = new Date();
    // Fetch 4 weeks so the recommendation has enough data across many weekday/hour buckets.
    // The sparkline only displays the last 7 days (filtered in _renderSparkline).
    const startTime = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

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
            time: typeof entry.lu === 'number'
              ? Math.round(entry.lu * 1000)
              : new Date(entry.lu || entry.last_updated || entry.last_changed).getTime(),
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

  async _checkCardVersion() {
    if (!this._hass?.callWS) return;
    try {
      const result = await this._hass.callWS({ type: "tankstellen_austria/card_version" });
      if (result?.version && result.version !== CARD_VERSION) {
        this._versionMismatch = result.version;
        this._render();
      }
    } catch (_) { /* backend may not support this command yet */ }
  }

  disconnectedCallback() {
    clearInterval(this._historyInterval);
    clearInterval(this._cooldownInterval);
  }

  // --- Best refuel time analysis ---
  _analyzeBestRefuelTime(data) {
    if (!data || data.length < 2) return null;

    const span = data[data.length - 1].time - data[0].time;
    if (span < 7 * 24 * 60 * 60 * 1000) return { hasEnoughData: false };

    // Time-weighted hourly expansion: each price event is valid until the next one
    // (step function). Walk every hour boundary within each interval to reconstruct
    // the full hourly price series.
    const HOUR_MS = 60 * 60 * 1000;
    const hourly = [];
    const addSamples = (price, start, end) => {
      const first = Math.ceil(start / HOUR_MS) * HOUR_MS;
      for (let t = first; t < end; t += HOUR_MS) hourly.push({ t, price });
    };
    for (let i = 0; i < data.length - 1; i++) {
      addSamples(data[i].value, data[i].time, data[i + 1].time);
    }
    addSamples(data[data.length - 1].value, data[data.length - 1].time, Date.now());

    if (hourly.length === 0) return { hasEnoughData: false };

    // Group samples into Monday-aligned calendar weeks and compute each week's
    // average price. Normalising against the weekly average means we rank slots by
    // how cheap they are *relative to their own week*, so a slot that is consistently
    // the weekly low point wins — even in weeks where the overall price level is high.
    const getMondayKey = (t) => {
      const d = new Date(t);
      d.setHours(0, 0, 0, 0);
      const day = d.getDay();
      d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
      return d.getTime();
    };

    const weeks = {};
    hourly.forEach(({ t, price }) => {
      const wk = getMondayKey(t);
      if (!weeks[wk]) weeks[wk] = { sum: 0, count: 0, samples: [] };
      weeks[wk].sum += price;
      weeks[wk].count++;
      weeks[wk].samples.push({ t, price });
    });

    // Bucket normalised deltas (price − week_avg) by (weekday, hour).
    // Skip partial-week slivers with fewer than 24 hourly samples.
    const buckets = {};
    Object.values(weeks).forEach((wk) => {
      if (wk.count < 24) return;
      const weekAvg = wk.sum / wk.count;
      wk.samples.forEach(({ t, price }) => {
        const dt = new Date(t);
        const key = `${dt.getDay()}-${dt.getHours()}`;
        if (!buckets[key]) buckets[key] = { weekday: dt.getDay(), hour: dt.getHours(), sum: 0, count: 0 };
        buckets[key].sum += price - weekAvg;
        buckets[key].count++;
      });
    });

    // Best slot = lowest average normalised delta.
    // count >= 2 means the slot was observed in at least 2 separate weekly appearances.
    let best = null;
    Object.values(buckets).forEach((b) => {
      if (b.count < 2) return;
      const avg = b.sum / b.count;
      if (!best || avg < best.avg) best = { weekday: b.weekday, hour: b.hour, avg };
    });
    if (!best) return { hasEnoughData: false };

    return { hasEnoughData: true, weekday: best.weekday, hour: best.hour };
  }

  // --- Sparkline ---
  _renderSparkline(entityId) {
    const allData = this._historyData[entityId];
    if (!allData || allData.length < 2) return "";

    // Sparkline shows last 7 days. With significant_changes_only the most recent
    // change event may be older than 7 days (stable price) — prepend the last
    // known point before the cutoff so the sparkline always renders.
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let data = allData.filter((d) => d.time >= cutoff);
    if (data.length < 2) {
      const lastKnown = allData.filter((d) => d.time < cutoff).at(-1);
      if (lastKnown) data = [lastKnown, ...data];
    }
    if (data.length < 2) return "";

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
      return { x, y, str: `${x.toFixed(1)},${y.toFixed(1)}` };
    });

    const polyline = points.map((p) => p.str).join(" ");
    const areaPoints = `${polyline} ${width},${height} 0,${height}`;
    const gradId = `spark-grad-${entityId.replace(/\./g, "_")}`;

    // Analyse full history (up to 4 weeks) for a statistically meaningful recommendation.
    // Then find the most recent matching point within the visible 7-day slice for the marker.
    const analysis = this._analyzeBestRefuelTime(allData);
    let sparklineMarkerIdx = -1;
    if (analysis?.hasEnoughData) {
      for (let i = data.length - 1; i >= 0; i--) {
        const dt = new Date(data[i].time);
        if (dt.getDay() === analysis.weekday && dt.getHours() === analysis.hour) {
          sparklineMarkerIdx = i;
          break;
        }
      }
      // Fallback: minimum value point within the sparkline slice
      if (sparklineMarkerIdx === -1) {
        let minVal = Infinity;
        data.forEach((d, i) => { if (d.value < minVal) { minVal = d.value; sparklineMarkerIdx = i; } });
      }
    }

    // Marker: dashed vertical line + dot at best-time data point
    let markerSvg = "";
    if (sparklineMarkerIdx >= 0 && sparklineMarkerIdx < points.length) {
      const mp = points[sparklineMarkerIdx];
      markerSvg = `
        <line x1="${mp.x.toFixed(1)}" y1="0" x2="${mp.x.toFixed(1)}" y2="${height}"
              stroke="var(--success-color,#4CAF50)" stroke-width="1" stroke-dasharray="3,2" opacity="0.8"/>
        <circle cx="${mp.x.toFixed(1)}" cy="${mp.y.toFixed(1)}" r="3.5"
                fill="var(--success-color,#4CAF50)" stroke="var(--card-background-color,#fff)" stroke-width="1.5"/>`;
    }

    // Recommendation text
    let recommendationHtml = "";
    if (analysis) {
      if (!analysis.hasEnoughData) {
        recommendationHtml = `
          <div class="refuel-hint">
            <ha-icon icon="mdi:information-outline" class="refuel-icon"></ha-icon>
            ${this._t("not_enough_data_hint")}
          </div>`;
      } else {
        const weekdays = this._t("weekdays");
        const day = weekdays[analysis.weekday];
        const h1 = String(analysis.hour).padStart(2, "0");
        const h2 = String((analysis.hour + 1) % 24).padStart(2, "0");
        const text = this._t("best_refuel")
          .replace("{day}", day).replace("{h1}", h1).replace("{h2}", h2);
        recommendationHtml = `
          <div class="refuel-recommendation">
            <ha-icon icon="mdi:lightbulb-outline" class="refuel-icon"></ha-icon>
            ${text}
          </div>`;
      }
    }

    return `
      <svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <polygon points="${areaPoints}" fill="url(#${gradId})" />
        ${markerSvg}
        <polyline points="${polyline}" fill="none" stroke="var(--primary-color)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
      </svg>
      <div class="sparkline-labels">
        <span>${this._formatPriceShort(min)}</span>
        <span class="sparkline-period">${this._t("last_7_days")}</span>
        <span>${this._formatPriceShort(max)}</span>
      </div>
      ${recommendationHtml}`;
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

    // "00:00" to "24:00" means 24/7 — never closing soon
    if (todayHours.from === "00:00" && todayHours.to === "24:00") return false;

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
    if (this._activeTab >= entities.length) this._activeTab = 0;
    if (!entities.length) {
      this.innerHTML = `<ha-card><div class="empty">${TRANSLATIONS[(this._config.language || "de")].no_data
        }</div></ha-card>${this._getStyles()}`;
      return;
    }

    const showMapLinks = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showPayment = this._config.show_payment_methods !== false;
    const showHistory = this._config.show_history !== false;
    const maxStations = Math.min(5, Math.max(1, parseInt(this._config.max_stations, 10) || 5));
    const paymentFilter = this._config.payment_filter || [];

    let html = `<ha-card>`;

    // Version mismatch banner
    if (this._versionMismatch) {
      const msg = this._t("version_update").replace("{v}", this._versionMismatch);
      html += `<div class="version-notice">
        <span>${msg}</span>
        <button class="version-reload-btn" data-version-reload>${this._t("version_reload")}</button>
      </div>`;
    }

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
              <ha-icon icon="mdi:gas-station" class="fuel-icon"></ha-icon>
              <span>${fuelTypeName}</span>
            </div>
            ${isDynamic ? `
            <div class="dynamic-meta">
              <div class="dynamic-meta-inner">
                ${lastUpdatedTime ? `<span class="last-updated">${this._t("last_updated")} ${lastUpdatedTime}</span>` : ""}
                ${this._noNewData ? `<span class="no-new-data">${this._t("no_new_data")}</span>` : ""}
              </div>
            </div>
            <button class="refresh-btn${refreshCoolingDown ? " cooling" : ""}" data-refresh>
              <ha-icon icon="mdi:refresh" class="refresh-icon"></ha-icon>
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
          ${showHistory && !isDynamic ? `<div class="sparkline-container" data-entity="${active.entity_id}">${this._renderSparkline(active.entity_id)}</div>` : ""}
        </div>`;
    }

    const highlightMode = this._config.payment_highlight_mode === true;

    const filteredStations = highlightMode
      ? stations
      : stations.filter((s) => this._matchesPaymentFilter(s, paymentFilter));

    // Cars fill-up row
    // In filter mode: use cheapest visible (filtered) station — "–" when none pass the filter.
    // In highlight mode: all stations are visible so use overall cheapest.
    const showCars = this._config.show_cars === true;
    if (showCars && stations.length) {
      const configCars = (this._config.cars || []).filter(
        (c) => c.fuel_type === fuelType && c.tank_size > 0 && c.name
      );
      if (configCars.length) {
        const effectiveCheapest = highlightMode
          ? stations[0]?.price
          : filteredStations[0]?.price;
        html += `<div class="cars-fillup">`;
        configCars.forEach((car) => {
          const costStr = effectiveCheapest != null
            ? `€ ${(effectiveCheapest * Number(car.tank_size)).toFixed(2).replace(".", ",")}`
            : "–";
          html += `<div class="car-fillup-row">
            <span class="car-fillup-name">
              <ha-icon icon="${_escHtml(car.icon || "mdi:car")}" class="car-icon"></ha-icon>
              ${_escHtml(car.name)} <span class="car-fillup-liters">${car.tank_size} L</span>
            </span>
            <span class="car-fillup-cost">${costStr}</span>
          </div>`;
        });
        html += `</div>`;
      }
    }

    if (!filteredStations.length && paymentFilter.length && stations.length) {
      html += `<div class="empty">${this._t("payment_filter_active")} — ${this._t("no_data")}</div>`;
    } else if (!filteredStations.length) {
      html += `<div class="empty">${this._t("no_data")}</div>`;
    } else {
      html += `<div class="stations">`;
      filteredStations.forEach((s, idx) => {
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
        const isHighlighted = highlightMode && paymentFilter.length && this._matchesPaymentFilter(s, paymentFilter);

        html += `
          <div class="station${isHighlighted ? " pm-highlight" : ""}">
            <div class="station-main" data-expand="${this._activeTab}-${idx}">
              <div class="rank">${idx + 1}</div>
              <div class="info">
                <div class="name">${s.name || "–"}${openLabel}</div>
                <div class="address">${loc.postalCode || ""} ${loc.city || ""}, ${loc.address || ""}</div>
              </div>
              <div class="price">${this._formatPrice(s.price)}</div>
              ${showMapLinks
            ? `<a class="map-link" href="${this._mapsUrl(loc, s.name)}" target="_blank" rel="noopener noreferrer" title="${this._t("map")}">
                      <ha-icon icon="${/\d/.test(loc.address || "") ? "mdi:map-marker" : "mdi:magnify"}" class="map-icon"></ha-icon>
                    </a>`
            : ""
          }
            </div>
            ${(() => {
              const hasHours = showHours && s.opening_hours && s.opening_hours.length;
              const hasPm = showPayment && this._hasPaymentMethods(s.payment_methods);
              if (!hasHours && !hasPm) return "";
              return `<div class="station-detail ${expandClass}">
                  <div class="detail-cols">
                    ${hasHours ? `<div class="detail-col">${this._renderHours(s.opening_hours)}</div>` : ""}
                    ${hasPm ? `<div class="detail-col">${this._renderPaymentMethods(s.payment_methods)}</div>` : ""}
                  </div>
                </div>`;
            })()}
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

  _hasPaymentMethods(pm) {
    if (!pm) return false;
    return pm.cash || pm.debit_card || pm.credit_card || (pm.others && pm.others.length > 0);
  }

  _matchesPaymentFilter(s, filter) {
    if (!filter || !filter.length) return true;
    const pm = s.payment_methods || {};
    return filter.some((method) => {
      if (method === "cash") return pm.cash;
      if (method === "debit_card") return pm.debit_card;
      if (method === "credit_card") return pm.credit_card;
      return (pm.others || []).some((o) => o.toLowerCase() === method.toLowerCase());
    });
  }

  _renderPaymentMethods(pm) {
    if (!pm) return "";
    const badges = [];
    if (pm.cash) badges.push(`<span class="pm-badge"><ha-icon icon="mdi:cash" class="pm-icon"></ha-icon> ${this._t("cash")}</span>`);
    if (pm.debit_card) badges.push(`<span class="pm-badge"><ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon> ${this._t("debit_card")}</span>`);
    if (pm.credit_card) badges.push(`<span class="pm-badge"><ha-icon icon="mdi:credit-card" class="pm-icon"></ha-icon> ${this._t("credit_card")}</span>`);
    for (const other of (pm.others || [])) {
      badges.push(`<span class="pm-badge pm-other">${other}</span>`);
    }
    if (!badges.length) return "";
    return `<div class="pm-section">
      <div class="pm-label">${this._t("payment")}</div>
      <div class="pm-badges">${badges.join("")}</div>
    </div>`;
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

    const versionReloadBtn = this.querySelector("[data-version-reload]");
    if (versionReloadBtn) {
      versionReloadBtn.addEventListener("click", async () => {
        try {
          if (window.caches) {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
          }
        } catch (_) { /* caches API requires HTTPS; fall through to reload */ }
        location.reload();
      });
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

    const sparklineContainer = this.querySelector(".sparkline-container[data-entity]");
    if (sparklineContainer) {
      sparklineContainer.addEventListener("click", () => {
        sparklineContainer.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: sparklineContainer.dataset.entity },
          bubbles: true,
          composed: true,
        }));
      });
    }
  }

  _getStyles() {
    return `<style>
      ha-card {
        padding: 0;
        overflow: hidden;
      }
      .version-notice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 16px;
        background: var(--warning-color, #ff9800);
        color: #fff;
        font-size: 13px;
      }
      .version-reload-btn {
        flex-shrink: 0;
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.6);
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        font-size: 12px;
        padding: 4px 12px;
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
        --mdc-icon-size: 18px;
      }
      .refresh-icon {
        --mdc-icon-size: 16px;
        vertical-align: middle;
      }
      .map-icon {
        --mdc-icon-size: 20px;
      }
      .pm-icon {
        --mdc-icon-size: 13px;
        vertical-align: middle;
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
      .cars-fillup {
        border-top: 1px solid var(--divider-color, rgba(0,0,0,0.12));
        padding: 8px 16px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .car-fillup-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .car-fillup-name {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .car-icon {
        --mdc-icon-size: 14px;
        color: var(--secondary-text-color);
      }
      .car-fillup-liters {
        font-size: 11px;
        opacity: 0.65;
      }
      .car-fillup-cost {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .sparkline-container {
        margin-top: 8px;
        cursor: pointer;
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
      .refuel-recommendation {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 500;
        color: var(--success-color, #4CAF50);
        margin-top: 5px;
        line-height: 1.3;
      }
      .refuel-hint {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        color: var(--secondary-text-color);
        opacity: 0.75;
        margin-top: 5px;
      }
      .refuel-icon {
        --mdc-icon-size: 13px;
        flex-shrink: 0;
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
      .station.pm-highlight {
        border-left: 3px solid var(--success-color, #4caf50);
        background: rgba(76, 175, 80, 0.06);
      }
      .station.pm-highlight .station-main:hover {
        background: rgba(76, 175, 80, 0.12);
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
      }
      .last-updated {
        font-size: 11px;
        color: var(--secondary-text-color);
      }
      .dynamic-meta-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        line-height: 1.2;
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
      .station-detail {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease;
        padding: 0 16px 0 52px;
      }
      .station-detail.expanded {
        max-height: 200px;
        padding: 0 16px 12px 52px;
      }
      .detail-cols {
        display: flex;
        gap: 16px;
      }
      .detail-col {
        flex: 1;
        min-width: 0;
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
      .pm-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .pm-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .pm-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .pm-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 2px 7px;
        border-radius: 10px;
        font-size: 11px;
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--secondary-text-color);
        border: 1px solid var(--divider-color, #e0e0e0);
      }
      .pm-badge.pm-other {
        font-style: italic;
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
      show_payment_methods: true,
      show_history: true,
      payment_filter: [],
      payment_highlight_mode: true,
      show_cars: false,
      cars: [],
    };
  }
}

// ============================================================
// Visual Card Editor
// ============================================================
class TankstellenAustriaCardEditor extends HTMLElement {
  _config = {};
  _hass = null;
  _pendingRemove = null;
  _expandedCarIcon = null;

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

  _captureInputState() {
    const active = document.activeElement;
    const state = { inputs: [], focused: null, cursor: null };
    this.querySelectorAll('input[type="text"], input[type="number"]').forEach((el) => {
      const key = el.dataset.carIdx != null
        ? { type: "car", idx: el.dataset.carIdx, field: el.dataset.carField }
        : el.id ? { type: "id", id: el.id } : null;
      if (!key) return;
      state.inputs.push({ key, value: el.value });
      if (el === active) {
        state.focused = key;
        try { state.cursor = { start: el.selectionStart, end: el.selectionEnd }; } catch (_) {}
      }
    });
    return state;
  }

  _restoreInputState(state) {
    if (!state) return;
    const findEl = (key) => key.type === "car"
      ? this.querySelector(`input[data-car-idx="${key.idx}"][data-car-field="${key.field}"]`)
      : this.querySelector(`#${key.id}`);
    state.inputs.forEach(({ key, value }) => {
      const el = findEl(key);
      if (el) el.value = value;
    });
    if (state.focused) {
      const el = findEl(state.focused);
      if (el) {
        el.focus();
        if (state.cursor) {
          try { el.setSelectionRange(state.cursor.start, state.cursor.end); } catch (_) {}
        }
      }
    }
  }

  _render() {
    if (!this._hass) return;

    // Find available tankstellen entities
    const available = _findTankstellenEntities(this._hass);
    const selected = this._config.entities || [];
    const maxStations = this._config.max_stations ?? 5;
    const showMap = this._config.show_map_links !== false;
    const showHours = this._config.show_opening_hours !== false;
    const showPayment = this._config.show_payment_methods !== false;
    const showHistory = this._config.show_history !== false;
    const paymentFilter = this._config.payment_filter || [];
    const highlightMode = this._config.payment_highlight_mode === true;
    const showCars = this._config.show_cars === true;
    const cars = this._config.cars || [];

    const escHtml = _escHtml;

    // Keys available from live API data (builtin + whatever stations report)
    const apiPmKeys = new Set(["cash", "debit_card", "credit_card"]);
    (this._config.entities || []).forEach((eid) => {
      const state = this._hass?.states[eid];
      (state?.attributes?.stations || []).forEach((s) => {
        (s.payment_methods?.others || []).forEach((o) => apiPmKeys.add(o));
      });
    });
    // allPmKeys also includes user-typed filter values not in live data
    const allPmKeys = new Set([...apiPmKeys]);
    paymentFilter.forEach((f) => allPmKeys.add(f));

    const _inputState = this._captureInputState();

    this.innerHTML = `
      <div class="editor">
        <style>
          .editor {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .editor-section {
            background: var(--secondary-background-color, rgba(0,0,0,0.04));
            border-radius: 12px;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .section-header {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            color: var(--secondary-text-color);
            margin-bottom: 2px;
          }
          .editor-hint {
            font-size: 12px;
            color: var(--secondary-text-color);
            line-height: 1.4;
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
            padding: 5px 12px;
            border-radius: 16px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.15s;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color, #fff);
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
            padding: 2px 0;
          }
          .toggle-row label {
            font-size: 13px;
            color: var(--primary-text-color);
            cursor: pointer;
          }
          .divider {
            height: 1px;
            background: var(--divider-color);
            margin: 2px 0;
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
            color: var(--primary-color);
          }
          .pm-filter-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
          .pm-filter-chip {
            padding: 4px 12px;
            border-radius: 14px;
            font-size: 12px;
            cursor: pointer;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            transition: all 0.15s;
          }
          .pm-filter-chip.active {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: var(--primary-color);
          }
          .pm-filter-chip:hover {
            opacity: 0.85;
          }
          .pm-filter-chip.confirm {
            background: var(--error-color, #db4437);
            color: #fff;
            border-color: var(--error-color, #db4437);
          }
          .pm-custom-row {
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .pm-custom-row ha-textfield {
            flex: 1;
          }
          .pm-custom-row ha-icon-button {
            color: var(--primary-color);
            flex-shrink: 0;
          }
          .car-editor-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .car-input {
            background: var(--input-fill-color, rgba(0,0,0,0.06));
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 13px;
            color: var(--primary-text-color);
            outline: none;
            font-family: inherit;
          }
          .car-input:focus {
            border-color: var(--primary-color);
          }
          .car-name-input {
            flex: 1;
            min-width: 0;
          }
          .car-tank-input {
            width: 64px;
          }
          .car-select {
            background: var(--input-fill-color, rgba(0,0,0,0.06));
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            padding: 8px 6px;
            font-size: 13px;
            color: var(--primary-text-color);
            cursor: pointer;
            font-family: inherit;
          }
          .car-delete-btn {
            background: none;
            border: none;
            color: var(--error-color, #db4437);
            cursor: pointer;
            padding: 4px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .car-delete-btn:hover {
            background: rgba(219,68,55,0.1);
          }
          .car-add-btn {
            align-self: flex-start;
            background: none;
            border: 1px dashed var(--divider-color);
            border-radius: 8px;
            color: var(--primary-color);
            cursor: pointer;
            font-size: 13px;
            padding: 8px 14px;
            width: 100%;
            font-family: inherit;
            transition: background 0.15s;
          }
          .car-add-btn:hover {
            background: rgba(0,0,0,0.04);
          }
          .car-editor-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .car-icon-btn {
            background: var(--secondary-background-color, rgba(0,0,0,0.06));
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            color: var(--primary-color);
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.15s, border-color 0.15s;
            --mdc-icon-size: 20px;
          }
          .car-icon-btn.active {
            border-color: var(--primary-color);
            background: rgba(var(--rgb-primary-color,33,150,243), 0.1);
          }
          .car-icon-btn:hover {
            border-color: var(--primary-color);
          }
          .car-icon-picker {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 6px 8px;
            background: var(--secondary-background-color, rgba(0,0,0,0.04));
            border-radius: 8px;
            border: 1px solid var(--divider-color);
          }
          .car-icon-option {
            background: none;
            border: 1px solid transparent;
            border-radius: 6px;
            color: var(--secondary-text-color);
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s;
            --mdc-icon-size: 20px;
          }
          .car-icon-option:hover {
            background: var(--card-background-color, #fff);
            color: var(--primary-color);
            border-color: var(--divider-color);
          }
          .car-icon-option.active {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: var(--primary-color);
          }
        </style>

        <!-- Entity selection -->
        <div class="editor-section">
          <div class="section-header">${this._et("section_sensors")}</div>
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
          <div class="editor-hint">${this._et("entities_hint")}</div>
        </div>

        <!-- Display options -->
        <div class="editor-section">
          <div class="section-header">${this._et("section_display")}</div>
          <div class="toggle-row">
            <label for="toggle-map">${this._et("show_map_links")}</label>
            <ha-switch id="toggle-map" ${showMap ? "checked" : ""} data-field="show_map_links"></ha-switch>
          </div>
          <div class="divider"></div>
          <div class="toggle-row">
            <label for="toggle-hours">${this._et("show_opening_hours")}</label>
            <ha-switch id="toggle-hours" ${showHours ? "checked" : ""} data-field="show_opening_hours"></ha-switch>
          </div>
          <div class="divider"></div>
          <div class="toggle-row">
            <label for="toggle-payment">${this._et("show_payment_methods")}</label>
            <ha-switch id="toggle-payment" ${showPayment ? "checked" : ""} data-field="show_payment_methods"></ha-switch>
          </div>
          <div class="divider"></div>
          <div class="toggle-row">
            <label for="toggle-history">${this._et("show_history")}</label>
            <ha-switch id="toggle-history" ${showHistory ? "checked" : ""} data-field="show_history"></ha-switch>
          </div>
          <div class="divider"></div>
          <div class="toggle-row">
            <label for="toggle-cars">${this._et("show_cars")}</label>
            <ha-switch id="toggle-cars" ${showCars ? "checked" : ""} data-field="show_cars"></ha-switch>
          </div>
          <div class="divider"></div>
          <div class="toggle-row" style="padding-top:4px">
            <label for="slider-stations">${this._et("max_stations")}</label>
          </div>
          <div class="slider-row">
            <input id="slider-stations" type="range" min="1" max="5" step="1" value="${maxStations}" data-field="max_stations" />
            <span class="slider-value">${maxStations}</span>
          </div>
        </div>

        <!-- Payment filter (only when show_payment_methods is on) -->
        ${showPayment ? `
        <div class="editor-section">
          <div class="section-header">${this._et("section_payment_filter")}</div>
          <div class="pm-filter-chips">
            ${[...allPmKeys].map((key) => {
              const isActive = paymentFilter.includes(key);
              const _tl = (TRANSLATIONS[this._lang()] || TRANSLATIONS.de);
              const label = key === "cash" ? _tl.cash
                : key === "debit_card" ? _tl.debit_card
                : key === "credit_card" ? _tl.credit_card
                : key;
              const isPending = key === this._pendingRemove;
              return `<button class="pm-filter-chip ${isActive ? "active" : ""} ${isPending ? "confirm" : ""}" data-pm="${escHtml(key)}">${isPending ? "✕ " + escHtml(label) + "?" : escHtml(label)}</button>`;
            }).join("")}
          </div>
          <div class="pm-custom-row">
            <ha-textfield id="pm-custom-input" label="${this._et("payment_filter_custom_placeholder")}"></ha-textfield>
            <ha-icon-button id="pm-custom-add" title="+"><ha-icon icon="mdi:plus-circle"></ha-icon></ha-icon-button>
          </div>
          <div class="editor-hint">${this._et("payment_filter_custom_hint")}</div>
          ${paymentFilter.length ? `
          <div class="divider"></div>
          <div class="toggle-row">
            <label for="toggle-highlight">${this._et("payment_highlight_mode")}</label>
            <ha-switch id="toggle-highlight" ${highlightMode ? "checked" : ""} data-field="payment_highlight_mode"></ha-switch>
          </div>` : ""}
        </div>` : ""}

        <!-- Cars section (only when show_cars is on) -->
        ${showCars ? `
        <div class="editor-section">
          <div class="section-header">${this._et("section_cars")}</div>
          ${cars.map((car, idx) => `
            <div class="car-editor-group">
              <div class="car-editor-row">
                <button class="car-icon-btn${this._expandedCarIcon === idx ? " active" : ""}" data-car-idx="${idx}" title="Choose icon">
                  <ha-icon icon="${escHtml(car.icon || "mdi:car")}"></ha-icon>
                </button>
                <input class="car-input car-name-input" type="text"
                  placeholder="${this._et("car_name_placeholder")}"
                  value="${escHtml(car.name || "")}"
                  data-car-idx="${idx}" data-car-field="name" />
                <select class="car-select" data-car-idx="${idx}" data-car-field="fuel_type">
                  ${["DIE","SUP","GAS"].map((ft) => `<option value="${ft}"${car.fuel_type === ft ? " selected" : ""}>${(TRANSLATIONS[this._lang()]||TRANSLATIONS.de).fuel_types[ft]||ft}</option>`).join("")}
                </select>
                <input class="car-input car-tank-input" type="number" min="1" max="200"
                  placeholder="${this._et("car_tank_placeholder")}"
                  value="${car.tank_size || ""}"
                  data-car-idx="${idx}" data-car-field="tank_size" />
                <button class="car-delete-btn" data-car-idx="${idx}">
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              ${this._expandedCarIcon === idx ? `
              <div class="car-icon-picker">
                ${CAR_ICONS.map((icon) => `
                  <button class="car-icon-option${(car.icon || "mdi:car") === icon ? " active" : ""}" data-car-idx="${idx}" data-icon="${icon}" title="${icon.replace("mdi:", "")}">
                    <ha-icon icon="${icon}"></ha-icon>
                  </button>
                `).join("")}
              </div>` : ""}
            </div>
          `).join("")}
          <button class="car-add-btn">${this._et("add_car")}</button>
        </div>` : ""}
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
      ["keydown", "keyup", "keypress"].forEach((evt) => {
        input.addEventListener(evt, (e) => e.stopPropagation());
      });
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

    // Payment filter chips
    // A chip needs confirmation only if removing it would make it disappear
    // (i.e. it was user-typed and is not present in live API data)
    this.querySelectorAll(".pm-filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const key = chip.dataset.pm;
        let current = [...(this._config.payment_filter || [])];
        const isActive = current.includes(key);
        const isCustom = !apiPmKeys.has(key);

        if (isActive && isCustom) {
          if (this._pendingRemove === key) {
            // Second click: confirmed, remove
            this._pendingRemove = null;
            current = current.filter((k) => k !== key);
            this._config = { ...this._config, payment_filter: current };
            this._fireChanged();
          } else {
            // First click: enter confirm state
            this._pendingRemove = key;
          }
        } else {
          // Built-in chip or adding: toggle directly, cancel any pending
          this._pendingRemove = null;
          if (isActive) {
            current = current.filter((k) => k !== key);
          } else {
            current.push(key);
          }
          this._config = { ...this._config, payment_filter: current };
          this._fireChanged();
        }
        this._render();
      });
    });

    // Custom payment method input
    const customInput = this.querySelector("#pm-custom-input");
    const customAddBtn = this.querySelector("#pm-custom-add");
    if (customAddBtn && customInput) {
      const sanitize = (s) => s.replace(/[<>"'&]/g, "").slice(0, 50).trim();
      const addCustom = () => {
        const val = sanitize(customInput.value);
        if (!val) return;
        this._pendingRemove = null;
        let current = [...(this._config.payment_filter || [])];
        if (!current.includes(val)) {
          current.push(val);
          this._config = { ...this._config, payment_filter: current };
          this._fireChanged();
          this._render();
        } else {
          customInput.value = "";
        }
      };
      // Keyboard events from inside ha-textfield's shadow DOM bubble up as
      // composed events, so we can intercept them on the host element.
      // stopPropagation here prevents HA global shortcuts from stealing focus.
      ["keydown", "keyup", "keypress"].forEach((evt) => {
        customInput.addEventListener(evt, (e) => {
          e.stopPropagation();
          if (evt === "keydown" && e.key === "Enter") addCustom();
        });
      });
      customAddBtn.addEventListener("click", addCustom);
    }

    // Car icon button — toggle picker
    this.querySelectorAll(".car-icon-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.carIdx, 10);
        this._expandedCarIcon = this._expandedCarIcon === idx ? null : idx;
        this._render();
      });
    });

    // Car icon option — select icon
    this.querySelectorAll(".car-icon-option").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.carIdx, 10);
        const icon = btn.dataset.icon;
        const newCars = [...(this._config.cars || [])];
        newCars[idx] = { ...newCars[idx], icon };
        this._config = { ...this._config, cars: newCars };
        this._expandedCarIcon = null;
        this._fireChanged();
        this._render();
      });
    });

    // Car name / tank-size inputs
    this.querySelectorAll(".car-name-input, .car-tank-input").forEach((input) => {
      ["keydown", "keyup", "keypress"].forEach((evt) => {
        input.addEventListener(evt, (e) => e.stopPropagation());
      });
      input.addEventListener("click", (e) => e.stopPropagation());
      input.addEventListener("pointerdown", (e) => e.stopPropagation());
      input.addEventListener("change", (e) => {
        e.stopPropagation();
        const idx = parseInt(e.target.dataset.carIdx, 10);
        const field = e.target.dataset.carField;
        const newCars = [...(this._config.cars || [])];
        const val = field === "tank_size"
          ? Math.max(1, parseInt(e.target.value, 10) || 1)
          : e.target.value.replace(/[<>"'&]/g, "").slice(0, 50);
        newCars[idx] = { ...newCars[idx], [field]: val };
        this._config = { ...this._config, cars: newCars };
        this._fireChanged();
      });
    });

    // Car fuel-type selects
    this.querySelectorAll(".car-select").forEach((select) => {
      select.addEventListener("click", (e) => e.stopPropagation());
      select.addEventListener("pointerdown", (e) => e.stopPropagation());
      select.addEventListener("change", (e) => {
        e.stopPropagation();
        const idx = parseInt(e.target.dataset.carIdx, 10);
        const newCars = [...(this._config.cars || [])];
        newCars[idx] = { ...newCars[idx], fuel_type: e.target.value };
        this._config = { ...this._config, cars: newCars };
        this._fireChanged();
      });
    });

    // Car delete buttons
    this.querySelectorAll(".car-delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.carIdx, 10);
        const newCars = [...(this._config.cars || [])];
        newCars.splice(idx, 1);
        this._config = { ...this._config, cars: newCars };
        this._fireChanged();
        this._render();
      });
    });

    // Add car button
    const addCarBtn = this.querySelector(".car-add-btn");
    if (addCarBtn) {
      addCarBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newCars = [...(this._config.cars || [])];
        newCars.push({ name: "", fuel_type: "DIE", tank_size: 50 });
        this._config = { ...this._config, cars: newCars };
        this._fireChanged();
        this._render();
      });
    }

    this._restoreInputState(_inputState);
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