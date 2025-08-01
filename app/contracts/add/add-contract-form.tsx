"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, FileText, ArrowRight, Upload, Save } from "lucide-react"

export function AddContractForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contractFile, setContractFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // هنا سيتم إضافة منطق حفظ العقد
    // في تطبيق حقيقي، سيتم إرسال البيانات إلى الخادم

    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    // بعد الانتهاء، انتقل إلى صفحة العقود
    router.push("/contracts")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">إضافة عقد جديد</h1>
        <p className="text-gray-500">أضف تفاصيل العقد الخاص بك مع شركة الشحن</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contractName">اسم العقد</Label>
              <Input id="contractName" placeholder="أدخل اسماً وصفياً للعقد" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrierName">شركة الشحن</Label>
              <Select>
                <SelectTrigger id="carrierName">
                  <SelectValue placeholder="اختر شركة الشحن" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aramex">أرامكس</SelectItem>
                  <SelectItem value="dhl">دي إتش إل</SelectItem>
                  <SelectItem value="fedex">فيديكس</SelectItem>
                  <SelectItem value="ups">يو بي إس</SelectItem>
                  <SelectItem value="other">شركة أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractNumber">رقم العقد</Label>
              <Input id="contractNumber" placeholder="أدخل رقم العقد" required />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">تاريخ بداية العقد</Label>
              <div className="relative">
                <Input id="startDate" type="date" required />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">تاريخ نهاية العقد</Label>
              <div className="relative">
                <Input id="endDate" type="date" required />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contractType">نوع العقد</Label>
              <Select>
                <SelectTrigger id="contractType">
                  <SelectValue placeholder="اختر نوع العقد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">قياسي</SelectItem>
                  <SelectItem value="premium">متميز</SelectItem>
                  <SelectItem value="enterprise">مؤسسات</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label htmlFor="contractDetails">تفاصيل العقد</Label>
            <Textarea id="contractDetails" placeholder="أدخل تفاصيل وشروط العقد" rows={5} />
          </div>

          <Card className="border border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">تحميل نسخة من العقد</h3>
                <p className="text-sm text-gray-500 mb-4">قم بتحميل نسخة من العقد بصيغة PDF أو صورة</p>
                <div className="relative">
                  <Input
                    id="contractFile"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setContractFile(e.target.files[0])
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("contractFile")?.click()}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 ml-2" />
                    اختر ملفاً
                  </Button>
                </div>
                {contractFile && <p className="mt-2 text-sm text-gray-600">تم اختيار: {contractFile.name}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex items-center">
            <ArrowRight className="h-4 w-4 ml-2" />
            رجوع
          </Button>

          <Button type="submit" disabled={isSubmitting} className="flex items-center">
            {isSubmitting ? (
              <>جاري الحفظ...</>
            ) : (
              <>
                <Save className="h-4 w-4 ml-2" />
                حفظ العقد
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
