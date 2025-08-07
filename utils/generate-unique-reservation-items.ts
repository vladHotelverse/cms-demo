import { RequestedItemsData, RoomItem, ExtraItem, BiddingItem, AllowedRoomType, RoomSelectionScenario, determineRoomScenario } from '@/data/reservation-items'
import { RoomType } from '@/data/room-type-config'

// Seeded random number generator for consistent results
class SeededRandom {
  private seed: number

  constructor(seed: string) {
    // Convert string to number hash
    this.seed = this.hashString(seed)
  }

  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000
    return x - Math.floor(x)
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }

  nextFromArray<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }
}

// Room attributes by room type
const ROOM_ATTRIBUTES: Record<string, string[]> = {
  'Doble': ['City View', 'Garden View', 'Quiet Location', 'Near Elevator', 'King Bed'],
  'Doble Deluxe': ['Partial Ocean View', 'Mountain View', 'Balcony', 'Corner Room', 'High Floor', 'King Bed'],
  'Junior Suite': ['Ocean View', 'Balcony', 'Jacuzzi', 'Mini Bar', 'Living Room', 'King Bed', 'Work Area']
}

// Extra services categorized by type
const EXTRA_SERVICES = {
  transfers: [
    { name: 'Airport Transfer', description: 'Round-trip airport transportation', basePrice: 65, type: 'transfer' as const },
    { name: 'Private Car Service', description: 'Daily private car with driver', basePrice: 120, type: 'transfer' as const },
    { name: 'Helicopter Transfer', description: 'VIP helicopter airport transfer', basePrice: 450, type: 'transfer' as const }
  ],
  dining: [
    { name: 'Welcome Dinner', description: 'Complimentary dinner on arrival', basePrice: 85, type: 'service' as const },
    { name: 'Room Service Credit', description: 'Daily room service allowance', basePrice: 50, type: 'service' as const },
    { name: 'Wine Tasting Experience', description: 'Private sommelier wine tasting', basePrice: 120, type: 'service' as const },
    { name: 'Chef\'s Table Experience', description: 'Exclusive chef\'s table dinner', basePrice: 200, type: 'service' as const }
  ],
  wellness: [
    { name: 'Spa Package', description: 'Full spa treatment package', basePrice: 180, type: 'service' as const },
    { name: 'Couples Massage', description: '90-minute couples relaxation massage', basePrice: 220, type: 'service' as const },
    { name: 'Wellness Consultation', description: 'Personal wellness coach session', basePrice: 95, type: 'service' as const },
    { name: 'Yoga Sessions', description: 'Private yoga instructor sessions', basePrice: 75, type: 'service' as const }
  ],
  amenities: [
    { name: 'Early Check-in', description: 'Guaranteed early arrival from 10 AM', basePrice: 35, type: 'amenity' as const },
    { name: 'Late Checkout', description: 'Extended checkout until 4 PM', basePrice: 45, type: 'amenity' as const },
    { name: 'Premium WiFi', description: 'High-speed dedicated internet', basePrice: 25, type: 'amenity' as const },
    { name: 'Minibar Package', description: 'Complimentary minibar items', basePrice: 65, type: 'amenity' as const },
    { name: 'Beach Setup', description: 'Reserved beach chairs and umbrella', basePrice: 40, type: 'amenity' as const }
  ],
  experiences: [
    { name: 'Sunset Cruise', description: 'Private sunset boat cruise', basePrice: 150, type: 'service' as const },
    { name: 'Scuba Diving', description: 'Guided scuba diving experience', basePrice: 180, type: 'service' as const },
    { name: 'City Tour', description: 'Private guided city tour', basePrice: 95, type: 'service' as const },
    { name: 'Cooking Class', description: 'Local cuisine cooking workshop', basePrice: 110, type: 'service' as const }
  ]
}

// Agents pool
const AGENTS = ['Maria Thompson', 'Carlos Rodriguez', 'Emma Chen', 'James Wilson', 'Online']

