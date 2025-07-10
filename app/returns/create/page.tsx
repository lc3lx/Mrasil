"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  MapPin,
  Package,
  RotateCcw,
  Search,
  Upload,
  AlertCircle,
} from "lucide-react"
import { routes } from "@/lib/routes"

// بيانات وهمية للطلبات السابقة
const previousOrders = [
  {
    id: "ORD-78952",
    date: "2023-03-28",
    total: 245.5,
    items: [
      { id: "ITEM-001", name: "سماعات لاسلكية", sku: "SKU-8745", price: 199.0, quantity: 1 },
      { id: "ITEM-002", name: "شاحن سريع", sku: "SKU-5421", price: 46.5, quantity: 1 },
    ],
  },
  {
    id: "ORD-78456",
    date: "2023-03-15",
    total: 320.75,
    items: [
      { id: "ITEM-003", name: "حافظة هاتف", sku: "SKU-2245", price: 75.0, quantity: 1 },
      { id: "ITEM-004", name: "ساعة ذكية", sku: "SKU-7741", price: 245.75, quantity: 1 },
    ],
  },
  {
    id: "ORD-77521",
    date: "2023-02-22",
    total: 129.99,
    items: [{ id: "ITEM-005", name: "ماوس لاسلكي", sku: "SKU-3241", price: 129.99, quantity: 1 }],
  },
]

const returnReasons = [
  "المنتج معيب",
  "المنتج تالف",
  "المنتج مختلف عن الوصف",
  "تم استلام منتج خاطئ",
  "تغيير الرأي",
  "لا يناسب الحجم أو اللون",
  "وصل متأخرًا",
  "سبب آخر",
]

