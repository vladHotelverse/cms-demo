"use client"

import { Button } from "@/components/ui/button"
import { X, Check, Calendar } from "lucide-react"
import type { BiddingItem } from "@/data/reservation-items"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"

interface BiddingTableProps {
  items: BiddingItem[]
}

export function BiddingTable({ items }: BiddingTableProps) {
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  if (!items || items.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">Bidding</h3>
        </div>
      </div>

      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-2">Amount</div>
          <div className="col-span-3">Room Type</div>
          <div className="col-span-2">Date Created</div>
          <div className="col-span-2">Date Rejected</div>
          <div className="col-span-3 text-center">Action</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <BiddingRow 
            key={item.id} 
            item={item} 
            onStatusUpdate={(status) => updateItemStatus('bidding', item.id, status)}
            onDelete={() => deleteItem('bidding', item.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface BiddingRowProps {
  item: BiddingItem
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function BiddingRow({ item, onStatusUpdate, onDelete }: BiddingRowProps) {
  const { t } = useReservationTranslations()
  
  // Calculate if this bid was rejected (for demo purposes, randomly determine some as rejected)
  const isRejected = item.status === 'pending_hotel' && Math.random() > 0.6
  const rejectionDate = isRejected ? item.dateModified : null
  
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Amount */}
        <div className="col-span-2">
          <div className="text-sm font-medium text-gray-900">
            {item.price > 0 ? `${item.price} EUR` : '150 EUR'}
          </div>
        </div>

        {/* Room Type */}
        <div className="col-span-3">
          <div className="text-sm font-medium text-gray-900">
            {item.pujaType || 'Standard Room'}
          </div>
        </div>

        {/* Date Created */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600">
            {item.dateCreated ? 
              new Date(item.dateCreated).toLocaleDateString('en-CA') : 
              '2024-01-12'
            }
          </div>
        </div>

        {/* Date Rejected */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600">
            {rejectionDate ? 
              new Date(rejectionDate).toLocaleDateString('en-CA') : 
              '-'
            }
          </div>
        </div>

        {/* Action */}
        <div className="col-span-3 flex items-center justify-center gap-2">
          {isRejected ? (
            <span className="text-sm text-gray-500">Rejected</span>
          ) : item.status === 'confirmed' ? (
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => onStatusUpdate('confirmed')}
              aria-label={`Confirm bid for ${item.pujaType}`}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
            aria-label={`Delete bid for ${item.pujaType}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}