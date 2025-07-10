"use client"

import { useState, useEffect } from "react"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  ChevronDown,
  Printer,
  XCircle,
  Store,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import V7Layout from "@/components/v7/v7-layout"
import { V7ShipmentCard } from "@/components/v7/v7-shipment-card"
import { V7ShipmentStatus } from "@/components/v7/v7-shipment-status"
import { V7Content } from "@/components/v7/v7-content"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useGetMyShipmentsQuery } from "@/app/api/shipmentApi"

type ShipmentStatus = "delivered" | "transit" | "processing" | "ready"
type ShipmentPriority = "فائق السرعة" | "سريع" | "عادي"

interface Shipment {
  _id: string;
  dimension: {
    high: number;
    width: number;
    length: number;
  };
  customerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orderId: string;
  senderAddress: {
    full_name: string;
    mobile: string;
    city: string;
    country: string;
    address: string;
  };
  boxNum: number;
  weight: number;
  orderDescription: string;
  shapmentingType: string;
  shapmentCompany: string;
  shapmentType: string;
  shapmentPrice: number;
  orderSou: string;
  priceaddedtax: number;
  byocPrice: number;
  basepickUpPrice: number;
  profitpickUpPrice: number;
  baseRTOprice: number;
  createdAt: string;
}

export default function ShipmentsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all") // إضافة حالة لفلترة المصدر
  const [filterCarrier, setFilterCarrier] = useState("all") // إضافة حالة لفلترة شركة الشحن
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<string[]>([]) // لتتبع الفلاتر النشطة
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch shipments data from API
  const { data: shipmentsResponse, isLoading, error } = useGetMyShipmentsQuery({ page: currentPage, itemsPerPage: 5 })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // تحديث الفلاتر النشطة عند تغيير أي فلتر
  useEffect(() => {
    const filters = []
    if (filterStatus !== "all") filters.push(`الحالة: ${getStatusText(filterStatus)}`)
    if (filterSource !== "all") filters.push(`المصدر: ${filterSource}`)
    if (filterCarrier !== "all") filters.push(`الناقل: ${getCarrierName(filterCarrier)}`)
    setActiveFilters(filters)
  }, [filterStatus, filterSource, filterCarrier])

  // دالة لتحويل حالة الشحنة إلى نص عربي
  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التسليم"
      case "transit":
        return "جاري التوصيل"
      case "processing":
        return "قيد المعالجة"
      case "ready":
        return "جاهز للشحن"
      default:
        return "غير معروف"
    }
  }

  // دالة للحصول على اسم شركة الشحن بالعربية
  const getCarrierName = (carrier: string) => {
    switch (carrier) {
      case "aramex":
        return "أرامكس"
      case "dhl":
        return "دي إتش إل"
      case "fedex":
        return "فيديكس"
      case "ups":
        return "يو بي إس"
      case "smsa":
        return "سمسا"
      case "imile":
        return "آي مايل"
      default:
        return carrier
    }
  }

  // دالة لتحويل API status إلى component status
  const mapApiStatusToComponentStatus = (apiStatus: string): ShipmentStatus => {
    switch (apiStatus) {
      case "DELIVERED":
        return "delivered"
      case "IN_TRANSIT":
        return "transit"
      case "PROCESSING":
        return "processing"
      case "READY":
        return "ready"
      default:
        return "processing"
    }
  }

  // دالة لتحويل التاريخ إلى التنسيق المطلوب
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('ar-SA', options)
  }

  // دالة لتحويل الوقت إلى التنسيق المطلوب
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }
    return date.toLocaleTimeString('ar-SA', options)
  }

  // تحويل بيانات API إلى التنسيق المطلوب للمكون
  const transformApiDataToShipments = (): Shipment[] => {
    if (!shipmentsResponse?.data) return [];
    return shipmentsResponse.data;
  }

  // قائمة بمصادر الطلبات المتاحة
  const availableSources = [
    { id: "all", name: "جميع المصادر", icon: <ShoppingCart className="h-4 w-4 ml-2" /> },
    { id: "متجر إلكتروني", name: "متجر إلكتروني", icon: <Store className="h-4 w-4 ml-2" /> },
    { id: "سلة", name: "سلة", icon: <ShoppingCart className="h-4 w-4 ml-2" /> },
    { id: "شوبيفاي", name: "شوبيفاي", icon: <ShoppingCart className="h-4 w-4 ml-2" /> },
    { id: "زد", name: "زد", icon: <ShoppingCart className="h-4 w-4 ml-2" /> },
    { id: "مباشر", name: "مباشر", icon: <Store className="h-4 w-4 ml-2" /> },
    { id: "يدوي", name: "يدوي", icon: <Clock className="h-4 w-4 ml-2" /> },
  ]

  // قائمة بشركات الشحن المتاحة
  const availableCarriers = [
    { id: "all", name: "جميع الناقلين" },
    { id: "aramex", name: "أرامكس" },
    { id: "dhl", name: "دي إتش إل" },
    { id: "fedex", name: "فيديكس" },
    { id: "ups", name: "يو بي إس" },
    { id: "smsa", name: "سمسا" },
    { id: "imile", name: "آي مايل" },
  ]

  // استخدام البيانات المحولة من API
  const shipments = transformApiDataToShipments()

  // Toggle select all shipments
  const toggleSelectAll = () => {
    if (selectedShipments.length === filteredShipments.length) {
      setSelectedShipments([])
    } else {
      setSelectedShipments(filteredShipments.map((shipment) => shipment._id))
    }
  }

  // Toggle select single shipment
  const toggleSelectShipment = (id: string) => {
    if (selectedShipments.includes(id)) {
      setSelectedShipments(selectedShipments.filter((shipmentId) => shipmentId !== id))
    } else {
      setSelectedShipments([...selectedShipments, id])
    }
  }

  // إزالة فلتر معين
  const removeFilter = (filter: string) => {
    if (filter.startsWith("الحالة:")) {
      setFilterStatus("all")
    } else if (filter.startsWith("المصدر:")) {
      setFilterSource("all")
    } else if (filter.startsWith("الناقل:")) {
      setFilterCarrier("all")
    }
  }

  // إزالة جميع الفلاتر
  const clearAllFilters = () => {
    setFilterStatus("all")
    setFilterSource("all")
    setFilterCarrier("all")
    setSearchQuery("")
  }

  // Filter shipments
  const filteredShipments = shipments.filter((shipment) => {
    // Map API status to component status
    const componentStatus = mapApiStatusToComponentStatus(shipment.shipmentstates)
    // Filter by tab
    if (activeTab === "active" && componentStatus === "delivered") return false
    if (activeTab === "delivered" && componentStatus !== "delivered") return false
    if (activeTab === "processing" && componentStatus !== "processing" && componentStatus !== "ready") return false
    // Filter by status
    if (filterStatus !== "all" && componentStatus !== filterStatus) return false
    // Filter by source
    if (filterSource !== "all" && shipment.source !== filterSource) return false
    // Filter by carrier
    if (filterCarrier !== "all" && shipment.carrier !== filterCarrier) return false
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        shipment._id.toString().includes(query) ||
        (shipment.from && shipment.from.toLowerCase().includes(query)) ||
        (shipment.to && shipment.to.toLowerCase().includes(query)) ||
        (shipment.trackingNumber && shipment.trackingNumber.toLowerCase().includes(query)) ||
        (shipment.source && shipment.source.toLowerCase().includes(query)) ||
        (shipment.carrier && shipment.carrier.toLowerCase().includes(query))
      )
    }
    return true
  })

  // Sort shipments
  const sortedShipments = [...filteredShipments].sort((a, b) => {
    if (sortBy === "newest") {
      return b._id.localeCompare(a._id)
    } else if (sortBy === "oldest") {
      return a._id.localeCompare(b._id)
    } else if (sortBy === "priority") {
      const priorityOrder: Record<ShipmentPriority, number> = { "فائق السرعة": 0, "سريع": 1, "عادي": 2 }
      return priorityOrder[a.priority as ShipmentPriority] - priorityOrder[b.priority as ShipmentPriority]
    }
    return 0
  })

  // Count shipments by status
  const deliveredCount = shipments.filter((s) => mapApiStatusToComponentStatus(s.shipmentstates) === "delivered").length
  const transitCount = shipments.filter((s) => mapApiStatusToComponentStatus(s.shipmentstates) === "transit").length
  const readyCount = shipments.filter((s) => mapApiStatusToComponentStatus(s.shipmentstates) === "ready").length
  const processingCount = shipments.filter((s) => mapApiStatusToComponentStatus(s.shipmentstates) === "processing").length

  // Count shipments by source
  const sourceCount = availableSources.reduce(
    (acc, source) => {
      if (source.id === "all") return acc
      acc[source.id] = shipments.filter((s) => s.source === source.id).length
      return acc
    },
    {} as Record<string, number>,
  )

  // Count shipments by carrier
  const carrierCount = availableCarriers.reduce(
    (acc, carrier) => {
      if (carrier.id === "all") return acc
      acc[carrier.id] = shipments.filter((s) => s.carrier === carrier.id).length
      return acc
    },
    {} as Record<string, number>,
  )

  // Función para manejar acciones en grupo
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "ship":
        alert(`تم شحن ${selectedShipments.length} شحنة`)
        break
      case "print":
        alert(`تم طباعة بوالص الشحن لـ ${selectedShipments.length} شحنة`)
        break
      case "export":
        alert(`تم تصدير بيانات ${selectedShipments.length} شحنة`)
        break
      case "cancel":
        alert(`تم إلغاء ${selectedShipments.length} شحنة`)
        // Aquí puedes implementar la lógica real para cancelar los envíos
        // setSelectedShipments([]);
        break
      default:
        break
    }
  }

  // Pagination info
  const pagination = shipmentsResponse?.pagination
  const totalPages = pagination?.totalPages || 1

  // Show loading state
  if (isLoading) {
    return (
      <V7Layout>
        <V7Content title="شحناتي" description="إدارة ومتابعة جميع شحناتك">
          <div className="space-y-8 pb-20">
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-[#6d6a67] opacity-20" />
              <h3 className="mt-4 text-lg font-medium">جاري تحميل الشحنات...</h3>
            </div>
          </div>
        </V7Content>
      </V7Layout>
    )
  }

  // Show error state
  if (error) {
    return (
      <V7Layout>
        <V7Content title="شحناتي" description="إدارة ومتابعة جميع شحناتك">
          <div className="space-y-8 pb-20">
            <div className="text-center py-12">
              <XCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-red-600">خطأ في تحميل البيانات</h3>
              <p className="mt-2 text-sm text-[#6d6a67]">حدث خطأ أثناء تحميل الشحنات. يرجى المحاولة مرة أخرى.</p>
            </div>
          </div>
        </V7Content>
      </V7Layout>
    )
  }

  return (
    <V7Layout>
      <V7Content title="شحناتي" description="إدارة ومتابعة جميع شحناتك">
        <div className="space-y-8 pb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#294D8B]">شحناتي</h1>
              <p className="text-sm text-[#6d6a67]">إدارة ومتابعة جميع شحناتك</p>
            </div>
            <div className="flex gap-2">
              <Link href="/create-shipment">
                <Button className="v7-neu-button">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء شحنة جديدة
                </Button>
              </Link>
              <Button variant="outline" className="v7-neu-button-sm">
                <Download className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">تصدير</span>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <V7ShipmentStatus
              title="تم التوصيل"
              count={deliveredCount}
              icon={CheckCircle}
              color="success"
              theme="light"
            />
            <V7ShipmentStatus title="جاري التوصيل" count={transitCount} icon={Truck} color="warning" theme="light" />
            <V7ShipmentStatus title="جاهز للشحن" count={readyCount} icon={Package} color="info" theme="light" />
            <V7ShipmentStatus
              title="قيد المعالجة"
              count={processingCount}
              icon={Clock}
              color="secondary"
              theme="light"
            />
          </div>

          <div className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <TabsList className="v7-neu-tabs">
                  <TabsTrigger value="all" className="v7-neu-tab">
                    جميع الشحنات
                  </TabsTrigger>
                  <TabsTrigger value="active" className="v7-neu-tab">
                    النشطة
                  </TabsTrigger>
                  <TabsTrigger value="delivered" className="v7-neu-tab">
                    المسلمة
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="v7-neu-tab">
                    قيد المعالجة
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <div className="relative v7-neu-input-container flex-1 min-w-[200px]">
                    <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />
                    <input
                      type="search"
                      placeholder="البحث برقم الشحنة..."
                      className="v7-neu-input w-full pr-12"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="v7-neu-button-sm">
                        <Filter className="h-4 w-4 md:mr-2" />
                        <span className="sr-only md:not-sr-only">تصفية</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="v7-neu-dropdown">
                      <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                        <DropdownMenuRadioItem value="all">جميع الحالات</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="delivered">تم التوصيل</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="transit">جاري التوصيل</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="processing">قيد المعالجة</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="ready">جاهز للشحن</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel>تصفية حسب المصدر</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={filterSource} onValueChange={setFilterSource}>
                        {availableSources.map((source) => (
                          <DropdownMenuRadioItem key={source.id} value={source.id} className="flex items-center">
                            {source.icon}
                            <span>{source.name}</span>
                            {source.id !== "all" && (
                              <span className="mr-auto text-xs text-gray-500">({sourceCount[source.id] || 0})</span>
                            )}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel>تصفية حسب شركة الشحن</DropdownMenuLabel>
                      <DropdownMenuRadioGroup value={filterCarrier} onValueChange={setFilterCarrier}>
                        {availableCarriers.map((carrier) => (
                          <DropdownMenuRadioItem key={carrier.id} value={carrier.id} className="flex items-center">
                            <span>{carrier.name}</span>
                            {carrier.id !== "all" && (
                              <span className="mr-auto text-xs text-gray-500">({carrierCount[carrier.id] || 0})</span>
                            )}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="v7-neu-button-sm">
                        <ArrowUpDown className="h-4 w-4 md:mr-2" />
                        <span className="sr-only md:not-sr-only">ترتيب</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="v7-neu-dropdown">
                      <DropdownMenuItem onClick={() => setSortBy("newest")}>الأحدث أولاً</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("oldest")}>الأقدم أولاً</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("priority")}>حسب الأولوية</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* عرض الفلاتر النشطة */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
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
                        <XCircle className="h-3 w-3" />
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

              {selectedShipments.length > 0 && (
                <div className="mb-4 p-2 bg-blue-50 rounded-md flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">تم تحديد {selectedShipments.length} شحنة</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white hover:bg-blue-50"
                        disabled={selectedShipments.length === 0}
                      >
                        إجراءات جماعية <ChevronDown className="mr-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#EFF2F7] border-[#E4E9F2] shadow-sm">
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
                        <span>طباعة بوالص الشحن</span>
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
                        className="text-red-600 text-[#294D8B] hover:bg-[#e4e9f2] cursor-pointer"
                      >
                        <XCircle className="h-4 w-4 ml-2 text-red-600" />
                        <span>إلغاء المحدد</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedShipments.length === sortedShipments.length && sortedShipments.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="تحديد كل الشحنات"
                        className=""
                      />
                      <span className="text-sm font-medium m-2">تحديد الكل</span>
                    </div>

                    <span className="text-sm text-gray-500">{sortedShipments.length} شحنة</span>
                  </div>

                  {sortedShipments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedShipments.map((shipment) => (
                        <div key={shipment._id} className="flex items-center">
                          <div className="w-6 flex-shrink-0 mt-4 ml-2">
                            <Checkbox
                              checked={selectedShipments.includes(shipment._id)}
                              onCheckedChange={() => toggleSelectShipment(shipment._id)}
                              aria-label={`تحديد الشحنة ${shipment._id}`}
                            />
                          </div>
                          <div className="flex-grow">
                            <V7ShipmentCard shipment={shipment} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="mx-auto h-12 w-12 text-[#6d6a67] opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">لا توجد شحنات</h3>
                      <p className="mt-2 text-sm text-[#6d6a67]">لم يتم العثور على شحنات تطابق معايير البحث</p>
                    </div>
                  )}
                  {/* Pagination UI */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border text-sm font-medium ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-700 border-blue-200'} ${page === 1 ? 'rounded-l-md' : ''} ${page === totalPages ? 'rounded-r-md' : ''}`}
                            style={{ minWidth: 40 }}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedShipments.length === sortedShipments.length && sortedShipments.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="تحديد كل الشحنات النشطة"
                        className="ml-2"
                      />
                      <span className="text-sm font-medium">تحديد الكل</span>
                    </div>

                    <span className="text-sm text-gray-500">{sortedShipments.length} شحنة نشطة</span>
                  </div>

                  {sortedShipments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedShipments.map((shipment) => (
                        <div key={shipment._id} className="flex items-center">
                          <div className="w-6 flex-shrink-0 mt-4 ml-2">
                            <Checkbox
                              checked={selectedShipments.includes(shipment._id)}
                              onCheckedChange={() => toggleSelectShipment(shipment._id)}
                              aria-label={`تحديد الشحنة ${shipment._id}`}
                            />
                          </div>
                          <div className="flex-grow ">
                            <V7ShipmentCard shipment={shipment} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="mx-auto h-12 w-12 text-[#6d6a67] opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">لا توجد شحنات نشطة</h3>
                      <p className="mt-2 text-sm text-[#6d6a67]">لم يتم العثور على شحنات نشطة تطابق معايير البحث</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="delivered" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedShipments.length === sortedShipments.length && sortedShipments.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="تحديد كل الشحنات المسلمة"
                        className="ml-2"
                      />
                      <span className="text-sm font-medium">تحديد الكل</span>
                    </div>

                    <span className="text-sm text-gray-500">{sortedShipments.length} شحنة مسلمة</span>
                  </div>

                  {sortedShipments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedShipments.map((shipment) => (
                        <div key={shipment._id} className="flex items-center">
                          <div className="w-6 flex-shrink-0 mt-4 ml-2">
                            <Checkbox
                              checked={selectedShipments.includes(shipment._id)}
                              onCheckedChange={() => toggleSelectShipment(shipment._id)}
                              aria-label={`تحديد الشحنة ${shipment._id}`}
                            />
                          </div>
                          <div className="flex-grow">
                            <V7ShipmentCard shipment={shipment} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="mx-auto h-12 w-12 text-[#6d6a67] opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">لا توجد شحنات مسلمة</h3>
                      <p className="mt-2 text-sm text-[#6d6a67]">لم يتم العثور على شحنات مسلمة تطابق معايير البحث</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="processing" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedShipments.length === sortedShipments.length && sortedShipments.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="تحديد كل الشحنات قيد المعالجة"
                        className="ml-2"
                      />
                      <span className="text-sm font-medium">تحديد الكل</span>
                    </div>

                    <span className="text-sm text-gray-500">{sortedShipments.length} شحنة قيد المعالجة</span>
                  </div>

                  {sortedShipments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sortedShipments.map((shipment) => (
                        <div key={shipment._id} className="flex items-center">
                          <div className="w-6 flex-shrink-0 mt-4 ml-2">
                            <Checkbox
                              checked={selectedShipments.includes(shipment._id)}
                              onCheckedChange={() => toggleSelectShipment(shipment._id)}
                              aria-label={`تحديد الشحنة ${shipment._id}`}
                            />
                          </div>
                          <div className="flex-grow">
                            <V7ShipmentCard shipment={shipment} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="mx-auto h-12 w-12 text-[#6d6a67] opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">لا توجد شحنات قيد المعالجة</h3>
                      <p className="mt-2 text-sm text-[#6d6a67]">
                        لم يتم العثور على شحنات قيد المعالجة تطابق معايير البحث
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
