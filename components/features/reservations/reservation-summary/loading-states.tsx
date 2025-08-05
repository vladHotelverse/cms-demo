"use client"

import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { 
  FileX, 
  Search, 
  RefreshCw, 
  Inbox,
  Filter,
  Plus
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Loading skeleton for table rows
 */
export function TableRowSkeleton({ columns = 12 }: { columns?: number }) {
  return (
    <div className="grid gap-2 px-4 py-3 border-b border-border animate-pulse" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className={`col-span-1 ${index === columns - 1 ? 'flex justify-center' : ''}`}>
          {index === columns - 1 ? (
            // Action column
            <div className="flex gap-1">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          ) : (
            // Regular column
            <Skeleton className="h-4 w-full" />
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Loading skeleton for entire table
 */
interface TableLoadingSkeletonProps {
  title: string
  columns?: number
  rows?: number
  showHeader?: boolean
}

export function TableLoadingSkeleton({ 
  title, 
  columns = 12, 
  rows = 3, 
  showHeader = true 
}: TableLoadingSkeletonProps) {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {showHeader && (
        <>
          {/* Header Skeleton */}
          <div className="bg-muted/10 border-b border-border">
            <div className="grid gap-2 px-4 py-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: columns }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-16" />
              ))}
            </div>
          </div>

          {/* Category Header Skeleton */}
          <div className="bg-muted/60 border-b border-border">
            <div className="flex items-center gap-2 bg-muted/80 rounded-md px-3 py-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </>
      )}
      
      {/* Row Skeletons */}
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} columns={columns} />
      ))}
    </div>
  )
}

/**
 * Empty state component for tables with no data
 */
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Inbox, 
  action,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-muted/5 border border-dashed border-muted-foreground/20 rounded-lg",
      className
    )}>
      <div className="p-3 bg-muted/20 rounded-full mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          variant={action.variant || 'outline'}
          onClick={action.onClick}
          className="gap-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

/**
 * Empty state for filtered results
 */
interface FilteredEmptyStateProps {
  searchQuery?: string
  activeFiltersCount?: number
  onClearFilters?: () => void
  onClearSearch?: () => void
  tableName?: string
}

export function FilteredEmptyState({
  searchQuery,
  activeFiltersCount = 0,
  onClearFilters,
  onClearSearch,
  tableName = 'items'
}: FilteredEmptyStateProps) {
  const hasSearch = Boolean(searchQuery?.trim())
  const hasFilters = activeFiltersCount > 0

  let title = `No ${tableName} found`
  let description = `There are no ${tableName} to display.`

  if (hasSearch && hasFilters) {
    title = `No ${tableName} match your search and filters`
    description = `Try adjusting your search term "${searchQuery}" or removing some filters.`
  } else if (hasSearch) {
    title = `No ${tableName} match your search`
    description = `No ${tableName} found for "${searchQuery}". Try a different search term.`
  } else if (hasFilters) {
    title = `No ${tableName} match your filters`
    description = `Try removing some filters to see more ${tableName}.`
  }

  return (
    <EmptyState
      icon={hasSearch ? Search : Filter}
      title={title}
      description={description}
      action={
        hasSearch || hasFilters
          ? {
              label: hasSearch && hasFilters 
                ? 'Clear search and filters'
                : hasSearch 
                ? 'Clear search'
                : 'Clear filters',
              onClick: () => {
                if (hasSearch && onClearSearch) onClearSearch()
                if (hasFilters && onClearFilters) onClearFilters()
              },
              variant: 'outline'
            }
          : undefined
      }
    />
  )
}

/**
 * Error state component for failed data loading
 */
interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error | string
  onRetry?: () => void
  showErrorDetails?: boolean
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'There was an error loading the data.',
  error,
  onRetry,
  showErrorDetails = false
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-red-50/50 border border-red-200 rounded-lg">
      <div className="p-3 bg-red-100 rounded-full mb-4">
        <FileX className="h-6 w-6 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-red-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-red-700 mb-4">
        {description}
      </p>

      {showErrorDetails && errorMessage && (
        <details className="mb-4 p-3 bg-red-100 rounded text-xs max-w-full overflow-auto">
          <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
          <code className="whitespace-pre-wrap break-all text-red-800">
            {errorMessage}
          </code>
        </details>
      )}
      
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="gap-2 border-red-300 text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}

/**
 * Loading overlay for tables during async operations
 */
interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  className?: string
}

export function LoadingOverlay({ 
  isLoading, 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div className={cn(
      "absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg",
      className
    )}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">
            {message}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact loading indicator for inline use
 */
export function InlineLoader({ 
  size = 'sm', 
  message,
  className 
}: { 
  size?: 'xs' | 'sm' | 'md'
  message?: string
  className?: string 
}) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5'
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <RefreshCw className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      {message && (
        <span className="text-xs text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  )
}

/**
 * Skeleton for search and filter components
 */
export function SearchFilterSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-18" />
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-18" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

/**
 * Generic data loading state with progressive enhancement
 */
interface DataLoadingStateProps {
  isLoading: boolean
  isEmpty: boolean
  hasError: boolean
  error?: Error | string
  searchQuery?: string
  activeFiltersCount?: number
  onRetry?: () => void
  onClearFilters?: () => void
  onClearSearch?: () => void
  loadingComponent: React.ReactNode
  emptyComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  children: React.ReactNode
  tableName?: string
}

export function DataLoadingState({
  isLoading,
  isEmpty,
  hasError,
  error,
  searchQuery,
  activeFiltersCount = 0,
  onRetry,
  onClearFilters,
  onClearSearch,
  loadingComponent,
  emptyComponent,
  errorComponent,
  children,
  tableName = 'items'
}: DataLoadingStateProps) {
  if (isLoading) {
    return <>{loadingComponent}</>
  }

  if (hasError) {
    return errorComponent || (
      <ErrorState
        error={error}
        onRetry={onRetry}
        showErrorDetails={process.env.NODE_ENV === 'development'}
      />
    )
  }

  if (isEmpty) {
    return emptyComponent || (
      <FilteredEmptyState
        searchQuery={searchQuery}
        activeFiltersCount={activeFiltersCount}
        onClearFilters={onClearFilters}
        onClearSearch={onClearSearch}
        tableName={tableName}
      />
    )
  }

  return <>{children}</>
}