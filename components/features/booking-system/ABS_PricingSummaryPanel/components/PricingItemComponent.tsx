import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { Button } from '@/components/ui/button'
import PriceChangeIndicator from './PriceChangeIndicator'
import type { PricingItem } from '../types'

interface PricingItemComponentProps {
  item: PricingItem
  euroSuffix: string
  removeLabel: string
  onRemove: () => void
}

const PricingItemComponent: React.FC<PricingItemComponentProps> = ({ item, euroSuffix, removeLabel, onRemove }) => {
  const [showStatusInfo, setShowStatusInfo] = useState(false)

  // Get bid status icon and color (only show for certain statuses)
  const getBidStatusIcon = () => {
    if (item.type !== 'bid' || !item.bidStatus) return null
    
    switch (item.bidStatus) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  // Get item status icon and color
  const getItemStatusIcon = () => {
    if (!item.itemStatus) return null
    
    switch (item.itemStatus) {
      case 'accepted_by_hotel':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected_by_hotel':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'sent_to_hotel':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  // Get status text for display
  const getStatusText = () => {
    if (!item.itemStatus) return null
    
    switch (item.itemStatus) {
      case 'sent_to_hotel':
        return 'Sent to hotel'
      case 'accepted_by_hotel':
        return 'Accepted by hotel'
      case 'rejected_by_hotel':
        return 'Rejected by hotel'
      default:
        return null
    }
  }

  const isBid = item.type === 'bid'

  return (
    <div className="transition-all duration-300 ease-in-out border-b border-gray-100 pb-3 mb-3 last:border-b-0 last:mb-0 last:pb-0">
      <div className={cn(
        "flex justify-between items-center py-2 rounded")}>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm max-w-[200px]",
            isBid && "font-medium text-blue-900"
          )}>{item.name}</span>
          {getBidStatusIcon()}
        </div>
        <div className="flex items-center space-x-2">
          <PriceChangeIndicator 
            price={item.price} 
            euroSuffix={euroSuffix}
            className={cn(
              isBid ? "text-blue-700" : "text-gray-900"
            )}
          />
          <Button
            variant="outline"
            size="icon-xs"
            onClick={onRemove}
            className={cn(
              'rounded-full h-6 w-6 flex items-center justify-center transition-all duration-200',
              isBid 
                ? 'hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 border-blue-200'
                : 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
            )}
            aria-label={removeLabel}
          >
            <X size={12} strokeWidth={2} className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Status at the bottom */}
      {getStatusText() && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getItemStatusIcon()}
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              item.itemStatus === 'accepted_by_hotel' && "bg-green-100 text-green-700",
              item.itemStatus === 'rejected_by_hotel' && "bg-red-100 text-red-700",
              item.itemStatus === 'sent_to_hotel' && "bg-yellow-100 text-yellow-700"
            )}>
              {getStatusText()}
            </span>
          </div>
          {(item.itemStatus && item.statusDescription) && (
            <button
              onClick={() => setShowStatusInfo(!showStatusInfo)}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Toggle status information"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      
      {/* Expandable status description */}
      {showStatusInfo && item.statusDescription && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 border border-blue-200">
          <div className="flex justify-between items-start">
            <span>{item.statusDescription}</span>
            <button
              onClick={() => setShowStatusInfo(false)}
              className="ml-2 p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 text-blue-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PricingItemComponent
