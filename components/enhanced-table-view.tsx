'use client';

import { useState } from 'react';
import {
  Plus,
  Minus,
  CalendarDays,
  Check,
  Zap,
  Crown,
  MapPin,
  Building2,
  Coins,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoomSelectionModal } from '@/components/ui/room-selection-modal';

interface EnhancedTableViewProps {
  onAddToCart: (item: any) => void;
  onSelectRoom: (room: any) => void;
  onSelectAttribute?: (attribute: any, itemKey: string) => void;
}

// Enhanced room upgrade data - matching carousel room types
const roomUpgrades = [
  {
    id: 1,
    type: 'DELUXE GOLD',
    price: '30€',
    features: 'Premium king bed, Private balcony, 40 sqm',
    image:
      'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/49a54c09-0945-4a87-893d-8d28d79e0f5b/image.webp',
  },
  {
    id: 2,
    type: 'ROCK SUITE',
    price: '89€',
    features: 'Music-themed suite, Separate living area, Premium sound system',
    image:
      'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/3e7e2260-63e3-4934-9358-ebf08bb6d96a/image.webp',
  },
  {
    id: 3,
    type: '80S SUITE',
    price: '107€',
    features: 'Retro 80s design, Jacuzzi bathtub, VIP concierge',
    image:
      'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt641/850e6840-cc2b-48f8-9059-3a64d2b9b097/image.webp',
  },
  {
    id: 4,
    type: 'ROCK SUITE DIAMOND',
    price: '125€',
    features: 'Private terrace with pool, Personal butler, 120 sqm penthouse',
    image:
      'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt643/5a6459fb-7a86-4d9d-9d9d-acd9a80033d5/original.webp',
  },
];

// Enhanced attributes with icons and metadata
const attributes = {
  'Bed Type': {
    icon: Building2,
    items: [
      {
        name: 'Double Size Bed',
        price: '2,50€',
        description: 'Bed size 135x200',
      },
      {
        name: 'Queen Size Bed',
        price: '3,75€',
        description: 'Bed size 150x200',
      },
      {
        name: 'King Size Bed',
        price: '6€',
        description: 'Bed size 180x200',
      },
      {
        name: 'Extra King Size Bed',
        price: '9€',
        description: 'Bed size 200x200',
      },
    ],
  },
  Location: {
    icon: MapPin,
    items: [
      {
        name: 'Close to Main Pool',
        price: '2,50€',
        description: 'Close to hotel Main Pool',
      },
      {
        name: 'In Main Building',
        price: '3,75€',
        description: 'Near Hotel Entrance',
      },
      {
        name: 'Corner Room',
        price: '6€',
        description: 'Extra Balcony Size',
      },
      {
        name: 'Quiet Area',
        price: '9€',
        description: 'For Business Guests',
      },
      {
        name: 'Direct Pool Access',
        price: '10,50€',
        description: 'Swim-out',
      },
    ],
  },
  Floor: {
    icon: Building2,
    items: [
      {
        name: 'Lower Floor',
        price: '2,50€',
        description: 'Lower floor',
      },
      {
        name: 'Intermediate Floor',
        price: '3,75€',
        description: 'Floors 1 - 3',
      },
      {
        name: 'Higher Floors',
        price: '6€',
        description: 'Floors 4-6',
      },
      {
        name: 'Rooftop',
        price: '9€',
        description: 'Floor 7',
      },
    ],
  },
};

// Enhanced extras
const extras = [
  {
    name: 'Early Check In',
    price: '6€',
    priceType: 'per stay',
    units: 1,
    description: 'Check in before 3 PM',
  },
  {
    name: 'Spa Treatment',
    price: '40€',
    priceType: 'per treatment',
    units: 2,
    description: 'Relaxing spa experience',
  },
  {
    name: 'Dinner Package',
    price: '60€',
    priceType: 'per person/date',
    units: 1,
    description: 'Premium dining experience',
  },
  {
    name: 'Pool Bed Reservation',
    price: '3€',
    priceType: 'per day',
    units: 1,
    description: 'Reserved poolside seating',
  },
  {
    name: 'Late Check Out',
    price: '6€',
    priceType: 'per stay',
    units: 1,
    description: 'Check out after 12 PM',
  },
];

