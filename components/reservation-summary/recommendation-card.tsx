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
const IMAGE_CONTAINER_WIDTH = "max-w-[290px]"
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
          {/* Image display - Business Package gets simple placeholder, others get carousel */}
          {recommendation.id === 'business-package' ? (
            <div className="w-[290px] h-[217px] bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-500">
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium">{t(recommendation.titleKey)}</span>
              </div>
            </div>
          ) : (
            recommendation.images.length > 0 && (
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
                    recommendationId={recommendation.id}
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
            )
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
          
          {/* Details section - Business Package shows amenities as bullets, others use RecommendationDetails */}
          {recommendation.id === 'business-package' ? (
            <div className="flex-1">
              <div className="mb-2">
                <h3 className="font-semibold text-lg">{t(recommendation.titleKey)}</h3>
                <p className="text-gray-600 text-sm">{t(recommendation.descriptionKey)}</p>
              </div>
              {/* Amenities/Attributes list */}
              {recommendation.amenityKeys && recommendation.amenityKeys.length > 0 && (
                <ul className="space-y-1">
                  {recommendation.amenityKeys.map((amenityKey, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                      {t(amenityKey)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <RecommendationDetails
              title={t(recommendation.titleKey)}
              description={t(recommendation.descriptionKey)}
              details={recommendation.detailsKey ? t(recommendation.detailsKey) as string[] : undefined}
            />
          )}
          
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