// hooks/useToastNotifications.ts
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

export const useToastNotifications = () => {
  const showAddToCartSuccess = (productName: string, price: number) => {
    toast.success(`${productName} added to cart`, {
      description: `$${price.toFixed(2)} added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => useCartStore.getState().toggleCart(),
      },
    });
  };

  const showRemoveFromCart = (productName: string) => {
    toast.info(`${productName} removed from cart`);
  };

  const showWishlistAdded = (productName: string) => {
    toast.success(`${productName} added to wishlist`, {
      icon: '❤️',
      action: {
        label: 'View Wishlist',
        onClick: () => window.location.href = '/wishlist',
      },
    });
  };

  const showWishlistRemoved = (productName: string) => {
    toast.error(`${productName} removed from wishlist`);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showSuccess = (message: string) => {
    toast.success(message);
  };

  return {
    showAddToCartSuccess,
    showRemoveFromCart,
    showWishlistAdded,
    showWishlistRemoved,
    showError,
    showSuccess,
  };
};