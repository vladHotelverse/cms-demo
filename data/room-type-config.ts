export type RoomType = 'Standard' | 'Superior' | 'Deluxe' | 'Suite' | 'Presidential Suite'

export interface RoomTypeConfig {
  id: RoomType
  basePrice: number
  features: string[]
  capacity: number
  size: number // in m²
  level: number // 1-5, determines upgrade possibilities
  availableUpgrades: string[] // IDs of possible upgrades
  defaultAmenities: string[] // Basic amenities included
  recommendedExtras: string[] // Suitable extras for this room type
}

export const roomTypeConfigs: Record<RoomType, RoomTypeConfig> = {
  'Standard': {
    id: 'Standard',
    basePrice: 120,
    features: ['Double bed', 'City view', 'Basic amenities'],
    capacity: 2,
    size: 25,
    level: 1,
    availableUpgrades: ['room-upgrade', 'upper-floor', 'wellness'],
    defaultAmenities: ['wifi', 'tv', 'minibar'],
    recommendedExtras: ['early-checkin', 'late-checkout', 'baby-crib']
  },
  'Superior': {
    id: 'Superior',
    basePrice: 160,
    features: ['Queen bed', 'Partial ocean view', 'Enhanced amenities'],
    capacity: 2,
    size: 30,
    level: 2,
    availableUpgrades: ['room-upgrade', 'wellness', 'spa-package'],
    defaultAmenities: ['wifi', 'smart-tv', 'minibar', 'coffee-machine'],
    recommendedExtras: ['room-service', 'romantic-package', 'quiet-room']
  },
  'Deluxe': {
    id: 'Deluxe',
    basePrice: 220,
    features: ['King bed', 'Ocean view', 'Premium amenities', 'Balcony'],
    capacity: 3,
    size: 35,
    level: 3,
    availableUpgrades: ['wellness', 'spa-package', 'vip-services'],
    defaultAmenities: ['wifi', 'smart-tv', 'minibar', 'coffee-machine', 'balcony'],
    recommendedExtras: ['spa-access', 'premium-dining', 'upper-floor']
  },
  'Suite': {
    id: 'Suite',
    basePrice: 320,
    features: ['King bed', 'Panoramic ocean view', 'Separate living area', 'Large terrace'],
    capacity: 4,
    size: 45,
    level: 4,
    availableUpgrades: ['wellness', 'vip-services', 'presidential-experience'],
    defaultAmenities: ['wifi', 'smart-tv', 'minibar', 'coffee-machine', 'terrace', 'living-area'],
    recommendedExtras: ['butler-service', 'private-dining', 'spa-treatments']
  },
  'Presidential Suite': {
    id: 'Presidential Suite',
    basePrice: 500,
    features: ['King bed', 'Panoramic views', 'Full living area', 'Private pool', 'Butler service'],
    capacity: 6,
    size: 80,
    level: 5,
    availableUpgrades: ['vip-services', 'exclusive-experiences'],
    defaultAmenities: ['wifi', 'smart-tv', 'minibar', 'coffee-machine', 'private-pool', 'living-area', 'butler'],
    recommendedExtras: ['helicopter-transfer', 'private-chef', 'yacht-excursion']
  }
}

export const getRoomTypeConfig = (roomType: RoomType): RoomTypeConfig => {
  const config = roomTypeConfigs[roomType]
  if (!config) {
    console.warn(`Room type config not found for: ${roomType}, falling back to Standard`)
    return roomTypeConfigs['Standard']
  }
  return config
}

export const getAvailableUpgrades = (currentRoomType: RoomType): RoomType[] => {
  const currentConfig = getRoomTypeConfig(currentRoomType)
  const currentLevel = currentConfig.level
  return Object.values(roomTypeConfigs)
    .filter(config => config.level > currentLevel)
    .map(config => config.id)
}