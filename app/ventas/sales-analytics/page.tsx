"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, RefreshCw, Filter } from "lucide-react"
import { RevenueTab } from "@/components/sales-analytics/revenue-tab"
import { ManagementTab } from "@/components/sales-analytics/management-tab"
import { CommissionTab } from "@/components/sales-analytics/commission-tab"
import { useLanguage } from "@/contexts/language-context"

export default function SalesAnalyticsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("revenue")
  const [dateRange, setDateRange] = useState("thisMonth")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{t('salesAnalytics')}</h1>
            <p className="text-muted-foreground">{t('comprehensiveSalesDescription')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('refresh')}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('export')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              {t('filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('checkIn')}</label>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {t('pickADate')}
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('agent')}</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('allAgents')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allAgents')}</SelectItem>
                    <SelectItem value="maria">Maria Rodriguez</SelectItem>
                    <SelectItem value="carlos">Carlos Martinez</SelectItem>
                    <SelectItem value="ana">Ana Garcia</SelectItem>
                    <SelectItem value="luis">Luis Hernandez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('product')}</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('allProducts')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allProducts')}</SelectItem>
                    <SelectItem value="upsell">{t('roomUpsells')}</SelectItem>
                    <SelectItem value="abs">{t('absServices')}</SelectItem>
                    <SelectItem value="extras">{t('extraServices')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('dateRange')}</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">{t('today')}</SelectItem>
                    <SelectItem value="thisWeek">{t('thisWeek')}</SelectItem>
                    <SelectItem value="thisMonth">{t('thisMonth')}</SelectItem>
                    <SelectItem value="lastMonth">{t('lastMonth')}</SelectItem>
                    <SelectItem value="thisQuarter">{t('thisQuarter')}</SelectItem>
                    <SelectItem value="thisYear">{t('thisYear')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              {t('revenue')}
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {t('management')}
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              {t('commission')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueTab />
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <ManagementTab />
          </TabsContent>

          <TabsContent value="commission" className="space-y-6">
            <CommissionTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
