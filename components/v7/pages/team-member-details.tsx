"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, UserPlus, Loader2, Check } from "lucide-react"

export default function AddTeamMemberForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-b from-white to-[#f8fafc] min-h-screen animate-fadeIn">
      {/* رأس الصفحة مع زر العودة */}
      <div className="flex items-center mb-6">
        <Link
          href="/team"
          className="flex items-center text-blue-600 hover:text-blue-800 mr-4 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>العودة إلى الفريق</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">إضافة عضو جديد</h1>
      </div>

      {/* نموذج إضافة عضو جديد */}
      <div className="bg-[#EFF2F7] rounded-xl p-6 shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setIsSubmitting(true)
            // محاكاة إرسال البيانات
            setTimeout(() => {
              setIsSubmitting(false)
              router.push("/team")
            }, 1500)
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input id="name" placeholder="أدخل الاسم الكامل" className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="example@domain.com" className="mt-1" required />
            </div>

            <div>
              <Label htmlFor="phone">رقم الجوال</Label>
              <Input id="phone" placeholder="+966 5X XXX XXXX" className="mt-1" required />
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="role" className="font-medium text-blue-700">
                المسمى الوظيفي
              </Label>
              <select
                id="role"
                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-gradient-to-r from-[#EFF2F7] to-[#E5EBEF] px-4 py-2 text-sm font-medium text-gray-800 shadow-inner hover:bg-gradient-to-r hover:from-[#E5EBEF] hover:to-[#EFF2F7] transition-all duration-300 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر المسمى الوظيفي
                </option>
                <option value="مدير">مدير</option>
                <option value="مشرف">مشرف</option>
                <option value="محاسب">محاسب</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <Label htmlFor="department" className="font-medium text-blue-700">
                القسم
              </Label>
              <select
                id="department"
                className="flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-gradient-to-r from-[#EFF2F7] to-[#E5EBEF] px-4 py-2 text-sm font-medium text-gray-800 shadow-inner hover:bg-gradient-to-r hover:from-[#E5EBEF] hover:to-[#EFF2F7] transition-all duration-300 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر القسم
                </option>
                <option value="الإدارة">الإدارة</option>
                <option value="الشحن">الشحن</option>
                <option value="المالية">المالية</option>
                <option value="تقنية المعلومات">تقنية المعلومات</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="text-2xl font-bold text-[#3498db] border-b pb-2 mb-3">الصلاحيات</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-3 bg-[#EFF2F7] p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-black border-b pb-2 mb-3">إدارة الشحنات</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-shipments"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-shipments" className="mr-2 cursor-pointer select-none">
                        عرض الشحنات
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-create-shipments"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-create-shipments" className="mr-2 cursor-pointer select-none">
                        إنشاء شحنات جديدة
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-edit-shipments"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-edit-shipments" className="mr-2 cursor-pointer select-none">
                        تعديل الشحنات
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-delete-shipments"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-delete-shipments" className="mr-2 cursor-pointer select-none">
                        حذف الشحنات
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-[#EFF2F7] p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-black border-b pb-2 mb-3">إدارة العملاء</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-customers"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-customers" className="mr-2 cursor-pointer select-none">
                        عرض العملاء
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-create-customers"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-create-customers" className="mr-2 cursor-pointer select-none">
                        إضافة عملاء جدد
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-edit-customers"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-edit-customers" className="mr-2 cursor-pointer select-none">
                        تعديل بيانات العملاء
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-delete-customers"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-delete-customers" className="mr-2 cursor-pointer select-none">
                        حذف العملاء
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-[#EFF2F7] p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-black border-b pb-2 mb-3">إدارة الفريق</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-team"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-team" className="mr-2 cursor-pointer select-none">
                        عرض أعضاء الفريق
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-create-team"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-create-team" className="mr-2 cursor-pointer select-none">
                        إضافة أعضاء جدد
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-edit-team"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-edit-team" className="mr-2 cursor-pointer select-none">
                        تعديل بيانات الأعضاء
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-delete-team"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-delete-team" className="mr-2 cursor-pointer select-none">
                        حذف أعضاء الفريق
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-[#EFF2F7] p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-black border-b pb-2 mb-3">التقارير والإحصائيات</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-reports"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-reports" className="mr-2 cursor-pointer select-none">
                        عرض التقارير
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-export-reports"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-export-reports" className="mr-2 cursor-pointer select-none">
                        تصدير التقارير
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-analytics"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-analytics" className="mr-2 cursor-pointer select-none">
                        عرض الإحصائيات
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-[#EFF2F7] p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-black border-b pb-2 mb-3">الفواتير والمدفوعات</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-invoices"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-invoices" className="mr-2 cursor-pointer select-none">
                        عرض الفواتير
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-create-invoices"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-create-invoices" className="mr-2 cursor-pointer select-none">
                        إنشاء فواتير جديدة
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-process-payments"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-process-payments" className="mr-2 cursor-pointer select-none">
                        معالجة المدفوعات
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-refunds"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-refunds" className="mr-2 cursor-pointer select-none">
                        إجراء المرتجعات
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-[#EFF2F7] p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <h4 className="font-bold text-black border-b pb-2 mb-3">إعدادات النظام</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-view-settings"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-view-settings" className="mr-2 cursor-pointer select-none">
                        عرض الإعدادات
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-edit-settings"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-edit-settings" className="mr-2 cursor-pointer select-none">
                        تعديل الإعدادات
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-manage-integrations"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-manage-integrations" className="mr-2 cursor-pointer select-none">
                        إدارة التكاملات
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id="perm-system-logs"
                          className="peer appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors duration-200"
                        />
                        <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none" />
                      </div>
                      <Label htmlFor="perm-system-logs" className="mr-2 cursor-pointer select-none">
                        عرض سجلات النظام
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center text-sm font-medium"
                  onClick={() => {
                    // إلغاء تحديد جميع الصلاحيات
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
                    checkboxes.forEach((checkbox) => ((checkbox as HTMLInputElement).checked = false))
                  }}
                >
                  إلغاء تحديد الكل
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center text-sm font-medium"
                  onClick={() => {
                    // تحديد جميع الصلاحيات
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]')
                    checkboxes.forEach((checkbox) => ((checkbox as HTMLInputElement).checked = true))
                  }}
                >
                  تحديد الكل
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1" required />
            <p className="text-xs text-gray-500">
              يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتتضمن أحرف كبيرة وصغيرة وأرقام ورموز.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/team")}
              disabled={isSubmitting}
              className="transition-all duration-200 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#294D8B] hover:bg-[#1e3b6d] flex items-center gap-2 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  إضافة العضو
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
