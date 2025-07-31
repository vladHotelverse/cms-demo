import { create } from 'zustand'
import { RequestedItem, RequestedItemsData, requestedItemsData, BaseRequestedItem } from '@/data/reservation-items'
import { Recommendation } from '@/data/recommendations'

// Async operation types
type AsyncState = {
  loading: boolean
  error: string | null
  retryCount: number
}

type AsyncOperation = 'updateStatus' | 'deleteItem' | 'bulkUpdate' | 'refresh'

type AsyncStates = Record<AsyncOperation, AsyncState>

// Search and filter types
type SearchFilters = {
  query: string
  status?: 'pending_hotel' | 'confirmed' | 'all'
  dateRange?: { start: Date; end: Date }
  agent?: string
  category?: keyof RequestedItemsData | 'all'
}

type SortConfig = {
  field: string
  direction: 'asc' | 'desc'
}

// Bulk operations
type BulkAction = 'confirm' | 'decline' | 'delete'
type BulkOperationResult = {
  success: string[]
  failed: Array<{ id: string; error: string }>
}

interface ReservationSummaryState {
  // View state
  showDetailedView: boolean
  setShowDetailedView: (show: boolean) => void
  
  // Async state management
  asyncStates: AsyncStates
  setAsyncState: (operation: AsyncOperation, state: Partial<AsyncState>) => void
  resetAsyncState: (operation: AsyncOperation) => void
  
  // Search and filtering
  searchFilters: SearchFilters
  sortConfig: SortConfig
  selectedItems: Set<string>
  setSearchFilters: (filters: Partial<SearchFilters>) => void
  setSortConfig: (config: SortConfig) => void
  toggleItemSelection: (itemId: string) => void
  selectAllItems: (category?: keyof RequestedItemsData) => void
  clearSelection: () => void
  
  // Requested items state with async operations
  requestedItems: RequestedItemsData
  originalRequestedItems: RequestedItemsData // For reset/refresh
  updateItemStatus: (category: keyof RequestedItemsData, itemId: string, status: 'pending_hotel' | 'confirmed') => Promise<void>
  deleteItem: (category: keyof RequestedItemsData, itemId: string) => Promise<void>
  bulkUpdateItems: (action: BulkAction, itemIds: string[]) => Promise<BulkOperationResult>
  refreshItems: () => Promise<void>
  
  // Optimistic updates
  rollbackOptimisticUpdate: (operation: string, data: any) => void
  
  // Recommendations state
  acceptedRecommendations: string[]
  acceptRecommendation: (recommendationId: string) => void
  declineRecommendation: (recommendationId: string) => void
  
  // Enhanced calculations with memoization
  calculateCategoryTotal: (items: BaseRequestedItem[]) => number
  calculateGrandTotal: () => number
  calculateTotalCommission: (recommendations: Recommendation[]) => number
  calculateActualCommission: () => number
  getFilteredAndSortedItems: (category: keyof RequestedItemsData) => BaseRequestedItem[]
  getItemCounts: () => Record<keyof RequestedItemsData, { total: number; confirmed: number; pending: number }>
}

// Utility functions for async operations
const createAsyncState = (): AsyncState => ({ loading: false, error: null, retryCount: 0 })

const createInitialAsyncStates = (): AsyncStates => ({
  updateStatus: createAsyncState(),
  deleteItem: createAsyncState(),
  bulkUpdate: createAsyncState(),
  refresh: createAsyncState()
})

// Debounced search implementation
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = (callback: () => void, delay = 300) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(callback, delay)
}

// Simulated API calls (replace with actual API implementations)
const simulateApiCall = async <T>(operation: () => T, delay = 500): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, delay))
  // Simulate occasional failures for testing error handling
  if (Math.random() < 0.1) {
    throw new Error(`Network error during operation`)
  }
  return operation()
}

