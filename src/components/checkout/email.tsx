"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { medusa } from "@/lib/medusa";
import { StoreCart } from "@medusajs/types";
import { useRouter } from "next/navigation";

const emailSchema = z.object({
  email: z.email(),
});

export function Email({ cart }: { cart: StoreCart }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: cart.email ?? "",
    },
    mode: "onBlur",
  });

  async function saveEmail(data: z.infer<typeof emailSchema>) {
    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;
    await medusa.store.cart.update(cartId, { email: data.email });
    router.push(`?stage=address`);
  }

  return (
    <form onSubmit={form.handleSubmit(saveEmail)} className="space-y-8">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
            <Input
              {...field}
              id="form-rhf-demo-title"
              aria-invalid={fieldState.invalid}
              placeholder="johndoe@gmail.com"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" size="lg">
        Continue to delivery
      </Button>
    </form>
  );
}
