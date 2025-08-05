"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Hotel,
  Phone,
  Users,
  Settings,
  Calendar as CalendarIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

type ViewMode = 'check-in' | 'call-center' | 'in-stay' | 'simulation'

interface ViewModeButtonsProps {
  className?: string
}

export function ViewModeButtons({ className }: ViewModeButtonsProps) {
  const [activeMode, setActiveMode] = useState<ViewMode>('check-in')
  const [showCallCenterModal, setShowCallCenterModal] = useState(false)
  const [showSimulationModal, setShowSimulationModal] = useState(false)
  const [callCenterDates, setCallCenterDates] = useState<DateRange | undefined>()
  const [simulationForm, setSimulationForm] = useState({
    dates: undefined as DateRange | undefined,
    roomTypology: '',
    occupants: 1
  })

  const buttons = [
    {
      id: 'check-in' as ViewMode,
      label: 'Check In',
      icon: Hotel,
      description: 'Reservations from today up to 3 days ahead for check-in'
    },
    {
      id: 'call-center' as ViewMode,
      label: 'Call Center',
      icon: Phone,
      description: 'Opens a date picker/calendar for check-in date range'
    },
    {
      id: 'in-stay' as ViewMode,
      label: 'In-Stay',
      icon: Users,
      description: 'Shows reservations where any day of their stay includes today'
    },
    {
      id: 'simulation' as ViewMode,
      label: 'Simulation',
      icon: Settings,
      description: 'Opens a form requesting dates, room typology, and number of occupants'
    }
  ]

  const handleButtonClick = (mode: ViewMode) => {
    setActiveMode(mode)
    
    if (mode === 'call-center') {
      setShowCallCenterModal(true)
    } else if (mode === 'simulation') {
      setShowSimulationModal(true)
    }
  }

  const handleCallCenterSubmit = () => {
    console.log('Call Center date range:', callCenterDates)
    setShowCallCenterModal(false)
  }

  const handleSimulationSubmit = () => {
    console.log('Simulation data:', simulationForm)
    setShowSimulationModal(false)
  }

  return (
    <>
      <div className={cn("flex gap-2", className)}>
        {buttons.map((button) => {
          const Icon = button.icon
          const isActive = activeMode === button.id
          
          return (
            <Button
              key={button.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleButtonClick(button.id)}
              className="gap-2"
              title={button.description}
            >
              <Icon className="h-4 w-4" />
              {button.label}
            </Button>
          )
        })}
      </div>

      {/* Call Center Date Picker Modal */}
      <Popover open={showCallCenterModal} onOpenChange={setShowCallCenterModal}>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Select Check-in Date Range</h4>
            <Calendar
              mode="range"
              selected={callCenterDates}
              onSelect={setCallCenterDates}
              numberOfMonths={2}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowCallCenterModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCallCenterSubmit}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Simulation Form Modal */}
      <Popover open={showSimulationModal} onOpenChange={setShowSimulationModal}>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <h4 className="font-medium">Simulation Parameters</h4>
            
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {simulationForm.dates?.from && simulationForm.dates?.to ? (
                      `${format(simulationForm.dates.from, 'MMM dd')} - ${format(simulationForm.dates.to, 'MMM dd')}`
                    ) : (
                      'Select dates'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={simulationForm.dates}
                    onSelect={(dates) => setSimulationForm(prev => ({ ...prev, dates }))}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Room Typology */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Typology</label>
              <Select value={simulationForm.roomTypology} onValueChange={(value) => setSimulationForm(prev => ({ ...prev, roomTypology: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Occupants */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Occupants</label>
              <Select value={simulationForm.occupants.toString()} onValueChange={(value) => setSimulationForm(prev => ({ ...prev, occupants: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowSimulationModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSimulationSubmit}>
                Load Recommendations
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}