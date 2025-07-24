import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { Recommendation } from "@/data/recommendations"

interface RecommendationsHeaderProps {
  reservation: {
    locator: string
    name: string
    checkIn: string
    roomType: string
  }
  recommendations?: Recommendation[]
  onViewFullCatalog?: () => void
}

export function RecommendationsHeader({ reservation, recommendations, onViewFullCatalog }: RecommendationsHeaderProps) {
  const { t } = useReservationTranslations()
  
  // Use provided recommendations or fallback to empty array
  const items = recommendations || []
  
  // Calculate total potential value and commission
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalCommission = items.reduce((sum, item) => sum + item.commission, 0)

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t('recommendedServices')}</h1>
      
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
        
        <Card className="px-4 py-3">
          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('estimatedCommission')}</p>
            <p className="text-xl font-bold text-emerald-600">€{totalCommission.toFixed(2)}</p>
          </div>
        </Card>
      </div>
      
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500" />
          <span className="text-lg font-medium">
            {items.length} {t('recommendations').toLowerCase()}
          </span>
          {onViewFullCatalog && (
            <Button 
              variant="outline" 
              size="sm"
              className="ml-2"
              onClick={onViewFullCatalog}
            >
              {t('viewFullCatalog')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}