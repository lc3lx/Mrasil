"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CustomerReturnForm } from "@/components/customer-return-form"
import { Info, CheckCircle } from 'lucide-react'
import { getImageUrl } from "@/lib/constants"

const DEFAULT_PRIMARY = "#294D8B"

type PageConfig = {
  primaryColor?: string
  logoUrl?: string
  headerText?: string
  subheaderText?: string
  textColor?: string
  secondaryColor?: string
} | null

export default function CustomerReplacement() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const themeParam = searchParams.get("theme")
  const isPreview = searchParams.get("preview") === "true"
  const [pageConfig, setPageConfig] = useState<PageConfig>(null)
  const theme = pageConfig?.primaryColor || themeParam || DEFAULT_PRIMARY

  useEffect(() => {
    if (!token?.trim()) return
    fetch(`/api/public/replacements/page-config?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((res) => res.success && res.data && setPageConfig(res.data))
      .catch(() => {})
  }, [token])

  return (
    <div className="bg-gray-50 min-h-screen rtl" dir="rtl" style={{ color: pageConfig?.textColor }}>
      <header className="bg-white shadow-sm" style={{ borderBottomColor: theme }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {pageConfig?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getImageUrl(pageConfig.logoUrl) || pageConfig.logoUrl} alt="" width={40} height={40} className="object-contain rounded-full w-10 h-10" />
            ) : (
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white text-lg font-bold"
                style={{ background: `linear-gradient(135deg, ${theme}, ${theme}dd)` }}
              >
                M
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-800">{pageConfig?.headerText || "صفحة استبدال المنتجات"}</h1>
          </div>
          <Link href="/" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: theme }}>
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: theme }}>{pageConfig?.headerText || "نظام استبدال المنتجات والبوالص"}</h2>
            <p className="text-gray-600">{pageConfig?.subheaderText || "قم بتعبئة النموذج التالي لطلب استبدال المنتجات أو بوليصة الشحن"}</p>
            {isPreview && (
              <p className="text-sm text-amber-600 mt-2">وضع المعاينة — لن يتم إرسال الطلبات فعلياً بدون رمز التاجر (token)</p>
            )}
          </div>

          <CustomerReturnForm mode="replacement" merchantToken={token} />

          <div className="mt-8 v7-neu-card p-4 rounded-xl bg-blue-50/30">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <span className="text-blue-600">
                <Info className="w-5 h-5" />
              </span>
              هل تحتاج للمساعدة؟
            </h3>
            <p className="text-sm text-gray-600">
              إذا كنت تواجه أي مشكلة في عملية الاستبدال، يرجى التواصل مع فريق خدمة العملاء على الرقم
              <a href="tel:920001234" className="text-blue-600 mx-1 font-medium">
                920001234
              </a>
              أو عبر البريد الإلكتروني
              <a href="mailto:support@shipline.com" className="text-blue-600 mx-1 font-medium">
                support@shipline.com
              </a>
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="v7-neu-card p-5 rounded-xl bg-blue-50/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-lg">
                <span className="text-blue-600">
                  <Info className="w-5 h-5" />
                </span>
                دليل استبدال المنتجات
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p className="font-medium text-gray-700">شروط استبدال المنتجات:</p>
                <ul className="list-disc list-inside space-y-1 pr-4">
                  <li>يجب أن يكون المنتج في حالته الأصلية وبدون استخدام</li>
                  <li>يجب الاحتفاظ بجميع الملصقات والعلامات الأصلية</li>
                  <li>يجب إرفاق فاتورة الشراء أو إثبات الشراء</li>
                  <li>يجب تقديم طلب الاستبدال خلال 14 يوم من تاريخ الاستلام</li>
                  <li>لا يمكن استبدال المنتجات المخصصة أو المصنوعة حسب الطلب</li>
                </ul>

                <p className="font-medium text-gray-700 mt-4">خطوات استبدال المنتج:</p>
                <ol className="list-decimal list-inside space-y-1 pr-4">
                  <li>تعبئة نموذج طلب الاستبدال</li>
                  <li>انتظار الموافقة على طلب الاستبدال</li>
                  <li>تغليف المنتج بشكل آمن مع إرفاق ملصق الاستبدال</li>
                  <li>إرسال المنتج عبر إحدى طرق الاستبدال المتاحة</li>
                  <li>استلام تأكيد استلام المنتج المستبدَل</li>
                  <li>استلام المنتج البديل حسب الاختيار</li>
                </ol>
              </div>
            </div>

            <div className="v7-neu-card p-5 rounded-xl bg-green-50/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-lg">
                <span className="text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </span>
                الأسئلة الشائعة
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">كم تستغرق عملية الاستبدال؟</p>
                  <p className="text-sm text-gray-600">
                    تستغرق عملية الاستبدال عادة من 5-7 أيام عمل من تاريخ استلام المنتج المستبدَل.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">هل هناك رسوم على استبدال المنتجات؟</p>
                  <p className="text-sm text-gray-600">
                    لا توجد رسوم على استبدال المنتجات في حالة وجود عيب مصنعي أو خطأ في الشحن. في الحالات الأخرى، قد تطبق
                    رسوم شحن الاستبدال.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">كيف يمكنني تتبع حالة طلب الاستبدال؟</p>
                  <p className="text-sm text-gray-600">
                    يمكنك تتبع حالة طلب الاستبدال من خلال رقم طلب الاستبدال الذي سيتم إرساله إليك بعد تقديم الطلب.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">هل يمكنني استبدال جزء من الطلب فقط؟</p>
                  <p className="text-sm text-gray-600">نعم، يمكنك اختيار المنتجات التي ترغب في استبدالها من الطلب.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 شيب لاين. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  )
}
