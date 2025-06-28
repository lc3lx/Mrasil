"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Download,
  Filter,
  Search,
  CheckSquare,
  Printer,
  Tag,
  Trash,
  ChevronDown,
  ShoppingCart,
  Clock,
  Store,
  CreditCard,
  Wallet,
  BarChart4,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

// تحديث ألوان الحالات في shipment-history-content
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "transit":
      return "bg-indigo-50 text-indigo-700 border-indigo-200"
    case "processing":
      return "bg-sky-50 text-sky-700 border-sky-200"
    case "cancelled":
      return "bg-rose-50 text-rose-700 border-rose-200"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200"
  }
}

// دالة للحصول على تفاصيل مصدر الطلب
const getSourceDetails = (source: string) => {
  switch (source) {
    case "متجر إلكتروني":
      return { icon: <ShoppingCart className="h-4 w-4 text-purple-600" />, color: "text-purple-600" }
    case "يدوي":
      return { icon: <Clock className="h-4 w-4 text-red-600" />, color: "text-red-600" }
    case "تطبيق جوال":
      return { icon: <Store className="h-4 w-4 text-blue-600" />, color: "text-blue-600" }
    case "نقطة بيع":
      return { icon: <BarChart4 className="h-4 w-4 text-emerald-600" />, color: "text-emerald-600" }
    default:
      return { icon: <ShoppingCart className="h-4 w-4 text-purple-600" />, color: "text-purple-600" }
  }
}

// دالة للحصول على تفاصيل طريقة الدفع
const getPaymentDetails = (method: string) => {
  switch (method) {
    case "بطاقة ائتمان":
      return { icon: <CreditCard className="h-4 w-4 text-blue-600" />, color: "text-blue-600" }
    case "الدفع عند الاستلام":
      return { icon: <Wallet className="h-4 w-4 text-amber-600" />, color: "text-amber-600" }
    case "تحويل بنكي":
      return { icon: <BarChart4 className="h-4 w-4 text-green-600" />, color: "text-green-600" }
    case "محفظة إلكترونية":
      return { icon: <CreditCard className="h-4 w-4 text-purple-600" />, color: "text-purple-600" }
    default:
      return { icon: <CreditCard className="h-4 w-4 text-blue-600" />, color: "text-blue-600" }
  }
}

// قائمة مصادر الطلبات المتاحة
const availableSources = [
  { id: "all", name: "جميع المصادر" },
  { id: "متجر إلكتروني", name: "متجر إلكتروني", icon: getSourceDetails("متجر إلكتروني").icon },
  { id: "يدوي", name: "يدوي", icon: getSourceDetails("يدوي").icon },
  { id: "تطبيق جوال", name: "تطبيق جوال", icon: getSourceDetails("تطبيق جوال").icon },
  { id: "نقطة بيع", name: "نقطة بيع", icon: getSourceDetails("نقطة بيع").icon },
]

