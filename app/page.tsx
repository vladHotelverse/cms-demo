"use client"

import { useLanguage } from "@/contexts/language-context"
import { AppHeader } from "@/components/app-header"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="w-full h-full">
      <AppHeader title={t("welcomeToHotelverse")} />
      <div className="p-6 md:p-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">{t("quickStats")}</h2>
          <p className="text-muted-foreground">{t("overviewText")}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">{t("recentActivity")}</h2>
          <p className="text-muted-foreground">{t("latestUpdates")}</p>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">{t("systemStatus")}</h2>
          <p className="text-muted-foreground">{t("allSystemsOperational")}</p>
        </div>
      </div>
      </div>
    </div>
  )
}
