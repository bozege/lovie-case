export function parseAmountToMinorUnits(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const numeric = Number(normalized);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return Math.round(numeric * 100);
}

export function formatMoney(amountMinor: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}
