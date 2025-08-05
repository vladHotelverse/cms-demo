import type React from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem, PricingLabels } from '../types'

interface RoomSectionProps {
  roomItems: PricingItem[]
  labels: PricingLabels
  onRemoveItem: (item: PricingItem) => void
}

const RoomSection: React.FC<RoomSectionProps> = ({ roomItems, labels, onRemoveItem }) => {
  if (roomItems.length === 0) return null

  return (
    <section aria-labelledby="room-section-title">
      <div className="flex justify-between items-center mb-2">
        <h3 id="room-section-title" className="text-base font-semibold">
          {labels.selectedRoomLabel}
        </h3>
      </div>
      {roomItems.map((item) => (
        <PricingItemComponent
          key={item.id}
          item={item}
          euroSuffix={labels.euroSuffix}
          removeLabel={labels.removeRoomUpgradeLabel}
          onRemove={() => {
            try {
              onRemoveItem(item)
            } catch (error) {
              console.error('Error in remove item callback:', error)
            }
          }}
        />
      ))}
    </section>
  )
}

export default RoomSection
