"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, CheckCircle, XCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const kpiData = [
  {
    title: "Total Requests",
    value: "1,847",
    change: "+5.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Total Amount",
    value: "$184,750",
    change: "+12.8%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Amount Accepted",
    value: "$156,240",
    change: "+18.5%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    title: "Amount Cancelled or Unmanaged",
    value: "$28,510",
    change: "-8.2%",
    trend: "down",
    icon: XCircle,
  },
]

const roomManagementData = [
  { name: "Accepted", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Pending", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Cancelled", value: 10, color: "hsl(var(--chart-3))" },
  { name: "Unmanaged", value: 7, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 13, color: "hsl(var(--chart-5))" },
]

const extrasManagementData = [
  { name: "Accepted", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Pending", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Cancelled", value: 10, color: "hsl(var(--chart-3))" },
  { name: "Unmanaged", value: 7, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 13, color: "hsl(var(--chart-5))" },
]

const chartConfig = {
  accepted: {
    label: "Accepted",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
  unmanaged: {
    label: "Unmanaged",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export function ManagementTab() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
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

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Room Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomManagementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ value }) => `${value}%`}
                  >
                    {roomManagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Extras Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={extrasManagementData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ value }) => `${value}%`}
                  >
                    {extrasManagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
