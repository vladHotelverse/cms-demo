import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import type { CustomizationOption, RoomCustomizationTexts } from '../types'
import { IconRenderer } from './IconRenderer'

interface OptionCardProps {
  option: CustomizationOption
  isSelected: boolean
  isDisabled?: boolean
  disabledReason?: string
  onSelect: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  showFeatures?: boolean
  onShowFeatures?: () => void
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  isDisabled = false,
  disabledReason,
  onSelect,
  texts,
  fallbackImageUrl,
  showFeatures = false,
  onShowFeatures,
  mode = 'interactive',
  readonly = false,
}) => {
  const handleClick = () => {
    if (isDisabled) return
    onSelect()
  }

  const cardContent = (
    <div className={clsx(
      'flex-none sm:w-auto h-full bg-white border border-neutral-300 rounded-lg overflow-hidden snap-center transition-all duration-200 relative',
      {
        'opacity-50 cursor-not-allowed': isDisabled,
        'hover:shadow-md': !isDisabled,
      }
    )}>
      {/* Selected indicator - only show in interactive mode */}
      {isSelected && !isDisabled && mode !== 'consultation' && (
        <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded flex items-center gap-1 bg-green-600/90">
          <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
          Selected
        </div>
      )}
      <div className="p-4 flex flex-col h-full">
        <div className="flex flex-col mb-1">
          <div className="flex gap-2.5 items-center w-20">
            <div className={clsx(
              "flex items-center justify-center w-10 h-10",
              {
                'text-neutral-400': isDisabled,
              }
            )}>
              <IconRenderer iconName={option.icon} fallbackImageUrl={fallbackImageUrl} label={option.label} />
            </div>
          </div>
          <h3 className={clsx(
            "font-medium text-sm",
            {
              'text-neutral-400': isDisabled,
            }
          )}>
            {option.label}
          </h3>
        </div>
        {option.description && (
          <p className={clsx(
            "text-xs mb-1",
            {
              'text-neutral-300': isDisabled,
              'text-neutral-500': !isDisabled,
            }
          )}>
            {option.description}
          </p>
        )}
        <p className={clsx(
          "text-sm font-semibold mb-4",
          {
            'text-neutral-400': isDisabled,
          }
        )}>
          {option.price.toFixed(2)} {texts.pricePerNightText}
        </p>

        {mode !== 'consultation' && (
          <div className="flex flex-col space-y-2 mt-auto">
            <Button 
              onClick={handleClick} 
              variant={isSelected ? 'destructive' : 'secondary'} 
              size="sm" 
              className={clsx(
                "w-full transition-all border",
                {
                  "hover:bg-black hover:text-white": !isSelected,
                }
              )}
              disabled={isDisabled || readonly}
            >
              {isSelected 
                ? texts.removeText 
                : isDisabled 
                  ? texts.optionDisabledText
                  : `${texts.addForPriceText} ${option.price.toFixed(2)} EUR`}
            </Button>

            {showFeatures && onShowFeatures && !readonly && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isDisabled) onShowFeatures()
                }}
                variant="link"
                size="sm"
                disabled={isDisabled}
              >
                {texts.featuresText}
              </Button>
            )}
          </div>
        )}
        {mode === 'consultation' && isSelected && (
          <div className="flex items-center justify-center mt-auto">
            <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
              {texts.selectedText}
            </div>
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
