"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Loader2, Minimize2, Maximize2, MessageSquare } from "lucide-react"
import { useTheme } from "next-themes"
import { TutorialImage } from "./v7-tutorial-image"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  image?: string // URL de la imagen para explicaciones visuales
  imageCaption?: string // Leyenda opcional للتعليق على الصورة
}

interface V7AIChatProps {
  isOpen: boolean
  onClose: () => void
}

export function V7AIChat({ isOpen, onClose }: V7AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "مرحباً انا مراسيل",
      role: "assistant",
      timestamp: new Date(),
      image: "https://placehold.co/600x400/e6f7ff/3498db?text=لوحة+التحكم+الرئيسية",
      imageCaption: "لوحة التحكم الرئيسية لمنصة شيب إكسبرس",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme || "light"
  const isDark = currentTheme === "dark"
  const [suggestions, setSuggestions] = useState<string[]>([
    "/مساعدة",
    "كيف أنشئ شحنة جديدة؟",
    "أرني تطبيق الجوال",
    "تقارير الأداء",
  ])

  // تمرير إلى آخر رسالة عند إضافة رسالة جديدة
  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom()
      setUnreadCount(0)
    }
  }, [messages, isMinimized])

  // زيادة عدد الرسائل غير المقروءة عند استلام رسالة جديدة وتصغير النافذة
  useEffect(() => {
    if (isMinimized && messages.length > 0 && messages[messages.length - 1].role === "assistant") {
      setUnreadCount((prev) => prev + 1)
    }
  }, [messages, isMinimized])

  // تحديث الاقتراحات بناءً على آخر رسالة
  useEffect(() => {
    if (messages.length > 0) {
      setSuggestions(generateSuggestions(messages))
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // محاكاة استجابة المساعد الذكي
    setTimeout(() => {
      const botResponse = getBotResponse(input)

      // التعامل مع الاستجابات التي تحتوي على نص وصورة
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: typeof botResponse === "string" ? botResponse : botResponse.text,
        role: "assistant",
        timestamp: new Date(),
        image: typeof botResponse === "object" ? botResponse.image : undefined,
        imageCaption: typeof botResponse === "object" ? botResponse.imageCaption : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  // وظيفة بسيطة لمحاكاة استجابات المساعد الذكي
  const getBotResponse = (userInput: string): string | { text: string; image?: string; imageCaption?: string } => {
    const input = userInput.toLowerCase().trim()

    // التعامل مع الأوامر المباشرة
    if (input.startsWith("/")) {
      const command = input.substring(1).split(" ")[0]

      switch (command) {
        case "مساعدة":
        case "help":
          return `يمكنك استخدام الأوامر التالية:
          /تتبع [رقم الشحنة] - لتتبع شحنة
          /سعر - لحساب تكلفة الشحن
          /فروع - لعرض قائمة الفروع
          /اتصال - للحصول على معلومات الاتصال
          /حالة - لمعرفة حالة الحساب
          /مساعدة - لعرض قائمة الأوامر`

        case "تتبع":
          const trackingNumber = input.substring(6).trim()
          if (trackingNumber) {
            return `جاري تتبع الشحنة رقم ${trackingNumber}... 
            
            حالة الشحنة: قيد التوصيل
            الموقع الحالي: مركز التوزيع - الرياض
            الوقت المتوقع للتسليم: اليوم، 4-6 مساءً
            
            لمزيد من التفاصيل، يمكنك زيارة صفحة التتبع.`
          } else {
            return "الرجاء إدخال رقم الشحنة بعد الأمر /تتبع"
          }

        case "سعر":
          return `لحساب سعر الشحن، أحتاج إلى بعض المعلومات:
          - الوزن التقريبي للشحنة
          - مدينة المرسل
          - مدينة المستلم
          - نوع الخدمة (عادي/سريع)
          
          يمكنك استخدام حاسبة الأسعار في صفحة إنشاء شحنة جديدة للحصول على تقدير دقيق.`

        case "فروع":
          return `فروع شيب إكسبرس:
          - الرياض: شارع العليا، مقابل برج المملكة
          - جدة: شارع التحلية، بجانب مول العرب
          - الدمام: شارع الملك فهد، حي الشاطئ
          - مكة: شارع إبراهيم الخليل، بالقرب من الحرم
          - المدينة: شارع سلطانة، المنطقة المركزية
          
          لمزيد من التفاصيل وساعات العمل، يرجى زيارة صفحة الفروع.`

        case "اتصال":
          return `يمكنك التواصل معنا عبر:
          - الهاتف: 920001234
          - البريد الإلكتروني: support@shipexpress.sa
          - واتساب: +966501234567
          - تويتر: @ShipExpressSA
          
          خدمة العملاء متاحة على مدار الساعة طوال أيام الأسبوع.`

        case "حالة":
          return `معلومات الحساب:
          - نوع الحساب: تاجر متميز
          - الرصيد الحالي: 1,250 ريال
          - الشحنات النشطة: 7
          - الشحنات المكتملة هذا الشهر: 23
          
          لمزيد من التفاصيل، يرجى زيارة صفحة الحساب.`

        default:
          return `الأمر "${command}" غير معروف. استخدم /مساعدة لعرض قائمة الأوامر المتاحة.`
      }
    }

    // التعامل مع الاستفسارات العامة
    if (input.includes("سعر") || input.includes("تكلفة") || input.includes("كم سعر") || input.includes("اسعار")) {
      return `تختلف أسعار الشحن حسب الوزن والوجهة والخدمة المختارة:
      
      - الشحن المحلي داخل المدينة: من 15 ريال
      - الشحن بين المدن الرئيسية: من 25 ريال
      - الشحن للمناطق النائية: من 40 ريال
      - الشحن الدولي: يبدأ من 70 ريال
      
      للحصول على سعر دقيق، يمكنك استخدام حاسبة الأسعار في صفحة إنشاء شحنة جديدة أو استخدام الأمر /سعر`
    }

    if (
      input.includes("وقت") ||
      input.includes("مدة") ||
      input.includes("متى") ||
      input.includes("يوصل") ||
      input.includes("توصيل")
    ) {
      return `مواعيد التوصيل المتوقعة:
      
      - الشحن داخل المدينة: 24 ساعة
      - الشحن بين المدن الرئيسية: 1-2 يوم عمل
      - الشحن للمناطق النائية: 2-4 أيام عمل
      - الشحن الدولي: 3-7 أيام عمل حسب الوجهة
      
      يمكنك تتبع شحنتك في أي وقت من خلال رقم التتبع أو استخدام الأمر /تتبع [رقم الشحنة]`
    }

    if (input.includes("تتبع") || input.includes("أين") || input.includes("شحنتي") || input.includes("شحنة")) {
      return `لتتبع شحنتك، يمكنك:
      
      1. استخدام الأمر /تتبع متبوعًا برقم الشحنة
      2. زيارة صفحة التتبع وإدخال رقم الشحنة
      3. فحص بريدك الإلكتروني للحصول على تحديثات تلقائية
      4. تفعيل الإشعارات في تطبيق الجوال
      
      هل تريد مساعدة في تتبع شحنة معينة؟ يمكنك كتابة /تتبع متبوعًا برقم الشحنة.`
    }

    if (input.includes("إلغاء") || input.includes("استرجاع") || input.includes("إرجاع") || input.includes("الغاء")) {
      return `سياسة الإلغاء والإرجاع:
      
      - يمكن إلغاء الشحنة مجانًا قبل استلامها من قبل مندوبنا
      - بعد الاستلام وقبل التوصيل: رسوم إلغاء 10 ريال
      - بعد بدء عملية التوصيل: لا يمكن الإلغاء
      
      لطلب إرجاع الشحنة:
      1. انتقل إلى صفحة "المرتجعات" في لوحة التحكم
      2. اختر الشحنة المراد إرجاعها
      3. حدد سبب الإرجاع
      4. اتبع التعليمات لطباعة ملصق الإرجاع
      
      هل تحتاج مساعدة في إلغاء أو إرجاع شحنة معينة؟`
    }

    if (input.includes("دفع") || input.includes("فاتورة") || input.includes("طرق الدفع") || input.includes("بطاقة")) {
      return `طرق الدفع المتاحة:
      
      - البطاقات الائتمانية (فيزا، ماستركارد)
      - مدى
      - آبل باي وجوجل باي
      - سداد
      - الدفع عند الاستلام (في مناطق محددة)
      - الدفع من الرصيد (للحسابات التجارية)
      
      لإدارة طرق الدفع الخاصة بك، يمكنك زيارة صفحة الإعدادات > طرق الدفع.
      
      هل تواجه مشكلة في الدفع؟ يمكنني مساعدتك!`
    }

    if (input.includes("فرع") || input.includes("فروع") || input.includes("مكتب") || input.includes("مكاتب")) {
      return `فروع شيب إكسبرس متاحة في المدن الرئيسية:
      
      - الرياض: 5 فروع
      - جدة: 3 فروع
      - الدمام: 2 فرع
      - مكة والمدينة: فرع في كل مدينة
      - أبها وتبوك والقصيم: فرع في كل مدينة
      
      للحصول على قائمة كاملة بالفروع وعناوينها، استخدم الأمر /فروع أو قم بزيارة صفحة "الفروع" في موقعنا.`
    }

    if (input.includes("حساب") || input.includes("تسجيل") || input.includes("اشتراك")) {
      return `أنواع الحسابات في شيب إكسبرس:
      
      - الحساب الأساسي: مجاني، مناسب للاستخدام الشخصي
      - حساب التاجر: للشركات الصغيرة والمتوسطة، يبدأ من 99 ريال شهريًا
      - الحساب المتميز: للشركات الكبيرة، يبدأ من 299 ريال شهريًا
      
      لإنشاء حساب جديد، انتقل إلى صفحة التسجيل واتبع الخطوات.
      لمعرفة تفاصيل حسابك الحالي، استخدم الأمر /حالة`
    }

    if (input.includes("خدمات") || input.includes("عروض") || input.includes("مميزات")) {
      return `خدمات شيب إكسبرس:
      
      - الشحن المحلي السريع (توصيل في نفس اليوم)
      - الشحن المحلي العادي (1-3 أيام)
      - الشحن الدولي (3-7 أيام)
      - خدمة التغليف الاحترافي
      - التأمين على الشحنات
      - خدمة التخزين المؤقت
      - خدمة الدفع عند الاستلام
      
      العروض الحالية:
      - خصم 15% على الشحنات الدولية حتى نهاية الشهر
      - اشحن 5 طرود واحصل على السادس مجانًا
      
      لمزيد من المعلومات، يرجى زيارة صفحة "الخدمات" في موقعنا.`
    }

    if (input.includes("مشكلة") || input.includes("شكوى") || input.includes("مساعدة") || input.includes("دعم")) {
      return `نأسف لسماع ذلك. يمكننا مساعدتك في حل المشكلة:
      
      1. لتقديم شكوى: انتقل إلى صفحة "الدعم" > "تقديم شكوى"
      2. للتواصل مع خدمة العملاء: استخدم الأمر /اتصال
      3. للإبلاغ عن مشكلة في شحنة: انتقل إلى صفحة "شحناتي" واختر الشحنة ثم "الإبلاغ عن مشكلة"
      
      فريق خدمة العملاء متاح على مدار الساعة لمساعدتك.
      
      هل يمكنك إخباري بمزيد من التفاصيل عن المشكلة التي تواجهها؟`
    }

    if (input.includes("شكرا") || input.includes("شكراً")) {
      return "العفو! سعيد بمساعدتك. هل هناك أي شيء آخر يمكنني مساعدتك به؟"
    }

    if (input.includes("سلام") || input.includes("وداعا") || input.includes("باي")) {
      return "شكراً لتواصلك معنا! أتمنى لك يوماً سعيداً. يمكنك العودة في أي وقت إذا احتجت للمساعدة."
    }

    // إضافة شرح مصور لإنشاء شحنة جديدة
    if (input.includes("جديدة") || input.includes("إنشاء شحنة") || input.includes("طريقة الشحن")) {
      return {
        text: `لإنشاء شحنة جديدة، اتبع الخطوات التالية:
        
        1. انتقل إلى صفحة "إنشاء شحنة جديدة" من القائمة الجانبية
        2. قم بتعبئة بيانات المرسل والمستلم
        3. أدخل تفاصيل الشحنة (الأبعاد، الوزن، المحتويات)
        4. اختر خدمة الشحن المناسبة
        5. أكمل عملية الدفع
        
        انظر للصور التوضيحية المرفقة للمساعدة.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=إنشاء+شحنة+جديدة",
        imageCaption: "شاشة إنشاء شحنة جديدة",
      }
    }

    // إضافة شرح مصور لتتبع الشحنات
    if (input.includes("تتبع") && !input.startsWith("/")) {
      return {
        text: `لتتبع شحناتك، يمكنك:
        
        1. الانتقال إلى صفحة "تتبع الشحنات" من القائمة الجانبية
        2. إدخال رقم تتبع الشحنة في حقل البحث
        3. أو يمكنك تصفح جميع شحناتك النشطة والاطلاع على حالتها
        
        يمكنك أيضاً تفعيل الإشعارات لتلقي تحديثات فورية عن حالة شحناتك.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=تتبع+الشحنات",
        imageCaption: "صفحة تتبع الشحنات مع عرض مسار الشحنة",
      }
    }

    // إضافة شرح مصور للإعدادات
    if (input.includes("إعدادات") || input.includes("ضبط") || input.includes("تخصيص")) {
      return {
        text: `في صفحة الإعدادات، يمكنك:
        
        1. تحديث معلومات حسابك الشخصي
        2. إدارة طرق الدفع المحفوظة
        3. تخصيص تفضيلات الإشعارات
        4. إدارة العناوين المحفوظة
        5. تغيير إعدادات الأمان وكلمة المرور
        
        انظر للصورة التوضيحية المرفقة.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=صفحة+الإعدادات",
        imageCaption: "صفحة الإعدادات بخياراتها المتنوعة",
      }
    }

    // إضافة شرح مصور لنظام الفواتير
    if (input.includes("فاتورة") || input.includes("فواتير")) {
      return {
        text: `نظام الفواتير في شيب إكسبرس يتيح لك:
        
        1. الاطلاع على جميع فواتيرك السابقة
        2. تصفية الفواتير حسب التاريخ أو الحالة
        3. تنزيل الفواتير بصيغة PDF
        4. طباعة الفواتير مباشرة من المنصة
        5. إعداد الفواتير التلقائية للشحنات المتكررة
        
        يمكنك الوصول للفواتير من خلال قسم "المالية" في القائمة الجانبية.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=نظام+الفواتير",
        imageCaption: "نظام إدارة الفواتير في المنصة",
      }
    }

    // إضافة شرح مصور لطرق الدفع
    if (input.includes("طرق الدفع") || input.includes("بطاقة") || input.includes("دفع")) {
      return {
        text: `لإدارة طرق الدفع في شيب إكسبرس:
        
        1. انتقل إلى "الإعدادات" ثم اختر "طرق الدفع"
        2. يمكنك إضافة بطاقة ائتمانية جديدة بالنقر على "إضافة طريقة دفع"
        3. أدخل تفاصيل البطاقة في النموذج الآمن
        4. يمكنك تعيين طريقة دفع افتراضية
        5. لحذف بطاقة، انقر على رمز الحذف بجانب البطاقة المطلوب إزالتها
        
        جميع معلومات الدفع مشفرة ومحمية وفق أعلى معايير الأمان.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=طرق+الدفع",
        imageCaption: "إدارة طرق الدفع في المنصة",
      }
    }

    // إضافة شرح مصور للتقارير
    if (input.includes("تقارير") || input.includes("إحصائيات") || input.includes("أداء")) {
      return {
        text: `نظام التقارير في منصة شيب إكسبرس يوفر لك:
        
        1. إحصائيات مفصلة عن أداء شحناتك
        2. رسوم بيانية توضح توزيع الشحنات حسب المناطق
        3. تحليل لأوقات التوصيل ومعدلات الأداء
        4. مقارنات شهرية وسنوية للنشاط
        5. تقارير قابلة للتصدير بصيغ متعددة
        
        يمكنك تخصيص التقارير حسب الفترة الزمنية والمناطق الجغرافية.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=نظام+التقارير",
        imageCaption: "لوحة التقارير والإحصائيات",
      }
    }

    // Añadir explicación para informes de rendimiento
    if (input.includes("تقارير الأداء") || input.includes("أداء") || input.includes("تحليل")) {
      return {
        text: `تقارير الأداء في منصة شيب إكسبرس توفر لك رؤية شاملة لأداء شحناتك:
    
    1. لوحة معلومات تفاعلية تعرض مؤشرات الأداء الرئيسية
    2. تحليل زمني لمعدلات التوصيل وكفاءة الشحن
    3. مقارنة بين أداء الناقلين المختلفين
    4. تقارير مخصصة يمكن تصديرها بصيغ متعددة
    5. تنبيهات آلية عند انخفاض مستويات الأداء
    
    يمكنك الوصول إلى هذه التقارير من خلال قسم "التقارير" في القائمة الجانبية.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=تقارير+الأداء",
        imageCaption: "تقارير الأداء التفصيلية للشحنات",
      }
    }

    // Añadir explicación para إحصائيات الشحن
    if (input.includes("إحصائيات") || input.includes("تحليلات") || input.includes("بيانات")) {
      return {
        text: `إحصائيات الشحن في منصة شيب إكسبرس تقدم لك:
    
    1. رسوم بيانية توضح توزيع الشحنات حسب المناطق والمدن
    2. تحليل لأوقات الذروة وأنماط الشحن
    3. مؤشرات قياس معدلات النمو والتغير
    4. تصنيف العملاء والوجهات الأكثر نشاطاً
    5. تحليل التكاليف والإيرادات
    
    هذه الإحصائيات تساعدك على اتخاذ قرارات أفضل لتحسين عمليات الشحن الخاصة بك.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=إحصائيات+الشحن",
        imageCaption: "إحصائيات وتحليلات الشحن",
      }
    }

    // Añadir explicación para التطبيق الجوال
    if (input.includes("تطبيق") || input.includes("جوال") || input.includes("موبايل") || input.includes("هاتف")) {
      return {
        text: `تطبيق شيب إكسبرس للجوال يوفر لك جميع الميزات الأساسية في متناول يدك:
    
    1. إنشاء وتتبع الشحنات من أي مكان
    2. الحصول على إشعارات فورية عن حالة الشحنات
    3. مسح رموز QR للشحنات لتتبعها بسرعة
    4. إدارة العناوين وطرق الدفع
    5. التواصل مع خدمة العملاء مباشرة
    
    التطبيق متاح للتحميل على متجر آبل وجوجل بلاي.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=تطبيق+الجوال",
        imageCaption: "الشاشة الرئيسية لتطبيق شيب إكسبرس للجوال",
      }
    }

    // Añadir explicación para تتبع الشحنات في التطبيق
    if ((input.includes("تتبع") || input.includes("متابعة")) && (input.includes("تطبيق") || input.includes("جوال"))) {
      return {
        text: `لتتبع شحناتك من خلال تطبيق شيب إكسبرس للجوال:
    
    1. افتح التطبيق وسجل الدخول إلى حسابك
    2. اضغط على "تتبع الشحنات" من القائمة الرئيسية
    3. أدخل رقم التتبع أو اختر من قائمة شحناتك النشطة
    4. يمكنك مشاهدة مسار الشحنة على الخريطة في الوقت الفعلي
    5. اضغط على "تفاصيل" لمعرفة جميع مراحل الشحنة
    
    يمكنك أيضاً مسح رمز QR الخاص بالشحنة للوصول إلى معلوماتها بسرعة.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=تتبع+الشحنات+في+التطبيق",
        imageCaption: "تتبع الشحنات في تطبيق الجوال",
      }
    }

    // Añadir explicación para إشعارات التطبيق
    if (input.includes("إشعارات") && (input.includes("تطبيق") || input.includes("جوال"))) {
      return {
        text: `إشعارات تطبيق شيب إكسبرس تبقيك على اطلاع دائم بحالة شحناتك:
    
    1. إشعارات فورية عند تغير حالة الشحنة
    2. تنبيهات قبل موعد التسليم المتوقع
    3. إشعارات عند وصول المندوب
    4. تنبيهات للعروض والخصومات الخاصة
    5. إشعارات تذكيرية للشحنات المجدولة
    
    يمكنك تخصيص إعدادات الإشعارات من قائمة "الإعدادات" في التطبيق.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=إشعارات+التطبيق",
        imageCaption: "إشعارات التطبيق للبقاء على اطلاع بحالة الشحنات",
      }
    }

    // Añadir explicación para مسح رمز QR
    if (input.includes("مسح") || input.includes("qr") || input.includes("كيو آر") || input.includes("باركود")) {
      return {
        text: `ميزة مسح رمز QR في تطبيق شيب إكسبرس تسهل عليك تتبع الشحنات:
    
    1. افتح تطبيق شيب إكسبرس على جوالك
    2. اضغط على أيقونة الكاميرا أو "مسح QR" في الشاشة الرئيسية
    3. وجه كاميرا الجوال نحو رمز QR الموجود على ملصق الشحنة
    4. سيتم تحديد الشحنة تلقائياً وعرض تفاصيلها
    5. يمكنك أيضاً مشاركة رمز QR مع المستلم لتسهيل تتبع الشحنة
    
    هذه الميزة توفر الوقت وتجنب الأخطاء في إدخال أرقام التتبع يدوياً.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=مسح+رمز+QR",
        imageCaption: "مسح رمز QR لتتبع الشحنات بسهولة",
      }
    }

    // Añadir explicación para خدمة العملاء
    if (
      input.includes("خدمة العملاء") ||
      input.includes("دعم") ||
      input.includes("مساعدة") ||
      input.includes("تواصل")
    ) {
      return {
        text: `خدمة العملاء في شيب إكسبرس متاحة لمساعدتك عبر عدة قنوات:
    
    1. الدردشة المباشرة في الموقع والتطبيق (متاحة 24/7)
    2. مركز الاتصال: 920001234 (من 8 صباحاً حتى 10 مساءً)
    3. البريد الإلكتروني: support@shipexpress.sa
    4. نموذج التواصل في صفحة "اتصل بنا"
    5. حسابات التواصل الاجتماعي
    
    فريق خدمة العملاء مدرب للرد على استفساراتك وحل المشكلات بسرعة وكفاءة.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=خدمة+العملاء",
        imageCaption: "خيارات التواصل مع خدمة العملاء",
      }
    }

    // Añadir explicación para إدارة المرتجعات
    if (input.includes("مرتجعات") || input.includes("إرجاع") || input.includes("استرجاع")) {
      return {
        text: `نظام إدارة المرتجعات في شيب إكسبرس يسهل عليك عملية إرجاع الشحنات:
    
    1. انتقل إلى صفحة "المرتجعات" في لوحة التحكم
    2. اختر "طلب إرجاع جديد"
    3. حدد الشحنة المراد إرجاعها من قائمة شحناتك
    4. أدخل سبب الإرجاع والتفاصيل المطلوبة
    5. اطبع ملصق الإرجاع واستخدمه لإعادة الشحنة
    
    يمكنك متابعة حالة طلب الإرجاع وتتبع الشحنة المرتجعة بنفس طريقة تتبع الشحنات العادية.`,
        image: "https://placehold.co/600x400/e6f7ff/3498db?text=إدارة+المرتجعات",
        imageCaption: "نظام إدارة المرتجعات",
      }
    }

    // Modificar la parte final de getBotResponse para manejar objetos de respuesta con imágenes
    // استجابة افتراضية
    return {
      text: `شكراً لسؤالك. يمكنني مساعدتك في العديد من الأمور المتعلقة بالشحن والتوصيل، وتقديم شروحات مدعمة باللصور التوضيحية.
      
      يمكنك استخدام الأوامر التالية:
      /تتبع - لتتبع شحنة
      /سعر - لحساب تكلفة الشحن
      /فروع - لعرض قائمة الفروع
      /اتصال - للحصول على معلومات الاتصال
      /حالة - لمعرفة حالة الحساب
      /مساعدة - لعرض قائمة الأوامر
      
      أو يمكنك الاستفسار عن أي من هذه المواضيع لرؤية شروحات مدعمة بالصور:
      - إنشاء شحنة جديدة
      - تتبع الشحنات
      - الإعدادات والحساب
      - إدارة الفواتير
      - طرق الدفع
      - التقارير والإحصائيات
      - تطبيق الجوال وميزاته
      - خدمة العملاء
      - إدارة المرتجعات`,
      image: "https://placehold.co/600x400/e6f7ff/3498db?text=المواضيع+المتوفرة",
      imageCaption: "المواضيع المتوفرة للمساعدة المصورة",
    }
  }

  // دالة لإنشاء اقتراحات سريعة بناءً على سياق المحادثة
  const generateSuggestions = (messages: Message[]): string[] => {
    if (messages.length === 0) return []

    const lastMessage = messages[messages.length - 1]

    // إذا كانت آخر رسالة من المساعد، قم بإنشاء اقتراحات مناسبة
    if (lastMessage.role === "assistant") {
      const content = lastMessage.content.toLowerCase()

      if (content.includes("تتبع")) {
        return ["كيف أتتبع شحنتي؟", "/تتبع ABC123456", "أين فروعكم؟"]
      }

      if (content.includes("سعر") || content.includes("تكلفة")) {
        return ["كم تكلفة الشحن للرياض؟", "/سعر", "ما هي طرق الدفع؟"]
      }

      if (content.includes("إلغاء") || content.includes("إرجاع")) {
        return ["كيف ألغي شحنة؟", "سياسة الاسترجاع", "أريد إرجاع شحنة"]
      }

      if (content.includes("دفع") || content.includes("فاتورة")) {
        return ["طرق الدفع المتاحة", "كيف أضيف بطاقة جديدة؟", "الدفع عند الاستلام"]
      }

      if (content.includes("فرع") || content.includes("مكتب")) {
        return ["أقرب فرع لي", "ساعات عمل الفروع", "/فروع"]
      }

      if (content.includes("مشكلة") || content.includes("شكوى")) {
        return ["كيف أقدم شكوى؟", "تأخرت شحنتي", "شحنة تالفة"]
      }

      // Añadir después de las condiciones existentes y antes del return de las sugerencias por defecto:

      if (content.includes("تطبيق") || content.includes("جوال") || content.includes("موبايل")) {
        return ["كيف أتتبع شحنة في التطبيق؟", "إشعارات التطبيق", "مسح رمز QR"]
      }

      if (content.includes("تقارير") || content.includes("إحصائيات") || content.includes("أداء")) {
        return ["عرض تقارير الأداء", "تحليل البيانات", "إحصائيات الشحن"]
      }

      if (content.includes("مرتجعات") || content.includes("إرجاع")) {
        return ["كيف أرجع شحنة؟", "سياسة الإرجاع", "تتبع المرتجعات"]
      }

      if (content.includes("خدمة العملاء") || content.includes("دعم")) {
        return ["كيف أتواصل مع خدمة العملاء؟", "تقديم شكوى", "الأسئلة الشائعة"]
      }

      // اقتراحات افتراضية
      return ["/مساعدة", "كيف أنشئ شحنة جديدة؟", "ما هي خدماتكم؟", "أسعار الشحن"]
    }

    // إذا كانت آخر رسالة من المستخدم، عد قائمة فارغة
    return []
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMinimized) {
      setUnreadCount(0)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    if (suggestion.startsWith("/")) {
      // إذا كان الاقتراح أمرًا، قم بإرساله مباشرة
      setTimeout(() => handleSendMessage(), 100)
    }
  }

  if (!isOpen) return null

  // عرض النافذة المصغرة
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex items-center rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: isDark ? "#1e293b" : "#e6f7ff",
          boxShadow: isDark
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)"
            : "5px 5px 10px rgba(197, 204, 211, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.8), 0 0 10px rgba(52, 152, 219, 0.3)",
          border: isDark ? "2px solid rgba(59, 130, 246, 0.3)" : "2px solid rgba(52, 152, 219, 0.3)",
        }}
        onClick={toggleMinimize}
      >
        <div className="flex items-center gap-3 p-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              isDark ? "bg-[#3b82f6]" : "bg-[#3498db]"
            }`}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium text-base">مراسيل بوت</span>
          {unreadCount > 0 && (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount}
            </div>
          )}
          <Maximize2 className="w-5 h-5 text-gray-500" />
        </div>
      </div>
    )
  }

  // عرض النافذة الكاملة
  return (
    <div
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col rounded-2xl shadow-lg overflow-hidden"
      style={{
        width: "400px", // زيادة العرض
        maxWidth: "calc(100vw - 32px)",
        height: "550px", // زيادة الارتفاع
        maxHeight: "calc(100vh - 100px)",
        backgroundColor: isDark ? "#1e293b" : "#f0f4f8",
        boxShadow: isDark
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(59, 130, 246, 0.3)"
          : "8px 8px 16px rgba(197, 204, 211, 0.5), -8px -8px 16px rgba(255, 255, 255, 0.8), 0 0 15px rgba(52, 152, 219, 0.3)",
        border: isDark ? "2px solid rgba(59, 130, 246, 0.2)" : "2px solid rgba(52, 152, 219, 0.2)",
      }}
    >
      {/* رأس المحادثة */}
      <div
        className="flex items-center justify-between p-4 border-b v7-neu-header"
        style={{
          borderColor: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(52, 152, 219, 0.2)",
          backgroundColor: isDark ? "#0f172a" : "#f0f4f8",
          borderRadius: "1rem 1rem 0 0",
          boxShadow: isDark
            ? "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)"
            : "inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              isDark
                ? "bg-gradient-to-br from-[#3b82f6] to-[#1e40af] shadow-inner shadow-[#1e3a8a]"
                : "bg-gradient-to-br from-[#3498db] to-[#2980b9] v7-neu-button"
            }`}
          >
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className={`font-bold text-base ${isDark ? "text-white" : "text-[#294D8B]"}`}>مراسيل بوت</h3>
              <span className={`text-sm font-bold ${isDark ? "text-[#3b82f6]" : "text-[#3498db]"}`}>مراسيل</span>
            </div>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>متصل الآن</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMinimize}
            className={`rounded-full ${
              isDark
                ? "bg-[#1e263a] border border-[#2a3349] text-gray-300 hover:bg-[#252e45]"
                : "v7-neu-button-sm text-[#6d6a67] hover:text-[#3498db]"
            }`}
          >
            <Minimize2 className="w-5 h-5" />
            <span className="sr-only">تصغير</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={`rounded-full ${
              isDark
                ? "bg-[#1e263a] border border-[#2a3349] text-gray-300 hover:bg-[#252e45]"
                : "v7-neu-button-sm text-[#6d6a67] hover:text-[#3498db]"
            }`}
          >
            <X className="w-5 h-5" />
            <span className="sr-only">إغلاق</span>
          </Button>
        </div>
      </div>

      {/* محتوى المحادثة */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ backgroundColor: isDark ? "#1e293b" : "#f0f4f8" }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === "user"
                  ? isDark
                    ? "bg-[#3b82f6] text-white"
                    : "bg-[#3498db] text-white"
                  : isDark
                    ? "bg-[#334155] text-gray-100"
                    : "bg-white text-gray-800 border border-[#e6f7ff]"
              }`}
              style={{
                boxShadow:
                  message.role === "assistant"
                    ? isDark
                      ? "0 4px 8px rgba(0, 0, 0, 0.2)"
                      : "0 4px 8px rgba(0, 0, 0, 0.05)"
                    : "none",
              }}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-bold">مراسيل بوت</span>
                </div>
              )}
              <p className="text-base leading-relaxed whitespace-pre-line">{message.content}</p>

              {/* عرض الصورة إذا كانت متاحة */}
              {message.image && (
                <div className="mt-3">
                  <TutorialImage
                    src={message.image}
                    alt={message.imageCaption || "صورة توضيحية"}
                    caption={message.imageCaption}
                  />
                </div>
              )}

              <p className="text-xs opacity-70 mt-2 text-left">
                {new Intl.DateTimeFormat("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                isDark ? "bg-[#334155] text-gray-100" : "bg-white text-gray-800 border border-[#e6f7ff]"
              }`}
              style={{
                boxShadow: isDark ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "0 4px 8px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold">مراسيل بوت</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-base">جاري الكتابة...</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* اقتراحات سريعة */}
      <div className="px-4 py-2 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-full transition-all ${
                isDark
                  ? "bg-[#334155] text-white hover:bg-[#3b82f6]"
                  : "bg-[#e6f7ff] text-[#3498db] hover:bg-[#3498db] hover:text-white"
              } border ${isDark ? "border-[#475569]" : "border-[#bde0fe]"}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* مربع إدخال الرسائل */}
      <div
        className="p-4 border-t"
        style={{ borderColor: isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(52, 152, 219, 0.2)" }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className={`flex-1 rounded-full text-base py-6 ${
              isDark ? "bg-[#0f172a] border-[#334155]" : "bg-white border-gray-200"
            }`}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className={`rounded-full w-12 h-12 ${
              isDark ? "bg-[#3b82f6] hover:bg-[#2563eb]" : "bg-[#3498db] hover:bg-[#2980b9]"
            }`}
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">إرسال</span>
          </Button>
        </form>
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500 font-medium">
            مراسيل بوت يمكنه مساعدتك في تتبع الشحنات، معرفة الأسعار، وأكثر
          </p>
        </div>
      </div>
    </div>
  )
}
