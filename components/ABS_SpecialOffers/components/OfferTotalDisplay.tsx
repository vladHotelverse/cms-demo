import type React from 'react'
import type { OfferLabels } from '../types'

export interface OfferTotalDisplayProps {
  totalLabel: string
  totalPrice: string
  basePrice: string
  quantity: number
  persons?: number
  nights?: number
  offerType: 'perStay' | 'perPerson' | 'perNight'
  offerTitle?: string
  isBooked?: boolean
  labels: OfferLabels
  reservationPersonCount?: number
}

const OfferTotalDisplay: React.FC<OfferTotalDisplayProps> = ({
  totalLabel,
  totalPrice,
  basePrice,
  quantity,
  persons,
  nights,
  offerType,
  offerTitle,
  isBooked = false,
  labels,
  reservationPersonCount,
}) => {
  const showBreakdown =
    (offerType === 'perPerson' && (persons || 1) > 1) || (offerType === 'perNight' && (nights || 1) > 1) || quantity > 1

  // Helper function to get the appropriate unit for quantity display
  const getQuantityUnit = (quantity: number, offerType: string, offerTitle?: string): string => {
    if (quantity <= 1) return ''
    
    // Check if it's All Inclusive - don't show quantity unit for All Inclusive
    const isAllInclusive = offerTitle?.toLowerCase().includes('all inclusive')
    if (isAllInclusive) {
      return '' // Don't show quantity for All Inclusive packages
    }
    
    // Check if it's a transfer/transport related offer
    const isTransfer = offerTitle?.toLowerCase().includes('transfer') || 
                      offerTitle?.toLowerCase().includes('transport') ||
                      offerTitle?.toLowerCase().includes('pickup') ||
                      offerTitle?.toLowerCase().includes('shuttle')
    
    if (isTransfer && offerType === 'perPerson') {
      return quantity === 1 ? 'person' : 'people'
    }
    
    // For perNight offers, use nights
    if (offerType === 'perNight') {
      return quantity === 1 ? 'night' : 'nights'
    }
    
    // For date-based offers (spa, activities), use days
    const isDateBased = offerTitle?.toLowerCase().includes('spa') ||
                       offerTitle?.toLowerCase().includes('access') ||
                       offerTitle?.toLowerCase().includes('pass')
    
    if (isDateBased) {
      return quantity === 1 ? 'day' : 'days'
    }
    
    // Default fallback
    return quantity === 1 ? 'time' : 'times'
  }

  const isAllInclusive = offerTitle?.toLowerCase().includes('all inclusive')
  
  return (
    <div
      className={`rounded-lg p-4 border ${isBooked ? 'bg-green-50 border-green-200' : 'bg-neutral-50/50 border-neutral-200'}`}
    >
      {/* Display person count info above the total for perPerson offers */}
      {offerType === 'perPerson' && reservationPersonCount && (
        <div className="text-sm text-neutral-600 mb-2">
          {isAllInclusive ? 
            `Entire stay for ${reservationPersonCount} ${reservationPersonCount === 1 ? labels.personSingular : labels.personPlural}` :
            `For ${reservationPersonCount} ${reservationPersonCount === 1 ? labels.personSingular : labels.personPlural}`
          }
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="font-medium text-base">{totalLabel}:</span>
        <div className="flex flex-col items-end">
          <span className="text-xl font-bold">{totalPrice}</span>
          {showBreakdown && (
            <span className="text-xs text-neutral-500 mt-1">
              {basePrice}
              {quantity > 1 && `, ${quantity} ${getQuantityUnit(quantity, offerType, offerTitle)}`}
              {offerType === 'perPerson' && (persons || 1) > 1 &&
                `, ${persons || 1} ${(persons || 1) === 1 ? labels.personSingular : labels.personPlural}`}
              {offerType === 'perNight' && (nights || 1) > 1 &&
                `, ${nights || 1} ${(nights || 1) === 1 ? labels.nightSingular : labels.nightPlural}`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default OfferTotalDisplay
