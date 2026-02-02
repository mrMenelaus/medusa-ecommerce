"use client";

import { StoreCartLineItem } from "@medusajs/types";
import { Button } from "../ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { useCart, useRemoveFromCart, useUpdateCart } from "./cart-actions";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { format } from "@/lib/format";

export function Cart() {
  const { data: cart } = useCart();
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-foreground hover:text-primary"
        >
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`
              : "Your cart is empty"}
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {cart?.items && cart.items.length > 0 ? (
            cart.items.map((item) => <CartLine key={item.id} line={item} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-accent p-6 mb-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-6">
                Start shopping to add items to your cart
              </p>
              <SheetClose asChild>
                <Button asChild>
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart?.items && cart.items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{format(cart?.total || 0)}</span>
              </div>

              {/* Checkout Button */}
              <Button asChild className="w-full" size="lg">
                <Link href="/checkout?stage=email">Proceed to Checkout</Link>
              </Button>

              {/* Continue Shopping */}
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartLine({ line }: { line: StoreCartLineItem }) {
  const { quantity, variant_title, title, thumbnail, id } = line;
  const { mutate: updateQuantity } = useUpdateCart();
  const { mutate: remove } = useRemoveFromCart();

  return (
    <div className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-accent/20">
        {thumbnail && (
          <Image
            alt={title}
            src={thumbnail}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm line-clamp-1">{title}</h4>
            {variant_title && (
              <p className="text-xs text-muted-foreground mt-1">
                {variant_title}
              </p>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => remove(id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-lg">
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                updateQuantity({ lineId: id, quantity: Math.max(0, quantity - 1) })
              }
              className="h-8 w-8 rounded-r-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{quantity}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                updateQuantity({ lineId: id, quantity: quantity + 1 })
              }
              className="h-8 w-8 rounded-l-none"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
