"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Check, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Simulated database data
const dbCategories = [
  { id: "1", name: "Bathroom" },
  { id: "2", name: "Bedroom" },
  { id: "3", name: "Kitchen" },
  { id: "4", name: "Living Room" },
  { id: "5", name: "Outdoor" },
  { id: "6", name: "Amenities" },
]

const dbEquipmentItems = [
  { id: "1", name: "Towels", categoryIds: ["1"] },
  { id: "2", name: "Hairdryer", categoryIds: ["1"] },
  { id: "3", name: "Toiletries", categoryIds: ["1"] },
  { id: "4", name: "Pillows", categoryIds: ["2"] },
  { id: "5", name: "Blankets", categoryIds: ["2"] },
  { id: "6", name: "TV Remote", categoryIds: ["2", "4"] },
  { id: "7", name: "Microwave", categoryIds: ["3"] },
  { id: "8", name: "Coffee Maker", categoryIds: ["3"] },
  { id: "9", name: "Utensils", categoryIds: ["3"] },
  { id: "10", name: "Sofa", categoryIds: ["4"] },
  { id: "11", name: "Smart TV", categoryIds: ["4"] },
  { id: "12", name: "Patio Furniture", categoryIds: ["5"] },
  { id: "13", name: "BBQ Grill", categoryIds: ["5"] },
  { id: "14", name: "Gym Access Card", categoryIds: ["6"] },
  { id: "15", name: "Swimming Pool Key", categoryIds: ["6"] },
  { id: "16", name: "Bathrobes", categoryIds: ["1"] },
  { id: "17", name: "Slippers", categoryIds: ["1", "2"] },
  { id: "18", name: "Safe", categoryIds: ["2"] },
  { id: "19", name: "Mini Bar", categoryIds: ["3"] },
  { id: "20", name: "Desk Lamp", categoryIds: ["2", "4"] },
]

// Initial state with some equipment already assigned to categories
const initialCategoryEquipment: Record<string, string[]> = {
  "1": ["1", "2", "3"], // Bathroom has Towels, Hairdryer, Toiletries
  "2": ["4", "5"], // Bedroom has Pillows, Blankets
  "3": ["7", "8"], // Kitchen has Microwave, Coffee Maker
  "4": ["10", "11"], // Living Room has Sofa, Smart TV
  "5": [], // Outdoor has no equipment yet
  "6": ["14"], // Amenities has Gym Access Card
}

export default function EquipmentCategoryManager() {
  const [categoryEquipment, setCategoryEquipment] = useState(initialCategoryEquipment)
  const [originalCategoryEquipment, setOriginalCategoryEquipment] = useState(initialCategoryEquipment)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Record<string, boolean>>({})
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(categoryEquipment) !== JSON.stringify(originalCategoryEquipment)
    setHasChanges(changed)
  }, [categoryEquipment, originalCategoryEquipment])

  // Get available equipment items that are not already in the selected category
  const getAvailableEquipment = (categoryId: string) => {
    if (!categoryId) return []

    // Get equipment that can be in this category (based on categoryIds) but isn't already added
    return dbEquipmentItems.filter(
      (item) => item.categoryIds.includes(categoryId) && !(categoryEquipment[categoryId] || []).includes(item.id),
    )
  }

  const handleAddSelectedEquipment = () => {
    if (!selectedCategory) return

    const equipmentToAdd = Object.entries(selectedEquipment)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id)

    if (equipmentToAdd.length === 0) return

    setCategoryEquipment((prev) => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), ...equipmentToAdd],
    }))

    toast({
      title: "Equipment added",
      description: `Added ${equipmentToAdd.length} items to ${dbCategories.find((c) => c.id === selectedCategory)?.name}`,
    })

    setSelectedEquipment({})
    setIsPopoverOpen(false)
  }

  const handleRemoveEquipment = (categoryId: string, equipmentId: string) => {
    setCategoryEquipment((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter((id) => id !== equipmentId),
    }))
  }

  // Get equipment items for a category
  const getCategoryEquipment = (categoryId: string) => {
    const equipmentIds = categoryEquipment[categoryId] || []
    return dbEquipmentItems.filter((item) => equipmentIds.includes(item.id))
  }

  const handleSave = () => {
    // In a real app, you would save to a database here
    setOriginalCategoryEquipment(categoryEquipment)
    toast({
      title: "Changes saved",
      description: "Your equipment configuration has been saved successfully.",
    })
  }

  const handleCancel = () => {
    setCategoryEquipment(originalCategoryEquipment)
    toast({
      title: "Changes discarded",
      description: "Your equipment configuration has been reset.",
    })
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {dbCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCategory && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={getAvailableEquipment(selectedCategory).length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="font-medium">Select Equipment Items</div>
                  <div className="border rounded-md">
                    <ScrollArea className="h-60">
                      <div className="p-2 space-y-2">
                        {getAvailableEquipment(selectedCategory).map((equipment) => (
                          <div key={equipment.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
                            <Checkbox
                              id={`equipment-${equipment.id}`}
                              checked={selectedEquipment[equipment.id] || false}
                              onCheckedChange={(checked) => {
                                setSelectedEquipment((prev) => ({
                                  ...prev,
                                  [equipment.id]: !!checked,
                                }))
                              }}
                            />
                            <Label htmlFor={`equipment-${equipment.id}`} className="flex-1 cursor-pointer text-sm">
                              {equipment.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setIsPopoverOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddSelectedEquipment}>
                      Add Selected
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex space-x-2 w-full md:w-auto justify-end">
          <Button variant="outline" onClick={handleCancel} disabled={!hasChanges}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
      </div>

      {/* Categories and their equipment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {dbCategories.map((category) => {
          const equipmentItems = getCategoryEquipment(category.id)

          return (
            <Card
              key={category.id}
              className={`overflow-hidden transition-all duration-200 ${
                selectedCategory === category.id ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              <div className="bg-muted p-3 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{category.name}</h3>
                  <Badge variant="outline">{equipmentItems.length}</Badge>
                </div>
                {selectedCategory !== category.id && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(category.id)}>
                    Select
                  </Button>
                )}
                {selectedCategory === category.id && (
                  <Badge variant="default">
                    <Check className="h-3 w-3 mr-1" /> Selected
                  </Badge>
                )}
              </div>
              <CardContent className="p-0">
                <ScrollArea className="h-[180px]">
                  {equipmentItems.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">No equipment items added</div>
                  ) : (
                    <ul className="divide-y">
                      {equipmentItems.map((item) => (
                        <li key={item.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                          <span>{item.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveEquipment(category.id, item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove {item.name}</span>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
