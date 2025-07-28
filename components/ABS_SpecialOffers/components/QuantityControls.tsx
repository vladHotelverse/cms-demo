import { Minus, Plus } from 'lucide-react'
import type React from 'react'
import { Button } from '../../ui/button'
import type { OfferLabels } from '../types'

export interface QuantityControlsProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  disabled?: boolean
  isBooked?: boolean
  labels: OfferLabels
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  labels,
}) => (
  <div className="flex items-center bg-white border rounded-lg shadow-sm max-h-11">
    <Button
      variant="ghost"
      size="icon"
      onClick={onDecrease}
      disabled={disabled || quantity <= 0}
      aria-label={labels.decreaseQuantityLabel}
      className="h-10 w-10 touch-manipulation"
    >
      <Minus className="h-4 w-4" />
    </Button>
    <span className="w-10 text-center font-medium text-lg">{quantity}</span>
    <Button
      variant="ghost"
      size="icon"
      onClick={onIncrease}
      disabled={disabled}
      aria-label={labels.increaseQuantityLabel}
      className="h-10 w-10 touch-manipulation"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
)

export default QuantityControls
