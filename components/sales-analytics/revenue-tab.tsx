"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award } from "lucide-react"

const kpiData = [
  {
    title: "Total Requests",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Revenue",
    value: "$45,892",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Average/Request",
    value: "$161.20",
    change: "-2.1%",
    trend: "down",
    icon: Target,
  },
  {
    title: "Total Upgrades",
    value: "1,234",
    change: "+15.3%",
    trend: "up",
    icon: Award,
  },
]

const monthlyData = [
  {
    month: "Jan '25",
    upsell: 250,
    abs: 180,
    roomNumber: 120,
    extras: 200,
  },
  {
    month: "Feb '25",
    upsell: 200,
    abs: 220,
    roomNumber: 150,
    extras: 280,
  },
  {
    month: "Mar '25",
    upsell: 180,
    abs: 160,
    roomNumber: 200,
    extras: 240,
  },
  {
    month: "Apr '25",
    upsell: 220,
    abs: 190,
    roomNumber: 180,
    extras: 320,
  },
]

const chartConfig = {
  upsell: {
    label: "Upsell",
    color: "hsl(var(--chart-1))",
  },
  abs: {
    label: "ABS",
    color: "hsl(var(--chart-2))",
  },
  roomNumber: {
    label: "Room Number",
    color: "hsl(var(--chart-3))",
  },
  extras: {
    label: "Extras",
    color: "hsl(var(--chart-4))",
  },
}

export function RevenueTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-2xl font-bold">{kpi.value}</p>
                    <div className="flex items-center space-x-1">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge variant={kpi.trend === "up" ? "default" : "destructive"} className="text-xs">
                        {kpi.change}
                      </Badge>
                    </div>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Goal Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-bold text-muted-foreground">Goal (%)</h3>
              <div className="text-4xl font-bold">85%</div>
              <p className="text-sm text-muted-foreground">Revenue Target Achievement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-bold text-muted-foreground">Goal (%)</h3>
              <div className="text-4xl font-bold">92%</div>
              <p className="text-sm text-muted-foreground">Upsell Target Achievement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="px-4 py-2">
          Upsell
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          ABS
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          Room Number
        </Badge>
        <Badge variant="secondary" className="px-4 py-2">
          Extras
        </Badge>
      </div>

      {/* Monthly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="upsell" stackId="a" fill="var(--color-upsell)" />
                <Bar dataKey="abs" stackId="a" fill="var(--color-abs)" />
                <Bar dataKey="roomNumber" stackId="a" fill="var(--color-roomNumber)" />
                <Bar dataKey="extras" stackId="a" fill="var(--color-extras)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
