import type { BookingInfoItemProps } from './components/BookingInfoItem'

// Define available icon names for better type safety
export type IconName = 'Tag' | 'Calendar' | 'Home' | 'Users'

export interface BookingInfoBarItemProps extends BookingInfoItemProps {
  icon: IconName | string // Allow both IconName and string for flexibility, validation happens at runtime
}

export interface RoomBookingInfo {
  id: string
  roomName: string
  guestName: string
  roomImage?: string
  items: BookingInfoBarItemProps[]
}

export interface MultiBookingInfoLabels {
  multiRoomBookingsTitle: string
  roomsCountLabel: string
  singleRoomLabel: string
  clickToExpandLabel: string
  roomLabel: string
  guestLabel: string
  selectionLabel?: string
}

export type BookingInfoProps = {
  className?: string
  hotelImage?: string
  title?: string
  showBanner?: boolean
  activeRoom?: string | null
  onRoomActiveChange?: (roomId: string) => void
} & (
  | { items: BookingInfoBarItemProps[]; roomBookings?: never; labels?: never }
  | { items?: never; roomBookings: RoomBookingInfo[]; labels?: MultiBookingInfoLabels }
)
