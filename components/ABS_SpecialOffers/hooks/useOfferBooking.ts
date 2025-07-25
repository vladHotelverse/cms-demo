import { useCallback } from 'react'
import type { OfferData, OfferSelection, OfferType, ReservationInfo } from '../types'

interface UseOfferBookingProps {
  offers: OfferType[]
  selections: Record<number, OfferSelection>
  bookedOffers: Set<number>
  bookingAttempts: Set<number>
  setBookedOffers: (fn: (prev: Set<number>) => Set<number>) => void
  setBookingAttempts: (fn: (prev: Set<number>) => Set<number>) => void
  setSelections: (fn: (prev: Record<number, OfferSelection>) => Record<number, OfferSelection>) => void
  onBookOffer?: (offerData: OfferData) => void
  calculateTotal: (offer: OfferType, selection: OfferSelection) => number
  reservationInfo?: ReservationInfo
}

export const useOfferBooking = ({
  offers,
  selections,
  bookedOffers,
  setBookedOffers,
  setBookingAttempts,
  setSelections,
  onBookOffer,
  calculateTotal,
  reservationInfo,
}: UseOfferBookingProps) => {
  // Helper function to check if offer is All Inclusive
  const isAllInclusive = (offer: OfferType): boolean => {
    return offer.title.toLowerCase().includes('all inclusive')
  }

  // Helper function to calculate nights between dates
  const calculateNights = (checkIn?: Date, checkOut?: Date): number => {
    if (!checkIn || !checkOut) return 1
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }
  const validateBooking = useCallback((offer: OfferType, selection: OfferSelection): string | null => {
    // For non-date-based offers, quantity must be greater than 0
    if (!offer.requiresDateSelection && offer.type !== 'perNight' && selection.quantity === 0) {
      return 'Quantity must be greater than 0'
    }

    // Check if date is required but not selected
    if (
      offer.requiresDateSelection &&
      !selection.selectedDate &&
      (!selection.selectedDates || selection.selectedDates.length === 0)
    ) {
      return 'Date selection required'
    }

    // Check if perNight offer but date range not complete
    if (offer.type === 'perNight' && (!selection.startDate || !selection.endDate)) {
      return 'Date range selection required'
    }

    return null
  }, [])

  const createOfferData = useCallback(
    (offer: OfferType, selection: OfferSelection): OfferData => {
      // Calculate the correct quantity for different offer types
      let finalQuantity = selection.quantity
      if (offer.requiresDateSelection && selection.selectedDates && selection.selectedDates.length > 0) {
        finalQuantity = selection.selectedDates.length
      } else if (offer.requiresDateSelection && selection.selectedDate) {
        finalQuantity = 1
      }

      const offerData: OfferData = {
        id: offer.id,
        name: offer.title,
        price: calculateTotal(offer, selection),
        basePrice: offer.price, // Add base price
        quantity: finalQuantity,
        type: offer.type,
      }

      // Add conditional properties
      if (offer.type === 'perPerson') {
        offerData.persons = selection.persons || 1
      }

      if (offer.type === 'perNight') {
        offerData.nights = selection.nights || 1
      }

      if (selection.selectedDate) {
        offerData.selectedDate = selection.selectedDate
      }

      if (selection.selectedDates && selection.selectedDates.length > 0) {
        offerData.selectedDates = selection.selectedDates
      }

      if (selection.startDate) {
        offerData.startDate = selection.startDate
      }

      if (selection.endDate) {
        offerData.endDate = selection.endDate
      }

      return offerData
    },
    [calculateTotal]
  )

  const bookOffer = useCallback(
    (id: number): void => {
      const offer = offers.find((o) => o.id === id)
      if (!offer) return

      const selection = selections[id]
      const validationError = validateBooking(offer, selection)

      if (validationError) {
        // Track that user attempted to book with validation error
        setBookingAttempts((prev) => new Set([...prev, id]))
        return
      }

      // Create offer data and mark as booked
      const offerData = createOfferData(offer, selection)

      setBookedOffers((prev) => new Set([...prev, id]))
      setBookingAttempts((prev) => {
        const newAttempts = new Set(prev)
        newAttempts.delete(id)
        return newAttempts
      })

      if (onBookOffer) {
        onBookOffer(offerData)
      }
    },
    [offers, selections, validateBooking, createOfferData, setBookedOffers, setBookingAttempts, onBookOffer]
  )

  const cancelOffer = useCallback(
    (id: number): void => {
      const offer = offers.find((o) => o.id === id)
      if (!offer) return

      // Remove from booked state
      setBookedOffers((prev) => {
        const newBooked = new Set(prev)
        newBooked.delete(id)
        return newBooked
      })

      // Clear booking attempt
      setBookingAttempts((prev) => {
        const newAttempts = new Set(prev)
        newAttempts.delete(id)
        return newAttempts
      })

      // Reset selection to default
      const isAllInclusiveOffer = isAllInclusive(offer)
      const nights = calculateNights(reservationInfo?.checkInDate, reservationInfo?.checkOutDate)
      
      setSelections((prev) => ({
        ...prev,
        [id]: {
          quantity: isAllInclusiveOffer ? 1 : 0, // All inclusive resets to 1, others to 0
          persons: offer.type === 'perPerson' ? reservationInfo?.personCount || 1 : 1,
          nights: isAllInclusiveOffer ? nights : 1, // All inclusive uses full stay duration
          selectedDate: undefined,
          selectedDates: [],
          startDate: undefined,
          endDate: undefined,
        },
      }))

      // Call onBookOffer with quantity 0 to indicate removal
      if (onBookOffer) {
        const offerData: OfferData = {
          id: offer.id,
          name: offer.title,
          price: 0,
          basePrice: offer.price,
          quantity: 0,
          type: offer.type,
        }
        onBookOffer(offerData)
      }
    },
    [offers, onBookOffer, reservationInfo?.personCount, setBookedOffers, setBookingAttempts, setSelections]
  )

  const handleBookOrCancel = useCallback(
    (id: number) => {
      if (bookedOffers.has(id)) {
        cancelOffer(id)
      } else {
        bookOffer(id)
      }
    },
    [bookedOffers, bookOffer, cancelOffer]
  )

  return {
    bookOffer,
    cancelOffer,
    handleBookOrCancel,
    validateBooking,
    createOfferData,
  }
}
