import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CheckCircle, Clock, MapPin, Plus, ArrowRight, Search, Calendar } from "lucide-react"
import { ShipmentTracker } from "@/components/shipment-tracker"
import { QuickActions } from "@/components/quick-actions"
import { ShipmentStatus } from "@/components/shipment-status"
import { Input } from "@/components/ui/input"

export function CustomerContent() {
  return (
    <div className="space-y-8 pb-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">مرحباً، أحمد</h1>
            <p className="text-muted-foreground">مرحباً بك في لوحة تحكم شيب إكسبرس</p>
          </div>
          <Button className="primary-gradient button-hover gap-2 rounded-xl py-6 text-lg">
            <Plus className="h-5 w-5" />
            <span>إنشاء شحنة جديدة</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ShipmentStatus title="تم التوصيل" count={76} icon={CheckCircle} color="green" />
          <ShipmentStatus title="جاري التوصيل" count={0} icon={Truck} color="amber" />
          <ShipmentStatus title="جاهز للشحن" count={1} icon={Package} color="blue" />
          <ShipmentStatus title="قيد المعالجة" count={0} icon={Clock} color="purple" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-accent pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">شحناتي النشطة</CardTitle>
                  <CardDescription>متابعة شحناتك الحالية</CardDescription>
                </div>
                <Button variant="ghost" className="gap-1 text-primary">
                  <span>عرض الكل</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <div className="mb-4 flex items-center gap-2 rounded-lg border bg-background p-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="البحث برقم الشحنة..."
                    className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-4">
                  {[
                    { id: 1001, from: "الرياض", to: "جدة", status: "delivered", date: "15 أبريل 2025" },
                    { id: 1002, from: "الدمام", to: "الرياض", status: "transit", date: "16 أبريل 2025" },
                    { id: 1003, from: "جدة", to: "مكة", status: "processing", date: "17 أبريل 2025" },
                  ].map((shipment) => (
                    <div
                      key={shipment.id}
                      className="rounded-xl border bg-white p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-full p-2 ${
                              shipment.status === "delivered"
                                ? "bg-green-100 text-green-600"
                                : shipment.status === "transit"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {shipment.status === "delivered" ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : shipment.status === "transit" ? (
                              <Truck className="h-5 w-5" />
                            ) : (
                              <Clock className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">شحنة #{shipment.id}</div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{shipment.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{shipment.from}</span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{shipment.to}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-lg">
                          تفاصيل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <QuickActions />

          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-accent pb-4">
              <CardTitle className="text-xl">تتبع شحنة</CardTitle>
              <CardDescription>أدخل رقم الشحنة لتتبع حالتها</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ShipmentTracker />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="bg-accent pb-4">
          <CardTitle className="text-xl">أسعار الشحن</CardTitle>
          <CardDescription>تعرف على أسعار الشحن بين المدن</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="domestic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="domestic">داخل المملكة</TabsTrigger>
              <TabsTrigger value="international">دولي</TabsTrigger>
            </TabsList>
            <TabsContent value="domestic" className="mt-4">
              <div className="rounded-xl border">
                <div className="grid grid-cols-3 gap-4 border-b bg-muted p-3 font-medium">
                  <div>من</div>
                  <div>إلى</div>
                  <div>السعر</div>
                </div>
                <div className="divide-y">
                  {[
                    { from: "الرياض", to: "جدة", price: "25 ريال" },
                    { from: "الرياض", to: "الدمام", price: "20 ريال" },
                    { from: "جدة", to: "مكة", price: "15 ريال" },
                    { from: "الدمام", to: "الخبر", price: "10 ريال" },
                  ].map((route, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 p-3">
                      <div>{route.from}</div>
                      <div>{route.to}</div>
                      <div className="font-medium text-primary">{route.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                عرض جميع الأسعار
              </Button>
            </TabsContent>
            <TabsContent value="international" className="mt-4">
              <div className="rounded-xl border">
                <div className="grid grid-cols-3 gap-4 border-b bg-muted p-3 font-medium">
                  <div>من</div>
                  <div>إلى</div>
                  <div>السعر</div>
                </div>
                <div className="divide-y">
                  {[
                    { from: "السعودية", to: "الإمارات", price: "50 ريال" },
                    { from: "السعودية", to: "البحرين", price: "45 ريال" },
                    { from: "السعودية", to: "مصر", price: "120 ريال" },
                    { from: "السعودية", to: "الأردن", price: "100 ريال" },
                  ].map((route, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4 p-3">
                      <div>{route.from}</div>
                      <div>{route.to}</div>
                      <div className="font-medium text-primary">{route.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                عرض جميع الأسعار
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
