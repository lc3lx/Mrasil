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

// دالة التحقق من صحة الأبعاد بناءً على شركة الشحن
export const validateDimensions = (
  company: string,
  dimensions: { length: number; width: number; height: number },
  allowedBoxSizes?: Array<{ label: string; length: number; width: number; height: number }>,
  maxBoxDimensions?: { length: number; width: number; height: number }
): { valid: boolean; error?: string } => {
  const { length, width, height } = dimensions;

  // التحقق من أن الأبعاد موجودة
  if (!length || !width || !height) {
    return { valid: false, error: "جميع الأبعاد (الطول والعرض والارتفاع) مطلوبة" };
  }

  // Redbox - يجب أن تكون الأبعاد من الأحجام المسموحة
  if (company === "redbox") {
    if (!allowedBoxSizes || allowedBoxSizes.length === 0) {
      return { valid: false, error: "لم يتم تحديد أحجام الطرود المسموحة لـ Redbox" };
    }

    const volume = length * width * height;
    const isAllowed = allowedBoxSizes.some((box) => {
      const boxVolume = box.length * box.width * box.height;
      return volume <= boxVolume;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `حجم الطرد يتجاوز الحد الأقصى المسموح به لـ Redbox. الأحجام المسموحة: ${allowedBoxSizes.map((b) => `${b.label} (${b.length}×${b.width}×${b.height})`).join(", ")}`,
      };
    }
  }

  // Omniclama - يجب أن تكون الأبعاد من الأحجام المسموحة
  if (company === "omniclama") {
    if (!allowedBoxSizes || allowedBoxSizes.length === 0) {
      return { valid: false, error: "لم يتم تحديد أحجام الطرود المسموحة لـ Omniclama" };
    }

    const volume = length * width * height;
    const isAllowed = allowedBoxSizes.some((box) => {
      const boxVolume = box.length * box.width * box.height;
      return volume <= boxVolume;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `حجم الطرد يتجاوز الحد الأقصى المسموح به لـ Omniclama. الأحجام المسموحة: ${allowedBoxSizes.map((b) => `${b.label} (${b.length}×${b.width}×${b.height})`).join(", ")}`,
      };
    }
  }

  // SMSA - الحد الأقصى 50×50×40 سم
  if (company === "smsa") {
    const maxLength = maxBoxDimensions?.length || 50;
    const maxWidth = maxBoxDimensions?.width || 50;
    const maxHeight = maxBoxDimensions?.height || 40;

    if (length > maxLength || width > maxWidth || height > maxHeight) {
      return {
        valid: false,
        error: `أبعاد الطرد تتجاوز الحد الأقصى المسموح به لـ SMSA (${maxLength}×${maxWidth}×${maxHeight} سم)`,
      };
    }
  }

  // Aramex - الحد الأقصى 50×50×40 سم
  if (company === "aramex") {
    const maxLength = maxBoxDimensions?.length || 50;
    const maxWidth = maxBoxDimensions?.width || 50;
    const maxHeight = maxBoxDimensions?.height || 40;

    if (length > maxLength || width > maxWidth || height > maxHeight) {
      return {
        valid: false,
        error: `أبعاد الطرد تتجاوز الحد الأقصى المسموح به لـ Aramex (${maxLength}×${maxWidth}×${maxHeight} سم)`,
      };
    }
  }

  return { valid: true };
};
