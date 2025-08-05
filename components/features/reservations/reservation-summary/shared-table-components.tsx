"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Check,
  X,
  Key,
  ArrowUpCircle,
  Info,
  Coins,
} from "lucide-react"

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "accepted":
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending_hotel":
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

interface ActionButtonsProps {
  onConfirm: () => void
  onDelete: () => void
  status?: string
  loading?: boolean
}

export const ActionButtons = ({ onConfirm, onDelete, status, loading }: ActionButtonsProps) => {
  if (status === 'confirmed') {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="h-3 w-3 text-white" />
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={onDelete}
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={onConfirm}
        disabled={loading}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onDelete}
        disabled={loading}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface AttributesCellProps {
  attributes: string[]
  label?: string
  showAttributes?: boolean
}

export const AttributesCell = ({ 
  attributes, 
  label = "Attributes", 
  showAttributes = true 
}: AttributesCellProps) => {
  // If showAttributes is false, always show dash
  if (!showAttributes || !attributes || attributes.length === 0) {
    return <span className="text-sm text-gray-400">-</span>
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer group">
            <span className="text-sm text-gray-900">{attributes.length} items</span>
            <Info className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-3">
          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-900">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {attributes.map((attr, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                  {attr}
                </Badge>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface RoomNumberCellProps {
  roomNumber: string
  hasKey?: boolean
  alternatives?: string[]
  showKeyIcon?: boolean
  showAlternatives?: boolean
}

export const RoomNumberCell = ({ 
  roomNumber, 
  hasKey = false, 
  alternatives = [], 
  showKeyIcon = hasKey,
  showAlternatives = alternatives.length > 0 && !hasKey 
}: RoomNumberCellProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{roomNumber}</span>
        {showKeyIcon && hasKey && <Key className="h-3 w-3 text-green-600" />}
      </div>
      {showAlternatives && alternatives.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-gray-500 cursor-pointer mt-0.5">
                ({alternatives.length} alternatives)
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="p-3">
              <div className="space-y-2">
                <p className="font-medium text-sm text-gray-900">Alternative Rooms</p>
                <div className="flex flex-wrap gap-1.5">
                  {alternatives.map((alt, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                      Room {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

interface RoomTypeCellProps {
  roomType: string
  originalRoomType?: string | null
  upgradeLabel?: string
  showUpgradeArrow?: boolean
}

export const RoomTypeCell = ({ 
  roomType, 
  originalRoomType, 
  upgradeLabel = "Room Upgrade",
  showUpgradeArrow = !!originalRoomType 
}: RoomTypeCellProps) => {
  // No upgrade arrow - just show room type
  if (!showUpgradeArrow || !originalRoomType) {
    return <span className="font-medium text-gray-900">{roomType}</span>
  }

  // Show upgrade arrow with tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-pointer group">
            <span className="font-medium text-gray-900">{roomType}</span>
            <ArrowUpCircle className="h-3 w-3 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3">
          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-900">{upgradeLabel}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Original:</span>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {originalRoomType}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Upgraded to:</span>
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {roomType}
                </Badge>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface CompactDateCellProps {
  dateInOut: string
}

export const CompactDateCell = ({ dateInOut }: CompactDateCellProps) => {
  // Helper function to parse DD/MM/YY format to Date
  const parseDate = (dateStr: string) => {
    if (!dateStr || typeof dateStr !== 'string') {
      return new Date('2026-01-28') // fallback date to 2026
    }
    
    const parts = dateStr.split('/')
    if (parts.length !== 3) {
      return new Date('2026-01-28') // fallback date to 2026
    }
    
    const [day, month, year] = parts
    if (!day || !month || !year) {
      return new Date('2026-01-28') // fallback date to 2026
    }
    
    const fullYear = year.length === 2 ? `20${year}` : year
    return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
  }

  // Parse date in format "DD/MM/YY - DD/MM/YY" or "DD/MM/YY - DD/MM/YY (X nights)"
  const compactMatch = dateInOut.match(/(\d{2}\/\d{2}\/\d{2}) - (\d{2}\/\d{2}\/\d{2})/)
  
  // Also try ISO format for backward compatibility
  const isoMatch = dateInOut.match(/(\d{4}-\d{2}-\d{2}) - (\d{4}-\d{2}-\d{2})/)
  
  if (!compactMatch && !isoMatch) {
    return <span className="text-sm">{dateInOut}</span>
  }

  let startDate: Date, endDate: Date
  
  if (compactMatch) {
    // Handle compact format DD/MM/YY
    const [, startDateStr, endDateStr] = compactMatch
    startDate = parseDate(startDateStr)
    endDate = parseDate(endDateStr)
  } else if (isoMatch) {
    // Handle ISO format for backward compatibility
    const [, startDateStr, endDateStr] = isoMatch
    startDate = new Date(startDateStr)
    endDate = new Date(endDateStr)
  } else {
    return <span className="text-sm">{dateInOut}</span>
  }
  
  // Calculate nights
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Format dates to numeric DD/MM→DD/MM/YY format
  const formatNumericDate = (date: Date, includeYear = false) => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear().toString().slice(-2)

    return includeYear ? `${day}/${month}/${year}` : `${day}/${month}`
  }

  const numericStart = formatNumericDate(startDate, false)
  const numericEnd = formatNumericDate(endDate, true)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer text-center">
            <div className="text-sm font-medium text-gray-900">
              {numericStart}→{numericEnd}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {nights} night{nights !== 1 ? "s" : ""}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3">
          <div className="space-y-1">
            <div className="font-medium text-sm">Full Date Range</div>
            <div className="text-sm">
              <div>
                <strong>Check-in:</strong> {formatNumericDate(startDate, true)}
              </div>
              <div>
                <strong>Check-out:</strong> {formatNumericDate(endDate, true)}
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2 pt-2 border-t">Total: {nights} nights</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  return (
    <Badge className={`${getStatusColor(status)} border ${className}`}>
      {status.replace('_', ' ')}
    </Badge>
  )
}

interface MoneyDisplayProps {
  amount: number
  currency?: string
}

export const MoneyDisplay = ({ amount, currency = "EUR" }: MoneyDisplayProps) => {
  const formattedAmount = amount > 0 ? Math.round(amount * 100) / 100 : 0
  return (
    <span className="text-sm font-medium text-gray-900">
      {formattedAmount} {currency}
    </span>
  )
}

interface CommissionDisplayProps {
  amount: number
  currency?: string
}

export const CommissionDisplay = ({ amount, currency = "EUR" }: CommissionDisplayProps) => {
  const formattedAmount = amount > 0 ? Math.round(amount * 100) / 100 : 0
  return (
    <div className="text-sm font-medium text-green-600 flex items-center gap-1">
      <div className="bg-green-100 p-1 rounded-full">
        <Coins className="h-3 w-3 text-green-600" />
      </div>
      {formattedAmount} {currency}
    </div>
  )
}

interface ServiceDateCellProps {
  serviceDates: string | string[]
}

export const ServiceDateCell = ({ serviceDates }: ServiceDateCellProps) => {
  // Handle single date or array of dates
  const dates = Array.isArray(serviceDates) ? serviceDates : [serviceDates]
  
  if (dates.length === 0) return <span className="text-sm text-gray-400">-</span>
  
  // Helper function to parse DD/MM/YY format to Date
  const parseDate = (dateStr: string) => {
    if (!dateStr || typeof dateStr !== 'string') {
      return new Date('2026-01-22') // fallback date to 2026
    }
    
    const parts = dateStr.split('/')
    if (parts.length !== 3) {
      return new Date('2026-01-22') // fallback date to 2026
    }
    
    const [day, month, year] = parts
    if (!day || !month || !year) {
      return new Date('2026-01-22') // fallback date to 2026
    }
    
    const fullYear = year.length === 2 ? `20${year}` : year
    return new Date(`${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
  }
  
  // Single date - show as is (already in DD/MM/YY format)
  if (dates.length === 1) {
    return <span className="text-sm">{dates[0]}</span>
  }
  
  // Multiple dates - check if consecutive for range display
  const sortedDates = dates.map(parseDate).sort((a, b) => a.getTime() - b.getTime())
  const firstDate = sortedDates[0]
  const lastDate = sortedDates[sortedDates.length - 1]
  
  // Check if dates are consecutive
  const isConsecutive = sortedDates.every((date, index) => {
    if (index === 0) return true
    const prevDate = sortedDates[index - 1]
    const dayDiff = Math.floor((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
    return dayDiff === 1
  })
  
  const formatCompactDate = (date: Date) => 
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/26`
  
  const formatFullDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/2026`
  
  if (isConsecutive && dates.length > 2) {
    // Show as range
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer text-center">
              <div className="text-sm text-gray-900">
                {formatCompactDate(firstDate)}→{formatCompactDate(lastDate)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {dates.length} days
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-3">
            <div className="space-y-1">
              <div className="font-medium text-sm">Service Dates</div>
              <div className="text-sm space-y-1">
                {sortedDates.map((date) => (
                  <div key={date.toISOString()}>{formatFullDate(date)}</div>
                ))}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  // Show first date + count
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer text-center">
            <div className="text-sm text-gray-900">
              {formatCompactDate(firstDate)}
            </div>
            <div className="text-xs text-blue-600 mt-0.5">
              +{dates.length - 1} more
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3">
          <div className="space-y-1">
            <div className="font-medium text-sm">Service Dates</div>
            <div className="text-sm space-y-1">
              {sortedDates.map((date) => (
                <div key={date.toISOString()}>{formatFullDate(date)}</div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}