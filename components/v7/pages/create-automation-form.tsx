"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Check, Filter, Plus, Tag, Trash, Zap, AlertCircle, Info } from "lucide-react"
import { routes } from "@/lib/routes"
import { Badge } from "@/components/ui/badge"

// أنواع المحفزات المتاحة
const triggerTypes = [
  { id: "new_shipment", name: "إنشاء شحنة جديدة", description: "يتم تنفيذ القاعدة عند إنشاء شحنة جديدة" },
  { id: "status_update", name: "تحديث حالة الشحنة", description: "يتم تنفيذ القاعدة عند تغيير حالة الشحنة" },
  { id: "order_created", name: "إنشاء طلب جديد", description: "يتم تنفيذ القاعدة عند إنشاء طلب جديد" },
  { id: "payment_received", name: "استلام دفعة", description: "يتم تنفيذ القاعدة عند استلام دفعة جديدة" },
  { id: "return_created", name: "إنشاء طلب إرجاع", description: "يتم تنفيذ القاعدة عند إنشاء طلب إرجاع جديد" },
]

// أنواع الشروط المتاحة
const conditionTypes = [
  { id: "weight", name: "وزن الشحنة", type: "number", options: ["أقل من", "أكبر من", "يساوي"] },
  { id: "destination", name: "وجهة الشحنة", type: "select", options: ["داخل المدينة", "خارج المدينة", "دولي"] },
  { id: "customer_type", name: "فئة العميل", type: "select", options: ["عادي", "فضي", "ذهبي", "بلاتيني"] },
  {
    id: "shipment_status",
    name: "حالة الشحنة",
    type: "select",
    options: ["جديدة", "قيد المعالجة", "تم الشحن", "تم التسليم", "متأخرة"],
  },
  { id: "order_value", name: "قيمة الطلب", type: "number", options: ["أقل من", "أكبر من", "يساوي"] },
]

// أنواع الإجراءات المتاحة
const actionTypes = [
  { id: "assign_carrier", name: "تعيين شركة الشحن", type: "select", options: ["السريع", "DHL", "أرامكس", "فيديكس"] },
  { id: "send_notification", name: "إرسال إشعار", type: "text", placeholder: "نص الإشعار" },
  { id: "send_email", name: "إرسال بريد إلكتروني", type: "text", placeholder: "عنوان البريد الإلكتروني" },
  { id: "apply_discount", name: "تطبيق خصم", type: "number", placeholder: "نسبة الخصم %" },
  {
    id: "update_order_status",
    name: "تحديث حالة الطلب",
    type: "select",
    options: ["جديد", "قيد المعالجة", "مكتمل", "ملغي"],
  },
]

