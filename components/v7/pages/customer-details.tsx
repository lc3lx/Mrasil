"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { routes } from "@/lib/routes"
import { ArrowRight, Edit, Mail, MapPin, Phone, ShoppingBag, Trash2 } from "lucide-react"

// بيانات وهمية للعميل
const getCustomerData = (id: string) => {
  // في الواقع، هنا ستقوم بجلب بيانات العميل من API
  return {
    id,
    name: id === "c001" ? "شركة الأمل" : id === "c002" ? "مؤسسة النور" : "أحمد محمد",
    type: id === "c001" ? "شركة متوسطة" : id === "c002" ? "شركة صغيرة" : "فرد",
    typeColor: id === "c001" ? "purple" : id === "c002" ? "blue" : "gray",
    email: id === "c001" ? "info@alamal.com" : id === "c002" ? "contact@alnoor.com" : "ahmed@example.com",
    phone: id === "c001" ? "+966 55 123 4567" : id === "c002" ? "+966 50 987 6543" : "+966 54 111 2222",
    city: id === "c001" ? "الرياض" : id === "c002" ? "جدة" : "الدمام",
    address: "حي النزهة، شارع الملك فهد، مبنى رقم 125",
    postalCode: "12345",
    contactPerson: id === "c001" || id === "c002" ? "محمد العبدالله" : "",
    taxNumber: id === "c001" || id === "c002" ? "300012345600003" : "",
    commercialRecord: id === "c001" || id === "c002" ? "1010123456" : "",
    createdAt: "2023-01-15",
    status: "نشط",
    statusColor: "green",
    totalOrders: id === "c001" ? 42 : id === "c002" ? 28 : 7,
    totalSpent: id === "c001" ? 15680 : id === "c002" ? 8450 : 1200,
    lastOrderDate: id === "c001" ? "2023-06-10" : id === "c002" ? "2023-06-05" : "2023-05-20",
  }
}

// بيانات وهمية للطلبات
const getCustomerOrders = (id: string) => {
  // في الواقع، هنا ستقوم بجلب طلبات العميل من API
  return [
    {
      id: "ORD-001",
      date: "2023-06-10",
      total: 1250,
      status: "تم التسليم",
      statusColor: "green",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2023-05-22",
      total: 850,
      status: "قيد الشحن",
      statusColor: "blue",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2023-04-15",
      total: 1600,
      status: "تم التسليم",
      statusColor: "green",
      items: 4,
    },
    {
      id: "ORD-004",
      date: "2023-03-08",
      total: 720,
      status: "تم التسليم",
      statusColor: "green",
      items: 1,
    },
    {
      id: "ORD-005",
      date: "2023-02-19",
      total: 2100,
      status: "تم التسليم",
      statusColor: "green",
      items: 5,
    },
  ]
}

// تحديث دالة getStatusColor في customer-details
const getStatusColor = (status: string) => {
  switch (status) {
    case "تم التسليم":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "قيد الشحن":
      return "bg-indigo-50 text-indigo-700 border-indigo-200"
    case "قيد المعالجة":
      return "bg-sky-50 text-sky-700 border-sky-200"
    case "ملغي":
      return "bg-rose-50 text-rose-700 border-rose-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

interface CustomerDetailsProps {
  id: string
}

export function CustomerDetails({ id }: CustomerDetailsProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useRouter()
  const customer = getCustomerData(id)
  const orders = getCustomerOrders(id)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleEdit = () => {
    router.push(routes.editCustomer(id))
  }

  const handleBack = () => {
    router.push(routes.customers)
  }

  const handleViewOrder = (orderId: string) => {
    router.push(routes.orderDetails(orderId))
  }

  return (
    <div className="space-y-6">
      <div
        className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "0.2s" }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" size="icon" className="v7-neu-button-sm" onClick={handleBack}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">رجوع</span>
            </Button>
            <div className="flex-1">
              <h3 className="text-lg md:text-xl font-bold text-[#3498db]">{customer.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="outline" className={`bg-${customer.typeColor}-100 text-${customer.typeColor}-600`}>
                  {customer.type}
                </Badge>
                <Badge variant="outline" className={`bg-${customer.statusColor}-100 text-${customer.statusColor}-600`}>
                  {customer.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
              <span>تعديل</span>
            </Button>
            <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              <span>حذف</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 md:mb-6">
            <TabsTrigger value="info" className="v7-neu-tab text-xs md:text-sm py-1.5 md:py-2">
              معلومات العميل
            </TabsTrigger>
            <TabsTrigger value="orders" className="v7-neu-tab text-xs md:text-sm py-1.5 md:py-2">
              الطلبات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4 bg-[#EFF2F7] rounded-t-lg">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-[#3498db]" />
                    معلومات الاتصال
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4 bg-[#EFF2F7]">
                  <div>
                    <p className="text-xs md:text-sm text-[#6d6a67]">البريد الإلكتروني</p>
                    <p className="font-medium text-sm md:text-base flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#3498db]" />
                      {customer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#6d6a67]">رقم الهاتف</p>
                    <p className="font-medium text-sm md:text-base flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#3498db]" />
                      {customer.phone}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4 bg-[#EFF2F7] rounded-t-lg">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#3498db]" />
                    العنوان
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4 bg-[#EFF2F7]">
                  <div>
                    <p className="text-xs md:text-sm text-[#6d6a67]">المدينة</p>
                    <p className="font-medium text-sm md:text-base">{customer.city}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#6d6a67]">العنوان التفصيلي</p>
                    <p className="font-medium text-sm md:text-base">{customer.address}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#6d6a67]">الرمز البريدي</p>
                    <p className="font-medium text-sm md:text-base">{customer.postalCode}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4 bg-[#EFF2F7] rounded-t-lg">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 text-[#3498db]" />
                    ملخص النشاط
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4 bg-[#EFF2F7]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-[#6d6a67]">إجمالي الطلبات</p>
                      <p className="font-medium text-lg md:text-xl text-[#3498db]">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#6d6a67]">إجمالي المشتريات</p>
                      <p className="font-medium text-lg md:text-xl text-[#3498db]">{customer.totalSpent} ريال</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#6d6a67]">آخر طلب</p>
                    <p className="font-medium text-sm md:text-base">{customer.lastOrderDate}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="v7-neu-card">
              <CardContent className="p-0 bg-[#EFF2F7]">
                <div className="rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#f0f4f8] border-b">
                          <th className="py-2 md:py-3 px-2 md:px-4 text-right font-medium text-xs text-[#6d6a67]">
                            رقم الطلب
                          </th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-right font-medium text-xs text-[#6d6a67]">
                            التاريخ
                          </th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-right font-medium text-xs text-[#6d6a67]">
                            عدد المنتجات
                          </th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-right font-medium text-xs text-[#6d6a67]">
                            المبلغ
                          </th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-right font-medium text-xs text-[#6d6a67]">
                            الحالة
                          </th>
                          <th className="py-2 md:py-3 px-2 md:px-4 text-center font-medium text-xs text-[#6d6a67]">
                            الإجراءات
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-[#f0f4f8]">
                            <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-[#3498db]">{order.id}</td>
                            <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{order.date}</td>
                            <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{order.items}</td>
                            <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm">{order.total} ريال</td>
                            <td className="py-2 md:py-3 px-2 md:px-4">
                              <Badge variant="outline" className={`text-xs ${getStatusColor(order.status)}`}>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-2 md:py-3 px-2 md:px-4 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="v7-neu-button-sm text-xs"
                                onClick={() => handleViewOrder(order.id)}
                              >
                                عرض التفاصيل
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
