import { create } from 'zustand'
import type { RoomOption } from '@/components/features/booking-system/ABS_RoomSelectionCarousel/types'
import type { SelectedCustomizations } from '@/components/features/booking-system/ABS_RoomCustomization/types'
import type { OfferData } from '@/components/features/booking-system/ABS_SpecialOffers/types'
import { determineRoomScenario, validateRoomConfiguration, type AllowedRoomType, type RoomSelectionScenario } from '@/data/reservation-items'

// Async operation types
export interface AsyncOperation {
  id: string
  type: 'room_add' | 'room_remove' | 'extra_add' | 'extra_remove' | 'customization_update' | 'batch_operation'
  status: 'pending' | 'success' | 'error' | 'cancelled'
  data: any
  timestamp: number
  retryCount?: number
}

// Error handling types
export interface SelectionError {
  id: string
  type: 'validation' | 'conflict' | 'network' | 'duplicate' | 'quota_exceeded'
  message: string
  details?: any
  timestamp: number
  recoverable: boolean
}

// Notification types
export interface UserNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: number
  duration?: number
}

// Cache types for expensive calculations
export interface CacheEntry<T> {
  value: T
  timestamp: number
  dependencies: string[] // Track what this cache depends on
  ttl: number
}

// Batch operation types
export interface BatchOperation {
  id: string
  operations: {
    type: 'add_room' | 'remove_room' | 'add_extra' | 'remove_extra' | 'update_customization'
    data: any
  }[]
  timestamp: number
}

// Define selection item types
export interface SelectedRoom {
  id: string
  roomType: string
  price: number
  originalRoomType?: string
  showUpgradeArrow?: boolean
  showKeyIcon?: boolean
  showAlternatives?: boolean
  showAttributes?: boolean
  selectionScenario?: 'upgrade_only' | 'choose_room_only' | 'choose_room_upgrade' | 'attribute_selection' | 'upgrade_with_attributes'
  agent: string
  status: 'pending_hotel' | 'confirmed'
  dateRequested: string
  checkIn: string
  checkOut: string
  nights?: number
  roomNumber?: string
  hasKey?: boolean
  attributes?: string[]
  alternatives?: string[]
  customizations?: SelectedCustomizations
  customizationTotal?: number
}

export interface SelectedExtra {
  id: string
  name: string
  price: number
  units: number
  type: string
  agent: string
  status: 'pending_hotel' | 'confirmed'
  dateRequested: string
  serviceDate: string | string[]
  commission?: number
}

export interface UserSelectionsState {
  // Selected items
  selectedRooms: SelectedRoom[]
  selectedExtras: SelectedExtra[]
  
  // Async operations tracking
  pendingOperations: AsyncOperation[]
  errors: SelectionError[]
  notifications: UserNotification[]
  isLoading: boolean
  
  // Actions for room selection with async support
  addRoom: (room: RoomOption, reservationInfo: {
    checkIn: string
    checkOut: string
    agent?: string
    roomNumber?: string
    originalRoomType?: string
  }) => Promise<{ success: boolean; errors?: SelectionError[] }>
  addRoomFromCustomization: (customizations: SelectedCustomizations, reservationInfo: {
    checkIn: string
    checkOut: string
    agent?: string
    roomNumber?: string
    originalRoomType?: string
  }) => Promise<{ success: boolean; errors?: SelectionError[] }>
  removeRoom: (roomId: string) => Promise<{ success: boolean; errors?: SelectionError[] }>
  updateRoomCustomizations: (roomId: string, customizations: SelectedCustomizations, total: number) => Promise<{ success: boolean; errors?: SelectionError[] }>
  
  // Actions for extras selection with async support
  addExtra: (offer: OfferData, agent?: string) => Promise<{ success: boolean; errors?: SelectionError[] }>
  removeExtra: (extraId: string) => Promise<{ success: boolean; errors?: SelectionError[] }>
  
  // Batch operations
  executeBatchOperations: (operations: BatchOperation['operations']) => Promise<{ success: boolean; errors?: SelectionError[] }>
  
  // Bulk actions
  clearAllSelections: () => void
  clearRooms: () => void
  clearExtras: () => void
  
  // Status management
  updateItemStatus: (type: 'room' | 'extra', itemId: string, status: 'pending_hotel' | 'confirmed') => void
  
  // Error management
  clearError: (errorId: string) => void
  clearAllErrors: () => void
  retryFailedOperation: (operationId: string) => Promise<{ success: boolean; errors?: SelectionError[] }>
  
  // Optimistic updates with rollback
  performOptimisticUpdate: <T>(updater: (state: UserSelectionsState) => Partial<UserSelectionsState>, operation: () => Promise<T>) => Promise<T>
  
  // Utilities with caching
  isRoomSelected: (roomType: string) => boolean
  isExtraSelected: (offerName: string) => boolean
  getTotalPrice: () => number
  getItemCounts: () => { rooms: number; extras: number; total: number }
  getSmartRecommendations: () => { rooms: RoomOption[]; extras: OfferData[] }
  validateSelections: () => SelectionError[]
  
