import clsx from 'clsx'
import type React from 'react'
import { useMemo, useCallback } from 'react'
import EmptyState from './components/EmptyState'
import PriceBreakdown from './components/PriceBreakdown'
import ToastContainer from './components/ToastContainer'
import PricingItemComponent from './components/PricingItemComponent'
// import RoomSection from './components/RoomSection'
// import CustomizationsSection from './components/CustomizationsSection'
// import OffersSection from './components/OffersSection'
import LoadingOverlay from './components/LoadingOverlay'
import type { PricingItem, PricingSummaryPanelProps } from './types'
import { PANEL_CONFIG, DEFAULT_ROOM_IMAGE } from './constants'
import { useToasts } from './hooks/useToasts'

const PricingSummaryPanel: React.FC<PricingSummaryPanelProps> = ({
  className,
  roomImage = DEFAULT_ROOM_IMAGE,
  items = [],
  pricing = { subtotal: 0 },
  isLoading = false,
  availableSections = [],
  labels,
  currency,
  locale,
  onRemoveItem,
  onConfirm,
}) => {
  // Toast notifications using custom hook
  const { toasts, showToast, removeToast } = useToasts(PANEL_CONFIG.TOAST_DURATION)

  // Memoize expensive filtering operations - now grouped by concept
  const { chooseYourSuperiorRoomItems, customizeYourRoomItems, chooseYourRoomItems, enhanceYourStayItems, bidForUpgradeItems, isEmpty } = useMemo(() => {
    const safeItems = items || []
    return {
      chooseYourSuperiorRoomItems: safeItems.filter((item) => item.concept === 'choose-your-superior-room'),
      customizeYourRoomItems: safeItems.filter((item) => item.concept === 'customize-your-room'),
      chooseYourRoomItems: safeItems.filter((item) => item.concept === 'choose-your-room'),
      enhanceYourStayItems: safeItems.filter((item) => item.concept === 'enhance-your-stay'),
      bidForUpgradeItems: safeItems.filter((item) => item.concept === 'bid-for-upgrade'),
      isEmpty: safeItems.length === 0,
    }
  }, [items])

  // Filter available sections (memoized)
  const availableActiveSections = useMemo(() => {
    return availableSections?.filter((section) => section.isAvailable) || []
  }, [availableSections])

  // Memoize handlers to prevent unnecessary re-renders
  const handleRemoveItem = useCallback(
    (item: PricingItem) => {
      if (onRemoveItem) {
        onRemoveItem(item.id, item.name, item.type)

        // Show appropriate toast message based on concept
        let toastMessage = labels.roomRemovedMessage
        if (item.concept === 'customize-your-room') {
          toastMessage = `${labels.customizationRemovedMessagePrefix} ${item.name}`
        } else if (item.concept === 'enhance-your-stay') {
          toastMessage = `${labels.offerRemovedMessagePrefix} ${item.name}`
        } else if (item.concept === 'choose-your-superior-room') {
          toastMessage = `Superior room removed: ${item.name}`
        } else if (item.concept === 'choose-your-room') {
          toastMessage = `Room selection removed: ${item.name}`
        }

        showToast(toastMessage, 'info')
      }
    },
    [onRemoveItem, labels, showToast]
  )

  // Enhanced safety checks for required props
  if (!labels) {
    console.error('PricingSummaryPanel: labels prop is required')
    return (
      <div className="p-4 text-red-500 border border-red-300 rounded-lg bg-red-50">
        <h3 className="font-semibold mb-2">Configuration Error</h3>
        <p>Missing required labels configuration. Please provide all required labels.</p>
      </div>
    )
  }

  // Validate pricing object
  const safePricing = useMemo(() => {
    if (!pricing || typeof pricing !== 'object') {
      console.warn(`PricingSummaryPanel: ${labels.invalidPricingError}`)
      return { subtotal: 0 }
    }

    const subtotal = typeof pricing.subtotal === 'number' && !Number.isNaN(pricing.subtotal) ? pricing.subtotal : 0

    return { subtotal }
  }, [pricing])

  return (
    <section
      className={clsx(
        'border border-neutral-300 rounded-lg overflow-hidden bg-white shadow-sm w-[400px] sticky top-28',
        className
      )}
      aria-label={labels.pricingSummaryLabel}
    >
      {/* Room image at the top */}
      <div className="w-full h-40 bg-neutral-200 overflow-hidden">
        <img src={roomImage} alt={labels.roomImageAltText} className="w-full h-full object-cover" />
      </div>

      {/* Content container with padding */}
      <div className="p-4 space-y-4 relative">
        <LoadingOverlay isLoading={isLoading} loadingLabel={labels.loadingLabel} />

        {/* Empty State */}
        {isEmpty && !isLoading && (
          <div className="py-6">
            <EmptyState
              availableActiveSections={availableActiveSections}
              emptyCartMessage={labels.emptyCartMessage}
              exploreLabel={labels.exploreLabel}
              fromLabel={labels.fromLabel}
              euroSuffix={labels.euroSuffix}
              customizeStayTitle={labels.customizeStayTitle}
              chooseOptionsSubtitle={labels.chooseOptionsSubtitle}
            />
          </div>
        )}

        {/* Room Section - combining all room-related items */}
        {(chooseYourRoomItems.length > 0 || chooseYourSuperiorRoomItems.length > 0) && (
          <section aria-labelledby="room-section-title" className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 id="room-section-title" className="text-base font-semibold">
                {chooseYourSuperiorRoomItems.length > 0 ? 'Superior Room Selection' : 'Room Selection'}
              </h3>
            </div>
            {[...chooseYourRoomItems, ...chooseYourSuperiorRoomItems].map((item) => (
              <PricingItemComponent
                key={item.id}
                item={item}
                euroSuffix={labels.euroSuffix}
                removeLabel={labels.removeRoomUpgradeLabel}
                onRemove={() => {
                  try {
                    handleRemoveItem(item)
                  } catch (error) {
                    console.error('Error in remove item callback:', error)
                  }
                }}
              />
            ))}
          </section>
        )}

                {/* Bid Upgrades Section */}
                {bidForUpgradeItems.length > 0 && (
          <section aria-labelledby="bid-section-title">
            <div className="flex justify-between items-center mb-2">
              <h3 id="bid-section-title" className="text-base font-semibold">
                Bid for Upgrades
              </h3>
            </div>
            <div className="space-y-2">
              {bidForUpgradeItems.map((item) => (
                <PricingItemComponent
                  key={item.id}
                  item={item}
                  euroSuffix={labels.euroSuffix}
                  removeLabel={`Remove ${item.name}`}
                  onRemove={() => {
                    try {
                      handleRemoveItem(item)
                    } catch (error) {
                      console.error('Error in remove item callback:', error)
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}


        {/* Customizations Section */}
        {customizeYourRoomItems.length > 0 && (
          <section aria-labelledby="customizations-section-title" className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 id="customizations-section-title" className="text-base font-semibold">
                Room Customization
              </h3>
            </div>
            <div className="space-y-2">
              {customizeYourRoomItems.map((item) => (
                <PricingItemComponent
                  key={item.id}
                  item={item}
                  euroSuffix={labels.euroSuffix}
                  removeLabel={`Remove ${item.name}`}
                  onRemove={() => {
                    try {
                      handleRemoveItem(item)
                    } catch (error) {
                      console.error('Error in remove item callback:', error)
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}


        {/* Special Offers Section */}
        {enhanceYourStayItems.length > 0 && (
          <section aria-labelledby="offers-section-title" className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 id="offers-section-title" className="text-base font-semibold">
                Stay Enhancement
              </h3>
            </div>
            <div className="space-y-2">
              {enhanceYourStayItems.map((item) => (
                <PricingItemComponent
                  key={item.id}
                  item={item}
                  euroSuffix={labels.euroSuffix}
                  removeLabel={`Remove ${item.name}`}
                  onRemove={() => {
                    try {
                      handleRemoveItem(item)
                    } catch (error) {
                      console.error('Error in remove item callback:', error)
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Price Breakdown - Only show when not empty */}
        {!isEmpty && (
          <div className="border-t pt-4">
            <PriceBreakdown
              subtotal={safePricing.subtotal}
              isLoading={isLoading}
              labels={{
                subtotalLabel: labels.subtotalLabel,
                totalLabel: labels.totalLabel,
                payAtHotelLabel: labels.payAtHotelLabel,
                viewTermsLabel: labels.viewTermsLabel,
                confirmButtonLabel: labels.confirmButtonLabel,
                loadingLabel: labels.loadingLabel,
                euroSuffix: labels.euroSuffix,
              }}
              currency={currency}
              locale={locale}
              onConfirm={onConfirm}
            />
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        notificationsLabel={labels.notificationsLabel}
        closeNotificationLabel={labels.closeNotificationLabel}
      />
    </section>
  )
}

export default PricingSummaryPanel
export { PricingSummaryPanel as ABS_PricingSummaryPanel }
export type { PricingSummaryPanelProps, PricingItem, AvailableSection, PricingLabels } from './types'
