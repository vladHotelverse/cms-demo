"use client"

import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"
import AddonCategoryList from "@/components/features/addons/addon-category-list"
import ExtraAddonCardGrid from "@/components/features/addons/extra-addon-card-grid"
import AddonPricingSheet from "@/components/features/addons/addon-pricing-sheet"
import type { Addon } from "@/types/addon"
import type { BandPrice, CalendarBandAssignment } from "@/types/pricing"
import { useLanguage } from "@/contexts/language-context"

// Sample initial data
const initialAddons: Addon[] = [
  {
    id: "1",
    name: "Spa Treatment",
    description: "Relaxing spa treatment with professional therapists",
    type: "extra",
    categoryId: "1",
    image: "/placeholder.svg?height=200&width=300",
    emails: ["spa@hotel.com", "bookings@hotel.com"],
    translations: {
      es: { name: "Tratamiento de Spa", description: "Tratamiento de spa relajante con terapeutas profesionales" },
      fr: { name: "Traitement Spa", description: "Traitement spa relaxant avec des thérapeutes professionnels" },
    },
  },
  {
    id: "3",
    name: "Airport Transfer",
    description: "Private transfer from/to the airport",
    type: "extra",
    categoryId: "3",
    image: "/placeholder.svg?height=200&width=300",
    emails: ["transport@hotel.com"],
    translations: {
      es: { name: "Traslado al Aeropuerto", description: "Traslado privado desde/hacia el aeropuerto" },
    },
  },
  {
    id: "5",
    name: "Breakfast in Room",
    description: "Enjoy a delicious breakfast in the comfort of your room",
    type: "extra",
    categoryId: "1",
    image: "/placeholder.svg?height=200&width=300",
    emails: ["restaurant@hotel.com", "roomservice@hotel.com"],
    translations: {
      es: {
        name: "Desayuno en la Habitación",
        description: "Disfrute de un delicioso desayuno en la comodidad de su habitación",
      },
    },
  },
  {
    id: "6",
    name: "Laundry Service",
    description: "Professional laundry and ironing service",
    type: "extra",
    categoryId: "5",
    image: "/placeholder.svg?height=200&width=300",
    emails: ["housekeeping@hotel.com"],
    translations: {
      es: { name: "Servicio de Lavandería", description: "Servicio profesional de lavandería y planchado" },
    },
  },
  {
    id: "7",
    name: "Room Decoration",
    description: "Special decoration for celebrations",
    type: "extra",
    categoryId: "5",
    image: "/placeholder.svg?height=200&width=300",
    emails: ["events@hotel.com", "housekeeping@hotel.com"],
    translations: {
      es: { name: "Decoración de Habitación", description: "Decoración especial para celebraciones" },
    },
  },
]

// Sample bands
const bands = [
  { id: "1", name: "Standard", description: "Basic addons package for standard rooms" },
  { id: "2", name: "Premium", description: "Enhanced addons package for premium rooms with additional services" },
  { id: "3", name: "Luxury", description: "Comprehensive addons package for luxury suites with exclusive benefits" },
  {
    id: "4",
    name: "Business",
    description: "Specialized addons package for business travelers with work-related services",
  },
  { id: "5", name: "Family", description: "Family-friendly addons package with activities and services for children" },
]

// Sample initial pricing data
const initialPricingData: Record<string, { bandPrices: BandPrice[]; calendarAssignments: CalendarBandAssignment[] }> = {
  "1": {
    // Spa Treatment
    bandPrices: [
      { bandId: "1", price: 50 },
      { bandId: "2", price: 45 },
      { bandId: "3", price: 40 },
      { bandId: "4", price: 48 },
      { bandId: "5", price: 47 },
    ],
    calendarAssignments: [
      { month: 0, dayOfWeek: 1, bandId: "1" },
      { month: 0, dayOfWeek: 2, bandId: "1" },
      { month: 0, dayOfWeek: 3, bandId: "1" },
      { month: 0, dayOfWeek: 4, bandId: "1" },
      { month: 0, dayOfWeek: 5, bandId: "2" },
      { month: 0, dayOfWeek: 6, bandId: "2" },
      { month: 0, dayOfWeek: 0, bandId: "2" },
      // More assignments would be here for other months/days
    ],
  },
  "3": {
    // Airport Transfer
    bandPrices: [
      { bandId: "1", price: 30 },
      { bandId: "2", price: 28 },
      { bandId: "3", price: 25 },
      { bandId: "4", price: 27 },
      { bandId: "5", price: 29 },
    ],
    calendarAssignments: [],
  },
  "5": {
    // Breakfast in Room
    bandPrices: [
      { bandId: "1", price: 20 },
      { bandId: "2", price: 18 },
      { bandId: "3", price: 15 },
      { bandId: "4", price: 17 },
      { bandId: "5", price: 19 },
    ],
    calendarAssignments: [],
  },
  "6": {
    // Laundry Service
    bandPrices: [
      { bandId: "1", price: 25 },
      { bandId: "2", price: 22 },
      { bandId: "3", price: 20 },
      { bandId: "4", price: 23 },
      { bandId: "5", price: 24 },
    ],
    calendarAssignments: [],
  },
  "7": {
    // Room Decoration
    bandPrices: [
      { bandId: "1", price: 40 },
      { bandId: "2", price: 35 },
      { bandId: "3", price: 30 },
      { bandId: "4", price: 38 },
      { bandId: "5", price: 37 },
    ],
    calendarAssignments: [],
  },
}

export default function AddonsPricingPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null)
  const [pricingData, setPricingData] = useState(initialPricingData)
  const { t } = useLanguage()

  // Filter addons by type "extra" and selected category
  const extraAddons = initialAddons.filter((addon) => addon.type === "extra")
  const filteredAddons = selectedCategoryId
    ? extraAddons.filter((addon) => addon.categoryId === selectedCategoryId)
    : extraAddons

  const handleAddonClick = (addon: Addon) => {
    setSelectedAddon(addon)
    setIsSheetOpen(true)
  }

  const handleSavePricing = (
    addonId: string,
    bandPrices: BandPrice[],
    calendarAssignments: CalendarBandAssignment[],
  ) => {
    setPricingData((prev) => ({
      ...prev,
      [addonId]: {
        bandPrices,
        calendarAssignments,
      },
    }))
  }

  return (
    <div className="w-full h-full">
      <AppHeader title={t("addonsPricing")} />
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AddonCategoryList selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
        </div>
        <div className="md:col-span-3">
          <ExtraAddonCardGrid addons={filteredAddons} onAddonClick={handleAddonClick} />
        </div>
      </div>

      {selectedAddon && (
        <AddonPricingSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          addon={selectedAddon}
          bands={bands}
          bandPrices={pricingData[selectedAddon.id]?.bandPrices || []}
          calendarAssignments={pricingData[selectedAddon.id]?.calendarAssignments || []}
          onSave={(bandPrices, calendarAssignments) =>
            handleSavePricing(selectedAddon.id, bandPrices, calendarAssignments)
          }
        />
      )}
      </div>
    </div>
  )
}
