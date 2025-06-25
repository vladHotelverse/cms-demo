"use client"

import { useLanguage } from "@/contexts/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="w-full h-full p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("welcomeToHotelverse")}</h1>
      </div>

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
  )
}
