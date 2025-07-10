"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentMethodProps {
  onValueChange?: (value: string) => void
  defaultValue?: string
}

export function PaymentMethodSelector({ onValueChange, defaultValue = "prepaid" }: PaymentMethodProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium block mb-2">طريقة الدفع</Label>
      <RadioGroup defaultValue={defaultValue} onValueChange={onValueChange} className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
          <RadioGroupItem value="prepaid" id="payment-prepaid" />
          <Label htmlFor="payment-prepaid" className="mr-2">
            الدفع المسبق
          </Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
          <RadioGroupItem value="cod" id="payment-cod" />
          <Label htmlFor="payment-cod" className="mr-2">
            الدفع عند الاستلام
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
