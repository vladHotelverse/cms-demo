import { X } from 'lucide-react'
import type React from 'react'
import PricingSummaryPanel from '../index'
import type { PricingSummaryPanelProps } from '../types'
import { cn } from '../../../lib/utils'
import { Button } from '../../ui/button'
import { Dialog, DialogContent } from '../../ui/dialog'

export interface MobilePricingOverlayProps extends PricingSummaryPanelProps {
  isOpen: boolean
  onClose: () => void
  containerId?: string
  overlayTitle?: string
  closeButtonLabel?: string
}

const MobilePricingOverlay: React.FC<MobilePricingOverlayProps> = ({
  isOpen,
  onClose,
  containerId,
  overlayTitle = 'Resumen de reserva',
  closeButtonLabel = 'Cerrar',
  ...pricingSummaryProps
}) => {
  return (
    <div className="lg:hidden">
      {/* Only show on mobile/tablet */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn('z-101 w-full h-full p-4 bg-neutral-50')}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-50 transition-colors fixed top-1 right-1 z-10 bg-white"
            aria-label={closeButtonLabel}
          >
            <X className="w-6 h-6 text-neutral-500" />
          </Button>
          <PricingSummaryPanel {...pricingSummaryProps} className={cn('h-fit border border-neutral-300')} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MobilePricingOverlay
