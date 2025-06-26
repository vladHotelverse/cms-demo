"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, DollarSign, Award, Users, Target, ArrowUpRight, ArrowDownRight, Crown } from "lucide-react"

const kpiData = [
  {
    title: "Total Commission",
    value: "$8,450",
    change: "+22.1%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Upsells",
    value: "$12,340",
    change: "+18.5%",
    trend: "up",
    icon: Award,
    description: "vs last month",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Extras",
    value: "$9,870",
    change: "+15.2%",
    trend: "up",
    icon: Target,
    description: "vs last month",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Total Upgrades",
    value: "1,456",
    change: "+12.8%",
    trend: "up",
    icon: Users,
    description: "vs last month",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const agentPerformanceData = [
  {
    agent: "Maria Rodriguez",
    upsell: 320,
    abs: 180,
    roomNumber: 140,
    extras: 160,
    total: 800,
    commission: 2400,
    avatar: "/placeholder-user.jpg",
    rank: 1,
  },
  {
    agent: "Carlos Martinez",
    upsell: 280,
    abs: 200,
    roomNumber: 120,
    extras: 140,
    total: 740,
    commission: 2220,
    avatar: "/placeholder-user.jpg",
    rank: 2,
  },
  {
    agent: "Ana Garcia",
    upsell: 250,
    abs: 160,
    roomNumber: 180,
    extras: 100,
    total: 690,
    commission: 2070,
    avatar: "/placeholder-user.jpg",
    rank: 3,
  },
  {
    agent: "Luis Hernandez",
    upsell: 200,
    abs: 140,
    roomNumber: 100,
    extras: 120,
    total: 560,
    commission: 1680,
    avatar: "/placeholder-user.jpg",
    rank: 4,
  },
]

const commissionTrendData = [
  { month: "Jan", commission: 6500, target: 7000 },
  { month: "Feb", commission: 7200, target: 7000 },
  { month: "Mar", commission: 6800, target: 7000 },
  { month: "Apr", commission: 8100, target: 7000 },
  { month: "May", commission: 8450, target: 7000 },
  { month: "Jun", commission: 9200, target: 7000 },
]

const chartConfig = {
  upsell: { label: "Upsell", color: "hsl(var(--chart-1))" },
  abs: { label: "ABS", color: "hsl(var(--chart-2))" },
  roomNumber: { label: "Room Number", color: "hsl(var(--chart-3))" },
  extras: { label: "Extras", color: "hsl(var(--chart-4))" },
  commission: { label: "Commission", color: "hsl(var(--chart-1))" },
  target: { label: "Target", color: "hsl(var(--chart-2))" },
}

export function CommissionTab() {
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

      {/* Goal and Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-muted-foreground">Commission Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">78%</div>
              <p className="text-sm text-muted-foreground">Target Achievement</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$8,450 / $10,800</span>
              </div>
              <Progress value={78} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-muted-foreground">Team Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">$45,892</div>
              <p className="text-sm text-muted-foreground">Total Team Commission</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">$12,340</div>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">$33,552</div>
                <p className="text-xs text-muted-foreground">YTD</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentPerformanceData.map((agent, index) => (
              <Card key={index} className={`relative ${index === 0 ? "ring-2 ring-yellow-500" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {agent.agent
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{agent.agent}</p>
                      <p className="text-xs text-muted-foreground">Rank #{agent.rank}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Commission</span>
                      <span className="font-semibold text-green-600">${agent.commission}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Sales</span>
                      <span className="font-semibold">{agent.total}</span>
                    </div>
                    <Progress value={(agent.total / 1000) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Agent Performance Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Agent Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agentPerformanceData}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="agent" type="category" width={80} />
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

        {/* Commission Trend Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Commission Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={commissionTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="var(--color-commission)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-commission)", strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="var(--color-target)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
