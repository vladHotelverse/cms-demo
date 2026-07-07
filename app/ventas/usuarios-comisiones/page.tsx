"use client"

import { AppHeader } from "@/components/layout/app-header"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { agentPerformanceData } from "@/data/sales/commission-data"

export default function UsuariosComisionesPage() {
  const { t } = useLanguage()

  return (
    <div className="w-full h-full">
      <AppHeader title={t("usuariosYComisiones")} />
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("commission")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">€18,457</p>
              <p className="text-xs text-muted-foreground">+15.8% {t("vsLastMonthShort")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("activeAgents")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{agentPerformanceData.length}</p>
              <p className="text-xs text-muted-foreground">{t("salesTeamMembers")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("avgConversion")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">54.8%</p>
              <p className="text-xs text-muted-foreground">+3.2% {t("improvement")}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("usuariosYComisiones")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentPerformanceData.map((agent, index) => (
              <div
                key={agent.name}
                className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] items-center gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-4">
                  <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                  <Avatar>
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback>
                      {agent.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Sales: €{agent.totalSales.toLocaleString()} · Conv: {agent.conversionRate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">€{agent.totalCommission.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{t("commission")}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
