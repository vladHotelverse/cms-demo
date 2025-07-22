"use client"

import { AttributeCategory } from "./attribute-category"
import { useRoomStore } from "@/store/use-room-store"

interface AttributeListProps {
  selectedAttributes: Set<string>
  onToggleAttribute: (key: string) => void
}

export function AttributeList({
  selectedAttributes,
  onToggleAttribute,
}: AttributeListProps) {
  const { attributes } = useRoomStore()

  return (
    <div className="space-y-6">
      {Object.entries(attributes).map(([categoryName, category]) => (
        <AttributeCategory
          key={categoryName}
          categoryName={categoryName}
          category={category}
          selectedAttributes={selectedAttributes}
          onToggleAttribute={onToggleAttribute}
        />
      ))}
    </div>
  )
}