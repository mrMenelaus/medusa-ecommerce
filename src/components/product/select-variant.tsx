"use client";

import { StoreProduct } from "@medusajs/types";
import { useState } from "react";
import { AddButton } from "../cart/add-button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function SelectVariant({ product }: { product: StoreProduct }) {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const selectedVariant = product.variants?.find((element) =>
    element.options?.every(
      (option) => option.id === selectedOptions[option.option_id!],
    ),
  );

  return (
    <>
      <FieldGroup>
        {product.options?.map((option) => (
          <FieldSet key={option.id}>
            <FieldLabel htmlFor="compute-environment-p8w">
              {option.title}
            </FieldLabel>
            <RadioGroup
              onValueChange={(value) =>
                setSelectedOptions((prev) => ({ ...prev, [option.id]: value }))
              }
              value={selectedOptions[option.id]}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {option.values?.map((value) => (
                  <FieldLabel htmlFor={value.id} key={value.id}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>{value.value}</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem value={value.id} id={value.id} />
                    </Field>
                  </FieldLabel>
                ))}
              </div>
            </RadioGroup>
          </FieldSet>
        ))}
      </FieldGroup>
      <AddButton variant={selectedVariant} />
    </>
  );
}
