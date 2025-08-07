"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { FrontDeskHeader } from "@/components/layout/front-desk-header"
import ReservationDetailsTab from "@/components/features/reservations/reservation-details-tab"
import { ReservationSummaryModal } from "@/components/features/reservations/reservation-summary-modal"
import { ViewModeButtons } from "@/components/ui/view-mode-buttons"
import { cn } from "@/lib/utils/index"
import { format } from "date-fns"




type SortField = "locator" | "name" | "checkIn" | "nights" | "roomType" | "extras"
type SortDirection = "asc" | "desc"

const SortableHeader = ({ 
  field, 
  children, 
  sortField, 
  sortDirection, 
  onSort 
}: { 
  field: SortField
  children: React.ReactNode
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}) => (
  <TableHead className="cursor-pointer select-none" onClick={() => onSort(field)}>
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

interface OrderFromAPI {
  id: string
  locator: string
  name: string
  email: string
  checkIn: string
  nights: string
  roomType: string
  aci: string
  status: string
  extras: string
  extrasCount: number
  hasExtras: boolean
  hasHotelverseRequest: boolean
  orderItems: any[]
  proposals: any[]
}

interface OpenTab {
  id: string
  reservation: OrderFromAPI
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
  const [orders, setOrders] = useState<OrderFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [viewModeFilter, setViewModeFilter] = useState<any>(null)

  // Alert function (moved up to avoid initialization issues)
  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  // Handle view mode changes
  const handleViewModeChange = (mode: string, data?: any) => {
    console.log('View mode changed:', mode, data)
    setViewModeFilter({ mode, data })
    
    // You can add logic here to filter reservations based on the selected mode and data
    if (mode === 'call-center' && data?.dateRange) {
      showAlert('success', `Filtering reservations for check-in dates: ${format(data.dateRange.from, 'MMM dd')} - ${format(data.dateRange.to, 'MMM dd')}`)
    } else if (mode === 'simulation' && data) {
      showAlert('success', `Loading simulation for ${data.roomType} room with ${data.occupants} guest(s)`)
    }
  }


  // Generate mock test data
  useEffect(() => {
    const generateMockData = () => {
      const mockOrders: OrderFromAPI[] = []
      const roomTypes = ['Doble', 'Doble Deluxe', 'Junior Suite']
      const guestNames = [
        'John Smith', 'Maria Garcia', 'David Wilson', 'Sarah Johnson', 'Michael Brown', 'Emma Davis', 'James Miller', 'Lisa Anderson',
        'Robert Taylor', 'Jennifer White', 'William Jones', 'Ashley Martinez', 'Christopher Lee', 'Jessica Thompson', 'Daniel Clark',
        'Amanda Rodriguez', 'Matthew Lewis', 'Michelle Walker', 'Joseph Hall', 'Stephanie Allen', 'Ryan Young', 'Nicole King',
        'Andrew Wright', 'Rachel Lopez', 'Kevin Hill', 'Laura Scott', 'Brian Green', 'Kimberly Adams', 'Steven Baker', 'Rebecca Nelson',
        'Thomas Carter', 'Donna Mitchell', 'Charles Perez', 'Catherine Roberts', 'Mark Turner', 'Sandra Phillips', 'Paul Campbell',
        'Carol Parker', 'Donald Evans', 'Sharon Edwards', 'Kenneth Collins', 'Betty Stewart', 'Joshua Sanchez', 'Helen Morris',
        'Jason Rogers', 'Deborah Reed', 'Frank Cook', 'Maria Morales', 'Gregory Murphy', 'Ruth Bailey'
      ]
      const emailDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com']
      const occupancies = ['1/0/0', '2/0/0', '2/1/0', '3/0/0', '4/0/0', '2/2/0', '3/1/0', '4/2/0']
      const extrasTypes = [
        '2 reserved items', '5 reserved items', '1 reserved item', '4 reserved items', '3 reserved items',
        'Recommend', 'Recommend', 'Recommend', 'Recommend', 'Recommend', 'Recommend',
        '5 reserved items', '4 reserved items', '3 reserved items', '5 reserved items'
      ]
      
      for (let i = 1; i <= 50; i++) {
        const guestName = guestNames[i - 1] || `Guest ${i}`
        const emailName = guestName.toLowerCase().replace(/\s+/g, '.')
        const emailDomain = emailDomains[i % emailDomains.length]
        const checkInDate = new Date()
        checkInDate.setDate(checkInDate.getDate() + Math.floor(Math.random() * 30) - 15)
        const formattedCheckIn = `${checkInDate.getDate().toString().padStart(2, '0')}/${(checkInDate.getMonth() + 1).toString().padStart(2, '0')}/${checkInDate.getFullYear()}`
        const nights = Math.floor(Math.random() * 7) + 1
        const extras = extrasTypes[i % extrasTypes.length]
        
        mockOrders.push({
          id: `order-${i.toString().padStart(3, '0')}`,
          locator: `LOC${(1000 + i).toString()}`,
          name: guestName,
          email: `${emailName}@${emailDomain}`,
          checkIn: formattedCheckIn,
          nights: nights.toString(),
          roomType: roomTypes[i % roomTypes.length],
          aci: occupancies[i % occupancies.length],
          status: i % 3 === 0 ? 'Confirmed' : 'New',
          extras: extras,
          extrasCount: extras.includes('reserved') ? parseInt(extras.split(' ')[0]) : 0,
          hasExtras: extras.includes('reserved'),
          hasHotelverseRequest: Math.random() > 0.3,
          orderItems: [],
          proposals: []
        })
      }
      
      setOrders(mockOrders)
      setLoading(false)
    }

    setLoading(true)
    // Simulate loading time
    setTimeout(generateMockData, 1000)
  }, [])

  // Use the mock orders
  const reservations = orders

  // Calculate total commission from reservations with extras
  const totalCommission = reservations
    .filter(res => res.extras.includes(t("reserved")))
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

  const handleExtrasButtonClick = (reservation: OrderFromAPI) => {
    // Check if this is an item preview (has reserved items) or recommendation button
    const hasReservedItems = reservation.extras.includes(t("reserved"))
    
    if (hasReservedItems) {
      // For items preview, open the summary modal
      const summaryTabId = `summary_${reservation.id}`
      
      // Check if summary tab is already open
      const existingTab = openTabs.find(tab => tab.id === summaryTabId)
      if (existingTab) {
        setActiveTab(summaryTabId)
        return
      }

      // Add the summary tab
      const newTab: OpenTab = {
        id: summaryTabId,
        reservation: {
          ...reservation,
          nights: reservation.nights,
          extras: reservation.extras
        }
      }
      setOpenTabs([...openTabs, newTab])
      setActiveTab(summaryTabId)
      // Don't enable reservation mode for summary view
    } else {
      // For recommendations, open the new details UI
      const detailsTabId = `details_${reservation.id}`
      
      // Check if details tab is already open
      const existingTab = openTabs.find(tab => tab.id === detailsTabId)
      if (existingTab) {
        setActiveTab(detailsTabId)
        return
      }

      // Add the details tab
      const newTab: OpenTab = {
        id: detailsTabId,
        reservation: {
          ...reservation,
          nights: reservation.nights,
          extras: reservation.extras
        }
      }
      setOpenTabs([...openTabs, newTab])
      setActiveTab(detailsTabId)
      setIsInReservationMode(true) // Enable reservation mode when opening details tab
    }
  }


  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
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
          agent={{
            name: "Maria García",
            role: t("frontDeskAgent"),
            commission: parseFloat(totalCommission)
          }}
        />

        <TabsContent value="front-desk-upsell" className="mt-0">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Info Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                {t("showingReservationsForDays")} ({filteredReservations.length} {t("reservations")})
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className={cn("flex justify-between items-center w-full")}>
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn("border-gray-300 w-full max-w-xs")}
                />
                <ViewModeButtons onModeChange={handleViewModeChange} />
              </div>
            </div>

            {/* Reservations Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <SortableHeader field="locator" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("locator")}</SortableHeader>
                    <SortableHeader field="name" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("guest")}</SortableHeader>
                    <TableHead>A / C / I</TableHead>
                    <SortableHeader field="roomType" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("roomType")}</SortableHeader>
                    <SortableHeader field="checkIn" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("checkIn")}</SortableHeader>
                    <SortableHeader field="nights" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>{t("nights")}</SortableHeader>
                    <SortableHeader field="extras" sortField={sortField} sortDirection={sortDirection} onSort={handleSort}>Extras</SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : sortedReservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        {t("noReservationsFound")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedReservations.map((reservation) => (
                      <TableRow
                        key={reservation.id}
                        className="hover:bg-gray-50"
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
                          <Button
                            variant={reservation.extras.includes(t("reserved")) ? "ghost" : "default"}
                            size="sm"
                            onClick={() => handleExtrasButtonClick(reservation)}
                          >
                            {reservation.extras}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
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
        {openTabs
          .filter(tab => tab.id.startsWith('details_'))
          .map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <ReservationDetailsTab
                reservation={tab.reservation}
                onShowAlert={showAlert}
                onCloseTab={() => handleCloseTab(tab.id)}
                isInReservationMode={isInReservationMode}
              />
            </TabsContent>
          ))}

        {/* Render Summary Tabs (if any still exist) */}
        {openTabs
          .filter(tab => tab.id.startsWith('summary_'))
          .map(tab => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <ReservationSummaryModal 
                reservation={tab.reservation} 
                onCloseTab={() => handleCloseTab(tab.id)}
              />
            </TabsContent>
          ))}
      </Tabs>
    </div>
  )
}