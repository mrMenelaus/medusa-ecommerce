import type {  StoreCartLineItem } from "@medusajs/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRemoveFromCart, useUpdateCart } from "./cart-actions";

export function CartLine({ line }: { line: StoreCartLineItem }) {
  const { quantity, variant_title, title, thumbnail, id } = line;
  const { mutate: updateQuantity} = useUpdateCart(line.id);
  const { mutate: remove } = useRemoveFromCart();

  return (
    <div className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 hover:border-border transition-colors">
      {/* Product Image */}
      <div className="relative size-24 rounded-lg overflow-hidden bg-accent/20">
        {thumbnail && (
          <Image alt={title} src={thumbnail} fill className="object-cover" />
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
              onClick={() => updateQuantity(Math.max(0, quantity - 1))}
              className="h-8 w-8 rounded-r-none"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {quantity}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => updateQuantity(quantity + 1)}
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
 // <Item>
    //   <ItemMedia className="relative size-24 rounded-lg overflow-hidden bg-accent/20">
    //     {thumbnail && (
    //       <Image alt={title} src={thumbnail} fill className="object-cover" />
    //     )}
    //   </ItemMedia>
    //   <ItemContent>
    //     <ItemTitle>{variant_title}</ItemTitle>
    //   </ItemContent>
    //   <ItemActions>
    //     <Button
    //       size="icon"
    //       variant="ghost"
    //       onClick={() => remove(id)}
    //       className="h-8 w-8 text-muted-foreground hover:text-destructive"
    //     >
    //       <Trash2 className="h-4 w-4" />
    //     </Button>
    //     <Button
    //       size="icon"
    //       variant="ghost"
    //       onClick={() => updateQuantity(Math.max(0, quantity - 1))}
    //       className="h-8 w-8 rounded-r-none"
    //     >
    //       <Minus className="h-3 w-3" />
    //     </Button>
    //     <span className="text-sm font-medium w-8 text-center">{quantity}</span>
    //     <Button
    //       size="icon"
    //       variant="ghost"
    //       onClick={() => updateQuantity(quantity + 1)}
    //       className="h-8 w-8 rounded-l-none"
    //     >
    //       <Plus className="h-3 w-3" />
    //     </Button>
    //   </ItemActions>
    // </Item>