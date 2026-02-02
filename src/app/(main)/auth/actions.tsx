"use server";
import { medusa } from "@/lib/medusa";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  email: z.email(),
  firstName: z.string().nonempty().max(32).min(2),
  lastName: z.string().nonempty().max(32).min(2),
  password: z.string().nonempty().max(32).min(8),
});

export async function register(current: unknown, formData: FormData) {
  const data = Object.fromEntries(formData) as z.input<typeof registerSchema>;
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: z.flattenError(parsed.error).fieldErrors,
      message: "Please, fix errors in your inputs",
      data,
    };
  }
  try {
    const res = await medusa.auth.register("customer", "emailpass", {
      email: parsed.data.email,
      password: parsed.data.password,
    });
    
    (await cookies()).set("token", res);
} catch {
    const res = await medusa.auth.login("customer", "emailpass", {
        email: parsed.data.email,
        password: parsed.data.password,
    });
    (await cookies()).set("token", res as string);
    redirect("/");
  }
}
