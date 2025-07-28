import type React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Button } from '../../ui/button'
import type { ConflictResolution, RoomCustomizationTexts } from '../types'

interface ConflictResolutionDialogProps {
  conflict: ConflictResolution | null
  texts: RoomCustomizationTexts
  onResolve: (keepNew: boolean) => void
  onDismiss: () => void
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflict,
  texts,
  onResolve,
  onDismiss,
}) => {
  if (!conflict) return null

  const handleKeepCurrent = () => {
    onResolve(false)
  }

  const handleSwitchToNew = () => {
    onResolve(true)
  }

  return (
    <Dialog open={!!conflict} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{texts.conflictDialogTitle}</DialogTitle>
          <DialogDescription>
            {texts.conflictDialogDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">
              {conflict.reason}
            </h4>
            <div className="space-y-2 text-sm text-amber-700">
              <div>
                <strong>Currently selected:</strong> {conflict.currentOption.label}
              </div>
              <div>
                <strong>You're trying to select:</strong> {conflict.conflictingOption.label}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleKeepCurrent}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {texts.keepCurrentText}
          </Button>
          <Button
            onClick={handleSwitchToNew}
            variant="default"
            className="w-full sm:w-auto"
          >
            {texts.switchToNewText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 