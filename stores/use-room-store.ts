import { create } from 'zustand';
import type { RoomUpgrade, RoomAttribute } from '@/types/room';
// Fallback demo data removed from '@/data' export. Provide safe defaults.
const roomUpgrades: RoomUpgrade[] = []
const roomAttributes: RoomAttribute = {}

interface RoomStore {
  // State
  upgrades: RoomUpgrade[];
  attributes: RoomAttribute;
  selectedUpgrade: RoomUpgrade | null;
  cart: Array<{ type: 'upgrade' | 'attribute'; item: any; category?: string }>;

  // Actions
  setUpgrades: (upgrades: RoomUpgrade[]) => void;
  selectUpgrade: (upgrade: RoomUpgrade | null) => void;
  addToCart: (type: 'upgrade' | 'attribute', item: any, category?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  
  // Computed
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  // Initial state
  upgrades: roomUpgrades,
  attributes: roomAttributes,
  selectedUpgrade: null,
  cart: [],

  // Actions
  setUpgrades: (upgrades) => set({ upgrades }),
  
  selectUpgrade: (upgrade) => set({ selectedUpgrade: upgrade }),
  
  addToCart: (type, item, category) => set((state) => ({
    cart: [...state.cart, { type, item, category }]
  })),
  
  removeFromCart: (index) => set((state) => ({
    cart: state.cart.filter((_, i) => i !== index)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  // Computed
  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, cartItem) => {
      const priceStr = cartItem.item.price || '0€';
      const price = parseFloat(priceStr.replace(/[€,]/g, '').replace(',', '.'));
      return total + price;
    }, 0);
  },
  
  getCartCount: () => {
    const { cart } = get();
    return cart.length;
  }
}));