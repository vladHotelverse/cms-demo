"use client"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface ExtraItem {
  name: string
  price: string
  priceType: string
  units: number
  description: string
}

interface ExtraItemProps {
  item: ExtraItem
  isSelected: boolean
  quantity: number
  onToggle: () => void
  onQuantityChange: (newQuantity: number) => void
}

export function ExtraItem({
  item,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange,
}: ExtraItemProps) {
  const handleIncrement = () => {
    onQuantityChange(quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1)
    }
  }

  return (
    <TableRow className={cn(isSelected && "bg-blue-50")}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-muted-foreground">{item.description}</TableCell>
      <TableCell>
        <div className="text-right">
          <div className="font-semibold">{item.price}</div>
          <div className="text-xs text-muted-foreground">{item.priceType}</div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {isSelected && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </TableCell>
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
          {isSelected ? "Selected" : "Add"}
        </Button>
      </TableCell>
    </TableRow>
  )
}