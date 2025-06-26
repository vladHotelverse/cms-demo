"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Users, CheckCircle, XCircle } from "lucide-react"

const kpiData = [
  {
    title: "Total Requests",
    value: "3,247",
    change: "+18.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Total Amount",
    value: "$52,890",
    change: "+12.5%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    title: "Amount Accepted",
    value: "$41,230",
    change: "+15.8%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    title: "Amount Cancelled or Unmanaged",
    value: "$11,660",
    change: "-8.3%",
    trend: "down",
    icon: XCircle,
  },
]

const roomManagementData = [
  { name: "Accepted", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Pending", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Cancelled", value: 13, color: "hsl(var(--chart-3))" },
  { name: "Unmanaged", value: 7, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 10, color: "hsl(var(--chart-5))" },
]

const extrasManagementData = [
  { name: "Accepted", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Pending", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Cancelled", value: 13, color: "hsl(var(--chart-3))" },
  { name: "Unmanaged", value: 7, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 10, color: "hsl(var(--chart-5))" },
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

      {/* Management Charts */}
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
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {roomManagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {roomManagementData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
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
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {extrasManagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {extrasManagementData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
