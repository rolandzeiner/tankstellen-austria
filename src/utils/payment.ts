import type { PaymentMethods, Station } from "../types";

export function hasPaymentMethods(pm: PaymentMethods | undefined): boolean {
  if (!pm) return false;
  return Boolean(
    pm.cash || pm.debit_card || pm.credit_card || (pm.others && pm.others.length > 0),
  );
}

// Resolves filter keys into display strings: the three built-ins are
// translated by the caller (pass `labels`); everything else passes through
// the raw other-payment-method string so the user sees the API value.
export interface PaymentLabels {
  cash: string;
  debit_card: string;
  credit_card: string;
}

/** Single source of truth for "does filter key X match this station's
 *  payment_methods?". Returns the display label on hit (so callers that
 *  want the label avoid a second lookup) or null on miss. */
function resolvePaymentMatch(
  pm: PaymentMethods,
  method: string,
  labels?: PaymentLabels,
): string | null {
  if (method === "cash") return pm.cash ? (labels?.cash ?? "cash") : null;
  if (method === "debit_card") {
    return pm.debit_card ? (labels?.debit_card ?? "debit_card") : null;
  }
  if (method === "credit_card") {
    return pm.credit_card ? (labels?.credit_card ?? "credit_card") : null;
  }
  const hit = (pm.others ?? []).find(
    (o) => o.toLowerCase() === method.toLowerCase(),
  );
  return hit ?? null;
}

export function matchesPaymentFilter(
  station: Station,
  filter: readonly string[] | undefined,
): boolean {
  if (!filter || !filter.length) return true;
  const pm = station.payment_methods ?? {};
  return filter.some((method) => resolvePaymentMatch(pm, method) !== null);
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
    const label = resolvePaymentMatch(pm, method, labels);
    if (label !== null) matches.push(label);
  }
  return matches;
}
