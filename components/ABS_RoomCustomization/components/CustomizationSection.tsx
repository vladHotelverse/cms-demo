import { Icon } from '@iconify/react'
import clsx from 'clsx'
import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type {
  CustomizationOption,
  RoomCustomizationTexts,
  SectionConfig,
  SelectedCustomizations,
  ViewOption,
  ExactViewOption,
  DisabledOptions,
} from '../types'
import { OptionCard } from './OptionCard'
import { ViewCard } from './ViewCard'

interface CustomizationSectionProps {
  config: SectionConfig
  options: CustomizationOption[] | ViewOption[] | ExactViewOption[]
  selectedOptions: SelectedCustomizations
  disabledOptions: DisabledOptions
  onSelect: (optionId: string) => void
  onOpenModal?: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
  allSections?: SectionConfig[]
  currentSectionIndex?: number
  onSectionChange?: (index: number) => void
}

const isExactViewOption = (option: CustomizationOption | ViewOption | ExactViewOption): option is ExactViewOption => {
  return 'imageUrl' in option && typeof option.imageUrl === 'string'
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  config,
  options,
  selectedOptions,
  disabledOptions,
  onSelect,
  onOpenModal,
  texts,
  fallbackImageUrl,
  mode = 'interactive',
  readonly = false,
  allSections = [],
  currentSectionIndex = 0,
  onSectionChange,
}) => {
  const [showInfo, setShowInfo] = useState(false)
  const [showAllOptions, setShowAllOptions] = useState(false)
  const isExactViewSection = options.length > 0 && isExactViewOption(options[0])
  
  // Filter options based on mode and type
  const filterOptions = () => {
    if (isExactViewSection) {
      const exactViewOptions = options as ExactViewOption[]
      let filtered = exactViewOptions
      
      if (mode === 'consultation') {
        const selectedOption = selectedOptions[config.key]
        filtered = selectedOption 
          ? exactViewOptions.filter(option => option.id === selectedOption.id)
          : []
      } else {
        filtered = exactViewOptions.filter(option => !disabledOptions[option.id]?.disabled)
      }
      
      return filtered
    } else {
      const customizationOptions = options as (CustomizationOption | ViewOption)[]
      let filtered = customizationOptions
      
      if (mode === 'consultation') {
        const selectedOption = selectedOptions[config.key]
        filtered = selectedOption 
          ? customizationOptions.filter(option => option.id === selectedOption.id)
          : []
      }
      
      return filtered
    }
  }
  
  const filteredOptions = filterOptions()
  const INITIAL_ITEMS_COUNT = 3
  const shouldShowMoreButton = mode !== 'consultation' && filteredOptions.length > INITIAL_ITEMS_COUNT
  const displayOptions = (mode === 'consultation' || showAllOptions) ? filteredOptions : filteredOptions.slice(0, INITIAL_ITEMS_COUNT)

  const handleInfoToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInfo(!showInfo)
  }

  const handleShowMoreToggle = () => {
    setShowAllOptions(!showAllOptions)
  }


  return (
    <div className="mb-6 bg-white rounded overflow-hidden">
      <div className="flex justify-between items-center py-3 border-b">
        <div className="w-full">
          {/* Tab Navigation */}
          {mode !== 'consultation' && allSections.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {allSections.map((section, index) => (
                <Button
                  key={section.key}
                  type="button"
                  onClick={() => onSectionChange?.(index)}
                  variant={index === currentSectionIndex ? "default" : "outline"}
                  size="sm"
                >
                  {section.title}
                </Button>
              ))}
            </div>
          )}
          
          {config.infoText && mode !== 'consultation' && (
            <div className="flex items-center justify-end">
              <button type="button" onClick={handleInfoToggle} className="text-neutral-500 hover:text-neutral-700">
                <Icon icon="solar:info-circle-bold" className="h-5 w-5" data-testid="info-icon" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="py-4">
        {/* Always show content, no accordion behavior */}
        {config.infoText && showInfo && (
          <div className="transition-all duration-300 ease-in-out mb-4">
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 flex justify-between items-start">
              {config.infoText}
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="ml-4 p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Icon icon="solar:close-circle-bold" className="h-4 w-4 text-blue-700" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {displayOptions.map((option) => {
            const isSelected = selectedOptions[config.key]?.id === option.id
            const isDisabled = disabledOptions[option.id]?.disabled || false
            const disabledReason = disabledOptions[option.id]?.reason

            if (isExactViewSection && isExactViewOption(option)) {
              return (
                <ViewCard
                  key={option.id}
                  view={option}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  disabledReason={disabledReason}
                  onSelect={readonly ? () => {} : () => onSelect(option.id)}
                  texts={texts}
                  fallbackImageUrl={fallbackImageUrl}
                  mode={mode}
                  readonly={readonly}
                />
              )
            }
            if (!isExactViewSection) {
              return (
                <OptionCard
                  key={option.id}
                  option={option as CustomizationOption}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  disabledReason={disabledReason}
                  onSelect={readonly ? () => {} : () => onSelect(option.id)}
                  texts={texts}
                  fallbackImageUrl={fallbackImageUrl}
                  showFeatures={config.hasFeatures}
                  onShowFeatures={readonly ? undefined : onOpenModal}
                  mode={mode}
                  readonly={readonly}
                />
              )
            }
            return null
          })}
        </div>
        
        {/* Show More/Less Button */}
        {shouldShowMoreButton && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleShowMoreToggle}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
            >
              {showAllOptions 
                ? texts.showLessText
                : `${texts.showMoreText} (${filteredOptions.length - INITIAL_ITEMS_COUNT} more)`
              }
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