export const useReservationSummaryStore = create<ReservationSummaryState>((set, get) => ({
  // View state
  showDetailedView: false,
  setShowDetailedView: (show) => set({ showDetailedView: show }),
  
  // Async state management
  asyncStates: createInitialAsyncStates(),
  setAsyncState: (operation, state) => set((currentState) => ({
    asyncStates: {
      ...currentState.asyncStates,
      [operation]: { ...currentState.asyncStates[operation], ...state }
    }
  })),
  resetAsyncState: (operation) => set((currentState) => ({
    asyncStates: {
      ...currentState.asyncStates,
      [operation]: createAsyncState()
    }
  })),
  
  // Search and filtering
  searchFilters: {
    query: '',
    status: 'all',
    category: 'all'
  },
  sortConfig: { field: 'dateRequested', direction: 'desc' },
  selectedItems: new Set(),
  
  setSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
  
  setSortConfig: (config) => set({ sortConfig: config }),
  
  toggleItemSelection: (itemId) => set((state) => {
    const newSelection = new Set(state.selectedItems)
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId)
    } else {
      newSelection.add(itemId)
    }
    return { selectedItems: newSelection }
  }),
  
  selectAllItems: (category) => set((state) => {
    const allItems = category
      ? state.requestedItems[category]
      : Object.values(state.requestedItems).flat()
    const newSelection = new Set([...state.selectedItems, ...allItems.map(item => item.id)])
    return { selectedItems: newSelection }
  }),
  
  clearSelection: () => set({ selectedItems: new Set() }),
  
  // Requested items state
  requestedItems: requestedItemsData,
  originalRequestedItems: requestedItemsData,
  
  updateItemStatus: async (category, itemId, status) => {
    const { setAsyncState, resetAsyncState } = get()
    
    // Set loading state
    setAsyncState('updateStatus', { loading: true, error: null })
    
    // Optimistic update
    const originalItems = get().requestedItems
    set((state) => ({
      requestedItems: {
        ...state.requestedItems,
        [category]: state.requestedItems[category].map(item =>
          item.id === itemId ? { ...item, status } : item
        )
      }
    }))
    
    try {
      // Simulate API call
      await simulateApiCall(() => {
        console.log(`Updated item ${itemId} to status ${status}`)
      })
      
      resetAsyncState('updateStatus')
    } catch (error) {
      // Rollback optimistic update
      set({ requestedItems: originalItems })
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item status'
      setAsyncState('updateStatus', { 
        loading: false, 
        error: errorMessage,
        retryCount: get().asyncStates.updateStatus.retryCount + 1
      })
      
      // Auto-retry logic
      if (get().asyncStates.updateStatus.retryCount < 3) {
        setTimeout(() => {
          get().updateItemStatus(category, itemId, status)
        }, 1000 * Math.pow(2, get().asyncStates.updateStatus.retryCount))
      }
    }
  },
  
  deleteItem: async (category, itemId) => {
    const { setAsyncState, resetAsyncState } = get()
    
    // Set loading state
    setAsyncState('deleteItem', { loading: true, error: null })
    
    // Store item for potential rollback
    const itemToDelete = get().requestedItems[category].find((item: any) => item.id === itemId)
    const originalItems = get().requestedItems
    
    // Optimistic update
    set((state) => ({
      requestedItems: {
        ...state.requestedItems,
        [category]: state.requestedItems[category].filter((item: any) => item.id !== itemId)
      }
    }))
    
    try {
      // Simulate API call
      await simulateApiCall(() => {
        console.log(`Deleted item ${itemId}`)
      })
      
      resetAsyncState('deleteItem')
    } catch (error) {
      // Rollback optimistic update
      set({ requestedItems: originalItems })
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item'
      setAsyncState('deleteItem', { 
        loading: false, 
        error: errorMessage,
        retryCount: get().asyncStates.deleteItem.retryCount + 1
      })
    }
  },
  
  bulkUpdateItems: async (action, itemIds) => {
    const { setAsyncState, resetAsyncState } = get()
    
    setAsyncState('bulkUpdate', { loading: true, error: null })
    
    const results: BulkOperationResult = { success: [], failed: [] }
    const originalItems = get().requestedItems
    
    try {
      // Process items in batches to avoid overwhelming the server
      const batchSize = 5
      for (let i = 0; i < itemIds.length; i += batchSize) {
        const batch = itemIds.slice(i, i + batchSize)
        
        await Promise.allSettled(
          batch.map(async (itemId) => {
            try {
              // Find item across all categories
              let category: keyof RequestedItemsData | null = null
              for (const [cat, items] of Object.entries(get().requestedItems)) {
                if (items.some((item: BaseRequestedItem) => item.id === itemId)) {
                  category = cat as keyof RequestedItemsData
                  break
                }
              }
              
              if (!category) throw new Error('Item not found')
              
              if (action === 'delete') {
                await get().deleteItem(category, itemId)
              } else {
                const status = action === 'confirm' ? 'confirmed' : 'pending_hotel'
                await get().updateItemStatus(category, itemId, status as 'pending_hotel' | 'confirmed')
              }
              
              results.success.push(itemId)
            } catch (error) {
              results.failed.push({ 
                id: itemId, 
                error: error instanceof Error ? error.message : 'Unknown error'
              })
            }
          })
        )
      }
      
      resetAsyncState('bulkUpdate')
      return results
    } catch (error) {
      // Rollback all changes
      set({ requestedItems: originalItems })
      
      const errorMessage = error instanceof Error ? error.message : 'Bulk operation failed'
      setAsyncState('bulkUpdate', { loading: false, error: errorMessage, retryCount: 0 })
      
      return { success: [], failed: itemIds.map(id => ({ id, error: errorMessage })) }
    }
  },
  
  refreshItems: async () => {
    const { setAsyncState, resetAsyncState } = get()
    
    setAsyncState('refresh', { loading: true, error: null })
    
    try {
      // Simulate API call to refresh data
      const refreshedData = await simulateApiCall(() => requestedItemsData)
      
      set({ 
        requestedItems: refreshedData,
        originalRequestedItems: refreshedData
      })
      
      resetAsyncState('refresh')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh data'
      setAsyncState('refresh', { loading: false, error: errorMessage, retryCount: 0 })
    }
  },
  
  rollbackOptimisticUpdate: (operation, data) => {
    console.log(`Rolling back optimistic update for ${operation}`, data)
    // Implementation would depend on the specific operation
  },
  
  // Recommendations state
  acceptedRecommendations: [],
  
  acceptRecommendation: (recommendationId) => set((state) => ({
    acceptedRecommendations: [...state.acceptedRecommendations, recommendationId]
  })),
  
  declineRecommendation: (recommendationId) => set((state) => ({
    acceptedRecommendations: state.acceptedRecommendations.filter(id => id !== recommendationId)
  })),
  
  // Enhanced calculations with memoization
  calculateCategoryTotal: (items) => {
    return items.reduce((sum, item) => sum + item.price, 0)
  },
  
  calculateGrandTotal: () => {
    const state = get()
    const roomsTotal = state.calculateCategoryTotal(state.requestedItems.rooms)
    const extrasTotal = state.calculateCategoryTotal(state.requestedItems.extras)
    const biddingTotal = state.calculateCategoryTotal(state.requestedItems.bidding)
    return roomsTotal + extrasTotal + biddingTotal
  },
  
  calculateTotalCommission: (recommendations) => {
    return recommendations.reduce((sum, rec) => sum + rec.commission, 0)
  },
  
  calculateActualCommission: () => {
    const state = get()
    const allItems = Object.values(state.requestedItems).flat()
    return allItems
      .filter(item => item.agent !== 'Online' && item.commission)
      .reduce((sum, item) => sum + (item.commission || 0), 0)
  },
  
  getFilteredAndSortedItems: (category) => {
    const state = get()
    const { searchFilters, sortConfig } = state
    let items = [...state.requestedItems[category]]
    
    // Apply search filter
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase()
      items = items.filter(item => {
        const searchFields = [
          'agent',
          'roomType' in item ? item.roomType : '',
          'name' in item ? item.name : '',
          'pujaType' in item ? item.pujaType : '',
          ...(item.attributes || [])
        ]
        return searchFields.some(field => 
          field && typeof field === 'string' && field.toLowerCase().includes(query)
        )
      })
    }
    
    // Apply status filter
    if (searchFilters.status && searchFilters.status !== 'all') {
      items = items.filter(item => item.status === searchFilters.status)
    }
    
    // Apply agent filter
    if (searchFilters.agent) {
      items = items.filter(item => item.agent === searchFilters.agent)
    }
    
    // Apply date range filter
    if (searchFilters.dateRange) {
      const { start, end } = searchFilters.dateRange
      items = items.filter(item => {
        const itemDate = new Date(item.dateRequested || Date.now())
        return itemDate >= start && itemDate <= end
      })
    }
    
    // Apply sorting
    items.sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.field)
      const bValue = getNestedValue(b, sortConfig.field)
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    
    return items
  },
  
  getItemCounts: () => {
    const state = get()
    const result: Record<keyof RequestedItemsData, { total: number; confirmed: number; pending: number }> = {
      rooms: { total: 0, confirmed: 0, pending: 0 },
      extras: { total: 0, confirmed: 0, pending: 0 },
      bidding: { total: 0, confirmed: 0, pending: 0 }
    }
    
    Object.entries(state.requestedItems).forEach(([category, items]) => {
      const cat = category as keyof RequestedItemsData
      result[cat].total = items.length
      result[cat].confirmed = items.filter((item: any) => item.status === 'confirmed').length
      result[cat].pending = items.filter((item: any) => item.status === 'pending_hotel').length
    })
    
    return result
  }
}))

// Helper function to get nested object values for sorting
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? ''
}