export type BookingStatus = "confirmed" | "pending" | "checked-in" | "checked-out" | "cancelled"
export type RoomStatus = "confirmed" | "standard" | "priority"
export type ExtrasStatus = "confirmed" | "standard" | "priority"

export interface RoomAttribute {
  id: string
  name: string
  icon: string
  selected: boolean
}

export interface AlternativeRoom {
  number: number
  type: string
  available: boolean
}

export interface RoomData {
  type: string
  number: number
  option: string
  status: RoomStatus
  hasUpgrade: boolean
  hasChooseRoom: boolean
  hasKey: boolean
  hasAlternatives: boolean
  attributes?: RoomAttribute[]
  alternatives?: AlternativeRoom[]
  originalRoom?: { type: string; number: number }
  upgradedRoom?: { type: string; number: number }
}

export interface Guest {
  id: string
  name: string
  email: string
  phone?: string
  preferences?: string[]
  vipStatus?: boolean
}

export interface Extras {
  id: string
  name: string
  confirmed: number
  pending: number
  status: ExtrasStatus
  items?: {
    id: string
    name: string
    status: "confirmed" | "pending" | "cancelled"
    price: number
  }[]
}

export interface Booking {
  id: string
  locator: string
  guest: Guest
  lastRequest: Date
  checkIn: Date
  checkOut: Date
  price: number
  status: BookingStatus
  room: RoomData
  extras: Extras
  notes?: string
  specialRequests?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BookingFilters {
  status?: BookingStatus[]
  dateRange?: {
    start: Date
    end: Date
  }
  roomType?: string[]
  guestName?: string
}

export interface BookingSortOptions {
  field: keyof Booking | "guest.name" | "room.type" | "room.number" | "locator"
  direction: "asc" | "desc"
}