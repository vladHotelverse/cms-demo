"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Bed, CreditCard, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "./header"
import { useLanguage } from "@/contexts/language-context"
import "./styles.css"

interface ReservationData {
  id: string
  locator: string
  name: string
  email: string
  checkIn: string
  checkOut: string
  aci: string
  status: string
  hasHotelverseRequest: boolean
}

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  reservation: ReservationData | null
}

// Sample room types
const roomTypes = [
  { id: "standard", name: "Standard Room" },
  { id: "deluxe", name: "Deluxe Double Room" },
  { id: "suite", name: "Suite" },
  { id: "premium", name: "Premium Room" },
  { id: "family", name: "Family Room" },
]

// Sample segments
const segments = [
  { id: "standard", name: "Standard" },
  { id: "premium", name: "Premium" },
  { id: "luxury", name: "Luxury" },
  { id: "business", name: "Business" },
  { id: "family", name: "Family" },
]

// Sample agents
const agents = [
  { id: "agent1", name: "Ana García" },
  { id: "agent2", name: "Carlos López" },
  { id: "agent3", name: "María Fernández" },
  { id: "agent4", name: "Pedro Martínez" },
]

// Commission reasons
const commissionReasons = [
  { id: "upsell", name: "Upsell Services" },
  { id: "room_upgrade", name: "Room Upgrade" },
  { id: "extended_stay", name: "Extended Stay" },
  { id: "additional_services", name: "Additional Services" },
  { id: "special_package", name: "Special Package" },
  { id: "loyalty_program", name: "Loyalty Program Benefits" },
]

// Room upgrade data
const roomUpgrades = [
  {
    id: 1,
    type: "Room Type 01 (link)",
    priceRange: "20€ - 30€",
    totalPrice: "100€ - 150€",
    commission: "10€ - 15€",
    features: "Double Size Bed, Terrace, Pool View",
  },
  {
    id: 2,
    type: "Room Type 02 (link)",
    priceRange: "25€ - 35€",
    totalPrice: "125€ - 175€",
    commission: "15€ - 20€",
    features: "Queen Size Bed, Terrace, Sea Side View",
  },
  {
    id: 3,
    type: "Room Type 03 (link)",
    priceRange: "50€ - 60€",
    totalPrice: "250€ - 300€",
    commission: "22€ - 30€",
    features: "King Size Bed, Terrace, Sea View",
  },
  {
    id: 4,
    type: "Room Type 04 (link)",
    priceRange: "70€ - 80€",
    totalPrice: "350€ - 400€",
    commission: "35€ - 40€",
    features: "King Size Bed, Two-Story Terrace, Sea View",
  },
]

// Attributes data
const attributes = [
  {
    category: "Bed Type",
    items: [
      {
        name: "Double Size Bed",
        priceRange: "2€ - 3€",
        totalPrice: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Bed size 135x200",
      },
      {
        name: "Queen Size Bed",
        priceRange: "3,50€ - 4€",
        totalPrice: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Bed size 150x200",
      },
      {
        name: "King Size Bed",
        priceRange: "5€ - 7€",
        totalPrice: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Bed size 180x200",
      },
      {
        name: "Extra King Size Bed",
        priceRange: "8€ - 10€",
        totalPrice: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "Bed size 200x200",
      },
    ],
  },
  {
    category: "Location",
    items: [
      {
        name: "Close to Main Pool",
        priceRange: "2€ - 3€",
        totalPrice: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Close to hotel Main Pool",
      },
      {
        name: "In Main Building",
        priceRange: "3,50€ - 4€",
        totalPrice: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Near Hotel Entrance",
      },
      {
        name: "Corner Room",
        priceRange: "5€ - 7€",
        totalPrice: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Extra Balcony Size",
      },
      {
        name: "Quiet Area",
        priceRange: "8€ - 10€",
        totalPrice: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "For Business Guests",
      },
      {
        name: "Direct Pool Access",
        priceRange: "9€ - 12€",
        totalPrice: "45€ - 60€",
        commission: "0,55€ - 0,65€",
        description: "Swim-out",
      },
    ],
  },
  {
    category: "Floor",
    items: [
      {
        name: "Lower Floor",
        priceRange: "2€ - 3€",
        totalPrice: "10€ - 15€",
        commission: "0,10€ - 0,15€",
        description: "Lower floor",
      },
      {
        name: "Intermediate Floor",
        priceRange: "3,50€ - 4€",
        totalPrice: "17,50€ - 20€",
        commission: "0,17€ - 0,20€",
        description: "Floors 1 - 3",
      },
      {
        name: "Higher Floors",
        priceRange: "5€ - 7€",
        totalPrice: "25€ - 35€",
        commission: "0,25€ - 0,40€",
        description: "Floors 4-6",
      },
      {
        name: "Rooftop",
        priceRange: "8€ - 10€",
        totalPrice: "40€ - 50€",
        commission: "0,45€ - 0,50€",
        description: "Floor 7",
      },
    ],
  },
]

