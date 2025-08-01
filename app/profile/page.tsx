"use client"

import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"
import { useGetProfileQuery } from "@/app/api/profileApi"
import ChangePasswordForm from "./ChangePasswordForm"
import { useGetCustomerMeQuery, useUpdateCustomerMeMutation } from '../api/customerApi'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog'
import { useGetShipmentStatsQuery } from "@/app/api/homePageApi"


export default function ProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery()
  const { data: customerData, isLoading: isCustomerLoading } = useGetCustomerMeQuery()
  const [updateCustomerMe, { isLoading: isUpdating, error: updateError, data: updateData }] = useUpdateCustomerMeMutation()
  const { data: shipmentStats } = useGetShipmentStatsQuery();

  // For company info
  const [brandColor, setBrandColor] = useState(customerData?.data.brand_color || '')
  const [brandLogo, setBrandLogo] = useState<File | null>(null)
  const [companyNameAr, setCompanyNameAr] = useState(customerData?.data.company_name_ar || '')
  const [companyNameEn, setCompanyNameEn] = useState(customerData?.data.company_name_en || '')
  const [brandEmail, setBrandEmail] = useState(customerData?.data.brand_email || '')
  const [additionalInfo, setAdditionalInfo] = useState(customerData?.data.additional_info || '')
  const [taxNumber, setTaxNumber] = useState(customerData?.data.tax_number || '')
  const [commercialRegistrationNumber, setCommercialRegistrationNumber] = useState(customerData?.data.commercial_registration_number || '')
  const [brandWebsite, setBrandWebsite] = useState(customerData?.data.brand_website || '')

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState<string | null>(null)
  const [alertStatus, setAlertStatus] = useState<'success' | 'error'>('success')

  useEffect(() => {
    if (customerData) {
      setBrandColor(customerData.data.brand_color || '')
      setCompanyNameAr(customerData.data.company_name_ar || '')
      setCompanyNameEn(customerData.data.company_name_en || '')
      setBrandEmail(customerData.data.brand_email || '')
      setAdditionalInfo(customerData.data.additional_info || '')
      setTaxNumber(customerData.data.tax_number || '')
      setCommercialRegistrationNumber(customerData.data.commercial_registration_number || '')
      setBrandWebsite(customerData.data.brand_website || '')
    }
  }, [customerData])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrandLogo(e.target.files[0])
    }
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    if (brandLogo) formData.append('brand_logo', brandLogo)
    formData.append('brand_color', brandColor)
    formData.append('company_name_ar', companyNameAr)
    formData.append('company_name_en', companyNameEn)
    formData.append('brand_email', brandEmail)
    formData.append('additional_info', additionalInfo)
    formData.append('tax_number', taxNumber)
    formData.append('commercial_registration_number', commercialRegistrationNumber)
    formData.append('brand_website', brandWebsite)
    try {
      const res = await updateCustomerMe(formData).unwrap()
      setAlertMsg(res?.message || 'تم تحديث البيانات بنجاح')
      setAlertStatus('success')
      setAlertOpen(true)
    } catch (err: any) {
      setAlertMsg(err?.data?.message || 'حدث خطأ أثناء التحديث')
      setAlertStatus('error')
      setAlertOpen(true)
    }
  }

  // Function to get the year from createdAt
  const getMemberSince = (createdAt: string) => {
    return new Date(createdAt).getFullYear()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <V7Layout>
      <V7Content title="الملف الشخصي" description="إدارة معلوماتك الشخصية وإعدادات الحساب">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* بطاقة معلومات المستخدم */}
          <div className="md:col-span-1 space-y-6">
            <div className="v7-neu-card p-6 text-center space-y-4">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="v7-neu-avatar w-32 h-32 mx-auto overflow-hidden flex items-center justify-center">
                  <img src="/abstract-user-icon.png" alt="صورة الملف الشخصي" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 v7-neu-button-sm p-2 rounded-full">
                  <Camera className="h-4 w-4 text-[#3498db]" />
                </button>
              </div>

              <h2 className="text-xl font-bold">{profileData?.data.firstName} {profileData?.data.lastName}</h2>

              <div className="flex justify-center gap-2">
                <div className="v7-neu-badge px-3 py-1 rounded-full text-xs text-gry">
                  منذ {getMemberSince(profileData?.data.createdAt || '')}
                </div>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-[#3498db]">{shipmentStats?.deliveredShipments ?? 0}</div>
                  <div className="text-xs text-gry">شحنة</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#3498db]">12</div>
                  <div className="text-xs text-gry">دولة</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-[#3498db]">{shipmentStats?.totalShipments ? `${Math.round((shipmentStats.pendingShipments / shipmentStats.totalShipments) * 100)}%` : '0%'}</div>
                  <div className="text-xs text-gry">تقييم</div>
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
                    <span className="text-[#3498db] font-medium">{shipmentStats?.deliveredShipments ?? 0}</span>
                  </div>
                  <div className="v7-neu-inset h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3498db] h-full rounded-full" style={{ width: `${Math.min((shipmentStats?.deliveredShipments ?? 0), 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>شحنات جارية</span>
                    <span className="text-[#3498db] font-medium">{shipmentStats?.pendingShipments ?? 0}</span>
                  </div>
                  <div className="v7-neu-inset h-2 rounded-full overflow-hidden">
                    <div className="bg-[#3498db] h-full rounded-full" style={{ width: `${Math.min((shipmentStats?.pendingShipments ?? 0), 100)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>شحنات في الطريق</span>
                    <span className="text-[#3498db] font-medium">{shipmentStats?.inTransitShipments ?? 0}</span>
                  </div>
                  <div className="v7-neu-inset h-2 rounded-full overflow-hidden">
                    <div className="bg-[#2ecc71] h-full rounded-full" style={{ width: `${Math.min((shipmentStats?.inTransitShipments ?? 0), 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <Button variant="ghost" className="w-full v7-neu-button-flat text-[#3498db] mt-2">
                <History className="h-4 w-4 ml-2" />
                عرض سجل الشحنات
              </Button>
            </div>
          </div>

          {/* تبويبات المعلومات والإعدادات */}
          <div className="md:col-span-2">
            <Tabs defaultValue="preferences" className="v7-neu-card p-6">
              <TabsList className="v7-neu-tabs mb-6">
                <TabsTrigger value="preferences" className="v7-neu-tab">
                  <Settings className="h-4 w-4 ml-2" />
                  التفضيلات
                </TabsTrigger>
                <TabsTrigger value="security" className="v7-neu-tab">
                  <Shield className="h-4 w-4 ml-2" />
                  الأمان
                </TabsTrigger>
                <TabsTrigger value="company" className="v7-neu-tab">
                  <Briefcase className="h-4 w-4 ml-2" />
                  معلومات الشركة
                </TabsTrigger>
                <TabsTrigger value="personal" className="v7-neu-tab">
                  <User className="h-4 w-4 ml-2" />
                  المعلومات الشخصية
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل</Label>
                      <div className="v7-neu-input-container">
                        <Input id="fullName" className="v7-neu-input" defaultValue={`${customerData?.data.firstName} ${customerData?.data.lastName}`} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="v7-neu-input-container">
                        <Input id="email" className="v7-neu-input" defaultValue={customerData?.data.email} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="active">الحالة</Label>
                    <div className="v7-neu-input-container">
                      {customerData?.data.active ? (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">نشط</span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">غير نشط</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">الدور</Label>
                    <div className="v7-neu-input-container">
                      <Input id="role" className="v7-neu-input bg-gray-100 cursor-not-allowed" value={customerData?.data.role || ''} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="createdAt">تاريخ الإنشاء</Label>
                    <div className="v7-neu-input-container">
                      <Input id="createdAt" className="v7-neu-input bg-gray-100 cursor-not-allowed" value={customerData?.data.createdAt ? new Date(customerData.data.createdAt).toLocaleString('ar-EG') : ''} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordChangedAt">آخر تغيير كلمة المرور</Label>
                    <div className="v7-neu-input-container">
                      <Input id="passwordChangedAt" className="v7-neu-input bg-gray-100 cursor-not-allowed" value={customerData?.data.passwordChangedAt ? new Date(customerData.data.passwordChangedAt).toLocaleString('ar-EG') : 'لم يتم التغيير'} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addresses">عدد العناوين</Label>
                    <div className="v7-neu-input-container">
                      <Input id="addresses" className="v7-neu-input bg-gray-100 cursor-not-allowed" value={Array.isArray(customerData?.data.addresses) ? customerData.data.addresses.length : 0} readOnly />
                    </div>
                  </div>

                
                  <div className="flex justify-end">
                    <Button className="v7-neu-button-accent">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* تبويب معلومات الشركة الجديد */}
              <TabsContent value="company" className="space-y-6">
                <form onSubmit={handleCompanySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* قسم لون العلامة التجارية */}
                  <div className="v7-neu-card p-6 space-y-4">
                    <h3 className="text-xl font-bold text-center mb-4">لون العلامة التجارية</h3>
                    <div className="flex items-center justify-center space-x-4 space-x-reverse">
                      <div className="v7-neu-input-container flex-1">
                        <Input id="brandColor" className="v7-neu-input text-center" value={brandColor} onChange={e => setBrandColor(e.target.value)} />
                      </div>
                      <div className="w-10 h-10 rounded-full v7-neu-inset overflow-hidden">
                        <div className="w-full h-full" style={{ backgroundColor: brandColor || '#1b2f50' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* قسم شعار العلامة التجارية */}
                  <div className="v7-neu-card p-6 space-y-4">
                    <h3 className="text-xl font-bold text-center mb-4">شعار علامتك التجارية</h3>
                    <div className="flex flex-col items-center justify-center">
                      <div className="v7-neu-inset w-40 h-40 rounded-lg overflow-hidden flex items-center justify-center p-4 mb-4">
                        {brandLogo ? (
                          <img src={URL.createObjectURL(brandLogo)} alt="شعار الشركة" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <img src={customerData?.data.brand_logo || '/placeholder.svg'} alt="شعار الشركة" className="max-w-full max-h-full object-contain" />
                        )}
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" id="brandLogoInput" />
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
                        <Label htmlFor="companyName" className="flex items-center">
                          اسم الشركة باللغة العربية
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input id="companyName" className="v7-neu-input" placeholder="أدخل اسم الشركة" value={companyNameAr} onChange={e => setCompanyNameAr(e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyNameEn" className="flex items-center">
                          اسم الشركة باللغة الإنجليزية
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="companyNameEn"
                            className="v7-neu-input"
                            placeholder="Enter Company Name in English"
                            value={companyNameEn}
                            onChange={e => setCompanyNameEn(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyEmail" className="flex items-center">
                          البريد الإلكتروني
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="companyEmail"
                            className="v7-neu-input"
                            type="email"
                            placeholder="example@company.com"
                            value={brandEmail}
                            onChange={e => setBrandEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyWebsite" className="flex items-center">
                          رابط الموقع
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input id="companyWebsite" className="v7-neu-input" placeholder="https://www.example.com" value={brandWebsite} onChange={e => setBrandWebsite(e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commercialRegister" className="flex items-center">
                          رقم السجل التجاري
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input
                            id="commercialRegister"
                            className="v7-neu-input"
                            placeholder="أدخل رقم السجل التجاري"
                            value={commercialRegistrationNumber}
                            onChange={e => setCommercialRegistrationNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxNumber" className="flex items-center">
                          الرقم الضريبي
                          <span className="text-red-500 mr-1">*</span>
                        </Label>
                        <div className="v7-neu-input-container">
                          <Input id="taxNumber" className="v7-neu-input" placeholder="أدخل الرقم الضريبي" value={taxNumber} onChange={e => setTaxNumber(e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalInfo" className="flex items-center gap-2">
                          <Info className="h-5 w-5 text-[#3498db]" />
                          معلومات إضافية
                        </Label>
                        <div className="v7-neu-input-container">
                          <Textarea
                            id="additionalInfo"
                            className="v7-neu-input min-h-[80px]"
                            placeholder="أي معلومات إضافية تساعد في الوصول للعنوان"
                            value={additionalInfo}
                            onChange={e => setAdditionalInfo(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <Button className="v7-neu-button-accent" type="submit" disabled={isUpdating}>
                      <Save className="h-4 w-4 ml-2" />
                      {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                  </div>
                  {updateError && <div className="text-red-600 text-center w-full">حدث خطأ أثناء التحديث</div>}
                  {updateData && <div className="text-green-600 text-center w-full">تم تحديث البيانات بنجاح</div>}
                </form>
                <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{alertStatus === 'success' ? 'نجاح' : 'خطأ'}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className={`text-center py-4 ${alertStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>{alertMsg}</div>
                    <div className="flex justify-end">
                      <AlertDialogAction onClick={() => setAlertOpen(false)}>حسناً</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-bold">الأمان</h3>
                  <div className="space-y-6">
                    <ChangePasswordForm />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-md font-bold mb-4">الإشعارات</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">إشعارات البريد الإلكتروني</p>
                          <p className="text-sm text-gry">استلام تحديثات الشحنات عبر البريد الإلكتروني</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">إشعارات الهاتف</p>
                          <p className="text-sm text-gry">استلام تحديثات الشحنات عبر الرسائل النصية</p>
                        </div>
                        <Switch id="sms-notifications" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">إشعارات التطبيق</p>
                          <p className="text-sm text-gry">استلام إشعارات داخل التطبيق</p>
                        </div>
                        <Switch id="app-notifications" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-bold mb-4">اللغة والمنطقة</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">اللغة</Label>
                        <div className="v7-neu-input-container">
                          <select id="language" className="v7-neu-input w-full">
                            <option value="ar">العربية</option>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">المنطقة الزمنية</Label>
                        <div className="v7-neu-input-container">
                          <select id="timezone" className="v7-neu-input w-full">
                            <option value="ast">(AST) التوقيت العربي الرسمي +03:00</option>
                            <option value="gmt">(GMT) توقيت جرينتش +00:00</option>
                            <option value="est">(EST) التوقيت الشرقي -05:00</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="v7-neu-button-accent">
                      <Save className="h-4 w-4 ml-2" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="mt-8 text-center text-sm text-gry">© 2025 مراسيل</div>
      </V7Content>
    </V7Layout>
  )
}
