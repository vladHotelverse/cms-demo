export interface OfferType {
  id: number
  title: string
  description: string
  price: number
  type: 'perStay' | 'perPerson' | 'perNight'
  image?: string
  requiresDateSelection?: boolean
  allowsMultipleDates?: boolean // For multiple date selection
  featured?: boolean
}

export interface OfferSelection {
  quantity: number
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[] // For multiple date selection
  startDate?: Date
  endDate?: Date
}

export interface OfferData {
  id: number
  name: string
  price: number
  basePrice: number // Add base price to preserve original offer price
  quantity: number
  type: 'perStay' | 'perPerson' | 'perNight'
  persons?: number
  nights?: number
  selectedDate?: Date
  selectedDates?: Date[] // For multiple date selection
  startDate?: Date
  endDate?: Date
}

export interface ReservationInfo {
  personCount?: number
  checkInDate?: Date
  checkOutDate?: Date
}

export interface SpecialOffersProps {
  className?: string
  id?: string
  offers: OfferType[]
  initialSelections?: Record<number, OfferSelection>
  onBookOffer?: (offerData: OfferData) => void
  currencySymbol?: string
  reservationInfo?: ReservationInfo
  useEnhancedDateSelector?: boolean // Enable enhanced date selector

  // Translation props
  labels?: OfferLabels
}

export interface OfferLabels {
  perStay: string
  perPerson: string
  perNight: string
  total: string
  bookNow: string
  numberOfPersons: string
  numberOfNights: string
  addedLabel: string
  popularLabel: string
  personsTooltip: string
  personsSingularUnit: string
  personsPluralUnit: string
  nightsTooltip: string
  nightsSingularUnit: string
  nightsPluralUnit: string
  personSingular: string
  personPlural: string
  nightSingular: string
  nightPlural: string
  removeOfferLabel: string
  decreaseQuantityLabel: string
  increaseQuantityLabel: string
  selectDateLabel: string
  selectDateTooltip: string
  dateRequiredLabel: string
  // Enhanced date selector labels
  selectDatesLabel?: string
  selectDatesTooltip?: string
  availableDatesLabel?: string
  noAvailableDatesLabel?: string
  clearDatesLabel?: string
  confirmDatesLabel?: string
  dateSelectedLabel?: string
  multipleDatesRequiredLabel?: string
}
