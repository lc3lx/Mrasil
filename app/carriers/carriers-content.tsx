"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Filter,
  Truck,
  Package,
  CheckCircle,
  Plus,
  Trash2,
  X,
  Clock,
  Home,
  Globe,
  ArrowUpDown,
  FileCodeIcon as FileContract,
  Info,
  ChevronDown,
  ChevronUp,
  Box,
  Ticket,
  Link as LinkIcon,
  Tag,
  HandCoins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetAllShipmentCompaniesQuery, ShipmentCompany } from "@/app/api/shipmentCompanyApi"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const companyLogoMap: Record<string, string> = {
  smsa: "/smsa_b2c.jpg",
  jandt: "/jandt.jpg",
  aramex: "/Aramex.jpg",
  aymakan: "/AyMakan.jpg",
  imile: "/iMile.jpg",
  thabit: "/Thabit.jpg",
  redbox: "/RedBox.jpg",
  dal: "/Dal.jpg",
  omniclama: "/omniclama.png",
  // Add more mappings as needed
}

function StatCard({
  icon,
  title,
  value,
  trend,
  color,
  large,
}: {
  icon: React.ReactNode
  title: string
  value: string
  trend?: string
  color?: string
  large?: boolean
}) {
  return (
    <div className="v7-neu-card p-5 rounded-xl dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <p className="text-xl  text-gray-500 mb-2">{title}</p>
          <h3 className="text-2xl font-bold dark:text-gray-100">{value}</h3>
          {trend && <p className={`text-xs mt-1 ${color || "text-green-500"}`}>{trend}</p>}
        </div>
        <div className="v7-neu-icon-lg cursor-pointer hover:opacity-80 transition-opacity dark:bg-gray-700 dark:text-gray-300">
          {icon}
        </div>
      </div>
    </div>
  )
}

