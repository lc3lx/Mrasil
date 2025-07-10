"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// نموذج بيانات شركات الشحن
const carriers = [
  {
    id: "aramex",
    name: "Aramex",
    arabicName: "أرامكس",
    logo: "/carriers/aramex-logo.png",
    type: "دولي",
    status: "نشط",
    description: "شركة أرامكس هي شركة خدمات لوجستية وتوصيل طرود عالمية مقرها دبي، الإمارات العربية المتحدة.",
    website: "www.aramex.com",
    integration: {
      requiresAuth: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", required: true },
        { key: "clientId", label: "Client ID", type: "text", required: true },
        { key: "secretId", label: "Secret ID", type: "password", required: true },
        { key: "userName", label: "User Name", type: "text", required: true },
        { key: "password", label: "Password", type: "password", required: true },
      ],
    },
  },
  {
    id: "dhl",
    name: "DHL",
    arabicName: "دي إتش إل",
    logo: "/carriers/dhl-logo.png",
    type: "دولي",
    status: "نشط",
    description: "دي إتش إل هي شركة لوجستية ألمانية وجزء من مجموعة دويتشه بوست دي إتش إل.",
    website: "www.dhl.com",
    integration: {
      requiresAuth: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", required: true },
        { key: "userName", label: "User Name", type: "text", required: true },
        { key: "password", label: "Password", type: "password", required: true },
        { key: "accountNumber", label: "Account Number", type: "text", required: true },
        { key: "entity", label: "Entity", type: "text", required: false },
        { key: "version", label: "Version", type: "text", required: false },
      ],
    },
  },
  {
    id: "fedex",
    name: "FedEx",
    arabicName: "فيديكس",
    logo: "/carriers/fedex-logo.png",
    type: "دولي",
    status: "نشط",
    description: "فيديكس هي شركة أمريكية متعددة الجنسيات تقدم خدمات الشحن السريع والبريد.",
    website: "www.fedex.com",
    integration: {
      requiresAuth: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", required: true },
        { key: "b2bApiKey", label: "B2B API Key", type: "password", required: false },
        { key: "clientId", label: "Client ID", type: "text", required: true },
        { key: "secretId", label: "Secret ID", type: "password", required: true },
        { key: "userName", label: "User Name", type: "text", required: true },
        { key: "password", label: "Password", type: "password", required: true },
      ],
    },
  },
  {
    id: "ups",
    name: "UPS",
    arabicName: "يو بي إس",
    logo: "/carriers/ups-logo.png",
    type: "دولي",
    status: "نشط",
    description: "يونايتد بارسل سيرفس (UPS) هي شركة أمريكية متعددة الجنسيات للشحن والخدمات اللوجستية.",
    website: "www.ups.com",
    integration: {
      requiresAuth: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", required: true },
        { key: "clientId", label: "Client ID", type: "text", required: true },
        { key: "userName", label: "User Name", type: "text", required: true },
        { key: "password", label: "Password", type: "password", required: true },
        { key: "pinNumber", label: "Pin Number", type: "password", required: false },
      ],
    },
  },
  {
    id: "smsa",
    name: "SMSA",
    arabicName: "سمسا",
    logo: "/carriers/smsa-logo.png",
    type: "محلي",
    status: "نشط",
    description: "سمسا هي شركة سعودية رائدة في مجال الشحن والخدمات اللوجستية في المملكة العربية السعودية.",
    website: "www.smsaexpress.com",
    integration: {
      requiresAuth: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", required: true },
        { key: "clientId", label: "Client ID", type: "text", required: true },
        { key: "secretId", label: "Secret ID", type: "password", required: true },
        { key: "accountNumber", label: "Account Number", type: "text", required: true },
        { key: "token", label: "Token", type: "password", required: false },
      ],
    },
  },
  {
    id: "aymakan",
    name: "Aymakan",
    arabicName: "أي مكان",
    logo: "/carriers/aymakan-logo.png",
    type: "محلي",
    status: "نشط",
    description: "أي مكان هي شركة سعودية متخصصة في خدمات التوصيل للتجارة الإلكترونية في المملكة العربية السعودية.",
    website: "www.aymakan.com",
    integration: {
      requiresAuth: true,
      fields: [
        { key: "apiKey", label: "API Key", type: "password", required: true },
        { key: "userName", label: "User Name", type: "text", required: true },
        { key: "password", label: "Password", type: "password", required: true },
        { key: "accountNumber", label: "Account Number", type: "text", required: true },
      ],
    },
  },
]

