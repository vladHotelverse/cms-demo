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
import { useLanguage } from '@/contexts/language-context'

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
  const { t } = useLanguage()
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
          <CardTitle className="text-xl">{t('somethingWentWrong')}</CardTitle>
          <CardDescription>
            {t('unexpectedErrorMessage')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Error message for users */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('errorDetails')}</AlertTitle>
            <AlertDescription>
              {error.message || t('unexpectedErrorOccurred')}
            </AlertDescription>
          </Alert>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('tryAgain')}
            </Button>
            <Button variant="outline" onClick={handleReload} className="flex-1">
              {t('reloadPage')}
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              {t('goHome')}
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
                {showDetails ? t('hide') : t('show')} {t('technicalDetails')}
              </Button>
              
              {showDetails && (
                <div className="space-y-2">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <h4 className="font-semibold text-sm mb-2">{t('errorStack')}</h4>
                    <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                  
                  {errorInfo && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                      <h4 className="font-semibold text-sm mb-2">{t('componentStack')}</h4>
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
  const { t } = useLanguage()
  
  return (
    <Alert className="m-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t('error')}</AlertTitle>
      <AlertDescription className="mt-2">
        {error.message || t('somethingWentWrong')}
        <Button
          variant="outline"
          size="sm"
          onClick={resetError}
          className="ml-2"
        >
          {t('tryAgain')}
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default ErrorFallback
