"use client"

import { useState } from "react"
import { Plus, Minus, CalendarDays, Check, Star, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhancedServicesTablesProps {
  onAddToCart: (item: any) => void
  onSelectRoom: (room: any) => void
}

// Enhanced data structure with additional metadata
const roomUpgrades = [
  {
    id: 1,
    type: "Deluxe Ocean View",
    category: "Premium",
    priceRange: "20€ - 30€",
    totalPrice: "100€ - 150€",
    commission: "10€ - 15€",
    features: ["Double Size Bed", "Private Terrace", "Pool View"],
    highlights: ["Most Popular", "Best Value"],
    image: "/hotel-room-ocean-view.png",
    rating: 4.8,
    availability: "Limited",
  },
  {
    id: 2,
    type: "Suite Sea Side",
    category: "Luxury",
    priceRange: "25€ - 35€",
    totalPrice: "125€ - 175€",
    commission: "15€ - 20€",
    features: ["Queen Size Bed", "Large Terrace", "Sea Side View"],
    highlights: ["Premium Choice"],
    image: "/luxury-hotel-suite.png",
    rating: 4.9,
    availability: "Available",
  },
  {
    id: 3,
    type: "King Suite Sea View",
    category: "Luxury",
    priceRange: "50€ - 60€",
    totalPrice: "250€ - 300€",
    commission: "22€ - 30€",
    features: ["King Size Bed", "Premium Terrace", "Direct Sea View"],
    highlights: ["Exclusive"],
    image: "/king-suite-sea-view.png",
    rating: 5.0,
    availability: "Available",
  },
  {
    id: 4,
    type: "Presidential Suite",
    category: "Ultra Luxury",
    priceRange: "70€ - 80€",
    totalPrice: "350€ - 400€",
    commission: "35€ - 40€",
    features: ["King Size Bed", "Two-Story Terrace", "Panoramic Sea View", "Private Pool"],
    highlights: ["Ultimate Experience"],
    image: "/presidential-suite.png",
    rating: 5.0,
    availability: "Limited",
  },
]

const attributeCategories = {
  "Bed Type": {
    icon: "🛏️",
    items: [
      {
        name: "Double Size Bed",
        price: "2€ - 3€",
        total: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Bed size 135x200",
        popular: false,
      },
      {
        name: "Queen Size Bed",
        price: "3,50€ - 4€",
        total: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Bed size 150x200",
        popular: true,
      },
      {
        name: "King Size Bed",
        price: "5€ - 7€",
        total: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Bed size 180x200",
        popular: false,
      },
      {
        name: "Extra King Size Bed",
        price: "8€ - 10€",
        total: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "Bed size 200x200",
        popular: false,
      },
    ],
  },
  Location: {
    icon: "📍",
    items: [
      {
        name: "Close to Main Pool",
        price: "2€ - 3€",
        total: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Close to hotel Main Pool",
        popular: true,
      },
      {
        name: "In Main Building",
        price: "3,50€ - 4€",
        total: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Near Hotel Entrance",
        popular: false,
      },
      {
        name: "Corner Room",
        price: "5€ - 7€",
        total: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Extra Balcony Size",
        popular: false,
      },
      {
        name: "Quiet Area",
        price: "8€ - 10€",
        total: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "For Business Guests",
        popular: false,
      },
      {
        name: "Direct Pool Access",
        price: "9€ - 12€",
        total: "45€ - 60€",
        commission: "0,55€ - 0,65€",
        description: "Swim-out",
        popular: false,
      },
    ],
  },
  Floor: {
    icon: "🏢",
    items: [
      {
        name: "Lower Floor",
        price: "2€ - 3€",
        total: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Lower floor",
        popular: false,
      },
      {
        name: "Intermediate Floor",
        price: "3,50€ - 4€",
        total: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Floors 1 - 3",
        popular: true,
      },
      {
        name: "Higher Floors",
        price: "5€ - 7€",
        total: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Floors 4-6",
        popular: false,
      },
      {
        name: "Rooftop",
        price: "8€ - 10€",
        total: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "Floor 7",
        popular: false,
      },
    ],
  },
}

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
    popular: true,
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
    popular: true,
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
    popular: false,
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
    popular: false,
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
    popular: true,
  },
]

