"use client"

import { PaymentOptions } from "@/components/payment-options"

export function PaymentSection() {
  const handlePaymentMethodChange = (value: string) => {
    console.log("Selected payment method:", value)
    // Handle payment method selection
  }

  return (
    <div className="p-4 border rounded-md">
      <PaymentOptions onSelect={handlePaymentMethodChange} />
    </div>
  )
}
