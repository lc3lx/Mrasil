"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import moment from 'moment'
import 'moment/locale/ar-sa'
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Truck,
  ShoppingBag,
  Edit,
  Plus,
  ArrowUpDown,
  CreditCard,
  Send,
  X,
  ChevronDown,
  Printer,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetAllOrdersQuery, useDeleteOrderMutation } from "../api/ordersApi"
import { ConfirmModal } from "@/components/ui/confirm-modal"

interface Order {
  _id: string
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string
  city: string
  district: string
  country: string
  createdAt: string
  status: string
}

export default function OrdersContent() {
  const router = useRouter()
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const { data, isLoading } = useGetAllOrdersQuery()
  const [deleteOrder] = useDeleteOrderMutation()
  
  // Add state for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)

  // Safely extract orders from the response
  const orders = data?.data || []
  const totalOrders = orders.length

  if (isLoading) {
    return (
      <V7Layout>
        <V7Content title="الطلبات" description="إدارة ومتابعة جميع طلباتك">
          <div className="w-full h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
            </div>
          </div>
        </V7Content>
      </V7Layout>
    )
  }

  // وظيفة تحديد/إلغاء تحديد كل الطلبات
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((order) => order._id))
    }
  }

  // وظيفة تحديد/إلغاء تحديد طلب واحد
  const toggleSelectOrder = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
    } else {
      setSelectedOrders([...selectedOrders, orderId])
    }
  }

  // Función para manejar acciones en grupo
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "process":
        alert(`تمت معالجة ${selectedOrders.length} طلب`)
        break
      case "ship":
        alert(`تم شحن ${selectedOrders.length} طلب`)
        break
      case "print":
        alert(`تم طباعة فواتير ${selectedOrders.length} طلب`)
        break
      case "export":
        alert(`تم تصدير بيانات ${selectedOrders.length} طلب`)
        break
      case "cancel":
        alert(`تم إلغاء ${selectedOrders.length} طلب`)
        // Aquí puedes implementar la lógica real para cancelar los pedidos
        // setSelectedOrders([]);
        break
      default:
        break
    }
  }

  // Handle delete button click
  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId)
    setDeleteModalOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete).unwrap()
        setDeleteModalOpen(false)
        setOrderToDelete(null)
      } catch (error) {
        console.error('Error deleting order:', error)
      }
    }
  }

  return (
    <V7Layout>
      <V7Content title="الطلبات" description="إدارة ومتابعة جميع طلباتك">
        {/* بطاقات الإحصائيات */}
        <div className="w-full px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 v7-fade-in">
            <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#6d6a67] mb-1">إجمالي الطلبات</p>
                  <h3 className="text-2xl font-bold text-[#3498db]">{totalOrders}</h3>
                </div>
                <div className="v7-neu-icon-lg ml-4">
                  <ShoppingBag className="h-6 w-6 text-[#3498db]" />
                </div>
              </div>
            </div>

            <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#6d6a67] mb-1">طلبات مكتملة</p>
                  <h3 className="text-2xl font-bold text-[#2ecc71]">187</h3>
                </div>
                <div className="v7-neu-icon-lg ml-4">
                  <CheckCircle className="h-6 w-6 text-[#2ecc71]" />
                </div>
              </div>
            </div>

            <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#6d6a67] mb-1">طلبات قيد التنفيذ</p>
                  <h3 className="text-2xl font-bold text-[#294D8B]">42</h3>
                </div>
                <div className="v7-neu-icon-lg ml-4">
                  <Clock className="h-6 w-6 text-[#294D8B]" />
                </div>
              </div>
            </div>

            <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#6d6a67] mb-1">طلبات ملغاة</p>
                  <h3 className="text-2xl font-bold text-[#e74c3c]">19</h3>
                </div>
                <div className="v7-neu-icon-lg ml-4">
                  <XCircle className="h-6 w-6 text-[#e74c3c]" />
                </div>
              </div>
            </div>
          </div>
        </div>

       {/* زر إنشاء طلب جديد */}
        <div className="flex justify-end mb-6">
          <Button 
            className="v7-neu-button-accent"
            onClick={() => router.push('/orders/create')}
          >
            <Plus className="h-4 w-4 ml-2" />
            إنشاء طلب جديد
          </Button>
        </div>

        {/* تبويبات الطلبات */}
        <div className="v7-neu-card overflow-hidden v7-fade-in">
          <Tabs defaultValue="all" className="w-full">
            {/* شريط البحث والفلترة */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b">
              <TabsList className="v7-neu-tabs">
                <TabsTrigger value="all" className="v7-neu-tab">
                  جميع الطلبات
                </TabsTrigger>
                <TabsTrigger value="active" className="v7-neu-tab">
                  قيد التنفيذ
                </TabsTrigger>
                <TabsTrigger value="completed" className="v7-neu-tab">
                  مكتملة
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="v7-neu-tab">
                  ملغاة
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative v7-neu-input-container flex-1 min-w-[200px]">
                  <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />
                  <Input placeholder="البحث عن طلب..." className="v7-neu-input w-full pr-12" />
                </div>

                {selectedOrders.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="v7-neu-button-sm" disabled={selectedOrders.length === 0}>
                        <span className="text-xs ml-1">({selectedOrders.length})</span>
                        إجراءات جماعية <ChevronDown className="mr-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#E4E9F2] shadow-sm">
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("process")}
                        className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                      >
                        <CheckCircle className="h-4 w-4 ml-2 text-green-600" />
                        <span>معالجة المحدد</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("ship")}
                        className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                      >
                        <Truck className="h-4 w-4 ml-2 text-blue-600" />
                        <span>شحن المحدد</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("print")}
                        className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                      >
                        <Printer className="h-4 w-4 ml-2 text-purple-600" />
                        <span>طباعة الفواتير</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("export")}
                        className="text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                      >
                        <Download className="h-4 w-4 ml-2 text-blue-600" />
                        <span>تصدير المحدد</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBulkAction("cancel")}
                        className="text-red-600 hover:bg-[#e4e9f2] cursor-pointer"
                      >
                        <XCircle className="h-4 w-4 ml-2 text-red-600" />
                        <span>إلغاء المحدد</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="v7-neu-button-sm hover:bg-[#e4e9f2] transition-colors duration-200">
                      <Filter className="h-4 w-4 md:mr-2" />
                      <span className="sr-only md:not-sr-only">تصفية</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="v7-neu-dropdown min-w-[180px] border border-[#E4E9F2] shadow-lg bg-white rounded-lg">
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">جميع الحالات</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">مكتملة</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">قيد التنفيذ</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">ملغاة</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="v7-neu-button-sm hover:bg-[#e4e9f2] transition-colors duration-200">
                      <ArrowUpDown className="h-4 w-4 md:mr-2" />
                      <span className="sr-only md:not-sr-only">ترتيب</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="v7-neu-dropdown min-w-[180px] border border-[#E4E9F2] shadow-lg bg-white rounded-lg">
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">الأحدث أولاً</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">الأقدم أولاً</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">حسب السعر</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* محتوى التبويبات */}
            <TabsContent value="all" className="mt-0">
              <div className="overflow-x-auto whitespace-nowrap">
                <table className="w-full text-sm border-separate border-spacing-0">
                  <thead>
                    <tr className="v7-neu-table-header">
                      <th className="p-2 sticky left-0 bg-[#f8fafc] z-10">
                        <Checkbox
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onCheckedChange={toggleSelectAll}
                          aria-label="تحديد الكل"
                          className="v7-neu-checkbox"
                        />
                      </th>
                      <th className="p-2 px-4 whitespace-nowrap">رقم الطلب</th>
                      <th className="p-2 px-4 whitespace-nowrap">العميل</th>
                      <th className="p-2 px-4 whitespace-nowrap">المدينة/الدولة</th>
                      <th className="p-2 px-4 whitespace-nowrap">رقم الهاتف</th>
                      <th className="p-2 px-4 whitespace-nowrap">البريد الإلكتروني</th>
                      <th className="p-2 px-4 whitespace-nowrap">العنوان</th>
                      <th className="p-2 px-4 whitespace-nowrap">طريقة الدفع</th>
                      <th className="p-2 px-4 whitespace-nowrap">التاريخ</th>
                      <th className="p-2 px-4 whitespace-nowrap">حالة الطلب</th>
                      <th className="p-2 px-4 whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="v7-neu-table-row">
                        <td className="p-2 sticky left-0 bg-white z-10">
                          <Checkbox
                            checked={selectedOrders.includes(order._id)}
                            onCheckedChange={() => toggleSelectOrder(order._id)}
                            aria-label={`تحديد الطلب ${order._id}`}
                            className="v7-neu-checkbox"
                          />
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap">{order._id}</td>
                        <td className="p-2 px-4 whitespace-nowrap">{order.clientName}</td>
                        <td className="p-2 px-4 whitespace-nowrap">{`${order.city}، ${order.country}`}</td>
                        <td className="p-2 px-4 whitespace-nowrap">{order.clientPhone}</td>
                        <td className="p-2 px-4 whitespace-nowrap">{order.clientEmail}</td>
                        <td className="p-2 px-4 whitespace-nowrap">{order.clientAddress}</td>
                        <td className="p-2 px-4 whitespace-nowrap">{order.district}</td>
                        <td className="p-2 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-[#6d6a67] flex-shrink-0" />
                            <span>{moment(order.createdAt).locale('ar-sa').format('DD MMM YYYY')}</span>
                          </div>
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap">
                          <OrderStatusBadge status={order.status || 'pending'} />
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="v7-neu-button-sm bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs"
                              disabled={order.status === "completed" || order.status === "cancelled"}
                            >
                              <Send className="h-3 w-3 ml-1" />
                              اشحن الآن
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="v7-neu-button-sm bg-rose-50 text-red-600 border-rose-200 hover:bg-rose-100 text-xs"
                              disabled={order.status === "completed" || order.status === "cancelled"}
                              onClick={() => handleDeleteClick(order._id)}
                            >
                              <X className="h-3 w-3 ml-1 text-red-600" />
                              إلغاء
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ترقيم الصفحات */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
                <div className="text-sm text-[#6d6a67]">
                  عرض <span className="font-medium">1</span> إلى <span className="font-medium">10</span> من أصل{" "}
                  <span className="font-medium">248</span> طلب
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="v7-neu-button-active">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200">
                    3
                  </Button>
                  <Button variant="outline" size="icon" className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="active" className="mt-0 p-6 text-center">
              <div className="v7-neu-icon-xl mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#f39c12]" />
              </div>
              <h3 className="text-lg font-bold mb-2">الطلبات قيد التنفيذ</h3>
              <p className="text-[#6d6a67] mb-4">يمكنك متابعة جميع الطلبات قيد التنفيذ هنا</p>
              <Button className="v7-neu-button-accent">عرض الطلبات قيد التنفيذ</Button>
            </TabsContent>

            <TabsContent value="completed" className="mt-0 p-6 text-center">
              <div className="v7-neu-icon-xl mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#2ecc71]" />
              </div>
              <h3 className="text-lg font-bold mb-2">الطلبات المكتملة</h3>
              <p className="text-[#6d6a67] mb-4">يمكنك عرض سجل الطلبات المكتملة هنا</p>
              <Button className="v7-neu-button-accent">عرض الطلبات المكتملة</Button>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-0 p-6 text-center">
              <div className="v7-neu-icon-xl mx-auto mb-4">
                <XCircle className="h-8 w-8 text-[#e74c3c]" />
              </div>
              <h3 className="text-lg font-bold mb-2">الطلبات الملغاة</h3>
              <p className="text-[#6d6a67] mb-4">يمكنك عرض سجل الطلبات الملغاة هنا</p>
              <Button className="v7-neu-button-accent">عرض الطلبات الملغاة</Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add confirmation modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setOrderToDelete(null)
          }}
          onConfirm={handleDeleteConfirm}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
        />
      </V7Content>
    </V7Layout>
  )
}

