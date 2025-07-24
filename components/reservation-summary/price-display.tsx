import { useState, useRef, useEffect } from 'react'
import { useReservationTranslations } from '@/hooks/use-reservation-translations'
import { cn } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PriceDisplayProps {
  pricePerUnit: number
  pricingType: 'night' | 'person' | 'service'
  totalPrice: number
  commission: number
}

// Segments available for selection
const segments = [
  { id: "loyalty1", name: "Loyalty 1 (5%)" },
  { id: "loyalty2", name: "Loyalty 2 (10%)" },
  { id: "loyalty3", name: "Loyalty 3 (15%)" },
  { id: "vip1", name: "VIP 1 (20%)" },
  { id: "vip2", name: "VIP 2 (25%)" },
  { id: "vip3", name: "VIP 3 (100%)" },
]

export function PriceDisplay({ pricePerUnit, pricingType, totalPrice, commission }: PriceDisplayProps) {
  const { t } = useReservationTranslations()
  const [selectedSegment, setSelectedSegment] = useState("loyalty2")
  const [showSegmentSelector, setShowSegmentSelector] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
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

  const handlePencilClick = () => {
    setShowSegmentSelector(!showSegmentSelector)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSegmentSelector(false)
      }
    }

    if (showSegmentSelector) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSegmentSelector])
  
  return (
    <div className="relative">
      <div className="flex flex-col gap-2 min-w-[140px]">
        {/* Price per unit */}
        <div className="relative">
          <div className="absolute inset-0 bg-slate-100 rounded-lg" />
          <div className="relative px-6 py-3 text-center">
            <div className="text-xl font-bold tracking-tight">€{pricePerUnit.toFixed(2)}</div>
            <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
              {getPricingLabel()}
            </div>
            {/* Pencil Icon */}
            <button
              onClick={handlePencilClick}
              className="absolute top-1 right-1 p-1.5 hover:bg-slate-200 rounded-full transition-colors"
            >
              <Pencil className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      
        {/* Total price */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/5 rounded-lg" />
          <div className="relative px-6 py-3 text-center">
            <div className="text-lg font-semibold">€{totalPrice.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{t('total')}</div>
          </div>
        </div>
        
        {/* Commission */}
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-lg" />
          <div className="relative px-6 py-3 text-center">
            <div className="text-lg font-semibold text-emerald-700">€{commission.toFixed(2)}</div>
            <div className="text-xs text-emerald-600/80 uppercase tracking-wide font-medium">{t('commission')}</div>
          </div>
        </div>
      </div>

      {/* Segment Selector Dropdown - positioned to the right */}
      {showSegmentSelector && (
        <div ref={dropdownRef} className="absolute left-full top-0 ml-3 z-50 w-48">
          <div className="bg-white border rounded-lg shadow-xl p-4">
            <div className="text-sm font-medium text-gray-700 mb-3">
              {t("currentLanguage") === "es" ? "Segmento:" : "Segment:"}
            </div>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment.id} value={segment.id}>
                    {segment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Arrow pointing to the price display */}
          <div className="absolute left-0 top-4 transform -translate-x-full">
            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-transparent border-r-white"></div>
            <div className="w-0 h-0 border-t-[9px] border-b-[9px] border-r-[9px] border-transparent border-r-gray-200 -mt-[17px] -mr-[1px]"></div>
          </div>
        </div>
      )}
    </div>
  )
}