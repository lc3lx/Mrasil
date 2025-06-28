"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChartIcon, Download, LineChartIcon, PieChartIcon, Share2, MapIcon, Filter } from "lucide-react"
import { V7ShipmentLineChart } from "@/components/v7/charts/shipment-line-chart"
import { PieChart } from "@/components/v7/charts/pie-chart"
import { BarChart } from "@/components/v7/charts/bar-chart"
import { PaymentLineChart } from "@/components/v7/charts/payment-line-chart"
import { ScatterChart } from "@/components/v7/charts/scatter-chart"
import dynamic from "next/dynamic"
import {
  monthlyShipmentData,
  weeklyShipmentData,
  shipmentTypeData,
  monthlyPaymentData,
  newCustomersData,
  shippingCostData,
} from "@/lib/chart-data"

// استيراد مكون الخريطة بشكل ديناميكي لتجنب مشاكل SSR
const RegionMapWithNoSSR = dynamic(() => import("@/components/v7/maps/region-map").then((mod) => mod.RegionMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#f0f4f8] rounded-lg">
      <div className="text-[#6d6a67]">جاري تحميل الخريطة...</div>
    </div>
  ),
})

// Define the enhanced region data with proper region names
const enhancedRegionData = [
  { id: "riyadh", name: "الرياض", value: 35, growth: "+12%", deliveryTime: "1.2 يوم" },
  { id: "makkah", name: "مكة المكرمة", value: 28, growth: "+8%", deliveryTime: "1.5 يوم" },
  { id: "madinah", name: "المدينة المنورة", value: 15, growth: "+5%", deliveryTime: "1.8 يوم" },
  { id: "qassim", name: "القصيم", value: 12, growth: "+3%", deliveryTime: "1.6 يوم" },
  { id: "eastern", name: "المنطقة الشرقية", value: 22, growth: "+9%", deliveryTime: "1.4 يوم" },
  { id: "asir", name: "عسير", value: 18, growth: "+7%", deliveryTime: "2.1 يوم" },
  { id: "tabuk", name: "تبوك", value: 8, growth: "+2%", deliveryTime: "2.3 يوم" },
  { id: "hail", name: "حائل", value: 7, growth: "+1%", deliveryTime: "2.0 يوم" },
  { id: "northern", name: "الحدود الشمالية", value: 5, growth: "+1%", deliveryTime: "2.5 يوم" },
  { id: "jazan", name: "جازان", value: 10, growth: "+4%", deliveryTime: "2.2 يوم" },
  { id: "najran", name: "نجران", value: 6, growth: "+2%", deliveryTime: "2.4 يوم" },
  { id: "bahah", name: "الباحة", value: 4, growth: "+1%", deliveryTime: "2.3 يوم" },
  { id: "jawf", name: "الجوف", value: 3, growth: "+1%", deliveryTime: "2.6 يوم" },
]

