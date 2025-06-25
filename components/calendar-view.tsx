"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus, X, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Sample item types
const itemTypes = [
  { id: "1", name: "Cleaning", color: "bg-blue-500" },
  { id: "2", name: "Maintenance", color: "bg-amber-500" },
  { id: "3", name: "Inspection", color: "bg-green-500" },
  { id: "4", name: "Special Event", color: "bg-purple-500" },
  { id: "5", name: "Staff Meeting", color: "bg-rose-500" },
]

type CalendarItem = {
  id: string
  date: string // ISO string
  typeId: string
  notes?: string
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [newItemType, setNewItemType] = useState("")
  const [newItemNotes, setNewItemNotes] = useState("")
  const { toast } = useToast()

  // Generate days for the current month view
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Get items for a specific date
  const getItemsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return calendarItems.filter((item) => item.date === dateString)
  }

  // Handle adding a new item
  const handleAddItem = () => {
    if (!selectedDate || !newItemType) return

    const newItem: CalendarItem = {
      id: Math.random().toString(36).substring(2, 9),
      date: selectedDate.toISOString().split("T")[0],
      typeId: newItemType,
      notes: newItemNotes || undefined,
    }

    setCalendarItems([...calendarItems, newItem])
    setNewItemType("")
    setNewItemNotes("")
    setIsAddItemOpen(false)

    toast({
      title: "Item added",
      description: `Added ${itemTypes.find((t) => t.id === newItemType)?.name} to ${format(selectedDate, "MMMM d, yyyy")}`,
    })
  }

  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    setCalendarItems(calendarItems.filter((item) => item.id !== itemId))

    toast({
      title: "Item removed",
      description: "Calendar item has been removed",
    })
  }

  // Get color for an item type
  const getItemColor = (typeId: string) => {
    return itemTypes.find((t) => t.id === typeId)?.color || "bg-gray-500"
  }

  // Get name for an item type
  const getItemName = (typeId: string) => {
    return itemTypes.find((t) => t.id === typeId)?.name || "Unknown"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedDate}>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Calendar Item</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Item Type</Label>
                  <Select value={newItemType} onValueChange={setNewItemType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={newItemNotes}
                    onChange={(e) => setNewItemNotes(e.target.value)}
                    placeholder="Add notes about this item"
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddItem} disabled={!selectedDate || !newItemType}>
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-center py-2 font-medium text-sm",
              i === 0 || i === 6 ? "bg-muted/80 text-muted-foreground" : "bg-muted/50",
            )}
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {monthDays.map((day, i) => {
          const isWeekendDay = isWeekend(day)
          const isCurrentDay = isToday(day)
          const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString()
          const dayItems = getItemsForDate(day)

          return (
            <div
              key={i}
              className={cn(
                "min-h-[120px] p-2 bg-card relative",
                isWeekendDay ? "bg-muted/10" : "",
                isCurrentDay ? "border-2 border-primary" : "",
                isSelected ? "ring-2 ring-primary ring-offset-2" : "",
                "hover:bg-muted/20 cursor-pointer transition-colors",
              )}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between items-start">
                <span className={cn("font-medium text-sm", isWeekendDay ? "text-muted-foreground" : "")}>
                  {format(day, "d")}
                </span>

                {dayItems.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {dayItems.length}
                  </Badge>
                )}
              </div>

              <ScrollArea className="h-[80px] mt-1">
                <div className="space-y-1">
                  {dayItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "text-xs p-1 rounded flex items-center justify-between group",
                        getItemColor(item.typeId),
                        "text-white",
                      )}
                    >
                      <span className="truncate">{getItemName(item.typeId)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveItem(item.id)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {itemTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
            <span className="text-sm">{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
