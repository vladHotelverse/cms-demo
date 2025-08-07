"use client"

import { useState } from "react"
import { ViewModeButtons } from "@/components/ui/view-mode-buttons"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DatePickerDemoPage() {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>()
  const [viewModeData, setViewModeData] = useState<{
    mode: string
    data: any
  } | null>(null)

  const handleModeChange = (mode: string, data?: any) => {
    setViewModeData({ mode, data })
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Date Range Picker & Simulation Demo</h1>
        <p className="text-muted-foreground">
          Interactive components for selecting date ranges and simulation parameters
        </p>
      </div>

      {/* View Mode Buttons Demo */}
      <Card>
        <CardHeader>
          <CardTitle>View Mode Buttons</CardTitle>
          <CardDescription>
            Click on 'Call Center' to open date range picker or 'Simulation' for the full form
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ViewModeButtons onModeChange={handleModeChange} />
          
          {viewModeData && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Selected Data:</h4>
              <pre className="text-sm">
                {JSON.stringify(viewModeData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Standalone Date Range Picker Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Standalone Date Range Picker</CardTitle>
          <CardDescription>
            A reusable date range picker component with automatic closing and night count display
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateRangePicker
            date={selectedDateRange}
            onDateChange={setSelectedDateRange}
            placeholder="Select your stay dates"
          />
          
          {selectedDateRange?.from && selectedDateRange?.to && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Check-in: {format(selectedDateRange.from, "MMM dd, yyyy")}
              </Badge>
              <Badge variant="secondary">
                Check-out: {format(selectedDateRange.to, "MMM dd, yyyy")}
              </Badge>
              <Badge>
                {Math.ceil(
                  (selectedDateRange.to.getTime() - selectedDateRange.from.getTime()) / 
                  (1000 * 60 * 60 * 24)
                )} nights
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Date range selection with visual feedback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Auto-close on selection completion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Night count calculation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Form validation with required field indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Responsive modal design with proper headers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Room type selection with realistic options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>Guest count selector with proper pluralization</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
