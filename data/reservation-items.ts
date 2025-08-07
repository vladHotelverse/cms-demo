import type { SelectedCustomizations } from '@/components/ABS_RoomCustomization/types'

export interface BaseRequestedItem {
  id: string
  price: number
  status: 'pending_hotel' | 'confirmed'
  includesHotels: boolean
  agent?: string // Agent who sold the service (name or "Online")
  commission?: number // Commission amount
  dateRequested?: string
}

// Room type enumeration - only allowed room types
export type AllowedRoomType = 'Doble' | 'Junior Suite' | 'Doble Deluxe' | 'Rock Suite' | 'Deluxe Gold' | 'Deluxe Swim-up' | '80s Suite' | 'Rock Suite Diamond'

// Room selection scenarios
export type RoomSelectionScenario = 'upgrade_only' | 'choose_room_only' | 'choose_room_upgrade' | 'attribute_selection' | 'upgrade_with_attributes'

// Maximum limits
export const MAX_PRODUCTS_LIMIT = 5

// Validation functions
export const validateProductLimit = (items: any[]): boolean => {
  return items.length <= MAX_PRODUCTS_LIMIT
}

export const isAllowedRoomType = (roomType: string): roomType is AllowedRoomType => {
  const allowedTypes: AllowedRoomType[] = ['Doble', 'Doble Deluxe', 'Junior Suite', 'Rock Suite', 'Deluxe Gold', 'Deluxe Swim-up', '80s Suite', 'Rock Suite Diamond']
  return allowedTypes.includes(roomType as AllowedRoomType)
}

// Auto-determine room selection scenario and UI flags
export const determineRoomScenario = (item: Partial<RoomItem>): {
  selectionScenario: RoomSelectionScenario
  showUpgradeArrow: boolean
  showKeyIcon: boolean
  showAlternatives: boolean
  showAttributes: boolean
} => {
  const hasUpgrade = !!(item.originalRoomType)
  const hasKey = !!(item.hasKey)
  const hasAttributes = !!(item.attributes && item.attributes.length > 0)
  const hasAlternatives = !!(item.alternatives && item.alternatives.length > 0)
  
  // Scenario 5: Upgrade with Attributes (merged scenario)
  if (hasUpgrade && hasAttributes) {
    return {
      selectionScenario: 'upgrade_with_attributes',
      showUpgradeArrow: true,
      showKeyIcon: hasKey,
      showAlternatives: hasAlternatives,
      showAttributes: true
    }
  }
  
  // Scenario 4: Attribute Selection
  if (hasAttributes) {
    return {
      selectionScenario: 'attribute_selection',
      showUpgradeArrow: false,
      showKeyIcon: false,
      showAlternatives: hasAlternatives,
      showAttributes: true
    }
  }
  
  // Scenario 3: Choose Your Room + Upgrade
  if (hasUpgrade && hasKey) {
    return {
      selectionScenario: 'choose_room_upgrade',
      showUpgradeArrow: true,
      showKeyIcon: true,
      showAlternatives: false,
      showAttributes: false
    }
  }
  
  // Scenario 2: Choose Your Room Only
  if (hasKey && !hasUpgrade) {
    return {
      selectionScenario: 'choose_room_only',
      showUpgradeArrow: false,
      showKeyIcon: true,
      showAlternatives: false,
      showAttributes: false
    }
  }
  
  // Scenario 1: Upgrade Only (default for upgrades without key)
  if (hasUpgrade) {
    return {
      selectionScenario: 'upgrade_only',
      showUpgradeArrow: true,
      showKeyIcon: false,
      showAlternatives: hasAlternatives,
      showAttributes: false
    }
  }
  
  // Default fallback
  return {
    selectionScenario: 'choose_room_only',
    showUpgradeArrow: false,
    showKeyIcon: false,
    showAlternatives: hasAlternatives,
    showAttributes: false
  }
}

