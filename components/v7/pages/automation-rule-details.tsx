"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle2, XCircle, Edit, Trash2, Play, Pause, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data for the automation rule
const getMockAutomationRule = (id: string) => {
  return {
    id,
    name: "تحديث حالة الشحنة تلقائياً",
    description: "تحديث حالة الشحنة تلقائياً عند استلام إشعار من شركة الشحن",
    status: "active",
    createdAt: "2023-10-15T10:30:00Z",
    updatedAt: "2023-11-02T14:45:00Z",
    trigger: {
      type: "webhook",
      description: "عند استلام إشعار من شركة الشحن",
    },
    conditions: [
      {
        field: "carrier",
        operator: "equals",
        value: "DHL",
      },
      {
        field: "status_code",
        operator: "in",
        value: ["delivered", "out_for_delivery", "in_transit"],
      },
    ],
    actions: [
      {
        type: "update_shipment",
        description: "تحديث حالة الشحنة",
        details: {
          status: "{{webhook.status}}",
          lastUpdated: "{{now}}",
          notes: "تم التحديث تلقائياً بواسطة نظام الأتمتة",
        },
      },
      {
        type: "send_notification",
        description: "إرسال إشعار للعميل",
        details: {
          channel: "email",
          template: "shipment_status_update",
          recipient: "{{shipment.customer.email}}",
        },
      },
    ],
    executionHistory: [
      {
        id: "exec-001",
        timestamp: "2023-11-10T08:15:30Z",
        status: "success",
        duration: 1.2,
        details: 'تم تحديث حالة الشحنة SHP-12345 إلى "تم التسليم"',
      },
      {
        id: "exec-002",
        timestamp: "2023-11-09T14:22:45Z",
        status: "success",
        duration: 0.9,
        details: 'تم تحديث حالة الشحنة SHP-12346 إلى "قيد التوصيل"',
      },
      {
        id: "exec-003",
        timestamp: "2023-11-08T11:05:12Z",
        status: "error",
        duration: 2.3,
        details: "فشل في تحديث حالة الشحنة SHP-12347: بيانات العميل غير مكتملة",
      },
      {
        id: "exec-004",
        timestamp: "2023-11-07T09:30:18Z",
        status: "success",
        duration: 1.1,
        details: 'تم تحديث حالة الشحنة SHP-12348 إلى "في الطريق"',
      },
      {
        id: "exec-005",
        timestamp: "2023-11-06T16:45:22Z",
        status: "success",
        duration: 0.8,
        details: 'تم تحديث حالة الشحنة SHP-12349 إلى "تم التسليم"',
      },
    ],
  }
}

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date)
}

export default function AutomationRuleDetails({ id }: { id: string }) {
  const router = useRouter()
  const [rule, setRule] = useState<any>(null)
  const [isActive, setIsActive] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch rule details
    const fetchRuleDetails = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        const ruleData = getMockAutomationRule(id)
        setRule(ruleData)
        setIsActive(ruleData.status === "active")
      } catch (error) {
        console.error("Error fetching rule details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRuleDetails()
  }, [id])

  const handleStatusToggle = async () => {
    setIsActive(!isActive)
    // In a real app, this would update the rule status via API
  }

  const handleDelete = async () => {
    // In a real app, this would delete the rule via API
    setIsDeleteDialogOpen(false)
    router.push("/automation")
  }

  const handleEdit = () => {
    router.push(`/automation/${id}/edit`)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>
  }

  if (!rule) {
    return <div className="text-center py-10">لم يتم العثور على قاعدة الأتمتة</div>
  }

  return (
    <div className="space-y-6 v7-fade-in" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/automation")}
            aria-label="العودة"
            className="v7-neu-button-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{rule.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>تم الإنشاء: {formatDate(rule.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={handleStatusToggle} aria-label="تفعيل/تعطيل القاعدة" />
            <span>{isActive ? "مفعّلة" : "معطّلة"}</span>
          </div>
          <Button variant="outline" size="icon" onClick={handleEdit} className="v7-neu-button-sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon" className="v7-neu-button-sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="v7-neu-card">
              <DialogHeader>
                <DialogTitle>حذف قاعدة الأتمتة</DialogTitle>
                <DialogDescription>
                  هل أنت متأكد من رغبتك في حذف هذه القاعدة؟ لا يمكن التراجع عن هذا الإجراء.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="v7-neu-button">
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="v7-neu-button-accent">
                  حذف
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>وصف القاعدة</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{rule.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="trigger" className="v7-neu-tabs">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="trigger" className="v7-neu-tab">
                المحفز
              </TabsTrigger>
              <TabsTrigger value="conditions" className="v7-neu-tab">
                الشروط
              </TabsTrigger>
              <TabsTrigger value="actions" className="v7-neu-tab">
                الإجراءات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trigger">
              <Card className="v7-neu-card">
                <CardHeader>
                  <CardTitle>محفز القاعدة</CardTitle>
                  <CardDescription>الحدث الذي يؤدي إلى تنفيذ القاعدة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{rule.trigger.type}</Badge>
                  </div>
                  <p>{rule.trigger.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conditions">
              <Card className="v7-neu-card">
                <CardHeader>
                  <CardTitle>شروط التنفيذ</CardTitle>
                  <CardDescription>يجب استيفاء جميع الشروط لتنفيذ الإجراءات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rule.conditions.map((condition: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md v7-neu-card-inner">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant="outline">{condition.field}</Badge>
                          <span className="text-muted-foreground">{condition.operator}</span>
                          <Badge variant="secondary">
                            {Array.isArray(condition.value) ? condition.value.join(", ") : condition.value}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions">
              <Card className="v7-neu-card">
                <CardHeader>
                  <CardTitle>الإجراءات</CardTitle>
                  <CardDescription>الإجراءات التي سيتم تنفيذها عند استيفاء الشروط</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rule.actions.map((action: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md v7-neu-card-inner">
                        <h4 className="font-medium mb-2">{action.description}</h4>
                        <Badge className="mb-2">{action.type}</Badge>
                        <div className="mt-2 text-sm">
                          <pre className="bg-muted p-2 rounded-md overflow-x-auto v7-neu-inset">
                            {JSON.stringify(action.details, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="v7-neu-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  سجل التنفيذ
                </CardTitle>
                <CardDescription>آخر 5 مرات تم فيها تنفيذ القاعدة</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>المدة (ثانية)</TableHead>
                    <TableHead>التفاصيل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rule.executionHistory.map((execution: any) => (
                    <TableRow key={execution.id}>
                      <TableCell>{formatDate(execution.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {execution.status === "success" ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )}
                          <span>{execution.status === "success" ? "ناجح" : "فشل"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{execution.duration}</TableCell>
                      <TableCell className="max-w-xs truncate">{execution.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full v7-neu-button">
                عرض السجل الكامل
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>معلومات القاعدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">المعرف</div>
                  <div className="font-mono bg-muted p-2 rounded-md text-xs v7-neu-inset">{rule.id}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">تاريخ الإنشاء</div>
                  <div>{formatDate(rule.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">آخر تحديث</div>
                  <div>{formatDate(rule.updatedAt)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">الحالة</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isActive ? "success" : "secondary"}>{isActive ? "مفعّلة" : "معطّلة"}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="v7-neu-card">
            <CardHeader>
              <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full v7-neu-button" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                تعديل القاعدة
              </Button>
              <Button
                variant={isActive ? "outline" : "default"}
                className="w-full v7-neu-button"
                onClick={handleStatusToggle}
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    تعطيل القاعدة
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    تفعيل القاعدة
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="w-full v7-neu-button-accent"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                حذف القاعدة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
