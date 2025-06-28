"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useCreateOrderMutation } from "@/app/api/ordersApi"

const schema = yup.object({
  clientName: yup.string().required("اسم العميل مطلوب"),
  clientPhone: yup.string().required("رقم الجوال مطلوب"),
  clientEmail: yup.string().required("البريد الإلكتروني مطلوب"),
  clientAddress: yup.string().required("العنوان مطلوب"),
  country: yup.string().required("الدولة مطلوبة"),
  city: yup.string().required("المدينة مطلوبة"),
  district: yup.string().required("الحي مطلوب"),
}).required()

type FormData = yup.InferType<typeof schema>

export function CreateOrderForm() {
  const router = useRouter()
  const [createOrder] = useCreateOrderMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await createOrder(data).unwrap()
      router.push('/orders')
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  const InputField = ({ 
    name, 
    label, 
    type = "text", 
    placeholder,
  }: { 
    name: keyof FormData
    label: string
    type?: string
    placeholder: string
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "border-2 transition-colors w-full h-10",
          errors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500"
        )}
        {...register(name)}
      />
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="v7-neu-card p-6">
          <h2 className="text-xl font-semibold text-[#1a365d] mb-6">معلومات العميل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              name="clientName"
              label="اسم العميل"
              placeholder="أدخل اسم العميل"
            />
            <InputField
              name="clientPhone"
              label="رقم الجوال"
              placeholder="أدخل رقم الجوال"
            />
            <InputField
              name="clientEmail"
              label="البريد الإلكتروني"
              type="email"
              placeholder="أدخل البريد الإلكتروني"
            />
            <InputField
              name="clientAddress"
              label="العنوان"
              placeholder="أدخل العنوان"
            />
            <InputField
              name="country"
              label="الدولة"
              placeholder="أدخل اسم الدولة"
            />
            <InputField
              name="city"
              label="المدينة"
              placeholder="أدخل اسم المدينة"
            />
            <InputField
              name="district"
              label="طريقة الدفع"
              placeholder="ادخل طريقة الدفع"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="v7-neu-button"
            onClick={() => router.push('/orders')}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="v7-neu-button-accent"
          >
            إنشاء الطلب
          </Button>
        </div>
      </form>
    </motion.div>
  )
} 