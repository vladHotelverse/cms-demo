"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recommendation } from "@/data/recommendations"
import { PriceDisplay } from "./price-display"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { acceptRecommendation, declineRecommendation, acceptedRecommendations } = useReservationSummaryStore()
  const { t } = useReservationTranslations()
  const isAccepted = acceptedRecommendations.includes(recommendation.id)

  const handleAccept = () => {
    acceptRecommendation(recommendation.id)
  }

  const handleDecline = () => {
    declineRecommendation(recommendation.id)
  }

  return (
    <Card className="border-2 border-dashed hover:border-solid transition-all hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <PriceDisplay
            pricePerUnit={recommendation.pricePerNight || recommendation.pricePerUnit || recommendation.totalPrice}
            pricingType={recommendation.pricingType}
            totalPrice={recommendation.totalPrice}
            commission={recommendation.commission}
          />
          
          <div className="flex-1 flex justify-between items-start">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">{t(recommendation.titleKey)}</h4>
                <p className="text-base text-muted-foreground">
                  {t(recommendation.descriptionKey)}
                </p>
              </div>
              
              {recommendation.images.length > 0 && (
                <div className="flex gap-2">
                  {recommendation.images.map((image, index) => (
                    <div key={index} className="flex-1 h-20 bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={image} 
                        alt={`${recommendation.title} ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                {recommendation.amenityKeys.map((amenityKey) => (
                  <Badge key={amenityKey} variant="secondary" className="text-xs">
                    {t(amenityKey)}
                  </Badge>
                ))}
              </div>
              
              {recommendation.detailsKey && (
                <div className="text-sm text-muted-foreground">
                  {(t(recommendation.detailsKey) as string[]).map((detail, index) => (
                    <div key={index}>• {detail}</div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDecline}
                disabled={isAccepted}
              >
                {t('decline')}
              </Button>
              <Button 
                size="sm"
                onClick={handleAccept}
                disabled={isAccepted}
                variant={isAccepted ? "secondary" : "default"}
              >
                {isAccepted ? t('confirmed') : t('accept')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}