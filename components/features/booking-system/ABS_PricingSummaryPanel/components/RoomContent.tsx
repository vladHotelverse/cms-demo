import type React from 'react'
import { memo } from 'react'
import type { MultiBookingLabels, RoomBooking } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import ItemSection from './ItemSection'
// import PriceChangeIndicator from './PriceChangeIndicator'

interface RoomContentProps {
  room: RoomBooking
  labels: MultiBookingLabels
  removingItems: Set<string>
  formatCurrency: (price: number) => string
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
}

const RoomContent: React.FC<RoomContentProps> = memo(
  ({ room, labels, removingItems, formatCurrency, onRemoveItem }) => {
    // Group items by concept instead of type
    const chooseYourRoomItems = room.items.filter((item) => item.concept === 'choose-your-room')
    const chooseYourSuperiorRoomItems = room.items.filter((item) => item.concept === 'choose-your-superior-room')
    const customizeYourRoomItems = room.items.filter((item) => item.concept === 'customize-your-room')
    const enhanceYourStayItems = room.items.filter((item) => item.concept === 'enhance-your-stay')
    const total = room.items.reduce((sum, item) => sum + item.price, 0)

    return (
      <div className="border-t border-gray-100 bg-white">
        {/* Room image */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src={room.roomImage || '/hotel-room.png'}
            alt={labels.roomImageAltText}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Choose Your Room Section */}
          {chooseYourRoomItems.length > 0 && (
            <ItemSection
              title="Room Selection"
              items={chooseYourRoomItems}
              emptyMessage="No room selected"
              removingItems={removingItems}
              labels={labels}
              roomId={room.id}
              onRemoveItem={onRemoveItem}
            />
          )}

          {/* Choose Your Superior Room Section */}
          {chooseYourSuperiorRoomItems.length > 0 && (
            <ItemSection
              title="Superior Room Selection"
              items={chooseYourSuperiorRoomItems}
              emptyMessage="No superior room selected"
              removingItems={removingItems}
              labels={labels}
              roomId={room.id}
              onRemoveItem={onRemoveItem}
            />
          )}

          {/* Customize Your Room Section */}
          {customizeYourRoomItems.length > 0 && (
            <ItemSection
              title="Room Customization"
              items={customizeYourRoomItems}
              emptyMessage="No customizations selected"
              removingItems={removingItems}
              labels={labels}
              roomId={room.id}
              onRemoveItem={onRemoveItem}
            />
          )}

          {/* Enhance Your Stay Section */}
          {enhanceYourStayItems.length > 0 && (
            <ItemSection
              title="Stay Enhancement"
              items={enhanceYourStayItems}
              emptyMessage="No enhancements selected"
              removingItems={removingItems}
              labels={labels}
              roomId={room.id}
              onRemoveItem={onRemoveItem}
            />
          )}

          {/* Room Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">{labels.roomTotalLabel}</span>
              <span className="text-base font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

RoomContent.displayName = 'RoomContent'

export default RoomContent
