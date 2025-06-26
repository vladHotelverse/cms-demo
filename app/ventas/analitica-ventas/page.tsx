"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Users, BarChart3 } from "lucide-react"
import { RevenueTab } from "@/components/sales-analytics/revenue-tab"
import { ManagementTab } from "@/components/sales-analytics/management-tab"
import { CommissionTab } from "@/components/sales-analytics/commission-tab"

export default function AnaliticaVentasPage() {
  const [activeTab, setActiveTab] = useState("revenue")
  const [dateRange, setDateRange] = useState("this-month")
  const [selectedAgent, setSelectedAgent] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState("all")

  return (
    <div className="flex flex-col h-screen">
      <AppHeader title="Analítica de Ventas" />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Check-in</span>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Pick a date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Agent</span>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Agents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="agent1">Agent 1</SelectItem>
                    <SelectItem value="agent2">Agent 2</SelectItem>
                    <SelectItem value="agent3">Agent 3</SelectItem>
                    <SelectItem value="agent4">Agent 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Product</span>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="upsell">Upsell</SelectItem>
                    <SelectItem value="abs">ABS</SelectItem>
                    <SelectItem value="room-number">Room Number</SelectItem>
                    <SelectItem value="extras">Extras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue" className="text-base font-medium">
              Revenue
            </TabsTrigger>
            <TabsTrigger value="management" className="text-base font-medium">
              Management
            </TabsTrigger>
            <TabsTrigger value="commission" className="text-base font-medium">
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
