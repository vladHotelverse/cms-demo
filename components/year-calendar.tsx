"use client"

import { useState } from "react"
import { Plus, X, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample item types
const itemTypes = [
  { id: "1", name: "Cleaning", color: "bg-blue-500" },
  { id: "2", name: "Maintenance", color: "bg-amber-500" },
  { id: "3", name: "Inspection", color: "bg-green-500" },
  { id: "4", name: "Special Event", color: "bg-purple-500" },
  { id: "5", name: "Staff Meeting", color: "bg-rose-500" },
]

// Months of the year
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

type CalendarItem = {
  id: string
  month: number // 0-11
  isWeekend: boolean
  typeId: string
  notes?: string
}

export default function YearCalendar() {
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([
    { id: "1", month: 0, isWeekend: false, typeId: "1", notes: "Regular cleaning" },
    { id: "2", month: 0, isWeekend: true, typeId: "4", notes: "New Year's event" },
    { id: "3", month: 5, isWeekend: false, typeId: "2", notes: "Summer maintenance" },
    { id: "4", month: 11, isWeekend: true, typeId: "4", notes: "Christmas event" },
  ])

  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedIsWeekend, setSelectedIsWeekend] = useState<boolean | null>(null)
  const [newItemType, setNewItemType] = useState("")
  const [newItemNotes, setNewItemNotes] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  // Get item for a specific cell
  const getItemForCell = (month: number, isWeekend: boolean) => {
    return calendarItems.find((item) => item.month === month && item.isWeekend === isWeekend) || null
  }

  // Open dialog to add item to a specific cell
  const openAddItemDialog = (month: number, isWeekend: boolean) => {
    const existingItem = getItemForCell(month, isWeekend)

    if (existingItem) {
      // If there's already an item, open in edit mode
      setIsEditing(true)
      setEditingItemId(existingItem.id)
      setNewItemType(existingItem.typeId)
      setNewItemNotes(existingItem.notes || "")
    } else {
      // Otherwise, open in add mode
      setIsEditing(false)
      setEditingItemId(null)
      setNewItemType("")
      setNewItemNotes("")
    }

    setSelectedMonth(month)
    setSelectedIsWeekend(isWeekend)
    setIsAddItemOpen(true)
  }

  // Handle adding a new item
  const handleAddOrUpdateItem = () => {
    if (selectedMonth === null || selectedIsWeekend === null || !newItemType) return

    if (isEditing && editingItemId) {
      // Update existing item
      setCalendarItems(
        calendarItems.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                typeId: newItemType,
                notes: newItemNotes || undefined,
              }
            : item,
        ),
      )

      toast({
        title: "Item updated",
        description: `Updated ${itemTypes.find((t) => t.id === newItemType)?.name} in ${months[selectedMonth]} (${selectedIsWeekend ? "Weekend" : "Weekday"})`,
      })
    } else {
      // Check if there's already an item in this cell
      const existingItem = getItemForCell(selectedMonth, selectedIsWeekend)

      if (existingItem) {
        toast({
          title: "Cell already has an item",
          description: "Only one item is allowed per cell. Edit or remove the existing item first.",
          variant: "destructive",
        })
        return
      }

      // Add new item
      const newItem: CalendarItem = {
        id: Math.random().toString(36).substring(2, 9),
        month: selectedMonth,
        isWeekend: selectedIsWeekend,
        typeId: newItemType,
        notes: newItemNotes || undefined,
      }

      setCalendarItems([...calendarItems, newItem])

      toast({
        title: "Item added",
        description: `Added ${itemTypes.find((t) => t.id === newItemType)?.name} to ${months[selectedMonth]} (${selectedIsWeekend ? "Weekend" : "Weekday"})`,
      })
    }

    setNewItemType("")
    setNewItemNotes("")
    setIsAddItemOpen(false)
    setHasChanges(true)
  }

  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    setCalendarItems(calendarItems.filter((item) => item.id !== itemId))
    setHasChanges(true)

    toast({
      title: "Item removed",
      description: "Calendar item has been removed",
    })
  }

  // Handle saving changes
  const handleSave = () => {
    // In a real app, you would save to a database here
    setHasChanges(false)

    toast({
      title: "Changes saved",
      description: "Your calendar items have been saved successfully",
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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Year Calendar</h2>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[150px]">Month</TableHead>
              <TableHead>Weekdays</TableHead>
              <TableHead>Weekends</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {months.map((month, index) => {
              const weekdayItem = getItemForCell(index, false)
              const weekendItem = getItemForCell(index, true)

              return (
                <TableRow key={month}>
                  <TableCell className="font-medium">{month}</TableCell>

                  {/* Weekdays cell */}
                  <TableCell className="p-0">
                    <div className="relative p-4 h-full min-h-[100px] border-r">
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => openAddItemDialog(index, false)}
                      >
                        {weekdayItem ? <Edit className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                        {weekdayItem ? "Edit" : "Add"}
                      </Button>

                      {weekdayItem ? (
                        <div
                          className={`${getItemColor(weekdayItem.typeId)} text-white p-3 rounded-md text-sm mt-8 flex justify-between items-center group`}
                        >
                          <div>
                            <div className="font-medium">{getItemName(weekdayItem.typeId)}</div>
                            {weekdayItem.notes && <div className="text-xs opacity-90 mt-1">{weekdayItem.notes}</div>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveItem(weekdayItem.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground text-sm py-2 mt-8">No item</div>
                      )}
                    </div>
                  </TableCell>

                  {/* Weekends cell */}
                  <TableCell className="p-0">
                    <div className="relative p-4 h-full min-h-[100px]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => openAddItemDialog(index, true)}
                      >
                        {weekendItem ? <Edit className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                        {weekendItem ? "Edit" : "Add"}
                      </Button>

                      {weekendItem ? (
                        <div
                          className={`${getItemColor(weekendItem.typeId)} text-white p-3 rounded-md text-sm mt-8 flex justify-between items-center group`}
                        >
                          <div>
                            <div className="font-medium">{getItemName(weekendItem.typeId)}</div>
                            {weekendItem.notes && <div className="text-xs opacity-90 mt-1">{weekendItem.notes}</div>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveItem(weekendItem.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground text-sm py-2 mt-8">No item</div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {itemTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
            <span className="text-sm">{type.name}</span>
          </div>
        ))}
      </div>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit" : "Add"} Item for {selectedMonth !== null ? months[selectedMonth] : ""} (
              {selectedIsWeekend ? "Weekend" : "Weekday"})
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
            <Button onClick={handleAddOrUpdateItem} disabled={!newItemType}>
              {isEditing ? "Update" : "Add"} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
