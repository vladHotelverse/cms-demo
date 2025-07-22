"use client"

import type React from "react"

import { useState } from "react"
import { ChevronUp, ChevronDown, X, Settings, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { FrontDeskHeader } from "@/components/front-desk-header"
import ReservationDetailsTab from "@/components/reservation-details-tab"
import { ReservationSummaryModal } from "@/components/reservation-summary-modal"
import { cn } from "@/lib/utils/index"
import { useReservationStore } from "@/store/use-reservation-store"
import type { Reservation } from "@/types/reservation"
import { DataStateWrapper } from "@/components/ui/data-state-wrapper"

import { rawReservations } from "./reservation-data"

// Helper function to calculate number of nights
const calculateNights = (stayDuration: number, t: (key: string) => string) => {
  return `${stayDuration} ${stayDuration === 1 ? t("night") : t("nights")}`
}

// Helper function to get extras status with total amounts
const getExtrasStatus = (hasItems: boolean, t: (key: string) => string, itemCount?: number) => {
  if (hasItems && itemCount) {
    const totalAmount = itemCount * 15 // Example price per item
    return `${itemCount} ${t("reserved")} (${totalAmount}€)`
  }
  return t("recommendation")
}


type SortField = "locator" | "name" | "checkIn" | "nights" | "roomType" | "extras"
type SortDirection = "asc" | "desc"

interface OpenTab {
  id: string
  reservation: Omit<(typeof rawReservations)[0], 'nights' | 'extrasCount' | 'hasExtras'> & {
    nights: string
    extras: string
  }
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
  const [summaryModal, setSummaryModal] = useState<{
    isOpen: boolean
    reservation: any | null
  }>({ isOpen: false, reservation: null })

  // Generate reservations with proper translation handling
  const reservations = rawReservations.map(res => {
    const { nights: nightsCount, extrasCount, hasExtras, ...restRes } = res
    return {
      ...restRes,
      nights: calculateNights(nightsCount, t),
      extras: hasExtras 
        ? getExtrasStatus(true, t, extrasCount)
        : getExtrasStatus(false, t)
    }
  })

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

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  const handleExtrasButtonClick = (reservation: any) => {
    setSummaryModal({ isOpen: true, reservation })
  }

  const closeSummaryModal = () => {
    setSummaryModal({ isOpen: false, reservation: null })
  }

  const handleViewMoreFromSummary = () => {
    if (summaryModal.reservation) {
      handleReservationClick(summaryModal.reservation)
      closeSummaryModal()
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
                {t("showingReservationsForDays")} ({filteredReservations.length} {t("reservations")})
              </p>
            </div>

            {/* Search Bar with User Info */}
            <div className="mb-6 flex items-center justify-between w-full">
              <div className={cn("max-w-xs w-full")}>
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn("border-gray-300 min-w-xs")}
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
                    <div className="text-gray-500">{t("frontDeskAgent")}</div>
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      {t("commission")}: {totalCommission}€
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
                    <SortableHeader field="roomType">{t("roomType")}</SortableHeader>
                    <SortableHeader field="checkIn">{t("checkIn")}</SortableHeader>
                    <SortableHeader field="nights">{t("nights")}</SortableHeader>
                    <SortableHeader field="extras">Extras</SortableHeader>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReservations.map((reservation) => (
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

      {/* Reservation Summary Modal */}
      <ReservationSummaryModal
        isOpen={summaryModal.isOpen}
        onClose={closeSummaryModal}
        onViewMore={handleViewMoreFromSummary}
        reservation={summaryModal.reservation}
      />
    </div>
  )
}