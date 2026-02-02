"use client";

import { medusa } from "@/lib/medusa";
import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { region } from "@/lib/constants";
import { useState } from "react";
import { useCart } from "../cart/cart-actions";

export function Payment() {
  const [selectedProvider, setSelectedProvider] = useState<null | string>(null);

  const { data: cart } = useCart();

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!cart) return;
    if (!selectedProvider) return;
    
    try {
      const returnUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/checkout?success=true`
        : "http://localhost:3000/checkout?success=true";
      
      await medusa.store.payment.initiatePaymentSession(cart, {
        provider_id: selectedProvider,
        data: {
          confirmation: {
            type: "redirect",
            return_url: returnUrl,
            cart,
          },
          cart: cart,
        },
      });
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      // TODO: Add proper error toast/notification
    }
  }
  const {
    isLoading,
    data: providers,
    isSuccess,
  } = useQuery({
    queryKey: ["payment-providers"],
    queryFn: () => {
      return medusa.store.payment.listPaymentProviders({ region_id: region });
    },
    select: (data) => data.payment_providers,
  });

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <form onSubmit={handlePayment}>
      <FieldSet>
        <FieldLegend>Payment</FieldLegend>
        <FieldGroup>
          <RadioGroup
            value={selectedProvider}
            onValueChange={setSelectedProvider}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {isSuccess &&
                providers.map((value) => (
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
        </FieldGroup>
        <Button type="submit" disabled={!selectedProvider || !cart}>
          Save provider
        </Button>
      </FieldSet>
    </form>
  );
}
