import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ComponentProps } from "react";

export function TextField({
  errors,
  title,
  description,
  ...props
}: {
  description?: string;
  title: string;
  errors?: string[];
} & ComponentProps<"input">) {
  const invalid = Boolean(errors?.length);

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={title}>{title}</FieldLabel>
      <Input id={title} aria-invalid={invalid} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={errors} />}
    </Field>
  );
}
