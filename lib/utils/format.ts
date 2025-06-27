/**
 * Formatting utility functions
 */

/**
 * Format currency with locale support
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'EUR',
  locale: string = 'es-ES'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format date with locale support
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {},
  locale: string = 'es-ES'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (
  date: Date | string,
  locale: string = 'es-ES'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string, format: 'international' | 'national' = 'international'): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 9) {
    // Spanish mobile number
    if (format === 'international') {
      return `+34 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
    }
  }
  
  // Return original if format not recognized
  return phone
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
  locale: string = 'es-ES'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Generate initials from name
 */
export const getInitials = (name: string, maxLength: number = 2): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('')
}
