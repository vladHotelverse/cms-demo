import clsx from 'clsx'
import type React from 'react'

interface LoadingSkeletonProps {
  width?: string
  height?: string
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ width = 'w-full', height = 'h-4' }) => (
  <div className={clsx('animate-pulse bg-neutral-200 rounded', width, height)} />
)

export default LoadingSkeleton
