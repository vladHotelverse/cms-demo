import { useReservationTranslations } from '@/hooks/use-reservation-translations'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  pricePerUnit: number
  pricingType: 'night' | 'person' | 'service'
  totalPrice: number
  commission: number
}

export function PriceDisplay({ pricePerUnit, pricingType, totalPrice, commission }: PriceDisplayProps) {
  const { t } = useReservationTranslations()
  
  const getPricingLabel = () => {
    switch (pricingType) {
      case 'night':
        return t('perNight')
      case 'person':
        return t('perPerson')
      case 'service':
        return t('perService') || 'POR SERVICIO'
      default:
        return ''
    }
  }
  
  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      {/* Price per unit */}
      <div className="relative">
        <div className="absolute inset-0 bg-slate-100 rounded-lg" />
        <div className="relative px-3 py-2 text-center">
          <div className="text-xl font-bold tracking-tight">€{pricePerUnit.toFixed(2)}</div>
          <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
            {getPricingLabel()}
          </div>
        </div>
      </div>
      
      {/* Total price */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/5 rounded-lg" />
        <div className="relative px-3 py-2 text-center">
          <div className="text-lg font-semibold">€{totalPrice.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('total')}</div>
        </div>
      </div>
      
      {/* Commission */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/10 rounded-lg" />
        <div className="relative px-3 py-2 text-center">
          <div className="text-lg font-semibold text-emerald-700">€{commission.toFixed(2)}</div>
          <div className="text-xs text-emerald-600/80 uppercase tracking-wide font-medium">{t('commission')}</div>
        </div>
      </div>
    </div>
  )
}