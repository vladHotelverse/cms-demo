import { Check } from 'lucide-react'
import type React from 'react'
import { Button } from '@/components/ui/button'

export interface OfferBookingButtonProps {
  onClick: () => void
  disabled: boolean
  isBooked: boolean
  bookText: string
  removeText: string
}

const OfferBookingButton: React.FC<OfferBookingButtonProps> = ({
  onClick,
  disabled,
  isBooked,
  bookText,
  removeText,
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant={isBooked ? 'destructive' : 'default'}
    className={`  w-full cursor-pointer transition-all border ${isBooked ? '' : 'hover:bg-black hover:text-white'}`}
  >
    {isBooked && <Check className="h-4 w-4" />}
    {isBooked ? removeText : bookText}
  </Button>
)

export default OfferBookingButton
