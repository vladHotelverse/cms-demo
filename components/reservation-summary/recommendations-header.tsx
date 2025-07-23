import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { recommendationsData } from "@/data/recommendations"

interface RecommendationsHeaderProps {
  reservation: {
    locator: string
    name: string
    checkIn: string
    roomType: string
  }
}

export function RecommendationsHeader({ reservation }: RecommendationsHeaderProps) {
  const { t } = useReservationTranslations()
  
  // Calculate total potential value and commission
  const totalValue = recommendationsData.reduce((sum, item) => sum + item.total, 0)
  const totalCommission = recommendationsData.reduce((sum, item) => sum + item.commission, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t('recommendedServices')}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground/70">{t('locator')}:</span>
              <span className="font-semibold text-foreground">{reservation.locator}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span className="font-medium">{reservation.name}</span>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{reservation.checkIn}</span>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground/70">{t('roomType')}:</span>
              <span className="font-semibold text-foreground">{reservation.roomType}</span>
            </div>
          </div>
        </div>
        
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
          <span className="text-sm font-medium">
            {recommendationsData.length} {t('recommendations').toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground">
            {t('totalCommissionPotential')}: <span className="font-semibold text-emerald-600">€{totalCommission.toFixed(2)}</span>
          </span>
        </div>
      </div>
    </div>
  )
}