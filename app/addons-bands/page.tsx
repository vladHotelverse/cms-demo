"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BandsTable from "@/components/bands-table"
import BandFormDialog from "@/components/band-form-dialog"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

// Band type definition
interface Band {
  id: string
  name: string
  description: string
}

// Sample initial data - using translation keys for demo purposes
const getInitialBands = (t: (key: string) => string): Band[] => [
  {
    id: "1",
    name: t("standard"),
    description: t("basicAddonsPackage"),
  },
  {
    id: "2",
    name: t("premium"),
    description: t("enhancedAddonsPackage"),
  },
  {
    id: "3",
    name: t("luxury"),
    description: t("comprehensiveAddonsPackage"),
  },
  {
    id: "4",
    name: t("business"),
    description: t("specializedAddonsPackage"),
  },
  {
    id: "5",
    name: t("family"),
    description: t("familyFriendlyAddonsPackage"),
  },
]

export default function AddonsBandsPage() {
  const { toast } = useToast()
  const { t, currentLanguage } = useLanguage()
  const [bands, setBands] = useState<Band[]>(getInitialBands(t))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBand, setEditingBand] = useState<Band | null>(null)

  // Update sample bands when language changes
  useEffect(() => {
    setBands(getInitialBands(t))
  }, [currentLanguage, t])

  const handleCreateBand = () => {
    setEditingBand(null)
    setIsFormOpen(true)
  }

  const handleEditBand = (band: Band) => {
    setEditingBand(band)
    setIsFormOpen(true)
  }

  const handleSaveBand = (band: Partial<Band>) => {
    if (editingBand) {
      // Update existing band
      setBands(bands.map((b) => (b.id === editingBand.id ? { ...b, ...band } : b)))
      toast({
        title: t("bandUpdated"),
        description: `${t("successfullyUpdatedBand")} "${band.name}"`,
      })
    } else {
      // Create new band with generated ID
      const newBand = {
        ...band,
        id: Math.random().toString(36).substring(2, 9),
      } as Band
      setBands([...bands, newBand])
      toast({
        title: t("bandCreated"),
        description: `${t("successfullyCreatedBand")} "${band.name}"`,
      })
    }
    setIsFormOpen(false)
  }

  const handleDeleteBand = (id: string) => {
    const bandToDelete = bands.find((band) => band.id === id)
    setBands(bands.filter((band) => band.id !== id))
    toast({
      title: t("bandDeleted"),
      description: `${t("successfullyDeletedBand")} "${bandToDelete?.name}"`,
    })
  }

  return (
    <div className="p-6 md:p-8 w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("addonsBands")}</h1>
        <Button onClick={handleCreateBand}>
          <Plus className="h-4 w-4 mr-2" /> {t("addBand")}
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <BandsTable bands={bands} onEdit={handleEditBand} onDelete={handleDeleteBand} />
      </Card>

      <BandFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} band={editingBand} onSave={handleSaveBand} />
    </div>
  )
}
