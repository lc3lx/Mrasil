"use client"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PaymentOptionsProps {
  onSelect?: (value: string) => void
  defaultValue?: string
}

export function PaymentOptions({ onSelect, defaultValue = "prepaid" }: PaymentOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">طريقة الدفع</h3>
      <RadioGroup defaultValue={defaultValue} onValueChange={onSelect} className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
          <RadioGroupItem value="prepaid" id="prepaid" />
          <Label htmlFor="prepaid" className="font-medium mr-2">
            الدفع المسبق
          </Label>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="font-medium mr-2">
            الدفع عند الاستلام
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
