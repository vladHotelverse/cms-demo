"use client"

import { useEffect, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { generateDynamicRecommendations, createReservationContext } from "@/data/dynamic-recommendations"
import { generateLimitedReservationItems } from "@/data/limited-reservation-items"
import { RequestedItemsData, requestedItemsData } from "@/data/reservation-items"
import { RoomType } from "@/data/room-type-config"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"

// Import view components
import { RequestedItemsView } from "./reservation-summary/requested-items-view"
import { RecommendationsView } from "./reservation-summary/recommendations-view"
import { DetailedCatalogView } from "./reservation-summary/detailed-catalog-view"

interface ReservationSummaryModalProps {
  reservation: {
    id: string
    locator: string
    name: string
    email: string
    checkIn: string
    nights: string
    roomType: string
    aci: string
    status: string
    extras: string
    hasHotelverseRequest: boolean
  }
  onCloseTab?: () => void
}

export function ReservationSummaryModal({ reservation, onCloseTab }: ReservationSummaryModalProps) {
  const { t: tLang } = useLanguage()
  const { showDetailedView } = useReservationSummaryStore()
  const hasItems = reservation.extras.includes(tLang("reserved"))

  // Generate dynamic data based on reservation (memoized to prevent infinite re-renders)
  const reservationContext = useMemo(() => {
    // Parse check-in date safely (DD/MM/YYYY format)
    const dateParts = reservation.checkIn.split('/')
    const checkInDate = dateParts.length === 3 
      ? new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]))
      : new Date()
    
    return createReservationContext(
      reservation.roomType as RoomType,
      parseInt(reservation.nights),
      reservation.aci,
      checkInDate
    )
  }, [reservation.roomType, reservation.nights, reservation.aci, reservation.checkIn])
  
  const dynamicRecommendations = useMemo(() => 
    generateDynamicRecommendations(reservationContext), 
    [reservationContext]
  )
  
  const dynamicReservationItems = useMemo(() => 
    generateLimitedReservationItems(reservationContext, reservation.extras),
    [reservationContext, reservation.extras]
  )

  // Get the actual requested items data (static or from Supabase)
  const actualRequestedItems = useMemo(() => {
    const reservationWithItems = reservation as any
    
    // If we have actual Supabase order items, use those
    if (reservationWithItems.orderItems && reservationWithItems.orderItems.length > 0) {
      const nights = parseInt(reservation.nights) || 1
      const extras = reservationWithItems.orderItems.map((item: any) => {
        const basePrice = item.price * (item.quantity || 1)
        
        // Format price based on item type and context
        let priceDisplay = basePrice
        let description = item.description
        
        // For items that are typically per-night, show per-night pricing
        if (item.type === 'customization' && nights > 1) {
          const perNightPrice = basePrice / nights
          description += ` (${perNightPrice.toFixed(2)}€ per night × ${nights} nights)`
        } else if (item.quantity > 1) {
          const unitPrice = item.price
          description += ` (${unitPrice}€ × ${item.quantity} units)`
        }
        
        return {
          id: item.id,
          name: item.name,
          description: description,
          price: priceDisplay,
          status: 'confirmed' as const,
          includesHotels: true,
          agent: 'Online',
          commission: 0,
          dateRequested: new Date().toISOString().split('T')[0],
          units: item.quantity || 1,
          type: (item.type === 'customization' ? 'service' : 'amenity') as 'service' | 'amenity' | 'transfer',
          serviceDate: reservation.checkIn
        }
      })

      return {
        rooms: [], // No room items from Supabase data in this context
        extras,
        bidding: [] // No bidding items from Supabase data in this context
      }
    }
    
    // For demo/mock data, use the static data but respect the count in the button
    const hasReservedItems = reservation.extras.includes(tLang("reserved"))
    if (hasReservedItems) {
      // Extract the number from "X reserved items" and slice the static data accordingly
      const countMatch = reservation.extras.match(/^(\d+)\s+(reserved|reservados)/)
      const requestedCount = countMatch ? parseInt(countMatch[1], 10) : 0
      
      if (requestedCount > 0) {
        // Take the exact number of items from static data
        const allStaticItems = [
          ...requestedItemsData.rooms,
          ...requestedItemsData.extras,
          ...requestedItemsData.bidding
        ]
        
        // Take only the requested number of items
        const selectedItems = allStaticItems.slice(0, requestedCount)
        
        // Distribute back into categories
        const result: RequestedItemsData = {
          rooms: selectedItems.filter(item => 'roomType' in item) as any[],
          extras: selectedItems.filter(item => 'name' in item && 'units' in item) as any[],
          bidding: selectedItems.filter(item => 'pujaType' in item) as any[]
        }
        
        return result
      }
    }
    
    // Fallback to full static data
    return requestedItemsData
  }, [reservation, tLang])

  // Initialize store with actual requested items data on mount
  useEffect(() => {
    useReservationSummaryStore.setState({ requestedItems: actualRequestedItems })
  }, [reservation.id, actualRequestedItems])

  // Route to appropriate view component
  if (hasItems) {
    return (
      <RequestedItemsView 
        reservation={reservation} 
        dynamicReservationItems={actualRequestedItems}
        onCloseTab={onCloseTab} 
      />
    )
  }

  if (!showDetailedView) {
    return (
      <RecommendationsView 
        reservation={reservation} 
        dynamicRecommendations={dynamicRecommendations}
        onCloseTab={onCloseTab} 
      />
    )
  }

  return <DetailedCatalogView reservation={reservation} onCloseTab={onCloseTab} />
}