// Service categories for logical date generation
const SERVICE_CATEGORIES = {
  // Always single date regardless of units (one-time services)
  SINGLE_DATE: [
    'Airport Transfer', 'Private Car Service', 'Helicopter Transfer',
    'Early Check-in', 'Late Checkout',
    'Welcome Dinner', 'Chef\'s Table Experience',
    'Sunset Cruise', 'Scuba Diving', 'City Tour', 'Cooking Class'
  ],
  // One date per night of stay (duration-based services)  
  PER_NIGHT: [
    'Premium WiFi', 'Beach Setup', 'Minibar Package'
  ],
  // One date per unit, spread across stay (daily recurring services)
  PER_UNIT_DAILY: [
    'Room Service Credit', // Daily room service allowance
    'Yoga Sessions' // Multiple sessions on different days
  ],
  // Single date per package, regardless of units (comprehensive packages)
  PACKAGE_SINGLE: [
    'Spa Package', 'Couples Massage', 'Wellness Consultation',
    'Wine Tasting Experience'
  ]
}

// Room upgrade paths
const ROOM_UPGRADES: Record<string, { target: string; attributes: string[] }> = {
  'Doble': { 
    target: 'Doble Deluxe', 
    attributes: ['Upgraded Room', 'Better View', 'More Space', 'Enhanced Amenities'] 
  },
  'Doble Deluxe': { 
    target: 'Junior Suite', 
    attributes: ['Suite Upgrade', 'Separate Living Area', 'Executive Benefits', 'VIP Treatment'] 
  }
}

export interface GenerateUniqueReservationItemsInput {
  id: string
  locator: string
  name: string
  email: string
  checkIn: string
  nights: string
  roomType: string
  aci: string
  status: string
  extras: string
  hasHotelverseRequest: boolean
}

/**
 * Generate unique reservation items based on reservation properties
 * Uses consistent hashing to ensure the same reservation always gets the same items
 */
export function generateUniqueReservationItems(reservation: GenerateUniqueReservationItemsInput): RequestedItemsData {
  // Create seeded random generator based on reservation ID for consistency
  const rng = new SeededRandom(reservation.id)
  
  // Extract count from extras (e.g., "5 reserved items" -> 5)
  const countMatch = reservation.extras.match(/^(\d+)\s+(reserved|reservados)/)
  const rawCount = countMatch ? parseInt(countMatch[1], 10) : 0
  
  if (rawCount === 0) {
    return { rooms: [], extras: [], bidding: [] }
  }
  
  // Enforce maximum limit of 5 items
  const requestedCount = Math.min(rawCount, 5)

  // Parse nights and dates
  const nights = parseInt(reservation.nights) || 1
  const checkInDate = parseDate(reservation.checkIn)
  const checkOutDate = new Date(checkInDate)
  checkOutDate.setDate(checkOutDate.getDate() + nights)

  // Determine guest profile based on reservation data
  const guestProfile = analyzeGuestProfile(reservation, rng)
  
  // Generate items based on count and profile
  const items = generateItemsForCount(
    requestedCount,
    reservation,
    guestProfile,
    rng,
    checkInDate,
    checkOutDate
  )
  
  return items
}

function parseDate(dateStr: string): Date {
  // Handle DD/MM/YYYY format
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
  }
  return new Date(dateStr)
}

interface GuestProfile {
  isVIP: boolean
  isBusinessGuest: boolean
  isLeisureGuest: boolean
  prefersLuxury: boolean
  stayLength: 'short' | 'medium' | 'long'
  season: 'summer' | 'winter' | 'spring' | 'fall'
}

function analyzeGuestProfile(reservation: GenerateUniqueReservationItemsInput, rng: SeededRandom): GuestProfile {
  const nights = parseInt(reservation.nights) || 1
  const roomLevel = getRoomLevel(reservation.roomType)
  const checkInDate = parseDate(reservation.checkIn)
  const month = checkInDate.getMonth()
  
  // Determine season
  let season: 'summer' | 'winter' | 'spring' | 'fall'
  if (month >= 2 && month <= 4) season = 'spring'
  else if (month >= 5 && month <= 7) season = 'summer'
  else if (month >= 8 && month <= 10) season = 'fall'
  else season = 'winter'
  
  // Use guest name hash to influence profile
  const nameHash = reservation.name.length + reservation.name.charCodeAt(0)
  
  return {
    isVIP: roomLevel >= 4 || reservation.hasHotelverseRequest,
    isBusinessGuest: reservation.aci === 'Business' || (nameHash % 3 === 0 && nights <= 3),
    isLeisureGuest: reservation.aci === 'Leisure' || nights > 3,
    prefersLuxury: roomLevel >= 3 || rng.next() > 0.5,
    stayLength: nights <= 2 ? 'short' : nights <= 5 ? 'medium' : 'long',
    season
  }
}

