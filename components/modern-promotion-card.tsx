"use client"

import { useState } from "react"
import { Gift, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ModernPromotionCard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`clay-morphism p-6 rounded-3xl overflow-hidden ${isHovered ? "glow-border" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full modern-gradient-secondary p-2 text-white">
          <Gift className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold gradient-text">عروض خاصة</h3>
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
