import clsx from 'clsx'
import type React from 'react'
import { useMemo } from 'react'
import { CarouselNavigation, RoomCard } from './components'
import { useCarouselState } from './hooks/useCarouselState'
import type { RoomSelectionCarouselProps, RoomSelectionCarouselTranslations } from './types'
import { getDynamicAmenitiesForAllRooms, getCurrentRoomAmenities } from './utils/amenitiesSelector'

const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = ({
  className,
  title,
  subtitle,
  roomOptions,
  initialSelectedRoom = null,
  onRoomSelected,
  onMakeOffer,
  onLearnMore,
  onCancelBid,
  minPrice = 10,
  showPriceSlider = true,
  variant = 'basic',
  translations,
  currentRoomType = 'DELUXE SILVER',
  currentRoomAmenities,
  mode = 'selection',
  readonly = false,
  // Deprecated individual props - keeping for backward compatibility
  learnMoreText,
  nightText,
  priceInfoText,
  makeOfferText,
  availabilityText,
  selectedText,
  selectText,
  proposePriceText,
  currencyText,
  currencySymbol,
  offerMadeText,
  discountBadgeText,
  bidSubmittedText,
  updateBidText,
  cancelBidText,
  upgradeNowText,
  removeText,
  activeBid,
}) => {
  // Helper function to resolve text values (new translations object takes precedence)
  const getTranslation = (
    key: keyof Omit<RoomSelectionCarouselTranslations, 'navigationLabels'>,
    fallbackValue?: string,
    defaultValue = ''
  ): string => {
    if (translations?.[key]) {
      return translations[key] as string
    }
    return fallbackValue || defaultValue
  }

  // Helper function to get navigation labels
  const getNavigationLabel = (
    key: keyof RoomSelectionCarouselTranslations['navigationLabels'],
    fallbackValue?: string,
    defaultValue = ''
  ): string => {
    if (translations?.navigationLabels?.[key]) {
      return translations.navigationLabels[key]
    }
    return fallbackValue || defaultValue
  }

  // Resolve all text values with backward compatibility
  const resolvedTexts = {
    learnMoreText: getTranslation('learnMoreText', learnMoreText, 'Descubre más detalles'),
    nightText: getTranslation('nightText', nightText, '/noche'),
    priceInfoText: getTranslation('priceInfoText', priceInfoText, 'Información sobre tarifas e impuestos.'),
    makeOfferText: getTranslation('makeOfferText', makeOfferText, 'Hacer oferta'),
    availabilityText: getTranslation('availabilityText', availabilityText, 'Sujeto a disponibilidad'),
    selectedText: getTranslation('selectedText', selectedText, 'SELECCIONADO'),
    selectText: getTranslation('selectText', selectText, 'SELECCIONAR'),
    proposePriceText: getTranslation('proposePriceText', proposePriceText, 'Propon tu precio:'),
    currencyText: getTranslation('currencyText', currencyText, 'EUR'),
    currencySymbol: getTranslation('currencySymbol', currencySymbol, '€'),
    upgradeNowText: getTranslation('upgradeNowText', upgradeNowText, 'Upgrade now'),
    removeText: getTranslation('removeText', removeText, 'Remove'),
    offerMadeText: getTranslation('offerMadeText', offerMadeText, 'Has propuesto {price} EUR por noche'),
    discountBadgeText: getTranslation('discountBadgeText', discountBadgeText, '-{percentage}%'),
    noRoomsAvailableText: getTranslation('noRoomsAvailableText', undefined, 'No hay habitaciones disponibles.'),
    bidSubmittedText: getTranslation('bidSubmittedText', bidSubmittedText, 'Bid submitted'),
    updateBidText: getTranslation('updateBidText', updateBidText, 'Update bid'),
    cancelBidText: getTranslation('cancelBidText', cancelBidText, 'Cancel'),
    // Navigation labels
    previousRoom: getNavigationLabel('previousRoom', undefined, 'Previous room'),
    nextRoom: getNavigationLabel('nextRoom', undefined, 'Next room'),
    previousRoomMobile: getNavigationLabel('previousRoomMobile', undefined, 'Previous room (mobile)'),
    nextRoomMobile: getNavigationLabel('nextRoomMobile', undefined, 'Next room (mobile)'),
    goToRoom: getNavigationLabel('goToRoom', undefined, 'Go to room {index}'),
    previousImage: getNavigationLabel('previousImage', undefined, 'Previous image'),
    nextImage: getNavigationLabel('nextImage', undefined, 'Next image'),
    viewImage: getNavigationLabel('viewImage', undefined, 'View image {index}'),
  }

  // Generate dynamic amenities for all rooms
  const dynamicAmenitiesMap = useMemo(() => {
    const userCurrentAmenities = currentRoomAmenities || getCurrentRoomAmenities(currentRoomType, roomOptions)
    return getDynamicAmenitiesForAllRooms(roomOptions, currentRoomType, userCurrentAmenities)
  }, [roomOptions, currentRoomType, currentRoomAmenities])

  // Use separated carousel state management (without slider logic)
  const { state, actions } = useCarouselState({
    roomOptions,
    initialSelectedRoom,
    onRoomSelected,
  })

  // Determine if slider should be shown (disabled in consultation mode)
  const shouldShowSlider = (showPriceSlider || variant === 'with-slider') && mode === 'selection' && !readonly

  if (roomOptions.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)}>
        <p className="text-neutral-500">{resolvedTexts.noRoomsAvailableText}</p>
      </div>
    )
  }

  // Handle different room counts with different layouts
  if (roomOptions.length === 1) {
    // Single room: No carousel, just display the room card
    return (
      <div className={clsx(className)}>
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-neutral-600">{subtitle}</p>}
          </div>
        )}

        <div className="w-full max-w-md">
          <RoomCard
            room={roomOptions[0]}
            discountBadgeText={resolvedTexts.discountBadgeText}
            nightText={resolvedTexts.nightText}
            learnMoreText={resolvedTexts.learnMoreText}
            priceInfoText={resolvedTexts.priceInfoText}
            selectedText={resolvedTexts.selectedText}
            selectText={resolvedTexts.upgradeNowText || resolvedTexts.selectText}
            removeText={resolvedTexts.removeText}
            selectedRoom={state.selectedRoom}
            onSelectRoom={readonly || mode === 'consultation' ? () => {} : actions.selectRoom}
            activeImageIndex={state.activeImageIndices[0] || 0}
            onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(0, newImageIndex)}
            currencySymbol={resolvedTexts.currencySymbol}
            onLearnMore={onLearnMore}
            activeBid={activeBid}
            bidSubmittedText={resolvedTexts.bidSubmittedText}
            previousImageLabel={resolvedTexts.previousImage}
            nextImageLabel={resolvedTexts.nextImage}
            viewImageLabel={resolvedTexts.viewImage}
            isActive={state.activeIndex === 0}
            showPriceSlider={shouldShowSlider}
            minPrice={minPrice}
            onMakeOffer={onMakeOffer}
            onCancelBid={onCancelBid}
            proposePriceText={resolvedTexts.proposePriceText}
            makeOfferText={resolvedTexts.makeOfferText}
            availabilityText={resolvedTexts.availabilityText}
            currencyText={resolvedTexts.currencyText}
            offerMadeText={resolvedTexts.offerMadeText}
            updateBidText={resolvedTexts.updateBidText}
            cancelBidText={resolvedTexts.cancelBidText}
            dynamicAmenities={dynamicAmenitiesMap.get(roomOptions[0].id)}
          />
        </div>
      </div>
    )
  }

  if (roomOptions.length === 2) {
    // Two rooms: Show side by side on large screens, carousel on mobile
    return (
      <div className={clsx(className)}>
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-neutral-600">{subtitle}</p>}
          </div>
        )}

        {/* Desktop: Side by side layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {roomOptions.map((room, index) => (
            <div key={room.id}>
              <RoomCard
                room={room}
                discountBadgeText={resolvedTexts.discountBadgeText}
                nightText={resolvedTexts.nightText}
                learnMoreText={resolvedTexts.learnMoreText}
                priceInfoText={resolvedTexts.priceInfoText}
                selectedText={resolvedTexts.selectedText}
                selectText={resolvedTexts.upgradeNowText || resolvedTexts.selectText}
                removeText={resolvedTexts.removeText}
                selectedRoom={state.selectedRoom}
                onSelectRoom={readonly || mode === 'consultation' ? () => {} : actions.selectRoom}
                activeImageIndex={state.activeImageIndices[index] || 0}
                onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(index, newImageIndex)}
                currencySymbol={resolvedTexts.currencySymbol}
                onLearnMore={onLearnMore}
                activeBid={activeBid}
                bidSubmittedText={resolvedTexts.bidSubmittedText}
                previousImageLabel={resolvedTexts.previousImage}
                nextImageLabel={resolvedTexts.nextImage}
                viewImageLabel={resolvedTexts.viewImage}
                isActive={state.activeIndex === index}
                showPriceSlider={shouldShowSlider}
                minPrice={minPrice}
                onMakeOffer={onMakeOffer}
                onCancelBid={onCancelBid}
                proposePriceText={resolvedTexts.proposePriceText}
                makeOfferText={resolvedTexts.makeOfferText}
                availabilityText={resolvedTexts.availabilityText}
                currencyText={resolvedTexts.currencyText}
                offerMadeText={resolvedTexts.offerMadeText}
                updateBidText={resolvedTexts.updateBidText}
                cancelBidText={resolvedTexts.cancelBidText}
                dynamicAmenities={dynamicAmenitiesMap.get(room.id)}
              />
            </div>
          ))}
        </div>

        {/* Mobile/Tablet: Carousel layout */}
        <div className="lg:hidden">
          <div className="relative w-full overflow-visible h-full">
            <div className="w-full relative perspective-[1000px] min-h-[550px] overflow-visible">
              {roomOptions.map((room, index) => (
                <div
                  key={room.id}
                  className={clsx('w-full absolute transition-all duration-500 ease-in-out', {
                    'left-0 z-10': state.activeIndex === index,
                    'left-[-100%] z-5 opacity-70': state.activeIndex !== index && index === 0,
                    'left-[100%] z-5 opacity-70': state.activeIndex !== index && index === 1,
                  })}
                >
                  <RoomCard
                    room={room}
                    discountBadgeText={resolvedTexts.discountBadgeText}
                    nightText={resolvedTexts.nightText}
                    learnMoreText={resolvedTexts.learnMoreText}
                    priceInfoText={resolvedTexts.priceInfoText}
                    selectedText={resolvedTexts.selectedText}
                    selectText={resolvedTexts.upgradeNowText || resolvedTexts.selectText}
                    removeText={resolvedTexts.removeText}
                    selectedRoom={state.selectedRoom}
                    onSelectRoom={readonly || mode === 'consultation' ? () => {} : actions.selectRoom}
                    activeImageIndex={state.activeImageIndices[index] || 0}
                    onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(index, newImageIndex)}
                    currencySymbol={resolvedTexts.currencySymbol}
                    onLearnMore={onLearnMore}
                    activeBid={activeBid}
                    bidSubmittedText={resolvedTexts.bidSubmittedText}
                    previousImageLabel={resolvedTexts.previousImage}
                    nextImageLabel={resolvedTexts.nextImage}
                    viewImageLabel={resolvedTexts.viewImage}
                    isActive={state.activeIndex === index}
                    showPriceSlider={shouldShowSlider}
                    minPrice={minPrice}
                    onMakeOffer={onMakeOffer}
                    onCancelBid={onCancelBid}
                    proposePriceText={resolvedTexts.proposePriceText}
                    makeOfferText={resolvedTexts.makeOfferText}
                    availabilityText={resolvedTexts.availabilityText}
                    currencyText={resolvedTexts.currencyText}
                    offerMadeText={resolvedTexts.offerMadeText}
                    updateBidText={resolvedTexts.updateBidText}
                    cancelBidText={resolvedTexts.cancelBidText}
                    dynamicAmenities={dynamicAmenitiesMap.get(room.id)}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={actions.prevSlide}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
                aria-label={resolvedTexts.previousRoomMobile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="flex gap-2">
                {roomOptions.map((room, index) => (
                  <button
                    key={`room-dot-${room.id}`}
                    onClick={() => actions.setActiveIndex(index)}
                    className={clsx('h-2 w-2 rounded-full transition-all duration-200', {
                      'bg-black': state.activeIndex === index,
                      'bg-neutral-300': state.activeIndex !== index,
                    })}
                    aria-label={resolvedTexts.goToRoom.replace('{index}', (index + 1).toString())}
                  />
                ))}
              </div>

              <button
                onClick={actions.nextSlide}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
                aria-label={resolvedTexts.nextRoomMobile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    )
  }

  // Three or more rooms: Full carousel behavior with container queries
  return (
    <div className={clsx('@container', className)}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>
      )}

      <div className="lg:col-span-2">
        {/* Slider Container with Visible Cards */}
        <div className="relative w-full overflow-visible h-full">
          {/* Room counter label */}
          <div className="absolute top-4 right-4 z-20 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {state.activeIndex + 1}/{roomOptions.length}
          </div>
          
          {/* Main Carousel Area */}
          <div className="w-full relative perspective-[1000px] h-[750px] overflow-hidden">
            {roomOptions.map((room, index) => {
              // Calculate if this card should be visible (previous, current, or next)
              const prevIndex = (state.activeIndex - 1 + roomOptions.length) % roomOptions.length
              const nextIndex = (state.activeIndex + 1) % roomOptions.length
              
              // Only show previous, current, and next cards
              const isVisible = index === state.activeIndex || index === prevIndex || index === nextIndex
              
              if (!isVisible) {
                return null
              }
              
              return (
                <div
                  key={room.id}
                  className={clsx('w-full absolute transition-all duration-500 ease-in-out', {
                    // Default: show only current card
                    'left-0 z-10': state.activeIndex === index,
                    'left-[-100%] z-5 opacity-0': index === prevIndex,
                    'left-[100%] z-5 opacity-0': index === nextIndex,
                    // When container is large enough (>1024px), show side cards
                    '@[1024px]:w-1/2 @[1024px]:left-1/4': state.activeIndex === index,
                    '@[1024px]:left-[-30%] @[1024px]:opacity-70': index === prevIndex,
                    '@[1024px]:left-[80%] @[1024px]:opacity-70': index === nextIndex,
                  })}
                >
                  <RoomCard
                    room={room}
                    discountBadgeText={resolvedTexts.discountBadgeText}
                    nightText={resolvedTexts.nightText}
                    learnMoreText={resolvedTexts.learnMoreText}
                    priceInfoText={resolvedTexts.priceInfoText}
                    selectedText={resolvedTexts.selectedText}
                    selectText={resolvedTexts.upgradeNowText || resolvedTexts.selectText}
                    removeText={resolvedTexts.removeText}
                    selectedRoom={state.selectedRoom}
                    onSelectRoom={readonly || mode === 'consultation' ? () => {} : actions.selectRoom}
                    activeImageIndex={state.activeImageIndices[index] || 0}
                    onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(index, newImageIndex)}
                    currencySymbol={resolvedTexts.currencySymbol}
                    onLearnMore={onLearnMore}
                    activeBid={activeBid}
                    bidSubmittedText={resolvedTexts.bidSubmittedText}
                    previousImageLabel={resolvedTexts.previousImage}
                    nextImageLabel={resolvedTexts.nextImage}
                    viewImageLabel={resolvedTexts.viewImage}
                    isActive={state.activeIndex === index}
                    showPriceSlider={shouldShowSlider}
                    minPrice={minPrice}
                    onMakeOffer={onMakeOffer}
                    onCancelBid={onCancelBid}
                    proposePriceText={resolvedTexts.proposePriceText}
                    makeOfferText={resolvedTexts.makeOfferText}
                    availabilityText={resolvedTexts.availabilityText}
                    currencyText={resolvedTexts.currencyText}
                    offerMadeText={resolvedTexts.offerMadeText}
                    updateBidText={resolvedTexts.updateBidText}
                    cancelBidText={resolvedTexts.cancelBidText}
                    dynamicAmenities={dynamicAmenitiesMap.get(room.id)}
                  />
                </div>
              )
            })}
          </div>

          {/* Desktop Carousel Navigation - Only visible on Desktop */}
          <CarouselNavigation
            onPrev={actions.prevSlide}
            onNext={actions.nextSlide}
            previousLabel={resolvedTexts.previousRoom}
            nextLabel={resolvedTexts.nextRoom}
          />
        </div>

        {/* Mobile/Tablet Carousel Controls */}
        <div className="lg:hidden flex justify-center items-center gap-4 mt-4">
          <button
            onClick={actions.prevSlide}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            aria-label={resolvedTexts.previousRoomMobile}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex gap-2">
            {roomOptions.map((room, index) => (
              <button
                key={`${room.id}-indicator`}
                onClick={() => actions.setActiveIndex(index)}
                className={clsx('h-2 w-2 rounded-full transition-all duration-200', {
                  'bg-black': state.activeIndex === index,
                  'bg-neutral-300': state.activeIndex !== index,
                })}
                aria-label={resolvedTexts.goToRoom.replace('{index}', (index + 1).toString())}
              />
            ))}
          </div>

          <button
            onClick={actions.nextSlide}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            aria-label={resolvedTexts.nextRoomMobile}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}

export default RoomSelectionCarousel
export { RoomSelectionCarousel as ABS_RoomSelectionCarousel }
