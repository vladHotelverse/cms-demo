"use client"

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { CheckCircle, XCircle, Info, AlertCircle, X, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

// Advanced notification management types
interface NotificationGroup {
  id: string
  type: NotificationType
  title: string
  messages: string[]
  count: number
  firstTimestamp: number
  lastTimestamp: number
  duration?: number
}

interface QueuedNotification {
  notification: Notification
  priority: 'low' | 'medium' | 'high' | 'critical'
  batchKey?: string
}

// Smart deduplication configuration
interface DeduplicationConfig {
  enabled: boolean
  timeWindow: number // ms within which to group similar notifications
  maxGroupSize: number
  groupByTitle: boolean
  groupByType: boolean
}

// Notification analytics for optimization
interface NotificationMetrics {
  totalShown: number
  totalDismissed: number
  totalExpired: number
  averageViewTime: number
  dismissalRate: number
  groupingEfficiency: number
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  priority?: 'low' | 'medium' | 'high' | 'critical'
  batchKey?: string // For grouping related notifications
  metadata?: Record<string, any>
  timestamp?: number
  viewStartTime?: number
  dismissedAt?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  id: string
  label: string
  variant?: 'default' | 'destructive' | 'outline'
  onClick: () => void
}

interface SelectionNotificationsProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  maxVisible?: number
  enableGrouping?: boolean
  enableBatching?: boolean
  deduplicationConfig?: Partial<DeduplicationConfig>
  onNotificationView?: (notification: Notification) => void
  onNotificationDismiss?: (notification: Notification, reason: 'user' | 'timeout' | 'batch') => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle
}

const colorMap = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
}

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500'
}

