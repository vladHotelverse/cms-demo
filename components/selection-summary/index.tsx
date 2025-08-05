"use client"

import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { SelectionHeader } from './selection-header'
import { SelectionTables } from './selection-tables'
import { SelectionNotifications } from './selection-notifications'
import { LoadingFallback } from './loading-fallback'
import { ErrorFallback } from './error-fallback'
import { useSelectionSummary } from './use-selection-summary'
import { cn } from '@/lib/utils'
import type { SelectionSummaryProps } from './types'

/**
 * Refactored SelectionSummary - Main container component
 * 
 * Key improvements:
 * 1. Separation of concerns - UI container only
 * 2. Error boundary with proper fallbacks
 * 3. Suspense for lazy loading
 * 4. Simplified prop interface
 * 5. Better performance with targeted re-renders
 */
export function SelectionSummary({
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
    selections,
    operations,
    notifications,
    handlers,
    config
  } = useSelectionSummary({
    onRoomSelectionChange,
    onRoomCustomizationChange,
    onSpecialOfferBooked,
    currentRoomCustomizations,
    reservationInfo,
    translations
  })

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to monitoring service
        console.error('SelectionSummary Error:', error, errorInfo)
      }}
      onReset={() => {
        // Reset component state
        handlers.clearAll()
      }}
    >
      <div className={cn('relative space-y-4', className)} data-testid="selection-summary">
        {/* Notifications System */}
        {showNotifications && (
          <SelectionNotifications
            notifications={notifications.items}
            onDismiss={notifications.dismiss}
            position={notificationPosition}
            maxVisible={3}
            enableGrouping={true}
            enableBatching={true}
          />
        )}

        {/* Selection Header with Summary */}
        <SelectionHeader
          counts={selections.counts}
          totalPrice={selections.totalPrice}
          isLoading={operations.isLoading}
          onClearAll={handlers.clearAll}
          translations={config.translations}
        />

        {/* Selection Tables */}
        <Suspense fallback={<LoadingFallback />}>
          <SelectionTables
            rooms={selections.rooms}
            extras={selections.extras}
            onRemoveRoom={handlers.removeRoom}
            onRemoveExtra={handlers.removeExtra}
            onClearRooms={handlers.clearRooms}
            onClearExtras={handlers.clearExtras}
            isLoading={operations.isLoading}
            errors={operations.errors}
            translations={config.translations}
          />
        </Suspense>

        {/* Operation Status Indicator */}
        {operations.pendingCount > 0 && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
            {operations.pendingCount} operations pending...
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

SelectionSummary.displayName = 'SelectionSummary'

// Re-export types and utilities for backward compatibility
export type { SelectionSummaryProps } from './types'
export { useSelectionSummary } from './use-selection-summary'