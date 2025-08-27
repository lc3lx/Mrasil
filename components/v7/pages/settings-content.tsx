  "use client";

  import { Badge } from "@/components/ui/badge";

  import { useState, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Switch } from "@/components/ui/switch";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import {
    Bell,
    CreditCard,
    Globe,
    Lock,
    Moon,
    Save,
    Sun,
    Upload,
    User,
    UserCog,
    Wallet,
  } from "lucide-react";
  import {
    useGetCustomerMeQuery,
    useUpdateCustomerMeMutation,
  } from "@/app/api/customerApi";
  import { useChangePasswordMutation } from "@/app/api/profileApi";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import * as z from "zod";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import Image from "next/image";

  // Password change schema (copied from ChangePasswordForm)
  const passwordFormSchema = z
    .object({
      currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
      newPassword: z
        .string()
        .min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
      confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "كلمات المرور غير متطابقة",
      path: ["confirmPassword"],
    });

  export function SettingsContent() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [openRecipientModal, setOpenRecipientModal] = useState(false);

    // --- Profile state and API integration ---
    const { data, isLoading, error } = useGetCustomerMeQuery();
    const [updateCustomerMe, { isLoading: isUpdating }] =
      useUpdateCustomerMeMutation();
    const [profileForm, setProfileForm] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      // Hidden fields to preserve
      brand_color: "",
      brand_email: "",
      brand_logo: "",
      brand_website: "",
      commercial_registration_number: "",
      company_name_ar: "",
      company_name_en: "",
      tax_number: "",
      
    });
    const [profileError, setProfileError] = useState("");
    const [profileSuccess, setProfileSuccess] = useState("");
const { register, handleSubmit, reset } = useForm({
  defaultValues: profileForm, // قيم افتراضية
});    // Password change logic
    const [changePassword] = useChangePasswordMutation();
    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
      resolver: zodResolver(passwordFormSchema),
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });
    const [passwordResponse, setPasswordResponse] = useState<{
      status: "success" | "fail";
      message: string;
    } | null>(null);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const [openAddSenderModal, setOpenAddSenderModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

    async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
      setIsPasswordSubmitting(true);
      setPasswordResponse(null);
      try {
        const response = await changePassword({
          currentPassword: values.currentPassword,
          password: values.newPassword,
          confirmPassword: values.confirmPassword,
        }).unwrap();
        setPasswordResponse({
          status: "success",
          message: response.msg || "تم تغيير كلمة المرور بنجاح",
        });
        passwordForm.reset();
      } catch (error: any) {
        setPasswordResponse({
          status: "fail",
          message: error.data?.message || "حدث خطأ أثناء تغيير كلمة المرور",
        });
      } finally {
        setIsPasswordSubmitting(false);
      }
    }

    const handleAddCard = () => {
      setShowCardModal(true);
      // يمكن هنا إضافة المزيد من المنطق لإضافة البطاقة
      console.log("فتح نافذة إضافة بطاقة جديدة");
    };

    useEffect(() => {
      setIsLoaded(true);
    }, []);

    // Populate form with fetched data
useEffect(() => {
  if (data?.data) {
    const formData = {
      firstName: data.data.firstName || "",
      lastName: data.data.lastName || "",
      email: data.data.email || "",
      phone: data.data.addresses?.[0]?.phone || "",
      address: data.data.addresses?.[0]?.location || "",
      brand_color: data.data.brand_color || "",
      brand_email: data.data.brand_email || "",
      brand_logo: data.data.brand_logo || "",
      brand_website: data.data.brand_website || "",
      commercial_registration_number:
        data.data.commercial_registration_number || "",
      company_name_ar: data.data.company_name_ar || "",
      company_name_en: data.data.company_name_en || "",
      tax_number: data.data.tax_number || "",
       profileImage: data?.data?.profileImage || "", 

    };
    setProfileForm(formData);
    reset(formData); // مزامنة الفورم مع البيانات
  }
}, [data, reset]);

    const handleProfileChange = (field: string, value: string) => {
      setProfileForm((f) => ({ ...f, [field]: value }));
    };
