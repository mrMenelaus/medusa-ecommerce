"use client";

import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";
import { useCart } from "../cart/cart-actions";
import { addShippingMethodAction, getShippingOptionsAction } from "@/app/actions/cart";

export function Shipping() {
  const { data: cart } = useCart();
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  
  // Pre-select existing shipping method
  useEffect(() => {
    if (cart?.shipping_methods?.[0]?.shipping_option_id) {
      setSelectedShipping(cart.shipping_methods[0].shipping_option_id);
    }
  }, [cart]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShipping) return;
    try {
      const result = await addShippingMethodAction(selectedShipping);
      if (result.success) {
        // Refresh page to update cart summary and enable next section
        window.location.reload();
      } else {
        console.error("Failed to save shipping method:", result.error);
        // TODO: Add proper error toast/notification
      }
    } catch (error) {
      console.error("Failed to save shipping method:", error);
      // TODO: Add proper error toast/notification
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["shipping"],
    queryFn: async () => {
      const result = await getShippingOptionsAction();
      if (!result.success || !result.shipping_options) {
        throw new Error(result.error || "Failed to load shipping options");
      }
      return { shipping_options: result.shipping_options };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl leading-none font-medium mb-4">
          Shipping Options
        </h1>
      </div>
      <form className="flex flex-col gap-2" onSubmit={handleSave}>
        <FieldSet>
          <FieldLegend>Shipping</FieldLegend>
          <FieldGroup>
            <RadioGroup
              value={selectedShipping}
              onValueChange={setSelectedShipping}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {data?.shipping_options.map((value) => (
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
          </FieldGroup>
        </FieldSet>
        <Button className="self-start" type="submit" disabled={!selectedShipping}>
          {cart?.shipping_methods?.[0]?.shipping_option_id === selectedShipping ? "Update Shipping" : "Save Shipping"}
        </Button>
      </form>
    </>
  );
}
