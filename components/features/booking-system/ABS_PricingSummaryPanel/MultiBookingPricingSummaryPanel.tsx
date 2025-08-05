import type React from 'react'
import { cn } from '../../lib/utils'
import PriceBreakdown from './components/PriceBreakdown'
import RoomAccordionItem from './components/RoomAccordionItem'
import ToastContainer from './components/ToastContainer'
import type { PricingItem } from './types'
import { useAccordionState } from './hooks/useAccordionState'
import { useConfirmAll } from './hooks/useConfirmAll'
import { useCurrencyFormatter } from './hooks/useCurrencyFormatter'
import { useItemManagement } from './hooks/useItemManagement'
import { useRoomCalculations } from './hooks/useRoomCalculations'
import { useToasts } from './hooks/useToasts'

// Available item interface for upgrades and offers
export interface AvailableItem {
  id: string
  name: string
  price: number
  category: string
}

// Extended interface for room booking data
export interface RoomBooking {
  id: string
  roomName: string
  roomNumber: string
  guestName: string
  checkIn?: string
  checkOut?: string
  guests?: number
  nights: number
  items: PricingItem[]
  payAtHotel: boolean
  roomImage?: string
}

// Multi-booking labels interface
export interface MultiBookingLabels {
  multiRoomBookingsTitle: string
  roomsCountLabel: string
  singleRoomLabel: string
  clickToExpandLabel: string
  selectedRoomLabel: string
  upgradesLabel: string
  specialOffersLabel: string
  chooseYourSuperiorRoomLabel: string
  customizeYourRoomLabel: string
  enhanceYourStayLabel: string
  chooseYourRoomLabel: string
  roomTotalLabel: string
  subtotalLabel: string
  totalLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmAllButtonLabel: string
  confirmingAllLabel: string
  editLabel: string
  addLabel: string
  addUpgradeTitle: string
  noUpgradesSelectedLabel: string
  noOffersSelectedLabel: string
  noMoreUpgradesLabel: string
  noMoreOffersLabel: string
  euroSuffix: string
  nightsLabel: string
  nightLabel: string
  guestsLabel: string
  guestLabel: string
  roomImageAltText: string
  removedSuccessfully: string
  addedSuccessfully: string
  cannotRemoveRoom: string
  itemAlreadyAdded: string

  // Accessibility labels for toast
  notificationsLabel: string
  closeNotificationLabel: string
}

export interface MultiBookingPricingSummaryPanelProps {
  className?: string
  roomBookings: RoomBooking[]
  labels: MultiBookingLabels
  currency?: string
  locale?: string
  isLoading?: boolean
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
  onEditSection: (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => void
  onConfirmAll: () => Promise<void>
}

const MultiBookingPricingSummaryPanel: React.FC<MultiBookingPricingSummaryPanelProps> = ({
  className,
  roomBookings,
  labels,
  currency,
  locale,
  isLoading = false,
  onRemoveItem,
  onConfirmAll,
}) => {
  // Custom hooks
  const { toasts, showToast, removeToast } = useToasts(3000)
  const { handleAccordionToggle, isRoomActive } = useAccordionState(roomBookings[0]?.id)
  const { overallTotal } = useRoomCalculations(roomBookings)
  const formatCurrency = useCurrencyFormatter({ currency, locale, euroSuffix: labels.euroSuffix })
  const { removingItems, handleRemoveItem } = useItemManagement({
    roomBookings,
    labels,
    onRemoveItem,
    showToast,
  })
  const { confirmingAll, handleConfirmAll } = useConfirmAll({
    roomCount: roomBookings.length,
    labels,
    onConfirmAll,
    showToast,
  })

  return (
    <div className={cn('sticky top-28', className)}>
      <div className="w-[400px] bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">{labels.multiRoomBookingsTitle}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {roomBookings.length} {roomBookings.length === 1 ? 'room' : labels.roomsCountLabel} •{' '}
            {labels.clickToExpandLabel}
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="max-h-[600px] overflow-y-auto">
          {roomBookings.map((room) => (
            <RoomAccordionItem
              key={room.id}
              room={room}
              labels={labels}
              isActive={isRoomActive(room.id)}
              removingItems={removingItems}
              formatCurrency={formatCurrency}
              onToggle={handleAccordionToggle}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </div>

        {/* Consolidated Summary Footer */}
        <div className="border-t bg-gray-50 p-4">
          <PriceBreakdown
            subtotal={overallTotal}
            isLoading={confirmingAll || isLoading}
            labels={{
              subtotalLabel: labels.subtotalLabel,
              totalLabel: labels.totalLabel,
              payAtHotelLabel: labels.payAtHotelLabel,
              viewTermsLabel: labels.viewTermsLabel,
              confirmButtonLabel: confirmingAll
                ? labels.confirmingAllLabel
                : `${labels.confirmAllButtonLabel} ${roomBookings.length} Selections`,
              loadingLabel: labels.confirmingAllLabel,
              euroSuffix: labels.euroSuffix,
            }}
            currency={currency}
            locale={locale}
            onConfirm={handleConfirmAll}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        notificationsLabel={labels.notificationsLabel}
        closeNotificationLabel={labels.closeNotificationLabel}
      />
    </div>
  )
}

export default MultiBookingPricingSummaryPanel
