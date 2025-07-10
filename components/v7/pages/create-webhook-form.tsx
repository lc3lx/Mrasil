"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Link, Copy, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { routes } from "@/lib/routes"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateWebhookForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [webhookEndpoint, setWebhookEndpoint] = useState("")
  const [webhookName, setWebhookName] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [testEvent, setTestEvent] = useState("order.created")
  const [testPayload, setTestPayload] = useState("")
  const [testResponse, setTestResponse] = useState<{
    success: boolean
    statusCode?: number
    message: string
    responseTime?: number
  } | null>(null)

  // قائمة الأحداث المتاحة
  const availableEvents = [
    { id: "order.created", label: "إنشاء طلب جديد" },
    { id: "order.updated", label: "تحديث طلب" },
    { id: "order.cancelled", label: "إلغاء طلب" },
    { id: "order.paid", label: "دفع طلب" },
    { id: "customer.created", label: "تسجيل عميل جديد" },
    { id: "customer.updated", label: "تحديث بيانات عميل" },
    { id: "product.created", label: "إضافة منتج جديد" },
    { id: "product.updated", label: "تحديث منتج" },
    { id: "inventory.updated", label: "تحديث المخزون" },
    { id: "payment.received", label: "استلام دفعة" },
  ]

  // تحديث قائمة الأحداث المحددة
  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  // إنشاء ويب هوك جديد
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // محاكاة طلب API
    setTimeout(() => {
      setIsLoading(false)
      router.push(routes.webhooks)
    }, 1000)
  }

  // توليد مفتاح سري جديد
  const generateSecret = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = "whsec_"
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const [secretKey, setSecretKey] = useState(generateSecret())

  // نسخ المفتاح السري
  const copySecret = () => {
    navigator.clipboard.writeText(secretKey)
  }

  // تحديث المفتاح السري
  const refreshSecret = () => {
    setSecretKey(generateSecret())
  }

  // دالة لتوليد بيانات اختبار بناءً على نوع الحدث
  const generateTestPayload = (eventType: string) => {
    const payloads: Record<string, any> = {
      "order.created": {
        event: "order.created",
        timestamp: new Date().toISOString(),
        data: {
          id: "ord_" + Math.random().toString(36).substring(2, 10),
          order_number: "ORD" + Math.floor(1000000 + Math.random() * 9000000),
          status: "created",
          created_at: new Date().toISOString(),
          customer: {
            id: "cus_" + Math.random().toString(36).substring(2, 10),
            name: "أحمد محمد",
            email: "ahmed@example.com",
          },
          shipping_address: {
            city: "الرياض",
            address: "شارع الملك فهد، حي العليا",
          },
          items: [
            {
              name: "هاتف ذكي",
              quantity: 1,
              price: 1999.99,
            },
          ],
          total: 1999.99,
        },
      },
      "order.updated": {
        event: "order.updated",
        timestamp: new Date().toISOString(),
        data: {
          id: "ord_" + Math.random().toString(36).substring(2, 10),
          order_number: "ORD" + Math.floor(1000000 + Math.random() * 9000000),
          previous_status: "processing",
          new_status: "shipped",
          updated_at: new Date().toISOString(),
        },
      },
      "payment.received": {
        event: "payment.received",
        timestamp: new Date().toISOString(),
        data: {
          id: "pay_" + Math.random().toString(36).substring(2, 10),
          amount: 1999.99,
          currency: "SAR",
          payment_method: "credit_card",
          status: "succeeded",
          related_order: "ord_" + Math.random().toString(36).substring(2, 10),
        },
      },
    }

    return JSON.stringify(payloads[eventType] || payloads["order.created"], null, 2)
  }

  // دالة لاختبار الويب هوك
  const testWebhook = async () => {
    if (!webhookEndpoint) return

    setIsTestingWebhook(true)
    setTestResponse(null)

    try {
      const startTime = Date.now()

      // محاكاة إرسال طلب اختبار
      // في بيئة الإنتاج، يجب استخدام API خلفية لإرسال الطلب الفعلي
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // محاكاة استجابة ناجحة (في الواقع، ستأتي من الخادم)
      if (webhookEndpoint.includes("error")) {
        setTestResponse({
          success: false,
          statusCode: 500,
          message: "فشل الاتصال بنقطة النهاية",
          responseTime,
        })
      } else if (webhookEndpoint.includes("timeout")) {
        setTestResponse({
          success: false,
          message: "انتهت مهلة الاتصال",
          responseTime: 30000,
        })
      } else if (webhookEndpoint.includes("invalid")) {
        setTestResponse({
          success: false,
          statusCode: 404,
          message: "لم يتم العثور على نقطة النهاية",
          responseTime,
        })
      } else {
        setTestResponse({
          success: true,
          statusCode: 200,
          message: "تم استلام الطلب بنجاح",
          responseTime,
        })
      }
    } catch (error) {
      setTestResponse({
        success: false,
        message: "حدث خطأ أثناء الاختبار",
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  // عند تغيير نوع الحدث، قم بتحديث بيانات الاختبار
  const handleTestEventChange = (value: string) => {
    setTestEvent(value)
    setTestPayload(generateTestPayload(value))
  }

  // قم بتعيين بيانات الاختبار الافتراضية عند تحميل المكون
  React.useEffect(() => {
    setTestPayload(generateTestPayload(testEvent))
  }, [])

  const [targetSystem, setTargetSystem] = useState("")
  const [webhookPath, setWebhookPath] = useState("")
  const [dataFormat, setDataFormat] = useState("json")
  const [notificationMethod, setNotificationMethod] = useState("api")
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(routes.webhooks)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إنشاء ويب هوك للإرسال</h1>
          <p className="text-muted-foreground">
            قم بإعداد ويب هوك جديد لإرسال البيانات والإشعارات إلى الأنظمة الخارجية.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle className="text-lg">معلومات ويب هوك الإرسال</CardTitle>
              <CardDescription>أدخل المعلومات الأساسية لويب هوك الإرسال الجديد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الويب هوك</Label>
                <Input
                  id="name"
                  placeholder="مثال: إرسال إشعارات الطلبات الجديدة"
                  value={webhookName}
                  onChange={(e) => setWebhookName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-system">النظام المستهدف للإرسال</Label>
                <Input
                  id="target-system"
                  placeholder="مثال: نظام إدارة المخزون، منصة المحادثات، نظام المحاسبة"
                  value={targetSystem}
                  onChange={(e) => setTargetSystem(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  حدد النظام الخارجي الذي سترسل إليه البيانات عند حدوث الأحداث المحددة.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="path">عنوان URL للنظام المستهدف</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="path"
                      className="pl-9"
                      placeholder="https://example.com/api/webhook"
                      value={webhookEndpoint}
                      onChange={(e) => setWebhookEndpoint(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  أدخل عنوان URL الكامل للنظام الخارجي الذي سيتم إرسال البيانات إليه.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="active">الحالة</Label>
                  <span className="text-xs text-gray-500">تفعيل أو تعطيل الويب هوك</span>
                </div>
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle className="text-lg">الأحداث المراد إرسالها</CardTitle>
              <CardDescription>حدد الأحداث التي ترغب في إرسال إشعارات عنها للنظام الخارجي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>الأحداث المراد استقبالها</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {availableEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id={`event-${event.id}`}
                        checked={selectedEvents.includes(event.id)}
                        onCheckedChange={() => toggleEvent(event.id)}
                      />
                      <Label htmlFor={`event-${event.id}`} className="cursor-pointer">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">حدد الأحداث التي ترغب في استقبالها من النظام المستهدف.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-format">تنسيق البيانات المتوقع</Label>
                <Select value={dataFormat} onValueChange={setDataFormat}>
                  <SelectTrigger id="data-format">
                    <SelectValue placeholder="اختر تنسيق البيانات" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="form">Form Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-method">طريقة الإشعار</Label>
                <Select value={notificationMethod} onValueChange={setNotificationMethod}>
                  <SelectTrigger id="notification-method">
                    <SelectValue placeholder="اختر طريقة الإشعار" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="api">معالجة عبر API</SelectItem>
                    <SelectItem value="email">إرسال بريد إلكتروني</SelectItem>
                    <SelectItem value="dashboard">إشعار في لوحة التحكم</SelectItem>
                    <SelectItem value="all">جميع الطرق</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  كيف تريد أن يتم إشعارك عند استقبال بيانات جديدة عبر هذا الويب هوك.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle className="text-lg">مصادقة الإرسال</CardTitle>
              <CardDescription>استخدم هذا المفتاح للتحقق من هوية طلبات الإرسال الصادرة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secret">المفتاح السري</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input id="secret" value={secretKey} readOnly className="font-mono text-sm" />
                  </div>
                  <Button type="button" variant="outline" size="icon" onClick={copySecret}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={refreshSecret}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  سيتم استخدام هذا المفتاح في ترويسة 'X-Webhook-Signature' للتحقق من هوية الطلبات الصادرة من نظامك.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle className="text-lg">اختبار إرسال الويب هوك</CardTitle>
              <CardDescription>تحقق من أن عملية الإرسال تعمل بشكل صحيح</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-payload">بيانات الاختبار</Label>
                <Textarea
                  id="test-payload"
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="font-mono h-48 text-xs"
                />
                <p className="text-xs text-gray-500">هذه هي البيانات التي سيتم إرسالها لاختبار الويب هوك.</p>
              </div>

              {testResponse && (
                <Alert variant={testResponse.success ? "default" : "destructive"}>
                  <AlertTitle className="flex items-center gap-2">
                    {testResponse.success ? (
                      <>
                        <CheckCircle className="h-4 w-4" /> تم الاختبار بنجاح
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" /> فشل الاختبار
                      </>
                    )}
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">الحالة:</span>{" "}
                        {testResponse.statusCode ? `${testResponse.statusCode} - ` : ""}
                        {testResponse.message}
                      </div>
                      {testResponse.responseTime && (
                        <div className="text-sm">
                          <span className="font-medium">وقت المعالجة:</span>{" "}
                          {testResponse.responseTime < 1000
                            ? `${testResponse.responseTime} مللي ثانية`
                            : `${(testResponse.responseTime / 1000).toFixed(2)} ثانية`}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button type="button" onClick={testWebhook} disabled={isTestingWebhook} className="v7-neu-button">
                  {isTestingWebhook ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      جاري إرسال الاختبار...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      اختبار إرسال الويب هوك
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle className="text-lg">معلومات النظام المستقبل</CardTitle>
              <CardDescription>معلومات للنظام المستقبل حول كيفية التعامل مع البيانات المرسلة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>شكل البيانات المرسلة</Label>
                <Textarea
                  readOnly
                  className="font-mono h-48 text-xs"
                  value={`// هذا هو شكل البيانات التي سيتم إرسالها من نظامك
{
  "event": "order.created",
  "timestamp": "${new Date().toISOString()}",
  "signature": "${secretKey}",
  "data": {
    // بيانات الحدث المرسل
  }
}`}
                />
                <p className="text-xs text-gray-500">
                  هذا هو شكل البيانات التي سيتم إرسالها إلى النظام المستهدف عند حدوث الأحداث المحددة.
                </p>
              </div>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-between border-t p-4">
            <Button type="button" variant="outline" onClick={() => router.push(routes.webhooks)}>
              إلغاء
            </Button>
            <Button
              type="submit"
              className="v7-neu-button"
              disabled={isLoading || !webhookName || !webhookEndpoint || selectedEvents.length === 0}
            >
              {isLoading ? "جاري الإنشاء..." : "إنشاء ويب هوك الإرسال"}
            </Button>
          </CardFooter>
        </div>
      </form>
    </div>
  )
}
