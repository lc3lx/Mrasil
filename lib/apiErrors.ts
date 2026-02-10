const FALLBACK_LOGIN = "فشل تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة المرور.";
const FALLBACK_SIGNUP = "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.";
const BAD_STRING = "[object Object]";

/** استخراج نص من قيمة قد تكون string أو object (مثلاً { msg: "..." }) */
function toReadableString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object" && value !== null) {
    const o = value as Record<string, unknown>;
    if (typeof o.msg === "string") return o.msg.trim();
    if (typeof o.message === "string") return o.message.trim();
  }
  const s = String(value);
  return s === BAD_STRING ? "" : s;
}

/**
 * استخراج رسالة خطأ واضحة للمستخدم من استجابة الـ API (تسجيل الدخول / التسجيل).
 * يغطي: أخطاء الشبكة، التحقق (422)، تكرار البريد/الهاتف (409)، بيانات خاطئة (401/400)، حساب موقوف (403)، أخطاء الخادم (5xx).
 * يدعم شكل RTK Query وأشكال الباكند (message، errors[]).
 */
export function getAuthErrorMessage(error: unknown, context: "login" | "signup" = "login"): string {
  if (error == null) return context === "login" ? FALLBACK_LOGIN : FALLBACK_SIGNUP;

  const err = error as {
    status?: number;
    data?: {
      message?: unknown;
      status?: string;
      errors?: Record<string, unknown> | unknown[];
    };
    message?: string;
    error?: string;
  };

  const rawMessage = toReadableString(err.data?.message ?? err.message);
  const anyMessage = rawMessage || toReadableString(err.message) || toReadableString(err.error) || "";

  // ——— 1) أخطاء الشبكة (السبب: انقطاع اتصال، خادم غير متاح، أو انتهاء مهلة الطلب)
  const networkPatterns = [
    "failed to fetch",
    "network error",
    "network request failed",
    "econnrefused",
    "etimedout",
    "timeout",
    "load failed",
    "fetch failed",
  ];
  const lowerAny = anyMessage.toLowerCase();
  if (networkPatterns.some((p) => lowerAny.includes(p))) {
    return "تعذر الاتصال بالخادم. تحقق من الاتصال بالإنترنت أو جرّب لاحقاً.";
  }
  // RTK Query: status قد يكون "FETCH_ERROR" | "PARSING_ERROR" | "TIMEOUT_ERROR"
  const rtkStatus = (err as { status?: string }).status;
  if (typeof rtkStatus === "string" && (rtkStatus === "FETCH_ERROR" || rtkStatus === "TIMEOUT_ERROR")) {
    return "تعذر الاتصال بالخادم. تحقق من الاتصال بالإنترنت أو جرّب لاحقاً.";
  }

  // ——— 2) رسائل الباكند المحددة → توضيح موحد (السبب مذكور في التعليق)
  const friendly: Record<string, string> = {
    // تكرار: البريد أو الهاتف مسجل مسبقاً
    "phone_1 dup key": "رقم الهاتف مستخدم من قبل. السبب: القيمة مكررة في النظام. استخدم رقماً آخر أو سجّل الدخول.",
    "رقم الهاتف مستخدم": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "رقم الهاتف مسجل": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "phone is unique": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "هذا الرقم مستخدم": "رقم الهاتف مستخدم من قبل. استخدم رقماً آخر أو سجّل الدخول.",
    "E11000 duplicate key error": "البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً. السبب: تكرار في قاعدة البيانات. استخدم قيمة أخرى أو سجّل الدخول.",
    "duplicate key error": "البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً. استخدم بريداً أو رقماً آخر.",
    "email is unique": "البريد الإلكتروني مسجل مسبقاً. استخدم بريداً آخر أو سجّل الدخول.",
    "email addresss is exists": "البريد الإلكتروني مسجل مسبقاً. السبب: البريد مستخدم لحساب آخر. استخدم بريداً آخر أو سجّل الدخول.",
    "email address is already": "البريد الإلكتروني مسجل مسبقاً. استخدم بريداً آخر أو سجّل الدخول.",
    "البريد الإلكتروني مسجل مسبقاً": "البريد الإلكتروني مسجل مسبقاً. استخدم بريداً آخر أو سجّل الدخول.",
    // بيانات دخول خاطئة (401)
    "invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة. السبب: عدم تطابق البيانات مع السجلات.",
    "Invalid email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "incorrect email or password": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "unauthorized": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    "غير مصرح": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    // حساب موقوف (403)
    "account is not active": "حسابك غير نشط. السبب: تم إيقاف الحساب. يرجى التواصل مع الدعم لتفعيل الحساب.",
    "Your account is not active": "حسابك غير نشط. يرجى التواصل مع الدعم لتفعيل الحساب.",
    "حسابك غير نشط": "حسابك غير نشط. يرجى التواصل مع الدعم لتفعيل الحساب.",
    // تحقق من الحقول (400/422) — نعرض الرسالة كما هي إن كانت عربية
    "Password Confirmation inncorrect": "تأكيد كلمة المرور غير مطابق. السبب: حقل «تأكيد كلمة المرور» لا يطابق كلمة المرور.",
    "Password confirmation": "تأكيد كلمة المرور غير مطابق.",
    "تأكيد كلمة المرور غير مطابق": "تأكيد كلمة المرور غير مطابق. تأكد من مطابقة حقل التأكيد مع كلمة المرور.",
    "كلمة المرور يجب أن تحتوي": "كلمة المرور لا تستوفي الشروط. يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل و8 أحرف.",
    "password must be at least": "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم واحد على الأقل و8 أحرف.",
    "too short": "القيمة المدخلة قصيرة جداً. راجع الشروط المطلوبة.",
    "required": "يجب تعبئة جميع الحقول المطلوبة.",
    "البريد الإلكتروني وكلمة المرور مطلوبان": "البريد الإلكتروني وكلمة المرور مطلوبان. السبب: أحد الحقلين أو كليهما فارغ.",
  };

  const lower = rawMessage.toLowerCase();
  for (const [key, msg] of Object.entries(friendly)) {
    if (lower.includes(key.toLowerCase())) return msg;
  }

  // ——— 3) أخطاء التحقق (422) من express-validator: مصفوفة { msg, path }[] — نعرض رسائل الحقول مع توضيح السبب
  const errors = err.data?.errors;
  if (errors && typeof errors === "object") {
    const list: string[] = [];
    if (Array.isArray(errors)) {
      for (const item of errors) {
        const s = toReadableString(item);
        if (s && s !== BAD_STRING) list.push(s);
      }
    } else {
      for (const [, messages] of Object.entries(errors)) {
        const arr = Array.isArray(messages) ? messages : [messages];
        for (const m of arr) {
          const s = toReadableString(m);
          if (s && s !== BAD_STRING) list.push(s);
        }
      }
    }
    if (list.length > 0) return list.join(" ");
  }

  if (rawMessage.length > 0 && rawMessage !== BAD_STRING) return rawMessage;

  // ——— 4) حسب رمز الحالة HTTP عند عدم وجود رسالة نصية (السبب: ناتج من الباكند حسب الـ status)
  const status = err.status ?? (err.data as { status?: number })?.status;
  if (status != null) {
    if (status === 400) return "البيانات المدخلة غير صحيحة أو ناقصة. راجع الحقول وحاول مرة أخرى.";
    if (status === 401) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
    if (status === 403) return "ليس لديك صلاحية الدخول. قد يكون الحساب موقوفاً؛ تواصل مع الدعم.";
    if (status === 404) return "الخدمة غير متوفرة حالياً. جرّب لاحقاً أو تواصل مع الدعم.";
    if (status === 409) return context === "signup" ? "البريد الإلكتروني أو رقم الهاتف مسجل مسبقاً. استخدم قيمة أخرى أو سجّل الدخول." : "تعارض في البيانات. قد يكون الحساب مسجلاً مسبقاً.";
    if (status === 422) return "التحقق من البيانات فشل. راجع الحقول المطلوبة والصيغ (البريد، كلمة المرور، الأسماء).";
    if (status >= 500) return "حدث خطأ في الخادم. السبب: عطل مؤقت. يرجى المحاولة لاحقاً أو التواصل مع الدعم.";
  }

  return context === "login" ? FALLBACK_LOGIN : FALLBACK_SIGNUP;
}