export default function CreateReturnPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orderSearchQuery, setOrderSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [returnMethod, setReturnMethod] = useState("pickup")
  const [formData, setFormData] = useState({
    reasons: {} as Record<string, string>,
    description: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    refundMethod: "original",
    waybillReturnReason: "",
    waybillNotes: "",
  })

  // معالج التغيير للحقول النصية
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // معالج التغيير للقوائم
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // معالج تغيير السبب لمنتج محدد
  const handleReasonChange = (itemId: string, reason: string) => {
    setFormData((prev) => ({
      ...prev,
      reasons: { ...prev.reasons, [itemId]: reason },
    }))
  }

  // إضافة/إزالة منتج من قائمة الاختيار
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId)
      } else {
        return [...prev, itemId]
      }
    })
  }

  // انتقال للخطوة التالية
  const nextStep = () => {
    setStep((prev) => prev + 1)
    window.scrollTo(0, 0)
  }

  // العودة للخطوة السابقة
  const prevStep = () => {
    setStep((prev) => prev - 1)
    window.scrollTo(0, 0)
  }

  // تقديم النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // هنا يتم إرسال البيانات للخادم
    alert("تم إنشاء طلب الرجيع بنجاح!")
    router.push(routes.returns)
  }

  // تصفية الطلبات بناءً على البحث
  const filteredOrders = previousOrders.filter((order) => {
    if (!orderSearchQuery) return true
    return (
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(orderSearchQuery.toLowerCase()))
    )
  })

  // الحصول على معلومات الطلب المحدد
  const getSelectedOrderDetails = () => {
    return previousOrders.find((order) => order.id === selectedOrder) || null
  }

  // الحصول على المنتجات المحددة
  const getSelectedItems = () => {
    const order = getSelectedOrderDetails()
    if (!order) return []
    return order.items.filter((item) => selectedItems.includes(item.id))
  }

  return (
    <V7Layout>
      <V7Content>
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
          {/* رأس الصفحة */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#3498db] mb-2">إنشاء طلب رجيع</h1>
              <p className="text-sm text-[#6d6a67]">قم بإنشاء طلب رجيع لمنتج أو عدة منتجات من طلباتك السابقة</p>
            </div>
            <button onClick={() => router.push(routes.returns)} className="v7-neu-button-flat flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              <span>العودة للمرتجعات</span>
            </button>
          </div>

          {/* نموذج خطوات إنشاء طلب الرجيع */}
          <div className="v7-neu-card p-8 rounded-xl">
            {/* شريط التقدم */}
            <div className="mb-10">
              <div className="flex justify-between">
                <div className={`flex flex-col items-center ${step >= 1 ? "text-[#3498db]" : "text-[#6d6a67]"}`}>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step > 1
                        ? "bg-[#3498db] text-white shadow-md shadow-[#3498db]/30"
                        : step === 1
                          ? "v7-neu-icon-active"
                          : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 1 ? <Check className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <span className="mt-2 text-sm font-medium">اختيار الطلب</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${step > 1 ? "bg-[#3498db]" : "bg-gray-200"}`}
                  ></div>
                </div>

                <div className={`flex flex-col items-center ${step >= 2 ? "text-[#3498db]" : "text-[#6d6a67]"}`}>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step > 2
                        ? "bg-[#3498db] text-white shadow-md shadow-[#3498db]/30"
                        : step === 2
                          ? "v7-neu-icon-active"
                          : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 2 ? <Check className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                  </div>
                  <span className="mt-2 text-sm font-medium">اختيار المنتجات</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${step > 2 ? "bg-[#3498db]" : "bg-gray-200"}`}
                  ></div>
                </div>

                <div className={`flex flex-col items-center ${step >= 3 ? "text-[#3498db]" : "text-[#6d6a67]"}`}>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step > 3
                        ? "bg-[#3498db] text-white shadow-md shadow-[#3498db]/30"
                        : step === 3
                          ? "v7-neu-icon-active"
                          : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 3 ? <Check className="h-6 w-6" /> : <RotateCcw className="h-6 w-6" />}
                  </div>
                  <span className="mt-2 text-sm font-medium">تفاصيل الإرجاع</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`h-1.5 w-full rounded-full transition-all duration-500 ${step > 3 ? "bg-[#3498db]" : "bg-gray-200"}`}
                  ></div>
                </div>

                <div className={`flex flex-col items-center ${step >= 4 ? "text-[#3498db]" : "text-[#6d6a67]"}`}>
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step === 4 ? "v7-neu-icon-active" : "v7-neu-icon-sm"
                    }`}
                  >
                    <MapPin className="h-6 w-6" />
                  </div>
                  <span className="mt-2 text-sm font-medium">معلومات الاستلام</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* الخطوة 1: اختيار الطلب */}
              {step === 1 && (
                <div className="space-y-8 v7-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="v7-neu-icon-sm">
                      <FileText className="h-5 w-5 text-[#3498db]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">اختر الطلب</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="ابحث عن رقم الطلب أو اسم المنتج"
                        className="v7-neu-input pr-10 text-base"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            className={`v7-neu-card-inner p-4 cursor-pointer transition-all ${
                              selectedOrder === order.id ? "v7-neu-card-active" : ""
                            }`}
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">{order.id}</h3>
                              <span className="text-sm text-[#6d6a67]">{order.date}</span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-[#6d6a67]">
                                عدد المنتجات: {order.items.length} | الإجمالي: {order.total.toFixed(2)} ريال
                              </p>
                              <div className="mt-2 space-y-1">
                                {order.items.map((item) => (
                                  <p key={item.id} className="text-sm">
                                    {item.name} ({item.quantity}x)
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-[#6d6a67]">
                          <Package className="mx-auto h-10 w-10 mb-2 opacity-50" />
                          <p>لم يتم العثور على طلبات مطابقة</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <Button type="button" onClick={nextStep} className="v7-neu-button" disabled={!selectedOrder}>
                      التالي
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* الخطوة 2: اختيار المنتجات */}
              {step === 2 && (
                <div className="space-y-8 v7-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="v7-neu-icon-sm">
                      <Package className="h-5 w-5 text-[#3498db]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">اختر المنتجات</h2>
                  </div>

                  {getSelectedOrderDetails() && (
                    <div>
                      <div className="mb-4 p-3 bg-[#f8f9fa] rounded-lg">
                        <p className="text-sm">
                          الطلب: <span className="font-medium text-[#3498db]">{getSelectedOrderDetails()?.id}</span> |{" "}
                          التاريخ: {getSelectedOrderDetails()?.date}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {getSelectedOrderDetails()?.items.map((item) => (
                          <div
                            key={item.id}
                            className={`v7-neu-card-inner p-4 transition-all ${
                              selectedItems.includes(item.id) ? "v7-neu-card-active" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={item.id}
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleItemSelection(item.id)}
                                className="h-5 w-5 border-2 data-[state=checked]:bg-[#3498db]"
                              />
                              <div className="flex-1">
                                <Label htmlFor={item.id} className="text-base font-medium block cursor-pointer">
                                  {item.name}
                                </Label>
                                <div className="text-sm text-[#6d6a67] mt-1">
                                  <span>
                                    الكمية: {item.quantity} | السعر: {item.price.toFixed(2)} ريال
                                  </span>
                                  <span className="mr-3">رقم المنتج: {item.sku}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <Button type="button" onClick={prevStep} variant="outline" className="v7-neu-button-flat">
                      <ArrowRight className="ml-2 h-5 w-5" />
                      السابق
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="v7-neu-button"
                      disabled={selectedItems.length === 0}
                    >
                      التالي
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* الخطوة 3: تفاصيل الإرجاع */}
              {step === 3 && (
                <div className="space-y-8 v7-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="v7-neu-icon-sm">
                      <RotateCcw className="h-5 w-5 text-[#3498db]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">تفاصيل الإرجاع</h2>
                  </div>

                  <div className="space-y-6">
                    {getSelectedItems().map((item) => (
                      <div key={item.id} className="v7-neu-card-inner p-4">
                        <h3 className="font-medium text-lg mb-3">{item.name}</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`reason-${item.id}`} className="text-sm font-medium block mb-2">
                              سبب الإرجاع
                            </Label>
                            <Select
                              value={formData.reasons[item.id] || ""}
                              onValueChange={(value) => handleReasonChange(item.id, value)}
                            >
                              <SelectTrigger id={`reason-${item.id}`} className="v7-neu-input text-base">
                                <SelectValue placeholder="اختر سبب الإرجاع" />
                              </SelectTrigger>
                              <SelectContent>
                                {returnReasons.map((reason) => (
                                  <SelectItem key={reason} value={reason}>
                                    {reason}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`photos-${item.id}`} className="text-sm font-medium block mb-2">
                              صور توضيحية (اختياري)
                            </Label>
                            <div className="v7-neu-input-container">
                              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">انقر أو اسحب الصور هنا لرفعها</p>
                                <p className="text-xs text-gray-400">يسمح بالصيغ: JPEG, PNG, JPG (حجم أقصى: 5MB)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-3">
                      <Label htmlFor="description" className="text-sm font-medium block mb-2">
                        تفاصيل إضافية (اختياري)
                      </Label>
                      <div className="v7-neu-input-container">
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="أضف أي تفاصيل إضافية تساعد في معالجة طلب الرجيع"
                          className="v7-neu-input text-base min-h-[120px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium block mb-2">طريقة استرداد المبلغ</Label>
                      <RadioGroup
                        value={formData.refundMethod}
                        onValueChange={(value) => handleSelectChange("refundMethod", value)}
                        className="space-y-3"
                      >
                        <div
                          className={`flex items-center p-3 rounded-lg ${
                            formData.refundMethod === "original" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <RadioGroupItem
                            value="original"
                            id="original"
                            className="mr-2 border-2 data-[state=checked]:bg-[#3498db]"
                          />
                          <Label htmlFor="original" className="cursor-pointer flex-1">
                            استرداد للبطاقة الأصلية
                          </Label>
                        </div>
                        <div
                          className={`flex items-center p-3 rounded-lg ${
                            formData.refundMethod === "wallet" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <RadioGroupItem
                            value="wallet"
                            id="wallet"
                            className="mr-2 border-2 data-[state=checked]:bg-[#3498db]"
                          />
                          <Label htmlFor="wallet" className="cursor-pointer flex-1">
                            إضافة للمحفظة
                          </Label>
                        </div>
                        <div
                          className={`flex items-center p-3 rounded-lg ${
                            formData.refundMethod === "points" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <RadioGroupItem
                            value="points"
                            id="points"
                            className="mr-2 border-2 data-[state=checked]:bg-[#3498db]"
                          />
                          <Label htmlFor="points" className="cursor-pointer flex-1">
                            تحويل لنقاط رصيد
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button type="button" onClick={prevStep} variant="outline" className="v7-neu-button-flat">
                      <ArrowRight className="ml-2 h-5 w-5" />
                      السابق
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="v7-neu-button"
                      disabled={getSelectedItems().some((item) => !formData.reasons[item.id])}
                    >
                      التالي
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* الخطوة 4: معلومات الاستلام */}
              {step === 4 && (
                <div className="space-y-8 v7-fade-in">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                    <div className="v7-neu-icon-sm">
                      <MapPin className="h-5 w-5 text-[#3498db]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">معلومات الاستلام</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium block mb-2">طريقة الإرجاع</Label>
                      <RadioGroup value={returnMethod} onValueChange={setReturnMethod} className="space-y-3">
                        <div
                          className={`flex items-start p-3 rounded-lg ${
                            returnMethod === "pickup" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <RadioGroupItem
                            value="pickup"
                            id="pickup"
                            className="mr-2 mt-1 border-2 data-[state=checked]:bg-[#3498db]"
                          />
                          <div className="flex-1">
                            <Label htmlFor="pickup" className="cursor-pointer font-medium">
                              استلام من المنزل
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              سيتم استلام المنتجات من العنوان المحدد خلال 1-3 أيام عمل
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-start p-3 rounded-lg ${
                            returnMethod === "dropoff" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <RadioGroupItem
                            value="dropoff"
                            id="dropoff"
                            className="mr-2 mt-1 border-2 data-[state=checked]:bg-[#3498db]"
                          />
                          <div className="flex-1">
                            <Label htmlFor="dropoff" className="cursor-pointer font-medium">
                              التسليم في فرع
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              يمكنك تسليم المنتجات بنفسك في أقرب فرع خلال 7 أيام
                            </p>
                          </div>
                        </div>
                        <div
                          className={`flex items-start p-3 rounded-lg ${
                            returnMethod === "waybill" ? "bg-blue-50" : "bg-gray-50"
                          }`}
                        >
                          <RadioGroupItem
                            value="waybill"
                            id="waybill"
                            className="mr-2 mt-1 border-2 data-[state=checked]:bg-[#3498db]"
                          />
                          <div className="flex-1">
                            <Label htmlFor="waybill" className="cursor-pointer font-medium">
                              إرجاع البوليصة فقط
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              إرجاع بوليصة الشحن فقط دون إرجاع المنتجات (مناسب للأخطاء في العنوان أو معلومات الشحن)
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {returnMethod === "pickup" && (
                      <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 text-blue-500" />
                          <h3 className="text-lg font-medium">معلومات الاستلام</h3>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                              الاسم الكامل
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="v7-neu-input"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">
                              رقم الهاتف
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="v7-neu-input"
                              required
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="text-sm font-medium">
                              العنوان
                            </Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="v7-neu-input"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="city" className="text-sm font-medium">
                              المدينة
                            </Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="v7-neu-input"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="postalCode" className="text-sm font-medium">
                              الرمز البريدي
                            </Label>
                            <Input
                              id="postalCode"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleChange}
                              className="v7-neu-input"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {returnMethod === "dropoff" && (
                      <div className="p-4 border border-green-100 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 text-green-500" />
                          <h3 className="text-lg font-medium">فروع التسليم</h3>
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm">
                            يمكنك تسليم المنتجات في أي من الفروع التالية خلال أوقات العمل الرسمية (9 ص - 10 م)
                          </p>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <h4 className="font-medium">الرياض - العليا</h4>
                              <p className="text-xs text-gray-500 mt-1">شارع العليا، بجوار برج المملكة، الرياض</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <h4 className="font-medium">الرياض - النخيل</h4>
                              <p className="text-xs text-gray-500 mt-1">حي النخيل، طريق الملك فهد، الرياض</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <h4 className="font-medium">جدة - الروضة</h4>
                              <p className="text-xs text-gray-500 mt-1">حي الروضة، شارع فلسطين، جدة</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                              <h4 className="font-medium">الدمام - الشاطئ</h4>
                              <p className="text-xs text-gray-500 mt-1">حي الشاطئ، طريق الخليج، الدمام</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {returnMethod === "waybill" && (
                      <div className="p-4 border border-orange-100 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg font-medium">إرجاع البوليصة</h3>
                        </div>
                        <div className="space-y-4">
                          <p className="text-sm">
                            سيتم إلغاء بوليصة الشحن الخاصة بهذا الطلب. يرجى تحديد سبب إرجاع البوليصة:
                          </p>
                          <Select
                            onValueChange={(value) => handleSelectChange("waybillReturnReason", value)}
                            defaultValue={formData.waybillReturnReason || ""}
                          >
                            <SelectTrigger className="v7-neu-input">
                              <SelectValue placeholder="اختر سبب إرجاع البوليصة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="wrong_address">عنوان خاطئ</SelectItem>
                              <SelectItem value="wrong_recipient">معلومات المستلم غير صحيحة</SelectItem>
                              <SelectItem value="shipping_error">خطأ في معلومات الشحن</SelectItem>
                              <SelectItem value="duplicate">بوليصة مكررة</SelectItem>
                              <SelectItem value="other">سبب آخر</SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="space-y-2">
                            <Label htmlFor="waybillNotes" className="text-sm font-medium">
                              ملاحظات إضافية
                            </Label>
                            <Textarea
                              id="waybillNotes"
                              name="waybillNotes"
                              value={formData.waybillNotes || ""}
                              onChange={handleChange}
                              placeholder="يرجى إضافة أي تفاصيل إضافية حول سبب إرجاع البوليصة..."
                              className="v7-neu-input"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">ملخص الإرجاع</h3>
                      <div className="space-y-2">
                        <p className="flex justify-between text-sm">
                          <span className="text-gray-600">عدد المنتجات:</span>
                          <span>{selectedItems.length}</span>
                        </p>
                        <p className="flex justify-between text-sm">
                          <span className="text-gray-600">إجمالي المبلغ المسترد:</span>
                          <span className="font-medium">
                            {getSelectedItems()
                              .reduce((total, item) => total + item.price, 0)
                              .toFixed(2)}{" "}
                            ريال
                          </span>
                        </p>
                        <p className="flex justify-between text-sm">
                          <span className="text-gray-600">طريقة الاسترداد:</span>
                          <span>
                            {formData.refundMethod === "original"
                              ? "استرداد للبطاقة الأصلية"
                              : formData.refundMethod === "wallet"
                                ? "إضافة للمحفظة"
                                : "تحويل لنقاط رصيد"}
                          </span>
                        </p>
                        <p className="flex justify-between text-sm">
                          <span className="text-gray-600">طريقة الإرجاع:</span>
                          <span>
                            {returnMethod === "pickup"
                              ? "استلام من المنزل"
                              : returnMethod === "dropoff"
                                ? "التسليم في فرع"
                                : "إرجاع البوليصة فقط"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button type="button" onClick={prevStep} variant="outline" className="v7-neu-button-flat">
                      <ArrowRight className="ml-2 h-5 w-5" />
                      السابق
                    </Button>
                    <Button type="submit" className="v7-neu-button-active">
                      <Check className="ml-2 h-5 w-5" />
                      إنشاء طلب الرجيع
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
