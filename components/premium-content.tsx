import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle, Clock, Plus, ArrowRight, Search, Zap, BarChart3, Wallet } from "lucide-react"
import { PremiumShipmentTracker } from "@/components/premium-shipment-tracker"
import { PremiumQuickActions } from "@/components/premium-quick-actions"
import { PremiumShipmentStatus } from "@/components/premium-shipment-status"
import { PremiumShipmentCard } from "@/components/premium-shipment-card"
import { PremiumWelcomeBanner } from "@/components/premium-welcome-banner"
import { PremiumStatsCard } from "@/components/premium-stats-card"
import { PremiumPricingTable } from "@/components/premium-pricing-table"

export function PremiumContent() {
  return (
    <div className="space-y-8 pb-10">
      <PremiumWelcomeBanner />

      <div className="grid gap-6 md:grid-cols-4">
        <PremiumShipmentStatus title="تم التوصيل" count={76} icon={CheckCircle} color="green" />
        <PremiumShipmentStatus title="جاري التوصيل" count={2} icon={Truck} color="amber" />
        <PremiumShipmentStatus title="جاهز للشحن" count={1} icon={Package} color="blue" />
        <PremiumShipmentStatus title="قيد المعالجة" count={3} icon={Clock} color="purple" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="premium-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">شحناتي النشطة</h3>
                <p className="text-sm text-muted-foreground">متابعة شحناتك الحالية</p>
              </div>
              <Button variant="ghost" className="gap-1 text-primary hover:bg-primary/5">
                <span>عرض الكل</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative mb-4 flex items-center rounded-xl border bg-gray-50 px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50">
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
              <PremiumShipmentCard
                id={1001}
                from="الرياض"
                to="جدة"
                status="delivered"
                date="15 أبريل 2025"
                time="10:30 ص"
              />
              <PremiumShipmentCard
                id={1002}
                from="الدمام"
                to="الرياض"
                status="transit"
                date="16 أبريل 2025"
                time="2:45 م"
              />
              <PremiumShipmentCard
                id={1003}
                from="جدة"
                to="مكة"
                status="processing"
                date="17 أبريل 2025"
                time="9:15 ص"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PremiumStatsCard
              title="إحصائيات الشحن"
              icon={BarChart3}
              color="blue"
              stats={[
                { label: "إجمالي الشحنات", value: "82" },
                { label: "متوسط وقت التوصيل", value: "1.8 يوم" },
                { label: "معدل رضا العملاء", value: "96%" },
              ]}
            />

            <PremiumStatsCard
              title="المحفظة الإلكترونية"
              icon={Wallet}
              color="green"
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
          <div className="premium-card bg-gradient-to-br from-primary to-primary/80 text-white">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">إنشاء شحنة</h3>
                <p className="text-sm text-white/80">أنشئ شحنة جديدة بخطوات بسيطة</p>
              </div>
            </div>
            <Button className="w-full bg-white text-primary hover:bg-white/90 premium-button">
              <Plus className="mr-2 h-5 w-5" />
              <span>إنشاء شحنة جديدة</span>
            </Button>
          </div>

          <PremiumQuickActions />

          <div className="premium-card">
            <div className="mb-4">
              <h3 className="text-xl font-bold">تتبع شحنة</h3>
              <p className="text-sm text-muted-foreground">أدخل رقم الشحنة لتتبع حالتها</p>
            </div>
            <PremiumShipmentTracker />
          </div>
        </div>
      </div>

      <div className="premium-card">
        <div className="mb-4">
          <h3 className="text-xl font-bold">أسعار الشحن</h3>
          <p className="text-sm text-muted-foreground">تعرف على أسعار الشحن بين المدن</p>
        </div>
        <PremiumPricingTable />
      </div>
    </div>
  )
}
