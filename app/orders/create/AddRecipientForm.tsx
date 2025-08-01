import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Mail, Phone, MapPin, User } from "lucide-react"

const cities = [
  "الرياض", "جدة", "مكة", "المدينة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "خميس مشيط", "الهفوف", "المبرز", "حفر الباطن", "حائل", "نجران", "الجبيل", "أبها", "ينبع", "عرعر", "عنيزة", "سكاكا", "جازان", "القطيف", "الباحة", "بيشة", "الرس",
]

interface AddRecipientFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
  error?: any
  initialValues?: {
    clientName?: string
    clientAddress?: string
    district?: string
    city?: string
    country?: string
    clientEmail?: string
    clientPhone?: string
    customer?: string
  }
}

export function AddRecipientForm({ isOpen, onClose, onSubmit, isLoading = false, error, initialValues }: AddRecipientFormProps) {
  const [form, setForm] = useState({
    clientName: initialValues?.clientName || "",
    clientAddress: initialValues?.clientAddress || "",
    district: initialValues?.district || "",
    city: initialValues?.city || "",
    country: initialValues?.country || "",
    clientEmail: initialValues?.clientEmail || "",
    clientPhone: initialValues?.clientPhone || "",
    customer: initialValues?.customer || "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  const handleClose = () => {
    setForm({
      clientName: "",
      clientAddress: "",
      district: "",
      city: "",
      country: "",
      clientEmail: "",
      clientPhone: "",
      customer: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة عميل جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input name="clientName" placeholder="الاسم" value={form.clientName} onChange={handleChange} required />
          <Input name="clientAddress" placeholder="العنوان" value={form.clientAddress} onChange={handleChange} required />
          <Input name="district" placeholder="الحي" value={form.district} onChange={handleChange} required />
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#3498db]" />
              المدينة
            </Label>
            <Select onValueChange={handleCityChange} value={form.city}>
              <SelectTrigger
                id="city"
                className={cn(
                  "v7-neu-input",
                )}
              >
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar">
                {cities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city}
                    className="py-2 px-3 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer transition-colors"
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input name="country" placeholder="الدولة" value={form.country} onChange={handleChange} required />
          <Input name="clientEmail" placeholder="البريد الإلكتروني" value={form.clientEmail} onChange={handleChange} required />
          <Input name="clientPhone" placeholder="رقم الجوال" value={form.clientPhone} onChange={handleChange} required />
          {error && <div className="text-red-500 text-sm">{typeof error === 'string' ? error : 'حدث خطأ أثناء إضافة العميل'}</div>}
          <DialogFooter>
            <Button type="submit" className="bg-blue-500 text-white" disabled={isLoading || submitting}>
              {(isLoading || submitting) ? 'جاري الإضافة...' : 'إضافة'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 