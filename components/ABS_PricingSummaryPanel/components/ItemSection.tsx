import { Loader2, X } from 'lucide-react'
import type React from 'react'
import { memo } from 'react'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import type { MultiBookingLabels } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import PriceChangeIndicator from './PriceChangeIndicator'

interface ItemSectionProps {
  title: string
  items: PricingItem[]
  emptyMessage: string
  removingItems: Set<string>
  labels: MultiBookingLabels
  roomId: string
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
}

const ItemSection: React.FC<ItemSectionProps> = memo(
  ({ title, items, emptyMessage, removingItems, labels, roomId, onRemoveItem }) => {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center justify-between transition-all duration-300',
                removingItems.has(String(item.id)) && 'opacity-50 scale-95'
              )}
            >
              <span className="text-sm text-gray-900">{item.name}</span>
              <div className="flex items-center gap-2">
                <PriceChangeIndicator price={item.price} euroSuffix={labels.euroSuffix} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(roomId, item.id, item.name, item.type)}
                  disabled={removingItems.has(String(item.id))}
                  className="w-5 h-5 p-0 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${item.name}`}
                >
                  {removingItems.has(String(item.id)) ? (
                    <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
                  ) : (
                    <X className="w-3 h-3 text-gray-400" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-400 italic">{emptyMessage}</p>}
        </div>
      </div>
    )
  }
)

ItemSection.displayName = 'ItemSection'

export default ItemSection
