"use client"

import React, { memo, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings2 } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { RequestedItemsHeader } from "./requested-items-header"
import { RoomsTable } from "./rooms-table"
import { ExtrasTable } from "./extras-table"
import { BiddingTable } from "./bidding-table"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { TableErrorBoundary } from "./error-boundary"
import { SearchAndFilters } from "./search-and-filters"
import { BulkActions } from "./bulk-actions"
import { 
  TableLoadingSkeleton, 
  DataLoadingState, 
  LoadingOverlay,
  InlineLoader
} from "./loading-states"
import { getTimeAgo } from "@/lib/date-utils"

interface RefactoredItemsViewProps {
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
  onCloseTab?: () => void
}

export function RefactoredItemsView({ reservation, onCloseTab }: RefactoredItemsViewProps) {
  const { t } = useReservationTranslations()
  const { requestedItems } = useReservationSummaryStore()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <RequestedItemsHeader reservation={reservation} requestDate={reservation.checkIn} onCloseTab={onCloseTab} />
        
        {/* Rooms Table */}
        <TableErrorBoundary tableName="Rooms">
          <RoomsTable items={requestedItems.rooms} />
        </TableErrorBoundary>
        
        {/* Extras Table */}
        <TableErrorBoundary tableName="Extras">
          <ExtrasTable items={requestedItems.extras} />
        </TableErrorBoundary>
        
        {/* Bidding Table */}
        <TableErrorBoundary tableName="Bidding">
          <BiddingTable items={requestedItems.bidding} />
        </TableErrorBoundary>
        
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

/**
 * Usage Example:
 * 
 * const sampleReservation = {
 *   id: "12345",
 *   locator: "ABC123",
 *   name: "John Doe",
 *   email: "john@example.com",
 *   checkIn: "2025-07-19",
 *   nights: "4",
 *   roomType: "Superior Room",
 *   aci: "ACI123",
 *   status: "confirmed",
 *   extras: "2",
 *   hasHotelverseRequest: true
 * }
 * 
 * <RefactoredItemsView reservation={sampleReservation} />
 */