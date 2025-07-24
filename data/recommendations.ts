export interface Recommendation {
  id: string
  titleKey: string
  descriptionKey: string
  pricePerNight?: number
  pricePerUnit?: number
  pricingType: 'night' | 'person' | 'service'
  totalPrice: number
  commission: number
  commissionPercentage: number
  images: string[]
  amenityKeys: string[]
  detailsKey?: string
}

import { IMAGES } from '@/constants/reservation-summary'

export const recommendationsData: Recommendation[] = [
  {
    id: 'room-upgrade',
    titleKey: 'roomUpgrade.title',
    descriptionKey: 'roomUpgrade.description',
    pricePerNight: 120,
    pricingType: 'night',
    totalPrice: 480, // 120 * 4 nights
    commission: 72, // 480 * 0.15
    commissionPercentage: 15,
    images: [
      IMAGES.roomUpgrade.main,
      IMAGES.roomUpgrade.terrace,
      IMAGES.roomUpgrade.oceanView
    ],
    amenityKeys: ['amenities.poolView', 'amenities.balcony', 'amenities.bestViews'],
    detailsKey: 'roomUpgrade.details'
  },
  {
    id: 'upper-floor',
    titleKey: 'upperFloor.title',
    descriptionKey: 'upperFloor.description',
    pricePerNight: 21.25, // 85 / 4 nights
    pricingType: 'night',
    totalPrice: 85,
    commission: 12.75,
    commissionPercentage: 15,
    images: [
      IMAGES.upperFloor.room,
      IMAGES.upperFloor.cityView,
      IMAGES.upperFloor.exclusive
    ],
    amenityKeys: ['amenities.upperFloor', 'amenities.privacy', 'amenities.elevatedViews'],
    detailsKey: 'upperFloor.details'
  },
  {
    id: 'wellness',
    titleKey: 'wellness.title',
    descriptionKey: 'wellness.description',
    pricePerUnit: 150,
    pricingType: 'person',
    totalPrice: 150,
    commission: 22.50,
    commissionPercentage: 15,
    images: [
      IMAGES.wellness.spa,
      IMAGES.wellness.massage,
      IMAGES.wellness.yoga
    ],
    amenityKeys: ['amenities.unlimitedSpa', 'amenities.massage60min', 'amenities.privateYoga'],
    detailsKey: 'wellness.details'
  }
]