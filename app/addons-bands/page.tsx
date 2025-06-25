"use client"

import { useState } from "react"
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

// Sample initial data
const initialBands: Band[] = [
  {
    id: "1",
    name: "Standard",
    description: "Basic addons package for standard rooms",
  },
  {
    id: "2",
    name: "Premium",
    description: "Enhanced addons package for premium rooms with additional services",
  },
  {
    id: "3",
    name: "Luxury",
    description: "Comprehensive addons package for luxury suites with exclusive benefits",
  },
  {
    id: "4",
    name: "Business",
    description: "Specialized addons package for business travelers with work-related services",
  },
  {
    id: "5",
    name: "Family",
    description: "Family-friendly addons package with activities and services for children",
  },
]

export default function AddonsBandsPage() {
  const [bands, setBands] = useState<Band[]>(initialBands)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBand, setEditingBand] = useState<Band | null>(null)
  const { toast } = useToast()
  const { t } = useLanguage()

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
        title: "Band updated",
        description: `Successfully updated band "${band.name}"`,
      })
    } else {
      // Create new band with generated ID
      const newBand = {
        ...band,
        id: Math.random().toString(36).substring(2, 9),
      } as Band
      setBands([...bands, newBand])
      toast({
        title: "Band created",
        description: `Successfully created band "${band.name}"`,
      })
    }
    setIsFormOpen(false)
  }

  const handleDeleteBand = (id: string) => {
    const bandToDelete = bands.find((band) => band.id === id)
    setBands(bands.filter((band) => band.id !== id))
    toast({
      title: "Band deleted",
      description: `Successfully deleted band "${bandToDelete?.name}"`,
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