  // Performance utilities
  preloadCalculations: () => void
  clearCache: () => void
}

// Helper to generate unique IDs with better entropy
const generateId = (prefix: string) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  const performance = typeof window !== 'undefined' && window.performance ? window.performance.now().toString(36) : ''
  return `${prefix}_${timestamp}_${random}_${performance}`
}

// Debounce utility for rapid operations
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } => {
  let timeout: NodeJS.Timeout | null = null
  let lastArgs: Parameters<T> | null = null
  
  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(...args)
      timeout = null
      lastArgs = null
    }, wait)
  }) as T & { cancel: () => void }
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
      lastArgs = null
    }
  }
  
  return debounced
}

// Cache with TTL and dependency tracking
class SmartCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes
  
  set(key: string, value: T, dependencies: string[] = [], ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      dependencies,
      ttl
    })
    
    // Auto-cleanup after TTL
    setTimeout(() => {
      this.cache.delete(key)
    }, ttl)
  }
  
  get(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.value
  }
  
  invalidateByDependency(dependency: string) {
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (entry.dependencies.includes(dependency)) {
        this.cache.delete(key)
      }
    }
  }
  
  clear() {
    this.cache.clear()
  }
}

// Room type mapping utility
const mapToAllowedRoomType = (roomType: string): AllowedRoomType => {
  const type = roomType.toLowerCase()
  
  if (type.includes('rock suite diamond')) {
    return 'Rock Suite Diamond'
  } else if (type.includes('rock suite')) {
    return 'Rock Suite'
  } else if (type.includes('80s suite')) {
    return '80s Suite'
  } else if (type.includes('deluxe swim-up')) {
    return 'Deluxe Swim-up'
  } else if (type.includes('deluxe gold')) {
    return 'Deluxe Gold'
  } else if (type.includes('suite') || type.includes('luxury') || type.includes('premium')) {
    return 'Junior Suite'
  } else if (type.includes('deluxe') || type.includes('superior') || type.includes('gold')) {
    return 'Doble Deluxe'
  } else {
    return 'Doble'
  }
}

// Room merging logic for upgrades and customizations
const mergeRoomUpgradeWithCustomizations = (
  existingRoom: SelectedRoom,
  upgradeRoom: RoomOption,
  reservationInfo: any
): SelectedRoom => {
  // Get customization attributes (all of them - they're important)
  const customizationAttributes = existingRoom.customizations 
    ? Object.values(existingRoom.customizations).filter((c): c is NonNullable<typeof c> => c !== undefined).map(c => c.label)
    : []
  
  // Get upgrade room amenities (limit to 3 most important)
  const upgradeAmenities = (upgradeRoom.amenities || []).slice(0, 3)
  
  // Combine attributes: customizations (all) + upgrade amenities (top 3)
  const combinedAttributes = [
    ...customizationAttributes,  // Keep all customization attributes
    ...upgradeAmenities         // Add top 3 upgrade amenities
  ]
  
  // Create base data for scenario determination
  const baseRoomData = {
    originalRoomType: existingRoom.roomType, // Show this is an upgrade
    hasKey: true, // Keep room assignment but with alternatives
    attributes: combinedAttributes,
    alternatives: ['Alternative rooms available'] // Provide alternatives for room assignment
  }
  
  // Use proper scenario determination to get consistent flags
  const roomScenario = determineRoomScenario(baseRoomData)
  
  const mergedRoom = {
    ...existingRoom,
    roomType: mapToAllowedRoomType((upgradeRoom.roomType || upgradeRoom.name || 'Standard Room')),
    originalRoomType: existingRoom.roomType, // Preserve original for upgrade arrow
    price: upgradeRoom.price || 0,
    ...roomScenario, // Apply proper scenario flags (should be upgrade_with_attributes)
    attributes: combinedAttributes,
    // Keep room assignment with alternatives to avoid validation conflicts
    hasKey: true, // Keep room assignment
    roomNumber: existingRoom.roomNumber, // Keep existing room number
    alternatives: baseRoomData.alternatives, // Provide alternatives
    // Keep existing customizations and totals
    customizations: existingRoom.customizations,
    customizationTotal: existingRoom.customizationTotal
  }
  
  // Validation safety check - ensure merged room passes validation
  const validation = validateRoomConfiguration(mergedRoom as any)
  if (!validation.isValid) {
    console.warn('Merged room validation failed:', validation.errors)
    // Fallback: remove problematic flags to ensure validation passes
    mergedRoom.showKeyIcon = false
    mergedRoom.hasKey = false
    mergedRoom.roomNumber = undefined
  }
  
  return mergedRoom
}

