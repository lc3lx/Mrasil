"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { routes } from "@/lib/routes"
import { Save, X } from "lucide-react"

export function AddCustomerForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال البيانات
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // التنقل إلى صفحة العملاء بعد الإضافة
    router.push(routes.customers)
  }

  const handleCancel = () => {
    router.push(routes.customers)
  }

  return (
    <div className="space-y-6">
      <Card className="v7-neu-card">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic" className="v7-neu-tab">
                  معلومات أساسية
                </TabsTrigger>
                <TabsTrigger value="contact" className="v7-neu-tab">
                  معلومات الاتصال
                </TabsTrigger>
                <TabsTrigger value="shipping" className="v7-neu-tab">
                  معلومات الشحن
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerType">نوع العميل</Label>
                    <RadioGroup defaultValue="individual" className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">فرد</Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company">شركة</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل / اسم الشركة</Label>
                      <Input id="name" className="v7-neu-input" placeholder="أدخل الاسم الكامل أو اسم الشركة" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerCategory">فئة العميل</Label>
                      <Select defaultValue="small">
                        <SelectTrigger className="v7-neu-input">
                          <SelectValue placeholder="اختر فئة العميل" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">فرد</SelectItem>
                          <SelectItem value="small">شركة صغيرة</SelectItem>
                          <SelectItem value="medium">شركة متوسطة</SelectItem>
                          <SelectItem value="large">شركة كبيرة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                      <Input id="taxNumber" className="v7-neu-input" placeholder="أدخل الرقم الضريبي (اختياري)" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commercialRecord">السجل التجاري</Label>
                      <Input
                        id="commercialRecord"
                        className="v7-neu-input"
                        placeholder="أدخل رقم السجل التجاري (اختياري)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea id="notes" className="v7-neu-input" placeholder="أدخل أي ملاحظات إضافية عن العميل" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" className="v7-neu-input" placeholder="أدخل البريد الإلكتروني" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف</Label>
                      <Input id="phone" className="v7-neu-input" placeholder="أدخل رقم الهاتف" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="alternativePhone">رقم هاتف بديل</Label>
                      <Input
                        id="alternativePhone"
                        className="v7-neu-input"
                        placeholder="أدخل رقم هاتف بديل (اختياري)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">الموقع الإلكتروني</Label>
                      <Input id="website" className="v7-neu-input" placeholder="أدخل الموقع الإلكتروني (اختياري)" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                    <Input id="contactPerson" className="v7-neu-input" placeholder="أدخل اسم الشخص المسؤول (اختياري)" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">الدولة</Label>
                      <Select defaultValue="sa">
                        <SelectTrigger className="v7-neu-input">
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
                      <Select defaultValue="riyadh">
                        <SelectTrigger className="v7-neu-input">
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
                      <Input id="district" className="v7-neu-input" placeholder="أدخل اسم الحي" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان التفصيلي</Label>
                    <Textarea id="address" className="v7-neu-input" placeholder="أدخل العنوان التفصيلي" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">الرمز البريدي</Label>
                      <Input id="postalCode" className="v7-neu-input" placeholder="أدخل الرمز البريدي" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shippingNotes">ملاحظات الشحن</Label>
                      <Input id="shippingNotes" className="v7-neu-input" placeholder="أدخل أي ملاحظات خاصة بالشحن" />
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
                    <span>حفظ العميل</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
