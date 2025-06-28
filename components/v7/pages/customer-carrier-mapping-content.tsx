"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Filter,
  ArrowLeft,
  UserPlus,
  Users,
  Building,
  CheckCircle,
  X,
  Globe,
  Clock,
  Home,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// بيانات وهمية للعملاء
const customers = [
  {
    id: "c001",
    name: "شركة الأمل",
    type: "شركة متوسطة",
    email: "info@alamal.com",
    phone: "+966 55 123 4567",
    city: "الرياض",
    preferredCarriers: ["1", "4"], // IDs of preferred carriers
  },
  {
    id: "c002",
    name: "مؤسسة النور",
    type: "شركة صغيرة",
    email: "contact@alnoor.com",
    phone: "+966 50 987 6543",
    city: "جدة",
    preferredCarriers: ["2", "5"],
  },
  {
    id: "c003",
    name: "أحمد محمد",
    type: "فرد",
    email: "ahmed@example.com",
    phone: "+966 54 111 2222",
    city: "الدمام",
    preferredCarriers: ["3"],
  },
  {
    id: "c004",
    name: "شركة التقدم",
    type: "شركة كبيرة",
    email: "info@progress.com",
    phone: "+966 56 555 7777",
    city: "الرياض",
    preferredCarriers: ["1", "2", "4"],
  },
  {
    id: "c005",
    name: "مؤسسة الإبداع",
    type: "شركة صغيرة",
    email: "info@creativity.com",
    phone: "+966 59 333 4444",
    city: "مكة",
    preferredCarriers: [],
  },
]

// بيانات وهمية لشركات الشحن (نفس البيانات من صفحة شركات الشحن)
const carriers = [
  {
    id: "1",
    name: "ثابت",
    logo: "/carriers/thabit-logo.png",
    type: "محلي",
    status: "نشط",
    rating: 4.8,
    deliveryTime: "1-2 أيام",
    coverage: ["الرياض", "جدة", "الدمام", "مكة"],
    active: true,
  },
  {
    id: "2",
    name: "J&T",
    logo: "/carriers/jt-logo.png",
    type: "دولي",
    status: "نشط",
    rating: 4.5,
    deliveryTime: "2-3 أيام",
    coverage: ["المملكة العربية السعودية", "دول الخليج", "الشرق الأوسط"],
    active: true,
  },
  {
    id: "3",
    name: "سمسا",
    logo: "/carriers/smsa-logo.png",
    type: "دولي",
    status: "نشط",
    rating: 4.7,
    deliveryTime: "1-3 أيام",
    coverage: ["جميع مناطق المملكة", "دول الخليج", "الشرق الأوسط"],
    active: false,
  },
  {
    id: "4",
    name: "أرامكس",
    logo: "/carriers/aramex-logo.png",
    type: "دولي",
    status: "نشط",
    rating: 4.9,
    deliveryTime: "2-4 أيام",
    coverage: ["جميع أنحاء العالم"],
    active: true,
  },
  {
    id: "5",
    name: "أي مكان",
    logo: "/carriers/aymakan-logo.png",
    type: "محلي",
    status: "نشط",
    rating: 4.3,
    deliveryTime: "1-2 أيام",
    coverage: ["الرياض", "جدة", "الدمام", "المدينة المنورة"],
    active: true,
  },
  {
    id: "6",
    name: "أي مايل",
    logo: "/carriers/imile-logo.png",
    type: "دولي",
    status: "نشط",
    rating: 4.6,
    deliveryTime: "2-5 أيام",
    coverage: ["المملكة العربية السعودية", "الإمارات", "مصر"],
    active: false,
  },
]

