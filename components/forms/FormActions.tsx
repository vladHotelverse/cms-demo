/**
 * Reusable form actions component for consistent button layouts
 */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Save, X, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormActionsProps {
  onSave?: () => void
  onCancel?: () => void
  onDelete?: () => void
  saveLabel?: string
  cancelLabel?: string
  deleteLabel?: string
  isLoading?: boolean
  isSaveDisabled?: boolean
  isDeleteDisabled?: boolean
  showDelete?: boolean
  className?: string
  variant?: 'horizontal' | 'vertical'
  size?: 'sm' | 'default' | 'lg'
}

/**
 * FormActions component for consistent form button layouts
 */
export const FormActions: React.FC<FormActionsProps> = ({
  onSave,
  onCancel,
  onDelete,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  isLoading = false,
  isSaveDisabled = false,
  isDeleteDisabled = false,
  showDelete = false,
  className,
  variant = 'horizontal',
  size = 'default'
}) => {
  const buttonClass = cn(
    variant === 'vertical' && 'w-full',
    variant === 'horizontal' && 'min-w-[100px]'
  )

  const containerClass = cn(
    'flex gap-3',
    variant === 'vertical' ? 'flex-col' : 'flex-row justify-end',
    className
  )

  return (
    <div className={containerClass}>
      {/* Delete button (left side for horizontal, top for vertical) */}
      {showDelete && onDelete && (
        <Button
          type="button"
          variant="destructive"
          size={size}
          onClick={onDelete}
          disabled={isDeleteDisabled || isLoading}
          className={cn(
            buttonClass,
            variant === 'horizontal' && 'mr-auto' // Push to left side
          )}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {deleteLabel}
        </Button>
      )}

      {/* Main action buttons */}
      <div className={cn(
        'flex gap-3',
        variant === 'vertical' ? 'flex-col' : 'flex-row'
      )}>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size={size}
            onClick={onCancel}
            disabled={isLoading}
            className={buttonClass}
          >
            <X className="w-4 h-4 mr-2" />
            {cancelLabel}
          </Button>
        )}

        {onSave && (
          <Button
            type="submit"
            size={size}
            onClick={onSave}
            disabled={isSaveDisabled || isLoading}
            className={buttonClass}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Saving...' : saveLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * FormActions with memo for performance optimization
 */
export default React.memo(FormActions)
