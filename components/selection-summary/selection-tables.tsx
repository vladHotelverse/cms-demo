"use client"

import React, { memo, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { RoomsTable } from '@/components/features/reservations/reservation-summary/rooms-table'
import { ExtrasTable } from '@/components/features/reservations/reservation-summary/extras-table'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoomTableItem, ExtraTableItem } from './types'
import type { SelectionError } from '@/stores/user-selections-store'

interface SelectionTablesProps {
  rooms: RoomTableItem[]
  extras: ExtraTableItem[]
  onRemoveRoom: (roomId: string) => void
  onRemoveExtra: (extraId: string) => void
  onClearRooms: () => void
  onClearExtras: () => void
  isLoading: boolean
  errors: SelectionError[]
  translations: {
    noSelectionsText: string
    noSelectionsSubtext: string
    clearRoomsText: string
    clearExtrasText: string
  }
}

/**
 * Selection tables component with optimized rendering
 */
export const SelectionTables = memo(function SelectionTables({
  rooms,
  extras,
  onRemoveRoom,
  onRemoveExtra,
  onClearRooms,
  onClearExtras,
  isLoading,
  errors,
  translations
}: SelectionTablesProps) {
  // Transform rooms for table compatibility
  const roomTableItems = useMemo<RoomTableItem[]>(() => 
    rooms.map(room => {
      // Calculate nights from checkIn and checkOut dates
      const checkInDate = new Date(room.checkIn)
      const checkOutDate = new Date(room.checkOut)
      const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
      
      return {
        ...room,
        nights,
        commission: room.agent !== 'Online' ? room.price * 0.1 : 0,
        includesHotels: true,
        dateRequested: room.dateRequested || new Date().toLocaleDateString('en-GB'),
        // Ensure UI control flags are present (should come from store, but provide defaults)
        showKeyIcon: room.showKeyIcon ?? false,
        showAlternatives: room.showAlternatives ?? false,
        showAttributes: room.showAttributes ?? false,
        selectionScenario: room.selectionScenario ?? 'choose_room_only',
        alternatives: room.alternatives ?? []
      }
    })
  , [rooms])

  // Transform extras for table compatibility
  const extraTableItems = useMemo<ExtraTableItem[]>(() => 
    extras.map(extra => ({
      ...extra,
      nameKey: undefined
    }))
  , [extras])

  const totalSelections = rooms.length + extras.length

  // Show empty state if no selections
  if (totalSelections === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-4">📋</div>
        <p className="text-lg text-gray-700 mb-2">{translations.noSelectionsText}</p>
        <p className="text-sm text-gray-500">{translations.noSelectionsSubtext}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error summary */}
      {errors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800">Selection Issues</h3>
          </div>
          <ul className="text-sm text-yellow-700 space-y-1">
            {errors.slice(0, 3).map(error => (
              <li key={error.id}>• {error.message}</li>
            ))}
            {errors.length > 3 && (
              <li className="text-yellow-600">... and {errors.length - 3} more issues</li>
            )}
          </ul>
        </div>
      )}

      {/* Rooms Table */}
      {rooms.length > 0 && (
        <div className="relative">
          <div className="absolute top-4 right-16 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearRooms}
              disabled={isLoading}
              className="text-xs text-gray-500 hover:text-red-500 bg-white/80 backdrop-blur-sm"
            >
              {translations.clearRoomsText}
            </Button>
          </div>
          <RoomsTable 
            items={roomTableItems as any} 
            onRemove={onRemoveRoom}
            className={cn(isLoading && "opacity-60")}
          />
          {/* Loading indicator for rooms */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-lg pointer-events-none" />
          )}
        </div>
      )}

      {/* Extras Table */}
      {extras.length > 0 && (
        <div className="relative">
          <div className="absolute top-4 right-16 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearExtras}
              disabled={isLoading}
              className="text-xs text-gray-500 hover:text-red-500 bg-white/80 backdrop-blur-sm"
            >
              {translations.clearExtrasText}
            </Button>
          </div>
          <ExtrasTable 
            items={extraTableItems as any}
            onRemove={onRemoveExtra}
            className={cn(isLoading && "opacity-60")}
          />
          {/* Loading indicator for extras */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] rounded-lg pointer-events-none" />
          )}
        </div>
      )}
    </div>
  )
})

SelectionTables.displayName = 'SelectionTables'