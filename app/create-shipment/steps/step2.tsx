"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Step2Props {
  formData: {
    packageType: string
    packageWeight: string
    packageDimensions: string
    packageQuantity: string
    packageDescription: string
  }
  onNext: () => void
  onPrev: () => void
  onFormDataChange: (data: any) => void
}

const packageTypes = [
  "وثائق",
  "طرد صغير",
  "طرد متوسط",
  "طرد كبير",
  "طرد ثقيل",
]

const schema = yup.object({
  packageType: yup.string().required("نوع الطرد مطلوب"),
  packageWeight: yup
    .string()
    .required("الوزن مطلوب")
    .matches(/^[0-9]+(\.[0-9]{1,2})?$/, "الوزن غير صحيح")
    .test("is-positive", "الوزن يجب أن يكون أكبر من 0", value => parseFloat(value || "0") > 0),
  packageDimensions: yup
    .string()
    .required("الأبعاد مطلوبة")
    .test("is-valid-dimensions", "صيغة الأبعاد يجب أن تكون مثل 10x20x30 (كل القيم أكبر من 0)", value => {
      if (!value) return false;
      const dims = value.split('x').map(Number);
      return dims.length === 3 && dims.every(v => !isNaN(v) && v > 0);
    }),
  packageQuantity: yup
    .string()
    .required("الكمية مطلوبة")
    .matches(/^\d+$/, "الكمية غير صحيحة")
    .test("is-positive", "الكمية يجب أن تكون أكبر من 0", value => parseInt(value || "0", 10) > 0),
  packageDescription: yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
}).required()

type FormData = yup.InferType<typeof schema>

export function Step2({ formData, onNext, onPrev, onFormDataChange }: Step2Props) {
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
    // Parse packageDimensions (e.g., '10x20x30')
    let dimension = { high: 0, width: 0, length: 0 }
    const dims = data.packageDimensions.split('x').map(Number)
    if (dims.length === 3 && dims.every((v) => !isNaN(v))) {
      dimension = { high: dims[0], width: dims[1], length: dims[2] }
    }
    const weight = parseFloat(data.packageWeight)
    const Parcels = parseInt(data.packageQuantity, 10)
    onFormDataChange({
      ...data,
      weight,
      Parcels,
      dimension,
    })
    onNext()
  }

  const InputField = ({ 
    name, 
    label, 
    type = "text", 
    placeholder,
    required = true,
  }: { 
    name: keyof FormData
    label: string
    type?: string
    placeholder: string
    required?: boolean
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
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
          className="w-full max-h-[200px] overflow-y-auto"
          position="popper"
          sideOffset={4}
        >
          {packageTypes.map((type) => (
            <SelectItem 
              key={type} 
              value={type}
              className="py-1.5 px-2 text-sm"
            >
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && <p className="text-sm text-red-500">{errors[name]?.message}</p>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#1a365d]">بيانات الطرد</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              name="packageType"
              label="نوع الطرد"
              placeholder="اختر نوع الطرد"
            />
            <InputField
              name="packageWeight"
              label="الوزن (كجم)"
              placeholder="أدخل الوزن"
            />
            <InputField
              name="packageDimensions"
              label="الأبعاد (سم)"
              placeholder="مثال: 10x20x30"
            />
            <InputField
              name="packageQuantity"
              label="الكمية"
              placeholder="أدخل الكمية"
            />
            <div className="md:col-span-2">
              <InputField
                name="packageDescription"
                label="وصف الطرد"
                placeholder="أدخل وصف الطرد"
                required={false}
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            onClick={onPrev}
            variant="outline"
            className="border-2"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            السابق
          </Button>
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