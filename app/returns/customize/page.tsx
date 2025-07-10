"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Check, Copy, Download, Eye, Globe, Layout, Palette, Save, Upload } from "lucide-react"

export default function CustomizeReturnPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("design")
  const [primaryColor, setPrimaryColor] = useState("#3498db")
  const [secondaryColor, setSecondaryColor] = useState("#f5f5f5")
  const [textColor, setTextColor] = useState("#333333")
  const [logoUrl, setLogoUrl] = useState("/company-logo.png")
  const [headerText, setHeaderText] = useState("إرجاع المنتجات")
  const [subheaderText, setSubheaderText] = useState(
    "يمكنك إرجاع المنتجات التي اشتريتها خلال 14 يومًا من تاريخ الاستلام",
  )
  const [buttonText, setButtonText] = useState("إرسال طلب الإرجاع")
  const [successMessage, setSuccessMessage] = useState("تم استلام طلب الإرجاع بنجاح. سنتواصل معك قريبًا.")
  const [showOrderNumber, setShowOrderNumber] = useState(true)
  const [showProductSelection, setShowProductSelection] = useState(true)
  const [showReasonField, setShowReasonField] = useState(true)
  const [showAttachments, setShowAttachments] = useState(true)
  const [showContactInfo, setShowContactInfo] = useState(true)
  const [template, setTemplate] = useState("modern")
  const [language, setLanguage] = useState("ar")
  const [isSaved, setIsSaved] = useState(false)
  const [origin, setOrigin] = useState("")
  const [embedCode, setEmbedCode] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (origin) {
      setEmbedCode(`<iframe src="${origin}/customer-return?token=YOUR_TOKEN&theme=${encodeURIComponent(primaryColor)}" width="100%" height="600" frameborder="0"></iframe>`)
    }
  }, [primaryColor, origin])

  // حفظ التغييرات
  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  // نسخ كود التضمين
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
  }

  // نسخ كود API
  const copyApiCode = () => {
    const code = `curl -X POST ${origin}/api/returns/create \\\n-H "Authorization: Bearer YOUR_API_KEY" \\\n-H "Content-Type: application/json" \\\n-d '{"customer_id": "123", "order_id": "456", "reason": "damaged"}'`
    navigator.clipboard.writeText(code)
  }

  return (
    <V7Layout>
      <V7Content>
        <div className="space-y-6 pb-20 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-muted transition-colors" 
                  onClick={() => router.push("/returns")}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">العودة</span>
                </Button>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">تخصيص صفحة الإرجاع للعميل</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">قم بتخصيص صفحة الإرجاع التي سيراها عملاؤك</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                className="flex-1 sm:flex-none v7-neu-button gap-1.5 text-sm hover:opacity-90 transition-opacity"
                onClick={() => window.open("/customer-return?preview=true", "_blank")}
              >
                <Eye className="h-4 w-4" />
                <span>معاينة</span>
              </Button>
              <Button 
                className="flex-1 sm:flex-none v7-neu-button-active gap-1.5 text-sm hover:opacity-90 transition-opacity" 
                onClick={handleSave}
              >
                {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                <span>{isSaved ? "تم الحفظ" : "حفظ التغييرات"}</span>
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs 
            dir={language === "ar" || language === "both" ? "rtl" : "ltr"} 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="v7-neu-tabs mb-6 flex-wrap justify-start sm:justify-center gap-2">
              <TabsTrigger value="design" className="text-sm hover:bg-muted/60 transition-colors">
                <Palette className="h-4 w-4 ml-2" />
                التصميم
              </TabsTrigger>
              <TabsTrigger value="content" className="text-sm hover:bg-muted/60 transition-colors">
                <Layout className="h-4 w-4 ml-2" />
                المحتوى
              </TabsTrigger>
              <TabsTrigger value="fields" className="text-sm hover:bg-muted/60 transition-colors">
                <Layout className="h-4 w-4 ml-2" />
                الحقول
              </TabsTrigger>
              <TabsTrigger value="integration" className="text-sm hover:bg-muted/60 transition-colors">
                <Globe className="h-4 w-4 ml-2" />
                التكامل
              </TabsTrigger>
            </TabsList>

            {/* Tab Content Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <TabsContent value="design" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">القالب</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all hover:border-primary/50 ${
                          template === "modern" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setTemplate("modern")}
                      >
                        <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center text-xs text-muted-foreground">
                          قالب عصري
                        </div>
                        <div className="text-sm font-medium text-center">عصري</div>
                      </div>
                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all hover:border-primary/50 ${
                          template === "classic" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setTemplate("classic")}
                      >
                        <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center text-xs text-muted-foreground">
                          قالب كلاسيكي
                        </div>
                        <div className="text-sm font-medium text-center">كلاسيكي</div>
                      </div>
                      <div
                        className={`border rounded-lg p-2 cursor-pointer transition-all hover:border-primary/50 ${
                          template === "minimal" ? "border-primary bg-primary/5" : "border-border"
                        }`}
                        onClick={() => setTemplate("minimal")}
                      >
                        <div className="aspect-video bg-muted rounded-md mb-2 flex items-center justify-center text-xs text-muted-foreground">
                          قالب بسيط
                        </div>
                        <div className="text-sm font-medium text-center">بسيط</div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">الألوان</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="primaryColor" className="text-sm text-foreground">
                          اللون الرئيسي
                        </Label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-md border border-border" 
                            style={{ backgroundColor: primaryColor }}
                          ></div>
                          <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="secondaryColor" className="text-sm text-foreground">
                          لون الخلفية
                        </Label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-md border border-border"
                            style={{ backgroundColor: secondaryColor }}
                          ></div>
                          <Input
                            id="secondaryColor"
                            type="color"
                            value={secondaryColor}
                            onChange={(e) => setSecondaryColor(e.target.value)}
                            className="w-full focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="textColor" className="text-sm text-foreground">
                          لون النص
                        </Label>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-10 h-10 rounded-md border border-border" 
                            style={{ backgroundColor: textColor }}
                          ></div>
                          <Input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">الشعار</h3>
                    <div className="space-y-4">
                      <div className="border border-border rounded-lg p-4 flex items-center justify-center bg-muted/30">
                        <Image
                          src={logoUrl || "/placeholder.svg"}
                          alt="شعار الشركة"
                          width={200}
                          height={60}
                          className="max-h-16 object-contain dark:invert"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button className="v7-neu-button gap-1.5 text-sm hover:opacity-90 transition-opacity">
                          <Upload className="h-4 w-4" />
                          <span>تحميل شعار</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="v7-neu-button-flat gap-1.5 text-sm hover:bg-muted/60 transition-colors"
                        >
                          إزالة
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">إعدادات إضافية</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="language" className="text-sm text-foreground">
                          لغة الصفحة
                        </Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="اختر اللغة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ar">العربية</SelectItem>
                            <SelectItem value="en">الإنجليزية</SelectItem>
                            <SelectItem value="both">ثنائية اللغة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="rtl" className="text-sm text-foreground">
                          اتجاه الصفحة من اليمين إلى اليسار
                        </Label>
                        <Switch id="rtl" checked={language === "ar" || language === "both"} disabled />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">نصوص الصفحة</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="headerText" className="text-sm text-foreground">
                          عنوان الصفحة
                        </Label>
                        <Input
                          id="headerText"
                          value={headerText}
                          onChange={(e) => setHeaderText(e.target.value)}
                          className="w-full focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subheaderText" className="text-sm text-foreground">
                          النص التوضيحي
                        </Label>
                        <Textarea
                          id="subheaderText"
                          value={subheaderText}
                          onChange={(e) => setSubheaderText(e.target.value)}
                          className="w-full focus:ring-2 focus:ring-primary/20"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buttonText" className="text-sm text-foreground">
                          نص زر الإرسال
                        </Label>
                        <Input
                          id="buttonText"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          className="w-full focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="successMessage" className="text-sm text-foreground">
                          رسالة النجاح
                        </Label>
                        <Textarea
                          id="successMessage"
                          value={successMessage}
                          onChange={(e) => setSuccessMessage(e.target.value)}
                          className="w-full focus:ring-2 focus:ring-primary/20"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">سياسة الإرجاع</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="returnPolicy" className="text-sm text-foreground">
                          نص سياسة الإرجاع
                        </Label>
                        <Textarea
                          id="returnPolicy"
                          className="w-full focus:ring-2 focus:ring-primary/20"
                          rows={6}
                          defaultValue="يمكن إرجاع المنتجات خلال 14 يومًا من تاريخ الاستلام في حالة وجود عيوب مصنعية أو عدم مطابقة المنتج للوصف. يجب أن يكون المنتج في حالته الأصلية مع جميع الملحقات والتغليف. لا يمكن إرجاع المنتجات المخصصة أو التي تم فتحها إلا في حالة وجود عيوب. سيتم استرداد المبلغ خلال 7-14 يوم عمل من استلام المنتج المرتجع والتأكد من حالته."
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showPolicy" className="text-sm text-foreground">
                          عرض سياسة الإرجاع في الصفحة
                        </Label>
                        <Switch id="showPolicy" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">معلومات الاتصال</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-sm text-foreground">
                          البريد الإلكتروني للدعم
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          className="w-full focus:ring-2 focus:ring-primary/20"
                          defaultValue="support@yourcompany.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="text-sm text-foreground">
                          رقم هاتف الدعم
                        </Label>
                        <Input id="contactPhone" className="w-full focus:ring-2 focus:ring-primary/20" defaultValue="+966 55 555 5555" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showContact" className="text-sm text-foreground">
                          عرض معلومات الاتصال في الصفحة
                        </Label>
                        <Switch id="showContact" defaultChecked />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fields" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">حقول النموذج</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">رقم الطلب</Label>
                          <p className="text-xs text-muted-foreground">السماح للعميل بإدخال رقم الطلب</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="orderRequired" className="text-xs text-muted-foreground">
                            مطلوب
                          </Label>
                          <Switch id="orderRequired" defaultChecked />
                          <Label htmlFor="showOrderNumber" className="text-xs text-muted-foreground">
                            تفعيل
                          </Label>
                          <Switch id="showOrderNumber" checked={showOrderNumber} onCheckedChange={setShowOrderNumber} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">اختيار المنتج</Label>
                          <p className="text-xs text-muted-foreground">السماح للعميل باختيار المنتج المراد إرجاعه</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="productRequired" className="text-xs text-muted-foreground">
                            مطلوب
                          </Label>
                          <Switch id="productRequired" defaultChecked />
                          <Label htmlFor="showProductSelection" className="text-xs text-muted-foreground">
                            تفعيل
                          </Label>
                          <Switch
                            id="showProductSelection"
                            checked={showProductSelection}
                            onCheckedChange={setShowProductSelection}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">سبب الإرجاع</Label>
                          <p className="text-xs text-muted-foreground">السماح للعميل بتحديد سبب الإرجاع</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="reasonRequired" className="text-xs text-muted-foreground">
                            مطلوب
                          </Label>
                          <Switch id="reasonRequired" defaultChecked />
                          <Label htmlFor="showReasonField" className="text-xs text-muted-foreground">
                            تفعيل
                          </Label>
                          <Switch id="showReasonField" checked={showReasonField} onCheckedChange={setShowReasonField} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">المرفقات</Label>
                          <p className="text-xs text-muted-foreground">السماح للعميل بإرفاق صور للمنتج</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="attachmentsRequired" className="text-xs text-muted-foreground">
                            مطلوب
                          </Label>
                          <Switch id="attachmentsRequired" />
                          <Label htmlFor="showAttachments" className="text-xs text-muted-foreground">
                            تفعيل
                          </Label>
                          <Switch id="showAttachments" checked={showAttachments} onCheckedChange={setShowAttachments} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">معلومات الاتصال</Label>
                          <p className="text-xs text-muted-foreground">السماح للعميل بإدخال معلومات الاتصال</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="contactInfoRequired" className="text-xs text-muted-foreground">
                            مطلوب
                          </Label>
                          <Switch id="contactInfoRequired" defaultChecked />
                          <Label htmlFor="showContactInfo" className="text-xs text-muted-foreground">
                            تفعيل
                          </Label>
                          <Switch id="showContactInfo" checked={showContactInfo} onCheckedChange={setShowContactInfo} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">أسباب الإرجاع</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-foreground font-medium">أسباب الإرجاع المتاحة</Label>
                        <div className="border rounded-md p-2 space-y-2">
                          <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                            <span className="text-sm text-muted-foreground">منتج تالف</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                            <span className="text-sm text-muted-foreground">غير مطابق للوصف</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                            <span className="text-sm text-muted-foreground">تغيير الرأي</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-muted/10 rounded">
                            <span className="text-sm text-muted-foreground">منتج خاطئ</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="أضف سبب إرجاع جديد" className="flex-1" />
                        <Button className="v7-neu-button-flat">إضافة</Button>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">الإعدادات المتقدمة</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">التحقق من رقم الطلب</Label>
                          <p className="text-xs text-muted-foreground">التحقق من صحة رقم الطلب قبل السماح بالإرجاع</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">التحقق من فترة الإرجاع</Label>
                          <p className="text-xs text-muted-foreground">
                            التحقق من أن المنتج ضمن فترة الإرجاع المسموحة (14 يوم)
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">إشعارات البريد الإلكتروني</Label>
                          <p className="text-xs text-muted-foreground">
                            إرسال إشعار بالبريد الإلكتروني للعميل عند استلام طلب الإرجاع
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm text-foreground font-medium">إشعارات الرسائل النصية</Label>
                          <p className="text-xs text-muted-foreground">
                            إرسال إشعار برسالة نصية للعميل عند استلام طلب الإرجاع
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integration" className="mt-0 space-y-4 sm:space-y-6">
                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">تضمين الصفحة</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        يمكنك تضمين صفحة الإرجاع في موقعك الإلكتروني باستخدام الكود التالي
                      </p>
                      <div className="relative">
                        <Textarea
                          readOnly
                          className="w-full h-24 text-xs p-2 bg-slate-50 rounded border font-mono"
                          value={embedCode}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={copyEmbedCode}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-foreground">رابط مباشر للصفحة</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            className="w-80 text-xs"
                            value={origin ? `${origin}/customer-return?token=YOUR_TOKEN` : ""}
                          />
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={copyEmbedCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">واجهة برمجة التطبيقات (API)</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        يمكنك استخدام واجهة برمجة التطبيقات (API) للتكامل مع أنظمتك الأخرى
                      </p>
                      <div className="relative">
                        <Textarea
                          readOnly
                          className="w-full h-32 text-xs p-2 bg-slate-50 rounded border font-mono"
                          value={origin ? `curl -X POST ${origin}/api/returns/create \
-H "Authorization: Bearer YOUR_API_KEY" \
-H "Content-Type: application/json" \
-d '{"customer_id": "123", "order_id": "456", "reason": "damaged"}'` : ""}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={copyApiCode}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-foreground">مفتاح API الخاص بك</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            className="w-80 text-xs"
                            type="password"
                            value="sk_live_51NxXXXXXXXXXXXXXXXXXXXXXX"
                          />
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="v7-neu-button text-sm">
                          <Download className="h-4 w-4 mr-2" />
                          تحميل وثائق API
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-4 sm:p-6 rounded-xl border border-border">
                    <h3 className="text-lg font-medium mb-4 text-foreground">تكامل مع المنصات الأخرى</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z" />
                              <path d="M3 6a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v12a5 5 0 0 1-5 5" />
                              <path d="M7 15h0.01" />
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-foreground">شوبيفاي</div>
                          <Button className="v7-neu-button-flat text-xs w-full">ربط</Button>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 2H2v10h10V2Z" />
                              <path d="M22 12h-10v10h10V12Z" />
                              <path d="M12 12H2v10h10V12Z" />
                              <path d="M22 2h-10v10h10V2Z" />
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-foreground">ووكومرس</div>
                          <Button className="v7-neu-button-flat text-xs w-full">ربط</Button>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="M12 8v8" />
                              <path d="M8 12h8" />
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-foreground">ماجنتو</div>
                          <Button className="v7-neu-button-flat text-xs w-full">ربط</Button>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="v7-neu-button text-sm">عرض جميع التكاملات</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>

              {/* Preview Panel */}
              <div className="lg:col-span-1">
                <div className="v7-neu-card p-4 rounded-xl border border-border sticky top-20">
                  <h3 className="text-lg font-medium mb-4 text-center text-foreground">معاينة</h3>
                  <div
                    className="border rounded-lg overflow-hidden transition-colors"
                    style={{ backgroundColor: secondaryColor, color: textColor }}
                  >
                    <div className="p-4 border-b" style={{ backgroundColor: primaryColor, color: "#fff" }}>
                      <div className="flex justify-center mb-2">
                        <Image
                          src={logoUrl || "/placeholder.svg"}
                          alt="شعار الشركة"
                          width={120}
                          height={40}
                          className="h-8 object-contain"
                        />
                      </div>
                      <h4 className="text-center font-bold">{headerText}</h4>
                    </div>
                    <div className="p-4 space-y-4 text-xs">
                      <p className="text-center">{subheaderText}</p>

                      {showOrderNumber && (
                        <div className="space-y-1">
                          <Label className="text-xs text-foreground">رقم الطلب</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showProductSelection && (
                        <div className="space-y-1">
                          <Label className="text-xs text-foreground">المنتج</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showReasonField && (
                        <div className="space-y-1">
                          <Label className="text-xs text-foreground">سبب الإرجاع</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showContactInfo && (
                        <div className="space-y-1">
                          <Label className="text-xs text-foreground">معلومات الاتصال</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showAttachments && (
                        <div className="space-y-1">
                          <Label className="text-xs text-foreground">صور المنتج</Label>
                          <div className="h-16 bg-white rounded border flex items-center justify-center">
                            <Upload className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          className="w-full py-2 rounded text-white text-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button
                      className="v7-neu-button gap-1.5 text-xs hover:opacity-90 transition-opacity"
                      onClick={() => window.open("/customer-return?preview=true", "_blank")}
                    >
                      <Eye className="h-3 w-3" />
                      معاينة بالحجم الكامل
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </V7Content>
    </V7Layout>
  )
}