export function ReportsContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [timeRange, setTimeRange] = useState("month")
  const [shipmentData, setShipmentData] = useState(monthlyShipmentData)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (timeRange === "week") {
      setShipmentData(weeklyShipmentData)
    } else {
      setShipmentData(monthlyShipmentData)
    }
  }, [timeRange])

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion((prevRegion) => (prevRegion === regionId ? null : regionId))
  }

  const getRegionColor = (regionId: string) => {
    const region = enhancedRegionData.find((r) => r.id === regionId)
    if (!region) return "rgba(52, 152, 219, 0.2)"

    // Calculate color intensity based on value
    const maxValue = Math.max(...enhancedRegionData.map((r) => r.value))
    const intensity = (region.value / maxValue) * 0.8 + 0.2 // Range from 0.2 to 1.0

    return `rgba(52, 152, 219, ${intensity})`
  }

  const getSelectedRegionData = () => {
    return enhancedRegionData.find((r) => r.id === selectedRegion)
  }

  const getHoveredRegionData = () => {
    return enhancedRegionData.find((r) => r.id === hoveredRegion)
  }

  return (
    <div className="space-y-6">
      <div
        className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "0.2s" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#3498db]">تقارير الأداء</h3>
            <p className="text-sm text-[#6d6a67]">تحليل أداء الشحنات والمبيعات</p>
          </div>
          <div className="flex gap-4">
            <Select defaultValue="month" onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] v7-neu-input font-medium border-2 border-[#3498db] shadow-md bg-white hover:bg-[#f8fafc] transition-all">
                <div className="flex items-center justify-between w-full">
                  <SelectValue placeholder="اختر الفترة" />
                  <Filter className="h-4 w-4 ml-2 text-[#3498db]" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">آخر أسبوع</SelectItem>
                <SelectItem value="month">آخر شهر</SelectItem>
                <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
                <SelectItem value="year">آخر سنة</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1">
                <Download className="h-4 w-4" />
                <span>تصدير</span>
              </Button>
              <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1">
                <Share2 className="h-4 w-4" />
                <span>مشاركة</span>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="v7-neu-tabs p-1">
            <TabsTrigger
              value="overview"
              className="v7-neu-tab px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#3498db] data-[state=active]:text-white"
            >
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger
              value="shipments"
              className="v7-neu-tab px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#3498db] data-[state=active]:text-white"
            >
              الشحنات
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="v7-neu-tab px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#3498db] data-[state=active]:text-white"
            >
              مالي
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="v7-neu-tab px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#3498db] data-[state=active]:text-white"
            >
              العملاء
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="v7-neu-card-sm">
                <CardHeader className="pb-3 border-b border-[#e6edf3] px-4 pt-4 bg-[#edf2f7] v7-neu-card-header min-h-[90px] flex flex-col justify-center">
                  <CardTitle className="text-lg font-semibold text-[#3498db]">إجمالي الشحنات</CardTitle>
                  <CardDescription className="text-[#6d6a67] mt-1">آخر 30 يوم</CardDescription>
                </CardHeader>
                <CardContent className="p-3 bg-[#edf2f7] v7-neu-card-inner h-[70px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-[#3498db]">82</div>
                  <div className="text-xs text-green-600">+12% عن الشهر السابق</div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="pb-3 border-b border-[#e6edf3] px-4 pt-4 bg-[#edf2f7] v7-neu-card-header min-h-[90px] flex flex-col justify-center">
                  <CardTitle className="text-lg font-semibold text-[#3498db]">متوسط وقت التوصيل</CardTitle>
                  <CardDescription className="text-[#6d6a67] mt-1">آخر 30 يوم</CardDescription>
                </CardHeader>
                <CardContent className="p-3 bg-[#edf2f7] v7-neu-card-inner h-[70px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-[#3498db]">1.8 يوم</div>
                  <div className="text-xs text-green-600">-0.3 يوم عن الشهر السابق</div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="pb-3 border-b border-[#e6edf3] px-4 pt-4 bg-[#edf2f7] v7-neu-card-header min-h-[90px] flex flex-col justify-center">
                  <CardTitle className="text-lg font-semibold text-[#3498db]">الإيرادات</CardTitle>
                  <CardDescription className="text-[#6d6a67] mt-1">آخر 30 يوم</CardDescription>
                </CardHeader>
                <CardContent className="p-3 bg-[#edf2f7] v7-neu-card-inner h-[70px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-[#3498db]">3,450 ريال</div>
                  <div className="text-xs text-green-600">+8% عن الشهر السابق</div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="pb-3 border-b border-[#e6edf3] px-4 pt-4 bg-[#edf2f7] v7-neu-card-header min-h-[90px] flex flex-col justify-center">
                  <CardTitle className="text-lg font-semibold text-[#3498db]">رضا العملاء</CardTitle>
                  <CardDescription className="text-[#6d6a67] mt-1">آخر 30 يوم</CardDescription>
                </CardHeader>
                <CardContent className="p-3 bg-[#edf2f7] v7-neu-card-inner h-[70px] flex flex-col justify-center">
                  <div className="text-2xl font-bold text-[#3498db]">96%</div>
                  <div className="text-xs text-green-600">+2% عن الشهر السابق</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 mt-6 md:grid-cols-2">
              <Card className="v7-neu-card">
                <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                  <CardTitle className="flex items-center gap-2 text-[#3498db]">
                    <LineChartIcon className="h-5 w-5 text-[#3498db]" />
                    <span>اتجاهات الشحن</span>
                  </CardTitle>
                  <CardDescription className="text-[#6d6a67]">عدد الشحنات خلال آخر 30 يوم</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <V7ShipmentLineChart data={shipmentData} />
                </CardContent>
              </Card>

              <Card className="v7-neu-card">
                <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                  <CardTitle className="flex items-center gap-2 text-[#3498db]">
                    <MapIcon className="h-5 w-5 text-[#3498db]" />
                    <span>توزيع الشحنات</span>
                  </CardTitle>
                  <CardDescription className="text-[#6d6a67]">توزيع الشحنات حسب المناطق</CardDescription>
                </CardHeader>
                <CardContent className="p-6 h-[400px] relative">
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden v7-neu-card-inner">
                    <div className="w-full h-full relative">
                      <RegionMapWithNoSSR />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="v7-neu-card">
                <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                  <CardTitle className="flex items-center gap-2 text-[#3498db]">
                    <BarChartIcon className="h-5 w-5 text-[#3498db]" />
                    <span>تحليل الشحنات</span>
                  </CardTitle>
                  <CardDescription className="text-[#6d6a67]">تحليل تفصيلي لأداء الشحنات</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <BarChart data={shipmentData} dataKey="شحنات" />
                </CardContent>
              </Card>

              <Card className="v7-neu-card">
                <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                  <CardTitle className="flex items-center gap-2 text-[#3498db]">
                    <PieChartIcon className="h-5 w-5 text-[#3498db]" />
                    <span>أنواع الشحنات</span>
                  </CardTitle>
                  <CardDescription className="text-[#6d6a67]">توزيع الشحنات حسب النوع</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <PieChart data={shipmentTypeData} dataKey="value" />
                </CardContent>
              </Card>
            </div>

            <Card className="v7-neu-card mt-6">
              <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-[#3498db]">
                  <LineChartIcon className="h-5 w-5 text-[#3498db]" />
                  <span>تكلفة الشحن حسب المسافة</span>
                </CardTitle>
                <CardDescription className="text-[#6d6a67]">العلاقة بين المسافة وتكلفة الشحن</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ScatterChart data={shippingCostData} xAxisDataKey="مسافة" yAxisDataKey="تكلفة" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="mt-6">
            <Card className="v7-neu-card">
              <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-[#3498db]">
                  <LineChartIcon className="h-5 w-5 text-[#3498db]" />
                  <span>التحليل المالي</span>
                </CardTitle>
                <CardDescription className="text-[#6d6a67]">تحليل تفصيلي للأداء المالي</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <PaymentLineChart data={monthlyPaymentData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <Card className="v7-neu-card">
              <CardHeader className="border-b border-[#e6edf3] px-6 py-4">
                <CardTitle className="flex items-center gap-2 text-[#3498db]">
                  <BarChartIcon className="h-5 w-5 text-[#3498db]" />
                  <span>العملاء الجدد</span>
                </CardTitle>
                <CardDescription className="text-[#6d6a67]">عدد العملاء الجدد شهرياً</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px]">
                  <BarChart data={newCustomersData} dataKey="عملاء" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
