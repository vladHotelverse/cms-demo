"use client"

import React from 'react'
import { Hotel, Package, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SelectionHeaderProps {
  counts: {
    rooms: number
    extras: number
    total: number
  }
  totalPrice: number
  isLoading: boolean
  onClearAll: () => void
  translations: {
    roomsTitle: string
    extrasTitle: string
    totalPriceText: string
    clearAllText: string
  }
}

/**
 * Selection summary header component
 * Displays counts, total price, and clear all button
 */
export function SelectionHeader({
  counts,
  totalPrice,
  isLoading,
  onClearAll,
  translations
}: SelectionHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Hotel className="h-5 w-5 text-blue-600" />
          <span className="font-medium">{translations.roomsTitle}</span>
          <Badge variant="secondary" className="min-w-[24px] justify-center">
            {counts.rooms}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-green-600" />
          <span className="font-medium">{translations.extrasTitle}</span>
          <Badge variant="secondary" className="min-w-[24px] justify-center">
            {counts.extras}
          </Badge>
        </div>
      </div>
      
      {counts.total > 0 && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">{translations.totalPriceText}</p>
            <p className="text-lg font-semibold">
              €{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {translations.clearAllText}
          </Button>
        </div>
      )}
    </div>
  )
}