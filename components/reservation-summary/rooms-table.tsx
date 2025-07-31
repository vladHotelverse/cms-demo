"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { User, MoreHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RoomItem } from "@/data/reservation-items"
import { useReservationSummaryStore } from "@/stores/reservation-summary-store"
import {
  ActionButtons,
  AttributesCell,
  RoomNumberCell,
  RoomTypeCell,
  CompactDateCell,
  StatusBadge,
  MoneyDisplay
} from "./shared-table-components"

interface RoomsTableProps {
  items: RoomItem[]
}

export function RoomsTable({ items }: RoomsTableProps) {
  const { updateItemStatus, deleteItem } = useReservationSummaryStore()

  if (!items || items.length === 0) return null

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Room</span>
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
                <TableHead className="font-semibold text-gray-700">Room Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Room Number</TableHead>
                <TableHead className="font-semibold text-gray-700">Attributes</TableHead>
                <TableHead className="font-semibold text-gray-700">Date Requested</TableHead>
                <TableHead className="font-semibold text-gray-700">Date In/Out</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <RoomRow 
                  key={item.id} 
                  item={item} 
                  onStatusUpdate={(status) => updateItemStatus('rooms', item.id, status)}
                  onDelete={() => deleteItem('rooms', item.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

interface RoomRowProps {
  item: RoomItem
  onStatusUpdate: (status: 'pending_hotel' | 'confirmed') => void
  onDelete: () => void
}

function RoomRow({ item, onStatusUpdate, onDelete }: RoomRowProps) {
  const dateInOut = `${item.checkIn} - ${item.checkOut}`
  
  return (
    <TableRow className="border-gray-100 hover:bg-gray-50/50">
      <TableCell className="py-4 text-sm">{item.agent || 'Online'}</TableCell>
      <TableCell className="py-4">
        <MoneyDisplay 
          amount={item.agent !== 'Online' && item.commission ? item.commission : 0} 
        />
      </TableCell>
      <TableCell className="py-4">
        <MoneyDisplay amount={item.price} />
      </TableCell>
      <TableCell className="py-4">
        <RoomTypeCell 
          roomType={item.roomType}
          originalRoomType={item.originalRoomType}
        />
      </TableCell>
      <TableCell className="py-4">
        <RoomNumberCell
          roomNumber={item.roomNumber || '101'}
          hasKey={item.hasKey || false}
          alternatives={item.alternatives || []}
        />
      </TableCell>
      <TableCell className="py-4">
        <AttributesCell 
          attributes={item.attributes || []}
          label="Room Attributes"
        />
      </TableCell>
      <TableCell className="py-4 text-sm">
        {item.dateRequested ? 
          new Date(item.dateRequested).toLocaleDateString('en-CA') : 
          '2024-01-15'
        }
      </TableCell>
      <TableCell className="py-4">
        <CompactDateCell dateInOut={dateInOut} />
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
            aria-label={`Delete ${item.roomType}`}
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