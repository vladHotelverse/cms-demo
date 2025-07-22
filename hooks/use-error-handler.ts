import { useCallback } from 'react'
import { toast } from 'sonner'

interface ErrorHandlerOptions {
  showToast?: boolean
  fallbackMessage?: string
  onError?: (error: Error | string) => void
}

interface UseErrorHandlerReturn {
  handleError: (error: unknown, options?: ErrorHandlerOptions) => void
  handleAsyncError: <T>(
    operation: () => Promise<T>,
    options?: ErrorHandlerOptions
  ) => Promise<T | null>
}

export function useErrorHandler(): UseErrorHandlerReturn {
  const handleError = useCallback((error: unknown, options: ErrorHandlerOptions = {}) => {
    const {
      showToast = true,
      fallbackMessage = 'An unexpected error occurred',
      onError
    } = options

    let errorMessage: string

    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else {
      errorMessage = fallbackMessage
    }

    // Log error for debugging
    console.error('Error handled:', error)

    // Show toast notification
    if (showToast) {
      toast.error(errorMessage)
    }

    // Call custom error handler
    if (onError) {
      onError(error instanceof Error ? error : errorMessage)
    }
  }, [])

  const handleAsyncError = useCallback(async <T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await operation()
    } catch (error) {
      handleError(error, options)
      return null
    }
  }, [handleError])

  return {
    handleError,
    handleAsyncError
  }
}