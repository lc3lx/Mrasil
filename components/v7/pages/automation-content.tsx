"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, Clock, Filter, Search, Settings, Tag, Workflow, Zap } from "lucide-react"
import { routes } from "@/lib/routes"

// بيانات تجريبية للقواعد
const automationRules = [
  {
    id: "rule1",
    name: "تعيين شركة الشحن تلقائياً",
    description: "تعيين شركة الشحن بناءً على الوزن والوجهة",
    status: "active",
    triggers: ["عند إنشاء شحنة جديدة"],
    conditions: ["الوزن أقل من 5 كجم", "الوجهة داخل المدينة"],
    actions: ["تعيين شركة الشحن: السريع"],
    lastRun: "منذ 3 ساعات",
    runsCount: 28,
  },
  {
    id: "rule2",
    name: "إشعار تأخير الشحنة",
    description: "إرسال إشعار للعميل عند تأخر الشحنة",
    status: "active",
    triggers: ["عند تحديث حالة الشحنة"],
    conditions: ["حالة الشحنة: متأخرة"],
    actions: ["إرسال إشعار للعميل", "إرسال بريد إلكتروني للمسؤول"],
    lastRun: "منذ يوم واحد",
    runsCount: 12,
  },
  {
    id: "rule3",
    name: "خصم تلقائي للعملاء المميزين",
    description: "تطبيق خصم 10% للعملاء ذوي الفئة الذهبية",
    status: "inactive",
    triggers: ["عند إنشاء شحنة جديدة"],
    conditions: ["فئة العميل: ذهبي"],
    actions: ["تطبيق خصم: 10%"],
    lastRun: "منذ 5 أيام",
    runsCount: 45,
  },
  {
    id: "rule4",
    name: "تحديث حالة الطلب تلقائياً",
    description: "تحديث حالة الطلب عند تغيير حالة الشحنة",
    status: "active",
    triggers: ["عند تحديث حالة الشحنة"],
    conditions: ["حالة الشحنة: تم التسليم"],
    actions: ["تحديث حالة الطلب: مكتمل"],
    lastRun: "منذ ساعتين",
    runsCount: 67,
  },
]

// بيانات تجريبية للقوالب
const automationTemplates = [
  {
    id: "template1",
    name: "إشعارات تحديث الشحنة",
    description: "إرسال إشعارات للعملاء عند تحديث حالة الشحنة",
    category: "إشعارات",
    popularity: "شائع",
  },
  {
    id: "template2",
    name: "تعيين شركة الشحن تلقائياً",
    description: "اختيار شركة الشحن المناسبة بناءً على معايير محددة",
    category: "شركات الشحن",
    popularity: "شائع جداً",
  },
  {
    id: "template3",
    name: "تطبيق الخصومات التلقائية",
    description: "تطبيق خصومات بناءً على قيمة الطلب أو فئة العميل",
    category: "التسعير",
    popularity: "شائع",
  },
  {
    id: "template4",
    name: "تذكير بالشحنات المتأخرة",
    description: "إرسال تذكيرات للفريق عند تأخر الشحنات",
    category: "تذكيرات",
    popularity: "جديد",
  },
  {
    id: "template5",
    name: "تحديث حالة الطلب تلقائياً",
    description: "تحديث حالة الطلب بناءً على حالة الشحنة",
    category: "تكامل",
    popularity: "شائع",
  },
  {
    id: "template6",
    name: "تقارير أسبوعية تلقائية",
    description: "إرسال تقارير أسبوعية عن أداء الشحنات",
    category: "تقارير",
    popularity: "جديد",
  },
]

// بيانات تجريبية لسجل النشاط
const activityLogs = [
  {
    id: "log1",
    ruleName: "تعيين شركة الشحن تلقائياً",
    timestamp: "اليوم، 14:25",
    status: "نجاح",
    details: "تم تعيين شركة السريع للشحنة #SH-12345",
  },
  {
    id: "log2",
    ruleName: "إشعار تأخير الشحنة",
    timestamp: "اليوم، 11:30",
    status: "نجاح",
    details: "تم إرسال إشعار تأخير للعميل أحمد محمد",
  },
  {
    id: "log3",
    ruleName: "تحديث حالة الطلب تلقائياً",
    timestamp: "اليوم، 09:15",
    status: "فشل",
    details: "فشل تحديث حالة الطلب #ORD-7890 - خطأ في الاتصال",
  },
  {
    id: "log4",
    ruleName: "تعيين شركة الشحن تلقائياً",
    timestamp: "أمس، 16:40",
    status: "نجاح",
    details: "تم تعيين شركة DHL للشحنة #SH-12346",
  },
  {
    id: "log5",
    ruleName: "خصم تلقائي للعملاء المميزين",
    timestamp: "أمس، 14:10",
    status: "نجاح",
    details: "تم تطبيق خصم 10% على الطلب #ORD-7891",
  },
]

