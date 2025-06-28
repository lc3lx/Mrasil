"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Upload,
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { routes } from "@/lib/routes"

// مكون خطوات النموذج
function FormSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, title: "معلومات أساسية" },
    { number: 2, title: "معلومات الاتصال" },
    { number: 3, title: "خدمات الشحن" },
    { number: 4, title: "الاتفاقية والتعاقد" },
  ]

  return (
    <div className="flex justify-between mb-8">
      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
              step.number === currentStep
                ? "bg-blue-500 text-white"
                : step.number < currentStep
                  ? "bg-green-500 text-white"
                  : "v7-neu-step text-gray-400"
            }`}
          >
            {step.number < currentStep ? <Check className="h-5 w-5" /> : step.number}
          </div>
          <span className={`text-sm ${step.number === currentStep ? "font-medium" : "text-gray-500"}`}>
            {step.title}
          </span>
        </div>
      ))}
    </div>
  )
}

export function AddCarrierForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    logo: "",
    description: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    services: [] as string[],
    coverageAreas: [] as string[],
    deliveryTimes: {
      local: "",
      international: "",
    },
    pricing: {
      baseRate: "",
      additionalKgRate: "",
    },
    agreement: {
      startDate: "",
      endDate: "",
      terms: "",
    },
  })

  // التعامل مع تغيير الخطوة
  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // التعامل مع تغيير البيانات
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // التعامل مع تغيير الخدمات
  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, service],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s !== service),
      }))
    }
  }

  // التعامل مع تغيير مناطق التغطية
  const handleCoverageChange = (area: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        coverageAreas: [...prev.coverageAreas, area],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        coverageAreas: prev.coverageAreas.filter((a) => a !== area),
      }))
    }
  }

  // التعامل مع إرسال النموذج
  const handleSubmit = () => {
    console.log("تم إرسال البيانات:", formData)
    // هنا يمكن إضافة الاتصال بالخادم لحفظ البيانات
    router.push(routes.carriers)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="v7-neu-button-secondary ml-2" onClick={() => router.push(routes.carriers)}>
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold">إضافة شركة شحن جديدة</h1>
      </div>

      <div className="v7-neu-card p-6 rounded-xl">
        <FormSteps currentStep={currentStep} />

        {/* الخطوة 1: المعلومات الأساسية */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name">اسم الشركة</Label>
                  <Input
                    id="name"
                    className="v7-neu-input mt-1"
                    placeholder="أدخل اسم شركة الشحن"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="type">نوع الشركة</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                    <SelectTrigger id="type" className="v7-neu-select mt-1">
                      <SelectValue placeholder="اختر نوع الشركة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="محلي">محلي</SelectItem>
                      <SelectItem value="دولي">دولي</SelectItem>
                      <SelectItem value="محلي ودولي">محلي ودولي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">وصف الشركة</Label>
                  <Textarea
                    id="description"
                    className="v7-neu-input mt-1"
                    placeholder="أدخل وصفاً مختصراً للشركة وخدماتها"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Label>شعار الشركة</Label>
                  <div className="mt-1 v7-neu-card p-8 rounded-xl flex flex-col items-center justify-center">
                    {formData.logo ? (
                      <div className="relative">
                        <img
                          src={formData.logo || "/placeholder.svg"}
                          alt="شعار الشركة"
                          className="w-32 h-32 object-contain"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 v7-neu-button-secondary"
                          onClick={() => handleChange("logo", "")}
                        >
                          تغيير الشعار
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="v7-neu-icon-lg mb-4">
                          <Upload className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 mb-2">اسحب وأفلت الشعار هنا أو</p>
                        <Button
                          variant="outline"
                          className="v7-neu-button-secondary"
                          onClick={() => handleChange("logo", "/fast-delivery-logo.png")}
                        >
                          اختر ملفاً
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button className="v7-neu-button-primary" onClick={handleNextStep}>
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* الخطوة 2: معلومات الاتصال */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                <div className="relative mt-1">
                  <Input
                    id="contactPerson"
                    className="v7-neu-input pl-10"
                    placeholder="اسم الشخص المسؤول"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                  />
                  <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <div className="relative mt-1">
                  <Input
                    id="phone"
                    className="v7-neu-input pl-10"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative mt-1">
                  <Input
                    id="email"
                    type="email"
                    className="v7-neu-input pl-10"
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="website">الموقع الإلكتروني</Label>
                <div className="relative mt-1">
                  <Input
                    id="website"
                    className="v7-neu-input pl-10"
                    placeholder="الموقع الإلكتروني"
                    value={formData.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                  <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">العنوان</Label>
              <div className="relative mt-1">
                <Textarea
                  id="address"
                  className="v7-neu-input pl-10"
                  placeholder="العنوان التفصيلي"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
                <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="v7-neu-button-secondary" onClick={handlePrevStep}>
                السابق
              </Button>
              <Button className="v7-neu-button-primary" onClick={handleNextStep}>
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* الخطوة 3: خدمات الشحن */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="v7-neu-card p-4 rounded-xl">
                <h3 className="text-lg font-medium mb-4">خدمات الشحن المتاحة</h3>
                <div className="space-y-3">
                  {[
                    "شحن بري",
                    "شحن جوي",
                    "شحن بحري",
                    "توصيل سريع",
                    "خدمات التخزين",
                    "التغليف",
                    "التتبع المباشر",
                    "التأمين على الشحنات",
                  ].map((service) => (
                    <div key={service} className="flex items-center">
                      <Checkbox
                        id={`service-${service}`}
                        checked={formData.services.includes(service)}
                        onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                      />
                      <Label htmlFor={`service-${service}`} className="mr-2">
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="v7-neu-card p-4 rounded-xl">
                <h3 className="text-lg font-medium mb-4">مناطق التغطية</h3>
                <div className="space-y-3">
                  {[
                    "المنطقة الوسطى",
                    "المنطقة الشرقية",
                    "المنطقة الغربية",
                    "المنطقة الشمالية",
                    "المنطقة الجنوبية",
                    "دول الخليج",
                    "الشرق الأوسط",
                    "دولي",
                  ].map((area) => (
                    <div key={area} className="flex items-center">
                      <Checkbox
                        id={`area-${area}`}
                        checked={formData.coverageAreas.includes(area)}
                        onCheckedChange={(checked) => handleCoverageChange(area, checked as boolean)}
                      />
                      <Label htmlFor={`area-${area}`} className="mr-2">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="localDelivery">متوسط وقت التوصيل المحلي</Label>
                <div className="relative mt-1">
                  <Input
                    id="localDelivery"
                    className="v7-neu-input pl-10"
                    placeholder="مثال: 1-2 أيام عمل"
                    value={formData.deliveryTimes.local}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryTimes: {
                          ...formData.deliveryTimes,
                          local: e.target.value,
                        },
                      })
                    }
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="internationalDelivery">متوسط وقت التوصيل الدولي</Label>
                <div className="relative mt-1">
                  <Input
                    id="internationalDelivery"
                    className="v7-neu-input pl-10"
                    placeholder="مثال: 3-5 أيام عمل"
                    value={formData.deliveryTimes.international}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryTimes: {
                          ...formData.deliveryTimes,
                          international: e.target.value,
                        },
                      })
                    }
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="v7-neu-button-secondary" onClick={handlePrevStep}>
                السابق
              </Button>
              <Button className="v7-neu-button-primary" onClick={handleNextStep}>
                التالي
              </Button>
            </div>
          </div>
        )}

        {/* الخطوة 4: الاتفاقية والتعاقد */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="startDate">تاريخ بداية التعاقد</Label>
                <div className="relative mt-1">
                  <Input
                    id="startDate"
                    type="date"
                    className="v7-neu-input"
                    value={formData.agreement.startDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          startDate: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endDate">تاريخ نهاية التعاقد</Label>
                <div className="relative mt-1">
                  <Input
                    id="endDate"
                    type="date"
                    className="v7-neu-input"
                    value={formData.agreement.endDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        agreement: {
                          ...formData.agreement,
                          endDate: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="baseRate">السعر الأساسي</Label>
                <div className="relative mt-1">
                  <Input
                    id="baseRate"
                    className="v7-neu-input pl-10"
                    placeholder="السعر الأساسي للشحنة"
                    value={formData.pricing.baseRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          baseRate: e.target.value,
                        },
                      })
                    }
                  />
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalKgRate">سعر الكيلوجرام الإضافي</Label>
                <div className="relative mt-1">
                  <Input
                    id="additionalKgRate"
                    className="v7-neu-input pl-10"
                    placeholder="سعر الكيلوجرام الإضافي"
                    value={formData.pricing.additionalKgRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing: {
                          ...formData.pricing,
                          additionalKgRate: e.target.value,
                        },
                      })
                    }
                  />
                  <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="terms">شروط وأحكام التعاقد</Label>
              <div className="relative mt-1">
                <Textarea
                  id="terms"
                  className="v7-neu-input pl-10"
                  placeholder="أدخل شروط وأحكام التعاقد مع الشركة"
                  rows={4}
                  value={formData.agreement.terms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agreement: {
                        ...formData.agreement,
                        terms: e.target.value,
                      },
                    })
                  }
                />
                <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" className="v7-neu-button-secondary" onClick={handlePrevStep}>
                السابق
              </Button>
              <Button className="v7-neu-button-primary" onClick={handleSubmit}>
                حفظ وإنهاء
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
