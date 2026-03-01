"use client";

import { format } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useCart } from "./cart-actions";
import { CartLine } from "./cart-line";

export function CartSummary() {
  const { data: cart } = useCart();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart</CardTitle>
        <CardDescription>Items that you added</CardDescription>
      </CardHeader>
      <CardContent>
        {cart?.items?.map((line) => (
          <CartLine line={line} key={line.id} />
        ))}
      </CardContent>
      <CardFooter>
        <CardDescription>Total: {format(cart?.total ?? 0)}</CardDescription>
      </CardFooter>
    </Card>
  );
}
