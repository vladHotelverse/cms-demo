/**
 * Shared date validation utility for ABS_SpecialOffers components
 */

export const isDateDisabled = (date: Date, reservationStartDate?: Date, reservationEndDate?: Date): boolean => {
  // If no reservation dates specified, only disable past dates
  if (!reservationStartDate || !reservationEndDate) {
    return date < new Date(new Date().setHours(0, 0, 0, 0))
  }

  // Only allow dates within the reservation period
  const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const normalizedStart = new Date(
    reservationStartDate.getFullYear(),
    reservationStartDate.getMonth(),
    reservationStartDate.getDate()
  )
  const normalizedEnd = new Date(
    reservationEndDate.getFullYear(),
    reservationEndDate.getMonth(),
    reservationEndDate.getDate()
  )

  return normalizedDate < normalizedStart || normalizedDate > normalizedEnd
}

/**
 * Converts a date to a consistent string key for comparison
 * Uses local date to avoid timezone issues
 */
export const dateToKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Creates a Date object from a date key string
 * Uses local timezone to match dateToKey
 */
export const keyToDate = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}
