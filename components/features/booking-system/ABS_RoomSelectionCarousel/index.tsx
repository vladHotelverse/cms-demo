import clsx from 'clsx';
import type React from 'react';
import { useMemo, useRef, useCallback } from 'react';
import { RoomCard } from './components';
import { useCarouselState } from './hooks/useCarouselState';
import type {
  RoomSelectionCarouselProps,
  RoomSelectionCarouselTranslations,
} from './types';
import {
  getCurrentRoomAmenities,
  getDynamicAmenitiesForAllRooms,
} from './utils/amenitiesSelector';

const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = ({
  className,
  title,
  subtitle,
  roomOptions,
  initialSelectedRoom = null,
  onRoomSelected,
  translations,
  currentRoomType = 'DELUXE SILVER',
  currentRoomAmenities,
  mode = 'selection',
  readonly = false,
  nights = 1,
  // Text props
  nightText,
  priceInfoText,
  selectedText,
  selectText,
  currencySymbol,
  discountBadgeText,
  upgradeNowText,
  removeText,
}) => {
  // Helper function to resolve text values (new translations object takes precedence)
  const getTranslation = (
    key: keyof Omit<RoomSelectionCarouselTranslations, 'navigationLabels'>,
    fallbackValue?: string,
    defaultValue = '',
  ): string => {
    if (translations?.[key]) {
      return translations[key] as string;
    }
    return fallbackValue || defaultValue;
  };

  // Helper function to get navigation labels
  const getNavigationLabel = (
    key: keyof RoomSelectionCarouselTranslations['navigationLabels'],
    fallbackValue?: string,
    defaultValue = '',
  ): string => {
    if (translations?.navigationLabels?.[key]) {
      return translations.navigationLabels[key];
    }
    return fallbackValue || defaultValue;
  };

  // Resolve all text values with backward compatibility
  const resolvedTexts = {
    nightText: getTranslation('nightText', nightText, '/noche'),
    priceInfoText: getTranslation(
      'priceInfoText',
      priceInfoText,
      'Información sobre tarifas e impuestos.',
    ),
    selectedText: getTranslation('selectedText', selectedText, 'SELECCIONADO'),
    selectText: getTranslation('selectText', selectText, 'SELECCIONAR'),
    currencySymbol: getTranslation('currencySymbol', currencySymbol, '€'),
    upgradeNowText: getTranslation(
      'upgradeNowText',
      upgradeNowText,
      'Upgrade now',
    ),
    removeText: getTranslation('removeText', removeText, 'Remove'),
    discountBadgeText: getTranslation(
      'discountBadgeText',
      discountBadgeText,
      '-{percentage}%',
    ),
    noRoomsAvailableText: getTranslation(
      'noRoomsAvailableText',
      undefined,
      'No hay habitaciones disponibles.',
    ),
    instantConfirmationText: getTranslation(
      'instantConfirmationText',
      undefined,
      'Instant Confirmation',
    ),
    commissionText: getTranslation('commissionText', undefined, 'Commission'),
    totalAmountText: getTranslation('totalAmountText', undefined, 'Total'),
    // Navigation labels
    previousRoom: getNavigationLabel(
      'previousRoom',
      undefined,
      'Previous room',
    ),
    nextRoom: getNavigationLabel('nextRoom', undefined, 'Next room'),
    goToRoom: getNavigationLabel('goToRoom', undefined, 'Go to room {index}'),
    previousImage: getNavigationLabel(
      'previousImage',
      undefined,
      'Previous image',
    ),
    nextImage: getNavigationLabel('nextImage', undefined, 'Next image'),
    viewImage: getNavigationLabel('viewImage', undefined, 'View image {index}'),
  };

  // Generate dynamic amenities for all rooms
  const dynamicAmenitiesMap = useMemo(() => {
    const userCurrentAmenities =
      currentRoomAmenities ||
      getCurrentRoomAmenities(currentRoomType, roomOptions);
    return getDynamicAmenitiesForAllRooms(
      roomOptions,
      currentRoomType,
      userCurrentAmenities,
    );
  }, [roomOptions, currentRoomType, currentRoomAmenities]);

  // Use carousel state management
  const { state, actions } = useCarouselState({
    roomOptions,
    initialSelectedRoom,
    onRoomSelected,
  });

  // Drag functionality for carousel navigation
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const handleDragStart = useCallback((clientX: number) => {
    isDragging.current = true;
    dragStartX.current = clientX;
  }, []);

  const handleDragEnd = useCallback(
    (clientX: number) => {
      if (!isDragging.current) return;

      const dragDistance = clientX - dragStartX.current;
      const threshold = 50; // Minimum drag distance to trigger navigation

      if (Math.abs(dragDistance) > threshold) {
        if (dragDistance > 0) {
          // Dragged right - go to previous
          actions.prevSlide();
        } else {
          // Dragged left - go to next
          actions.nextSlide();
        }
      }

      isDragging.current = false;
    },
    [actions],
  );

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientX);
    },
    [handleDragStart],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
  }, []);

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      handleDragEnd(e.clientX);
    },
    [handleDragEnd],
  );

  // Touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    // Prevent scrolling while dragging
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (e.changedTouches.length > 0) {
        handleDragEnd(e.changedTouches[0].clientX);
      }
    },
    [handleDragEnd],
  );

  if (roomOptions.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)}>
        <p className="text-neutral-500">{resolvedTexts.noRoomsAvailableText}</p>
      </div>
    );
  }

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
            priceInfoText={resolvedTexts.priceInfoText}
            selectedText={resolvedTexts.selectedText}
            selectText={
              resolvedTexts.upgradeNowText || resolvedTexts.selectText
            }
            removeText={resolvedTexts.removeText}
            selectedRoom={state.selectedRoom}
            onSelectRoom={
              readonly || mode === 'consultation'
                ? () => {}
                : actions.selectRoom
            }
            activeImageIndex={state.activeImageIndices[0] || 0}
            onImageChange={(newImageIndex: number) =>
              actions.setActiveImageIndex(0, newImageIndex)
            }
            currencySymbol={resolvedTexts.currencySymbol}
            previousImageLabel={resolvedTexts.previousImage}
            nextImageLabel={resolvedTexts.nextImage}
            viewImageLabel={resolvedTexts.viewImage}
            dynamicAmenities={dynamicAmenitiesMap.get(roomOptions[0].id)}
            nights={nights}
          />
        </div>
      </div>
    );
  }

  // Three or more rooms: Full carousel behavior with container queries
  return (
    <div className={clsx('@container h-[calc(100%-74px)]', className)}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>
      )}

      <div className="lg:col-span-2 relative h-full">
        {/* Slider Container with Visible Cards */}
        <div className="relative w-full overflow-visible h-full">
          {/* Main Carousel Area */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Drag functionality for carousel navigation */}
          <div
            ref={dragRef}
            className="w-full relative perspective-[1000px] h-[500px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
            role="presentation"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {roomOptions.map((room, index) => {
              // Calculate if this card should be visible (previous, current, or next)
              const prevIndex =
                (state.activeIndex - 1 + roomOptions.length) %
                roomOptions.length;
              const nextIndex = (state.activeIndex + 1) % roomOptions.length;

              // Only show previous, current, and next cards
              const isVisible =
                index === state.activeIndex ||
                index === prevIndex ||
                index === nextIndex;

              if (!isVisible) {
                return null;
              }

              return (
                <div
                  key={room.id}
                  className={clsx(
                    'w-full absolute transition-all duration-500 ease-in-out',
                    {
                      // Default: show only current card
                      'left-0 z-10': state.activeIndex === index,
                      'left-[-100%] z-5 opacity-0': index === prevIndex,
                      'left-[100%] z-5 opacity-0': index === nextIndex,
                      // When container is large enough (>1024px), show side cards
                      '@[1024px]:w-1/2 @[1024px]:left-1/4':
                        state.activeIndex === index,
                      '@[1024px]:left-[-30%] @[1024px]:opacity-70':
                        index === prevIndex,
                      '@[1024px]:left-[80%] @[1024px]:opacity-70':
                        index === nextIndex,
                    },
                  )}
                >
                  <RoomCard
                    room={room}
                    discountBadgeText={resolvedTexts.discountBadgeText}
                    nightText={resolvedTexts.nightText}
                    priceInfoText={resolvedTexts.priceInfoText}
                    selectedText={resolvedTexts.selectedText}
                    selectText={
                      resolvedTexts.upgradeNowText || resolvedTexts.selectText
                    }
                    removeText={resolvedTexts.removeText}
                    selectedRoom={state.selectedRoom}
                    onSelectRoom={
                      readonly || mode === 'consultation'
                        ? () => {}
                        : actions.selectRoom
                    }
                    activeImageIndex={state.activeImageIndices[index] || 0}
                    onImageChange={(newImageIndex: number) =>
                      actions.setActiveImageIndex(index, newImageIndex)
                    }
                    currencySymbol={resolvedTexts.currencySymbol}
                    instantConfirmationText={
                      resolvedTexts.instantConfirmationText
                    }
                    commissionText={resolvedTexts.commissionText}
                    totalAmountText={resolvedTexts.totalAmountText}
                    nights={nights}
                    previousImageLabel={resolvedTexts.previousImage}
                    nextImageLabel={resolvedTexts.nextImage}
                    viewImageLabel={resolvedTexts.viewImage}
                    dynamicAmenities={dynamicAmenitiesMap.get(room.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Controls with counter */}
        <div className="flex justify-center items-center gap-4 absolute bottom-3.5 left-0 right-0">
          {/* Previous button */}
          <button
            type="button"
            onClick={actions.prevSlide}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-label={resolvedTexts.previousRoom}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              <title>Previous</title>
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {roomOptions.map((room, index) => (
              <button
                key={`room-${room.id}-indicator`}
                type="button"
                onClick={() => actions.setActiveIndex(index)}
                className={clsx(
                  'w-2 h-2 rounded-full transition-colors',
                  state.activeIndex === index 
                    ? 'bg-gray-800' 
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={resolvedTexts.goToRoom.replace(
                  '{index}',
                  (index + 1).toString(),
                )}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={actions.nextSlide}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
            aria-label={resolvedTexts.nextRoom}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              <title>Next</title>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionCarousel;
export { RoomSelectionCarousel as ABS_RoomSelectionCarousel };