export function SelectionNotifications({ 
  notifications, 
  onDismiss,
  position = 'top-right',
  maxVisible = 5,
  enableGrouping = true,
  enableBatching = true,
  deduplicationConfig = {},
  onNotificationView,
  onNotificationDismiss
}: SelectionNotificationsProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])
  const [groupedNotifications, setGroupedNotifications] = useState<NotificationGroup[]>([])
  const [isProcessingBatch, setIsProcessingBatch] = useState(false)
  const [metrics, setMetrics] = useState<NotificationMetrics>({
    totalShown: 0,
    totalDismissed: 0,
    totalExpired: 0,
    averageViewTime: 0,
    dismissalRate: 0,
    groupingEfficiency: 0
  })
  
  const queueRef = useRef<QueuedNotification[]>([])
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const viewTimersRef = useRef<Map<string, number>>(new Map())
  
  // Default deduplication configuration
  const dedupeConfig: DeduplicationConfig = useMemo(() => ({
    enabled: true,
    timeWindow: 2000, // 2 seconds
    maxGroupSize: 5,
    groupByTitle: true,
    groupByType: true,
    ...deduplicationConfig
  }), [deduplicationConfig])

  // Smart deduplication algorithm
  const deduplicateNotifications = useCallback((newNotifications: Notification[]) => {
    if (!dedupeConfig.enabled) return newNotifications
    
    const deduped: Notification[] = []
    const processedKeys = new Set<string>()
    
    for (const notification of newNotifications) {
      const dedupeKey = `${dedupeConfig.groupByType ? notification.type : 'any'}_${dedupeConfig.groupByTitle ? notification.title : notification.id}`
      
      if (processedKeys.has(dedupeKey)) {
        // Find existing notification and merge
        const existing = deduped.find(n => {
          const existingKey = `${dedupeConfig.groupByType ? n.type : 'any'}_${dedupeConfig.groupByTitle ? n.title : n.id}`
          return existingKey === dedupeKey
        })
        
        if (existing && notification.timestamp && existing.timestamp) {
          const timeDiff = notification.timestamp - existing.timestamp
          if (timeDiff <= dedupeConfig.timeWindow) {
            // Update existing notification with latest info
            existing.message = notification.message || existing.message
            existing.timestamp = notification.timestamp
            continue
          }
        }
      }
      
      processedKeys.add(dedupeKey)
      deduped.push(notification)
    }
    
    return deduped
  }, [dedupeConfig])
  
  // Group similar notifications for better UX
  const groupNotifications = useCallback((notifications: Notification[]) => {
    if (!enableGrouping) return []
    
    const groups = new Map<string, NotificationGroup>()
    
    for (const notification of notifications) {
      const groupKey = `${notification.type}_${notification.title}`
      const existing = groups.get(groupKey)
      
      if (existing && notification.timestamp) {
        const timeDiff = notification.timestamp - existing.lastTimestamp
        if (timeDiff <= dedupeConfig.timeWindow && existing.count < dedupeConfig.maxGroupSize) {
          existing.messages.push(notification.message || '')
          existing.count += 1
          existing.lastTimestamp = notification.timestamp
          continue
        }
      }
      
      if (!existing) {
        groups.set(groupKey, {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          messages: [notification.message || ''],
          count: 1,
          firstTimestamp: notification.timestamp || Date.now(),
          lastTimestamp: notification.timestamp || Date.now(),
          duration: notification.duration
        })
      }
    }
    
    return Array.from(groups.values())
  }, [enableGrouping, dedupeConfig.timeWindow, dedupeConfig.maxGroupSize])
  
  // Process notification queue with batching
  const processNotificationQueue = useCallback(async () => {
    if (isProcessingBatch || queueRef.current.length === 0) return
    
    setIsProcessingBatch(true)
    
    try {
      // Sort by priority
      const sortedQueue = [...queueRef.current].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
      
      // Take only the visible amount
      const toProcess = sortedQueue.slice(0, maxVisible)
      const newNotifications = toProcess.map(q => ({
        ...q.notification,
        timestamp: q.notification.timestamp || Date.now(),
        viewStartTime: Date.now()
      }))
      
      // Apply deduplication
      const deduplicated = deduplicateNotifications(newNotifications)
      
      // Update visible notifications
      setVisibleNotifications(prev => {
        const combined = [...prev, ...deduplicated]
        return combined.slice(-maxVisible) // Keep only the latest maxVisible notifications
      })
      
      // Update grouped notifications if enabled
      if (enableGrouping) {
        const grouped = groupNotifications(deduplicated)
        setGroupedNotifications(prev => [...prev, ...grouped])
      }
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        totalShown: prev.totalShown + deduplicated.length,
        groupingEfficiency: enableGrouping ? 
          (newNotifications.length - deduplicated.length) / newNotifications.length * 100 : 0
      }))
      
      // Clear processed items from queue
      queueRef.current = queueRef.current.slice(toProcess.length)
      
      // Trigger view callbacks
      deduplicated.forEach(notification => {
        onNotificationView?.(notification)
        viewTimersRef.current.set(notification.id, Date.now())
      })
      
    } finally {
      setIsProcessingBatch(false)
    }
  }, [isProcessingBatch, maxVisible, deduplicateNotifications, enableGrouping, groupNotifications, onNotificationView])
  
  // Queue new notifications for batch processing
  useEffect(() => {
    const newNotifications = notifications.filter(n => 
      !visibleNotifications.some(v => v.id === n.id)
    )
    
    if (newNotifications.length > 0) {
      // Add to queue with priority
      const queuedItems: QueuedNotification[] = newNotifications.map(notification => ({
        notification,
        priority: notification.priority || 
          (notification.type === 'error' ? 'high' : 
           notification.type === 'warning' ? 'medium' : 'low'),
        batchKey: notification.batchKey
      }))
      
      queueRef.current.push(...queuedItems)
      
      // Process queue with debouncing
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }
      
      processingTimeoutRef.current = setTimeout(() => {
        processNotificationQueue()
      }, enableBatching ? 150 : 0) // 150ms batching delay
    }
  }, [notifications, visibleNotifications, processNotificationQueue, enableBatching])

  // Enhanced timer management with metrics tracking
  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    visibleNotifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          // Calculate view time for metrics
          const viewStartTime = viewTimersRef.current.get(notification.id)
          if (viewStartTime) {
            const viewTime = Date.now() - viewStartTime
            setMetrics(prev => ({
              ...prev,
              totalExpired: prev.totalExpired + 1,
              averageViewTime: (prev.averageViewTime * prev.totalExpired + viewTime) / (prev.totalExpired + 1)
            }))
            viewTimersRef.current.delete(notification.id)
          }
          
          onNotificationDismiss?.(notification, 'timeout')
          onDismiss(notification.id)
        }, notification.duration)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [visibleNotifications, onDismiss, onNotificationDismiss])
  
  // Enhanced dismiss handler with metrics
  const handleDismiss = useCallback((notificationId: string, reason: 'user' | 'timeout' | 'batch' = 'user') => {
    const notification = visibleNotifications.find(n => n.id === notificationId)
    if (notification) {
      // Calculate view time
      const viewStartTime = viewTimersRef.current.get(notificationId)
      if (viewStartTime) {
        const viewTime = Date.now() - viewStartTime
        setMetrics(prev => ({
          ...prev,
          totalDismissed: prev.totalDismissed + 1,
          averageViewTime: (prev.averageViewTime * prev.totalDismissed + viewTime) / (prev.totalDismissed + 1),
          dismissalRate: (prev.totalDismissed + 1) / (prev.totalShown || 1) * 100
        }))
        viewTimersRef.current.delete(notificationId)
      }
      
      onNotificationDismiss?.(notification, reason)
    }
    
    // Remove from visible notifications immediately
    setVisibleNotifications(prev => prev.filter(n => n.id !== notificationId))
    
    // Also call the parent's onDismiss handler
    onDismiss(notificationId)
  }, [visibleNotifications, onDismiss, onNotificationDismiss])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current)
      }
      viewTimersRef.current.clear()
    }
  }, [])

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  return (
    <>
      {/* Main notifications container */}
      <div 
        className={cn(
          'fixed z-50 space-y-2 max-w-sm',
          positionClasses[position]
        )}
        aria-live="polite"
      >
        {/* Individual notifications */}
        {visibleNotifications.map((notification, index) => {
          const Icon = iconMap[notification.type]
          const isStacked = index >= 3
          
          return (
            <div
              key={notification.id}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out',
                colorMap[notification.type],
                'animate-in slide-in-from-right',
                isStacked && 'scale-95 opacity-75 transform translate-y-2'
              )}
              style={{
                zIndex: 50 - index,
                transform: isStacked ? `translateY(-${(index - 2) * 4}px) scale(${1 - (index - 2) * 0.05})` : undefined
              }}
              role="alert"
            >
              <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorMap[notification.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{notification.title}</p>
                  {notification.priority === 'critical' && (
                    <Zap className="h-3 w-3 text-red-500" />
                  )}
                  {notification.batchKey && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full" title="Batched notification" />
                  )}
                </div>
                {notification.message && (
                  <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                )}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {notification.actions.map(action => (
                      <button
                        key={action.id}
                        onClick={action.onClick}
                        className={cn(
                          'px-2 py-1 text-xs rounded',
                          action.variant === 'destructive' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                          action.variant === 'outline' ? 'border border-current text-current hover:bg-current/10' :
                          'bg-current/10 text-current hover:bg-current/20'
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDismiss(notification.id, 'user')}
                className="flex-shrink-0 ml-2 p-1 rounded hover:bg-black/10 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
        
        {/* Queue overflow indicator */}
        {queueRef.current.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{queueRef.current.length} more notifications queued</span>
          </div>
        )}
      </div>
      
      {/* Development metrics */}
      {process.env.NODE_ENV === 'development' && metrics.totalShown > 0 && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs z-40">
          <div className="font-medium mb-1">Notification Metrics</div>
          <div className="space-y-1">
            <div>Shown: {metrics.totalShown} | Dismissed: {metrics.totalDismissed}</div>
            <div>Avg View: {Math.round(metrics.averageViewTime)}ms</div>
            <div>Dismiss Rate: {Math.round(metrics.dismissalRate)}%</div>
            {enableGrouping && (
              <div>Grouping Efficiency: {Math.round(metrics.groupingEfficiency)}%</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// Enhanced hook for managing notifications with advanced features
export function useSelectionNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [batchConfig, setBatchConfig] = useState({
    enabled: true,
    batchSize: 3,
    batchDelay: 200
  })
  
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const batchQueueRef = useRef<Notification[]>([])
  
  // Smart notification creation with deduplication
  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration: number = 5000,
    options: {
      priority?: 'low' | 'medium' | 'high' | 'critical'
      batchKey?: string
      actions?: NotificationAction[]
      metadata?: Record<string, any>
    } = {}
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      priority: options.priority || 'medium',
      batchKey: options.batchKey,
      actions: options.actions,
      metadata: options.metadata,
      timestamp: Date.now()
    }
    
    // Check for immediate duplicates
    const isDuplicate = notifications.some(n => 
      n.title === title && 
      n.type === type && 
      n.timestamp && 
      notification.timestamp && 
      (notification.timestamp - n.timestamp) < 1000
    )
    
    if (isDuplicate) {
      return id // Return early for duplicates
    }
    
    if (batchConfig.enabled && options.batchKey) {
      // Add to batch queue
      batchQueueRef.current.push(notification)
      
      // Process batch when size limit reached or after delay
      if (batchQueueRef.current.length >= batchConfig.batchSize) {
        processBatch()
      } else {
        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current)
        }
        batchTimeoutRef.current = setTimeout(processBatch, batchConfig.batchDelay)
      }
    } else {
      // Add immediately
      setNotifications(prev => [...prev, notification])
    }
    
    return id
  }, [notifications, batchConfig])
  
  // Process batched notifications
  const processBatch = useCallback(() => {
    if (batchQueueRef.current.length === 0) return
    
    const batch = [...batchQueueRef.current]
    batchQueueRef.current = []
    
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current)
      batchTimeoutRef.current = null
    }
    
    // Group by batch key
    const groups = new Map<string, Notification[]>()
    batch.forEach(notification => {
      const key = notification.batchKey || notification.id
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(notification)
    })
    
    // Create grouped notifications
    const groupedNotifications = Array.from(groups.values()).map(group => {
      if (group.length === 1) {
        return group[0]
      }
      
      // Merge multiple notifications
      const first = group[0]
      return {
        ...first,
        title: `${first.title} (${group.length} items)`,
        message: group.map(n => n.message).filter(Boolean).join(', '),
        metadata: {
          ...first.metadata,
          batchCount: group.length,
          batchItems: group
        }
      }
    })
    
    setNotifications(prev => [...prev, ...groupedNotifications])
  }, [])
  
  // Enhanced dismiss with batch support
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id)
      
      // If this is a batched notification, handle specially
      if (notification?.metadata?.batchItems) {
        // Could expand to show individual items or just dismiss
      }
      
      return prev.filter(n => n.id !== id)
    })
  }, [])
  
  // Bulk operations
  const dismissByType = useCallback((type: NotificationType) => {
    setNotifications(prev => prev.filter(n => n.type !== type))
  }, [])
  
  const dismissByBatchKey = useCallback((batchKey: string) => {
    setNotifications(prev => prev.filter(n => n.batchKey !== batchKey))
  }, [])
  
  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    batchQueueRef.current = []
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current)
      batchTimeoutRef.current = null
    }
  }, [])
  
  // Batch configuration
  const updateBatchConfig = useCallback((config: Partial<typeof batchConfig>) => {
    setBatchConfig(prev => ({ ...prev, ...config }))
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current)
      }
    }
  }, [])

  return {
    notifications,
    showNotification,
    dismissNotification,
    dismissByType,
    dismissByBatchKey,
    clearAllNotifications,
    updateBatchConfig,
    batchConfig,
    
    // Enhanced convenience methods
    showSuccess: (title: string, message?: string, duration?: number, options?: Parameters<typeof showNotification>[4]) => 
      showNotification('success', title, message, duration, options),
    showError: (title: string, message?: string, duration?: number, options?: Parameters<typeof showNotification>[4]) => 
      showNotification('error', title, message, duration, options),
    showInfo: (title: string, message?: string, duration?: number, options?: Parameters<typeof showNotification>[4]) => 
      showNotification('info', title, message, duration, options),
    showWarning: (title: string, message?: string, duration?: number, options?: Parameters<typeof showNotification>[4]) => 
      showNotification('warning', title, message, duration, options),
    
    // Batch convenience methods
    showBatchedSuccess: (title: string, message?: string, batchKey?: string) => 
      showNotification('success', title, message, 5000, { batchKey }),
    showBatchedError: (title: string, message?: string, batchKey?: string) => 
      showNotification('error', title, message, 8000, { batchKey, priority: 'high' }),
    showBatchedInfo: (title: string, message?: string, batchKey?: string) => 
      showNotification('info', title, message, 4000, { batchKey }),
    showBatchedWarning: (title: string, message?: string, batchKey?: string) => 
      showNotification('warning', title, message, 6000, { batchKey, priority: 'medium' })
  }
}

// Export additional types and utilities
export type { NotificationGroup, QueuedNotification, DeduplicationConfig, NotificationMetrics }