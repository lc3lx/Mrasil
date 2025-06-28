"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Wallet,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Package,
  BarChart3,
  XCircle,
  Eye,
  CheckCircle,
} from "lucide-react"
import { V7StatsCard } from "@/components/v7/v7-stats-card"
import { V7ShipmentCard } from "@/components/v7/v7-shipment-card"
import { V7WelcomeBanner } from "@/components/v7/v7-welcome-banner"
import { V7ShipmentLineChart } from "@/components/v7/charts/shipment-line-chart"
import { V7Content } from "@/components/v7/v7-content"

// بيانات وهمية للإحصائيات
const statsData = {
  balance: {
    available: "76.02 ريال",
    lastTransaction: "منذ 3 ساعات",
  },
  orders: {
    today: "12 طلب",
    total: "143 طلب",
    target: "150 طلب",
    percentage: 95,
  },
  shipping: {
    averageCost: "22.00 ريال",
    totalCost: "2,158.00 ريال",
    lastMonth: "1,876.00 ريال",
    percentageChange: 15,
  },
  monthly: {
    totalShipments: {
      value: "77",
      change: "+12%",
      positive: true,
    },
    deliveryTime: {
      value: "1.8",
      change: "-0.3 يوم",
      positive: true,
    },
    customerSatisfaction: {
      value: "96%",
      change: "+2%",
      positive: true,
    },
    deliveryLocations: {
      value: "12 موقع",
      change: "+3",
      positive: true,
    },
    growthRate: {
      value: "15%",
      change: "+3%",
      positive: true,
    },
  },
}

// بيانات وهمية للشحنات الأخيرة
const recentShipments = [
  {
    id: 1003,
    from: "الرياض",
    to: "جدة",
    status: "processing",
    date: "2023/04/25",
    time: "10:30 ص",
    priority: "عادي",
    trackingNumber: "SHP1003456",
    estimatedDelivery: "2023/04/27",
    customer: "شركة الأفق للتجارة",
    items: 3,
    weight: "5.2 كجم",
    cost: "45.00 ريال",
  },
  {
    id: 1002,
    from: "الرياض",
    to: "الدمام",
    status: "transit",
    date: "2023/04/24",
    time: "09:15 ص",
    priority: "سريع",
    trackingNumber: "SHP1002456",
    estimatedDelivery: "2023/04/26",
    customer: "مؤسسة النور",
    items: 1,
    weight: "2.7 كجم",
    cost: "35.50 ريال",
  },
  {
    id: 1001,
    from: "الرياض",
    to: "مكة",
    status: "delivered",
    date: "2023/04/23",
    time: "14:45 م",
    priority: "فائق السرعة",
    trackingNumber: "SHP1001456",
    estimatedDelivery: "2023/04/25",
    customer: "محمد أحمد",
    items: 2,
    weight: "1.5 كجم",
    cost: "60.00 ريال",
  },
  {
    id: 1000,
    from: "الرياض",
    to: "المدينة المنورة",
    status: "delivered",
    date: "2023/04/10",
    time: "11:20 ص",
    priority: "عادي",
    trackingNumber: "SHP1000456",
    estimatedDelivery: "2023/04/12",
    customer: "خالد العلي",
    items: 1,
    weight: "0.8 كجم",
    cost: "28.50 ريال",
  },
  {
    id: 999,
    from: "الرياض",
    to: "الطائف",
    status: "delivered",
    date: "2023/03/29",
    time: "16:45 م",
    priority: "عادي",
    trackingNumber: "SHP0999456",
    estimatedDelivery: "2023/03/31",
    customer: "سارة محمد",
    items: 2,
    weight: "1.2 كجم",
    cost: "32.75 ريال",
  },
]

