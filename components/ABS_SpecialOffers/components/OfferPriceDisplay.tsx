import { Info } from 'lucide-react'
import type React from 'react'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import type { OfferLabels } from '../types'

import EnhancedDateSelector from './EnhancedDateSelector'
import QuantityControls from './QuantityControls'

export interface OfferPriceDisplayProps {
  price: string
  unitLabel: string
  description?: string
  quantity: number
  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
  isBooked?: boolean
  whatsIncludedLabel?: string
  labels: OfferLabels
  showQuantityControls?: boolean
  // Date selector props
  selectedDate?: Date
  selectedDates?: Date[]
  onDateChange?: (date: Date | undefined) => void
  onMultipleDatesChange?: (dates: Date[]) => void
  reservationStartDate?: Date
  reservationEndDate?: Date
  offerId?: string | number
  offerType?: 'perStay' | 'perPerson' | 'perNight'
}

const OfferPriceDisplay: React.FC<OfferPriceDisplayProps> = ({
  price,
  unitLabel,
  description,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  isBooked = false,
  whatsIncludedLabel = "What's included?",
  labels,
  showQuantityControls = true,
  selectedDate,
  selectedDates,
  onDateChange,
  onMultipleDatesChange,
  reservationStartDate,
  reservationEndDate,
  offerId,
  offerType,
}) => (
  <div
    className={`rounded-lg p-3 flex gap-2 justify-between ${isBooked ? 'bg-green-50 border border-green-200' : 'bg-neutral-50/50'}`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex gap-1 flex-col">
        <div className="flex flex-wrap items-baseline gap-1">
          <span className="text-xl font-bold">{price}</span>
          <span className="text-sm text-neutral-500">{unitLabel}</span>
        </div>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-xs text-neutral-600 cursor-help mt-1">
                  <Info className="h-3 w-3 mr-1" />
                  <span>{whatsIncludedLabel}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>

    {/* Date selector - only show when handlers are provided */}
    {(onDateChange || onMultipleDatesChange) && (
      <EnhancedDateSelector
        id={`enhanced-date-${offerId}`}
        label=""
        selectedDates={selectedDates || (selectedDate ? [selectedDate] : [])}
        onChange={(dates) => {
          if (onMultipleDatesChange) {
            onMultipleDatesChange(dates)
          } else if (onDateChange) {
            // For single date selection, use the first date or undefined
            onDateChange(dates.length > 0 ? dates[0] : undefined)
          }
        }}
        disabled={isBooked}
        tooltipText={labels.selectDateTooltip}
        reservationStartDate={reservationStartDate}
        reservationEndDate={reservationEndDate}
        className="min-w-0"
        multiple={!!onMultipleDatesChange}
        maxDates={10}
      />
    )}

    {/* Show quantity controls for perStay and perPerson offers */}
    {(offerType === 'perStay' || offerType === 'perPerson') && showQuantityControls && (
      <QuantityControls
        quantity={quantity}
        onIncrease={onIncreaseQuantity}
        onDecrease={onDecreaseQuantity}
        disabled={false}
        isBooked={isBooked}
        labels={labels}
      />
    )}
  </div>
)

export default OfferPriceDisplay
