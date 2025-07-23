import { RequestedItem, RequestedItemsData } from './reservation-items'
import { generateDynamicReservationItems } from './dynamic-reservation-items'
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
      extras: [],
      upsell: [],
      atributos: []
    }
  }
  
  // Generate all possible items for this room type
  const allPossibleItems = generateDynamicReservationItems(context)
  
  // Flatten all items into a single array for selection
  const allItems = [
    ...allPossibleItems.extras.map(item => ({ ...item, category: 'extras' as const })),
    ...allPossibleItems.upsell.map(item => ({ ...item, category: 'upsell' as const })),
    ...allPossibleItems.atributos.map(item => ({ ...item, category: 'atributos' as const }))
  ]
  
  // Select the most relevant items based on priority and room type
  const selectedItems = selectMostRelevantItems(allItems, requestedCount, context)
  
  // Group back into categories
  const result: RequestedItemsData = {
    extras: selectedItems.filter(item => item.category === 'extras').map(item => {
      const { category, ...rest } = item
      return rest
    }),
    upsell: selectedItems.filter(item => item.category === 'upsell').map(item => {
      const { category, ...rest } = item
      return rest
    }),
    atributos: selectedItems.filter(item => item.category === 'atributos').map(item => {
      const { category, ...rest } = item
      return rest
    })
  }
  
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