// Validate room configuration against business rules
export const validateRoomConfiguration = (item: RoomItem): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  // Rule 1: Allow room upgrades with attributes for merged scenarios (upgrade_with_attributes)
  // This rule has been updated to support the new merging functionality
  
  // Rule 2: Attributes + Room Number with key (no alternatives) is forbidden
  if (item.showAttributes && item.attributes && item.attributes.length > 0 && 
      item.showKeyIcon && item.hasKey && (!item.alternatives || item.alternatives.length === 0)) {
    errors.push('Attribute selection cannot be combined with specific room assignment (key icon)')
  }
  
  // Rule 3: Room type must be allowed
  if (!isAllowedRoomType(item.roomType)) {
    errors.push(`Room type '${item.roomType}' is not allowed. Only Doble, Doble Deluxe, and Junior Suite are permitted.`)
  }
  
  // Rule 4: Allow room upgrades with customizations for merged scenarios
  // This rule has been removed to support the upgrade_with_attributes scenario
  
  // Rule 5: Customization-only rooms must have attributes visible
  if (!item.showUpgradeArrow && item.customizations && Object.keys(item.customizations).length > 0 && 
      (!item.attributes || item.attributes.length === 0)) {
    errors.push('Customized rooms must have visible attributes')
  }
  
  // Rule 6: Customization-only rooms should use attribute_selection scenario
  if (item.customizations && Object.keys(item.customizations).length > 0 && 
      !item.showUpgradeArrow && !item.showAttributes) {
    errors.push('Rooms with customizations must show attributes (attribute_selection scenario)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export interface RoomItem extends BaseRequestedItem {
  roomType: AllowedRoomType
  originalRoomType?: AllowedRoomType | null // For room upgrades
  roomNumber?: string
  attributes?: string[]
  hasKey?: boolean
  alternatives?: string[]
  checkIn: string
  checkOut: string
  nights: number
  // Room customizations - for ABS_RoomCustomization integration
  customizations?: SelectedCustomizations
  customizationTotal?: number
  // Room selection scenario - determines UI behavior
  selectionScenario?: RoomSelectionScenario
  // UI control flags
  showUpgradeArrow?: boolean
  showKeyIcon?: boolean
  showAlternatives?: boolean
  showAttributes?: boolean
}

export interface ExtraItem extends BaseRequestedItem {
  name: string
  description?: string
  nameKey?: string // For i18n support
  descriptionKey?: string // For i18n support
  units: number
  type: 'service' | 'amenity' | 'transfer'
  serviceDate: string | string[] // Support multiple service dates
}

export interface BiddingItem extends BaseRequestedItem {
  pujaType: string
  originalRoomType?: string | null // Original room type for upgrades
  pujaNumber?: string
  roomNumber?: string
  hasKey?: boolean
  alternatives?: string[]
  attributes?: string[]
  roomPrice?: number // Room price (usually higher than bid amount)
  dateCreated: string
  dateModified: string
  checkIn?: string // Room check-in date for consistency
  checkOut?: string // Room check-out date for consistency
}

// Legacy interface for backward compatibility
export interface RequestedItem extends BaseRequestedItem {
  name?: string
  description?: string
  nameKey?: string
  descriptionKey?: string
}

export interface RequestedItemsData {
  rooms: RoomItem[]
  extras: ExtraItem[]
  bidding: BiddingItem[]
}

export interface LegacyRequestedItemsData {
  extras: RequestedItem[]
  upsell: RequestedItem[]
  atributos: RequestedItem[]
}

// Single room request with multiple extra services
export const requestedItemsData: RequestedItemsData = {
  // Multiple room examples demonstrating all 4 scenarios
  rooms: [
    // Scenario 1: Upgrade Only (room type with arrow, room number with alternatives, no key, no attributes)
    {
      id: "r1",
      roomType: "Doble Deluxe",
      originalRoomType: "Doble",
      roomNumber: "201",
      attributes: [], // NO attributes for Scenario 1
      alternatives: ["202", "203", "204"],
      price: 300,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Online",
      dateRequested: "20/01/26",
      checkIn: "28/01/26",
      checkOut: "31/01/26",
      nights: 3,
      selectionScenario: "upgrade_only",
      showUpgradeArrow: true,
      showKeyIcon: false,
      showAlternatives: true,
      showAttributes: false,
      hasKey: false
    },
    // Scenario 2: Choose Your Room Only (room type without arrow, room number with key, no attributes)
    {
      id: "r2",
      roomType: "Doble",
      originalRoomType: null, // NO upgrade for Scenario 2
      roomNumber: "105",
      attributes: [], // NO attributes for Scenario 2
      alternatives: [], // NO alternatives for Scenario 2
      price: 250,
      status: "confirmed",
      includesHotels: true,
      agent: "Lisa Chen",
      commission: 25,
      dateRequested: "21/01/26",
      checkIn: "29/01/26",
      checkOut: "01/02/26",
      nights: 3,
      selectionScenario: "choose_room_only",
      showUpgradeArrow: false,
      showKeyIcon: true,
      showAlternatives: false,
      showAttributes: false,
      hasKey: true
    },
    // Scenario 3: Choose Your Room + Upgrade (room type with arrow, room number with key, no attributes)
    {
      id: "r3",
      roomType: "Junior Suite",
      originalRoomType: "Doble",
      roomNumber: "501",
      attributes: [], // NO attributes for Scenario 3
      alternatives: [], // NO alternatives for Scenario 3
      price: 450,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 0,
      dateRequested: "20/01/26",
      checkIn: "28/01/26",
      checkOut: "31/01/26",
      nights: 3,
      selectionScenario: "choose_room_upgrade",
      showUpgradeArrow: true,
      showKeyIcon: true,
      showAlternatives: false,
      showAttributes: false,
      hasKey: true
    },
    // Scenario 4: Attribute Selection (no arrow, no key, alternatives, with attributes section)
    {
      id: "r4",
      roomType: "Doble Deluxe",
      originalRoomType: null, // NO upgrade for Scenario 4
      roomNumber: "301",
      alternatives: ["302", "303"], // WITH alternatives for Scenario 4
      attributes: ["Sea View", "King Bed", "Balcony"], // WITH attributes for Scenario 4
      price: 350,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Emma Davis",
      commission: 35,
      dateRequested: "22/01/26",
      checkIn: "30/01/26",
      checkOut: "02/02/26",
      nights: 3,
      selectionScenario: "attribute_selection",
      showUpgradeArrow: false,
      showKeyIcon: false,
      showAlternatives: true,
      showAttributes: true,
      hasKey: false
    }
  ],
  // Multiple extra services from different requests
  extras: [
    {
      id: "e1",
      name: "Airport Transfer",
      description: "One-way pickup from airport to hotel",
      price: 35,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 0,
      dateRequested: "20/01/26",
      units: 1,
      type: "transfer",
      serviceDate: "25/01/26"
    },
    {
      id: "e2",
      name: "Spa Massage Package",
      description: "90-minute relaxation massage for couple",
      price: 180,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Lisa Chen",
      commission: 18,
      dateRequested: "21/01/26",
      units: 2,
      type: "service",
      serviceDate: ["29/01/26", "30/01/26"] // Multiple service dates
    },
    {
      id: "e3",
      name: "Late Checkout",
      description: "Extended checkout until 3 PM",
      price: 25,
      status: "confirmed",
      includesHotels: true,
      agent: "Emma Davis",
      commission: 2.5,
      dateRequested: "22/01/26",
      units: 1,
      type: "service",
      serviceDate: "27/01/26"
    },
    {
      id: "e4",
      name: "Daily Housekeeping",
      description: "Premium cleaning service",
      price: 120,
      status: "confirmed",
      includesHotels: true,
      agent: "Emma Davis",
      commission: 12,
      dateRequested: "22/01/26",
      units: 4,
      type: "service",
      serviceDate: ["28/01/26", "29/01/26", "30/01/26", "31/01/26"] // Consecutive dates
    }
  ],
  // Single bidding/upgrade request (only 1 item as per business rule)
  bidding: [
    {
      id: "b1",
      pujaType: "Junior Suite Upgrade",
      originalRoomType: "Doble Deluxe",
      pujaNumber: "UPG-2024-004",
      roomNumber: "701",
      hasKey: false,
      alternatives: ["702"],
      attributes: ["VIP Upgrade", "Butler Service", "Private Terrace", "Champagne Welcome"],
      price: 300, // €100/night × 3 nights upgrade cost
      roomPrice: 750, // €250/night × 3 nights total
      status: "pending_hotel",
      includesHotels: true,
      agent: "Lisa Chen",
      commission: 30.0,
      dateRequested: "21/01/26",
      dateCreated: "21/01/26",
      dateModified: "22/01/26"
    }
  ]
}