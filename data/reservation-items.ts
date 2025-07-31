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
  serviceDate: string
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
      dateRequested: "2024-01-20",
      checkIn: "2024-01-28",
      checkOut: "2024-01-31",
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
      dateRequested: "2024-01-20",
      units: 1,
      type: "transfer",
      serviceDate: "2024-01-25"
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
      dateRequested: "2024-01-21",
      units: 2,
      type: "service",
      serviceDate: "2024-01-29"
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
      dateRequested: "2024-01-22",
      units: 1,
      type: "service",
      serviceDate: "2024-01-27"
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
      dateRequested: "2024-01-21",
      dateCreated: "2024-01-21",
      dateModified: "2024-01-22"
    }
  ]
}