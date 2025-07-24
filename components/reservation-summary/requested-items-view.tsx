"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Settings2 } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { RequestedItemsHeader } from "./requested-items-header"
import { RequestedItemsTable } from "./requested-items-table"
import { RequestedItemsData } from "@/data/reservation-items"

interface RequestedItemsViewProps {
  reservation: {
    id: string
    locator: string
    name: string
    email: string
    checkIn: string
    nights: string
    roomType: string
    aci: string
    status: string
    extras: string
    hasHotelverseRequest: boolean
  }
  dynamicReservationItems: RequestedItemsData
}

export function RequestedItemsView({ reservation, dynamicReservationItems }: RequestedItemsViewProps) {
  const { t } = useReservationTranslations()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <RequestedItemsHeader reservation={reservation} />
        <RequestedItemsTable items={dynamicReservationItems} />
        
        {/* Action Footer */}
        <div className="flex items-center justify-between p-6 bg-muted/20 rounded-lg border border-dashed">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('lastUpdate')}: {t('minutesAgo', { minutes: 5 })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button className="gap-2">
              <Settings2 className="h-4 w-4" />
              {t('manageOrder')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}