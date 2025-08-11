"use client"

import { useState, useCallback } from "react"
import type { RoomStatus } from "@/lib/types/booking"

export interface RoomStatusUpdate {
  bookingId: string
  roomNumber: number
  status: RoomStatus
  hasKey: boolean
  hasChooseRoom: boolean
}

export interface UseRoomStatusReturn {
  updating: boolean
  error: string | null
  updateRoomStatus: (update: RoomStatusUpdate) => Promise<void>
  assignRoom: (bookingId: string, roomNumber: number) => Promise<void>
  assignKey: (bookingId: string, hasKey: boolean) => Promise<void>
  clearError: () => void
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useRoomStatus(): UseRoomStatusReturn {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRoomStatus = useCallback(async (update: RoomStatusUpdate) => {
    try {
      setUpdating(true)
      setError(null)
      
      // Simulate API call
      await delay(500)
      
      // In a real app, this would update the backend
      console.log("Room status updated:", update)
      
      // Here you would typically trigger a refetch of bookings data
      // or update local state through a context/store
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update room status"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }, [])

  const assignRoom = useCallback(async (bookingId: string, roomNumber: number) => {
    try {
      setUpdating(true)
      setError(null)
      
      // Simulate API call
      await delay(300)
      
      console.log(`Room ${roomNumber} assigned to booking ${bookingId}`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign room"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }, [])

  const assignKey = useCallback(async (bookingId: string, hasKey: boolean) => {
    try {
      setUpdating(true)
      setError(null)
      
      // Simulate API call
      await delay(200)
      
      console.log(`Key ${hasKey ? 'assigned' : 'unassigned'} for booking ${bookingId}`)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update key status"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    updating,
    error,
    updateRoomStatus,
    assignRoom,
    assignKey,
    clearError
  }
}