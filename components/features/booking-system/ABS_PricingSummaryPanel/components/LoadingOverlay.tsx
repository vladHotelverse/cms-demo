import type React from 'react'

interface LoadingOverlayProps {
  isLoading: boolean
  loadingLabel: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, loadingLabel }) => {
  if (!isLoading) return null

  return (
    <output
      className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
      aria-live="polite"
      aria-label={loadingLabel}
    >
      <div className="flex items-center space-x-2">
        <div className="animate-spin w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full" aria-hidden="true" />
        <span className="text-sm">{loadingLabel}</span>
      </div>
    </output>
  )
}

export default LoadingOverlay
