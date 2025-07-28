import clsx from 'clsx'
import type React from 'react'

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

  return (
    <div id={id} className={clsx('transition-all duration-300 ease-in-out', className)}>
      <div className={clsx(
        'grid gap-6',
        offers.length === 1 
          ? 'grid-cols-1 max-w-md' 
          : 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-6xl'
      )}>
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
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
        ))}
      </div>
    </div>
  )
}

export default SpecialOffers
export { SpecialOffers as ABS_SpecialOffers }
