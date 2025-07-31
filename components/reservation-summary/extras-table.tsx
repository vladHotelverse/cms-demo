"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ExtraItem } from "@/data/reservation-items"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import {
  ActionButtons,
  StatusBadge,
  MoneyDisplay
} from "./shared-table-components"

interface ExtrasTableProps {
  items: ExtraItem[]
}

export function ExtrasTable({ items }: ExtrasTableProps) {
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  if (!items || items.length === 0) return null

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Extra</span>
            <Badge variant="secondary" className="ml-2">
              {items.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="font-semibold text-gray-700">Agents</TableHead>
                <TableHead className="font-semibold text-gray-700">Commission</TableHead>
                <TableHead className="font-semibold text-gray-700">Supplements</TableHead>
                <TableHead className="font-semibold text-gray-700">Extras</TableHead>
                <TableHead className="font-semibold text-gray-700">Units</TableHead>
                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Date Requested</TableHead>
                <TableHead className="font-semibold text-gray-700">Date Service</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <ExtraRow 
                  key={item.id} 
                  item={item} 
                  onStatusUpdate={(status) => updateItemStatus('extras', item.id, status)}
                  onDelete={() => deleteItem('extras', item.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExtraRowProps {
  item: ExtraItem
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function ExtraRow({ item, onStatusUpdate, onDelete }: ExtraRowProps) {
  const { t } = useReservationTranslations()
  
  // Helper function to get type display text based on screenshot examples
  const getTypeDisplay = (type: string, units: number) => {
    switch(type) {
      case 'service':
        return units > 1 ? 'per service' : 'per person'
      case 'amenity':
        return 'per person'
      case 'transfer':
        return 'per stay'
      default:
        return 'per service'
    }
  }
  
  return (
    <TableRow className="border-gray-100 hover:bg-gray-50/50">
      <TableCell className="py-4 text-sm">{item.agent || 'Emma Davis'}</TableCell>
      <TableCell className="py-4">
        <MoneyDisplay 
          amount={item.agent !== 'Online' && item.commission ? item.commission : 1.5} 
        />
      </TableCell>
      <TableCell className="py-4">
        <MoneyDisplay amount={item.price > 0 ? item.price : 15} />
      </TableCell>
      <TableCell className="py-4 text-sm font-medium">
        {item.nameKey ? t(item.nameKey) : (item.name || 'Spa Service')}
      </TableCell>
      <TableCell className="py-4 text-sm">{item.units || 2}</TableCell>
      <TableCell className="py-4">
        <Badge variant="outline" className="text-xs">
          {getTypeDisplay(item.type, item.units || 2)}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-sm">
        {item.dateRequested ? 
          new Date(item.dateRequested).toLocaleDateString('en-CA') : 
          '2024-01-20'
        }
      </TableCell>
      <TableCell className="py-4 text-sm">
        {item.serviceDate ? 
          new Date(item.serviceDate).toLocaleDateString('en-CA') : 
          '2024-01-22'
        }
      </TableCell>
      <TableCell className="py-4">
        <StatusBadge status={item.status} />
      </TableCell>
      <TableCell className="py-4 text-right">
        {item.status === 'confirmed' ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
            aria-label={`Delete ${item.name}`}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <ActionButtons
            onConfirm={() => onStatusUpdate('confirmed')}
            onDelete={onDelete}
            status={item.status}
          />
        )}
      </TableCell>
    </TableRow>
  )
}