export function HomeContent({ theme = "light" }: { theme?: "light" | "dark" }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("weekly")
  const [userData, setUserData] = useState({
    name: "أحمد محمد",
    lastLogin: "اليوم، 09:45 ص",
    notifications: 3,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filteredShipments, setFilteredShipments] = useState(recentShipments.slice(0, 3))

  // محاكاة تحميل البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // عند التحميل الأولي، عرض أحدث 3 شحنات
      setFilteredShipments(recentShipments.slice(0, 3))
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <V7Content>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="v7-loading-spinner mb-4"></div>
          <p className="text-[#3498db] text-lg">جاري تحميل لوحة التحكم...</p>
        </div>
      </V7Content>
    )
  }

  return (
    <V7Content>
      <V7WelcomeBanner
        title={`مرحباً، ${userData.name}`}
        description={`آخر تسجيل دخول: ${userData.lastLogin} • لديك ${userData.notifications} إشعارات جديدة`}
        theme={theme}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 v7-fade-in" style={{ transitionDelay: "0.1s" }}>
        <V7StatsCard
          title="الرصيد الحالي"
          icon={Wallet}
          color="primary"
          theme={theme}
          stats={[
            { label: "الرصيد المتاح", value: statsData.balance.available },
            { label: "آخر معاملة", value: statsData.balance.lastTransaction },
          ]}
          action={{
            label: "شحن المحفظة الآن",
            onClick: () => console.log("شحن المحفظة"),
          }}
        />

        <V7StatsCard
          title="طلبات اليوم"
          icon={ShoppingBag}
          color="secondary"
          theme={theme}
          stats={[
            { label: "طلبات اليوم", value: statsData.orders.today },
            { label: "جميع الطلبات", value: statsData.orders.total },
            { label: "الهدف", value: statsData.orders.target, progress: statsData.orders.percentage },
          ]}
        />

        <V7StatsCard
          title="متوسط تكلفة الشحن"
          icon={CreditCard}
          color="success"
          theme={theme}
          stats={[
            { label: "متوسط التكلفة", value: statsData.shipping.averageCost },
            { label: "مجموع التكاليف", value: statsData.shipping.totalCost },
            {
              label: "مقارنة بالشهر السابق",
              value: `${statsData.shipping.percentageChange}%+`,
              trend: "up",
            },
          ]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 v7-fade-in" style={{ transitionDelay: "0.2s" }}>
        <div className="lg:col-span-2">
          <Card className="v7-neu-card overflow-hidden border-none">
            <CardHeader className="pb-0">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-[#294D8B] -mt-1">أسعار الشحن</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <Tabs value="weekly" className="w-full">
                <TabsContent value="weekly" className="mt-0">
                  <V7ShipmentLineChart period="weekly" />
                </TabsContent>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  * الأسعار تشمل الضريبة وتختلف حسب الوزن والمسافة
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="v7-neu-card overflow-hidden border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#294D8B]">الإحصائيات</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <Package className="h-4 w-4 text-[#294D8B]" />
                </div>
                <span className="text-sm">إجمالي الشحنات</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsData.monthly.totalShipments.value}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md border ${
                    statsData.monthly.totalShipments.positive
                      ? "bg-[#E6FEEF] text-[#2d5e1a] border-green-200"
                      : "bg-[#ffebeb] text-[#e53e3e] border-red-200"
                  } flex items-center gap-0.5 transition-all hover:shadow-md hover:scale-105`}
                >
                  <ArrowUpRight
                    className={`h-3 w-3 ${!statsData.monthly.totalShipments.positive ? "rotate-180" : ""}`}
                  />
                  {statsData.monthly.totalShipments.change}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm bg-blue-50">
                  <Package className="h-4 w-4 text-[#3498db]" />
                </div>
                <span className="text-sm font-medium">شحنات اليوم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">24</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md border bg-[#E6FEEF] text-[#2d5e1a] border-green-200 flex items-center gap-0.5 transition-all hover:shadow-md hover:scale-105">
                  <ArrowUpRight className="h-3 w-3" />
                  +5
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                </div>
                <span className="text-sm">الشحنات المستلمة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsData.monthly.customerSatisfaction.value}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md border ${
                    statsData.monthly.customerSatisfaction.positive
                      ? "bg-[#E6FEEF] text-[#2d5e1a] border-green-200"
                      : "bg-[#ffebeb] text-[#e53e3e] border-red-200"
                  } flex items-center gap-0.5 transition-all hover:shadow-md hover:scale-105`}
                >
                  <ArrowUpRight
                    className={`h-3 w-3 ${!statsData.monthly.customerSatisfaction.positive ? "rotate-180" : ""}`}
                  />
                  {statsData.monthly.customerSatisfaction.change}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <XCircle className="h-4 w-4 text-[#e74c3c]" />
                </div>
                <span className="text-sm">الشحنات الملغاة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsData.monthly.deliveryLocations.value}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md border ${
                    !statsData.monthly.deliveryLocations.positive
                      ? "bg-[#E6FEEF] text-[#2d5e1a] border-green-200"
                      : "bg-[#ffebeb] text-[#e53e3e] border-red-200"
                  } flex items-center gap-0.5 transition-all hover:shadow-md hover:scale-105`}
                >
                  <ArrowUpRight
                    className={`h-3 w-3 ${!statsData.monthly.deliveryLocations.positive ? "rotate-180" : ""}`}
                  />
                  {statsData.monthly.deliveryLocations.change}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="v7-neu-icon-sm">
                  <BarChart3 className="h-4 w-4 text-[#3498db]" />
                </div>
                <span className="text-sm">معدل النمو</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{statsData.monthly.growthRate.value}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md border ${
                    statsData.monthly.growthRate.positive
                      ? "bg-[#E6FEEF] text-[#2d5e1a] border-green-200"
                      : "bg-[#ffebeb] text-[#e53e3e] border-red-200"
                  } flex items-center gap-0.5 transition-all hover:shadow-md hover:scale-105`}
                >
                  <ArrowUpRight className={`h-3 w-3 ${!statsData.monthly.growthRate.positive ? "rotate-180" : ""}`} />
                  {statsData.monthly.growthRate.change}
                </span>
              </div>
            </div>

            <Button className="mt-2 w-full v7-neu-button" onClick={() => router.push("/reports")}>
              <TrendingUp className="mr-2 h-4 w-4" />
              تقرير مفصل
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="v7-fade-in" style={{ transitionDelay: "0.3s" }}>
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold text-[#3498db]">آخر الشحنات</h2>
        </div>

        <div className="grid gap-4">
          {filteredShipments.map((shipment) => (
            <div key={shipment.id} className="group">
              <V7ShipmentCard
                id={shipment.id}
                from={shipment.from}
                to={shipment.to}
                status={shipment.status}
                date={shipment.date}
                time={shipment.time}
                priority={shipment.priority}
                theme={theme}
                trackingNumber={shipment.trackingNumber}
                estimatedDelivery={shipment.estimatedDelivery}
              />

              {/* تفاصيل إضافية تظهر عند النقر */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100 hidden group-hover:grid transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">العميل</span>
                  <span className="font-medium">{shipment.customer}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">عدد المنتجات</span>
                  <span className="font-medium">{shipment.items} منتج</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">الوزن</span>
                  <span className="font-medium">{shipment.weight}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">تكلفة الشحن</span>
                  <span className="font-medium">{shipment.cost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button className="v7-neu-button" onClick={() => router.push("/shipments")}>
            <Eye className="mr-2 h-4 w-4" />
            عرض جميع الشحنات
          </Button>
        </div>
      </div>
    </V7Content>
  )
}
