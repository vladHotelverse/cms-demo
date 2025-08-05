import { Calendar as CalendarIcon, X } from 'lucide-react'
import type React from 'react'
import { useState, useMemo } from 'react'
import { Button as Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import SimpleListPicker from './SimpleListPicker'
import { dateToKey, keyToDate } from '../utils/dateHelpers'

interface EnhancedDateSelectorProps {
  id: string
  label: string
  selectedDates: Date[]
  onChange: (dates: Date[]) => void
  disabled?: boolean
  tooltipText?: string
  reservationStartDate?: Date
  reservationEndDate?: Date
  className?: string
  multiple?: boolean
  maxDates?: number
}

const EnhancedDateSelector: React.FC<EnhancedDateSelectorProps> = ({
  id,
  label,
  selectedDates,
  onChange,
  disabled = false,
  tooltipText,
  reservationStartDate,
  reservationEndDate,
  className = '',
  multiple = true,
  maxDates = 5,
}) => {
  const [open, setOpen] = useState(false)

  // Convert dates to string keys for list picker
  const selectedDateKeys = useMemo(() => {
    return new Set(selectedDates.map(dateToKey))
  }, [selectedDates])

  const formatSelectedDates = (): string => {
    if (selectedDates.length === 0) {
      return 'Select dates'
    }

    if (selectedDates.length === 1) {
      return selectedDates[0].toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }

    if (selectedDates.length <= 2) {
      return selectedDates
        .map((date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
        .join(', ')
    }

    return `${selectedDates.length} dates selected`
  }

  const handleListDateToggle = (dateKey: string) => {
    const isAlreadySelected = selectedDateKeys.has(dateKey)

    if (multiple) {
      if (isAlreadySelected) {
        // Remove date
        const newDates = selectedDates.filter((d) => dateToKey(d) !== dateKey)
        onChange(newDates)
      } else if (selectedDates.length < maxDates) {
        // Add date
        const newDate = keyToDate(dateKey)
        const newDates = [...selectedDates, newDate].sort((a, b) => a.getTime() - b.getTime())
        onChange(newDates)
      }
    } else {
      // Single date selection
      const newDate = keyToDate(dateKey)
      onChange([newDate])
    }
  }

  const handleClear = () => {
    onChange([])
  }

  const handleDone = () => {
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const dateSelector = (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700 mb-2 block">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className={`${label ? 'w-full justify-start text-left' : 'w-auto justify-center'} font-normal ${
              selectedDates.length === 0 && 'text-muted-foreground'
            }`}
          >
            <CalendarIcon className={`h-4 w-4 ${label && selectedDates.length > 0 ? 'mr-2' : ''}`} />
            {label && formatSelectedDates()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <span className="text-sm font-medium">Select dates</span>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              aria-label="Close date selector"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* List view only */}
          <SimpleListPicker
            selectedDates={selectedDateKeys}
            onDateToggle={handleListDateToggle}
            onClear={handleClear}
            onDone={handleDone}
            reservationStartDate={reservationStartDate}
            reservationEndDate={reservationEndDate}
            maxDates={maxDates}
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  if (tooltipText && !disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{dateSelector}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return dateSelector
}

export default EnhancedDateSelector
