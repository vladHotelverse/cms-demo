import type { RoomOption } from '@/components/ABS_RoomSelectionCarousel/types'
import type { CustomizationOption, SectionConfig } from '@/components/ABS_RoomCustomization/types'
import type { SpecialOffer } from '@/components/ABS_SpecialOffers/types'
// Extended PricingItem interface to include quantity
interface ExtendedPricingItem {
  id: string
  name: string
  price: number
  type: 'room' | 'customization' | 'offer' | 'bid'
  concept: 'choose-your-room' | 'customize-your-room' | 'enhance-your-stay' | 'choose-your-superior-room' | 'bid-for-upgrade'
  quantity?: number
}

// Transform room upgrades data to RoomOption format
export function transformRoomUpgrades(roomUpgrades: any[]): RoomOption[] {
  return roomUpgrades.map((room) => ({
    id: room.id.toString(),
    name: room.type,
    description: room.features.join(', '),
    price: parseFloat(room.priceRange.split(' - ')[0].replace('€', '')),
    originalPrice: parseFloat(room.priceRange.split(' - ')[1].replace('€', '')),
    discount: room.highlights.includes('Best Value') ? 20 : 0,
    images: [room.image || '/placeholder.svg'],
    availability: room.availability === 'Limited' ? 'limited' : 'available',
    amenities: room.features,
    category: room.category,
    rating: room.rating,
  }))
}

// Transform room attributes to customization sections
export function transformRoomAttributes(attributeCategories: any): {
  sections: SectionConfig[]
  sectionOptions: Record<string, CustomizationOption[]>
} {
  const sections: SectionConfig[] = []
  const sectionOptions: Record<string, CustomizationOption[]> = {}

  Object.entries(attributeCategories).forEach(([category, data]: [string, any]) => {
    const sectionKey = category.toLowerCase().replace(' ', '-')
    
    sections.push({
      key: sectionKey,
      title: category,
      description: `Choose your preferred ${category.toLowerCase()}`,
      icon: () => null, // We'll use the emoji from data.icon
      iconChar: data.icon,
      hasModal: false,
    })

    sectionOptions[sectionKey] = data.items.map((item: any, index: number) => ({
      id: `${sectionKey}-${index}`,
      name: item.name,
      label: item.name,
      description: item.description,
      price: parseFloat(item.price.split(' - ')[0].replace(',', '.')),
      popular: item.popular,
    }))
  })

  return { sections, sectionOptions }
}

// Transform extras to special offers
export function transformExtras(extras: any[]): SpecialOffer[] {
  return extras.map((extra, index) => ({
    id: `extra-${index}`,
    title: extra.name,
    description: extra.description,
    price: parseFloat(extra.price.split(' - ')[0].replace('€', '')),
    images: [`/images/extra-${index}.jpg`], // Placeholder images
    priceUnit: extra.priceType as 'per stay' | 'per night' | 'per person',
    requiresPersonSelection: extra.priceType.includes('per person'),
    requiresDateSelection: extra.name.includes('Spa') || extra.name.includes('Dinner'),
    maxPersons: extra.priceType.includes('per person') ? 4 : undefined,
    icon: extra.icon,
    popular: extra.popular,
    availableDates: extra.name.includes('Spa') || extra.name.includes('Dinner') 
      ? generateAvailableDates() 
      : undefined,
  }))
}

// Generate available dates for services that need date selection
function generateAvailableDates(): Date[] {
  const dates: Date[] = []
  const today = new Date()
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }
  
  return dates
}

// Transform cart items to pricing items
export function transformToPricingItems(
  cartItems: any[],
  selectedRoom?: any,
  customizations?: Record<string, { id: string; label: string; price: number } | undefined>,
  bookedOffers?: any[]
): ExtendedPricingItem[] {
  const items: ExtendedPricingItem[] = []

  // Add selected room
  if (selectedRoom) {
    items.push({
      id: `room-${selectedRoom.id}`,
      name: selectedRoom.name,
      price: selectedRoom.price,
      type: 'room',
      concept: 'choose-your-room',
    })
  }

  // Add customizations
  if (customizations) {
    Object.entries(customizations).forEach(([sectionKey, customization]) => {
      if (customization) {
        items.push({
          id: customization.id,
          name: customization.label,
          price: customization.price,
          type: 'customization',
          concept: 'customize-your-room',
        })
      }
    })
  }

  // Add booked offers
  if (bookedOffers) {
    bookedOffers.forEach((offer) => {
      items.push({
        id: offer.id,
        name: offer.title,
        price: offer.totalPrice || offer.price,
        type: 'offer',
        concept: 'enhance-your-stay',
        quantity: offer.quantity,
      })
    })
  }

  // Add existing cart items as offers
  cartItems.forEach((item) => {
    items.push({
      id: `cart-${item.name}`,
      name: item.name,
      price: item.price || 15,
      type: 'offer',
      concept: 'enhance-your-stay',
    })
  })

  return items
}

// Transform reservation data for BookingInfoBar
export function transformToBookingInfo(reservation: any) {
  return {
    checkIn: reservation.checkIn,
    checkOut: reservation.checkIn, // Calculate based on nights
    nights: parseInt(reservation.nights),
    guests: 2, // Default value
    roomType: reservation.roomType,
    bookingReference: reservation.locator,
  }
}