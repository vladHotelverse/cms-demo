import { useCallback } from 'react'
import type { OfferLabels, OfferSelection, OfferType, ReservationInfo } from '../types'

export const useOfferPricing = (currencySymbol: string, reservationInfo?: ReservationInfo) => {
  const formatPrice = useCallback(
    (price: number): string => {
      return `${currencySymbol}${price.toFixed(2)}`
    },
    [currencySymbol]
  )

  const calculateTotal = useCallback((offer: OfferType, selection: OfferSelection): number => {
    if (selection.quantity === 0) return 0

    // Check if this is an All Inclusive package
    const isAllInclusive = offer.title.toLowerCase().includes('all inclusive')
    
    // For All Inclusive packages, use the full reservation person count and night count
    if (isAllInclusive && offer.type === 'perPerson') {
      const personCount = reservationInfo?.personCount || 1
      const checkInDate = reservationInfo?.checkInDate
      const checkOutDate = reservationInfo?.checkOutDate
      
      if (checkInDate && checkOutDate) {
        const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
        return offer.price * personCount * nights
      }
      return offer.price * personCount
    }

    // For offers with multiple date selections, use the number of selected dates
    if (offer.requiresDateSelection && offer.allowsMultipleDates && selection.selectedDates && selection.selectedDates.length > 0) {
      switch (offer.type) {
        case 'perPerson':
          const personCount = reservationInfo?.personCount || selection.persons || 1
          return offer.price * selection.selectedDates.length * personCount
        case 'perNight':
          return offer.price * selection.selectedDates.length * (selection.nights || 1)
        default: // perStay
          return offer.price * selection.selectedDates.length
      }
    }

    // Original logic for non-date or single-date offers
    switch (offer.type) {
      case 'perPerson':
        const finalPersonCount = reservationInfo?.personCount || selection.persons || 1
        return offer.price * selection.quantity * finalPersonCount
      case 'perNight':
        return offer.price * selection.quantity * (selection.nights || 1)
      default: // perStay
        return offer.price * selection.quantity
    }
  }, [reservationInfo])

  const getUnitLabel = useCallback((type: OfferType['type'], labels: OfferLabels): string => {
    switch (type) {
      case 'perStay':
        return labels.perStay || 'per stay'
      case 'perPerson':
        return labels.perPerson || 'per person'
      case 'perNight':
        return labels.perNight || 'per night'
      default:
        return ''
    }
  }, [])

  return { formatPrice, calculateTotal, getUnitLabel }
}
