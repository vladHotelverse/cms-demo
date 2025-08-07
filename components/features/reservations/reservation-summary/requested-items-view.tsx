"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, Settings2, Sparkles } from "lucide-react"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import { RequestedItemsHeader } from "./requested-items-header"
import { RoomsTable } from "./rooms-table"
import { ExtrasTable } from "./extras-table"
import { BiddingTable } from "./bidding-table"
import { RequestedItemsData, LegacyRequestedItemsData, RoomItem, ExtraItem, BiddingItem } from "@/data/reservation-items"

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
  dynamicReservationItems: RequestedItemsData | LegacyRequestedItemsData
  onCloseTab?: () => void
  onRecommendClick?: () => void
}

// Helper function to check if data is in legacy format
function isLegacyData(data: any): data is LegacyRequestedItemsData {
  return data && typeof data === 'object' && 
    ('upsell' in data || 'atributos' in data) && 
    !('rooms' in data || 'bidding' in data)
}

// Transform legacy data to new format
function transformLegacyData(data: LegacyRequestedItemsData | RequestedItemsData): RequestedItemsData {
  if (!isLegacyData(data)) {
    return data as RequestedItemsData
  }
  
  // Helper function to convert legacy RequestedItem to RoomItem
  const toRoomItem = (item: any) => ({
    ...item,
    roomType: item.name || 'Standard Room',
    roomNumber: item.roomNumber || undefined,
    attributes: item.attributes || [],
    checkIn: item.checkIn || new Date().toISOString().split('T')[0],
    checkOut: item.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0], // +1 day
    nights: item.nights || 1
  })
  
  // Helper function to convert legacy RequestedItem to ExtraItem
  const toExtraItem = (item: any) => ({
    ...item,
    name: item.name || item.nameKey || 'Unknown Extra',
    description: item.description || item.descriptionKey || '',
    units: item.units || 1,
    type: (item.type as 'service' | 'amenity' | 'transfer') || 'service',
    serviceDate: item.serviceDate || new Date().toISOString().split('T')[0]
  })
  
  // Helper function to convert legacy RequestedItem to BiddingItem
  const toBiddingItem = (item: any) => ({
    ...item,
    pujaType: item.pujaType || item.name || 'General Preference',
    pujaNumber: item.pujaNumber || undefined,
    attributes: item.attributes || [],
    dateCreated: item.dateCreated || item.dateRequested || new Date().toISOString().split('T')[0],
    dateModified: item.dateModified || new Date().toISOString().split('T')[0]
  })
  
  // Transform legacy structure to new structure
  return {
    rooms: (data.upsell || []).map(toRoomItem), // upsell items become room items
    extras: (data.extras || []).map(toExtraItem), // extras remain as extras but with required properties
    bidding: (data.atributos || []).map(toBiddingItem) // atributos become bidding items
  }
}

export function RequestedItemsView({ reservation, dynamicReservationItems, onCloseTab, onRecommendClick }: RequestedItemsViewProps) {
  const { t } = useReservationTranslations()

  // Transform data to ensure compatibility
  const transformedData = transformLegacyData(dynamicReservationItems || { rooms: [], extras: [], bidding: [] })
  
  // Check if customer has existing purchase history for recommendation button visibility
  const hasPurchaseHistory = transformedData.rooms.length > 0 || transformedData.extras.length > 0 || transformedData.bidding.length > 0
  
  // Add debugging
  
  // Don't add any extra items - the count should match what was requested

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="space-y-6">
        <RequestedItemsHeader reservation={reservation} requestDate={reservation.checkIn} onCloseTab={onCloseTab} />
        
        {/* Rooms Table */}
        <RoomsTable items={transformedData.rooms} />
        
        {/* Extras Table */}
        <ExtrasTable items={transformedData.extras} />
        
        {/* Bidding Table */}
        <BiddingTable items={transformedData.bidding} />
        
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
            {hasPurchaseHistory && onRecommendClick && (
              <Button variant="default" className="gap-2" onClick={onRecommendClick}>
                <Sparkles className="h-4 w-4" />
                {t('recommend') || 'Get Recommendations'}
              </Button>
            )}
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