function getRoomLevel(roomType: string): number {
  const levels: Record<string, number> = {
    'Doble': 1,
    'Doble Deluxe': 2,
    'Junior Suite': 3
  }
  return levels[roomType] || 1
}

function generateItemsForCount(
  count: number,
  reservation: GenerateUniqueReservationItemsInput,
  profile: GuestProfile,
  rng: SeededRandom,
  checkInDate: Date,
  checkOutDate: Date
): RequestedItemsData {
  const result: RequestedItemsData = { rooms: [], extras: [], bidding: [] }
  const nights = parseInt(reservation.nights) || 1
  
  // Distribution logic based on count
  let roomCount = 0
  let biddingCount = 0
  let extrasCount = count
  
  if (count >= 3) {
    roomCount = 1
    extrasCount = count - 1
  }
  
  if (count >= 4) {
    biddingCount = 1
    extrasCount = count - 2
  }
  
  // Select one agent for the entire reservation (all items use the same agent)
  const reservationAgent = rng.nextFromArray(AGENTS)
  
  // Generate room items
  if (roomCount > 0) {
    result.rooms.push(generateRoomItem(reservation, profile, rng, checkInDate, checkOutDate, reservationAgent))
  }
  
  // Generate bidding items
  if (biddingCount > 0) {
    result.bidding.push(generateBiddingItem(reservation, profile, rng, reservationAgent, checkInDate, checkOutDate))
  }
  
  // Generate extra items
  result.extras = generateExtraItems(extrasCount, reservation, profile, rng, nights, reservationAgent, checkInDate, checkOutDate)
  
  return result
}

function generateRoomItem(
  reservation: GenerateUniqueReservationItemsInput,
  profile: GuestProfile,
  rng: SeededRandom,
  checkInDate: Date,
  checkOutDate: Date,
  agent: string
): RoomItem {
  const roomType = reservation.roomType as RoomType
  const upgrade = ROOM_UPGRADES[roomType]
  const targetRoomType = upgrade ? upgrade.target : roomType
  const nights = parseInt(reservation.nights) || 1
  
  // Generate room number based on room type and random
  const floorBase = getRoomLevel(targetRoomType) + 2 // Higher categories on higher floors
  const roomNumber = `${floorBase}${rng.nextInt(10, 99)}`
  
  // First determine the scenario we want (before generating attributes)
  const scenarioChoice = rng.nextInt(1, 4) // 1-4 for each scenario
  let hasKey = false
  let attributes: string[] = []
  let alternatives: string[] = []
  let showUpgradeArrow = false
  let showKeyIcon = false
  let showAlternatives = false
  let showAttributes = false
  let selectionScenario: RoomSelectionScenario
  
  // Generate data based on chosen scenario
  switch (scenarioChoice) {
    case 1: // Scenario 1: Upgrade Only
      hasKey = false
      attributes = []
      alternatives = [`${floorBase}${rng.nextInt(10, 99)}`, `${floorBase}${rng.nextInt(10, 99)}`]
      showUpgradeArrow = !!upgrade
      showKeyIcon = false
      showAlternatives = true
      showAttributes = false
      selectionScenario = 'upgrade_only'
      break
      
    case 2: // Scenario 2: Choose Your Room Only
      hasKey = true
      attributes = []
      alternatives = []
      showUpgradeArrow = false
      showKeyIcon = true
      showAlternatives = false
      showAttributes = false
      selectionScenario = 'choose_room_only'
      // Remove upgrade for this scenario
      break
      
    case 3: // Scenario 3: Choose Your Room + Upgrade
      hasKey = true
      attributes = []
      alternatives = []
      showUpgradeArrow = !!upgrade
      showKeyIcon = true
      showAlternatives = false
      showAttributes = false
      selectionScenario = 'choose_room_upgrade'
      break
      
    case 4: // Scenario 4: Attribute Selection
    default:
      hasKey = false
      // Generate attributes only for Scenario 4
      const availableAttributes = ROOM_ATTRIBUTES[targetRoomType] || ROOM_ATTRIBUTES.Doble
      const attributeCount = Math.min(rng.nextInt(3, 5), availableAttributes.length)
      const attributesCopy = [...availableAttributes]
      for (let i = 0; i < attributeCount; i++) {
        const idx = rng.nextInt(0, attributesCopy.length - 1)
        attributes.push(attributesCopy[idx])
        attributesCopy.splice(idx, 1)
      }
      alternatives = [`${floorBase}${rng.nextInt(10, 99)}`, `${floorBase}${rng.nextInt(10, 99)}`]
      showUpgradeArrow = false
      showKeyIcon = false
      showAlternatives = true
      showAttributes = true
      selectionScenario = 'attribute_selection'
      break
  }
  
  // Calculate price (base room price + nights)
  const basePrice = getRoomBasePrice(targetRoomType)
  const totalPrice = basePrice * nights
  
  // Calculate commission based on agent
  const commission = agent === 'Online' ? 0 : totalPrice * 0.10
  
  // Helper function to format date as DD/MM/YY (force 2026)
  const formatCompactDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = '26' // Force 2026 for all mock data
    return `${day}/${month}/${year}`
  }
  
  // For Scenario 2, remove upgrade info to avoid conflicts
  const finalTargetRoomType = (selectionScenario === 'choose_room_only') ? roomType : targetRoomType
  const finalOriginalRoomType = (selectionScenario === 'choose_room_only') ? null : (upgrade ? roomType : null)
  
  return {
    id: `room-${reservation.id}-${rng.nextInt(1000, 9999)}`,
    roomType: finalTargetRoomType as AllowedRoomType,
    originalRoomType: finalOriginalRoomType as AllowedRoomType | null,
    roomNumber,
    attributes,
    hasKey,
    alternatives,
    price: totalPrice,
    status: rng.next() > 0.3 ? 'confirmed' : 'pending_hotel',
    includesHotels: true,
    agent,
    commission,
    dateRequested: formatCompactDate(new Date(checkInDate.getTime() - rng.nextInt(1, 14) * 24 * 60 * 60 * 1000)),
    checkIn: formatCompactDate(checkInDate),
    checkOut: formatCompactDate(checkOutDate),
    nights,
    selectionScenario,
    showUpgradeArrow,
    showKeyIcon,
    showAlternatives,
    showAttributes
  }
}

