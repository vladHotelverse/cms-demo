"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, BarChart3, Download, RefreshCw, Filter } from "lucide-react"
import { RevenueTab } from "@/components/sales-analytics/revenue-tab"
import { ManagementTab } from "@/components/sales-analytics/management-tab"
import { CommissionTab } from "@/components/sales-analytics/commission-tab"
import { useLanguage } from "@/contexts/language-context"

export default function SalesAnalyticsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("revenue")
  const [dateRange, setDateRange] = useState("this-month")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    // Export functionality
    console.log("Exporting data...")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/20">
      <AppHeader title={t("analiticaVentas")} />

      <div className="flex-1 p-6 space-y-8">
        {/* Enhanced Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("analiticaVentas")}</h1>
            <p className="text-muted-foreground mt-1">Comprehensive analytics and performance insights</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Enhanced Filters Section */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Filters & Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Date Range
                </label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{t("today")}</SelectItem>
                    <SelectItem value="this-week">{t("thisWeek")}</SelectItem>
                    <SelectItem value="this-month">{t("thisMonth")}</SelectItem>
                    <SelectItem value="last-month">{t("lastMonth")}</SelectItem>
                    <SelectItem value="this-year">{t("thisYear")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Agent
                </label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allAgents")}</SelectItem>
                    <SelectItem value="agent1">Maria Rodriguez</SelectItem>
                    <SelectItem value="agent2">Carlos Martinez</SelectItem>
                    <SelectItem value="agent3">Ana Garcia</SelectItem>
                    <SelectItem value="agent4">Luis Hernandez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Product Category
                </label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allProducts")}</SelectItem>
                    <SelectItem value="upsell">Room Upsells</SelectItem>
                    <SelectItem value="abs">ABS Services</SelectItem>
                    <SelectItem value="room-number">Room Assignments</SelectItem>
                    <SelectItem value="extras">Extra Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Filters</label>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Top Performers
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    This Quarter
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Main Dashboard Tabs */}
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b bg-muted/30 rounded-t-lg">
              <TabsList className="grid w-full grid-cols-3 bg-transparent h-14">
                <TabsTrigger
                  value="revenue"
                  className="text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    {t("revenue")}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="management"
                  className="text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {t("management")}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="commission"
                  className="text-base font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    {t("commission")}
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="revenue" className="space-y-6 mt-0">
                <RevenueTab />
              </TabsContent>

              <TabsContent value="management" className="space-y-6 mt-0">
                <ManagementTab />
              </TabsContent>

              <TabsContent value="commission" className="space-y-6 mt-0">
                <CommissionTab />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
