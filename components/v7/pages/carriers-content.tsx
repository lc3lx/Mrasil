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
  // Add more mappings as needed
}

function StatCard({
  icon,
  title,
  value,
  trend,
  color,
}: {
  icon: React.ReactNode
  title: string
  value: string
  trend?: string
  color?: string
}) {
  return (
    <div className="v7-neu-card p-5 rounded-xl dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-grow">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
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
  return (
    <Card className="v7-neu-card flex flex-col h-full dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-white p-1">
          <img src={logo} alt={carrier.company} className="w-full h-full object-contain" />
        </div>
        <div className="flex-grow">
          <CardTitle className="text-xl font-bold dark:text-gray-100">{carrier.company}</CardTitle>
          <Badge variant={carrier.status === "Enabled" ? "default" : "destructive"}>
            {carrier.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <Tabs defaultValue="shippingTypes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shippingTypes">Shipping Types</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="shippingTypes" className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {carrier.shippingTypes.map((st) => {
              const totalCodCost = (st.baseCODfees || 0) + (st.profitCODfees || 0)
              return (
                <Collapsible key={st._id} className="v7-neu-card-inset p-3 rounded-lg">
                  <CollapsibleTrigger className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">{st.type}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 [&[data-state=open]]:-rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 mt-2 border-t dark:border-gray-700 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Code:</span> <span>{st.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">RTO Code:</span> <span>{st.RTOcode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">COD:</span>
                      {st.COD ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {st.COD && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Max COD Amount:</span>
                        <span>{st.maxCodAmount}</span>
      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Weight:</span> <span>{st.maxWeight} kg</span>
          </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Boxes:</span> <span>{st.maxBoxes}</span>
        </div>
                    <div className="flex justify-between font-bold text-blue-600 dark:text-blue-400 mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                      <span>Total COD Cost:</span>
                      <span>{totalCodCost.toFixed(2)} SAR</span>
          </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </TabsContent>
          <TabsContent value="info" className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-purple-500" />
              <span>
                Minimum Shipments: <span className="font-bold">{carrier.minShipments}</span>
              </span>
        </div>
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-orange-500" />
              <span>
                Pickup Status: <span className="font-bold">{carrier.pickUpStatus}</span>
            </span>
          </div>
            <div className="flex items-center gap-3">
              <LinkIcon className="h-5 w-5 text-cyan-500" />
              <a
                href={carrier.trackingURL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-cyan-600 hover:underline"
              >
                Tracking Link
              </a>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Box className="h-5 w-5 text-green-500" /> Allowed Box Sizes:
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {carrier.allowedBoxSizes.map((box) => (
                  <li key={box._id}>
                    {box.length}x{box.width}x{box.height} cm
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="details" className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div>
              <h4 className="font-semibold mb-1">Details</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{carrier.detailsAr}</p>
        </div>
            <div>
              <h4 className="font-semibold mb-1">Conditions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{carrier.conditionsAr}</p>
      </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="p-4 mt-auto border-t dark:border-gray-700">
        <div className="flex items-center gap-2 w-full justify-end">
          <Switch checked={carrier.status === "Enabled"} disabled className="data-[state=checked]:bg-blue-500" />
          <span className="text-sm font-medium dark:text-gray-200">
            {carrier.status === "Enabled" ? "Enabled" : "Disabled"}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#294D8B]">شركات الشحن</h1>
          <p className="text-gray-500">إدارة شركات الشحن والناقلين المتعاقد معهم</p>
        </div>
        <div className="flex gap-2">
          <Button className="v7-neu-button-primary" onClick={() => router.push("/carriers/integration")}>
            <FileContract className="ml-2 h-4 w-4" />
            أضف عقدك الخاص
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Truck size={30} color="#294D8B" />}
          title="إجمالي شركات الشحن"
          value={isLoading ? "..." : totalCarriers.toString()}
          color="text-cyan-600"
        />
        <StatCard
          icon={<CheckCircle size={30} color="#059669" />}
          title="الشركات النشطة"
          value={isLoading ? "..." : activeCarriers.toString()}
          color="text-emerald-600"
        />
        <StatCard
          icon={<Package size={30} color="#0891b2" />}
          title="شركات شحن دولية"
          value={"N/A"} // This data isn't in the new API
          color="text-indigo-600"
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
