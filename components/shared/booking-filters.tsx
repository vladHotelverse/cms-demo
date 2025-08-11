"use client"

import { CalendarIcon, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { BookingFilters, BookingStatus } from "@/lib/types/booking"
import { cn } from "@/lib/utils"

interface BookingFiltersProps {
  filters: BookingFilters
  onFiltersChange: (filters: BookingFilters) => void
  roomTypes: string[]
  className?: string
}

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "checked-in", label: "Checked In" },
  { value: "checked-out", label: "Checked Out" },
  { value: "cancelled", label: "Cancelled" },
]

export function BookingFilters({ 
  filters, 
  onFiltersChange, 
  roomTypes, 
  className 
}: BookingFiltersProps) {
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
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filters</h4>
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
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex flex-wrap gap-1">
                  {statusOptions.map(({ value, label }) => (
                    <Button
                      key={value}
                      variant={filters.status?.includes(value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleStatus(value)}
                      className="h-6 text-xs"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Room Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Type</label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  {roomTypes.map((roomType) => (
                    <Button
                      key={roomType}
                      variant={filters.roomType?.includes(roomType) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRoomType(roomType)}
                      className="h-6 text-xs"
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange ? (
                        `${format(filters.dateRange.start, "MMM dd")} - ${format(filters.dateRange.end, "MMM dd")}`
                      ) : (
                        "Select date range"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
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
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1">
          {filters.status?.map((status) => (
            <Badge key={status} variant="secondary" className="h-6 text-xs">
              {statusOptions.find(s => s.value === status)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                onClick={() => toggleStatus(status)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {filters.roomType?.map((roomType) => (
            <Badge key={roomType} variant="secondary" className="h-6 text-xs">
              {roomType}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                onClick={() => toggleRoomType(roomType)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {filters.dateRange && (
            <Badge variant="secondary" className="h-6 text-xs">
              {format(filters.dateRange.start, "MMM dd")} - {format(filters.dateRange.end, "MMM dd")}
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 ml-1 hover:bg-transparent"
                onClick={() => setDateRange(undefined, undefined)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}