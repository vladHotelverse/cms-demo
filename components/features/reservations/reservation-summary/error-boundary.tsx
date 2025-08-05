"use client"

import React, { Component, ReactNode } from 'react'
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, FileX } from "lucide-react"

interface ErrorInfo {
  componentStack: string
  errorBoundary?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  maxRetries?: number
  resetOnPropsChange?: boolean
  resetKeys?: Array<string | number>
}

/**
 * Enhanced Error Boundary component with retry logic and customizable fallbacks
 * Handles both sync and async errors in table components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null
  private previousResetKeys: Array<string | number> = []

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error for monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    // Reset error boundary when reset keys change
    if (hasError && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (resetKey, idx) => this.previousResetKeys[idx] !== resetKey
      )
      
      if (hasResetKeyChanged) {
        this.resetErrorBoundary()
      }
    }

    // Reset on any prop change if enabled
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary()
    }

    this.previousResetKeys = resetKeys || []
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        retryCount: prevState.retryCount + 1
      }))

      // Auto-retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetErrorBoundary()
      }, delay)
    }
  }

  render() {
    const { hasError, error, retryCount } = this.state
    const { children, fallback, maxRetries = 3 } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.handleRetry)
      }

      // Default fallback UI
      return <DefaultErrorFallback 
        error={error}
        retryCount={retryCount}
        maxRetries={maxRetries}
        onRetry={this.handleRetry}
        onReset={this.resetErrorBoundary}
      />
    }

    return children
  }
}

interface DefaultErrorFallbackProps {
  error: Error
  retryCount: number
  maxRetries: number
  onRetry: () => void
  onReset: () => void
}

function DefaultErrorFallback({ 
  error, 
  retryCount, 
  maxRetries, 
  onRetry, 
  onReset 
}: DefaultErrorFallbackProps) {
  const canRetry = retryCount < maxRetries
  const isNetworkError = error.message.toLowerCase().includes('network') || 
                        error.message.toLowerCase().includes('fetch')

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-muted/5 border border-dashed border-muted-foreground/20 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        {isNetworkError ? (
          <div className="p-2 bg-orange-100 rounded-full">
            <RefreshCw className="h-5 w-5 text-orange-600" />
          </div>
        ) : (
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground">
            {isNetworkError ? 'Connection Error' : 'Something went wrong'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isNetworkError 
              ? 'Unable to load data. Please check your connection.'
              : 'An unexpected error occurred while loading the content.'
            }
          </p>
        </div>
      </div>

      {/* Error details (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mb-4 p-3 bg-muted rounded text-xs max-w-full overflow-auto">
          <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
          <code className="whitespace-pre-wrap break-all">{error.message}</code>
        </details>
      )}

      {/* Retry information */}
      {retryCount > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          Retry attempt {retryCount} of {maxRetries}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        {canRetry ? (
          <Button 
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        ) : (
          <Button 
            onClick={onReset}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {!canRetry && (
        <p className="text-xs text-muted-foreground mt-2">
          Maximum retry attempts reached. Please refresh the page.
        </p>
      )}
    </div>
  )
}

/**
 * Hook for using error boundary functionality in functional components
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error
    setError(errorObj)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Specialized error boundary for table components
 */
export function TableErrorBoundary({ 
  children, 
  tableName 
}: { 
  children: ReactNode
  tableName: string 
}) {
  const tableFallback = (error: Error, retry: () => void) => (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <FileX className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Failed to load {tableName}</h4>
            <p className="text-sm text-muted-foreground">
              There was an error loading the {tableName.toLowerCase()} data.
            </p>
          </div>
        </div>
        <Button onClick={retry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reload {tableName}
        </Button>
      </div>
    </div>
  )

  return (
    <ErrorBoundary 
      fallback={tableFallback}
      onError={(error, errorInfo) => {
        console.error(`Error in ${tableName} table:`, error, errorInfo)
      }}
    >
      {children}
    </ErrorBoundary>
  )
}