import { Recommendation } from './recommendations'
import { RoomType, getRoomTypeConfig, getAvailableUpgrades } from './room-type-config'
import { IMAGES } from '@/constants/reservation-summary'

export interface ReservationContext {
  roomType: RoomType
  nights: number
  guests: number
  checkInDate: Date
  isBusinessGuest?: boolean
  isCouple?: boolean
  hasChildren?: boolean
}

export const generateDynamicRecommendations = (context: ReservationContext): Recommendation[] => {
  const { roomType, nights, guests } = context
  const roomConfig = getRoomTypeConfig(roomType)
  const availableUpgrades = getAvailableUpgrades(roomType)
  const recommendations: Recommendation[] = []

  // Room Upgrade Recommendations
  if (availableUpgrades.length > 0) {
    const nextUpgrade = availableUpgrades[0] // Next level up
    const upgradeConfig = getRoomTypeConfig(nextUpgrade)
    const pricePerNight = upgradeConfig.basePrice - roomConfig.basePrice
    
    recommendations.push({
      id: 'room-upgrade',
      titleKey: 'roomUpgrade.title',
      descriptionKey: 'roomUpgrade.description',
      pricePerNight: pricePerNight,
      pricingType: 'night',
      totalPrice: pricePerNight * nights,
      commission: (pricePerNight * nights) * 0.15,
      commissionPercentage: 15,
      images: [
        IMAGES.roomUpgrade.main,
        IMAGES.roomUpgrade.terrace,
        IMAGES.roomUpgrade.oceanView
      ],
      amenityKeys: getAmenitiesForUpgrade(nextUpgrade),
      detailsKey: 'roomUpgrade.details'
    })
  }

  // Upper Floor (for Standard and Superior rooms)
  if (roomConfig.level <= 2) {
    const basePrice = 21.25
    recommendations.push({
      id: 'upper-floor',
      titleKey: 'upperFloor.title',
      descriptionKey: 'upperFloor.description',
      pricePerNight: basePrice,
      pricingType: 'night',
      totalPrice: basePrice * nights,
      commission: (basePrice * nights) * 0.15,
      commissionPercentage: 15,
      images: [
        IMAGES.upperFloor.room,
        IMAGES.upperFloor.cityView,
        IMAGES.upperFloor.exclusive
      ],
      amenityKeys: ['amenities.upperFloor', 'amenities.privacy', 'amenities.elevatedViews'],
      detailsKey: 'upperFloor.details'
    })
  }

  // Wellness Experience (for all room types, price varies)
  const wellnessPrice = getWellnessPriceForRoom(roomType)
  recommendations.push({
    id: 'wellness',
    titleKey: 'wellness.title',
    descriptionKey: 'wellness.description',
    pricePerUnit: wellnessPrice,
    pricingType: 'person',
    totalPrice: wellnessPrice * guests,
    commission: (wellnessPrice * guests) * 0.15,
    commissionPercentage: 15,
    images: [
      IMAGES.wellness.spa,
      IMAGES.wellness.massage,
      IMAGES.wellness.yoga
    ],
    amenityKeys: ['amenities.unlimitedSpa', 'amenities.massage60min', 'amenities.privateYoga'],
    detailsKey: 'wellness.details'
  })

  // Business Package (for business guests in higher room categories)
  if (context.isBusinessGuest && roomConfig.level >= 3) {
    recommendations.push({
      id: 'business-package',
      titleKey: 'businessPackage.title',
      descriptionKey: 'businessPackage.description',
      pricePerNight: 75,
      pricingType: 'night',
      totalPrice: 75 * nights,
      commission: (75 * nights) * 0.15,
      commissionPercentage: 15,
      images: [
        IMAGES.business.meetingRoom,
        IMAGES.business.businessCenter,
        IMAGES.business.workspace
      ],
      amenityKeys: ['amenities.meetingRoom', 'amenities.businessCenter', 'amenities.express'],
      detailsKey: 'businessPackage.details'
    })
  }

  // Romantic Package (for couples)
  if (context.isCouple && guests === 2) {
    recommendations.push({
      id: 'romantic-package',
      titleKey: 'romanticPackage.title',
      descriptionKey: 'romanticPackage.description',
      pricePerUnit: 95,
      pricingType: 'service',
      totalPrice: 95,
      commission: 14.25,
      commissionPercentage: 15,
      images: [
        IMAGES.romantic.dinner,
        IMAGES.romantic.champagne,
        IMAGES.romantic.roses
      ],
      amenityKeys: ['amenities.champagne', 'amenities.rosePetals', 'amenities.candleDinner'],
      detailsKey: 'romanticPackage.details'
    })
  }

  return recommendations
}

const getAmenitiesForUpgrade = (roomType: RoomType): string[] => {
  switch (roomType) {
    case 'Superior':
      return ['amenities.poolView', 'amenities.balcony', 'amenities.bestViews']
    case 'Deluxe':
      return ['amenities.oceanView', 'amenities.balcony', 'amenities.premium']
    case 'Suite':
      return ['amenities.panoramicView', 'amenities.terrace', 'amenities.livingArea']
    case 'Presidential Suite':
      return ['amenities.privatePool', 'amenities.butler', 'amenities.luxury']
    default:
      return ['amenities.poolView', 'amenities.balcony', 'amenities.bestViews']
  }
}

const getWellnessPriceForRoom = (roomType: RoomType): number => {
  const roomConfig = getRoomTypeConfig(roomType)
  // Higher room categories get discounted wellness prices
  const basePrice = 150
  const discount = (roomConfig.level - 1) * 0.1 // 10% discount per level above Standard
  return Math.round(basePrice * (1 - discount))
}

// Helper function to generate context from reservation data
export const createReservationContext = (
  roomType: RoomType,
  nights: number,
  aci: string, // Adult/Child/Infant format like "2/1/0"
  checkInDate: Date = new Date()
): ReservationContext => {
  const [adults, children, infants] = aci.split('/').map(n => parseInt(n) || 0)
  const totalGuests = Math.max(1, adults + children + infants) // Ensure at least 1 guest
  
  // Ensure we have a valid room type
  const validRoomTypes: RoomType[] = ['Standard', 'Superior', 'Deluxe', 'Suite', 'Presidential Suite']
  const validRoomType = validRoomTypes.includes(roomType) ? roomType : 'Standard'
  
  return {
    roomType: validRoomType,
    nights: Math.max(1, nights), // Ensure at least 1 night
    guests: totalGuests,
    checkInDate,
    isBusinessGuest: validRoomType === 'Deluxe' || validRoomType === 'Suite' || validRoomType === 'Presidential Suite',
    isCouple: adults === 2 && children === 0 && infants === 0,
    hasChildren: children > 0 || infants > 0
  }
}