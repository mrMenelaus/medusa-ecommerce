import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { useRegion } from "../region/region-provider";
import { StoreCart, StoreProductVariant } from "@medusajs/types";

export const keys = { cart: ["cart"] } as const;

export function useCart() {
  const { region } = useRegion();
  return useQuery({
    queryKey: keys.cart,
    queryFn: async () => {
      const cartId = localStorage.getItem("cartId");
      if (cartId) {
        const response = await medusa.store.cart.retrieve(cartId);
        return response.cart;
      }
      const response = await medusa.store.cart.create({ region_id: region.id });
      localStorage.setItem("cartId", response.cart.id);
      return response.cart;
    },
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys.cart,
    mutationFn: async (variant: StoreProductVariant) => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;
      return medusa.store.cart.createLineItem(cartId, {
        quantity: 1,
        variant_id: variant.id,
      });
    },
    onMutate: (variant) => {
      queryClient.cancelQueries({ queryKey: keys.cart });
      const snapshot = queryClient.getQueryData(keys.cart);
      queryClient.setQueryData(
        keys.cart,
        (data: StoreCart) =>
          data && {
            ...data,
            items: data.items ? [variant, ...data.items] : [variant],
          },
      );
      return snapshot;
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: keys.cart }) === 1) {
        queryClient.invalidateQueries({ queryKey: keys.cart });
      }
    },
  });
}

export function useUpdateCart(lineId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys.cart,
    mutationFn: async (quantity: number) => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;
      return medusa.store.cart.updateLineItem(cartId, lineId, { quantity });
    },
    onMutate: async (quantity) => {
      await queryClient.cancelQueries({ queryKey: keys.cart });
      queryClient.setQueryData(
        keys.cart,
        (data: StoreCart) =>
          data && {
            ...data,
            items: data.items?.map((line) =>
              line.id === lineId ? { ...line, quantity } : line,
            ),
          },
      );
    },
    onSettled: () => {

      if (queryClient.isMutating({ mutationKey: keys.cart }) === 1) {
        console.log("invalidated update quantity");
        
        queryClient.invalidateQueries({ queryKey: keys.cart });
      }
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
    mutationKey: keys.cart,
    mutationFn: async (lineId: string) => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return;
      return medusa.store.cart.deleteLineItem(cartId, lineId);
    },
    onMutate: (lineId) => {
      queryClient.cancelQueries({ queryKey: keys.cart });
      const snapshot = queryClient.getQueryData(keys.cart);
      queryClient.setQueryData(
        keys.cart,
        (data: StoreCart) =>
          data && {
            ...data,
            items: data.items?.filter((line) => line.id !== lineId),
          },
      );
      return snapshot;
    },
    onSettled: () => {

      if (queryClient.isMutating({ mutationKey: keys.cart }) === 1) {
        console.log("invalidated from remove");
        queryClient.invalidateQueries({ queryKey: keys.cart });
      }
    },
  });
}
