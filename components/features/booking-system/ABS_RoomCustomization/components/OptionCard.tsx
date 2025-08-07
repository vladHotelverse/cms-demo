import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RoomSelectionModal } from '@/components/ui/room-selection-modal';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import type { CustomizationOption, RoomCustomizationTexts } from '../types';
import { IconRenderer } from './IconRenderer';
import { Coins } from 'lucide-react';
import { useState } from 'react';

// Helper component for loyalty badge
const LoyaltyBadge: React.FC<{
  loyaltyPercentage?: number;
  loyaltyText?: string;
}> = ({ loyaltyPercentage = 10, loyaltyText = 'Loyalty' }) => {
  return (
    <div className="inline-flex items-center bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
      <span>
        {loyaltyText} {loyaltyPercentage}%
      </span>
    </div>
  );
};

interface OptionCardProps {
  option: CustomizationOption;
  isSelected: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  onSelect: () => void;
  texts: RoomCustomizationTexts;
  fallbackImageUrl?: string;
  showFeatures?: boolean;
  onShowFeatures?: () => void;
  mode?: 'interactive' | 'consultation';
  readonly?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  isDisabled = false,
  disabledReason,
  onSelect,
  texts,
  fallbackImageUrl,
  showFeatures = false,
  onShowFeatures,
  mode = 'interactive',
  readonly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const availableCount = Math.floor(Math.random() * 9) + 1;

  const handleClick = () => {
    if (isDisabled) return;
    onSelect();
  };

  const handleAvailableClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled) return;
    setIsModalOpen(true);
  };

  const handleModalAccept = (selectedRooms: string[]) => {
    // Handle the room selection
    console.log('Selected rooms for customization:', selectedRooms);
    onSelect(); // Select this option
  };

  // Generate mock room data for customization options
  const mockRooms = Array.from({ length: availableCount }, (_, index) => ({
    id: `room-${option.id}-${index + 101}`,
    number: `Room ${index + 101}`,
    features: [
      option.label,
      'Premium amenities',
      index % 2 === 0 ? 'City view' : 'Garden view'
    ],
    available: true,
  }));

  const cardContent = (
    <div
      className={clsx(
        'flex-none sm:w-auto bg-white border border-neutral-300 rounded-lg overflow-hidden snap-center transition-all duration-200 relative',
        {
          'opacity-50 cursor-not-allowed': isDisabled,
          'hover:shadow-md': !isDisabled,
        },
      )}
    >
      {/* Selected indicator - only show in interactive mode */}
      {isSelected && !isDisabled && mode !== 'consultation' && (
        <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded flex items-center gap-1 bg-green-600/90">
          <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
          Selected
        </div>
      )}
      <div className="p-4 flex flex-col">
        <div className="flex flex-col mb-1">
          <div className="flex gap-2.5 items-center w-20">
            <div
              className={clsx('flex items-center justify-center w-10 h-10', {
                'text-neutral-400': isDisabled,
              })}
            >
              <IconRenderer
                iconName={option.icon}
                fallbackImageUrl={fallbackImageUrl}
                label={option.label}
              />
            </div>
          </div>
          <h3
            className={clsx('font-medium text-sm', {
              'text-neutral-400': isDisabled,
            })}
          >
            {option.label}
          </h3>
        </div>
        {option.description && (
          <p
            className={clsx('text-xs mb-1', {
              'text-neutral-300': isDisabled,
              'text-neutral-500': !isDisabled,
            })}
          >
            {option.description}
          </p>
        )}
        {/* Price display with loyalty discount */}
        <div
          className={clsx('mb-2 flex items-center justify-between', {
            'text-neutral-400': isDisabled,
          })}
        >
          <div className="flex gap-2 items-center">
            <div className="text-sm font-semibold">
              {(option.price * 0.9).toFixed(2)} {texts.pricePerNightText}
            </div>
            {option.price > 0 && (
              <div className="text-xs text-gray-500 line-through">
                {option.price.toFixed(2)} EUR
              </div>
            )}
          </div>
        </div>
        {mode !== 'consultation' && option.price > 0 && (
          <section className='flex items-center justify-between mb-2'>
            <LoyaltyBadge loyaltyPercentage={10} loyaltyText="Loyalty" />
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold">
              <div className="bg-green-100 p-1 rounded-full">
                <Coins className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-emerald-600">
                {' '}
                {(option.price * 0.1).toFixed(2)} EUR
              </span>
            </div>
          </section>
        )}

        {mode !== 'consultation' && (
          <div className="flex flex-col space-y-2 mt-auto">
            <Button
              onClick={isSelected ? handleClick : handleAvailableClick}
              variant={isSelected ? 'destructive' : 'secondary'}
              size="sm"
              className={clsx('w-full transition-all border', {
                'hover:bg-black hover:text-white': !isSelected,
              })}
              disabled={isDisabled || readonly}
            >
              {isSelected
                ? texts.removeText
                : isDisabled
                  ? texts.optionDisabledText
                  : `${availableCount} available`}
            </Button>

            {showFeatures && onShowFeatures && !readonly && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) onShowFeatures();
                }}
                variant="link"
                size="sm"
                disabled={isDisabled}
              >
                {texts.featuresText}
              </Button>
            )}
          </div>
        )}
        {mode === 'consultation' && isSelected && (
          <div className="flex items-center justify-center mt-auto">
            <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
              {texts.selectedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isDisabled && disabledReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p>{disabledReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      {cardContent}
      <RoomSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleModalAccept}
        title={`Available Rooms for ${option.label}`}
        description={`Select a room to add ${option.label} customization:`}
        rooms={mockRooms}
        availableCount={availableCount}
        maxSelection={1}
        type="customization"
      />
    </>
  );
};
