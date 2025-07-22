"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { AttributeItem as AttributeItemType } from "@/types/room"

interface AttributeItemProps {
  item: AttributeItemType
  category: string
  isSelected: boolean
  onToggle: () => void
}

export function AttributeItem({
  item,
  category,
  isSelected,
  onToggle,
}: AttributeItemProps) {
  return (
    <TableRow className={cn(isSelected && "bg-blue-50")}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-muted-foreground">{item.description}</TableCell>
      <TableCell className="text-right font-semibold">{item.price}</TableCell>
      <TableCell className="text-right">
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
          className={cn(
            "transition-colors",
            isSelected && "bg-green-600 hover:bg-green-700"
          )}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Selected
            </>
          ) : (
            "Select"
          )}
        </Button>
      </TableCell>
    </TableRow>
  )
}