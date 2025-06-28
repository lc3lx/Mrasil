"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Copy, Check, Code, Key, RefreshCw, Package, Truck, CreditCard, Users, BarChart3, Eye, EyeOff } from "lucide-react"

export function ApiDocsContent() {
  const [copied, setCopied] = useState(false)
  const [apiKey, setApiKey] = useState("sk_test_51NzT7JKG6Mrap9X2HkwOiJ7Vr5TyLM8z")
  const [showKey, setShowKey] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const regenerateKey = () => {
    // في الواقع، هذا سيكون طلب API لإعادة إنشاء المفتاح
    setApiKey("sk_test_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 v7-fade-in">
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-right">واجهة برمجة التطبيقات (API)</h1>
          <p className="text-gray-500 mt-1 text-right">إدارة وتكامل خدمات الشحن مع تطبيقاتك وأنظمتك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="v7-neu-card col-span-1 md:col-span-1 flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle className="text-right flex items-center justify-between gap-2">
              <span>مفتاح API الخاص بك</span>
              <Key className="h-5 w-5 text-[#3498db] flex-shrink-0" />
            </CardTitle>
            <CardDescription className="text-right">استخدم هذا المفتاح للوصول إلى واجهة API</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <div className="relative flex items-center">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="pr-4 text-left font-mono w-full"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="v7-neu-button-flat w-full text-sm py-2 h-auto flex items-center justify-center" 
                  onClick={() => copyToClipboard(apiKey)}
                >
                  {copied ? <Check className="h-4 w-4 ml-2" /> : <Copy className="h-4 w-4 ml-2" />}
                  <span className="text-right">{copied ? "تم النسخ" : "نسخ المفتاح"}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="v7-neu-button-flat w-full text-sm py-2 h-auto flex items-center justify-center" 
                  onClick={regenerateKey}
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  <span className="text-right">إعادة إنشاء</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-none">
            <p className="text-xs text-gray-500 text-right">
              تنبيه: لا تشارك مفتاح API الخاص بك مع أي شخص. يمكن استخدامه للوصول إلى حسابك وإجراء عمليات باسمك.
            </p>
          </CardFooter>
        </Card>

        <Card className="v7-neu-card col-span-1 md:col-span-2 flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle className="text-right flex items-center justify-between gap-2">
              <span>وثائق API</span>
              <Code className="h-5 w-5 text-[#3498db] flex-shrink-0" />
            </CardTitle>
            <CardDescription className="text-right">استكشف وثائق API الكاملة للتكامل مع خدماتنا</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="v7-neu-card-flat p-4 rounded-lg transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Package className="h-5 w-5 text-[#3498db]" />
                  </div>
                  <h3 className="font-medium flex-grow text-right">إدارة الشحنات</h3>
                </div>
                <p className="text-sm text-gray-600 text-right mb-3">إنشاء وتتبع وإدارة الشحنات برمجياً من خلال واجهة API.</p>
                <Button variant="link" className="p-0 h-auto text-[#3498db] w-full text-right">
                  عرض الوثائق
                </Button>
              </div>
              <div className="v7-neu-card-flat p-4 rounded-lg transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Truck className="h-5 w-5 text-[#3498db]" />
                  </div>
                  <h3 className="font-medium flex-grow text-right">شركات الشحن</h3>
                </div>
                <p className="text-sm text-gray-600 text-right mb-3">
                  الوصول إلى معلومات شركات الشحن وأسعارها وخدماتها المتاحة.
                </p>
                <Button variant="link" className="p-0 h-auto text-[#3498db] w-full text-right">
                  عرض الوثائق
                </Button>
              </div>
              <div className="v7-neu-card-flat p-4 rounded-lg transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Users className="h-5 w-5 text-[#3498db]" />
                  </div>
                  <h3 className="font-medium flex-grow text-right">إدارة العملاء</h3>
                </div>
                <p className="text-sm text-gray-600 text-right mb-3">إضافة وتحديث وإدارة بيانات العملاء والعناوين.</p>
                <Button variant="link" className="p-0 h-auto text-[#3498db] w-full text-right">
                  عرض الوثائق
                </Button>
              </div>
              <div className="v7-neu-card-flat p-4 rounded-lg transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <CreditCard className="h-5 w-5 text-[#3498db]" />
                  </div>
                  <h3 className="font-medium flex-grow text-right">المدفوعات والفواتير</h3>
                </div>
                <p className="text-sm text-gray-600 text-right mb-3">إدارة المدفوعات والفواتير وتتبع المعاملات المالية.</p>
                <Button variant="link" className="p-0 h-auto text-[#3498db] w-full text-right">
                  عرض الوثائق
                </Button>
              </div>
              <div className="v7-neu-card-flat p-4 rounded-lg transition-transform hover:scale-[1.02] cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <BarChart3 className="h-5 w-5 text-[#3498db]" />
                  </div>
                  <h3 className="font-medium flex-grow text-right">التقارير والإحصائيات</h3>
                </div>
                <p className="text-sm text-gray-600 text-right mb-3">الوصول إلى بيانات وإحصائيات الشحنات والأداء.</p>
                <Button variant="link" className="p-0 h-auto text-[#3498db] w-full text-right">
                  عرض الوثائق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="v7-neu-card">
        <CardHeader>
          <CardTitle className="text-right">أمثلة على استخدام API</CardTitle>
          <CardDescription className="text-right">
            استكشف كيفية استخدام واجهة API في لغات البرمجة المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rest" dir="rtl" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
              <TabsTrigger value="rest" className="text-sm">REST API</TabsTrigger>
              <TabsTrigger value="javascript" className="text-sm">JavaScript</TabsTrigger>
              <TabsTrigger value="php" className="text-sm">PHP</TabsTrigger>
              <TabsTrigger value="python" className="text-sm">Python</TabsTrigger>
            </TabsList>
            <TabsContent value="rest" className="text-left mt-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm shadow-lg">
                <pre>{`# إنشاء شحنة جديدة
POST https://api.maraseel.com/v1/shipments
Content-Type: application/json
Authorization: Bearer ${apiKey}

{
  "customer_id": "cus_123456",
  "from_address": {
    "name": "متجر الإلكترونيات",
    "phone": "+966512345678",
    "city": "الرياض",
    "address_line1": "شارع العليا"
  },
  "to_address": {
    "name": "أحمد محمد",
    "phone": "+966598765432",
    "city": "جدة",
    "address_line1": "شارع الملك فهد"
  },
  "items": [
    {
      "name": "هاتف ذكي",
      "quantity": 1,
      "value": 1999
    }
  ]
}`}</pre>
              </div>
            </TabsContent>
            <TabsContent value="javascript" className="text-left mt-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm shadow-lg">
                <pre>{`// إنشاء شحنة جديدة باستخدام JavaScript
const createShipment = async () => {
  const response = await fetch('https://api.maraseel.com/v1/shipments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${apiKey}'
    },
    body: JSON.stringify({
      customer_id: 'cus_123456',
      from_address: {
        name: 'متجر الإلكترونيات',
        phone: '+966512345678',
        city: 'الرياض',
        address_line1: 'شارع العليا'
      },
      to_address: {
        name: 'أحمد محمد',
        phone: '+966598765432',
        city: 'جدة',
        address_line1: 'شارع الملك فهد'
      },
      items: [
        {
          name: 'هاتف ذكي',
          quantity: 1,
          value: 1999
        }
      ]
    })
  });
  
  const data = await response.json();
  console.log(data);
};

createShipment();`}</pre>
              </div>
            </TabsContent>
            <TabsContent value="php" className="text-left mt-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm shadow-lg">
                <pre>{`<?php
// إنشاء شحنة جديدة باستخدام PHP
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://api.maraseel.com/v1/shipments",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => json_encode([
    'customer_id' => 'cus_123456',
    'from_address' => [
      'name' => 'متجر الإلكترونيات',
      'phone' => '+966512345678',
      'city' => 'الرياض',
      'address_line1' => 'شارع العليا'
    ],
    'to_address' => [
      'name' => 'أحمد محمد',
      'phone' => '+966598765432',
      'city' => 'جدة',
      'address_line1' => 'شارع الملك فهد'
    ],
    'items' => [
      [
        'name' => 'هاتف ذكي',
        'quantity' => 1,
        'value' => 1999
      ]
    ]
  ]),
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${apiKey}",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
?>`}</pre>
              </div>
            </TabsContent>
            <TabsContent value="python" className="text-left mt-4">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm shadow-lg">
                <pre>{`# إنشاء شحنة جديدة باستخدام Python
import requests
import json

url = "https://api.maraseel.com/v1/shipments"

payload = {
    "customer_id": "cus_123456",
    "from_address": {
        "name": "متجر الإلكترونيات",
        "phone": "+966512345678",
        "city": "الرياض",
        "address_line1": "شارع العليا"
    },
    "to_address": {
        "name": "أحمد محمد",
        "phone": "+966598765432",
        "city": "جدة",
        "address_line1": "شارع الملك فهد"
    },
    "items": [
        {
            "name": "هاتف ذكي",
            "quantity": 1,
            "value": 1999
        }
    ]
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer ${apiKey}"
}

response = requests.post(url, json=payload, headers=headers)

print(response.text)`}</pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="v7-neu-card">
        <CardHeader>
          <CardTitle className="text-right">الاستجابة المتوقعة</CardTitle>
          <CardDescription className="text-right">مثال على الاستجابة التي ستتلقاها من API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm text-left shadow-lg">
            <pre>{`{
  "status": "success",
  "data": {
    "id": "shp_9876543210",
    "customer_id": "cus_123456",
    "tracking_number": "MRSL1234567890SA",
    "status": "created",
    "from_address": {
      "name": "متجر الإلكترونيات",
      "phone": "+966512345678",
      "city": "الرياض",
      "address_line1": "شارع العليا"
    },
    "to_address": {
      "name": "أحمد محمد",
      "phone": "+966598765432",
      "city": "جدة",
      "address_line1": "شارع الملك فهد"
    },
    "items": [
      {
        "name": "هاتف ذكي",
        "quantity": 1,
        "value": 1999
      }
    ],
    "shipping_cost": 25.00,
    "created_at": "2023-05-04T21:23:00Z",
    "estimated_delivery": "2023-05-06T21:23:00Z",
    "carrier": {
      "id": "car_123",
      "name": "شركة التوصيل السريع"
    }
  }
}`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
