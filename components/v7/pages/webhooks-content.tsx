"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { FileText, Loader2 } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useGetSallaAuthUrlQuery, useGetWebhookStatusQuery, useUpdateWebhookMutation } from "@/app/api/sallaApi"
import { toast } from "sonner"
import { useGetZidAuthUrlQuery } from '@/app/api/zedApi'

export function WebhooksContent() {
  const router = useRouter()
  const [webhookUrl, setWebhookUrl] = useState("")
  const sallaToken = "38c5a910b012dfcbca23913cfb167308602e62fa9edea4c9ac2fa28"
  const manualAuthUrlRef = useRef("")

  // Get webhook status
  const { data: webhookStatus, isLoading: isLoadingStatus } = useGetWebhookStatusQuery()
  const [updateWebhook, { isLoading: isUpdating }] = useUpdateWebhookMutation()
  const { data: authUrlData, isLoading: isAuthLoading, refetch: getAuthUrl } = useGetSallaAuthUrlQuery()
  const { data: zidAuthData, isLoading: isLoadingZidAuth } = useGetZidAuthUrlQuery()

  // Update local state when webhook status changes
  useEffect(() => {
    if (webhookStatus?.webhookUrl) {
      setWebhookUrl(webhookStatus.webhookUrl)
    }
  }, [webhookStatus])

  // نسخ الرابط
  const copyToken = () => {
    navigator.clipboard.writeText(sallaToken)
    toast.success("تم نسخ الرابط بنجاح")
  }

  // تحديث الرابط
  const handleUpdateWebhook = async () => {
    if (!webhookUrl) {
      toast.error("الرجاء إدخال رابط الويب هوك")
      return
    }

    try {
      await updateWebhook({
        webhookUrl,
        isEnabled: webhookStatus?.isEnabled ?? false,
      }).unwrap()
      toast.success("تم تحديث رابط الويب هوك بنجاح")
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث رابط الويب هوك")
    }
  }

  // Manual trigger for Salla Auth URL
  const handleManualGetAuthUrl = async () => {
    try {
      const result = await getAuthUrl()
      if (result.data?.authUrl) {
        manualAuthUrlRef.current = result.data.authUrl
        window.open(result.data.authUrl, "_blank")
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الحصول على رابط المصادقة")
    }
  }

  const webhook = { active: webhookStatus?.isEnabled ?? false }

  return (
    <div className="space-y-6 rtl">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">توصيل المتاجر</h1>
        <p className="text-muted-foreground">
          قم بتوصيل متجرك الإلكتروني بمنصة الشحن لإدارة الطلبات والشحنات بشكل تلقائي
        </p>
      </div>

      <Card className="v7-neu-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Switch 
                checked={webhook.active} 
                onCheckedChange={async (checked) => {
                  try {
                    await updateWebhook({
                      webhookUrl,
                      isEnabled: checked,
                    }).unwrap()
                    toast.success(checked ? "تم تفعيل الويب هوك" : "تم إيقاف الويب هوك")
                  } catch (error) {
                    toast.error("حدث خطأ أثناء تحديث حالة الويب هوك")
                  }
                }} 
                className="scale-125"
                disabled={isUpdating || isLoadingStatus}
              />
              <Badge
                variant="outline"
                className={`${
                  webhook.active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {webhook.active ? "نشط" : "غير نشط"}
              </Badge>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-6">
                  <h2 className="text-xl font-bold">الربط مع سلة</h2>
                  <div className="w-16 h-16 relative">
                    <div className="v7-neu-card-inner rounded-xl flex items-center justify-center w-full h-full">
                      <Image src="/salla.svg" alt="سلة" width={40} height={40} />
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="mb-6 leading-relaxed">
                لربط متجرك الإلكتروني في سلة بمنصة مراسيل كل ما عليك هو أن تضغط زر النسخ المتحرك بجوار الرابط أدناه و
                الذي سيقوم بنسخ الرابط و تفعيل الربط مع سلة و توجيهك لسلة لتقوم باللصق و بعد اللصق، في سلة عد إلى هنا
                لتحديث 'Webhook URL'
              </p>
              <div className="mb-6 flex justify-center">
                <Button
                  type="button"
                  onClick={handleManualGetAuthUrl}
                  className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? (
                    <Loader2 className="animate-spin h-5 w-5 ml-2" />
                  ) : (
                    <Image src="/salla.svg" alt="سلة" width={15} height={10} className="ml-2" />
                  )}
                  ربط مع سلة
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block font-medium">رابط سلة</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyToken}
                      className=""
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Input value={sallaToken} readOnly className="font-mono text-sm  border-gray-200" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Webhook URL</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleUpdateWebhook}
                      className="bg-[#e74c3c] hover:bg-[#c0392b] text-white flex-shrink-0"
                      disabled={isUpdating || isLoadingStatus}
                    >
                      {isUpdating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                      تحديث
                    </Button>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="font-mono border-gray-200 text-sm"
                      placeholder="أدخل رابط الويب هوك هنا"
                      disabled={isLoadingStatus}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="v7-neu-card dark:bg-gray-800/50 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg dark:text-gray-200">متاجر أخرى</CardTitle>
          <CardDescription className="dark:text-gray-400">قم بتوصيل منصات التجارة الإلكترونية الأخرى بمنصة الشحن</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex-1">
              <Card className="v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Image src="/shopify-logo.png" alt="Shopify" width={30} height={30} className="dark:invert" />
                  </div>
                  <h3 className="font-medium dark:text-gray-200">Shopify</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">قم بتوصيل متجر Shopify الخاص بك</p>
                  <Button className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">توصيل</Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card className="v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Image src="/woocommerce-logo.png" alt="WooCommerce" width={30} height={30} className="dark:invert" />
                  </div>
                  <h3 className="font-medium dark:text-gray-200">WooCommerce</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">قم بتوصيل متجر WooCommerce الخاص بك</p>
                  <Button className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">توصيل</Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card className="v7-neu-card-inner h-full dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <Image src="/Zid.svg" alt="زد" width={30} height={30} className="dark:invert" />
                  </div>
                  <h3 className="font-medium dark:text-gray-200">زد</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">قم بتوصيل متجر زد الخاص بك</p>
                  <Button
                    className="mt-4 v7-neu-button dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    onClick={() => {
                      if (zidAuthData?.authUrl) {
                        window.open(zidAuthData.authUrl, '_blank');
                      }
                    }}
                    disabled={isLoadingZidAuth}
                  >
                    توصيل
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
