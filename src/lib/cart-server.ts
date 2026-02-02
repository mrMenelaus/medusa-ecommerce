import { cookies } from "next/headers";
import { medusa } from "./medusa";
import { headers, hard } from "./constants";

/**
 * Get cart ID from cookies (server-side)
 */
export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(headers.cart)?.value ?? null;
}

/**
 * Set cart ID in cookies (server-side)
 */
export async function setCartId(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(headers.cart, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

/**
 * Get or create cart (server-side)
 * Returns the cart object
 */
export async function getOrCreateCart() {
  let cartId = await getCartId();

  if (cartId) {
    try {
      const existingCart = await medusa.store.cart.retrieve(cartId);
      return existingCart.cart;
    } catch (error) {
      // Cart doesn't exist, create a new one
      console.error("Cart retrieval failed, creating new cart:", error);
      cartId = null;
    }
  }

  // Create new cart if we don't have one
  if (!cartId) {
    const createdCart = await medusa.store.cart.create({ region_id: hard.region, shipping_address: {country_code: hard.country} });
    await setCartId(createdCart.cart.id);
    return createdCart.cart;
  }

  throw new Error("Failed to get or create cart");
}

/**
 * Get cart by ID (server-side)
 */
export async function getCart(cartId: string) {
  try {
    const response = await medusa.store.cart.retrieve(cartId);
    return response.cart;
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
    return null;
  }
}
