"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, Check } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "سماعات بلوتوث لاسلكية",
    price: 299,
    image: "/diverse-headphones.png",
    quantity: 2,
  },
  {
    id: "2",
    name: "شاحن لاسلكي سريع",
    price: 150,
    image: "/electronic-charger-variety.png",
    quantity: 1,
  },
  {
    id: "3",
    name: "ساعة ذكية متطورة",
    price: 699,
    image: "/modern-smartwatch-display.png",
    quantity: 1,
  },
]

export interface ShipmentOption {
  _id: string;
  company?: string;
  receiver?: { name?: string; phone?: string; email?: string };
  awb?: string;
  [key: string]: unknown;
}

/** حقول المحتوى القادمة من تخصيص صفحة الإرجاع (الباكند) */
export interface ReturnPageContentConfig {
  buttonText?: string
  successMessage?: string
  showReturnFees?: boolean
  returnFeesAmount?: number
  returnFeesCurrency?: string
}

export interface ReturnAddressOption {
  id: string
  name: string
  city?: string
  district?: string
  address?: string
  phone?: string
  email?: string
}

interface CustomerReturnFormProps {
  mode?: "return" | "replacement"
  /** رمز التاجر من الرابط (token) - إن وُجد تُستخدم الـ API العامة */
  merchantToken?: string | null
  /** إعدادات المحتوى من صفحة التخصيص (صفحة العميل تجلبها من الباكند) */
  pageConfig?: ReturnPageContentConfig | null
  /** أسباب الإرجاع المتاحة (من تبويب الحقول) */
  returnReasons?: string[] | null
  /** عناوين الإرجاع المتاحة (من تبويب الحقول) */
  returnAddresses?: ReturnAddressOption[] | null
}

const RETURN_LABELS = {
  return: {
    type: "إرجاع",
    typeFull: "الإرجاع",
    products: "إرجاع منتجات",
    waybill: "إرجاع بوليصة الشحن",
    details: "تفاصيل الإرجاع",
    waybillDetails: "تفاصيل إرجاع البوليصة",
    successTitle: "تم تقديم طلب الإرجاع بنجاح!",
    successDesc: "لقد تم استلام طلب الإرجاع الخاص بك وسيتم مراجعته قريبًا. سيتم التواصل معك عبر البريد الإلكتروني بخصوص الخطوات التالية.",
    requestNumber: "رقم طلب الإرجاع",
    stepDetails: "تفاصيل الإرجاع",
    selectProducts: "اختر المنتجات للإرجاع",
    selectProductsDesc: "يرجى تحديد المنتجات التي ترغب بإرجاعها والكمية المطلوبة",
    totalRefund: "إجمالي المبلغ المسترد",
    addressLabel: "عنوان استلام المرتجع",
    addressPlaceholder: "العنوان التفصيلي لاستلام المنتجات المراد إرجاعها...",
    summaryTitle: "ملخص طلب الإرجاع",
    waybillSummary: "ملخص طلب إرجاع البوليصة",
    reason: "سبب الإرجاع",
    waybillReason: "سبب إرجاع البوليصة",
    submitProduct: "تقديم طلب الإرجاع",
    submitWaybill: "تقديم طلب إرجاع البوليصة",
  },
  replacement: {
    type: "استبدال",
    typeFull: "الاستبدال",
    products: "استبدال منتجات",
    waybill: "استبدال بوليصة الشحن",
    details: "تفاصيل الاستبدال",
    waybillDetails: "تفاصيل استبدال البوليصة",
    successTitle: "تم تقديم طلب الاستبدال بنجاح!",
    successDesc: "لقد تم استلام طلب الاستبدال الخاص بك وسيتم مراجعته قريبًا. سيتم التواصل معك عبر البريد الإلكتروني بخصوص الخطوات التالية.",
    requestNumber: "رقم طلب الاستبدال",
    stepDetails: "تفاصيل الاستبدال",
    selectProducts: "اختر المنتجات للاستبدال",
    selectProductsDesc: "يرجى تحديد المنتجات التي ترغب باستبدالها والكمية المطلوبة",
    totalRefund: "إجمالي قيمة الاستبدال",
    addressLabel: "عنوان استلام المنتج المستبدَل",
    addressPlaceholder: "العنوان التفصيلي لاستلام المنتجات المراد استبدالها...",
    summaryTitle: "ملخص طلب الاستبدال",
    waybillSummary: "ملخص طلب استبدال البوليصة",
    reason: "سبب الاستبدال",
    waybillReason: "سبب استبدال البوليصة",
    submitProduct: "تقديم طلب الاستبدال",
    submitWaybill: "تقديم طلب استبدال البوليصة",
  },
}

