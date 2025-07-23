import { Package2, Sparkles, Settings2 } from "lucide-react"

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
  extras: {
    labelKey: "extras",
    icon: Package2,
  },
  upsell: {
    labelKey: "upsell",
    icon: Sparkles,
  },
  atributos: {
    labelKey: "attributes",
    icon: Settings2,
  }
} as const