function generateBiddingItem(
  reservation: GenerateUniqueReservationItemsInput,
  profile: GuestProfile,
  rng: SeededRandom,
  agent: string,
  checkInDate: Date,
  checkOutDate: Date
): BiddingItem {
  const roomType = reservation.roomType
  const upgrade = ROOM_UPGRADES[roomType]
  const targetRoomType = upgrade ? upgrade.target : 'Junior Suite'
  
  // Generate bidding details
  const floorBase = getRoomLevel(targetRoomType) + 3
  const roomNumber = `${floorBase}${rng.nextInt(10, 99)}`
  const biddingNumber = `BID-${new Date().getFullYear()}-${rng.nextInt(10000, 99999)}`
  
  // Select premium attributes for bidding
  const premiumAttributes = [
    'VIP Upgrade',
    'Priority Access',
    'Exclusive Benefits',
    'Complimentary Services',
    ...rng.nextFromArray([
      ['Butler Service', 'Private Concierge'],
      ['Premium Location', 'Corner Suite'],
      ['Club Access', 'Executive Lounge']
    ])
  ]
  
  // Calculate prices
  const nights = parseInt(reservation.nights) || 1
  const upgradePrice = getUpgradePrice(roomType, targetRoomType) * nights
  const roomPrice = getRoomBasePrice(targetRoomType) * nights
  
  // Calculate commission
  const commission = upgradePrice * 0.10
  
  // Helper function to format date as DD/MM/YY (force 2026)
  const formatCompactDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = '26' // Force 2026 for all mock data
    return `${day}/${month}/${year}`
  }
  
  // Generate bidding dates BEFORE check-in date
  const daysBeforeCheckIn = rng.nextInt(1, 7)
  const createdDate = new Date(checkInDate.getTime() - daysBeforeCheckIn * 24 * 60 * 60 * 1000)
  const modifiedDate = new Date(createdDate.getTime() + rng.nextInt(1, 24) * 60 * 60 * 1000)
  
  return {
    id: `bid-${reservation.id}-${rng.nextInt(1000, 9999)}`,
    pujaType: `${targetRoomType} Upgrade`,
    originalRoomType: roomType as AllowedRoomType,
    pujaNumber: biddingNumber,
    roomNumber,
    hasKey: false,
    alternatives: [`${floorBase}${rng.nextInt(10, 99)}`, `${floorBase}${rng.nextInt(10, 99)}`],
    attributes: premiumAttributes.slice(0, rng.nextInt(3, 5)),
    price: upgradePrice,
    roomPrice,
    status: 'pending_hotel', // Bidding items usually pending
    includesHotels: true,
    agent,
    commission,
    dateRequested: formatCompactDate(createdDate),
    dateCreated: formatCompactDate(createdDate),
    dateModified: formatCompactDate(modifiedDate),
    checkIn: formatCompactDate(checkInDate),
    checkOut: formatCompactDate(checkOutDate)
  }
}

