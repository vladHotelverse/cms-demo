import clsx from 'clsx'
import { CreditCard } from 'lucide-react'
import type React from 'react'
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from './LoadingSkeleton'

interface PriceBreakdownLabels {
  subtotalLabel: string
  totalLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmButtonLabel: string
  loadingLabel: string
  euroSuffix: string
}

interface PriceBreakdownProps {
  subtotal: number
  isLoading: boolean
  labels: PriceBreakdownLabels
  currency?: string
  locale?: string
  onConfirm?: () => void
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  isLoading,
  labels,
  currency,
  locale,
  onConfirm,
}) => {
  // Use centralized currency formatting hook
  const formatPrice = useCurrencyFormatter({ currency, locale, euroSuffix: labels.euroSuffix })

  return (
    <>
      {/* Separator before pricing */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold">{labels.totalLabel}</span>
          {isLoading ? (
            <LoadingSkeleton width="w-20" height="h-6" />
          ) : (
            <span className={clsx('text-lg font-bold', 'transition-all duration-500 ease-in-out', 'whitespace-nowrap')}>
              {formatPrice(subtotal)}
            </span>
          )}
        </div>
      </div>

      {/* Payment information */}
      <div className="payment-info">
        <div className="flex items-center mb-3">
          <CreditCard size={20} strokeWidth={2} className="h-5 w-5 text-neutral-500 mr-2" />
          <span className="text-sm">{labels.payAtHotelLabel}</span>
        </div>

        <Button
          type="button"
          variant="link"
          size="sm"
          className="pl-0 text-sm text-neutral-500 font-medium underline bg-transparent border-none cursor-pointer hover:text-neutral-700 transition-colors"
        >
          {labels.viewTermsLabel}
        </Button>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={onConfirm}
        disabled={isLoading}
        variant="black"
        className="inline-flex w-full items-center justify-center py-3 transition-all duration-200 hover:shadow-md disabled:hover:shadow-none cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-t-2 border-b-2 border-white rounded-full" />
            <span>{labels.loadingLabel}</span>
          </div>
        ) : (
          labels.confirmButtonLabel
        )}
      </Button>
    </>
  )
}

export default PriceBreakdown
export type { PriceBreakdownLabels }
