"use client"

import { useEffect, useMemo, useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import ReservationDetailsTab from "./reservation-details-tab"

// Import data
import { requestedItemsData } from "@/data/reservation-items"
import { recommendationsData } from "@/data/recommendations"
import { generateDynamicRecommendations, createReservationContext } from "@/data/dynamic-recommendations"
import { generateLimitedReservationItems } from "@/data/limited-reservation-items"
import { RoomType } from "@/data/room-type-config"

// Import store
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"

// Import components
import { RequestedItemsHeader } from "./reservation-summary/requested-items-header"
import { RequestedItemsTable } from "./reservation-summary/requested-items-table"
import { RecommendationCard } from "./reservation-summary/recommendation-card"
import { RecommendationsHeader } from "./reservation-summary/recommendations-header"

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
  const { t } = useReservationTranslations()
  const { showDetailedView, requestedItems, setShowDetailedView } = useReservationSummaryStore()
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

  // For "Ya solicitado" case - Enhanced UI with requested items
  if (hasItems) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          <RequestedItemsHeader reservation={reservation} />
          <RequestedItemsTable items={dynamicReservationItems} />
          
          {/* Action Footer */}
          <div className="flex items-center justify-between p-6 bg-muted/20 rounded-lg border border-dashed">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {t('lastUpdate')}: {t('minutesAgo', { minutes: 5 })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button className="gap-2">
                <Settings2 className="h-4 w-4" />
                {t('manageOrder')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For recommendations case
  if (!showDetailedView) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="space-y-6">
          <RecommendationsHeader reservation={reservation} recommendations={dynamicRecommendations} />
          
          <div className="space-y-4">
            {dynamicRecommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
          
          {/* Action Footer */}
          <div className="flex items-center justify-between p-6 bg-muted/20 rounded-lg border border-dashed">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowDetailedView(true)}
              >
                {t('viewFullCatalog')}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button className="gap-2">
                <Star className="h-4 w-4" />
                {t('offerToGuest')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Detailed view
  return (
    <ReservationDetailsTab
      reservation={reservation}
      onShowAlert={() => {}}
      onCloseTab={() => {}}
      isInReservationMode={false}
    />
  )
}