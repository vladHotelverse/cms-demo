import { RequestedItem, RequestedItemsData } from './reservation-items'
import { RoomType, getRoomTypeConfig } from './room-type-config'
import { ReservationContext } from './dynamic-recommendations'

// Available agents for random assignment
const AGENTS = ['María García', 'Carlos López', 'Ana Rodríguez', 'Online']

// Helper function to get consistent agent data for all items in a reservation
const getConsistentAgentData = (basePrice: number, selectedAgent: string) => {
  return {
    agent: selectedAgent,
    commission: selectedAgent === 'Online' ? 0 : basePrice * 0.1
  }
}

export const generateDynamicReservationItems = (context: ReservationContext) => {
  const { roomType, nights, hasChildren, isBusinessGuest, isCouple } = context
  const roomConfig = getRoomTypeConfig(roomType)
  
  // Select ONE agent for ALL items in this reservation
  const selectedAgent = AGENTS[Math.floor(Math.random() * AGENTS.length)]
  
  const items = {
    extras: generateExtrasForRoom(context, selectedAgent),
    upsell: generateUpsellForRoom(context, selectedAgent),
    atributos: generateAttributesForRoom(context, selectedAgent)
  }
  
  return items
}

const generateExtrasForRoom = (context: ReservationContext, selectedAgent: string): RequestedItem[] => {
  const { roomType, hasChildren, isBusinessGuest } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const extras: RequestedItem[] = []

  // Early Check-in (available for all room types, price varies)
  const earlyCheckinPrice = roomConfig.level <= 2 ? 25 : 35
  const earlyCheckinAgent = getConsistentAgentData(earlyCheckinPrice, selectedAgent)
  extras.push({
    id: "early-checkin",
    nameKey: "extraEarlyCheckinName",
    descriptionKey: "extraEarlyCheckinDescription",
    price: earlyCheckinPrice,
    status: Math.random() > 0.5 ? "pending_hotel" : "confirmed",
    includesHotels: true,
    agent: earlyCheckinAgent.agent,
    commission: earlyCheckinAgent.commission
  })

  // Late Checkout (available for all, price varies)
  const lateCheckoutPrice = roomConfig.level <= 2 ? 30 : 40
  const lateCheckoutAgent = getConsistentAgentData(lateCheckoutPrice, selectedAgent)
  extras.push({
    id: "late-checkout",
    nameKey: "extraLateCheckoutName", 
    descriptionKey: "extraLateCheckoutDescription",
    price: lateCheckoutPrice,
    status: Math.random() > 0.5 ? "pending_hotel" : "confirmed",
    includesHotels: true,
    agent: lateCheckoutAgent.agent,
    commission: lateCheckoutAgent.commission
  })

  // Baby crib (only if has children)
  if (hasChildren) {
    const babyCribAgent = getConsistentAgentData(15, selectedAgent)
    extras.push({
      id: "baby-crib",
      nameKey: "extraBabyCribName",
      descriptionKey: "extraBabyCribDescription", 
      price: 15,
      status: "pending_hotel",
      includesHotels: true,
      agent: babyCribAgent.agent,
      commission: babyCribAgent.commission
    })
  }

  // Airport transfer (for higher room categories)
  if (roomConfig.level >= 3) {
    const airportTransferAgent = getConsistentAgentData(65, selectedAgent)
    extras.push({
      id: "airport-transfer",
      nameKey: "extraAirportTransferName",
      descriptionKey: "extraAirportTransferDescription",
      price: 65,
      status: "pending_hotel",
      includesHotels: false,
      agent: airportTransferAgent.agent,
      commission: airportTransferAgent.commission
    })
  }

  // Business center access (for business guests)
  if (isBusinessGuest) {
    const businessCenterAgent = getConsistentAgentData(25, selectedAgent)
    extras.push({
      id: "business-center",
      nameKey: "extraBusinessCenterName",
      descriptionKey: "extraBusinessCenterDescription",
      price: 25,
      status: "confirmed", 
      includesHotels: true,
      agent: businessCenterAgent.agent,
      commission: businessCenterAgent.commission
    })
  }

  return extras
}

