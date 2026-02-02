"use client";

import { useActionState } from "react";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { updateCartAddressAction } from "@/app/actions/cart";
import { TextField } from "../form/text-field";
import type { StoreCart } from "@medusajs/types";

export function Address({ cart }: { cart: StoreCart }) {
  const [state, formAction, isPending] = useActionState(
    updateCartAddressAction,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <FieldSet>
        <FieldLegend>Адрес доставки</FieldLegend>
        <FieldGroup className="grid md:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="country_code">Страна</FieldLabel>
            <Select aria-invalid={state?.errors?.country_code}>
              <SelectTrigger id="country_code" name="country_code">
                <SelectValue placeholder="Выберите страну..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Countries</SelectLabel>
                  {cart?.region?.countries?.map((country) => (
                    <SelectItem
                      key={country.iso_2}
                      value={country.iso_2 || "fallback"}
                    >
                      {country.display_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <TextField
            defaultValue={state?.data?.province}
            name="province"
            title="Регион, область"
            placeholder="Свердловская область"
            errors={state?.errors?.province}
          />
          <TextField
            defaultValue={state?.data?.city}
            name="city"
            title="Город (населённый пункт)"
            placeholder="Новомосковск"
            required
            errors={state?.errors?.city}
          />
          <TextField
            defaultValue={state?.data?.address_1}
            name="address_1"
            title="Адрес"
            placeholder="ул. Максима Горького, д. 10 кв.133"
            required
            errors={state?.errors?.address_1}
          />
          <TextField
            defaultValue={state?.data?.postal_code}
            name="postal_code"
            title="Почтовый индекс"
            placeholder="392000"
            required
            errors={state?.errors?.postal_code}
          />
          <TextField
            defaultValue={state?.data?.company}
            name="company"
            title="Компания"
            placeholder="Тинькофф"
            errors={state?.errors?.company}
          />
          <TextField
            defaultValue={state?.data?.first_name}
            name="first_name"
            title="Имя"
            placeholder="Иван"
            required
            errors={state?.errors?.first_name}
          />
          <TextField
            defaultValue={state?.data?.last_name}
            name="last_name"
            title="Фамилия"
            placeholder="Иванов"
            errors={state?.errors?.last_name}
          />
          <TextField
            defaultValue={state?.data?.phone}
            name="phone"
            title="Номер телефона"
            placeholder="+79998880808"
            type="tel"
            errors={state?.errors?.phone}
          />
        </FieldGroup>
      </FieldSet>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Сохранение..." : "Save Address"}
      </Button>
    </form>
  );
}
