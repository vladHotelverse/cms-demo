"use client"

import React, { useEffect, useCallback, useMemo, memo, useRef, useState } from 'react'
import { Plus, Trash2, Package, Hotel, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RoomsTable } from '@/components/features/reservations/reservation-summary/rooms-table'
import { ExtrasTable } from '@/components/features/reservations/reservation-summary/extras-table'
import { useUserSelectionsStore } from '@/stores/user-selections-store'
import { SelectionNotifications, useSelectionNotifications } from './selection-notifications'
import type { RoomOption } from '@/components/ABS_RoomSelectionCarousel/types'
import type { SelectedCustomizations } from '@/components/ABS_RoomCustomization/types'
import type { OfferData } from '@/components/ABS_SpecialOffers/types'
import type { SelectionError } from '@/stores/user-selections-store'

// Debounce hook for performance optimization
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Race condition prevention hook
const useAsyncOperation = () => {
  const operationIdRef = useRef(0)
  
  const executeOperation = useCallback(async <T,>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    const currentOperationId = ++operationIdRef.current
    
    try {
      const result = await operation()
      
      // Check if this operation is still the latest
      if (currentOperationId === operationIdRef.current) {
        return result
      }
      
      return null // Operation was superseded
    } catch (error) {
      // Only throw if this is still the latest operation
      if (currentOperationId === operationIdRef.current) {
        throw error
      }
      return null
    }
  }, [])
  
  const cancelPendingOperations = useCallback(() => {
    operationIdRef.current++
  }, [])
  
  return { executeOperation, cancelPendingOperations }
}

interface SelectionSummaryProps {
  // Connection props for ABS components
  onRoomSelectionChange?: (room: RoomOption | null) => void
  onRoomCustomizationChange?: (roomId: string, customizations: SelectedCustomizations, total: number) => void
  onSpecialOfferBooked?: (offer: OfferData) => void
  
  // Current ABS component states for integration
  currentRoomCustomizations?: SelectedCustomizations
  
  // Reservation context
  reservationInfo?: {
    checkIn: string
    checkOut: string
    agent?: string
    roomNumber?: string
    originalRoomType?: string
  }
  
  // UI customization
  className?: string
  showNotifications?: boolean
  notificationPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  
  // Translations
  translations?: {
    roomsTitle?: string
    extrasTitle?: string
    noSelectionsText?: string
    noSelectionsSubtext?: string
    clearAllText?: string
    clearRoomsText?: string
    clearExtrasText?: string
    totalPriceText?: string
    confirmSelectionsText?: string
    // Notification messages
    roomAddedText?: string
    roomRemovedText?: string
    extraAddedText?: string
    extraRemovedText?: string
    customizationUpdatedText?: string
    selectionsCleared?: string
  }
}

// Memoized table row components for better performance
const MemoizedRoomsTable = memo(RoomsTable)
MemoizedRoomsTable.displayName = 'MemoizedRoomsTable'

const MemoizedExtrasTable = memo(ExtrasTable)
MemoizedExtrasTable.displayName = 'MemoizedExtrasTable'

