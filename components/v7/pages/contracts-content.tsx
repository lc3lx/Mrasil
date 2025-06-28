"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Calendar, Edit, Trash, ExternalLink } from "lucide-react"

// بيانات وهمية للعقود
const dummyContracts = [
  {
    id: "1",
    name: "عقد شحن أرامكس - الرياض",
    carrier: "أرامكس",
    contractNumber: "ARA-2023-1045",
    startDate: "2023-01-15",
    endDate: "2024-01-14",
    status: "active",
  },
  {
    id: "2",
    name: "عقد شحن دي إتش إل - المنطقة الشرقية",
    carrier: "دي إتش إل",
    contractNumber: "DHL-2023-8732",
    startDate: "2023-03-01",
    endDate: "2024-02-28",
    status: "active",
  },
  {
    id: "3",
    name: "عقد شحن فيديكس - جدة",
    carrier: "فيديكس",
    contractNumber: "FDX-2022-5421",
    startDate: "2022-11-10",
    endDate: "2023-11-09",
    status: "expired",
  },
]

export function ContractsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // تصفية العقود بناءً على البحث
  const filteredContracts = dummyContracts.filter(
    (contract) =>
      contract.name.includes(searchQuery) ||
      contract.carrier.includes(searchQuery) ||
      contract.contractNumber.includes(searchQuery),
  )

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">العقود الخاصة</h1>
          <p className="text-gray-500">إدارة عقود الشحن الخاصة بك مع شركات الشحن</p>
        </div>
        <Button className="v7-neu-button-primary" onClick={() => router.push("/contracts/add")}>
          <Plus className="ml-2 h-4 w-4" />
          أضف عقدك الخاص
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pr-10"
            placeholder="ابحث عن عقد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <Card key={contract.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gray-50 p-6 flex items-center justify-center md:w-16">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{contract.name}</h3>
                        <p className="text-sm text-gray-500">
                          {contract.carrier} | رقم العقد: {contract.contractNumber}
                        </p>
                      </div>
                      <Badge
                        className={
                          contract.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {contract.status === "active" ? "ساري" : "منتهي"}
                      </Badge>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                        <span>تاريخ البداية: {formatDate(contract.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 ml-2 text-gray-400" />
                        <span>تاريخ الانتهاء: {formatDate(contract.endDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end p-4 gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">لا توجد عقود</h3>
            <p className="text-sm text-gray-500 mb-6">لم يتم العثور على أي عقود مطابقة لبحثك</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              عرض جميع العقود
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
