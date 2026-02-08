/**
 * استخراج رسالة خطأ واضحة للمستخدم من استجابة الـ API (تسجيل الدخول / التسجيل).
 * يدعم شكل RTK Query وأشكال الباكند الشائعة.
 */
export function getAuthErrorMessage(error: unknown, context: "login" | "signup" = "login"): string {
  const fallbackLogin = "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.";
  const fallbackSignup = "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.";

  if (error == null) return context === "login" ? fallbackLogin : fallbackSignup;

  const err = error as {
    status?: number;
    data?: {
      message?: string;
      status?: string;
      errors?: Record<string, string[]>;
    };
    message?: string;
  };

  const rawMessage =
    typeof err.data?.message === "string"
      ? err.data.message.trim()
      : err.message && typeof err.message === "string"
        ? err.message.trim()
        : "";

  // رسائل الباكند الشائعة → توضيح للمستخدم (الأكثر تحديداً أولاً)
  const friendly: Record<string, string> = {
    // رقم الهاتف مستخدم من قبل
    "phone_1 dup key": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "phone_1": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "رقم الهاتف مستخدم": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "رقم الهاتف مسجل": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "phone is unique": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "هذا الرقم مستخدم": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    // البريد الإلكتروني مكرر
    "E11000 duplicate key error": "البريد الإلكتروني مسجل مسبقاً. استخدم بريداً آخر أو سجّل الدخول.",
    "duplicate key error": "البريد الإلكتروني مسجل مسبقاً. استخدم بريداً آخر أو سجّل الدخول.",
    "invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "Invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "incorrect email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "email is unique": "البريد الإلكتروني مسجل مسبقاً. استخدم بريداً آخر.",
    "unauthorized": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "غير مصرح": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "network": "تعذر الاتصال بالخادم. تحقق من الاتصال بالإنترنت.",
    "Failed to fetch": "تعذر الاتصال بالخادم. تحقق من الاتصال بالإنترنت.",
    "Network Error": "تعذر الاتصال بالخادم. تحقق من الاتصال بالإنترنت.",
  };

  const lower = rawMessage.toLowerCase();
  for (const [key, msg] of Object.entries(friendly)) {
    if (lower.includes(key.toLowerCase())) return msg;
  }

  // أخطاء التحقق (validation) من الباكند
  const errors = err.data?.errors;
  if (errors && typeof errors === "object") {
    const list = Object.entries(errors)
      .flatMap(([, messages]) => (Array.isArray(messages) ? messages : [String(messages)]))
      .filter(Boolean)
      .map((m) => String(m).trim());
    if (list.length > 0) return list.join(" ");
  }

  if (rawMessage.length > 0) return rawMessage;

  // حسب رمز الحالة
  const status = err.status ?? (err.data as { status?: number })?.status;
  if (status != null) {
    if (status === 401) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    if (status === 403) return "ليس لديك صلاحية الدخول.";
    if (status === 404) return "الخدمة غير متوفرة حالياً.";
    if (status >= 500) return "حدث خطأ في الخادم. يرجى المحاولة لاحقاً أو التواصل مع الدعم.";
  }

  return context === "login" ? fallbackLogin : fallbackSignup;
}
