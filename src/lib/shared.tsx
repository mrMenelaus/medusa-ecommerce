import { cookies } from "next/headers"
import { cache } from "react"
import { headers } from "./constants"
import { medusa } from "./medusa"

export const getCart= cache(async () => {
  const cartId = (await cookies()).get(headers.cart)?.value
  if (!cartId) return null
  return (await medusa.store.cart.retrieve(cartId)).cart
})