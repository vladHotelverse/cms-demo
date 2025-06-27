"use client"

import { useState } from "react"
import { Calendar, User, Bed, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import EnhancedServicesTables from "./enhanced-services-tables"
import EnhancedTableView from "./enhanced-table-view"

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

export default function ReservationDetailsTab({
  reservation,
  onShowAlert,
  onCloseTab,
  isInReservationMode,
}: ReservationDetailsTabProps) {
  const [selectedRoomType, setSelectedRoomType] = useState("deluxe")
  const [selectedSegment, setSelectedSegment] = useState("premium")
  const [selectedAgent, setSelectedAgent] = useState("agent1")
  const [viewMode, setViewMode] = useState<"list" | "blocks">("list")
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [selectedCommissionReason, setSelectedCommissionReason] = useState("")
  const [cartItems, setCartItems] = useState<any[]>([])
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

  const handleAddToCart = (item: any) => {
    setCartItems((prev) => [...prev, item])
    onShowAlert("success", `${item.name} added to cart`)
  }

  const handleSelectRoom = (room: any) => {
    onShowAlert("success", `${room.type} selected`)
  }

  // Calculate dynamic total price
  const calculateTotal = () => {
    const baseRoomPrice = 250.00
    const extraServicesPrice = 78.90
    
    // Calculate cart items total (assuming each cart item has a price property)
    const cartItemsTotal = cartItems.reduce((sum, item) => {
      // If item has a numeric price property, use it; otherwise default to 15.00 per item
      const itemPrice = typeof item.price === 'number' ? item.price : 
                       typeof item.total === 'string' ? parseFloat(item.total.replace(/[€,]/g, '')) :
                       15.00
      return sum + itemPrice
    }, 0)
    
    return (baseRoomPrice + extraServicesPrice + cartItemsTotal).toFixed(2)
  }

  // Calculate cart items total for display
  const calculateCartItemsTotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : 
                       typeof item.total === 'string' ? parseFloat(item.total.replace(/[€,]/g, '')) :
                       15.00
      return sum + itemPrice
    }, 0).toFixed(2)
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

          {/* Bottom Section - Dynamic View Based on Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services Tables - Dynamic View */}
            <div className="lg:col-span-2">
              {viewMode === "list" ? (
                <EnhancedTableView onAddToCart={handleAddToCart} onSelectRoom={handleSelectRoom} />
              ) : (
                <EnhancedServicesTables onAddToCart={handleAddToCart} onSelectRoom={handleSelectRoom} />
              )}
            </div>

            {/* Price Summary Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
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
                    {cartItems.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Cart items ({cartItems.length})</span>
                        <span className="font-medium">€{calculateCartItemsTotal()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>{t("currentLanguage") === "es" ? "Total" : "Total"}</span>
                      <span>€{calculateTotal()}</span>
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
