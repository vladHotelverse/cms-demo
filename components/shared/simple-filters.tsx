"use client"

import { useState } from "react"
import { Filter, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { BookingFilters, BookingStatus } from "@/lib/types/booking"
import { cn } from "@/lib/utils"

interface SimpleFiltersProps {
  filters: BookingFilters
  onFiltersChange: (filters: BookingFilters) => void
  roomTypes: string[]
}

const statusOptions: { value: BookingStatus; label: string; color: string }[] = [
  { value: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { value: "pending", label: "Pending", color: "bg-orange-100 text-orange-800" },
  { value: "checked-in", label: "Checked In", color: "bg-blue-100 text-blue-800" },
  { value: "checked-out", label: "Checked Out", color: "bg-gray-100 text-gray-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export function SimpleFilters({ filters, onFiltersChange, roomTypes }: SimpleFiltersProps) {
  const [open, setOpen] = useState(false)
  
  const hasActiveFilters = 
    (filters.status && filters.status.length > 0) ||
    filters.dateRange ||
    (filters.roomType && filters.roomType.length > 0)

  const activeFilterCount = 
    (filters.status?.length || 0) +
    (filters.dateRange ? 1 : 0) +
    (filters.roomType?.length || 0)

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const toggleStatus = (status: BookingStatus) => {
    const currentStatuses = filters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    })
  }

  const toggleRoomType = (roomType: string) => {
    const currentTypes = filters.roomType || []
    const newTypes = currentTypes.includes(roomType)
      ? currentTypes.filter(t => t !== roomType)
      : [...currentTypes, roomType]
    
    onFiltersChange({
      ...filters,
      roomType: newTypes.length > 0 ? newTypes : undefined
    })
  }

  const setDateRange = (start: Date | undefined, end: Date | undefined) => {
    if (start && end) {
      onFiltersChange({
        ...filters,
        dateRange: { start, end }
      })
    } else {
      const { dateRange, ...restFilters } = filters
      onFiltersChange(restFilters)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filters
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex flex-wrap gap-1">
              {statusOptions.map(({ value, label, color }) => (
                <Button
                  key={value}
                  variant={filters.status?.includes(value) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleStatus(value)}
                  className={cn(
                    "h-7 text-xs",
                    filters.status?.includes(value) && color
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Room Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Room Type</label>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {roomTypes.map((roomType) => (
                <Button
                  key={roomType}
                  variant={filters.roomType?.includes(roomType) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleRoomType(roomType)}
                  className="h-7 text-xs"
                >
                  {roomType}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Check-in Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.dateRange ? (
                    `${format(filters.dateRange.start, "MMM dd")} - ${format(filters.dateRange.end, "MMM dd")}`
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={filters.dateRange ? {
                    from: filters.dateRange.start,
                    to: filters.dateRange.end
                  } : undefined}
                  onSelect={(range) => {
                    setDateRange(range?.from, range?.to)
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {filters.dateRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange(undefined, undefined)}
                className="h-6 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear dates
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}