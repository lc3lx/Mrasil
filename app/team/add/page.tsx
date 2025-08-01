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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const requestData = {
      address: form.address.value || undefined,
      email: form.email.value || undefined,
      phoneNumber: form.phoneNumber.value || undefined,
      fullName: form.fullName.value || undefined,
      birthDate: form.birthDate.value || undefined,
      gender: form.gender.value || undefined,
      nationality: form.nationality.value || undefined,
    }
    try {
      await createTeamMember(requestData).unwrap()
      toast.success('تم إضافة العضو بنجاح')
      router.push(routes.team)
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('حدث خطأ أثناء إضافة العضو')
    } finally {
      setLoading(false)
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
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" name="fullName" placeholder="أدخل الاسم الكامل" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                <Input id="birthDate" name="birthDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" required>
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">الجنسية</Label>
                <Input id="nationality" name="nationality" placeholder="أدخل الجنسية" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input id="address" name="address" placeholder="أدخل العنوان" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" placeholder="example@domain.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="أدخل رقم الهاتف" required />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="v7-neu-button-flat"
                onClick={() => router.push(routes.team)}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="v7-neu-button-accent flex items-center gap-2 bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#2573a7] transition-all duration-300"
                disabled={loading}
              >
                <Save className="h-4 w-4" />
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </V7Layout>
  )
}
