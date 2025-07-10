"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Upload } from "lucide-react"

export default function CustomerReplacementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isPreview = searchParams.get("preview") === "true"
  const theme = searchParams.get("theme") || "#294D8B"

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [originalProduct, setOriginalProduct] = useState("")
  const [replacementProduct, setReplacementProduct] = useState("")
  const [reason, setReason] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // محاكاة إرسال البيانات
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImages(Array.from(e.target.files))
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b" style={{ backgroundColor: theme, color: "#fff" }}>
            <div className="flex justify-center mb-2">
              <Image src="/company-logo.png" alt="شعار الشركة" width={120} height={40} className="h-8 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-center">استبدال المنتجات</h1>
          </div>

          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">تم استلام طلب الاستبدال بنجاح</h2>
            <p className="text-gray-600 mb-6">
              سنتواصل معك قريبًا لمتابعة طلبك. يمكنك تتبع حالة طلبك من خلال رقم الطلب.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-500">رقم طلب الاستبدال</p>
              <p className="text-lg font-bold">{Math.floor(Math.random() * 1000000) + 1000000}</p>
            </div>

            <Button
              className="w-full"
              style={{ backgroundColor: theme }}
              onClick={() => {
                if (isPreview) {
                  setSubmitted(false)
                  setStep(1)
                } else {
                  router.push("/")
                }
              }}
            >
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b" style={{ backgroundColor: theme, color: "#fff" }}>
          <div className="flex justify-center mb-2">
            <Image src="/company-logo.png" alt="شعار الشركة" width={120} height={40} className="h-8 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-center">استبدال المنتجات</h1>
          <p className="text-sm text-center mt-1">
            يمكنك استبدال المنتجات التي اشتريتها خلال 14 يومًا من تاريخ الاستلام
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">رقم الطلب</Label>
              <Input
                id="orderNumber"
                placeholder="أدخل رقم الطلب"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalProduct">المنتج الأصلي</Label>
              <Select value={originalProduct} onValueChange={setOriginalProduct} required>
                <SelectTrigger id="originalProduct">
                  <SelectValue placeholder="اختر المنتج الأصلي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product1">سماعات بلوتوث لاسلكية</SelectItem>
                  <SelectItem value="product2">شاحن سريع 65 واط</SelectItem>
                  <SelectItem value="product3">ساعة ذكية</SelectItem>
                  <SelectItem value="product4">حافظة هاتف مقاومة للصدمات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="replacementProduct">المنتج البديل</Label>
              <Select value={replacementProduct} onValueChange={setReplacementProduct} required>
                <SelectTrigger id="replacementProduct">
                  <SelectValue placeholder="اختر المنتج البديل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product1">سماعات بلوتوث لاسلكية - الإصدار الجديد</SelectItem>
                  <SelectItem value="product2">شاحن سريع 100 واط</SelectItem>
                  <SelectItem value="product3">ساعة ذكية - الإصدار المتطور</SelectItem>
                  <SelectItem value="product4">حافظة هاتف مقاومة للصدمات - مع حامل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">سبب الاستبدال</Label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="اختر سبب الاستبدال" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="damaged">منتج تالف</SelectItem>
                  <SelectItem value="not-as-described">غير مطابق للوصف</SelectItem>
                  <SelectItem value="wrong-size">الحجم غير مناسب</SelectItem>
                  <SelectItem value="wrong-color">اللون غير مناسب</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                placeholder="أدخل رقم هاتفك"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">صور المنتج (اختياري)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label htmlFor="images" className="cursor-pointer block">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500 block">اضغط لتحميل صور للمنتج</span>
                  <span className="text-xs text-gray-400 block mt-1">
                    {images.length > 0 ? `تم اختيار ${images.length} صورة` : "يمكنك تحميل حتى 3 صور"}
                  </span>
                </Label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" style={{ backgroundColor: theme }} disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إرسال طلب الاستبدال"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            <p>
              بالضغط على زر الإرسال، أنت توافق على{" "}
              <a href="#" className="underline">
                شروط وسياسة الاستبدال
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
