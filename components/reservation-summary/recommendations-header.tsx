import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Coins } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { Recommendation } from "@/data/recommendations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Segments available for selection
const segments = [
  { id: "loyalty1", name: "Loyalty 1 (5%)" },
  { id: "loyalty2", name: "Loyalty 2 (10%)" },
  { id: "loyalty3", name: "Loyalty 3 (15%)" },
  { id: "vip1", name: "VIP 1 (20%)" },
  { id: "vip2", name: "VIP 2 (25%)" },
  { id: "vip3", name: "VIP 3 (100%)" },
]

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
  const { acceptedRecommendations } = useReservationSummaryStore()
  const [selectedSegment, setSelectedSegment] = useState("loyalty2")
  
  // Use provided recommendations or fallback to empty array
  const items = recommendations || []
  
  // Calculate counts
  const acceptedCount = acceptedRecommendations.length
  const pendingCount = items.length - acceptedCount
  
  // Calculate total potential value and commission
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalCommission = items.reduce((sum, item) => sum + item.commission, 0)

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">{t('recommendedServices')}</h1>
      
      {/* Booking Information Bar - Similar to items preview but as part of recommendations */}
      <div className="flex items-start justify-between">
        <Card className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">BOOKING ID</span>
              <p className="text-sm font-semibold">{reservation.locator}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">GUEST</span>
              <p className="text-sm font-semibold">{reservation.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CHECK-IN</span>
              <p className="text-sm font-semibold">{reservation.checkIn}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ROOM</span>
              <p className="text-sm font-semibold">{reservation.roomType}</p>
            </div>
          </div>
        </Card>
        
        <div className="flex gap-4">
          <Card className="px-4 py-3">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">EST. COMMISSION</p>
              <p className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-1">
                <div className="bg-green-100 p-1 rounded-full">
                  <Coins className="h-4 w-4 text-green-600" />
                </div>
                €{totalCommission.toFixed(2)}
              </p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium">
            {acceptedCount} {t('confirmed')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium">
            {pendingCount} {t('pendingHotel')}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Star className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {acceptedCount} {t('totalServices')}
          </span>
        </div>
      </div>
    </div>
  )
}