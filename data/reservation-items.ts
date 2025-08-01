export interface BaseRequestedItem {
  id: string
  price: number
  status: 'pending_hotel' | 'confirmed'
  includesHotels: boolean
  agent?: string // Agent who sold the service (name or "Online")
  commission?: number // Commission amount
  dateRequested?: string
}

export interface RoomItem extends BaseRequestedItem {
  roomType: string
  originalRoomType?: string | null // For room upgrades
  roomNumber?: string
  attributes?: string[]
  hasKey?: boolean
  alternatives?: string[]
  checkIn: string
  checkOut: string
  nights: number
}

export interface ExtraItem extends BaseRequestedItem {
  name: string
  description?: string
  nameKey?: string // For i18n support
  descriptionKey?: string // For i18n support
  units: number
  type: 'service' | 'amenity' | 'transfer'
  serviceDate: string | string[] // Support multiple service dates
}

export interface BiddingItem extends BaseRequestedItem {
  pujaType: string
  originalRoomType?: string | null // Original room type for upgrades
  pujaNumber?: string
  roomNumber?: string
  hasKey?: boolean
  alternatives?: string[]
  attributes?: string[]
  roomPrice?: number // Room price (usually higher than bid amount)
  dateCreated: string
  dateModified: string
  checkIn?: string // Room check-in date for consistency
  checkOut?: string // Room check-out date for consistency
}

// Legacy interface for backward compatibility
export interface RequestedItem extends BaseRequestedItem {
  name?: string
  description?: string
  nameKey?: string
  descriptionKey?: string
}

export interface RequestedItemsData {
  rooms: RoomItem[]
  extras: ExtraItem[]
  bidding: BiddingItem[]
}

export interface LegacyRequestedItemsData {
  extras: RequestedItem[]
  upsell: RequestedItem[]
  atributos: RequestedItem[]
}

// Single room request with multiple extra services
export const requestedItemsData: RequestedItemsData = {
  // Single room reservation (only 1 item as per business rule)
  rooms: [
    {
      id: "r1",
      roomType: "Deluxe Suite",
      roomNumber: "501",
      attributes: ["Sea View", "Balcony", "Jacuzzi", "Mini Bar", "Room Service"],
      price: 450, // €150/night × 3 nights
      status: "confirmed",
      includesHotels: true,
      agent: "Marcus Thompson",
      commission: 67.5, // 15% commission
      dateRequested: "20/01/26",
      checkIn: "28/01/26",
      checkOut: "31/01/26",
      nights: 3
    }
  ],
  // Multiple extra services from different requests
  extras: [
    {
      id: "e1",
      name: "Airport Transfer",
      description: "One-way pickup from airport to hotel",
      price: 35,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 0,
      dateRequested: "20/01/26",
      units: 1,
      type: "transfer",
      serviceDate: "25/01/26"
    },
    {
      id: "e2",
      name: "Spa Massage Package",
      description: "90-minute relaxation massage for couple",
      price: 180,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Lisa Chen",
      commission: 18,
      dateRequested: "21/01/26",
      units: 2,
      type: "service",
      serviceDate: ["29/01/26", "30/01/26"] // Multiple service dates
    },
    {
      id: "e3",
      name: "Late Checkout",
      description: "Extended checkout until 3 PM",
      price: 25,
      status: "confirmed",
      includesHotels: true,
      agent: "Reception",
      commission: 0,
      dateRequested: "22/01/26",
      units: 1,
      type: "service",
      serviceDate: "27/01/26"
    },
    {
      id: "e4",
      name: "Daily Housekeeping",
      description: "Premium cleaning service",
      price: 120,
      status: "confirmed",
      includesHotels: true,
      agent: "Emma Davis",
      commission: 12,
      dateRequested: "23/01/26",
      units: 4,
      type: "service",
      serviceDate: ["28/01/26", "29/01/26", "30/01/26", "31/01/26"] // Consecutive dates
    }
  ],
  // Single bidding/upgrade request (only 1 item as per business rule)
  bidding: [
    {
      id: "b1",
      pujaType: "Presidential Suite",
      originalRoomType: "Deluxe Suite",
      pujaNumber: "UPG-2024-004",
      roomNumber: "701",
      hasKey: false,
      alternatives: ["702"],
      attributes: ["VIP Upgrade", "Butler Service", "Private Terrace", "Champagne Welcome"],
      price: 300, // €100/night × 3 nights upgrade cost
      roomPrice: 750, // €250/night × 3 nights total
      status: "pending_hotel",
      includesHotels: true,
      agent: "Marcus Thompson",
      commission: 45.0,
      dateRequested: "21/01/26",
      dateCreated: "21/01/26",
      dateModified: "22/01/26"
    }
  ]
}