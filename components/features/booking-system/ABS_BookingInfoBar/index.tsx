import clsx from 'clsx'
import type React from 'react'
import { useState } from 'react'
import { HotelBanner, SingleBookingInfo, MultiBookingInfo } from './components'
import { DEFAULT_HOTEL_IMAGE, DEFAULT_LABELS } from './constants'
import { useResponsiveScreen } from './helpers'
import type { BookingInfoProps } from './types'

const BookingInfoBar: React.FC<BookingInfoProps> = ({
  className,
  hotelImage = DEFAULT_HOTEL_IMAGE,
  title = 'Your Booking Information',
  showBanner = true,
  items = [],
  roomBookings = [],
  labels = DEFAULT_LABELS,
  activeRoom: externalActiveRoom,
  onRoomActiveChange,
}) => {
  const [internalActiveRoom, setInternalActiveRoom] = useState<string | null>(null)
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)

  // Use the custom hook for responsive behavior
  const isXLScreen = useResponsiveScreen()

  const activeRoom = externalActiveRoom !== undefined ? externalActiveRoom : internalActiveRoom
  const isMultiBooking = roomBookings.length > 0

  const handleAccordionToggle = (roomId: string) => {
    // Accordion state should be separate from selection state
    setExpandedAccordion((prev) => (prev === roomId ? null : roomId))

    // Selection state
    if (onRoomActiveChange) {
      onRoomActiveChange(roomId)
    }

    // Only manage internal state if uncontrolled
    if (externalActiveRoom === undefined) {
      setInternalActiveRoom(roomId)
    }
  }

  return (
    <div className={clsx('w-full container mx-auto pt-8', className)}>
      {/* Hotel Image Banner */}
      <HotelBanner hotelImage={hotelImage} showBanner={showBanner} />

      {/* Booking Info Bar - With sticky positioning built-in */}
      <div className="sticky top-16 z-40 bg-white shadow-md transition-all duration-300 rounded-b-lg border border-neutral-300">
        {!isMultiBooking ? (
          /* Single Booking Mode */
          <SingleBookingInfo title={title} items={items} />
        ) : (
          /* Multi-Booking Mode */
          <MultiBookingInfo
            title={title}
            roomBookings={roomBookings}
            labels={labels}
            activeRoom={activeRoom}
            expandedAccordion={expandedAccordion}
            isXLScreen={isXLScreen}
            onAccordionToggle={handleAccordionToggle}
          />
        )}
      </div>
    </div>
  )
}

export default BookingInfoBar
