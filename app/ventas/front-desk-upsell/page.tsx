"use client"

import type React from "react"

import { useState } from "react"
import { ChevronUp, ChevronDown, X, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { FrontDeskHeader } from "@/components/front-desk-header"
import ReservationDetailsTab from "@/components/reservation-details-tab"

// Helper function to generate October dates
const generateOctoberDate = (dayOffset: number) => {
  const date = new Date(2024, 9, 15) // October 15, 2024 as base date
  date.setDate(date.getDate() + dayOffset)
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Helper function to calculate number of nights
const calculateNights = (stayDuration: number) => {
  return `${stayDuration} ${stayDuration === 1 ? 'noche' : 'noches'}`
}

// Room types for reference (used in data below)
// const roomTypes = ['Standard', 'Superior', 'Deluxe', 'Suite', 'Presidential Suite']

// Helper function to get extras status with total amounts
const getExtrasStatus = (hasItems: boolean, itemCount?: number) => {
  if (hasItems && itemCount) {
    const totalAmount = itemCount * 15 // Example price per item
    return `${itemCount} reservados (${totalAmount}€)`
  }
  return 'recomendación'
}

// Sample reservations data - 50 total: 25 for October 15th and 25 for October 16th
const reservations = [
  // 25 reservations for October 15th (today)
  { id: "3001", locator: "oct001", name: "Ana García", email: "ana@garcia.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Standard', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },
  { id: "3002", locator: "oct002", name: "Carlos López", email: "carlos@lopez.com", checkIn: generateOctoberDate(0), nights: calculateNights(4), roomType: 'Superior', aci: "1/1/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3003", locator: "oct003", name: "María Rodríguez", email: "maria@rodriguez.com", checkIn: generateOctoberDate(0), nights: calculateNights(2), roomType: 'Deluxe', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: false },
  { id: "3004", locator: "oct004", name: "José Martínez", email: "jose@martinez.com", checkIn: generateOctoberDate(0), nights: calculateNights(5), roomType: 'Suite', aci: "3/1/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3005", locator: "oct005", name: "Laura Sánchez", email: "laura@sanchez.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Presidential Suite', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },
  { id: "3006", locator: "oct006", name: "David González", email: "david@gonzalez.com", checkIn: generateOctoberDate(0), nights: calculateNights(4), roomType: 'Standard', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3007", locator: "oct007", name: "Carmen Fernández", email: "carmen@fernandez.com", checkIn: generateOctoberDate(0), nights: calculateNights(2), roomType: 'Superior', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: false },
  { id: "3008", locator: "oct008", name: "Miguel Pérez", email: "miguel@perez.com", checkIn: generateOctoberDate(0), nights: calculateNights(6), roomType: 'Deluxe', aci: "2/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3009", locator: "oct009", name: "Isabel Ruiz", email: "isabel@ruiz.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Suite', aci: "1/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },
  { id: "3010", locator: "oct010", name: "Antonio Jiménez", email: "antonio@jimenez.com", checkIn: generateOctoberDate(0), nights: calculateNights(4), roomType: 'Presidential Suite', aci: "3/0/1", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3011", locator: "oct011", name: "Pilar Moreno", email: "pilar@moreno.com", checkIn: generateOctoberDate(0), nights: calculateNights(2), roomType: 'Standard', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: false },
  { id: "3012", locator: "oct012", name: "Francisco Álvarez", email: "francisco@alvarez.com", checkIn: generateOctoberDate(0), nights: calculateNights(5), roomType: 'Superior', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3013", locator: "oct013", name: "Rosa Romero", email: "rosa@romero.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Deluxe', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },
  { id: "3014", locator: "oct014", name: "Manuel Torres", email: "manuel@torres.com", checkIn: generateOctoberDate(0), nights: calculateNights(4), roomType: 'Suite', aci: "2/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3015", locator: "oct015", name: "Dolores Vázquez", email: "dolores@vazquez.com", checkIn: generateOctoberDate(0), nights: calculateNights(2), roomType: 'Presidential Suite', aci: "1/1/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: false },
  { id: "3016", locator: "oct016", name: "Jesús Ramos", email: "jesus@ramos.com", checkIn: generateOctoberDate(0), nights: calculateNights(6), roomType: 'Standard', aci: "3/1/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3017", locator: "oct017", name: "Amparo Castro", email: "amparo@castro.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Superior', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },
  { id: "3018", locator: "oct018", name: "Ángel Ortega", email: "angel@ortega.com", checkIn: generateOctoberDate(0), nights: calculateNights(4), roomType: 'Deluxe', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3019", locator: "oct019", name: "Remedios Delgado", email: "remedios@delgado.com", checkIn: generateOctoberDate(0), nights: calculateNights(2), roomType: 'Suite', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: false },
  { id: "3020", locator: "oct020", name: "Fernando Herrera", email: "fernando@herrera.com", checkIn: generateOctoberDate(0), nights: calculateNights(5), roomType: 'Presidential Suite', aci: "2/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3021", locator: "oct021", name: "Encarnación Molina", email: "encarnacion@molina.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Standard', aci: "1/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },
  { id: "3022", locator: "oct022", name: "Rafael Vargas", email: "rafael@vargas.com", checkIn: generateOctoberDate(0), nights: calculateNights(4), roomType: 'Superior', aci: "3/0/1", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3023", locator: "oct023", name: "Josefa Iglesias", email: "josefa@iglesias.com", checkIn: generateOctoberDate(0), nights: calculateNights(2), roomType: 'Deluxe', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: false },
  { id: "3024", locator: "oct024", name: "Enrique Medina", email: "enrique@medina.com", checkIn: generateOctoberDate(0), nights: calculateNights(6), roomType: 'Suite', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: true },
  { id: "3025", locator: "oct025", name: "Concepción Garrido", email: "concepcion@garrido.com", checkIn: generateOctoberDate(0), nights: calculateNights(3), roomType: 'Presidential Suite', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: false },

  // 25 reservations for October 16th (tomorrow)
  { id: "4001", locator: "oct101", name: "Pablo Serrano", email: "pablo@serrano.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Standard', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
  { id: "4002", locator: "oct102", name: "Mercedes Peña", email: "mercedes@pena.com", checkIn: generateOctoberDate(1), nights: calculateNights(4), roomType: 'Superior', aci: "1/1/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4003", locator: "oct103", name: "Andrés Cruz", email: "andres@cruz.com", checkIn: generateOctoberDate(1), nights: calculateNights(2), roomType: 'Deluxe', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: true },
  { id: "4004", locator: "oct104", name: "Esperanza Flores", email: "esperanza@flores.com", checkIn: generateOctoberDate(1), nights: calculateNights(5), roomType: 'Suite', aci: "3/1/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4005", locator: "oct105", name: "Ramón Herrero", email: "ramon@herrero.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Presidential Suite', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
  { id: "4006", locator: "oct106", name: "Milagros Cabrera", email: "milagros@cabrera.com", checkIn: generateOctoberDate(1), nights: calculateNights(4), roomType: 'Standard', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4007", locator: "oct107", name: "Sebastián Bernal", email: "sebastian@bernal.com", checkIn: generateOctoberDate(1), nights: calculateNights(2), roomType: 'Superior', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: true },
  { id: "4008", locator: "oct108", name: "Asunción León", email: "asuncion@leon.com", checkIn: generateOctoberDate(1), nights: calculateNights(6), roomType: 'Deluxe', aci: "2/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4009", locator: "oct109", name: "Emilio Blanco", email: "emilio@blanco.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Suite', aci: "1/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
  { id: "4010", locator: "oct110", name: "Rosario Suárez", email: "rosario@suarez.com", checkIn: generateOctoberDate(1), nights: calculateNights(4), roomType: 'Presidential Suite', aci: "3/0/1", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4011", locator: "oct111", name: "Gregorio Vega", email: "gregorio@vega.com", checkIn: generateOctoberDate(1), nights: calculateNights(2), roomType: 'Standard', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: true },
  { id: "4012", locator: "oct112", name: "Purificación Morales", email: "purificacion@morales.com", checkIn: generateOctoberDate(1), nights: calculateNights(5), roomType: 'Superior', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4013", locator: "oct113", name: "Patricio Santos", email: "patricio@santos.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Deluxe', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
  { id: "4014", locator: "oct114", name: "Inmaculada Pastor", email: "inmaculada@pastor.com", checkIn: generateOctoberDate(1), nights: calculateNights(4), roomType: 'Suite', aci: "2/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4015", locator: "oct115", name: "Evaristo Lorenzo", email: "evaristo@lorenzo.com", checkIn: generateOctoberDate(1), nights: calculateNights(2), roomType: 'Presidential Suite', aci: "1/1/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: true },
  { id: "4016", locator: "oct116", name: "Nieves Pascual", email: "nieves@pascual.com", checkIn: generateOctoberDate(1), nights: calculateNights(6), roomType: 'Standard', aci: "3/1/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4017", locator: "oct117", name: "Celestino Soler", email: "celestino@soler.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Superior', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
  { id: "4018", locator: "oct118", name: "Visitación Aguilar", email: "visitacion@aguilar.com", checkIn: generateOctoberDate(1), nights: calculateNights(4), roomType: 'Deluxe', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4019", locator: "oct119", name: "Teodoro Lozano", email: "teodoro@lozano.com", checkIn: generateOctoberDate(1), nights: calculateNights(2), roomType: 'Suite', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: true },
  { id: "4020", locator: "oct120", name: "Natividad Cano", email: "natividad@cano.com", checkIn: generateOctoberDate(1), nights: calculateNights(5), roomType: 'Presidential Suite', aci: "2/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4021", locator: "oct121", name: "Leopoldo Prieto", email: "leopoldo@prieto.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Standard', aci: "1/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
  { id: "4022", locator: "oct122", name: "Presentación Calvo", email: "presentacion@calvo.com", checkIn: generateOctoberDate(1), nights: calculateNights(4), roomType: 'Superior', aci: "3/0/1", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4023", locator: "oct123", name: "Casimiro Campos", email: "casimiro@campos.com", checkIn: generateOctoberDate(1), nights: calculateNights(2), roomType: 'Deluxe', aci: "2/0/0", status: "New", extras: getExtrasStatus(true, 1), hasHotelverseRequest: true },
  { id: "4024", locator: "oct124", name: "Angustias Reyes", email: "angustias@reyes.com", checkIn: generateOctoberDate(1), nights: calculateNights(6), roomType: 'Suite', aci: "1/0/0", status: "New", extras: getExtrasStatus(false), hasHotelverseRequest: false },
  { id: "4025", locator: "oct125", name: "Saturnino Vila", email: "saturnino@vila.com", checkIn: generateOctoberDate(1), nights: calculateNights(3), roomType: 'Presidential Suite', aci: "2/1/0", status: "New", extras: getExtrasStatus(true, 2), hasHotelverseRequest: true },
]

type SortField = "locator" | "name" | "checkIn" | "nights" | "roomType" | "extras"
type SortDirection = "asc" | "desc"

interface OpenTab {
  id: string
  reservation: (typeof reservations)[0]
}

export default function FrontDeskUpsellPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [sortField, setSortField] = useState<SortField>("checkIn")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [activeTab, setActiveTab] = useState("front-desk-upsell")
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([])
  const { t } = useLanguage()
  const [isInReservationMode, setIsInReservationMode] = useState(false)

  // Calculate total commission from reservations with extras
  const totalCommission = reservations
    .filter(res => res.extras.includes('reservados'))
    .reduce((sum, res) => {
      const itemCount = parseInt(res.extras.split(' ')[0]) || 0
      return sum + (itemCount * 1.5) // 1.5€ commission per extra item
    }, 0)
    .toFixed(2)

  // Filter reservations based on search term
  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.locator.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort reservations
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    let aValue: string | number = a[sortField]
    let bValue: string | number = b[sortField]

    // Convert dates for proper sorting
    if (sortField === "checkIn") {
      aValue = new Date(aValue.split("/").reverse().join("-")).getTime()
      bValue = new Date(bValue.split("/").reverse().join("-")).getTime()
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleReservationClick = (reservation: (typeof reservations)[0]) => {
    const tabId = `reservation-${reservation.id}`

    // Check if tab is already open
    const existingTab = openTabs.find((tab) => tab.id === tabId)
    if (existingTab) {
      setActiveTab(tabId)
      return
    }

    // Add new tab
    const newTab: OpenTab = {
      id: tabId,
      reservation,
    }

    setOpenTabs((prev) => [...prev, newTab])
    setActiveTab(tabId)
    setIsInReservationMode(true) // Enable reservation mode
  }

  const handleCloseTab = (tabId: string) => {
    setOpenTabs((prev) => prev.filter((tab) => tab.id !== tabId))

    // If we're closing the active tab, switch to the main tab or another open tab
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter((tab) => tab.id !== tabId)
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[remainingTabs.length - 1].id)
      } else {
        setActiveTab("front-desk-upsell")
        setIsInReservationMode(false) // Disable reservation mode when no tabs are open
      }
    }

    // If no more reservation tabs, disable reservation mode
    const remainingTabs = openTabs.filter((tab) => tab.id !== tabId)
    if (remainingTabs.length === 0) {
      setIsInReservationMode(false)
    }
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">
            {sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </span>
        )}
      </div>
    </TableHead>
  )

  return (
    <div className="w-full h-full">
      {/* Alert positioned at the top center */}
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert className={alert.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <FrontDeskHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          openTabs={openTabs}
          onCloseTab={handleCloseTab}
          isInReservationMode={isInReservationMode}
          t={t}
        />

        <TabsContent value="front-desk-upsell" className="mt-0">
          <div className="p-6">
            {/* Info Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Mostrando reservas para 3 días ({filteredReservations.length} {t("reservations")})
              </p>
            </div>

            {/* Search Bar with User Info */}
            <div className="mb-6 flex items-center justify-between w-full">
              <div className="max-w-xs">
                <Input
                  placeholder="Buscar por localizador o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatar-placeholder.png" alt="User" />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Maria García</div>
                    <div className="text-gray-500">Front Desk Agent</div>
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      Comisión: {totalCommission}€
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Settings className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Reservations Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <SortableHeader field="locator">{t("locator")}</SortableHeader>
                    <SortableHeader field="name">{t("guest")}</SortableHeader>
                    <TableHead>A / C / I</TableHead>
                    <SortableHeader field="roomType">Tipo de Habitación</SortableHeader>
                    <SortableHeader field="checkIn">{t("checkIn")}</SortableHeader>
                    <SortableHeader field="nights">Noches</SortableHeader>
                    <SortableHeader field="extras">Extras</SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReservations.map((reservation) => (
                    <TableRow
                      key={reservation.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleReservationClick(reservation)}
                    >
                      <TableCell className="font-mono text-sm">{reservation.locator}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{reservation.name}</span>
                          </div>
                          <div className="text-sm text-gray-500">{reservation.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{reservation.aci}</TableCell>
                      <TableCell className="text-sm font-medium">{reservation.roomType}</TableCell>
                      <TableCell className="text-sm">{reservation.checkIn}</TableCell>
                      <TableCell className="text-sm">{reservation.nights}</TableCell>
                      <TableCell className="text-sm">
                        <Badge
                          variant={reservation.extras.includes('reservados') ? "default" : "secondary"}
                          className={
                            reservation.extras.includes('reservados')
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                          }
                        >
                          {reservation.extras}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}

                  {sortedReservations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {t("noReservationsFound")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-0">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{t("dashboard")}</h2>
              <p className="text-muted-foreground">{t("dashboardComingSoon")}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gestion-solicitudes" className="mt-0">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{t("gestionSolicitudes")}</h2>
              <p className="text-muted-foreground">{t("requestManagementComingSoon")}</p>
            </div>
          </div>
        </TabsContent>

        {/* Dynamic reservation tabs content */}
        {openTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            <ReservationDetailsTab
              reservation={tab.reservation}
              onShowAlert={showAlert}
              onCloseTab={() => handleCloseTab(tab.id)}
              isInReservationMode={isInReservationMode}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}