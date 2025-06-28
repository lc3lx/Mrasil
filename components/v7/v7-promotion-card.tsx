"use client"

import { Gift, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface V7PromotionCardProps {
  theme: "light" | "dark"
}

export function V7PromotionCard({ theme }: V7PromotionCardProps) {
  return (
    <div className="v7-neu-card p-6 rounded-xl v7-fade-in" style={{ transitionDelay: "0.45s" }}>
      <div className="mb-3 flex items-center gap-2">
        <div className="v7-neu-icon">
          <Gift className="h-5 w-5 text-[#3498db]" />
        </div>
        <h3 className="text-lg font-bold text-[#3498db]">عروض خاصة</h3>
      </div>

      <div className="mb-3 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <p className="text-sm">خصم 15% على الشحنات الدولية</p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <p className="text-sm">شحن مجاني للطلبات فوق 200 ريال</p>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-between rounded-xl text-[#3498db] hover:bg-[#3498db]/5 v7-neu-button-flat"
      >
        <span>استفد من العروض الآن</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
