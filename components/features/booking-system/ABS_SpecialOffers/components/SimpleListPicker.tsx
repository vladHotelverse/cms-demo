import type React from 'react'
import { useMemo } from 'react'
import { Button as Button } from '@/components/ui/button'
import { dateToKey } from '../utils/dateHelpers'

interface SimpleListPickerProps {
  selectedDates: Set<string>
  onDateToggle: (dateKey: string) => void
  onClear: () => void
  onDone: () => void
  reservationStartDate?: Date
  reservationEndDate?: Date
  maxDates?: number
}

const SimpleListPicker: React.FC<SimpleListPickerProps> = ({
  selectedDates,
  onDateToggle,
  onClear,
  onDone,
  reservationStartDate,
  reservationEndDate,
  maxDates = 10,
}) => {
  // Generate available dates
  const availableDates = useMemo(() => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day

    // Use reservation dates as the date range if provided, otherwise use today + maxDates
    let startDate: Date
    let endDate: Date

    if (reservationStartDate && reservationEndDate) {
      // Use the reservation period
      startDate = new Date(reservationStartDate)
      startDate.setHours(0, 0, 0, 0) // Normalize to start of day
      endDate = new Date(reservationEndDate)
      endDate.setHours(0, 0, 0, 0) // Normalize to start of day
    } else {
      // Fallback to today + maxDates days
      startDate = new Date(today)
      endDate = new Date(today)
      endDate.setDate(today.getDate() + Math.max(maxDates, 10))
    }

    // Generate dates within the range
    const current = new Date(startDate)
    while (current <= endDate) {
      // If we have reservation dates, include all dates in the reservation period
      // Otherwise, only include dates that are today or in the future
      const shouldIncludeDate = (reservationStartDate && reservationEndDate) || current >= today
      
      if (shouldIncludeDate) {
        const dateKey = dateToKey(current)
        const dayName = current.toLocaleDateString('en-US', { weekday: 'short' })
        const day = current.getDate()
        const monthName = current.toLocaleDateString('en-US', { month: 'short' })

        dates.push({
          key: dateKey,
          day: day.toString(),
          label: `${dayName} ${day}, ${monthName}`,
          date: new Date(current),
        })
      }

      current.setDate(current.getDate() + 1)
    }

    return dates
  }, [reservationStartDate, reservationEndDate, maxDates])

  return (
    <div className="w-72">
      {/* Date list */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {availableDates.length > 0 ? (
          availableDates.map((date) => (
            <label
              key={date.key}
              htmlFor={`date-checkbox-${date.key}`}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
            >
              <span className="font-medium">{date.label}</span>
              <input
                id={`date-checkbox-${date.key}`}
                type="checkbox"
                checked={selectedDates.has(date.key)}
                onChange={() => onDateToggle(date.key)}
                className="w-4 h-4"
                aria-label={`Select ${date.label}`}
              />
            </label>
          ))
        ) : (
          <div className="p-2 text-center text-muted-foreground">No available dates</div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-3 border-t bg-muted/30">
        <Button
          onClick={onClear}
          variant="ghost"
          className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 h-7"
          aria-label="Clear all selected dates"
        >
          CLEAR
        </Button>
        <Button
          onClick={onDone}
          className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium h-7"
        >
          DONE
        </Button>
      </div>
    </div>
  )
}

export default SimpleListPicker
