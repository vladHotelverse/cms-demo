import { useCallback, useState, useEffect } from 'react'
import type { OfferSelection, OfferType, ReservationInfo } from '../types'

interface UseOfferSelectionsProps {
  offers: OfferType[]
  initialSelections?: Record<number, OfferSelection>
  reservationInfo?: ReservationInfo
}

export const useOfferSelections = ({ offers, initialSelections, reservationInfo }: UseOfferSelectionsProps) => {
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

  // Initialize selections with lazy initialization
  const [selections, setSelections] = useState<Record<number, OfferSelection>>(() => {
    const defaultSelections: Record<number, OfferSelection> = {}
    offers.forEach((offer) => {
      const isAllInclusiveOffer = isAllInclusive(offer)
      const nights = calculateNights(reservationInfo?.checkInDate, reservationInfo?.checkOutDate)
      
      defaultSelections[offer.id] = {
        quantity: isAllInclusiveOffer ? 1 : 0, // All inclusive starts with quantity 1
        persons: offer.type === 'perPerson' ? reservationInfo?.personCount || 1 : 1,
        nights: isAllInclusiveOffer ? nights : 1, // All inclusive uses full stay duration
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      }
    })
    return { ...defaultSelections, ...initialSelections }
  })
  const [bookedOffers, setBookedOffers] = useState<Set<number>>(new Set())
  const [bookingAttempts, setBookingAttempts] = useState<Set<number>>(new Set())

  useEffect(() => {
    const defaultSelections: Record<number, OfferSelection> = {}
    offers.forEach((offer) => {
      const isAllInclusiveOffer = isAllInclusive(offer)
      const nights = calculateNights(reservationInfo?.checkInDate, reservationInfo?.checkOutDate)
      
      defaultSelections[offer.id] = {
        quantity: isAllInclusiveOffer ? 1 : 0, // All inclusive starts with quantity 1
        persons: offer.type === 'perPerson' ? reservationInfo?.personCount || 1 : 1,
        nights: isAllInclusiveOffer ? nights : 1, // All inclusive uses full stay duration
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      }
    })

    const newSelections = { ...defaultSelections, ...initialSelections }
    setSelections(newSelections)

    const newBookedOffers = new Set<number>()
    if (initialSelections) {
      for (const id in initialSelections) {
        if (Object.prototype.hasOwnProperty.call(initialSelections, id)) {
          const selection = initialSelections[id]
          if (selection && selection.quantity > 0) {
            newBookedOffers.add(Number(id))
          }
        }
      }
    }
    setBookedOffers(newBookedOffers)
  }, [initialSelections, offers, reservationInfo])

  // Helper function to clear booked state and booking attempts
  const clearOfferState = useCallback((id: number) => {
    setBookedOffers((prev) => {
      if (prev.has(id)) {
        const newBooked = new Set(prev)
        newBooked.delete(id)
        return newBooked
      }
      return prev
    })
    setBookingAttempts((prev) => {
      if (prev.has(id)) {
        const newAttempts = new Set(prev)
        newAttempts.delete(id)
        return newAttempts
      }
      return prev
    })
  }, [])

  const updateQuantity = useCallback(
    (id: number, change: number): void => {
      const offer = offers.find((o) => o.id === id)
      if (!offer || isAllInclusive(offer)) {
        return // Don't allow quantity changes for All Inclusive packages
      }
      
      setSelections((prev) => {
        const currentSelection = prev[id]
        const newQuantity = Math.max(0, currentSelection.quantity + change)

        return {
          ...prev,
          [id]: {
            ...currentSelection,
            quantity: newQuantity,
          },
        }
      })
      clearOfferState(id)
    },
    [offers, clearOfferState]
  )

  const updateSelectedDate = useCallback(
    (id: number, selectedDate: Date | undefined): void => {
      setSelections((prev) => {
        const offer = offers.find((o) => o.id === id)
        const currentSelection = prev[id]
        const newQuantity = offer?.requiresDateSelection ? (selectedDate ? 1 : 0) : currentSelection.quantity

        return {
          ...prev,
          [id]: {
            ...currentSelection,
            selectedDate,
            quantity: newQuantity,
          },
        }
      })
      clearOfferState(id)
    },
    [offers, clearOfferState]
  )

  const updateSelectedDates = useCallback(
    (id: number, selectedDates: Date[]): void => {
      setSelections((prev) => {
        const offer = offers.find((o) => o.id === id)
        const currentSelection = prev[id]
        const newQuantity = offer?.requiresDateSelection ? selectedDates.length : currentSelection.quantity

        return {
          ...prev,
          [id]: {
            ...currentSelection,
            selectedDates,
            quantity: newQuantity,
          },
        }
      })
      clearOfferState(id)
    },
    [offers, clearOfferState]
  )


  return {
    selections,
    bookedOffers,
    bookingAttempts,
    updateQuantity,
    updateSelectedDate,
    updateSelectedDates,
    setBookedOffers,
    setBookingAttempts,
    setSelections,
  }
}
