import { create } from 'zustand';
import type { 
  MonthlyData, 
  TrendData, 
  KPIData, 
  AgentPerformance, 
  WeeklyRequestData,
  ManagementData 
} from '@/types/sales';
import { 
  monthlyRevenueData,
  revenueTrendData,
  revenueKPIData,
  weeklyRequestData,
  managementKPIData,
  roomManagementData,
  extrasManagementData,
  agentPerformanceData,
  commissionTrendData,
  commissionKPIData
} from '@/data';

interface SalesStore {
  // Revenue data
  monthlyRevenue: MonthlyData[];
  revenueTrend: TrendData[];
  revenueKPIs: KPIData[];
  
  // Management data  
  weeklyRequests: WeeklyRequestData[];
  managementKPIs: KPIData[];
  roomManagement: ManagementData[];
  extrasManagement: ManagementData[];
  
  // Commission data
  agentPerformance: AgentPerformance[];
  commissionTrend: TrendData[];
  commissionKPIs: KPIData[];
  
  // UI State
  selectedPeriod: 'week' | 'month' | 'quarter' | 'year';
  
  // Actions
  setSelectedPeriod: (period: 'week' | 'month' | 'quarter' | 'year') => void;
  updateRevenueData: (data: MonthlyData[]) => void;
  updateAgentPerformance: (data: AgentPerformance[]) => void;
  
  // Computed getters
  getTotalRevenue: () => number;
  getTopPerformer: () => AgentPerformance | null;
  getAverageConversion: () => string;
}

export const useSalesStore = create<SalesStore>((set, get) => ({
  // Initial state
  monthlyRevenue: monthlyRevenueData,
  revenueTrend: revenueTrendData,
  revenueKPIs: revenueKPIData,
  weeklyRequests: weeklyRequestData,
  managementKPIs: managementKPIData,
  roomManagement: roomManagementData,
  extrasManagement: extrasManagementData,
  agentPerformance: agentPerformanceData,
  commissionTrend: commissionTrendData,
  commissionKPIs: commissionKPIData,
  selectedPeriod: 'month',
  
  // Actions
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  
  updateRevenueData: (data) => set({ monthlyRevenue: data }),
  
  updateAgentPerformance: (data) => set({ agentPerformance: data }),
  
  // Computed getters
  getTotalRevenue: () => {
    const { monthlyRevenue } = get();
    return monthlyRevenue.reduce((total, month) => total + month.revenue, 0);
  },
  
  getTopPerformer: () => {
    const { agentPerformance } = get();
    if (agentPerformance.length === 0) return null;
    return agentPerformance.reduce((top, agent) => 
      agent.totalCommission > top.totalCommission ? agent : top
    );
  },
  
  getAverageConversion: () => {
    const { agentPerformance } = get();
    if (agentPerformance.length === 0) return '0%';
    
    const totalConversion = agentPerformance.reduce((sum, agent) => {
      const rate = parseFloat(agent.conversionRate.replace('%', ''));
      return sum + rate;
    }, 0);
    
    const average = totalConversion / agentPerformance.length;
    return `${average.toFixed(1)}%`;
  }
}));