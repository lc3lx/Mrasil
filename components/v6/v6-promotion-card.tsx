"use client"

import { useState } from "react"
import { Gift, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function V6PromotionCard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`v6-clay p-6 rounded-3xl overflow-hidden ${isHovered ? "v6-glow-border" : ""} v6-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: "0.45s" }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full v6-gradient-secondary p-2 text-white">
          <Gift className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold v6-gradient-text">عروض خاصة</h3>
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

      <Button variant="ghost" className="w-full justify-between rounded-xl text-primary hover:bg-primary/5">
        <span>استفد من العروض الآن</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
