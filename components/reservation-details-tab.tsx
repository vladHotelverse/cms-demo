"use client"

import { useState } from "react"
import { Calendar, User, Bed, CreditCard, Plus, Minus, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/contexts/language-context"

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

interface ReservationDetailsTabProps {
  reservation: ReservationData
  onShowAlert: (type: "success" | "error", message: string) => void
  onCloseTab: () => void
  isInReservationMode: boolean
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
const attributes = {
  "Bed Type": [
    {
      name: "Double Size Bed",
      price: "2€ - 3€",
      total: "10€ - 15€",
      commission: "0,10€ - 0,15€",
      description: "Bed size 135x200",
    },
    {
      name: "Queen Size Bed",
      price: "3,50€ - 4€",
      total: "17,50€ - 20€",
      commission: "0,17€ - 0,20€",
      description: "Bed size 150x200",
    },
    {
      name: "King Size Bed",
      price: "5€ - 7€",
      total: "25€ - 35€",
      commission: "0,25€ - 0,40€",
      description: "Bed size 180x200",
    },
    {
      name: "Extra King Size Bed",
      price: "8€ - 10€",
      total: "40€ - 50€",
      commission: "0,45€ - 0,50€",
      description: "Bed size 200x200",
    },
  ],
  Location: [
    {
      name: "Close to Main Pool",
      price: "2€ - 3€",
      total: "10€ - 15€",
      commission: "0,10€ - 0,15€",
      description: "Close to hotel Main Pool",
    },
    {
      name: "In Main Building",
      price: "3,50€ - 4€",
      total: "17,50€ - 20€",
      commission: "0,17€ - 0,20€",
      description: "Near Hotel Entrance",
    },
    {
      name: "Corner Room",
      price: "5€ - 7€",
      total: "25€ - 35€",
      commission: "0,25€ - 0,40€",
      description: "Extra Balcony Size",
    },
    {
      name: "Quiet Area",
      price: "8€ - 10€",
      total: "40€ - 50€",
      commission: "0,45€ - 0,50€",
      description: "For Business Guests",
    },
    {
      name: "Direct Pool Access",
      price: "9€ - 12€",
      total: "45€ - 60€",
      commission: "0,55€ - 0,65€",
      description: "Swim-out",
    },
  ],
  Floor: [
    {
      name: "Lower Floor",
      price: "2€ - 3€",
      total: "10€ - 15€",
      commission: "0,10€ - 0,15€",
      description: "Lower floor",
    },
    {
      name: "Intermediate Floor",
      price: "3,50€ - 4€",
      total: "17,50€ - 20€",
      commission: "0,17€ - 0,20€",
      description: "Floors 1 - 3",
    },
    {
      name: "Higher Floors",
      price: "5€ - 7€",
      total: "25€ - 35€",
      commission: "0,25€ - 0,40€",
      description: "Floors 4-6",
    },
    { name: "Rooftop", price: "8€ - 10€", total: "40€ - 50€", commission: "0,45€ - 0,50€", description: "Floor 7" },
  ],
}

// Extras data
const extras = [
  {
    name: "Early Check In (link)",
    price: "5€ - 7€",
    priceType: "per stay",
    units: 1,
    total: "5€ - 7€",
    commission: "0,25€ - 0,50€",
  },
  {
    name: "Spa (link)",
    price: "35€ - 45€",
    priceType: "per treatment",
    units: 2,
    total: "70€ - 90€",
    commission: "3,50€ - 5€",
  },
  {
    name: "Dinner (link)",
    price: "50€ - 70€",
    priceType: "per person/date",
    units: 1,
    total: "100€ - 140€",
    commission: "5,50€ - 6,50€",
  },
  {
    name: "Pool Bed (link)",
    price: "2€ - 4€",
    priceType: "per day",
    units: 1,
    total: "4€ - 8€",
    commission: "0,25€ - 0,50€",
  },
  {
    name: "Late Check Out (link)",
    price: "5€ - 7€",
    priceType: "per stay",
    units: 1,
    total: "5€ - 7€",
    commission: "0,25€ - 0,50€",
  },
]

export default function ReservationDetailsTab({
  reservation,
  onShowAlert,
  onCloseTab,
  isInReservationMode,
}: ReservationDetailsTabProps) {
  const [selectedRoomType, setSelectedRoomType] = useState("deluxe")
  const [selectedSegment, setSelectedSegment] = useState("premium")
  const [selectedAgent, setSelectedAgent] = useState("agent1")
  const [viewMode, setViewMode] = useState<"list" | "blocks">("blocks")
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [selectedCommissionReason, setSelectedCommissionReason] = useState("")
  const [extraQuantities, setExtraQuantities] = useState<{ [key: string]: number }>({
    "Spa (link)": 2,
    "Dinner (link)": 1,
    "Pool Bed (link)": 1,
  })
  const { t } = useLanguage()

  const handleConfirmBooking = () => {
    setIsCommissionModalOpen(true)
  }

  const handleCommissionConfirm = () => {
    if (!selectedCommissionReason) {
      onShowAlert("error", t("pleaseSelectReason"))
      return
    }

    console.log("Booking confirmed with commission reason:", selectedCommissionReason)

    setIsCommissionModalOpen(false)
    setSelectedCommissionReason("")

    onShowAlert("success", t("bookingConfirmedSuccessfully"))

    setTimeout(() => {
      onCloseTab()
    }, 2000)
  }

  const handleCommissionCancel = () => {
    setIsCommissionModalOpen(false)
    setSelectedCommissionReason("")
  }

  const updateQuantity = (itemName: string, change: number) => {
    setExtraQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + change),
    }))
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Hotel Image Section */}
        <div
          className="h-64 bg-cover bg-center bg-no-repeat rounded-lg relative"
          style={{
            backgroundImage: `url('/images/hotel-aerial-view.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-bold">{reservation.name}</h1>
            <p className="text-lg opacity-90">{reservation.locator}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Section - Configuration and Reservation Info */}
          <div className="space-y-6">
            {/* Configuration Section */}
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">{t("configuration")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-medium text-gray-600 whitespace-nowrap">{t("viewAs")}</Label>
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

            {/* Reservation Info Section */}
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
                      <TableRow>
                        <TableHead>Room Type</TableHead>
                        <TableHead>Price/Night</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomUpgrades.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.type}</TableCell>
                          <TableCell>{room.priceRange}</TableCell>
                          <TableCell>{room.totalPrice}</TableCell>
                          <TableCell>{room.commission}</TableCell>
                          <TableCell>{room.features}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="secondary">
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
                      <TableRow>
                        <TableHead>Attribute Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price/Night</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(attributes).map(([category, items]) =>
                        items.map((item, index) => (
                          <TableRow key={`${category}-${index}`}>
                            {index === 0 && (
                              <TableCell
                                rowSpan={items.length}
                                className="font-medium border-r bg-gray-50 text-center align-middle"
                                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                              >
                                {category}
                              </TableCell>
                            )}
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.total}</TableCell>
                            <TableCell>{item.commission}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="secondary">
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
                      src="/images/hotel-aerial-view.png"
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
                      <TableRow>
                        <TableHead>Extra</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Price Type</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Total Price</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {extras.map((extra, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{extra.name}</TableCell>
                          <TableCell>{extra.price}</TableCell>
                          <TableCell>{extra.priceType}</TableCell>
                          <TableCell>
                            {extra.name === "Spa (link)" || extra.name === "Dinner (link)" ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(extra.name, -1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{extraQuantities[extra.name] || extra.units}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(extra.name, 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                {extra.name === "Dinner (link)" && (
                                  <Button size="sm" variant="outline" className="ml-2">
                                    <CalendarDays className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ) : (
                              <span>{extra.units}</span>
                            )}
                          </TableCell>
                          <TableCell>{extra.total}</TableCell>
                          <TableCell>{extra.commission}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="secondary">
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
