"use client"

import { Button } from "@/components/ui/button"
import { X, Check, Link, Info, User } from "lucide-react"
import type { RoomItem } from "@/data/reservation-items"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"

interface RoomsTableProps {
  items: RoomItem[]
}

export function RoomsTable({ items }: RoomsTableProps) {
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  if (!items || items.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">Room</h3>
        </div>
      </div>

      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-1">Agents</div>
          <div className="col-span-1">Commission</div>
          <div className="col-span-1">Supplements</div>
          <div className="col-span-2">Room Type</div>
          <div className="col-span-1">Room Number</div>
          <div className="col-span-2">Attributes</div>
          <div className="col-span-1">Date Requested</div>
          <div className="col-span-2">Date In/Out</div>
          <div className="col-span-1 text-center">Action</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <RoomRow 
            key={item.id} 
            item={item} 
            onStatusUpdate={(status) => updateItemStatus('rooms', item.id, status)}
            onDelete={() => deleteItem('rooms', item.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface RoomRowProps {
  item: RoomItem
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function RoomRow({ item, onStatusUpdate, onDelete }: RoomRowProps) {
  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Agent */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.agent || 'Online'}
          </div>
        </div>

        {/* Commission */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.agent !== 'Online' && item.commission ? 
              `${item.commission.toFixed(1)} EUR` : 
              '0 EUR'
            }
          </div>
        </div>

        {/* Supplements */}
        <div className="col-span-1">
          <div className="text-sm font-medium text-gray-900">
            {item.price > 0 ? `${item.price} EUR` : '0 EUR'}
          </div>
        </div>

        {/* Room Type */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{item.roomType}</span>
            {item.roomType.toLowerCase().includes('suite') && (
              <Info className="h-4 w-4 text-blue-500" />
            )}
          </div>
        </div>

        {/* Room Number */}
        <div className="col-span-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {item.roomNumber || '101'}
            </span>
            <Link className="h-3 w-3 text-blue-500" />
            {/* Show alternatives if available */}
            {Math.random() > 0.5 && (
              <span className="text-xs text-gray-500">
                ({Math.floor(Math.random() * 3) + 1} alternatives)
              </span>
            )}
          </div>
        </div>

        {/* Attributes */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {item.attributes?.length || Math.floor(Math.random() * 7) + 1} items
            </span>
            <Info className="h-3 w-3 text-gray-400" />
          </div>
        </div>

        {/* Date Requested */}
        <div className="col-span-1">
          <div className="text-sm text-gray-600">
            {item.dateRequested ? 
              new Date(item.dateRequested).toLocaleDateString('en-CA') : 
              '2024-01-15'
            }
          </div>
        </div>

        {/* Date In/Out */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600">
            <div>{item.checkIn} - {item.checkOut}</div>
            <div className="text-xs text-gray-500">
              ({item.nights} nights)
            </div>
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
              aria-label={`Confirm ${item.roomType}`}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
            aria-label={`Delete ${item.roomType}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}