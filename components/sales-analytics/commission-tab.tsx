"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Award, Users, Target } from "lucide-react"

const kpiData = [
  {
    title: "Total Commission",
    value: "$8,450",
    change: "+22.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Total Upsells Importe",
    value: "$12,340",
    change: "+18.5%",
    trend: "up",
    icon: Award,
  },
  {
    title: "Total Extras Importe",
    value: "$9,870",
    change: "+15.2%",
    trend: "up",
    icon: Target,
  },
  {
    title: "Total Upgrades",
    value: "1,456",
    change: "+12.8%",
    trend: "up",
    icon: Users,
  },
]

const agentPerformanceData = [
  {
    agent: "Agent 1",
    upsell: 300,
    abs: 200,
    roomNumber: 150,
    extras: 180,
  },
  {
    agent: "Agent 2",
    upsell: 380,
    abs: 120,
    roomNumber: 100,
    extras: 140,
  },
  {
    agent: "Agent 3",
    upsell: 280,
    abs: 180,
    roomNumber: 160,
    extras: 0,
  },
  {
    agent: "Agent 4",
    upsell: 200,
    abs: 160,
    roomNumber: 80,
    extras: 120,
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

export function CommissionTab() {
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

      {/* Goal and Team Bag Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-bold text-muted-foreground">Goal (%)</h3>
              <div className="text-4xl font-bold">78%</div>
              <p className="text-sm text-muted-foreground">Commission Target Achievement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-6xl font-bold text-muted-foreground">Team Bag</h3>
              <div className="text-4xl font-bold">$45,892</div>
              <p className="text-sm text-muted-foreground">Total Team Earnings</p>
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

      {/* Agent Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={agentPerformanceData}
                layout="horizontal"
                margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis dataKey="agent" type="category" width={60} />
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
