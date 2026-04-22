import type { PaymentMethods, Station } from "../types";

export function hasPaymentMethods(pm: PaymentMethods | undefined): boolean {
  if (!pm) return false;
  return Boolean(
    pm.cash || pm.debit_card || pm.credit_card || (pm.others && pm.others.length > 0),
  );
}

export function matchesPaymentFilter(
  station: Station,
  filter: readonly string[] | undefined,
): boolean {
  if (!filter || !filter.length) return true;
  const pm = station.payment_methods ?? {};
  return filter.some((method) => {
    if (method === "cash") return Boolean(pm.cash);
    if (method === "debit_card") return Boolean(pm.debit_card);
    if (method === "credit_card") return Boolean(pm.credit_card);
    return (pm.others ?? []).some((o) => o.toLowerCase() === method.toLowerCase());
  });
}

// Resolves filter keys into display strings: the three built-ins are
// translated by the caller (pass `labels`); everything else passes through
// the raw other-payment-method string so the user sees the API value.
export interface PaymentLabels {
  cash: string;
  debit_card: string;
  credit_card: string;
}

export function matchingPaymentMethods(
  station: Station,
  filter: readonly string[] | undefined,
  labels: PaymentLabels,
): string[] {
  if (!filter || !filter.length) return [];
  const pm = station.payment_methods ?? {};
  const matches: string[] = [];
  for (const method of filter) {
    if (method === "cash" && pm.cash) matches.push(labels.cash);
    else if (method === "debit_card" && pm.debit_card) matches.push(labels.debit_card);
    else if (method === "credit_card" && pm.credit_card) matches.push(labels.credit_card);
    else {
      const hit = (pm.others ?? []).find(
        (o) => o.toLowerCase() === method.toLowerCase(),
      );
      if (hit) matches.push(hit);
    }
  }
  return matches;
}
