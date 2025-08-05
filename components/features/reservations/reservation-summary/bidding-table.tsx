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
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Bidding</span>
            <Badge variant="secondary" className="ml-2">
              {items.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="mr-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50">
                <TableHead className="font-semibold text-gray-900 py-4">Amount</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Room Price</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Requested Room</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Room Number</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Date Created</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Date In/Out</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Status</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 text-right">Action</TableHead>
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
  
  // Use actual room check-in/check-out dates for consistency
  const dateInOut = item.checkIn && item.checkOut 
    ? `${item.checkIn} - ${item.checkOut}`
    : `${item.dateCreated || '12/01/26'} - ${item.dateCreated || '15/01/26'}`
  
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
        {item.dateCreated || '12/01/26'}
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