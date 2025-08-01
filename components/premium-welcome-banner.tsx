import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowUpRight } from "lucide-react"

export function PremiumWelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-6 text-white shadow-lg md:p-8">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">مرحباً، أحمد</h1>
          <p className="text-white/80">مرحباً بك في لوحة تحكم مراسيل المطورة</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="premium-button bg-white/20 hover:bg-white/30 gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>تقرير الأداء</span>
          </Button>
          <Button className="premium-button bg-white text-primary hover:bg-white/90 gap-2">
            <span>إنشاء شحنة جديدة</span>
            <ArrowUpRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
