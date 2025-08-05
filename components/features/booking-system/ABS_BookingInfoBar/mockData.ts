import type { BookingInfoBarItemProps, RoomBookingInfo, MultiBookingInfoLabels } from './types'

// Base factory functions for story creation
export const createStoryBookingItems = (overrides: BookingInfoBarItemProps[] = []): BookingInfoBarItemProps[] => [
  {
    icon: 'Tag',
    label: 'Código de reserva',
    value: '1003066AU',
  },
  {
    icon: 'Calendar',
    label: 'Fechas de estancia',
    value: '10/10/2025 - 10/10/2025',
  },
  {
    icon: 'Home',
    label: 'Tipo de habitación',
    value: 'Deluxe Double Room with Balcony and Ocean View',
  },
  {
    icon: 'Users',
    label: 'Ocupación',
    value: '2 Adultos, 1 Niño',
  },
  ...overrides,
]

export const createStoryRoomBookings = (): RoomBookingInfo[] => [
  {
    id: 'room-1',
    roomName: 'Deluxe Double Room with Ocean View',
    guestName: 'María García',
    roomImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format&fit=crop',
    items: [
      {
        icon: 'Tag',
        label: 'Código de reserva',
        value: '1003066AU',
      },
      {
        icon: 'Calendar',
        label: 'Fechas de estancia',
        value: '10/10/2025 - 05/01/2025',
      },
      {
        icon: 'Users',
        label: 'Ocupación',
        value: '2 Adultos',
      },
    ],
  },
  {
    id: 'room-2',
    roomName: 'Standard Twin Room',
    guestName: 'Carlos Rodríguez',
    roomImage: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=300&auto=format&fit=crop',
    items: [
      {
        icon: 'Tag',
        label: 'Código de reserva',
        value: '1003067AU',
      },
      {
        icon: 'Calendar',
        label: 'Fechas de estancia',
        value: '10/10/2025 - 05/01/2025',
      },
      {
        icon: 'Users',
        label: 'Ocupación',
        value: '1 Adulto, 1 Niño',
      },
    ],
  },
  {
    id: 'room-3',
    roomName: 'Junior Suite with Balcony',
    guestName: 'Ana Martínez',
    roomImage: 'https://images.unsplash.com/photo-1594736797933-d0ce71d81eeb?q=80&w=300&auto=format&fit=crop',
    items: [
      {
        icon: 'Tag',
        label: 'Código de reserva',
        value: '1003068AU',
      },
      {
        icon: 'Calendar',
        label: 'Fechas de estancia',
        value: '02/01/2025 - 07/01/2025',
      },
      {
        icon: 'Users',
        label: 'Ocupación',
        value: '2 Adultos, 1 Niño',
      },
    ],
  },
]

// Shared labels for stories
export const SPANISH_LABELS: MultiBookingInfoLabels = {
  multiRoomBookingsTitle: 'Reservas múltiples',
  roomsCountLabel: 'habitaciones',
  singleRoomLabel: 'habitación',
  clickToExpandLabel: 'Haz clic para expandir',
  roomLabel: 'Habitación',
  guestLabel: 'Huésped',
  selectionLabel: 'Seleccionada',
}

export const ENGLISH_LABELS: MultiBookingInfoLabels = {
  multiRoomBookingsTitle: 'Multiple Bookings',
  roomsCountLabel: 'rooms',
  singleRoomLabel: 'room',
  clickToExpandLabel: 'Click to expand',
  roomLabel: 'Room',
  guestLabel: 'Guest',
  selectionLabel: 'Selected',
}

// Convenience exports for backward compatibility
export const DEFAULT_BOOKING_ITEMS = createStoryBookingItems()
export const MOCK_ROOM_BOOKINGS = createStoryRoomBookings()
