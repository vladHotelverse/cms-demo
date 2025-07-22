import type { WeeklyRequestData, KPIData, ManagementData } from '@/types/sales';

export const weeklyRequestData: WeeklyRequestData[] = [
  { status: "Aprobadas", count: 45, color: "#22c55e" },
  { status: "Pendientes", count: 12, color: "#f59e0b" },
  { status: "Rechazadas", count: 8, color: "#ef4444" },
  { status: "En Revisión", count: 5, color: "#3b82f6" },
];

export const managementKPIData: KPIData[] = [
  {
    label: "Solicitudes Totales",
    value: "70",
    change: "+12%",
    trend: "up",
  },
  {
    label: "Tasa Aprobación",
    value: "64.3%",
    change: "+5.2%",
    trend: "up",
  },
  {
    label: "Tiempo Medio Respuesta",
    value: "2.4h",
    change: "-15%",
    trend: "down",
  },
  {
    label: "Solicitudes Hoy",
    value: "18",
    change: "+8",
    trend: "up",
  },
  {
    label: "Agentes Activos",
    value: "12",
    change: "+2",
    trend: "up",
  },
  {
    label: "Satisfacción Cliente",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
  },
  {
    label: "Escalaciones",
    value: "3",
    change: "-40%",
    trend: "down",
  },
  {
    label: "Reaberturas",
    value: "2",
    change: "-60%",
    trend: "down",
  },
  {
    label: "SLA Cumplimiento",
    value: "94%",
    change: "+3%",
    trend: "up",
  },
  {
    label: "Productividad Media",
    value: "8.2",
    change: "+12%",
    trend: "up",
  },
];

export const roomManagementData: ManagementData[] = [
  { label: "Upgrades", value: 65, color: "#3b82f6" },
  { label: "Cambios", value: 20, color: "#10b981" },
  { label: "Cancelaciones", value: 15, color: "#f59e0b" },
];

export const extrasManagementData: ManagementData[] = [
  { label: "Spa", value: 45, color: "#8b5cf6" },
  { label: "Restaurante", value: 30, color: "#f59e0b" },
  { label: "Actividades", value: 25, color: "#06b6d4" },
];