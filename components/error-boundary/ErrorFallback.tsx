/**
 * Error Fallback component for displaying user-friendly error messages
 */
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
  errorInfo?: React.ErrorInfo
}

/**
 * Default error fallback component
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  errorInfo
}) => {
  const router = useRouter()
  const [showDetails, setShowDetails] = React.useState(false)

  const handleGoHome = () => {
    router.push('/')
  }

  const handleReload = () => {
    window.location.reload()
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error message for users */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              {error.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleReload} className="flex-1">
              Reload Page
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Development details */}
          {isDevelopment && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full"
              >
                <Bug className="w-4 h-4 mr-2" />
                {showDetails ? 'Hide' : 'Show'} Technical Details
              </Button>
              
              {showDetails && (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <h4 className="font-semibold text-sm mb-2">Error Stack:</h4>
                    <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                  
                  {errorInfo && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h4 className="font-semibold text-sm mb-2">Component Stack:</h4>
                      <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Minimal error fallback for smaller components
 */
export const MinimalErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError
}) => {
  return (
    <Alert className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2">
        {error.message || 'Something went wrong'}
        <Button
          variant="outline"
          size="sm"
          onClick={resetError}
          className="ml-2"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ErrorFallback