function CarrierCard({ carrier, logo }: { carrier: ShipmentCompany; logo: string }) {
  // Determine if any shipping type is 'Dry' (محلي), else 'دولي'
  const isLocal = carrier.shippingTypes.some((st) => st.type === 'Dry');

  return (
    <Card className="shadow-lg bg-[#f7fafd] rounded-2xl p-0 border-0 flex flex-col items-center text-center">
      <CardContent className="flex flex-col items-center p-8 w-full">
        {/* Logo and Name */}
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white flex items-center justify-center mx-auto mb-3">
          <img src={logo} alt={carrier.company} className="w-full h-full object-contain" />
        </div>
        <div className="text-2xl font-extrabold text-[#294D8B] mb-2">{carrier.company}</div>
        {/* Type Badge */}
        <div className="mb-6 flex justify-center gap-3">
          <Badge className={isLocal ? 'bg-green-100 text-green-700 text-lg px-4 py-1' : 'bg-blue-100 text-blue-700 text-lg px-4 py-1'}>
            {isLocal ? 'محلي' : 'دولي'}
          </Badge>
        </div>
        {/* Info Section */}
        <div className="flex flex-col items-start gap-4 w-full max-w-sm mx-auto text-right">
          <div className="flex items-center gap-3">
            <Truck className="h-7 w-7 text-purple-500" />
            <span className="text-lg text-gray-700">الحد الأدنى للشحنات:</span>
            <span className="font-bold text-xl text-[#294D8B]">{carrier.minShipments}</span>
          </div>
          <div className="flex items-center gap-3">
            <Home className="h-7 w-7 text-orange-500" />
            <span className="text-lg text-gray-700">حالة الاستلام:</span>
            <span className="font-bold text-xl text-[#294D8B]">{carrier.pickUpStatus}</span>
          </div>
          <div className="flex items-center gap-3">
            <LinkIcon className="h-7 w-7 text-cyan-500" />
            <span className="text-lg text-gray-700">رابط التتبع:</span>
            <a
              href={carrier.trackingURL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-xl text-cyan-600 hover:underline"
            >
              Tracking Link
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Box className="h-7 w-7 text-green-500 mt-1" />
            <div>
              <span className="text-lg text-gray-700 font-semibold">أحجام الصناديق المسموحة:</span>
              <ul className="list-disc pl-6 space-y-1 text-lg mt-2">
                {carrier.allowedBoxSizes.map((box) => (
                  <li key={box._id} className="text-gray-700">
                    {box.length}×{box.width}×{box.height} سم
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Status Switch at the bottom */}
        <div className="mt-8 flex justify-center w-full items-center gap-3">
          <Switch checked={carrier.status === 'Enabled'} disabled className="scale-125 data-[state=checked]:bg-[blue] data-[state=unchecked]:bg-gray-300" />
          <span className={`text-xl font-bold ${carrier.status === 'Enabled' ? 'text-[#294D8B]' : 'text-red-700'}`}>
            {carrier.status === 'Enabled' ? 'مفعل' : 'غير مفعل'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CarriersContent() {
  const router = useRouter()
  const { data: carriersList, isLoading, isError, error } = useGetAllShipmentCompaniesQuery()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [sortOption, setSortOption] = useState("name-asc")

  const filteredCarriers = (carriersList ?? [])
    .filter((carrier) => {
      const matchesSearch = carrier.company.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesFilter = true
    switch (filterOption) {
      case "active":
          matchesFilter = carrier.status === "Enabled"
        break
      case "inactive":
          matchesFilter = carrier.status !== "Enabled"
        break
      default:
        matchesFilter = true
    }
    return matchesSearch && matchesFilter
  })

  const sortedCarriers = [...filteredCarriers].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.company.localeCompare(b.company)
      case "name-desc":
        return b.company.localeCompare(a.company)
      default:
        return 0
    }
  })

  const totalCarriers = carriersList?.length ?? 0
  const activeCarriers = carriersList?.filter((c) => c.status === "Enabled").length ?? 0
  // Count international carriers (none of their shippingTypes is 'Dry')
  const internationalCarriers = carriersList?.filter((carrier) => !carrier.shippingTypes.some((st) => st.type === 'Dry')).length ?? 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#294D8B]">شركات الشحن</h1>
          <p className="text-gray-500 text-2xl">إدارة شركات الشحن والناقلين المتعاقد معهم</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-[#294D8B] hover:bg-[#1a2a6c] text-white text-xl font-bold rounded-full px-8 py-3 shadow-lg flex items-center gap-2 transition-all"
            onClick={() => router.push("/carriers/integration")}
          >
            <FileContract className="ml-2 h-5 w-5" />
            أضف عقدك الخاص
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Truck size={44} color="#294D8B" />}
          title="إجمالي شركات الشحن"
          value={isLoading ? "..." : totalCarriers.toString()}
          color="text-cyan-600"
          large
        />
        <StatCard
          icon={<CheckCircle size={44} color="#059669" />}
          title="الشركات النشطة"
          value={isLoading ? "..." : activeCarriers.toString()}
          color="text-emerald-600"
          large
        />
        <StatCard
          icon={<Package size={44} color="#0891b2" />}
          title="شركات شحن دولية"
          value={isLoading ? "..." : internationalCarriers.toString()}
          color="text-indigo-600"
          large
        />
      </div>

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
                  <div className="flex items-center shadow-md border border-gray-200 rounded-md p-1 bg-[#EFF2F7] text-[#294D8B]">
                    <Filter className="h-4 w-4 ml-2 text-[#294D8B]" />
                    <SelectValue placeholder="الفلاتر" className="text-[#294D8B]" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشركات</SelectItem>
                  <SelectItem value="active">الشركات النشطة</SelectItem>
                  <SelectItem value="inactive">الشركات غير النشطة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="v7-neu-select">
                  <div className="flex items-center shadow-md border border-gray-200 rounded-md p-1 bg-[#EFF2F7] text-[#294D8B]">
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

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="v7-neu-card">
              <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter className="p-4">
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          <h3 className="text-xl font-medium">Failed to load carriers</h3>
          <p className="text-red-400 mt-2">Could not fetch data from the server. Please try again later.</p>
          <pre className="text-xs text-left bg-red-50 dark:bg-red-900/20 p-2 rounded-md mt-4">
            {JSON.stringify((error as any)?.data, null, 2)}
          </pre>
        </div>
      )}

      {!isLoading && !isError && sortedCarriers.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCarriers.map((carrier) => (
          <CarrierCard
              key={carrier._id}
            carrier={carrier}
              logo={companyLogoMap[carrier.company.toLowerCase()] || "/placeholder.svg"}
          />
        ))}
      </div>
      )}

      {!isLoading && !isError && sortedCarriers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">لا توجد نتائج مطابقة</h3>
          <p className="text-gray-400 mt-2">يرجى تغيير معايير البحث والمحاولة مرة أخرى</p>
        </div>
      )}
    </div>
  )
}
