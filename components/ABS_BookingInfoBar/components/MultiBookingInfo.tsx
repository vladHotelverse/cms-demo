import clsx from 'clsx'
import type React from 'react'
import { RoomHeader, RoomItemsGrid } from '.'
import { getChevronIcon, getRoomCountLabel, filterDuplicateRoomTypes } from '../helpers'
import type { RoomBookingInfo, MultiBookingInfoLabels } from '../types'

interface MultiBookingInfoProps {
  title: string
  roomBookings: RoomBookingInfo[]
  labels?: MultiBookingInfoLabels
  activeRoom: string | null
  expandedAccordion: string | null
  isXLScreen: boolean
  onAccordionToggle: (roomId: string) => void
}

const MultiBookingInfo: React.FC<MultiBookingInfoProps> = ({
  title,
  roomBookings,
  labels,
  activeRoom,
  expandedAccordion,
  isXLScreen,
  onAccordionToggle,
}) => {
  return (
    <>
      {/* Header */}
      <div className="bg-gray-50 p-4">
        <h4 className="font-medium text-md">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {getRoomCountLabel(roomBookings.length, labels)} • {labels?.clickToExpandLabel || 'Haz clic para expandir'}
        </p>
      </div>

      {/* XL Desktop version - Improved readability, no accordion, always expanded */}
      {isXLScreen && (
        <div className="max-h-[400px] overflow-y-auto">
          {roomBookings.map((room) => {
            const filteredItems = filterDuplicateRoomTypes(room)

            return (
              <div key={room.id} className="border-b first:border-t border-gray-200 last:border-b-0">
                {/* Room Header with better spacing */}
                <div
                  data-testid={`room-header-${room.id}`}
                  data-selected={activeRoom === room.id}
                  className={clsx('w-full px-6 py-4 transition-colors flex justify-between gap-4', {
                    'bg-blue-50': activeRoom === room.id,
                  })}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <RoomHeader
                        room={room}
                        isSelected={activeRoom === room.id}
                        labels={labels}
                        testId={`room-header-${room.id}`}
                      />
                    </div>
                  </div>

                  {/* Booking items section with better spacing */}
                  {filteredItems.length > 0 && <RoomItemsGrid items={filteredItems} roomId={room.id} />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Mobile/Tablet/Desktop version - accordion for screens smaller than XL */}
      {!isXLScreen && (
        <div className="max-h-[400px] overflow-y-auto">
          {roomBookings.map((room) => {
            const isExpanded = expandedAccordion === room.id // Accordion expansion state
            const isSelected = activeRoom === room.id // Room selection state for editing

            return (
              <div key={room.id} className="border-b border-gray-200 last:border-b-0">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => onAccordionToggle(room.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`room-content-mobile-${room.id}`}
                  id={`room-header-mobile-${room.id}`}
                  data-selected={isSelected}
                  className={clsx(
                    'w-full p-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors min-w-0',
                    {
                      'bg-blue-50': isSelected,
                    }
                  )}
                >
                  <div className="flex items-center justify-between min-w-0 gap-2">
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <RoomHeader room={room} isSelected={isSelected} labels={labels} isMobile={true} />
                    </div>
                    <div className="flex-shrink-0">{getChevronIcon(isExpanded)}</div>
                  </div>
                </button>

                {/* Accordion Content */}
                {isExpanded && (
                  <section
                    id={`room-content-mobile-${room.id}`}
                    aria-labelledby={`room-header-mobile-${room.id}`}
                    className="px-3 pb-3 bg-gray-50 border-t overflow-hidden"
                  >
                    <RoomItemsGrid items={room.items || []} roomId={room.id} isMobile={true} />
                  </section>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default MultiBookingInfo
