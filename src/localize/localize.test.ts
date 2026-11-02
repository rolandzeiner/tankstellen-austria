import { describe, expect, it } from "vite-plus/test";

import { getFuelName, getWeekdays, resolveLang, translate } from "./localize";

describe("getWeekdays", () => {
  it("returns the seven names of the resolved language, Sunday first", () => {
    const en = getWeekdays({ hassLanguage: "en" });
    expect(en).toHaveLength(7);
    expect(en[0]).toBe("Sunday");
    expect(getWeekdays({ configLanguage: "de", hassLanguage: "en" })[1]).toBe("Montag");
  });

  it("falls back to German for a language without a pack", () => {
    expect(getWeekdays({ hassLanguage: "fr" })).toEqual(getWeekdays({ hassLanguage: "de" }));
    expect(getWeekdays({})[0]).toBe("Sonntag");
  });
});

describe("resolveLang", () => {
  it("prefers the config language, then HA's, then German", () => {
    expect(resolveLang({ configLanguage: "en", hassLanguage: "de" })).toBe("en");
    expect(resolveLang({ hassLanguage: "en-GB" })).toBe("en_GB");
    expect(resolveLang({})).toBe("de");
  });
});

describe("translate and getFuelName", () => {
  it("fills placeholders and falls back to the key", () => {
    expect(translate("card.cash", { hassLanguage: "en" })).toBe("Cash");
    expect(translate("no.such.key", { hassLanguage: "en" })).toBe("no.such.key");
    expect(getFuelName("DIE", { hassLanguage: "en" })).toBe("Diesel");
  });
});
