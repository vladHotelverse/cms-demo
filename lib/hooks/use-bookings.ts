"use client"

import { useState, useEffect, useMemo } from "react"
import type { Booking, BookingFilters, BookingSortOptions, BookingStatus } from "@/lib/types/booking"
import { mockBookings } from "@/lib/data/mock-bookings"

export interface UseBookingsReturn {
  bookings: Booking[]
  loading: boolean
  error: string | null
  filters: BookingFilters
  sortOptions: BookingSortOptions
  totalCount: number
  filteredCount: number
  roomTypes: string[]
  setFilters: (filters: BookingFilters) => void
  setSortOptions: (sort: BookingSortOptions) => void
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<void>
  refreshBookings: () => Promise<void>
  clearError: () => void
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useBookings(): UseBookingsReturn {
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<BookingFilters>({})
  const [sortOptions, setSortOptions] = useState<BookingSortOptions>({
    field: "checkIn",
    direction: "asc"
  })

  // Initial data fetch
  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate API call
      await delay(800)
      
      // In a real app, this would be an API call
      setAllBookings(mockBookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...allBookings]

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(booking => filters.status!.includes(booking.status))
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(booking => {
        const checkIn = booking.checkIn
        return checkIn >= filters.dateRange!.start && checkIn <= filters.dateRange!.end
      })
    }

    // Apply room type filter
    if (filters.roomType && filters.roomType.length > 0) {
      filtered = filtered.filter(booking => 
        filters.roomType!.includes(booking.room.type)
      )
    }

    // Apply guest name filter
    if (filters.guestName && filters.guestName.trim()) {
      const searchTerm = filters.guestName.toLowerCase().trim()
      filtered = filtered.filter(booking =>
        booking.guest.name.toLowerCase().includes(searchTerm) ||
        booking.locator.toLowerCase().includes(searchTerm)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortOptions.field) {
        case "guest.name":
          aValue = a.guest.name
          bValue = b.guest.name
          break
        case "room.type":
          aValue = a.room.type
          bValue = b.room.type
          break
        case "room.number":
          aValue = a.room.number
          bValue = b.room.number
          break
        default:
          aValue = a[sortOptions.field as keyof Booking]
          bValue = b[sortOptions.field as keyof Booking]
      }

      // Handle date sorting
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOptions.direction === "asc" 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }

      // Handle string/number sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        const result = aValue.localeCompare(bValue)
        return sortOptions.direction === "asc" ? result : -result
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOptions.direction === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [allBookings, filters, sortOptions])

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      setError(null)
      
      // Simulate API call
      await delay(300)
      
      setAllBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status, updatedAt: new Date() }
          : booking
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking status")
    }
  }

  const refreshBookings = async () => {
    await fetchBookings()
  }

  const clearError = () => {
    setError(null)
  }

  // Get unique room types for filters
  const roomTypes = useMemo(() => {
    const types = [...new Set(allBookings.map(booking => booking.room.type))]
    return types.sort()
  }, [allBookings])

  return {
    bookings: filteredAndSortedBookings,
    loading,
    error,
    filters,
    sortOptions,
    totalCount: allBookings.length,
    filteredCount: filteredAndSortedBookings.length,
    roomTypes,
    setFilters,
    setSortOptions,
    updateBookingStatus,
    refreshBookings,
    clearError
  }
}