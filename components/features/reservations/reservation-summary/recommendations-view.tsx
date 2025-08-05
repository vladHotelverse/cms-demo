"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Star } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { RecommendationsHeader } from "./recommendations-header"
import { RecommendationCard } from "./recommendation-card"
import { Recommendation } from "@/data/recommendations"

interface RecommendationsViewProps {
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
  dynamicRecommendations: Recommendation[]
  onCloseTab?: () => void
}

export function RecommendationsView({ reservation, dynamicRecommendations, onCloseTab }: RecommendationsViewProps) {
  const { t } = useReservationTranslations()
  const { setShowDetailedView } = useReservationSummaryStore()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <RecommendationsHeader 
          reservation={reservation} 
          recommendations={dynamicRecommendations}
          onViewFullCatalog={() => setShowDetailedView(true)}
          onCloseTab={onCloseTab}
        />
        
        <div className="space-y-4">
          {dynamicRecommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
        
        {/* Action Footer */}
        <div className="flex items-center justify-end p-6 bg-muted/20 rounded-lg border border-dashed">
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