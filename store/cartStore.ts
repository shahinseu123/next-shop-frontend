

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService, type CartItem, type CartResponse } from '@/services/cartService';
import { tokenService } from '@/lib/auth';
interface CartState {
  // State
  cart: CartResponse | null;
  cartId: number | null;
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  isCartOpen: boolean;

  // Coupon state
  appliedCoupon: { code: string; discountAmount: number } | null;
  couponLoading: boolean;
  couponError: string | null;

  // Actions
  initCart: (userId?: number) => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<boolean>;
  removeItem: (itemId: number) => Promise<boolean>;
  updateQuantity: (itemId: number, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;

  // UI Actions
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;

  // Coupon actions
  applyCoupon: (code: string, userId?: number) => Promise<boolean>;
  removeCoupon: () => Promise<boolean>;

  // Getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
  getDiscount: () => number;
  hasItems: () => boolean;
}

const generateSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  const stored = localStorage.getItem('cart_session');
  if (stored) return stored;

  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('cart_session', newId);
  return newId;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      cartId: null,
      items: [],
      isLoading: false,
      error: null,
      isCartOpen: false,
      appliedCoupon: null,
      couponLoading: false,
      couponError: null,

      initCart: async (userId?: number) => {
        const state = get();
        if (state.cartId && state.cart) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const sessionId = generateSessionId();
          const cart = await cartService.createCart(sessionId, userId);

          set({
            cart,
            cartId: cart.id,
            items: cart.items || [],
            isLoading: false,
            error: null,
            appliedCoupon: cart.appliedCouponCode ? {
              code: cart.appliedCouponCode,
              discountAmount: cart.discountAmount || 0
            } : null
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to initialize cart'
          });
        }
      },

    addItem: async (productId: number, quantity: number = 1): Promise<boolean> => {
        // Check authentication
        const token = tokenService.getToken();
        if (!token) {
          set({ error: 'Please login to add items to cart' });
          // Redirect to login
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
          return false;
        }

        set({ isLoading: true, error: null });
        
        try {
          let cartId = get().cartId;
          
          if (!cartId) {
            await get().initCart();
            cartId = get().cartId;
          }
          
          if (!cartId) {
            throw new Error('Could not create cart');
          }

          const cart = await cartService.addItem(cartId, productId, quantity);

          set({ 
            cart, 
            items: cart.items || [],
            isLoading: false,
            error: null
          });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to add item'
          });
          return false;
        }
      },


      removeItem: async (itemId: number) => {
        const { cartId } = get();
        if (!cartId) return false;

        set({ isLoading: true, error: null });

        try {
          const cart = await cartService.removeItem(cartId, itemId);

          set({
            cart,
            items: cart.items || [],
            isLoading: false,
            error: null
          });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to remove item'
          });
          return false;
        }
      },

      updateQuantity: async (itemId: number, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return false;

        if (quantity <= 0) {
          return get().removeItem(itemId);
        }

        set({ isLoading: true, error: null });

        try {
          const cart = await cartService.updateQuantity(cartId, itemId, quantity);

          set({
            cart,
            items: cart.items || [],
            isLoading: false,
            error: null
          });
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to update quantity'
          });
          return false;
        }
      },

      clearCart: async () => {
        const { cartId } = get();
        if (!cartId) return false;

        set({ isLoading: true, error: null });

        try {
          await cartService.clearCart(cartId);

          set({
            cart: null,
            cartId: null,
            items: [],
            isLoading: false,
            isCartOpen: false,
            appliedCoupon: null,
            error: null
          });

          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart_session');
          }
          return true;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to clear cart'
          });
          return false;
        }
      },

      refreshCart: async () => {
        const { cartId } = get();
        if (!cartId) return;

        set({ isLoading: true });

        try {
          const cart = await cartService.getCart(cartId);

          set({
            cart,
            items: cart.items || [],
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({ isLoading: false });
          console.error('Failed to refresh cart:', error);
        }
      },

      setIsCartOpen: (open: boolean) => {
        set({ isCartOpen: open });
      },

      toggleCart: () => {
        set(state => ({ isCartOpen: !state.isCartOpen }));
      },

      applyCoupon: async (code: string, userId?: number) => {
        const { cartId } = get();
        if (!cartId) {
          set({ couponError: 'No cart exists' });
          return false;
        }

        set({ couponLoading: true, couponError: null });

        try {
          const result = await cartService.applyCoupon(code, cartId, userId);

          // Refresh cart to get updated totals
          await get().refreshCart();

          set({
            appliedCoupon: {
              code: result.couponCode,
              discountAmount: result.discountAmount
            },
            couponLoading: false,
            couponError: null
          });
          return true;
        } catch (error: any) {
          set({
            couponLoading: false,
            couponError: error?.message || 'Failed to apply coupon'
          });
          return false;
        }
      },

      removeCoupon: async () => {
        const { cartId } = get();
        if (!cartId) return false;

        set({ couponLoading: true, couponError: null });

        try {
          await cartService.removeCoupon(cartId);
          await get().refreshCart();

          set({
            appliedCoupon: null,
            couponLoading: false,
            couponError: null
          });
          return true;
        } catch (error: any) {
          set({
            couponLoading: false,
            couponError: error?.message || 'Failed to remove coupon'
          });
          return false;
        }
      },

      getTotalItems: () => {
        const { cart } = get();
        if (!cart?.items) return 0;
        return cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      },

      getSubtotal: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.subtotal || 0;
      },

      getShippingCost: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.shippingCost || 0;
      },

      getTotal: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.finalAmount || cart.subtotal || 0;
      },

      getDiscount: () => {
        const { cart } = get();
        if (!cart) return 0;
        return cart.discountAmount || 0;
      },

      hasItems: () => {
        const { cart } = get();
        return (cart?.items?.length || 0) > 0;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cartId: state.cartId,
        appliedCoupon: state.appliedCoupon
      })
    }
  )
);