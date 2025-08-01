"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, CreditCard, Globe, Lock, Moon, Save, Sun, Upload, User, UserCog, Wallet } from "lucide-react"
import { useGetCustomerMeQuery, useUpdateCustomerMeMutation } from "@/app/api/customerApi";
import { useChangePasswordMutation } from "@/app/api/profileApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Password change schema (copied from ChangePasswordForm)
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
  newPassword: z.string().min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

export function SettingsContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)

  // --- Profile state and API integration ---
  const { data, isLoading, error } = useGetCustomerMeQuery();
  const [updateCustomerMe, { isLoading: isUpdating }] = useUpdateCustomerMeMutation();
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

  // Password change logic
  const [changePassword] = useChangePasswordMutation();
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const [passwordResponse, setPasswordResponse] = useState<{ status: 'success' | 'fail'; message: string } | null>(null);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsPasswordSubmitting(true);
    setPasswordResponse(null);
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();
      setPasswordResponse({ status: 'success', message: response.msg || 'تم تغيير كلمة المرور بنجاح' });
      passwordForm.reset();
    } catch (error: any) {
      setPasswordResponse({ status: 'fail', message: error.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور' });
    } finally {
      setIsPasswordSubmitting(false);
    }
  }

  const handleAddCard = () => {
    setShowCardModal(true)
    // يمكن هنا إضافة المزيد من المنطق لإضافة البطاقة
    console.log("فتح نافذة إضافة بطاقة جديدة")
  }

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Populate form with fetched data
  useEffect(() => {
    if (data?.data) {
      setProfileForm({
        firstName: data.data.firstName || "",
        lastName: data.data.lastName || "",
        email: data.data.email || "",
        phone: data.data.addresses?.[0]?.phone || "",
        address: data.data.addresses?.[0]?.location || "",
        brand_color: data.data.brand_color || "",
        brand_email: data.data.brand_email || "",
        brand_logo: data.data.brand_logo || "",
        brand_website: data.data.brand_website || "",
        commercial_registration_number: data.data.commercial_registration_number || "",
        company_name_ar: data.data.company_name_ar || "",
        company_name_en: data.data.company_name_en || "",
        tax_number: data.data.tax_number || "",
      });
    }
  }, [data]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm(f => ({ ...f, [field]: value }));
  };

  const handleProfileSave = async () => {
    setProfileError("");
    setProfileSuccess("");
    const formData = new FormData();
    Object.entries(profileForm).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    try {
      await updateCustomerMe(formData).unwrap();
      setProfileSuccess("تم حفظ التغييرات بنجاح!");
    } catch (err: any) {
      setProfileError("حدث خطأ أثناء حفظ التغييرات");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="mb-6">
        <TabsList className="v7-tabs-list">
          <TabsTrigger value="profile" className="v7-tab-trigger">
            <User className="h-4 w-4 ml-2" />
            <span>الملف الشخصي</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="v7-tab-trigger">
            <UserCog className="h-4 w-4 ml-2" />
            <span>الحساب</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="v7-tab-trigger">
            <Lock className="h-4 w-4 ml-2" />
            <span>الأمان</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="v7-tab-trigger">
            <Bell className="h-4 w-4 ml-2" />
            <span>الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="v7-tab-trigger">
            <CreditCard className="h-4 w-4 ml-2" />
            <span>طرق الدفع</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          {isLoading ? (
            <div>جاري التحميل...</div>
          ) : error ? (
            <div className="text-red-500">حدث خطأ أثناء جلب البيانات</div>
          ) : (
          <div
            className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-[#3498db]/10 text-[#3498db] text-2xl">{profileForm.firstName?.[0] || "أ"}{profileForm.lastName?.[0] || "ح"}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="v7-neu-button-sm gap-1">
                    <Upload className="h-4 w-4" />
                    <span>تغيير الصورة</span>
                  </Button>
                  <p className="text-xs text-gry mt-2">الحد الأقصى لحجم الصورة: 5 ميجابايت</p>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-[#3498db] mb-4">المعلومات الشخصية</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">الاسم الأول</Label>
                      <Input id="firstName" value={profileForm.firstName} onChange={e => handleProfileChange("firstName", e.target.value)} className="v7-neu-input" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">الاسم الأخير</Label>
                      <Input id="lastName" value={profileForm.lastName} onChange={e => handleProfileChange("lastName", e.target.value)} className="v7-neu-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" value={profileForm.email} onChange={e => handleProfileChange("email", e.target.value)} className="v7-neu-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" value={profileForm.phone} onChange={e => handleProfileChange("phone", e.target.value)} className="v7-neu-input" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Textarea id="address" value={profileForm.address} onChange={e => handleProfileChange("address", e.target.value)} className="v7-neu-input" />
                  </div>
                  {profileError && <div className="text-red-500 text-sm">{profileError}</div>}
                  {profileSuccess && <div className="text-green-600 text-sm">{profileSuccess}</div>}
                  <div className="flex justify-end">
                    <Button className="v7-neu-button gap-1" onClick={handleProfileSave} disabled={isUpdating}>
                      <Save className="h-4 w-4" />
                      <span>{isUpdating ? "جارٍ الحفظ..." : "حفظ التغييرات"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <div
            className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-[#3498db] mb-4">إعدادات الحساب</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input id="username" defaultValue="ahmed_m" className="v7-neu-input" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">اللغة</Label>
                <Select defaultValue="ar">
                  <SelectTrigger className="v7-neu-input">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">الوضع المظلم</Label>
                  <p className="text-xs text-gry">تفعيل الوضع المظلم للتطبيق</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-gry" />
                  <Switch id="darkMode" />
                  <Moon className="h-4 w-4 text-gry" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="v7-neu-button gap-1">
                  <Save className="h-4 w-4" />
                  <span>حفظ التغييرات</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div
            className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-[#3498db] mb-4">إعدادات الأمان</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">تغيير كلمة المرور</h4>
                {/* Password change form */}
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")}/>
                    {passwordForm.formState.errors.currentPassword && (
                      <span className="text-red-500 text-xs">{passwordForm.formState.errors.currentPassword.message}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input id="newPassword" type="password" {...passwordForm.register("newPassword")}/>
                    {passwordForm.formState.errors.newPassword && (
                      <span className="text-red-500 text-xs">{passwordForm.formState.errors.newPassword.message}</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                    <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")}/>
                    {passwordForm.formState.errors.confirmPassword && (
                      <span className="text-red-500 text-xs">{passwordForm.formState.errors.confirmPassword.message}</span>
                    )}
                  </div>
                  {passwordResponse && (
                    <div className={passwordResponse.status === 'success' ? "text-green-600 text-sm" : "text-red-500 text-sm"}>
                      {passwordResponse.message}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="v7-neu-button gap-2 w-full flex items-center justify-center py-3 text-base font-semibold bg-[#165a8f] text-white rounded-lg hover:bg-[#1a6bb8] transition-colors"
                    disabled={isPasswordSubmitting}
                  >
                    <Save className="h-5 w-5" />
                    <span>{isPasswordSubmitting ? "جارٍ التغيير..." : "تحديث كلمة المرور"}</span>
                  </Button>
                </form>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium mb-4">المصادقة الثنائية</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactor">تفعيل المصادقة الثنائية</Label>
                    <p className="text-xs text-gry">تأمين حسابك بطبقة إضافية من الحماية</p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium mb-4">جلسات تسجيل الدخول</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg">
                    <div>
                      <p className="font-medium">الجهاز الحالي</p>
                      <p className="text-xs text-gry">Chrome على Windows • الرياض، المملكة العربية السعودية</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">نشط الآن</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg">
                    <div>
                      <p className="font-medium">iPhone 13</p>
                      <p className="text-xs text-gry">Safari على iOS • آخر نشاط: منذ 2 يوم</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      إنهاء الجلسة
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div
            className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-[#3498db] mb-4">إعدادات الإشعارات</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">إشعارات الشحنات</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="shipmentUpdates">تحديثات الشحنات</Label>
                      <p className="text-xs text-gry">إشعارات عند تحديث حالة الشحنة</p>
                    </div>
                    <Switch id="shipmentUpdates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="deliveryNotifications">إشعارات التوصيل</Label>
                      <p className="text-xs text-gry">إشعارات عند توصيل الشحنة</p>
                    </div>
                    <Switch id="deliveryNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="delayNotifications">إشعارات التأخير</Label>
                      <p className="text-xs text-gry">إشعارات عند تأخير الشحنة</p>
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
                      <Label htmlFor="paymentNotifications">إشعارات الدفع</Label>
                      <p className="text-xs text-gry">إشعارات عند إتمام عمليات الدفع</p>
                    </div>
                    <Switch id="paymentNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="securityNotifications">إشعارات الأمان</Label>
                      <p className="text-xs text-gry">إشعارات عند تسجيل الدخول من جهاز جديد</p>
                    </div>
                    <Switch id="securityNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingNotifications">إشعارات تسويقية</Label>
                      <p className="text-xs text-gry">إشعارات عن العروض والتحديثات</p>
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
                      <Label htmlFor="emailNotifications">البريد الإلكتروني</Label>
                      <p className="text-xs text-gry">استلام الإشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">الرسائل النصية</Label>
                      <p className="text-xs text-gry">استلام الإشعارات عبر الرسائل النصية</p>
                    </div>
                    <Switch id="smsNotifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">إشعارات الجوال</Label>
                      <p className="text-xs text-gry">استلام الإشعارات على تطبيق الجوال</p>
                    </div>
                    <Switch id="pushNotifications" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="v7-neu-button gap-1">
                  <Save className="h-4 w-4" />
                  <span>حفظ التغييرات</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-6">
          <div
            className={`v7-neu-card p-6 rounded-xl v7-fade-in ${isLoaded ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: "0.2s" }}
          >
            <h3 className="text-xl font-bold text-[#3498db] mb-4">طرق الدفع</h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium">البطاقات المحفوظة</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">**** **** **** 4582</p>
                        <p className="text-xs text-gry">تنتهي في 05/26</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">افتراضية</Badge>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        حذف
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 bg-gradient-to-r from-red-500 to-orange-500 rounded-md flex items-center justify-center text-white font-bold">
                        MC
                      </div>
                      <div>
                        <p className="font-medium">**** **** **** 7891</p>
                        <p className="text-xs text-gry">تنتهي في 11/25</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="v7-neu-button-sm">
                        تعيين كافتراضية
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        حذف
                      </Button>
                    </div>
                  </div>
                </div>
                <Button className="v7-neu-button gap-1" onClick={handleAddCard}>
                  <CreditCard className="h-4 w-4" />
                  <span>إضافة بطاقة جديدة</span>
                </Button>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="text-lg font-medium">طرق الدفع الأخرى</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#3498db] rounded-full flex items-center justify-center text-white">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">المحفظة الإلكترونية</p>
                        <p className="text-xs text-gry">الرصيد الحالي: 564.75 ريال</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="v7-neu-button-sm">
                      شحن المحفظة
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#e05d34] rounded-full flex items-center justify-center text-white">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">الدفع عند الاستلام</p>
                        <p className="text-xs text-gry">متاح لجميع الشحنات المحلية</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="text-lg font-medium">الفواتير</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="invoiceEmail">إرسال الفواتير بالبريد الإلكتروني</Label>
                      <p className="text-xs text-gry">استلام الفواتير عبر البريد الإلكتروني</p>
                    </div>
                    <Switch id="invoiceEmail" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="v7-neu-button gap-1">
                  <Save className="h-4 w-4" />
                  <span>حفظ التغييرات</span>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {showCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#EFF2F7] p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-[#3498db] mb-4">إضافة بطاقة جديدة</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <Input id="cardNumber" placeholder="**** **** **** ****" className="v7-neu-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                  <Input id="expiryDate" placeholder="MM/YY" className="v7-neu-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">رمز الأمان</Label>
                  <Input id="cvv" placeholder="CVV" className="v7-neu-input" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardholderName">اسم حامل البطاقة</Label>
                <Input id="cardholderName" placeholder="الاسم كما يظهر على البطاقة" className="v7-neu-input" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowCardModal(false)}>
                  إلغاء
                </Button>
                <Button
                  className="v7-neu-button"
                  onClick={() => {
                    alert("تمت إضافة البطاقة بنجاح!")
                    setShowCardModal(false)
                  }}
                >
                  إضافة البطاقة
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
