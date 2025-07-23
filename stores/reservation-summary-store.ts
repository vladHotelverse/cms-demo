import { create } from 'zustand'
import { RequestedItem, RequestedItemsData } from '@/data/reservation-items'
import { Recommendation } from '@/data/recommendations'

interface ReservationSummaryState {
  // View state
  showDetailedView: boolean
  setShowDetailedView: (show: boolean) => void
  
  // Requested items state
  requestedItems: RequestedItemsData
  updateItemStatus: (category: keyof RequestedItemsData, itemId: string, status: 'pending_hotel' | 'confirmed') => void
  deleteItem: (category: keyof RequestedItemsData, itemId: string) => void
  
  // Recommendations state
  acceptedRecommendations: string[]
  acceptRecommendation: (recommendationId: string) => void
  declineRecommendation: (recommendationId: string) => void
  
  // Calculations
  calculateCategoryTotal: (items: RequestedItem[]) => number
  calculateGrandTotal: () => number
  calculateTotalCommission: (recommendations: Recommendation[]) => number
}

export const useReservationSummaryStore = create<ReservationSummaryState>((set, get) => ({
  // View state
  showDetailedView: false,
  setShowDetailedView: (show) => set({ showDetailedView: show }),
  
  // Requested items state
  requestedItems: {
    extras: [],
    upsell: [],
    atributos: []
  },
  
  updateItemStatus: (category, itemId, status) => set((state) => ({
    requestedItems: {
      ...state.requestedItems,
      [category]: state.requestedItems[category].map(item =>
        item.id === itemId ? { ...item, status } : item
      )
    }
  })),
  
  deleteItem: (category, itemId) => set((state) => ({
    requestedItems: {
      ...state.requestedItems,
      [category]: state.requestedItems[category].filter(item => item.id !== itemId)
    }
  })),
  
  // Recommendations state
  acceptedRecommendations: [],
  
  acceptRecommendation: (recommendationId) => set((state) => ({
    acceptedRecommendations: [...state.acceptedRecommendations, recommendationId]
  })),
  
  declineRecommendation: (recommendationId) => set((state) => ({
    acceptedRecommendations: state.acceptedRecommendations.filter(id => id !== recommendationId)
  })),
  
  // Calculations
  calculateCategoryTotal: (items) => {
    return items.reduce((sum, item) => sum + item.price, 0)
  },
  
  calculateGrandTotal: () => {
    const state = get()
    const extrasTotal = state.calculateCategoryTotal(state.requestedItems.extras)
    const upsellTotal = state.calculateCategoryTotal(state.requestedItems.upsell)
    const atributosTotal = state.calculateCategoryTotal(state.requestedItems.atributos)
    return extrasTotal + upsellTotal + atributosTotal
  },
  
  calculateTotalCommission: (recommendations) => {
    return recommendations.reduce((sum, rec) => sum + rec.commission, 0)
  }
}))