"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExtraItem } from "./extra-item"

interface ExtraItemType {
  name: string
  price: string
  priceType: string
  units: number
  description: string
}

interface ExtraListProps {
  extras: ExtraItemType[]
  selectedExtras: Set<string>
  extraQuantities: { [key: string]: number }
  onToggleExtra: (extraName: string) => void
  onUpdateQuantity: (extraName: string, quantity: number) => void
}

export function ExtraList({
  extras,
  selectedExtras,
  extraQuantities,
  onToggleExtra,
  onUpdateQuantity,
}: ExtraListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Services & Extras</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extras.map((item) => (
              <ExtraItem
                key={item.name}
                item={item}
                isSelected={selectedExtras.has(item.name)}
                quantity={extraQuantities[item.name] || item.units}
                onToggle={() => onToggleExtra(item.name)}
                onQuantityChange={(quantity) => onUpdateQuantity(item.name, quantity)}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}