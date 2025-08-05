"use client"

import { useCallback, useMemo, useRef } from 'react'
import { useUserSelectionsStore } from '@/stores/user-selections-store'
import { useOperationQueue } from './hooks/use-operation-queue'
import { useSelectionNotifications } from './selection-notifications'
import { useOptimisticUpdates } from './hooks/use-optimistic-updates'
import { useSelectionValidation } from './hooks/use-selection-validation'
import type { RoomOption, SelectedCustomizations, OfferData } from './types'

interface UseSelectionSummaryProps {
  onRoomSelectionChange?: (room: RoomOption | null) => void
  onRoomCustomizationChange?: (roomId: string, customizations: SelectedCustomizations, total: number) => void
  onSpecialOfferBooked?: (offer: OfferData) => void
  currentRoomCustomizations?: SelectedCustomizations
  reservationInfo?: {
    checkIn: string
    checkOut: string
    agent?: string
    roomNumber?: string
    originalRoomType?: string
  }
  translations?: Record<string, string>
}

/**
 * Main business logic hook for SelectionSummary
 * 
 * Improvements:
 * 1. Centralized business logic
 * 2. Better error handling with recovery
 * 3. Optimistic updates with rollback
 * 4. Smarter operation queuing
 * 5. Network resilience
 */
export function useSelectionSummary({
  onRoomSelectionChange,
  onRoomCustomizationChange,
  onSpecialOfferBooked,
  currentRoomCustomizations,
  reservationInfo,
  translations = {}
}: UseSelectionSummaryProps) {
  // Store state
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
    getTotalPrice,
    clearError,
    retryFailedOperation,
    validateSelections
  } = useUserSelectionsStore()

  // Enhanced hooks
  const { enqueueOperation, processQueue, clearQueue } = useOperationQueue({
    batchSize: 5,
    processingDelay: 300,
    maxRetries: 3
  })
  
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissNotification,
    notifications
  } = useSelectionNotifications()

  const {
    applyOptimisticUpdate,
    rollbackUpdate,
    confirmUpdate
  } = useOptimisticUpdates(selectedRooms, selectedExtras)

  const {
    validateSelection,
    getValidationErrors
  } = useSelectionValidation()

  // Performance tracking
  const performanceRef = useRef({
    operationCount: 0,
    errorCount: 0,
    averageResponseTime: 0
  })

  // Processed translations
  const t = useMemo(() => ({
    roomsTitle: translations.roomsTitle || 'Selected Rooms',
    extrasTitle: translations.extrasTitle || 'Selected Extras',
    noSelectionsText: translations.noSelectionsText || 'No items selected',
    noSelectionsSubtext: translations.noSelectionsSubtext || 'Select rooms and services from the available options',
    clearAllText: translations.clearAllText || 'Clear All',
    clearRoomsText: translations.clearRoomsText || 'Clear Rooms',
    clearExtrasText: translations.clearExtrasText || 'Clear Extras',
    totalPriceText: translations.totalPriceText || 'Total',
    // Success messages
    roomAddedText: translations.roomAddedText || 'Room added successfully',
    roomRemovedText: translations.roomRemovedText || 'Room removed',
    extraAddedText: translations.extraAddedText || 'Service added',
    extraRemovedText: translations.extraRemovedText || 'Service removed',
    customizationUpdatedText: translations.customizationUpdatedText || 'Customization updated',
    selectionsCleared: translations.selectionsCleared || 'All selections cleared',
    // Error messages
    selectionFailedText: translations.selectionFailedText || 'Selection failed',
    networkErrorText: translations.networkErrorText || 'Network error occurred',
    validationErrorText: translations.validationErrorText || 'Invalid selection'
  }), [translations])

  // Enhanced room selection with optimistic updates
  const handleRoomSelection = useCallback(async (room: RoomOption | null) => {
    if (!room || !reservationInfo) {
      onRoomSelectionChange?.(room)
      return
    }

    // Validation first
    const validationResult = validateSelection('room', room, { reservationInfo })
    if (!validationResult.isValid) {
      showError(t.validationErrorText, validationResult.errors[0])
      return
    }

    // Apply optimistic update
    const optimisticId = applyOptimisticUpdate('add_room', room)
    
    // Show immediate feedback
    showInfo('Adding room...', `${room.roomType} is being added`, 2000)

    const startTime = Date.now()

    const operation = async () => {
      try {
        const result = await addRoom(room, reservationInfo)
        
        const responseTime = Date.now() - startTime
        performanceRef.current.averageResponseTime = 
          (performanceRef.current.averageResponseTime + responseTime) / 2

        if (result.success) {
          confirmUpdate(optimisticId)
          showSuccess(t.roomAddedText, `${room.roomType} has been added to your selection`)
          performanceRef.current.operationCount++
        } else {
          rollbackUpdate(optimisticId)
          const errorMessage = result.errors?.[0]?.message || 'Failed to add room'
          
          if (result.errors?.some(e => e.type === 'duplicate')) {
            showWarning('Room already selected', `${room.roomType} is already in your selection`)
          } else if (result.errors?.some(e => e.type === 'quota_exceeded')) {
            showError('Room limit reached', 'You cannot add more rooms to this reservation')
          } else {
            showError(t.selectionFailedText, errorMessage)
          }
          
          performanceRef.current.errorCount++
        }
        
        return result
      } catch (error) {
        rollbackUpdate(optimisticId)
        performanceRef.current.errorCount++
        
        // Network error handling with retry
        if (error instanceof TypeError && error.message.includes('fetch')) {
          showError(t.networkErrorText, 'Please check your connection and try again', 0, {
            actions: [{
              id: 'retry',
              label: 'Retry',
              onClick: () => enqueueOperation(operation, { priority: 'high', maxRetries: 2 })
            }]
          })
        } else {
          showError(t.selectionFailedText, 'An unexpected error occurred')
        }
        
        throw error
      }
    }
    
    // Enqueue operation with priority
    enqueueOperation(operation, { 
      id: `add-room-${room.id}`,
      priority: 'medium',
      dedupKey: `room-${room.id}`
    })
    
    // Call parent handler
    onRoomSelectionChange?.(room)
  }, [
    addRoom, 
    reservationInfo, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo,
    t,
    validateSelection,
    applyOptimisticUpdate,
    rollbackUpdate,
    confirmUpdate,
    enqueueOperation,
    onRoomSelectionChange
  ])

  // Enhanced room customization handler
  const handleRoomCustomization = useCallback(async (
    roomId: string, 
    customizations: SelectedCustomizations, 
    total: number
  ) => {
    if (!reservationInfo) {
      showError(t.validationErrorText, 'Reservation information is missing')
      return
    }

    // Validate customizations
    const validationResult = validateSelection('customization', { roomId, customizations, total })
    if (!validationResult.isValid) {
      showError(t.validationErrorText, validationResult.errors[0])
      return
    }

    const optimisticId = applyOptimisticUpdate('update_customization', { roomId, customizations, total })
    
    const operation = async () => {
      try {
        const existingRoom = selectedRooms.find(r => r.id === roomId)
        let result

        if (existingRoom) {
          result = await updateRoomCustomizations(roomId, customizations, total)
        } else if (Object.keys(customizations).length > 0) {
          result = await addRoomFromCustomization(customizations, reservationInfo)
        } else {
          confirmUpdate(optimisticId)
          return { success: true }
        }
        
        if (result.success) {
          confirmUpdate(optimisticId)
          showSuccess(t.customizationUpdatedText, 'Room customizations updated successfully')
        } else {
          rollbackUpdate(optimisticId)
          const errorMessage = result.errors?.[0]?.message || 'Failed to update customizations'
          
          if (result.errors?.some(e => e.type === 'conflict')) {
            showWarning('Customization conflict', errorMessage)
          } else {
            showError(t.selectionFailedText, errorMessage)
          }
        }
        
        return result
      } catch (error) {
        rollbackUpdate(optimisticId)
        showError(t.selectionFailedText, 'An unexpected error occurred')
        throw error
      }
    }

    enqueueOperation(operation, {
      id: `customize-room-${roomId}`,
      priority: 'medium',
      dedupKey: `customization-${roomId}`
    })
    
    onRoomCustomizationChange?.(roomId, customizations, total)
  }, [
    selectedRooms,
    reservationInfo,
    updateRoomCustomizations,
    addRoomFromCustomization,
    showSuccess,
    showError,
    showWarning,
    t,
    validateSelection,
    applyOptimisticUpdate,
    rollbackUpdate,
    confirmUpdate,
    enqueueOperation,
    onRoomCustomizationChange
  ])

  // Enhanced special offer handler
  const handleSpecialOfferBooked = useCallback(async (offer: OfferData) => {
    const validationResult = validateSelection('offer', offer)
    if (!validationResult.isValid) {
      showError(t.validationErrorText, validationResult.errors[0])
      return
    }

    const optimisticId = applyOptimisticUpdate('add_extra', offer)
    
    const operation = async () => {
      try {
        const result = await addExtra(offer, reservationInfo?.agent)
        
        if (result.success) {
          confirmUpdate(optimisticId)
          showSuccess(t.extraAddedText, `${offer.name} has been added to your selection`)
        } else {
          rollbackUpdate(optimisticId)
          const errorMessage = result.errors?.[0]?.message || 'Failed to add service'
          
          if (result.errors?.some(e => e.type === 'duplicate')) {
            showWarning('Already selected', `${offer.name} is already in your selection`)
          } else {
            showError(t.selectionFailedText, errorMessage)
          }
        }
        
        return result
      } catch (error) {
        rollbackUpdate(optimisticId)
        showError(t.selectionFailedText, 'An unexpected error occurred')
        throw error
      }
    }
    
    enqueueOperation(operation, {
      id: `add-offer-${offer.id}`,
      priority: 'medium',
      dedupKey: `offer-${offer.id}`
    })
    
    onSpecialOfferBooked?.(offer)
  }, [
    addExtra,
    reservationInfo?.agent,
    showSuccess,
    showError,
    showWarning,
    t,
    validateSelection,
    applyOptimisticUpdate,
    rollbackUpdate,
    confirmUpdate,
    enqueueOperation,
    onSpecialOfferBooked
  ])

  // Enhanced removal handlers with confirmation
  const handleRemoveRoom = useCallback(async (roomId: string) => {
    const room = selectedRooms.find(r => r.id === roomId)
    if (!room) return

    const optimisticId = applyOptimisticUpdate('remove_room', roomId)
    
    const operation = async () => {
      try {
        const result = await removeRoom(roomId)
        
        if (result.success) {
          confirmUpdate(optimisticId)
          onRoomSelectionChange?.(null)
          showInfo(t.roomRemovedText, `${room.roomType} has been removed`)
        } else {
          rollbackUpdate(optimisticId)
          showError('Removal failed', result.errors?.[0]?.message || 'Failed to remove room')
        }
        
        return result
      } catch (error) {
        rollbackUpdate(optimisticId)
        showError('Removal failed', 'An unexpected error occurred')
        throw error
      }
    }
    
    enqueueOperation(operation, { id: `remove-room-${roomId}`, priority: 'high' })
  }, [
    selectedRooms,
    removeRoom,
    showInfo,
    showError,
    t,
    applyOptimisticUpdate,
    rollbackUpdate,
    confirmUpdate,
    enqueueOperation,
    onRoomSelectionChange
  ])

  const handleRemoveExtra = useCallback(async (extraId: string) => {
    const extra = selectedExtras.find(e => e.id === extraId)
    if (!extra) return

    const optimisticId = applyOptimisticUpdate('remove_extra', extraId)
    
    const operation = async () => {
      try {
        const result = await removeExtra(extraId)
        
        if (result.success) {
          confirmUpdate(optimisticId)
          showInfo(t.extraRemovedText, `${extra.name} has been removed`)
        } else {
          rollbackUpdate(optimisticId)
          showError('Removal failed', result.errors?.[0]?.message || 'Failed to remove service')
        }
        
        return result
      } catch (error) {
        rollbackUpdate(optimisticId)
        showError('Removal failed', 'An unexpected error occurred')
        throw error
      }
    }
    
    enqueueOperation(operation, { id: `remove-extra-${extraId}`, priority: 'high' })
  }, [
    selectedExtras,
    removeExtra,
    showInfo,
    showError,
    t,
    applyOptimisticUpdate,
    rollbackUpdate,
    confirmUpdate,
    enqueueOperation
  ])

  // Bulk operations with confirmation
  const handleClearAll = useCallback(() => {
    const hasSelections = selectedRooms.length > 0 || selectedExtras.length > 0
    if (!hasSelections) return

    // Show confirmation for bulk operations
    showWarning('Clear all selections?', 'This action cannot be undone', 0, {
      actions: [
        {
          id: 'confirm',
          label: 'Clear All',
          variant: 'destructive',
          onClick: () => {
            clearAllSelections()
            clearQueue()
            showInfo(t.selectionsCleared)
          }
        },
        {
          id: 'cancel',
          label: 'Cancel',
          onClick: () => {} // Just dismiss
        }
      ]
    })
  }, [selectedRooms.length, selectedExtras.length, clearAllSelections, clearQueue, showWarning, showInfo, t])

  // Error recovery
  const handleRetryError = useCallback(async (errorId: string) => {
    const error = errors.find(e => e.id === errorId)
    if (!error) return
    
    try {
      const relatedOperation = pendingOperations.find(op => 
        op.status === 'error' && op.timestamp <= error.timestamp + 1000
      )
      
      if (relatedOperation) {
        const result = await retryFailedOperation(relatedOperation.id)
        if (result.success) {
          showSuccess('Operation succeeded', 'The failed operation has been completed')
        }
      }
    } catch (retryError) {
      showError('Retry failed', 'The operation could not be completed')
    }
  }, [errors, pendingOperations, retryFailedOperation, showSuccess, showError])

  // Computed values with better memoization
  const selections = useMemo(() => {
    const counts = {
      rooms: selectedRooms.length,
      extras: selectedExtras.length,
      total: selectedRooms.length + selectedExtras.length
    }
    
    const totalPrice = getTotalPrice()
    
    return {
      rooms: selectedRooms,
      extras: selectedExtras,
      counts,
      totalPrice,
      hasSelections: counts.total > 0
    }
  }, [selectedRooms, selectedExtras, getTotalPrice])

  const operations = useMemo(() => {
    const pendingCount = pendingOperations.filter(op => op.status === 'pending').length
    const validationErrors = getValidationErrors()
    
    return {
      isLoading,
      pendingCount,
      errors: [...errors, ...validationErrors],
      hasErrors: errors.length > 0 || validationErrors.length > 0
    }
  }, [isLoading, pendingOperations, errors, getValidationErrors])

  return {
    selections,
    operations,
    notifications: {
      items: notifications,
      dismiss: dismissNotification
    },
    handlers: {
      selectRoom: handleRoomSelection,
      customizeRoom: handleRoomCustomization,
      bookOffer: handleSpecialOfferBooked,
      removeRoom: handleRemoveRoom,
      removeExtra: handleRemoveExtra,
      clearAll: handleClearAll,
      clearRooms,
      clearExtras,
      retryError: handleRetryError,
      clearError
    },
    config: {
      translations: t,
      performance: performanceRef.current
    }
  }
}