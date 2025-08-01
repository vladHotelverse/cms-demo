"use client";

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

/**
 * Performance-optimized error boundary for selection management operations
 * 
 * Features:
 * - Automatic error recovery with retry mechanism
 * - Error reporting and logging
 * - Graceful fallback UI
 * - Performance monitoring integration
 */
export class SelectionErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private readonly maxRetries = 3;
  private retryCount = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `selection-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error with context
    console.error('SelectionErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      errorInfo: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Report to error monitoring service
    this.reportError(error, errorInfo);

    // Attempt automatic recovery for specific error types
    this.attemptAutoRecovery(error);
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Integration point for error monitoring services (Sentry, Bugsnag, etc.)
    if (typeof window !== 'undefined' && window.console) {
      console.group('🚨 Selection Management Error Report');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', this.state.errorId);
      console.groupEnd();
    }
  };

  private attemptAutoRecovery = (error: Error) => {
    // Only attempt recovery for recoverable errors
    const recoverableErrors = [
      'ChunkLoadError',
      'Loading chunk',
      'NetworkError',
      'Failed to fetch'
    ];

    const isRecoverable = recoverableErrors.some(pattern => 
      error.message.includes(pattern) || error.name.includes(pattern)
    );

    if (isRecoverable && this.retryCount < this.maxRetries) {
      this.retryCount++;
      
      // Exponential backoff for retry
      const retryDelay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 10000);
      
      console.info(`Attempting auto-recovery (${this.retryCount}/${this.maxRetries}) in ${retryDelay}ms...`);
      
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, retryDelay);
    }
  };

  private handleRetry = () => {
    console.info('Attempting error recovery...');
    
    this.setState({
      hasError: false,
      error: null,
      errorId: ''
    });
  };

  private handleManualRetry = () => {
    this.retryCount = 0; // Reset retry count for manual retry
    this.handleRetry();
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Selection Management Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-red-600">
              <p>An error occurred while managing your selections.</p>
              <p className="mt-2 font-mono text-xs bg-red-100 p-2 rounded border">
                {this.state.error?.message || 'Unknown error'}
              </p>
              <p className="mt-2 text-xs text-red-500">
                Error ID: {this.state.errorId}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleManualRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-red-600 hover:text-red-700"
              >
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for handling async errors in selection management
 */
export const useSelectionErrorHandler = () => {
  const handleAsyncError = React.useCallback((error: Error, context?: string) => {
    console.error(`Selection management async error${context ? ` (${context})` : ''}:`, error);
    
    // Report to monitoring service instead of throwing
    if (typeof window !== 'undefined' && (window as any).reportError) {
      (window as any).reportError({
        error,
        context: 'selection-management',
        details: context
      });
    }
    
    // You can also dispatch an action to show an error toast/notification
    // or update a global error state
  }, []);

  return { handleAsyncError };
};