// Extras data
const extrasData = [
  {
    id: 1,
    name: "Early Check In (link)",
    price: "5€ - 7€",
    priceType: "per stay",
    units: 1,
    totalPrice: "5€ - 7€",
    commission: "0,25€ - 0,50€",
  },
  {
    id: 2,
    name: "Spa (link)",
    price: "35€ - 45€",
    priceType: "per treatment",
    units: 2,
    totalPrice: "70€ - 90€",
    commission: "3,50€ - 5€",
  },
  {
    id: 3,
    name: "Dinner (link)",
    price: "50€ - 70€",
    priceType: "per person/date",
    units: 2,
    totalPrice: "100€ - 140€",
    commission: "5,50€ - 6,50€",
  },
  {
    id: 4,
    name: "Pool Bed (link)",
    price: "2€ - 4€",
    priceType: "per day",
    units: 1,
    totalPrice: "4€ - 8€",
    commission: "0,25€ - 0,50€",
  },
  {
    id: 5,
    name: "Late Check Out (link)",
    price: "5€ - 7€",
    priceType: "per stay",
    units: 1,
    totalPrice: "5€ - 7€",
    commission: "0,25€ - 0,50€",
  },
]

export default function ReservationModal({ isOpen, onClose, reservation }: ReservationModalProps) {
  const [selectedRoomType, setSelectedRoomType] = useState("deluxe")
  const [selectedSegment, setSelectedSegment] = useState("premium")
  const [selectedAgent, setSelectedAgent] = useState("agent1")
  const [viewMode, setViewMode] = useState<"list" | "blocks">("blocks")
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [selectedCommissionReason, setSelectedCommissionReason] = useState("")
  const [extras, setExtras] = useState(extrasData)
  const { t } = useLanguage()

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isCommissionModalOpen) {
          setIsCommissionModalOpen(false)
        } else {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, isCommissionModalOpen, onClose])

  const handleConfirmBooking = () => {
    setIsCommissionModalOpen(true)
  }

  const handleCommissionConfirm = () => {
    if (!selectedCommissionReason) {
      return
    }

    // Here you would handle the booking confirmation with the selected commission reason
    console.log("Booking confirmed with commission reason:", selectedCommissionReason)

    // Close both modals
    setIsCommissionModalOpen(false)
    setSelectedCommissionReason("")
    onClose()

    // You could show a success message here
    alert(t("currentLanguage") === "es" ? "Reserva confirmada exitosamente" : "Booking confirmed successfully")
  }

  const handleCommissionCancel = () => {
    setIsCommissionModalOpen(false)
    setSelectedCommissionReason("")
  }

  const updateExtraQuantity = (id: number, change: number) => {
    setExtras((prev) =>
      prev.map((extra) => (extra.id === id ? { ...extra, units: Math.max(0, extra.units + change) } : extra)),
    )
  }

  if (!isOpen || !reservation) return null

  return (
    <>
      <div className="reservation-modal-overlay" onClick={onClose}>
        <div className="reservation-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <Header
            totalPrice={328.9}
            currencySymbol="€"
            totalLabel="Total:"
            itemsInCart={0}
            isSticky={false}
            onCartClick={() => {}}
          />

          {/* Hotel Image Section */}
          <div
            className="hotel-image-section"
            style={{
              backgroundImage: `url('/images/hotel-aerial-view.png')`,
            }}
          >
            {/* Close button overlay */}
            <Button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              size="icon"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Reservation Information Section */}
          <div className="reservation-info-section">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Top Section - Reservation Info and Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side - Reservation Info */}
                <div className="lg:col-span-2">
                  {/* Configuration Section */}
                  <div>
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">
                          {t("currentLanguage") === "es" ? "Configuración" : "Configuration"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-6">
                          {/* View Mode Toggle */}
                          <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                              {t("currentLanguage") === "es" ? "Ver como:" : "View as:"}
                            </Label>
                            <div className="flex items-center gap-1">
                              <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="px-3"
                              >
                                Lista
                              </Button>
                              <Button
                                variant={viewMode === "blocks" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setViewMode("blocks")}
                                className="px-3"
                              >
                                Bloques
                              </Button>
                            </div>
                          </div>

                          {/* Segment Selector */}
                          <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                              {t("currentLanguage") === "es" ? "Segmento:" : "Segment:"}
                            </Label>
                            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {segments.map((segment) => (
                                  <SelectItem key={segment.id} value={segment.id}>
                                    {segment.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Agent Selector */}
                          <div className="flex items-center gap-3">
                            <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">
                              {t("currentLanguage") === "es" ? "Agente:" : "Agent:"}
                            </Label>
                            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {agents.map((agent) => (
                                  <SelectItem key={agent.id} value={agent.id}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Section - Reservation Info */}
                  <div>
                    <Card className="border-0 shadow-none">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">
                          {t("currentLanguage") === "es" ? "Información de tu reserva" : "Your reservation information"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Reservation Code */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <Label className="text-sm font-medium text-gray-600">
                                {t("currentLanguage") === "es" ? "Código de reserva" : "Reservation code"}
                              </Label>
                            </div>
                            <p className="font-semibold text-lg pl-6">{reservation.locator}</p>
                          </div>

                          {/* Stay Dates */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <Label className="text-sm font-medium text-gray-600">
                                {t("currentLanguage") === "es" ? "Fechas de estancia" : "Stay dates"}
                              </Label>
                            </div>
                            <p className="font-semibold text-lg pl-6">
                              {reservation.checkIn} - {reservation.checkOut}
                            </p>
                          </div>

                          {/* Room Type */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Bed className="h-4 w-4 text-gray-500" />
                              <Label className="text-sm font-medium text-gray-600">
                                {t("currentLanguage") === "es" ? "Tipo habitación" : "Room type"}
                              </Label>
                            </div>
                            <div className="pl-6">
                              <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomTypes.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>
                                      {room.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right side - Controls */}
                <div className="lg:col-span-1"></div>
              </div>

              <Separator />

              {/* Bottom Section - Tables and Price Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tables Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Room Upgrade Table */}
                  <Card>
                    <CardHeader className="bg-gray-100 border-b">
                      <CardTitle className="text-lg font-semibold text-center">Room Upgrade</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Room Type</TableHead>
                            <TableHead className="font-semibold">Price/Night</TableHead>
                            <TableHead className="font-semibold">Total Price</TableHead>
                            <TableHead className="font-semibold">Commission</TableHead>
                            <TableHead className="font-semibold">Features</TableHead>
                            <TableHead className="font-semibold w-32"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {roomUpgrades.map((room, index) => (
                            <TableRow key={room.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <TableCell className="font-medium text-blue-600 underline cursor-pointer">
                                {room.type}
                              </TableCell>
                              <TableCell>{room.priceRange}</TableCell>
                              <TableCell>{room.totalPrice}</TableCell>
                              <TableCell>{room.commission}</TableCell>
                              <TableCell>{room.features}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  className="bg-orange-200 hover:bg-orange-300 text-black border-0 w-full"
                                >
                                  Select Room
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Attributes Table */}
                  <Card>
                    <CardHeader className="bg-gray-100 border-b">
                      <CardTitle className="text-lg font-semibold text-center">Attributes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Attribute Type</TableHead>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Price/Night</TableHead>
                            <TableHead className="font-semibold">Total Price</TableHead>
                            <TableHead className="font-semibold">Commission</TableHead>
                            <TableHead className="font-semibold">Description</TableHead>
                            <TableHead className="font-semibold w-32"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attributes.map((category, categoryIndex) =>
                            category.items.map((item, itemIndex) => (
                              <TableRow
                                key={`${categoryIndex}-${itemIndex}`}
                                className={
                                  (categoryIndex * category.items.length + itemIndex) % 2 === 0
                                    ? "bg-white"
                                    : "bg-gray-50"
                                }
                              >
                                {itemIndex === 0 && (
                                  <TableCell
                                    rowSpan={category.items.length}
                                    className="font-medium text-center align-middle border-r bg-gray-100"
                                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                                  >
                                    {category.category}
                                  </TableCell>
                                )}
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.priceRange}</TableCell>
                                <TableCell>{item.totalPrice}</TableCell>
                                <TableCell>{item.commission}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    className="bg-orange-200 hover:bg-orange-300 text-black border-0 w-full"
                                  >
                                    Add to cart
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )),
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* CYR Map */}
                  <Card>
                    <CardHeader className="bg-gray-100 border-b">
                      <CardTitle className="text-lg font-semibold text-center">CYR Map</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-06-26%20a%20las%2016.13.47-9KjV7S9hTp7Cohm3CBjld87UGh9oOQ.png"
                          alt="Hotel aerial view map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Extras Table */}
                  <Card>
                    <CardHeader className="bg-gray-100 border-b">
                      <CardTitle className="text-lg font-semibold text-center">Extras</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold">Extra</TableHead>
                            <TableHead className="font-semibold">Price</TableHead>
                            <TableHead className="font-semibold">Price Type</TableHead>
                            <TableHead className="font-semibold">Units</TableHead>
                            <TableHead className="font-semibold">Total Price</TableHead>
                            <TableHead className="font-semibold">Commission</TableHead>
                            <TableHead className="font-semibold w-32"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {extras.map((extra, index) => (
                            <TableRow key={extra.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                              <TableCell className="font-medium text-blue-600 underline cursor-pointer">
                                {extra.name}
                              </TableCell>
                              <TableCell>{extra.price}</TableCell>
                              <TableCell>{extra.priceType}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateExtraQuantity(extra.id, -1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center">{extra.units}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateExtraQuantity(extra.id, 1)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>{extra.totalPrice}</TableCell>
                              <TableCell>{extra.commission}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  className="bg-orange-200 hover:bg-orange-300 text-black border-0 w-full"
                                >
                                  Add to cart
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>

                {/* Price Summary Section */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        {t("currentLanguage") === "es" ? "Resumen de Precios" : "Price Summary"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("currentLanguage") === "es" ? "Habitación base" : "Base room"}
                          </span>
                          <span className="font-medium">€250.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("currentLanguage") === "es" ? "Servicios extras" : "Extra services"}
                          </span>
                          <span className="font-medium">€78.90</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>{t("currentLanguage") === "es" ? "Total" : "Total"}</span>
                          <span>€328.90</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4" onClick={handleConfirmBooking}>
                        {t("currentLanguage") === "es" ? "Confirmar Reserva" : "Confirm Booking"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Reason Modal */}
      <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("currentLanguage") === "es" ? "Motivo de la Comisión" : "Commission Reason"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="commission-reason">
                {t("currentLanguage") === "es"
                  ? "Selecciona el motivo por el cual se cobrará la comisión:"
                  : "Select the reason why commission will be charged:"}
              </Label>
              <Select value={selectedCommissionReason} onValueChange={setSelectedCommissionReason}>
                <SelectTrigger id="commission-reason">
                  <SelectValue
                    placeholder={t("currentLanguage") === "es" ? "Seleccionar motivo..." : "Select reason..."}
                  />
                </SelectTrigger>
                <SelectContent>
                  {commissionReasons.map((reason) => (
                    <SelectItem key={reason.id} value={reason.id}>
                      {reason.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCommissionCancel}>
              {t("currentLanguage") === "es" ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={handleCommissionConfirm} disabled={!selectedCommissionReason}>
              {t("currentLanguage") === "es" ? "Confirmar" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