const DEFAULT_REASON_OPTIONS = ["منتج تالف", "غير مطابق للوصف", "الحجم غير مناسب", "اللون غير مناسب", "سبب آخر"]

export function CustomerReturnForm({ mode = "return", merchantToken, pageConfig, returnReasons, returnAddresses }: CustomerReturnFormProps) {
  const router = useRouter()
  const t = RETURN_LABELS[mode]
  const usePublicApi = Boolean(merchantToken?.trim())
  const successMsg = pageConfig?.successMessage ?? t.successDesc
  const reasonOptions = returnReasons && returnReasons.length > 0 ? returnReasons : DEFAULT_REASON_OPTIONS

  const [formStep, setFormStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [waybillInput, setWaybillInput] = useState("")
  const [products, setProducts] = useState(
    mockProducts.map((product) => ({
      ...product,
      selected: false,
      returnQuantity: 1,
    })),
  )
  const [isSuccess, setIsSuccess] = useState(false)
  const [successRequestNumber, setSuccessRequestNumber] = useState<string | null>(null)

  // شحنات من API (للصفحة العامة)
  const [shipments, setShipments] = useState<ShipmentOption[]>([])
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null)

  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [waybillNumber, setWaybillNumber] = useState("")
  const [waybillReason, setWaybillReason] = useState("")
  const [waybillDetails, setWaybillDetails] = useState("")

  // حساب إجمالي المنتجات المختارة
  const selectedProductsCount = products.filter((p) => p.selected).length
  const totalRefundAmount = products
    .filter((p) => p.selected)
    .reduce((sum, product) => sum + product.price * product.returnQuantity, 0)

  // تحديث حالة اختيار المنتج
  const toggleProductSelection = (productId: string) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, selected: !p.selected } : p)))
  }

  // تحديث كمية المنتج المراد إرجاعه
  const updateProductReturnQuantity = (productId: string, quantity: number) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, returnQuantity: quantity } : p)))
  }

  const onSearchOrder = async () => {
    if (usePublicApi) {
      if (!waybillInput?.trim() && !phone?.trim() && !email?.trim()) {
        setSearchError("يرجى إدخال رقم البوليصة أو رقم التتبع أو رقم الهاتف أو البريد الإلكتروني")
        return
      }
      setSearchError("")
      setLoading(true)
      try {
        const params = new URLSearchParams({ token: merchantToken! })
        if (waybillInput?.trim()) params.set("awb", waybillInput.trim())
        if (phone?.trim()) params.set("phone", phone.trim())
        if (email?.trim()) params.set("email", email.trim())
        const res = await fetch(`/api/public/returns/shipments?${params.toString()}`)
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setSearchError(data?.message || "فشل في جلب الشحنات")
          setLoading(false)
          return
        }
        const list = Array.isArray(data?.data) ? data.data : data?.shipments ?? []
        setShipments(list)
        if (list.length === 0) {
          setSearchError(data?.message || "لم يتم العثور على شحنات. تحقق من رقم البوليصة أو رقم التتبع أو رقم الهاتف أو البريد الإلكتروني.")
        } else {
          setSelectedShipmentId(list.length === 1 ? list[0]._id : null)
          setFormStep(2)
        }
      } catch {
        setSearchError("حدث خطأ أثناء البحث")
      }
      setLoading(false)
      return
    }

    if (!orderNumber) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setFormStep(3)
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (usePublicApi && merchantToken) {
      const shipmentId = selectedShipmentId
      if (!shipmentId) {
        setLoading(false)
        return
      }
      const requestNote = [reason, description].filter(Boolean).join(" | ") || "طلب من صفحة العميل"
      try {
        const res = await fetch("/api/public/returns/create-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: merchantToken,
            shipmentId,
            type: mode === "replacement" ? "exchange" : "return",
            requestNote: requestNote || "طلب من صفحة العميل",
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setSearchError(data?.message || "فشل في إرسال الطلب")
          setLoading(false)
          return
        }
        setSuccessRequestNumber(data?.data?.id || data?.returnRequestId || data?.requestNumber || "—")
        setIsSuccess(true)
      } catch {
        setSearchError("حدث خطأ أثناء إرسال الطلب")
      }
      setLoading(false)
      return
    }

    const submitData = {
      orderNumber,
      email,
      phone,
      reason,
      description,
      address,
      products: products
        .filter((p) => p.selected)
        .map((p) => ({ id: p.id, name: p.name, quantity: p.returnQuantity })),
    }
    console.log("تم تقديم طلب:", submitData)
    setTimeout(() => {
      setLoading(false)
      setSuccessRequestNumber("#RTN-874512")
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="v7-neu-card p-8 md:p-12 rounded-2xl text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t.successTitle}</h2>
        <p className="text-gray-600 mb-6">
          {successMsg}
        </p>
        <div className="v7-neu-card p-4 rounded-xl mb-6 bg-blue-50/50">
          <p className="font-medium text-lg mb-1">{t.requestNumber}: {successRequestNumber || "#—"}</p>
          <p className="text-sm text-gray-600">يرجى الاحتفاظ بهذا الرقم للمتابعة</p>
        </div>
        <button 
          onClick={() => router.push("/")} 
          className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* خطوات العملية (لصفحة العميل: بحث → اختيار شحنة → تقديم) */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className={`flex items-center gap-2 ${formStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${formStep >= 1 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
          >
            1
          </div>
          <span className="hidden sm:block text-sm font-medium">{usePublicApi ? "البحث عن الشحنة" : "بيانات الطلب"}</span>
        </div>
        <div className="flex-1 mx-2 border-t-2 border-dashed"></div>
        <div className={`flex items-center gap-2 ${formStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${formStep >= 2 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
          >
            2
          </div>
          <span className="hidden sm:block text-sm font-medium">اختيار الشحنة</span>
        </div>
        <div className="flex-1 mx-2 border-t-2 border-dashed"></div>
        <div className={`flex items-center gap-2 ${formStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${formStep >= 3 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
          >
            3
          </div>
          <span className="hidden sm:block text-sm font-medium">تقديم الطلب</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* الخطوة 1: رقم البوليصة أو الجوال أو الإيميل */}
        {formStep === 1 && (
          <div className="v7-neu-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">
              {usePublicApi ? "البحث عن الشحنة" : "بيانات الطلب"}
            </h3>
            <p className="text-gray-600 mb-6">
              {usePublicApi
                ? "أدخل رقم البوليصة أو رقم التتبع أو رقم هاتفك أو بريدك الإلكتروني للبحث عن شحنتك"
                : `يرجى إدخال بيانات الطلب الأصلي لاستكمال عملية ${t.typeFull}`}
            </p>

            <div className="grid gap-4">
              {usePublicApi && (
                <>
                  <div>
                    <label htmlFor="waybillInput" className="block text-sm font-medium mb-1">
                      رقم البوليصة أو رقم التتبع
                    </label>
                    <input
                      type="text"
                      id="waybillInput"
                      placeholder="رقم البوليصة أو رقم التتبع - مثال: SHP-123456"
                      className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                      value={waybillInput}
                      onChange={(e) => setWaybillInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      أو رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="05xxxxxxxx"
                      className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      أو البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@mail.com"
                      className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {searchError && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{searchError}</p>
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={onSearchOrder}
                      disabled={(!waybillInput?.trim() && !phone?.trim() && !email?.trim()) || loading}
                      className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "جاري البحث..." : "عرض الشحنات"}
                    </button>
                  </div>
                </>
              )}
              {!usePublicApi && (
                <>
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium mb-1">
                      رقم الطلب
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="orderNumber"
                        placeholder="ORD-123456"
                        className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={onSearchOrder}
                        disabled={!orderNumber || loading}
                        className="v7-neu-button px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        {loading ? "جاري البحث..." : <><Search className="w-4 h-4 ml-1 inline-block" /> بحث</>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                    <input type="email" id="email" placeholder="example@mail.com" className="v7-neu-input w-full rounded-md border border-gray-300 p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف</label>
                    <input type="tel" id="phone" placeholder="05xxxxxxxx" className="v7-neu-input w-full rounded-md border border-gray-300 p-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button type="button" onClick={onSearchOrder} disabled={!orderNumber || loading} className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                      {loading ? "جاري البحث..." : "متابعة"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* الخطوة 2: اختيار الشحنة (عند استخدام API العامة) */}
        {formStep === 2 && usePublicApi && shipments.length > 0 && (
          <div className="v7-neu-card p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">اختر الشحنة</h3>
            <p className="text-gray-600 mb-6">اختر الشحنة التي تريد تقديم طلب {t.typeFull} لها</p>
            <div className="space-y-3">
              {shipments.map((s) => (
                <div
                  key={s._id}
                  onClick={() => setSelectedShipmentId(s._id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedShipmentId === s._id ? "border-blue-300 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipmentId === s._id ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                      {selectedShipmentId === s._id && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="font-medium">{(s.receiver?.name ?? s.receiverAddress?.name) || "—"} · {s.awb || s.trackingId || s._id}</div>
                      <div className="text-sm text-gray-500">{(s.receiver?.phone ?? s.receiverAddress?.phone) || (s.receiver?.email ?? s.receiverAddress?.email) || ""}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={() => setFormStep(1)} className="v7-neu-button-flat px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
                رجوع
              </button>
              <button
                type="button"
                onClick={() => setFormStep(3)}
                disabled={!selectedShipmentId}
                className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                متابعة
              </button>
            </div>
          </div>
        )}

        {/* الخطوة 3: تقديم طلب الإرجاع */}
        {formStep === 3 && usePublicApi && (
          <div className="v7-neu-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">تقديم طلب الإرجاع</h3>
            <p className="text-gray-600 mb-6">مراجعة الشحنة المختارة وتقديم الطلب</p>
            <div className="grid gap-4">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-1">
                  سبب الإرجاع (اختياري)
                </label>
                <select
                  id="reason"
                  className="w-full v7-neu-input rounded-md border border-gray-300 p-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">— اختر السبب —</option>
                  {reasonOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="v7-neu-button-flat px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                >
                  رجوع
                </button>
                <button
                  type="submit"
                  className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "جاري التقديم..." : (pageConfig?.buttonText ?? t.submitWaybill)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* الخطوة 3: تفاصيل الإرجاع (وضع غير API عامة) */}
        {formStep === 3 && !usePublicApi && (
          <div className="v7-neu-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">{t.details}</h3>
            <p className="text-gray-600 mb-6">
              يرجى تقديم معلومات إضافية عن سبب {t.typeFull} وتفاصيل الاستلام
            </p>

            <div className="grid gap-4">
              <>
                <div>
                  <label htmlFor="reasonNonApi" className="block text-sm font-medium mb-1">
                    {t.reason}
                  </label>
                    <select
                      id="reasonNonApi"
                      className="w-full v7-neu-input rounded-md border border-gray-300 p-2"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <option value="" disabled>اختر {t.reason}</option>
                      {reasonOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">وصف المشكلة (اختياري)</label>
                  <textarea
                    id="description"
                    placeholder={`يرجى وصف المشكلة أو سبب ${t.typeFull} بشكل مفصل...`}
                    className="v7-neu-input w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">{t.addressLabel}</label>
                  <textarea
                    id="address"
                    placeholder={t.addressPlaceholder}
                    className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setFormStep(1)} className="v7-neu-button-flat px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">
                    رجوع
                  </button>
                  <button type="submit" className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                    {loading ? "جاري التقديم..." : (pageConfig?.buttonText ?? t.submitProduct)}
                  </button>
                </div>
              </>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
