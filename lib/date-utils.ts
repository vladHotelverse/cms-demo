/**
 * Optimized date formatting and calculation utilities
 * Provides memoized date operations and consistent formatting
 */

import { format, formatDistanceToNow, differenceInDays, parseISO, isValid } from 'date-fns'

// Memoization cache for date formatting operations
const formatCache = new Map<string, string>()
const distanceCache = new Map<string, string>()

// Cache cleanup interval (5 minutes)
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000
let cacheCleanupTimer: NodeJS.Timeout | null = null

/**
 * Clears the date formatting cache
 */
function clearCache() {
  formatCache.clear()
  distanceCache.clear()
}

/**
 * Starts automatic cache cleanup
 */
function startCacheCleanup() {
  if (cacheCleanupTimer) {
    clearInterval(cacheCleanupTimer)
  }
  
  cacheCleanupTimer = setInterval(() => {
    // Keep cache size reasonable (max 1000 entries)
    if (formatCache.size > 1000) {
      const entries = Array.from(formatCache.entries())
      const toKeep = entries.slice(-500) // Keep most recent 500
      formatCache.clear()
      toKeep.forEach(([key, value]) => formatCache.set(key, value))
    }
    
    if (distanceCache.size > 1000) {
      const entries = Array.from(distanceCache.entries())
      const toKeep = entries.slice(-500)
      distanceCache.clear()
      toKeep.forEach(([key, value]) => distanceCache.set(key, value))
    }
  }, CACHE_CLEANUP_INTERVAL)
}

// Start cache cleanup on module load
startCacheCleanup()

/**
 * Safely parses a date from various input formats
 */
export function parseDate(dateInput: string | Date | number | null | undefined): Date | null {
  if (!dateInput) return null
  
  try {
    let date: Date
    
    if (dateInput instanceof Date) {
      date = dateInput
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput)
    } else if (typeof dateInput === 'string') {
      // Try ISO format first, then fallback to Date constructor
      date = dateInput.includes('T') || dateInput.includes('-') 
        ? parseISO(dateInput) 
        : new Date(dateInput)
    } else {
      return null
    }
    
    return isValid(date) ? date : null
  } catch {
    return null
  }
}

/**
 * Formats a date with caching for performance
 */
export function formatDate(
  dateInput: string | Date | number | null | undefined,
  formatString: string = 'MMM dd, yyyy',
  fallback: string = '-'
): string {
  const date = parseDate(dateInput)
  if (!date) return fallback
  
  const cacheKey = `${date.getTime()}-${formatString}`
  
  // Check cache first
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!
  }
  
  try {
    const formatted = format(date, formatString)
    formatCache.set(cacheKey, formatted)
    return formatted
  } catch {
    return fallback
  }
}

/**
 * Formats date with distance to now (e.g., "2 days ago") with caching
 */
export function formatDateDistance(
  dateInput: string | Date | number | null | undefined,
  addSuffix: boolean = true,
  fallback: string = '-'
): string {
  const date = parseDate(dateInput)
  if (!date) return fallback
  
  const cacheKey = `${date.getTime()}-${addSuffix}-${Date.now()}`
  
  // Check cache (with time-based invalidation for recent dates)
  const now = Date.now()
  const timeSinceDate = now - date.getTime()
  
  // Only cache if date is more than 1 hour old (to avoid stale "minutes ago" text)
  if (timeSinceDate > 60 * 60 * 1000 && distanceCache.has(cacheKey)) {
    return distanceCache.get(cacheKey)!
  }
  
  try {
    const distance = formatDistanceToNow(date, { addSuffix })
    
    // Only cache if not too recent
    if (timeSinceDate > 60 * 60 * 1000) {
      distanceCache.set(cacheKey, distance)
    }
    
    return distance
  } catch {
    return fallback
  }
}

/**
 * Calculates the number of days between two dates
 */
export function getDaysBetween(
  startDate: string | Date | number | null | undefined,
  endDate: string | Date | number | null | undefined
): number {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  
  if (!start || !end) return 0
  
  return Math.abs(differenceInDays(end, start))
}

/**
 * Formats a date range as a readable string
 */
