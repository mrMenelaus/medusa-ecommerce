"use client";

import { Email } from "./email";
import { Address } from "./address";
import { Shipping } from "./shipping";
import { Payment } from "./payment";
import { useSearchParams } from "next/navigation";
import { Separator } from "../ui/separator";
import { useCart } from "../cart/cart-actions";
import { Empty, EmptyTitle } from "../ui/empty";
import { Skeleton } from "../ui/skeleton";

export function CheckoutRouter() {
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage");
  const { isLoading, isSuccess, data: cart } = useCart();

  if (isLoading) {
    return <div className="flex-1 flex flex-col gap-8"> 
      <Skeleton />
    </div>
  }

  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col gap-8">
        <div className="font-bold text-xl">Contact information</div>
        {stage === "email" && <Email cart={cart} />}
        <Separator />
        <div className="font-bold text-xl">Address</div>
        {stage === "address" && <Address cart={cart} />}
        <Separator />
        <div className="font-bold text-xl">Shipping</div>
        {stage === "shipping" && <Shipping cart={cart} />}
        <Separator />
        <div className="font-bold text-xl">Payment</div>
        {stage === "payment" && <Payment cart={cart} />}
      </div>
    );
  }

  return (
    <Empty>
      <EmptyTitle>Something went wrong</EmptyTitle>
    </Empty>
  );
}
