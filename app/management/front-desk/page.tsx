"use client"

import type React from "react"
import { format } from "date-fns"
import {
  Mail,
  Key,
  KeyboardOffIcon as KeyOff,
  Wifi,
  Car,
  Coffee,
  Utensils,
  MoreHorizontal,
  Settings,
  ChevronDown,
  Info,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface RoomAttribute {
  id: string
  name: string
  icon: React.ReactNode
  selected: boolean
}

interface RoomData {
  type: string
  number: number
  option: string
  status: "confirmed" | "standard" | "priority"
  hasUpgrade: boolean
  hasChooseRoom: boolean
  hasKey: boolean
  hasAlternatives: boolean
  attributes?: RoomAttribute[]
  alternatives?: { number: number; type: string }[]
  originalRoom?: { type: string; number: number }
  upgradedRoom?: { type: string; number: number }
}

const bookings = [
  {
    id: 1,
    locator: "HV123456",
    guest: { name: "John Doe", email: "john.doe@email.com" },
    lastRequest: new Date("2025-08-10"),
    checkIn: new Date("2025-08-15"),
    checkOut: new Date("2025-08-20"),
    price: 1250.0,
    room: {
      type: "Deluxe Suite",
      number: 127,
      option: "Option",
      status: "confirmed",
      hasUpgrade: true,
      hasChooseRoom: false,
      hasKey: false,
      hasAlternatives: true,
      originalRoom: { type: "Standard Suite", number: 125 },
      upgradedRoom: { type: "Deluxe Suite", number: 127 },
      alternatives: [
        { number: 128, type: "Deluxe Suite" },
        { number: 129, type: "Deluxe Suite" },
        { number: 130, type: "Deluxe Suite" },
      ],
    } as RoomData,
    extras: {
      confirmed: 3,
      pending: 2,
      status: "standard",
    },
  },
  {
    id: 2,
    locator: "HV789012",
    guest: { name: "Jane Smith", email: "jane.smith@email.com" },
    lastRequest: new Date("2025-08-11"),
    checkIn: new Date("2025-08-18"),
    checkOut: new Date("2025-08-22"),
    price: 850.0,
    room: {
      type: "Standard King",
      number: 127,
      option: "Option",
      status: "standard",
      hasUpgrade: false,
      hasChooseRoom: true,
      hasKey: true,
      hasAlternatives: false,
    } as RoomData,
    extras: {
      confirmed: 1,
      pending: 0,
      status: "standard",
    },
  },
  {
    id: 3,
    locator: "HV345678",
    guest: { name: "Peter Jones", email: "peter.jones@email.com" },
    lastRequest: new Date("2025-08-12"),
    checkIn: new Date("2025-08-25"),
    checkOut: new Date("2025-08-30"),
    price: 2100.0,
    room: {
      type: "Presidential Suite",
      number: 501,
      option: "VIP",
      status: "confirmed",
      hasUpgrade: true,
      hasChooseRoom: true,
      hasKey: true,
      hasAlternatives: false,
      originalRoom: { type: "Executive Suite", number: 450 },
      upgradedRoom: { type: "Presidential Suite", number: 501 },
    } as RoomData,
    extras: {
      confirmed: 5,
      pending: 1,
      status: "priority",
    },
  },
  {
    id: 4,
    locator: "HV901234",
    guest: { name: "Sarah Wilson", email: "sarah.wilson@email.com" },
    lastRequest: new Date("2025-08-13"),
    checkIn: new Date("2025-08-28"),
    checkOut: new Date("2025-09-02"),
    price: 950.0,
    room: {
      type: "Ocean View",
      number: 205,
      option: "Premium",
      status: "standard",
      hasUpgrade: false,
      hasChooseRoom: false,
      hasKey: false,
      hasAlternatives: true,
      attributes: [
        { id: "wifi", name: "WiFi", icon: <Wifi className="h-3 w-3" />, selected: true },
        { id: "parking", name: "Parking", icon: <Car className="h-3 w-3" />, selected: false },
        { id: "breakfast", name: "Breakfast", icon: <Coffee className="h-3 w-3" />, selected: true },
        { id: "dining", name: "Dining", icon: <Utensils className="h-3 w-3" />, selected: false },
      ],
      alternatives: [
        { number: 206, type: "Ocean View" },
        { number: 207, type: "Ocean View" },
        { number: 208, type: "Ocean View" },
      ],
    } as RoomData,
    extras: {
      confirmed: 2,
      pending: 1,
      status: "standard",
    },
  },
]

const statusColors = {
  confirmed: "bg-green-50 text-green-800 border-green-200",
  standard: "bg-orange-50 text-orange-800 border-orange-200",
  priority: "bg-red-50 text-red-800 border-red-200",
  default: "bg-gray-50 text-gray-800 border-gray-200",
}

const CompactRoomBlock = ({ room }: { room: RoomData }) => {
  return (
    <div className={cn("p-2 rounded border text-xs", statusColors[room.status] || statusColors.default)}>
      {/* Main Room Info - Single Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <span className="font-medium truncate">{room.type}</span>
          {room.hasUpgrade && room.originalRoom && room.upgradedRoom && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Info className="h-3 w-3 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="start">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Room Upgrade</h4>

                  <div className="space-y-2">
                    {/* Original Room */}
                    <div className="p-2 bg-gray-50 rounded text-xs border">
                      <div className="font-medium text-gray-600 mb-1">Original Room</div>
                      <div className="font-semibold text-gray-800">
                        #{room.originalRoom.number} - {room.originalRoom.type}
                      </div>
                    </div>

                    {/* Upgraded Room */}
                    <div className="p-2 bg-blue-50 rounded text-xs border border-blue-200">
                      <div className="font-medium text-blue-600 mb-1">Upgraded Room</div>
                      <div className="font-semibold text-blue-800">
                        #{room.upgradedRoom.number} - {room.upgradedRoom.type}
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Key Status */}
          {room.hasKey && <Key className="h-3 w-3 text-green-600" />}
          {!room.hasKey && room.hasChooseRoom && <KeyOff className="h-3 w-3 text-gray-400" />}

          {/* Alternatives Popover */}
          {room.hasAlternatives && room.alternatives && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Alternative {room.type} Rooms</h4>
                  <div className="space-y-1">
                    {room.alternatives.map((alt, index) => (
                      <Button key={index} variant="ghost" size="sm" className="w-full justify-start h-7 text-xs">
                        #{alt.number} - {alt.type}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Attributes Popover */}
          {room.attributes && room.attributes.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Room Attributes</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {room.attributes.map((attr) => (
                      <Button
                        key={attr.id}
                        variant={attr.selected ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-7 text-xs justify-start",
                          attr.selected
                            ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                            : "hover:bg-gray-50",
                        )}
                      >
                        {attr.icon}
                        <span className="ml-1">{attr.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Room Number and Badges - Second Line */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs opacity-70">
          #{room.number} {room.option}
        </span>
        <div className="flex gap-1">
          {room.hasChooseRoom && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              Choose Room
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

const CompactExtrasBlock = ({
  status,
  confirmed,
  pending,
  isPriority,
}: {
  status: "confirmed" | "standard" | "priority" | "default"
  confirmed: number
  pending: number
  isPriority: boolean
}) => {
  return (
    <div className={cn("p-2 rounded border text-xs", statusColors[status] || statusColors.default)}>
      <div className="flex items-center justify-between">
        <div>
          {isPriority && <div className="font-bold text-red-700 text-xs mb-0.5">PRIORITY</div>}
          <div className="font-medium">{confirmed} confirmed</div>
          {pending > 0 && <div className="opacity-70">{pending} pending</div>}
        </div>

        {(confirmed > 0 || pending > 0) && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Extras Details</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Spa Package</span>
                    <Badge variant="secondary" className="text-xs">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Airport Transfer</span>
                    <Badge variant="secondary" className="text-xs">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Checkout</span>
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}

export default function FrontDeskTableView() {
  return (
    <div className="bg-gray-50 min-h-screen p-3">
      <div className="max-w-screen-2xl mx-auto space-y-3">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Front Desk</h1>
        </header>

        <Card>
          <div className="overflow-x-auto">
            <Table className="min-w-full text-xs">
              <TableHeader>
                <TableRow className="border-b-gray-200">
                  <TableHead className="w-[100px] px-2 py-2 text-xs">Booking ID</TableHead>
                  <TableHead className="w-[160px] px-2 py-2 text-xs">Guest</TableHead>
                  <TableHead className="w-[100px] px-2 py-2 text-xs">Requested</TableHead>
                  <TableHead className="w-[100px] px-2 py-2 text-xs">Stay Dates</TableHead>
                  <TableHead className="w-[80px] px-2 py-2 text-xs">Price</TableHead>
                  <TableHead className="w-[200px] px-2 py-2 text-xs">Room</TableHead>
                  <TableHead className="w-[140px] px-2 py-2 text-xs">Extras</TableHead>
                  <TableHead className="w-[40px] px-2 py-2 text-xs">Msg</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-t-gray-200">
                    <TableCell className="px-2 py-2 font-mono text-xs">{booking.locator}</TableCell>
                    <TableCell className="px-2 py-2">
                      <div className="font-medium text-xs">{booking.guest.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{booking.guest.email}</div>
                    </TableCell>
                    <TableCell className="px-2 py-2 text-xs">{format(booking.lastRequest, "MMM dd")}</TableCell>
                    <TableCell className="px-2 py-2 text-xs">
                      <div>{format(booking.checkIn, "MMM dd")}</div>
                      <div className="text-muted-foreground">{format(booking.checkOut, "MMM dd")}</div>
                    </TableCell>
                    <TableCell className="px-2 py-2 font-medium text-xs">${booking.price.toFixed(0)}</TableCell>
                    <TableCell className="px-2 py-2">
                      <CompactRoomBlock room={booking.room} />
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <CompactExtrasBlock
                        status={booking.extras.status as keyof typeof statusColors}
                        confirmed={booking.extras.confirmed}
                        pending={booking.extras.pending}
                        isPriority={booking.extras.status === "priority"}
                      />
                    </TableCell>
                    <TableCell className="px-2 py-2">
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <Mail className="h-3.5 w-3.5 text-blue-600" />
                        <span className="sr-only">Send Message</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}