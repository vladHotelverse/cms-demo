"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Recommendation } from "@/data/recommendations"
import { PriceDisplay } from "./price-display"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { type CarouselApi } from "@/components/ui/carousel"
import { RecommendationImageCarousel } from "./recommendation-image-carousel"
import { RecommendationActions } from "./recommendation-actions"
import { RecommendationDetails } from "./recommendation-details"

interface RecommendationCardProps {
  recommendation: Recommendation
}

// Constants for better maintainability
const IMAGE_CONTAINER_WIDTH = "max-w-[260px]"
const CARD_STYLES = "border-2 border-dashed hover:border-solid transition-all hover:shadow-sm"
const DIALOG_MAX_WIDTH = "max-w-4xl"

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { acceptRecommendation, declineRecommendation, acceptedRecommendations } = useReservationSummaryStore()
  const { t } = useReservationTranslations()
  const [isImageEnlarged, setIsImageEnlarged] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const isAccepted = acceptedRecommendations.includes(recommendation.id)

  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    handleSelect() // Set initial value
    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  const handleAccept = useCallback(() => {
    acceptRecommendation(recommendation.id)
  }, [acceptRecommendation, recommendation.id])

  const handleDecline = useCallback(() => {
    declineRecommendation(recommendation.id)
  }, [declineRecommendation, recommendation.id])

  const handleImageClick = useCallback(() => {
    setIsImageEnlarged(true)
  }, [])

  return (
    <Card className={CARD_STYLES}>
      <CardContent className="p-4">
        {/* Horizontal layout following reference structure: Image, Price, Details, Buttons */}
        <div className="flex gap-4 items-start">
          {/* Single enlargeable image with carousel and integrated amenities */}
          {recommendation.images.length > 0 && (
            <div className={`${IMAGE_CONTAINER_WIDTH} h-auto relative flex-shrink-0 self-stretch`}>
              <Dialog open={isImageEnlarged} onOpenChange={setIsImageEnlarged}>
                <RecommendationImageCarousel
                  images={recommendation.images}
                  amenityKeys={recommendation.amenityKeys}
                  currentIndex={current}
                  title={t(recommendation.titleKey)}
                  onApiChange={setApi}
                  onImageClick={handleImageClick}
                  className="h-full"
                  t={t}
                />
                <DialogContent className={DIALOG_MAX_WIDTH}>
                  <VisuallyHidden>
                    <DialogTitle>{t(recommendation.titleKey)}</DialogTitle>
                  </VisuallyHidden>
                  <RecommendationImageCarousel
                    images={recommendation.images}
                    amenityKeys={[]}
                    currentIndex={0}
                    title={t(recommendation.titleKey)}
                    onApiChange={() => {}}
                    imageClassName="object-contain"
                    t={t}
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
          
          {/* PriceDisplay component to the right of image */}
          <div className="flex-shrink-0">
            <PriceDisplay
              pricePerUnit={recommendation.pricePerNight || recommendation.pricePerUnit || recommendation.totalPrice}
              pricingType={recommendation.pricingType}
              totalPrice={recommendation.totalPrice}
              commission={recommendation.commission}
            />
          </div>
          
          {/* Details section with title/subtitle on top, bullets on bottom */}
          <RecommendationDetails
            title={t(recommendation.titleKey)}
            description={t(recommendation.descriptionKey)}
            details={recommendation.detailsKey ? t(recommendation.detailsKey) as string[] : undefined}
          />
          
          {/* Accept/Decline buttons to the right of details */}
          <RecommendationActions
            isAccepted={isAccepted}
            onAccept={handleAccept}
            onDecline={handleDecline}
            t={t}
          />
        </div>
      </CardContent>
    </Card>
  )
}