import type { RoomOption } from '../types'

/**
 * Priority scoring for different amenity categories
 * Higher values indicate higher priority for upgrades
 */
const AMENITY_PRIORITIES = {
  // Size and Space
  '60 to 70 m2 / 645 to 755 sqft': 10,
  '30 to 35 m2 / 325 to 375 sqft': 5,
  
  // Premium Features
  'Hydromassage Bathtub': 9,
  'Living Room': 9,
  'Coffee Machine': 1,
  'King Size Bed': 8,
  'Sofa Bed - Double': 7,
  
  // Views and Location
  'Pool View': 8,
  'Landmark View': 7,
  'Morning Sun': 6,
  'Afternoon Sun': 5,
  'Piazza View': 5,
  'Lateral Streets View': 4,
  
  // Unique Experience
  'Shared Pool': 9,
  'Terrace': 8,
  'Balcony': 7,
  'Close to Pool': 6,
  
  // Technology and Comfort
  'Bluetooth sound system': 1,
  'Smart TV': 5,
  'Premium Wi-Fi': 4,
  
  // Service and Convenience
  '24 Hours Room Service': 1,
  'Pillow Menu': 5,
  'Minibar': 4,
  'Safe': 3,
  
  // Basic Amenities (lower priority for upgrades)
  'AC': 2,
  'Hairdryer': 2,
  'Phone': 2,
  'Iron & Board': 2,
  'Rain shower': 3,
  'Bathrobe and slippers': 3,
  'Tea Set': 3,
  'Non-smoking Room': 1,
  'Pet Friendly': 2,
  'Desk': 2,
  'Table and chairs set': 2,
  'Magnifying mirror': 2,
  'Shoe kit': 2,
  'In Main Building': 1,
  'Recyclables Coffee Capsules': 2,
}

/**
 * Room type hierarchy - higher index means more premium
 */
const ROOM_HIERARCHY = [
  'DELUXE SILVER', // User's base room (not in upgrade options)
  'DELUXE GOLD',
  'DELUXE SWIM-UP',
  'ROCK SUITE',
  '80S SUITE',
  'ROCK SUITE DIAMOND',
  'ROCK SUITE LEGEND'
]

interface AmenityWithScore {
  amenity: string
  score: number
  isUnique: boolean
}

/**
 * Get the priority score for an amenity
 */
function getAmenityScore(amenity: string): number {
  return AMENITY_PRIORITIES[amenity as keyof typeof AMENITY_PRIORITIES] || 3
}

/**
 * Get room hierarchy level (higher = more premium)
 */
function getRoomLevel(roomType: string): number {
  const index = ROOM_HIERARCHY.indexOf(roomType)
  return index >= 0 ? index : 0
}

/**
 * Check if an amenity represents a unique benefit compared to current room
 */
function isUniqueAmenity(amenity: string, currentRoomAmenities: string[]): boolean {
  return !currentRoomAmenities.includes(amenity)
}

/**
 * Select the 3 best amenities for a room upgrade
 * @param room - The room option to analyze
 * @param currentRoomType - The user's current room type
 * @param currentRoomAmenities - Amenities from the user's current room
 * @param usedAmenities - Set of amenities already used by other rooms
 * @returns Array of the 3 best amenities for this upgrade
 */
export function selectBestAmenities(
  room: RoomOption,
  currentRoomType: string,
  currentRoomAmenities: string[] = [],
  usedAmenities: Set<string> = new Set()
): string[] {
  const roomLevel = getRoomLevel(room.roomType)
  const currentLevel = getRoomLevel(currentRoomType)
  
  // Score each amenity
  const amenitiesWithScores: AmenityWithScore[] = room.amenities.map(amenity => {
    let score = getAmenityScore(amenity)
    const isUnique = isUniqueAmenity(amenity, currentRoomAmenities)
    
    // Boost score for unique amenities (new benefits)
    if (isUnique) {
      score += 3
    }
    
    // Boost score based on room upgrade level
    const upgradeBonus = Math.max(0, (roomLevel - currentLevel) * 0.5)
    score += upgradeBonus
    
    // Penalize if already used by another room
    if (usedAmenities.has(amenity)) {
      score -= 5
    }
    
    return {
      amenity,
      score,
      isUnique
    }
  })
  
  // Sort by score (descending) and select top 3
  const selectedAmenities = amenitiesWithScores
    .sort((a, b) => {
      // First sort by uniqueness (unique amenities first)
      if (a.isUnique !== b.isUnique) {
        return a.isUnique ? -1 : 1
      }
      // Then by score
      return b.score - a.score
    })
    .slice(0, 3)
    .map(item => item.amenity)
  
  return selectedAmenities
}

/**
 * Get dynamic amenities for all rooms, ensuring no repetition
 * @param rooms - Array of room options
 * @param currentRoomType - The user's current room type
 * @param currentRoomAmenities - Amenities from the user's current room
 * @returns Map of room ID to selected amenities
 */
export function getDynamicAmenitiesForAllRooms(
  rooms: RoomOption[],
  currentRoomType: string,
  currentRoomAmenities: string[] = []
): Map<string, string[]> {
  const usedAmenities = new Set<string>()
  const roomAmenities = new Map<string, string[]>()
  
  // Sort rooms by upgrade level to prioritize better rooms for amenity selection
  const sortedRooms = [...rooms].sort((a, b) => {
    return getRoomLevel(b.roomType) - getRoomLevel(a.roomType)
  })
  
  // Select amenities for each room
  for (const room of sortedRooms) {
    const selectedAmenities = selectBestAmenities(
      room,
      currentRoomType,
      currentRoomAmenities,
      usedAmenities
    )
    
    // Add selected amenities to used set
    selectedAmenities.forEach(amenity => usedAmenities.add(amenity))
    
    roomAmenities.set(room.id, selectedAmenities)
  }
  
  return roomAmenities
}

/**
 * Helper function to find user's current room amenities from room options
 * (fallback if current room is not in the upgrade list)
 */
export function getCurrentRoomAmenities(currentRoomType: string, rooms: RoomOption[]): string[] {
  // Try to find a similar room type in the available options
  const matchingRoom = rooms.find(room => 
    room.roomType?.toLowerCase().includes(currentRoomType.toLowerCase()) ||
    currentRoomType.toLowerCase().includes(room.roomType?.toLowerCase() || '')
  )
  
  if (matchingRoom) {
    return matchingRoom.amenities
  }
  
  // Fallback: assume basic amenities for DELUXE SILVER
  return [
    'AC',
    'Hairdryer',
    'Phone',
    'Iron & Board',
    'Rain shower',
    'Bathrobe and slippers',
    'Tea Set',
    'Non-smoking Room',
    'Pet Friendly',
    'Desk',
    'Table and chairs set',
    'Magnifying mirror',
    'Shoe kit',
    'Premium Wi-Fi',
    'Smart TV',
    'Safe',
    'Minibar'
  ]
}