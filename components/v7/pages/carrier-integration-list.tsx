"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ArrowUpDown, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// نموذج بيانات شركات الشحن
const carriers = [
  {
    id: "aramex",
    name: "أرامكس",
    arabicName: "أرامكس",
    logo: "/carriers/aramex-logo.png",
    type: "دولي",
    status: "نشط",
    features: ["خدمة العميل الأخير للتجارة الإلكترونية", "أسعار تنافسية", "تسليم سريع من الباب إلى الباب"],
    integration: {
      requiresAuth: true,
      fields: ["API Key", "Client ID", "Secret ID", "User Name", "Password"],
    },
  },
  {
    id: "dhl",
    name: "DHL",
    arabicName: "دي إتش إل",
    logo: "/carriers/dhl-logo.png",
    type: "دولي",
    status: "نشط",
    features: ["خدمة العميل الأخير للتجارة الإلكترونية", "أسعار تنافسية", "تسليم سريع من الباب إلى الباب"],
    integration: {
      requiresAuth: true,
      fields: ["API Key", "User Name", "Password", "Account Number", "Entity", "Version"],
    },
  },
  {
    id: "fedex",
    name: "FedEx",
    arabicName: "فيديكس",
    logo: "/carriers/fedex-logo.png",
    type: "دولي",
    status: "نشط",
    features: ["خدمة العميل الأخير للتجارة الإلكترونية", "أسعار تنافسية", "تسليم سريع من الباب إلى الباب"],
    integration: {
      requiresAuth: true,
      fields: ["API Key", "B2B API Key", "Client ID", "Secret ID", "User Name", "Password"],
    },
  },
  {
    id: "ups",
    name: "UPS",
    arabicName: "يو بي إس",
    logo: "/carriers/ups-logo.png",
    type: "دولي",
    status: "نشط",
    features: ["خدمة العميل الأخير للتجارة الإلكترونية", "أسعار تنافسية", "تسليم سريع من الباب إلى الباب"],
    integration: {
      requiresAuth: true,
      fields: ["API Key", "Client ID", "User Name", "Password", "Pin Number"],
    },
  },
  {
    id: "smsa",
    name: "SMSA",
    arabicName: "سمسا",
    logo: "/carriers/smsa-logo.png",
    type: "محلي",
    status: "نشط",
    features: ["خدمة العميل الأخير للتجارة الإلكترونية", "أسعار تنافسية", "تسليم سريع من الباب إلى الباب"],
    integration: {
      requiresAuth: true,
      fields: ["API Key", "Client ID", "Secret ID", "Account Number", "Token"],
    },
  },
  {
    id: "aymakan",
    name: "Aymakan",
    arabicName: "أي مكان",
    logo: "/carriers/aymakan-logo.png",
    type: "محلي",
    status: "نشط",
    features: ["خدمة العميل الأخير للتجارة الإلكترونية", "أسعار تنافسية", "تسليم سريع من الباب إلى الباب"],
    integration: {
      requiresAuth: true,
      fields: ["API Key", "User Name", "Password", "Account Number"],
    },
  },
]

// مكون بطاقة شركة الشحن
function CarrierCard({ carrier, onClick }: { carrier: (typeof carriers)[0]; onClick: () => void }) {
  return (
    <div className="v7-neu-card p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
      <div className="w-44 h-20 flex items-center justify-center mb-4">
        <img
          src={carrier.logo || "/placeholder.svg"}
          alt={carrier.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <h3 className="text-xl font-bold mb-5 text-center">{carrier.arabicName}</h3>

      <div className="mt-auto w-full">
        <Button
          className="w-full bg-[#EFF2F7] text-[#294D8B] border border-[#294D8B] hover:bg-blue-100"
          onClick={onClick}
        >
          <Settings className="ml-2 h-4 w-4" />
          إعداد التكامل
        </Button>
      </div>
    </div>
  )
}

// المكون الرئيسي
export function CarrierIntegrationList() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [sortOption, setSortOption] = useState("name-asc")

  // تصفية شركات الشحن حسب البحث والفلاتر
  const filteredCarriers = carriers.filter((carrier) => {
    const matchesSearch =
      carrier.arabicName.includes(searchTerm) || carrier.name.toLowerCase().includes(searchTerm.toLowerCase())

    // تطبيق الفلتر المحدد
    let matchesFilter = true
    switch (filterOption) {
      case "local":
        matchesFilter = carrier.type === "محلي"
        break
      case "international":
        matchesFilter = carrier.type === "دولي"
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  // ترتيب النتائج حسب الخيار المحدد
  const sortedCarriers = [...filteredCarriers].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.arabicName.localeCompare(b.arabicName)
      case "name-desc":
        return b.arabicName.localeCompare(a.arabicName)
      default:
        return 0
    }
  })

  // التوجه إلى صفحة تكامل شركة الشحن
  const navigateToIntegration = (carrierId: string) => {
    router.push(`/carriers/integration/${carrierId}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">تكامل شركات الشحن</h1>
          <p className="text-gray-500">إعداد تكامل API مع شركات الشحن المختلفة</p>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="v7-neu-card p-5 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث عن شركة شحن..."
              className="pl-10 v7-neu-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-40">
              <Select value={filterOption} onValueChange={setFilterOption}>
                <SelectTrigger className="v7-neu-select">
                  <div
                    className="flex items-center shadow-md border border-gray-200 rounded-md p-1 text-[#294D8B]"
                    style={{ backgroundColor: "#EFF2F7" }}
                  >
                    <Filter className="h-4 w-4 ml-2 text-[#294D8B]" />
                    <SelectValue placeholder="الفلاتر" className="text-[#294D8B]" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشركات</SelectItem>
                  <SelectItem value="local">شركات محلية</SelectItem>
                  <SelectItem value="international">شركات دولية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="v7-neu-select">
                  <div
                    className="flex items-center shadow-md border border-gray-200 rounded-md p-1 text-[#294D8B]"
                    style={{ backgroundColor: "#EFF2F7" }}
                  >
                    <ArrowUpDown className="h-4 w-4 ml-2 text-[#294D8B]" />
                    <SelectValue placeholder="الترتيب" className="text-[#294D8B]" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">الاسم (تصاعدي)</SelectItem>
                  <SelectItem value="name-desc">الاسم (تنازلي)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* شبكة بطاقات شركات الشحن */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCarriers.map((carrier) => (
          <CarrierCard key={carrier.id} carrier={carrier} onClick={() => navigateToIntegration(carrier.id)} />
        ))}
      </div>

      {sortedCarriers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">لا توجد نتائج مطابقة</h3>
          <p className="text-gray-400 mt-2">يرجى تغيير معايير البحث والمحاولة مرة أخرى</p>
        </div>
      )}
    </div>
  )
}
