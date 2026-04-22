import * as en from "./languages/en.json";
import * as de from "./languages/de.json";
import type { FuelType } from "../types";

type Dict = Record<string, unknown>;

const languages: Record<string, Dict> = {
  en: en as unknown as Dict,
  de: de as unknown as Dict,
};

function resolvePath(path: string, dictionary: Dict): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Dict)) {
      return (acc as Dict)[key];
    }
    return undefined;
  }, dictionary);
}

function resolveString(path: string, dictionary: Dict): string | undefined {
  const value = resolvePath(path, dictionary);
  return typeof value === "string" ? value : undefined;
}

// localStorage-backed lookup — used for the console boot banner before any
// hass/config is available. Matches HA's own `selectedLanguage` storage key.
export function localize(string: string, search = "", replace = ""): string {
  const raw =
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("selectedLanguage")) ||
    "en";
  const lang = raw.replace(/['"]+/g, "").replace("-", "_");

  let translated = resolveString(string, languages[lang] ?? languages.en);
  if (translated === undefined) translated = resolveString(string, languages.en);
  if (translated === undefined) translated = string;

  if (search !== "" && replace !== "") {
    translated = translated.replace(search, replace);
  }
  return translated;
}

// Context-aware translator. Card uses this in render because the resolved
// language needs to honour `config.language` first, then `hass.language`,
// then German (the integration's origin language).
export interface TranslateContext {
  configLanguage?: string;
  hassLanguage?: string;
}

export function resolveLang(ctx: TranslateContext): string {
  const raw = ctx.configLanguage || ctx.hassLanguage || "de";
  return raw.replace("-", "_");
}

export function translate(
  key: string,
  ctx: TranslateContext,
  replacements?: Record<string, string>,
): string {
  const lang = resolveLang(ctx);
  let translated = resolveString(key, languages[lang] ?? languages.de);
  if (translated === undefined) translated = resolveString(key, languages.de);
  if (translated === undefined) translated = key;
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      translated = translated.replace(`{${k}}`, v);
    }
  }
  return translated;
}

// Array/object lookups that don't fit the string-only translator.
export function getWeekdays(ctx: TranslateContext): string[] {
  const lang = resolveLang(ctx);
  const raw = resolvePath("weekdays", languages[lang] ?? languages.de);
  if (Array.isArray(raw) && raw.every((s) => typeof s === "string")) {
    return raw as string[];
  }
  const fallback = resolvePath("weekdays", languages.de);
  return Array.isArray(fallback) ? (fallback as string[]) : [];
}

export function getFuelName(code: FuelType | string, ctx: TranslateContext): string {
  const lang = resolveLang(ctx);
  const dict = (resolvePath("fuel_types", languages[lang] ?? languages.de) ??
    resolvePath("fuel_types", languages.de)) as Dict | undefined;
  const v = dict?.[code];
  return typeof v === "string" ? v : code;
}