const mergeCustomizationsWithUpgrade = (
  existingRoom: SelectedRoom,
  customizations: SelectedCustomizations,
  customizationTotal: number
): SelectedRoom => {
  // Convert new customizations to attributes
  const newAttributes = Object.values(customizations).filter((c): c is NonNullable<typeof c> => c !== undefined).map(c => c.label)
  
  return {
    ...existingRoom,
    // Keep upgrade room type and properties
    showUpgradeArrow: true, // Keep upgrade arrow
    showAttributes: true,   // Show attributes too
    attributes: [
      ...(existingRoom.attributes || []), 
      ...newAttributes
    ],
    selectionScenario: 'upgrade_with_attributes' as RoomSelectionScenario,
    // Add/update customizations
    customizations: {
      ...(existingRoom.customizations || {}),
      ...customizations
    },
    customizationTotal: (existingRoom.customizationTotal || 0) + customizationTotal
  }
}

const detectExtraConflicts = (existingExtras: SelectedExtra[], newExtra: OfferData): SelectionError[] => {
  const errors: SelectionError[] = []
  
  // Check for duplicate extras
  const duplicateExtra = existingExtras.find(e => e.name === newExtra.name)
  if (duplicateExtra) {
    errors.push({
      id: generateId('error'),
      type: 'duplicate',
      message: `Extra service "${newExtra.name}" is already selected`,
      details: JSON.stringify({ existingExtra: duplicateExtra, newExtra }),
      timestamp: Date.now(),
      recoverable: true
    })
  }
  
  // Check for conflicting services (e.g., early check-in vs late checkout on same day)
  const conflictingServices = {
    'Early Check-in': ['Late Check-out'],
    'Late Check-out': ['Early Check-in'],
    'Private Spa Session': ['Group Spa Package'],
    'Group Spa Package': ['Private Spa Session']
  }
  
  const conflicts = conflictingServices[newExtra.name as keyof typeof conflictingServices]
  if (conflicts) {
    const conflictingExtra = existingExtras.find(e => conflicts.includes(e.name))
    if (conflictingExtra) {
      errors.push({
        id: generateId('error'),
        type: 'conflict',
        message: `"${newExtra.name}" conflicts with "${conflictingExtra.name}"`,
        details: JSON.stringify({ conflictingExtra, newExtra, reason: 'service_conflict' }),
        timestamp: Date.now(),
        recoverable: true
      })
    }
  }
  
  return errors
}

// Smart pricing calculator with dependency tracking
const calculateSmartTotal = (rooms: SelectedRoom[], extras: SelectedExtra[]): number => {
  let total = 0
  
  // Room pricing with customizations
  for (const room of rooms) {
    total += room.price
    if (room.customizationTotal) {
      total += room.customizationTotal
    }
  }
  
  // Extra pricing with dynamic adjustments
  for (const extra of extras) {
    let extraPrice = extra.price
    
    // Apply bulk discounts for multiple services
    if (extras.length >= 3) {
      extraPrice *= 0.95 // 5% bulk discount
    }
    
    // Apply group discounts for multi-unit services
    if (extra.units > 2) {
      extraPrice *= 0.9 // 10% group discount
    }
    
    total += extraPrice
  }
  
  return Math.round(total * 100) / 100 // Round to 2 decimal places
}

// Global cache instance
const globalCache = new SmartCache<any>()

// Debounced functions for performance
const debouncedCacheInvalidation = debounce((dependency: string) => {
  globalCache.invalidateByDependency(dependency)
}, 100)

