"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useCart } from "../cart/cart-actions"

type ActiveTab = "address" | "shipping" | "payment"

type RouterProps = {
  handle: string
}

export const Router = ({
  handle,
}: RouterProps) => {
  const { data: cart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = searchParams.get("step")

  const activeTab: ActiveTab = currentStep === "address" || 
    currentStep === "shipping" || currentStep === "payment" ? currentStep : "address"

  useEffect(() => {
    if (!cart) {
      return
    }
    
    if (activeTab === "shipping" && (!cart?.shipping_address || !cart?.billing_address)) {
      return router.push(`/checkout?step=address`)
    }
  
    if (activeTab === "payment" && (
      !cart?.shipping_address || !cart?.billing_address || !cart?.shipping_methods?.length
    )) {
      return router.push(`/checkout?step=shipping`)
    }
  }, [cart, activeTab, router.push])

  return (
    <>
      {/* TODO render components */}
    </>
  )
}