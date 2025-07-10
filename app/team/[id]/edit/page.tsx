"use client"

import { useEffect, useState } from "react"
import V7Layout from "@/components/v7/v7-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import { ArrowRight, Save } from "lucide-react"
import { useGetTeamMemberDetailsQuery, useUpdateTeamMemberMutation } from "@/app/api/teamApi"
import { toast } from "sonner"

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data, isLoading, error } = useGetTeamMemberDetailsQuery(params.id)
  const [updateTeamMember] = useUpdateTeamMemberMutation()
  const [loading, setLoading] = useState(false)
  const [formState, setFormState] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    nationality: '',
    address: '',
    email: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (data?.data) {
      setFormState({
        fullName: data.data.fullName || '',
        birthDate: data.data.birthDate ? data.data.birthDate.slice(0, 10) : '',
        gender: data.data.gender || '',
        nationality: data.data.nationality || '',
        address: data.data.address || '',
        email: data.data.email || '',
        phoneNumber: data.data.phoneNumber || '',
      })
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateTeamMember({ id: params.id, data: formState }).unwrap()
      toast.success('تم تحديث بيانات العضو بنجاح')
      router.push(routes.team)
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث بيانات العضو')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <V7Layout>
        <div className="p-8 text-center">جاري تحميل بيانات العضو...</div>
      </V7Layout>
    )
  }

  if (error) {
    return (
      <V7Layout>
        <div className="p-8 text-center text-red-500">حدث خطأ أثناء تحميل بيانات العضو</div>
      </V7Layout>
    )
  }

  return (
    <V7Layout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => router.push(routes.team)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">تعديل بيانات عضو الفريق</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">يمكنك تعديل بيانات العضو هنا</p>
          </div>
        </div>
        <div className="v7-neu-card rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" name="fullName" value={formState.fullName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                <Input id="birthDate" name="birthDate" type="date" value={formState.birthDate} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={formState.gender} onChange={handleChange} required>
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">الجنسية</Label>
                <Input id="nationality" name="nationality" value={formState.nationality} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input id="address" name="address" value={formState.address} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">رقم الهاتف</Label>
                <Input id="phoneNumber" name="phoneNumber" value={formState.phoneNumber} onChange={handleChange} required />
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
