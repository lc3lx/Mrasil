"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Step1Props {
  formData: {
    senderName: string
    senderPhoneNumber: string
    senderCity: string
    senderAddress: string
    recipientName: string
    recipientPhoneNumber: string
    recipientCity: string
    recipientAddress: string
  }
  onNext: () => void
  onFormDataChange: (data: any) => void
}

const cities = [
  "الرياض",
  "جدة",
  "مكة",
  "المدينة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "الهفوف",
  "المبرز",
  "حفر الباطن",
  "حائل",
  "نجران",
  "الجبيل",
  "أبها",
  "ينبع",
  "عرعر",
  "عنيزة",
  "سكاكا",
  "جازان",
  "القطيف",
  "الباحة",
  "بيشة",
  "الرس",
]

const schema = yup.object({
  senderName: yup.string().required("اسم المرسل مطلوب"),
  senderPhoneNumber: yup.string(),
  senderCity: yup.string().required("المدينة مطلوبة"),
  senderAddress: yup.string().required("العنوان مطلوب"),
  recipientName: yup.string().required("اسم المستلم مطلوب"),
  recipientPhoneNumber: yup.string(),
  recipientCity: yup.string().required("المدينة مطلوبة"),
  recipientAddress: yup.string().required("العنوان مطلوب"),
}).required()

type FormData = yup.InferType<typeof schema>

export function Step1({ formData, onNext, onFormDataChange }: Step1Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: formData,
  })

  const onSubmit = (data: FormData) => {
    // Transform form data for shipment API
    const shipperAddress = {
      full_name: data.senderName,
      mobile: data.senderPhoneNumber,
      city: data.senderCity,
      country: "sa",
      address: data.senderAddress,
    }
    onFormDataChange({
      ...data,
      shipperAddress,
    })
    onNext()
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

  const SelectField = ({ 
    name, 
    label, 
    placeholder,
  }: { 
    name: keyof FormData
    label: string
    placeholder: string
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Select
        defaultValue={formData[name]}
        onValueChange={(value) => setValue(name, value)}
      >
        <SelectTrigger
          id={name}
          className={cn(
            "border-2 transition-colors w-full h-10",
            errors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          className="w-[150px] max-h-[200px] overflow-y-auto"
          position="popper"
          sideOffset={4}
        >
          {cities.map((city) => (
            <SelectItem 
              key={city} 
              value={city}
              className="py-1.5 px-2 text-sm text-center"
            >
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  )

  const PhoneField = ({
    name,
    label,
    error,
    defaultValue,
  }: {
    name: keyof FormData
    label: string
    error: any
    defaultValue: string
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id={name as string}
          type="tel"
          placeholder="5xxxxxxxx"
          className={cn(
            "border-2 transition-colors w-full h-10",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500"
          )}
          {...register(name)}
          defaultValue={defaultValue}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Sender Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#1a365d]">بيانات المرسل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="senderName"
              label="اسم المرسل"
              placeholder="أدخل اسم المرسل"
            />
            <PhoneField
              name="senderPhoneNumber"
              label="رقم الجوال"
              error={errors.senderPhoneNumber}
              defaultValue={formData.senderPhoneNumber}
            />
            <SelectField
              name="senderCity"
              label="المدينة"
              placeholder="اختر المدينة"
            />
            <InputField
              name="senderAddress"
              label="العنوان"
              placeholder="أدخل العنوان"
            />
          </div>
        </div>

        {/* Recipient Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#1a365d]">بيانات المستلم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="recipientName"
              label="اسم المستلم"
              placeholder="أدخل اسم المستلم"
            />
            <PhoneField
              name="recipientPhoneNumber"
              label="رقم الجوال"
              error={errors.recipientPhoneNumber}
              defaultValue={formData.recipientPhoneNumber}
            />
            <SelectField
              name="recipientCity"
              label="المدينة"
              placeholder="اختر المدينة"
            />
            <InputField
              name="recipientAddress"
              label="العنوان"
              placeholder="أدخل العنوان"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]"
          >
            التالي
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  )
} 