import { useCallback, useState } from 'react'
import type { PricingItem } from '../types'
import type { RoomBooking, MultiBookingLabels } from '../MultiBookingPricingSummaryPanel'

interface UseItemManagementProps {
  roomBookings: RoomBooking[]
  labels: MultiBookingLabels
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

export const useItemManagement = ({ roomBookings, labels, onRemoveItem, showToast }: UseItemManagementProps) => {
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const handleRemoveItem = useCallback(
    async (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => {
      const room = roomBookings.find((r) => r.id === roomId)
      if (room?.items.find((item) => item.id === itemId)?.type === 'room') {
        showToast(labels.cannotRemoveRoom, 'error')
        return
      }

      const stringId = String(itemId)
      setRemovingItems((prev) => new Set([...prev, stringId]))

      // Simulate removal delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onRemoveItem(roomId, itemId, itemName, itemType)

      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(stringId)
        return newSet
      })

      showToast(`${itemName} ${labels.removedSuccessfully}`, 'info')
    },
    [roomBookings, labels, onRemoveItem, showToast]
  )

  return {
    removingItems,
    handleRemoveItem,
  }
}
