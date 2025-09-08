import clsx from 'clsx'
import type React from 'react'
import { useState } from 'react'

import OfferCard from './components/OfferCard'
import { useOfferBooking } from './hooks/useOfferBooking'
import { useOfferPricing } from './hooks/useOfferPricing'
import { useOfferSelections } from './hooks/useOfferSelections'
import type { OfferLabels, SpecialOffersProps } from './types'

// Simple labels hook
const useOfferLabels = (labels?: SpecialOffersProps['labels']): OfferLabels => {
  return {
    perStay: labels?.perStay || 'per stay',
    perPerson: labels?.perPerson || 'per person',
    perNight: labels?.perNight || 'per night',
    total: labels?.total || 'Total:',
    bookNow: labels?.bookNow || 'Book Now',
    numberOfPersons: labels?.numberOfPersons || 'Number of persons',
    numberOfNights: labels?.numberOfNights || 'Number of nights',
    addedLabel: labels?.addedLabel || 'Added',
    popularLabel: labels?.popularLabel || 'Popular',
    personsTooltip: labels?.personsTooltip || 'Select how many people will use this service',
    personsSingularUnit: labels?.personsSingularUnit || 'person',
    personsPluralUnit: labels?.personsPluralUnit || '',
    nightsTooltip: labels?.nightsTooltip || 'Select the number of nights for this service',
    nightsSingularUnit: labels?.nightsSingularUnit || 'night',
    nightsPluralUnit: labels?.nightsPluralUnit || 's',
    personSingular: labels?.personSingular || 'person',
    personPlural: labels?.personPlural || 'persons',
    nightSingular: labels?.nightSingular || 'night',
    nightPlural: labels?.nightPlural || 'nights',
    removeOfferLabel: labels?.removeOfferLabel || 'Remove from List',
    decreaseQuantityLabel: labels?.decreaseQuantityLabel || 'Decrease quantity',
    increaseQuantityLabel: labels?.increaseQuantityLabel || 'Increase quantity',
    selectDateLabel: labels?.selectDateLabel || 'Select Date',
    selectDateTooltip: labels?.selectDateTooltip || 'Choose the date for this service',
    dateRequiredLabel: labels?.dateRequiredLabel || 'Date selection required',
    selectDatesLabel: labels?.selectDatesLabel || 'Select Dates',
    selectDatesTooltip: labels?.selectDatesTooltip || 'Choose dates for this service',
    availableDatesLabel: labels?.availableDatesLabel || 'Available Dates',
    noAvailableDatesLabel: labels?.noAvailableDatesLabel || 'No available dates',
    clearDatesLabel: labels?.clearDatesLabel || 'CLEAR',
    confirmDatesLabel: labels?.confirmDatesLabel || 'DONE',
    dateSelectedLabel: labels?.dateSelectedLabel || 'selected',
    multipleDatesRequiredLabel: labels?.multipleDatesRequiredLabel || 'Multiple dates selection required',
  }
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({
  className,
  id,
  offers,
  initialSelections,
  onBookOffer,
  currencySymbol = '€',
  reservationInfo,
  labels,
}) => {
  // Initialize hooks
  const { formatPrice, calculateTotal, getUnitLabel } = useOfferPricing(currencySymbol, reservationInfo)
  const labelTexts = useOfferLabels(labels)

  // Use extracted hooks for state management
  const {
    selections,
    bookedOffers,
    bookingAttempts,
    updateQuantity,
    updateSelectedDate,
    updateSelectedDates,
    setBookedOffers,
    setBookingAttempts,
    setSelections,
  } = useOfferSelections({
    offers,
    initialSelections,
    reservationInfo,
  })

  // Use extracted hooks for booking logic
  const { handleBookOrCancel } = useOfferBooking({
    offers,
    selections,
    bookedOffers,
    bookingAttempts,
    setBookedOffers,
    setBookingAttempts,
    setSelections,
    onBookOffer,
    calculateTotal,
    reservationInfo,
  })

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1))
  }

  // If only one offer, show it without navigation
  if (offers.length === 1) {
    return (
      <div id={id} className={clsx('transition-all duration-300 ease-in-out', className)}>
        <div className="max-w-md">
          <OfferCard
            key={offers[0].id}
            offer={offers[0]}
            selection={selections[offers[0].id]}
            onUpdateQuantity={(change) => updateQuantity(offers[0].id, change)}
            onUpdateSelectedDate={(date) => updateSelectedDate(offers[0].id, date)}
            onUpdateSelectedDates={(dates) => updateSelectedDates(offers[0].id, dates)}
            onBook={() => handleBookOrCancel(offers[0].id)}
            formatPrice={formatPrice}
            calculateTotal={calculateTotal}
            getUnitLabel={getUnitLabel}
            labels={labelTexts}
            reservationInfo={reservationInfo}
            isBooked={bookedOffers.has(offers[0].id)}
            showValidation={bookingAttempts.has(offers[0].id)}
          />
        </div>
      </div>
    )
  }

  return (
    <div id={id} className={clsx('transition-all duration-300 ease-in-out relative h-[calc(100%-74px)]', className)}>
      <div className="relative h-full">
        {/* Main offer display */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {offers.map((offer) => (
              <div key={offer.id} className="w-full flex-shrink-0">
                <OfferCard
                  offer={offer}
                  selection={selections[offer.id]}
                  onUpdateQuantity={(change) => updateQuantity(offer.id, change)}
                  onUpdateSelectedDate={(date) => updateSelectedDate(offer.id, date)}
                  onUpdateSelectedDates={(dates) => updateSelectedDates(offer.id, dates)}
                  onBook={() => handleBookOrCancel(offer.id)}
                  formatPrice={formatPrice}
                  calculateTotal={calculateTotal}
                  getUnitLabel={getUnitLabel}
                  labels={labelTexts}
                  reservationInfo={reservationInfo}
                  isBooked={bookedOffers.has(offer.id)}
                  showValidation={bookingAttempts.has(offer.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex justify-center items-center mt-4 gap-4 absolute bottom-3.5 left-0 right-0">
          {/* Previous button */}
          <button
            type="button"
            onClick={handlePrevious}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-label="Previous offer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              <title>Previous</title>
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {offers.map((offer, index) => (
              <button
                key={`offer-${offer.id}-indicator`}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex 
                    ? 'bg-gray-800' 
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to offer ${index + 1}`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={handleNext}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-label="Next offer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              <title>Next</title>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SpecialOffers
export { SpecialOffers as ABS_SpecialOffers }
