import { Package2, Sparkles, Settings2, BedDouble, Gavel } from "lucide-react"

export const statusConfig = {
  pending_hotel: {
    labelKey: "pendingHotel",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-400"
  },
  confirmed: {
    labelKey: "confirmed",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-400"
  }
} as const

export const categoryConfig = {
  rooms: {
    labelKey: "rooms",
    icon: BedDouble,
  },
  extras: {
    labelKey: "extras",
    icon: Package2,
  },
  bidding: {
    labelKey: "bidding",
    icon: Gavel,
  },
  // Legacy categories for backward compatibility
  upsell: {
    labelKey: "upsell",
    icon: Sparkles,
  },
  atributos: {
    labelKey: "attributes",
    icon: Settings2,
  }
} as const

export const typeConfig = {
  service: {
    label: "Service",
    color: "bg-blue-50 text-blue-700 border-blue-200"
  },
  amenity: {
    label: "Amenity", 
    color: "bg-purple-50 text-purple-700 border-purple-200"
  },
  transfer: {
    label: "Transfer",
    color: "bg-orange-50 text-orange-700 border-orange-200"
  }
} as const