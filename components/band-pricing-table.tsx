"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { BandPrice } from "@/types/pricing"

interface Band {
  id: string
  name: string
  description: string
}

interface BandPricingTableProps {
  bands: Band[]
  bandPrices: BandPrice[]
  onUpdatePrice: (bandId: string, price: number) => void
}

export default function BandPricingTable({ bands, bandPrices, onUpdatePrice }: BandPricingTableProps) {
  const handlePriceChange = (bandId: string, value: string) => {
    const price = Number.parseFloat(value)
    if (!isNaN(price) && price >= 0) {
      onUpdatePrice(bandId, price)
    }
  }

  const getBandPrice = (bandId: string) => {
    const bandPrice = bandPrices.find((bp) => bp.bandId === bandId)
    return bandPrice ? bandPrice.price : 0
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Band Pricing</h3>
        <p className="text-sm text-muted-foreground">Set price for each band</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Band</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead className="w-[150px]">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bands.map((band) => (
            <TableRow key={band.id}>
              <TableCell className="font-medium">{band.name}</TableCell>
              <TableCell className="text-muted-foreground">{band.description}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={getBandPrice(band.id)}
                    onChange={(e) => handlePriceChange(band.id, e.target.value)}
                    className="w-24"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
