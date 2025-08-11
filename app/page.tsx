"use client"

import { useLanguage } from "@/contexts/language-context"
import { AppHeader } from "@/components/layout/app-header"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="w-full h-full" data-testid="homepage">
      <AppHeader title={t("welcomeToHotelverse")} />
      <div className="p-6 md:p-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="dashboard-cards">
        <div className="bg-card border rounded-lg p-6" data-testid="quick-stats-card">
          <h2 className="text-lg font-semibold mb-2">{t("quickStats")}</h2>
          <p className="text-muted-foreground">{t("overviewText")}</p>
        </div>

        <div className="bg-card border rounded-lg p-6" data-testid="recent-activity-card">
          <h2 className="text-lg font-semibold mb-2">{t("recentActivity")}</h2>
          <p className="text-muted-foreground">{t("latestUpdates")}</p>
        </div>

        <div className="bg-card border rounded-lg p-6" data-testid="system-status-card">
          <h2 className="text-lg font-semibold mb-2">{t("systemStatus")}</h2>
          <p className="text-muted-foreground">{t("allSystemsOperational")}</p>
        </div>
      </div>
      </div>
    </div>
  )
}
