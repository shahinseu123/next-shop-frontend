// store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductDetails } from '@/type/shop';

export interface CartItem extends ProductDetails {
  cartQuantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  
  // Actions
  addItem: (product: ProductDetails, quantity: number, size?: string, color?: string) => void;
  removeItem: (productId: number, size?: string, color?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  
  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,

      addItem: (product, quantity, size, color) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(
          item => item.id === product.id && 
          item.selectedSize === size && 
          item.selectedColor === color
        );

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].cartQuantity += quantity;
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            ...product,
            cartQuantity: quantity,
            selectedSize: size,
            selectedColor: color,
          };
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (productId, size, color) => {
        set(state => ({
          items: state.items.filter(
            item => !(item.id === productId && 
              item.selectedSize === size && 
              item.selectedColor === color)
          )
        }));
      },

      updateQuantity: (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === productId && 
            item.selectedSize === size && 
            item.selectedColor === color
              ? { ...item, cartQuantity: quantity }
              : item
          )
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.cartQuantity, 0);
      },

      getSubtotal: () => {
        const currentPrice = (item: CartItem) => item.discountPrice || item.sellingPrice;
        return get().items.reduce(
          (total, item) => total + currentPrice(item) * item.cartQuantity,
          0
        );
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        const freeShippingThreshold = 50;
        if (subtotal >= freeShippingThreshold || subtotal === 0) return 0;
        return 5.99;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShippingCost();
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);