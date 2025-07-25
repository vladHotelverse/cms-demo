export const formatPrice = (
  price: number,
  currency: string = 'EUR',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: getCurrencyDecimals(currency),
    maximumFractionDigits: getCurrencyDecimals(currency),
  }).format(price)
}

export const getCurrencyDecimals = (currency: string): number => {
  // Most currencies use 2 decimal places
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'ISK']
  const threeDecimalCurrencies = ['BHD', 'JOD', 'KWD', 'OMR', 'TND']
  
  if (zeroDecimalCurrencies.includes(currency)) {
    return 0
  }
  
  if (threeDecimalCurrencies.includes(currency)) {
    return 3
  }
  
  return 2
}

export const parseCurrencyAmount = (
  amount: string,
  currency: string = 'EUR'
): number => {
  // Remove currency symbols and spaces
  const cleanAmount = amount.replace(/[^0-9.,\-]/g, '')
  
  // Handle different decimal separators
  const normalizedAmount = cleanAmount.replace(',', '.')
  
  return parseFloat(normalizedAmount) || 0
}

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    KRW: '₩',
    CHF: 'Fr',
    CAD: '$',
    AUD: '$',
    NZD: '$',
    SEK: 'kr',
    NOK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    CZK: 'Kč',
    HUF: 'Ft',
    RON: 'lei',
    BGN: 'лв',
    HRK: 'kn',
    RUB: '₽',
    TRY: '₺',
    BRL: 'R$',
    MXN: '$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    UYU: '$',
    ZAR: 'R',
    THB: '฿',
    SGD: '$',
    HKD: '$',
    TWD: 'NT$',
    MYR: 'RM',
    PHP: '₱',
    IDR: 'Rp',
    VND: '₫',
  }
  
  return symbols[currency] || currency
}