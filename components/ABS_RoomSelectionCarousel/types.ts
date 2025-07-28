export interface RoomOption {
  id: string
  title?: string
  roomType: string
  description: string
  amenities: string[]
  price: number
  oldPrice?: number
  images: string[]
}

export interface RoomSelectionCarouselTranslations {
  // Room actions
  learnMoreText: string
  selectedText: string
  selectText: string

  // Price and currency
  nightText: string
  priceInfoText: string
  currencySymbol: string

  // Price slider (only used when slider is enabled)
  makeOfferText: string
  availabilityText: string
  proposePriceText: string
  currencyText: string
  offerMadeText: string // Template: 'Has propuesto {price} EUR por noche'
  bidSubmittedText: string
  updateBidText: string
  cancelBidText: string

  // Discount badge
  discountBadgeText: string // Template: '-{percentage}%'

  // Empty state
  noRoomsAvailableText: string

  // Navigation labels (for accessibility)
  navigationLabels: {
    previousRoom: string
    nextRoom: string
    previousRoomMobile: string
    nextRoomMobile: string
    goToRoom: string // Template: 'Go to room {index}'
    previousImage: string
    nextImage: string
    viewImage: string // Template: 'View image {index}'
  }

  upgradeNowText?: string;
  removeText?: string;
}

export interface RoomSelectionCarouselProps {
  className?: string
  id?: string
  title?: string
  subtitle?: string
  roomOptions: RoomOption[]
  initialSelectedRoom?: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
  onMakeOffer?: (price: number, room: RoomOption) => void
  onLearnMore?: (room: RoomOption) => void
  onCancelBid?: (roomId: string) => void
  minPrice?: number
  showPriceSlider?: boolean
  variant?: 'basic' | 'with-slider'
  translations?: RoomSelectionCarouselTranslations
  currentRoomType?: string
  currentRoomAmenities?: string[]
  mode?: 'selection' | 'consultation'
  readonly?: boolean

  // Deprecated individual text props - keeping for backward compatibility but will be removed
  /** @deprecated Use translations.learnMoreText instead */
  learnMoreText?: string
  /** @deprecated Use translations.nightText instead */
  nightText?: string
  /** @deprecated Use translations.priceInfoText instead */
  priceInfoText?: string
  /** @deprecated Use translations.makeOfferText instead */
  makeOfferText?: string
  /** @deprecated Use translations.availabilityText instead */
  availabilityText?: string
  /** @deprecated Use translations.selectedText instead */
  selectedText?: string
  /** @deprecated Use translations.selectText instead */
  selectText?: string
  /** @deprecated Use translations.discountBadgeText instead */
  discountBadgeText?: string
  /** @deprecated Use translations.offerMadeText instead */
  offerMadeText?: string
  /** @deprecated Use translations.proposePriceText instead */
  proposePriceText?: string
  /** @deprecated Use translations.currencyText instead */
  currencyText?: string
  /** @deprecated Use translations.currencySymbol instead */
  currencySymbol?: string
  /** @deprecated Use translations.bidSubmittedText instead */
  bidSubmittedText?: string
  /** @deprecated Use translations.updateBidText instead */
  updateBidText?: string
  /** @deprecated Use translations.cancelBidText instead */
  cancelBidText?: string
  /** @deprecated Use translations.upgradeNowText instead */
  upgradeNowText?: string
  /** @deprecated Use translations.removeText instead */
  removeText?: string
  
  // Active bid information
  activeBid?: {
    roomId: string | number
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
}
