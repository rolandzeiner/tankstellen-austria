import { describe, expect, it } from "vite-plus/test";

import type { Station } from "../types";
import { hasPaymentMethods, matchesPaymentFilter, matchingPaymentMethods } from "./payment";

const LABELS = { cash: "Bar", debit_card: "Bankomat", credit_card: "Kreditkarte" };

const station = (payment_methods?: Station["payment_methods"]): Station =>
  payment_methods ? { name: "Test", payment_methods } : { name: "Test" };

describe("hasPaymentMethods", () => {
  it("is false for missing or empty payment data", () => {
    expect(hasPaymentMethods(undefined)).toBe(false);
    expect(hasPaymentMethods({})).toBe(false);
    expect(hasPaymentMethods({ cash: false, others: [] })).toBe(false);
  });

  it("is true for any built-in method or a non-empty others list", () => {
    expect(hasPaymentMethods({ cash: true })).toBe(true);
    expect(hasPaymentMethods({ debit_card: true })).toBe(true);
    expect(hasPaymentMethods({ credit_card: true })).toBe(true);
    expect(hasPaymentMethods({ others: ["Routex"] })).toBe(true);
  });
});

describe("matchesPaymentFilter", () => {
  const pm = station({ cash: true, others: ["Routex"] });

  it("lets every station through without a filter", () => {
    expect(matchesPaymentFilter(pm, undefined)).toBe(true);
    expect(matchesPaymentFilter(pm, [])).toBe(true);
    expect(matchesPaymentFilter(station(), [])).toBe(true);
  });

  it("matches when any one filter key matches", () => {
    expect(matchesPaymentFilter(pm, ["credit_card", "cash"])).toBe(true);
    expect(matchesPaymentFilter(pm, ["credit_card"])).toBe(false);
  });

  it("matches other methods case-insensitively", () => {
    expect(matchesPaymentFilter(pm, ["routex"])).toBe(true);
    expect(matchesPaymentFilter(pm, ["DKV"])).toBe(false);
  });

  it("rejects a station with no payment data once a filter is set", () => {
    expect(matchesPaymentFilter(station(), ["cash"])).toBe(false);
  });
});

describe("matchingPaymentMethods", () => {
  it("returns nothing without a filter", () => {
    expect(matchingPaymentMethods(station({ cash: true }), undefined, LABELS)).toEqual([]);
    expect(matchingPaymentMethods(station({ cash: true }), [], LABELS)).toEqual([]);
  });

  it("returns translated built-ins and the API spelling of others, in filter order", () => {
    const s = station({ cash: true, debit_card: true, credit_card: true, others: ["Routex"] });
    expect(
      matchingPaymentMethods(s, ["routex", "credit_card", "cash", "debit_card"], LABELS),
    ).toEqual(["Routex", "Kreditkarte", "Bar", "Bankomat"]);
  });

  it("drops filter keys the station does not accept", () => {
    const s = station({ cash: true });
    expect(matchingPaymentMethods(s, ["credit_card", "cash", "DKV"], LABELS)).toEqual(["Bar"]);
  });
});
