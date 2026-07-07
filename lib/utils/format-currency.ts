export function formatCurrency(
  amount: number,
  locale = "es-ES",
  currency = "EUR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCurrencyCompact(amount: number): string {
  return `€${amount.toLocaleString("es-ES", { maximumFractionDigits: 0 })}`
}
