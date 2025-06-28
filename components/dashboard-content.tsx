import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  ShoppingBag,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { ShipmentStats } from "@/components/shipment-stats"
import { ShipmentChart } from "@/components/shipment-chart"

export function DashboardContent() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">مرحباً، شركة إكسبرس</h1>
          <p className="text-muted-foreground">هذه نظرة عامة على حساب الشحن الخاص بك</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>آخر 30 يوم</span>
          </Button>
          <Button size="sm" className="primary-gradient button-hover gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>تقرير مفصل</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-hover overflow-hidden border-none bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">الرصيد الحالي</CardTitle>
            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
              <Wallet className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1">
              <div className="text-3xl font-bold">76.02</div>
              <div className="mb-1 text-sm text-muted-foreground">ريال</div>
            </div>
            <p className="text-xs text-muted-foreground">آخر معاملة منذ 3 ساعات</p>
            <Button className="mt-4 w-full button-hover yellow-gradient text-black hover:opacity-90">
              شحن المحفظة الآن
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden border-none bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">طلبات اليوم</CardTitle>
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1">
              <div className="text-3xl font-bold">0</div>
              <div className="mb-1 text-sm text-muted-foreground">طلب</div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="font-medium">جميع الطلبات:</span>
              <span>100 طلب</span>
              <span className="mr-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+12%</span>
              </span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[65%] rounded-full purple-gradient"></div>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>الهدف: 150</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden border-none bg-white shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">متوسط تكلفة الشحن</CardTitle>
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1">
              <div className="text-3xl font-bold">22.00</div>
              <div className="mb-1 text-sm text-muted-foreground">ريال</div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="font-medium">مجموع تكاليف الشحن:</span>
              <span>2,158.00 ريال</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-1">
              {[40, 65, 85, 55, 70, 60, 90].map((height, i) => (
                <div key={i} className="flex justify-center">
                  <div className="h-10 w-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="green-gradient" style={{ height: `${height}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="card-hover col-span-2 overflow-hidden border-none bg-white shadow-card">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>تحليل الشحنات</CardTitle>
              <Tabs defaultValue="weekly" className="w-[250px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="daily">يومي</TabsTrigger>
                  <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
                  <TabsTrigger value="monthly">شهري</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ShipmentChart />
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden border-none bg-white shadow-card">
          <CardHeader>
            <CardTitle>تفاصيل الشحنات</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="all">جميع الشحنات</TabsTrigger>
                <TabsTrigger value="date">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  فرز حسب التاريخ
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                <ShipmentStats />
              </TabsContent>
              <TabsContent value="date" className="m-0">
                <ShipmentStats />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover overflow-hidden border-none bg-white shadow-card">
          <CardHeader>
            <CardTitle>آخر الشحنات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border p-3 transition-all hover:border-primary/30 hover:bg-primary/5"
                >
                  <div
                    className={`rounded-full p-2 ${
                      i === 1
                        ? "bg-green-100 text-green-600"
                        : i === 2
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {i === 1 ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : i === 2 ? (
                      <Truck className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">شحنة #{1000 + i}</div>
                    <div className="text-sm text-muted-foreground">الرياض - جدة</div>
                  </div>
                  <div className="text-sm font-medium">
                    {i === 1 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        تم التوصيل
                      </span>
                    ) : i === 2 ? (
                      <span className="flex items-center text-amber-600">
                        <Truck className="mr-1 h-4 w-4" />
                        جاري التوصيل
                      </span>
                    ) : (
                      <span className="flex items-center text-blue-600">
                        <Clock className="mr-1 h-4 w-4" />
                        قيد المعالجة
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full button-hover">
              عرض جميع الشحنات
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover overflow-hidden border-none bg-white shadow-card">
          <CardHeader>
            <CardTitle>الإحصائيات الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <StatCard title="إجمالي الشحنات" value="77" change="+12%" trend="up" />
            <StatCard title="متوسط وقت التوصيل" value="1.8 يوم" change="-0.3 يوم" trend="down" />
            <StatCard title="معدل رضا العملاء" value="96%" change="+2%" trend="up" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
