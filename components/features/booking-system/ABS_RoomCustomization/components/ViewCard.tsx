import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { RoomCustomizationTexts, ExactViewOption } from '../types'
import { Button } from '@/components/ui/button'

// Helper component for loyalty badge
const LoyaltyBadge: React.FC<{
  loyaltyPercentage?: number;
  loyaltyText?: string;
}> = ({ loyaltyPercentage = 10, loyaltyText = 'Loyalty' }) => {
  return (
    <div className="inline-flex items-center bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
      <span>{loyaltyText} {loyaltyPercentage}%</span>
    </div>
  );
};

interface ViewCardProps {
  view: ExactViewOption
  isSelected: boolean
  isDisabled?: boolean
  disabledReason?: string
  onSelect: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
}

export const ViewCard: React.FC<ViewCardProps> = ({
  view,
  isSelected,
  isDisabled = false,
  disabledReason,
  onSelect,
  texts,
  fallbackImageUrl = 'https://picsum.photos/600/400',
  mode = 'interactive',
  readonly = false,
}) => {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleClick = () => {
    if (isDisabled) return
    onSelect()
  }

  const cardContent = (
    <div className={clsx(
      'flex-none w-[85vw] sm:w-auto border border-neutral-200 rounded-lg overflow-hidden snap-center mx-2 sm:mx-0 transition-all duration-200',
      {
        'opacity-50 cursor-not-allowed': isDisabled,
        'hover:shadow-md': !isDisabled,
      }
    )}>
      <div className="relative">
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <button
              type="button"
              disabled={isDisabled}
              className={clsx(
                'w-full h-56 block relative',
                !isDisabled && 'cursor-zoom-in'
              )}
              aria-label="View larger image"
            >
              <img
                src={view.imageUrl || fallbackImageUrl}
                alt={`Room view option - ${view.name}`}
                className={clsx(
                  'w-full h-full object-cover',
                  { 'filter grayscale': isDisabled }
                )}
              />
              {/* Zoom icon as visual cue */}
              {!isDisabled && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                  <Icon icon="lucide:expand" className="h-5 w-5" />
                </div>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0 z-[101]">
            <img
              src={view.imageUrl || fallbackImageUrl}
              alt={`Enlarged view of ${view.name}`}
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>
        
        {/* Price display with loyalty discount */}
        {mode !== 'consultation' && (
          <div className="absolute bottom-16 left-4 right-4">
            <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 line-through">
                  {(view.price / 0.9).toFixed(2)} EUR
                </div>
                <div className="text-sm font-semibold text-green-600">
                  {view.price.toFixed(2)} EUR per night
                </div>
              </div>
              {view.price > 0 && (
                <LoyaltyBadge loyaltyPercentage={10} loyaltyText="Loyalty" />
              )}
            </div>
          </div>
        )}

        {/* Disabled overlay */}
        {isDisabled && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
            <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700">
              {texts.optionDisabledText}
            </div>
          </div>
        )}

        {mode !== 'consultation' && (
          <div className="absolute bottom-0 left-10 right-10 py-2 text-center">
            <Button
              onClick={handleClick}
              disabled={isDisabled || readonly}
              variant={isSelected ? 'destructive' : 'outline'}
              size="sm"
              className={clsx('mb-4 p-3 shadow transition-all duration-300', {
                'hover:translate-y-[-2px] hover:shadow-md': !isSelected && !isDisabled,
              })}
            >
              {isSelected 
                ? texts.removeText 
                : isDisabled 
                  ? texts.optionDisabledText
                  : `${Math.floor(Math.random() * 9) + 1} available`}
            </Button>
          </div>
        )}
        {mode === 'consultation' && isSelected && (
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="text-xs text-green-600 font-medium bg-green-50/90 backdrop-blur px-3 py-1 rounded-full">
              {texts.selectedText}
            </div>
          </div>
        )}

        {/* Selected indicator - only show in interactive mode */}
        {isSelected && !isDisabled && mode !== 'consultation' && (
          <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded flex items-center gap-1 bg-green-600/90">
            <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
            Selected
          </div>
        )}
      </div>
    </div>
  )

  if (isDisabled && disabledReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return cardContent
}
