import type React from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem, PricingLabels } from '../types'

interface CustomizationsSectionProps {
  customizationItems: PricingItem[]
  labels: PricingLabels
  onRemoveItem: (item: PricingItem) => void
}

const CustomizationsSection: React.FC<CustomizationsSectionProps> = ({ customizationItems, labels, onRemoveItem }) => {
  if (customizationItems.length === 0) return null

  return (
    <section aria-labelledby="customizations-section-title">
      <div className="flex justify-between items-center mb-2">
        <h3 id="customizations-section-title" className="text-base font-semibold">
          {labels.upgradesLabel}
        </h3>
      </div>
      <div className="space-y-2">
        {customizationItems.map((item) => (
          <PricingItemComponent
            key={item.id}
            item={item}
            euroSuffix={labels.euroSuffix}
            removeLabel={`Remove ${item.name}`}
            onRemove={() => {
              try {
                onRemoveItem(item)
              } catch (error) {
                console.error('Error in remove item callback:', error)
              }
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default CustomizationsSection
