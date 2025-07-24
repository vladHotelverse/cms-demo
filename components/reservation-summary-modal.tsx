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

  // Initialize store with dynamic data on mount
  useEffect(() => {
    useReservationSummaryStore.setState({ requestedItems: dynamicReservationItems })
  }, [reservation.id, dynamicReservationItems])

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