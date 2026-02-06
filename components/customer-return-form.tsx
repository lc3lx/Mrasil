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

  const [returnType, setReturnType] = useState("product")
  const [formStep, setFormStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
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
      if (!phone?.trim() && !email?.trim()) {
        setSearchError("يرجى إدخال رقم الهاتف أو البريد الإلكتروني")
        return
      }
      setSearchError("")
      setLoading(true)
      try {
        const params = new URLSearchParams({ token: merchantToken! })
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
          setSearchError("لم يتم العثور على شحنات لهذا الرقم. تحقق من رقم الهاتف أو البريد الإلكتروني.")
        } else {
          setSelectedShipmentId(null)
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
      setFormStep(2)
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
      const requestNote =
        returnType === "product"
          ? [reason, description].filter(Boolean).join(" | ")
          : [waybillReason, waybillDetails].filter(Boolean).join(" | ")
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

    const submitData =
      returnType === "product"
        ? {
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
        : {
            orderNumber,
            email,
            phone,
            waybillNumber,
            waybillReason,
            waybillDetails,
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
      {/* خطوات العملية */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className={`flex items-center gap-2 ${formStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${formStep >= 1 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
          >
            1
          </div>
          <span className="hidden sm:block text-sm font-medium">بيانات الطلب</span>
        </div>
        <div className="flex-1 mx-2 border-t-2 border-dashed"></div>
        <div className={`flex items-center gap-2 ${formStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${formStep >= 2 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
          >
            2
          </div>
          <span className="hidden sm:block text-sm font-medium">اختيار المنتجات</span>
        </div>
        <div className="flex-1 mx-2 border-t-2 border-dashed"></div>
        <div className={`flex items-center gap-2 ${formStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${formStep >= 3 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
          >
            3
          </div>
          <span className="hidden sm:block text-sm font-medium">{t.stepDetails}</span>
        </div>
      </div>

      {formStep === 1 && (
        <div className="v7-neu-card p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-4">نوع {t.typeFull}</h3>
          <p className="text-gray-600 mb-6">يرجى اختيار نوع {t.typeFull} الذي ترغب به</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                returnType === "product" ? "border-blue-300 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setReturnType("product")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    returnType === "product" ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  {returnType === "product" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                </div>
                <h4 className="font-medium">{t.products}</h4>
              </div>
              <p className="text-sm text-gray-600 pr-8">اختر هذا الخيار إذا كنت ترغب في {t.type === "إرجاع" ? "إرجاع" : "استبدال"} منتج أو أكثر من طلبك</p>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                returnType === "waybill" ? "border-blue-300 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => setReturnType("waybill")}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    returnType === "waybill" ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  {returnType === "waybill" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                </div>
                <h4 className="font-medium">{t.waybill}</h4>
              </div>
              <p className="text-sm text-gray-600 pr-8">
                اختر هذا الخيار إذا كنت ترغب في {t.type === "إرجاع" ? "إرجاع" : "استبدال"} بوليصة الشحن فقط (مثل تصحيح العنوان أو معلومات المستلم)
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* الخطوة 1: بيانات الطلب */}
        {formStep === 1 && (
          <div className="v7-neu-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">بيانات الطلب</h3>
            <p className="text-gray-600 mb-6">
              {usePublicApi
                ? `أدخل رقم هاتفك أو بريدك الإلكتروني للبحث عن شحناتك واستكمال عملية ${t.typeFull}`
                : `يرجى إدخال بيانات الطلب الأصلي لاستكمال عملية ${t.typeFull}`}
            </p>

            <div className="grid gap-4">
              {usePublicApi && (
                <>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      رقم الهاتف
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
                      البريد الإلكتروني (اختياري)
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
                      disabled={(!phone?.trim() && !email?.trim()) || loading}
                      className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "جاري البحث..." : "بحث عن شحناتي"}
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
                      <div className="font-medium">{s.receiver?.name || "—"} · {s.awb || s._id}</div>
                      <div className="text-sm text-gray-500">{s.receiver?.phone || s.receiver?.email || ""}</div>
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

        {/* الخطوة 2: اختيار المنتجات (وضع المعاينة فقط) */}
        {formStep === 2 && returnType === "product" && !usePublicApi && (
          <>
            <div className="v7-neu-card p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold mb-4">{t.selectProducts}</h3>
              <p className="text-gray-600 mb-6">{t.selectProductsDesc}</p>

              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-3 flex items-center gap-4 transition-colors ${
                      product.selected ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={product.selected}
                        onChange={() => toggleProductSelection(product.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.price.toLocaleString()} ر.س</div>
                    </div>
                    <div>
                      <select
                        disabled={!product.selected}
                        className="w-20 v7-neu-input rounded-md border border-gray-300 p-2"
                        value={product.returnQuantity.toString()}
                        onChange={(e) => updateProductReturnQuantity(product.id, Number.parseInt(e.target.value))}
                      >
                        {Array.from({ length: product.quantity }, (_, i) => (
                          <option key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {selectedProductsCount > 0 && (
                <div className="mt-4 p-3 border border-blue-200 bg-blue-50/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{t.totalRefund}:</div>
                    <div className="font-bold text-lg">{totalRefundAmount.toLocaleString()} ر.س</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button 
                  type="button" 
                  onClick={() => setFormStep(1)} 
                  className="v7-neu-button-flat px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={() => setFormStep(3)}
                  disabled={selectedProductsCount === 0}
                  className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  متابعة
                </button>
              </div>
            </div>
          </>
        )}

        {formStep === 2 && returnType === "waybill" && !usePublicApi && (
          <div className="v7-neu-card p-6 rounded-xl mb-6">
            <h3 className="text-lg font-semibold mb-4">{t.waybillDetails}</h3>
            <p className="text-gray-600 mb-6">يرجى تقديم معلومات عن بوليصة الشحن التي ترغب في {t.type === "إرجاع" ? "إرجاعها" : "استبدالها"}</p>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label htmlFor="waybillNumber" className="block text-sm font-medium mb-1">
                  رقم بوليصة الشحن
                </label>
                <input
                  type="text"
                  id="waybillNumber"
                  placeholder="مثال: SHP-123456"
                  className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                  value={waybillNumber}
                  onChange={(e) => setWaybillNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="waybillReason" className="block text-sm font-medium mb-1">
                  {t.waybillReason}
                </label>
                <select
                  id="waybillReason"
                  className="w-full v7-neu-input rounded-md border border-gray-300 p-2"
                  value={waybillReason}
                  onChange={(e) => setWaybillReason(e.target.value)}
                >
                  <option value="" disabled>
                    اختر {t.reason}
                  </option>
                  <option value="wrong_address">عنوان خاطئ</option>
                  <option value="wrong_recipient">معلومات المستلم غير صحيحة</option>
                  <option value="shipping_error">خطأ في معلومات الشحن</option>
                  <option value="duplicate">بوليصة مكررة</option>
                  <option value="other">سبب آخر</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="waybillDetails" className="block text-sm font-medium mb-1">
                  تفاصيل إضافية
                </label>
                <textarea
                  id="waybillDetails"
                  placeholder={`يرجى شرح سبب ${t.type === "إرجاع" ? "إرجاع" : "استبدال"} البوليصة بالتفصيل...`}
                  className="v7-neu-input w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                  value={waybillDetails}
                  onChange={(e) => setWaybillDetails(e.target.value)}
                />
              </div>

              <div className="flex justify-between mt-6">
                <button 
                  type="button" 
                  onClick={() => setFormStep(1)} 
                  className="v7-neu-button-flat px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  رجوع
                </button>
                <button
                  type="button"
                  onClick={() => setFormStep(3)}
                  disabled={!waybillNumber || !waybillReason}
                  className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  متابعة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* الخطوة 3: تفاصيل الإرجاع */}
        {formStep === 3 && (
          <div className="v7-neu-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">
              {returnType === "product" ? t.details : t.waybillDetails}
            </h3>
            <p className="text-gray-600 mb-6">
              {returnType === "product"
                ? `يرجى تقديم معلومات إضافية عن سبب ${t.typeFull} وتفاصيل الاستلام`
                : `يرجى تقديم معلومات الاتصال لمتابعة طلب ${t.type === "إرجاع" ? "إرجاع" : "استبدال"} البوليصة`}
            </p>

            <div className="grid gap-4">
              {returnType === "product" ? (
                // محتوى الخطوة 3 الحالي للمنتجات
                <>
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-1">
                      {t.reason}
                    </label>
                    <select
                      id="reason"
                      className="w-full v7-neu-input rounded-md border border-gray-300 p-2"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <option value="" disabled>
                        اختر {t.reason}
                      </option>
                      {reasonOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      وصف المشكلة (اختياري)
                    </label>
                    <textarea
                      id="description"
                      placeholder={`يرجى وصف المشكلة أو سبب ${t.typeFull} بشكل مفصل...`}
                      className="v7-neu-input w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      {t.addressLabel}
                    </label>
                    <textarea
                      id="address"
                      placeholder={t.addressPlaceholder}
                      className="v7-neu-input w-full rounded-md border border-gray-300 p-2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  {/* ملخص الإرجاع */}
                  <div className="p-4 border rounded-lg bg-gray-50/50 my-2">
                    <h4 className="font-medium mb-2">{t.summaryTitle}</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">عدد المنتجات:</span>
                        <span className="font-medium">{selectedProductsCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">المبلغ المسترد:</span>
                        <span className="font-medium">{totalRefundAmount.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // محتوى جديد لإرجاع البوليصة
                <>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      البريد الإلكتروني
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

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      رقم الهاتف
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

                  {/* ملخص إرجاع البوليصة */}
                  <div className="p-4 border rounded-lg bg-blue-50/50 my-2">
                    <h4 className="font-medium mb-2">{t.waybillSummary}</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">رقم البوليصة:</span>
                        <span className="font-medium">{waybillNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t.reason}:</span>
                        <span className="font-medium">
                          {waybillReason === "wrong_address"
                            ? "عنوان خاطئ"
                            : waybillReason === "wrong_recipient"
                              ? "معلومات المستلم غير صحيحة"
                              : waybillReason === "shipping_error"
                                ? "خطأ في معلومات الشحن"
                                : waybillReason === "duplicate"
                                  ? "بوليصة مكررة"
                                  : "سبب آخر"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-6">
                <button 
                  type="button" 
                  onClick={() => setFormStep(2)} 
                  className="v7-neu-button-flat px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  رجوع
                </button>
                <button 
                  type="submit" 
                  className="v7-neu-button-active px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors" 
                  disabled={loading}
                >
                  {loading
                    ? "جاري التقديم..."
                    : (pageConfig?.buttonText ?? (returnType === "product" ? t.submitProduct : t.submitWaybill))}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