const onSubmit = async (data: any) => {
  let payload: any;

  try {
    // تحديد نوع payload حسب وجود صورة جديدة
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profileImage", selectedFile); 
      Object.entries(profileForm).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      payload = formData; // multipart
    } else {
      payload = data; // JSON
    }

    // إرسال البيانات للـ backend
    const response = await updateCustomerMe(payload).unwrap();

    // تحديث الفورم بأمان بعد الرد
    const updatedData = response?.data;
    setProfileForm((prev) => ({
      ...prev,
      firstName: updatedData?.firstName || "",
      lastName: updatedData?.lastName || "",
      email: updatedData?.email || "",
      phone: updatedData?.addresses?.[0]?.phone || "",
      address: updatedData?.addresses?.[0]?.location || "",
      brand_color: updatedData?.brand_color || "",
      brand_email: updatedData?.brand_email || "",
      brand_logo: updatedData?.brand_logo || "",
      brand_website: updatedData?.brand_website || "",
      commercial_registration_number:
        updatedData?.commercial_registration_number || "",
      company_name_ar: updatedData?.company_name_ar || "",
      company_name_en: updatedData?.company_name_en || "",
      tax_number: updatedData?.tax_number || "",
    }));

    // إعادة مزامنة الفورم مع البيانات
    reset(updatedData);

    // رسالة نجاح
    setProfileSuccess("✅ تم تحديث البيانات بنجاح");
    setProfileError(""); // إزالة أي رسالة خطأ سابقة

  } catch (err: any) {
    console.error("❌ خطأ:", err);

    // استخراج رسالة الخطأ بأمان
    const message =
      err?.data?.message ||
      err?.error ||
      "حدث خطأ أثناء تحديث البيانات";

    setProfileError(message);
    setProfileSuccess(""); // إزالة أي رسالة نجاح سابقة
  }
};






    return (
      <div className="space-y-6 mt-16">
        <Tabs defaultValue="profile" className="mb-6" dir="rtl">
          <TabsList className="v7-tabs-list" >
            <TabsTrigger value="profile" className="v7-tab-trigger">
              <User className="h-4 w-4 ml-2" />
              <span>الملف الشخصي</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="v7-tab-trigger">
              <Lock className="h-4 w-4 ml-2" />
              <span>الأمان</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="v7-tab-trigger">
              <Bell className="h-4 w-4 ml-2" />
              <span>الإشعارات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            {isLoading ? (
              <div>جاري التحميل...</div>
            ) : error ? (
              <div className="text-red-500">حدث خطأ أثناء جلب البيانات</div>
            ) : (
              <div
                className={`v7-neu-card p-6 rounded-xl v7-fade-in ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="flex flex-col md:flex-row gap-8">

                  <div className="md:w-2/3" >
                    <h3 className="text-xl font-bold text-[#3498db] mb-4">
                      المعلومات الشخصية
                    </h3>
                    <form  onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">الاسم الأول</Label>
                          <Input
                            id="firstName"
                            // value={profileForm.firstName}
{...register("firstName")}
                            className="v7-neu-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">الاسم الأخير</Label>
                          <Input
                            id="lastName"
                            // value={profileForm.lastName}
{...register("lastName")}

                            className="v7-neu-input"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          type="email"
                          // value={profileForm.email}
 {...register("email")} 
                          className="v7-neu-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Input
                          id="phone"
                          // value={profileForm.phone}
{...register("phone")} 
                          className="v7-neu-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">العنوان</Label>
                        <Textarea
                          id="address"
                          // value={profileForm.address}
{...register("address")} 
                          className="v7-neu-input"
                        />
                      </div>
                      {profileError && (
                        <div className="text-red-500 text-sm">{profileError}</div>
                      )}
                      {profileSuccess && (
                        <div className="text-green-600 text-sm">
                          {profileSuccess}
                        </div>
                      )}
                        <Button
                        type="submit"
                          className="v7-neu-button gap-1"
                          disabled={isUpdating}
                        >
                          <Save className="h-4 w-4" />
                          <span>
                            {isUpdating ? "جارٍ الحفظ..." : "حفظ التغييرات"}
                          </span>
                        </Button>
                    </form>
                  </div>
                  <div className="md:w-1/3">
                    <div className="flex flex-col items-center">

  <Avatar className="h-24 w-24 mb-4">
    {selectedFile ? (
      <Image
        alt="user"
        src={URL.createObjectURL(selectedFile)}
        width={120}
        height={120}
        className="rounded-full object-cover h-24 w-24 mb-4"
      />
    ) : (
      <AvatarFallback className="bg-[#3498db]/10 text-[#3498db] text-2xl">
        {profileForm.firstName?.[0] || "أ"}
        {profileForm.lastName?.[0] || "ح"}
      </AvatarFallback>
    )}
  </Avatar>


                      <Button
                        variant="outline"
                        size="sm"
                        className="v7-neu-button-sm gap-1 relative overflow-hidden mt-4"
                      >
                        <Upload className="h-4 w-4" />

                        <span >تغيير الصورة</span>
                        <input

    type="file"
    accept="image/*"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
      }
    }}
  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />

                      </Button>
                      <p className="text-xs text-gry mt-2">
                        الحد الأقصى لحجم الصورة: 5 ميجابايت
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="security" className="mt-6">
            <div
              className={`v7-neu-card p-6 rounded-xl v7-fade-in ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <h3 className="text-xl font-bold text-[#3498db] mb-4">
                إعدادات الأمان
              </h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">تغيير كلمة المرور</h4>
                  {/* Password change form */}
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        {...passwordForm.register("currentPassword")}
                        className="v7-neu-input text-gry"
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <span className="text-red-500 text-xs">
                          {passwordForm.formState.errors.currentPassword.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordForm.register("newPassword")}
                      className="v7-neu-input text-gry"/>
                      {passwordForm.formState.errors.newPassword && (
                        <span className="text-red-500 text-xs">
                          {passwordForm.formState.errors.newPassword.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                      className="v7-neu-input text-gry"/>
                      {passwordForm.formState.errors.confirmPassword && (
                        <span className="text-red-500 text-xs">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </span>
                      )}
                    </div>
                    {passwordResponse && (
                      <div
                        className={
                          passwordResponse.status === "success"
                            ? "text-green-600 text-sm"
                            : "text-red-500 text-sm"
                        }
                      >
                        {passwordResponse.message}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="v7-neu-button gap-2 w-full flex items-center justify-center py-3 text-base font-semibold bg-[#165a8f] text-white rounded-lg hover:bg-[#1a6bb8] transition-colors"
                      disabled={isPasswordSubmitting}
                    >
                      <Save className="h-5 w-5" />
                      <span>
                        {isPasswordSubmitting
                          ? "جارٍ التغيير..."
                          : "تحديث كلمة المرور"}
                      </span>
                    </Button>
                  </form>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium mb-4">المصادقة الثنائية</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">تفعيل المصادقة الثنائية</Label>
                      <p className="text-xs text-gry">
                        تأمين حسابك بطبقة إضافية من الحماية
                      </p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>
                </div>

              </div>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="mt-6">
            <div
              className={`v7-neu-card p-6 rounded-xl v7-fade-in ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <h3 className="text-xl font-bold text-[#3498db] mb-4">
                إعدادات الإشعارات
              </h3>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">إشعارات الشحنات</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shipmentUpdates">تحديثات الشحنات</Label>
                        <p className="text-xs text-gry">
                          إشعارات عند تحديث حالة الشحنة
                        </p>
                      </div>
                      <Switch id="shipmentUpdates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="deliveryNotifications">
                          إشعارات التوصيل
                        </Label>
                        <p className="text-xs text-gry">
                          إشعارات عند توصيل الشحنة
                        </p>
                      </div>
                      <Switch id="deliveryNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="delayNotifications">
                          إشعارات التأخير
                        </Label>
                        <p className="text-xs text-gry">
                          إشعارات عند تأخير الشحنة
                        </p>
                      </div>
                      <Switch id="delayNotifications" defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6 space-y-4">
                  <h4 className="text-lg font-medium">إشعارات الحساب</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="paymentNotifications">
                          إشعارات الدفع
                        </Label>
                        <p className="text-xs text-gry">
                          إشعارات عند إتمام عمليات الدفع
                        </p>
                      </div>
                      <Switch id="paymentNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="securityNotifications">
                          إشعارات الأمان
                        </Label>
                        <p className="text-xs text-gry">
                          إشعارات عند تسجيل الدخول من جهاز جديد
                        </p>
                      </div>
                      <Switch id="securityNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingNotifications">
                          إشعارات تسويقية
                        </Label>
                        <p className="text-xs text-gry">
                          إشعارات عن العروض والتحديثات
                        </p>
                      </div>
                      <Switch id="marketingNotifications" />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6 space-y-4">
                  <h4 className="text-lg font-medium">طرق الإشعار</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">
                          البريد الإلكتروني
                        </Label>
                        <p className="text-xs text-gry">
                          استلام الإشعارات عبر البريد الإلكتروني
                        </p>
                      </div>
                      <Switch id="emailNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">الرسائل النصية</Label>
                        <p className="text-xs text-gry">
                          استلام الإشعارات عبر الرسائل النصية
                        </p>
                      </div>
                      <Switch id="smsNotifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">إشعارات الجوال</Label>
                        <p className="text-xs text-gry">
                          استلام الإشعارات على تطبيق الجوال
                        </p>
                      </div>
                      <Switch id="pushNotifications" defaultChecked />
                    </div>
                  </div>
                </div>
                  <Button className="v7-neu-button gap-1">
                    <Save className="h-4 w-4" />
                    <span>حفظ التغييرات</span>
                  </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
