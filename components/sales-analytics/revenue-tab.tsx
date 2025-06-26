"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Calculator, Target } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"

const kpiData = [
  {
    title: "Total Requests",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Total Revenue",
    value: "$284,750",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Average/Request",
    value: "$99.98",
    change: "-2.1%",
    trend: "down",
    icon: Calculator,
  },
  {
    title: "Total Upgrades",
    value: "1,247",
    subtitle: "(cantidad)",
    change: "+15.3%",
    trend: "up",
    icon: Target,
  },
]

const chartData = [
  {
    month: "Jan '25",
    upsell: 200,
    abs: 150,
    roomNumber: 100,
    extras: 300,
  },
  {
    month: "Feb '25",
    upsell: 180,
    abs: 200,
    roomNumber: 120,
    extras: 350,
  },
  {
    month: "Mar '25",
    upsell: 220,
    abs: 180,
    roomNumber: 90,
    extras: 280,
  },
  {
    month: "Apr '25",
    upsell: 250,
    abs: 160,
    roomNumber: 110,
    extras: 400,
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                  {kpi.subtitle && <div className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</div>}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="mt-2">
                  {kpi.change}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Goal Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold text-muted-foreground">Goal (%)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-6xl font-bold text-primary">85%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-4xl font-bold text-muted-foreground">Goal (%)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-6xl font-bold text-primary">92%</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Buttons */}
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

      {/* Stacked Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
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
