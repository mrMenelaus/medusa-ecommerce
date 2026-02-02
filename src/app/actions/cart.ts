"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { medusa } from "@/lib/medusa";
import { hard } from "@/lib/constants";
import { getCartId, setCartId } from "@/lib/cart-server";
import z from "zod";
import { redirect } from "next/navigation";

const CART_ID_COOKIE = "cartId";

/**
 * Get cart ID from cookies (for client-side access)
 */
export async function getCartIdAction(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_ID_COOKIE)?.value ?? null;
}

/**
 * Get or create cart (server action)
 */
export async function getCartAction() {
  try {
    const cartId = await getCartIdAction();

    if (cartId) {
      try {
        const existingCart = await medusa.store.cart.retrieve(cartId);
        return { success: true, cart: existingCart.cart };
      } catch (error) {
        // Cart doesn't exist, create a new one
        console.error("Cart retrieval failed, creating new cart:", error);
      }
    }

    // Create new cart
    const createdCart = await medusa.store.cart.create({
      region_id: hard.region,
    });
    await setCartId(createdCart.cart.id);
    return { success: true, cart: createdCart.cart };
  } catch (error) {
    console.error("Failed to get or create cart:", error);
    return { success: false, cart: null, error: String(error) };
  }
}

/**
 * Add item to cart (server action)
 */
export async function addToCartAction(variantId: string) {
  try {
    const cartId = await getCartIdAction();

    if (!cartId) {
      // Create cart first
      const createdCart = await medusa.store.cart.create({
        region_id: hard.region,
      });
      await setCartId(createdCart.cart.id);

      await medusa.store.cart.createLineItem(createdCart.cart.id, {
        quantity: 1,
        variant_id: variantId,
      });

      revalidatePath("/");
      return { success: true };
    }

    await medusa.store.cart.createLineItem(cartId, {
      quantity: 1,
      variant_id: variantId,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to add to cart:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update cart line item quantity (server action)
 */
export async function updateCartItemAction(lineId: string, quantity: number) {
  try {
    const cartId = await getCartIdAction();
    if (!cartId) {
      return { success: false, error: "No cart found" };
    }

    await medusa.store.cart.updateLineItem(cartId, lineId, {
      quantity,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update cart item:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Remove item from cart (server action)
 */
export async function removeFromCartAction(lineId: string) {
  try {
    const cartId = await getCartIdAction();
    if (!cartId) {
      return { success: false, error: "No cart found" };
    }

    await medusa.store.cart.deleteLineItem(cartId, lineId);

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove from cart:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update cart address (server action)
 * Accepts FormData for progressive enhancement
 */

const addressSchema = z.object({
  address_1: z.string().nonempty("Required"),
  address_2: z.string().nonempty("Required"),
  city: z.string().nonempty("Required"),
  company: z.string().nonempty("Required"),
  country_code: z.string().nonempty("Required"),
  first_name: z.string().nonempty("Required"),
  last_name: z.string().nonempty("Required"),
  phone: z.string().nonempty("Required"),
  postal_code: z.string().nonempty("Required"),
  province: z.string().nonempty("Required"),
});

export async function updateCartAddressAction(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const cartId = await getCartIdAction();
    if (!cartId) {
      return { success: false, message: "No cart found" };
    }

    const data = Object.fromEntries(formData) as z.input<typeof addressSchema>;
    const parsed = addressSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        errors: z.flattenError(parsed.error).fieldErrors,
        message: "Please, fix errors in your inputs",
        data,
      };
    }
    await medusa.store.cart.update(cartId, { shipping_address: parsed.data });
    redirect("checkout?stage=shipping");
    
  } catch (error) {}
}

/**
 * Add shipping method to cart (server action)
 */
export async function addShippingMethodAction(optionId: string) {
  try {
    const cartId = await getCartIdAction();
    if (!cartId) {
      return { success: false, error: "No cart found" };
    }

    await medusa.store.cart.addShippingMethod(cartId, {
      option_id: optionId,
    });

    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Failed to add shipping method:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get shipping options for cart (server action)
 */
export async function getShippingOptionsAction() {
  try {
    const cartId = await getCartIdAction();
    if (!cartId) {
      return { success: false, error: "No cart found", shipping_options: null };
    }

    const response = await medusa.store.fulfillment.listCartOptions({
      cart_id: cartId,
    });

    return { success: true, shipping_options: response.shipping_options };
  } catch (error) {
    console.error("Failed to get shipping options:", error);
    return { success: false, error: String(error), shipping_options: null };
  }
}
