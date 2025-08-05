import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Coins } from "lucide-react"
import { Recommendation } from "@/data/recommendations"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"

interface RecommendationsSummaryProps {
  recommendations: Recommendation[]
}

export function RecommendationsSummary({ recommendations }: RecommendationsSummaryProps) {
  const { setShowDetailedView, calculateTotalCommission } = useReservationSummaryStore()
  const totalCommission = calculateTotalCommission(recommendations)

  return (
    <Card className="bg-muted/30 mt-6">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Potencial de comisión total</p>
            <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <div className="bg-green-100 p-1 rounded-full">
                <Coins className="h-5 w-5 text-green-600" />
              </div>
              €{totalCommission.toFixed(2)}
            </p>
          </div>
          <Button 
            onClick={() => setShowDetailedView(true)}
            variant="outline"
            className="gap-2"
          >
            Ver catálogo completo
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}