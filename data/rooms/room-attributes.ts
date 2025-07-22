import { Building2, MapPin } from 'lucide-react';
import type { RoomAttribute } from '@/types/room';

export const roomAttributes: RoomAttribute = {
  "Bed Type": {
    icon: Building2,
    items: [
      {
        name: "Double Size Bed",
        price: "2,50€",
        description: "Bed size 135x200",
      },
      {
        name: "Queen Size Bed",
        price: "3,75€",
        description: "Bed size 150x200",
      },
      {
        name: "King Size Bed",
        price: "6€",
        description: "Bed size 180x200",
      },
      {
        name: "Extra King Size Bed",
        price: "9€",
        description: "Bed size 200x200",
      },
    ],
  },
  Location: {
    icon: MapPin,
    items: [
      {
        name: "Close to Main Pool",
        price: "2,50€",
        description: "Close to hotel Main Pool",
      },
      {
        name: "In Main Building",
        price: "3,75€",
        description: "Near Hotel Entrance",
      },
      {
        name: "Corner Room",
        price: "6€",
        description: "Large corner area room, more space",
      },
      {
        name: "Upper floor with roof pool",
        price: "9€",
        description: "Direct access to rooftop pool",
      },
    ],
  },
};