export default function EnhancedServicesTables({ onAddToCart, onSelectRoom }: EnhancedServicesTablesProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Bed Type"]))
  const [extraQuantities, setExtraQuantities] = useState<{ [key: string]: number }>({
    "Spa Treatment": 2,
    "Dinner Package": 1,
  })

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const updateQuantity = (itemName: string, change: number) => {
    setExtraQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + change),
    }))
  }

  const toggleSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Room Upgrade Cards */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              🏨 Room Upgrades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomUpgrades.map((room) => (
                <Card
                  key={room.id}
                  className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200"
                >
                  <div className="absolute top-3 right-3 z-10">
                    {room.highlights.map((highlight, index) => (
                      <Badge
                        key={index}
                        variant={highlight === "Most Popular" ? "default" : "secondary"}
                        className="mb-1 block text-xs"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={room.type}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {room.category}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{room.type}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{room.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Per Night:</span>
                        <span className="font-medium">{room.priceRange}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-lg">{room.totalPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Commission:</span>
                        <span className="text-green-600 font-medium">{room.commission}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {room.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          room.availability === "Limited"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {room.availability}
                      </span>
                      <Button onClick={() => onSelectRoom(room)} className="bg-blue-600 hover:bg-blue-700">
                        Select Room
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attributes - Collapsible Categories */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              ⚙️ Room Attributes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {Object.entries(attributeCategories).map(([category, data]) => (
              <Collapsible
                key={category}
                open={expandedCategories.has(category)}
                onOpenChange={() => toggleCategory(category)}
              >
                <CollapsibleTrigger className="w-full p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{data.icon}</span>
                      <span className="font-semibold text-lg">{category}</span>
                      <Badge variant="secondary" className="ml-2">
                        {data.items.length} options
                      </Badge>
                    </div>
                    {expandedCategories.has(category) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                      {data.items.map((item, index) => (
                        <Card
                          key={`${category}-${index}`}
                          className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedItems.has(`${category}-${index}`)
                              ? "ring-2 ring-blue-500 bg-blue-50"
                              : "hover:bg-white"
                          }`}
                          onClick={() => toggleSelection(`${category}-${index}`)}
                        >
                          {item.popular && <Badge className="absolute -top-2 -right-2 bg-orange-500">Popular</Badge>}

                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{item.name}</h4>
                              {selectedItems.has(`${category}-${index}`) && <Check className="h-4 w-4 text-blue-600" />}
                            </div>

                            <p className="text-xs text-gray-600 mb-3">{item.description}</p>

                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Per night:</span>
                                <span className="font-medium">{item.price}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total:</span>
                                <span className="font-semibold">{item.total}</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>Commission:</span>
                                <span className="font-medium">{item.commission}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* CYR Map - Enhanced */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              🗺️ Resort Map
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
            </div>
          </CardContent>
        </Card>

        {/* Extras - Enhanced Cards */}
        <Card>
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
            <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
              ✨ Extra Services
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {extras.map((extra, index) => (
                <Card
                  key={index}
                  className="relative hover:shadow-lg transition-all duration-300 border hover:border-orange-200"
                >
                  {extra.popular && <Badge className="absolute -top-2 -right-2 bg-orange-500">Popular</Badge>}

                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{extra.icon}</span>
                      <div>
                        <h3 className="font-semibold">{extra.name}</h3>
                        <p className="text-xs text-gray-600">{extra.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">{extra.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{extra.priceType}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold">{extra.total}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Commission:</span>
                        <span className="font-medium">{extra.commission}</span>
                      </div>
                    </div>

                    {(extra.name === "Spa Treatment" || extra.name === "Dinner Package") && (
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(extra.name, -1)}
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
                          onClick={() => updateQuantity(extra.name, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {extra.name === "Dinner Package" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" className="ml-2">
                                <CalendarDays className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select dining dates</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}

                    <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => onAddToCart(extra)}>
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
