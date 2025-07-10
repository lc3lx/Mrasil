"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Search, Eye, Edit, Trash2, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BarChart } from "@/components/v7/charts/bar-chart"
import { newCustomersData } from "@/lib/chart-data"
import { routes } from "@/lib/routes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// بيانات وهمية للعملاء
const customers = [
  {
    id: "c001",
    name: "شركة الأمل",
    type: "شركة متوسطة",
    typeColor: "purple",
    email: "info@alamal.com",
    phone: "+966 55 123 4567",
    city: "الرياض",
    shipments: 42,
    status: "نشط",
    statusColor: "green",
  },
  {
    id: "c002",
    name: "مؤسسة النور",
    type: "شركة صغيرة",
    typeColor: "blue",
    email: "contact@alnoor.com",
    phone: "+966 50 987 6543",
    city: "جدة",
    shipments: 28,
    status: "نشط",
    statusColor: "green",
  },
  {
    id: "c003",
    name: "أحمد محمد",
    type: "فرد",
    typeColor: "gray",
    email: "ahmed@example.com",
    phone: "+966 54 111 2222",
    city: "الدمام",
    shipments: 7,
    status: "نشط",
    statusColor: "green",
  },
  {
    id: "c004",
    name: "شركة السلام",
    type: "شركة كبيرة",
    typeColor: "yellow",
    email: "info@alsalam.com",
    phone: "+966 56 333 4444",
    city: "مكة",
    shipments: 65,
    status: "نشط",
    statusColor: "green",
  },
  {
    id: "c005",
    name: "سارة علي",
    type: "فرد",
    typeColor: "gray",
    email: "sara@example.com",
    phone: "+966 59 555 6666",
    city: "الرياض",
    shipments: 3,
    status: "غير نشط",
    statusColor: "amber",
  },
  {
    id: "c006",
    name: "مؤسسة الفجر",
    type: "شركة صغيرة",
    typeColor: "blue",
    email: "info@alfajr.com",
    phone: "+966 58 777 8888",
    city: "المدينة",
    shipments: 19,
    status: "نشط",
    statusColor: "green",
  },
  {
    id: "c007",
    name: "خالد العمري",
    type: "فرد",
    typeColor: "gray",
    email: "khalid@example.com",
    phone: "+966 53 999 0000",
    city: "تبوك",
    shipments: 5,
    status: "نشط",
    statusColor: "green",
  },
]

// بيانات أكثر العملاء طلباً
const topCustomers = [
  { id: "c004", name: "شركة السلام", orders: 120, total: 45600, lastOrder: "2023-05-15", phone: "+966 56 333 4444" },
  { id: "c001", name: "شركة الأمل", orders: 98, total: 32400, lastOrder: "2023-05-18", phone: "+966 55 123 4567" },
  { id: "c002", name: "مؤسسة النور", orders: 76, total: 28900, lastOrder: "2023-05-10", phone: "+966 50 987 6543" },
  { id: "c008", name: "مؤسسة الريادة", orders: 65, total: 24500, lastOrder: "2023-05-12", phone: "+966 58 111 2222" },
  { id: "c009", name: "شركة التقدم", orders: 54, total: 19800, lastOrder: "2023-05-14", phone: "+966 59 333 4444" },
  { id: "c006", name: "مؤسسة الفجر", orders: 47, total: 18200, lastOrder: "2023-05-16", phone: "+966 58 777 8888" },
  { id: "c010", name: "محمد العتيبي", orders: 38, total: 14500, lastOrder: "2023-05-11", phone: "+966 50 555 6666" },
  { id: "c011", name: "شركة المستقبل", orders: 32, total: 12800, lastOrder: "2023-05-17", phone: "+966 55 999 0000" },
  { id: "c012", name: "فاطمة الزهراني", orders: 28, total: 10200, lastOrder: "2023-05-13", phone: "+966 54 444 5555" },
  { id: "c003", name: "أحمد محمد", orders: 25, total: 9500, lastOrder: "2023-05-09", phone: "+966 54 111 2222" },
]

