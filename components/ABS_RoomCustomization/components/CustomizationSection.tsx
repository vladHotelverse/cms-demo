import { Icon } from '@iconify/react'
import clsx from 'clsx'
import type React from 'react'
import { useState } from 'react'
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
  isOpen: boolean
  onToggle: () => void
  onSelect: (optionId: string) => void
  onOpenModal?: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
}

const isExactViewOption = (option: CustomizationOption | ViewOption | ExactViewOption): option is ExactViewOption => {
  return 'imageUrl' in option && typeof option.imageUrl === 'string'
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  config,
  options,
  selectedOptions,
  disabledOptions,
  isOpen,
  onToggle,
  onSelect,
  onOpenModal,
  texts,
  fallbackImageUrl,
  mode = 'interactive',
  readonly = false,
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
      <div className={clsx(
        "flex justify-between items-center py-3 border-b",
        mode !== 'consultation' && "cursor-pointer"
      )} onClick={mode !== 'consultation' ? onToggle : undefined}>
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{config.title}</h2>
          {config.infoText && mode !== 'consultation' && (
            <button onClick={handleInfoToggle} className="ml-2 text-neutral-500 hover:text-neutral-700">
              <Icon icon="solar:info-circle-bold" className="h-5 w-5" data-testid="info-icon" />
            </button>
          )}
        </div>
        {mode !== 'consultation' && (
          <button className="text-neutral-400">
            {isOpen ? (
              <Icon icon="solar:alt-arrow-up-bold" className="h-6 w-6" data-testid="minus-icon" />
            ) : (
              <Icon icon="solar:alt-arrow-down-bold" className="h-6 w-6" data-testid="plus-icon" />
            )}
          </button>
        )}
      </div>

      {(isOpen || mode === 'consultation') && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300 -webkit-overflow-scrolling-touch pt-4">
          {config.infoText && showInfo && (
            <div className="transition-all duration-300 ease-in-out col-span-full pt-4">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 flex justify-between items-start">
                {config.infoText}
                <button
                  onClick={() => setShowInfo(false)}
                  className="ml-4 p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Icon icon="solar:close-circle-bold" className="h-4 w-4 text-blue-700" />
                </button>
              </div>
            </div>
          )}

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
          
          {/* Show More/Less Button */}
          {shouldShowMoreButton && (
            <div className="col-span-full flex justify-center pt-4">
              <button
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
      )}
    </div>
  )
}
