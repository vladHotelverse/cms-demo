import type React from 'react'
import { formatPrice, getCurrencyDecimals } from '../../../lib/currency'

interface PriceChangeIndicatorProps {
  price: number
  euroSuffix: string
  currency?: string
  locale?: string
  className?: string
}

const PriceChangeIndicator: React.FC<PriceChangeIndicatorProps> = ({ price, euroSuffix, currency, locale, className = '' }) => {

  // Use new currency utility for consistent formatting
  const formatCurrency = (price: number): string => {
    if (currency && locale) {
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
        }).format(price)
      } catch (error) {
        console.warn(`Invalid currency or locale: ${currency}, ${locale}`, error)
      }
    }

    // Fallback to simple formatting with proper decimal places
    const decimals = currency ? getCurrencyDecimals(currency) : 2
    return formatPrice(price, euroSuffix, decimals)
  }

  return (
    <span className={`text-sm font-medium ${className}`}>
      +{formatCurrency(price)}
    </span>
  )
}

export default PriceChangeIndicator
