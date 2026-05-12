// services/cart.service.ts
import { apiFetch } from '@/lib/api';

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CartResponse {
  id: number;
  userId: number | null;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  finalAmount: number;
  appliedCouponCode: string | null;
}

export interface CouponResponse {
  couponCode: string;
  discountAmount: number;
  finalAmount: number;
}

class CartService {
  private basePath = '/api/v1/carts';
  private couponPath = '/api/v1/coupons';

  async createCart(sessionId: string, userId?: number) {
    const params: Record<string, string | number> = { sessionId };
    if (userId) params.userId = userId;
    
    return apiFetch<CartResponse>(`${this.basePath}/create`, {
      method: 'POST',
      params
    });
  }

  async getCart(cartId: number) {
    return apiFetch<CartResponse>(`${this.basePath}/${cartId}`);
  }

  async addItem(cartId: number, productId: number, quantity: number) {
    return apiFetch<CartResponse>(`${this.basePath}/${cartId}/items`, {
      method: 'POST',
      params: { 
        productId: Number(productId), 
        quantity: Number(quantity) 
      }
    });
  }

  async removeItem(cartId: number, itemId: number) {
    return apiFetch<CartResponse>(`${this.basePath}/${cartId}/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  async updateQuantity(cartId: number, itemId: number, quantity: number) {
    return apiFetch<CartResponse>(`${this.basePath}/${cartId}/items/${itemId}`, {
      method: 'PUT',
      params: { quantity: Number(quantity) }
    });
  }

  async clearCart(cartId: number) {
    return apiFetch(`${this.basePath}/${cartId}`, {
      method: 'DELETE'
    });
  }

  async applyCoupon(couponCode: string, cartId: number, userId?: number) {
    const params: Record<string, string | number> = { cartId };
    if (userId) params.userId = userId;
    
    return apiFetch<CouponResponse>(`${this.couponPath}/apply/${couponCode}`, {
      method: 'POST',
      params
    });
  }

  async removeCoupon(cartId: number) {
    return apiFetch(`${this.couponPath}/remove/${cartId}`, {
      method: 'DELETE'
    });
  }
}

export const cartService = new CartService();