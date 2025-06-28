"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FileText, ArrowLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import { useGetSallaAuthUrlQuery } from "@/app/api/sallaApi"

export function SallaWebhookContent() {
  const router = useRouter()
  const [isEnabled, setIsEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const sallaToken = "38c5a910b012dfcbca23913cfb167308602e62fa9edea4c9ac2fa28"

  // نسخ الرابط
  const copyToken = () => {
    navigator.clipboard.writeText(sallaToken)
  }

  // تحديث الرابط
  const updateWebhook = () => {
    // هنا يمكن إضافة منطق لتحديث الويب هوك
    alert("تم تحديث رابط الويب هوك بنجاح")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/webhooks")} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">توصيل المتاجر</h1>
          <p className="text-muted-foreground">قم بتوصيل متجر سلة الإلكتروني بمنصة الشحن</p>
        </div>
      </div>

      <Card className="v7-neu-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} className="scale-125" />
            </div>
            <div className="flex-1 px-8 text-right">
              <div className="flex items-center justify-end mb-6">
                <h2 className="text-xl font-bold ml-4">الربط مع سلة</h2>
                <div className="w-16 h-16 relative">
                  <div className="v7-neu-card-inner rounded-xl flex items-center justify-center w-full h-full">
                    <Image src="/placeholder.svg?key=pdr8n" alt="سلة" width={40} height={40} />
                  </div>
                </div>
              </div>
              <p className="text-right mb-6 leading-relaxed">
                لربط متجرك الإلكتروني في سلة بمنصة نايتروس كل ما عليك هو أن تضغط زر النسخ المتحرك بجوار الرابط أدناه و
                الذي سيقوم بنسخ الرابط و تفعيل الربط مع سلة و توجيهك لسلة لتقوم باللصق و بعد اللصق، في سلة عد إلى هنا
                لتحديث 'Webhook URL'
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-right block font-medium">رابط سلة</label>
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyToken}
                      className="bg-gray-100 border-gray-200"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Input value={sallaToken} readOnly className="font-mono text-sm bg-gray-100 border-gray-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-right block font-medium">Webhook URL</label>
                  <div className="flex">
                    <Button
                      type="button"
                      onClick={updateWebhook}
                      className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
                    >
                      تحديث
                    </Button>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="font-mono text-sm"
                      placeholder="أدخل رابط الويب هوك هنا"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="v7-neu-card">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">تعليمات الربط مع سلة</h3>
          <ol className="list-decimal list-inside space-y-2 text-right">
            <li>قم بنسخ الرابط أعلاه بالضغط على زر النسخ</li>
            <li>انتقل إلى لوحة تحكم متجرك في منصة سلة</li>
            <li>اذهب إلى الإعدادات ثم التكاملات</li>
            <li>ابحث عن تكامل "Webhook" وقم بتفعيله</li>
            <li>الصق الرابط الذي نسخته في حقل "Endpoint URL"</li>
            <li>احفظ الإعدادات في سلة</li>
            <li>انسخ رابط الـ Webhook الذي تم إنشاؤه في سلة</li>
            <li>عد إلى هذه الصفحة والصق الرابط في حقل "Webhook URL" واضغط على "تحديث"</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
