export interface MonthlyData {
  month: string;
  revenue: number;
  target: number;
  growth: number;
}

export interface TrendData {
  week: string;
  revenue: number;
  target: number;
}

export interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon?: string;
}

export interface AgentPerformance {
  name: string;
  totalCommission: number;
  totalSales: number;
  conversionRate: string;
  avatar?: string;
}

export interface WeeklyRequestData {
  status: string;
  count: number;
  color: string;
}

export interface ManagementData {
  label: string;
  value: number;
  color: string;
}