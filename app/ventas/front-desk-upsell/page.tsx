"use client"

import type React from "react"

import { useState } from "react"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/contexts/language-context"
import { FrontDeskHeader } from "@/components/front-desk-header"
import ReservationDetailsTab from "@/components/reservation-details-tab"

// Helper function to generate dates within the next 15 days
const generateDateWithinNext15Days = (daysFromToday: number) => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Helper function to generate checkout date (3-7 days after checkin)
const generateCheckoutDate = (checkinDaysFromToday: number, stayDuration: number) => {
  const date = new Date()
  date.setDate(date.getDate() + checkinDaysFromToday + stayDuration)
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
}

// Sample reservations data - all with check-in dates within the next 15 days
const reservations = [
  {
    id: "3868",
    locator: "skenbkudu",
    name: "Federico Goldsmith",
    email: "federico@goldsmith.com",
    checkIn: generateDateWithinNext15Days(0), // Today
    checkOut: generateCheckoutDate(0, 7),
    aci: "2/0/0",
    status: "New",
    hasHotelverseRequest: true,
  },
  {
    id: "2966",
    locator: "dptbtn0md",
    name: "Brita Barber",
    email: "brita@barber.com",
    checkIn: generateDateWithinNext15Days(1), // Tomorrow
    checkOut: generateCheckoutDate(1, 3),
    aci: "2/0/0",
    status: "Canceled",
    hasHotelverseRequest: false,
  },
  {
    id: "2968",
    locator: "2thj2gsyb1",
    name: "Cyrilius Villis",
    email: "cyrilius@villis.com",
    checkIn: generateDateWithinNext15Days(3), // 3 days from today
    checkOut: generateCheckoutDate(3, 4),
    aci: "2/0/0",
    status: "New",
    hasHotelverseRequest: true,
  },
  {
    id: "2970",
    locator: "26g6eggtx",
    name: "Gamaliel Victor",
    email: "gamaliel@victor.com",
    checkIn: generateDateWithinNext15Days(5), // 5 days from today
    checkOut: generateCheckoutDate(5, 3),
    aci: "2/0/0",
    status: "New",
    hasHotelverseRequest: false,
  },
  {
    id: "2971",
    locator: "abc123def",
    name: "Maria Rodriguez",
    email: "maria@rodriguez.com",
    checkIn: generateDateWithinNext15Days(7), // 7 days from today
    checkOut: generateCheckoutDate(7, 6),
    aci: "1/1/0",
    status: "Canceled",
    hasHotelverseRequest: true,
  },
  {
    id: "2972",
    locator: "xyz789ghi",
    name: "John Smith",
    email: "john@smith.com",
    checkIn: generateDateWithinNext15Days(10), // 10 days from today
    checkOut: generateCheckoutDate(10, 5),
    aci: "3/0/1",
    status: "New",
    hasHotelverseRequest: false,
  },
  {
    id: "2973",
    locator: "mno456pqr",
    name: "Isabella Chen",
    email: "isabella@chen.com",
    checkIn: generateDateWithinNext15Days(12), // 12 days from today
    checkOut: generateCheckoutDate(12, 4),
    aci: "2/1/0",
    status: "New",
    hasHotelverseRequest: true,
  },
  {
    id: "2974",
    locator: "stu789vwx",
    name: "Ahmed Hassan",
    email: "ahmed@hassan.com",
    checkIn: generateDateWithinNext15Days(14), // 14 days from today
    checkOut: generateCheckoutDate(14, 3),
    aci: "1/0/0",
    status: "Canceled",
    hasHotelverseRequest: false,
  },
  {
    id: "2975",
    locator: "def321ghi",
    name: "Sophie Laurent",
    email: "sophie@laurent.fr",
    checkIn: generateDateWithinNext15Days(15), // 15 days from today (last day)
    checkOut: generateCheckoutDate(15, 7),
    aci: "2/0/0",
    status: "New",
    hasHotelverseRequest: true,
  },
  {
    id: "2976",
    locator: "jkl654mno",
    name: "Roberto Silva",
    email: "roberto@silva.com",
    checkIn: generateDateWithinNext15Days(2), // 2 days from today
    checkOut: generateCheckoutDate(2, 5),
    aci: "4/2/0",
    status: "New",
    hasHotelverseRequest: false,
  },
  {
    id: "2977",
    locator: "pqr987stu",
    name: "Elena Popov",
    email: "elena@popov.ru",
    checkIn: generateDateWithinNext15Days(8), // 8 days from today
    checkOut: generateCheckoutDate(8, 4),
    aci: "2/0/0",
    status: "Canceled",
    hasHotelverseRequest: true,
  },
  {
    id: "2978",
    locator: "vwx123yza",
    name: "Michael O'Connor",
    email: "michael@oconnor.ie",
    checkIn: generateDateWithinNext15Days(6), // 6 days from today
    checkOut: generateCheckoutDate(6, 3),
    aci: "1/0/0",
    status: "New",
    hasHotelverseRequest: false,
  },
]

type SortField = "locator" | "name" | "checkIn" | "checkOut" | "status"
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
    if (sortField === "checkIn" || sortField === "checkOut") {
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
                {t("showingReservations")} ({filteredReservations.length} {t("reservations")})
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6 max-w-xs">
              <Input
                placeholder={t("locator")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Reservations Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <SortableHeader field="locator">{t("locator")}</SortableHeader>
                    <SortableHeader field="name">{t("guest")}</SortableHeader>
                    <TableHead>A / C / I</TableHead>
                    <SortableHeader field="checkIn">{t("checkIn")}</SortableHeader>
                    <SortableHeader field="checkOut">{t("checkOut")}</SortableHeader>
                    <SortableHeader field="status">{t("status")}</SortableHeader>
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
                            {reservation.hasHotelverseRequest && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                {t("previousClient")}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{reservation.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{reservation.aci}</TableCell>
                      <TableCell className="text-sm">{reservation.checkIn}</TableCell>
                      <TableCell className="text-sm">{reservation.checkOut}</TableCell>
                      <TableCell>
                        <Badge
                          variant={reservation.status === "New" ? "default" : "secondary"}
                          className={
                            reservation.status === "New"
                              ? "bg-purple-100 text-purple-800 border-purple-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          <span className="w-2 h-2 rounded-full bg-current mr-1"></span>
                          {t(reservation.status.toLowerCase())}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}

                  {sortedReservations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
