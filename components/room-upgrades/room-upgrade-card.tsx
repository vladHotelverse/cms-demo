"use client"

import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { RoomUpgrade } from "@/types/room"

interface RoomUpgradeCardProps {
  upgrade: RoomUpgrade
  isSelected: boolean
  onToggleSelection: () => void
  onSelectRoom: (room: RoomUpgrade) => void
}

export function RoomUpgradeCard({
  upgrade,
  isSelected,
  onToggleSelection,
  onSelectRoom,
}: RoomUpgradeCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={onToggleSelection}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage src={upgrade.image} alt={upgrade.type} />
            <AvatarFallback className="rounded-lg">
              {upgrade.type.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{upgrade.type}</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {upgrade.price}
                </div>
                <Badge
                  variant={upgrade.availability === "Available" ? "default" : "secondary"}
                  className={cn(
                    "mt-1",
                    upgrade.availability === "Available" 
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  )}
                >
                  {upgrade.availability}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              {upgrade.features}
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectRoom(upgrade)
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              {isSelected && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Selected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}