"use client"

import { useState, useEffect } from "react"
import { Save, Check, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Simulated database data - equipment items
const dbEquipmentItems = [
  { id: "1", name: "Towels" },
  { id: "2", name: "Hairdryer" },
  { id: "3", name: "Toiletries" },
  { id: "4", name: "Pillows" },
  { id: "5", name: "Blankets" },
  { id: "6", name: "TV Remote" },
  { id: "7", name: "Microwave" },
  { id: "8", name: "Coffee Maker" },
  { id: "9", name: "Utensils" },
  { id: "10", name: "Sofa" },
  { id: "11", name: "Smart TV" },
  { id: "12", name: "Patio Furniture" },
  { id: "13", name: "BBQ Grill" },
  { id: "14", name: "Gym Access Card" },
  { id: "15", name: "Swimming Pool Key" },
  { id: "16", name: "Bathrobes" },
  { id: "17", name: "Slippers" },
  { id: "18", name: "Safe" },
  { id: "19", name: "Mini Bar" },
  { id: "20", name: "Desk Lamp" },
]

// Available languages
const languages = [
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "it", name: "Italian" },
  { id: "pt", name: "Portuguese" },
  { id: "zh", name: "Chinese" },
  { id: "ja", name: "Japanese" },
  { id: "ru", name: "Russian" },
]

// Initial translations
const initialTranslations = {
  es: {
    "1": "Toallas",
    "2": "Secador de pelo",
    "3": "Artículos de tocador",
    "4": "Almohadas",
    "5": "Mantas",
  },
  fr: {
    "1": "Serviettes",
    "2": "Sèche-cheveux",
    "3": "Articles de toilette",
  },
  de: {
    "1": "Handtücher",
    "2": "Haartrockner",
  },
  // Other languages would be initialized here
}

export default function TranslationManager() {
  const [selectedLanguage, setSelectedLanguage] = useState("es")
  const [searchTerm, setSearchTerm] = useState("")
  const [translations, setTranslations] = useState(initialTranslations)
  const [originalTranslations, setOriginalTranslations] = useState(initialTranslations)
  const [hasChanges, setHasChanges] = useState(false)
  const { toast } = useToast()

  // Track changes
  useEffect(() => {
    const changed = JSON.stringify(translations) !== JSON.stringify(originalTranslations)
    setHasChanges(changed)
  }, [translations, originalTranslations])

  const handleTranslationChange = (itemId: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [selectedLanguage]: {
        ...(prev[selectedLanguage as keyof typeof prev] || {}),
        [itemId]: value,
      },
    }))
  }

  const handleSaveTranslations = () => {
    // In a real application, you would save to a database here
    setOriginalTranslations(translations)
    toast({
      title: "Translations saved",
      description: `Successfully saved translations for ${languages.find((l) => l.id === selectedLanguage)?.name}`,
    })
  }

  const handleCancelChanges = () => {
    setTranslations(originalTranslations)
    toast({
      title: "Changes discarded",
      description: "Your translation changes have been reset.",
    })
  }

  // Filter equipment items based on search term
  const filteredEquipment = searchTerm
    ? dbEquipmentItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : dbEquipmentItems

  // Count translated items for the selected language
  const translatedCount = Object.keys((translations as Record<string, Record<string, string>>)[selectedLanguage] || {}).length
  const translationProgress = Math.round((translatedCount / dbEquipmentItems.length) * 100)

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <div className="w-32 bg-muted h-2 rounded-full">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${translationProgress}%` }}></div>
            </div>
            <Badge variant={translationProgress === 100 ? "default" : "outline"}>{translationProgress}%</Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[200px]"
            />
          </div>

          <div className="flex space-x-2 w-full md:w-auto justify-end">
            <Button variant="outline" onClick={handleCancelChanges} disabled={!hasChanges}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSaveTranslations} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        </div>
      </div>

      <Card className="border overflow-hidden w-full">
        <ScrollArea className="h-[calc(100vh-280px)] min-h-[450px]">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="w-1/2">Original Name (English)</TableHead>
                <TableHead className="w-1/2">
                  Translation ({languages.find((l) => l.id === selectedLanguage)?.name})
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => {
                const hasTranslation = !!(translations as Record<string, Record<string, string>>)[selectedLanguage]?.[item.id]

                return (
                  <TableRow key={item.id} className={hasTranslation ? "bg-muted/20" : ""}>
                    <TableCell className="font-medium">
                      {item.name}
                      {hasTranslation && (
                        <Badge variant="outline" className="ml-2 bg-primary/10">
                          <Check className="h-3 w-3 mr-1" /> Translated
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={(translations as Record<string, Record<string, string>>)[selectedLanguage]?.[item.id] || ""}
                        onChange={(e) => handleTranslationChange(item.id, e.target.value)}
                        placeholder={`Enter ${languages.find((l) => l.id === selectedLanguage)?.name} translation`}
                        className={hasTranslation ? "border-primary/50" : ""}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  )
}
