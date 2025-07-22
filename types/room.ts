import type { LucideIcon } from 'lucide-react';

export interface RoomUpgrade {
  id: number;
  type: string;
  price: string;
  features: string;
  availability: 'Available' | 'Limited';
  rating: number;
  image: string;
}

export interface AttributeItem {
  name: string;
  price: string;
  description: string;
}

export interface AttributeCategory {
  icon: LucideIcon;
  items: AttributeItem[];
}

export interface RoomAttribute {
  [category: string]: AttributeCategory;
}