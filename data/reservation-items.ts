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
  roomNumber?: string
  attributes?: string[]
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
  pujaNumber?: string
  attributes?: string[]
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

export const requestedItemsData: RequestedItemsData = {
  rooms: [
    {
      id: "r1",
      roomType: "Superior Room",
      roomNumber: "405",
      attributes: ["Vista al mar", "Balcón privado"],
      price: 355,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 35.5,
      dateRequested: "2025-01-15",
      checkIn: "2025-07-19",
      checkOut: "2025-07-23",
      nights: 4
    },
    {
      id: "r2",
      roomType: "Deluxe Suite",
      roomNumber: "1201",
      attributes: ["Piso Alto", "Habitación Tranquila", "Cerca del Spa"],
      price: 485,
      status: "pending_hotel",
      includesHotels: true,
      agent: "María García",
      commission: 48.5,
      dateRequested: "2025-01-20",
      checkIn: "2025-07-19",
      checkOut: "2025-07-23",
      nights: 4
    }
  ],
  extras: [
    {
      id: "e1",
      name: "Early Check In",
      description: "Check-in desde las 12:00",
      price: 25,
      status: "pending_hotel",
      includesHotels: true,
      agent: "María García",
      commission: 2.5,
      dateRequested: "2025-01-15",
      units: 1,
      type: "service",
      serviceDate: "2025-07-19"
    },
    {
      id: "e2",
      name: "Late Checkout",
      description: "Check-out hasta las 14:00",
      price: 30,
      status: "confirmed",
      includesHotels: true,
      agent: "Online",
      commission: 3.0,
      dateRequested: "2025-01-15",
      units: 1,
      type: "service",
      serviceDate: "2025-07-23"
    },
    {
      id: "e3",
      name: "Cuna bebé",
      description: "Cuna para bebé con ropa de cama",
      price: 15,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Carlos López",
      commission: 1.5,
      dateRequested: "2025-01-18",
      units: 1,
      type: "amenity",
      serviceDate: "2025-07-19"
    },
    {
      id: "e4",
      name: "Airport Transfer",
      description: "Private car from airport",
      price: 95,
      status: "confirmed",
      includesHotels: false,
      agent: "Ana Rodríguez",
      commission: 9.5,
      dateRequested: "2025-01-20",
      units: 2,
      type: "transfer",
      serviceDate: "2025-07-19"
    }
  ],
  // Business rule: Only one bidding item per reservation
  bidding: [
    {
      id: "b1",
      pujaType: "Deluxe Room", // Actual room type for the bid
      pujaNumber: "BID-2025-001",
      attributes: ["Ocean View", "High Floor", "Premium Service"],
      price: 150,
      status: "pending_hotel",
      includesHotels: true,
      agent: "Online",
      commission: 15.0,
      dateRequested: "2025-01-22",
      dateCreated: "2025-01-22",
      dateModified: "2025-01-23"
    }
  ]
}