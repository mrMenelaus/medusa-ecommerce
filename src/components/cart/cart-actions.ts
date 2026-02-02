import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCartAction,
  addToCartAction,
  updateCartItemAction,
  removeFromCartAction,
} from "@/app/actions/cart";

const keys = { cart: ["cart"] } as const;

/**
 * Hook to get cart data
 * Uses server action to fetch cart from cookies
 */
export function useCart() {
  return useQuery({
    queryKey: keys.cart,
    queryFn: async () => {
      const result = await getCartAction();
      if (result.success && result.cart) {
        return result.cart;
      }
      return null;
    },
    staleTime: 0, // Always refetch to get latest cart state
  });
}

/**
 * Hook to add item to cart
 * Uses server action which handles cookie management
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantId: string) => {
      const result = await addToCartAction(variantId);
      if (!result.success) {
        throw new Error(result.error || "Failed to add to cart");
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.cart });
    },
  });
}

/**
 * Hook to update cart item quantity
 * Uses server action which handles cookie management
 */
export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { lineId: string; quantity: number }) => {
      const result = await updateCartItemAction(variables.lineId, variables.quantity);
      if (!result.success) {
        throw new Error(result.error || "Failed to update cart");
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.cart });
    },
  });
}

/**
 * Hook to remove item from cart
 * Uses server action which handles cookie management
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineId: string) => {
      const result = await removeFromCartAction(lineId);
      if (!result.success) {
        throw new Error(result.error || "Failed to remove from cart");
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: keys.cart });
    },
  });
}