// مكون بطاقة العميل
function CustomerCard({ customer, onManageCarriers }: { customer: any; onManageCarriers: (customer: any) => void }) {
  const preferredCarriersCount = customer.preferredCarriers.length
  const hasPreferredCarriers = preferredCarriersCount > 0

  return (
    <Card className="v7-neu-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{customer.name}</CardTitle>
            <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
              {customer.type}
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="v7-neu-button-sm" onClick={() => onManageCarriers(customer)}>
            <UserPlus className="h-4 w-4 ml-1" />
            إدارة الربط
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-3 text-right">
            <div className="flex items-center justify-between">
              <div className="text-blue-600">
                <Mail className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-medium ml-1">البريد الإلكتروني:</span>
                <span className="text-gray-600">{customer.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-green-600">
                <Phone className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-medium ml-1">الهاتف:</span>
                <span className="text-gray-600">{customer.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-purple-600">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-medium ml-1">المدينة:</span>
                <span className="text-gray-600">{customer.city}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex justify-between items-center mb-3">
              <Badge variant={hasPreferredCarriers ? "outline" : "secondary"} className="text-xs">
                {preferredCarriersCount} شركات
              </Badge>
              <span className="text-sm font-medium">شركات الشحن المفضلة</span>
            </div>

            {hasPreferredCarriers ? (
              <div className="grid grid-cols-2 gap-2">
                {customer.preferredCarriers.map((carrierId: string) => {
                  const carrier = carriers.find((c) => c.id === carrierId)
                  if (!carrier) return null
                  return (
                    <div
                      key={carrierId}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-2 border border-gray-100"
                    >
                      <span className="text-xs text-gray-700">{carrier.name}</span>
                      <div className="w-6 h-6 relative">
                        <Image
                          src={carrier.logo || "/carriers/carrier-placeholder.png"}
                          alt={carrier.name}
                          fill
                          className="object-contain rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-sm text-center text-gray-500 p-2 bg-gray-50 rounded-lg">
                لم يتم تحديد شركات شحن مفضلة
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// تعديل مكون نافذة إدارة ربط شركات الشحن
function CarrierMappingDialog({
  customer,
  isOpen,
  onClose,
  onSave,
}: {
  customer: any
  isOpen: boolean
  onClose: () => void
  onSave: (customerId: string, carrierIds: string[]) => void
}) {
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([])

  // تحديث الشركات المحددة عند فتح النافذة
  useState(() => {
    if (customer) {
      setSelectedCarriers([...customer.preferredCarriers])
    }
  })

  // تبديل حالة اختيار شركة الشحن
  const toggleCarrier = (carrierId: string) => {
    if (selectedCarriers.includes(carrierId)) {
      setSelectedCarriers(selectedCarriers.filter((id) => id !== carrierId))
    } else {
      setSelectedCarriers([...selectedCarriers, carrierId])
    }
  }

  // حفظ التغييرات
  const handleSave = () => {
    if (customer) {
      onSave(customer.id, selectedCarriers)
      onClose()
    }
  }

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>ربط شركات الشحن مع {customer.name}</DialogTitle>
          <DialogDescription>حدد شركات الشحن المفضلة لهذا العميل</DialogDescription>
        </DialogHeader>

        <div className="my-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carriers.map((carrier) => (
              <div
                key={carrier.id}
                className={`bg-gray-50 rounded-xl overflow-hidden transition-all ${
                  selectedCarriers.includes(carrier.id) ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <div className="bg-white p-4 flex justify-center">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={carrier.logo || "/carriers/carrier-placeholder.png"}
                      alt={carrier.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="p-4 pt-2 text-center">
                  <h3 className="text-xl font-bold mb-2">{carrier.name}</h3>

                  <div className="flex justify-center mb-3">
                    <Badge
                      variant="outline"
                      className={
                        carrier.type === "دولي"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {carrier.type}
                    </Badge>
                  </div>

                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <div className="text-emerald-600">
                        <Globe className="h-4 w-4" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium ml-1">التغطية:</span>
                        <span className="text-gray-600">
                          {carrier.coverage[0]}
                          {carrier.coverage.length > 1 ? "، ..." : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-blue-600">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium ml-1">وقت التسليم:</span>
                        <span className="text-gray-600">{carrier.deliveryTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-purple-600">
                        <Home className="h-4 w-4" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium ml-1">التوصيل من الباب للباب:</span>
                        <span className="text-gray-600">{carrier.active ? "متوفر" : "غير متوفر"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-sm ${carrier.active ? "text-green-600" : "text-gray-400"}`}>
                      {carrier.active ? "تفعيل" : "غير مفعل"}
                    </span>
                    <Switch
                      checked={selectedCarriers.includes(carrier.id)}
                      onCheckedChange={() => toggleCarrier(carrier.id)}
                      className={selectedCarriers.includes(carrier.id) ? "bg-blue-600" : ""}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} className="v7-neu-button-secondary">
            <X className="h-4 w-4 ml-1" />
            إلغاء
          </Button>
          <Button onClick={handleSave} className="v7-neu-button-primary">
            <CheckCircle className="h-4 w-4 ml-1" />
            حفظ التغييرات ({selectedCarriers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// المكون الرئيسي
export function CustomerCarrierMappingContent() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [customersList, setCustomersList] = useState(customers)

  // حالة نافذة إدارة ربط شركات الشحن
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // فتح نافذة إدارة ربط شركات الشحن
  const openCarrierMappingDialog = (customer: any) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  // حفظ ربط شركات الشحن
  const saveCarrierMapping = (customerId: string, carrierIds: string[]) => {
    setCustomersList((prevList) =>
      prevList.map((customer) =>
        customer.id === customerId ? { ...customer, preferredCarriers: carrierIds } : customer,
      ),
    )
  }

  // تصفية العملاء حسب البحث والفلاتر
  const filteredCustomers = customersList.filter((customer) => {
    const matchesSearch =
      customer.name.includes(searchTerm) || customer.email.includes(searchTerm) || customer.phone.includes(searchTerm)

    // تطبيق الفلتر المحدد
    let matchesFilter = true
    switch (filterOption) {
      case "with-carriers":
        matchesFilter = customer.preferredCarriers.length > 0
        break
      case "without-carriers":
        matchesFilter = customer.preferredCarriers.length === 0
        break
      case "company":
        matchesFilter = customer.type.includes("شركة")
        break
      case "individual":
        matchesFilter = customer.type === "فرد"
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  // حساب إحصائيات العملاء
  const totalCustomers = customersList.length
  const customersWithCarriers = customersList.filter((c) => c.preferredCarriers.length > 0).length
  const companiesCount = customersList.filter((c) => c.type.includes("شركة")).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">ربط العملاء بشركات الشحن</h1>
          <p className="text-gray-500">إدارة شركات الشحن المفضلة لكل عميل</p>
        </div>
        <Button variant="outline" className="v7-neu-button-secondary" onClick={() => router.back()}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى شركات الشحن
        </Button>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="v7-neu-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">إجمالي العملاء</p>
              <h3 className="text-2xl font-bold">{totalCustomers}</h3>
            </div>
            <div className="v7-neu-icon-lg v7-icon-blue">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="v7-neu-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">العملاء مع شركات شحن</p>
              <h3 className="text-2xl font-bold">{customersWithCarriers}</h3>
              <p className="text-xs mt-1 text-green-500">{`${Math.round(
                (customersWithCarriers / totalCustomers) * 100,
              )}% من الإجمالي`}</p>
            </div>
            <div className="v7-neu-icon-lg v7-icon-green">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="v7-neu-card p-5 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">الشركات</p>
              <h3 className="text-2xl font-bold">{companiesCount}</h3>
            </div>
            <div className="v7-neu-icon-lg v7-icon-purple">
              <Building className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="v7-neu-card p-5 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث عن عميل..."
              className="pl-10 v7-neu-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-64">
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger className="v7-neu-select">
                <div className="flex items-center shadow-md border border-gray-200 rounded-md p-1 bg-white">
                  <Filter className="h-4 w-4 ml-2" />
                  <SelectValue placeholder="الفلاتر" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع العملاء</SelectItem>
                <SelectItem value="with-carriers">عملاء مع شركات شحن</SelectItem>
                <SelectItem value="without-carriers">عملاء بدون شركات شحن</SelectItem>
                <SelectItem value="company">الشركات</SelectItem>
                <SelectItem value="individual">الأفراد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* شبكة بطاقات العملاء */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} onManageCarriers={openCarrierMappingDialog} />
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-500">لا توجد نتائج مطابقة</h3>
          <p className="text-gray-400 mt-2">يرجى تغيير معايير البحث والمحاولة مرة أخرى</p>
        </div>
      )}

      {/* نافذة إدارة ربط شركات الشحن */}
      <CarrierMappingDialog
        customer={selectedCustomer}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setSelectedCustomer(null)
        }}
        onSave={saveCarrierMapping}
      />
    </div>
  )
}
