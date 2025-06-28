"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Plus, ArrowRight, Search, BarChart3, Wallet, Sparkles } from "lucide-react"
import { V6ShipmentTracker } from "@/components/v6/v6-shipment-tracker"
import { V6QuickActions } from "@/components/v6/v6-quick-actions"
import { V6ShipmentStatus } from "@/components/v6/v6-shipment-status"
import { V6ShipmentCard } from "@/components/v6/v6-shipment-card"
import { V6WelcomeBanner } from "@/components/v6/v6-welcome-banner"
import { V6StatsCard } from "@/components/v6/v6-stats-card"
import { V6PricingTable } from "@/components/v6/v6-pricing-table"
import { V6PromotionCard } from "@/components/v6/v6-promotion-card"

export function V6Content() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="space-y-8 pb-10">
      <V6WelcomeBanner />

      <div className="grid gap-6 md:grid-cols-4">
        <V6ShipmentStatus title="تم التوصيل" count={76} icon={CheckCircle} color="success" />
        <V6ShipmentStatus title="جاري التوصيل" count={2} icon={Truck} color="warning" />
        <V6ShipmentStatus title="جاهز للشحن" count={1} icon={Package} color="info" />
        <V6ShipmentStatus title="قيد المعالجة" count={3} icon={Clock} color="secondary" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div
            className={`v6-clay p-6 rounded-3xl v6-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold v6-gradient-text">شحناتي النشطة</h3>
                <p className="text-sm text-muted-foreground">متابعة شحناتك الحالية</p>
              </div>
              <Button variant="ghost" className="gap-1 text-primary hover:bg-primary/5 rounded-xl">
                <span>عرض الكل</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative mb-6 flex items-center rounded-xl v6-clay px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="البحث برقم الشحنة..."
                className="flex-1 border-none bg-transparent px-2 py-1 focus:outline-none"
              />
              <Button variant="ghost" size="sm" className="rounded-lg text-xs text-primary hover:bg-primary/5">
                بحث متقدم
              </Button>
            </div>

            <div className="space-y-4">
              <V6ShipmentCard
                id={1001}
                from="الرياض"
                to="جدة"
                status="delivered"
                date="15 أبريل 2025"
                time="10:30 ص"
                priority="عادي"
              />
              <V6ShipmentCard
                id={1002}
                from="الدمام"
                to="الرياض"
                status="transit"
                date="16 أبريل 2025"
                time="2:45 م"
                priority="سريع"
              />
              <V6ShipmentCard
                id={1003}
                from="جدة"
                to="مكة"
                status="processing"
                date="17 أبريل 2025"
                time="9:15 ص"
                priority="فائق السرعة"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <V6StatsCard
              title="إحصائيات الشحن"
              icon={BarChart3}
              color="info"
              stats={[
                { label: "إجمالي الشحنات", value: "82" },
                { label: "متوسط وقت التوصيل", value: "1.8 يوم" },
                { label: "معدل رضا العملاء", value: "96%" },
              ]}
            />

            <V6StatsCard
              title="المحفظة الإلكترونية"
              icon={Wallet}
              color="success"
              stats={[
                { label: "الرصيد الحالي", value: "76.02 ريال" },
                { label: "آخر معاملة", value: "منذ 3 ساعات" },
                { label: "الخصم المتاح", value: "15%" },
              ]}
              action={{
                label: "شحن المحفظة",
                onClick: () => {},
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div
            className={`v6-clay p-6 rounded-3xl v6-morphing text-white v6-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.3s" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">إنشاء شحنة</h3>
                <p className="text-sm text-white/80">أنشئ شحنة جديدة بخطوات بسيطة</p>
              </div>
            </div>
            <Button className="w-full bg-white text-primary hover:bg-white/90 v6-button">
              <Plus className="mr-2 h-5 w-5" />
              <span>إنشاء شحنة جديدة</span>
            </Button>
          </div>

          <V6QuickActions />

          <V6PromotionCard />

          <div
            className={`v6-clay p-6 rounded-3xl v6-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.5s" }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold v6-gradient-text">تتبع شحنة</h3>
              <p className="text-sm text-muted-foreground">أدخل رقم الشحنة لتتبع حالتها</p>
            </div>
            <V6ShipmentTracker />
          </div>
        </div>
      </div>

      <div
        className={`v6-clay p-6 rounded-3xl v6-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "0.6s" }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-bold v6-gradient-text">أسعار الشحن</h3>
          <p className="text-sm text-muted-foreground">تعرف على أسعار الشحن بين المدن</p>
        </div>
        <V6PricingTable />
      </div>
    </div>
  )
}
