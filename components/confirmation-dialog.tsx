"use client"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  open: boolean
  onClose: () => void
  commissionAmount: number | undefined
  currency?: string
}

export function ConfirmationDialog({
  open,
  onClose,
  commissionAmount,
  currency = "€",
}: ConfirmationDialogProps) {
  const formatAmount = (amount: number | undefined, currency: string) => {
    const validAmount = amount || 0
    return `${currency}${validAmount.toFixed(2)}`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl font-bold text-center">
            Booking Confirmed
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Your selections have been successfully submitted to the Property Management System
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-base text-center">
            Commission earned:
          </p>
          <div className="text-3xl font-bold text-green-600">
            {formatAmount(commissionAmount, currency)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Usage example:
// <ConfirmationDialog
//   open={isDialogOpen}
//   onClose={() => setIsDialogOpen(false)}
//   commissionAmount={10.00}
//   currency="€"
// />