"use client"

import { useState } from "react"
import V7Layout from "@/components/v7/v7-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import { ArrowRight, Save, Upload } from "lucide-react"
import { useCreateTeamMemberMutation } from "@/app/api/teamApi"
import { toast } from "sonner"

export default function AddTeamMemberPage() {
  const router = useRouter()
  const [createTeamMember] = useCreateTeamMemberMutation()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    // Create the request data object
    const requestData = {
      fullName: formData.get('fullName') as string || undefined,
      idNumber: formData.get('idNumber') as string || undefined,
      birthDate: formData.get('birthDate') as string || undefined,
      gender: formData.get('gender') as string || undefined,
      nationality: formData.get('nationality') as string || undefined,
      address: formData.get('address') as string || undefined,
      email: formData.get('email') as string || undefined,
      phoneNumber: formData.get('phoneNumber') as string || undefined,
      hireDate: formData.get('hireDate') as string || undefined,
      directManager: formData.get('directManager') as string || undefined,
      job: formData.get('job') as string || undefined,
      salary: formData.get('salary') ? Number(formData.get('salary')) : undefined,
      housingAllowance: formData.get('housingAllowance') ? Number(formData.get('housingAllowance')) : undefined,
      transportationAllowance: formData.get('transportationAllowance') ? Number(formData.get('transportationAllowance')) : undefined,
      otherAllowances: formData.get('otherAllowances') ? Number(formData.get('otherAllowances')) : undefined,
      salaryStatus: formData.get('salaryStatus') as string || undefined,
      personalPhoto: selectedFile || undefined
    }

    // Remove undefined values
    Object.keys(requestData).forEach(key => {
      if (requestData[key] === undefined) {
        delete requestData[key];
      }
    });

    try {
      await createTeamMember(requestData).unwrap()
      toast.success('تم إضافة العضو بنجاح')
      router.push(routes.team)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('حدث خطأ أثناء إضافة العضو')
    }
  }

  return (
    <V7Layout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.team)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">إضافة عضو جديد</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">أضف عضو جديد إلى فريق العمل</p>
          </div>
        </div>

        <div className="v7-neu-card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Photo */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="personalPhoto">الصورة الشخصية</Label>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <Input
                      id="personalPhoto"
                      name="personalPhoto"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      يمكنك رفع صورة بصيغة JPG أو PNG. الحد الأقصى للحجم 5 ميجابايت.
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" name="fullName" placeholder="أدخل الاسم الكامل" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">رقم الهوية</Label>
                <Input id="idNumber" name="idNumber" placeholder="أدخل رقم الهوية" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                <Input id="birthDate" name="birthDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">الجنسية</Label>
                <Input id="nationality" name="nationality" placeholder="أدخل الجنسية" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job">الوظيفة</Label>
                <Input id="job" name="job" placeholder="أدخل المسمى الوظيفي" />
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" placeholder="example@domain.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="أدخل رقم الهاتف" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input id="address" name="address" placeholder="أدخل العنوان" />
              </div>

              {/* Employment Information */}
              <div className="space-y-2">
                <Label htmlFor="hireDate">تاريخ التعيين</Label>
                <Input id="hireDate" name="hireDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="directManager">المدير المباشر</Label>
                <Input id="directManager" name="directManager" placeholder="أدخل اسم المدير المباشر" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">الراتب</Label>
                <Input id="salary" name="salary" type="number" placeholder="أدخل الراتب" />
              </div>

              {/* Allowances */}
              <div className="space-y-2">
                <Label htmlFor="housingAllowance">بدل السكن</Label>
                <Input id="housingAllowance" name="housingAllowance" type="number" placeholder="أدخل بدل السكن" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transportationAllowance">بدل المواصلات</Label>
                <Input id="transportationAllowance" name="transportationAllowance" type="number" placeholder="أدخل بدل المواصلات" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherAllowances">بدلات أخرى</Label>
                <Input id="otherAllowances" name="otherAllowances" type="number" placeholder="أدخل البدلات الأخرى" />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="salaryStatus">حالة الراتب</Label>
                <select id="salaryStatus" name="salaryStatus" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2">
                  <option value="">اختر حالة الراتب</option>
                  <option value="pending">معلق</option>
                  <option value="paid">مدفوع</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="v7-neu-button-flat"
                onClick={() => router.push(routes.team)}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="v7-neu-button-accent flex items-center gap-2 bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#2573a7] transition-all duration-300"
              >
                <Save className="h-4 w-4" />
                حفظ
              </Button>
            </div>
          </form>
        </div>
      </div>
    </V7Layout>
  )
}
