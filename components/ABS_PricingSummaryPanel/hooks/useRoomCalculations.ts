import { useMemo } from 'react'
import type { RoomBooking } from '../MultiBookingPricingSummaryPanel'

export const useRoomCalculations = (roomBookings: RoomBooking[]) => {
  const roomTotals = useMemo(() => {
    return roomBookings.reduce(
      (acc, room) => {
        const total = room.items.reduce((sum, item) => sum + item.price, 0)
        acc[room.id] = total
        return acc
      },
      {} as Record<string, number>
    )
  }, [roomBookings])

  const overallTotal = useMemo(() => {
    return Object.values(roomTotals).reduce((sum, total) => sum + total, 0)
  }, [roomTotals])

  const getRoomTotal = (roomId: string) => roomTotals[roomId] || 0

  return {
    roomTotals,
    overallTotal,
    getRoomTotal,
  }
}
