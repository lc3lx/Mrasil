"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Info, Plus, X, Filter } from "lucide-react"

type Condition = {
  id: string
  field: string
  operator: string
  value: string
  valueType: "text" | "number" | "select" | "date"
  options?: string[]
}

export default function BlankAutomationForm() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    triggerType: "",
    action: "",
    autoPrintPolicies: true,
    conditions: [] as Condition[],
    conditionsLogic: "and",
    priority: "medium",
    showAdvanced: false,
    showConditions: true,
    retryCount: 0,
    delayBetweenRetries: "",
    logLevel: "normal",
    notifyOnFailure: false,
    carrierScope: "all",
    customerType: "all",
    applyToExisting: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  const [newCondition, setNewCondition] = useState<Omit<Condition, "id">>({
    field: "",
    operator: "",
    value: "",
    valueType: "text",
  })

  // تأكد من أن الصفحة فارغة تمامًا عند التحميل
  useEffect(() => {
    // تأكد من عدم وجود أي بيانات مخزنة مؤقتًا
    console.log("تحميل نموذج فارغ تمامًا")

    // التحقق من وجود علامة إنشاء قاعدة فارغة
    const createBlank = localStorage.getItem("createBlankAutomation")
    if (createBlank) {
      console.log("تم التأكد من طلب إنشاء قاعدة فارغة")
      // إزالة العلامة بعد التحقق منها
      localStorage.removeItem("createBlankAutomation")
    }

    // عرض رسالة ترحيبية
    setFormStatus({
      type: "info",
      message: "أنت الآن تقوم بإنشاء قاعدة أتمتة جديدة من الصفر. قم بتعبئة النموذج أدناه.",
    })

    // مسح الرسالة بعد 5 ثوانٍ
    const timer = setTimeout(() => {
      setFormStatus({ type: null, message: "" })
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // أضف هذا الكود بعد useEffect الحالي
  useEffect(() => {
    // إذا تم اختيار محفز "إضافة شرط"، قم بفتح قسم الشروط تلقائيًا
    if (formState.triggerType === "add_condition") {
      handleInputChange("showConditions", true)
    }

    // إذا تم تغيير المحفز، قم بتحديث الشروط المتاحة بناءً على نوع المحفز
    if (formState.triggerType) {
      // يمكن إضافة منطق هنا لتحديث الشروط المتاحة بناءً على المحفز المختار
      console.log(`تم اختيار المحفز: ${formState.triggerType}`)
    }
  }, [formState.triggerType])

  const handleInputChange = (field: string, value: any) => {
    setFormState((prev) => {
      // إذا كان الحقل هو triggerType وكانت القيمة هي add_condition، قم بفتح قسم الشروط تلقائيًا
      if (field === "triggerType" && value === "add_condition") {
        return {
          ...prev,
          [field]: value,
          showConditions: true,
        }
      }

      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleNewConditionChange = (field: string, value: any) => {
    setNewCondition((prev) => {
      const updated = { ...prev, [field]: value }

      // تحديث نوع القيمة بناءً على الحقل المختار
      if (field === "field") {
        switch (value) {
          case "weight":
          case "price":
          case "items_count":
          case "distance":
            return { ...updated, valueType: "number", value: "" }
          case "delivery_city":
          case "carrier":
          case "payment_method":
          case "shipment_type":
            return { ...updated, valueType: "select", value: "", options: getOptionsForField(value) }
          case "destination":
            return { ...updated, valueType: "select", value: "" }
          case "expected_delivery_date":
            return { ...updated, valueType: "date", value: "" }
          default:
            return { ...updated, valueType: "text", value: "" }
        }
      }

      return updated
    })
  }

  const getOptionsForField = (field: string): string[] => {
    switch (field) {
      case "delivery_city":
        return ["الرياض", "جدة", "الدمام", "مكة", "المدينة", "الخبر", "الطائف", "تبوك", "بريدة", "خميس مشيط"]
      case "carrier":
        return ["أرامكس", "DHL", "فيديكس", "UPS", "سمسا", "زاجل", "ناقل", "iMile"]
      case "payment_method":
        return ["الدفع عند الاستلام", "بطاقة ائتمان", "تحويل بنكي", "محفظة إلكترونية", "Apple Pay"]
      case "shipment_type":
        return ["قياسي", "سريع", "في نفس اليوم", "اقتصادي", "دولي"]
      default:
        return []
    }
  }

  const getSaudiCities = (): string[] => {
    return [
      "الرياض",
      "جدة",
      "مكة المكرمة",
      "المدينة المنورة",
      "الدمام",
      "الخبر",
      "الظهران",
      "الأحساء",
      "القطيف",
      "حفر الباطن",
      "الجبيل",
      "الطائف",
      "بريدة",
      "عنيزة",
      "حائل",
      "تبوك",
      "سكاكا",
      "عرعر",
      "أبها",
      "خميس مشيط",
      "نجران",
      "جازان",
      "الباحة",
      "بيشة",
      "ينبع",
      "الخرج",
      "الدوادمي",
      "القريات",
      "رفحاء",
      "شرورة",
      "القنفذة",
      "محايل عسير",
      "رابغ",
      "الرس",
      "المجمعة",
      "الزلفي",
      "الأفلاج",
      "الخفجي",
      "رأس تنورة",
      "بقيق",
      "النعيرية",
      "الخرمة",
      "تربة",
      "رنية",
      "الليث",
      "ضباء",
      "تيماء",
      "أملج",
      "الوجه",
      "البدائع",
      "الدرعية",
      "الرويضة",
      "الغاط",
      "الحريق",
      "حوطة بني تميم",
      "شقراء",
      "ثادق",
      "ضرماء",
      "المزاحمية",
      "رماح",
      "ثول",
      "خليص",
      "الكامل",
      "العلا",
      "بدر",
      "المهد",
      "الحناكية",
      "خيبر",
      "العيص",
      "الفريش",
      "الحائط",
      "السليل",
      "تثليث",
      "القويعية",
      "وادي الدواسر",
      "الجموم",
      "بحرة",
      "مدركة",
      "البكيرية",
      "الشماسية",
      "الأسياح",
      "النبهانية",
      "عيون الجواء",
      "الخصيبة",
      "عقلة الصقور",
      "المذنب",
      "رياض الخبراء",
    ]
  }

  const addCondition = () => {
    if (!newCondition.field || !newCondition.operator || newCondition.value === "") {
      setFormStatus({
        type: "error",
        message: "يرجى تعبئة جميع حقول الشرط قبل الإضافة",
      })

      // مسح الرسالة بعد 3 ثوانٍ
      setTimeout(() => {
        setFormStatus({ type: null, message: "" })
      }, 3000)

      return
    }

    const condition: Condition = {
      ...newCondition,
      id: `condition-${Date.now()}`,
    }

    setFormState((prev) => ({
      ...prev,
      conditions: [...prev.conditions, condition],
    }))

    // إعادة تعيين نموذج الشرط الجديد
    setNewCondition({
      field: "",
      operator: "",
      value: "",
      valueType: "text",
    })

    setFormStatus({
      type: "success",
      message: "تمت إضافة الشرط بنجاح",
    })

    // مسح الرسالة بعد 2 ثوانٍ
    setTimeout(() => {
      setFormStatus({ type: null, message: "" })
    }, 2000)
  }

  const removeCondition = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((condition) => condition.id !== id),
    }))
  }

  const getFieldLabel = (field: string): string => {
    switch (field) {
      case "weight":
        return "وزن الشحنة"
      case "price":
        return "قيمة الشحنة"
      case "delivery_city":
        return "مدينة التسليم"
      case "carrier":
        return "الناقل"
      case "items_count":
        return "عدد المنتجات"
      case "payment_method":
        return "طريقة الدفع"
      case "shipment_type":
        return "نوع الشحنة"
      case "customer_segment":
        return "شريحة العميل"
      case "distance":
        return "المسافة"
      case "expected_delivery_date":
        return "تاريخ التسليم المتوقع"
      case "has_fragile_items":
        return "يحتوي على مواد قابلة للكسر"
      case "is_cod":
        return "الدفع عند الاستلام"
      default:
        return field
    }
  }

  // أضف هذه الدالة بعد دالة getFieldLabel
  const getFieldDescription = (field: string): string => {
    switch (field) {
      case "weight":
        return "وزن الشحنة بالكيلوجرام. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على وزن الشحنة."
      case "shipping_price":
        return "سعر الشحنة بالريال. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على قيمة الشحنة."
      case "destination":
        return "وجهة الشحنة (المدينة أو المنطقة). يمكن استخدامه لتطبيق قواعد مختلفة بناءً على مكان التسليم."
      case "payment_method":
        return "طريقة الدفع المستخدمة للشحنة. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على طريقة الدفع."
      case "product_name":
        return "اسم المنتج في الشحنة. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على المنتجات المشحونة."
      case "product_sku":
        return "معرف المنتج (SKU) في الشحنة. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على رموز المنتجات."
      case "items_count":
        return "عدد القطع في الشحنة. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على كمية المنتجات."
      case "distance":
        return "المسافة بالكيلومتر. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على المسافة بين نقطة الانطلاق والوجهة."
      case "expected_delivery_date":
        return "تاريخ التسليم المتوقع للشحنة. يمكن استخدامه لتطبيق قواعد مختلفة بناءً على موعد التسليم."
      case "has_fragile_items":
        return "يشير إلى ما إذا كانت الشحنة تحتوي على مواد قابلة للكسر. يمكن استخدامه لتطبيق قواعد خاصة للشحنات الحساسة."
      case "is_cod":
        return "يشير إلى ما إذا كانت الشحنة بنظام الدفع عند الاستلام. يمكن استخدامه لتطبيق قواعد خاصة بطرق الدفع."
      default:
        return "اختر خاصية الشحنة التي تريد تطبيق الشرط عليها."
    }
  }

  const getOperatorLabel = (operator: string): string => {
    switch (operator) {
      case "equals":
        return "يساوي"
      case "not_equals":
        return "لا يساوي"
      case "greater_than":
        return "أكبر من"
      case "less_than":
        return "أقل من"
      case "contains":
        return "يحتوي على"
      case "not_contains":
        return "لا يحتوي على"
      case "starts_with":
        return "يبدأ بـ"
      case "ends_with":
        return "ينتهي بـ"
      case "in_list":
        return "ضمن القائمة"
      case "not_in_list":
        return "ليس ضمن القائمة"
      case "before_date":
        return "قبل تاريخ"
      case "after_date":
        return "بعد تاريخ"
      case "is_true":
        return "صحيح"
      case "is_false":
        return "غير صحيح"
      default:
        return operator
    }
  }

  // أضف هذه الدالة بعد دالة getOperatorLabel
  const getOperatorDescription = (operator: string): string => {
    switch (operator) {
      case "equals":
        return "يستخدم للمقارنة المباشرة. يتحقق الشرط عندما تكون القيمة مطابقة تماماً للقيمة المحددة."
      case "not_equals":
        return "عكس المساواة. يتحقق الشرط عندما تكون القيمة مختلفة عن القيمة المحددة."
      case "greater_than":
        return "يستخدم للقيم الرقمية. يتحقق الشرط عندما تكون القيمة أكبر من القيمة المحددة."
      case "less_than":
        return "يستخدم للقيم الرقمية. يتحقق الشرط عندما تكون القيمة أقل من القيمة المحددة."
      case "greater_than_or_equal":
        return "يستخدم للقيم الرقمية. يتحقق الشرط عندما تكون القيمة أكبر من أو تساوي القيمة المحددة."
      case "less_than_or_equal":
        return "يستخدم للقيم الرقمية. يتحقق الشرط عندما تكون القيمة أقل من أو تساوي القيمة المحددة."
      case "contains":
        return "يستخدم للنصوص. يتحقق الشرط عندما تحتوي القيمة على النص المحدد في أي مكان."
      case "not_contains":
        return "يستخدم للنصوص. يتحقق الشرط عندما لا تحتوي القيمة على النص المحدد."
      case "starts_with":
        return "يستخدم للنصوص. يتحقق الشرط عندما تبدأ القيمة بالنص المحدد."
      case "ends_with":
        return "يستخدم للنصوص. يتحقق الشرط عندما تنتهي القيمة بالنص المحدد."
      case "in_list":
        return "يتحقق الشرط عندما تكون القيمة موجودة ضمن قائمة القيم المحددة."
      case "not_in_list":
        return "يتحقق الشرط عندما لا تكون القيمة موجودة ضمن قائمة القيم المحددة."
      case "before_date":
        return "يستخدم للتواريخ. يتحقق الشرط عندما يكون التاريخ قبل التاريخ المحدد."
      case "after_date":
        return "يستخدم للتواريخ. يتحقق الشرط عندما يكون التاريخ بعد التاريخ المحدد."
      case "is_true":
        return "يستخدم للقيم المنطقية. يتحقق الشرط عندما تكون القيمة صحيحة (نعم)."
      case "is_false":
        return "يستخدم للقيم المنطقية. يتحقق الشرط عندما تكون القيمة خاطئة (لا)."
      default:
        return "اختر المعامل المناسب للشرط."
    }
  }

  const getConditionSummary = (condition: Condition): string => {
    const fieldLabel = getFieldLabel(condition.field)
    const operatorLabel = getOperatorLabel(condition.operator)

    if (condition.operator === "is_true" || condition.operator === "is_false") {
      return `${fieldLabel} ${operatorLabel}`
    }

    return `${fieldLabel} ${operatorLabel} ${condition.value}`
  }

  // دالة للحصول على لون مناسب لكل نوع من الشروط
  const getConditionColor = (field: string): string => {
    switch (field) {
      case "weight":
        return "bg-amber-500/70 text-white"
      case "shipping_price":
      case "price":
        return "bg-emerald-500/70 text-white"
      case "destination":
      case "delivery_city":
        return "bg-blue-500/70 text-white"
      case "payment_method":
        return "bg-purple-500/70 text-white"
      case "product_name":
        return "bg-rose-500/70 text-white"
      case "product_sku":
        return "bg-indigo-500/70 text-white"
      case "items_count":
        return "bg-orange-500/70 text-white"
      case "distance":
        return "bg-cyan-500/70 text-white"
      case "expected_delivery_date":
        return "bg-teal-500/70 text-white"
      case "has_fragile_items":
      case "is_cod":
        return "bg-red-500/70 text-white"
      default:
        return "bg-gray-500/70 text-white"
    }
  }

  // دالة لعرض أيقونة مناسبة لكل نوع من الشروط
  const getFieldIcon = (field: string, color = "text-slate-600") => {
    switch (field) {
      case "weight":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-amber-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
        )
      case "shipping_price":
      case "price":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-emerald-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      case "destination":
      case "delivery_city":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-blue-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        )
      case "payment_method":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-purple-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        )
      case "product_name":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-rose-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        )
      case "product_sku":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-indigo-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3.5 w-3.5 mr-1 ${color === "white" ? "text-white" : "text-slate-600"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        )
    }
  }

  // دالة للحصول على لون خلفية لكل نوع شرط
  const getFieldBgColor = (field: string): string => {
    switch (field) {
      case "weight":
        return "bg-gradient-to-r from-amber-50 to-white border border-amber-200"
      case "shipping_price":
      case "price":
        return "bg-gradient-to-r from-emerald-50 to-white border border-emerald-200"
      case "destination":
        return "bg-gradient-to-r from-blue-50 to-white border border-blue-200"
      case "payment_method":
        return "bg-gradient-to-r from-purple-50 to-white border border-purple-200"
      case "product_name":
        return "bg-gradient-to-r from-rose-50 to-white border border-rose-200"
      case "product_sku":
        return "bg-gradient-to-r from-indigo-50 to-white border border-indigo-200"
      case "items_count":
        return "bg-gradient-to-r from-orange-50 to-white border border-orange-200"
      case "distance":
        return "bg-gradient-to-r from-cyan-50 to-white border border-cyan-200"
      case "expected_delivery_date":
        return "bg-gradient-to-r from-teal-50 to-white border border-teal-200"
      case "has_fragile_items":
      case "is_cod":
        return "bg-gradient-to-r from-red-50 to-white border border-red-200"
      default:
        return "bg-gradient-to-r from-slate-50 to-white border border-slate-200"
    }
  }

  // دالة للحصول على لون خلفية الأيقونة لكل نوع شرط
  const getIconBgColor = (field: string): string => {
    switch (field) {
      case "weight":
        return "bg-amber-100"
      case "shipping_price":
      case "price":
        return "bg-emerald-100"
      case "destination":
      case "delivery_city":
        return "bg-blue-100"
      case "payment_method":
        return "bg-purple-100"
      case "product_name":
        return "bg-rose-100"
      case "product_sku":
        return "bg-indigo-100"
      case "items_count":
        return "bg-orange-100"
      case "distance":
        return "bg-cyan-100"
      case "expected_delivery_date":
        return "bg-teal-100"
      case "has_fragile_items":
      case "is_cod":
        return "bg-red-100"
      default:
        return "bg-slate-100"
    }
  }

  // دالة للحصول على لون النص لكل نوع شرط
  const getFieldColor = (field: string): string => {
    switch (field) {
      case "weight":
        return "text-amber-700"
      case "shipping_price":
      case "price":
        return "text-emerald-700"
      case "destination":
        return "text-blue-700"
      case "payment_method":
        return "text-purple-700"
      case "product_name":
        return "text-rose-700"
      case "product_sku":
        return "text-indigo-700"
      case "items_count":
        return "text-orange-700"
      case "distance":
        return "text-cyan-700"
      case "expected_delivery_date":
        return "text-teal-700"
      case "has_fragile_items":
      case "is_cod":
        return "text-red-700"
      default:
        return "text-slate-700"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: "info", message: "جاري حفظ القاعدة الجديدة..." })

    try {
      // محاكاة عملية الحفظ
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // نجاح العملية
      setFormStatus({
        type: "success",
        message: "تم إنشاء قاعدة الأتمتة بنجاح!",
      })

      // إعادة التوجيه بعد فترة قصيرة
      setTimeout(() => {
        router.push("/automation")
      }, 2000)
    } catch (error) {
      setFormStatus({
        type: "error",
        message: "حدث خطأ أثناء حفظ القاعدة. يرجى المحاولة مرة أخرى.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full shadow-sm bg-[#EFF2F7] border border-gray-200">
      <div className="mx-6 mb-6 p-4 bg-blue-50 border border-teal-200 rounded-md">
        <div className="flex items-center mb-2">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-medium text-blue-800">تعليمات المساعدة</h3>
        </div>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            قواعد الأتمتة تساعدك على تحسين عمليات الشحن وتوفير الوقت من خلال تنفيذ إجراءات تلقائية بناءً على شروط محددة.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div>
              <h4 className="font-medium mb-1">كيفية إنشاء قاعدة فعالة:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>حدد اسماً واضحاً ووصفاً مفصلاً للقاعدة</li>
                <li>أضف الشروط التي يجب تحققها لتنفيذ الإجراء</li>
                <li>حدد نطاق تطبيق القاعدة على شركات الشحن وفئات العملاء</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">أمثلة على قواعد الأتمتة:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>تعيين شركة شحن محددة للطلبات التي تزيد قيمتها عن 500 ريال</li>
                <li>تعيين شركة شحن سريع للطلبات المتجهة إلى مناطق محددة</li>
                <li>تعيين شركة الشحن المثالية تلقائياً بناءً على وزن الشحنة والوجهة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {formStatus.type && (
        <div
          className={`mx-6 mb-4 p-3 rounded-md flex items-center gap-2 ${
            formState.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-teal-200"
              : formState.type === "error"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-sky-50 text-sky-700 border border-teal-200"
          }`}
        >
          {formStatus.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : formStatus.type === "error" ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5" />
          )}
          <span>{formStatus.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 bg-[#EFF2F7]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* القسم الأول: المعلومات الأساسية */}
            <div className="bg-[#EFF2F7] p-6 rounded-xl border border-gray-100 shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-teal-800"
                >
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                  <path d="M7 7h.01" />
                </svg>
              </div>

              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                    <path d="M7 7h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-700">معلومات القاعدة الأساسية</h3>
                  <p className="text-sm text-slate-500 mt-1">أدخل المعلومات الأساسية لقاعدة الأتمتة</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">
                      اسم القاعدة
                    </Label>
                    <Input
                      id="name"
                      placeholder="مثال: تعيين شركة شحن سريعة للطلبات العاجلة"
                      value={formState.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="border-teal-100 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">
                      وصف القاعدة
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="اشرح الغرض من هذه القاعدة وكيفية عملها..."
                      value={formState.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-[80px] border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                    <Switch
                      id="autoPrintPolicies"
                      checked={formState.autoPrintPolicies}
                      onCheckedChange={(checked) => handleInputChange("autoPrintPolicies", checked)}
                      className="data-[state=checked]:bg-teal-600"
                    />
                    <Label htmlFor="autoPrintPolicies" className="mr-2 rtl:ml-2 rtl-mr-0 text-slate-700">
                      طباعة البوالص ألياً
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* القسم الثالث: شروط التنفيذ */}
        <div className="bg-[#EFF2F7] p-6 rounded-xl border border-gray-100 shadow-lg relative overflow-hidden my-6 mx-2 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center mb-5">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mr-4">
              <Filter className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-700">شروط تنفيذ القاعدة</h3>
              <p className="text-sm text-slate-500 mt-1">حدد الشروط التي يجب توفرها لتطبيق الإجراء</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            {formState.triggerType && (
              <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200 shadow-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5 text-teal-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                مرتبط بـ:{" "}
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleInputChange("showConditions", !formState.showConditions)}
              className="text-sm border-teal-200 text-teal-700 hover:bg-teal-50 shadow-sm flex items-center"
            >
              {formState.showConditions ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  إخفاء الشروط
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  إظهار الشروط
                </>
              )}
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm mb-5 flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              {formState.triggerType === "add_condition" ? (
                <span className="font-medium">
                  يجب إضافة شروط لتفعيل القاعدة عند اختيار محفز "إضافة شرط". أضف شرطًا واحدًا على الأقل لتتمكن من حفظ
                  القاعدة.
                </span>
              ) : (
                <span>
                  {" "}
                  لم يتم إضافة شروط بعد. سيتم تطبيق القاعدة على جميع الشحنات التي تستوفي المحفز. يمكنك إضافة شروط لتحديد
                  نطاق تطبيق القاعدة بشكل أدق.
                </span>
              )}
            </div>
          </div>

          {formState.showConditions && (
            <div className="space-y-5">
              {/* إجراءات القاعدة */}
              <div className="bg-[#EFF2F7] p-6 rounded-xl border border-gray-100 shadow-lg relative overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full text-teal-800"
                  >
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                </div>

                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      ke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-700">إجراءات القاعدة</h4>
                    <p className="text-sm text-slate-500 mt-1">حدد الإجراء الذي سيتم تنفيذه عند تحقق شروط القاعدة</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="action" className="text-teal-700 font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5 text-teal-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        ke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      اختر شركة الشحن
                    </Label>
                    <Select value={formState.action} onValueChange={(value) => handleInputChange("action", value)}>
                      <SelectTrigger
                        id="action"
                        className="border-teal-300 focus:ring-teal-500 focus:border-teal-500 bg-[#EFF2F7] hover:bg-white transition-colors duration-200 shadow-md hover:shadow-lg rounded-md font-medium text-[#294D8B] h-11"
                      >
                        <SelectValue placeholder="اختر شركة الشحن المناسبة" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="p-2 border-b border-slate-100">
                          <span className="text-xs text-slate-500">شركات الشحن المتاحة</span>
                        </div>
                        <SelectItem value="assign_aramex" className="focus:bg-red-50 focus:text-red-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-red-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة أرامكس
                          </div>
                        </SelectItem>
                        <SelectItem value="assign_dhl" className="focus:bg-yellow-50 focus:text-yellow-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-yellow-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة DHL
                          </div>
                        </SelectItem>
                        <SelectItem value="assign_fedex" className="focus:bg-purple-50 focus:text-purple-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-purple-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة فيديكس
                          </div>
                        </SelectItem>
                        <SelectItem value="assign_ups" className="focus:bg-amber-50 focus:text-amber-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-amber-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة UPS
                          </div>
                        </SelectItem>
                        <SelectItem value="assign_smsa" className="focus:bg-green-50 focus:text-green-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-green-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة سمسا
                          </div>
                        </SelectItem>
                        <SelectItem value="assign_zajil" className="focus:bg-blue-50 focus:text-blue-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-blue-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة زاجل
                          </div>
                        </SelectItem>
                        <SelectItem value="assign_imile" className="focus:bg-cyan-50 focus:text-cyan-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-cyan-500 rounded-sm flex-shrink-0 mr-2"></div>
                            تعيين شركة iMile
                          </div>
                        </SelectItem>
                        <div className="p-2 border-t border-slate-100 mt-1">
                          <span className="text-xs text-slate-500">خيارات متقدمة</span>
                        </div>
                        <SelectItem value="assign_optimal_carrier" className="focus:bg-teal-50 focus:text-teal-700">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-teal-500 rounded-sm flex-shrink-0 mr-2 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                            </div>
                            تعيين شركة الشحن المثالية تلقائياً
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {formState.action && (
                      <div className="mt-3 bg-white/80 p-3 rounded-md border border-teal-200 flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-teal-600 mr-2 mt-0.5 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12" y2="8" />
                        </svg>
                        <div className="text-sm text-teal-700">
                          {formState.action === "assign_optimal_carrier"
                            ? "سيتم اختيار شركة الشحن المثالية تلقائياً بناءً على الوزن والوجهة والسعر لتحقيق أفضل توازن بين التكلفة وسرعة التوصيل."
                            : "سيتم تعيين شركة الشحن المحددة لجميع الشحنات التي تستوفي الشروط المحددة في هذه القاعدة."}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* الشروط الحالية */}
              {formState.conditions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-700">الشروط المضافة</h4>

                    {formState.conditions.length > 1 && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-xs text-slate-500">منطق الربط:</span>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <Button
                            type="button"
                            size="sm"
                            variant={formState.conditionsLogic === "and" ? "default" : "outline"}
                            onClick={() => handleInputChange("conditionsLogic", "and")}
                            className={`text-xs h-7 px-2 ${formState.conditionsLogic === "and" ? "bg-teal-600 hover:bg-teal-700" : "border-teal-200 text-teal-700 hover:bg-teal-50"}`}
                          >
                            تحقق جميع الشروط (و)
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={formState.conditionsLogic === "or" ? "default" : "outline"}
                            onClick={() => handleInputChange("conditionsLogic", "or")}
                            className={`text-xs h-7 px-2 ${formState.conditionsLogic === "or" ? "bg-teal-600 hover:bg-teal-700" : "border-teal-200 text-teal-700 hover:bg-teal-50"}`}
                          >
                            تحقق أي شرط (أو)
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {formState.conditions.map((condition, index) => (
                      <div
                        key={condition.id}
                        className="flex items-center justify-between bg-white p-3 rounded border border-teal-100 hover:border-teal-300 transition-colors"
                      >
                        <div className="flex items-center">
                          {index > 0 && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 ml-2 rtl:mr-2 rtl:ml-0">
                              {formState.conditionsLogic === "and" ? "و" : "أو"}
                            </span>
                          )}
                          <span className="text-sm text-slate-700">{getConditionSummary(condition)}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition(condition.id)}
                          className="h-7 w-7 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* إضافة شرط جديد */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <h4 className="text-base font-bold text-slate-700">إضافة شرط جديد</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-[#EFF2F7] p-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-full h-full text-teal-800"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                      </div>
                      <Label
                        htmlFor="conditionField"
                        className="text-xs mb-2 block font-medium flex items-center text-teal-700"
                      >
                        <div className="p-1 rounded-full mr-2 flex-shrink-0 shadow-sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 text-[#0891b2]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          </svg>
                        </div>
                        خصائص الشحنة
                      </Label>
                      <Select
                        value={newCondition.field}
                        onValueChange={(value) => handleNewConditionChange("field", value)}
                      >
                        <SelectTrigger
                          id="conditionField"
                          className="h-11 border-teal-300 focus:ring-teal-500 bg-[#EFF2F7] hover:bg-white transition-colors duration-200 shadow-md hover:shadow-lg rounded-md font-medium text-[#294D8B]"
                        >
                          <SelectValue placeholder="اختر خاصية الشحنة" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2 border-b border-slate-100">
                            <span className="text-xs text-teal-600 font-medium">اختر خاصية الشحنة</span>
                          </div>
                          <SelectItem value="weight" className="focus:bg-amber-50 focus:text-amber-700">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-amber-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                              </div>
                              الوزن
                            </div>
                          </SelectItem>
                          <SelectItem value="shipping_price" className="focus:bg-emerald-50 focus:text-emerald-700">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-emerald-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                              </div>
                              سعر الشحنة
                            </div>
                          </SelectItem>
                          <SelectItem value="destination" className="focus:bg-blue-50 focus:text-blue-700">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-blue-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              </div>
                              الوجهة
                            </div>
                          </SelectItem>
                          <SelectItem value="payment_method" className="focus:bg-purple-50 focus:text-purple-700">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-purple-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                              </div>
                              طريقة الدفع
                            </div>
                          </SelectItem>
                          <SelectItem value="product_name" className="focus:bg-rose-50 focus:text-rose-700">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-rose-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                              </div>
                              اسم المنتج
                            </div>
                          </SelectItem>
                          <SelectItem value="product_sku" className="focus:bg-indigo-50 focus:text-indigo-700">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-indigo-100 rounded-full flex-shrink-0 mr-2 flex items-center justify-center">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                              </div>
                              معرف المنتج SKU
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {newCondition.field && (
                        <div className="mt-3 text-xs bg-white/90 p-3 rounded-md border border-slate-200 flex items-start shadow-sm backdrop-blur-sm">
                          <div className="p-1.5 rounded-full mr-2 flex-shrink-0 shadow-inner">
                            <Info className="h-3.5 w-3.5 text-[#0891b2]" />
                          </div>
                          <span className="leading-relaxed text-teal-700">
                            {getFieldDescription(newCondition.field)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`${
                        newCondition.field ? getFieldBgColor(newCondition.field) : "bg-[#EFF2F7]"
                      } p-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200 ${
                        newCondition.field
                          ? `border-${
                              newCondition.field === "weight"
                                ? "amber"
                                : newCondition.field === "shipping_price"
                                  ? "emerald"
                                  : newCondition.field === "destination"
                                    ? "blue"
                                    : newCondition.field === "payment_method"
                                      ? "purple"
                                      : newCondition.field === "product_name"
                                        ? "rose"
                                        : newCondition.field === "product_sku"
                                          ? "indigo"
                                          : "slate"
                            }-200`
                          : ""
                      } relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-full h-full ${
                            newCondition.field ? getFieldColor(newCondition.field) : "text-slate-600"
                          }`}
                        >
                          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                        </svg>
                      </div>
                      <Label
                        htmlFor="conditionOperator"
                        className={`text-xs mb-2 block font-medium flex items-center ${
                          newCondition.field ? getFieldColor(newCondition.field) : "text-slate-600"
                        }`}
                      >
                        <div
                          className={`p-1 rounded-full mr-2 ${
                            newCondition.field ? getIconBgColor(newCondition.field) : "bg-slate-100"
                          } flex-shrink-0 shadow-sm`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-3.5 w-3.5 ${
                              newCondition.field ? getFieldColor(newCondition.field) : "text-slate-600"
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                          </svg>
                        </div>
                        المعامل
                      </Label>
                      <Select
                        value={newCondition.operator}
                        onValueChange={(value) => handleNewConditionChange("operator", value)}
                      >
                        <SelectTrigger
                          id="conditionOperator"
                          className={`h-11 text-[#294D8B] ${
                            newCondition.field
                              ? `border-${
                                  newCondition.field === "weight"
                                    ? "amber"
                                    : newCondition.field === "shipping_price"
                                      ? "emerald"
                                      : newCondition.field === "destination"
                                        ? "blue"
                                        : newCondition.field === "payment_method"
                                          ? "purple"
                                          : newCondition.field === "product_name"
                                            ? "rose"
                                            : newCondition.field === "product_sku"
                                              ? "indigo"
                                              : "slate"
                                }-300`
                              : "border-slate-300"
                          } focus:ring-teal-500 bg-[#EFF2F7] hover:bg-white transition-colors duration-200 shadow-md hover:shadow-lg rounded-md font-medium text-slate-700`}
                        >
                          <SelectValue
                            placeholder={
                              !newCondition.field
                                ? "اختر المعامل"
                                : newCondition.field === "weight"
                                  ? "اختر معامل الوزن (كجم)"
                                  : newCondition.field === "shipping_price"
                                    ? "اختر معامل السعر (ريال)"
                                    : newCondition.field === "destination"
                                      ? "اختر معامل الوجهة"
                                      : newCondition.field === "payment_method"
                                        ? "اختر معامل طريقة الدفع"
                                        : newCondition.field === "product_name"
                                          ? "اختر معامل اسم المنتج"
                                          : newCondition.field === "product_sku"
                                            ? "اختر معامل معرف المنتج"
                                            : "اختر المعامل"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          <div className="p-2 border-b border-slate-100">
                            <span
                              className={`text-xs ${newCondition.field ? getFieldColor(newCondition.field) : "text-slate-500"} font-medium`}
                            >
                              اختر المعامل المناسب
                            </span>
                          </div>
                          {newCondition.field === "weight" ? (
                            <>
                              <SelectItem value="equals" className="focus:bg-amber-50 focus:text-amber-700">
                                يساوي (كجم)
                              </SelectItem>
                              <SelectItem value="not_equals" className="focus:bg-amber-50 focus:text-amber-700">
                                لا يساوي (كجم)
                              </SelectItem>
                              <SelectItem value="greater_than" className="focus:bg-amber-50 focus:text-amber-700">
                                أكبر من (كجم)
                              </SelectItem>
                              <SelectItem value="less_than" className="focus:bg-amber-50 focus:text-amber-700">
                                أقل من (كجم)
                              </SelectItem>
                              <SelectItem
                                value="greater_than_or_equal"
                                className="focus:bg-amber-50 focus:text-amber-700"
                              >
                                أكبر من أو يساوي (كجم)
                              </SelectItem>
                              <SelectItem value="less_than_or_equal" className="focus:bg-amber-50 focus:text-amber-700">
                                أقل من أو يساوي (كجم)
                              </SelectItem>
                            </>
                          ) : newCondition.field === "shipping_price" ? (
                            <>
                              <SelectItem value="equals" className="focus:bg-emerald-50 focus:text-emerald-700">
                                يساوي (ريال)
                              </SelectItem>
                              <SelectItem value="not_equals" className="focus:bg-emerald-50 focus:text-emerald-700">
                                لا يساوي (ريال)
                              </SelectItem>
                              <SelectItem value="greater_than" className="focus:bg-emerald-50 focus:text-emerald-700">
                                أكبر من (ريال)
                              </SelectItem>
                              <SelectItem value="less_than" className="focus:bg-emerald-50 focus:text-emerald-700">
                                أقل من (ريال)
                              </SelectItem>
                              <SelectItem
                                value="greater_than_or_equal"
                                className="focus:bg-emerald-50 focus:text-emerald-700"
                              >
                                أكبر من أو يساوي (ريال)
                              </SelectItem>
                              <SelectItem
                                value="less_than_or_equal"
                                className="focus:bg-emerald-50 focus:text-emerald-700"
                              >
                                أقل من أو يساوي (ريال)
                              </SelectItem>
                            </>
                          ) : newCondition.field === "destination" || newCondition.field === "payment_method" ? (
                            <>
                              <SelectItem value="equals" className="focus:bg-blue-50 focus:text-blue-700">
                                يساوي
                              </SelectItem>
                              <SelectItem value="not_equals" className="focus:bg-blue-50 focus:text-blue-700">
                                لا يساوي
                              </SelectItem>
                              <SelectItem value="in_list" className="focus:bg-blue-50 focus:text-blue-700">
                                ضمن القائمة
                              </SelectItem>
                              <SelectItem value="not_in_list" className="focus:bg-blue-50 focus:text-blue-700">
                                ليس ضمن القائمة
                              </SelectItem>
                            </>
                          ) : newCondition.field === "product_name" || newCondition.field === "product_sku" ? (
                            <>
                              <SelectItem value="equals" className="focus:bg-rose-50 focus:text-rose-700">
                                يساوي
                              </SelectItem>
                              <SelectItem value="not_equals" className="focus:bg-rose-50 focus:text-rose-700">
                                لا يساوي
                              </SelectItem>
                              <SelectItem value="contains" className="focus:bg-rose-50 focus:text-rose-700">
                                يحتوي على
                              </SelectItem>
                              <SelectItem value="not_contains" className="focus:bg-rose-50 focus:text-rose-700">
                                لا يحتوي على
                              </SelectItem>
                              <SelectItem value="starts_with" className="focus:bg-rose-50 focus:text-rose-700">
                                يبدأ بـ
                              </SelectItem>
                              <SelectItem value="ends_with" className="focus:bg-rose-50 focus:text-rose-700">
                                ينتهي بـ
                              </SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="equals" className="focus:bg-slate-50 focus:text-slate-700">
                                يساوي
                              </SelectItem>
                              <SelectItem value="not_equals" className="focus:bg-slate-50 focus:text-slate-700">
                                لا يساوي
                              </SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      {newCondition.operator && (
                        <div
                          className={`mt-3 text-xs ${
                            newCondition.field ? getFieldColor(newCondition.field) : "text-slate-600"
                          } bg-white/90 p-3 rounded-md border border-slate-200 flex items-start shadow-sm backdrop-blur-sm`}
                        >
                          <div
                            className={`p-1.5 rounded-full mr-2 ${
                              newCondition.field ? getIconBgColor(newCondition.field) : "bg-slate-100"
                            } flex-shrink-0 shadow-inner`}
                          >
                            <Info
                              className={`h-3.5 w-3.5 ${
                                newCondition.field ? getFieldColor(newCondition.field) : "text-slate-600"
                              }`}
                            />
                          </div>
                          <span className="leading-relaxed">{getOperatorDescription(newCondition.operator)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="conditionValue" className="text-xs mb-1 block text-slate-600">
                      القيمة
                      {newCondition.field === "weight" && <span className="text-xs text-slate-500 mr-1">(كجم)</span>}
                      {newCondition.field === "shipping_price" && (
                        <span className="text-xs text-slate-500 mr-1">(ريال)</span>
                      )}
                      {newCondition.field === "items_count" && (
                        <span className="text-xs text-slate-500 mr-1">(قطعة)</span>
                      )}
                      {newCondition.field === "distance" && <span className="text-xs text-slate-500 mr-1">(كم)</span>}
                    </Label>
                    {newCondition.operator === "is_true" || newCondition.operator === "is_false" ? (
                      <div className="h-9 flex items-center text-sm text-slate-500 border border-slate-300 rounded-md px-3">
                        {newCondition.operator === "is_true" ? "نعم" : "لا"}
                      </div>
                    ) : newCondition.field === "destination" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xs text-slate-600">اختر من القائمة أو أدخل اسم المدينة يدوياً</div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <Select
                            value={newCondition.value}
                            onValueChange={(value) => handleNewConditionChange("value", value)}
                          >
                            <SelectTrigger className="h-9 border-slate-300 text-[#294D8B]">
                              <SelectValue placeholder="اختر المدينة من القائمة" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {getSaudiCities().map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <div className="relative">
                            <Input
                              type="text"
                              value={newCondition.value}
                              onChange={(e) => handleNewConditionChange("value", e.target.value)}
                              placeholder="أو أدخل اسم المدينة يدوياً"
                              className="h-9 border-slate-300"
                            />
                          </div>
                        </div>
                      </div>
                    ) : newCondition.valueType === "select" && newCondition.options ? (
                      <Select
                        value={newCondition.value}
                        onValueChange={(value) => handleNewConditionChange("value", value)}
                      >
                        <SelectTrigger className="h-9 border-slate-300 text-[#294D8B]">
                          <SelectValue placeholder={`اختر ${getFieldLabel(newCondition.field).replace("ال", "")}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {newCondition.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : newCondition.valueType === "date" ? (
                      <Input
                        type="date"
                        value={newCondition.value}
                        onChange={(e) => handleNewConditionChange("value", e.target.value)}
                        className="h-9 border-slate-300"
                      />
                    ) : newCondition.valueType === "number" ? (
                      <div className="relative">
                        <Input
                          type="number"
                          value={newCondition.value}
                          onChange={(e) => handleNewConditionChange("value", e.target.value)}
                          placeholder={
                            newCondition.field === "weight"
                              ? "أدخل الوزن بالكيلوجرام"
                              : newCondition.field === "shipping_price"
                                ? "أدخل السعر بالريال"
                                : newCondition.field === "items_count"
                                  ? "أدخل عدد القطع"
                                  : newCondition.field === "distance"
                                    ? "أدخل المسافة بالكيلومتر"
                                    : "أدخل قيمة رقمية"
                          }
                          className="h-9 border-slate-300 pr-12"
                        />
                        {newCondition.field && (
                          <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-slate-500 text-sm">
                            {newCondition.field === "weight"
                              ? "كجم"
                              : newCondition.field === "shipping_price"
                                ? "ريال"
                                : newCondition.field === "items_count"
                                  ? "قطعة"
                                  : newCondition.field === "distance"
                                    ? "كم"
                                    : ""}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Input
                        type="text"
                        value={newCondition.value}
                        onChange={(e) => handleNewConditionChange("value", e.target.value)}
                        placeholder={
                          newCondition.field === "product_name"
                            ? "أدخل اسم المنتج"
                            : newCondition.field === "product_sku"
                              ? "أدخل معرف المنتج"
                              : newCondition.field === "destination"
                                ? "أدخل الوجهة"
                                : "أدخل القيمة"
                        }
                        className="h-9 border-slate-300"
                      />
                    )}
                  </div>

                  {(newCondition.field || newCondition.operator) && (
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-teal-700 bg-teal-50 p-2 rounded-md border border-teal-200 flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mr-1.5" />
                        <span>
                          {newCondition.field && newCondition.operator && newCondition.value
                            ? `سيتم تطبيق الشرط: ${getFieldLabel(newCondition.field)} ${getOperatorLabel(newCondition.operator)} ${newCondition.value}`
                            : "أكمل تعبئة الشرط لمعاينته"}
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={addCondition}
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                        disabled={
                          !newCondition.field ||
                          !newCondition.operator ||
                          (newCondition.operator !== "is_true" &&
                            newCondition.operator !== "is_false" &&
                            newCondition.value === "")
                        }
                      >
                        <Plus className="h-4 w-4 ml-1 rtl:mr-1 rtl:ml-0" />
                        إضافة الشرط
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* نصائح */}
              <div className="mt-4 bg-sky-50 p-3 rounded-md text-sky-700 text-xs">
                <h5 className="font-medium mb-1">نصائح لإنشاء شروط فعالة:</h5>
                <ul className="list-disc list-inside space-y-1">
                  <li>استخدم "و" عندما تريد تطبيق القاعدة فقط عند تحقق جميع الشروط</li>
                  <li>استخدم "أو" عندما تريد تطبيق القاعدة عند تحقق أي شرط من الشروط</li>
                  <li>يمكنك إضافة شروط متعددة لتحديد نطاق تطبيق القاعدة بدقة</li>
                  <li>تأكد من أن الشروط لا تتعارض مع بعضها البعض</li>
                </ul>
              </div>
            </div>
          )}

          {/* إضافة قسم المعاينة المباشرة هنا */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-teal-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 rtl:mr-2 rtl:ml-0 text-[#0891b2]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                معاينة مباشرة للقاعدة
              </h4>
            </div>

            <div className="bg-[#EFF2F7] p-5 rounded-lg border border-teal-100 shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* معاينة الشروط */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1.5 rtl:mr-1.5 rtl:ml-0 text-[#0891b2]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    الشروط المطبقة
                  </h5>

                  {formState.conditions.length === 0 ? (
                    <div className="flex items-center justify-center h-28 bg-[#EFF2F7] rounded-md border border-dashed border-slate-300 transition-all hover:border-teal-300 hover:bg-teal-50/30">
                      <div className="text-center text-slate-500 text-sm">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20v-6M6 20V10M18 20V4" />
                          </svg>
                        </div>
                        <p>لم يتم إضافة أي شروط بعد</p>
                        <p className="text-xs mt-1 text-teal-600">أضف شروطاً لتفعيل القاعدة</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-md border border-teal-100 p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="space-y-2.5">
                        {formState.conditions.map((condition, index) => (
                          <div key={condition.id} className="flex items-center">
                            {index > 0 && (
                              <div className="px-2 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-medium rounded-full mx-2 shadow-sm">
                                {formState.conditionsLogic === "and" ? "و" : "أو"}
                              </div>
                            )}
                            <div
                              className={`flex-1 text-sm px-3 py-2.5 rounded-md shadow-sm transition-all hover:shadow-md ${getFieldBgColor(condition.field)}`}
                            >
                              <div className="flex items-center">
                                <span
                                  className={`w-6 h-6 rounded-full ${getIconBgColor(condition.field)} flex items-center justify-center ml-2 rtl:mr-2 rtl:ml-0`}
                                >
                                  {getFieldIcon(condition.field)}
                                </span>
                                <span className={`font-medium ${getFieldColor(condition.field)}`}>
                                  {getConditionSummary(condition)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 text-xs bg-gradient-to-r from-teal-50 to-emerald-50 p-2 rounded-md border border-teal-100 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5 text-teal-500 flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12" y2="8" />
                        </svg>
                        <span className="text-teal-700">
                          {formState.conditions.length === 1
                            ? "سيتم تطبيق الشرط أعلاه على جميع الشحنات"
                            : formState.conditionsLogic === "and"
                              ? "سيتم تطبيق القاعدة فقط عند تحقق جميع الشروط أعلاه"
                              : "سيتم تطبيق القاعدة عند تحقق أي شرط من الشروط أعلاه"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* معاينة شركة الشحن */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1.5 rtl:mr-1.5 rtl:ml-0 text-[#0891b2]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                    شركة الشحن المختارة
                  </h5>

                  {!formState.action ? (
                    <div className="flex items-center justify-center h-28 bg-white rounded-md border border-dashed border-slate-300 transition-all hover:border-teal-300 hover:bg-teal-50/30">
                      <div className="text-center text-slate-500 text-sm">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-slate-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                        </div>
                        <p>لم يتم اختيار شركة شحن بعد</p>
                        <p className="text-xs mt-1 text-teal-600">اختر شركة الشحن لتفعيل القاعدة</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#EFF2F7] rounded-md border border-teal-100 p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center">
                        {formState.action === "assign_aramex" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">أرامكس</span>
                          </div>
                        )}
                        {formState.action === "assign_dhl" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">DHL</span>
                          </div>
                        )}
                        {formState.action === "assign_fedex" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">فيديكس</span>
                          </div>
                        )}
                        {formState.action === "assign_ups" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">UPS</span>
                          </div>
                        )}
                        {formState.action === "assign_smsa" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">سمسا</span>
                          </div>
                        )}
                        {formState.action === "assign_zajil" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">زاجل</span>
                          </div>
                        )}
                        {formState.action === "assign_imile" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <span className="text-white font-bold text-sm">iMile</span>
                          </div>
                        )}
                        {formState.action === "assign_optimal_carrier" && (
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                          </div>
                        )}

                        <div className="flex-1">
                          <h6 className="font-medium text-slate-800">
                            {formState.action === "assign_aramex"
                              ? "شركة أرامكس"
                              : formState.action === "assign_dhl"
                                ? "شركة DHL"
                                : formState.action === "assign_fedex"
                                  ? "شركة فيديكس"
                                  : formState.action === "assign_ups"
                                    ? "شركة UPS"
                                    : formState.action === "assign_smsa"
                                      ? "شركة سمسا"
                                      : formState.action === "assign_zajil"
                                        ? "شركة زاجل"
                                        : formState.action === "assign_imile"
                                          ? "شركة iMile"
                                          : "تعيين شركة الشحن المثالية تلقائياً"}
                          </h6>
                          <p className="text-sm text-slate-500 mt-1">
                            {formState.action === "assign_optimal_carrier"
                              ? "سيتم اختيار شركة الشحن المثالية تلقائياً بناءً على الوزن والوجهة والسعر لتحقيق أفضل توازن بين التكلفة وسرعة التوصيل."
                              : "سيتم تعيين هذه الشركة لجميع الشحنات التي تستوفي الشروط المحددة في هذه القاعدة."}
                            \
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "جاري الحفظ..." : "حفظ القاعدة"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
