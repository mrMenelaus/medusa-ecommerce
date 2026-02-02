"use client";
import { useActionState } from "react";
import { register } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Check, X } from "lucide-react";
import { TextField } from "@/components/form/text-field";

export default function Register() {
  const [state, action, isPending] = useActionState(register, null);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>You can get better experience</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register" action={action}>
          <FieldGroup>
            <TextField
              title="First name"
              placeholder="Jane"
              errors={state?.errors?.firstName}
              defaultValue={state?.data?.firstName}
              name="firstName"
            />
            <TextField
              title="Last name"
              placeholder="Doe"
              errors={state?.errors?.lastName}
              defaultValue={state?.data?.lastName}
              name="lastName"
            />
            <TextField
              title="Email"
              placeholder="janedoe@gmail.com"
              errors={state?.errors?.email}
              defaultValue={state?.data?.email}
              name="email"
              type="email"
            />
            <TextField
              title="Password"
              placeholder="Password"
              type="password"
              min={6}
              max={32}
              errors={state?.errors?.password}
              defaultValue={state?.data?.password}
              name="password"
            />
            {state && (
              <Item variant="outline">
                <ItemMedia>{state.success ? <Check /> : <X />}</ItemMedia>
                <ItemContent>
                  <ItemTitle>{state.success ? "Success" : "Fail"}</ItemTitle>
                  <ItemDescription>{state.message}</ItemDescription>
                </ItemContent>
              </Item>
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="register" disabled={isPending}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