export function formatDateRange(
  startDate: string | Date | number | null | undefined,
  endDate: string | Date | number | null | undefined,
  formatString: string = 'MMM dd',
  separator: string = ' - '
): string {
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  
  if (!start && !end) return '-'
  if (!start) return formatDate(end, formatString)
  if (!end) return formatDate(start, formatString)
  
  const startFormatted = formatDate(start, formatString)
  const endFormatted = formatDate(end, formatString)
  
  // If same date, show only once
  if (startFormatted === endFormatted) {
    return startFormatted
  }
  
  // If same year and month, show abbreviated format
  if (start.getFullYear() === end.getFullYear() && 
      start.getMonth() === end.getMonth()) {
    const startDay = formatDate(start, 'dd')
    const endFull = formatDate(end, formatString)
    return `${startDay}${separator}${endFull}`
  }
  
  return `${startFormatted}${separator}${endFormatted}`
}

/**
 * Formats a duration in days to human readable format
 */
export function formatDuration(days: number, includeUnit: boolean = true): string {
  if (days === 0) return includeUnit ? '0 days' : '0'
  if (days === 1) return includeUnit ? '1 day' : '1'
  
  if (days < 7) {
    return includeUnit ? `${days} days` : `${days}`
  }
  
  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7
  
  if (weeks === 1 && remainingDays === 0) {
    return includeUnit ? '1 week' : '1w'
  }
  
  if (remainingDays === 0) {
    return includeUnit ? `${weeks} weeks` : `${weeks}w`
  }
  
  if (includeUnit) {
    return `${weeks} week${weeks > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
  }
  
  return `${weeks}w ${remainingDays}d`
}

/**
 * Checks if a date is within a specified range
 */
export function isDateInRange(
  date: string | Date | number | null | undefined,
  startDate: string | Date | number | null | undefined,
  endDate: string | Date | number | null | undefined
): boolean {
  const dateObj = parseDate(date)
  const start = parseDate(startDate)
  const end = parseDate(endDate)
  
  if (!dateObj) return false
  if (!start && !end) return true
  if (!start) return dateObj <= end!
  if (!end) return dateObj >= start
  
  return dateObj >= start && dateObj <= end
}

/**
 * Gets the start and end of a date (00:00:00 and 23:59:59)
 */
export function getDateBounds(dateInput: string | Date | number | null | undefined): {
  start: Date | null
  end: Date | null
} {
  const date = parseDate(dateInput)
  if (!date) return { start: null, end: null }
  
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  
  return { start, end }
}

/**
 * Commission calculation utilities
 */
export function calculateCommission(
  price: number,
  commissionRate: number,
  isPercentage: boolean = true
): number {
  if (price <= 0 || commissionRate <= 0) return 0
  
  if (isPercentage) {
    return (price * commissionRate) / 100
  }
  
  return commissionRate
}

/**
 * Formats currency with proper locale formatting
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'en-EU',
  minimumFractionDigits: number = 2
): string {
  if (isNaN(amount)) return '0,00 €'
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits: minimumFractionDigits
    }).format(amount)
  } catch {
    // Fallback formatting
    return `${amount.toFixed(minimumFractionDigits)} €`
  }
}

/**
 * Formats a number with proper thousand separators
 */
export function formatNumber(
  num: number,
  locale: string = 'en-EU',
  maximumFractionDigits: number = 0
): string {
  if (isNaN(num)) return '0'
  
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits
    }).format(num)
  } catch {
    return num.toString()
  }
}

/**
 * Creates a date-time string for API requests
 */
export function toISOString(dateInput: string | Date | number | null | undefined): string | null {
  const date = parseDate(dateInput)
  return date ? date.toISOString() : null
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(
  date1: string | Date | number | null | undefined,
  date2: string | Date | number | null | undefined
): boolean {
  const d1 = parseDate(date1)
  const d2 = parseDate(date2)
  
  if (!d1 || !d2) return false
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

/**
 * Gets a human-readable time ago string with smart granularity
 */
export function getTimeAgo(dateInput: string | Date | number | null | undefined): string {
  const date = parseDate(dateInput)
  if (!date) return 'Unknown'
  
  const now = Date.now()
  const diff = now - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return formatDate(date, 'MMM dd')
}

// Export cache control functions for testing/debugging
export const cacheUtils = {
  clearCache,
  getCacheSize: () => ({ format: formatCache.size, distance: distanceCache.size }),
  startCacheCleanup,
  stopCacheCleanup: () => {
    if (cacheCleanupTimer) {
      clearInterval(cacheCleanupTimer)
      cacheCleanupTimer = null
    }
  }
}