"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CustomerReturnForm } from "@/components/customer-return-form"
import { Info, CheckCircle } from 'lucide-react'
import { getImageUrl, API_BASE_URL } from "@/lib/constants"

const DEFAULT_PRIMARY = "#294D8B"

export type PageConfig = {
  primaryColor?: string
  logoUrl?: string
  headerText?: string
  subheaderText?: string
  textColor?: string
  secondaryColor?: string
  buttonText?: string
  successMessage?: string
  showReturnFees?: boolean
  returnFeesAmount?: number
  returnFeesCurrency?: string
  returnPolicyText?: string
  showReturnPolicy?: boolean
  contactEmail?: string
  contactPhone?: string
  showContactInPage?: boolean
  returnReasons?: string[]
  returnAddresses?: { id: string; name: string; city?: string; district?: string; address?: string; phone?: string; email?: string }[]
} | null

export default function CustomerReturn() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const themeParam = searchParams.get("theme")
  const isPreview = searchParams.get("preview") === "true"
  const [pageConfig, setPageConfig] = useState<PageConfig>(null)
  const [logoSrcFailed, setLogoSrcFailed] = useState(false)
  const theme = pageConfig?.primaryColor || themeParam || DEFAULT_PRIMARY
  const showLogo = pageConfig?.logoUrl && !logoSrcFailed

  useEffect(() => {
    // معاينة بدون token: جلب إعدادات التاجر المسجّل من API مصادق
    if (isPreview && !token?.trim()) {
      const authToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!authToken) return
      fetch("/api/returns/preview-config", {
        headers: { Authorization: `Bearer ${authToken.replace(/^Bearer\s+/i, "").trim()}` },
        credentials: "include",
      })
        .then((r) => r.json())
        .then((res) => res.success && res.data && setPageConfig(res.data))
        .catch(() => {})
      return
    }
    // مع token (رابط العميل أو معاينة مع slug): جلب من الباكند مباشرة
    if (!token?.trim()) return
    const url = `${API_BASE_URL.replace(/\/$/, "")}/public/returns/page-config?token=${encodeURIComponent(token)}`
    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        if ((res.success || res.status === "success") && res.data) setPageConfig(res.data)
      })
      .catch(() => {})
  }, [token, isPreview])
  // إعادة تعيين فشل الشعار عند تغيير التكوين
  useEffect(() => {
    setLogoSrcFailed(false)
  }, [pageConfig?.logoUrl])

  return (
    <div className="bg-gray-50 min-h-screen rtl" dir="rtl" style={{ color: pageConfig?.textColor }}>
      <header className="bg-white shadow-sm" style={{ borderBottomColor: theme }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(pageConfig.logoUrl) || pageConfig.logoUrl}
                alt="شعار"
                width={64}
                height={64}
                className="object-contain rounded-lg w-16 h-16 bg-white min-w-[64px] min-h-[64px]"
                onError={() => setLogoSrcFailed(true)}
              />
            ) : (
              <div
                className="w-16 h-16 min-w-[64px] min-h-[64px] rounded-lg flex items-center justify-center text-white text-xl font-bold"
                style={{ background: `linear-gradient(135deg, ${theme}, ${theme}dd)` }}
              >
                M
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-800">{pageConfig?.headerText || "صفحة إرجاع المنتجات"}</h1>
          </div>
          <Link href="/" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: theme }}>
            العودة للرئيسية
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2" style={{ color: theme }}>{pageConfig?.headerText || "نظام إرجاع المنتجات والبوالص"}</h2>
            <p className="text-gray-600">{pageConfig?.subheaderText || "قم بتعبئة النموذج التالي لطلب إرجاع المنتجات أو بوليصة الشحن"}</p>
            {isPreview && (
              <p className="text-sm text-amber-600 mt-2">وضع المعاينة — لن يتم إرسال الطلبات فعلياً بدون رمز التاجر (token)</p>
            )}
          </div>

          <CustomerReturnForm merchantToken={token} pageConfig={pageConfig} returnReasons={pageConfig?.returnReasons} returnAddresses={pageConfig?.returnAddresses} />

          {pageConfig?.showContactInPage !== false && (pageConfig?.contactEmail || pageConfig?.contactPhone) && (
            <div className="mt-8 v7-neu-card p-4 rounded-xl bg-blue-50/30">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-blue-600">
                  <Info className="w-5 h-5" />
                </span>
                هل تحتاج للمساعدة؟
              </h3>
              <p className="text-sm text-gray-600">
                إذا كنت تواجه أي مشكلة في عملية الإرجاع، يرجى التواصل مع فريق خدمة العملاء
                {pageConfig.contactPhone && (
                  <>
                    {" على الرقم "}
                    <a href={`tel:${pageConfig.contactPhone.replace(/\s/g, "")}`} className="text-blue-600 mx-1 font-medium">
                      {pageConfig.contactPhone}
                    </a>
                  </>
                )}
                {pageConfig.contactEmail && (
                  <>
                    {pageConfig.contactPhone ? " أو عبر البريد الإلكتروني " : " عبر البريد الإلكتروني "}
                    <a href={`mailto:${pageConfig.contactEmail}`} className="text-blue-600 mx-1 font-medium">
                      {pageConfig.contactEmail}
                    </a>
                  </>
                )}
                .
              </p>
            </div>
          )}

          {pageConfig?.showReturnPolicy !== false && pageConfig?.returnPolicyText && (
            <div className="mt-8 v7-neu-card p-5 rounded-xl bg-blue-50/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-lg">
                <span className="text-blue-600">
                  <Info className="w-5 h-5" />
                </span>
                سياسة الإرجاع
              </h3>
              <div className="text-sm text-gray-600 whitespace-pre-wrap">{pageConfig.returnPolicyText}</div>
            </div>
          )}

          {pageConfig?.showReturnFees && (pageConfig?.returnFeesAmount ?? 0) > 0 && (
            <div className="mt-8 v7-neu-card p-4 rounded-xl bg-amber-50/50 border border-amber-200/50">
              <h3 className="font-medium mb-1 flex items-center gap-2 text-amber-800">
                <Info className="w-5 h-5" />
                رسوم الإرجاع
              </h3>
              <p className="text-sm text-amber-800">
                قد تُطبق رسوم إرجاع قدرها{" "}
                <span className="font-semibold">
                  {pageConfig.returnFeesAmount}{" "}
                  {pageConfig.returnFeesCurrency === "SAR" ? "ر.س" : pageConfig.returnFeesCurrency === "USD" ? "$" : pageConfig.returnFeesCurrency === "EUR" ? "€" : pageConfig.returnFeesCurrency || "ر.س"}
                </span>
                .
              </p>
            </div>
          )}

          <div className="mt-8 space-y-4">

            <div className="v7-neu-card p-5 rounded-xl bg-green-50/30">
              <h3 className="font-medium mb-3 flex items-center gap-2 text-lg">
                <span className="text-green-600">
                  <CheckCircle className="w-5 h-5" />
                </span>
                الأسئلة الشائعة
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700">كم تستغرق عملية الإرجاع؟</p>
                  <p className="text-sm text-gray-600">
                    تستغرق عملية الإرجاع عادة من 5-7 أيام عمل من تاريخ استلام المنتج المرتجع.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">هل هناك رسوم على إرجاع المنتجات؟</p>
                  <p className="text-sm text-gray-600">
                    لا توجد رسوم على إرجاع المنتجات في حالة وجود عيب مصنعي أو خطأ في الشحن. في الحالات الأخرى، قد تطبق
                    رسوم شحن الإرجاع.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">كيف يمكنني تتبع حالة طلب الإرجاع؟</p>
                  <p className="text-sm text-gray-600">
                    يمكنك تتبع حالة طلب الإرجاع من خلال رقم طلب الإرجاع الذي سيتم إرساله إليك بعد تقديم الطلب.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">هل يمكنني إرجاع جزء من الطلب فقط؟</p>
                  <p className="text-sm text-gray-600">نعم، يمكنك اختيار المنتجات التي ترغب في إرجاعها من الطلب.</p>
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
