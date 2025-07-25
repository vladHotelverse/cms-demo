import clsx from 'clsx'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import type React from 'react'
import { Button } from '../../ui/button'
import type { Toast } from '../hooks/useToasts'

interface ToastContainerProps {
  toasts: Toast[]
  removeToast: (id: number) => void
  notificationsLabel: string
  closeNotificationLabel: string
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
  notificationsLabel,
  closeNotificationLabel,
}) => {
  return (
    <output
      className="fixed bottom-4 right-4 z-50 space-y-2 w-72 pointer-events-none"
      aria-live="polite"
      aria-label={notificationsLabel}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'border-l-4 p-3 rounded shadow-md flex items-start justify-between pointer-events-auto bg-white animate-in fade-in slide-in-from-bottom-5 duration-300',
            {
              'border-green-400 text-green-700': toast.type === 'success',
              'border-blue-400 text-blue-700': toast.type === 'info',
              'border-red-400 text-red-700': toast.type === 'error',
            }
          )}
          role="alert"
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          aria-atomic="true"
        >
          <div className="flex items-center">
            {toast.type === 'success' && <CheckCircle size={20} strokeWidth={2} className="h-5 w-5 mr-2" />}
            {toast.type === 'info' && <Info size={20} strokeWidth={2} className="h-5 w-5 mr-2" />}
            {toast.type === 'error' && <AlertTriangle size={20} strokeWidth={2} className="h-5 w-5 mr-2" />}
            <span className="text-sm">{toast.message}</span>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => removeToast(toast.id)}
            className="text-neutral-500 hover:text-neutral-700 transition-all duration-200 hover:scale-110 ml-2"
            aria-label={closeNotificationLabel}
          >
            <X size={16} strokeWidth={2} className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </output>
  )
}

export default ToastContainer
