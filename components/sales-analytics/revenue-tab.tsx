"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  CartesianGrid,
} from "recharts"
import { TrendingUp, DollarSign, Users, Target, Award, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { BarChart3 } from "lucide-react" // Declaring the BarChart3 variable

const kpiData = [
  {
    title: "Total Requests",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs last month",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Revenue",
    value: "$45,892",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Average/Request",
    value: "$161.20",
    change: "-2.1%",
    trend: "down",
    icon: Target,
    description: "vs last month",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Total Upgrades",
    value: "1,234",
    change: "+15.3%",
    trend: "up",
    icon: Award,
    description: "vs last month",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

const monthlyData = [
  { month: "Jan '25", upsell: 250, abs: 180, roomNumber: 120, extras: 200, total: 750 },
  { month: "Feb '25", upsell: 200, abs: 220, roomNumber: 150, extras: 280, total: 850 },
  { month: "Mar '25", upsell: 180, abs: 160, roomNumber: 200, extras: 240, total: 780 },
  { month: "Apr '25", upsell: 220, abs: 190, roomNumber: 180, extras: 320, total: 910 },
  { month: "May '25", upsell: 280, abs: 210, roomNumber: 160, extras: 350, total: 1000 },
  { month: "Jun '25", upsell: 320, abs: 240, roomNumber: 190, extras: 380, total: 1130 },
]

const trendData = [
  { date: "Week 1", revenue: 8500, target: 10000 },
  { date: "Week 2", revenue: 12000, target: 10000 },
  { date: "Week 3", revenue: 9800, target: 10000 },
  { date: "Week 4", revenue: 15200, target: 10000 },
]

const chartConfig = {
  upsell: { label: "Upsell", color: "hsl(var(--chart-1))" },
  abs: { label: "ABS", color: "hsl(var(--chart-2))" },
  roomNumber: { label: "Room Number", color: "hsl(var(--chart-3))" },
  extras: { label: "Extras", color: "hsl(var(--chart-4))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-2))" },
}

export function RevenueTab() {
  return (
    <div className="space-y-8">
      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`absolute inset-0 ${kpi.bgColor} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                        <Icon className={`h-5 w-5 ${kpi.color}`} />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold tracking-tight">{kpi.value}</p>
                      <div className="flex items-center gap-2">
                        {kpi.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                        <Badge
                          variant={kpi.trend === "up" ? "default" : "destructive"}
                          className="text-xs font-semibold"
                        >
                          {kpi.change}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{kpi.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Goal Achievement Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-muted-foreground">Revenue Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">85%</div>
              <p className="text-sm text-muted-foreground">Target Achievement</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$38,908 / $45,750</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-muted-foreground">Upsell Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">92%</div>
              <p className="text-sm text-muted-foreground">Target Achievement</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>1,136 / 1,234</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Badges */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="default" className="px-4 py-2 text-sm font-medium">
          Room Upsells
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          ABS Services
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          Room Assignments
        </Badge>
        <Badge
          variant="secondary"
          className="px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          Extra Services
        </Badge>
      </div>

      {/* Enhanced Charts Section */}
      <div className="space-y-6">
        {/* Monthly Performance Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar yAxisId="left" dataKey="upsell" stackId="a" fill="var(--color-upsell)" radius={[0, 0, 0, 0]} />
                  <Bar yAxisId="left" dataKey="abs" stackId="a" fill="var(--color-abs)" radius={[0, 0, 0, 0]} />
                  <Bar
                    yAxisId="left"
                    dataKey="roomNumber"
                    stackId="a"
                    fill="var(--color-roomNumber)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar yAxisId="left" dataKey="extras" stackId="a" fill="var(--color-extras)" radius={[4, 4, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend and Comparison Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue vs Target Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      fill="var(--color-revenue)"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="var(--color-target)"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-target)", strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Performance Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="upsell" fill="var(--color-upsell)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="abs" fill="var(--color-abs)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="roomNumber" fill="var(--color-roomNumber)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="extras" fill="var(--color-extras)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
