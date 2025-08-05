"use client"

import { useCallback, useRef, useState, useEffect } from 'react'

interface QueuedOperation {
  id: string
  operation: () => Promise<any>
  priority: 'low' | 'medium' | 'high' | 'critical'
  dedupKey?: string
  maxRetries?: number
  retryCount: number
  timestamp: number
  onSuccess?: (result: any) => void
  onError?: (error: any) => void
}

interface UseOperationQueueOptions {
  batchSize: number
  processingDelay: number
  maxRetries: number
  enableDeduplication?: boolean
}

/**
 * Enhanced operation queue with better performance and reliability
 * 
 * Features:
 * 1. Priority-based processing
 * 2. Automatic deduplication
 * 3. Exponential backoff retry
 * 4. Memory-efficient queue management
 * 5. Network resilience
 */
export function useOperationQueue({
  batchSize = 5,
  processingDelay = 300,
  maxRetries = 3,
  enableDeduplication = true
}: UseOperationQueueOptions) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [queueSize, setQueueSize] = useState(0)
  
  const queueRef = useRef<QueuedOperation[]>([])
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activeOperationsRef = useRef(new Set<string>())
  
  // Performance metrics
  const metricsRef = useRef({
    totalProcessed: 0,
    totalFailed: 0,
    averageProcessingTime: 0,
    deduplicationSaved: 0
  })

  // Deduplication logic
  const deduplicateQueue = useCallback(() => {
    if (!enableDeduplication) return
    
    const seen = new Map<string, number>()
    const deduplicated: QueuedOperation[] = []
    let duplicateCount = 0
    
    // Process in reverse to keep newest operations
    for (let i = queueRef.current.length - 1; i >= 0; i--) {
      const operation = queueRef.current[i]
      const key = operation.dedupKey || operation.id
      
      if (!seen.has(key)) {
        seen.set(key, deduplicated.length)
        deduplicated.unshift(operation) // Add to beginning to maintain order
      } else {
        duplicateCount++
        // Cancel duplicate operation
        operation.onError?.(new Error('Operation superseded'))
      }
    }
    
    if (duplicateCount > 0) {
      queueRef.current = deduplicated
      metricsRef.current.deduplicationSaved += duplicateCount
      setQueueSize(deduplicated.length)
    }
  }, [enableDeduplication])

  // Enhanced queue processor with better error handling
  const processQueue = useCallback(async () => {
    if (isProcessing || queueRef.current.length === 0) return
    
    setIsProcessing(true)
    
    try {
      // Deduplicate before processing
      deduplicateQueue()
      
      // Sort by priority and timestamp
      const sortedQueue = [...queueRef.current].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff
        return a.timestamp - b.timestamp // FIFO for same priority
      })
      
      // Process in batches
      const batch = sortedQueue.slice(0, batchSize)
      const remaining = sortedQueue.slice(batchSize)
      
      // Update queue
      queueRef.current = remaining
      setQueueSize(remaining.length)
      
      // Process batch with controlled concurrency
      const batchPromises = batch.map(async (operation) => {
        const startTime = Date.now()
        
        try {
          // Mark as active
          activeOperationsRef.current.add(operation.id)
          
          const result = await operation.operation()
          
          // Update metrics
          const processingTime = Date.now() - startTime
          metricsRef.current.totalProcessed++
          metricsRef.current.averageProcessingTime = 
            (metricsRef.current.averageProcessingTime + processingTime) / 2
          
          operation.onSuccess?.(result)
          return { success: true, operation, result }
          
        } catch (error) {
          // Retry logic with exponential backoff
          if (operation.retryCount < (operation.maxRetries || maxRetries)) {
            const backoffDelay = Math.min(1000 * Math.pow(2, operation.retryCount), 10000)
            
            setTimeout(() => {
              const retryOperation = {
                ...operation,
                retryCount: operation.retryCount + 1,
                timestamp: Date.now()
              }
              queueRef.current.unshift(retryOperation) // High priority for retries
              setQueueSize(prev => prev + 1)
            }, backoffDelay)
            
            return { success: false, operation, error, retry: true }
          } else {
            // Max retries reached
            metricsRef.current.totalFailed++
            operation.onError?.(error)
            return { success: false, operation, error, retry: false }
          }
        } finally {
          activeOperationsRef.current.delete(operation.id)
        }
      })
      
      // Wait for batch to complete
      const results = await Promise.allSettled(batchPromises)
      
      // Log batch results in development
      if (process.env.NODE_ENV === 'development') {
        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
        const failed = results.filter(r => r.status === 'fulfilled' && !r.value.success).length
        console.log(`Batch processed: ${successful} succeeded, ${failed} failed`)
      }
      
    } catch (error) {
      console.error('Queue processing error:', error)
    } finally {
      setIsProcessing(false)
      
      // Continue processing if queue is not empty
      if (queueRef.current.length > 0) {
        processingTimeoutRef.current = setTimeout(() => {
          processQueue()
        }, processingDelay)
      }
    }
  }, [isProcessing, batchSize, processingDelay, maxRetries, deduplicateQueue])

  // Enhanced enqueue with better options
  const enqueueOperation = useCallback((
    operation: () => Promise<any>,
    options: {
      id?: string
      priority?: 'low' | 'medium' | 'high' | 'critical'
      dedupKey?: string
      maxRetries?: number
      onSuccess?: (result: any) => void
      onError?: (error: any) => void
    } = {}
  ) => {
    const operationId = options.id || `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Check if operation is already active
    if (activeOperationsRef.current.has(operationId)) {
      console.warn(`Operation ${operationId} is already active, skipping`)
      return operationId
    }
    
    const queuedOperation: QueuedOperation = {
      id: operationId,
      operation,
      priority: options.priority || 'medium',
      dedupKey: options.dedupKey,
      maxRetries: options.maxRetries || maxRetries,
      retryCount: 0,
      timestamp: Date.now(),
      onSuccess: options.onSuccess,
      onError: options.onError
    }
    
    queueRef.current.push(queuedOperation)
    setQueueSize(prev => prev + 1)
    
    // Trigger processing with debouncing
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
    }
    
    const delay = options.priority === 'critical' ? 0 : processingDelay
    processingTimeoutRef.current = setTimeout(processQueue, delay)
    
    return operationId
  }, [maxRetries, processingDelay, processQueue])

  // Clear queue
  const clearQueue = useCallback(() => {
    // Cancel all pending operations
    queueRef.current.forEach(op => {
      op.onError?.(new Error('Queue cleared'))
    })
    
    queueRef.current = []
    activeOperationsRef.current.clear()
    setQueueSize(0)
    
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current)
      processingTimeoutRef.current = null
    }
  }, [])

  // Cancel specific operation
  const cancelOperation = useCallback((operationId: string) => {
    // Remove from queue
    const index = queueRef.current.findIndex(op => op.id === operationId)
    if (index !== -1) {
      const operation = queueRef.current[index]
      operation.onError?.(new Error('Operation cancelled'))
      queueRef.current.splice(index, 1)
      setQueueSize(prev => prev - 1)
      return true
    }
    
    // Mark active operation for cancellation
    if (activeOperationsRef.current.has(operationId)) {
      activeOperationsRef.current.delete(operationId)
      return true
    }
    
    return false
  }, [])

  // Get queue status
  const getQueueStatus = useCallback(() => {
    const priorityCounts = queueRef.current.reduce((acc, op) => {
      acc[op.priority] = (acc[op.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      size: queueSize,
      isProcessing,
      activeOperations: activeOperationsRef.current.size,
      priorityCounts,
      metrics: metricsRef.current
    }
  }, [queueSize, isProcessing])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearQueue()
    }
  }, [clearQueue])

  // Auto-process queue when it becomes non-empty
  useEffect(() => {
    if (queueSize > 0 && !isProcessing && !processingTimeoutRef.current) {
      processingTimeoutRef.current = setTimeout(processQueue, processingDelay)
    }
  }, [queueSize, isProcessing, processQueue, processingDelay])

  return {
    enqueueOperation,
    processQueue,
    clearQueue,
    cancelOperation,
    getQueueStatus,
    queueSize,
    isProcessing
  }
}