// Error boundary component for graceful error handling
const SelectionErrorBoundary = memo(({ children, errors, onRetry, onClear }: {
  children: React.ReactNode
  errors: SelectionError[]
  onRetry: (errorId: string) => void
  onClear: (errorId: string) => void
}) => {
  if (errors.length === 0) {
    return <>{children}</>
  }
  
  return (
    <div className="space-y-4">
      {errors.map(error => (
        <div 
          key={error.id}
          className={cn(
            "p-4 rounded-lg border-l-4 bg-red-50",
            error.type === 'validation' ? 'border-l-yellow-500' : 'border-l-red-500'
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className={cn(
                "h-5 w-5 mt-0.5",
                error.type === 'validation' ? 'text-yellow-600' : 'text-red-600'
              )} />
              <div>
                <p className="font-medium text-gray-900">{error.message}</p>
                {error.details && (
                  <p className="text-sm text-gray-600 mt-1">
                    {typeof error.details === 'string' ? error.details : JSON.stringify(error.details)}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {error.recoverable && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRetry(error.id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onClear(error.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      ))}
      {children}
    </div>
  )
})
SelectionErrorBoundary.displayName = 'SelectionErrorBoundary'

// Loading overlay component
const LoadingOverlay = memo(({ isLoading, pendingCount }: {
  isLoading: boolean
  pendingCount: number
}) => {
  if (!isLoading && pendingCount === 0) return null
  
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
      <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <div>
          <p className="font-medium text-gray-900">Processing selections...</p>
          {pendingCount > 0 && (
            <p className="text-sm text-gray-600">{pendingCount} operations pending</p>
          )}
        </div>
      </div>
    </div>
  )
})
LoadingOverlay.displayName = 'LoadingOverlay'

export const SelectionSummary = memo(function SelectionSummary({
  onRoomSelectionChange,
  onRoomCustomizationChange,
  onSpecialOfferBooked,
  currentRoomCustomizations,
  reservationInfo,
  className,
  showNotifications = true,
  notificationPosition = 'top-right',
  translations = {}
}: SelectionSummaryProps) {
  const {
    selectedRooms,
    selectedExtras,
    pendingOperations,
    errors,
    isLoading,
    addRoom,
    addRoomFromCustomization,
    removeRoom,
    updateRoomCustomizations,
    addExtra,
    removeExtra,
    clearAllSelections,
    clearRooms,
    clearExtras,
    updateItemStatus,
    getTotalPrice,
    getItemCounts,
    clearError,
    retryFailedOperation,
    executeBatchOperations,
    validateSelections,
    performOptimisticUpdate
  } = useUserSelectionsStore()


  const {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    dismissNotification
  } = useSelectionNotifications()
  
  // Performance optimizations
  const { executeOperation, cancelPendingOperations } = useAsyncOperation()
  const [operationQueue, setOperationQueue] = useState<Array<() => Promise<any>>>([])
  const isProcessingQueue = useRef(false)
  
  // Debounced values for expensive operations
  const debouncedSelectedRooms = useDebounce(selectedRooms, 100)
  const debouncedSelectedExtras = useDebounce(selectedExtras, 100)

  // Memoized translations for performance
  const t = useMemo(() => ({
    roomsTitle: translations.roomsTitle || 'Selected Rooms',
    extrasTitle: translations.extrasTitle || 'Selected Extras',
    noSelectionsText: translations.noSelectionsText || 'No items selected',
    noSelectionsSubtext: translations.noSelectionsSubtext || 'Select rooms and services from the available options',
    clearAllText: translations.clearAllText || 'Clear All',
    clearRoomsText: translations.clearRoomsText || 'Clear Rooms',
    clearExtrasText: translations.clearExtrasText || 'Clear Extras',
    totalPriceText: translations.totalPriceText || 'Total',
    confirmSelectionsText: translations.confirmSelectionsText || 'Confirm Selections',
    roomAddedText: translations.roomAddedText || 'Room added to selection',
    roomRemovedText: translations.roomRemovedText || 'Room removed from selection',
    extraAddedText: translations.extraAddedText || 'Extra service added',
    extraRemovedText: translations.extraRemovedText || 'Extra service removed',
    customizationUpdatedText: translations.customizationUpdatedText || 'Room customization updated',
    selectionsCleared: translations.selectionsCleared || 'All selections cleared'
  }), [translations])
  
  // Queue processor for batch operations
  const processOperationQueue = useCallback(async () => {
    if (isProcessingQueue.current || operationQueue.length === 0) return
    
    isProcessingQueue.current = true
    
    try {
      const operations = [...operationQueue]
      setOperationQueue([])
      
      // Process operations in batches of 3 for performance
      const batchSize = 3
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize)
        await Promise.allSettled(batch.map(op => op()))
      }
    } catch (error) {
      console.error('Error processing operation queue:', error)
    } finally {
      isProcessingQueue.current = false
    }
  }, [operationQueue])
  
  // Track previous customizations to prevent infinite loops
  const prevCustomizationsRef = useRef<SelectedCustomizations | undefined>()
  const hasProcessedCustomizations = useRef(false)
  
  // Monitor current room customizations and trigger store updates
  useEffect(() => {
    const hasCustomizations = currentRoomCustomizations && Object.keys(currentRoomCustomizations).length > 0
    
    // Prevent infinite loops by checking if customizations actually changed
    const customizationsChanged = JSON.stringify(currentRoomCustomizations) !== JSON.stringify(prevCustomizationsRef.current)
    
    // IMPORTANT: Only process customizations if there are no pending operations
    // This prevents race conditions with direct room selections from Superior Rooms
    const hasPendingOperations = operationQueue.length > 0 || isLoading
    
    if (hasCustomizations && reservationInfo && customizationsChanged && !hasProcessedCustomizations.current && !hasPendingOperations) {
      prevCustomizationsRef.current = currentRoomCustomizations
      
      // Calculate total customization price
      const total = Object.values(currentRoomCustomizations).reduce((sum, customization) => {
        return sum + (customization?.price || 0)
      }, 0)
      
      // Allow customizations with room upgrades - merge functionality handles this
      
      // If no existing room, create one from customizations
      if (selectedRooms.length === 0) {
        hasProcessedCustomizations.current = true
        
        const operation = async () => {
          try {
            const result = await addRoomFromCustomization(currentRoomCustomizations!, reservationInfo)
            
            if (result.success) {
              if (showNotifications) {
                showSuccess(
                  'Room customization added',
                  `Room with ${Object.keys(currentRoomCustomizations!).length} customizations has been added`,
                  3000
                )
              }
            } else if (result.errors) {
              const conflictError = result.errors.find(e => e.type === 'conflict')
              if (conflictError && showNotifications) {
                showWarning('Cannot add customizations', conflictError.message)
              }
            }
          } catch (error) {
            console.error('Error adding room from customizations:', error)
          }
        }
        
        // Add to operation queue
        setOperationQueue(prev => [...prev, operation])
      }
    }
    
    // Reset processing flag when customizations are cleared
    if (!hasCustomizations) {
      hasProcessedCustomizations.current = false
      prevCustomizationsRef.current = undefined
    }
  }, [
    currentRoomCustomizations, 
    reservationInfo, 
    selectedRooms.length, // Only track length to avoid infinite loops
    operationQueue.length, // Track pending operations to prevent race conditions
    isLoading, // Track loading state to prevent race conditions
    addRoomFromCustomization, 
    showNotifications, 
    showSuccess, 
    showWarning,
    setOperationQueue
  ])

  // Auto-process queue when new operations are added
  useEffect(() => {
    if (operationQueue.length > 0) {
      const timer = setTimeout(processOperationQueue, 100)
      return () => clearTimeout(timer)
    }
  }, [operationQueue, processOperationQueue])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingOperations()
    }
  }, [cancelPendingOperations])

  // Optimized event handlers with async operations and error handling
  const handleRoomSelection = useCallback(async (room: RoomOption | null) => {
    if (!room || !reservationInfo) {
      onRoomSelectionChange?.(room)
      return
    }
    
    const operation = async () => {
      try {
        const result = await addRoom(room, reservationInfo)
        
        if (result.success) {
          if (showNotifications) {
            showSuccess(t.roomAddedText, `${room.roomType} has been added to your selection`, 3000)
          }
        } else if (result.errors) {
          const duplicateError = result.errors.find(e => e.type === 'duplicate')
          if (duplicateError && showNotifications) {
            showWarning('Room already selected', `${room.roomType} is already in your selection`)
          } else if (showNotifications) {
            showError('Selection failed', result.errors[0]?.message || 'Failed to add room')
          }
        }
        
        return result
      } catch (error) {
        if (showNotifications) {
          showError('Selection failed', 'An unexpected error occurred')
        }
        throw error
      }
    }
    
    // Add to queue for batch processing
    setOperationQueue(prev => [...prev, operation])
    
    // Call parent handler
    onRoomSelectionChange?.(room)
  }, [addRoom, reservationInfo, showNotifications, showSuccess, showWarning, showError, t.roomAddedText, onRoomSelectionChange])

  // Handle room customization with optimistic updates and conflict detection
  const handleRoomCustomization = useCallback(async (roomId: string, customizations: SelectedCustomizations, total: number) => {
    if (!reservationInfo) {
      if (showNotifications) {
        showError('Configuration error', 'Reservation information is missing')
      }
      return
    }
    
    const operation = async () => {
      try {
        const hasCustomizations = Object.keys(customizations).length > 0
        
        // Check if we have an existing room
        const existingRoom = selectedRooms.find(r => r.id === roomId)
        
        if (existingRoom) {
          // Allow customizations with existing upgrades - merge functionality handles this
          
          // Update existing room
          const result = await updateRoomCustomizations(roomId, customizations, total)
          
          if (result.success) {
            if (showNotifications) {
              showInfo(t.customizationUpdatedText, 'Room customizations updated successfully')
            }
          } else if (result.errors) {
            const conflictError = result.errors.find(e => e.type === 'conflict')
            if (conflictError && showNotifications) {
              showWarning('Cannot add customizations', conflictError.message)
            } else if (showNotifications) {
              showError('Update failed', result.errors[0]?.message || 'Failed to update customizations')
            }
          }
          
          return result
        } else if (hasCustomizations) {
          // No existing room, create room from customizations only
          const result = await addRoomFromCustomization(customizations, reservationInfo)
          
          if (result.success) {
            if (showNotifications) {
              showSuccess(
                'Room customization added', 
                `Room with ${Object.keys(customizations).length} customizations has been added`,
                3000
              )
            }
          } else if (result.errors) {
            const conflictError = result.errors.find(e => e.type === 'conflict')
            if (conflictError && showNotifications) {
              showWarning('Cannot add customizations', conflictError.message)
            } else if (showNotifications) {
              showError('Selection failed', result.errors[0]?.message || 'Failed to add room customizations')
            }
          }
          
          return result
        } else {
          // No customizations and no existing room, nothing to do
          if (showNotifications) {
            showInfo('No customizations', 'No room customizations to apply')
          }
          return { success: true }
        }
      } catch (error) {
        if (showNotifications) {
          showError('Update failed', 'An unexpected error occurred')
        }
        throw error
      }
    }
    
    // Execute with race condition protection
    executeOperation(operation)
    
    // Call parent handler
    onRoomCustomizationChange?.(roomId, customizations, total)
  }, [
    selectedRooms, 
    reservationInfo, 
    updateRoomCustomizations, 
    addRoomFromCustomization,
    showNotifications, 
    showInfo, 
    showSuccess,
    showWarning,
    showError, 
    t.customizationUpdatedText, 
    onRoomCustomizationChange, 
    executeOperation
  ])

  // Handle special offer booking with conflict detection
  const handleSpecialOfferBooked = useCallback(async (offer: OfferData) => {
    const operation = async () => {
      try {
        const result = await addExtra(offer, reservationInfo?.agent)
        
        if (result.success) {
          if (showNotifications) {
            showSuccess(t.extraAddedText, `${offer.name} has been added to your selection`, 3000)
          }
        } else if (result.errors) {
          const conflictError = result.errors.find(e => e.type === 'conflict')
          const duplicateError = result.errors.find(e => e.type === 'duplicate')
          
          if (conflictError && showNotifications) {
            showWarning('Service conflict', conflictError.message)
          } else if (duplicateError && showNotifications) {
            showWarning('Already selected', `${offer.name} is already in your selection`)
          } else if (showNotifications) {
            showError('Selection failed', result.errors[0]?.message || 'Failed to add service')
          }
        }
        
        return result
      } catch (error) {
        if (showNotifications) {
          showError('Selection failed', 'An unexpected error occurred')
        }
        throw error
      }
    }
    
    // Add to queue for batch processing
    setOperationQueue(prev => [...prev, operation])
    
    // Call parent handler
    onSpecialOfferBooked?.(offer)
  }, [addExtra, reservationInfo?.agent, showNotifications, showSuccess, showWarning, showError, t.extraAddedText, onSpecialOfferBooked])

  // Handle room removal with optimistic updates
  const handleRemoveRoom = useCallback(async (roomId: string) => {
    const room = selectedRooms.find(r => r.id === roomId)
    if (!room) return
    
    const operation = async () => {
      try {
        const result = await removeRoom(roomId)
        
        if (result.success) {
          // Reset the selected room state in parent component
          onRoomSelectionChange?.(null)
          
          if (showNotifications) {
            showInfo(t.roomRemovedText, `${room.roomType} has been removed`, 4000)
          }
        } else if (result.errors) {
          if (showNotifications) {
            showError('Removal failed', result.errors[0]?.message || 'Failed to remove room')
          }
        }
        
        return result
      } catch (error) {
        if (showNotifications) {
          showError('Removal failed', 'An unexpected error occurred')
        }
        throw error
      }
    }
    
    executeOperation(operation)
  }, [selectedRooms, removeRoom, showNotifications, showInfo, showError, t.roomRemovedText, executeOperation, onRoomSelectionChange])

  // Handle extra removal with optimistic updates
  const handleRemoveExtra = useCallback(async (extraId: string) => {
    const extra = selectedExtras.find(e => e.id === extraId)
    if (!extra) return
    
    const operation = async () => {
      try {
        const result = await removeExtra(extraId)
        
        if (result.success) {
          if (showNotifications) {
            showInfo(t.extraRemovedText, `${extra.name} has been removed`, 4000)
          }
        } else if (result.errors) {
          if (showNotifications) {
            showError('Removal failed', result.errors[0]?.message || 'Failed to remove service')
          }
        }
        
        return result
      } catch (error) {
        if (showNotifications) {
          showError('Removal failed', 'An unexpected error occurred')
        }
        throw error
      }
    }
    
    executeOperation(operation)
  }, [selectedExtras, removeExtra, showNotifications, showInfo, showError, t.extraRemovedText, executeOperation])

  // Handle clear all with confirmation
  const handleClearAll = useCallback(() => {
    // Validate before clearing
    const validationErrors = validateSelections()
    if (validationErrors.length > 0 && showNotifications) {
      showWarning('Invalid selections detected', 'Some selections have issues that will be cleared')
    }
    
    clearAllSelections()
    if (showNotifications) {
      showInfo(t.selectionsCleared)
    }
  }, [clearAllSelections, validateSelections, showNotifications, showInfo, showWarning, t.selectionsCleared])
  
  // Error handling callbacks
  const handleRetryError = useCallback(async (errorId: string) => {
    const error = errors.find(e => e.id === errorId)
    if (!error) return
    
    try {
      // Find the associated pending operation
      const relatedOperation = pendingOperations.find(op => 
        op.status === 'error' && op.timestamp <= error.timestamp + 1000
      )
      
      if (relatedOperation) {
        const result = await retryFailedOperation(relatedOperation.id)
        if (result.success && showNotifications) {
          showSuccess('Operation succeeded', 'The failed operation has been completed')
        }
      }
    } catch (retryError) {
      if (showNotifications) {
        showError('Retry failed', 'The operation could not be completed')
      }
    }
  }, [errors, pendingOperations, retryFailedOperation, showNotifications, showSuccess, showError])
  
  const handleClearError = useCallback((errorId: string) => {
    clearError(errorId)
  }, [clearError])

  // Memoized expensive calculations using debounced values
  const counts = useMemo(() => {
    return {
      rooms: debouncedSelectedRooms.length,
      extras: debouncedSelectedExtras.length,
      total: debouncedSelectedRooms.length + debouncedSelectedExtras.length
    }
  }, [debouncedSelectedRooms.length, debouncedSelectedExtras.length])
  
  const totalPrice = useMemo(() => {
    return getTotalPrice()
  }, [getTotalPrice, debouncedSelectedRooms, debouncedSelectedExtras])
  
  const pendingOperationsCount = useMemo(() => {
    return pendingOperations.filter(op => op.status === 'pending').length
  }, [pendingOperations])

  // Memoized table data to prevent unnecessary re-renders
  const roomTableItems = useMemo(() => 
    debouncedSelectedRooms.map(room => {
      // Calculate nights from checkIn and checkOut dates
      const checkInDate = new Date(room.checkIn)
      const checkOutDate = new Date(room.checkOut)
      const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
      
      return {
        ...room,
        nights,
        commission: room.agent !== 'Online' ? room.price * 0.1 : 0,
        includesHotels: true, // Required by BaseRequestedItem
        dateRequested: room.dateRequested || new Date().toLocaleDateString('en-GB'),
        // Ensure UI control flags are present (should come from store, but provide defaults)
        showKeyIcon: room.showKeyIcon ?? false,
        showAlternatives: room.showAlternatives ?? false,
        showAttributes: room.showAttributes ?? false,
        selectionScenario: room.selectionScenario ?? 'choose_room_only',
        alternatives: room.alternatives ?? []
      }
    })
  , [debouncedSelectedRooms])

  const extraTableItems = useMemo(() => 
    debouncedSelectedExtras.map(extra => ({
      ...extra,
      nameKey: undefined // ExtrasTable expects either name or nameKey
    }))
  , [debouncedSelectedExtras])
  
  // Validation state
  const validationErrors = useMemo(() => {
    return validateSelections()
  }, [validateSelections, debouncedSelectedRooms, debouncedSelectedExtras])

  return (
    <>
      {/* Notifications */}
      {showNotifications && (
        <SelectionNotifications
          notifications={notifications}
          onDismiss={dismissNotification}
          position={notificationPosition}
        />
      )}

      {/* Summary Container with error boundary */}
      <SelectionErrorBoundary 
        errors={[...errors, ...validationErrors]} 
        onRetry={handleRetryError}
        onClear={handleClearError}
      >
        <div className={cn('relative space-y-4', className)}>
          {/* Loading overlay */}
          <LoadingOverlay isLoading={isLoading} pendingCount={pendingOperationsCount} />
        {/* Summary Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Hotel className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{t.roomsTitle}</span>
              <Badge variant="secondary">{counts.rooms}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="font-medium">{t.extrasTitle}</span>
              <Badge variant="secondary">{counts.extras}</Badge>
            </div>
          </div>
          
          {counts.total > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{t.totalPriceText}</p>
                <p className="text-lg font-semibold">€{totalPrice.toFixed(2)}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t.clearAllText}
              </Button>
            </div>
          )}
        </div>

        {/* Tables or Empty State */}
        {counts.total === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg text-gray-700 mb-2">{t.noSelectionsText}</p>
            <p className="text-sm text-gray-500">{t.noSelectionsSubtext}</p>
          </div>
        ) : (
          <>
            {/* Rooms Table with optimized rendering */}
            {debouncedSelectedRooms.length > 0 && (
              <div className="relative">
                <MemoizedRoomsTable items={roomTableItems} onRemove={handleRemoveRoom} />
                <div className="absolute top-4 right-16 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRooms}
                    className="text-xs text-gray-500 hover:text-red-500"
                    disabled={isLoading}
                  >
                    {t.clearRoomsText}
                  </Button>
                </div>
              </div>
            )}

            {/* Extras Table with optimized rendering */}
            {debouncedSelectedExtras.length > 0 && (
              <div className="relative">
                <MemoizedExtrasTable items={extraTableItems} />
                <div className="absolute top-4 right-16 flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearExtras}
                    className="text-xs text-gray-500 hover:text-red-500"
                    disabled={isLoading}
                  >
                    {t.clearExtrasText}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Validation Summary */}
            {validationErrors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">Selection Issues</h3>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {validationErrors.map(error => (
                    <li key={error.id}>• {error.message}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Performance Stats (dev mode only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600">
                <h4 className="font-medium mb-2">Performance Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>Pending Operations: {pendingOperationsCount}</p>
                    <p>Active Errors: {errors.length}</p>
                    <p>Validation Issues: {validationErrors.length}</p>
                  </div>
                  <div>
                    <p>Queue Length: {operationQueue.length}</p>
                    <p>Processing: {isProcessingQueue.current ? 'Yes' : 'No'}</p>
                    <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        </div>
      </SelectionErrorBoundary>
    </>
  )
})

SelectionSummary.displayName = 'SelectionSummary'

// Export connection handlers and utilities for easier integration
export type { RoomOption, SelectedCustomizations, OfferData, SelectionError }
export { useUserSelectionsStore, useDebounce, useAsyncOperation }
export { MemoizedRoomsTable, MemoizedExtrasTable, SelectionErrorBoundary, LoadingOverlay }