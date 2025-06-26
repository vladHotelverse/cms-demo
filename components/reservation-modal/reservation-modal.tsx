"use client"

import { useState, useEffect } from "react"
import { X, Calendar, User, Bed, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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

export default function ReservationModal({ isOpen, onClose, reservation }: ReservationModalProps) {
  const [selectedRoomType, setSelectedRoomType] = useState("deluxe")
  const [selectedSegment, setSelectedSegment] = useState("premium")
  const [selectedAgent, setSelectedAgent] = useState("agent1")
  const [viewMode, setViewMode] = useState<"list" | "blocks">("blocks")
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false)
  const [selectedCommissionReason, setSelectedCommissionReason] = useState("")
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
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {t("currentLanguage") === "es" ? "Servicios Disponibles" : "Available Services"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                        <p className="text-sm">
                          {t("currentLanguage") === "es"
                            ? "Aquí se mostrarán las tablas de servicios y extras disponibles"
                            : "Here will be displayed the tables of available services and extras"}
                        </p>
                      </div>
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
