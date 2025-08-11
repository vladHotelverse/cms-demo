// Lightweight fallback states to avoid missing module errors
function LoadingState({ message, className }: { message?: string; className?: string }) {
  return <div className={className}>{message || 'Loading...'}</div>
}
function ErrorState({ title, message, onRetry, className }: { title?: string; message?: string; onRetry?: () => void; className?: string }) {
  return (
    <div className={className}>
      <div>{title || 'Error'}</div>
      <div>{message || 'Something went wrong'}</div>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  )
}
function EmptyState({ title, message, actionLabel, onAction, className }: { title?: string; message?: string; actionLabel?: string; onAction?: () => void; className?: string }) {
  return (
    <div className={className}>
      <div>{title || 'No data'}</div>
      <div>{message || 'There is nothing to display'}</div>
      {onAction && <button onClick={onAction}>{actionLabel || 'Action'}</button>}
    </div>
  )
}

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