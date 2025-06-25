"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
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

interface AddonCardGridProps {
  addons: Addon[]
  onEditAddon: (addon: Addon) => void
}

export default function AddonCardGrid({ addons, onEditAddon }: AddonCardGridProps) {
  if (addons.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No addons found. Select a different category or create a new addon.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {addons.map((addon) => (
        <Card key={addon.id} className="overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={addon.image || "/placeholder.svg?height=200&width=300"}
              alt={addon.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-2 right-2" variant={addon.type === "experience" ? "default" : "secondary"}>
              {addon.type === "experience" ? "Experience" : "Extra"}
            </Badge>
          </div>

          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-medium text-lg">{addon.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{getCategoryName(addon.categoryId)}</p>
              </div>
            </div>
            <p className="text-sm mt-2 line-clamp-2">{addon.description}</p>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="text-xs text-muted-foreground">
              {addon.type === "experience" ? <span>Has link</span> : <span>{addon.emails?.length || 0} email(s)</span>}
            </div>
            <Button size="sm" variant="outline" onClick={() => onEditAddon(addon)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
