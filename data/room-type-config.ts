export type RoomType = 'Doble' | 'Doble Deluxe' | 'Junior Suite'

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
  'Doble': {
    id: 'Doble',
    basePrice: 120,
    features: ['King Bed', 'City view', 'Basic amenities'],
    capacity: 2,
    size: 25,
    level: 1,
    availableUpgrades: ['room-upgrade', 'upper-floor', 'wellness'],
    defaultAmenities: ['wifi', 'tv', 'minibar'],
    recommendedExtras: ['early-checkin', 'late-checkout', 'baby-crib']
  },
  'Doble Deluxe': {
    id: 'Doble Deluxe',
    basePrice: 180,
    features: ['King Bed', 'Partial ocean view', 'Enhanced amenities', 'Balcony'],
    capacity: 2,
    size: 30,
    level: 2,
    availableUpgrades: ['room-upgrade', 'wellness', 'spa-package'],
    defaultAmenities: ['wifi', 'smart-tv', 'minibar', 'coffee-machine'],
    recommendedExtras: ['room-service', 'romantic-package', 'quiet-room']
  },
  'Junior Suite': {
    id: 'Junior Suite',
    basePrice: 280,
    features: ['King Bed', 'Ocean view', 'Living area', 'Balcony', 'Premium amenities'],
    capacity: 3,
    size: 40,
    level: 3,
    availableUpgrades: ['wellness', 'spa-package', 'vip-services'],
    defaultAmenities: ['wifi', 'smart-tv', 'minibar', 'coffee-machine', 'balcony', 'living-area'],
    recommendedExtras: ['spa-access', 'premium-dining', 'butler-service']
  }
}

export const getRoomTypeConfig = (roomType: RoomType): RoomTypeConfig => {
  const config = roomTypeConfigs[roomType]
  if (!config) {
    console.warn(`Room type config not found for: ${roomType}, falling back to Doble`)
    return roomTypeConfigs['Doble']
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