"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Clock, Link, Copy } from "lucide-react"
import { routes } from "@/lib/routes"

export function WebhookTestPage() {
  const router = useRouter()
  const params = useParams()
  const webhookId = params.id as string

  // حالة الويب هوك
  const [webhook, setWebhook] = useState<{
    id: string
    name: string
    endpoint: string
    secretKey: string
    events: string[]
    status: string
    targetSystem?: string
  } | null>(null)

  // حالة الاختبار
  const [isLoading, setIsLoading] = useState(true)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [testEvent, setTestEvent] = useState("order.created")
  const [testPayload, setTestPayload] = useState("")
  const [activeTab, setActiveTab] = useState("payload")
  const [testHistory, setTestHistory] = useState<
    Array<{
      id: string
      event: string
      timestamp: string
      success: boolean
      statusCode?: number
      responseTime: number
      response?: string
    }>
  >([])
  const [testResponse, setTestResponse] = useState<{
    success: boolean
    statusCode?: number
    message: string
    responseTime?: number
    rawResponse?: string
    headers?: Record<string, string>
  } | null>(null)

  // محاكاة تحميل بيانات الويب هوك
  useEffect(() => {
    // في بيئة الإنتاج، هذا سيكون طلب API فعلي
    setTimeout(() => {
      setWebhook({
        id: webhookId,
        name: "استقبال طلبات المتجر الإلكتروني",
        endpoint: "/api/webhooks/store-orders",
        secretKey: "whsec_8fJ2tYv6D4zP9xK3mN7qR5sT1bX0cG",
        events: ["order.created", "order.updated", "order.paid"],
        status: "active",
        targetSystem: "متجر ووردبريس",
      })

      // محاكاة سجل الاختبارات السابقة
      setTestHistory([
        {
          id: "test_1",
          event: "order.created",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          success: true,
          statusCode: 200,
          responseTime: 245,
          response: JSON.stringify({ status: "success", message: "Order received successfully" }),
        },
        {
          id: "test_2",
          event: "order.updated",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          success: false,
          statusCode: 500,
          responseTime: 1230,
          response: JSON.stringify({ error: "Internal server error" }),
        },
      ])

      setIsLoading(false)
    }, 1000)
  }, [webhookId])

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

  // نسخ المفتاح السري
  const copySecretKey = () => {
    if (webhook?.secretKey) {
      navigator.clipboard.writeText(webhook.secretKey)
    }
  }

  // عند تغيير نوع الحدث، قم بتحديث بيانات الاختبار
  const handleTestEventChange = (value: string) => {
    setTestEvent(value)
    setTestPayload(generateTestPayload(value))
  }

  // تعيين بيانات الاختبار الافتراضية عند تحميل المكون
  useEffect(() => {
    setTestPayload(generateTestPayload(testEvent))
  }, [testEvent])

  // دالة لاختبار الويب هوك
  const testWebhook = async () => {
    if (!webhook) return

    setIsTestingWebhook(true)
    setTestResponse(null)
    setActiveTab("response")

    try {
      const startTime = Date.now()

      // محاكاة إرسال طلب اختبار
      // في بيئة الإنتاج، يجب استخدام API خلفية لإرسال الطلب الفعلي
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // محاكاة استجابة (في الواقع، ستأتي من الخادم)
      let response

      if (Math.random() > 0.7) {
        // محاكاة خطأ عشوائي في 30% من الحالات
        response = {
          success: false,
          statusCode: 500,
          message: "فشل الاتصال بنقطة النهاية",
          responseTime,
          rawResponse: JSON.stringify({ error: "Internal server error", code: 500 }),
          headers: {
            "content-type": "application/json",
            date: new Date().toUTCString(),
          },
        }
      } else {
        // محاكاة استجابة ناجحة
        response = {
          success: true,
          statusCode: 200,
          message: "تم استلام الطلب بنجاح",
          responseTime,
          rawResponse: JSON.stringify({
            status: "success",
            message: "Order received successfully",
            timestamp: new Date().toISOString(),
            event_id: "evt_" + Math.random().toString(36).substring(2, 10),
          }),
          headers: {
            "content-type": "application/json",
            date: new Date().toUTCString(),
            server: "nginx",
            "x-request-id": Math.random().toString(36).substring(2, 10),
          },
        }
      }

      setTestResponse(response)

      // إضافة الاختبار إلى السجل
      const newTest = {
        id: "test_" + Date.now(),
        event: testEvent,
        timestamp: new Date().toISOString(),
        success: response.success,
        statusCode: response.statusCode,
        responseTime,
        response: response.rawResponse,
      }

      setTestHistory((prev) => [newTest, ...prev])
    } catch (error) {
      setTestResponse({
        success: false,
        message: "حدث خطأ أثناء الاختبار",
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">جاري التحميل...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!webhook) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(routes.webhooks)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">لم يتم العثور على الويب هوك</h1>
            <p className="text-muted-foreground">لم يتم العثور على الويب هوك المطلوب</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(routes.webhooks)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">اختبار إرسال الويب هوك</h1>
          <p className="text-muted-foreground">اختبار إرسال ويب هوك: {webhook.name}</p>
        </div>
      </div>

      <Card className="v7-neu-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="h-5 w-5 text-[#3498db]" />
              <CardTitle className="text-lg">{webhook.name}</CardTitle>
            </div>
          </div>
          <CardDescription className="mt-1 text-xs font-mono">يرسل إلى: {webhook.endpoint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>النظام المستهدف للإرسال</Label>
              <div className="text-sm">{webhook.targetSystem || "غير محدد"}</div>
            </div>
            <div className="space-y-2">
              <Label>المفتاح السري</Label>
              <div className="flex items-center gap-2">
                <div className="text-sm font-mono text-gray-500 truncate">{webhook.secretKey}</div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copySecretKey}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payload">البيانات المرسلة</TabsTrigger>
              <TabsTrigger value="response">استجابة النظام المستهدف</TabsTrigger>
            </TabsList>
            <TabsContent value="payload" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="test-payload">البيانات المرسلة (JSON)</Label>
                <Textarea
                  id="test-payload"
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="font-mono h-64 text-xs"
                />
                <p className="text-xs text-gray-500">هذه هي البيانات التي سيتم إرسالها للنظام المستهدف.</p>
              </div>
            </TabsContent>
            <TabsContent value="response" className="space-y-4 pt-4">
              {testResponse ? (
                <div className="space-y-4">
                  <Alert variant={testResponse.success ? "default" : "destructive"}>
                    <AlertTitle className="flex items-center gap-2">
                      {testResponse.success ? (
                        <>
                          <CheckCircle className="h-4 w-4" /> تمت المعالجة بنجاح
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" /> فشل المعالجة
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

                  {testResponse.rawResponse && (
                    <div className="space-y-2">
                      <Label>نتيجة المعالجة</Label>
                      <Textarea readOnly value={testResponse.rawResponse} className="font-mono h-48 text-xs" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">لم يتم إجراء اختبار بعد</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    اضغط على زر "اختبار الويب هوك" لإرسال بيانات اختبار ومعالجتها
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={testWebhook} disabled={isTestingWebhook} className="v7-neu-button">
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
          <CardTitle className="text-lg">سجل عمليات الإرسال</CardTitle>
          <CardDescription>سجل بجميع عمليات إرسال الويب هوك السابقة</CardDescription>
        </CardHeader>
        <CardContent>
          {testHistory.length > 0 ? (
            <div className="space-y-4">
              {testHistory.map((test) => (
                <div key={test.id} className="flex items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {test.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium">{test.event}</span>
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(test.timestamp)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      {test.statusCode && (
                        <span className={test.success ? "text-green-600" : "text-red-600"}>{test.statusCode}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {test.responseTime < 1000
                        ? `${test.responseTime} مللي ثانية`
                        : `${(test.responseTime / 1000).toFixed(2)} ثانية`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">لا توجد عمليات إرسال سابقة</h3>
              <p className="text-sm text-gray-500">لم يتم إرسال أي بيانات من خلال هذا الويب هوك بعد</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="v7-neu-card">
        <CardHeader>
          <CardTitle className="text-lg">المعلومات الفنية</CardTitle>
          <CardDescription>معلومات فنية للمطورين حول إرسال البيانات عبر هذا الويب هوك</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            className="font-mono h-48 text-xs"
            value={`// تفاصيل فنية حول ويب هوك الإرسال
{
  "webhook_id": "${webhook.id}",
  "destination_url": "${webhook.endpoint}",
  "authentication_method": "X-Webhook-Signature",
  "signature_key": "${webhook.secretKey}",
  "events": ${JSON.stringify(webhook.events)},
  "retry_policy": {
    "max_retries": 5,
    "retry_interval": "exponential",
    "initial_delay": "30s"
  },
  "timeout": "10s",
  "version": "1.0"
}`}
          />
          <p className="text-xs text-gray-500 mt-2">
            هذه المعلومات الفنية تساعد المطورين على فهم كيفية عمل ويب هوك الإرسال.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
