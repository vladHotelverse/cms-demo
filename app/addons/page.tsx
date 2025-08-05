"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/layout/app-header"
import AddonCategoryList from "@/components/features/addons/addon-category-list"
import AddonCardGrid from "@/components/features/addons/addon-card-grid"
import AddonFormSheet from "@/components/features/addons/addon-form-sheet"
import type { Addon } from "@/types/addon"
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
    id: "2",
    name: "City Tour",
    description: "Guided tour around the city's main attractions",
    type: "experience",
    categoryId: "2",
    image: "/placeholder.svg?height=200&width=300",
    link: "https://citytour.example.com",
    translations: {
      es: { name: "Tour por la Ciudad", description: "Tour guiado por las principales atracciones de la ciudad" },
      fr: { name: "Visite de la Ville", description: "Visite guidée des principales attractions de la ville" },
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
    id: "4",
    name: "Wine Tasting",
    description: "Exclusive wine tasting experience with local sommeliers",
    type: "experience",
    categoryId: "2",
    image: "/placeholder.svg?height=200&width=300",
    link: "https://winetasting.example.com",
    translations: {
      es: { name: "Cata de Vinos", description: "Experiencia exclusiva de cata de vinos con sumilleres locales" },
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
]

export default function AddonsPage() {
  const [addons, setAddons] = useState<Addon[]>(initialAddons)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null)
  const { t } = useLanguage()

  // Filter addons by selected category
  const filteredAddons = selectedCategoryId ? addons.filter((addon) => addon.categoryId === selectedCategoryId) : addons

  const handleCreateAddon = () => {
    setEditingAddon(null)
    setIsFormOpen(true)
  }

  const handleEditAddon = (addon: Addon) => {
    setEditingAddon(addon)
    setIsFormOpen(true)
  }

  const handleSaveAddon = (addon: Addon) => {
    if (addon.id) {
      // Update existing addon
      setAddons(addons.map((a) => (a.id === addon.id ? addon : a)))
    } else {
      // Create new addon with generated ID
      const newAddon = {
        ...addon,
        id: Math.random().toString(36).substring(2, 9),
      }
      setAddons([...addons, newAddon])
    }
    setIsFormOpen(false)
  }

  const handleDeleteAddon = (id: string) => {
    setAddons(addons.filter((addon) => addon.id !== id))
    setIsFormOpen(false)
  }

  return (
    <div className="w-full h-full">
      <AppHeader title={t("addonsManagement")}>
        <div className="flex justify-end">
          <Button onClick={handleCreateAddon}>
            <Plus className="h-4 w-4 mr-2" /> {t("createAddon")}
          </Button>
        </div>
      </AppHeader>
      <div className="p-6 md:p-8">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <AddonCategoryList selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
        </div>
        <div className="md:col-span-3">
          <AddonCardGrid addons={filteredAddons} onEditAddon={handleEditAddon} />
        </div>
      </div>

      <AddonFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        addon={editingAddon}
        onSave={handleSaveAddon}
        onDelete={handleDeleteAddon}
      />
      </div>
    </div>
  )
}
