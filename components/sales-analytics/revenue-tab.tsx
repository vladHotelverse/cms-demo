"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer } from "@/components/ui/chart"
import { TrendingUp, DollarSign, Users, Target, Award, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const monthlyData = [
  { month: "Jan", upsell: 250, abs: 180, roomNumber: 120, extras: 200, total: 750 },
  { month: "Feb", upsell: 200, abs: 220, roomNumber: 150, extras: 280, total: 850 },
  { month: "Mar", upsell: 180, abs: 160, roomNumber: 200, extras: 240, total: 780 },
  { month: "Apr", upsell: 220, abs: 190, roomNumber: 180, extras: 320, total: 910 },
  { month: "May", upsell: 280, abs: 210, roomNumber: 160, extras: 350, total: 1000 },
  { month: "Jun", upsell: 320, abs: 240, roomNumber: 190, extras: 380, total: 1130 },
]

const trendData = [
  { date: "Week 1", revenue: 8500, target: 10000 },
  { date: "Week 2", revenue: 12000, target: 10000 },
  { date: "Week 3", revenue: 9800, target: 10000 },
  { date: "Week 4", revenue: 15200, target: 10000 },
]

export function RevenueTab() {
  const { t } = useLanguage()
  
  const kpiData = [
    {
      title: t("totalRequests"),
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      description: t("vsLastMonth"),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("totalRevenue"),
      value: "$45,892",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      description: t("vsLastMonth"),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("averageRequest"),
      value: "$161.20",
      change: "-2.1%",
      trend: "down",
      icon: Target,
      description: t("vsLastMonth"),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: t("totalUpgrades"),
      value: "1,234",
      change: "+15.3%",
      trend: "up",
      icon: Award,
      description: t("vsLastMonth"),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Enhanced KPI Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`absolute inset-0 ${kpi.bgColor} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${kpi.bgColor}`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${kpi.color}`} />
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{kpi.value}</p>
                      <div className="flex items-center gap-1 sm:gap-2">
                        {kpi.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                        )}
                        <Badge
                          variant={kpi.trend === "up" ? "default" : "destructive"}
                          className="text-xs font-semibold px-1.5 py-0.5"
                        >
                          {kpi.change}
                        </Badge>
                        <span className="text-xs text-muted-foreground hidden sm:inline">{kpi.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Goal Achievement Section - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-muted-foreground">
              {t('revenueGoal')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">85%</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('targetAchievement')}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Progress</span>
                <span>$38,908 / $45,750</span>
              </div>
              <Progress value={85} className="h-2 sm:h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-muted-foreground">
              {t('upsellGoal')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">92%</div>
              <p className="text-xs sm:text-sm text-muted-foreground">{t('targetAchievement')}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Progress</span>
                <span>1,136 / 1,234</span>
              </div>
              <Progress value={92} className="h-2 sm:h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Badges - Responsive Wrapping */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Badge variant="default" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
          Room Upsells
        </Badge>
        <Badge
          variant="secondary"
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          ABS Services
        </Badge>
        <Badge
          variant="secondary"
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          Room Assignments
        </Badge>
        <Badge
          variant="secondary"
          className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          Extra Services
        </Badge>
      </div>

      {/* Charts Section - Responsive Spacing */}
      <div className="space-y-4 sm:space-y-6">
        {/* Monthly Performance Chart - Responsive */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="hidden sm:inline">Monthly Performance Breakdown</span>
              <span className="sm:hidden">Monthly Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 lg:p-6">
            <ChartContainer config={{}} className="w-full">
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
                <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Responsive Grid */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect width="800" height="400" fill="url(#grid)" />

                  {/* Responsive Axes */}
                  <line x1="80" y1="350" x2="720" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />
                  <line x1="80" y1="50" x2="80" y2="350" stroke="hsl(var(--border))" strokeWidth="1" />

                  {/* Responsive Bars */}
                  {monthlyData.map((data, index) => {
                    const x = 120 + index * 100
                    const barWidth = 60

                    const scale = 300 / 1200
                    const upsellHeight = data.upsell * scale
                    const absHeight = data.abs * scale
                    const roomHeight = data.roomNumber * scale
                    const extrasHeight = data.extras * scale

                    let currentY = 350

                    return (
                      <g key={index}>
                        {/* Stacked bars with responsive colors */}
                        <rect
                          x={x}
                          y={currentY - upsellHeight}
                          width={barWidth}
                          height={upsellHeight}
                          fill="hsl(220 70% 50%)"
                          rx="2"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                        {(currentY -= upsellHeight)}

                        <rect
                          x={x}
                          y={currentY - absHeight}
                          width={barWidth}
                          height={absHeight}
                          fill="hsl(160 60% 45%)"
                          rx="2"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                        {(currentY -= absHeight)}

                        <rect
                          x={x}
                          y={currentY - roomHeight}
                          width={barWidth}
                          height={roomHeight}
                          fill="hsl(30 70% 50%)"
                          rx="2"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                        {(currentY -= roomHeight)}

                        <rect
                          x={x}
                          y={currentY - extrasHeight}
                          width={barWidth}
                          height={extrasHeight}
                          fill="hsl(270 60% 50%)"
                          rx="2"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />

                        {/* Responsive month labels */}
                        <text
                          x={x + barWidth / 2}
                          y={370}
                          textAnchor="middle"
                          className="fill-current text-xs sm:text-sm"
                          fill="hsl(var(--foreground))"
                        >
                          {data.month}
                        </text>
                      </g>
                    )
                  })}

                  {/* Responsive Y-axis labels */}
                  {[0, 200, 400, 600, 800, 1000, 1200].map((value, index) => (
                    <g key={index}>
                      <text
                        x="70"
                        y={350 - (value * 300) / 1200}
                        textAnchor="end"
                        className="fill-current text-xs"
                        fill="hsl(var(--muted-foreground))"
                      >
                        {value}
                      </text>
                      <line
                        x1="75"
                        y1={350 - (value * 300) / 1200}
                        x2="80"
                        y2={350 - (value * 300) / 1200}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                      />
                    </g>
                  ))}

                  {/* Responsive Legend */}
                  <g transform="translate(450, 30)" className="hidden sm:block">
                    <rect x="0" y="0" width="12" height="12" fill="hsl(220 70% 50%)" rx="2" />
                    <text x="20" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Upsell
                    </text>

                    <rect x="80" y="0" width="12" height="12" fill="hsl(160 60% 45%)" rx="2" />
                    <text x="100" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      ABS
                    </text>

                    <rect x="0" y="20" width="12" height="12" fill="hsl(30 70% 50%)" rx="2" />
                    <text x="20" y="30" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Room Number
                    </text>

                    <rect x="80" y="20" width="12" height="12" fill="hsl(270 60% 50%)" rx="2" />
                    <text x="100" y="30" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Extras
                    </text>
                  </g>

                  {/* Mobile Legend */}
                  <g transform="translate(100, 30)" className="sm:hidden">
                    <rect x="0" y="0" width="8" height="8" fill="hsl(220 70% 50%)" rx="1" />
                    <text x="12" y="7" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Upsell
                    </text>

                    <rect x="60" y="0" width="8" height="8" fill="hsl(160 60% 45%)" rx="1" />
                    <text x="72" y="7" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      ABS
                    </text>

                    <rect x="0" y="15" width="8" height="8" fill="hsl(30 70% 50%)" rx="1" />
                    <text x="12" y="22" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Room
                    </text>

                    <rect x="60" y="15" width="8" height="8" fill="hsl(270 60% 50%)" rx="1" />
                    <text x="72" y="22" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Extras
                    </text>
                  </g>
                </svg>
              </div>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend Chart - Responsive */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="hidden sm:inline">Revenue vs Target Trend</span>
              <span className="sm:hidden">Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4 lg:p-6">
            <ChartContainer config={{}} className="w-full">
              <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] min-h-[280px] sm:min-h-[320px] lg:min-h-[350px]">
                <svg viewBox="0 0 800 350" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  {/* Responsive Grid */}
                  <defs>
                    <pattern id="grid2" width="40" height="35" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 35"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                    <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(220 70% 50%)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(220 70% 50%)" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <rect width="800" height="350" fill="url(#grid2)" />

                  {/* Responsive Axes */}
                  <line x1="80" y1="300" x2="720" y2="300" stroke="hsl(var(--border))" strokeWidth="1" />
                  <line x1="80" y1="50" x2="80" y2="300" stroke="hsl(var(--border))" strokeWidth="1" />

                  {/* Revenue area path */}
                  <path
                    d={`M 80 ${300 - (8500 * 250) / 16000} 
                        L ${80 + 160} ${300 - (12000 * 250) / 16000}
                        L ${80 + 320} ${300 - (9800 * 250) / 16000}
                        L ${80 + 480} ${300 - (15200 * 250) / 16000}
                        L ${80 + 480} 300
                        L ${80 + 320} 300
                        L ${80 + 160} 300
                        L 80 300 Z`}
                    fill="url(#revenueGradient)"
                  />

                  {/* Revenue line */}
                  <path
                    d={`M 80 ${300 - (8500 * 250) / 16000} 
                        L ${80 + 160} ${300 - (12000 * 250) / 16000}
                        L ${80 + 320} ${300 - (9800 * 250) / 16000}
                        L ${80 + 480} ${300 - (15200 * 250) / 16000}`}
                    stroke="hsl(220 70% 50%)"
                    strokeWidth="3"
                    fill="none"
                    className="hover:stroke-opacity-80 transition-all"
                  />

                  {/* Target line (dashed) */}
                  <path
                    d={`M 80 ${300 - (10000 * 250) / 16000} L ${80 + 480} ${300 - (10000 * 250) / 16000}`}
                    stroke="hsl(0 70% 50%)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                  />

                  {/* Responsive data points */}
                  {trendData.map((data, index) => (
                    <circle
                      key={index}
                      cx={80 + index * 160}
                      cy={300 - (data.revenue * 250) / 16000}
                      r="4"
                      fill="hsl(220 70% 50%)"
                      stroke="white"
                      strokeWidth="2"
                      className="hover:r-6 transition-all cursor-pointer"
                    />
                  ))}

                  {/* Responsive X-axis labels */}
                  {trendData.map((data, index) => (
                    <text
                      key={index}
                      x={80 + index * 160}
                      y="320"
                      textAnchor="middle"
                      className="fill-current text-xs sm:text-sm"
                      fill="hsl(var(--foreground))"
                    >
                      <tspan className="hidden sm:inline">{data.date}</tspan>
                      <tspan className="sm:hidden">W{index + 1}</tspan>
                    </text>
                  ))}

                  {/* Responsive Y-axis labels */}
                  {[0, 4000, 8000, 12000, 16000].map((value, index) => (
                    <g key={index}>
                      <text
                        x="70"
                        y={300 - (value * 250) / 16000}
                        textAnchor="end"
                        className="fill-current text-xs"
                        fill="hsl(var(--muted-foreground))"
                      >
                        <tspan className="hidden sm:inline">${value}</tspan>
                        <tspan className="sm:hidden">${value / 1000}k</tspan>
                      </text>
                    </g>
                  ))}

                  {/* Responsive Legend */}
                  <g transform="translate(500, 30)" className="hidden sm:block">
                    <line x1="0" y1="6" x2="20" y2="6" stroke="hsl(220 70% 50%)" strokeWidth="3" />
                    <text x="25" y="10" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Revenue
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

                  {/* Mobile Legend */}
                  <g transform="translate(100, 30)" className="sm:hidden">
                    <line x1="0" y1="4" x2="15" y2="4" stroke="hsl(220 70% 50%)" strokeWidth="2" />
                    <text x="20" y="7" className="fill-current text-xs" fill="hsl(var(--foreground))">
                      Revenue
                    </text>

                    <line
                      x1="0"
                      y1="18"
                      x2="15"
                      y2="18"
                      stroke="hsl(0 70% 50%)"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                    />
                    <text x="20" y="21" className="fill-current text-xs" fill="hsl(var(--foreground))">
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