export const useUserSelectionsStore = create<UserSelectionsState>()((set, get) => ({
      // Initial state
      selectedRooms: [],
      selectedExtras: [],
      pendingOperations: [],
      errors: [],
      notifications: [],
      isLoading: false,
      
      // Async room actions with conflict detection and optimistic updates
      addRoom: async (room, reservationInfo) => {
        const operationId = generateId('op')
        
        // Add pending operation
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: operationId,
            type: 'room_add',
            status: 'pending',
            data: { room, reservationInfo },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          const currentState = get()
          
          // Use a fallback for roomName to avoid errors with incomplete data
          const roomName = (room as any).roomType || (room as any).name || 'Standard Room';

          // Determine if this is a real upgrade (not just a direct selection)
          // A real upgrade must have existing rooms AND different room types
          const hasExistingRoom = currentState.selectedRooms.length > 0
          const isUpgrade = hasExistingRoom && 
            reservationInfo.originalRoomType && 
            reservationInfo.originalRoomType !== roomName
          
          // Get existing room for potential merge
          const existingRoom = hasExistingRoom ? currentState.selectedRooms[0] : null
          
          // Check if we need to merge with existing customizations
          const shouldMerge = existingRoom && 
            existingRoom.customizations && 
            Object.keys(existingRoom.customizations).length > 0 &&
            isUpgrade
          
          if (shouldMerge && existingRoom) {
            // Merge room upgrade with existing customizations
            const mergedRoom = mergeRoomUpgradeWithCustomizations(existingRoom, room, reservationInfo)
            
            set(() => ({
              selectedRooms: [mergedRoom]
            }))
            
            // Add success notification
            const successNotification: UserNotification = {
              id: generateId('notification'),
              type: 'success',
              message: 'Room upgrade merged with customizations',
              timestamp: Date.now(),
              duration: 5000
            }
            
            set(state => ({
              notifications: [...state.notifications, successNotification]
            }))
            
            set(state => ({
              pendingOperations: state.pendingOperations.map(op => 
                op.id === operationId ? { ...op, status: 'success' } : op
              ),
              isLoading: false
            }))
            
            return { success: true }
          } else if (hasExistingRoom) {
            // Clear existing rooms for regular replacement
            set(() => ({
              selectedRooms: []
            }))
          }

          // Calculate nights from check-in and check-out dates
          const checkInDate = new Date(reservationInfo.checkIn)
          const checkOutDate = new Date(reservationInfo.checkOut)
          const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
          const nights = Math.max(1, daysDiff) // Ensure at least 1 night, handle same-day bookings

          // If this is an upgrade, try to preserve the room number from the previous selection
          const roomNumber = isUpgrade && existingRoom ? existingRoom.roomNumber : reservationInfo.roomNumber;

          // Create base room data
          const baseRoomData = {
            originalRoomType: isUpgrade ? (reservationInfo.originalRoomType as AllowedRoomType || null) : null,
            hasKey: !!roomNumber,
            attributes: room.amenities ? room.amenities.slice(0, 3) : [],
            alternatives: ['101', '102', '103', '104', '105']
          }

          // Determine room scenario and UI flags
          const roomScenario = determineRoomScenario(baseRoomData)
          
          // Perform optimistic update with all required fields for table
          const newRoom: SelectedRoom = {
            id: generateId('room'),
            roomType: mapToAllowedRoomType(roomName),
            price: room.price || 0,
            originalRoomType: baseRoomData.originalRoomType || undefined,
            ...roomScenario, // Apply determined scenario flags
            agent: 'Maria García', // Use Maria García as agent
            status: 'confirmed',
            dateRequested: new Date().toLocaleDateString('en-GB'),
            checkIn: reservationInfo.checkIn,
            checkOut: reservationInfo.checkOut,
            nights, // Add nights field required by table
            roomNumber,
            hasKey: baseRoomData.hasKey,
            attributes: baseRoomData.attributes,
            alternatives: baseRoomData.alternatives,
            // Add other fields that might be required by RoomItem interface
            customizations: undefined,
            customizationTotal: 0
          }
          
          set(state => ({
            selectedRooms: [...state.selectedRooms, newRoom],
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'success' } : op
            ),
            isLoading: false
          }))
          
          // Invalidate cache
          debouncedCacheInvalidation('rooms')
          debouncedCacheInvalidation('totals')
          
          // Clean up completed operation after delay
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
            }))
          }, 5000)
          
          return { success: true }
          
        } catch (error) {
          const selectionError: SelectionError = {
            id: generateId('error'),
            type: 'network',
            message: 'Failed to add room selection',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, selectionError],
            isLoading: false
          }))
          
          return { success: false, errors: [selectionError] }
        }
      },
      
      removeRoom: async (roomId) => {
        const operationId = generateId('op')
        
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: operationId,
            type: 'room_remove',
            status: 'pending',
            data: { roomId },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          // Store original state for potential rollback
          const originalRooms = get().selectedRooms
          const roomToRemove = originalRooms.find(r => r.id === roomId)
          
          if (!roomToRemove) {
            throw new Error('Room not found')
          }
          
          // Optimistic update
          set(state => ({
            selectedRooms: state.selectedRooms.filter(room => room.id !== roomId),
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'success' } : op
            ),
            isLoading: false
          }))
          
          // Invalidate cache
          debouncedCacheInvalidation('rooms')
          debouncedCacheInvalidation('totals')
          
          // Clean up operation
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
            }))
          }, 5000)
          
          return { success: true }
          
        } catch (error) {
          const selectionError: SelectionError = {
            id: generateId('error'),
            type: 'network',
            message: 'Failed to remove room selection',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, selectionError],
            isLoading: false
          }))
          
          return { success: false, errors: [selectionError] }
        }
      },
      
      updateRoomCustomizations: async (roomId, customizations, total) => {
        const operationId = generateId('op')
        
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: operationId,
            type: 'customization_update',
            status: 'pending',
            data: { roomId, customizations, total },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          // Validate room exists
          const currentRoom = get().selectedRooms.find(r => r.id === roomId)
          if (!currentRoom) {
            throw new Error('Room not found for customization update')
          }
          
          // Allow customizations with upgrades - merge functionality handles this
          const hasCustomizations = Object.keys(customizations).length > 0
          
          // Update room with customizations and apply attribute_selection scenario if needed
          const updatedCustomizations = Object.keys(customizations).length > 0 ? customizations : undefined
          const customizationAttributes = updatedCustomizations 
            ? Object.values(updatedCustomizations).filter((c): c is NonNullable<typeof c> => c !== undefined).map(c => c.label)
            : []
          
          // Determine new room scenario based on customizations
          const baseRoomData = {
            originalRoomType: currentRoom.originalRoomType || null,
            hasKey: currentRoom.hasKey || false,
            attributes: customizationAttributes,
            alternatives: customizationAttributes.length > 0 ? ['Various rooms available'] : []
          }
          
          const roomScenario = determineRoomScenario(baseRoomData)
          
          // Optimistic update
          set(state => ({
            selectedRooms: state.selectedRooms.map(room =>
              room.id === roomId
                ? { 
                    ...room, 
                    customizations: updatedCustomizations, 
                    customizationTotal: total,
                    attributes: customizationAttributes,
                    ...roomScenario // Apply new scenario flags
                  }
                : room
            ),
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'success' } : op
            ),
            isLoading: false
          }))
          
          // Invalidate cache
          debouncedCacheInvalidation('rooms')
          debouncedCacheInvalidation('totals')
          
          // Clean up operation
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
            }))
          }, 5000)
          
          return { success: true }
          
        } catch (error) {
          const selectionError: SelectionError = {
            id: generateId('error'),
            type: 'validation',
            message: 'Failed to update room customizations',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, selectionError],
            isLoading: false
          }))
          
          return { success: false, errors: [selectionError] }
        }
      },
      
      // Add room from customizations only (attribute_selection scenario)
      addRoomFromCustomization: async (customizations, reservationInfo) => {
        const operationId = generateId('op')
        
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: operationId,
            type: 'room_add',
            status: 'pending',
            data: { customizations, reservationInfo },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          const currentState = get()
          
          // Calculate total customization price early
          const customizationTotal = Object.values(customizations).reduce((sum, customization) => {
            return sum + (customization?.price || 0)
          }, 0)
          
          // Determine if customizations are being added
          const hasCustomizations = Object.keys(customizations).length > 0
          
          // Check for existing room to merge or replace
          const hasExistingRoom = currentState.selectedRooms.length > 0
          const existingRoom = hasExistingRoom ? currentState.selectedRooms[0] : null
          
          // Check if we need to merge with existing room upgrade
          const shouldMerge = existingRoom && 
            existingRoom.originalRoomType &&
            hasCustomizations
          
          if (shouldMerge && existingRoom) {
            // Merge customizations with existing room upgrade
            const mergedRoom = mergeCustomizationsWithUpgrade(existingRoom, customizations, customizationTotal)
            
            set(() => ({
              selectedRooms: [mergedRoom]
            }))
            
            // Add success notification
            const successNotification: UserNotification = {
              id: generateId('notification'),
              type: 'success',
              message: 'Room customizations merged with upgrade',
              timestamp: Date.now(),
              duration: 5000
            }
            
            set(state => ({
              notifications: [...state.notifications, successNotification]
            }))
            
            set(state => ({
              pendingOperations: state.pendingOperations.map(op => 
                op.id === operationId ? { ...op, status: 'success' } : op
              ),
              isLoading: false
            }))
            
            return { success: true }
          } else if (hasExistingRoom) {
            // Clear existing rooms for regular replacement
            set(() => ({
              selectedRooms: []
            }))
          }

          // Calculate nights from check-in and check-out dates
          const checkInDate = new Date(reservationInfo.checkIn)
          const checkOutDate = new Date(reservationInfo.checkOut)
          const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
          const nights = Math.max(1, daysDiff) // Ensure at least 1 night, handle same-day bookings

          // customizationTotal already calculated above

          // Create customization attributes for display
          const customizationAttributes = Object.values(customizations)
            .filter((c): c is NonNullable<typeof c> => c !== undefined) // Remove undefined values
            .map(c => c.label)

          // Create base room data for attribute_selection scenario
          const baseRoomData = {
            originalRoomType: null, // No upgrade for customization-only
            hasKey: false, // No specific room assignment
            attributes: customizationAttributes,
            alternatives: ['Various rooms available'] // Show alternatives for customizations
          }

          // Determine room scenario (should be attribute_selection)
          const roomScenario = determineRoomScenario(baseRoomData)

          // Create room with customizations
          const newRoom: SelectedRoom = {
            id: generateId('room'),
            roomType: mapToAllowedRoomType(reservationInfo.originalRoomType || 'Doble'),
            price: 0, // Base room price is 0 for customization-only, price is in customizations
            originalRoomType: undefined, // No upgrade
            ...roomScenario, // Apply determined scenario flags (should set showAttributes: true)
            agent: 'Maria García',
            status: 'confirmed',
            dateRequested: new Date().toLocaleDateString('en-GB'),
            checkIn: reservationInfo.checkIn,
            checkOut: reservationInfo.checkOut,
            nights,
            roomNumber: reservationInfo.roomNumber,
            hasKey: false, // Customizations don't have specific room assignments
            attributes: customizationAttributes,
            customizations,
            customizationTotal
          }
          
          set(state => ({
            selectedRooms: [...state.selectedRooms, newRoom],
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'success' } : op
            ),
            isLoading: false
          }))
          
          // Invalidate cache
          debouncedCacheInvalidation('rooms')
          debouncedCacheInvalidation('totals')
          
          // Clean up completed operation after delay
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
            }))
          }, 5000)
          
          return { success: true }
          
        } catch (error) {
          const selectionError: SelectionError = {
            id: generateId('error'),
            type: 'network',
            message: 'Failed to add room from customizations',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, selectionError],
            isLoading: false
          }))
          
          return { success: false, errors: [selectionError] }
        }
      },
      
      // Async extra actions with conflict detection
      addExtra: async (offer, agent = 'Online') => {
        const operationId = generateId('op')
        
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: operationId,
            type: 'extra_add',
            status: 'pending',
            data: { offer, agent },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          // Validate conflicts
          const currentState = get()
          const conflicts = detectExtraConflicts(currentState.selectedExtras, offer)
          
          if (conflicts.length > 0) {
            set(state => ({
              pendingOperations: state.pendingOperations.map(op => 
                op.id === operationId ? { ...op, status: 'error' } : op
              ),
              errors: [...state.errors, ...conflicts],
              isLoading: false
            }))
            
            return { success: false, errors: conflicts }
          }
          
          // Optimistic update
          const newExtra: SelectedExtra = {
            id: generateId('extra'),
            name: offer.name,
            price: offer.price,
            units: offer.quantity,
            type: offer.type,
            agent,
            status: 'confirmed',
            dateRequested: new Date().toLocaleDateString('en-GB'),
            serviceDate: offer.selectedDates 
              ? offer.selectedDates.map(d => d.toLocaleDateString('en-GB'))
              : offer.selectedDate 
                ? offer.selectedDate.toLocaleDateString('en-GB')
                : new Date().toLocaleDateString('en-GB'),
            commission: agent !== 'Online' ? offer.price * 0.1 : 0
          }
          
          set(state => ({
            selectedExtras: [...state.selectedExtras, newExtra],
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'success' } : op
            ),
            isLoading: false
          }))
          
          // Invalidate cache
          debouncedCacheInvalidation('extras')
          debouncedCacheInvalidation('totals')
          
          // Clean up operation
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
            }))
          }, 5000)
          
          return { success: true }
          
        } catch (error) {
          const selectionError: SelectionError = {
            id: generateId('error'),
            type: 'network',
            message: 'Failed to add extra service',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, selectionError],
            isLoading: false
          }))
          
          return { success: false, errors: [selectionError] }
        }
      },
      
      removeExtra: async (extraId) => {
        const operationId = generateId('op')
        
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: operationId,
            type: 'extra_remove',
            status: 'pending',
            data: { extraId },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          const extraToRemove = get().selectedExtras.find(e => e.id === extraId)
          if (!extraToRemove) {
            throw new Error('Extra service not found')
          }
          
          // Optimistic update
          set(state => ({
            selectedExtras: state.selectedExtras.filter(extra => extra.id !== extraId),
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'success' } : op
            ),
            isLoading: false
          }))
          
          // Invalidate cache
          debouncedCacheInvalidation('extras')
          debouncedCacheInvalidation('totals')
          
          // Clean up operation
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== operationId)
            }))
          }, 5000)
          
          return { success: true }
          
        } catch (error) {
          const selectionError: SelectionError = {
            id: generateId('error'),
            type: 'network',
            message: 'Failed to remove extra service',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === operationId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, selectionError],
            isLoading: false
          }))
          
          return { success: false, errors: [selectionError] }
        }
      },
      
      // Batch operations for performance
      executeBatchOperations: async (operations) => {
        const batchId = generateId('batch')
        const errors: SelectionError[] = []
        
        set(state => ({
          pendingOperations: [...state.pendingOperations, {
            id: batchId,
            type: 'batch_operation',
            status: 'pending',
            data: { operations },
            timestamp: Date.now()
          }],
          isLoading: true
        }))
        
        try {
          // Execute operations sequentially to maintain data integrity
          for (const operation of operations) {
            const currentState = get()
            
            switch (operation.type) {
              case 'add_room': {
                const roomResult = await currentState.addRoom(operation.data.room, operation.data.reservationInfo)
                if (!roomResult.success && roomResult.errors) {
                  errors.push(...roomResult.errors)
                }
                break
              }
                
              case 'remove_room': {
                const removeRoomResult = await currentState.removeRoom(operation.data.roomId)
                if (!removeRoomResult.success && removeRoomResult.errors) {
                  errors.push(...removeRoomResult.errors)
                }
                break
              }
                
              case 'add_extra': {
                const extraResult = await currentState.addExtra(operation.data.offer, operation.data.agent)
                if (!extraResult.success && extraResult.errors) {
                  errors.push(...extraResult.errors)
                }
                break
              }
                
              case 'remove_extra': {
                const removeExtraResult = await currentState.removeExtra(operation.data.extraId)
                if (!removeExtraResult.success && removeExtraResult.errors) {
                  errors.push(...removeExtraResult.errors)
                }
                break
              }
                
              case 'update_customization': {
                const customizationResult = await currentState.updateRoomCustomizations(
                  operation.data.roomId,
                  operation.data.customizations,
                  operation.data.total
                )
                if (!customizationResult.success && customizationResult.errors) {
                  errors.push(...customizationResult.errors)
                }
                break
              }
            }
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === batchId ? { ...op, status: errors.length > 0 ? 'error' : 'success' } : op
            ),
            errors: errors.length > 0 ? [...state.errors, ...errors] : state.errors,
            isLoading: false
          }))
          
          // Clean up batch operation
          setTimeout(() => {
            set(state => ({
              pendingOperations: state.pendingOperations.filter(op => op.id !== batchId)
            }))
          }, 5000)
          
          return { success: errors.length === 0, errors: errors.length > 0 ? errors : undefined }
          
        } catch (error) {
          const batchError: SelectionError = {
            id: generateId('error'),
            type: 'network',
            message: 'Batch operation failed',
            details: error instanceof Error ? error.message : String(error),
            timestamp: Date.now(),
            recoverable: true
          }
          
          set(state => ({
            pendingOperations: state.pendingOperations.map(op => 
              op.id === batchId ? { ...op, status: 'error' } : op
            ),
            errors: [...state.errors, batchError],
            isLoading: false
          }))
          
          return { success: false, errors: [batchError] }
        }
      },
      
      // Bulk actions
      clearAllSelections: () => {
        set({
          selectedRooms: [],
          selectedExtras: [],
          errors: [],
          pendingOperations: []
        })
        
        // Clear cache
        globalCache.clear()
      },
      
      clearRooms: () => {
        set({ selectedRooms: [] })
        debouncedCacheInvalidation('rooms')
        debouncedCacheInvalidation('totals')
      },
      
      clearExtras: () => {
        set({ selectedExtras: [] })
        debouncedCacheInvalidation('extras')
        debouncedCacheInvalidation('totals')
      },
      
      // Status management
      updateItemStatus: (type, itemId, status) => {
        set((state) => {
          if (type === 'room') {
            return {
              selectedRooms: state.selectedRooms.map(room =>
                room.id === itemId ? { ...room, status } : room
              )
            }
          } else {
            return {
              selectedExtras: state.selectedExtras.map(extra =>
                extra.id === itemId ? { ...extra, status } : extra
              )
            }
          }
        })
        
        // Invalidate relevant cache entries
        debouncedCacheInvalidation(type === 'room' ? 'rooms' : 'extras')
      },
      
      // Error management
      clearError: (errorId) => set((state) => ({
        errors: state.errors.filter(error => error.id !== errorId)
      })),
      
      clearAllErrors: () => set({ errors: [] }),
      
      retryFailedOperation: async (operationId) => {
        const operation = get().pendingOperations.find(op => op.id === operationId)
        if (!operation || operation.status !== 'error') {
          return { success: false, errors: [{
            id: generateId('error'),
            type: 'validation',
            message: 'Operation not found or not in error state',
            timestamp: Date.now(),
            recoverable: false
          }] }
        }
        
        // Increment retry count
        const retryCount = (operation.retryCount || 0) + 1
        if (retryCount > 3) {
          return { success: false, errors: [{
            id: generateId('error'),
            type: 'validation',
            message: 'Maximum retry attempts exceeded',
            timestamp: Date.now(),
            recoverable: false
          }] }
        }
        
        // Update operation retry count
        set(state => ({
          pendingOperations: state.pendingOperations.map(op => 
            op.id === operationId ? { ...op, retryCount, status: 'pending' } : op
          )
        }))
        
        // Retry the operation based on type
        const currentState = get()
        switch (operation.type) {
          case 'room_add':
            return await currentState.addRoom(operation.data.room, operation.data.reservationInfo)
          case 'room_remove':
            return await currentState.removeRoom(operation.data.roomId)
          case 'extra_add':
            return await currentState.addExtra(operation.data.offer, operation.data.agent)
          case 'extra_remove':
            return await currentState.removeExtra(operation.data.extraId)
          case 'customization_update':
            return await currentState.updateRoomCustomizations(
              operation.data.roomId,
              operation.data.customizations,
              operation.data.total
            )
          default:
            return { success: false, errors: [{
              id: generateId('error'),
              type: 'validation',
              message: 'Unknown operation type',
              timestamp: Date.now(),
              recoverable: false
            }] }
        }
      },
      
      // Optimistic updates with rollback capability
      performOptimisticUpdate: async (updater, operation) => {
        const originalState = get()
        const rollbackState = {
          selectedRooms: [...originalState.selectedRooms],
          selectedExtras: [...originalState.selectedExtras]
        }
        
        try {
          // Apply optimistic update
          set(state => ({ ...state, ...updater(state) }))
          
          // Execute actual operation
          const result = await operation()
          
          return result
          
        } catch (error) {
          // Rollback on failure
          set(state => ({
            ...state,
            selectedRooms: rollbackState.selectedRooms,
            selectedExtras: rollbackState.selectedExtras,
            errors: [...state.errors, {
              id: generateId('error'),
              type: 'network',
              message: 'Operation failed, changes reverted',
              details: error instanceof Error ? error.message : String(error),
              timestamp: Date.now(),
              recoverable: true
            }]
          }))
          
          throw error
        }
      },
      
      // Cached utilities for performance
      isRoomSelected: (roomType) => {
        const cacheKey = `room_selected_${roomType}`
        const cached = globalCache.get(cacheKey)
        
        if (cached !== null) {
          return cached
        }
        
        const result = get().selectedRooms.some(room => room.roomType === roomType)
        globalCache.set(cacheKey, result, ['rooms'])
        
        return result
      },
      
      isExtraSelected: (offerName) => {
        const cacheKey = `extra_selected_${offerName}`
        const cached = globalCache.get(cacheKey)
        
        if (cached !== null) {
          return cached
        }
        
        const result = get().selectedExtras.some(extra => extra.name === offerName)
        globalCache.set(cacheKey, result, ['extras'])
        
        return result
      },
      
      getTotalPrice: () => {
        const cacheKey = 'total_price'
        const cached = globalCache.get(cacheKey)
        
        if (cached !== null) {
          return cached
        }
        
        const state = get()
        const total = calculateSmartTotal(state.selectedRooms, state.selectedExtras)
        
        globalCache.set(cacheKey, total, ['rooms', 'extras', 'totals'])
        return total
      },
      
      getItemCounts: () => {
        const cacheKey = 'item_counts'
        const cached = globalCache.get(cacheKey)
        
        if (cached !== null) {
          return cached
        }
        
        const state = get()
        const counts = {
          rooms: state.selectedRooms.length,
          extras: state.selectedExtras.length,
          total: state.selectedRooms.length + state.selectedExtras.length
        }
        
        globalCache.set(cacheKey, counts, ['rooms', 'extras'])
        return counts
      },
      
      // Advanced utilities
      getSmartRecommendations: () => {
        const cacheKey = 'smart_recommendations'
        const cached = globalCache.get(cacheKey)
        
        if (cached !== null) {
          return cached
        }
        
        const state = get()
        const recommendations = {
          rooms: [], // Would be populated with ML-based recommendations
          extras: [] // Would suggest complementary services
        }
        
        // Smart recommendation logic based on current selections
        if (state.selectedRooms.length > 0) {
          const hasLuxuryRoom = state.selectedRooms.some(room => 
            room.roomType.toLowerCase().includes('suite') || 
            room.roomType.toLowerCase().includes('deluxe')
          )
          
          if (hasLuxuryRoom && !state.selectedExtras.some(e => e.name.includes('Spa'))) {
            // Recommend spa services for luxury rooms
          }
        }
        
        globalCache.set(cacheKey, recommendations, ['rooms', 'extras'], 2 * 60 * 1000) // 2 min cache
        return recommendations
      },
      
      validateSelections: () => {
        const state = get()
        const errors: SelectionError[] = []
        
        // Validate room selections
        state.selectedRooms.forEach(room => {
          // Check if room has valid type
          if (!room.roomType) {
            errors.push({
              id: generateId('validation'),
              type: 'validation',
              message: `Room is missing room type`,
              details: JSON.stringify({ room }),
              timestamp: Date.now(),
              recoverable: true
            })
            return
          }
          
          // For rooms with customizations, the base price can be 0
          const hasCustomizations = room.customizations && Object.keys(room.customizations).length > 0
          const customizationTotal = room.customizationTotal || 0
          const totalValue = room.price + customizationTotal
          
          // Validate that room has some value (either base price or customizations)
          if (totalValue <= 0 && !hasCustomizations) {
            errors.push({
              id: generateId('validation'),
              type: 'validation',
              message: `Invalid room configuration for ${room.roomType} - no price or customizations`,
              details: JSON.stringify({ room }),
              timestamp: Date.now(),
              recoverable: true
            })
          }
        })
        
        // Validate extra selections
        state.selectedExtras.forEach(extra => {
          if (!extra.name || extra.price <= 0) {
            errors.push({
              id: generateId('validation'),
              type: 'validation',
              message: `Invalid extra service configuration for ${extra.name}`,
              details: JSON.stringify({ extra }),
              timestamp: Date.now(),
              recoverable: true
            })
          }
        })
        
        return errors
      },
      
      // Performance utilities
      preloadCalculations: () => {
        // Pre-calculate common values to populate cache
        const state = get()
        state.getTotalPrice()
        state.getItemCounts()
        state.getSmartRecommendations()
      },
      
      clearCache: () => {
        globalCache.clear()
      }
    }))