"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, User, Building } from "lucide-react"
import ResponseModal from "../../components/ResponseModal"

const schema = yup.object({
  alias: yup.string().required("اسم العنوان مطلوب"),
  location: yup.string().required("العنوان التفصيلي مطلوب"),
  phone: yup.string().required("رقم الجوال مطلوب"),
  city: yup.string().required("المدينة مطلوبة"),
  country: yup.string().required("الدولة مطلوبة"),
}).required()

interface EditSenderAddressFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
  initialValues: {
    alias: string
    location: string
    phone: string
    city: string
    country: string
  }
}

export function EditSenderAddressForm({ isOpen, onClose, onSubmit, isLoading = false, initialValues }: EditSenderAddressFormProps) {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertStatus, setAlertStatus] = useState<'success' | 'fail'>("success")
  const [alertMessage, setAlertMessage] = useState("")

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  })

  const { register, handleSubmit, formState: { errors }, reset, setValue } = methods

  useEffect(() => {
    reset(initialValues)
  }, [initialValues, reset])

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data)
      setAlertStatus("success")
      setAlertMessage("تم تعديل العنوان بنجاح")
      setAlertOpen(true)
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (error: any) {
      setAlertStatus("fail")
      setAlertMessage(error?.data?.message || "حدث خطأ أثناء تعديل العنوان")
      setAlertOpen(true)
    }
  }

  const handleClose = () => {
    reset(initialValues)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#3498db]" />
              تعديل عنوان الالتقاط
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-2">
            {/* اسم العنوان */}
            <div className="space-y-2">
              <Label htmlFor="alias" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-[#3498db]" />
                اسم العنوان
              </Label>
              <Input
                id="alias"
                {...register("alias")}
                placeholder="اسم العنوان"
                className={errors.alias ? "v7-neu-input border-red-500 focus:border-red-500" : "v7-neu-input"}
                style={{ direction: 'rtl', fontFamily: 'inherit' }}
              />
              {errors.alias && <p className="text-sm text-red-500">{errors.alias.message}</p>}
            </div>
            {/* العنوان التفصيلي */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                العنوان التفصيلي
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="العنوان التفصيلي"
                className={errors.location ? "v7-neu-input border-red-500 focus:border-red-500" : "v7-neu-input"}
                style={{ direction: 'rtl', fontFamily: 'inherit' }}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
            {/* رقم الجوال */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#3498db]" />
                رقم الجوال
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="05xxxxxxxx"
                className={errors.phone ? "v7-neu-input border-red-500 focus:border-red-500" : "v7-neu-input"}
                style={{ direction: 'rtl', fontFamily: 'inherit' }}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            {/* المدينة */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                المدينة
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="المدينة"
                className={errors.city ? "v7-neu-input border-red-500 focus:border-red-500" : "v7-neu-input"}
                style={{ direction: 'rtl', fontFamily: 'inherit' }}
              />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            {/* الدولة */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                الدولة
              </Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="الدولة"
                className={errors.country ? "v7-neu-input border-red-500 focus:border-red-500" : "v7-neu-input"}
                style={{ direction: 'rtl', fontFamily: 'inherit' }}
              />
              {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-500 text-white" disabled={isLoading}>
                {isLoading ? 'جاري التعديل...' : 'حفظ التعديلات'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
    </>
  )
} 