'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RoomSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (selectedRooms: string[]) => void;
  title?: string;
  description?: string;
  rooms: Array<{
    id: string;
    number: string;
    features?: string[];
    available?: boolean;
  }>;
  availableCount: number;
  maxSelection?: number;
  type: 'room' | 'customization';
}

export const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  title = 'Select Rooms',
  description = 'Choose from the available rooms below:',
  rooms,
  availableCount,
  maxSelection = 1,
  type = 'room',
}) => {
  const [selectedRooms, setSelectedRooms] = React.useState<string[]>([]);

  // Reset selections when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedRooms([]);
    }
  }, [isOpen]);

  const handleRoomToggle = (roomId: string) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        // Remove room from selection
        return prev.filter((id) => id !== roomId);
      } else {
        // Add room to selection (respecting max selection limit)
        if (prev.length >= maxSelection) {
          // Replace first selection if at max
          return maxSelection === 1 ? [roomId] : [...prev.slice(1), roomId];
        }
        return [...prev, roomId];
      }
    });
  };

  const handleAccept = () => {
    onAccept(selectedRooms);
    onClose();
  };

  const isRoomSelected = (roomId: string) => selectedRooms.includes(roomId);
  const canSelectMore = selectedRooms.length < maxSelection;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="ml-auto">
              {availableCount} available
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {description}
            {maxSelection > 1 && (
              <span className="block mt-1 text-sm">
                You can select up to {maxSelection}{' '}
                {type === 'room' ? 'rooms' : 'options'}.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid gap-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                type='button'
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer',
                  'hover:bg-gray-50 hover:border-gray-300',
                  isRoomSelected(room.id) && 'bg-blue-50 border-blue-200',
                  !room.available && 'opacity-50 cursor-not-allowed',
                )}
                onClick={() => room.available && handleRoomToggle(room.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      'flex items-center justify-center min-w-6 min-h-6 rounded-full border-2 transition-colors',
                      isRoomSelected(room.id)
                        ? 'bg-gray-600 border-gray-600 text-white'
                        : 'border-gray-300 hover:border-blue-400',
                    )}
                  >
                    {isRoomSelected(room.id) && <Check className="w-4 h-4" />}
                  </div>

                    <div className="font-medium text-gray-900">
                      {room.number}
                    </div>
                </div>

                {!room.available && (
                  <Badge variant="secondary">Unavailable</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedRooms.length} of {maxSelection} selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={selectedRooms.length === 0}
            >
              Accept ({selectedRooms.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
