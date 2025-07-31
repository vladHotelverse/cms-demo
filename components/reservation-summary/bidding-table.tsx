"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BiddingItem } from "@/data/reservation-items"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import { useReservationTranslations } from "@/hooks/use-reservation-translations"
import {
  ActionButtons,
  RoomNumberCell,
  RoomTypeCell,
  CompactDateCell,
  StatusBadge,
  MoneyDisplay
} from "./shared-table-components"

interface BiddingTableProps {
  items: BiddingItem[]
}

export function BiddingTable({ items }: BiddingTableProps) {
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  if (!items || items.length === 0) return null

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Bidding</span>
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
                <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                <TableHead className="font-semibold text-gray-700">Room Price</TableHead>
                <TableHead className="font-semibold text-gray-700">Requested Room</TableHead>
                <TableHead className="font-semibold text-gray-700">Room Number</TableHead>
                <TableHead className="font-semibold text-gray-700">Date Created</TableHead>
                <TableHead className="font-semibold text-gray-700">Date In/Out</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <BiddingRow 
                  key={item.id} 
                  item={item} 
                  onStatusUpdate={(status) => updateItemStatus('bidding', item.id, status)}
                  onDelete={() => deleteItem('bidding', item.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface BiddingRowProps {
  item: BiddingItem
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function BiddingRow({ item, onStatusUpdate, onDelete }: BiddingRowProps) {
  const { t } = useReservationTranslations()
  
  // Calculate if this bid was rejected (for demo, reject some pending items)
  const isRejected = item.status === 'pending_hotel' && item.id === 'b2'
  
  // Generate date range for the bidding period (mock dates based on creation date)
  const startDate = new Date(item.dateCreated)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 3) // 3 days for demo
  const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const dateInOut = `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]} (${nights} nights)`
  
  return (
    <TableRow className="border-gray-100 hover:bg-gray-50/50">
      <TableCell className="py-4">
        <MoneyDisplay amount={item.price} />
      </TableCell>
      <TableCell className="py-4 text-sm font-medium">
        <MoneyDisplay amount={item.roomPrice || item.price * 1.2} />
      </TableCell>
      <TableCell className="py-4">
        <RoomTypeCell 
          roomType={item.pujaType}
          originalRoomType={item.originalRoomType}
          upgradeLabel="Room Upgrade Request"
        />
      </TableCell>
      <TableCell className="py-4">
        <RoomNumberCell
          roomNumber={item.roomNumber || '101'}
          hasKey={item.hasKey || false}
          alternatives={item.alternatives || []}
        />
      </TableCell>
      <TableCell className="py-4 text-sm">
        {item.dateCreated ? 
          new Date(item.dateCreated).toLocaleDateString('en-CA') : 
          '2024-01-12'
        }
      </TableCell>
      <TableCell className="py-4">
        <CompactDateCell dateInOut={dateInOut} />
      </TableCell>
      <TableCell className="py-4">
        <StatusBadge status={isRejected ? 'rejected' : item.status} />
      </TableCell>
      <TableCell className="py-4 text-right">
        {isRejected ? (
          <span className="text-sm text-gray-400">-</span>
        ) : item.status === 'confirmed' ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onDelete}
            aria-label={`Delete bid for ${item.pujaType}`}
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