// بيانات الشحنات
const shipmentData = [
  {
    id: "SHP-5678",
    date: "15 أبريل 2023",
    sender: "شركة الأمل",
    receiver: "أحمد محمد",
    route: "الرياض - جدة",
    carrier: "أرامكس",
    carrierLogo: "/carriers/aramex-logo.png",
    source: "متجر إلكتروني",
    payment: "بطاقة ائتمان",
    amount: "120.00 ريال",
    status: "delivered",
  },
  {
    id: "SHP-5677",
    date: "14 أبريل 2023",
    sender: "مؤسسة النور",
    receiver: "سارة علي",
    route: "جدة - الرياض",
    carrier: "دي إتش إل",
    carrierLogo: "/carriers/dhl-logo.png",
    source: "تطبيق جوال",
    payment: "محفظة إلكترونية",
    amount: "95.00 ريال",
    status: "transit",
  },
  {
    id: "SHP-5676",
    date: "12 أبريل 2023",
    sender: "شركة السلام",
    receiver: "محمد أحمد",
    route: "الدمام - الرياض",
    carrier: "فيديكس",
    carrierLogo: "/carriers/fedex-logo.png",
    source: "يدوي",
    payment: "تحويل بنكي",
    amount: "150.00 ريال",
    status: "processing",
  },
  {
    id: "SHP-5675",
    date: "10 أبريل 2023",
    sender: "أحمد محمد",
    receiver: "شركة الأمل",
    route: "الرياض - مكة",
    carrier: "يو بي إس",
    carrierLogo: "/carriers/ups-logo.png",
    source: "متجر إلكتروني",
    payment: "الدفع عند الاستلام",
    amount: "110.00 ريال",
    status: "delivered",
  },
  {
    id: "SHP-5674",
    date: "8 أبريل 2023",
    sender: "سارة علي",
    receiver: "مؤسسة النور",
    route: "جدة - الدمام",
    carrier: "أرامكس",
    carrierLogo: "/carriers/aramex-logo.png",
    source: "نقطة بيع",
    payment: "بطاقة ائتمان",
    amount: "180.00 ريال",
    status: "delivered",
  },
  {
    id: "SHP-5673",
    date: "5 أبريل 2023",
    sender: "شركة السلام",
    receiver: "أحمد محمد",
    route: "مكة - المدينة",
    carrier: "آي مايل",
    carrierLogo: "/carriers/imile-logo.png",
    source: "تطبيق جوال",
    payment: "الدفع عند الاستلام",
    amount: "130.00 ريال",
    status: "cancelled",
  },
]

