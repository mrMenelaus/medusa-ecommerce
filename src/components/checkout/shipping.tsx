"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreCart } from "@medusajs/types";

const shippingSchema = z.object({
  method: z.string(),
});

export function Shipping({ cart }: { cart: StoreCart }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      method: undefined,
    },
  });

  const { data: methods, isLoading } = useQuery({
    queryKey: ["shipping"],
    queryFn: async () => {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) return null;
      return medusa.store.fulfillment.listCartOptions({ cart_id: cartId });
    },
  });

  async function onSubmit({ method }: { method: string }) {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    await medusa.store.cart.addShippingMethod(cartId, {
      option_id: method,
    });
    router.push("?stage=payment")
  }

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-8 mb-4" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
      </>
    );
  }

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldLegend>Available options</FieldLegend>
        <FieldGroup>
          <Controller
            control={form.control}
            name="method"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="grid grid-cols-2 gap-2">
                  {methods?.shipping_options.map((value) => (
                    <FieldLabel htmlFor={value.id} key={value.id}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>{value.type.label}</FieldTitle>
                          <FieldDescription>
                            {value.type.description}
                          </FieldDescription>
                          <FieldDescription>
                            {value.calculated_price.calculated_amount}
                          </FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value={value.id} id={value.id} />
                      </Field>
                    </FieldLabel>
                  ))}
                </div>
              </RadioGroup>
            )}
          />
        </FieldGroup>
      </FieldSet>
      <Button type="submit" size="lg">
        Continue to payment
      </Button>
    </form>
  );
}
