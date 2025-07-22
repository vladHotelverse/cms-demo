import React, { Suspense } from 'react'
import { LoadingState } from './loading-state'

interface LazyComponentProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LazyComponent({ 
  children, 
  fallback = <LoadingState />,
  className 
}: LazyComponentProps) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  )
}