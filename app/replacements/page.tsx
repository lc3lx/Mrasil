"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import V7Layout from "@/components/v7/v7-layout";
import { V7Content } from "@/components/v7/v7-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { DateRange } from "react-day-picker";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  PackageX,
  PackageCheck,
  TrendingUp,
  AlertCircle,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  CheckSquare,
  Palette,
  Layout,
  Globe,
  Eye,
  Save,
  Check,
  Upload,
  Copy,
  ChevronDown,
  Trash2,
  Sliders,
  FileText,
  Calendar,
  ArrowRight,
} from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetShipmentsQuery } from "../api/getReturnOrExchangeShipmentsApi";
import type { ReturnOrExchangeData } from "../api/getReturnOrExchangeShipmentsApi";
import { useHandleApprovalMutation } from "../api/handleReturnApprovalApi";
import { useGetCustomerMeQuery, useUpdateReplacementPageSettingsMutation, useUpdateCustomerMeMutation } from "@/app/api/customerApi";
import { getImageUrl } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import ReturnsTable from "../returns/ReturnsTable";
import ReturnsFiltersBar from "../returns/ReturnsFiltersBar";
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
const returnsData = [
  {
    id: "RTN-001245",
    date: "2024-04-15",
    product: "سماعات بلوتوث",
    reason: "منتج تالف",
    status: "قيد المراجعة",
    amount: 299,
    trackingNumber: "SHP-564782",
    returnType: "product",
  },
  {
    id: "RTN-001246",
    date: "2024-04-12",
    product: "شاحن لاسلكي",
    reason: "غير مطابق للوصف",
    status: "تم الموافقة",
    amount: 150,
    trackingNumber: "SHP-564123",
    returnType: "product",
  },
  {
    id: "RTN-001247",
    date: "2024-04-10",
    product: "ساعة ذكية",
    reason: "تغيير الرأي",
    status: "مرفوض",
    amount: 699,
    trackingNumber: "SHP-564001",
    returnType: "product",
  },
  {
    id: "RTN-001248",
    date: "2024-04-05",
    product: "كيبورد ميكانيكي",
    reason: "منتج تالف",
    status: "تم الاستلام",
    amount: 429,
    trackingNumber: "SHP-563782",
    returnType: "product",
  },
  {
    id: "RTN-001249",
    date: "2024-04-02",
    product: "ماوس لاسلكي",
    reason: "منتج ناقص",
    status: "تمت المعالجة",
    amount: 149,
    trackingNumber: "SHP-563552",
    returnType: "product",
  },
  {
    id: "RTN-001250",
    date: "2024-04-18",
    product: "بوليصة شحن #SHP-564999",
    reason: "عنوان خاطئ",
    status: "تم الموافقة",
    amount: 0,
    trackingNumber: "SHP-564999",
    returnType: "waybill",
  },
  {
    id: "RTN-001251",
    date: "2024-04-17",
    product: "بوليصة شحن #SHP-564888",
    reason: "معلومات المستلم غير صحيحة",
    status: "قيد المراجعة",
    amount: 0,
    trackingNumber: "SHP-564888",
    returnType: "waybill",
  },
];

// بيانات وهمية للإحصائيات
const statsData = [
  {
    title: "إجمالي الاستبدالات",
    value: 58,
    change: "+12%",
    icon: PackageX,
    trend: "up",
  },
  {
    title: "الاستبدالات المقبولة",
    value: 42,
    change: "+8%",
    icon: PackageCheck,
    trend: "up",
  },
  {
    title: "قيد المراجعة",
    value: 12,
    change: "-5%",
    icon: AlertCircle,
    trend: "down",
  },
  {
    title: "معدل الاستبدال",
    value: "5.2%",
    change: "-2.1%",
    icon: TrendingUp,
    trend: "down",
  },
];

const statusMap: { [key: string]: string } = {
  pending: "قيد المراجعة",
  approved: "تم الموافقة",
  rejected: "مرفوض",
  received: "تم الاستلام",
  processed: "تمت المعالجة",
};

// تحديث دالة getStatusBadgeClass لتستخدم نظام الألوان الموحد
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "تم الموافقة":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "مرفوض":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "قيد المراجعة":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "تم الاستلام":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "تمت المعالجة":
      return "bg-violet-50 text-violet-700 border border-violet-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
};