// Helper function to determine service category
function getServiceCategory(serviceName: string): keyof typeof SERVICE_CATEGORIES | null {
  for (const [category, services] of Object.entries(SERVICE_CATEGORIES)) {
    if (services.includes(serviceName)) {
      return category as keyof typeof SERVICE_CATEGORIES
    }
  }
  return null
}

function generateExtraItems(
  count: number,
  reservation: GenerateUniqueReservationItemsInput,
  profile: GuestProfile,
  rng: SeededRandom,
  nights: number,
  agent: string,
  checkInDate: Date,
  checkOutDate: Date
): ExtraItem[] {
  const extras: ExtraItem[] = []
  
  // Create pool of suitable extras based on profile
  const extraPool: Array<{ name: string; description: string; basePrice: number; type: 'service' | 'amenity' | 'transfer' }> = []
  
  // Add transfers (higher priority for longer stays and VIPs)
  if (profile.stayLength !== 'short' || profile.isVIP) {
    extraPool.push(...EXTRA_SERVICES.transfers.slice(0, profile.isVIP ? 3 : 2))
  }
  
  // Add dining options (seasonal and profile-based)
  if (profile.season === 'summer') {
    extraPool.push(...EXTRA_SERVICES.dining.filter(d => d.basePrice <= 150))
  } else {
    extraPool.push(...EXTRA_SERVICES.dining)
  }
  
  // Add wellness (preference for leisure and longer stays)
  if (profile.isLeisureGuest || profile.stayLength === 'long') {
    extraPool.push(...EXTRA_SERVICES.wellness)
  }
  
  // Add amenities (always relevant)
  extraPool.push(...EXTRA_SERVICES.amenities)
  
  // Add experiences (based on season and profile)
  if (profile.isLeisureGuest) {
    const seasonalExperiences = profile.season === 'summer' 
      ? EXTRA_SERVICES.experiences.filter(e => e.name.includes('Cruise') || e.name.includes('Diving'))
      : EXTRA_SERVICES.experiences.filter(e => !e.name.includes('Diving'))
    extraPool.push(...seasonalExperiences)
  }
  
  // Shuffle pool and select items
  const shuffled = [...extraPool].sort(() => rng.next() - 0.5)
  const selectedExtras = shuffled.slice(0, Math.min(count, shuffled.length))
  
  // Generate extra items
  selectedExtras.forEach((extra, index) => {
    const priceMultiplier = profile.isVIP ? 1.2 : 1.0
    const basePrice = Math.round(extra.basePrice * priceMultiplier)
    
    // Calculate total price based on type and nights
    let totalPrice = basePrice
    let units = 1
    
    if (extra.type === 'amenity' && nights > 1) {
      // Some amenities are per night
      if (extra.name.includes('WiFi') || extra.name.includes('Beach')) {
        totalPrice = basePrice * nights
        units = nights
      }
    } else if (extra.type === 'service' && extra.name.includes('Daily')) {
      totalPrice = basePrice * nights
      units = nights
    }
    
    // Service date varies based on type and can be multiple dates
    let serviceDates: string[] = []
    
    // Helper function to format date as DD/MM/YY (force 2026)
    const formatCompactDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = '26' // Force 2026 for all mock data
      return `${day}/${month}/${year}`
    }
    
    // Determine service category and generate appropriate dates
    const category = getServiceCategory(extra.name)
    
    // Handle special check-in/check-out cases first
    if (extra.name.includes('Check-in')) {
      serviceDates = [formatCompactDate(checkInDate)]
    } else if (extra.name.includes('Checkout')) {
      serviceDates = [formatCompactDate(checkOutDate)]
    } else {
      // Generate dates based on service category
      switch (category) {
        case 'SINGLE_DATE': {
          // Always single date - random day during stay
          const singleDayOffset = rng.nextInt(0, Math.max(0, nights - 1))
          const singleServiceDate = new Date(checkInDate.getTime() + singleDayOffset * 24 * 60 * 60 * 1000)
          serviceDates = [formatCompactDate(singleServiceDate)]
          break
        }
          
        case 'PER_NIGHT': {
          // One date per night of stay
          for (let i = 0; i < nights; i++) {
            const perNightDate = new Date(checkInDate.getTime() + i * 24 * 60 * 60 * 1000)
            serviceDates.push(formatCompactDate(perNightDate))
          }
          break
        }
          
        case 'PER_UNIT_DAILY': {
          // One date per unit, spread across stay
          const dailyServiceCount = Math.min(units, nights)
          if (dailyServiceCount === 1) {
            // Single unit - random day during stay
            const dailyDayOffset = rng.nextInt(0, Math.max(0, nights - 1))
            const dailyServiceDate = new Date(checkInDate.getTime() + dailyDayOffset * 24 * 60 * 60 * 1000)
            serviceDates = [formatCompactDate(dailyServiceDate)]
          } else {
            // Multiple units - spread across stay
            for (let i = 0; i < dailyServiceCount; i++) {
              const daySpacing = Math.floor(nights / dailyServiceCount)
              const dayOffset = i * daySpacing
              const dailyDate = new Date(checkInDate.getTime() + dayOffset * 24 * 60 * 60 * 1000)
              serviceDates.push(formatCompactDate(dailyDate))
            }
          }
          break
        }
          
        case 'PACKAGE_SINGLE': {
          // Always single date per package - random day during stay
          const packageDayOffset = rng.nextInt(0, Math.max(0, nights - 1))
          const packageServiceDate = new Date(checkInDate.getTime() + packageDayOffset * 24 * 60 * 60 * 1000)
          serviceDates = [formatCompactDate(packageServiceDate)]
          break
        }
          
        default: {
          // Fallback - single random date during stay
          const defaultDayOffset = rng.nextInt(0, Math.max(0, nights - 1))
          const defaultServiceDate = new Date(checkInDate.getTime() + defaultDayOffset * 24 * 60 * 60 * 1000)
          serviceDates = [formatCompactDate(defaultServiceDate)]
        }
      }
    }
    
    // Return single date string or array based on count
    const finalServiceDate = serviceDates.length === 1 ? serviceDates[0] : serviceDates
    
    // Generate dateRequested BEFORE check-in date (1-14 days before)
    const daysBeforeCheckIn = rng.nextInt(1, 14)
    const dateRequested = new Date(checkInDate.getTime() - daysBeforeCheckIn * 24 * 60 * 60 * 1000)
    
    extras.push({
      id: `extra-${reservation.id}-${index}-${rng.nextInt(1000, 9999)}`,
      name: extra.name,
      description: extra.description,
      price: totalPrice,
      status: rng.next() > 0.4 ? 'confirmed' : 'pending_hotel',
      includesHotels: !extra.name.includes('Transfer') && !extra.name.includes('Experience'),
      agent,
      commission: agent === 'Online' ? 0 : totalPrice * 0.1,
      dateRequested: formatCompactDate(dateRequested),
      units,
      type: extra.type,
      serviceDate: finalServiceDate
    })
  })
  
  return extras
}

function getRoomBasePrice(roomType: string): number {
  const prices: Record<string, number> = {
    'Doble': 120,
    'Doble Deluxe': 180,
    'Junior Suite': 280
  }
  return prices[roomType] || 120
}

function getUpgradePrice(fromRoom: string, toRoom: string): number {
  const fromPrice = getRoomBasePrice(fromRoom)
  const toPrice = getRoomBasePrice(toRoom)
  return Math.max(0, toPrice - fromPrice)
}