const generateUpsellForRoom = (context: ReservationContext, selectedAgent: string): RequestedItem[] => {
  const { roomType, isCouple, isBusinessGuest } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const upsells: RequestedItem[] = []

  // Room upgrade (always available, price based on next level)
  const upgradePrice = getUpgradePriceForRoom(roomType)
  if (upgradePrice > 0) {
    const roomUpgradeAgent = getConsistentAgentData(upgradePrice, selectedAgent)
    upsells.push({
      id: "room-upgrade",
      nameKey: "upsellRoomUpgradeName",
      descriptionKey: "upsellRoomUpgradeDescription",
      price: upgradePrice,
      status: Math.random() > 0.5 ? "pending_hotel" : "confirmed",
      includesHotels: true,
      agent: roomUpgradeAgent.agent,
      commission: roomUpgradeAgent.commission
    })
  }

  // Romantic package (for couples)
  if (isCouple) {
    const romanticPackageAgent = getConsistentAgentData(95, selectedAgent)
    upsells.push({
      id: "romantic-package",
      nameKey: "upsellRomanticPackageName",
      descriptionKey: "upsellRomanticPackageDescription", 
      price: 95,
      status: "pending_hotel",
      includesHotels: false,
      agent: romanticPackageAgent.agent,
      commission: romanticPackageAgent.commission
    })
  }

  // Executive lounge access (for business guests in higher categories)
  if (isBusinessGuest && roomConfig.level >= 4) {
    const executiveLoungeAgent = getConsistentAgentData(125, selectedAgent)
    upsells.push({
      id: "executive-lounge",
      nameKey: "upsellExecutiveLoungeName",
      descriptionKey: "upsellExecutiveLoungeDescription",
      price: 125,
      status: "confirmed",
      includesHotels: true,
      agent: executiveLoungeAgent.agent,
      commission: executiveLoungeAgent.commission
    })
  }

  // Premium dining package (for higher room categories)
  if (roomConfig.level >= 3) {
    const premiumDiningAgent = getConsistentAgentData(180, selectedAgent)
    upsells.push({
      id: "premium-dining",
      nameKey: "upsellPremiumDiningName", 
      descriptionKey: "upsellPremiumDiningDescription",
      price: 180,
      status: "pending_hotel",
      includesHotels: false,
      agent: premiumDiningAgent.agent,
      commission: premiumDiningAgent.commission
    })
  }

  return upsells
}

const generateAttributesForRoom = (context: ReservationContext, selectedAgent: string): RequestedItem[] => {
  const { roomType } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const attributes: RequestedItem[] = []

  // Quiet room (available for all)
  const quietRoomAgent = getConsistentAgentData(0, selectedAgent)
  attributes.push({
    id: "quiet-room",
    nameKey: "attributeQuietRoomName",
    descriptionKey: "attributeQuietRoomDescription",
    price: 0,
    status: "confirmed",
    includesHotels: true,
    agent: quietRoomAgent.agent,
    commission: quietRoomAgent.commission
  })

  // Upper floor (for Standard and Superior)
  if (roomConfig.level <= 2) {
    const upperFloorAgent = getConsistentAgentData(45, selectedAgent)
    attributes.push({
      id: "upper-floor",
      nameKey: "attributeUpperFloorName", 
      descriptionKey: "attributeUpperFloorDescription",
      price: 45,
      status: "pending_hotel",
      includesHotels: true,
      agent: upperFloorAgent.agent,
      commission: upperFloorAgent.commission
    })
  }

  // Near spa (for all room types, price varies)
  const nearSpaPrice = roomConfig.level >= 4 ? 25 : 35
  const nearSpaAgent = getConsistentAgentData(nearSpaPrice, selectedAgent)
  attributes.push({
    id: "near-spa",
    nameKey: "attributeNearSpaName",
    descriptionKey: "attributeNearSpaDescription", 
    price: nearSpaPrice,
    status: "pending_hotel",
    includesHotels: true,
    agent: nearSpaAgent.agent,
    commission: nearSpaAgent.commission
  })

  // Ocean view (for Standard and Superior, already included in higher categories)
  if (roomConfig.level <= 2) {
    const oceanViewAgent = getConsistentAgentData(85, selectedAgent)
    attributes.push({
      id: "ocean-view",
      nameKey: "attributeOceanViewName",
      descriptionKey: "attributeOceanViewDescription",
      price: 85,
      status: "confirmed",
      includesHotels: true,
      agent: oceanViewAgent.agent,
      commission: oceanViewAgent.commission
    })
  }

  // Connecting rooms (for families or business groups)
  if (context.hasChildren || context.isBusinessGuest) {
    const connectingRoomsAgent = getConsistentAgentData(25, selectedAgent)
    attributes.push({
      id: "connecting-rooms",
      nameKey: "attributeConnectingRoomsName",
      descriptionKey: "attributeConnectingRoomsDescription",
      price: 25,
      status: "pending_hotel", 
      includesHotels: true,
      agent: connectingRoomsAgent.agent,
      commission: connectingRoomsAgent.commission
    })
  }

  return attributes
}

const getUpgradePriceForRoom = (roomType: RoomType): number => {
  switch (roomType) {
    case 'Doble': return 355 // to Doble Deluxe
    case 'Doble Deluxe': return 285 // to Junior Suite  
    case 'Junior Suite': return 0 // No upgrade available
    default: return 0
  }
}

export const getUpgradeTargetRoom = (currentRoomType: RoomType): RoomType | null => {
  switch (currentRoomType) {
    case 'Doble': return 'Doble Deluxe'
    case 'Doble Deluxe': return 'Junior Suite'
    case 'Junior Suite': return null // No upgrade available
    default: return null
  }
}

// The RequestedItem interface has been updated to support translation keys