export function CarrierIntegrationForm({ id }: { id: string }) {
  const router = useRouter()
  const carrier = carriers.find((c) => c.id === id)

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // تهيئة حالة النموذج
  useEffect(() => {
    if (carrier) {
      const initialFormData: Record<string, string> = {}
      const initialShowSecrets: Record<string, boolean> = {}

      carrier.integration.fields.forEach((field) => {
        initialFormData[field.key] = ""
        if (field.type === "password") {
          initialShowSecrets[field.key] = false
        }
      })

      setFormData(initialFormData)
      setShowSecrets(initialShowSecrets)
    }
  }, [carrier])

  if (!carrier) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">شركة الشحن غير موجودة</h1>
        <p className="text-gray-500 mb-6">لم يتم العثور على شركة الشحن المطلوبة.</p>
        <Button onClick={() => router.push("/carriers/integration")}>
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة إلى قائمة شركات الشحن
        </Button>
      </div>
    )
  }

  // تبديل إظهار/إخفاء الحقول السرية
  const toggleShowSecret = (field: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // تحديث بيانات النموذج
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // اختبار الاتصال
  const testConnection = async () => {
    setIsTestingConnection(true)

    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // تحقق من وجود جميع الحقول المطلوبة
    const missingRequiredFields = carrier.integration.fields.filter((field) => field.required && !formData[field.key])

    if (missingRequiredFields.length > 0) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة قبل اختبار الاتصال.")
      setShowErrorDialog(true)
      setIsTestingConnection(false)
      return
    }

    // محاكاة نجاح الاتصال (في تطبيق حقيقي، سيتم إرسال طلب إلى الخادم)
    const success = Math.random() > 0.3 // 70% فرصة للنجاح

    if (success) {
      setShowSuccessDialog(true)
    } else {
      setErrorMessage(
        "فشل الاتصال بواجهة برمجة التطبيقات (API). يرجى التحقق من صحة البيانات المدخلة والمحاولة مرة أخرى.",
      )
      setShowErrorDialog(true)
    }

    setIsTestingConnection(false)
  }

  // حفظ التكامل
  const saveIntegration = async () => {
    setIsSubmitting(true)

    // محاكاة تأخير الشبكة
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // تحقق من وجود جميع الحقول المطلوبة
    const missingRequiredFields = carrier.integration.fields.filter((field) => field.required && !formData[field.key])

    if (missingRequiredFields.length > 0) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة قبل حفظ التكامل.")
      setShowErrorDialog(true)
      setIsSubmitting(false)
      return
    }

    // محاكاة نجاح الحفظ (في تطبيق حقيقي، سيتم إرسال البيانات إلى الخادم)
    setShowSuccessDialog(true)
    setIsSubmitting(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="v7-neu-button-secondary ml-2"
          onClick={() => router.push("/carriers/integration")}
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة
        </Button>
        <h1 className="text-2xl font-bold">تكامل {carrier.arabicName}</h1>
      </div>

      {/* معلومات الشركة الأساسية */}
      <div className="v7-neu-card p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={carrier.logo || "/placeholder.svg"}
              alt={carrier.name}
              className="w-24 h-24 rounded-xl v7-neu-image"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">{carrier.arabicName}</h2>
            <div className="flex items-center mt-2">
              <span
                className={`px-2 py-1 rounded-md text-xs ${carrier.status === "نشط" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {carrier.status}
              </span>
            </div>
            <p className="mt-4 text-gray-600">{carrier.description}</p>
            <div className="mt-2">
              <a
                href={`https://${carrier.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {carrier.website}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج التكامل */}
      <Card className="border-blue-200">
        <CardContent className="p-6" style={{ backgroundColor: "#EFF2F7" }}>
          <h2 className="text-xl font-bold mb-6">بيانات التكامل مع {carrier.arabicName}</h2>

          <p className="text-gray-500 mb-6">
            أدخل بيانات الاتصال API الخاصة بشركة الشحن. هذه البيانات ضرورية لإتمام عملية الربط والتكامل.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {carrier.integration.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    type={field.type === "password" && !showSecrets[field.key] ? "password" : "text"}
                    placeholder={`أدخل ${field.label}`}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    required={field.required}
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => toggleShowSecret(field.key)}
                    >
                      {showSecrets[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {field.required && <p className="text-xs text-gray-500">* مطلوب</p>}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>ملاحظة:</strong> يمكنك الحصول على بيانات API من لوحة تحكم شركة الشحن أو من خلال التواصل مع فريق
              الدعم الفني الخاص بهم.
            </p>
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={isTestingConnection || isSubmitting}
              className="flex items-center shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: "#EFF2F7" }}
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري اختبار الاتصال...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  اختبار الاتصال
                </>
              )}
            </Button>

            <Button
              onClick={saveIntegration}
              disabled={isSubmitting || isTestingConnection}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 ml-2" />
                  حفظ التكامل
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نافذة النجاح */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم بنجاح</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center">
              تم حفظ بيانات التكامل مع {carrier.arabicName} بنجاح. يمكنك الآن استخدام خدمات الشحن من خلال منصتنا.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/carriers/integration")
              }}
            >
              العودة إلى القائمة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* نافذة الخطأ */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حدث خطأ</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-center">{errorMessage}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>حسناً</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