export default function Returns() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const {
    data: shipmentsData,
    isLoading: isShipmentsLoading,
    error: shipmentsError,
  } = useGetShipmentsQuery({
    type: "exchange",
    dateFrom: dateFrom.trim() || undefined,
    dateTo: dateTo.trim() || undefined,
  });
  const [handleApproval, { isLoading: isApproving }] =
    useHandleApprovalMutation();
  const [approvalResult, setApprovalResult] = useState<{
    status: "success" | "error";
    message: string;
  } | null>(null);

  // Calculate stats for cards dynamically from API data (reqstatus: pending | yes | no)
  const list: ReturnOrExchangeData[] = shipmentsData?.data ?? [];
  const total = list.length;
  const pending = list.filter((r) => r.reqstatus === "pending").length;
  const approved = list.filter((r) => r.reqstatus === "yes").length;
  const rejected = list.filter((r) => r.reqstatus === "no").length;

  // Función para manejar acciones في مجموعة
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "approve":
        alert(`تمت الموافقة على ${selectedReturns.length} استبدال`);
        break;
      case "reject":
        alert(`تم رفض ${selectedReturns.length} استبدال`);
        break;
      case "export":
        alert(`تم تصدير بيانات ${selectedReturns.length} استبدال`);
        break;
      case "delete":
        alert(`تم حذف ${selectedReturns.length} استبدال`);
        // Aquí puedes implementar la lógica real para eliminar los elementos
        // setSelectedReturns([]);
        break;
      default:
        break;
    }
  };
  // Añadir el estilo de animación
  React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = animationStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // إضافة استدعاء لـ router
  const router = useRouter();
  // حالة الفلاتر
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 3, 1),
    to: new Date(),
  });
  // حالة مؤقتة للتاريخ المحدد
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);
  // حالة فتح/إغلاق القائمة المنسدلة
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [returnTypeFilter, setReturnTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [customizeTab, setCustomizeTab] = useState<"design" | "content" | "fields" | "integration">("design");
  const [showCustomizeOptions, setShowCustomizeOptions] = useState(false);
  const [selectedReturns, setSelectedReturns] = useState<string[]>([]);

  // حالات تخصيص صفحة الاستبدال
  const [primaryColor, setPrimaryColor] = useState("#294D8B");
  const [secondaryColor, setSecondaryColor] = useState("#f5f5f5");
  const [textColor, setTextColor] = useState("#333333");
  const [logoUrl, setLogoUrl] = useState("/company-logo.png");
  const [headerText, setHeaderText] = useState("استبدال المنتجات");
  const [subheaderText, setSubheaderText] = useState(
    "يمكنك استبدال المنتجات التي اشتريتها خلال 14 يومًا من تاريخ الاستلام"
  );
  const [buttonText, setButtonText] = useState("إرسال طلب الاستبدال");
  const [successMessage, setSuccessMessage] = useState(
    "تم استلام طلب الاستبدال بنجاح. سنتواصل معك قريبًا."
  );
  const [showOrderNumber, setShowOrderNumber] = useState(true);
  const [showProductSelection, setShowProductSelection] = useState(true);
  const [showReasonField, setShowReasonField] = useState(true);
  const [showAttachments, setShowAttachments] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(true);
  const [showReturnAddress, setShowReturnAddress] = useState(true);
  const [template, setTemplate] = useState("modern");
  const [language, setLanguage] = useState("ar");
  const [isSaved, setIsSaved] = useState(false);
  const [showEmailTemplates, setShowEmailTemplates] = useState(true);
  const [confirmationEmailSubject, setConfirmationEmailSubject] = useState(
    "تأكيد استلام طلب الاستبدال"
  );
  const [confirmationEmailBody, setConfirmationEmailBody] = useState(
    "عزيزي العميل،\n\nتم استلام طلب الاستبدال الخاص بك بنجاح. رقم الطلب: {{order_number}}.\n\nسنقوم بمراجعة طلبك والرد عليك في أقرب وقت ممكن.\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء"
  );
  const [approvalEmailSubject, setApprovalEmailSubject] = useState(
    "الموافقة على طلب الاستبدال"
  );
  const [approvalEmailBody, setApprovalEmailBody] = useState(
    "عزيزي العميل،\n\nيسعدنا إبلاغك بالموافقة على طلب الاستبدال الخاص بك رقم {{return_number}}.\n\nسيتم إرسال المنتج البديل خلال {{refund_days}} أيام عمل.\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء"
  );
  const [rejectionEmailSubject, setRejectionEmailSubject] = useState(
    "تحديث بخصوص طلب الاستبدال"
  );
  const [rejectionEmailBody, setRejectionEmailBody] = useState(
    "عزيزي العميل،\n\nنأسف لإبلاغك بأنه لم تتم الموافقة على طلب الاستبدال الخاص بك رقم {{return_number}} للسبب التالي:\n\n{{rejection_reason}}\n\nيرجى التواصل مع خدمة العملاء للمزيد من المعلومات.\n\nشكراً لتعاملك معنا،\nفريق خدمة العملاء"
  );
  const [showReturnFees, setShowReturnFees] = useState(true);
  const [returnFeesAmount, setReturnFeesAmount] = useState<number>(0);
  const [returnFeesCurrency, setReturnFeesCurrency] = useState("SAR");
  const [returnPolicyText, setReturnPolicyText] = useState("");
  const [showReturnPolicy, setShowReturnPolicy] = useState(true);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [showContactInPage, setShowContactInPage] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [previewEmailType, setPreviewEmailType] = useState("confirmation");

  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: customerData, isLoading: isReplacementSettingsLoading } = useGetCustomerMeQuery();
  const [updateReplacementPageSettings, { isLoading: isSavingReplacement }] = useUpdateReplacementPageSettingsMutation();
  const [updateCustomerMe, { isLoading: isUploadingLogo }] = useUpdateCustomerMeMutation();
  const replacementPageSlug = customerData?.data?.replacementPageSlug ?? null;

  // تحميل إعدادات تخصيص صفحة الاستبدال من الباكند
  React.useEffect(() => {
    const s = customerData?.data?.replacementPageSettings;
    if (!s) return;
    if (s.primaryColor != null) setPrimaryColor(s.primaryColor);
    if (s.secondaryColor != null) setSecondaryColor(s.secondaryColor);
    if (s.textColor != null) setTextColor(s.textColor);
    if (s.logoUrl != null) setLogoUrl(s.logoUrl);
    if (s.headerText != null) setHeaderText(s.headerText);
    if (s.subheaderText != null) setSubheaderText(s.subheaderText);
    if (s.buttonText != null) setButtonText(s.buttonText);
    if (s.successMessage != null) setSuccessMessage(s.successMessage);
    if (s.showOrderNumber != null) setShowOrderNumber(s.showOrderNumber);
    if (s.showProductSelection != null) setShowProductSelection(s.showProductSelection);
    if (s.showReasonField != null) setShowReasonField(s.showReasonField);
    if (s.showAttachments != null) setShowAttachments(s.showAttachments);
    if (s.showContactInfo != null) setShowContactInfo(s.showContactInfo);
    if (s.showReturnAddress != null) setShowReturnAddress(s.showReturnAddress);
    if (s.language != null) setLanguage(s.language);
    if (s.template != null) setTemplate(s.template);
    if (s.showEmailTemplates != null) setShowEmailTemplates(s.showEmailTemplates);
    if (s.showReturnFees != null) setShowReturnFees(s.showReturnFees);
    if (s.returnFeesAmount != null) setReturnFeesAmount(Number(s.returnFeesAmount));
    if (s.returnFeesCurrency != null) setReturnFeesCurrency(s.returnFeesCurrency);
    if (s.returnPolicyText != null) setReturnPolicyText(s.returnPolicyText);
    if (s.showReturnPolicy != null) setShowReturnPolicy(s.showReturnPolicy);
    if (s.contactEmail != null) setContactEmail(s.contactEmail);
    if (s.contactPhone != null) setContactPhone(s.contactPhone);
    if (s.showContactInPage != null) setShowContactInPage(s.showContactInPage);
    if (s.confirmationEmailSubject != null) setConfirmationEmailSubject(s.confirmationEmailSubject);
    if (s.confirmationEmailBody != null) setConfirmationEmailBody(s.confirmationEmailBody);
    if (s.approvalEmailSubject != null) setApprovalEmailSubject(s.approvalEmailSubject);
    if (s.approvalEmailBody != null) setApprovalEmailBody(s.approvalEmailBody);
    if (s.rejectionEmailSubject != null) setRejectionEmailSubject(s.rejectionEmailSubject);
    if (s.rejectionEmailBody != null) setRejectionEmailBody(s.rejectionEmailBody);
  }, [customerData?.data?.replacementPageSettings]);

  // عند الدخول لصفحة التخصيص، اعرض تبويب التصميم افتراضياً
  React.useEffect(() => {
    if (showCustomizeOptions) setCustomizeTab("design");
  }, [showCustomizeOptions]);

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
  ];

  const { toast } = useToast();

  // حفظ التغييرات في الباكند
  const handleSave = async () => {
    try {
      await updateReplacementPageSettings({
        primaryColor,
        secondaryColor,
        textColor,
        logoUrl,
        headerText,
        subheaderText,
        buttonText,
        successMessage,
        showOrderNumber,
        showProductSelection,
        showReasonField,
        showAttachments,
        showContactInfo,
        showReturnAddress,
        language,
        template,
        showEmailTemplates,
        showReturnFees,
        returnFeesAmount,
        returnFeesCurrency,
        returnPolicyText,
        showReturnPolicy,
        contactEmail,
        contactPhone,
        showContactInPage,
        confirmationEmailSubject,
        confirmationEmailBody,
        approvalEmailSubject,
        approvalEmailBody,
        rejectionEmailSubject,
        rejectionEmailBody,
      }).unwrap();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      toast({ title: "تم الحفظ بنجاح", description: "تم حفظ تخصيص صفحة الاستبدال" });
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message || "فشل حفظ الإعدادات";
      toast({ title: "خطأ في الحفظ", description: message, variant: "destructive" });
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "خطأ", description: "يرجى اختيار ملف صورة صالح", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "خطأ", description: "حجم الصورة كبير جداً (الحد 5 ميجا)", variant: "destructive" });
      return;
    }
    const formData = new FormData();
    formData.append("replacementPageLogo", file);
    try {
      const res = await updateCustomerMe(formData).unwrap();
      const newLogoUrl = res?.data?.replacementPageSettings?.logoUrl;
      if (newLogoUrl) setLogoUrl(newLogoUrl);
      toast({ title: "تم رفع الشعار", description: "تم حفظ شعار صفحة الاستبدال" });
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast({ title: "خطأ", description: msg || "فشل رفع الشعار", variant: "destructive" });
    }
    e.target.value = "";
  };

  const handleRemoveLogo = async () => {
    setLogoUrl("");
    try {
      await updateReplacementPageSettings({
        primaryColor,
        secondaryColor,
        textColor,
        logoUrl: "",
        headerText,
        subheaderText,
        buttonText,
        successMessage,
        showOrderNumber,
        showProductSelection,
        showReasonField,
        showAttachments,
        showContactInfo,
        showReturnAddress,
        language,
        template,
        showEmailTemplates,
        showReturnFees,
        returnFeesAmount,
        returnFeesCurrency,
        returnPolicyText,
        showReturnPolicy,
        contactEmail,
        contactPhone,
        showContactInPage,
        confirmationEmailSubject,
        confirmationEmailBody,
        approvalEmailSubject,
        approvalEmailBody,
        rejectionEmailSubject,
        rejectionEmailBody,
      }).unwrap();
      toast({ title: "تم إزالة الشعار", description: "تم حذف شعار صفحة الاستبدال" });
    } catch {
      toast({ title: "خطأ", description: "فشل إزالة الشعار", variant: "destructive" });
    }
  };

  const publicReplacementUrl = replacementPageSlug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/customer-replacement?token=${replacementPageSlug}`
    : "";

  // نسخ كود التضمين
  const copyEmbedCode = () => {
    const tokenOrSlug = replacementPageSlug || "YOUR_TOKEN";
    const code = `<iframe src="${window.location.origin}/customer-replacement?token=${tokenOrSlug}&theme=${encodeURIComponent(
      primaryColor
    )}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(code);
    toast({ title: "تم النسخ", description: "تم نسخ كود التضمين" });
  };

  // نسخ كود API
  const copyApiCode = () => {
    const code = `curl -X POST ${window.location.origin}/api/returns/create \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"customer_id": "123", "order_id": "456", "reason": "damaged", "product_id": "789"}'`;
    navigator.clipboard.writeText(code);
  };

  // Toggle select all returns
  const toggleSelectAll = () => {
    if (selectedReturns.length === filteredReturns.length) {
      setSelectedReturns([]);
    } else {
      setSelectedReturns(filteredReturns.map((item) => item.id));
    }
  };

  // Toggle select single return
  const toggleSelectReturn = (id: string) => {
    if (selectedReturns.includes(id)) {
      setSelectedReturns(selectedReturns.filter((returnId) => returnId !== id));
    } else {
      setSelectedReturns([...selectedReturns, id]);
    }
  };

  // الإحصائيات
  const renderStats = () => (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Card 1: إجمالي الاستبدالات */}
      <div className="v7-neu-card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gry">إجمالي الاستبدالات</p>
              <h3 className="text-3xl font-bold text-[#294D8B]">{total}</h3>
            </div>
            <div className="v7-neu-icon-lg">
              <PackageX className="h-8 w-8 text-[#294D8B]" />
            </div>
          </div>
        </div>
      </div>
      {/* Card 2: الاستبدالات المقبولة */}
      <div className="v7-neu-card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gry">الاستبدالات المقبولة</p>
              <h3 className="text-3xl font-bold text-[#2ecc71]">{approved}</h3>
            </div>
            <div className="v7-neu-icon-lg">
              <PackageCheck className="h-8 w-8 text-[#2ecc71]" />
            </div>
          </div>
        </div>
      </div>
      {/* Card 3: قيد المراجعة */}
      <div className="v7-neu-card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gry">قيد المراجعة</p>
              <h3 className="text-3xl font-bold text-[#f39c12]">{pending}</h3>
            </div>
            <div className="v7-neu-icon-lg">
              <Clock className="h-8 w-8 text-[#f39c12]" />
            </div>
          </div>
        </div>
      </div>
      {/* Card 4: مرفوضة */}
      <div className="v7-neu-card">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-gry">مرفوضة</p>
              <h3 className="text-3xl font-bold text-[#e74c3c]">{rejected}</h3>
            </div>
            <div className="v7-neu-icon-lg">
              <XCircle className="h-8 w-8 text-[#e74c3c]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // تصفية البيانات بناءً على البحث والفلاتر
  const filteredReturns = returnsData.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : item.status === statusMap[statusFilter];

    const matchesType =
      returnTypeFilter === "all" ? true : item.returnType === returnTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // عرض صفحة تخصيص الاستبدال (مرتبطة بالباكند: تحميل من replacementPageSettings وحفظ عبر updateReplacementPageSettings)
  if (showCustomizeOptions) {
    return (
      <V7Layout>
        <V7Content>
          <div className="space-y-6 pb-20">
            {isReplacementSettingsLoading && (
              <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                جاري تحميل إعدادات صفحة الاستبدال...
              </div>
            )}
            {/* رأس الصفحة */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowCustomizeOptions(false)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">العودة</span>
                  </Button>
                  <h1 className="text-2xl font-bold text-[#294D8B]">
                    تخصيص صفحة الاستبدال للعميل
                  </h1>
                </div>
                <p className="text-sm text-gry">
                  قم بتخصيص صفحة الاستبدال التي سيراها عملاؤك
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="v7-neu-button gap-1 text-sm"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("preview", "true");
                    if (replacementPageSlug) params.set("token", replacementPageSlug);
                    window.open(`/customer-replacement?${params.toString()}`, "_blank");
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>معاينة</span>
                </Button>
                <Button
                  className="v7-neu-button-active gap-1 text-sm"
                  onClick={handleSave}
                  disabled={isSavingReplacement}
                >
                  {isSaved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSavingReplacement ? "جاري الحفظ..." : isSaved ? "تم الحفظ" : "حفظ التغييرات"}</span>
                </Button>
              </div>
            </div>

            {/* رابط صفحة الاستبدال للعملاء - يعطيه العميل لزبائنه */}
            <div className="v7-neu-card p-4 rounded-xl border-2 border-[#294D8B]/20 bg-[#294D8B]/5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium text-[#294D8B] flex items-center gap-2 mb-2">
                    <Share2 className="h-4 w-4" />
                    الرابط الذي تعطيه لعملائك لطلب الاستبدال
                  </Label>
                  <p className="text-xs text-gry mb-2">
                    انسخ هذا الرابط وشاركه مع عملائك عبر الواتساب أو البريد الإلكتروني
                  </p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      className="flex-1 text-sm font-mono bg-white"
                      value={publicReplacementUrl || "احفظ التخصيص أولاً لظهور الرابط"}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 h-9 gap-1"
                      onClick={() => {
                        if (publicReplacementUrl) {
                          navigator.clipboard.writeText(publicReplacementUrl);
                          toast({ title: "تم النسخ", description: "تم نسخ الرابط بنجاح" });
                        } else {
                          toast({
                            title: "تنبيه",
                            description: "احفظ التخصيص أولاً لإنشاء الرابط",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      نسخ
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* تبويبات التخصيص */}
            <Tabs
              dir="rtl"
              value={customizeTab}
              onValueChange={(v) => setCustomizeTab(v as "design" | "content" | "fields" | "integration")}
              className="w-full"
            >
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
                            <div
                              className="w-10 h-10 rounded-md border"
                              style={{ backgroundColor: primaryColor }}
                            ></div>
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
                          <div
                            className="w-10 h-10 rounded-md border"
                            style={{ backgroundColor: secondaryColor }}
                          ></div>
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
                            <div
                              className="w-10 h-10 rounded-md border"
                              style={{ backgroundColor: textColor }}
                            ></div>
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
                        <input
                          ref={logoFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                        <div className="border rounded-lg p-4 flex items-center justify-center">
                          <Image
                            src={getImageUrl(logoUrl) || "/placeholder.svg"}
                            alt="شعار الشركة"
                            width={200}
                            height={60}
                            className="max-h-16 object-contain"
                            unoptimized={logoUrl?.startsWith("http") || logoUrl?.startsWith("blob")}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            className="v7-neu-button gap-1 text-sm"
                            onClick={() => logoFileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                          >
                            <Upload className="h-4 w-4" />
                            <span>{isUploadingLogo ? "جاري الرفع..." : "تحميل شعار"}</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="v7-neu-button-flat gap-1 text-sm"
                            onClick={handleRemoveLogo}
                            disabled={!logoUrl || isSavingReplacement}
                          >
                            إزالة
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <h3 className="text-lg font-medium mb-4">
                        إعدادات إضافية
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="language" className="text-sm">
                            لغة الصفحة
                          </Label>
                          <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[180px] flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                              </svg>
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
                          <Label htmlFor="rtl" className="text-sm">
                            اتجاه الصفحة من اليمين إلى اليسار
                          </Label>
                          <Switch
                            id="rtl"
                            checked={language === "ar" || language === "both"}
                            disabled
                          />
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
                            <Label htmlFor="returnFees" className="text-sm">
                              رسوم الاستبدال
                            </Label>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="showReturnFees"
                                className="text-xs"
                              >
                                تفعيل
                              </Label>
                              <Switch
                                id="showReturnFees"
                                checked={showReturnFees}
                                onCheckedChange={setShowReturnFees}
                              />
                            </div>
                          </div>
                          {showReturnFees && (
                            <div className="flex items-center gap-2">
                              <Input
                                id="returnFees"
                                type="number"
                                placeholder="0.00"
                                className="w-full"
                                value={returnFeesAmount || ""}
                                onChange={(e) => setReturnFeesAmount(Number(e.target.value) || 0)}
                              />
                              <Select value={returnFeesCurrency} onValueChange={setReturnFeesCurrency}>
                                <SelectTrigger className="w-24 flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                  </svg>
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
                      <h3 className="text-lg font-medium mb-4">
                        سياسة الاستبدال
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="returnPolicy" className="text-sm">
                            نص سياسة الاستبدال
                          </Label>
                          <Textarea
                            id="returnPolicy"
                            className="w-full"
                            rows={6}
                            value={returnPolicyText}
                            onChange={(e) => setReturnPolicyText(e.target.value)}
                            placeholder="يمكن استبدال المنتجات خلال 14 يومًا من تاريخ الاستلام..."
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showPolicy" className="text-sm">
                            عرض سياسة الاستبدال في الصفحة
                          </Label>
                          <Switch
                            id="showPolicy"
                            checked={showReturnPolicy}
                            onCheckedChange={setShowReturnPolicy}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <h3 className="text-lg font-medium mb-4">
                        معلومات الاتصال
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail" className="text-sm">
                            البريد الإلكتروني للدعم
                          </Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            className="w-full"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="support@yourcompany.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone" className="text-sm">
                            رقم هاتف الدعم
                          </Label>
                          <Input
                            id="contactPhone"
                            className="w-full"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+966 55 555 5555"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="showContact" className="text-sm">
                            عرض معلومات الاتصال في الصفحة
                          </Label>
                          <Switch
                            id="showContact"
                            checked={showContactInPage}
                            onCheckedChange={setShowContactInPage}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium">
                          رسائل البريد الإلكتروني
                        </h3>
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="showEmailTemplates"
                            className="text-sm"
                          >
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
                          <Tabs
                            defaultValue="customer"
                            dir="rtl"
                            className="w-full"
                          >
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
                              <Tabs
                                defaultValue="confirmation"
                                dir="rtl"
                                className="w-full"
                              >
                                <TabsList className="mb-4">
                                  <TabsTrigger
                                    value="confirmation"
                                    className="text-xs"
                                  >
                                    تأكيد الاستلام
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="approval"
                                    className="text-xs"
                                  >
                                    الموافقة
                                  </TabsTrigger>
                                  <TabsTrigger
                                    value="rejection"
                                    className="text-xs"
                                  >
                                    الرفض
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                  value="confirmation"
                                  className="space-y-4"
                                >
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="confirmationEmailSubject"
                                      className="text-sm"
                                    >
                                      عنوان البريد الإلكتروني
                                    </Label>
                                    <Input
                                      id="confirmationEmailSubject"
                                      value={confirmationEmailSubject}
                                      onChange={(e) =>
                                        setConfirmationEmailSubject(
                                          e.target.value
                                        )
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label
                                        htmlFor="confirmationEmailBody"
                                        className="text-sm"
                                      >
                                        نص البريد الإلكتروني
                                      </Label>
                                      <div className="text-xs text-gray-500">
                                        المتغيرات المتاحة: {"{{order_number}}"},{" "}
                                        {"{{customer_name}}"},{" "}
                                        {"{{product_name}}"}
                                      </div>
                                    </div>
                                    <Textarea
                                      id="confirmationEmailBody"
                                      value={confirmationEmailBody}
                                      onChange={(e) =>
                                        setConfirmationEmailBody(e.target.value)
                                      }
                                      className="w-full font-mono text-sm"
                                      dir="rtl"
                                      rows={8}
                                    />
                                  </div>
                                </TabsContent>

                                <TabsContent
                                  value="approval"
                                  className="space-y-4"
                                >
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="approvalEmailSubject"
                                      className="text-sm"
                                    >
                                      عنوان البريد الإلكتروني
                                    </Label>
                                    <Input
                                      id="approvalEmailSubject"
                                      value={approvalEmailSubject}
                                      onChange={(e) =>
                                        setApprovalEmailSubject(e.target.value)
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label
                                        htmlFor="approvalEmailBody"
                                        className="text-sm"
                                      >
                                        نص البريد الإلكتروني
                                      </Label>
                                      <div className="text-xs text-gray-500">
                                        المتغيرات المتاحة: {"{{return_number}}"}
                                        , {"{{customer_name}}"},{" "}
                                        {"{{refund_days}}"}
                                      </div>
                                    </div>
                                    <Textarea
                                      id="approvalEmailBody"
                                      value={approvalEmailBody}
                                      onChange={(e) =>
                                        setApprovalEmailBody(e.target.value)
                                      }
                                      className="w-full font-mono text-sm"
                                      dir="rtl"
                                      rows={8}
                                    />
                                  </div>
                                </TabsContent>

                                <TabsContent
                                  value="rejection"
                                  className="space-y-4"
                                >
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="rejectionEmailSubject"
                                      className="text-sm"
                                    >
                                      عنوان البريد الإلكتروني
                                    </Label>
                                    <Input
                                      id="rejectionEmailSubject"
                                      value={rejectionEmailSubject}
                                      onChange={(e) =>
                                        setRejectionEmailSubject(e.target.value)
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label
                                        htmlFor="rejectionEmailBody"
                                        className="text-sm"
                                      >
                                        نص البريد الإلكتروني
                                      </Label>
                                      <div className="text-xs text-gray-500">
                                        المتغيرات المتاحة: {"{{return_number}}"}
                                        , {"{{customer_name}}"},{" "}
                                        {"{{rejection_reason}}"}
                                      </div>
                                    </div>
                                    <Textarea
                                      id="rejectionEmailBody"
                                      value={rejectionEmailBody}
                                      onChange={(e) =>
                                        setRejectionEmailBody(e.target.value)
                                      }
                                      className="w-full font-mono text-sm"
                                      dir="rtl"
                                      rows={8}
                                    />
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </TabsContent>

                            <TabsContent value="merchant" className="space-y-4">
                              <Tabs
                                defaultValue="confirmation_receipt"
                                dir="rtl"
                                className="w-full"
                              >
                                <TabsList className="mb-4 bg-[#294D8B]/10 text-[#294D8B] border border-[#294D8B]/20 rounded-lg p-1">
                                  <TabsTrigger
                                    value="confirmation_receipt"
                                    className="text-xs text-[#294D8B] data-[state=active]:text-[#294D8B]"
                                  >
                                    تأكيد الإستلام
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                  value="confirmation_receipt"
                                  className="space-y-4"
                                >
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="merchantConfirmationSubject"
                                      className="text-sm"
                                    >
                                      عنوان البريد الإلكتروني
                                    </Label>
                                    <Input
                                      id="merchantConfirmationSubject"
                                      defaultValue="تأكيد استلام طلب الاستبدال - {{return_number}}"
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label
                                        htmlFor="merchantConfirmationBody"
                                        className="text-sm"
                                      >
                                        نص البريد الإلكتروني
                                      </Label>
                                      <div className="text-xs text-gray-500">
                                        المتغيرات المتاحة: {"{{return_number}}"}
                                        , {"{{customer_name}}"},{" "}
                                        {"{{product_name}}"},{" "}
                                        {"{{order_number}}"}
                                      </div>
                                    </div>
                                    <Textarea
                                      id="merchantConfirmationBody"
                                      defaultValue={`مرحباً،

تم استلام طلب الاستبدال رقم {{return_number}} من العميل {{customer_name}}.

تفاصيل الطلب:
- رقم الطلب الأصلي: {{order_number}}
- المنتج المطلوب استبداله: {{product_name}}
- سبب الاستبدال: {{return_reason}}

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
                            </TabsContent>
                          </Tabs>

                          <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-medium">
                                إعدادات إضافية
                              </h4>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">
                                  إرسال نسخة إلى المدير
                                </Label>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">
                                  تضمين شعار الشركة في البريد الإلكتروني
                                </Label>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">
                                  تضمين روابط وسائل التواصل الاجتماعي
                                </Label>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">
                                  تضمين تذييل قانوني
                                </Label>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              className="v7-neu-button gap-1 text-sm"
                              onClick={() => setShowEmailPreview(true)}
                            >
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
                            <h3 className="text-lg font-medium">
                              معاينة البريد الإلكتروني
                            </h3>
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
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                    <Image
                                      src={getImageUrl(logoUrl) || logoUrl || "/company-logo.png"}
                                      alt="شعار الشركة"
                                      width={20}
                                      height={20}
                                      className="object-contain"
                                      unoptimized={typeof logoUrl === "string" && (logoUrl.startsWith("http") || logoUrl.startsWith("blob"))}
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">
                                      {previewEmailType === "confirmation" &&
                                        confirmationEmailSubject}
                                      {previewEmailType === "approval" &&
                                        approvalEmailSubject}
                                      {previewEmailType === "rejection" &&
                                        rejectionEmailSubject}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      support@yourcompany.com
                                    </div>
                                  </div>
                                </div>
                                <div className="whitespace-pre-wrap text-sm">
                                  {previewEmailType === "confirmation" &&
                                    confirmationEmailBody
                                      .replace("{{order_number}}", "ORD-12345")
                                      .replace(
                                        "{{customer_name}}",
                                        "محمد أحمد"
                                      )}
                                  {previewEmailType === "approval" &&
                                    approvalEmailBody
                                      .replace("{{return_number}}", "RTN-12345")
                                      .replace("{{customer_name}}", "محمد أحمد")
                                      .replace("{{refund_days}}", "3-5")}
                                  {previewEmailType === "rejection" &&
                                    rejectionEmailBody
                                      .replace("{{return_number}}", "RTN-12345")
                                      .replace("{{customer_name}}", "محمد أحمد")
                                      .replace(
                                        "{{rejection_reason}}",
                                        "المنتج غير متوفر للاستبدال"
                                      )}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="space-x-2 rtl:space-x-reverse">
                                  <Button
                                    variant={
                                      previewEmailType === "confirmation"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      setPreviewEmailType("confirmation")
                                    }
                                    className="text-xs"
                                  >
                                    تأكيد الاستلام
                                  </Button>
                                  <Button
                                    variant={
                                      previewEmailType === "approval"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      setPreviewEmailType("approval")
                                    }
                                    className="text-xs"
                                  >
                                    الموافقة
                                  </Button>
                                  <Button
                                    variant={
                                      previewEmailType === "rejection"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      setPreviewEmailType("rejection")
                                    }
                                    className="text-xs"
                                  >
                                    الرفض
                                  </Button>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-xs"
                                >
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
                            <Label className="text-sm font-medium">
                              رقم الطلب
                            </Label>
                            <p className="text-xs text-gry">
                              السماح للعميل بإدخال رقم الطلب
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="orderRequired" className="text-xs">
                              مطلوب
                            </Label>
                            <Switch id="orderRequired" defaultChecked />
                            <Label
                              htmlFor="showOrderNumber"
                              className="text-xs"
                            >
                              تفعيل
                            </Label>
                            <Switch
                              id="showOrderNumber"
                              checked={showOrderNumber}
                              onCheckedChange={setShowOrderNumber}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              اختيار المنتج
                            </Label>
                            <p className="text-xs text-gry">
                              السماح للعميل باختيار المنتج المراد استبداله
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label
                              htmlFor="productRequired"
                              className="text-xs"
                            >
                              مطلوب
                            </Label>
                            <Switch id="productRequired" defaultChecked />
                            <Label
                              htmlFor="showProductSelection"
                              className="text-xs"
                            >
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
                            <Label className="text-sm font-medium">
                              سبب الاستبدال
                            </Label>
                            <p className="text-xs text-gry">
                              السماح للعميل بتحديد سبب الاستبدال
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label htmlFor="reasonRequired" className="text-xs">
                              مطلوب
                            </Label>
                            <Switch id="reasonRequired" defaultChecked />
                            <Label
                              htmlFor="showReasonField"
                              className="text-xs"
                            >
                              تفعيل
                            </Label>
                            <Switch
                              id="showReasonField"
                              checked={showReasonField}
                              onCheckedChange={setShowReasonField}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              المرفقات
                            </Label>
                            <p className="text-xs text-gry">
                              السماح للعميل بإرفاق صور للمنتج
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label
                              htmlFor="attachmentsRequired"
                              className="text-xs"
                            >
                              مطلوب
                            </Label>
                            <Switch id="attachmentsRequired" />
                            <Label
                              htmlFor="showAttachments"
                              className="text-xs"
                            >
                              تفعيل
                            </Label>
                            <Switch
                              id="showAttachments"
                              checked={showAttachments}
                              onCheckedChange={setShowAttachments}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              معلومات الاتصال
                            </Label>
                            <p className="text-xs text-gry">
                              السماح للعميل بإدخال معلومات الاتصال
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label
                              htmlFor="contactInfoRequired"
                              className="text-xs"
                            >
                              مطلوب
                            </Label>
                            <Switch id="contactInfoRequired" defaultChecked />
                            <Label
                              htmlFor="showContactInfo"
                              className="text-xs"
                            >
                              تفعيل
                            </Label>
                            <Switch
                              id="showContactInfo"
                              checked={showContactInfo}
                              onCheckedChange={setShowContactInfo}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              عنوان الاستبدال
                            </Label>
                            <p className="text-xs text-gry">
                              السماح للعميل باختيار عنوان استبدال المنتج
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Label
                              htmlFor="returnAddressRequired"
                              className="text-xs"
                            >
                              مطلوب
                            </Label>
                            <Switch id="returnAddressRequired" defaultChecked />
                            <Label
                              htmlFor="showReturnAddress"
                              className="text-xs"
                            >
                              تفعيل
                            </Label>
                            <Switch
                              id="showReturnAddress"
                              checked={showReturnAddress}
                              onCheckedChange={setShowReturnAddress}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <h3 className="text-lg font-medium mb-4">
                        أسباب الاستبدال
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm">
                            أسباب الاستبدال المتاحة
                          </Label>
                          <div className="border rounded-md p-2 space-y-2">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">منتج تالف</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                ×
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">غير مطابق للوصف</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                ×
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">الحجم غير مناسب</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                ×
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">اللون غير مناسب</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="أضف سبب استبدال جديد"
                            className="flex-1"
                          />
                          <Button className="v7-neu-button-flat">إضافة</Button>
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <h3 className="text-lg font-medium mb-4">
                        عناوين الاستبدال
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm">
                            عناوين الاستبدال المتاحة
                          </Label>
                          <div className="border rounded-md p-2 space-y-2">
                            {pickupAddresses.map((address) => (
                              <div
                                key={address.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded"
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {address.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {address.city} - {address.district}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs"
                                  >
                                    تعديل
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    ×
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button className="v7-neu-button-flat">
                            إضافة عنوان جديد
                          </Button>
                          <Button
                            variant="outline"
                            className="v7-neu-button-flat text-xs"
                          >
                            استيراد من العناوين الحالية
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <h3 className="text-lg font-medium mb-4">
                        الإعدادات المتقدمة
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              التحقق من رقم الطلب
                            </Label>
                            <p className="text-xs text-gry">
                              التحقق من صحة رقم الطلب قبل السماح بالاستبدال
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              التحقق من فترة الاستبدال
                            </Label>
                            <p className="text-xs text-gry">
                              التحقق من أن المنتج ضمن فترة الاستبدال المسموحة (14
                              يوم)
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              إشعارات البريد الإلكتروني
                            </Label>
                            <p className="text-xs text-gry">
                              إرسال إشعار بالبريد الإلكتروني للعميل عند استلام
                              طلب الاستبدال
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">
                              إشعارات الرسائل النصية
                            </Label>
                            <p className="text-xs text-gry">
                              إرسال إشعار برسالة نصية للعميل عند استلام طلب
                              الاستبدال
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
                        <p className="text-sm text-gry">
                          يمكنك تضمين صفحة الاستبدال في موقعك الإلكتروني باستخدام
                          الكود التالي
                        </p>
                        {!replacementPageSlug && (
                          <p className="text-sm text-amber-600 mb-2">
                            احفظ التخصيص أولاً لإنشاء رابط فريد لصفحة الاستبدال.
                          </p>
                        )}
                        <div className="relative">
                          <Textarea
                            readOnly
                            className="w-full h-24 text-xs p-2 bg-slate-50 rounded border font-mono"
                            value={replacementPageSlug ? `<iframe src="${window.location.origin}/customer-replacement?token=${replacementPageSlug}&theme=${encodeURIComponent(primaryColor)}" width="100%" height="600" frameborder="0"></iframe>` : `<iframe src="${window.location.origin}/customer-replacement?token=SLUG_AFTER_SAVE" width="100%" height="600" frameborder="0"></iframe>`}
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
                              value={publicReplacementUrl || `${window.location.origin}/customer-replacement?token=YOUR_TOKEN`}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={copyEmbedCode}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="v7-neu-card p-6 rounded-xl">
                      <h3 className="text-lg font-medium mb-4">
                        واجهة برمجة التطبيقات (API)
                      </h3>
                      <div className="space-y-4">
                        <p className="text-sm text-gry">
                          يمكنك استخدام واجهة برمجة التطبيقات (API) للتكامل مع
                          أنظمتك الأخرى
                        </p>
                        <div className="relative">
                          <Textarea
                            readOnly
                            className="w-full h-32 text-xs p-2 bg-slate-50 rounded border font-mono"
                            value={`curl -X POST ${window.location.origin}/api/returns/create \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"customer_id": "123", "order_id": "456", "reason": "damaged", "product_id": "789"}'`}
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
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
                      <h3 className="text-lg font-medium mb-4">
                        تكامل مع المنصات الأخرى
                      </h3>
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
                            <Button className="v7-neu-button-flat text-xs w-full">
                              ربط
                            </Button>
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
                            <Button className="v7-neu-button-flat text-xs w-full">
                              ربط
                            </Button>
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
                                <rect
                                  width="18"
                                  height="18"
                                  x="3"
                                  y="3"
                                  rx="2"
                                />
                                <path d="M12 8v8" />
                                <path d="M8 12h8" />
                              </svg>
                            </div>
                            <div className="text-sm font-medium">ماجنتو</div>
                            <Button className="v7-neu-button-flat text-xs w-full">
                              ربط
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button className="v7-neu-button text-sm">
                            عرض جميع التكاملات
                          </Button>
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
                      style={{
                        backgroundColor: secondaryColor,
                        color: textColor,
                      }}
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
                                src={getImageUrl(logoUrl) || logoUrl || "/placeholder.svg"}
                                alt="شعار الشركة"
                                width={125}
                                height={42}
                                className="h-9 object-contain drop-shadow-md"
                                unoptimized={typeof logoUrl === "string" && (logoUrl.startsWith("http") || logoUrl.startsWith("blob"))}
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
                            <Label className="text-xs">المنتج</Label>
                            <div className="h-8 bg-white rounded border"></div>
                          </div>
                        )}

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

                        {showReturnAddress && (
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
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("preview", "true");
                          if (replacementPageSlug) params.set("token", replacementPageSlug);
                          window.open(`/customer-replacement?${params.toString()}`, "_blank");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        معاينة بالحجم الكامل
                      </Button>
                    </div>
                    <div className="mt-3 flex justify-center flex-col items-center gap-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        يمكنك معاينة الصفحة كما ستظهر للعميل
                      </span>
                      {replacementPageSlug && typeof window !== "undefined" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-full break-all px-2">
                          رابط جلب الشحنات:{" "}
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
                            {window.location.origin}/api/public/returns/shipments?token={replacementPageSlug}&phone=05XXXXXXXX
                          </code>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </V7Content>
      </V7Layout>
    );
  }

  return (
    <V7Layout>
      <V7Content title="إدارة الاسترجاع" description="إدارة طلبات الاسترجاع">
        <div className="container mx-auto p-4 md:p-6 my-16">
          {/* Header with title, date filter and action button */}
          <div
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6"
            dir="rtl"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#294D8B]">
                ادارة الأستبدال
              </h1>
              <p className="text-base text-gry">تتبع وإدارة طلبات الاستبدال</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-end">
              <div className="flex items-center gap-2 flex-wrap px-4 py-2 rounded-xl bg-[#f0f4f8] border border-[#E4E9F2] shadow-inner v7-neu-inset">
                <div className="flex items-center gap-1.5 text-[#294D8B]">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-semibold">التاريخ:</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#6d6a67] font-medium">
                    من
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-[#E4E9F2] bg-white text-[#294D8B] text-sm min-w-[130px] focus:outline-none focus:ring-2 focus:ring-[#294D8B]/40 focus:border-[#294D8B] transition-shadow"
                    dir="ltr"
                    title="اختر تاريخ البداية"
                    aria-label="تاريخ من"
                  />
                  <ArrowRight className="h-4 w-4 text-[#6d6a67] rotate-180" />
                  <label className="text-xs text-[#6d6a67] font-medium">
                    إلى
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-[#E4E9F2] bg-white text-[#294D8B] text-sm min-w-[130px] focus:outline-none focus:ring-2 focus:ring-[#294D8B]/40 focus:border-[#294D8B] transition-shadow"
                    dir="ltr"
                    title="اختر تاريخ النهاية"
                    aria-label="تاريخ إلى"
                  />
                </div>
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#6d6a67] hover:text-red-600 transition-colors"
                    title="مسح التاريخ"
                    aria-label="مسح فلتر التاريخ"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                className="v7-neu-button gap-1 text-base"
                onClick={() => {
                  setCustomizeTab("design");
                  setShowCustomizeOptions(true);
                }}
              >
                <Share2 className="h-5 w-5" />
                <span className="hidden sm:inline-block">
                  تخصيص صفحة الاستبدال
                </span>
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <div className="mb-8">{renderStats()}</div>
            <ReturnsFiltersBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              returnTypeFilter={returnTypeFilter}
              setReturnTypeFilter={setReturnTypeFilter}
              selectedReturns={selectedReturns}
              handleBulkAction={handleBulkAction}
              setShowCustomizeOptions={setShowCustomizeOptions}
              value={activeTab}
              onTabChange={setActiveTab}
              searchPlaceholder="البحث باستخدام رقم الاستبدال"
            />
          </div>
          <ReturnsTable
            data={shipmentsData?.data}
            isLoading={isShipmentsLoading}
            error={shipmentsError}
            isApproving={isApproving}
            handleApproval={handleApproval}
            approvalResult={approvalResult}
            setApprovalResult={setApprovalResult}
          />
        </div>
      </V7Content>
    </V7Layout>
  );
}
