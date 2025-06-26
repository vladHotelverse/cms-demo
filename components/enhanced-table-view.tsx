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

// Enhanced room upgrade data with additional metadata
const roomUpgrades = [
  {
    id: 1,
    type: "Deluxe Ocean View",
    category: "Premium",
    priceRange: "20€ - 30€",
    totalPrice: "100€ - 150€",
    commission: "10€ - 15€",
    features: "Double Size Bed, Private Terrace, Pool View",
    popularity: 85,
    availability: "Limited",
    rating: 4.8,
    image: "/hotel-room-ocean-view.png",
    highlights: ["Most Popular", "Best Value"],
    icon: "🏨",
  },
  {
    id: 2,
    type: "Suite Sea Side",
    category: "Luxury",
    priceRange: "25€ - 35€",
    totalPrice: "125€ - 175€",
    commission: "15€ - 20€",
    features: "Queen Size Bed, Large Terrace, Sea Side View",
    popularity: 92,
    availability: "Available",
    rating: 4.9,
    image: "/luxury-hotel-suite.png",
    highlights: ["Premium Choice"],
    icon: "👑",
  },
  {
    id: 3,
    type: "King Suite Sea View",
    category: "Luxury",
    priceRange: "50€ - 60€",
    totalPrice: "250€ - 300€",
    commission: "22€ - 30€",
    features: "King Size Bed, Premium Terrace, Direct Sea View",
    popularity: 78,
    availability: "Available",
    rating: 5.0,
    image: "/king-suite-sea-view.png",
    highlights: ["Exclusive"],
    icon: "⭐",
  },
  {
    id: 4,
    type: "Presidential Suite",
    category: "Ultra Luxury",
    priceRange: "70€ - 80€",
    totalPrice: "350€ - 400€",
    commission: "35€ - 40€",
    features: "King Size Bed, Two-Story Terrace, Panoramic Sea View, Private Pool",
    popularity: 95,
    availability: "Limited",
    rating: 5.0,
    image: "/presidential-suite.png",
    highlights: ["Ultimate Experience"],
    icon: "💎",
  },
]

// Enhanced attributes with icons and metadata
const attributes = {
  "Bed Type": {
    icon: Building2,
    color: "bg-blue-50 text-blue-700",
    items: [
      {
        name: "Double Size Bed",
        price: "2€ - 3€",
        total: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Bed size 135x200",
        popularity: 65,
        icon: "🛏️",
      },
      {
        name: "Queen Size Bed",
        price: "3,50€ - 4€",
        total: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Bed size 150x200",
        popularity: 85,
        icon: "👑",
      },
      {
        name: "King Size Bed",
        price: "5€ - 7€",
        total: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Bed size 180x200",
        popularity: 75,
        icon: "🏰",
      },
      {
        name: "Extra King Size Bed",
        price: "8€ - 10€",
        total: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "Bed size 200x200",
        popularity: 45,
        icon: "💎",
      },
    ],
  },
  Location: {
    icon: MapPin,
    color: "bg-green-50 text-green-700",
    items: [
      {
        name: "Close to Main Pool",
        price: "2€ - 3€",
        total: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Close to hotel Main Pool",
        popularity: 90,
        icon: "🏊",
      },
      {
        name: "In Main Building",
        price: "3,50€ - 4€",
        total: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Near Hotel Entrance",
        popularity: 70,
        icon: "🏢",
      },
      {
        name: "Corner Room",
        price: "5€ - 7€",
        total: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Extra Balcony Size",
        popularity: 60,
        icon: "📐",
      },
      {
        name: "Quiet Area",
        price: "8€ - 10€",
        total: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "For Business Guests",
        popularity: 55,
        icon: "🤫",
      },
      {
        name: "Direct Pool Access",
        price: "9€ - 12€",
        total: "45€ - 60€",
        commission: "0,55€ - 0,65€",
        description: "Swim-out",
        popularity: 80,
        icon: "🏊‍♂️",
      },
    ],
  },
  Floor: {
    icon: Building2,
    color: "bg-purple-50 text-purple-700",
    items: [
      {
        name: "Lower Floor",
        price: "2€ - 3€",
        total: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Lower floor",
        popularity: 40,
        icon: "⬇️",
      },
      {
        name: "Intermediate Floor",
        price: "3,50€ - 4€",
        total: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Floors 1 - 3",
        popularity: 75,
        icon: "🏢",
      },
      {
        name: "Higher Floors",
        price: "5€ - 7€",
        total: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Floors 4-6",
        popularity: 85,
        icon: "⬆️",
      },
      {
        name: "Rooftop",
        price: "8€ - 10€",
        total: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "Floor 7",
        popularity: 95,
        icon: "🏔️",
      },
    ],
  },
}

