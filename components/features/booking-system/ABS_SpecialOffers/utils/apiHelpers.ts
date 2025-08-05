import type { OfferData, OfferType } from '../types'

/**
 * API Response interface for special offers
 */
export interface APIOfferResponse {
  id: number
  name: string
  title?: string
  description: string
  price: number
  pricing_type: 'per_stay' | 'per_person' | 'per_night'
  image_url?: string
  available?: boolean
  max_quantity?: number
}

/**
 * Transform API offer data to component format
 */
export const transformAPIOfferToComponent = (apiOffer: APIOfferResponse): OfferType => {
  return {
    id: apiOffer.id,
    title: apiOffer.title || apiOffer.name,
    description: apiOffer.description,
    price: apiOffer.price,
    type: apiOffer.pricing_type.replace('_', '') as 'perStay' | 'perPerson' | 'perNight',
    image: apiOffer.image_url,
  }
}

/**
 * Transform multiple API offers
 */
export const transformAPIOffersToComponent = (apiOffers: APIOfferResponse[]): OfferType[] => {
  return apiOffers.filter((offer) => offer.available !== false).map(transformAPIOfferToComponent)
}

/**
 * Validate offer data from API
 */
export const validateOfferData = (offer: any): offer is APIOfferResponse => {
  return (
    typeof offer.id === 'number' &&
    (typeof offer.name === 'string' || typeof offer.title === 'string') &&
    typeof offer.description === 'string' &&
    typeof offer.price === 'number' &&
    ['per_stay', 'per_person', 'per_night'].includes(offer.pricing_type)
  )
}

/**
 * Transform component offer data to API format for booking
 */
export const transformOfferDataToAPI = (offerData: OfferData) => {
  return {
    offer_id: offerData.id,
    offer_name: offerData.name,
    quantity: offerData.quantity,
    total_price: offerData.price,
    pricing_type: offerData.type.replace(/([A-Z])/g, '_$1').toLowerCase(),
    ...(offerData.persons && { persons: offerData.persons }),
    ...(offerData.nights && { nights: offerData.nights }),
  }
}