// تحديث دالة OrderStatusBadge لتستخدم نظام الألوان الموحد
function OrderStatusBadge({ status = 'pending' }: { status?: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="v7-neu-badge-success bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 ml-1" />
          مكتمل
        </Badge>
      )
    case "processing":
      return (
        <Badge className="v7-neu-badge-warning bg-sky-50 text-sky-700 border border-sky-200">
          <Clock className="h-3 w-3 ml-1" />
          قيد التنفيذ
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="v7-neu-badge-error bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3 ml-1" />
          ملغي
        </Badge>
      )
    case "pending":
    default:
      return (
        <Badge className="v7-neu-badge-info bg-indigo-50 text-indigo-700 border border-indigo-200">
          <AlertCircle className="h-3 w-3 ml-1" />
          معلق
        </Badge>
      )
  }
}

// تحديث دالة ShippingStatusBadge لتستخدم نظام الألوان الموحد
function ShippingStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "delivered":
      return (
        <Badge className="v7-neu-badge-success bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 ml-1" />
          تم التوصيل
        </Badge>
      )
    case "shipped":
      return (
        <Badge className="v7-neu-badge-info bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Truck className="h-3 w-3 ml-1" />
          تم الشحن
        </Badge>
      )
    case "preparing":
      return (
        <Badge className="v7-neu-badge-warning bg-sky-50 text-sky-700 border border-sky-200">
          <Package className="h-3 w-3 ml-1" />
          قيد التجهيز
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="v7-neu-badge-error bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3 ml-1" />
          ملغي
        </Badge>
      )
    default:
      return <Badge className="bg-slate-50 text-slate-700 border border-slate-200">{status}</Badge>
  }
} 