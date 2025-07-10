"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface V7PricingTableProps {
  theme: "light" | "dark"
}

export function V7PricingTable({ theme }: V7PricingTableProps) {
  const [activeTab, setActiveTab] = useState("domestic")

  const domesticRoutes = [
    { from: "الرياض", to: "جدة", price: "25 ريال", time: "1-2 يوم" },
    { from: "الرياض", to: "الدمام", price: "20 ريال", time: "1 يوم" },
    { from: "جدة", to: "مكة", price: "15 ريال", time: "نفس اليوم" },
    { from: "الدمام", to: "الخبر", price: "10 ريال", time: "نفس اليوم" },
    { from: "الرياض", to: "المدينة", price: "30 ريال", time: "1-2 يوم" },
    { from: "جدة", to: "الطائف", price: "18 ريال", time: "1 يوم" },
  ]

  const internationalRoutes = [
    { from: "السعودية", to: "الإمارات", price: "50 ريال", time: "1-2 يوم" },
    { from: "السعودية", to: "البحرين", price: "45 ريال", time: "1 يوم" },
    { from: "السعودية", to: "مصر", price: "120 ريال", time: "2-3 أيام" },
    { from: "السعودية", to: "الأردن", price: "100 ريال", time: "2-3 أيام" },
    { from: "السعودية", to: "الكويت", price: "55 ريال", time: "1-2 يوم" },
    { from: "السعودية", to: "عمان", price: "70 ريال", time: "2 يوم" },
  ]

  return (
    <Tabs defaultValue="domestic" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl v7-neu-tabs">
        <TabsTrigger value="domestic" className="rounded-lg">
          داخل المملكة
        </TabsTrigger>
        <TabsTrigger value="international" className="rounded-lg">
          دولي
        </TabsTrigger>
      </TabsList>
      <TabsContent value="domestic" className="mt-4">
        <div className="rounded-xl v7-neu-card-inset overflow-hidden">
          <div className="grid grid-cols-4 gap-4 border-b p-4 font-medium">
            <div>من</div>
            <div>إلى</div>
            <div>السعر</div>
            <div>وقت التوصيل</div>
          </div>
          <div className="divide-y">
            {domesticRoutes.map((route, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 p-4 hover:bg-[#f8f4f0] transition-colors v7-fade-in v7-stagger-item"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <div>{route.from}</div>
                <div>{route.to}</div>
                <div className="font-medium text-[#e05d34]">{route.price}</div>
                <div>{route.time}</div>
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full v7-neu-button">
          عرض جميع الأسعار
        </Button>
      </TabsContent>
      <TabsContent value="international" className="mt-4">
        <div className="rounded-xl v7-neu-card-inset overflow-hidden">
          <div className="grid grid-cols-4 gap-4 border-b p-4 font-medium">
            <div>من</div>
            <div>إلى</div>
            <div>السعر</div>
            <div>وقت التوصيل</div>
          </div>
          <div className="divide-y">
            {internationalRoutes.map((route, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 p-4 hover:bg-[#f8f4f0] transition-colors v7-fade-in v7-stagger-item"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <div>{route.from}</div>
                <div>{route.to}</div>
                <div className="font-medium text-[#e05d34]">{route.price}</div>
                <div>{route.time}</div>
              </div>
            ))}
          </div>
        </div>
        <Button variant="outline" className="mt-4 w-full v7-neu-button">
          عرض جميع الأسعار
        </Button>
      </TabsContent>
    </Tabs>
  )
}
