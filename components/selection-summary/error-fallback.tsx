"use client"

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

/**
 * Error fallback component for error boundaries
 */
export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          We encountered an error while loading your selections. This might be due to a temporary network issue or a problem with the data.
        </p>
        
        {/* Error details in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg text-sm">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 text-red-600 whitespace-pre-wrap">
              {error.message}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={resetErrorBoundary} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}