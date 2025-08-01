"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Check, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { RequestedItem, RequestedItemsData } from "@/data/reservation-items"
import { statusConfig, categoryConfig } from "@/data/reservation-configs"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"

interface RequestedItemsTableProps {
  items: RequestedItemsData
}

export function RequestedItemsTable({ items }: RequestedItemsTableProps) {
  const { t } = useReservationTranslations()
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-muted/10 border-b border-border">
        <div className="grid grid-cols-10 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <div className="col-span-1">{t('agent')}</div>
          <div className="col-span-1">{t('supplements')}</div>
          <div className="col-span-1">{t('commission')}</div>
          <div className="col-span-3">{t('room')}</div>
          <div className="col-span-2">{t('dates')}</div>
          <div className="col-span-1">{t('status')}</div>
          <div className="col-span-1 text-center">{t('action')}</div>
        </div>
      </div>

      {/* Items grouped by type - Only show categories with items */}
      {Object.entries(items)
        .filter(([, categoryItems]) => categoryItems.length > 0)
        .map(([category, categoryItems]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig]
        
        return (
          <div key={category}>
            {/* Category Header */}
            <div className="bg-muted/60 border-b border-border">
              <div className="flex items-center gap-2 bg-muted/80 rounded-md px-3 py-2">
                <span className="text-sm font-medium text-foreground uppercase tracking-wide">
                  {t(config.labelKey)}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  ({categoryItems.length} item{categoryItems.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
            
            {/* Category Items */}
            {categoryItems.map((item: RequestedItem) => (
              <RequestedItemRow 
                key={item.id} 
                item={item} 
                category={category as keyof RequestedItemsData}
                onStatusUpdate={(status) => updateItemStatus(category as keyof RequestedItemsData, item.id, status)}
                onDelete={() => deleteItem(category as keyof RequestedItemsData, item.id)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

interface RequestedItemRowProps {
  item: RequestedItem
  category: keyof RequestedItemsData
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function RequestedItemRow({ item, onStatusUpdate, onDelete }: RequestedItemRowProps) {
  const { t } = useReservationTranslations()
  const status = statusConfig[item.status as keyof typeof statusConfig]
  
  return (
    <div className="grid grid-cols-10 gap-4 px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/5 transition-colors items-center">
      {/* Agent */}
      <div className="col-span-1">
        <div className="text-sm font-medium">
          {item.agent || 'Online'}
        </div>
      </div>

      {/* Supplements (Price) */}
      <div className="col-span-1">
        <div className="font-semibold text-sm">
          {item.price > 0 ? `${item.price},00 €` : '0,00 €'}
        </div>
      </div>

      {/* Commission */}
      <div className="col-span-1">
        <div className="text-sm font-medium text-green-600 flex items-center gap-1">
          {item.agent !== 'Online' && item.commission ? (
            <>
              <div className="bg-green-100 p-1 rounded-full">
                <Coins className="h-3 w-3 text-green-600" />
              </div>
              {`${item.commission.toFixed(2)} €`}
            </>
          ) : ''}
        </div>
      </div>

      {/* Room (Service name) */}
      <div className="col-span-3">
        <div className="space-y-0.5">
          <p className="font-medium text-sm text-foreground">
            {item.nameKey ? t(item.nameKey) : item.name}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            {item.descriptionKey ? t(item.descriptionKey) : item.description}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="col-span-2">
        <div className="space-y-0.5">
          <p className="text-sm">19/07/2025 - 23/07/2025</p>
          <p className="text-xs text-muted-foreground">4 nights</p>
        </div>
      </div>

      {/* Status */}
      <div className="col-span-1">
        <Badge className={cn("text-xs font-medium", status.color)}>
          <div className={cn("w-1.5 h-1.5 rounded-full mr-1.5", status.dotColor)} />
          {t(status.labelKey)}
        </Badge>
      </div>

      {/* Actions */}
      <div className="col-span-1 flex items-center justify-center">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-red-500 hover:bg-red-50"
            title={t('decline')}
            onClick={onDelete}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
          {item.status !== 'confirmed' && (
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-green-600 hover:bg-green-50"
              title={t('accept')}
              onClick={() => onStatusUpdate('confirmed')}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}