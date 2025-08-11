"use client"

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { BookingSortOptions } from "@/lib/types/booking"

interface SortingControlsProps {
  sortOptions: BookingSortOptions
  onSortChange: (sort: BookingSortOptions) => void
  className?: string
}

const sortFields = [
  { value: "checkIn", label: "Check-in Date" },
  { value: "checkOut", label: "Check-out Date" },
  { value: "lastRequest", label: "Last Request" },
  { value: "guest.name", label: "Guest Name" },
  { value: "price", label: "Price" },
  { value: "room.type", label: "Room Type" },
  { value: "room.number", label: "Room Number" },
  { value: "status", label: "Status" },
] as const

export function SortingControls({ 
  sortOptions, 
  onSortChange, 
  className 
}: SortingControlsProps) {
  const toggleDirection = () => {
    onSortChange({
      ...sortOptions,
      direction: sortOptions.direction === "asc" ? "desc" : "asc"
    })
  }

  const handleFieldChange = (field: string) => {
    onSortChange({
      ...sortOptions,
      field: field as BookingSortOptions["field"]
    })
  }

  const currentFieldLabel = sortFields.find(f => f.value === sortOptions.field)?.label || "Check-in Date"

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        
        <Select value={sortOptions.field} onValueChange={handleFieldChange}>
          <SelectTrigger className="h-8 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortFields.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleDirection}
          className="h-8 w-8 p-0"
          title={`Sort ${sortOptions.direction === "asc" ? "descending" : "ascending"}`}
        >
          {sortOptions.direction === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}