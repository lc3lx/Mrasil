"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink, ChevronDown, Code, Package, RefreshCw } from "lucide-react"

export default function ShippingIntegrationsContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSection, setExpandedSection] = useState<string | null>("aramex")

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // يمكن إضافة إشعار هنا
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">تفاصيل التكامل مع شركات الشحن</h1>
          <p className="text-gray-500">تعرف على كيفية ربط نظامك مع مختلف شركات الشحن واستخدام واجهات برمجة التطبيقات</p>
        </div>
        <Button className="v7-neu-button-secondary" onClick={() => router.push("/documentation")}>
          <ExternalLink className="ml-2 h-4 w-4" />
          دليل المطور الكامل
        </Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="api">واجهة API</TabsTrigger>
          <TabsTrigger value="examples">أمثلة التكامل</TabsTrigger>
          <TabsTrigger value="webhooks">ويب هوك</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="v7-neu-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="ml-2 h-5 w-5 text-blue-500" />
                  واجهة برمجة التطبيقات
                </CardTitle>
                <CardDescription>استخدم واجهة API للتكامل مع خدمات الشحن</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">تتيح لك واجهة برمجة التطبيقات الخاصة بنا إمكانية:</p>
                <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                  <li>إنشاء شحنات جديدة تلقائياً</li>
                  <li>تتبع حالة الشحنات الحالية</li>
                  <li>الحصول على تقديرات التكلفة والوقت</li>
                  <li>إدارة عناوين الشحن والاستلام</li>
                </ul>
                <Button variant="link" className="mt-4 p-0" onClick={() => setActiveTab("api")}>
                  عرض توثيق API
                </Button>
              </CardContent>
            </Card>

            <Card className="v7-neu-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RefreshCw className="ml-2 h-5 w-5 text-green-500" />
                  ويب هوك
                </CardTitle>
                <CardDescription>استقبال تحديثات فورية عن حالة الشحنات</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">استخدم ويب هوك للحصول على:</p>
                <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                  <li>تحديثات فورية عن حالة الشحنات</li>
                  <li>إشعارات عند تسليم الشحنة</li>
                  <li>تنبيهات عن أي تأخير أو مشكلة</li>
                  <li>معلومات عن موقع الشحنة الحالي</li>
                </ul>
                <Button variant="link" className="mt-4 p-0" onClick={() => setActiveTab("webhooks")}>
                  إعداد ويب هوك
                </Button>
              </CardContent>
            </Card>

            <Card className="v7-neu-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="ml-2 h-5 w-5 text-purple-500" />
                  مكتبات التكامل
                </CardTitle>
                <CardDescription>مكتبات جاهزة للتكامل بمختلف اللغات</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">مكتبات رسمية متوفرة للغات:</p>
                <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                  <li>JavaScript / Node.js</li>
                  <li>PHP</li>
                  <li>Python</li>
                  <li>Java</li>
                  <li>.NET</li>
                </ul>
                <Button variant="link" className="mt-4 p-0" onClick={() => router.push("/documentation/libraries")}>
                  تحميل المكتبات
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-6">شركات الشحن المدعومة</h2>

            <div className="space-y-4">
              <Card
                className={`v7-neu-card overflow-hidden transition-all ${expandedSection === "aramex" ? "mb-6" : ""}`}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection("aramex")}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative ml-4">
                      <Image src="/carriers/aramex-logo.png" alt="Aramex" fill className="object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold">أرامكس</h3>
                      <p className="text-sm text-gray-500">خدمات شحن محلية ودولية</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedSection === "aramex" ? "transform rotate-180" : ""}`}
                  />
                </div>

                {expandedSection === "aramex" && (
                  <CardContent className="border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2">تفاصيل التكامل</h4>
                        <p className="text-sm mb-4">للتكامل مع أرامكس، ستحتاج إلى:</p>
                        <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                          <li>حساب أرامكس للشركات</li>
                          <li>مفتاح API من أرامكس</li>
                          <li>رقم الحساب</li>
                          <li>اسم المستخدم وكلمة المرور</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">رمز التكامل</h4>
                        <div className="bg-gray-100 p-3 rounded-md text-sm font-mono text-right mb-2 relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 left-2 h-6 w-6 p-0"
                            onClick={() =>
                              copyToClipboard(
                                'const aramexConfig = { accountNumber: "YOUR_ACCOUNT", username: "YOUR_USERNAME", password: "YOUR_PASSWORD", apiKey: "YOUR_API_KEY" };',
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <div dir="ltr" className="text-left">
                            <span className="text-blue-600">const</span> aramexConfig = {"{"}
                            <br />
                            &nbsp;&nbsp;accountNumber: <span className="text-green-600">"YOUR_ACCOUNT"</span>,
                            <br />
                            &nbsp;&nbsp;username: <span className="text-green-600">"YOUR_USERNAME"</span>,
                            <br />
                            &nbsp;&nbsp;password: <span className="text-green-600">"YOUR_PASSWORD"</span>,
                            <br />
                            &nbsp;&nbsp;apiKey: <span className="text-green-600">"YOUR_API_KEY"</span>
                            <br />
                            {"}"};
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => router.push("/documentation/aramex")}
                        >
                          عرض التوثيق الكامل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className={`v7-neu-card overflow-hidden transition-all ${expandedSection === "dhl" ? "mb-6" : ""}`}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection("dhl")}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative ml-4">
                      <Image src="/carriers/dhl-logo.png" alt="DHL" fill className="object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold">DHL</h3>
                      <p className="text-sm text-gray-500">خدمات الشحن الدولي السريع</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedSection === "dhl" ? "transform rotate-180" : ""}`}
                  />
                </div>

                {expandedSection === "dhl" && (
                  <CardContent className="border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2">تفاصيل التكامل</h4>
                        <p className="text-sm mb-4">للتكامل مع DHL، ستحتاج إلى:</p>
                        <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                          <li>حساب DHL للأعمال</li>
                          <li>مفتاح API من DHL</li>
                          <li>رقم العميل</li>
                          <li>بيانات اعتماد API</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">رمز التكامل</h4>
                        <div className="bg-gray-100 p-3 rounded-md text-sm font-mono text-right mb-2 relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 left-2 h-6 w-6 p-0"
                            onClick={() =>
                              copyToClipboard(
                                'const dhlConfig = { clientId: "YOUR_CLIENT_ID", clientSecret: "YOUR_CLIENT_SECRET", accountNumber: "YOUR_ACCOUNT" };',
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <div dir="ltr" className="text-left">
                            <span className="text-blue-600">const</span> dhlConfig = {"{"}
                            <br />
                            &nbsp;&nbsp;clientId: <span className="text-green-600">"YOUR_CLIENT_ID"</span>,
                            <br />
                            &nbsp;&nbsp;clientSecret: <span className="text-green-600">"YOUR_CLIENT_SECRET"</span>,
                            <br />
                            &nbsp;&nbsp;accountNumber: <span className="text-green-600">"YOUR_ACCOUNT"</span>
                            <br />
                            {"}"};
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => router.push("/documentation/dhl")}
                        >
                          عرض التوثيق الكامل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card
                className={`v7-neu-card overflow-hidden transition-all ${expandedSection === "fedex" ? "mb-6" : ""}`}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection("fedex")}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative ml-4">
                      <Image src="/carriers/fedex-logo.png" alt="FedEx" fill className="object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold">FedEx</h3>
                      <p className="text-sm text-gray-500">خدمات الشحن الدولي والمحلي</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedSection === "fedex" ? "transform rotate-180" : ""}`}
                  />
                </div>

                {expandedSection === "fedex" && (
                  <CardContent className="border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2">تفاصيل التكامل</h4>
                        <p className="text-sm mb-4">للتكامل مع FedEx، ستحتاج إلى:</p>
                        <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                          <li>حساب FedEx للشركات</li>
                          <li>مفتاح API من FedEx</li>
                          <li>رقم العميل</li>
                          <li>رقم المتر</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">رمز التكامل</h4>
                        <div className="bg-gray-100 p-3 rounded-md text-sm font-mono text-right mb-2 relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 left-2 h-6 w-6 p-0"
                            onClick={() =>
                              copyToClipboard(
                                'const fedexConfig = { apiKey: "YOUR_API_KEY", apiSecret: "YOUR_API_SECRET", accountNumber: "YOUR_ACCOUNT", meterNumber: "YOUR_METER" };',
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <div dir="ltr" className="text-left">
                            <span className="text-blue-600">const</span> fedexConfig = {"{"}
                            <br />
                            &nbsp;&nbsp;apiKey: <span className="text-green-600">"YOUR_API_KEY"</span>,
                            <br />
                            &nbsp;&nbsp;apiSecret: <span className="text-green-600">"YOUR_API_SECRET"</span>,
                            <br />
                            &nbsp;&nbsp;accountNumber: <span className="text-green-600">"YOUR_ACCOUNT"</span>,
                            <br />
                            &nbsp;&nbsp;meterNumber: <span className="text-green-600">"YOUR_METER"</span>
                            <br />
                            {"}"};
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => router.push("/documentation/fedex")}
                        >
                          عرض التوثيق الكامل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className={`v7-neu-card overflow-hidden transition-all ${expandedSection === "ups" ? "mb-6" : ""}`}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection("ups")}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 relative ml-4">
                      <Image src="/carriers/ups-logo.png" alt="UPS" fill className="object-contain" />
                    </div>
                    <div>
                      <h3 className="font-bold">UPS</h3>
                      <p className="text-sm text-gray-500">خدمات الشحن العالمية</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedSection === "ups" ? "transform rotate-180" : ""}`}
                  />
                </div>

                {expandedSection === "ups" && (
                  <CardContent className="border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold mb-2">تفاصيل التكامل</h4>
                        <p className="text-sm mb-4">للتكامل مع UPS، ستحتاج إلى:</p>
                        <ul className="list-disc list-inside space-y-2 mr-4 text-sm">
                          <li>حساب UPS للأعمال</li>
                          <li>مفتاح API من UPS</li>
                          <li>رقم الحساب</li>
                          <li>بيانات اعتماد المطور</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold mb-2">رمز التكامل</h4>
                        <div className="bg-gray-100 p-3 rounded-md text-sm font-mono text-right mb-2 relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 left-2 h-6 w-6 p-0"
                            onClick={() =>
                              copyToClipboard(
                                'const upsConfig = { accessKey: "YOUR_ACCESS_KEY", username: "YOUR_USERNAME", password: "YOUR_PASSWORD", accountNumber: "YOUR_ACCOUNT" };',
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <div dir="ltr" className="text-left">
                            <span className="text-blue-600">const</span> upsConfig = {"{"}
                            <br />
                            &nbsp;&nbsp;accessKey: <span className="text-green-600">"YOUR_ACCESS_KEY"</span>,
                            <br />
                            &nbsp;&nbsp;username: <span className="text-green-600">"YOUR_USERNAME"</span>,
                            <br />
                            &nbsp;&nbsp;password: <span className="text-green-600">"YOUR_PASSWORD"</span>,
                            <br />
                            &nbsp;&nbsp;accountNumber: <span className="text-green-600">"YOUR_ACCOUNT"</span>
                            <br />
                            {"}"};
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => router.push("/documentation/ups")}
                        >
                          عرض التوثيق الكامل
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>واجهة برمجة التطبيقات (API)</CardTitle>
              <CardDescription>استخدم واجهة API للتكامل مع خدمات الشحن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">نقطة النهاية الأساسية</h3>
                  <div className="flex items-center bg-gray-100 p-3 rounded-md">
                    <code dir="ltr" className="text-sm flex-1">
                      https://api.yourshippingplatform.com/v1
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard("https://api.yourshippingplatform.com/v1")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">المصادقة</h3>
                  <p className="mb-4">تستخدم واجهة API المصادقة بواسطة مفتاح API. يجب تضمين المفتاح في ترويسة الطلب:</p>
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono mb-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 h-6 w-6 p-0"
                      onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <div dir="ltr" className="text-left">
                      Authorization: Bearer YOUR_API_KEY
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Input type="text" value="YOUR_API_KEY" readOnly className="ml-2" />
                    <Button variant="outline" size="sm" onClick={() => router.push("/settings/api-keys")}>
                      إدارة مفاتيح API
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">نقاط النهاية الرئيسية</h3>
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs ml-2">GET</span>
                          <span className="font-mono text-sm">/shipments</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard("GET /shipments")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm">الحصول على قائمة الشحنات</p>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs ml-2">POST</span>
                          <span className="font-mono text-sm">/shipments</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard("POST /shipments")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm">إنشاء شحنة جديدة</p>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs ml-2">GET</span>
                          <span className="font-mono text-sm">/shipments/{"{id}"}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard("GET /shipments/{id}")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm">الحصول على تفاصيل شحنة محددة</p>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs ml-2">PUT</span>
                          <span className="font-mono text-sm">/shipments/{"{id}"}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard("PUT /shipments/{id}")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm">تحديث شحنة موجودة</p>
                      </div>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs ml-2">DELETE</span>
                          <span className="font-mono text-sm">/shipments/{"{id}"}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard("DELETE /shipments/{id}")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm">إلغاء شحنة</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => router.push("/documentation/api")}>
                  عرض توثيق API الكامل
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>أمثلة التكامل</CardTitle>
              <CardDescription>أمثلة عملية للتكامل مع منصة الشحن</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">إنشاء شحنة جديدة</h3>
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono mb-2 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(`fetch('https://api.yourshippingplatform.com/v1/shipments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    carrier: 'aramex',
    service: 'express',
    pickup_address: {
      name: 'شركة المثال',
      phone: '+966500000000',
      address: 'شارع الملك فهد',
      city: 'الرياض',
      country: 'SA'
    },
    delivery_address: {
      name: 'أحمد محمد',
      phone: '+966500000001',
      address: 'شارع التحلية',
      city: 'جدة',
      country: 'SA'
    },
    parcels: [
      {
        weight: 1.5,
        dimensions: {
          length: 20,
          width: 15,
          height: 10
        }
      }
    ]
  })
})`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <div dir="ltr" className="text-left">
                      <span className="text-blue-600">fetch</span>(
                      <span className="text-green-600">'https://api.yourshippingplatform.com/v1/shipments'</span>, {"{"}
                      <br />
                      &nbsp;&nbsp;method: <span className="text-green-600">'POST'</span>,
                      <br />
                      &nbsp;&nbsp;headers: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">'Content-Type'</span>:{" "}
                      <span className="text-green-600">'application/json'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">'Authorization'</span>:{" "}
                      <span className="text-green-600">'Bearer YOUR_API_KEY'</span>
                      <br />
                      &nbsp;&nbsp;{"}"},
                      <br />
                      &nbsp;&nbsp;body: <span className="text-blue-600">JSON.stringify</span>({"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;carrier: <span className="text-green-600">'aramex'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;service: <span className="text-green-600">'express'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;pickup_address: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: <span className="text-green-600">'شركة المثال'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;phone: <span className="text-green-600">'+966500000000'</span>
                      ,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address:{" "}
                      <span className="text-green-600">'شارع الملك فهد'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;city: <span className="text-green-600">'الرياض'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;country: <span className="text-green-600">'SA'</span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;{"}"},
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;delivery_address: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: <span className="text-green-600">'أحمد محمد'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;phone: <span className="text-green-600">'+966500000001'</span>
                      ,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address:{" "}
                      <span className="text-green-600">'شارع التحلية'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;city: <span className="text-green-600">'جدة'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;country: <span className="text-green-600">'SA'</span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;{"}"},
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;parcels: [
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;weight:{" "}
                      <span className="text-purple-600">1.5</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dimensions: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;length:{" "}
                      <span className="text-purple-600">20</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width:{" "}
                      <span className="text-purple-600">15</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height:{" "}
                      <span className="text-purple-600">10</span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;]
                      <br />
                      &nbsp;&nbsp;{"}"})
                      <br />
                      {"}"})
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">تتبع شحنة</h3>
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono mb-2 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(`fetch('https://api.yourshippingplatform.com/v1/shipments/TRACK123456/tracking', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <div dir="ltr" className="text-left">
                      <span className="text-blue-600">fetch</span>(
                      <span className="text-green-600">
                        'https://api.yourshippingplatform.com/v1/shipments/TRACK123456/tracking'
                      </span>
                      , {"{"}
                      <br />
                      &nbsp;&nbsp;method: <span className="text-green-600">'GET'</span>,
                      <br />
                      &nbsp;&nbsp;headers: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">'Authorization'</span>:{" "}
                      <span className="text-green-600">'Bearer YOUR_API_KEY'</span>
                      <br />
                      &nbsp;&nbsp;{"}"}
                      <br />
                      {"}"})
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">حساب تكلفة الشحن</h3>
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono mb-2 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(`fetch('https://api.yourshippingplatform.com/v1/rates', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    origin: {
      city: 'الرياض',
      country: 'SA'
    },
    destination: {
      city: 'جدة',
      country: 'SA'
    },
    parcels: [
      {
        weight: 2,
        dimensions: {
          length: 25,
          width: 20,
          height: 15
        }
      }
    ]
  })
})`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <div dir="ltr" className="text-left">
                      <span className="text-blue-600">fetch</span>(
                      <span className="text-green-600">'https://api.yourshippingplatform.com/v1/rates'</span>, {"{"}
                      <br />
                      &nbsp;&nbsp;method: <span className="text-green-600">'POST'</span>,
                      <br />
                      &nbsp;&nbsp;headers: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">'Content-Type'</span>:{" "}
                      <span className="text-green-600">'application/json'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">'Authorization'</span>:{" "}
                      <span className="text-green-600">'Bearer YOUR_API_KEY'</span>
                      <br />
                      &nbsp;&nbsp;{"}"},
                      <br />
                      &nbsp;&nbsp;body: <span className="text-blue-600">JSON.stringify</span>({"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;origin: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;city: <span className="text-green-600">'الرياض'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;country: <span className="text-green-600">'SA'</span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;{"}"},
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;destination: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;city: <span className="text-green-600">'جدة'</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;country: <span className="text-green-600">'SA'</span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;{"}"},
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;parcels: [
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;weight: <span className="text-purple-600">2</span>
                      ,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dimensions: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;length:{" "}
                      <span className="text-purple-600">25</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width:{" "}
                      <span className="text-purple-600">20</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height:{" "}
                      <span className="text-purple-600">15</span>
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;]
                      <br />
                      &nbsp;&nbsp;{"}"})
                      <br />
                      {"}"})
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => router.push("/documentation/examples")}>
                  عرض المزيد من الأمثلة
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>ويب هوك</CardTitle>
              <CardDescription>استقبال تحديثات فورية عن حالة الشحنات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2">إعداد ويب هوك</h3>
                  <p className="mb-4">لاستقبال تحديثات فورية، قم بتسجيل عنوان URL الخاص بك:</p>
                  <div className="flex items-center mb-4">
                    <Input type="text" placeholder="https://your-website.com/webhook/shipping" className="ml-2" />
                    <Button variant="outline">تسجيل</Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    سيتم إرسال طلب POST إلى هذا العنوان عند حدوث أي تغيير في حالة الشحنة.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">أحداث ويب هوك</h3>
                  <div className="space-y-2">
                    <div className="border rounded-md p-3">
                      <h4 className="font-bold mb-1">shipment.created</h4>
                      <p className="text-sm">يتم إرساله عند إنشاء شحنة جديدة</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-bold mb-1">shipment.status_updated</h4>
                      <p className="text-sm">يتم إرساله عند تغيير حالة الشحنة</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-bold mb-1">shipment.delivered</h4>
                      <p className="text-sm">يتم إرساله عند تسليم الشحنة</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <h4 className="font-bold mb-1">shipment.cancelled</h4>
                      <p className="text-sm">يتم إرساله عند إلغاء الشحنة</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">مثال على بيانات ويب هوك</h3>
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono mb-2 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 left-2 h-6 w-6 p-0"
                      onClick={() =>
                        copyToClipboard(`{
  "event": "shipment.status_updated",
  "shipment_id": "SHIP123456",
  "tracking_number": "TRACK123456",
  "carrier": "aramex",
  "previous_status": "in_transit",
  "current_status": "out_for_delivery",
  "timestamp": "2023-05-15T10:30:00Z",
  "location": {
    "city": "جدة",
    "country": "SA"
  }
}`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <div dir="ltr" className="text-left">
                      {"{"}
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"event"</span>:{" "}
                      <span className="text-green-600">"shipment.status_updated"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"shipment_id"</span>:{" "}
                      <span className="text-green-600">"SHIP123456"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"tracking_number"</span>:{" "}
                      <span className="text-green-600">"TRACK123456"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"carrier"</span>:{" "}
                      <span className="text-green-600">"aramex"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"previous_status"</span>:{" "}
                      <span className="text-green-600">"in_transit"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"current_status"</span>:{" "}
                      <span className="text-green-600">"out_for_delivery"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"timestamp"</span>:{" "}
                      <span className="text-green-600">"2023-05-15T10:30:00Z"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">"location"</span>: {"{"}
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">"city"</span>:{" "}
                      <span className="text-green-600">"جدة"</span>,
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600">"country"</span>:{" "}
                      <span className="text-green-600">"SA"</span>
                      <br />
                      &nbsp;&nbsp;{"}"}
                      <br />
                      {"}"}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">التحقق من الأمان</h3>
                  <p className="mb-4">
                    للتحقق من صحة الطلبات الواردة، تحقق من توقيع الطلب في ترويسة X-Webhook-Signature:
                  </p>
                  <div className="bg-gray-100 p-3 rounded-md text-sm font-mono mb-2">
                    <div dir="ltr" className="text-left">
                      <span className="text-blue-600">const</span> isValid = verifySignature(
                      <br />
                      &nbsp;&nbsp;request.headers[<span className="text-green-600">'x-webhook-signature'</span>],
                      <br />
                      &nbsp;&nbsp;request.body,
                      <br />
                      &nbsp;&nbsp;<span className="text-green-600">'YOUR_WEBHOOK_SECRET'</span>
                      <br />
                      );
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => router.push("/webhooks")}>
                  إدارة إعدادات ويب هوك
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
