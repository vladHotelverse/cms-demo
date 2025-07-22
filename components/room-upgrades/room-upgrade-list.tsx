"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoomUpgradeCard } from "./room-upgrade-card"
import { useRoomStore } from "@/store/use-room-store"
import type { RoomUpgrade } from "@/types/room"

interface RoomUpgradeListProps {
  selectedRooms: Set<number>
  onToggleRoomSelection: (roomId: number) => void
  onSelectRoom: (room: RoomUpgrade) => void
}

export function RoomUpgradeList({
  selectedRooms,
  onToggleRoomSelection,
  onSelectRoom,
}: RoomUpgradeListProps) {
  const { upgrades } = useRoomStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Room Upgrades</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upgrades.map((upgrade) => (
          <RoomUpgradeCard
            key={upgrade.id}
            upgrade={upgrade}
            isSelected={selectedRooms.has(upgrade.id)}
            onToggleSelection={() => onToggleRoomSelection(upgrade.id)}
            onSelectRoom={onSelectRoom}
          />
        ))}
      </CardContent>
    </Card>
  )
}