"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer } from "@/components/ui/chart"
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
      <div className="space-y-6">
        {/* Agent Performance Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Agent Performance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="min-h-[400px]">
              <div className="w-full h-[400px]">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  {/* Chart Background */}
                  <rect width="800" height="400" fill="transparent" />

                  {/* Grid */}
                  <defs>
                    <pattern id="grid4" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="400" fill="url(#grid4)" />

                  {/* Axes */}
                  <line x1="150" y1="50" x2="150" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />
                  <line x1="150" y1="350" x2="750" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />

                  {/* Horizontal Stacked Bars */}
                  {agentPerformanceData.map((agent, index) => {
                    const y = 80 + index * 70
                    const barHeight = 40
                    const scale = 600 / 1000 // Scale to fit in 600px width

                    const currentX = 150

                    return (
                      <g key={index}>
                        {/* Upsell bar */}
                        <rect
                          x={currentX}
                          y={y}
                          width={agent.upsell * scale}
                          height={barHeight}
                          fill="hsl(220 70% 50%)"
                          rx="2"
                        />

                        {/* ABS bar */}
                        <rect
                          x={currentX + agent.upsell * scale}
                          y={y}
                          width={agent.abs * scale}
                          height={barHeight}
                          fill="hsl(160 60% 45%)"
                          rx="2"
                        />

                        {/* Room Number bar */}
                        <rect
                          x={currentX + (agent.upsell + agent.abs) * scale}
                          y={y}
                          width={agent.roomNumber * scale}
                          height={barHeight}
                          fill="hsl(30 70% 50%)"
                          rx="2"
                        />

                        {/* Extras bar */}
                        <rect
                          x={currentX + (agent.upsell + agent.abs + agent.roomNumber) * scale}
                          y={y}
                          width={agent.extras * scale}
                          height={barHeight}
                          fill="hsl(270 60% 50%)"
                          rx="2"
                        />

                        {/* Agent name */}
                        <text
                          x="140"
                          y={y + barHeight / 2}
                          textAnchor="end"
                          dominantBaseline="middle"
                          className="fill-current text-sm"
                          fill="hsl(var(--foreground))"
                        >
                          {agent.agent.split(" ")[0]}
                        </text>
                      </g>
                    )
                  })}

                  {/* X-axis labels */}
                  {[0, 200, 400, 600, 800].map((value, index) => (
                    <g key={index}>
                      <text
                        x={150 + value * 0.6}
                        y="370"
                        textAnchor="middle"
                        className="fill-current text-xs"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {value}
                      </text>
                    </g>
                  ))}

                  {/* Legend */}
                  <g transform="translate(200, 20)">
                    <rect x="0" y="0" width="12" height="12" fill="hsl(220 70% 50%)" rx="2" />
                    <text x="20" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Upsell
                    </text>

                    <rect x="80" y="0" width="12" height="12" fill="hsl(160 60% 45%)" rx="2" />
                    <text x="100" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      ABS
                    </text>

                    <rect x="140" y="0" width="12" height="12" fill="hsl(30 70% 50%)" rx="2" />
                    <text x="160" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Room Number
                    </text>

                    <rect x="260" y="0" width="12" height="12" fill="hsl(270 60% 50%)" rx="2" />
                    <text x="280" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Extras
                    </text>
                  </g>
                </svg>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Commission Trend Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Commission Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="min-h-[350px]">
              <div className="w-full h-[350px]">
                <svg viewBox="0 0 800 350" className="w-full h-full">
                  {/* Chart Background */}
                  <rect width="800" height="350" fill="transparent" />

                  {/* Grid */}
                  <defs>
                    <pattern id="grid5" width="40" height="35" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 35"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="350" fill="url(#grid5)" />

                  {/* Axes */}
                  <line x1="80" y1="300" x2="720" y2="300" stroke="hsl(var(--border))" strokeWidth="1" />
                  <line x1="80" y1="50" x2="80" y2="300" stroke="hsl(var(--border))" strokeWidth="1" />

                  {/* Commission line */}
                  <path
                    d={`M 80 ${300 - (6500 * 250) / 10000} 
                        L ${80 + 128} ${300 - (7200 * 250) / 10000}
                        L ${80 + 256} ${300 - (6800 * 250) / 10000}
                        L ${80 + 384} ${300 - (8100 * 250) / 10000}
                        L ${80 + 512} ${300 - (8450 * 250) / 10000}
                        L ${80 + 640} ${300 - (9200 * 250) / 10000}`}
                    stroke="hsl(220 70% 50%)"
                    strokeWidth="3"
                    fill="none"
                  />

                  {/* Target line (dashed) */}
                  <path
                    d={`M 80 ${300 - (7000 * 250) / 10000} L ${80 + 640} ${300 - (7000 * 250) / 10000}`}
                    stroke="hsl(0 70% 50%)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                  />

                  {/* Data points */}
                  {commissionTrendData.map((data, index) => (
                    <circle
                      key={index}
                      cx={80 + index * 128}
                      cy={300 - (data.commission * 250) / 10000}
                      r="4"
                      fill="hsl(220 70% 50%)"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}

                  {/* X-axis labels */}
                  {commissionTrendData.map((data, index) => (
                    <text
                      key={index}
                      x={80 + index * 128}
                      y="320"
                      textAnchor="middle"
                      className="fill-current text-sm"
                      fill="hsl(var(--foreground))"
                    >
                      {data.month}
                    </text>
                  ))}

                  {/* Y-axis labels */}
                  {[0, 2000, 4000, 6000, 8000, 10000].map((value, index) => (
                    <g key={index}>
                      <text
                        x="70"
                        y={300 - (value * 250) / 10000}
                        textAnchor="end"
                        className="fill-current text-xs"
                        fill="hsl(var(--muted-foreground))"
                      >
                        ${value}
                      </text>
                    </g>
                  ))}

                  {/* Legend */}
                  <g transform="translate(500, 30)">
                    <line x1="0" y1="6" x2="20" y2="6" stroke="hsl(220 70% 50%)" strokeWidth="3" />
                    <text x="25" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Commission
                    </text>

                    <line
                      x1="0"
                      y1="26"
                      x2="20"
                      y2="26"
                      stroke="hsl(0 70% 50%)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    <text x="25" y="30" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Target
                    </text>
                  </g>
                </svg>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
