import type React from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem, PricingLabels } from '../types'

interface OffersSectionProps {
  offerItems: PricingItem[]
  labels: PricingLabels
  onRemoveItem: (item: PricingItem) => void
}

const OffersSection: React.FC<OffersSectionProps> = ({ offerItems, labels, onRemoveItem }) => {
  if (offerItems.length === 0) return null

  return (
    <section aria-labelledby="offers-section-title">
      <div className="flex justify-between items-center mb-2">
        <h3 id="offers-section-title" className="text-base font-semibold">
          {labels.specialOffersLabel}
        </h3>
      </div>
      <div className="space-y-2">
        {offerItems.map((item) => (
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

export default OffersSection
