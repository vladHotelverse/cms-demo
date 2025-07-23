"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { RoomType } from '@/data/room-type-config'

interface RoomContextType {
  currentRoomType: RoomType
  setCurrentRoomType: (roomType: RoomType) => void
  reservationDetails: {
    nights: number
    guests: number
    aci: string
    checkInDate: Date
  } | null
  setReservationDetails: (details: {
    nights: number
    guests: number
    aci: string
    checkInDate: Date
  }) => void
}

const RoomContext = createContext<RoomContextType | undefined>(undefined)

interface RoomProviderProps {
  children: ReactNode
  initialRoomType?: RoomType
}

export function RoomProvider({ children, initialRoomType = 'Standard' }: RoomProviderProps) {
  const [currentRoomType, setCurrentRoomType] = useState<RoomType>(initialRoomType)
  const [reservationDetails, setReservationDetails] = useState<{
    nights: number
    guests: number
    aci: string
    checkInDate: Date
  } | null>(null)

  return (
    <RoomContext.Provider 
      value={{
        currentRoomType,
        setCurrentRoomType,
        reservationDetails,
        setReservationDetails
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider')
  }
  return context
}

// Helper hook for getting dynamic data based on current room context
export function useDynamicReservationData() {
  const { currentRoomType, reservationDetails } = useRoom()
  
  if (!reservationDetails) {
    return null
  }

  // This would typically import and use the dynamic generators
  // For now, return the basic structure
  return {
    roomType: currentRoomType,
    context: {
      roomType: currentRoomType,
      nights: reservationDetails.nights,
      guests: reservationDetails.guests,
      checkInDate: reservationDetails.checkInDate,
      isBusinessGuest: currentRoomType === 'Deluxe' || currentRoomType === 'Suite' || currentRoomType === 'Presidential Suite',
      isCouple: reservationDetails.aci.startsWith('2/0/0'),
      hasChildren: reservationDetails.aci.includes('/1/') || reservationDetails.aci.includes('/2/')
    }
  }
}