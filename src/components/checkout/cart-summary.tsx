import { format } from "@/lib/format";
import Image from "next/image";
import { StoreCartLineItem } from "@medusajs/types";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Empty } from "../ui/empty";
import { Skeleton } from "../ui/skeleton";
import { getCart } from "@/lib/shared";

export function CartSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton />
      </CardHeader>
      <CardContent>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </CardContent>
      <CardFooter className="text-sm space-y-4">
        <Separator />
        <Skeleton />
      </CardFooter>
    </Card>
  );
}

export async function CartSummary() {
  const cart = await getCart()
  if (!cart) {
    return <Empty>Your Cart Is Empty</Empty>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {cart.items?.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </CardContent>
      <Separator />
      <CardFooter className="text-sm space-y-4">
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{format(cart.total)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}

function CartItem({ item }: { item: StoreCartLineItem }) {
  const { title, variant_title, thumbnail } = item;

  return (
    <Item>
      <ItemMedia>
        {thumbnail && (
          <div className="relative size-16 rounded-md overflow-hidden bg-muted">
            <Image src={thumbnail} alt={title} fill className="object-cover" />
          </div>
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{variant_title}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
