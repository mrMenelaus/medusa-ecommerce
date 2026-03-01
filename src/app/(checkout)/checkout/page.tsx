import { CartSummary } from "@/components/cart/cart-summary";
import { CheckoutRouter } from "@/components/checkout/router";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Checkout() {
  return (
    <div className="max-w-7xl mx-auto py-8 flex flex-col md:flex-row md:items-start gap-6">
      <Suspense fallback={<Skeleton className="flex-1 h-12"/>}>
        <CheckoutRouter />
      </Suspense>
      <div className="md:w-md">
        <CartSummary />
      </div>
    </div>
  );
}


