// Core selection types
export interface RoomOption {
  id: string
  roomType: string
  price: number
  originalRoomType?: string
  available?: boolean
  agent?: string
  checkIn?: string
  checkOut?: string
  nights?: number
  roomNumber?: string
  attributes?: string[]
  alternatives?: string[]
  showKeyIcon?: boolean
  showAlternatives?: boolean
  showAttributes?: boolean
  selectionScenario?: 'upgrade_only' | 'choose_room_only' | 'choose_room_upgrade' | 'attribute_selection' | 'upgrade_with_attributes'
}

export interface SelectedCustomizations {
  [key: string]: {
    name: string
    price: number
    description?: string
    category?: string
  }
}

export interface OfferData {
  id: string
  name: string
  price: number
  type: string
  description?: string
  validUntil?: string
  available?: boolean
  units?: number
  serviceDate?: string | string[]
}

// Component props
export interface SelectionSummaryProps {
  // Connection props for ABS components
  onRoomSelectionChange?: (room: RoomOption | null) => void
  onRoomCustomizationChange?: (roomId: string, customizations: SelectedCustomizations, total: number) => void
  onSpecialOfferBooked?: (offer: OfferData) => void
  onCloseTab?: () => void

  // Current ABS component states for integration
  currentRoomCustomizations?: SelectedCustomizations
  
  // Reservation context
  reservationInfo?: {
    checkIn: string
    checkOut: string
    agent?: string
    roomNumber?: string
    originalRoomType?: string
  }
  
  // UI customization
  className?: string
  showNotifications?: boolean
  notificationPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  
  // Translations
  translations?: {
    roomsTitle?: string
    extrasTitle?: string
    noSelectionsText?: string
    noSelectionsSubtext?: string
    clearAllText?: string
    clearRoomsText?: string
    clearExtrasText?: string
    totalPriceText?: string
    confirmSelectionsText?: string
    // Notification messages
    roomAddedText?: string
    roomRemovedText?: string
    extraAddedText?: string
    extraRemovedText?: string
    customizationUpdatedText?: string
    selectionsCleared?: string
    selectionFailedText?: string
    networkErrorText?: string
    validationErrorText?: string
  }
}

// Table item types (for compatibility with existing tables)
export interface RoomTableItem {
  id: string
  roomType: string
  price: number
  nights: number
  commission: number
  includesHotels: boolean
  dateRequested: string
  agent: string
  status: 'pending_hotel' | 'confirmed'
  checkIn: string
  checkOut: string
  originalRoomType?: string
  showKeyIcon: boolean
  showAlternatives: boolean
  showAttributes: boolean
  selectionScenario: string
  alternatives: string[]
  customizations?: SelectedCustomizations
  customizationTotal?: number
  isOptimistic?: boolean
}

export interface ExtraTableItem {
  id: string
  name: string
  price: number
  units: number
  type: string
  agent: string
  status: 'pending_hotel' | 'confirmed'
  dateRequested: string
  serviceDate: string | string[]
  commission?: number
  isOptimistic?: boolean
}