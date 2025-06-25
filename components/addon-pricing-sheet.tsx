"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"
import BandPricingTable from "@/components/band-pricing-table"
import CalendarBandTable from "@/components/calendar-band-table"
import type { Addon } from "@/types/addon"
import type { BandPrice, CalendarBandAssignment } from "@/types/pricing"

interface Band {
  id: string
  name: string
  description: string
}

interface AddonPricingSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addon: Addon
  bands: Band[]
  bandPrices: BandPrice[]
  calendarAssignments: CalendarBandAssignment[]
  onSave: (bandPrices: BandPrice[], calendarAssignments: CalendarBandAssignment[]) => void
}

export default function AddonPricingSheet({
  open,
  onOpenChange,
  addon,
  bands,
  bandPrices,
  calendarAssignments,
  onSave,
}: AddonPricingSheetProps) {
  const [activeTab, setActiveTab] = useState("bands")
  const [currentBandPrices, setCurrentBandPrices] = useState<BandPrice[]>([])
  const [currentCalendarAssignments, setCurrentCalendarAssignments] = useState<CalendarBandAssignment[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  // Initialize data when the sheet opens
  useEffect(() => {
    if (open) {
      // Initialize band prices - ensure all bands have a price
      const initialBandPrices = bands.map((band) => {
        const existingPrice = bandPrices.find((bp) => bp.bandId === band.id)
        return existingPrice || { bandId: band.id, price: 0 }
      })

      setCurrentBandPrices(initialBandPrices)
      setCurrentCalendarAssignments(calendarAssignments)
      setHasChanges(false)
    }
  }, [open, addon, bands, bandPrices, calendarAssignments])

  // Track changes
  useEffect(() => {
    const pricesChanged = JSON.stringify(currentBandPrices) !== JSON.stringify(bandPrices)
    const assignmentsChanged = JSON.stringify(currentCalendarAssignments) !== JSON.stringify(calendarAssignments)
    setHasChanges(pricesChanged || assignmentsChanged)
  }, [currentBandPrices, currentCalendarAssignments, bandPrices, calendarAssignments])

  const handleUpdateBandPrice = (bandId: string, price: number) => {
    setCurrentBandPrices((prev) => prev.map((bp) => (bp.bandId === bandId ? { ...bp, price } : bp)))
  }

  const handleUpdateCalendarAssignment = (month: number, dayOfWeek: number, bandId: string) => {
    // Check if there's an existing assignment
    const existingIndex = currentCalendarAssignments.findIndex((ca) => ca.month === month && ca.dayOfWeek === dayOfWeek)

    if (existingIndex >= 0) {
      // Update existing assignment
      setCurrentCalendarAssignments((prev) =>
        prev.map((ca, index) => (index === existingIndex ? { month, dayOfWeek, bandId } : ca)),
      )
    } else {
      // Add new assignment
      setCurrentCalendarAssignments((prev) => [...prev, { month, dayOfWeek, bandId }])
    }
  }

  const handleSave = () => {
    onSave(currentBandPrices, currentCalendarAssignments)
    toast({
      title: "Pricing updated",
      description: `Successfully updated pricing for "${addon.name}"`,
    })
    setHasChanges(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl w-full p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Pricing for {addon.name}</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 px-6 pt-4">
            <TabsTrigger value="bands">Band Pricing</TabsTrigger>
            <TabsTrigger value="calendar">Calendar Bands</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="bands" className="p-6 min-h-[400px]">
              <BandPricingTable bands={bands} bandPrices={currentBandPrices} onUpdatePrice={handleUpdateBandPrice} />
            </TabsContent>

            <TabsContent value="calendar" className="p-6 min-h-[400px]">
              <CalendarBandTable
                bands={bands}
                assignments={currentCalendarAssignments}
                onUpdateAssignment={handleUpdateCalendarAssignment}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <SheetFooter className="p-6 border-t">
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
