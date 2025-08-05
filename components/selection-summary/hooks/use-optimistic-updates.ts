"use client"

import { useCallback, useRef, useState } from 'react'
import type { SelectedRoom, SelectedExtra } from '@/stores/user-selections-store'

interface OptimisticUpdate {
  id: string
  type: 'add_room' | 'remove_room' | 'add_extra' | 'remove_extra' | 'update_customization'
  data: any
  timestamp: number
  confirmed: boolean
}

/**
 * Optimistic updates hook for better UX
 * 
 * Features:
 * 1. Immediate UI feedback
 * 2. Rollback on failure
 * 3. Conflict resolution
 * 4. State consistency
 */
export function useOptimisticUpdates(
  rooms: SelectedRoom[],
  extras: SelectedExtra[]
) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([])
  const updateCounterRef = useRef(0)

  // Apply optimistic update
  const applyOptimisticUpdate = useCallback((
    type: OptimisticUpdate['type'],
    data: any
  ): string => {
    const id = `optimistic-${++updateCounterRef.current}-${Date.now()}`
    
    const update: OptimisticUpdate = {
      id,
      type,
      data,
      timestamp: Date.now(),
      confirmed: false
    }
    
    setOptimisticUpdates(prev => [...prev, update])
    
    return id
  }, [])

  // Confirm successful operation
  const confirmUpdate = useCallback((updateId: string) => {
    setOptimisticUpdates(prev => 
      prev.map(update => 
        update.id === updateId 
          ? { ...update, confirmed: true }
          : update
      )
    )
    
    // Remove confirmed updates after a delay
    setTimeout(() => {
      setOptimisticUpdates(prev => 
        prev.filter(update => update.id !== updateId)
      )
    }, 1000)
  }, [])

  // Rollback failed operation
  const rollbackUpdate = useCallback((updateId: string) => {
    setOptimisticUpdates(prev => 
      prev.filter(update => update.id !== updateId)
    )
  }, [])

  // Get current optimistic state
  const getOptimisticState = useCallback(() => {
    const pendingUpdates = optimisticUpdates.filter(u => !u.confirmed)
    
    let optimisticRooms = [...rooms]
    let optimisticExtras = [...extras]
    
    for (const update of pendingUpdates) {
      switch (update.type) {
        case 'add_room':
          // Add optimistic room
          const newRoom: SelectedRoom = {
            ...update.data,
            id: update.id,
            status: 'pending_hotel' as const,
            // Mark as optimistic for UI feedback
            isOptimistic: true
          }
          optimisticRooms = [...optimisticRooms, newRoom]
          break
          
        case 'remove_room':
          optimisticRooms = optimisticRooms.filter(r => r.id !== update.data)
          break
          
        case 'add_extra':
          const newExtra: SelectedExtra = {
            ...update.data,
            id: update.id,
            status: 'pending_hotel' as const,
            // Mark as optimistic for UI feedback
            isOptimistic: true
          }
          optimisticExtras = [...optimisticExtras, newExtra]
          break
          
        case 'remove_extra':
          optimisticExtras = optimisticExtras.filter(e => e.id !== update.data)
          break
          
        case 'update_customization':
          optimisticRooms = optimisticRooms.map(room => 
            room.id === update.data.roomId
              ? {
                  ...room,
                  customizations: update.data.customizations,
                  customizationTotal: update.data.total,
                  isOptimistic: true
                }
              : room
          )
          break
      }
    }
    
    return {
      rooms: optimisticRooms,
      extras: optimisticExtras,
      hasPendingUpdates: pendingUpdates.length > 0
    }
  }, [rooms, extras, optimisticUpdates])

  // Check for conflicts
  const hasConflicts = useCallback(() => {
    const pendingUpdates = optimisticUpdates.filter(u => !u.confirmed)
    
    // Check for conflicting operations on the same resource
    const resourceOperations = new Map<string, OptimisticUpdate[]>()
    
    for (const update of pendingUpdates) {
      let resourceId: string
      
      switch (update.type) {
        case 'add_room':
        case 'remove_room':
          resourceId = `room-${update.data.id || update.data}`
          break
        case 'add_extra':
        case 'remove_extra':
          resourceId = `extra-${update.data.id || update.data}`
          break
        case 'update_customization':
          resourceId = `room-${update.data.roomId}`
          break
        default:
          continue
      }
      
      if (!resourceOperations.has(resourceId)) {
        resourceOperations.set(resourceId, [])
      }
      resourceOperations.get(resourceId)!.push(update)
    }
    
    // Check for conflicts
    for (const [resourceId, operations] of resourceOperations) {
      if (operations.length > 1) {
        // Multiple operations on same resource might conflict
        const hasAddRemoveConflict = operations.some(op => 
          op.type.includes('add')
        ) && operations.some(op => 
          op.type.includes('remove')
        )
        
        if (hasAddRemoveConflict) {
          return true
        }
      }
    }
    
    return false
  }, [optimisticUpdates])

  // Resolve conflicts by keeping the latest operation
  const resolveConflicts = useCallback(() => {
    if (!hasConflicts()) return
    
    // Group by resource and keep only the latest operation for each
    const resourceLatest = new Map<string, OptimisticUpdate>()
    
    const pendingUpdates = optimisticUpdates.filter(u => !u.confirmed)
    
    for (const update of pendingUpdates) {
      let resourceId: string
      
      switch (update.type) {
        case 'add_room':
        case 'remove_room':
          resourceId = `room-${update.data.id || update.data}`
          break
        case 'add_extra':
        case 'remove_extra':
          resourceId = `extra-${update.data.id || update.data}`
          break
        case 'update_customization':
          resourceId = `room-${update.data.roomId}`
          break
        default:
          continue
      }
      
      const existing = resourceLatest.get(resourceId)
      if (!existing || update.timestamp > existing.timestamp) {
        resourceLatest.set(resourceId, update)
      }
    }
    
    // Keep only the latest operations
    const resolvedUpdates = Array.from(resourceLatest.values())
    const conflictedIds = pendingUpdates
      .filter(u => !resolvedUpdates.includes(u))
      .map(u => u.id)
    
    setOptimisticUpdates(prev => 
      prev.filter(u => u.confirmed || !conflictedIds.includes(u.id))
    )
  }, [optimisticUpdates, hasConflicts])

  // Clear all optimistic updates
  const clearOptimisticUpdates = useCallback(() => {
    setOptimisticUpdates([])
  }, [])

  return {
    applyOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    getOptimisticState,
    hasConflicts,
    resolveConflicts,
    clearOptimisticUpdates,
    optimisticUpdates: optimisticUpdates.filter(u => !u.confirmed)
  }
}