"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import EquipmentCategoryManager from "@/components/equipment-category-manager"
import TranslationManager from "@/components/translation-manager"
import { useLanguage } from "@/contexts/language-context"

export default function AtributosPage() {
  const { t } = useLanguage()

  return (
    <div className="w-full h-full p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("atributosManagement")}</h1>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full max-w-md mb-6">
          <TabsTrigger value="categories" className="flex-1">
            {t("equipmentCategories")}
          </TabsTrigger>
          <TabsTrigger value="translations" className="flex-1">
            {t("translations")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="w-full">
          <Card className="border-none shadow-sm p-4 md:p-6 w-full">
            <EquipmentCategoryManager />
          </Card>
        </TabsContent>

        <TabsContent value="translations" className="w-full">
          <Card className="border-none shadow-sm p-4 md:p-6 w-full">
            <TranslationManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
