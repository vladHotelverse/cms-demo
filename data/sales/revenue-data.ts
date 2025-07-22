import type { MonthlyData, TrendData, KPIData } from '@/types/sales';

export const monthlyRevenueData: MonthlyData[] = [
  { month: "Ene", revenue: 45000, target: 50000, growth: -10 },
  { month: "Feb", revenue: 52000, target: 50000, growth: 4 },
  { month: "Mar", revenue: 48000, target: 50000, growth: -4 },
  { month: "Abr", revenue: 61000, target: 55000, growth: 10.9 },
  { month: "May", revenue: 55000, target: 55000, growth: 0 },
  { month: "Jun", revenue: 67000, target: 60000, growth: 11.7 },
];

export const revenueTrendData: TrendData[] = [
  { week: "Sem 1", revenue: 12000, target: 15000 },
  { week: "Sem 2", revenue: 15000, target: 15000 },
  { week: "Sem 3", revenue: 18000, target: 15000 },
  { week: "Sem 4", revenue: 22000, target: 15000 },
];

export const revenueKPIData: KPIData[] = [
  {
    label: "Ingresos Totales",
    value: "€67,000",
    change: "+11.7%",
    trend: "up",
  },
  {
    label: "Objetivo Mensual",
    value: "€60,000",
    change: "111.7%",
    trend: "up",
  },
  {
    label: "Promedio Diario",
    value: "€2,233",
    change: "+8.2%",
    trend: "up",
  },
  {
    label: "Mejor Día",
    value: "€3,450",
    change: "Martes",
    trend: "up",
  },
  {
    label: "Conversión",
    value: "24.5%",
    change: "+2.1%",
    trend: "up",
  },
  {
    label: "Ticket Medio",
    value: "€185",
    change: "+5.3%",
    trend: "up",
  },
  {
    label: "Clientes Nuevos",
    value: "142",
    change: "+18%",
    trend: "up",
  },
  {
    label: "Clientes Recurrentes",
    value: "78",
    change: "+12%",
    trend: "up",
  },
  {
    label: "ROI Marketing",
    value: "340%",
    change: "+45%",
    trend: "up",
  },
  {
    label: "Coste Adquisición",
    value: "€22",
    change: "-8%",
    trend: "down",
  },
];