"use client";

import V7Layout from "@/components/v7/v7-layout";
import { V7Content } from "@/components/v7/v7-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  User,
  Settings,
  Shield,
  Package,
  History,
  Save,
  Camera,
  Briefcase,
  Upload,
  MapPin,
  Map,
  Building,
  MailOpen,
  Info,
} from "lucide-react";
import { useGetProfileQuery } from "@/app/api/profileApi";
import ChangePasswordForm from "./ChangePasswordForm";
import {
  useGetCustomerMeQuery,
  useUpdateCustomerMeMutation,
  customerApi,
} from "../api/customerApi";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useGetShipmentStatsQuery } from "@/app/api/homePageApi";
import ProfileUpLoad from "../parcels/components/ProfileUpLoad";
import Link from "next/link";

export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery();
  const { data: customerData, isLoading: isCustomerLoading } =
    useGetCustomerMeQuery();
  const [
    updateCustomerMe,
    { isLoading: isUpdating, error: updateError, data: updateData },
  ] = useUpdateCustomerMeMutation();
  const { data: shipmentStats } = useGetShipmentStatsQuery();
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(
    customerData?.data.firstName || ""
  );
  const [lastName, setLastName] = useState(customerData?.data.lastName || "");
  const [phone, setPhone] = useState(customerData?.data.phone || "");
  const [brandColor, setBrandColor] = useState(
    customerData?.data.brand_color || ""
  );
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [companyNameAr, setCompanyNameAr] = useState(
    customerData?.data.company_name_ar || ""
  );
  const [companyNameEn, setCompanyNameEn] = useState(
    customerData?.data.company_name_en || ""
  );
  const [brandEmail, setBrandEmail] = useState(
    customerData?.data.brand_email || ""
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    customerData?.data.additional_info || ""
  );
  const [taxNumber, setTaxNumber] = useState(
    customerData?.data.tax_number || ""
  );
  const [commercialRegistrationNumber, setCommercialRegistrationNumber] =
    useState(customerData?.data.commercial_registration_number || "");
  const [brandWebsite, setBrandWebsite] = useState(
    customerData?.data.brand_website || ""
  );
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [alertStatus, setAlertStatus] = useState<"success" | "error">(
    "success"
  );
  useEffect(() => {
    if (customerData) {
      setFirstName(customerData.data.firstName || "");
      setLastName(customerData.data.lastName || "");
      setPhone(customerData.data.phone || "");
      if (customerData.data.profileImage) {
        const imageUrl = customerData.data.profileImage;
        setImage(imageUrl);
      } else {
        setImage(null);
      }
      setBrandColor(customerData.data.brand_color || "");
      setCompanyNameAr(customerData.data.company_name_ar || "");
      setCompanyNameEn(customerData.data.company_name_en || "");
      setBrandEmail(customerData.data.brand_email || "");
      setAdditionalInfo(customerData.data.additional_info || "");
      setTaxNumber(customerData.data.tax_number || "");
      setCommercialRegistrationNumber(
        customerData.data.commercial_registration_number || ""
      );
      setBrandWebsite(customerData.data.brand_website || "");
    }
  }, [customerData]);
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrandLogo(e.target.files[0]);
    }
  };
  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res;

      if (brandLogo) {
        // إذا كان هناك شعار جديد، استخدم FormData
        const formData = new FormData();
        formData.append("brand_logo", brandLogo);
        formData.append("brand_color", brandColor);
        formData.append("company_name_ar", companyNameAr);
        formData.append("company_name_en", companyNameEn);
        formData.append("brand_email", brandEmail);
        formData.append("additional_info", additionalInfo);
        formData.append("tax_number", taxNumber);
        formData.append(
          "commercial_registration_number",
          commercialRegistrationNumber
        );
        formData.append("brand_website", brandWebsite);

        res = await updateCustomerMe(formData).unwrap();
      } else {
        // إذا لم يكن هناك شعار جديد، استخدم JSON
        const payload = {
          brand_color: brandColor,
          company_name_ar: companyNameAr,
          company_name_en: companyNameEn,
          brand_email: brandEmail,
          additional_info: additionalInfo,
          tax_number: taxNumber,
          commercial_registration_number: commercialRegistrationNumber,
          brand_website: brandWebsite,
        };

        res = await updateCustomerMe(payload).unwrap();
      }

      setAlertMsg("تم تحديث بيانات الشركة بنجاح");
      setAlertStatus("success");
      setAlertOpen(true);
    } catch (err: any) {
      setAlertMsg(err?.data?.message || "حدث خطأ أثناء التحديث");
      setAlertStatus("error");
      setAlertOpen(true);
    }
  };
  const getMemberSince = (createdAt: string) => {
    return new Date(createdAt).getFullYear();
  };

  const handelImageUpload = async (file: File) => {
    try {
      console.log("🔧 رفع صورة البروفيل:", file.name, file.size);

      // التحقق من نوع الملف
      if (!file.type.startsWith("image/")) {
        setAlertMsg("يرجى اختيار ملف صورة صالح");
        setAlertStatus("error");
        setAlertOpen(true);
        return;
      }

      // التحقق من حجم الملف (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlertMsg("حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5MB");
        setAlertStatus("error");
        setAlertOpen(true);
        return;
      }

      const formData = new FormData();
      formData.append("profileImage", file);

      console.log("🔧 FormData created:", formData.has("profileImage"));
      console.log(
        "🔧 FormData instanceof FormData:",
        formData instanceof FormData
      );
      console.log("🔧 File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });

      // التحقق من محتوى FormData
      console.log(
        "🔧 FormData entries count:",
        Array.from(formData.entries()).length
      );
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log("🔧 FormData entry:", key, value);
      });

      console.log("🔧 إرسال الطلب إلى الـ backend...");
      const res = await updateCustomerMe(formData).unwrap();
      console.log("✅ نجح رفع صورة البروفيل:", res);
      console.log("🔍 رابط الصورة من الـ response:", res.data?.profileImage);
      console.log("🔍 المسار الكامل للصورة:", res.data?.profileImage);

      // تحديث رابط الصورة في الواجهة فوراً
      if (res.data?.profileImage) {
        // إضافة base URL إذا لم يكن موجوداً
        const imageUrl = res.data.profileImage

        setImage(imageUrl);
        console.log("🔄 تم تحديث رابط الصورة في الـ state:", imageUrl);
      } else {
        console.log("⚠️ لا يوجد رابط صورة في الـ response");
      }

      // تحديث cache في RTK Query - مؤقتاً معطل
      // customerApi.util.updateQueryData("getCustomerMe" as any, undefined, (draft: any) => {
      //   if (draft?.data && res.data?.profileImage) {
      //     const imageUrl = res.data.profileImage.startsWith("https")
      //       ? res.data.profileImage
      //       : `${
      //           process.env.NEXT_PUBLIC_API_URL || "https://www.marasil.site"
      //         }${res.data.profileImage}`;
      //     draft.data.profileImage = imageUrl;
      //   }
      // });
      setAlertMsg("تم رفع صورة البروفيل بنجاح");
      setAlertStatus("success");
      setAlertOpen(true);
    } catch (err: any) {
      console.error("❌ فشل رفع صورة البروفيل:", err);
      console.error("❌ تفاصيل الخطأ:", {
        status: err?.status,
        data: err?.data,
        message: err?.message,
        originalStatus: err?.originalStatus,
      });
      console.error("❌ تفاصيل data object:", err?.data);
      console.error(
        "❌ محتوى data object:",
        JSON.stringify(err?.data, null, 2)
      );

      // معالجة أفضل للأخطاء
      let errorMessage = "فشل رفع صورة البروفيل";

      if (err?.data?.message) {
        errorMessage = err.data.message;
        console.log("🔧 Error message from backend:", err.data.message);
        if (err.data.details) {
          console.log("🔧 Error details:", err.data.details);
        }
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.status === 400) {
        errorMessage = "الملف غير صالح أو كبير جداً";
      } else if (err?.status === 413) {
        errorMessage = "حجم الملف كبير جداً";
      } else if (err?.status === 415) {
        errorMessage = "نوع الملف غير مدعوم";
      } else if (err?.status === 500) {
        errorMessage = "خطأ في الخادم. يرجى المحاولة لاحقاً";
      } else if (err?.status === "PARSING_ERROR") {
        errorMessage = "خطأ في تحليل الاستجابة من الخادم";
      }

      setAlertMsg(errorMessage);
      setAlertStatus("error");
      setAlertOpen(true);
    }
  };
  const handelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
      };

      const res = await updateCustomerMe(payload).unwrap();
      setAlertMsg("تم تحديث البيانات الشخصية بنجاح");
      setAlertStatus("success");
      setAlertOpen(true);
    } catch (err: any) {
      setAlertMsg(err?.data?.message || "حدث خطأ أثناء التحديث");
      setAlertStatus("error");
      setAlertOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <V7Layout>
      <V7Content
        title="الملف الشخصي"
        description="إدارة معلوماتك الشخصية وإعدادات الحساب"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* تبويبات المعلومات والإعدادات */}
          <div className="md:col-span-2">
            <Tabs defaultValue="personal" className="v7-neu-card p-6" dir="rtl">
              <TabsList className="v7-neu-tabs mb-6  ">
                <TabsTrigger
                  value="personal"
                  className="v7-neu-tab   transition-all duration-500 ease-in-out flex items-center gap-2 border-b border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold"
                >
                  <User className="h-4 w-4 " />
                  المعلومات الشخصية
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="v7-neu-tab   transition-all duration-500 ease-in-out flex  items-center gap-2 border-b border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-semibold"
                >
                  <Briefcase className="h-4 w-4" />
                  معلومات الشركة
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <form onSubmit={handelSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">الاسم الأول</Label>
                      <div className="v7-neu-input-container">
                        <Input
                          id="firstName"
                          name="firstName"
                          className="v7-neu-input-hollo text-gry border-none "
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">الاسم الأخير</Label>
                      <div className="v7-neu-input-container">
                        <Input
                          id="lastName"
                          name="lastName"
                          className="v7-neu-input-hollo text-gry border-none "
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="v7-neu-input-container">
                        <Input
                          id="email"
                          className="v7-neu-input-hollo text-gry  cursor-not-allowed   "
                          defaultValue={customerData?.data.email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="v7-neu-input-container">
                      <Input
                        id="phone"
                        name="phone"
                        className=" v7-neu-input-hello text-gry"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdAt">تاريخ الإنشاء</Label>
                    <div className="v7-neu-input-container">
                      <Input
                        id="createdAt"
                        className="v7-neu-input-hollo text-gry"
                        value={
                          customerData?.data.createdAt
                            ? new Date(
                                customerData.data.createdAt
                              ).toLocaleString("ar-EG")
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordChangedAt">
                      آخر تغيير كلمة المرور
                    </Label>
                    <div className="v7-neu-input-container">
                      <Input
                        id="passwordChangedAt"
                        className="v7-neu-input-hollo text-gry  cursor-not-allowed"
                        value={
                          customerData?.data.passwordChangedAt
                            ? new Date(
                                customerData.data.passwordChangedAt
                              ).toLocaleString("ar-EG")
                            : "لم يتم التغيير"
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addresses">عدد العناوين</Label>
                    <div className="v7-neu-input-container">
                      <Input
                        id="addresses"
                        className="v7-neu-input-hollo  text-gry cursor-not-allowed"
                        value={
                          Array.isArray(customerData?.data.addresses)
                            ? customerData.data.addresses.length
                            : 0
                        }
                        readOnly
                      />
                    </div>
                  </div>

                  <Button className="v7-neu-button-accent">
                    <Save className="h-4 w-4 ml-2" />
                    حفظ التغييرات
                  </Button>
                  {alertMsg && (
                    <p className=" text-red-400 text-sm">{alertMsg}</p>
                  )}
                </form>
              </TabsContent>

              {/* تبويب معلومات الشركة الجديد */}
              <TabsContent value="company" className="space-y-6">
                <form
                  onSubmit={handleCompanySubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* قسم لون العلامة التجارية */}
                  <div className="v7-neu-card p-6 space-y-4">
                    <h3 className="text-xl font-bold text-center mb-4">
                      لون العلامة التجارية
                    </h3>
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <div className="v7-neu-input-container flex-1">
                        <Input
                          type="color"
                          id="brandColor"
                          className="v7-neu-input-profile text-center "
                          value={brandColor}
                          onChange={(e) => setBrandColor(e.target.value)}
                        />
                      </div>
                      <div className="w-10 h-10 rounded-full v7-neu-inset overflow-hidden">
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: brandColor || "#1b2f50" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* قسم شعار العلامة التجارية */}
                  <div className="v7-neu-card p-6 space-y-4">
                    <h3 className="text-xl font-bold text-center mb-4">
                      شعار علامتك التجارية
                    </h3>
                    <div className="flex flex-col items-center justify-center">
                      <div className="v7-neu-inset w-40 h-40 rounded-lg overflow-hidden flex items-center justify-center p-4 mb-4">
                        {brandLogo ? (
                          <img
                            src={URL.createObjectURL(brandLogo)}
                            alt="شعار الشركة"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : customerData?.data.brand_logo ? (
                          <img
                            src={
                              customerData.data.brand_logo.startsWith("http")
                                ? customerData.data.brand_logo
                                : `${
                                    process.env.NEXT_PUBLIC_API_URL ||
                                    "https://www.marasil.site"
                                  }${customerData.data.brand_logo}`
                            }
                            alt="شعار الشركة"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <img
                            src="/placeholder.svg"
                            alt="شعار الشركة"
                            className="max-w-full max-h-full object-contain"
                          />
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        id="brandLogoInput"
                      />
                      <label htmlFor="brandLogoInput">
                        <Button className="v7-neu-button" type="button" asChild>
                          <span>
                            <Upload className="h-4 w-4 ml-2" />
                            رفع اللوجو
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* قسم تفاصيل الشركة */}
                  <div className="v7-neu-card p-6 space-y-4 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">تفاصيل الشركة</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyName"
                          className="flex items-center"
                        >
                          اسم الشركة باللغة العربية
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="companyName"
                            className="v7-neu-input-hollo text-gry"
                            placeholder="أدخل اسم الشركة"
                            value={companyNameAr}
                            onChange={(e) => setCompanyNameAr(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="companyNameEn"
                          className="flex items-center"
                        >
                          اسم الشركة باللغة الإنجليزية
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="companyNameEn"
                            className="v7-neu-input-hollo text-gry"
                            placeholder="Enter Company Name in English"
                            value={companyNameEn}
                            onChange={(e) => setCompanyNameEn(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="companyEmail"
                          className="flex items-center"
                        >
                          البريد الإلكتروني
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="companyEmail"
                            className="v7-neu-input-hollo text-gry"
                            type="email"
                            placeholder="example@company.com"
                            value={brandEmail}
                            onChange={(e) => setBrandEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="companyWebsite"
                          className="flex items-center"
                        >
                          رابط الموقع
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="companyWebsite"
                            className="v7-neu-input-hollo text-gry"
                            placeholder="https://www.example.com"
                            value={brandWebsite}
                            onChange={(e) => setBrandWebsite(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="commercialRegister"
                          className="flex items-center"
                        >
                          رقم السجل التجاري
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="commercialRegister"
                            className="v7-neu-input-hollo text-gry"
                            placeholder="أدخل رقم السجل التجاري"
                            value={commercialRegistrationNumber}
                            onChange={(e) =>
                              setCommercialRegistrationNumber(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="taxNumber"
                          className="flex items-center"
                        >
                          الرقم الضريبي
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="taxNumber"
                            className="v7-neu-input-hollo text-gry"
                            placeholder="أدخل الرقم الضريبي"
                            value={taxNumber}
                            onChange={(e) => setTaxNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="additionalInfo"
                          className="flex items-center gap-2"
                        >
                          <Info className="h-5 w-5 text-[#3498db]" />
                          معلومات إضافية
                        </Label>
                        <div className="v7-neu-input-container">
                          <Textarea
                            id="additionalInfo"
                            className="v7-neu-input-hollo text-gry min-h-[80px]"
                            placeholder="أي معلومات إضافية تساعد في الوصول للعنوان"
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 ">
                    <Button
                      className="v7-neu-button-accent"
                      type="submit"
                      disabled={isUpdating}
                    >
                      <Save className="h-4 w-4 ml-2" />
                      {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                  </div>
                  {updateError && (
                    <div className="text-red-600 text-center w-full">
                      حدث خطأ أثناء التحديث
                    </div>
                  )}
                  {updateData && (
                    <div className="text-green-600 text-center w-full">
                      تم تحديث البيانات بنجاح
                    </div>
                  )}
                </form>
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {alertStatus === "success" ? "نجاح" : "خطأ"}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div
                      className={`text-center py-4 ${
                        alertStatus === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {alertMsg}
                    </div>
                    <div className="flex justify-end">
                      <AlertDialogAction onClick={() => setAlertOpen(false)}>
                        حسناً
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>
            </Tabs>
          </div>
          {/* بطاقة معلومات المستخدم */}
          <div className="md:col-span-1 space-y-6">
            <div className="v7-neu-card p-6 text-center space-y-4">
              <ProfileUpLoad
                onFileSelect={handelImageUpload}
                initialImage={
                  image
                    ? image.startsWith("http") 
                      ? `${image}?t=${Date.now()}`
                      : `${process.env.NEXT_PUBLIC_API_URL || "https://www.marasil.site"}${image}?t=${Date.now()}`
                    : customerData?.data.profileImage
                    ? customerData.data.profileImage.startsWith("http")
                      ? `${customerData.data.profileImage}?t=${Date.now()}`
                      : `${
                          process.env.NEXT_PUBLIC_API_URL ||
                          "https://www.marasil.site"
                        }${customerData.data.profileImage}?t=${Date.now()}`
                    : "/homePageImages/user.jpg"
                }
              />
              <h2 className="text-xl font-bold">
                {profileData?.data.firstName} {profileData?.data.lastName}
              </h2>
              <p className="v7-neu-badge px-3 py-1 rounded-full text-xs w-fit">
                {customerData?.data.role == "user"
                  ? null
                  : customerData?.data?.role || ""}
              </p>
              <div className="flex justify-center gap-2">
                <div className="v7-neu-badge px-3 py-1 rounded-full text-xs text-gry">
                  منذ {getMemberSince(profileData?.data.createdAt || "")}
                </div>
              </div>
            </div>

            <div className="v7-neu-card p-6 space-y-4">
              <h3 className="text-md font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-[#3498db]" />
                إحصائيات الشحن
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>شحنات مكتملة</span>
                    <span className="text-[#3498db] font-medium">
                      {shipmentStats?.deliveredShipments ?? 0}
                    </span>
                  </div>
                  <div className="v7-neu-inset h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#3498db] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          shipmentStats?.deliveredShipments ?? 0,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>شحنات جارية</span>
                    <span className="text-[#3498db] font-medium">
                      {shipmentStats?.pendingShipments ?? 0}
                    </span>
                  </div>
                  <div className="v7-neu-inset h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#3498db] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          shipmentStats?.pendingShipments ?? 0,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>شحنات في الطريق</span>
                    <span className="text-[#3498db] font-medium">
                      {shipmentStats?.inTransitShipments ?? 0}
                    </span>
                  </div>
                  <div className="v7-neu-inset h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2ecc71] h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          shipmentStats?.inTransitShipments ?? 0,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <Link href={"/shipments"}>
                <Button
                  variant="ghost"
                  className="w-full v7-neu-button-flat text-[#3498db] mt-2"
                >
                  <History className="h-4 w-4 ml-2" />
                  عرض سجل الشحنات
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="mt-8 text-center text-sm text-gry">© 2025 مراسيل</div>
      </V7Content>
    </V7Layout>
  );
}
