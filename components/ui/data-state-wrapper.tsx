import { LoadingState } from "./loading-state"
import { ErrorState } from "./error-state"
import { EmptyState } from "./empty-state"

interface DataStateWrapperProps {
  isLoading?: boolean
  error?: string | Error | null
  data?: any[] | null
  isEmpty?: boolean
  children: React.ReactNode
  loadingMessage?: string
  errorTitle?: string
  errorMessage?: string
  emptyTitle?: string
  emptyMessage?: string
  emptyActionLabel?: string
  onRetry?: () => void
  onEmptyAction?: () => void
  className?: string
}

export function DataStateWrapper({
  isLoading = false,
  error = null,
  data = null,
  isEmpty = false,
  children,
  loadingMessage,
  errorTitle,
  errorMessage,
  emptyTitle,
  emptyMessage,
  emptyActionLabel,
  onRetry,
  onEmptyAction,
  className
}: DataStateWrapperProps) {
  // Loading state
  if (isLoading) {
    return <LoadingState message={loadingMessage} className={className} />
  }

  // Error state
  if (error) {
    const errorMsg = error instanceof Error ? error.message : error
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage || errorMsg}
        onRetry={onRetry}
        className={className}
      />
    )
  }

  // Empty state
  const isDataEmpty = isEmpty || (Array.isArray(data) && data.length === 0)
  if (isDataEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        className={className}
      />
    )
  }

  // Content
  return <>{children}</>
}