export default function EnhancedTableView({
  onAddToCart,
  onSelectRoom,
  onSelectAttribute,
}: EnhancedTableViewProps) {
  const [selectedRooms, setSelectedRooms] = useState<Set<number>>(new Set());
  const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(
    new Set(),
  );
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [extraQuantities, setExtraQuantities] = useState<{
    [key: string]: number;
  }>({
    'Spa Treatment': 2,
    'Dinner Package': 1,
  });
  const [isModalOpen, setIsModalOpen] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedGalleryRoom, setSelectedGalleryRoom] = useState<any>(null);
  const [availableCounts] = useState<{ [key: number]: number }>(() => {
    // Generate random available counts (1-10) for each room
    const counts: { [key: number]: number } = {};
    roomUpgrades.forEach((room) => {
      counts[room.id] = Math.floor(Math.random() * 10) + 1;
    });
    return counts;
  });
  const [attributeAvailableCounts] = useState<{ [key: string]: number }>(() => {
    // Generate random available counts (1-10) for each attribute
    const counts: { [key: string]: number } = {};
    Object.entries(attributes).forEach(([category, data]) =>
      data.items.forEach((item, index) => {
        const itemKey = `${category}-${index}`;
        counts[itemKey] = Math.floor(Math.random() * 10) + 1;
      }),
    );
    return counts;
  });
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState<{
    [key: string]: boolean;
  }>({});

  // Helper component for commission badge
  const CommissionBadge: React.FC<{
    commission: number;
    currencySymbol: string;
    commissionText?: string;
  }> = ({ commission, currencySymbol }) => {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 rounded font-semibold">
        <div className="bg-green-100 p-1 rounded-full">
          <Coins className="h-3 w-3 text-green-600" />
        </div>
        <span className="text-emerald-600">
          {currencySymbol}
          {commission}
        </span>
      </div>
    );
  };

  const toggleRoomSelection = (roomId: number) => {
    const newSelected = new Set(selectedRooms);
    if (newSelected.has(roomId)) {
      newSelected.delete(roomId);
    } else {
      newSelected.clear(); // Only one room can be selected
      newSelected.add(roomId);
    }
    setSelectedRooms(newSelected);
  };

  const toggleAttributeSelection = (attributeKey: string) => {
    const newSelected = new Set(selectedAttributes);
    if (newSelected.has(attributeKey)) {
      newSelected.delete(attributeKey);
    } else {
      newSelected.add(attributeKey);
    }
    setSelectedAttributes(newSelected);
  };

  const toggleExtraSelection = (extraName: string) => {
    const newSelected = new Set(selectedExtras);
    if (newSelected.has(extraName)) {
      newSelected.delete(extraName);
    } else {
      newSelected.add(extraName);
    }
    setSelectedExtras(newSelected);
  };

  const updateQuantity = (itemName: string, change: number) => {
    setExtraQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + change),
    }));
  };

  const handleAvailableClick = (e: React.MouseEvent, roomId: number) => {
    e.stopPropagation();
    setIsModalOpen((prev) => ({ ...prev, [roomId]: true }));
  };

  const handleModalClose = (roomId: number) => {
    setIsModalOpen((prev) => ({ ...prev, [roomId]: false }));
  };

  const handleModalAccept = (roomId: number, selectedRooms: string[]) => {
    console.log('Selected rooms for room ID', roomId, ':', selectedRooms);
    // Select this room type
    const newSelected = new Set<number>();
    newSelected.clear(); // Only one room can be selected
    newSelected.add(roomId);
    setSelectedRooms(newSelected);
    // Close modal
    setIsModalOpen((prev) => ({ ...prev, [roomId]: false }));
    // Call the original onSelectRoom callback
    const room = roomUpgrades.find((r) => r.id === roomId);
    if (room) {
      onSelectRoom(room);
    }
  };

  const handleImageClick = (e: React.MouseEvent, room: any) => {
    e.stopPropagation();
    setSelectedGalleryRoom(room);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setSelectedGalleryRoom(null);
  };

  const handleAttributeAvailableClick = (
    e: React.MouseEvent,
    itemKey: string,
  ) => {
    e.stopPropagation();
    setIsAttributeModalOpen((prev) => ({ ...prev, [itemKey]: true }));
  };

  const handleAttributeModalClose = (itemKey: string) => {
    setIsAttributeModalOpen((prev) => ({ ...prev, [itemKey]: false }));
  };

  const handleAttributeModalAccept = (
    itemKey: string,
    selectedRooms: string[],
  ) => {
    console.log('Selected attribute rooms for', itemKey, ':', selectedRooms);
    // Select this attribute
    toggleAttributeSelection(itemKey);
    // Close modal
    setIsAttributeModalOpen((prev) => ({ ...prev, [itemKey]: false }));
    // Use specialized attribute handler if available, otherwise fallback to cart
    const [category, indexStr] = itemKey.split('-');
    const index = parseInt(indexStr);
    const categoryData = attributes[category as keyof typeof attributes];
    const item = categoryData?.items[index];

    if (item) {
      if (onSelectAttribute) {
        onSelectAttribute(item, itemKey);
      } else {
        onAddToCart(item);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Room Upgrade Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-4 py-2">
            <CardTitle className="text-lg font-semibold">
              Room Upgrades
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                {roomUpgrades.length} options
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-8">
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Room Type
                      </div>
                    </TableHead>
                    <TableHead className="">Price</TableHead>
                    <TableHead className="">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-600" />
                        Commission
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[250px]">Features</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomUpgrades.map((room) => (
                    <TableRow
                      key={room.id}
                      className={`group hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                        selectedRooms.has(room.id)
                          ? 'bg-gray-50 border-l-4 border-l-gray-900'
                          : ''
                      }`}
                      onClick={() => toggleRoomSelection(room.id)}
                    >
                      <TableCell className="text-center px-3 py-1.5">
                        <div className="flex flex-col items-center gap-2">
                          <Avatar
                            className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200"
                            onClick={(e) => handleImageClick(e, room)}
                          >
                            <AvatarImage
                              src={room.image || '/placeholder.svg'}
                              alt={room.type}
                            />
                            <AvatarFallback className="text-lg">
                              RM
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-1.5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {room.type}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-1.5">
                        <div className="space-y-1">
                          <div className="text-lg font-bold text-gray-900">
                            {room.price}
                            <span className="text-xs text-gray-500 ml-1">
                              /night
                            </span>
                          </div>
                          <div className="text-sm font-medium mt-1">
                            {(
                              parseFloat(room.price.replace('€', '')) * 5
                            ).toFixed(0)}
                            €
                            <span className="text-xs text-gray-400 ml-1">
                              total
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-1.5">
                        <CommissionBadge
                          commission={parseFloat(
                            (
                              parseFloat(room.price.replace('€', '')) *
                              5 *
                              0.1
                            ).toFixed(1),
                          )}
                          currencySymbol="€"
                        />
                      </TableCell>
                      <TableCell className="px-3 py-1.5">
                        <div className="space-y-1">
                          <ul className="text-sm text-gray-700 space-y-0.5">
                            {room.features.split(', ').map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                <span className="leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </TableCell>
                      <TableCell className="text-center px-3 py-1.5">
                        <Button
                          size="sm"
                          variant={
                            selectedRooms.has(room.id)
                              ? 'destructive'
                              : 'default'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedRooms.has(room.id)) {
                              // Remove selection
                              toggleRoomSelection(room.id);
                            } else {
                              // Open modal for room selection
                              handleAvailableClick(e, room.id);
                            }
                          }}
                        >
                          {selectedRooms.has(room.id)
                            ? 'Remove'
                            : `${availableCounts[room.id]} Available`}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Attributes Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-4 py-2">
            <CardTitle className="text-lg font-semibold">
              Room Attributes
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                {Object.values(attributes).reduce(
                  (acc, cat) => acc + cat.items.length,
                  0,
                )}{' '}
                options
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-8">
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="min-w-[180px]">Attribute</TableHead>
                    <TableHead className="">Price</TableHead>
                    <TableHead className="">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-600" />
                        Commission
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(attributes).map(([category, data]) =>
                    data.items.map((item, index) => {
                      const itemKey = `${category}-${index}`;
                      const isSelected = selectedAttributes.has(itemKey);
                      return (
                        <TableRow
                          key={itemKey}
                          className={`group hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-gray-50 border-l-4 border-l-gray-900'
                              : ''
                          }`}
                          onClick={() => toggleAttributeSelection(itemKey)}
                        >
                          <TableCell className="px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">
                                {item.name}
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs px-2 py-0.5 bg-gray-50"
                              >
                                {category}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-1.5">
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-gray-900">
                                {item.price}
                                <span className="text-xs text-gray-500 ml-1">
                                  /night
                                </span>
                              </div>
                              <div className="text-sm font-medium mt-1">
                                {(
                                  parseFloat(
                                    item.price
                                      .replace('€', '')
                                      .replace(',', '.'),
                                  ) * 5
                                ).toFixed(0)}
                                €
                                <span className="text-xs text-gray-400 ml-1">
                                  total
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="text-right px-3 py-1.5"
                            style={{ display: 'none' }}
                          ></TableCell>
                          <TableCell className="px-3 py-1.5">
                            <CommissionBadge
                              commission={parseFloat(
                                (
                                  parseFloat(
                                    item.price
                                      .replace('€', '')
                                      .replace(',', '.'),
                                  ) *
                                  5 *
                                  0.1
                                ).toFixed(1),
                              )}
                              currencySymbol="€"
                            />
                          </TableCell>
                          <TableCell className="text-gray-600 px-3 py-1.5">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-center px-3 py-1.5">
                            <Button
                              size="sm"
                              variant={isSelected ? 'destructive' : 'default'}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                  // Remove selection
                                  toggleAttributeSelection(itemKey);
                                } else {
                                  // Open modal for attribute selection
                                  handleAttributeAvailableClick(e, itemKey);
                                }
                              }}
                            >
                              {isSelected
                                ? 'Remove'
                                : `${attributeAvailableCounts[itemKey]} Available`}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }),
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Extras Enhanced Table */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-4 py-2">
            <CardTitle className="text-lg font-semibold">
              Extra Services
              <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5">
                {extras.length} services
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="h-8">
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="min-w-[180px]">Service</TableHead>
                    <TableHead className="">Price</TableHead>
                    <TableHead className="">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-green-600" />
                        Commission
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extras.map((extra, index) => {
                    const isSelected = selectedExtras.has(extra.name);
                    return (
                      <TableRow
                        key={index}
                        className={`group hover:bg-gray-50 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-gray-50 border-l-4 border-l-gray-900'
                            : ''
                        }`}
                        onClick={() => toggleExtraSelection(extra.name)}
                      >
                        <TableCell className="px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {extra.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 bg-gray-50"
                            >
                              {extra.description}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-1.5">
                          <div className="space-y-1">
                            <div className="text-lg font-bold text-gray-900">
                              {extra.price}
                              <span className="text-xs text-gray-500 ml-1">
                                /{extra.priceType.replace('per ', '')}
                              </span>
                            </div>
                            <div className="text-sm font-medium mt-1">
                              {(
                                parseFloat(extra.price.replace('€', '')) *
                                (extraQuantities[extra.name] || extra.units)
                              ).toFixed(0)}
                              €
                              <span className="text-xs text-gray-400 ml-1">
                                total
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-right px-3 py-1.5"
                          style={{ display: 'none' }}
                        ></TableCell>
                        <TableCell className="px-3 py-1.5">
                          <CommissionBadge
                            commission={parseFloat(
                              (
                                parseFloat(extra.price.replace('€', '')) *
                                0.1 *
                                (extraQuantities[extra.name] || extra.units)
                              ).toFixed(1),
                            )}
                            currencySymbol="€"
                          />
                        </TableCell>
                        <TableCell className="text-center px-3 py-1.5">
                          {extra.name === 'Spa Treatment' ||
                          extra.name === 'Dinner Package' ? (
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(extra.name, -1);
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">
                                {extraQuantities[extra.name] || extra.units}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(extra.name, 1);
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              {extra.name === 'Dinner Package' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={(e) => e.stopPropagation()}
                                      className="ml-2"
                                    >
                                      <CalendarDays className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Select dining dates</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          ) : (
                            <span className="font-medium">{extra.units}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center px-3 py-1.5">
                          <Button
                            size="sm"
                            variant={isSelected ? 'destructive' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isSelected) {
                                // Remove selection
                                toggleExtraSelection(extra.name);
                              } else {
                                // Add to cart first, then select
                                onAddToCart(extra);
                              }
                            }}
                          >
                            {isSelected ? 'Remove' : 'Select'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Room Selection Modals */}
        {roomUpgrades.map((room) => {
          // Generate mock room data for this room type
          const mockRooms = Array.from(
            { length: availableCounts[room.id] },
            (_, index) => ({
              id: `room-${room.id}-${index + 101}`,
              number: `Room ${index + 101}`,
              features: [
                room.type,
                ...room.features.split(', ').slice(0, 2),
                index % 2 === 0 ? 'Balcony' : 'City view',
              ],
              available: true,
            }),
          );

          return (
            <RoomSelectionModal
              key={room.id}
              isOpen={isModalOpen[room.id] || false}
              onClose={() => handleModalClose(room.id)}
              onAccept={(selectedRooms) =>
                handleModalAccept(room.id, selectedRooms)
              }
              title={`Available ${room.type} Rooms`}
              description={`Select your preferred ${room.type.toLowerCase()} room:`}
              rooms={mockRooms}
              availableCount={availableCounts[room.id]}
              maxSelection={1}
              type="room"
            />
          );
        })}

        {/* Room Attribute Selection Modals */}
        {Object.entries(attributes).map(([category, data]) =>
          data.items.map((item, index) => {
            const itemKey = `${category}-${index}`;
            // Generate mock room data for this attribute
            const mockRooms = Array.from(
              { length: attributeAvailableCounts[itemKey] },
              (_, roomIndex) => ({
                id: `attr-${itemKey}-${roomIndex + 101}`,
                number: `Room ${roomIndex + 101}`,
                features: [
                  item.name,
                  category,
                  roomIndex % 2 === 0 ? 'Available now' : 'Standard setup',
                ],
                available: true,
              }),
            );

            return (
              <RoomSelectionModal
                key={itemKey}
                isOpen={isAttributeModalOpen[itemKey] || false}
                onClose={() => handleAttributeModalClose(itemKey)}
                onAccept={(selectedRooms) =>
                  handleAttributeModalAccept(itemKey, selectedRooms)
                }
                title={`Available Rooms for ${item.name}`}
                description={`Select your preferred room for ${item.name.toLowerCase()}:`}
                rooms={mockRooms}
                availableCount={attributeAvailableCounts[itemKey]}
                maxSelection={1}
                type="room"
              />
            );
          }),
        )}

        {/* Image Gallery Modal */}
        <Dialog open={isGalleryOpen} onOpenChange={closeGallery}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden">
            {selectedGalleryRoom && (
              <div className="relative">
                {/* Close button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
                  onClick={closeGallery}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Room Image */}
                <div className="relative h-80 w-full">
                  <img
                    src={selectedGalleryRoom.image || '/placeholder.svg'}
                    alt={selectedGalleryRoom.type}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <DialogHeader className="space-y-2 mb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedGalleryRoom.type}
                    </DialogTitle>
                  </DialogHeader>

                  {/* Room Features */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Room Features
                    </h3>
                    <ul className="space-y-2">
                      {selectedGalleryRoom.features
                        .split(', ')
                        .map((feature: string, index: number) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-gray-700"
                          >
                            <div className="w-1.5 h-1.5 bg-gray-900 rounded-full flex-shrink-0"></div>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Price Information */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Price per night</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedGalleryRoom.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
