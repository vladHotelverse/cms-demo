import { useState, useCallback } from 'react'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'info' | 'error'
}

export interface UseToastsReturn {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: number) => void
}

export function useToasts(duration = 3000): UseToastsReturn {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])

      // Auto-remove toast after specified duration
      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast, duration]
  )

  return {
    toasts,
    showToast,
    removeToast,
  }
}
