import { useCallback, useState } from 'react'
import type { MultiBookingLabels } from '../MultiBookingPricingSummaryPanel'

interface UseConfirmAllProps {
  roomCount: number
  labels: MultiBookingLabels
  onConfirmAll: () => Promise<void>
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}

export const useConfirmAll = ({ roomCount, labels, onConfirmAll, showToast }: UseConfirmAllProps) => {
  const [confirmingAll, setConfirmingAll] = useState(false)

  const handleConfirmAll = useCallback(async () => {
    setConfirmingAll(true)
    try {
      await onConfirmAll()
      showToast(`${labels.confirmAllButtonLabel.replace('All', `All ${roomCount}`)} confirmed successfully!`, 'success')
    } catch (error) {
      console.error('Error confirming selections:', error)
      showToast('Error confirming selections. Please try again.', 'error')
    } finally {
      setConfirmingAll(false)
    }
  }, [onConfirmAll, roomCount, labels, showToast])

  return {
    confirmingAll,
    handleConfirmAll,
  }
}
