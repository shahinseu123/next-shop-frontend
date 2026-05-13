// services/orderService.ts
import { apiFetch } from "@/lib/api";

export interface OrderCreateDto {
  cartId: number;
  userId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_PAYMENT';
  cardDetails?: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  notes?: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  couponDiscount: number;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  couponCode: string | null;
  items: OrderItemResponse[];
  notes: string | null;
  createdAt: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPrice: number;
}

export const orderService = {
  createOrder: async (data: OrderCreateDto): Promise<OrderResponse> => {
    return apiFetch<OrderResponse>('/api/v1/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getOrderById: async (orderId: number): Promise<OrderResponse> => {
    return apiFetch<OrderResponse>(`/api/v1/orders/${orderId}`, {
      method: 'GET',
    });
  },

  getUserOrders: async (): Promise<OrderResponse[]> => {
    return apiFetch<OrderResponse[]>('/api/v1/orders', {
      method: 'GET',
    });
  },

  cancelOrder: async (orderId: number): Promise<void> => {
    return apiFetch<void>(`/api/v1/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  },
};