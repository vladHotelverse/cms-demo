import { Calendar, ChevronDown, ChevronRight, Home, Tag, Users } from 'lucide-react'
import React from 'react'
import { useState, useEffect } from 'react'
import type { RoomBookingInfo, MultiBookingInfoLabels, IconName } from './types'

// Type guard to validate if a string is a valid IconName
const isValidIconName = (name: string): name is IconName => {
  return ['Tag', 'Calendar', 'Home', 'Users'].includes(name)
}

export const getIcon = (iconName: IconName | string, className = 'h-4 w-4 text-neutral-400'): React.ReactNode => {
  // Validate that the iconName is a valid IconName
  if (!isValidIconName(iconName)) return null

  const iconComponents: Record<IconName, React.ComponentType<any>> = {
    Tag: Tag,
    Calendar: Calendar,
    Home: Home,
    Users: Users,
  }

  const IconComponent = iconComponents[iconName]
  return IconComponent ? React.createElement(IconComponent, { className }) : null
}

export const getChevronIcon = (isExpanded: boolean): React.ReactNode => {
  return isExpanded
    ? React.createElement(ChevronDown, { className: 'h-4 w-4 text-gray-400' })
    : React.createElement(ChevronRight, { className: 'h-4 w-4 text-gray-400' })
}

export const getRoomCountLabel = (count: number, labels?: MultiBookingInfoLabels): string => {
  if (!labels) return `${count} habitaciones`
  return `${count} ${count === 1 ? labels.singleRoomLabel : labels.roomsCountLabel}`
}

export const filterDuplicateRoomTypes = (room: RoomBookingInfo) => {
  const roomTypeKeywords = ['room', 'tipo', 'type', 'habitación']

  return (
    room.items?.filter((item) => {
      const labelLower = item.label.toLowerCase()
      const isRoomType = roomTypeKeywords.some((keyword) => labelLower.includes(keyword))

      if (!isRoomType) return true

      const itemValue = String(item.value || '')
        .toLowerCase()
        .trim()
      const roomName = room.roomName.toLowerCase().trim()

      // Also check for partial matches, not just exact
      return !roomName.includes(itemValue) && !itemValue.includes(roomName)
    }) || []
  )
}

export const checkIsXLScreen = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1280
}

// Custom hook for responsive behavior with optimized performance
export const useResponsiveScreen = () => {
  const [isXLScreen, setIsXLScreen] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsXLScreen(checkIsXLScreen())
      }, 150)
    }

    // Initial check
    handleResize()

    // Add resize listener
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isXLScreen
}
