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

import { V7ShipmentStatus } from "@/components/v7/v7-shipment-status"
import { V7Content } from "@/components/v7/v7-content"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useGetMyShipmentsQuery } from "@/app/api/shipmentApi"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShipmentsGrid } from "./components/ShipmentsGrid";


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
  shipmentstates?: string;
  source?: string;
  carrier?: string;
  priority?: string;
  from?: string;
  to?: string;
  trackingNumber?: string;
}

export default function ShipmentsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSource, setFilterSource] = useState("all") // إضافة حالة لفلترة المصدر
  const [filterCarrier, setFilterCarrier] = useState("all") // إضافة حالة لفلترة شركة الشحن
  // Replace selectedShipments state with selectedShipmentId
const [selectedShipmentId, setSelectedShipmentId] = useState<string[]>([]);
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
  function downloadBase64File(base64: string, fileName: string) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const blob = new Blob([u8arr], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
useEffect(() => {
  if (typeof window === "undefined") return;
  if ((window as any).hasPrintedLastShipment) return;
  (window as any).hasPrintedLastShipment = true;

  const lastShipmentStr = localStorage.getItem("lastShipment");
  console.log("data", lastShipmentStr);
  
  if (!lastShipmentStr) return;

  const lastShipment = JSON.parse(lastShipmentStr);
  const carrier = lastShipment?.data?.shipment?.shapmentCompany;
  const labelUrl = lastShipment?.data?.shipment?.redboxResponse?.label;

  const printLabel = () => {
    if (carrier == "smsa") {
      downloadBase64File(
        lastShipment?.data?.shipment?.smsaResponse.label,
        `smsa-label-${lastShipment.data.shipment._id}.pdf`
      );
    } else if (labelUrl) {
      const win = window.open(labelUrl, "_blank");
      win?.print();
    } else {
      console.log("لا توجد بوليصة للطباعة");
    }
    localStorage.removeItem("lastShipment");
  }

  setTimeout(printLabel, 500);
}, []);

  // استخدام البيانات المحولة من API
  const shipments = transformApiDataToShipments()

// Select all
const toggleSelectAll = () => {
  if (selectedShipmentId.length === shipments.length) {
    setSelectedShipmentId([])
  } else {
    setSelectedShipmentId(shipments.map(s => s._id))
  }
}
// Select one shipment
const toggleSelectShipment = (id: string) => {
  setSelectedShipmentId(prev =>
    prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
  )
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
    const componentStatus = mapApiStatusToComponentStatus(shipment.shipmentstates ?? "")
    // Filter by tab
    if (activeTab === "active" && componentStatus === "delivered") return false
    if (activeTab === "delivered" && componentStatus !== "delivered") return false
    if (activeTab === "processing" && componentStatus !== "processing" && componentStatus !== "ready") return false
    // Filter by status
    if (filterStatus !== "all" && componentStatus !== filterStatus) return false
    // Filter by source
    if (filterSource !== "all" && (shipment.source ?? "") !== filterSource) return false
    // Filter by carrier
    if (filterCarrier !== "all" && (shipment.carrier ?? "") !== filterCarrier) return false
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        shipment._id.toString().includes(query) ||
        ((shipment.from ?? "").toLowerCase().includes(query)) ||
        ((shipment.to ?? "").toLowerCase().includes(query)) ||
        ((shipment.trackingNumber ?? "").toLowerCase().includes(query)) ||
        ((shipment.source ?? "").toLowerCase().includes(query)) ||
        ((shipment.carrier ?? "").toLowerCase().includes(query))
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
      return priorityOrder[(a.priority ?? "عادي") as ShipmentPriority] - priorityOrder[(b.priority ?? "عادي") as ShipmentPriority]
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
        alert(`تم شحن ${selectedShipmentId ? 1 : 0} شحنة`)
        break
      case "print":
        alert(`تم طباعة بوالص الشحن لـ ${selectedShipmentId ? 1 : 0} شحنة`)
        break
      case "export":
        alert(`تم تصدير بيانات ${selectedShipmentId ? 1 : 0} شحنة`)
        break
      case "cancel":
        alert(`تم إلغاء ${selectedShipmentId ? 1 : 0} شحنة`)
        // Aquí puedes implementar la lógica real para cancelar los envíos
        // setSelectedShipmentId(null);
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
        <div className="space-y-8 pb-20 mt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#294D8B]">شحناتي</h1>
              <p className="text-base text-[#6d6a67]">إدارة ومتابعة جميع شحناتك</p>
            </div>
            <div className="flex gap-2 ">
              <Link href="/create-shipment">
                <Button className="v7-neu-button text-base">
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

          <div className="grid gap-6  grid-cols-2 lg:grid-cols-4">
            <V7ShipmentStatus
              title="تم التوصيل"
              count={deliveredCount}
              icon={CheckCircle}
              color="success"
              theme="light"
            />
            <V7ShipmentStatus title="جاري التوصيل" count={transitCount} icon={Truck} color="warning" theme="light"  />
            <V7ShipmentStatus title="جاهز للشحن" count={readyCount} icon={Package} color="info" theme="light" />
            <V7ShipmentStatus
              title="قيد المعالجة"
              count={processingCount}
              icon={Clock}
              color="secondary"
              theme="light"
            />
          </div>

          <div className={`v7-neu-card  p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            <Tabs defaultValue="all" className="w-full " onValueChange={setActiveTab}>
              <div className="  flex flex-col lg:flex-row justify-between gap-4  mb-6 ">
                <TabsList className="v7-neu-tabs">
                  <TabsTrigger value="all" className="v7-neu-tab  text-lg text-gry">
                    جميع الشحنات
                  </TabsTrigger>
                  <TabsTrigger value="active" className="v7-neu-tab  text-lg text-gry ">
                    النشطة
                  </TabsTrigger>
                  <TabsTrigger value="delivered" className="v7-neu-tab  text-lg text-gry ">
                    المسلمة
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="v7-neu-tab  text-lg text-gry ">
                    قيد المعالجة
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <div className="relative v7-neu-input-container flex-1 min-w-[240px]">
                    <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />
                    <input
                    dir="rtl"
                      type="search"
                      placeholder="البحث برقم الشحنة ... " 
                      className="v7-neu-input w-full pr-12 pe-4 text-gry  text-sm "
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="v7-neu-button-sm flex items-center gap-2">
                        <Filter className="h-4 w-4 " />
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
                      <Button variant="outline" className="v7-neu-button-sm flex items-center gap-2 ">
                        <ArrowUpDown className="h-4 w-4 " />
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

              <ShipmentsGrid
                sortedShipments={sortedShipments}
                selectedShipmentId={selectedShipmentId}
                setSelectedShipmentId={setSelectedShipmentId}
                handleBulkAction={handleBulkAction}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </Tabs>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
