"use client";

import { StoreProductVariant } from "@medusajs/types";
import { Button } from "../ui/button";
import { useAddToCart } from "./cart-actions";
import { format } from "@/lib/format";
import { ShoppingCart } from "lucide-react";

export function AddButton({
  variant,
}: {
  variant?: StoreProductVariant;
}) {
  const { mutate: addToCart } = useAddToCart();

  const price = variant?.calculated_price?.calculated_amount

  return (
    <Button
      size="lg"
      disabled={!variant}
      onClick={() => variant && addToCart(variant.id)}
    >
      <ShoppingCart />
      Add to Cart
      {price && ` — ${format(price)}`}
    </Button>
  );
}
