import { Card } from "@/components/ui/card"
import { Package2 } from "lucide-react"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"

interface RequestedItemsHeaderProps {
  reservation: {
    locator: string
    name: string
    checkIn: string
    roomType: string
  }
}

export function RequestedItemsHeader({ reservation }: RequestedItemsHeaderProps) {
  const { t } = useReservationTranslations()
  const { calculateGrandTotal, requestedItems } = useReservationSummaryStore()
  const total = calculateGrandTotal()
  const commission = total * 0.15

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t('requestSummary')}</h1>
      
      <div className="flex items-start justify-between">
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('locator')}</span>
              <p className="text-sm font-semibold">{reservation.locator}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('guest')}</span>
              <p className="text-sm font-semibold">{reservation.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('checkIn')}</span>
              <p className="text-sm font-semibold">{reservation.checkIn}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('roomType')}</span>
              <p className="text-sm font-semibold">{reservation.roomType}</p>
            </div>
          </div>
        </Card>
        
        <div className="flex gap-4">
          <Card className="px-4 py-3">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('totalOrder')}</p>
              <p className="text-2xl font-bold">€{total}</p>
            </div>
          </Card>
          <Card className="px-4 py-3">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('estimatedCommission')}</p>
              <p className="text-xl font-bold text-emerald-600">€{commission.toFixed(2)}</p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium">
            {Object.values(requestedItems).flat().filter(item => item.status === 'confirmed').length} {t('confirmed')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium">
            {Object.values(requestedItems).flat().filter(item => item.status === 'pending_hotel').length} {t('pendingHotel')}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {Object.values(requestedItems).flat().length} {t('totalServices')}
          </span>
        </div>
      </div>
    </div>
  )
}