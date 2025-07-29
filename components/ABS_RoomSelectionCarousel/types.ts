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

  // Discount badge
  discountBadgeText: string // Template: '-{percentage}%'

  // Empty state
  noRoomsAvailableText: string

  // Navigation labels (for accessibility)
  navigationLabels: {
    previousRoom: string
    nextRoom: string
    goToRoom: string // Template: 'Go to room {index}'
    previousImage: string
    nextImage: string
    viewImage: string // Template: 'View image {index}'
  }

  upgradeNowText?: string;
  removeText?: string;
  
  // New pricing texts
  instantConfirmationText?: string;
  commissionText?: string;
  totalAmountText?: string;
}

export interface RoomSelectionCarouselProps {
  className?: string
  id?: string
  title?: string
  subtitle?: string
  roomOptions: RoomOption[]
  initialSelectedRoom?: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
  onLearnMore?: (room: RoomOption) => void
  translations?: RoomSelectionCarouselTranslations
  currentRoomType?: string
  currentRoomAmenities?: string[]
  mode?: 'selection' | 'consultation'
  readonly?: boolean
  nights?: number

  // Deprecated individual text props - keeping for backward compatibility but will be removed
  /** @deprecated Use translations.learnMoreText instead */
  learnMoreText?: string
  /** @deprecated Use translations.nightText instead */
  nightText?: string
  /** @deprecated Use translations.priceInfoText instead */
  priceInfoText?: string
  /** @deprecated Use translations.selectedText instead */
  selectedText?: string
  /** @deprecated Use translations.selectText instead */
  selectText?: string
  /** @deprecated Use translations.discountBadgeText instead */
  discountBadgeText?: string
  /** @deprecated Use translations.currencySymbol instead */
  currencySymbol?: string
  /** @deprecated Use translations.upgradeNowText instead */
  upgradeNowText?: string
  /** @deprecated Use translations.removeText instead */
  removeText?: string
}
