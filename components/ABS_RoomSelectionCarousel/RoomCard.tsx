import clsx from 'clsx';
import { Star } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import type { RoomOption } from './types';

// Helper component for discount badge to avoid conditional hook usage
const DiscountBadge: React.FC<{
  room: RoomOption;
  discountBadgeText: string;
}> = ({ room, discountBadgeText }) => {
  const discountText = useMemo(() => {
    if (!room.oldPrice || room.oldPrice === 0) return '';
    const discountPercentage = Math.round(
      (1 - room.price / room.oldPrice) * 100,
    );
    return discountBadgeText.includes('{percentage}')
      ? discountBadgeText.replace('{percentage}', discountPercentage.toString())
      : `${discountBadgeText}${discountPercentage}%`;
  }, [discountBadgeText, room.price, room.oldPrice]);

  return (
    <div className="absolute top-3 right-3 bg-black text-white py-1 px-2 rounded text-xs font-bold z-10">
      <span>{discountText}</span>
    </div>
  );
};

interface RoomCardProps {
  room: RoomOption;
  discountBadgeText: string;
  nightText: string;
  priceInfoText: string;
  selectedText: string;
  selectText: string;
  removeText: string;
  selectedRoom: RoomOption | null;
  onSelectRoom: (room: RoomOption | null) => void;
  activeImageIndex: number;
  onImageChange: (newImageIndex: number) => void;
  currencySymbol?: string;
  instantConfirmationText?: string;
  // Translation props for image navigation
  previousImageLabel?: string;
  nextImageLabel?: string;
  viewImageLabel?: string; // Template: 'View image {index}'
  // Dynamic amenities props
  dynamicAmenities?: string[];
  // New pricing props
  commissionText?: string;
  totalAmountText?: string;
  nights?: number;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  discountBadgeText,
  nightText,
  priceInfoText,
  selectedText,
  selectText,
  removeText,
  selectedRoom,
  onSelectRoom,
  activeImageIndex,
  onImageChange,
  currencySymbol = '€',
  instantConfirmationText = 'Instant Confirmation',
  previousImageLabel = 'Previous image',
  nextImageLabel = 'Next image',
  viewImageLabel = 'View image {index}',
  dynamicAmenities,
  commissionText = 'Commission',
  totalAmountText = 'Total',
  nights = 1,
}) => {
  // State for checking if description is truncated
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Check if description needs truncation
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setIsDescriptionTruncated(element.scrollHeight > element.clientHeight);
    }
  }, []);
  // Memoized handlers
  const handleImageNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      const totalImages = room.images.length;
      if (direction === 'prev') {
        const newIndex =
          activeImageIndex > 0 ? activeImageIndex - 1 : totalImages - 1;
        onImageChange(newIndex);
      } else {
        const newIndex = (activeImageIndex + 1) % totalImages;
        onImageChange(newIndex);
      }
    },
    [room.images.length, activeImageIndex, onImageChange],
  );

  // Image drag functionality
  const imageDragRef = useRef<HTMLDivElement>(null);
  const imageDragStartX = useRef(0);
  const isImageDragging = useRef(false);

  const handleImageDragStart = useCallback((clientX: number) => {
    isImageDragging.current = true;
    imageDragStartX.current = clientX;
  }, []);

  const handleImageDragEnd = useCallback((clientX: number) => {
    if (!isImageDragging.current) return;
    
    const dragDistance = clientX - imageDragStartX.current;
    const threshold = 30; // Smaller threshold for image navigation
    
    if (Math.abs(dragDistance) > threshold && room.images.length > 1) {
      if (dragDistance > 0) {
        // Dragged right - go to previous image
        handleImageNavigation('prev');
      } else {
        // Dragged left - go to next image
        handleImageNavigation('next');
      }
    }
    
    isImageDragging.current = false;
  }, [handleImageNavigation, room.images.length]);

  // Image mouse events
  const handleImageMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageDragStart(e.clientX);
  }, [handleImageDragStart]);

  const handleImageMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isImageDragging.current) return;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleImageMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleImageDragEnd(e.clientX);
  }, [handleImageDragEnd]);

  // Image touch events
  const handleImageTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    handleImageDragStart(e.touches[0].clientX);
  }, [handleImageDragStart]);

  const handleImageTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isImageDragging.current) return;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleImageTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.changedTouches.length > 0) {
      handleImageDragEnd(e.changedTouches[0].clientX);
    }
  }, [handleImageDragEnd]);

  const handleSelectRoom = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // If the room is already selected, deselect it; otherwise, select it
      const isCurrentlySelected = selectedRoom?.id === room.id;
      onSelectRoom(isCurrentlySelected ? null : room);
    },
    [onSelectRoom, room, selectedRoom],
  );


  return (
    <div
      className={clsx(
        'relative rounded-b-lg overflow-hidden max-w-lg transition-all duration-300',
      )}
    >
      {/* Discount Badge */}
      {room.oldPrice && !selectedRoom?.id && (
        <DiscountBadge room={room} discountBadgeText={discountBadgeText} />
      )}

      {/* Selected Badge */}
      {selectedRoom?.id === room.id && (
        <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs flex items-center gap-1 py-1 px-2 rounded">
          <Star className="h-3 w-3" />
          <span>{selectedText}</span>
        </div>
      )}

      {/* Room Image Carousel */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Drag functionality for image navigation */}
      <div 
        ref={imageDragRef}
        className="relative h-48 bg-neutral-100 group cursor-grab active:cursor-grabbing select-none"
        role="presentation"
        onMouseDown={handleImageMouseDown}
        onMouseMove={handleImageMouseMove}
        onMouseUp={handleImageMouseUp}
        onMouseLeave={handleImageMouseUp}
        onTouchStart={handleImageTouchStart}
        onTouchMove={handleImageTouchMove}
        onTouchEnd={handleImageTouchEnd}
      >
        <img
          src={room.images[activeImageIndex]}
          alt={room.title || room.roomType}
          className="object-cover w-full h-full pointer-events-none"
        />

        {/* Image Navigation Arrows - only show if multiple images */}
        {room.images.length > 1 && (
          <>
            {/* Previous Image */}
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleImageNavigation('prev');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 border-0"
              aria-label={previousImageLabel}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <title>Previous Image</title>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Button>

            {/* Next Image */}
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleImageNavigation('next');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70 border-0"
              aria-label={nextImageLabel}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <title>Next Image</title>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Button>
          </>
        )}

        {/* Amenities overlay - top left */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-[400px]">
          {(dynamicAmenities || room.amenities.slice(0, 2)).map((amenity) => (
            <span
              key={`${room.id}-${amenity}`}
              className="text-xs bg-white/90 backdrop-blur-sm border border-white/20 px-2 py-1 rounded-md text-nowrap shadow-sm"
            >
              {amenity}
            </span>
          ))}
        </div>

        {/* Image Indicators */}
        {room.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {room.images.map((_, imgIndex) => (
              <Button
                key={`${room.id}-img-${imgIndex}`}
                variant="ghost"
                size="icon"
                className={clsx(
                  'h-2 w-2 rounded-full p-0 min-w-0 transition-colors duration-200',
                  {
                    'bg-white hover:bg-white/80': activeImageIndex === imgIndex,
                    'bg-white/50 hover:bg-white/70':
                      activeImageIndex !== imgIndex,
                  },
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(imgIndex);
                }}
                aria-label={viewImageLabel.replace(
                  '{index}',
                  (imgIndex + 1).toString(),
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="px-4 pb-4 pt-3">
        {room.title && <h3 className="text-lg font-bold mb-1">{room.title}</h3>}
        <h4
          className={clsx('font-medium mb-1 text-neutral-600', {
            'text-sm': !room.title,
            'text-xs': room.title,
          })}
        >
          {room.roomType}
        </h4>
        <div className="mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  ref={descriptionRef}
                  className="text-sm min-h-10 overflow-hidden line-clamp-2 cursor-help"
                  style={{ maxHeight: '2.5rem' }}
                >
                  {room.description}
                </p>
              </TooltipTrigger>
              {isDescriptionTruncated && (
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">{room.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>


        {/* Pricing Grid Section */}
        <div className="mt-3 mb-4">
          {/* Calculate values */}
          {(() => {
            const totalPrice = room.price * nights;
            const commission = Math.round(totalPrice * 0.1 * 100) / 100; // 10% commission, rounded to 2 decimals
            
            return (
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {/* Row 1: Price per night | Upgrade button */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900">{`${currencySymbol}${room.price}`}</span>
                  {room.oldPrice && (
                    <span className="text-neutral-500 line-through text-base">{`${currencySymbol}${room.oldPrice}`}</span>
                  )}
                  <span className="text-base text-neutral-600">{nightText}</span>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant={selectedRoom?.id === room.id ? 'destructive' : 'default'}
                    className="w-fit uppercase tracking-wide text-sm px-4 py-2 h-10 font-semibold whitespace-nowrap"
                    onClick={handleSelectRoom}
                  >
                    {selectedRoom?.id === room.id ? removeText : selectText}
                  </Button>
                </div>

                {/* Row 2: Commission Text | Instant Confirmation Text */}
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-emerald-600">{commissionText}:</span>
                  <span className="text-base font-semibold text-emerald-600">{`${currencySymbol}${commission}`}</span>
                </div>
                <div className="flex justify-end items-center">
                  <span className="text-base font-medium text-emerald-600 whitespace-nowrap">
                    {instantConfirmationText}
                  </span>
                </div>

                {/* Row 3: Total | Price info */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600">{totalAmountText}:</span>
                  <span className="text-sm font-medium text-gray-700">{`${currencySymbol}${totalPrice}`}</span>
                </div>
                <div className="flex justify-end items-center">
                  <span className="text-xs text-neutral-500 text-right">
                    {priceInfoText}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
