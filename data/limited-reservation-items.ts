import { RequestedItem, RequestedItemsData } from './reservation-items'
import { generateDynamicReservationItems, getUpgradeTargetRoom } from './dynamic-reservation-items'
import { ReservationContext } from './dynamic-recommendations'

/**
 * Extract the number of reserved items from the extras string
 * Examples: "2 reservados (30€)" -> 2, "3 reserved (45€)" -> 3, "recomendación" -> 0
 */
export const extractReservedItemCount = (extrasString: string): number => {
  // Try to match "X reservados" format (Spanish)
  let match = extrasString.match(/^(\d+)\s+reservados/)
  if (match) {
    return parseInt(match[1], 10)
  }
  
  // Try to match "X reserved" format (English)
  match = extrasString.match(/^(\d+)\s+reserved/)
  if (match) {
    return parseInt(match[1], 10)
  }
  
  return 0
}

/**
 * Generate a limited set of reservation items based on the actual number requested
 */
export const generateLimitedReservationItems = (
  context: ReservationContext, 
  extrasString: string
): RequestedItemsData => {
  const requestedCount = extractReservedItemCount(extrasString)
  
  // If no items were actually requested, return empty arrays
  if (requestedCount === 0) {
    return {
      rooms: [],
      extras: [],
      bidding: []
    }
  }
  
  // Generate all possible items for this room type
  const allPossibleItems = generateDynamicReservationItems(context)
  
  // Flatten all items into a single array for selection
  const allItems = [
    ...allPossibleItems.extras.map((item: any) => ({ ...item, category: 'extras' as const })),
    ...allPossibleItems.upsell.map((item: any) => ({ ...item, category: 'upsell' as const })),
    ...allPossibleItems.atributos.map((item: any) => ({ ...item, category: 'atributos' as const }))
  ]
  
  // Select the most relevant items based on priority and room type
  const selectedItems = selectMostRelevantItems(allItems, requestedCount, context)
  
  // Distribute items across categories to match the exact count requested
  const result: RequestedItemsData = {
    rooms: [],
    extras: [],
    bidding: []
  }
  
  // For proper distribution based on count:
  // Count 1: 1 extra only
  // Count 2: 2 extras only  
  // Count 3: 1 room + 2 extras
  // Count 4: 1 room + 2 extras + 1 bidding
  // Count 5+: 1 room + (count-2) extras + 1 bidding
  
  const extrasItems = selectedItems.filter(item => item.category === 'extras')
  const upsellItems = selectedItems.filter(item => item.category === 'upsell')
  const atributosItems = selectedItems.filter(item => item.category === 'atributos')
  
  let itemsUsed = 0
  
  // For counts of 3 or more, add a room
  if (requestedCount >= 3) {
    const roomUpgrade = upsellItems.find(item => item.id === 'room-upgrade') || upsellItems[0]
    if (roomUpgrade) {
      // Determine the target room type
      let targetRoomType = context.roomType || 'Standard'
      if (roomUpgrade.id === 'room-upgrade') {
        const upgradeTarget = getUpgradeTargetRoom(targetRoomType)
        if (upgradeTarget) {
          targetRoomType = upgradeTarget
        }
      }
      
      result.rooms = [{
        id: roomUpgrade.id,
        roomType: targetRoomType,
        roomNumber: '101',
        attributes: ['Ocean View', 'Balcony'],
        price: roomUpgrade.price,
        status: roomUpgrade.status,
        includesHotels: roomUpgrade.includesHotels,
        agent: roomUpgrade.agent,
        commission: roomUpgrade.commission,
        dateRequested: new Date().toISOString().split('T')[0],
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nights: 3
      }]
      itemsUsed++
    }
  }
  
  // For counts of 4 or more, add a bidding item
  if (requestedCount >= 4 && itemsUsed < requestedCount) {
    const biddingItem = upsellItems.find(item => item.id !== 'room-upgrade') || atributosItems[0]
    if (biddingItem) {
      let targetRoomType = context.roomType ? context.roomType + ' Room' : 'Standard Room'
      
      result.bidding = [{
        id: biddingItem.id,
        pujaType: targetRoomType,
        pujaNumber: `BID-${Date.now()}-${biddingItem.id}`,
        attributes: ['Premium Location', 'High Floor'],
        price: biddingItem.price,
        status: biddingItem.status,
        includesHotels: biddingItem.includesHotels,
        agent: biddingItem.agent,
        commission: biddingItem.commission,
        dateRequested: new Date().toISOString().split('T')[0],
        dateCreated: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0]
      }]
      itemsUsed++
    }
  }
  
  // Fill the rest with extras
  const remainingCount = requestedCount - itemsUsed
  const extrasToAdd = extrasItems.slice(0, remainingCount)
  
  result.extras = extrasToAdd.map(item => {
    const { category, ...rest } = item
    return {
      ...rest,
      name: rest.name || 'Unknown Extra',
      nameKey: rest.nameKey,
      description: rest.description || '',
      descriptionKey: rest.descriptionKey,
      units: 1,
      type: 'service' as const,
      serviceDate: new Date().toISOString().split('T')[0],
      dateRequested: new Date().toISOString().split('T')[0]
    }
  })
  
  return result
}

/**
 * Select the most relevant items for the guest based on their profile
 */
const selectMostRelevantItems = (
  allItems: (RequestedItem & { category: 'extras' | 'upsell' | 'atributos' })[],
  count: number,
  context: ReservationContext
) => {
  // Priority scoring based on guest profile and room type
  const scoredItems = allItems.map(item => ({
    ...item,
    score: calculateRelevanceScore(item, context)
  }))
  
  // Sort by score (highest first) and take the requested count
  return scoredItems
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
}

/**
 * Calculate relevance score for each item based on guest profile
 */
const calculateRelevanceScore = (
  item: RequestedItem & { category: 'extras' | 'upsell' | 'atributos' },
  context: ReservationContext
): number => {
  let score = 0
  
  // Base score by category (extras are most common)
  if (item.category === 'extras') score += 10
  if (item.category === 'atributos') score += 8
  if (item.category === 'upsell') score += 6
  
  // Bonus for family-friendly items
  if (context.hasChildren) {
    if (item.id.includes('baby') || item.id.includes('connecting')) score += 5
  }
  
  // Bonus for business travelers
  if (context.isBusinessGuest) {
    if (item.id.includes('business') || item.id.includes('executive') || item.id.includes('airport')) score += 5
  }
  
  // Bonus for couples
  if (context.isCouple) {
    if (item.id.includes('romantic') || item.id.includes('quiet')) score += 5
  }
  
  // Bonus for higher room categories (they tend to request more premium services)
  const roomLevel = getRoomLevel(context.roomType)
  if (roomLevel >= 4 && item.id.includes('premium')) score += 3
  if (roomLevel >= 3 && item.id.includes('spa')) score += 2
  
  // Popular items get slight bonus
  if (item.id.includes('early-checkin') || item.id.includes('late-checkout')) score += 2
  
  // Confirmed items are more likely to be requested
  if (item.status === 'confirmed') score += 1
  
  return score
}

const getRoomLevel = (roomType: string): number => {
  switch (roomType) {
    case 'Standard': return 1
    case 'Superior': return 2
    case 'Deluxe': return 3
    case 'Suite': return 4
    case 'Presidential Suite': return 5
    default: return 1
  }
}