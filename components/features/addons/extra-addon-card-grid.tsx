"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Addon } from "@/types/addon"

// Get category name by ID
const getCategoryName = (categoryId: string) => {
  const categories = [
    { id: "1", name: "Wellness & Spa" },
    { id: "2", name: "Tours & Activities" },
    { id: "3", name: "Transportation" },
    { id: "4", name: "Food & Beverage" },
    { id: "5", name: "Room Amenities" },
    { id: "6", name: "Business Services" },
  ]

  return categories.find((c) => c.id === categoryId)?.name || "Unknown"
}

interface ExtraAddonCardGridProps {
  addons: Addon[]
  onAddonClick: (addon: Addon) => void
}

export default function ExtraAddonCardGrid({ addons, onAddonClick }: ExtraAddonCardGridProps) {
  if (addons.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">
          No extra addons found. Select a different category or create new extras in the Addons Management section.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {addons.map((addon) => (
        <Card
          key={addon.id}
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onAddonClick(addon)}
        >
          <div className="aspect-video relative">
            <img
              src={addon.image || "/placeholder.svg?height=200&width=300"}
              alt={addon.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 right-2" variant="secondary">
              Extra
            </Badge>
          </div>

          <CardContent className="p-4">
            <div>
              <h3 className="font-medium text-lg">{addon.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{getCategoryName(addon.categoryId)}</p>
            </div>
            <p className="text-sm mt-2 line-clamp-2">{addon.description}</p>
            <p className="text-xs text-muted-foreground mt-2">Click to manage pricing</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
