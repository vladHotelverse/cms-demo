import { useCallback, useState } from 'react'

export const useAccordionState = (initialRoomId?: string) => {
  const [activeRoom, setActiveRoom] = useState<string | null>(initialRoomId || null)

  const handleAccordionToggle = useCallback((roomId: string) => {
    setActiveRoom((prevActive) => (prevActive === roomId ? null : roomId))
  }, [])

  const isRoomActive = useCallback(
    (roomId: string) => {
      return activeRoom === roomId
    },
    [activeRoom]
  )

  return {
    activeRoom,
    handleAccordionToggle,
    isRoomActive,
  }
}
