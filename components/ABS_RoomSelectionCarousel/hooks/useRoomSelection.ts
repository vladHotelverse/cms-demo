import { useState, useCallback } from 'react'
import type { RoomOption } from '../types'

export interface UseRoomSelectionProps {
  initialSelectedRoom?: RoomOption | null
  onRoomSelected?: (room: RoomOption) => void
}

export interface UseRoomSelectionReturn {
  selectedRoom: RoomOption | null
  selectRoom: (room: RoomOption) => void
}

export const useRoomSelection = ({
  initialSelectedRoom = null,
  onRoomSelected,
}: UseRoomSelectionProps): UseRoomSelectionReturn => {
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(initialSelectedRoom)

  // Memoized room selection handler
  const selectRoom = useCallback(
    (room: RoomOption) => {
      setSelectedRoom(room)
      if (onRoomSelected) {
        onRoomSelected(room)
      }
    },
    [onRoomSelected]
  )

  return {
    selectedRoom,
    selectRoom,
  }
}
