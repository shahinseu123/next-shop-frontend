// services/cartService.ts

import { useApi } from "@/hook/useApi";

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
  appliedCouponCode: string | null;
  discountAmount: number;
  finalAmount: number;
}

export const useCartService = () => {
  const { execute: createCartApi, loading: createLoading } = useApi<CartResponse>("/api/v1/carts/create", "POST");
  const { execute: getCartApi, loading: getLoading } = useApi<CartResponse>("", "GET");
  const { execute: addItemApi, loading: addLoading } = useApi<CartResponse>("", "POST");
  const { execute: removeItemApi, loading: removeLoading } = useApi<CartResponse>("", "DELETE");
  const { execute: updateQuantityApi, loading: updateLoading } = useApi<CartResponse>("", "PUT");
  const { execute: clearCartApi, loading: clearLoading } = useApi<void>("", "DELETE");

  const createCart = async (sessionId: string, userId?: number) => {
    const params: Record<string, string> = { sessionId };
    if (userId) params.userId = userId.toString();
    return await createCartApi({ params });
  };

  const getCart = async (cartId: number) => {
    return await getCartApi({ url: `/api/v1/carts/${cartId}` });
  };

  const addItem = async (cartId: number, productId: number, quantity: number) => {
    return await addItemApi({
      url: `/api/v1/carts/${cartId}/items`,
      params: { productId, quantity }
    });
  };

  const removeItem = async (cartId: number, itemId: number) => {
    return await removeItemApi({ url: `/api/v1/carts/${cartId}/items/${itemId}` });
  };

  const updateQuantity = async (cartId: number, itemId: number, quantity: number) => {
    return await updateQuantityApi({
      url: `/api/v1/carts/${cartId}/items/${itemId}`,
      params: { quantity }
    });
  };

  const clearCart = async (cartId: number) => {
    return await clearCartApi({ url: `/api/v1/carts/${cartId}` });
  };

  return {
    createCart,
    getCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading: createLoading || getLoading || addLoading || removeLoading || updateLoading || clearLoading
  };
};