"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer } from "@/components/ui/chart"
import { Users, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"

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
  { name: "Accepted", value: 40, color: "hsl(220 70% 50%)", count: 1298 },
  { name: "Pending", value: 30, color: "hsl(160 60% 45%)", count: 974 },
  { name: "Cancelled", value: 13, color: "hsl(0 70% 50%)", count: 422 },
  { name: "Unmanaged", value: 7, color: "hsl(30 70% 50%)", count: 227 },
  { name: "Other", value: 10, color: "hsl(270 60% 50%)", count: 324 },
]

const extrasManagementData = [
  { name: "Accepted", value: 40, color: "hsl(220 70% 50%)", count: 856 },
  { name: "Pending", value: 30, color: "hsl(160 60% 45%)", count: 642 },
  { name: "Cancelled", value: 13, color: "hsl(0 70% 50%)", count: 278 },
  { name: "Unmanaged", value: 7, color: "hsl(30 70% 50%)", count: 150 },
  { name: "Other", value: 10, color: "hsl(270 60% 50%)", count: 214 },
]

const weeklyData = [
  { week: "Week 1", accepted: 85, pending: 45, cancelled: 12 },
  { week: "Week 2", accepted: 92, pending: 38, cancelled: 8 },
  { week: "Week 3", accepted: 78, pending: 52, cancelled: 15 },
  { week: "Week 4", accepted: 96, pending: 41, cancelled: 9 },
]

const chartConfig = {
  accepted: { label: "Accepted", color: "hsl(220 70% 50%)" },
  pending: { label: "Pending", color: "hsl(160 60% 45%)" },
  cancelled: { label: "Cancelled", color: "hsl(0 70% 50%)" },
  unmanaged: { label: "Unmanaged", color: "hsl(30 70% 50%)" },
  other: { label: "Other", color: "hsl(270 60% 50%)" },
}

// Helper function to create pie chart paths
const createPieSlice = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle)
  const end = polarToCartesian(centerX, centerY, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
  return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
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

      {/* Management Overview */}
      <div className="space-y-6">
        {/* Pie Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Room Management Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Room Management Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <div className="w-full h-[300px] flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Pie Chart */}
                    <g transform="translate(200, 150)">
                      {roomManagementData.map((item, index) => {
                        let startAngle = 0
                        for (let i = 0; i < index; i++) {
                          startAngle += (roomManagementData[i].value / 100) * 360
                        }
                        const endAngle = startAngle + (item.value / 100) * 360

                        return (
                          <g key={index}>
                            <path
                              d={createPieSlice(0, 0, 80, startAngle, endAngle)}
                              fill={item.color}
                              stroke="white"
                              strokeWidth="2"
                            />
                            {/* Percentage labels */}
                            <text
                              x={Math.cos((((startAngle + endAngle) / 2 - 90) * Math.PI) / 180) * 50}
                              y={Math.sin((((startAngle + endAngle) / 2 - 90) * Math.PI) / 180) * 50}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-white text-xs font-semibold"
                            >
                              {item.value}%
                            </text>
                          </g>
                        )
                      })}
                    </g>
                  </svg>
                </div>
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

          {/* Extras Management Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                Extras Management Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[300px]">
                <div className="w-full h-[300px] flex items-center justify-center">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Pie Chart */}
                    <g transform="translate(200, 150)">
                      {extrasManagementData.map((item, index) => {
                        let startAngle = 0
                        for (let i = 0; i < index; i++) {
                          startAngle += (extrasManagementData[i].value / 100) * 360
                        }
                        const endAngle = startAngle + (item.value / 100) * 360

                        return (
                          <g key={index}>
                            <path
                              d={createPieSlice(0, 0, 80, startAngle, endAngle)}
                              fill={item.color}
                              stroke="white"
                              strokeWidth="2"
                            />
                            {/* Percentage labels */}
                            <text
                              x={Math.cos((((startAngle + endAngle) / 2 - 90) * Math.PI) / 180) * 50}
                              y={Math.sin((((startAngle + endAngle) / 2 - 90) * Math.PI) / 180) * 50}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-white text-xs font-semibold"
                            >
                              {item.value}%
                            </text>
                          </g>
                        )
                      })}
                    </g>
                  </svg>
                </div>
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

        {/* Weekly Trend Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Weekly Request Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[350px]">
              <div className="w-full h-[350px]">
                <svg viewBox="0 0 800 350" className="w-full h-full">
                  {/* Chart Background */}
                  <rect width="800" height="350" fill="transparent" />

                  {/* Grid */}
                  <defs>
                    <pattern id="grid3" width="40" height="35" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 35"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="350" fill="url(#grid3)" />

                  {/* Axes */}
                  <line x1="80" y1="300" x2="720" y2="300" stroke="hsl(var(--border))" strokeWidth="1" />
                  <line x1="80" y1="50" x2="80" y2="300" stroke="hsl(var(--border))" strokeWidth="1" />

                  {/* Bars */}
                  {weeklyData.map((data, index) => {
                    const x = 120 + index * 140
                    const barWidth = 30
                    const scale = 250 / 100

                    return (
                      <g key={index}>
                        {/* Accepted bars */}
                        <rect
                          x={x}
                          y={300 - data.accepted * scale}
                          width={barWidth}
                          height={data.accepted * scale}
                          fill="hsl(220 70% 50%)"
                          rx="2"
                        />

                        {/* Pending bars */}
                        <rect
                          x={x + 35}
                          y={300 - data.pending * scale}
                          width={barWidth}
                          height={data.pending * scale}
                          fill="hsl(160 60% 45%)"
                          rx="2"
                        />

                        {/* Cancelled bars */}
                        <rect
                          x={x + 70}
                          y={300 - data.cancelled * scale}
                          width={barWidth}
                          height={data.cancelled * scale}
                          fill="hsl(0 70% 50%)"
                          rx="2"
                        />

                        {/* Week label */}
                        <text
                          x={x + 50}
                          y="320"
                          textAnchor="middle"
                          className="fill-current text-sm"
                          fill="hsl(var(--foreground))"
                        >
                          {data.week}
                        </text>
                      </g>
                    )
                  })}

                  {/* Y-axis labels */}
                  {[0, 20, 40, 60, 80, 100].map((value, index) => (
                    <g key={index}>
                      <text
                        x="70"
                        y={300 - value * 2.5}
                        textAnchor="end"
                        className="fill-current text-xs"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {value}
                      </text>
                    </g>
                  ))}

                  {/* Legend */}
                  <g transform="translate(500, 30)">
                    <rect x="0" y="0" width="12" height="12" fill="hsl(220 70% 50%)" rx="2" />
                    <text x="20" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Accepted
                    </text>

                    <rect x="0" y="20" width="12" height="12" fill="hsl(160 60% 45%)" rx="2" />
                    <text x="20" y="30" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Pending
                    </text>

                    <rect x="0" y="40" width="12" height="12" fill="hsl(0 70% 50%)" rx="2" />
                    <text x="20" y="50" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Cancelled
                    </text>
                  </g>
                </svg>
              </div>
            </ChartContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 rounded-lg bg-blue-50">
                <div className="text-2xl font-bold text-blue-600">351</div>
                <div className="text-xs text-muted-foreground">Total Accepted</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50">
                <div className="text-2xl font-bold text-green-600">176</div>
                <div className="text-xs text-muted-foreground">Total Pending</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50">
                <div className="text-2xl font-bold text-red-600">42</div>
                <div className="text-xs text-muted-foreground">Total Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
