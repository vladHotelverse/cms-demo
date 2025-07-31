"use client"

import { Button } from "@/components/ui/button"
import { X, Check, DollarSign } from "lucide-react"
import type { ExtraItem } from "@/data/reservation-items"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"

interface ExtrasTableProps {
  items: ExtraItem[]
}

export function ExtrasTable({ items }: ExtrasTableProps) {
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  if (!items || items.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">Extra</h3>
        </div>
      </div>

      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-1">Agents</div>
          <div className="col-span-1">Commission</div>
          <div className="col-span-1">Supplements</div>
          <div className="col-span-2">Extras</div>
          <div className="col-span-1">Units</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Date Requested</div>
          <div className="col-span-2">Date Service</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <ExtraRow 
            key={item.id} 
            item={item} 
            onStatusUpdate={(status) => updateItemStatus('extras', item.id, status)}
            onDelete={() => deleteItem('extras', item.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface ExtraRowProps {
  item: ExtraItem
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function ExtraRow({ item, onStatusUpdate, onDelete }: ExtraRowProps) {
  const { t } = useReservationTranslations()
  
  // Helper function to get type display text based on screenshot examples
  const getTypeDisplay = (type: string, units: number) => {
    switch(type) {
      case 'service':
        return units > 1 ? 'per service' : 'per person'
      case 'amenity':
        return 'per person'
      case 'transfer':
        return 'per stay'
      default:
        return 'per service'
    }
  }
  
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Agent */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.agent || 'Emma Davis'}
          </div>
        </div>

        {/* Commission */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.agent !== 'Online' && item.commission ? 
              `${item.commission.toFixed(1)} EUR` : 
              '1.5 EUR'
            }
          </div>
        </div>

        {/* Supplements */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.price > 0 ? `${item.price} EUR` : '15 EUR'}
          </div>
        </div>

        {/* Extras */}
        <div className="col-span-2">
          <div className="text-sm font-medium text-gray-900">
            {item.nameKey ? t(item.nameKey) : (item.name || 'Spa Service')}
          </div>
        </div>

        {/* Units */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.units || 2}
          </div>
        </div>

        {/* Type */}
        <div className="col-span-1">
          <div className="text-sm text-gray-600">
            {getTypeDisplay(item.type, item.units || 2)}
          </div>
        </div>

        {/* Date Requested */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600">
            {item.dateRequested ? 
              new Date(item.dateRequested).toLocaleDateString('en-CA') : 
              '2024-01-20'
            }
          </div>
        </div>

        {/* Date Service */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600">
            {item.serviceDate ? 
              new Date(item.serviceDate).toLocaleDateString('en-CA') : 
              '2024-01-22'
            }
          </div>
        </div>

        {/* Action */}
        <div className="col-span-1 flex items-center justify-center gap-2">
          {item.status === 'confirmed' ? (
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => onStatusUpdate('confirmed')}
              aria-label={`Confirm ${item.name}`}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
            aria-label={`Delete ${item.name}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}