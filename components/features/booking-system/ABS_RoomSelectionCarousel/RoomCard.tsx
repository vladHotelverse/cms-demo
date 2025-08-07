import clsx from 'clsx';
import { Coins, Star } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RoomSelectionModal } from '@/components/ui/room-selection-modal';
import { COMMISSION_PERCENTAGE } from '@/constants/reservation-summary';
import type { RoomOption } from './types';

// Helper component for loyalty badge
const LoyaltyBadge: React.FC<{
  loyaltyPercentage?: number;
  loyaltyText?: string;
}> = ({ loyaltyPercentage = 10, loyaltyText = 'Loyalty' }) => {
  return (
    <div className="inline-flex items-center bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
      <span>{loyaltyText} {loyaltyPercentage}%</span>
    </div>
  );
};

// Helper component for commission badge
const CommissionBadge: React.FC<{
  commission: number;
  currencySymbol: string;
  commissionText?: string;
}> = ({ commission, currencySymbol }) => {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold">
      <div className="bg-green-100 p-1 rounded-full">
        <Coins className="h-3 w-3 text-green-600" />
      </div>
      <span className='text-emerald-600'>{currencySymbol}{commission}</span>
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
  commissionPercentage?: number;
  totalAmountText?: string;
  nights?: number;
  // Loyalty props
  loyaltyPercentage?: number;
  loyaltyText?: string;
  // Selling points props
  sellingPoints?: string[];
  showSellingPoints?: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  priceInfoText,
  selectedText,
  removeText,
  selectedRoom,
  onSelectRoom,
  activeImageIndex,
  onImageChange,
  currencySymbol = '€',
  previousImageLabel = 'Previous image',
  nextImageLabel = 'Next image',
  viewImageLabel = 'View image {index}',
  dynamicAmenities,
  totalAmountText = 'Total',
  nights = 1,
  loyaltyPercentage = 10,
  loyaltyText = 'Loyalty',
  sellingPoints,
  showSellingPoints = true,
}) => {
  // State for checking if description is truncated
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const availableCount = Math.floor(Math.random() * 10) + 1;

  // Function to get room-specific selling points  
  const getSellingPointsByRoomType = (roomType: string): string[] => {
    const normalizedRoomType = roomType.toLowerCase().trim();
    
    // Standard Room variations
    if (normalizedRoomType.includes('standard')) {
      return [
        "Quality furnishings with queen bed",
        "Great location with easy access",
        "Smart choice for comfort & value"
      ];
    }
    
    // Superior Room variations
    if (normalizedRoomType.includes('superior')) {
      return [
        "40% larger with king bed & marble bath",
        "Top floor with panoramic views",
        "Only €45 more for premium upgrade"
      ];
    }
    
    // Deluxe Room variations
    if (normalizedRoomType.includes('deluxe')) {
      return [
        "40% larger with premium king bed",
        "Exclusive balcony with landmark views",
        "Only €45 more for luxury upgrade"
      ];
    }
    
    // Suite variations
    if (normalizedRoomType.includes('suite')) {
      return [
        "Spacious living area with separate bedroom",
        "Premium amenities: minibar & coffee machine", 
        "VIP concierge and priority service"
      ];
    }
    
    // Premium Room variations
    if (normalizedRoomType.includes('premium')) {
      return [
        "Top floor with panoramic city views",
        "Rain shower and luxury toiletries",
        "Express check-in/out & late checkout"
      ];
    }
    
    // Family Room variations
    if (normalizedRoomType.includes('family')) {
      return [
        "Perfect for families - sleeps up to 4",
        "Child-friendly amenities & toys included",
        "Close to pool and family activities"
      ];
    }
    
    // Fallback generic selling points for unknown room types
    console.log('Unknown room type, using fallback points:', roomType);
    return [
      "Beautiful suite with landmark views",
      "40% larger with king bed & balcony", 
      "Only €76 more for premium experience"
    ];
  };

  // Use provided selling points, or get room-specific points, or use defaults
  const currentSellingPoints = sellingPoints || getSellingPointsByRoomType(room.roomType);

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

  const handleAvailableClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  }, []);

  const handleModalAccept = useCallback((selectedRooms: string[]) => {
    // Handle the room selection
    console.log('Selected superior rooms:', selectedRooms);
    onSelectRoom(room); // Select this room type
  }, [onSelectRoom, room]);

  // Generate mock room data for superior rooms
  const mockRooms = Array.from({ length: availableCount }, (_, index) => ({
    id: `superior-${room.id}-${index + 101}`,
    number: `Room ${index + 101}`,
    features: [
      room.roomType,
      ...(room.amenities?.slice(0, 2) || ['Premium amenities']),
      index % 2 === 0 ? 'Balcony' : 'City view'
    ],
    available: true,
  }));


  return (
    <div
      className={clsx(
        'relative rounded-b-lg overflow-hidden max-w-lg transition-all duration-300',
      )}
    >

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

              {/* Selected Badge */}
      {selectedRoom?.id === room.id && (
        <div className="absolute bottom-2 left-2 z-30 bg-green-600 text-white text-xs flex items-center gap-1 py-1 px-2 rounded shadow-lg">
          <Star className="h-3 w-3" />
          <span>{selectedText}</span>
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
          {showSellingPoints ? (
            // Selling points list
            <ul className="space-y-1 rounded-lg border bg-muted/50 p-3">
              {currentSellingPoints.map((point, index) => (
                <li key={`selling-point-${room.id}-${index}`} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-black">{point}</span>
                </li>
              ))}
            </ul>
          ) : (
            // Fallback to original description
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
          )}
        </div>


        {/* Pricing Grid Section */}
        <div className="mt-3 mb-4">
          {/* Calculate values */}
          {(() => {
            // Calculate loyalty discount
            const originalPrice = room.oldPrice || Math.round(room.price / (1 - loyaltyPercentage / 100));
            const totalPrice = room.price * nights;
            const commission = Math.round(totalPrice * 0.1 * 100) / 100;
            return (
              <div>
                
                {/* Price layout */}
                <div className="flex items-start justify-between mt-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900">{`${currencySymbol}${room.price}`}</span>
                      <span className="text-neutral-500 line-through text-base">{`${currencySymbol}${originalPrice}`}</span>
                      <span className="text-base text-neutral-600">/night</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <CommissionBadge commission={commission} currencySymbol={currencySymbol} />
                    <LoyaltyBadge loyaltyPercentage={loyaltyPercentage} loyaltyText={loyaltyText} />
                  </div>
                </div>

                {/* Total Price and Button Row - Combined for space optimization */}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-base text-gray-700">
                    <span className='font-semibold text-lg'>{`${currencySymbol}${totalPrice} `}</span>
                    {totalAmountText}
                  </p>
                  <Button
                    variant={selectedRoom?.id === room.id ? 'destructive' : 'default'}
                    className="w-fit uppercase tracking-wide text-sm px-4 py-2 h-10 font-semibold whitespace-nowrap"
                    onClick={selectedRoom?.id === room.id ? handleSelectRoom : handleAvailableClick}
                  >
                    {selectedRoom?.id === room.id ? removeText : `${availableCount} Available`}
                  </Button>
                </div>

                {/* Row 3: Price info */}
                  <span className="text-xs text-neutral-500 whitespace-nowrap text-start">
                    {priceInfoText}
                  </span>
              </div>
            );
          })()}
        </div>
      </div>
      <RoomSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleModalAccept}
        title={`Available ${room.roomType} Rooms`}
        description={`Select your preferred ${room.roomType.toLowerCase()} room:`}
        rooms={mockRooms}
        availableCount={availableCount}
        maxSelection={1}
        type="room"
      />
    </div>
  );
};

export default RoomCard;