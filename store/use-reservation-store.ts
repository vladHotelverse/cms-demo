import { create } from 'zustand';
import type { Reservation, ReservationTab } from '@/types/reservation';
import { mockReservations } from '@/data/reservations/mock-reservations';

interface ReservationStore {
  // State
  reservations: Reservation[];
  openTabs: ReservationTab[];
  activeTab: string;
  searchTerm: string;
  isInReservationMode: boolean;
  alert: { type: 'success' | 'error'; message: string } | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setReservations: (reservations: Reservation[]) => void;
  addTab: (tab: ReservationTab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  setSearchTerm: (term: string) => void;
  setIsInReservationMode: (isInMode: boolean) => void;
  showAlert: (type: 'success' | 'error', message: string) => void;
  clearAlert: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed getters
  getFilteredReservations: () => Reservation[];
  getTotalCommission: () => string;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  // Initial state
  reservations: mockReservations,
  openTabs: [],
  activeTab: 'front-desk-upsell',
  searchTerm: '',
  isInReservationMode: false,
  alert: null,
  isLoading: false,
  error: null,

  // Actions
  setReservations: (reservations) => set({ reservations }),
  
  addTab: (tab) => set((state) => ({
    openTabs: [...state.openTabs, tab],
    activeTab: tab.id,
    isInReservationMode: true
  })),
  
  removeTab: (tabId) => set((state) => {
    const newTabs = state.openTabs.filter(tab => tab.id !== tabId);
    const shouldResetMode = newTabs.length === 0;
    let newActiveTab = state.activeTab;
    
    if (state.activeTab === tabId) {
      newActiveTab = newTabs.length > 0 
        ? newTabs[newTabs.length - 1].id 
        : 'front-desk-upsell';
    }
    
    return {
      openTabs: newTabs,
      activeTab: newActiveTab,
      isInReservationMode: !shouldResetMode
    };
  }),
  
  setActiveTab: (tabId) => set({ activeTab: tabId }),
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setIsInReservationMode: (isInMode) => set({ isInReservationMode: isInMode }),
  
  showAlert: (type, message) => {
    set({ alert: { type, message } });
    // Auto-clear alert after 4 seconds
    setTimeout(() => {
      get().clearAlert();
    }, 4000);
  },
  
  clearAlert: () => set({ alert: null }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // Computed getters
  getFilteredReservations: () => {
    const { reservations, searchTerm } = get();
    if (!searchTerm) return reservations;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return reservations.filter(
      (reservation) =>
        reservation.name.toLowerCase().includes(lowerSearchTerm) ||
        reservation.email.toLowerCase().includes(lowerSearchTerm) ||
        reservation.locator.toLowerCase().includes(lowerSearchTerm)
    );
  },
  
  getTotalCommission: () => {
    const { reservations } = get();
    const total = reservations
      .filter(res => res.extras.includes('reservados'))
      .reduce((sum, res) => {
        const itemCount = parseInt(res.extras.split(' ')[0]) || 0;
        return sum + (itemCount * 1.5); // 1.5€ commission per extra item
      }, 0);
    return total.toFixed(2);
  }
}));