export function AutomationContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // تصفية القواعد بناءً على البحث
  const filteredRules = automationRules.filter(
    (rule) => rule.name.includes(searchQuery) || rule.description.includes(searchQuery),
  )

  // تصفية القوالب بناءً على البحث
  const filteredTemplates = automationTemplates.filter(
    (template) =>
      template.name.includes(searchQuery) ||
      template.description.includes(searchQuery) ||
      template.category.includes(searchQuery),
  )

  // تصفية سجل النشاط بناءً على البحث
  const filteredLogs = activityLogs.filter(
    (log) => log.ruleName.includes(searchQuery) || log.details.includes(searchQuery),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3498db]">إنشاء قاعدة جديدة</h1>
          <p className="text-sm text-[#6d6a67]">إنشاء وتخصيص قواعد الأتمتة لتحسين عمليات الشحن</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">{/* تم حذف زر إنشاء قاعدة أتمتة جديدة */}</div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />
        <Input
          placeholder="البحث في قواعد الأتمتة..."
          className="pr-9 v7-neu-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid w-full grid-cols-2 v7-neu-tabs">
          <TabsTrigger value="rules" className="text-sm">
            <Workflow className="mr-2 h-4 w-4" />
            القواعد
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-sm">
            <Clock className="mr-2 h-4 w-4" />
            سجل النشاط
          </TabsTrigger>
        </TabsList>

        {/* قسم القواعد */}
        <TabsContent value="rules" className="mt-4 space-y-4">
          {filteredRules.length === 0 ? (
            <Card className="v7-neu-card">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Filter className="mb-2 h-10 w-10 text-[#6d6a67]" />
                <p className="text-center text-[#6d6a67]">لا توجد قواعد تطابق معايير البحث</p>
              </CardContent>
            </Card>
          ) : (
            filteredRules.map((rule) => (
              <Card key={rule.id} className="v7-neu-card overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold">{rule.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        rule.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }
                    >
                      {rule.status === "active" ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                  <CardDescription>{rule.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <h4 className="mb-1 text-xs font-medium text-[#6d6a67]">المحفزات</h4>
                      <ul className="space-y-1">
                        {rule.triggers.map((trigger, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs">
                            <Tag className="h-3 w-3 text-[#3498db]" />
                            {trigger}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-medium text-[#6d6a67]">الشروط</h4>
                      <ul className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs">
                            <Filter className="h-3 w-3 text-[#3498db]" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 text-xs font-medium text-[#6d6a67]">الإجراءات</h4>
                      <ul className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs">
                            <Zap className="h-3 w-3 text-[#3498db]" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-[#6d6a67]">
                      <Clock className="h-3 w-3" />
                      <span>آخر تشغيل: {rule.lastRun}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6d6a67]">
                      <Zap className="h-3 w-3" />
                      <span>عدد مرات التشغيل: {rule.runsCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch id={`toggle-${rule.id}`} defaultChecked={rule.status === "active"} />
                      <Label htmlFor={`toggle-${rule.id}`} className="text-xs">
                        {rule.status === "active" ? "نشط" : "غير نشط"}
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`${routes.automation}/${rule.id}`)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>

        {/* قسم سجل النشاط */}
        <TabsContent value="activity" className="mt-4 space-y-4">
          {filteredLogs.length === 0 ? (
            <Card className="v7-neu-card">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Filter className="mb-2 h-10 w-10 text-[#6d6a67]" />
                <p className="text-center text-[#6d6a67]">لا توجد سجلات نشاط تطابق معايير البحث</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="v7-neu-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold">سجل نشاط الأتمتة</CardTitle>
                <CardDescription>آخر الإجراءات التي تم تنفيذها بواسطة قواعد الأتمتة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                      <div
                        className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                          log.status === "نجاح" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {log.status === "نجاح" ? (
                          <Zap className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{log.ruleName}</h4>
                          <span className="text-xs text-[#6d6a67]">{log.timestamp}</span>
                        </div>
                        <p className="text-sm text-[#6d6a67]">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
