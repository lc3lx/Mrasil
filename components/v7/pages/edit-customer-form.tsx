"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { routes } from "@/lib/routes"
import { ArrowRight, Save, X, User } from "lucide-react"

// بيانات وهمية للعميل
const getCustomerData = (id: string) => {
  // في الواقع، هنا ستقوم بجلب بيانات العميل من API
  return {
    id,
    name: id === "c001" ? "شركة الأمل" : id === "c002" ? "مؤسسة النور" : "أحمد محمد",
    type: id === "c001" || id === "c002" ? "company" : "individual",
    category: id === "c001" ? "medium" : id === "c002" ? "small" : "individual",
    email: id === "c001" ? "info@alamal.com" : id === "c002" ? "contact@alnoor.com" : "ahmed@example.com",
    phone: id === "c001" ? "+966 55 123 4567" : id === "c002" ? "+966 50 987 6543" : "+966 54 111 2222",
    alternativePhone: id === "c001" ? "+966 55 765 4321" : "",
    website: id === "c001" ? "www.alamal.com" : id === "c002" ? "www.alnoor.com" : "",
    contactPerson: id === "c001" || id === "c002" ? "محمد العبدالله" : "",
    country: "sa",
    city: id === "c001" ? "riyadh" : id === "c002" ? "jeddah" : "dammam",
    district: "حي النزهة",
    address: "شارع الملك فهد، مبنى رقم 125",
    postalCode: "12345",
    taxNumber: id === "c001" || id === "c002" ? "300012345600003" : "",
    commercialRecord: id === "c001" || id === "c002" ? "1010123456" : "",
    notes: id === "c001" ? "عميل مميز منذ 2020" : "",
    shippingNotes: id === "c001" ? "يفضل التسليم صباحاً" : "",
  }
}

interface EditCustomerFormProps {
  id: string
}

export function EditCustomerForm({ id }: EditCustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const customerData = getCustomerData(id)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال البيانات
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // التنقل إلى صفحة تفاصيل العميل بعد التعديل
    router.push(routes.customerDetails(id))
  }

  const handleCancel = () => {
    router.push(routes.customerDetails(id))
  }

  return (
    <div className="space-y-6">
      <div className={`v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "0.2s" }}>
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" className="v7-neu-button-sm" onClick={handleCancel}>
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">رجوع</span>
          </Button>
          <div>
            <h3 className="text-xl font-bold text-[#3498db]">تعديل بيانات {customerData.name}</h3>
          </div>
        </div>

        <Card className="v7-neu-card">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-[#3498db]" />
              الاسم
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">{/* تم حذف حقل الاسم الكامل / اسم الشركة */}</div>

              <Tabs defaultValue="contact" className="w-full mt-6">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="contact" className="v7-neu-tab">
                    معلومات الاتصال
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="v7-neu-tab">
                    معلومات الشحن
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">اسم العميل</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          className="v7-neu-input"
                          placeholder="أدخل اسم العميل"
                          defaultValue={customerData.name}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          name="phone"
                          className="v7-neu-input"
                          placeholder="أدخل رقم الهاتف"
                          defaultValue={customerData.phone}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="alternativePhone">رقم هاتف بديل</Label>
                        <Input
                          id="alternativePhone"
                          name="alternativePhone"
                          className="v7-neu-input"
                          placeholder="أدخل رقم هاتف بديل (اختياري)"
                          defaultValue={customerData.alternativePhone}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email2">البريد الإلكتروني</Label>
                        <Input
                          id="email2"
                          name="email2"
                          type="email"
                          className="v7-neu-input"
                          placeholder="أدخل البريد الإلكتروني"
                          defaultValue={customerData.email}
                        />
                      </div>
                    </div>

                    {/* تم حذف حقل الشخص المسؤول */}

                    <div className="space-y-4">
                      {/* تم حذف حقول الرقم الضريبي والسجل التجاري */}

                      <div className="space-y-2">
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          className="v7-neu-input"
                          placeholder="أدخل أي ملاحظات إضافية عن العميل"
                          defaultValue={customerData.notes}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">الدولة</Label>
                        <Select defaultValue={customerData.country}>
                          <SelectTrigger className="v7-neu-input border-2 border-[#3498db]/30 shadow-md hover:shadow-lg hover:border-[#3498db]/50 font-medium transition-all duration-300">
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sa">المملكة العربية السعودية</SelectItem>
                            <SelectItem value="ae">الإمارات العربية المتحدة</SelectItem>
                            <SelectItem value="kw">الكويت</SelectItem>
                            <SelectItem value="bh">البحرين</SelectItem>
                            <SelectItem value="qa">قطر</SelectItem>
                            <SelectItem value="om">عمان</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة</Label>
                        <Select defaultValue={customerData.city}>
                          <SelectTrigger className="v7-neu-input border-2 border-[#3498db]/30 shadow-md hover:shadow-lg hover:border-[#3498db]/50 font-medium transition-all duration-300">
                            <SelectValue placeholder="اختر المدينة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="riyadh">الرياض</SelectItem>
                            <SelectItem value="jeddah">جدة</SelectItem>
                            <SelectItem value="dammam">الدمام</SelectItem>
                            <SelectItem value="makkah">مكة المكرمة</SelectItem>
                            <SelectItem value="madinah">المدينة المنورة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">الحي</Label>
                        <Input
                          id="district"
                          name="district"
                          className="v7-neu-input"
                          placeholder="أدخل اسم الحي"
                          defaultValue={customerData.district}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">العنوان التفصيلي</Label>
                      <Textarea
                        id="address"
                        name="address"
                        className="v7-neu-input"
                        placeholder="أدخل العنوان التفصيلي"
                        defaultValue={customerData.address}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">الرمز البريدي</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          className="v7-neu-input"
                          placeholder="أدخل الرمز البريدي"
                          defaultValue={customerData.postalCode}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shippingNotes">ملاحظات الشحن</Label>
                        <Input
                          id="shippingNotes"
                          name="shippingNotes"
                          className="v7-neu-input"
                          placeholder="أدخل أي ملاحظات خاصة بالشحن"
                          defaultValue={customerData.shippingNotes}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" className="v7-neu-button-sm gap-2" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                  <span>إلغاء</span>
                </Button>

                <Button type="submit" className="v7-neu-button-primary gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>حفظ التغييرات</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
