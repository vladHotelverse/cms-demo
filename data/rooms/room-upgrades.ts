import type { RoomUpgrade } from '@/types/room';

export const roomUpgrades: RoomUpgrade[] = [
  {
    id: 1,
    type: "Deluxe Ocean View",
    price: "25€",
    features: "Double Size Bed, Private Terrace, Pool View",
    availability: "Limited",
    rating: 4.8,
    image: "/hotel-room-ocean-view.png",
  },
  {
    id: 2,
    type: "Suite Sea Side",
    price: "30€",
    features: "Queen Size Bed, Large Terrace, Sea Side View",
    availability: "Available",
    rating: 4.9,
    image: "/luxury-hotel-suite.png",
  },
  {
    id: 3,
    type: "King Suite Sea View",
    price: "55€",
    features: "King Size Bed, Premium Terrace, Direct Sea View",
    availability: "Available",
    rating: 5.0,
    image: "/king-suite-sea-view.png",
  },
  {
    id: 4,
    type: "Presidential Suite",
    price: "75€",
    features: "King Size Bed, Two-Story Terrace, Panoramic Sea View, Private Pool",
    availability: "Limited",
    rating: 5.0,
    image: "/presidential-suite.png",
  },
];