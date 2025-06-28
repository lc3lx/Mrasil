import { z } from "zod"

// Saudi phone number regex
const saudiPhoneRegex = /^(05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/

export const senderSchema = z.object({
  senderName: z.string()
    .min(4, "يجب أن يكون الاسم 4 أحرف على الأقل")
    .max(50, "يجب أن لا يتجاوز الاسم 50 حرف")
    .regex(/^[\u0600-\u06FF\s]+$/, "يجب أن يحتوي الاسم على أحرف عربية فقط"),
  senderPhone: z.string()
    .regex(saudiPhoneRegex, "يجب أن يكون رقم الجوال سعودي صحيح")
    .min(10, "يجب أن يكون رقم الجوال 10 أرقام")
    .max(10, "يجب أن يكون رقم الجوال 10 أرقام"),
  senderCity: z.string().min(1, "يجب اختيار المدينة"),
  senderAddress: z.string().min(5, "يجب إدخال عنوان صحيح"),
})

export const recipientSchema = z.object({
  recipientName: z.string()
    .min(4, "يجب أن يكون الاسم 4 أحرف على الأقل")
    .max(50, "يجب أن لا يتجاوز الاسم 50 حرف")
    .regex(/^[\u0600-\u06FF\s]+$/, "يجب أن يحتوي الاسم على أحرف عربية فقط"),
  recipientPhone: z.string()
    .regex(saudiPhoneRegex, "يجب أن يكون رقم الجوال سعودي صحيح")
    .min(10, "يجب أن يكون رقم الجوال 10 أرقام")
    .max(10, "يجب أن يكون رقم الجوال 10 أرقام"),
  recipientCity: z.string().min(1, "يجب اختيار المدينة"),
  recipientAddress: z.string().min(5, "يجب إدخال عنوان صحيح"),
})

export type SenderFormData = z.infer<typeof senderSchema>
export type RecipientFormData = z.infer<typeof recipientSchema> 