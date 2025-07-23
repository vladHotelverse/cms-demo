import { Card } from "@/components/ui/card"
import { Package2 } from "lucide-react"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"

interface RequestedItemsHeaderProps {
  reservation: {
    locator: string
    name: string
    checkIn: string
    roomType: string
  }
}

export function RequestedItemsHeader({ reservation }: RequestedItemsHeaderProps) {
  const { calculateGrandTotal, requestedItems } = useReservationSummaryStore()
  const total = calculateGrandTotal()
  const commission = total * 0.15

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Resumen de Solicitudes</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground/70">Localizador:</span>
              <span className="font-semibold text-foreground">{reservation.locator}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span className="font-medium">{reservation.name}</span>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{reservation.checkIn}</span>
            <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-muted-foreground/70">Habitación:</span>
              <span className="font-semibold text-foreground">{reservation.roomType}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Card className="px-4 py-3">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Pedido</p>
              <p className="text-2xl font-bold">€{total}</p>
            </div>
          </Card>
          <Card className="px-4 py-3">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Comisión Est.</p>
              <p className="text-xl font-bold text-emerald-600">€{commission.toFixed(2)}</p>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium">
            {Object.values(requestedItems).flat().filter(item => item.status === 'confirmed').length} Confirmados
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-sm font-medium">
            {Object.values(requestedItems).flat().filter(item => item.status === 'pending_hotel').length} Pendiente Hotel
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {Object.values(requestedItems).flat().length} servicios totales
          </span>
        </div>
      </div>
    </div>
  )
}