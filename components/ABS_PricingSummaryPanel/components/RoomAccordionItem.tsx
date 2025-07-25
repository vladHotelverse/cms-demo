import { ChevronDown, ChevronRight } from 'lucide-react'
import type React from 'react'
import { memo } from 'react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import type { MultiBookingLabels, RoomBooking } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import RoomContent from './RoomContent'

interface RoomAccordionItemProps {
  room: RoomBooking
  labels: MultiBookingLabels
  isActive: boolean
  removingItems: Set<string>
  formatCurrency: (price: number) => string
  onToggle: (roomId: string) => void
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
}

const RoomAccordionItem: React.FC<RoomAccordionItemProps> = memo(
  ({ room, labels, isActive, removingItems, formatCurrency, onToggle, onRemoveItem }) => {
    const total = room.items.reduce((sum, item) => sum + item.price, 0)

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        {/* Accordion Trigger */}
        <Button
          variant="ghost"
          className={cn(
            'w-full h-auto p-4 text-left justify-start transition-all duration-200 hover:bg-gray-50',
            isActive && 'bg-blue-50 border-l-4 border-l-blue-500'
          )}
          onClick={() => onToggle(room.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle(room.id)
            }
          }}
          aria-expanded={isActive}
          aria-label={`${room.roomName} - ${isActive ? 'Collapse' : 'Expand'} details`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {isActive ? (
                <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" aria-hidden="true" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{room.roomName}</h3>
                <p className="text-xs text-gray-500">
                  Room {room.roomNumber} • {room.guestName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{formatCurrency(total)}</div>
              <div className="text-xs text-gray-500">
                {room.nights} {room.nights > 1 ? labels.nightsLabel : labels.nightLabel}
              </div>
            </div>
          </div>
        </Button>

        {/* Accordion Content */}
        {isActive && (
          <RoomContent
            room={room}
            labels={labels}
            removingItems={removingItems}
            formatCurrency={formatCurrency}
            onRemoveItem={onRemoveItem}
          />
        )}
      </div>
    )
  }
)

RoomAccordionItem.displayName = 'RoomAccordionItem'

export default RoomAccordionItem
