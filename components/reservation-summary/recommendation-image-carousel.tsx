"use client"

import { Badge } from "@/components/ui/badge"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel"

interface RecommendationImageCarouselProps {
  images: string[]
  amenityKeys: string[]
  currentIndex: number
  title: string
  onApiChange: (api: CarouselApi) => void
  onImageClick?: () => void
  showControls?: boolean
  className?: string
  imageClassName?: string
  t: (key: string) => string
}

export function RecommendationImageCarousel({
  images,
  amenityKeys,
  currentIndex,
  title,
  onApiChange,
  onImageClick,
  showControls = true,
  className = "",
  imageClassName = "",
  t
}: RecommendationImageCarouselProps) {
  return (
    <Carousel className={`w-full ${className}`} setApi={onApiChange}>
      <CarouselContent className="h-full">
        {images.map((image, index) => (
          <CarouselItem key={index} className="h-full">
            <div 
              className="h-full bg-gray-200 rounded overflow-hidden relative cursor-pointer"
              onClick={onImageClick}
            >
              <img 
                src={image} 
                alt={`${title} ${index + 1}`} 
                className={`w-full h-full object-cover hover:scale-105 transition-transform ${imageClassName}`}
              />
              {amenityKeys[currentIndex] && index === currentIndex && (
                <div className="absolute top-2 left-2 pointer-events-none">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800 backdrop-blur-sm">
                    {t(amenityKeys[currentIndex])}
                  </Badge>
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls && images.length > 1 && (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      )}
    </Carousel>
  )
}