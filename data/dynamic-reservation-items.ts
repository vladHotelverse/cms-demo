import { RequestedItem, RequestedItemsData } from './reservation-items'
import { RoomType, getRoomTypeConfig } from './room-type-config'
import { ReservationContext } from './dynamic-recommendations'

export const generateDynamicReservationItems = (context: ReservationContext): RequestedItemsData => {
  const { roomType, nights, hasChildren, isBusinessGuest, isCouple } = context
  const roomConfig = getRoomTypeConfig(roomType)
  
  const items: RequestedItemsData = {
    extras: generateExtrasForRoom(context),
    upsell: generateUpsellForRoom(context),
    atributos: generateAttributesForRoom(context)
  }
  
  return items
}

const generateExtrasForRoom = (context: ReservationContext): RequestedItem[] => {
  const { roomType, hasChildren, isBusinessGuest } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const extras: RequestedItem[] = []

  // Early Check-in (available for all room types, price varies)
  const earlyCheckinPrice = roomConfig.level <= 2 ? 25 : 35
  extras.push({
    id: "early-checkin",
    nameKey: "extraEarlyCheckinName",
    descriptionKey: "extraEarlyCheckinDescription",
    price: earlyCheckinPrice,
    status: Math.random() > 0.5 ? "pending_hotel" : "confirmed",
    includesHotels: true
  })

  // Late Checkout (available for all, price varies)
  const lateCheckoutPrice = roomConfig.level <= 2 ? 30 : 40
  extras.push({
    id: "late-checkout",
    nameKey: "extraLateCheckoutName", 
    descriptionKey: "extraLateCheckoutDescription",
    price: lateCheckoutPrice,
    status: Math.random() > 0.5 ? "pending_hotel" : "confirmed",
    includesHotels: true
  })

  // Baby crib (only if has children)
  if (hasChildren) {
    extras.push({
      id: "baby-crib",
      nameKey: "extraBabyCribName",
      descriptionKey: "extraBabyCribDescription", 
      price: 15,
      status: "pending_hotel",
      includesHotels: true
    })
  }

  // Airport transfer (for higher room categories)
  if (roomConfig.level >= 3) {
    extras.push({
      id: "airport-transfer",
      nameKey: "extraAirportTransferName",
      descriptionKey: "extraAirportTransferDescription",
      price: 65,
      status: "pending_hotel",
      includesHotels: false
    })
  }

  // Business center access (for business guests)
  if (isBusinessGuest) {
    extras.push({
      id: "business-center",
      nameKey: "extraBusinessCenterName",
      descriptionKey: "extraBusinessCenterDescription",
      price: 25,
      status: "confirmed", 
      includesHotels: true
    })
  }

  return extras
}

const generateUpsellForRoom = (context: ReservationContext): RequestedItem[] => {
  const { roomType, isCouple, isBusinessGuest } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const upsells: RequestedItem[] = []

  // Room upgrade (always available, price based on next level)
  const upgradePrice = getUpgradePriceForRoom(roomType)
  if (upgradePrice > 0) {
    upsells.push({
      id: "room-upgrade",
      nameKey: "upsellRoomUpgradeName",
      descriptionKey: "upsellRoomUpgradeDescription",
      price: upgradePrice,
      status: Math.random() > 0.5 ? "pending_hotel" : "confirmed",
      includesHotels: true
    })
  }

  // Romantic package (for couples)
  if (isCouple) {
    upsells.push({
      id: "romantic-package",
      nameKey: "upsellRomanticPackageName",
      descriptionKey: "upsellRomanticPackageDescription", 
      price: 95,
      status: "pending_hotel",
      includesHotels: false
    })
  }

  // Executive lounge access (for business guests in higher categories)
  if (isBusinessGuest && roomConfig.level >= 4) {
    upsells.push({
      id: "executive-lounge",
      nameKey: "upsellExecutiveLoungeName",
      descriptionKey: "upsellExecutiveLoungeDescription",
      price: 125,
      status: "confirmed",
      includesHotels: true
    })
  }

  // Premium dining package (for higher room categories)
  if (roomConfig.level >= 3) {
    upsells.push({
      id: "premium-dining",
      nameKey: "upsellPremiumDiningName", 
      descriptionKey: "upsellPremiumDiningDescription",
      price: 180,
      status: "pending_hotel",
      includesHotels: false
    })
  }

  return upsells
}

const generateAttributesForRoom = (context: ReservationContext): RequestedItem[] => {
  const { roomType } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const attributes: RequestedItem[] = []

  // Quiet room (available for all)
  attributes.push({
    id: "quiet-room",
    nameKey: "attributeQuietRoomName",
    descriptionKey: "attributeQuietRoomDescription",
    price: 0,
    status: "confirmed",
    includesHotels: true
  })

  // Upper floor (for Standard and Superior)
  if (roomConfig.level <= 2) {
    attributes.push({
      id: "upper-floor",
      nameKey: "attributeUpperFloorName", 
      descriptionKey: "attributeUpperFloorDescription",
      price: 45,
      status: "pending_hotel",
      includesHotels: true
    })
  }

  // Near spa (for all room types, price varies)
  const nearSpaPrice = roomConfig.level >= 4 ? 25 : 35
  attributes.push({
    id: "near-spa",
    nameKey: "attributeNearSpaName",
    descriptionKey: "attributeNearSpaDescription", 
    price: nearSpaPrice,
    status: "pending_hotel",
    includesHotels: true
  })

  // Ocean view (for Standard and Superior, already included in higher categories)
  if (roomConfig.level <= 2) {
    attributes.push({
      id: "ocean-view",
      nameKey: "attributeOceanViewName",
      descriptionKey: "attributeOceanViewDescription",
      price: 85,
      status: "confirmed",
      includesHotels: true
    })
  }

  // Connecting rooms (for families or business groups)
  if (context.hasChildren || context.isBusinessGuest) {
    attributes.push({
      id: "connecting-rooms",
      nameKey: "attributeConnectingRoomsName",
      descriptionKey: "attributeConnectingRoomsDescription",
      price: 25,
      status: "pending_hotel", 
      includesHotels: true
    })
  }

  return attributes
}

const getUpgradePriceForRoom = (roomType: RoomType): number => {
  switch (roomType) {
    case 'Standard': return 355 // to Superior
    case 'Superior': return 285 // to Deluxe  
    case 'Deluxe': return 245 // to Suite
    case 'Suite': return 455 // to Presidential
    case 'Presidential Suite': return 0 // No upgrade available
    default: return 0
  }
}

// The RequestedItem interface has been updated to support translation keys