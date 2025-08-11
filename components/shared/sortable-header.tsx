import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableHead } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { BookingSortOptions } from "@/lib/types/booking"

interface SortableHeaderProps {
  field: BookingSortOptions["field"]
  label: string
  sortOptions: BookingSortOptions
  onSort: (sort: BookingSortOptions) => void
  className?: string
}

export function SortableHeader({ 
  field, 
  label, 
  sortOptions, 
  onSort, 
  className 
}: SortableHeaderProps) {
  const isActive = sortOptions.field === field
  const direction = isActive ? sortOptions.direction : null

  const handleClick = () => {
    if (isActive) {
      // Toggle direction if already sorting by this field
      onSort({
        field,
        direction: direction === "asc" ? "desc" : "asc"
      })
    } else {
      // Set new field with ascending order
      onSort({
        field,
        direction: "asc"
      })
    }
  }

  return (
    <TableHead className={cn("px-2 py-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className="h-auto p-0 font-medium text-xs hover:bg-transparent hover:text-foreground justify-start w-full"
      >
        <span>{label}</span>
        <span className="ml-1 flex-shrink-0">
          {!isActive && <ArrowUpDown className="h-3 w-3 opacity-50" />}
          {isActive && direction === "asc" && <ArrowUp className="h-3 w-3" />}
          {isActive && direction === "desc" && <ArrowDown className="h-3 w-3" />}
        </span>
      </Button>
    </TableHead>
  )
}