// Enhanced extras with better metadata
const extras = [
  {
    name: "Early Check In",
    price: "5€ - 7€",
    priceType: "per stay",
    units: 1,
    total: "5€ - 7€",
    commission: "0,25€ - 0,50€",
    icon: "⏰",
    description: "Check in before 3 PM",
    popularity: 80,
    category: "Convenience",
  },
  {
    name: "Spa Treatment",
    price: "35€ - 45€",
    priceType: "per treatment",
    units: 2,
    total: "70€ - 90€",
    commission: "3,50€ - 5€",
    icon: "🧘‍♀️",
    description: "Relaxing spa experience",
    popularity: 95,
    category: "Wellness",
  },
  {
    name: "Dinner Package",
    price: "50€ - 70€",
    priceType: "per person/date",
    units: 1,
    total: "100€ - 140€",
    commission: "5,50€ - 6,50€",
    icon: "🍽️",
    description: "Premium dining experience",
    popularity: 70,
    category: "Dining",
  },
  {
    name: "Pool Bed Reservation",
    price: "2€ - 4€",
    priceType: "per day",
    units: 1,
    total: "4€ - 8€",
    commission: "0,25€ - 0,50€",
    icon: "🏖️",
    description: "Reserved poolside seating",
    popularity: 60,
    category: "Recreation",
  },
  {
    name: "Late Check Out",
    price: "5€ - 7€",
    priceType: "per stay",
    units: 1,
    total: "5€ - 7€",
    commission: "0,25€ - 0,50€",
    icon: "🕐",
    description: "Check out after 12 PM",
    popularity: 85,
    category: "Convenience",
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
          <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-3">
              <Crown className="h-6 w-6 text-blue-600" />
              Room Upgrades
              <Badge variant="secondary" className="ml-2">
                {roomUpgrades.length} options
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Room Type
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="h-4 w-4" />
                        Popularity
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
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={room.image || "/placeholder.svg"} alt={room.type} />
                            <AvatarFallback className="text-lg">{room.icon}</AvatarFallback>
                          </Avatar>
                          {selectedRooms.has(room.id) && <Check className="h-4 w-4 text-blue-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{room.type}</span>
                            {room.highlights.map((highlight, index) => (
                              <Badge
                                key={index}
                                variant={highlight === "Most Popular" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {room.category}
                            </Badge>
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
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Progress value={room.popularity} className="w-16 h-2" />
                          <span className={`text-xs font-medium ${getPopularityColor(room.popularity)}`}>
                            {room.popularity}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{room.priceRange}</TableCell>
                      <TableCell className="text-right font-semibold text-lg">{room.totalPrice}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">{room.commission}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {room.features.split(", ").map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
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
          <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-3">
              <Building2 className="h-6 w-6 text-green-600" />
              Room Attributes
              <Badge variant="secondary" className="ml-2">
                {Object.values(attributes).reduce((acc, cat) => acc + cat.items.length, 0)} options
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-32">Category</TableHead>
                    <TableHead className="min-w-[180px]">Attribute</TableHead>
                    <TableHead className="text-center">Popularity</TableHead>
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
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="text-lg">{item.icon}</div>
                              {isSelected && <Check className="h-4 w-4 text-green-600" />}
                            </div>
                          </TableCell>
                          {index === 0 && (
                            <TableCell
                              rowSpan={data.items.length}
                              className={`text-center font-semibold border-r ${data.color} align-middle`}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <data.icon className="h-5 w-5" />
                                <span className="text-sm">{category}</span>
                              </div>
                            </TableCell>
                          )}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.name}</span>
                              {item.popularity >= 80 && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Progress value={item.popularity} className="w-16 h-2" />
                              <span className={`text-xs font-medium ${getPopularityColor(item.popularity)}`}>
                                {item.popularity}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">{item.price}</TableCell>
                          <TableCell className="text-right font-semibold">{item.total}</TableCell>
                          <TableCell className="text-right font-medium text-green-600">{item.commission}</TableCell>
                          <TableCell className="text-gray-600">{item.description}</TableCell>
                          <TableCell className="text-center">
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

        {/* CYR Map */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-3">
              <MapPin className="h-6 w-6 text-purple-600" />
              Resort Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-inner">
              <img
                src="/images/hotel-aerial-view.png"
                alt="Resort aerial view map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">Resort Overview</h3>
                <p className="text-sm opacity-90">Interactive map coming soon</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" className="absolute top-4 right-4 bg-white/90 hover:bg-white">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View full map</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Extras Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-3">
              <Zap className="h-6 w-6 text-amber-600" />
              Extra Services
              <Badge variant="secondary" className="ml-2">
                {extras.length} services
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[180px]">Service</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Popularity</TableHead>
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
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-lg">{extra.icon}</div>
                            {isSelected && <Check className="h-4 w-4 text-amber-600" />}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{extra.name}</span>
                              {extra.popularity >= 80 && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{extra.description}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-xs">
                            {extra.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Progress value={extra.popularity} className="w-16 h-2" />
                            <span className={`text-xs font-medium ${getPopularityColor(extra.popularity)}`}>
                              {extra.popularity}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1">
                            <div className="font-medium">{extra.price}</div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{extra.priceType}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {extra.name === "Spa Treatment" || extra.name === "Dinner Package" ? (
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateQuantity(extra.name, -1)
                                }}
                                className="h-8 w-8 p-0"
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
                                className="h-8 w-8 p-0"
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
                        <TableCell className="text-right font-semibold">{extra.total}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">{extra.commission}</TableCell>
                        <TableCell className="text-center">
                          <Button
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
