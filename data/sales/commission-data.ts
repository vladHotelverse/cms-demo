import type { AgentPerformance, TrendData, KPIData } from '@/types/sales';

export const agentPerformanceData: AgentPerformance[] = [
  {
    name: "María García",
    totalCommission: 2450.50,
    totalSales: 45000,
    conversionRate: "68%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Juan López", 
    totalCommission: 2180.25,
    totalSales: 38500,
    conversionRate: "62%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Ana Martínez",
    totalCommission: 1950.75,
    totalSales: 35200,
    conversionRate: "59%", 
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Carlos Rodríguez",
    totalCommission: 1820.00,
    totalSales: 32800,
    conversionRate: "57%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Laura Sánchez",
    totalCommission: 1675.25,
    totalSales: 29500,
    conversionRate: "54%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Miguel Torres",
    totalCommission: 1540.50,
    totalSales: 27200,
    conversionRate: "51%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Elena Ruiz",
    totalCommission: 1420.75,
    totalSales: 25100,
    conversionRate: "48%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "David Moreno",
    totalCommission: 1285.25,
    totalSales: 22800,
    conversionRate: "45%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Carmen Jiménez",
    totalCommission: 1150.00,
    totalSales: 20500,
    conversionRate: "42%",
    avatar: "/placeholder-user.jpg",
  },
  {
    name: "Antonio Fernández", 
    totalCommission: 980.50,
    totalSales: 17800,
    conversionRate: "38%",
    avatar: "/placeholder-user.jpg",
  },
];

export const commissionTrendData: TrendData[] = [
  { week: "Enero", revenue: 12500, target: 15000 },
  { week: "Febrero", revenue: 18200, target: 15000 },
  { week: "Marzo", revenue: 22100, target: 18000 },
  { week: "Abril", revenue: 25800, target: 20000 },
  { week: "Mayo", revenue: 19500, target: 20000 },
  { week: "Junio", revenue: 28300, target: 22000 },
];

export const commissionKPIData: KPIData[] = [
  {
    label: "Comisiones Totales",
    value: "€18,457",
    change: "+15.8%",
    trend: "up",
  },
  {
    label: "Objetivo Mensual",
    value: "€20,000",
    change: "92.3%",
    trend: "up",
  },
  {
    label: "Promedio por Agente",
    value: "€1,846",
    change: "+12.4%",
    trend: "up",
  },
  {
    label: "Top Performer",
    value: "María García",
    change: "€2,451",
    trend: "up",
  },
  {
    label: "Tasa Conversión Media",
    value: "54.8%",
    change: "+3.2%",
    trend: "up",
  },
  {
    label: "Ventas Totales",
    value: "€324,500",
    change: "+18.7%",
    trend: "up",
  },
  {
    label: "Nuevos Clientes",
    value: "156",
    change: "+22%",
    trend: "up",
  },
  {
    label: "Retención",
    value: "87%",
    change: "+5%",
    trend: "up",
  },
  {
    label: "Ticket Medio",
    value: "€195",
    change: "+8.3%",
    trend: "up",
  },
  {
    label: "Margen Medio",
    value: "28.5%",
    change: "+2.1%",
    trend: "up",
  },
];