"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Sample categories
const addonCategories = [
  { id: "1", name: "Wellness & Spa" },
  { id: "2", name: "Tours & Activities" },
  { id: "3", name: "Transportation" },
  { id: "4", name: "Food & Beverage" },
  { id: "5", name: "Room Amenities" },
  { id: "6", name: "Business Services" },
]

interface AddonCategoryListProps {
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
}

export default function AddonCategoryList({ selectedCategoryId, onSelectCategory }: AddonCategoryListProps) {
  return (
    <Card className="p-4">
      <h2 className="font-medium mb-3">Categories</h2>
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn("w-full justify-start font-normal", !selectedCategoryId && "bg-muted")}
          onClick={() => onSelectCategory(null)}
        >
          All Categories
        </Button>

        {addonCategories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn("w-full justify-start font-normal", selectedCategoryId === category.id && "bg-muted")}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </Card>
  )
}
