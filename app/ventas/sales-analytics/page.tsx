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

export default function SalesAnalyticsPage() {
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
            <h1 className="text-4xl font-bold tracking-tight">Sales Analytics</h1>
            <p className="text-muted-foreground">Comprehensive sales performance and commission tracking dashboard</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in</label>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Pick a date
                </Button>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agent</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="maria">Maria Rodriguez</SelectItem>
                    <SelectItem value="carlos">Carlos Martinez</SelectItem>
                    <SelectItem value="ana">Ana Garcia</SelectItem>
                    <SelectItem value="luis">Luis Hernandez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="upsell">Room Upsells</SelectItem>
                    <SelectItem value="abs">ABS Services</SelectItem>
                    <SelectItem value="extras">Extra Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="thisQuarter">This Quarter</SelectItem>
                    <SelectItem value="thisYear">This Year</SelectItem>
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
              Revenue
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Management
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              Commission
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
