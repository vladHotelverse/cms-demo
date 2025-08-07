"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Calendar as CalendarIcon,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type ViewMode = 'check-in' | 'call-center' | 'in-stay' | 'simulation'

interface ViewModeButtonsProps {
  className?: string
  onModeChange?: (mode: ViewMode, data?: any) => void
}

export function ViewModeButtons({ className, onModeChange }: ViewModeButtonsProps) {
  const [activeMode, setActiveMode] = useState<ViewMode>('check-in')
  const [showCallCenterModal, setShowCallCenterModal] = useState(false)
  const [showSimulationModal, setShowSimulationModal] = useState(false)
  const [callCenterDates, setCallCenterDates] = useState<DateRange | undefined>()
  const [simulationForm, setSimulationForm] = useState({
    dates: undefined as DateRange | undefined,
    roomType: '',
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
    console.log('Button clicked:', mode) // Debug log
    setActiveMode(mode)
    
    if (mode === 'call-center') {
      setShowCallCenterModal(true)
      console.log('Opening Call Center modal') // Debug log
    } else if (mode === 'simulation') {
      setShowSimulationModal(true)
      console.log('Opening Simulation modal') // Debug log
    } else {
      // For other modes, just call the callback
      onModeChange?.(mode)
    }
  }

  const handleCallCenterSubmit = () => {
    if (callCenterDates?.from && callCenterDates?.to) {
      console.log('Call Center date range:', callCenterDates)
      onModeChange?.('call-center', { dateRange: callCenterDates })
      setShowCallCenterModal(false)
    }
  }

  const handleSimulationSubmit = () => {
    if (simulationForm.dates?.from && simulationForm.dates?.to && simulationForm.roomType) {
      console.log('Simulation data:', simulationForm)
      onModeChange?.('simulation', simulationForm)
      setShowSimulationModal(false)
    }
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
      <Dialog open={showCallCenterModal} onOpenChange={setShowCallCenterModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Check-in Date Range</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Date Range Display */}
            {callCenterDates?.from && (
              <div className="text-sm text-muted-foreground text-center">
                {callCenterDates.to ? (
                  <>
                    {format(callCenterDates.from, 'MMM dd, yyyy')} - {format(callCenterDates.to, 'MMM dd, yyyy')}
                  </>
                ) : (
                  format(callCenterDates.from, 'MMM dd, yyyy')
                )}
              </div>
            )}
            
            <Calendar
              mode="range"
              selected={callCenterDates}
              onSelect={setCallCenterDates}
              numberOfMonths={2}
              className="rounded-md border"
            />
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCallCenterDates(undefined)
                  setShowCallCenterModal(false)
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCallCenterSubmit}
                disabled={!callCenterDates?.from || !callCenterDates?.to}
              >
                Apply Date Range
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simulation Form Modal */}
      <Dialog open={showSimulationModal} onOpenChange={setShowSimulationModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Simulation Parameters</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="sim-dates">Stay Dates *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    id="sim-dates"
                    variant="outline" 
                    className={cn(
                      "w-full justify-start gap-2 font-normal",
                      !simulationForm.dates && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {simulationForm.dates?.from && simulationForm.dates?.to ? (
                      `${format(simulationForm.dates.from, 'MMM dd, yyyy')} - ${format(simulationForm.dates.to, 'MMM dd, yyyy')}`
                    ) : (
                      'Select check-in and check-out dates'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={simulationForm.dates}
                    onSelect={(dates) => setSimulationForm(prev => ({ ...prev, dates }))}
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="room-type">Room Type *</Label>
              <Select 
                value={simulationForm.roomType} 
                onValueChange={(value) => setSimulationForm(prev => ({ ...prev, roomType: value }))}
              >
                <SelectTrigger id="room-type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard-single">Standard Single</SelectItem>
                  <SelectItem value="standard-double">Standard Double</SelectItem>
                  <SelectItem value="deluxe-double">Deluxe Double</SelectItem>
                  <SelectItem value="junior-suite">Junior Suite</SelectItem>
                  <SelectItem value="executive-suite">Executive Suite</SelectItem>
                  <SelectItem value="presidential-suite">Presidential Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Occupants */}
            <div className="space-y-2">
              <Label htmlFor="occupants">Number of Occupants *</Label>
              <Select 
                value={simulationForm.occupants.toString()} 
                onValueChange={(value) => setSimulationForm(prev => ({ ...prev, occupants: parseInt(value) }))}
              >
                <SelectTrigger id="occupants">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Form validation message */}
            {(!simulationForm.dates?.from || !simulationForm.dates?.to || !simulationForm.roomType) && (
              <p className="text-sm text-muted-foreground">* Required fields</p>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSimulationForm({
                    dates: undefined,
                    roomType: '',
                    occupants: 1
                  })
                  setShowSimulationModal(false)
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSimulationSubmit}
                disabled={!simulationForm.dates?.from || !simulationForm.dates?.to || !simulationForm.roomType}
              >
                Generate Simulation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
