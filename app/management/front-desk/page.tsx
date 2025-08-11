"use client"

import type React from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  KeyRound,
  Wifi,
  Car,
  Coffee,
  Utensils,
  ChevronDown,
  ArrowUpCircle,
  Waves,
  Dumbbell,
  Bell,
  Calendar,
  Settings,
  ExternalLink,
} from "lucide-react"

import { ErrorBoundary } from "@/components/shared/error-boundary"
import { ErrorMessage } from "@/components/shared/error-message"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { TableLoading } from "@/components/shared/table-loading"
import { SearchInput } from "@/components/shared/search-input"
import { SimpleFilters } from "@/components/shared/simple-filters"
import { SortableHeader } from "@/components/shared/sortable-header"
import { useBookings } from "@/lib/hooks/use-bookings"
import { useRoomStatus } from "@/lib/hooks/use-room-status"
import { highlightSearchTerm } from "@/lib/utils/search-highlight"
import type { RoomData, Booking } from "@/lib/types/booking"

const iconMap = {
  wifi: <Wifi className="h-3 w-3" />,
  car: <Car className="h-3 w-3" />,
  coffee: <Coffee className="h-3 w-3" />,
  utensils: <Utensils className="h-3 w-3" />,
  waves: <Waves className="h-3 w-3" />,
  dumbbell: <Dumbbell className="h-3 w-3" />,
  bell: <Bell className="h-3 w-3" />,
}


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
          <span className="font-semibold text-sm truncate">{room.type}</span>
          {/* Show upgrade arrow only when no key is assigned */}
          {room.hasUpgrade && room.originalRoom && room.upgradedRoom && !room.hasKey && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <ArrowUpCircle className="h-4 w-4 text-blue-600" />
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
          {/* Attributes Popover */}
          {room.attributes && room.attributes.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs border-dashed hover:bg-muted">
                  {room.attributes.filter(attr => attr.selected).length} attributes
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Room Attributes</h4>
                  <div className="grid grid-cols-2 gap-1">
                    {room.attributes.filter(attr => attr.selected).map((attr) => (
                      <div
                        key={attr.id}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200 text-xs"
                      >
                        {iconMap[attr.icon as keyof typeof iconMap] || attr.icon}
                        <span className="text-blue-800 font-medium">{attr.name}</span>
                      </div>
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
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            {/* Only show key icon when guest actually has the key (room assigned) */}
            {room.hasKey && <KeyRound className="h-4 w-4 text-green-600" />}
            <span className="font-semibold text-sm text-gray-900">{room.number}</span>
          </div>
          
          {/* Alternatives Button - only show if has alternatives AND no key */}
          {room.hasAlternatives && room.alternatives && room.alternatives.filter(alt => alt.available).length > 0 && !room.hasKey && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-5 px-2 text-xs border-dashed hover:bg-muted">
                  {room.alternatives.filter(alt => alt.available).length} alternatives
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Alternative {room.type} Rooms</h4>
                  <div className="space-y-1">
                    {room.alternatives.filter(alt => alt.available).map((alt) => (
                      <Button 
                        key={`${alt.number}-${alt.type}`} 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start h-7 text-xs"
                      >
                        #{alt.number} - {alt.type}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
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

const CompactExtrasBlock = ({ booking }: { booking: Booking }) => {
  const { extras } = booking
  const hasExtras = (extras.confirmed > 0 || extras.pending > 0) && extras.items
  
  // Don't show 0 values, only show non-zero counts
  const confirmedText = extras.confirmed > 0 ? `${extras.confirmed} confirmed` : null
  const pendingText = extras.pending > 0 ? `${extras.pending} pending` : null
  
  if (!hasExtras) {
    return (
      <div className={cn("p-2 rounded border text-xs h-full flex items-center", statusColors[extras.status] || statusColors.default)}>
        <div className="font-medium opacity-70">No extras</div>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn("p-2 rounded border text-xs cursor-pointer hover:bg-muted/50 transition-colors h-full flex items-center", statusColors[extras.status] || statusColors.default)}>
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              {confirmedText && <div className="font-medium">{confirmedText}</div>}
              {pendingText && <div className="opacity-70">{pendingText}</div>}
            </div>
            <ChevronDown className="h-3 w-3 flex-shrink-0 ml-1" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Extras Details</h4>
          <div className="space-y-1 text-xs">
            {extras.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="truncate pr-2">{item.name}</span>
                <Badge 
                  variant={item.status === "confirmed" ? "secondary" : "outline"} 
                  className="text-xs flex-shrink-0"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function FrontDeskTableView() {
  const router = useRouter()
  const { 
    bookings, 
    loading, 
    error, 
    filters, 
    sortOptions, 
    totalCount,
    filteredCount,
    roomTypes,
    setFilters, 
    setSortOptions,
    clearError 
  } = useBookings()
  const { error: roomError, clearError: clearRoomError } = useRoomStatus()
  
  const searchTerm = filters.guestName || ""

  const handleBookingRowClick = (booking: Booking) => {
    const queryParams = new URLSearchParams({
      locator: booking.locator,
      guestName: booking.guest.name,
      email: booking.guest.email,
      checkIn: format(booking.checkIn, "dd/MM/yyyy"),
      nights: Math.ceil((booking.checkOut.getTime() - booking.checkIn.getTime()) / (1000 * 60 * 60 * 24)).toString(),
      roomType: booking.room.type
    })
    
    router.push(`/ventas/front-desk-upsell?${queryParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Front Desk</h1>
            <p className="text-sm text-muted-foreground">Manage your guests room requests</p>
          </div>
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <Card>
            <div className="overflow-x-auto">
              <TableLoading rows={10} columns={8} />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-background px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Front Desk</h1>
            <p className="text-sm text-muted-foreground">Manage your guests room requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Calendar className="h-4 w-4" />
            </Button>
            <SimpleFilters
              filters={filters}
              onFiltersChange={setFilters}
              roomTypes={roomTypes}
            />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search Section */}
        <div className="flex items-center justify-between border-b bg-muted/20 px-6 py-3">
          <div className="text-sm font-medium text-gray-900">
            Your search: {filteredCount} Booking{filteredCount !== 1 ? 's' : ''}
          </div>
          <div className="w-64">
            <SearchInput
              value={searchTerm}
              onChange={(value) => setFilters({ ...filters, guestName: value || undefined })}
              placeholder="Locator"
              className="h-8"
            />
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-auto">

        {/* Error Messages */}
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={clearError}
            className="mb-4"
          />
        )}
        {roomError && (
          <ErrorMessage 
            message={roomError} 
            onClose={clearRoomError}
            className="mb-4"
          />
        )}

        <Card>
          <div className="overflow-x-auto">
            <Table className="min-w-full text-xs">
              <TableHeader>
                <TableRow className="border-b-gray-200">
                  <SortableHeader
                    field="locator"
                    label="Booking ID"
                    sortOptions={sortOptions}
                    onSort={setSortOptions}
                    className="w-[100px] text-xs"
                  />
                  <SortableHeader
                    field="guest.name"
                    label="Guest"
                    sortOptions={sortOptions}
                    onSort={setSortOptions}
                    className="w-[160px] text-xs"
                  />
                  <SortableHeader
                    field="lastRequest"
                    label="Requested"
                    sortOptions={sortOptions}
                    onSort={setSortOptions}
                    className="w-[100px] text-xs"
                  />
                  <SortableHeader
                    field="checkIn"
                    label="Stay Dates"
                    sortOptions={sortOptions}
                    onSort={setSortOptions}
                    className="w-[100px] text-xs"
                  />
                  <SortableHeader
                    field="price"
                    label="Price"
                    sortOptions={sortOptions}
                    onSort={setSortOptions}
                    className="w-[80px] text-xs"
                  />
                  <TableHead className="w-[200px] px-2 py-2 text-xs">Room Number</TableHead>
                  <TableHead className="w-[140px] px-2 py-2 text-xs">Extras</TableHead>
                  <TableHead className="w-[60px] px-2 py-2 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {filteredCount === 0 && totalCount > 0 
                        ? "No bookings match your current filters" 
                        : "No bookings found"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => (
                    <TableRow 
                      key={booking.id} 
                      className="border-t-gray-200"
                    >
                      <TableCell className="px-2 py-2 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => handleBookingRowClick(booking)}
                          className="text-left hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                          title="View item summary"
                        >
                          {highlightSearchTerm(booking.locator, searchTerm)}
                        </button>
                      </TableCell>
                      <TableCell className="px-2 py-2">
                        <div className="font-medium text-xs flex items-center gap-1">
                          {highlightSearchTerm(booking.guest.name, searchTerm)}
                          {booking.guest.vipStatus && (
                            <Badge variant="secondary" className="text-[10px] px-1 h-3">
                              VIP
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {highlightSearchTerm(booking.guest.email, searchTerm)}
                        </div>
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
                        <CompactExtrasBlock booking={booking} />
                      </TableCell>
                      <TableCell className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <Mail className="h-3.5 w-3.5 text-blue-600" />
                            <span className="sr-only">Send Message</span>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={() => handleBookingRowClick(booking)}
                            title="View item summary"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-green-600" />
                            <span className="sr-only">View Summary</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        </div>
      </div>
    </ErrorBoundary>
  )
}