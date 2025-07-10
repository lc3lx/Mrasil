"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"

export default function CreateReplacementPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(routes.replacements)
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">إنشاء طلب استبدال</h1>
          <p className="text-[#6d6a67]">إنشاء طلب استبدال جديد للمنتجات</p>
        </div>
        <Button variant="outline" className="v7-neu-button" onClick={() => router.push(routes.replacements)}>
          <X className="mr-2 h-4 w-4" />
          إلغاء
        </Button>
      </div>

      <div className="mb-6 flex justify-between">
        <div className={`flex-1 border-b-2 pb-2 ${step >= 1 ? "border-[#294D8B]" : "border-gray-200"}`}>
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= 1 ? "bg-[#294D8B] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <span className={`mr-2 ${step >= 1 ? "text-[#294D8B]" : "text-gray-500"}`}>معلومات المنتج الأصلي</span>
          </div>
        </div>
        <div className={`flex-1 border-b-2 pb-2 ${step >= 2 ? "border-[#294D8B]" : "border-gray-200"}`}>
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= 2 ? "bg-[#294D8B] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <span className={`mr-2 ${step >= 2 ? "text-[#294D8B]" : "text-gray-500"}`}>معلومات المنتج البديل</span>
          </div>
        </div>
        <div className={`flex-1 border-b-2 pb-2 ${step >= 3 ? "border-[#294D8B]" : "border-gray-200"}`}>
          <div className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step >= 3 ? "bg-[#294D8B] text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <span className={`mr-2 ${step >= 3 ? "text-[#294D8B]" : "text-gray-500"}`}>تأكيد الطلب</span>
          </div>
        </div>
      </div>

      <Card className="v7-neu-card">
        <CardHeader>
          <CardTitle>
            {step === 1 && "معلومات المنتج الأصلي"}
            {step === 2 && "معلومات المنتج البديل"}
            {step === 3 && "تأكيد طلب الاستبدال"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "يرجى إدخال معلومات المنتج الأصلي المراد استبداله"}
            {step === 2 && "يرجى إدخال معلومات المنتج البديل المطلوب"}
            {step === 3 && "مراجعة وتأكيد معلومات طلب الاستبدال"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="order-number">رقم الطلب الأصلي</Label>
                    <Input id="order-number" className="v7-neu-input" placeholder="أدخل رقم الطلب" />
                  </div>
                  <div>
                    <Label htmlFor="product-name">اسم المنتج</Label>
                    <Input id="product-name" className="v7-neu-input" placeholder="أدخل اسم المنتج" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="product-sku">رمز المنتج (SKU)</Label>
                    <Input id="product-sku" className="v7-neu-input" placeholder="أدخل رمز المنتج" />
                  </div>
                  <div>
                    <Label htmlFor="product-price">سعر المنتج</Label>
                    <Input id="product-price" className="v7-neu-input" placeholder="أدخل سعر المنتج" type="number" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="return-reason">سبب الاستبدال</Label>
                  <Select>
                    <SelectTrigger className="v7-neu-select">
                      <SelectValue placeholder="اختر سبب الاستبدال" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defective">منتج معيب</SelectItem>
                      <SelectItem value="wrong-item">منتج خاطئ</SelectItem>
                      <SelectItem value="not-as-described">لا يطابق الوصف</SelectItem>
                      <SelectItem value="damaged">تالف عند الاستلام</SelectItem>
                      <SelectItem value="other">سبب آخر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">وصف المشكلة</Label>
                  <Textarea id="description" className="v7-neu-textarea" placeholder="اشرح المشكلة بالتفصيل" rows={4} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="replacement-product">المنتج البديل</Label>
                    <Input id="replacement-product" className="v7-neu-input" placeholder="أدخل اسم المنتج البديل" />
                  </div>
                  <div>
                    <Label htmlFor="replacement-sku">رمز المنتج البديل (SKU)</Label>
                    <Input id="replacement-sku" className="v7-neu-input" placeholder="أدخل رمز المنتج البديل" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="replacement-price">سعر المنتج البديل</Label>
                    <Input
                      id="replacement-price"
                      className="v7-neu-input"
                      placeholder="أدخل سعر المنتج البديل"
                      type="number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price-difference">فرق السعر</Label>
                    <Input
                      id="price-difference"
                      className="v7-neu-input"
                      placeholder="فرق السعر"
                      type="number"
                      readOnly
                      value="50"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment-method">طريقة دفع فرق السعر (إن وجد)</Label>
                  <Select>
                    <SelectTrigger className="v7-neu-select">
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">بطاقة ائتمان</SelectItem>
                      <SelectItem value="bank-transfer">تحويل بنكي</SelectItem>
                      <SelectItem value="cash">نقداً عند الاستلام</SelectItem>
                      <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    className="v7-neu-textarea"
                    placeholder="أي ملاحظات إضافية حول المنتج البديل"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-6">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-lg font-medium">معلومات المنتج الأصلي</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">رقم الطلب:</span>
                      <span className="font-medium">ORD-2023-5678</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">اسم المنتج:</span>
                      <span className="font-medium">سماعات بلوتوث</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">رمز المنتج:</span>
                      <span className="font-medium">BT-HEADSET-001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">سعر المنتج:</span>
                      <span className="font-medium">250 ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">سبب الاستبدال:</span>
                      <span className="font-medium">منتج معيب</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 text-lg font-medium">معلومات المنتج البديل</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">اسم المنتج:</span>
                      <span className="font-medium">سماعات بلوتوث - موديل متطور</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">رمز المنتج:</span>
                      <span className="font-medium">BT-HEADSET-PRO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">سعر المنتج:</span>
                      <span className="font-medium">300 ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">فرق السعر:</span>
                      <span className="font-medium text-[#294D8B]">+50 ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6d6a67]">طريقة الدفع:</span>
                      <span className="font-medium">بطاقة ائتمان</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    بالضغط على زر "تأكيد الطلب"، أنت توافق على شروط وأحكام خدمة الاستبدال. يرجى العلم أن طلب الاستبدال
                    سيخضع للمراجعة قبل الموافقة النهائية.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" className="v7-neu-button" onClick={handlePrevious}>
                  السابق
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="v7-neu-button"
                  onClick={() => router.push(routes.replacements)}
                >
                  إلغاء
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" className="v7-neu-button-accent" onClick={handleNext}>
                  التالي
                  <ArrowRight className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="v7-neu-button-accent">
                  <Save className="mr-2 h-4 w-4" />
                  تأكيد الطلب
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