export function ShipmentHistoryContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // تحديث الفلاتر النشطة عند تغيير أي فلتر
  useEffect(() => {
    const filters = []
    if (filterStatus !== "all") filters.push(`الحالة: ${getStatusText(filterStatus)}`)
    if (filterSource !== "all") filters.push(`المصدر: ${filterSource}`)
    setActiveFilters(filters)
  }, [filterStatus, filterSource])

  // دالة لتحويل حالة الشحنة إلى نص عربي
  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التوصيل"
      case "transit":
        return "جاري التوصيل"
      case "processing":
        return "قيد المعالجة"
      case "cancelled":
        return "ملغية"
      default:
        return "غير معروف"
    }
  }

  // دالة لمعالجة تحديد/إلغاء تحديد جميع الشحنات
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setSelectAll(isChecked)

    if (isChecked) {
      // تحديد جميع الشحنات المعروضة بعد التصفية
      setSelectedShipments(filteredShipments.map((shipment) => shipment.id))
    } else {
      // إلغاء تحديد جميع الشحنات
      setSelectedShipments([])
    }
  }

  // دالة لمعالجة تحديد/إلغاء تحديد شحنة واحدة
  const handleSelectShipment = (shipmentId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedShipments((prev) => [...prev, shipmentId])
    } else {
      setSelectedShipments((prev) => prev.filter((id) => id !== shipmentId))
    }
  }

  // إزالة فلتر معين
  const removeFilter = (filter: string) => {
    if (filter.startsWith("الحالة:")) {
      setFilterStatus("all")
    } else if (filter.startsWith("المصدر:")) {
      setFilterSource("all")
    }
  }

  // إزالة جميع الفلاتر
  const clearAllFilters = () => {
    setFilterStatus("all")
    setFilterSource("all")
    setSearchQuery("")
  }

  // تصفية الشحنات بناءً على الفلاتر النشطة
  const filteredShipments = shipmentData.filter((shipment) => {
    // تصفية حسب الحالة
    if (filterStatus !== "all" && shipment.status !== filterStatus) return false

    // تصفية حسب مصدر الطلب
    if (filterSource !== "all" && shipment.source !== filterSource) return false

    // تصفية حسب البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.sender.toLowerCase().includes(query) ||
        shipment.receiver.toLowerCase().includes(query) ||
        shipment.route.toLowerCase().includes(query) ||
        shipment.carrier.toLowerCase().includes(query) ||
        shipment.source.toLowerCase().includes(query) ||
        shipment.payment.toLowerCase().includes(query)
      )
    }

    return true
  })

  // دوال معالجة الإجراءات الجماعية
  const handleBulkPrint = () => {
    alert(`طباعة ${selectedShipments.length} شحنة: ${selectedShipments.join(", ")}`)
  }

  const handleBulkExport = () => {
    alert(`تصدير ${selectedShipments.length} شحنة: ${selectedShipments.join(", ")}`)
  }

  const handleBulkChangeStatus = (status: string) => {
    alert(`تغيير حالة ${selectedShipments.length} شحنة إلى "${status}": ${selectedShipments.join(", ")}`)
  }

  const handleBulkDelete = () => {
    if (confirm(`هل أنت متأكد من حذف ${selectedShipments.length} شحنة؟`)) {
      alert(`تم حذف الشحنات: ${selectedShipments.join(", ")}`)
      setSelectedShipments([])
      setSelectAll(false)
    }
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="space-y-6">
      {/* بطاقة سجل الشحنات */}
      <div
        className={`v7-neu-card p-6 rounded-xl v7-fade-in w-full ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "0.2s" }}
      >
        {/* العنوان وزر التصدير */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#294D8B]">سجل الشحنات</h3>
            <p className="text-sm text-[#6d6a67]">عرض وتصفية سجل الشحنات</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1">
              <Download className="h-4 w-4" />
              <span>تصدير</span>
            </Button>
          </div>
        </div>

        {/* قسم البحث والتصفية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* البحث */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث في الشحنات..."
              className="v7-neu-input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* أزرار التصفية والإجراءات */}
          <div className="flex flex-wrap gap-2 items-center justify-end">
            {/* زر التصفية */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="v7-neu-button-sm gap-1">
                  <Filter className="h-4 w-4 ml-1" />
                  <span>تصفية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#EFF2F7]">
                <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                  <DropdownMenuRadioItem value="all">جميع الحالات</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="delivered">تم التوصيل</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="transit">قيد التوصيل</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="processing">قيد المعالجة</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="cancelled">ملغية</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>تصفية حسب مصدر الطلب</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={filterSource} onValueChange={setFilterSource}>
                  {availableSources.map((source) => (
                    <DropdownMenuRadioItem key={source.id} value={source.id} className="flex items-center gap-2">
                      {source.icon && <span>{source.icon}</span>}
                      <span>{source.name}</span>
                      {source.id !== "all" && (
                        <span className="mr-auto text-xs text-gray-500">
                          ({shipmentData.filter((s) => s.source === source.id).length})
                        </span>
                      )}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* عرض عدد العناصر المحددة */}
            {selectedShipments.length > 0 && (
              <div className="flex items-center gap-2 bg-[#EFF2F7] px-3 py-1.5 rounded-full text-[#294D8B] text-sm">
                <CheckSquare className="h-4 w-4 text-[#294D8B]" />
                <span>تم تحديد {selectedShipments.length} شحنة</span>
              </div>
            )}

            {/* قائمة الإجراءات الجماعية */}
            {selectedShipments.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="v7-neu-button-sm gap-1 bg-[#294D8B] text-white hover:bg-[#1e3a6a] hover:text-white"
                  >
                    <span>إجراءات جماعية</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#EFF2F7]">
                  <DropdownMenuItem
                    onClick={handleBulkPrint}
                    className="gap-2 bg-[#EFF2F7] hover:bg-[#e4e9f2] text-[#294D8B]"
                  >
                    <Printer className="h-4 w-4" />
                    <span>طباعة ملصقات الشحن</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleBulkExport}
                    className="gap-2 bg-[#EFF2F7] hover:bg-[#e4e9f2] text-[#294D8B]"
                  >
                    <Download className="h-4 w-4" />
                    <span>تصدير البيانات</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkChangeStatus("delivered")}
                    className="gap-2 bg-[#EFF2F7] hover:bg-[#e4e9f2] text-[#294D8B]"
                  >
                    <Tag className="h-4 w-4" />
                    <span>تغيير الحالة إلى "تم التوصيل"</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleBulkChangeStatus("processing")}
                    className="gap-2 bg-[#EFF2F7] hover:bg-[#e4e9f2] text-[#294D8B]"
                  >
                    <Tag className="h-4 w-4" />
                    <span>تغيير الحالة إلى "قيد المعالجة"</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleBulkDelete}
                    className="gap-2 bg-[#EFF2F7] hover:bg-[#e4e9f2] text-red-600"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                    <span>حذف الشحنات المحددة</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* عرض الفلاتر النشطة */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="outline"
                className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-1 rounded-full hover:bg-blue-200 h-4 w-4 inline-flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {activeFilters.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-6"
              >
                مسح الكل
              </Button>
            )}
          </div>
        )}

        {/* جدول الشحنات */}
        <div className="rounded-lg v7-neu-card-sm w-full">
          <div className="w-full overflow-visible">
            <div className="min-w-full overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-[#f0f4f8] border-b">
                    <th className="py-4 px-4 text-center font-bold text-lg text-[#333333] w-[4%]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={(checked) => {
                          const isChecked = checked === true
                          setSelectAll(isChecked)
                          handleSelectAll({ target: { checked: isChecked } } as React.ChangeEvent<HTMLInputElement>)
                        }}
                        aria-label="تحديد الكل"
                        className="v7-neu-checkbox"
                      />
                    </th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[8%]">رقم الشحنة</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[8%]">التاريخ</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">المرسل</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">المستلم</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">المسار</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">شركة الشحن</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">مصدر الطلب</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">طريقة الدفع</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">المبلغ</th>
                    <th className="py-4 px-2 text-right font-bold text-lg text-[#333333] w-[10%]">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShipments.length > 0 ? (
                    filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="border-b hover:bg-[#f0f4f8]">
                        <td className="py-5 px-4 text-center">
                          <Checkbox
                            checked={selectedShipments.includes(shipment.id)}
                            onCheckedChange={(checked) => handleSelectShipment(shipment.id, checked === true)}
                            aria-label={`تحديد الشحنة ${shipment.id}`}
                            className="v7-neu-checkbox"
                          />
                        </td>
                        <td className="py-5 px-2 text-[#3498db] whitespace-nowrap">#{shipment.id}</td>
                        <td className="py-5 px-2 whitespace-nowrap">{shipment.date}</td>
                        <td className="py-5 px-2 whitespace-nowrap">{shipment.sender}</td>
                        <td className="py-5 px-2 whitespace-nowrap">{shipment.receiver}</td>
                        <td className="py-5 px-2 whitespace-nowrap">{shipment.route}</td>
                        <td className="py-5 px-2 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <img
                              src={shipment.carrierLogo || "/placeholder.svg"}
                              alt={shipment.carrier}
                              className="h-5 w-auto"
                            />
                            {shipment.carrier}
                          </span>
                        </td>
                        <td className="py-5 px-2 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            {getSourceDetails(shipment.source).icon}
                            <span className={getSourceDetails(shipment.source).color}>{shipment.source}</span>
                          </span>
                        </td>
                        <td className="py-5 px-2 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            {getPaymentDetails(shipment.payment).icon}
                            <span className={getPaymentDetails(shipment.payment).color}>{shipment.payment}</span>
                          </span>
                        </td>
                        <td className="py-5 px-2 whitespace-nowrap">{shipment.amount}</td>
                        <td className="py-5 px-2 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              shipment.status === "delivered"
                                ? "bg-green-100 text-green-600"
                                : shipment.status === "transit"
                                  ? "bg-amber-100 text-amber-600"
                                  : shipment.status === "processing"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                          >
                            {getStatusText(shipment.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Filter className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-lg font-medium">لا توجد شحنات تطابق معايير التصفية</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="mt-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            إزالة جميع الفلاتر
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
