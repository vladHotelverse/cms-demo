"use client"

import { useState } from "react"
import { Plus, Minus, CalendarDays, Check, Star, Eye, Zap, Crown, MapPin, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface EnhancedTableViewProps {
  onAddToCart: (item: any) => void
  onSelectRoom: (room: any) => void
}

// Enhanced room upgrade data
const roomUpgrades = [
  {
    id: 1,
    type: "Deluxe Ocean View",
    price: "25€",
    features: "Double Size Bed, Private Terrace, Pool View",
    availability: "Limited",
    rating: 4.8,
    image: "/hotel-room-ocean-view.png",
  },
  {
    id: 2,
    type: "Suite Sea Side",
    price: "30€",
    features: "Queen Size Bed, Large Terrace, Sea Side View",
    availability: "Available",
    rating: 4.9,
    image: "/luxury-hotel-suite.png",
  },
  {
    id: 3,
    type: "King Suite Sea View",
    price: "55€",
    features: "King Size Bed, Premium Terrace, Direct Sea View",
    availability: "Available",
    rating: 5.0,
    image: "/king-suite-sea-view.png",
  },
  {
    id: 4,
    type: "Presidential Suite",
    price: "75€",
    features: "King Size Bed, Two-Story Terrace, Panoramic Sea View, Private Pool",
    availability: "Limited",
    rating: 5.0,
    image: "/presidential-suite.png",
  },
]

// Enhanced attributes with icons and metadata
const attributes = {
  "Bed Type": {
    icon: Building2,
    items: [
      {
        name: "Double Size Bed",
        price: "2,50€",
        description: "Bed size 135x200",
      },
      {
        name: "Queen Size Bed",
        price: "3,75€",
        description: "Bed size 150x200",
      },
      {
        name: "King Size Bed",
        price: "6€",
        description: "Bed size 180x200",
      },
      {
        name: "Extra King Size Bed",
        price: "9€",
        description: "Bed size 200x200",
      },
    ],
  },
  Location: {
    icon: MapPin,
    items: [
      {
        name: "Close to Main Pool",
        price: "2,50€",
        description: "Close to hotel Main Pool",
      },
      {
        name: "In Main Building",
        price: "3,75€",
        description: "Near Hotel Entrance",
      },
      {
        name: "Corner Room",
        price: "6€",
        description: "Extra Balcony Size",
      },
      {
        name: "Quiet Area",
        price: "9€",
        description: "For Business Guests",
      },
      {
        name: "Direct Pool Access",
        price: "10,50€",
        description: "Swim-out",
      },
    ],
  },
  Floor: {
    icon: Building2,
    items: [
      {
        name: "Lower Floor",
        price: "2,50€",
        description: "Lower floor",
      },
      {
        name: "Intermediate Floor",
        price: "3,75€",
        description: "Floors 1 - 3",
      },
      {
        name: "Higher Floors",
        price: "6€",
        description: "Floors 4-6",
      },
      {
        name: "Rooftop",
        price: "9€",
        description: "Floor 7",
      },
    ],
  },
}

// Enhanced extras
const extras = [
  {
    name: "Early Check In",
    price: "6€",
    priceType: "per stay",
    units: 1,
    description: "Check in before 3 PM",
  },
  {
    name: "Spa Treatment",
    price: "40€",
    priceType: "per treatment",
    units: 2,
    description: "Relaxing spa experience",
  },
  {
    name: "Dinner Package",
    price: "60€",
    priceType: "per person/date",
    units: 1,
    description: "Premium dining experience",
  },
  {
    name: "Pool Bed Reservation",
    price: "3€",
    priceType: "per day",
    units: 1,
    description: "Reserved poolside seating",
  },
  {
    name: "Late Check Out",
    price: "6€",
    priceType: "per stay",
    units: 1,
    description: "Check out after 12 PM",
  },
]

export default function EnhancedTableView({ onAddToCart, onSelectRoom }: EnhancedTableViewProps) {
  const [selectedRooms, setSelectedRooms] = useState<Set<number>>(new Set())
  const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set())
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set())
  const [extraQuantities, setExtraQuantities] = useState<{ [key: string]: number }>({
    "Spa Treatment": 2,
    "Dinner Package": 1,
  })

  const toggleRoomSelection = (roomId: number) => {
    const newSelected = new Set(selectedRooms)
    if (newSelected.has(roomId)) {
      newSelected.delete(roomId)
    } else {
      newSelected.clear() // Only one room can be selected
      newSelected.add(roomId)
    }
    setSelectedRooms(newSelected)
  }

  const toggleAttributeSelection = (attributeKey: string) => {
    const newSelected = new Set(selectedAttributes)
    if (newSelected.has(attributeKey)) {
      newSelected.delete(attributeKey)
    } else {
      newSelected.add(attributeKey)
    }
    setSelectedAttributes(newSelected)
  }

  const toggleExtraSelection = (extraName: string) => {
    const newSelected = new Set(selectedExtras)
    if (newSelected.has(extraName)) {
      newSelected.delete(extraName)
    } else {
      newSelected.add(extraName)
    }
    setSelectedExtras(newSelected)
  }

  const updateQuantity = (itemName: string, change: number) => {
    setExtraQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + change),
    }))
  }

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "text-green-600"
    if (popularity >= 70) return "text-yellow-600"
    return "text-gray-500"
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Room Upgrade Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b px-4 py-3">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-blue-600" />
              Room Upgrades
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                {roomUpgrades.length} options
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-10">
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Room Type
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Price/Night</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="min-w-[250px]">Features</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomUpgrades.map((room) => (
                    <TableRow
                      key={room.id}
                      className={`group hover:bg-blue-50/50 transition-all duration-200 cursor-pointer ${
                        selectedRooms.has(room.id) ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => toggleRoomSelection(room.id)}
                    >
                      <TableCell className="text-center px-3 py-2">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={room.image || "/placeholder.svg"} alt={room.type} />
                            <AvatarFallback className="text-lg">RM</AvatarFallback>
                          </Avatar>
                          {selectedRooms.has(room.id) && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{room.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{room.rating}</span>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                room.availability === "Limited"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {room.availability}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium px-3 py-2">{room.price}</TableCell>
                      <TableCell className="text-right font-semibold text-lg px-3 py-2">{(parseFloat(room.price.replace('€', '')) * 5).toFixed(0)}€</TableCell>
                      <TableCell className="text-right font-medium text-green-600 px-3 py-2">{(parseFloat(room.price.replace('€', '')) * 0.1).toFixed(1)}€</TableCell>
                      <TableCell className="px-3 py-2">
                        <div className="space-y-1">
                          {room.features.split(", ").map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 mr-1">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-3 py-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectRoom(room)
                          }}
                          className={`transition-all duration-200 ${
                            selectedRooms.has(room.id)
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-600 hover:bg-gray-700"
                          }`}
                        >
                          {selectedRooms.has(room.id) ? "Selected" : "Select Room"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Attributes Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b px-4 py-3">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              <Building2 className="h-6 w-6 text-green-600" />
              Room Attributes
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                {Object.values(attributes).reduce((acc, cat) => acc + cat.items.length, 0)} options
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-10">
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[180px]">Attribute</TableHead>
                    <TableHead className="text-right">Price/Night</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(attributes).map(([category, data]) =>
                    data.items.map((item, index) => {
                      const itemKey = `${category}-${index}`
                      const isSelected = selectedAttributes.has(itemKey)
                      return (
                        <TableRow
                          key={itemKey}
                          className={`group hover:bg-green-50/50 transition-all duration-200 cursor-pointer ${
                            isSelected ? "bg-green-50 border-l-4 border-l-green-500" : ""
                          }`}
                          onClick={() => toggleAttributeSelection(itemKey)}
                        >
                          <TableCell className="text-center px-3 py-2">
                            <div className="flex flex-col items-center gap-2">
                              {isSelected && <Check className="h-4 w-4 text-green-600" />}
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium px-3 py-2">{item.price}</TableCell>
                          <TableCell className="text-right font-semibold px-3 py-2">{(parseFloat(item.price.replace('€', '').replace(',', '.')) * 5).toFixed(0)}€</TableCell>
                          <TableCell className="text-right font-medium text-green-600 px-3 py-2">{(parseFloat(item.price.replace('€', '').replace(',', '.')) * 0.1).toFixed(1)}€</TableCell>
                          <TableCell className="text-gray-600 px-3 py-2">{item.description}</TableCell>
                          <TableCell className="text-center px-3 py-2">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onAddToCart(item)
                              }}
                              className={`transition-all duration-200 ${
                                isSelected ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                              }`}
                            >
                              {isSelected ? "Added" : "Add to Cart"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    }),
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>


        {/* Extras Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b px-4 py-3">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-amber-600" />
              Extra Services
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                {extras.length} services
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-10">
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[180px]">Service</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead className="text-right">Total Price</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extras.map((extra, index) => {
                    const isSelected = selectedExtras.has(extra.name)
                    return (
                      <TableRow
                        key={index}
                        className={`group hover:bg-amber-50/50 transition-all duration-200 cursor-pointer ${
                          isSelected ? "bg-amber-50 border-l-4 border-l-amber-500" : ""
                        }`}
                        onClick={() => toggleExtraSelection(extra.name)}
                      >
                        <TableCell className="text-center px-3 py-2">
                          <div className="flex flex-col items-center gap-2">
                            {isSelected && <Check className="h-4 w-4 text-amber-600" />}
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{extra.name}</span>
                              {extra.popularity >= 80 && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{extra.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-3 py-2">
                          <div className="space-y-1">
                            <div className="font-medium">{extra.price}</div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{extra.priceType}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-3 py-2">
                          {extra.name === "Spa Treatment" || extra.name === "Dinner Package" ? (
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateQuantity(extra.name, -1)
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {extraQuantities[extra.name] || extra.units}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateQuantity(extra.name, 1)
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              {extra.name === "Dinner Package" && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => e.stopPropagation()}
                                      className="ml-2"
                                    >
                                      <CalendarDays className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Select dining dates</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          ) : (
                            <span className="font-medium">{extra.units}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold px-3 py-2">{(parseFloat(extra.price.replace('€', '')) * (extraQuantities[extra.name] || extra.units)).toFixed(0)}€</TableCell>
                        <TableCell className="text-right font-medium text-green-600 px-3 py-2">{(parseFloat(extra.price.replace('€', '')) * 0.1 * (extraQuantities[extra.name] || extra.units)).toFixed(1)}€</TableCell>
                        <TableCell className="text-center px-3 py-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddToCart(extra)
                            }}
                            className={`transition-all duration-200 ${
                              isSelected ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-600 hover:bg-gray-700"
                            }`}
                          >
                            {isSelected ? "Added" : "Add to Cart"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
