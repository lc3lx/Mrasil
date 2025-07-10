"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { ArrowRight, Edit, Phone, Mail, Globe, MapPin, Star, Package, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { routes } from "@/lib/routes"

// بيانات وهمية لشركات الشحن
const carriers = [
  {
    id: "1",
    name: "الشركة السريعة للشحن",
    logo: "/placeholder.svg?key=c9gwq",
    type: "دولي",
    status: "نشط",
    rating: 4.8,
    shipmentsCount: 1245,
    successRate: 98.5,
    avgDeliveryTime: "2-3 أيام",
    coverage: ["الرياض", "جدة", "الدمام", "مكة", "المدينة"],
    contactPerson: "أحمد محمد",
    phone: "+966512345678",
    email: "info@fastshipping.com",
    website: "www.fastshipping.com",
    address: "الرياض، حي العليا، شارع التخصصي، مبنى رقم 125",
    services: ["شحن بري", "شحن جوي", "توصيل سريع", "التتبع المباشر", "التأمين على الشحنات"],
    deliveryTimes: {
      local: "1-2 أيام",
      international: "3-5 أيام",
    },
    pricing: {
      baseRate: "50 ريال",
      additionalKgRate: "10 ريال",
    },
    agreement: {
      startDate: "2023-01-01",
      endDate: "2024-12-31",
      terms: "تشمل الاتفاقية توفير خدمات الشحن بأسعار تفضيلية وضمان التوصيل في الوقت المحدد مع تعويض في حالة التأخير.",
    },
    recentShipments: [
      { id: "SH12345", date: "2023-05-15", status: "تم التسليم", destination: "الرياض" },
      { id: "SH12346", date: "2023-05-14", status: "قيد التوصيل", destination: "جدة" },
      { id: "SH12347", date: "2023-05-13", status: "تم التسليم", destination: "الدمام" },
      { id: "SH12348", date: "2023-05-12", status: "تم التسليم", destination: "مكة" },
      { id: "SH12349", date: "2023-05-11", status: "تم التسليم", destination: "المدينة" },
    ],
    monthlyStats: [
      { month: "يناير", shipments: 95, onTime: 92 },
      { month: "فبراير", shipments: 110, onTime: 105 },
      { month: "مارس", shipments: 125, onTime: 120 },
      { month: "أبريل", shipments: 140, onTime: 135 },
      { month: "مايو", shipments: 150, onTime: 147 },
    ],
  },
  // ... باقي البيانات الوهمية لشركات الشحن الأخرى
]

// مكون بطاقة إحصائيات
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
    <div className="v7-neu-card p-5 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && <p className={`text-xs mt-1 ${color || "text-green-500"}`}>{trend}</p>}
        </div>
        <div className={`v7-neu-icon-lg ${color ? color.replace("text-", "v7-icon-") : "v7-icon-blue"}`}>{icon}</div>
      </div>
    </div>
  )
}

export function CarrierDetails({ id }: { id: string }) {
  const router = useRouter()
  const carrier = carriers.find((c) => c.id === id) || carriers[0]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="v7-neu-button-secondary ml-2"
          onClick={() => router.push(routes.carriers)}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold">تفاصيل شركة الشحن</h1>
        <div className="mr-auto">
          <Button
            className="v7-neu-button-primary"
            onClick={() => router.push(routes.editCarrier(id))}
          >
            <Edit className="h-4 w-4 ml-2" />
            تعديل البيانات
          </Button>
        </div>
      </div>

      {/* معلومات الشركة الأساسية */}
      <div className="v7-neu-card p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={carrier.logo || "/placeholder.svg"}
              alt={carrier.name}
              className="w-24 h-24 rounded-xl v7-neu-image"
            />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{carrier.name}</h2>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded-md text-xs ${carrier.type === "دولي" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"} ml-2`}>
                    {carrier.type}
                  </span>
                  <span className={`px-2 py-1 rounded-md text-xs ${carrier.status === "نشط" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {carrier.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div className="flex items-center ml-4">
                  <Star className="h-5 w-5 text-yellow-400 ml-1" />
                  <span className="font-bold">{carrier.rating}</span>
                </div>
                <div className="v7-neu-button-flat px-3 py-1 rounded-lg">
                  <span className="text-sm">{carrier.shipmentsCount} شحنة</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 ml-2" />
                <span>{carrier.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 ml-2" />
                <span>{carrier.email}</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-400 ml-2" />
                <span>{carrier.website}</span>
              </div>
            </div>
            <div className="flex items-start mt-2">
              <MapPin className="h-5 w-5 text-gray-400 ml-2 mt-0.5" />
              <span>{carrier.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات الشركة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Package className="h-6 w-6" />} 
          title="إجمالي الشحنات" 
          value={carrier.shipmentsCount.toString()} 
          trend="زيادة 15% عن الشهر الماضي" 
        />
        <StatCard 
          icon={<CheckCircle className="h-6 w-6" />} 
          title="معدل النجاح" 
          value={`${carrier.successRate}%`} 
        />
        <StatCard 
          icon={<Clock className="h-6 w-6" />} 
          title="متوسط وقت التوصيل" 
          value={carrier.avgDeliveryTime} 
        />
        <StatCard 
          icon={<Star className="h-6 w-6" />} 
          title="تقييم الشركة" 
          value={carrier.rating.toString()} 
          trend="زيادة 0.2 عن التقييم السابق" 
        />
      </div>
    </div>
  )
}
