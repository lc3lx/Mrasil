"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, Sparkles, Gift } from "lucide-react"

export function ModernWelcomeBanner() {
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative overflow-hidden rounded-3xl morphing-shape p-6 text-white shadow-lg md:p-8 transition-all duration-1000 ${isAnimated ? "opacity-100" : "opacity-0 translate-y-10"}`}
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
            <Gift className="h-4 w-4" />
            <span>عروض خاصة متاحة الآن</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">مرحباً، أحمد</h1>
          <p className="text-white/80">مرحباً بك في لوحة تحكم مراسيل المطورة</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="modern-button bg-white/20 hover:bg-white/30 gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>تقرير الأداء</span>
          </Button>
          <Button className="modern-button bg-white text-primary hover:bg-white/90 gap-2">
            <Sparkles className="h-5 w-5" />
            <span>إنشاء شحنة جديدة</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
