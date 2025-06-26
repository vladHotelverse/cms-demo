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
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  RadialBarChart,
  RadialBar,
  CartesianGrid,
} from "recharts"
import { Users, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight, Target } from "lucide-react"

const kpiData = [
  {
    title: "Total Requests",
    value: "3,247",
    change: "+18.2%",
    trend: "up",
    icon: Users,
    description: "vs last month",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Amount",
    value: "$52,890",
    change: "+12.5%",
    trend: "up",
    icon: CheckCircle,
    description: "vs last month",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Amount Accepted",
    value: "$41,230",
    change: "+15.8%",
    trend: "up",
    icon: CheckCircle,
    description: "vs last month",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Amount Cancelled",
    value: "$11,660",
    change: "-8.3%",
    trend: "down",
    icon: XCircle,
    description: "vs last month",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

const roomManagementData = [
  { name: "Accepted", value: 40, color: "hsl(var(--chart-1))", count: 1298 },
  { name: "Pending", value: 30, color: "hsl(var(--chart-2))", count: 974 },
  { name: "Cancelled", value: 13, color: "hsl(var(--chart-3))", count: 422 },
  { name: "Unmanaged", value: 7, color: "hsl(var(--chart-4))", count: 227 },
  { name: "Other", value: 10, color: "hsl(var(--chart-5))", count: 324 },
]

const extrasManagementData = [
  { name: "Accepted", value: 40, color: "hsl(var(--chart-1))", count: 856 },
  { name: "Pending", value: 30, color: "hsl(var(--chart-2))", count: 642 },
  { name: "Cancelled", value: 13, color: "hsl(var(--chart-3))", count: 278 },
  { name: "Unmanaged", value: 7, color: "hsl(var(--chart-4))", count: 150 },
  { name: "Other", value: 10, color: "hsl(var(--chart-5))", count: 214 },
]

const weeklyData = [
  { week: "Week 1", accepted: 85, pending: 45, cancelled: 12 },
  { week: "Week 2", accepted: 92, pending: 38, cancelled: 8 },
  { week: "Week 3", accepted: 78, pending: 52, cancelled: 15 },
  { week: "Week 4", accepted: 96, pending: 41, cancelled: 9 },
]

const performanceMetrics = [
  { category: "Room Upgrades", current: 85, target: 90, color: "hsl(var(--chart-1))" },
  { category: "Extra Services", current: 72, target: 80, color: "hsl(var(--chart-2))" },
  { category: "ABS Services", current: 91, target: 85, color: "hsl(var(--chart-3))" },
  { category: "Cancellations", current: 8, target: 12, color: "hsl(var(--chart-4))" },
]

const dailyTrend = [
  { day: "Mon", requests: 45, accepted: 38, cancelled: 7 },
  { day: "Tue", requests: 52, accepted: 44, cancelled: 8 },
  { day: "Wed", requests: 48, accepted: 41, cancelled: 7 },
  { day: "Thu", requests: 61, accepted: 53, cancelled: 8 },
  { day: "Fri", requests: 58, accepted: 49, cancelled: 9 },
  { day: "Sat", requests: 67, accepted: 59, cancelled: 8 },
  { day: "Sun", requests: 43, accepted: 37, cancelled: 6 },
]

const chartConfig = {
  accepted: { label: "Accepted", color: "hsl(var(--chart-1))" },
  pending: { label: "Pending", color: "hsl(var(--chart-2))" },
  cancelled: { label: "Cancelled", color: "hsl(var(--chart-3))" },
  unmanaged: { label: "Unmanaged", color: "hsl(var(--chart-4))" },
  other: { label: "Other", color: "hsl(var(--chart-5))" },
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function ManagementTab() {
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

      {/* Enhanced Management Overview */}
      <div className="space-y-6">
        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Management Enhanced Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Room Management Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomManagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {roomManagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {roomManagementData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extras Management Enhanced Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                Extras Management Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={extrasManagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {extrasManagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {extrasManagementData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics and Daily Trend */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Performance Metrics Radial Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Performance vs Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={performanceMetrics}>
                    <RadialBar dataKey="current" cornerRadius={10} fill="var(--color-accepted)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="space-y-3 mt-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.category}</span>
                      <span className="text-muted-foreground">
                        {metric.current}% / {metric.target}%
                      </span>
                    </div>
                    <Progress value={metric.current} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Trend Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Daily Request Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="requests" fill="var(--color-pending)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="accepted" fill="var(--color-accepted)" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <div className="text-2xl font-bold text-blue-600">374</div>
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">321</div>
                  <div className="text-xs text-muted-foreground">Accepted</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50">
                  <div className="text-2xl font-bold text-red-600">53</div>
                  <div className="text-xs text-muted-foreground">Cancelled</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
