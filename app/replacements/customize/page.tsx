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

export default function CustomizeReplacementPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("design")
  const [primaryColor, setPrimaryColor] = useState("#294D8B")
  const [secondaryColor, setSecondaryColor] = useState("#f5f5f5")
  const [textColor, setTextColor] = useState("#333333")
  const [logoUrl, setLogoUrl] = useState("/company-logo.png")
  const [headerText, setHeaderText] = useState("استبدال المنتجات")
  const [subheaderText, setSubheaderText] = useState(
    "يمكنك استبدال المنتجات التي اشتريتها خلال 14 يومًا من تاريخ الاستلام",
  )
  const [buttonText, setButtonText] = useState("إرسال طلب الاستبدال")
  const [successMessage, setSuccessMessage] = useState("تم استلام طلب الاستبدال بنجاح. سنتواصل معك قريبًا.")
  const [showOrderNumber, setShowOrderNumber] = useState(true)
  const [showProductSelection, setShowProductSelection] = useState(true)
  const [showReasonField, setShowReasonField] = useState(true)
  const [showAttachments, setShowAttachments] = useState(true)
  const [showContactInfo, setShowContactInfo] = useState(true)
  const [showReplacementAddress, setShowReplacementAddress] = useState(true)
  const [template, setTemplate] = useState("modern")
  const [language, setLanguage] = useState("ar")
  const [isRtl, setIsRtl] = useState(language === "ar" || language === "both");
  const [origin, setOrigin] = useState("");
  // تحديث اتجاه الصفحة عند تغيير اللغة
  useEffect(() => {
    setIsRtl(language === "ar" || language === "both");
  }, [language]);
  const [isSaved, setIsSaved] = useState(false)
  const [showEmailTemplates, setShowEmailTemplates] = useState(true)
  const [confirmationEmailSubject, setConfirmationEmailSubject] = useState("تأكيد استلام طلب الاستبدال")
  const [confirmationEmailBody, setConfirmationEmailBody] = useState(
    "عزيزي العميل،\n\nتم استلام طلب الاستبدال الخاص بك بنجاح. رقم الطلب: {{order_number}}.\n\nسنقوم بمراجعة طلبك والرد عليك في أقرب وقت ممكن.\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء",
  )
  const [approvalEmailSubject, setApprovalEmailSubject] = useState("الموافقة على طلب الاستبدال")
  const [approvalEmailBody, setApprovalEmailBody] = useState(
    "عزيزي العميل،\n\nيسعدنا إبلاغك بالموافقة على طلب الاستبدال الخاص بك رقم {{replacement_number}}.\n\nسيتم شحن المنتج البديل إلى العنوان المحدد خلال {{shipping_days}} أيام عمل.\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء",
  )
  const [rejectionEmailSubject, setRejectionEmailSubject] = useState("تحديث بخصوص طلب الاستبدال")
  const [rejectionEmailBody, setRejectionEmailBody] = useState(
    "عزيزي العميل،\n\nنأسف لإبلاغك بأنه لم تتم الموافقة على طلب الاستبدال الخاص بك رقم {{replacement_number}} للسبب التالي:\n\n{{rejection_reason}}\n\nيرجى التواصل مع خدمة العملاء للمزيد من المعلومات.\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء",
  )
  const [shippingEmailSubject, setShippingEmailSubject] = useState("تم شحن المنتج البديل")
  const [shippingEmailBody, setShippingEmailBody] = useState(
    "عزيزي العميل،\n\nنود إبلاغك بأنه تم شحن المنتج البديل الخاص بطلب الاستبدال رقم {{replacement_number}}.\n\nرقم التتبع: {{tracking_number}}\n\nيمكنك تتبع شحنتك من خلال الرابط التالي: {{tracking_link}}\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء",
  )
  const [showReplacementFees, setShowReplacementFees] = useState(true)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [previewEmailType, setPreviewEmailType] = useState("confirmation")
  const customer_name = "اسم العميل"; // Declared customer_name variable
  const [embedCode, setEmbedCode] = useState("")

  // بيانات عناوين الالتقاط من صفحة إنشاء الشحنة
  const pickupAddresses = [
    {
      id: 1,
      name: "مراسيل",
      phone: "1000000000000",
      city: "المدينة المنورة",
      district: "المدينة المنورة، المدينة المنورة، السعودية",
      address: "حي الخالدية، المدينة المنورة",
      email: "info@marasil.sa",
    },
    {
      id: 2,
      name: "Namerah نمرة",
      phone: "1",
      city: "نمرة السعودية",
      district: "نمرة",
      address: "",
      email: "semstry@gmail.com",
    },
    {
      id: 8,
      name: "Sary",
      phone: "1",
      city: "الرياض السعودية",
      district: "حي الوزارة، الرياض",
      address: "",
      email: "semstry@gmail.com",
    },
  ]

  // حفظ التغييرات
  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  // Update embed code when primaryColor changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (origin) {
      setEmbedCode(`<iframe src="${origin}/customer-replacement?token=YOUR_TOKEN&theme=${encodeURIComponent(primaryColor)}" width="100%" height="600" frameborder="0"></iframe>`);
    }
  }, [primaryColor, origin]);

  // نسخ كود API
  const copyApiCode = () => {
    const code = `curl -X POST ${origin}/api/replacements/create \\\n-H "Authorization: Bearer YOUR_API_KEY" \\\n-H "Content-Type: application/json" \\\n-d '{"customer_id": "123", "order_id": "456", "reason": "damaged", "replacement_product_id": "789"}'`;
    navigator.clipboard.writeText(code);
  }

  // Update the copyEmbedCode function
  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
  }

  return (
    <V7Layout>
      <V7Content>
        <div className="space-y-6 pb-20">
          {/* رأس الصفحة */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => router.push("/replacements")}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">العودة</span>
                </Button>
                <h1 className="text-2xl font-bold text-[#294D8B]">تخصيص صفحة الاستبدال للعميل</h1>
              </div>
              <p className="text-sm text-[#6d6a67]">قم بتخصيص صفحة الاستبدال التي سيراها عملاؤك</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="v7-neu-button gap-1 text-sm"
                onClick={() => window.open("/customer-replacement?preview=true", "_blank")}
              >
                <Eye className="h-4 w-4" />
                <span>معاينة</span>
              </Button>
              <Button className="v7-neu-button-active gap-1 text-sm" onClick={handleSave}>
                {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                <span>{isSaved ? "تم الحفظ" : "حفظ التغييرات"}</span>
              </Button>
            </div>
          </div>

          {/* تبويبات التخصيص */}
          <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="v7-neu-tabs mb-6">
              <TabsTrigger value="design" className="text-sm">
                <Palette className="h-4 w-4 ml-2" />
                التصميم
              </TabsTrigger>
              <TabsTrigger value="content" className="text-sm">
                <Layout className="h-4 w-4 ml-2" />
                المحتوى
              </TabsTrigger>
              <TabsTrigger value="fields" className="text-sm">
                <Layout className="h-4 w-4 ml-2" />
                الحقول
              </TabsTrigger>
              <TabsTrigger value="integration" className="text-sm">
                <Globe className="h-4 w-4 ml-2" />
                التكامل
              </TabsTrigger>
            </TabsList>

            {/* محتوى التبويبات */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* الجانب الأيمن - خيارات التخصيص */}
              <div className="lg:col-span-2 space-y-6">
                <TabsContent value="design" className="mt-0 space-y-6">
                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">الألوان</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="primaryColor" className="text-sm">
                          اللون الرئيسي
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: primaryColor }}></div>
                          <Input
                            id="primaryColor"
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="secondaryColor" className="text-sm">
                          لون الخلفية
                        </Label>
                        <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: secondaryColor }}></div>
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="textColor" className="text-sm">
                          لون النص
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: textColor }}></div>
                          <Input
                            id="textColor"
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">الشعار</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 flex items-center justify-center">
                        <Image
                          src={logoUrl || "/placeholder.svg"}
                          alt="شعار الشركة"
                          width={200}
                          height={60}
                          className="max-h-16 object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="v7-neu-button gap-1 text-sm">
                          <Upload className="h-4 w-4" />
                          <span>تحميل شعار</span>
                        </Button>
                        <Button variant="outline" className="v7-neu-button-flat gap-1 text-sm">
                          إزالة
                        </Button>
                      </div>
                    </div>
                  </div>

                  

                </TabsContent>

                <TabsContent value="content" className="mt-0 space-y-6">
                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">نصوص الصفحة</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="headerText" className="text-sm">
                          عنوان الصفحة
                        </Label>
                        <Input
                          id="headerText"
                          value={headerText}
                          onChange={(e) => setHeaderText(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subheaderText" className="text-sm">
                          النص التوضيحي
                        </Label>
                        <Textarea
                          id="subheaderText"
                          value={subheaderText}
                          onChange={(e) => setSubheaderText(e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buttonText" className="text-sm">
                          نص زر الإرسال
                        </Label>
                        <Input
                          id="buttonText"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="successMessage" className="text-sm">
                          رسالة النجاح
                        </Label>
                        <Textarea
                          id="successMessage"
                          value={successMessage}
                          onChange={(e) => setSuccessMessage(e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="replacementFees" className="text-sm">
                            رسوم الاستبدال
                          </Label>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="showReplacementFees" className="text-xs">
                              تفعيل
                            </Label>
                            <Switch
                              id="showReplacementFees"
                              checked={showReplacementFees}
                              onCheckedChange={setShowReplacementFees}
                            />
                          </div>
                        </div>
                        {showReplacementFees && (
                          <div className="flex items-center gap-2">
                            <Input
                              id="replacementFees"
                              type="number"
                              placeholder="0.00"
                              className="w-full"
                              defaultValue="0"
                            />
                            <Select defaultValue="SAR">
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="العملة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SAR">ر.س</SelectItem>
                                <SelectItem value="USD">$</SelectItem>
                                <SelectItem value="EUR">€</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">سياسة الاستبدال</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="replacementPolicy" className="text-sm">
                          نص سياسة الاستبدال
                        </Label>
                        <Textarea
                          id="replacementPolicy"
                          className="w-full"
                          rows={6}
                          defaultValue="يمكن استبدال المنتجات خلال 14 يومًا من تاريخ الاستلام في حالة وجود عيوب مصنعية أو عدم مطابقة المنتج للوصف. يجب أن يكون المنتج في حالته الأصلية مع جميع الملحقات والتغليف. لا يمكن استبدال المنتجات المخصصة أو التي تم فتحها إلا في حالة وجود عيوب. قد يتم احتساب فرق السعر بين المنتج الأصلي والمنتج البديل."
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showPolicy" className="text-sm">
                          عرض سياسة الاستبدال في الصفحة
                        </Label>
                        <Switch id="showPolicy" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">معلومات الاتصال</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-sm">
                          البريد الإلكتروني للدعم
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          className="w-full"
                          defaultValue="support@yourcompany.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="text-sm">
                          رقم هاتف الدعم
                        </Label>
                        <Input id="contactPhone" className="w-full" defaultValue="+966 55 555 5555" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showContact" className="text-sm">
                          عرض معلومات الاتصال في الصفحة
                        </Label>
                        <Switch id="showContact" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">رسائل البريد الإلكتروني</h3>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="showEmailTemplates" className="text-sm">
                          تفعيل إشعارات البريد الإلكتروني
                        </Label>
                        <Switch
                          id="showEmailTemplates"
                          checked={showEmailTemplates}
                          onCheckedChange={setShowEmailTemplates}
                        />
                      </div>
                    </div>

                    {showEmailTemplates && (
                      <div className="space-y-6">
                        <Tabs defaultValue="customer" dir="rtl" className="w-full">
                          <TabsList className="mb-4 bg-[#294D8B]/10 text-[#294D8B] border border-[#294D8B]/20 rounded-lg p-1">
                            <TabsTrigger
                              value="customer"
                              className="text-xs text-[#294D8B] data-[state=active]:text-[#294D8B]"
                            >
                              إشعارات العميل
                            </TabsTrigger>
                            <TabsTrigger
                              value="merchant"
                              className="text-xs text-[#294D8B] data-[state=active]:text-[#294D8B]"
                            >
                              إشعارات التاجر
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="customer" className="space-y-4">
                            <Tabs defaultValue="confirmation" dir="rtl" className="w-full">
                              <TabsList className="mb-4">
                                <TabsTrigger value="confirmation" className="text-xs">
                                  تأكيد الاستلام
                                </TabsTrigger>
                                <TabsTrigger value="approval" className="text-xs">
                                  الموافقة
                                </TabsTrigger>
                                <TabsTrigger value="rejection" className="text-xs">
                                  الرفض
                                </TabsTrigger>
                                <TabsTrigger value="shipping" className="text-xs">
                                  الشحن
                                </TabsTrigger>
                              </TabsList>

                              <TabsContent value="confirmation" className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="confirmationEmailSubject" className="text-sm">
                                    عنوان البريد الإلكتروني
                                  </Label>
                                  <Input
                                    id="confirmationEmailSubject"
                                    value={confirmationEmailSubject}
                                    onChange={(e) => setConfirmationEmailSubject(e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="confirmationEmailBody" className="text-sm">
                                      نص البريد الإلكتروني
                                    </Label>
                                    <div className="text-xs text-gray-500">
                                      المتغيرات المتاحة: {"{{order_number}}"}, {"{{customer_name}}"},{" "}
                                      {"{{product_name}}"}
                                    </div>
                                  </div>
                                  <Textarea
                                    id="confirmationEmailBody"
                                    value={confirmationEmailBody}
                                    onChange={(e) => setConfirmationEmailBody(e.target.value)}
                                    className="w-full font-mono text-sm"
                                    dir="rtl"
                                    rows={8}
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="approval" className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="approvalEmailSubject" className="text-sm">
                                    عنوان البريد الإلكتروني
                                  </Label>
                                  <Input
                                    id="approvalEmailSubject"
                                    value={approvalEmailSubject}
                                    onChange={(e) => setApprovalEmailSubject(e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="approvalEmailBody" className="text-sm">
                                      نص البريد الإلكتروني
                                    </Label>
                                    <div className="text-xs text-gray-500">
                                      المتغيرات المتاحة: {"{{replacement_number}}"}, {"{{customer_name}}"},{" "}
                                      {"{{shipping_days}}"}
                                    </div>
                                  </div>
                                  <Textarea
                                    id="approvalEmailBody"
                                    value={approvalEmailBody}
                                    onChange={(e) => setApprovalEmailBody(e.target.value)}
                                    className="w-full font-mono text-sm"
                                    dir="rtl"
                                    rows={8}
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="rejection" className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="rejectionEmailSubject" className="text-sm">
                                    عنوان البريد الإلكتروني
                                  </Label>
                                  <Input
                                    id="rejectionEmailSubject"
                                    value={rejectionEmailSubject}
                                    onChange={(e) => setRejectionEmailSubject(e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="rejectionEmailBody" className="text-sm">
                                      نص البريد الإلكتروني
                                    </Label>
                                    <div className="text-xs text-gray-500">
                                      المتغيرات المتاحة: {"{{replacement_number}}"}, {"{{customer_name}}"},{" "}
                                      {"{{rejection_reason}}"}
                                    </div>
                                  </div>
                                  <Textarea
                                    id="rejectionEmailBody"
                                    value={rejectionEmailBody}
                                    onChange={(e) => setRejectionEmailBody(e.target.value)}
                                    className="w-full font-mono text-sm"
                                    dir="rtl"
                                    rows={8}
                                  />
                                </div>
                              </TabsContent>

                              <TabsContent value="shipping" className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="shippingEmailSubject" className="text-sm">
                                    عنوان البريد الإلكتروني
                                  </Label>
                                  <Input
                                    id="shippingEmailSubject"
                                    value={shippingEmailSubject}
                                    onChange={(e) => setShippingEmailSubject(e.target.value)}
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="shippingEmailBody" className="text-sm">
                                      نص البريد الإلكتروني
                                    </Label>
                                    <div className="text-xs text-gray-500">
                                      المتغيرات المتاحة: {"{{replacement_number}}"}, {"{{customer_name}}"},{" "}
                                      {"{{tracking_number}}"}, {"{{tracking_link}}"}
                                    </div>
                                  </div>
                                  <Textarea
                                    id="shippingEmailBody"
                                    value={shippingEmailBody}
                                    onChange={(e) => setShippingEmailBody(e.target.value)}
                                    className="w-full font-mono text-sm"
                                    dir="rtl"
                                    rows={8}
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </TabsContent>

                          <Tabs defaultValue="confirmation_receipt" dir="rtl" className="w-full">
                            <TabsList className="mb-4 bg-[#294D8B]/10 text-[#294D8B] border border-[#294D8B]/20 rounded-lg p-1">
                              <TabsTrigger value="confirmation_receipt" className="text-xs text-[#294D8B] data-[state=active]:text-[#294D8B]">
                                تأكيد الإستلام
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="confirmation_receipt" className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="merchantConfirmationSubject" className="text-sm">
                                  عنوان البريد الإلكتروني
                                </Label>
                                <Input
                                  id="merchantConfirmationSubject"
                                  defaultValue="تأكيد استلام طلب الاستبدال - {{replacement_number}}"
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="merchantConfirmationBody" className="text-sm">
                                    نص البريد الإلكتروني
                                  </Label>
                                  <div className="text-xs text-gray-500">
                                    المتغيرات المتاحة: {"{{replacement_number}}"}, {"{{customer_name}}"}, {"{{product_name}}"}, {"{{order_number}}"}
                                  </div>
                                </div>
                                <Textarea
                                  id="merchantConfirmationBody"
                                  defaultValue={`مرحباً،

تم استلام طلب الاستبدال رقم {{replacement_number}} من العميل {{customer_name}}.

تفاصيل الطلب:
- رقم الطلب الأصلي: {{order_number}}
- المنتج المطلوب استبداله: {{product_name}}
- سبب الاستبدال: {{replacement_reason}}

يرجى مراجعة الطلب في أقرب وقت ممكن.

مع التحية،
نظام إدارة الاستبدالات`}
                                  className="w-full font-mono text-sm"
                                  dir="rtl"
                                  rows={12}
                                />
                              </div>
                            </TabsContent>
                          </Tabs>

                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium">إعدادات إضافية</h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">إرسال نسخة إلى المدير</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">تضمين شعار الشركة في البريد الإلكتروني</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">تضمين روابط وسائل التواصل الاجتماعي</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">تضمين تذييل قانوني</Label>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                        </Tabs>

                        <div className="flex justify-end">
                          <Button className="v7-neu-button gap-1 text-sm" onClick={() => setShowEmailPreview(true)}>
                            <Eye className="h-4 w-4" />
                            معاينة البريد الإلكتروني
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {showEmailPreview && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-auto">
                        <div className="p-4 border-b flex items-center justify-between">
                          <h3 className="text-lg font-medium">معاينة البريد الإلكتروني</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowEmailPreview(false)}
                          >
                            <span className="sr-only">إغلاق</span>×
                          </Button>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Image
                                    src="/company-logo.png"
                                    alt="شعار الشركة"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">
                                    {previewEmailType === "confirmation" && confirmationEmailSubject}
                                    {previewEmailType === "approval" && approvalEmailSubject}
                                    {previewEmailType === "rejection" && rejectionEmailSubject}
                                    {previewEmailType === "shipping" && shippingEmailSubject}
                                  </div>
                                  <div className="text-xs text-gray-500">support@yourcompany.com</div>
                                </div>
                              </div>
                              <div className="whitespace-pre-wrap text-sm">
                                {previewEmailType === "confirmation" &&
                                  confirmationEmailBody
                                    .replace("{{order_number}}", "ORD-12345")
                                    .replace("{{customer_name}}", customer_name)}
                                {previewEmailType === "approval" &&
                                  approvalEmailBody
                                    .replace("{{replacement_number}}", "REP-12345")
                                    .replace("{{customer_name}}", customer_name)
                                    .replace("{{shipping_days}}", "3-5")}
                                {previewEmailType === "rejection" &&
                                  rejectionEmailBody
                                    .replace("{{replacement_number}}", "REP-12345")
                                    .replace("{{customer_name}}", customer_name)
                                    .replace("{{rejection_reason}}", "المنتج غير متوفر حالياً")}
                                {previewEmailType === "shipping" &&
                                  shippingEmailBody
                                    .replace("{{replacement_number}}", "REP-12345")
                                    .replace("{{customer_name}}", customer_name)
                                    .replace("{{tracking_number}}", "TRK-9876543")
                                    .replace("{{tracking_link}}", "https://tracking.example.com/TRK-9876543")}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-x-2 rtl:space-x-reverse">
                                <Button
                                  variant={previewEmailType === "confirmation" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPreviewEmailType("confirmation")}
                                  className="text-xs"
                                >
                                  تأكيد الاستلام
                                </Button>
                                <Button
                                  variant={previewEmailType === "approval" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPreviewEmailType("approval")}
                                  className="text-xs"
                                >
                                  الموافقة
                                </Button>
                                <Button
                                  variant={previewEmailType === "rejection" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPreviewEmailType("rejection")}
                                  className="text-xs"
                                >
                                  الرفض
                                </Button>
                                <Button
                                  variant={previewEmailType === "shipping" ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPreviewEmailType("shipping")}
                                  className="text-xs"
                                >
                                  الشحن
                                </Button>
                              </div>
                              <Button variant="outline" size="sm" className="text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                تصدير HTML
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="fields" className="mt-0 space-y-6">
                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">حقول النموذج</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">رقم الطلب</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل بإدخال رقم الطلب</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="orderRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="orderRequired" defaultChecked />
                          <Label htmlFor="showOrderNumber" className="text-xs">
                            تفعيل
                          </Label>
                          <Switch id="showOrderNumber" checked={showOrderNumber} onCheckedChange={setShowOrderNumber} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">اختيار المنتج الأصلي</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل باختيار المنتج المراد استبداله</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="productRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="productRequired" defaultChecked />
                          <Label htmlFor="showProductSelection" className="text-xs">
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
                          <Label className="text-sm font-medium">اختيار المنتج البديل</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل باختيار المنتج البديل</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="replacementProductRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="replacementProductRequired" defaultChecked />
                          <Label htmlFor="showReplacementProductSelection" className="text-xs">
                            تفعيل
                          </Label>
                          <Switch id="showReplacementProductSelection" defaultChecked />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">سبب الاستبدال</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل بتحديد سبب الاستبدال</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="reasonRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="reasonRequired" defaultChecked />
                          <Label htmlFor="showReasonField" className="text-xs">
                            تفعيل
                          </Label>
                          <Switch id="showReasonField" checked={showReasonField} onCheckedChange={setShowReasonField} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">المرفقات</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل بإرفاق صور للمنتج</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="attachmentsRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="attachmentsRequired" />
                          <Label htmlFor="showAttachments" className="text-xs">
                            تفعيل
                          </Label>
                          <Switch id="showAttachments" checked={showAttachments} onCheckedChange={setShowAttachments} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">معلومات الاتصال</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل بإدخال معلومات الاتصال</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="contactInfoRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="contactInfoRequired" defaultChecked />
                          <Label htmlFor="showContactInfo" className="text-xs">
                            تفعيل
                          </Label>
                          <Switch id="showContactInfo" checked={showContactInfo} onCheckedChange={setShowContactInfo} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">عنوان الاستبدال</Label>
                          <p className="text-xs text-[#6d6a67]">السماح للعميل باختيار عنوان استلام المنتج البديل</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label htmlFor="replacementAddressRequired" className="text-xs">
                            مطلوب
                          </Label>
                          <Switch id="replacementAddressRequired" defaultChecked />
                          <Label htmlFor="showReplacementAddress" className="text-xs">
                            تفعيل
                          </Label>
                          <Switch
                            id="showReplacementAddress"
                            checked={showReplacementAddress}
                            onCheckedChange={setShowReplacementAddress}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">أسباب الاستبدال</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">أسباب الاستبدال المتاحة</Label>
                        <div className="border rounded-md p-2 space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">منتج تالف</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">غير مطابق للوصف</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">الحجم غير مناسب</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">اللون غير مناسب</span>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input placeholder="أضف سبب استبدال جديد" className="flex-1" />
                        <Button className="v7-neu-button-flat">إضافة</Button>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">عناوين الاستبدال</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm">عناوين الاستبدال المتاحة</Label>
                        <div className="border rounded-md p-2 space-y-2">
                          {pickupAddresses.map((address) => (
                            <div key={address.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{address.name}</span>
                                <span className="text-xs text-gray-500">
                                  {address.city} - {address.district}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs">
                                  تعديل
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  ×
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="v7-neu-button-flat">إضافة عنوان جديد</Button>
                        <Button variant="outline" className="v7-neu-button-flat text-xs">
                          استيراد من العناوين الحالية
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">الإعدادات المتقدمة</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">التحقق من رقم الطلب</Label>
                          <p className="text-xs text-[#6d6a67]">التحقق من صحة رقم الطلب قبل السماح بالاستبدال</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">التحقق من فترة الاستبدال</Label>
                          <p className="text-xs text-[#6d6a67]">
                            التحقق من أن المنتج ضمن فترة الاستبدال المسموحة (14 يوم)
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">حساب فرق السعر</Label>
                          <p className="text-xs text-[#6d6a67]">
                            حساب فرق السعر بين المنتج الأصلي والمنتج البديل تلقائياً
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">إشعارات البريد الإلكتروني</Label>
                          <p className="text-xs text-[#6d6a67]">
                            إرسال إشعار بالبريد الإلكتروني للعميل عند استلام طلب الاستبدال
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">إشعارات الرسائل النصية</Label>
                          <p className="text-xs text-[#6d6a67]">
                            إرسال إشعار برسالة نصية للعميل عند استلام طلب الاستبدال
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="integration" className="mt-0 space-y-6">
                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">تضمين الصفحة</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-[#6d6a67]">
                        يمكنك تضمين صفحة الاستبدال في موقعك الإلكتروني باستخدام الكود التالي
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
                        <Label className="text-sm">رابط مباشر للصفحة</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            className="w-80 text-xs"
                            value={origin ? `${origin}/customer-replacement?token=YOUR_TOKEN` : ""}
                          />
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={copyEmbedCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">واجهة برمجة التطبيقات (API)</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-[#6d6a67]">
                        يمكنك استخدام واجهة برمجة التطبيقات (API) للتكامل مع أنظمتك الأخرى
                      </p>
                      <div className="relative">
                        <Textarea
                          readOnly
                          className="w-full h-32 text-xs p-2 bg-slate-50 rounded border font-mono"
                          value={origin ? `curl -X POST ${origin}/api/replacements/create \\\n-H "Authorization: Bearer YOUR_API_KEY" \\\n-H "Content-Type: application/json" \\\n-d '{"customer_id": "123", "order_id": "456", "reason": "damaged", "replacement_product_id": "789"}'` : ""}
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
                        <Label className="text-sm">مفتاح API الخاص بك</Label>
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

                  <div className="v7-neu-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">تكامل مع المنصات الأخرى</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
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
                          <div className="text-sm font-medium">شوبيفاي</div>
                          <Button className="v7-neu-button-flat text-xs w-full">ربط</Button>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
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
                          <div className="text-sm font-medium">ووكومرس</div>
                          <Button className="v7-neu-button-flat text-xs w-full">ربط</Button>
                        </div>
                        <div className="border rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
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
                          <div className="text-sm font-medium">ماجنتو</div>
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

              {/* الجانب الأيسر - المعاينة */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-lg rounded-xl sticky top-20 p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl">
                  <h3 className="text-xl font-bold mb-5 text-center text-[#294D8B] dark:text-blue-400 flex items-center justify-center gap-2">
                    <Eye className="h-5 w-5 text-[#294D8B] dark:text-blue-400" />
                    <span>معاينة</span>
                  </h3>
                  <div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-[1.01]"
                    style={{ backgroundColor: secondaryColor, color: textColor }}
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    <div
                      className="relative overflow-hidden bg-gradient-to-r border-b rounded-t-lg shadow-sm"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 70%, ${primaryColor}99 100%)`,
                        color: "#fff",
                      }}
                    >
                      <div className="absolute inset-0 bg-[url('/abstract-geometric-flow.png')] opacity-10 mix-blend-overlay"></div>

                      <div className="relative z-10 py-6 px-5">
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-r from-white/20 to-white/5 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-white/10 mb-4 transform hover:scale-105 transition-transform duration-300">
                            <Image
                              src={logoUrl || "/placeholder.svg"}
                              alt="شعار الشركة"
                              width={125}
                              height={42}
                              className="h-9 object-contain drop-shadow-md"
                            />
                          </div>
                          <div className="relative">
                            <h4 className="text-center font-bold text-white text-lg tracking-wide drop-shadow-lg">
                              {headerText}
                            </h4>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-0.5 w-12 bg-white/60 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-4 text-xs v7-neu-card-inset rounded-b-lg">
                      <p className="text-center">{subheaderText}</p>

                      {showOrderNumber && (
                        <div className="space-y-1">
                          <Label className="text-xs">رقم الطلب</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showProductSelection && (
                        <div className="space-y-1">
                          <Label className="text-xs">المنتج الأصلي</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <Label className="text-xs">المنتج البديل</Label>
                        <div className="h-8 bg-white rounded border"></div>
                      </div>

                      {showReasonField && (
                        <div className="space-y-1">
                          <Label className="text-xs">سبب الاستبدال</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showContactInfo && (
                        <div className="space-y-1">
                          <Label className="text-xs">معلومات الاتصال</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showReplacementAddress && (
                        <div className="space-y-1">
                          <Label className="text-xs">عنوان الاستبدال</Label>
                          <div className="h-8 bg-white rounded border"></div>
                        </div>
                      )}

                      {showAttachments && (
                        <div className="space-y-1">
                          <Label className="text-xs">صور المنتج</Label>
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
                  <div className="mt-6 flex justify-center">
                    <Button
                      className="bg-gradient-to-r from-[#294D8B] to-[#3a6fc7] hover:from-[#1a3c6f] hover:to-[#294D8B] text-white shadow-md hover:shadow-lg transition-all duration-300 gap-2 px-5 py-2 rounded-lg text-sm"
                      onClick={() => window.open("/customer-replacement?preview=true", "_blank")}
                    >
                      <Eye className="h-4 w-4" />
                      معاينة بالحجم الكامل
                    </Button>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      يمكنك معاينة الصفحة كما ستظهر للعميل
                    </span>
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
