"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CallCenterHeader } from "@/components/call-center-header"
import { useLanguage } from "@/contexts/language-context"

// Sample hotels data - in a real app this would come from user permissions
const availableHotels = [
  { id: "1", name: "Hotel Playa del Carmen" },
  { id: "2", name: "Hotel Cancún Beach" },
  { id: "3", name: "Hotel Riviera Maya" },
  { id: "4", name: "Hotel Tulum Paradise" },
]

// Sample segments data
const segments = [
  { id: "standard", name: "Standard" },
  { id: "premium", name: "Premium" },
  { id: "luxury", name: "Luxury" },
  { id: "business", name: "Business" },
  { id: "family", name: "Family" },
]

export default function CallCenterPage() {
  const [selectedHotel, setSelectedHotel] = useState<string>("")
  const [selectedSegment, setSelectedSegment] = useState<string>("")
  const [activeTab, setActiveTab] = useState("call-center")
  const { t } = useLanguage()

  const handleStart = () => {
    if (!selectedHotel) {
      alert(t("pleaseSelectHotel"))
      return
    }

    // Here you would implement the logic to start the call center flow
    console.log("Starting call center flow with:", {
      hotel: selectedHotel,
      segment: selectedSegment,
    })

    // For now, just show an alert
    alert(`${t("startingFlowFor")} ${availableHotels.find((h) => h.id === selectedHotel)?.name}`)
  }

  const handleCancel = () => {
    setSelectedHotel("")
    setSelectedSegment("")
  }

  return (
    <div className="w-full h-full">
      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CallCenterHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          t={t}
        />

        <TabsContent value="call-center" className="mt-0">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-8">
            <Card className="w-full max-w-md mx-auto shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-semibold">{t("chooseYourRoom")}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">{t("createNewRequest")}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hotel">{t("hotel")}</Label>
                  <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                    <SelectTrigger id="hotel">
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableHotels.map((hotel) => (
                        <SelectItem key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment">{t("segment")}</Label>
                  <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                    <SelectTrigger id="segment">
                      <SelectValue placeholder={t("select")} />
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

                <div className="flex justify-between gap-4 pt-4">
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleStart}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                    disabled={!selectedHotel}
                  >
                    {t("start")}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
      </Tabs>
    </div>
  )
}
