"use client"

import { useState } from "react"
import { RoomUpgradeList } from "./room-upgrades"
import { AttributeList } from "./room-attributes"
import { ExtraList } from "./extras"
import type { RoomUpgrade } from "@/types/room"

interface EnhancedTableViewProps {
  onAddToCart: (item: any) => void
  onSelectRoom: (room: RoomUpgrade) => void
}

// Enhanced extras data
const extras = [
  {
    name: "Early Check In",
    price: "6€",
    priceType: "per stay",
    units: 1,
    description: "Check in before 3 PM",
  },
  {
    name: "Spa Treatment",
    price: "40€",
    priceType: "per treatment",
    units: 2,
    description: "Relaxing spa experience",
  },
  {
    name: "Dinner Package",
    price: "60€",
    priceType: "per person/date",
    units: 1,
    description: "Premium dining experience",
  },
  {
    name: "Pool Bed Reservation",
    price: "3€",
    priceType: "per day",
    units: 1,
    description: "Reserved poolside seating",
  },
  {
    name: "Late Check Out",
    price: "6€",
    priceType: "per stay",
    units: 1,
    description: "Check out after 12 PM",
  },
]

export default function EnhancedTableView({ onAddToCart, onSelectRoom }: EnhancedTableViewProps) {
  const [selectedRooms, setSelectedRooms] = useState<Set<number>>(new Set())
  const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set())
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set())
  const [extraQuantities, setExtraQuantities] = useState<{ [key: string]: number }>({
    "Spa Treatment": 2,
    "Dinner Package": 1,
  })

  const toggleRoomSelection = (roomId: number) => {
    const newSelected = new Set(selectedRooms)
    if (newSelected.has(roomId)) {
      newSelected.delete(roomId)
    } else {
      newSelected.clear() // Only one room can be selected
      newSelected.add(roomId)
    }
    setSelectedRooms(newSelected)
  }

  const toggleAttribute = (key: string) => {
    const newSelected = new Set(selectedAttributes)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedAttributes(newSelected)
  }

  const toggleExtra = (extraName: string) => {
    const newSelected = new Set(selectedExtras)
    if (newSelected.has(extraName)) {
      newSelected.delete(extraName)
    } else {
      newSelected.add(extraName)
    }
    setSelectedExtras(newSelected)
  }

  const updateExtraQuantity = (extraName: string, quantity: number) => {
    setExtraQuantities(prev => ({
      ...prev,
      [extraName]: quantity
    }))
  }

  return (
    <div className="space-y-6 p-6">
      <RoomUpgradeList
        selectedRooms={selectedRooms}
        onToggleRoomSelection={toggleRoomSelection}
        onSelectRoom={onSelectRoom}
      />

      <AttributeList
        selectedAttributes={selectedAttributes}
        onToggleAttribute={toggleAttribute}
      />

      <ExtraList
        extras={extras}
        selectedExtras={selectedExtras}
        extraQuantities={extraQuantities}
        onToggleExtra={toggleExtra}
        onUpdateQuantity={updateExtraQuantity}
      />
    </div>
  )
}