"use client"

import { useEffect, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { generateDynamicRecommendations, createReservationContext } from "@/data/dynamic-recommendations"
import { generateLimitedReservationItems } from "@/data/limited-reservation-items"
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
}

export function ReservationSummaryModal({ reservation }: ReservationSummaryModalProps) {
  const { t: tLang } = useLanguage()
  const { showDetailedView } = useReservationSummaryStore()
  const hasItems = reservation.extras.includes(tLang("reserved"))

  // Generate dynamic data based on reservation (memoized to prevent infinite re-renders)
  const reservationContext = useMemo(() => createReservationContext(
    reservation.roomType as RoomType,
    parseInt(reservation.nights),
    reservation.aci,
    new Date(reservation.checkIn)
  ), [reservation.roomType, reservation.nights, reservation.aci, reservation.checkIn])
  
  const dynamicRecommendations = useMemo(() => 
    generateDynamicRecommendations(reservationContext), 
    [reservationContext]
  )
  
  const dynamicReservationItems = useMemo(() => 
    generateLimitedReservationItems(reservationContext, reservation.extras),
    [reservationContext, reservation.extras]
  )

  // Convert Supabase orderItems to the format expected by the store
  const supabaseRequestedItems = useMemo(() => {
    const reservationWithItems = reservation as any
    console.log('🔍 Reservation data in modal:', {
      name: reservationWithItems.name,
      extras: reservationWithItems.extras,
      hasOrderItems: !!reservationWithItems.orderItems,
      orderItemsCount: reservationWithItems.orderItems?.length || 0,
      orderItems: reservationWithItems.orderItems
    })
    
    if (!reservationWithItems.orderItems || reservationWithItems.orderItems.length === 0) {
      console.log('⚠️ No order items found, using dynamic recommendations')
      return dynamicReservationItems
    }

    // Convert actual order items from Supabase to RequestedItemsData format
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
        includesHotels: true
      }
    })

    return {
      extras,
      upsell: [],
      atributos: []
    }
  }, [reservation, dynamicReservationItems])

  // Initialize store with actual Supabase data on mount
  useEffect(() => {
    useReservationSummaryStore.setState({ requestedItems: supabaseRequestedItems })
  }, [reservation.id, supabaseRequestedItems])

  // Route to appropriate view component
  if (hasItems) {
    return (
      <RequestedItemsView 
        reservation={reservation} 
        dynamicReservationItems={dynamicReservationItems} 
      />
    )
  }

  if (!showDetailedView) {
    return (
      <RecommendationsView 
        reservation={reservation} 
        dynamicRecommendations={dynamicRecommendations} 
      />
    )
  }

  return <DetailedCatalogView reservation={reservation} />
}