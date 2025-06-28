"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TrendingUp, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface V7WelcomeBannerProps {
  theme: "light" | "dark"
}

export function V7WelcomeBanner({ theme }: V7WelcomeBannerProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`relative v7-neu-card-welcome p-6 rounded-xl md:p-8 transition-all duration-1000 ${isAnimated ? "opacity-100" : "opacity-0 translate-y-10"}`}
    >
      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-[#294D8B]">مرحباً، أحمد</h1>
          <p className="text-[#6d6a67]">مرحباً بك في لوحة تحكم مراسيل المطورة</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="v7-neu-button gap-2" onClick={() => router.push("/reports")}>
            <TrendingUp className="h-5 w-5" />
            <span>تقرير الأداء</span>
          </Button>
          <Button className="v7-neu-button-accent gap-2" onClick={() => router.push("/create-shipment")}>
            <Plus className="h-5 w-5" />
            <span>إنشاء شحنة جديدة</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
