"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash, Plus, X } from "lucide-react"
import { ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { Addon } from "@/types/addon"

// Sample categories
const addonCategories = [
  { id: "1", name: "Wellness & Spa" },
  { id: "2", name: "Tours & Activities" },
  { id: "3", name: "Transportation" },
  { id: "4", name: "Food & Beverage" },
  { id: "5", name: "Room Amenities" },
  { id: "6", name: "Business Services" },
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

interface AddonFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addon: Addon | null
  onSave: (addon: Addon) => void
  onDelete: (id: string) => void
}

export default function AddonFormSheet({ open, onOpenChange, addon, onSave, onDelete }: AddonFormSheetProps) {
  const [formData, setFormData] = useState<Partial<Addon>>({
    name: "",
    description: "",
    type: "extra",
    categoryId: "",
    image: "",
    emails: [""],
    link: "",
    translations: {},
  })
  const [activeTab, setActiveTab] = useState("general")
  const [selectedLanguage, setSelectedLanguage] = useState("es")
  const { toast } = useToast()
  const { t } = useLanguage()

  // Reset form when addon changes
  useEffect(() => {
    if (open) {
      if (addon) {
        setFormData({
          ...addon,
          // Ensure emails is an array even if it's undefined
          emails: addon.emails || [""],
        })
      } else {
        setFormData({
          name: "",
          description: "",
          type: "extra",
          categoryId: "",
          image: "",
          emails: [""],
          link: "",
          translations: {},
        })
      }
      setActiveTab("general")
    }
  }, [addon, open])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddEmail = () => {
    setFormData((prev) => ({
      ...prev,
      emails: [...(prev.emails || []), ""],
    }))
  }

  const handleRemoveEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      emails: (prev.emails || []).filter((_, i) => i !== index),
    }))
  }

  const handleEmailChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newEmails = [...(prev.emails || [])]
      newEmails[index] = value
      return { ...prev, emails: newEmails }
    })
  }

  const handleTranslationChange = (language: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...(prev.translations || {}),
        [language]: {
          ...(prev.translations?.[language] || {}),
          [field]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    // Validate required fields
    if (!formData.name || !formData.description || !formData.type || !formData.categoryId) {
      toast({
        title: t("missingRequiredFields"),
        description: t("fillAllRequiredFields"),
        variant: "destructive",
      })
      return
    }

    // Validate type-specific fields
    if (formData.type === "experience" && !formData.link) {
      toast({
        title: t("missingLink"),
        description: t("provideLinkForExperience"),
        variant: "destructive",
      })
      return
    }

    if (formData.type === "extra" && (!formData.emails || formData.emails.length === 0 || !formData.emails[0])) {
      toast({
        title: t("missingEmail"),
        description: t("provideNotificationEmail"),
        variant: "destructive",
      })
      return
    }

    // Save the addon
    onSave(formData as Addon)

    toast({
      title: addon ? t("addonUpdated") : t("addonCreated"),
      description: `${addon ? t("successfullyUpdatedAddon") : t("successfullyCreatedAddon")} "${formData.name}"`,
    })
  }

  const handleDelete = () => {
    if (addon?.id) {
      onDelete(addon.id)
      toast({
        title: t("addonDeleted"),
        description: `${t("successfullyDeletedAddon")} "${addon.name}"`,
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg w-full p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>{addon ? `${t("edit")} ${t("addon")}` : `${t("create")} ${t("addon")}`}</SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 px-6 pt-4">
            <TabsTrigger value="general">{t("general")}</TabsTrigger>
            <TabsTrigger value="translations">{t("translations")}</TabsTrigger>
            <TabsTrigger value="media">{t("media")}</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="general" className="p-6 space-y-4 min-h-[400px]">
              <div className="space-y-2">
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("addonName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={t("addonDescription")}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t("type")}</Label>
                  <Select value={formData.type || "extra"} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder={t("selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extra">{t("extra")}</SelectItem>
                      <SelectItem value="experience">{t("experience")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId || ""}
                    onValueChange={(value) => handleInputChange("categoryId", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {addonCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Type-specific fields */}
              {formData.type === "experience" ? (
                <div className="space-y-2">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    value={formData.link || ""}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Notification Emails</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddEmail}>
                      <Plus className="h-3 w-3 mr-1" /> Add Email
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(formData.emails || []).map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={email}
                          onChange={(e) => handleEmailChange(index, e.target.value)}
                          placeholder="email@example.com"
                        />
                        {(formData.emails?.length || 0) > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveEmail(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="translations" className="p-6 space-y-4 min-h-[400px]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger id="language">
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
                </div>

                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="translatedName">
                        Name ({languages.find((l) => l.id === selectedLanguage)?.name})
                      </Label>
                      <Input
                        id="translatedName"
                        value={formData.translations?.[selectedLanguage]?.name || ""}
                        onChange={(e) => handleTranslationChange(selectedLanguage, "name", e.target.value)}
                        placeholder={`${formData.name} in ${languages.find((l) => l.id === selectedLanguage)?.name}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="translatedDescription">
                        Description ({languages.find((l) => l.id === selectedLanguage)?.name})
                      </Label>
                      <Textarea
                        id="translatedDescription"
                        value={formData.translations?.[selectedLanguage]?.description || ""}
                        onChange={(e) => handleTranslationChange(selectedLanguage, "description", e.target.value)}
                        placeholder={`${formData.description} in ${languages.find((l) => l.id === selectedLanguage)?.name}`}
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="media" className="p-6 space-y-4 min-h-[400px]">
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image || ""}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {formData.image ? (
                  <div className="space-y-2">
                    <div className="aspect-video relative rounded-md overflow-hidden">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleInputChange("image", "")}>
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>No image added</p>
                      <p>Enter an image URL above</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground mt-4">
                <p>Note: In a production environment, you would have a file upload component here.</p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <SheetFooter className="p-6 border-t">
          <div className="flex justify-between w-full">
            {addon && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{addon ? "Update" : "Create"} Addon</Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