// دالة لتحديد لون البادج حسب نوع العميل
const getTypeColor = (type: string) => {
  switch (type) {
    case "شركة كبيرة":
      return "bg-yellow-100 text-yellow-600"
    case "شركة متوسطة":
      return "bg-purple-100 text-purple-600"
    case "شركة صغيرة":
      return "bg-blue-100 text-blue-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

// دالة لتحديد لون البادج حسب حالة العميل
const getStatusColor = (status: string) => {
  switch (status) {
    case "نشط":
      return "bg-green-100 text-green-600"
    case "غير نشط":
      return "bg-amber-100 text-amber-600"
    default:
      return "bg-gray-100 text-gray-600"
  }
}

export function CustomersContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [customerType, setCustomerType] = useState("all")
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // تصفية العملاء حسب البحث ونوع العميل
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.includes(searchTerm) ||
      customer.email.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.city.includes(searchTerm)

    const matchesType =
      customerType === "all" ||
      customer.type.includes(
        customerType === "individual"
          ? "فرد"
          : customerType === "small"
            ? "شركة صغيرة"
            : customerType === "medium"
              ? "شركة متوسطة"
              : customerType === "large"
                ? "شركة كبيرة"
                : "",
      )

    return matchesSearch && matchesType
  })

  // التنقل إلى صفحة تفاصيل العميل
  const viewCustomerDetails = (id: string) => {
    router.push(routes.customerDetails(id))
  }

  // التنقل إلى صفحة تعديل العميل
  const editCustomer = (id: string) => {
    router.push(routes.editCustomer(id))
  }

  // التنقل إلى صفحة إضافة عميل جديد
  const addNewCustomer = () => {
    router.push(routes.addCustomer)
  }

  // التنقل إلى صفحة إنشاء شحنة جديدة
  const createShipment = (customerId: string) => {
    router.push(`/create-shipment?customer=${customerId}`)
  }

  // حساب النسبة المئوية للطلبات مقارنة بأعلى عميل
  const getOrderPercentage = (orders: number) => {
    const maxOrders = topCustomers[0].orders
    return (orders / maxOrders) * 100
  }

  return (
    <div className="space-y-6">
      <div
        className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "0.2s" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#3498db]">العملاء</h3>
            <p className="text-sm text-[#6d6a67]">إدارة العملاء والشركات</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1">
              <Download className="h-4 w-4" />
              <span>تصدير</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="v7-neu-card-sm">
            <CardHeader className="pb-2 bg-[#EFF2F7] pt-4 px-4 rounded-t-lg">
              <CardTitle className="text-lg">إجمالي العملاء</CardTitle>
            </CardHeader>
            <CardContent className="bg-[#EFF2F7] p-4 rounded-b-lg">
              <div className="text-3xl font-bold text-[#3498db]">280</div>
              <div className="text-xs text-green-600 mt-1">+32 عميل جديد هذا الشهر</div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card-sm">
            <CardHeader className="pb-2 bg-[#EFF2F7] pt-4 px-4 rounded-t-lg">
              <CardTitle className="text-lg">العملاء النشطين</CardTitle>
            </CardHeader>
            <CardContent className="bg-[#EFF2F7] p-4 rounded-b-lg">
              <div className="text-3xl font-bold text-[#3498db]">215</div>
              <div className="text-xs text-[#6d6a67] mt-1">76.8% من إجمالي العملاء</div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card-sm">
            <CardHeader className="pb-2 bg-[#EFF2F7] pt-4 px-4 rounded-t-lg">
              <CardTitle className="text-lg">متوسط الشحنات</CardTitle>
            </CardHeader>
            <CardContent className="bg-[#EFF2F7] p-4 rounded-b-lg">
              <div className="text-3xl font-bold text-[#3498db]">3.5</div>
              <div className="text-xs text-[#6d6a67] mt-1">شحنة لكل عميل شهرياً</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1 mb-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>العملاء الجدد</CardTitle>
              <CardDescription>عدد العملاء الجدد شهرياً</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={newCustomersData} dataKey="عملاء" />
            </CardContent>
          </Card>
        </div>

        {/* قسم أكثر عشرة عملاء طلباً */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#3498db]">اكثر العملاء طلباً</h3>
              <p className="text-sm text-[#6d6a67]">العملاء الأكثر نشاطاً</p>
            </div>
          </div>

          <div className="rounded-lg border v7-neu-card-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f0f4f8] border-b">
                    <th className="py-3 px-4 text-right font-bold text-black">#</th>
                    <th className="py-3 px-4 text-right font-bold text-black">اسم العميل</th>
                    <th className="py-3 px-4 text-right font-bold text-black">عدد الطلبات</th>
                    <th className="py-3 px-4 text-right font-bold text-black">إجمالي المبيعات</th>
                    <th className="py-3 px-4 text-right font-bold text-black">آخر طلب</th>
                    <th className="py-3 px-4 text-right font-bold text-black">رقم الجوال</th>
                    <th className="py-3 px-4 text-center font-bold text-black">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={customer.id} className="border-b hover:bg-[#f0f4f8]">
                      <td className="py-3 px-4 font-medium">{index + 1}</td>
                      <td className="py-3 px-4 text-[#3498db] font-medium">{customer.name}</td>
                      <td className="py-3 px-4">{customer.orders}</td>
                      <td className="py-3 px-4">{customer.total.toLocaleString()} ريال</td>
                      <td className="py-3 px-4">{new Date(customer.lastOrder).toLocaleDateString("ar-SA")}</td>
                      <td className="py-3 px-4">{customer.phone}</td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 bg-[#3498db] hover:bg-[#2980b9] text-white"
                          onClick={() => createShipment(customer.id)}
                        >
                          <Package className="h-4 w-4 ml-1" />
                          <span>إنشاء شحنة</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#3498db]">جميع العملاء</h3>
              <p className="text-sm text-[#6d6a67]">قائمة العملاء والشركات</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث في العملاء..."
                className="v7-neu-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all" onValueChange={(value) => setCustomerType(value)}>
                <SelectTrigger className="w-[200px] v7-neu-input bg-[#3498db] text-[#294D8B] font-medium border-2 border-[#3498db] shadow-md hover:bg-[#2980b9] transition-colors relative pl-8">
                  <Filter className="h-4 w-4 absolute left-2.5" />
                  <SelectValue placeholder="نوع العميل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العملاء</SelectItem>
                  <SelectItem value="individual">أفراد</SelectItem>
                  <SelectItem value="small">شركات صغيرة</SelectItem>
                  <SelectItem value="medium">شركات متوسطة</SelectItem>
                  <SelectItem value="large">شركات كبيرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border v7-neu-card-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f0f4f8] border-b">
                    <th className="py-3 px-4 text-right font-bold text-black">اسم العميل</th>
                    <th className="py-3 px-4 text-right font-bold text-black">البريد الإلكتروني</th>
                    <th className="py-3 px-4 text-right font-bold text-black">رقم الهاتف</th>
                    <th className="py-3 px-4 text-right font-bold text-black">المدينة</th>
                    <th className="py-3 px-4 text-right font-bold text-black">عدد الشحنات</th>
                    <th className="py-3 px-4 text-right font-bold text-black">الحالة</th>
                    <th className="py-3 px-4 text-center font-bold text-black">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-[#f0f4f8]">
                      <td className="py-3 px-4 text-[#3498db]">{customer.name}</td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">{customer.phone}</td>
                      <td className="py-3 px-4">{customer.city}</td>
                      <td className="py-3 px-4">{customer.shipments}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 v7-neu-icon-button"
                            onClick={() => viewCustomerDetails(customer.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">عرض التفاصيل</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 v7-neu-icon-button"
                            onClick={() => editCustomer(customer.id)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">تعديل</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 v7-neu-icon-button text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>خيارات العميل</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>عرض التفاصيل</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>تعديل</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>حذف</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