export function CreateAutomationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  // حالة النموذج
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    triggers: [{ type: "", value: "" }],
    conditions: [{ type: "", operator: "", value: "" }],
    actions: [{ type: "", value: "" }],
  })

  // حالة الأخطاء
  const [errors, setErrors] = useState({
    name: "",
    triggers: false,
    conditions: false,
    actions: false,
  })

  // إضافة محفز جديد
  const addTrigger = () => {
    setFormData({
      ...formData,
      triggers: [...formData.triggers, { type: "", value: "" }],
    })
  }

  // إضافة شرط جديد
  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { type: "", operator: "", value: "" }],
    })
  }

  // إضافة إجراء جديد
  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: "", value: "" }],
    })
  }

  // حذف محفز
  const removeTrigger = (index: number) => {
    const newTriggers = [...formData.triggers]
    newTriggers.splice(index, 1)
    setFormData({ ...formData, triggers: newTriggers })
  }

  // حذف شرط
  const removeCondition = (index: number) => {
    const newConditions = [...formData.conditions]
    newConditions.splice(index, 1)
    setFormData({ ...formData, conditions: newConditions })
  }

  // حذف إجراء
  const removeAction = (index: number) => {
    const newActions = [...formData.actions]
    newActions.splice(index, 1)
    setFormData({ ...formData, actions: newActions })
  }

  // تحديث قيمة المحفز
  const updateTrigger = (index: number, field: string, value: string) => {
    const newTriggers = [...formData.triggers]
    newTriggers[index] = { ...newTriggers[index], [field]: value }
    setFormData({ ...formData, triggers: newTriggers })
  }

  // تحديث قيمة الشرط
  const updateCondition = (index: number, field: string, value: string) => {
    const newConditions = [...formData.conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setFormData({ ...formData, conditions: newConditions })
  }

  // تحديث قيمة الإجراء
  const updateAction = (index: number, field: string, value: string) => {
    const newActions = [...formData.actions]
    newActions[index] = { ...newActions[index], [field]: value }
    setFormData({ ...formData, actions: newActions })
  }

  // التحقق من صحة النموذج
  const validateForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      triggers: false,
      conditions: false,
      actions: false,
    }

    if (!formData.name.trim()) {
      newErrors.name = "يرجى إدخال اسم للقاعدة"
      isValid = false
    }

    const hasValidTrigger = formData.triggers.some((trigger) => trigger.type)
    if (!hasValidTrigger) {
      newErrors.triggers = true
      isValid = false
    }

    const hasValidAction = formData.actions.some((action) => action.type)
    if (!hasValidAction) {
      newErrors.actions = true
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // حفظ القاعدة
  const saveRule = () => {
    if (validateForm()) {
      console.log("تم حفظ القاعدة:", formData)
      // هنا يمكن إضافة الكود الخاص بحفظ القاعدة في قاعدة البيانات
      router.push(routes.automation)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
          onClick={() => router.push(routes.automation)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          العودة إلى الأتمتة
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
            onClick={() => router.push(routes.automation)}
          >
            إلغاء
          </Button>
          <Button
            className="bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#2573a7] text-white"
            onClick={saveRule}
          >
            <Check className="mr-2 h-4 w-4" />
            حفظ القاعدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xl text-[#294D8B]">معلومات القاعدة</CardTitle>
              <CardDescription>أدخل المعلومات الأساسية لقاعدة الأتمتة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  اسم القاعدة
                </Label>
                <Input
                  id="name"
                  placeholder="أدخل اسماً وصفياً للقاعدة"
                  className={`bg-[#F8FAFC] border-gray-200 focus:border-[#3498db] focus:ring-[#3498db] ${errors.name ? "border-red-500" : ""}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700">
                  وصف القاعدة
                </Label>
                <Textarea
                  id="description"
                  placeholder="أدخل وصفاً مختصراً للقاعدة"
                  className="bg-[#F8FAFC] border-gray-200 focus:border-[#3498db] focus:ring-[#3498db]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  className="data-[state=checked]:bg-[#3498db]"
                />
                <Label htmlFor="active" className="text-gray-700 mr-2">
                  تفعيل القاعدة
                </Label>
                {formData.isActive ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mr-2">مفعّلة</Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 mr-2">غير مفعّلة</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="triggers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#F8FAFC] p-1 rounded-lg">
              <TabsTrigger
                value="triggers"
                className={`text-sm data-[state=active]:bg-white data-[state=active]:text-[#294D8B] data-[state=active]:shadow-sm ${errors.triggers ? "text-red-500" : ""}`}
              >
                <Tag className="mr-2 h-4 w-4" />
                المحفزات
                {errors.triggers && <AlertCircle className="h-3 w-3 mr-1 text-red-500" />}
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="text-sm data-[state=active]:bg-white data-[state=active]:text-[#294D8B] data-[state=active]:shadow-sm"
              >
                <Filter className="mr-2 h-4 w-4" />
                الشروط
              </TabsTrigger>
              <TabsTrigger
                value="actions"
                className={`text-sm data-[state=active]:bg-white data-[state=active]:text-[#294D8B] data-[state=active]:shadow-sm ${errors.actions ? "text-red-500" : ""}`}
              >
                <Zap className="mr-2 h-4 w-4" />
                الإجراءات
                {errors.actions && <AlertCircle className="h-3 w-3 mr-1 text-red-500" />}
              </TabsTrigger>
            </TabsList>

            {/* قسم المحفزات */}
            <TabsContent value="triggers" className="mt-4 space-y-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg text-[#294D8B]">متى يتم تنفيذ هذه القاعدة؟</CardTitle>
                  <CardDescription>حدد الأحداث التي تؤدي إلى تنفيذ هذه القاعدة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {errors.triggers && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 ml-2" />
                      <div>
                        <p className="text-red-800 font-medium">يرجى إضافة محفز واحد على الأقل</p>
                        <p className="text-red-600 text-sm">يجب تحديد متى يتم تنفيذ هذه القاعدة</p>
                      </div>
                    </div>
                  )}

                  {formData.triggers.map((trigger, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 bg-[#F8FAFC]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">المحفز {index + 1}</Badge>
                        </div>
                        {formData.triggers.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeTrigger(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`trigger-type-${index}`} className="text-gray-700">
                            نوع المحفز
                          </Label>
                          <Select value={trigger.type} onValueChange={(value) => updateTrigger(index, "type", value)}>
                            <SelectTrigger id={`trigger-type-${index}`} className="bg-white border-gray-200">
                              <SelectValue placeholder="اختر نوع المحفز" />
                            </SelectTrigger>
                            <SelectContent>
                              {triggerTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {trigger.type && (
                            <div className="flex items-start mt-2 bg-blue-50 p-2 rounded-md">
                              <Info className="h-4 w-4 text-blue-500 mt-0.5 ml-2" />
                              <p className="text-xs text-blue-700">
                                {triggerTypes.find((t) => t.id === trigger.type)?.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 border-dashed border-gray-300 text-gray-600"
                    onClick={addTrigger}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة محفز آخر
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* قسم الشروط */}
            <TabsContent value="conditions" className="mt-4 space-y-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg text-[#294D8B]">ما هي شروط تنفيذ القاعدة؟</CardTitle>
                  <CardDescription>حدد الشروط التي يجب توفرها لتنفيذ الإجراءات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 bg-[#F8FAFC]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">الشرط {index + 1}</Badge>
                        </div>
                        {formData.conditions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeCondition(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`condition-type-${index}`} className="text-gray-700">
                            نوع الشرط
                          </Label>
                          <Select
                            value={condition.type}
                            onValueChange={(value) => updateCondition(index, "type", value)}
                          >
                            <SelectTrigger id={`condition-type-${index}`} className="bg-white border-gray-200">
                              <SelectValue placeholder="اختر نوع الشرط" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {condition.type && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor={`condition-operator-${index}`} className="text-gray-700">
                                العملية
                              </Label>
                              <Select
                                value={condition.operator}
                                onValueChange={(value) => updateCondition(index, "operator", value)}
                              >
                                <SelectTrigger id={`condition-operator-${index}`} className="bg-white border-gray-200">
                                  <SelectValue placeholder="اختر العملية" />
                                </SelectTrigger>
                                <SelectContent>
                                  {conditionTypes
                                    .find((t) => t.id === condition.type)
                                    ?.options.map((option, i) => (
                                      <SelectItem key={i} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`condition-value-${index}`} className="text-gray-700">
                                القيمة
                              </Label>
                              {conditionTypes.find((t) => t.id === condition.type)?.type === "select" ? (
                                <Select
                                  value={condition.value}
                                  onValueChange={(value) => updateCondition(index, "value", value)}
                                >
                                  <SelectTrigger id={`condition-value-${index}`} className="bg-white border-gray-200">
                                    <SelectValue placeholder="اختر القيمة" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {conditionTypes
                                      .find((t) => t.id === condition.type)
                                      ?.options.map((option, i) => (
                                        <SelectItem key={i} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input
                                  id={`condition-value-${index}`}
                                  type="text"
                                  placeholder="أدخل القيمة"
                                  className="bg-white border-gray-200"
                                  value={condition.value}
                                  onChange={(e) => updateCondition(index, "value", e.target.value)}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 border-dashed border-gray-300 text-gray-600"
                    onClick={addCondition}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة شرط آخر
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* قسم الإجراءات */}
            <TabsContent value="actions" className="mt-4 space-y-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg text-[#294D8B]">ما هي الإجراءات التي سيتم تنفيذها؟</CardTitle>
                  <CardDescription>حدد الإجراءات التي سيتم تنفيذها عند استيفاء الشروط</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {errors.actions && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 ml-2" />
                      <div>
                        <p className="text-red-800 font-medium">يرجى إضافة إجراء واحد على الأقل</p>
                        <p className="text-red-600 text-sm">يجب تحديد الإجراءات التي سيتم تنفيذها</p>
                      </div>
                    </div>
                  )}

                  {formData.actions.map((action, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-4 bg-[#F8FAFC]">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">الإجراء {index + 1}</Badge>
                        </div>
                        {formData.actions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeAction(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`action-type-${index}`} className="text-gray-700">
                            نوع الإجراء
                          </Label>
                          <Select value={action.type} onValueChange={(value) => updateAction(index, "type", value)}>
                            <SelectTrigger id={`action-type-${index}`} className="bg-white border-gray-200">
                              <SelectValue placeholder="اختر نوع الإجراء" />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {action.type && (
                          <div className="space-y-2">
                            <Label htmlFor={`action-value-${index}`} className="text-gray-700">
                              القيمة
                            </Label>
                            {actionTypes.find((t) => t.id === action.type)?.type === "select" ? (
                              <Select
                                value={action.value}
                                onValueChange={(value) => updateAction(index, "value", value)}
                              >
                                <SelectTrigger id={`action-value-${index}`} className="bg-white border-gray-200">
                                  <SelectValue placeholder="اختر القيمة" />
                                </SelectTrigger>
                                <SelectContent>
                                  {actionTypes
                                    .find((t) => t.id === action.type)
                                    ?.options?.map((option, i) => (
                                      <SelectItem key={i} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id={`action-value-${index}`}
                                type={actionTypes.find((t) => t.id === action.type)?.type || "text"}
                                placeholder={
                                  actionTypes.find((t) => t.id === action.type)?.placeholder || "أدخل القيمة"
                                }
                                className="bg-white border-gray-200"
                                value={action.value}
                                onChange={(e) => updateAction(index, "value", e.target.value)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 border-dashed border-gray-300 text-gray-600"
                    onClick={addAction}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    إضافة إجراء آخر
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg text-[#294D8B]">ملخص القاعدة</CardTitle>
              <CardDescription>نظرة عامة على قاعدة الأتمتة</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">اسم القاعدة</h4>
                  <p className="text-gray-900">{formData.name || "لم يتم تحديد اسم بعد"}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">الحالة</h4>
                  {formData.isActive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">مفعّلة</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">غير مفعّلة</Badge>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">المحفزات</h4>
                  <div className="space-y-1">
                    {formData.triggers.some((t) => t.type) ? (
                      formData.triggers.map(
                        (trigger, index) =>
                          trigger.type && (
                            <div key={index} className="flex items-center">
                              <Tag className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="text-sm">
                                {triggerTypes.find((t) => t.id === trigger.type)?.name || trigger.type}
                              </span>
                            </div>
                          ),
                      )
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم تحديد محفزات بعد</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">الشروط</h4>
                  <div className="space-y-1">
                    {formData.conditions.some((c) => c.type) ? (
                      formData.conditions.map(
                        (condition, index) =>
                          condition.type && (
                            <div key={index} className="flex items-center">
                              <Filter className="h-3 w-3 text-purple-500 mr-1" />
                              <span className="text-sm">
                                {conditionTypes.find((c) => c.id === condition.type)?.name || condition.type}
                                {condition.operator && ` ${condition.operator}`}
                                {condition.value && ` ${condition.value}`}
                              </span>
                            </div>
                          ),
                      )
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم تحديد شروط بعد</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">الإجراءات</h4>
                  <div className="space-y-1">
                    {formData.actions.some((a) => a.type) ? (
                      formData.actions.map(
                        (action, index) =>
                          action.type && (
                            <div key={index} className="flex items-center">
                              <Zap className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-sm">
                                {actionTypes.find((a) => a.id === action.type)?.name || action.type}
                                {action.value && `: ${action.value}`}
                              </span>
                            </div>
                          ),
                      )
                    ) : (
                      <p className="text-gray-500 text-sm">لم يتم تحديد إجراءات بعد</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F8FAFC] border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-[#294D8B]">نصائح سريعة</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>استخدم اسماً وصفياً يساعدك على تذكر الغرض من القاعدة</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>يمكنك إضافة أكثر من محفز وشرط وإجراء للقاعدة الواحدة</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>تأكد من اختبار القاعدة بعد إنشائها للتأكد من عملها بشكل صحيح</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
