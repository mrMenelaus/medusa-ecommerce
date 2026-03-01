"use client";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";

import { useRegion } from "../region/region-provider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { Skeleton } from "../ui/skeleton";
import { StoreCart, StorePaymentSession } from "@medusajs/types";
import { memo } from "react";
import { Empty, EmptyTitle } from "../ui/empty";
import Link from "next/link";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { keys } from "../cart/cart-actions";
const paymentSchema = z.object({
  method: z.string(),
});

export function Payment({ cart }: { cart: StoreCart }) {
  const { region } = useRegion();
  const { isLoading, data: providers } = useQuery({
    queryKey: ["payments", region.id],
    queryFn: async () => {
      const response = await medusa.store.payment.listPaymentProviders({
        region_id: region.id,
      });
      return response.payment_providers;
    },
  });
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: undefined,
    },
  });
  const queryClient = useQueryClient();

  async function onSubmit(data: z.infer<typeof paymentSchema>) {
    await medusa.store.payment.initiatePaymentSession(cart, {
      provider_id: data.method,
      data: {
        confirmation: {
          type: "redirect",
          return_url: `http://localhost:3000/checkout`,
        },
        cart: cart,
      },
    });
    queryClient.invalidateQueries({ queryKey: keys.cart });
  }

  if (isLoading) {
    return (
      <div>
        <Skeleton className="w-full h-8 mb-4" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-full h-4 mb-2" />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend>Payment</FieldLegend>
          <FieldGroup>
            <Controller
              name="method"
              control={form.control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="grid grid-cols-2 gap-2">
                    {providers?.map((value) => (
                      <FieldLabel htmlFor={value.id} key={value.id}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{value.id}</FieldTitle>
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
          <Button type="submit">Save provider</Button>
        </FieldSet>
      </form>
      <SelectedProvider
        activeSession={cart.payment_collection?.payment_sessions?.[0]}
      />
    </>
  );
}

const SelectedProvider = memo(
  ({ activeSession }: { activeSession?: StorePaymentSession }) => {
    if (!activeSession) {
      return (
        <Empty>
          <EmptyTitle>You haven't chosen</EmptyTitle>
        </Empty>
      );
    }

    if (activeSession.provider_id.startsWith("pp_yookassa")) {
      const confirmation = activeSession.data?.confirmation as {
        confirmation_url: string;
      };
      console.log(confirmation);
      if (confirmation?.confirmation_url) {
        return (
          <Button asChild variant="outline">
            <Link href={confirmation.confirmation_url}>Pay</Link>
          </Button>
        );
      }
    }

    return <div>This payment provider is under development</div>;
  },
);
