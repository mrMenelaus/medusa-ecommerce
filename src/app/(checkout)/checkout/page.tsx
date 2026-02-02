import { Address } from "@/components/checkout/address";
import {
  CartSummary,
  CartSummarySkeleton,
} from "@/components/checkout/cart-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { getCart } from "@/lib/shared";
import { notFound } from "next/navigation";

import { Suspense } from "react";

export default async function Checkout({
  searchParams,
}: PageProps<"/checkout">) {
  const [params, cart] = await Promise.all([searchParams, getCart()]);
  const {stage} = params
  if (!stage || !cart) return notFound();

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Suspense fallback={<Skeleton />}>
            <Address cart={cart}/>
          </Suspense>
        </div>

        {/* Cart Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <Suspense fallback={<CartSummarySkeleton />}>
              <CartSummary />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}