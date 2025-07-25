import clsx from 'clsx'
import { ShoppingCart } from 'lucide-react'
import type React from 'react'
import { Button } from '../../ui/button'

export interface MobilePricingWidgetProps {
  total: number
  currencySymbol: string
  itemCount: number
  onShowPricing: () => void
  isLoading?: boolean
  className?: string
  summaryButtonLabel: string
  totalUpgradesLabel?: string
  itemsLabel?: string
}

const MobilePricingWidget: React.FC<MobilePricingWidgetProps> = ({
  total,
  currencySymbol,
  itemCount,
  onShowPricing,
  isLoading = false,
  className,
  summaryButtonLabel,
  totalUpgradesLabel = 'Total Upgrades',
  itemsLabel = 'items',
}) => {
  const formatPrice = (price: number): string => {
    const formattedNumber = price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `${currencySymbol}${formattedNumber}`
  }

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 shadow-lg',
        'lg:hidden', // Only show on mobile/tablet
        'transition-transform duration-300 ease-in-out',
        'safe-area-inset-bottom', // Handle device safe areas
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex flex-col text-left">
          <span className="text-sm text-neutral-500">{totalUpgradesLabel}</span>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 w-20 bg-neutral-100 rounded" />
            </div>
          ) : (
            <span className="text-lg font-bold text-blue-600 whitespace-nowrap">{formatPrice(total)}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {itemCount > 0 && (
            <span className="inline-flex items-center rounded-xl bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              {itemCount} {itemsLabel}
            </span>
          )}
          <Button
            onClick={onShowPricing}
            variant="outline"
            className="h-10 px-4 py-2 border border-neutral-200 bg-white hover:bg-neutral-50"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {summaryButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MobilePricingWidget
