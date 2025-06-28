"use client"

import { useState } from "react"
import { useForm, FormProvider, Controller, useFormContext } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Package, CheckCircle2, FileText, Trash2 } from "lucide-react"
import ResponseModal from "../components/ResponseModal"
import { useCreateShipmentMutation, useGetMyShipmentsQuery } from "../api/shipmentApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const cities = [
  "الرياض", "جدة", "مكة", "المدينة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "خميس مشيط", "الهفوف", "المبرز", "حفر الباطن", "حائل", "نجران", "الجبيل", "أبها", "ينبع", "عرعر", "عنيزة", "سكاكا", "جازان", "القطيف", "الباحة", "بيشة", "الرس",
]

const providerOptions = [
  { key: "redbox", label: "redbox", notes: "redbox يجب ادخال الأبعاد، الطول والعرض والإرتفاع" },
  { key: "smsa", label: "سمسا", notes: "سمسا لا تشحن إلى بعض المناطق" },
  { key: "thabit", label: "ثابت", notes: "ثابت لا تشحن الى محايل" },
  // ... add more as needed
]

const schema = yup.object({
  // Step 1
  shipper_full_name: yup.string().required("اسم المرسل مطلوب"),
  shipper_mobile: yup.string().required("رقم المرسل مطلوب"),
  shipper_city: yup.string().required("مدينة المرسل مطلوبة"),
  shipper_address: yup.string().required("عنوان المرسل مطلوب"),
  recipient_full_name: yup.string().required("اسم المستلم مطلوب"),
  recipient_mobile: yup.string().required("رقم المستلم مطلوب"),
  recipient_city: yup.string().required("مدينة المستلم مطلوبة"),
  recipient_address: yup.string().required("عنوان المستلم مطلوب"),
  // Step 2
  weight: yup.number().typeError("الوزن يجب أن يكون رقمًا").required("الوزن مطلوب").positive(),
  Parcels: yup.number().typeError("عدد الطرود يجب أن يكون رقمًا").required("عدد الطرود مطلوب").integer().positive(),
  dimension_high: yup.number().typeError("الارتفاع يجب أن يكون رقمًا").required("الارتفاع مطلوب").positive(),
  dimension_width: yup.number().typeError("العرض يجب أن يكون رقمًا").required("العرض مطلوب").positive(),
  dimension_length: yup.number().typeError("الطول يجب أن يكون رقمًا").required("الطول مطلوب").positive(),
  // Step 3
  order_id: yup.string().required("معرف الطلب مطلوب"),
  storeId: yup.string().required("معرف المتجر مطلوب"),
  platform: yup.string().required("المنصة مطلوبة"),
  orderId: yup.string().required("رقم الطلب مطلوب"),
  status: yup.string().required("الحالة مطلوبة"),
  total: yup.number().typeError("الإجمالي يجب أن يكون رقمًا").required("الإجمالي مطلوب"),
  paymentMethod: yup.string().required("طريقة الدفع مطلوبة"),
  customerAddress: yup.string().required("عنوان العميل مطلوب"),
  description: yup.string().required("وصف الطلب مطلوب"),
  source: yup.string().required("المصدر مطلوب"),
  direction: yup.string().required("الاتجاه مطلوب"),
  // Provider
  company: yup.string().required("الناقل مطلوب"),
  shipmentType: yup.string().required("نوع الشحن مطلوب"),
  orderDescription: yup.string().required("ملاحظات الناقل مطلوبة"),
}).required()

export function CreateShipmentSteps() {
  const [step, setStep] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<'success' | 'fail'>("success")
  const [modalMessage, setModalMessage] = useState("")
  const [selectedProvider, setSelectedProvider] = useState(providerOptions[0])
  const [shipmentType, setShipmentType] = useState("dry")
  const router = useRouter()

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // Step 1
      shipper_full_name: "",
      shipper_mobile: "",
      shipper_city: "",
      shipper_address: "",
      recipient_full_name: "",
      recipient_mobile: "",
      recipient_city: "",
      recipient_address: "",
      // Step 2
      weight: 0,
      Parcels: 0,
      dimension_high: 0,
      dimension_width: 0,
      dimension_length: 0,
      // Step 3
      order_id: "",
      storeId: "",
      platform: "",
      orderId: "",
      status: "",
      total: 0,
      paymentMethod: "",
      customerAddress: "",
      description: "",
      source: "",
      direction: "",
      // Provider
      company: providerOptions[0].label,
      shipmentType: shipmentType,
      orderDescription: providerOptions[0].notes,
    },
  })
  const { handleSubmit, setValue, getValues, formState: { errors } } = methods
  const [createShipment] = useCreateShipmentMutation()
  const { refetch: refetchShipments } = useGetMyShipmentsQuery()

  // Stepper navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  // Provider selection
  const handleProviderSelect = (provider: typeof providerOptions[0]) => {
    setSelectedProvider(provider)
    setValue("company", provider.label)
    setValue("orderDescription", provider.notes)
  }
  // Shipment type selection
  const handleShipmentTypeSelect = (type: string) => {
    setShipmentType(type)
    setValue("shipmentType", type)
  }

  // Final submit
  const onSubmit = async (data: any) => {
    try {
      const payload = {
        company: data.company,
        shipmentType: data.shipmentType.charAt(0).toUpperCase() + data.shipmentType.slice(1),
        orderDescription: data.orderDescription,
        order: {
          _id: data.order_id,
          storeId: data.storeId,
          platform: data.platform,
          orderId: data.orderId,
          status: data.status,
          total: Number(data.total),
          paymentMethod: data.paymentMethod,
          customerAddress: data.customerAddress,
          description: data.description,
          source: data.source,
          direction: data.direction,
          customer: {
            full_name: data.recipient_full_name,
            mobile: data.recipient_mobile,
            city: data.recipient_city,
            country: "sa",
            address: data.recipient_address,
          },
        },
        shipperAddress: {
          full_name: data.shipper_full_name,
          mobile: data.shipper_mobile,
          city: data.shipper_city,
          country: "sa",
          address: data.shipper_address,
        },
        weight: Number(data.weight),
        Parcels: Number(data.Parcels),
        dimension: {
          high: Number(data.dimension_high),
          width: Number(data.dimension_width),
          length: Number(data.dimension_length),
        },
      }
      await createShipment(payload).unwrap()
      setModalStatus("success")
      setModalMessage("تمت إضافة الشحنة بنجاح")
      setModalOpen(true)
      await refetchShipments()
      setTimeout(() => {
        router.push("/shipments")
      }, 1200)
    } catch (error: any) {
      setModalStatus("fail")
      setModalMessage(error?.data?.message || "حدث خطأ أثناء إضافة الشحنة")
      setModalOpen(true)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        <div className="space-y-8 pb-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="v7-neu-icon bg-gradient-to-br from-[#3498db]/80 to-[#3498db]">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#1a365d]">إنشاء شحنة جديدة</h1>
            </div>
          </div>
        </div>

        <div className="v7-neu-card p-8 md:p-10 rounded-2xl bg-[#EFF2F7] shadow-[0_10px_50px_-12px_rgba(52,152,219,0.25)] border border-[#3498db]/15 relative overflow-hidden">
          <div className="relative">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between relative">
                {/* Connection line between steps */}
                <div className="absolute top-7 left-0 right-0 h-1 bg-gray-200"></div>
                {/* Progress line */}
                <div
                  className="absolute top-7 rtl:right-0 ltr:left-0"
                  style={{
                    width: `${(step - 1) * 50}%`,
                    height: '4px',
                    background: 'linear-gradient(to left, #3498db, #2980b9)',
                    borderRadius: '2px',
                    transition: 'all 0.5s'
                  }}
                />

                {/* Step 1 */}
                <div
                  className={`flex flex-col items-center relative z-10 ${step >= 1 ? "text-[#3498db]" : "text-[#6d6a67]"}`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step === 1
                        ? "bg-gradient-to-br from-[#3498db]/80 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : step > 1
                          ? "bg-gradient-to-br from-[#3498db]/80 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                          : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 1 ? <CheckCircle2 className="h-7 w-7" /> : <Package className="h-7 w-7" />}
                  </div>
                  <span className="mt-3 text-sm font-medium">بيانات الشحن</span>
                </div>

                {/* Step 2 */}
                <div
                  className={`flex flex-col items-center relative z-10 ${step >= 2 ? "text-[#3498db]" : "text-[#6d6a67]"}`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step === 2
                        ? "bg-gradient-to-br from-[#3498db]/80 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : step > 2
                          ? "bg-gradient-to-br from-[#3498db]/80 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                          : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 2 ? <CheckCircle2 className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                  </div>
                  <span className="mt-3 text-sm font-medium">معلومات الطلب</span>
                </div>

                {/* Step 3 */}
                <div
                  className={`flex flex-col items-center relative z-10 ${step >= 3 ? "text-[#3498db]" : "text-[#6d6a67]"}`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step === 3
                        ? "bg-gradient-to-br from-[#3498db]/80 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : "v7-neu-icon-sm"
                    }`}
                  >
                    <Package className="h-7 w-7" />
                  </div>
                  <span className="mt-3 text-sm font-medium">اختر الناقل</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {step === 1 && (
              <Step1Content nextStep={nextStep} />
            )}
            {step === 2 && (
              <Step2Content nextStep={nextStep} prevStep={prevStep} />
            )}
            {step === 3 && (
              <Step3Content prevStep={prevStep} onSubmit={handleSubmit(onSubmit)} selectedProvider={selectedProvider} handleProviderSelect={handleProviderSelect} shipmentType={shipmentType} handleShipmentTypeSelect={handleShipmentTypeSelect} />
            )}
          </div>
        </div>

        <ResponseModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          status={modalStatus}
          message={modalMessage}
        />
      </div>
    </FormProvider>
  )
}

// Step 1 Content
function Step1Content({ nextStep }: { nextStep: () => void }) {
  const { setValue, trigger, formState: { errors } } = useFormContext()
  const [senderCards, setSenderCards] = useState([
    { id: 1, name: "Sary", mobile: "966568870978", city: "الرياض", address: "حي الوزارات الرياض", email: "semstry@gmail.com" },
    { id: 2, name: "نمره Nameerah", mobile: "966568870979", city: "نمره", address: "نمره", email: "semstry@gmail.com" },
    { id: 3, name: "مراسيل", mobile: "100000000000", city: "المدينة المنورة", address: "حي الخالدية المدينة المنورة", email: "info@marasil.sa" },
  ])
  const [recipientCards, setRecipientCards] = useState([
    { id: 1, name: "فهد", mobile: "966568870978", city: "أم الساحل", address: "أم الساحل", email: "semstry@gmail.com" },
    { id: 2, name: "حماد", mobile: "966556476433", city: "الخبر", address: "الخبر", email: "semstry@gmail.com" },
    { id: 3, name: "جبرية", mobile: "966555555555", city: "رياض الخبراء", address: "السعودية", email: "semstry@gmail.com" },
  ])
  const [selectedSender, setSelectedSender] = useState<number | null>(null)
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null)
  const [openSenderModal, setOpenSenderModal] = useState(false)
  const [openRecipientModal, setOpenRecipientModal] = useState(false)
  const [newSender, setNewSender] = useState({ name: "", mobile: "", city: "", address: "", email: "" })
  const [newRecipient, setNewRecipient] = useState({ name: "", mobile: "", city: "", address: "", email: "" })

  const handleSelectSender = (card: any) => {
    if (selectedSender === card.id) {
      setSelectedSender(null)
      setValue("shipper_full_name", "")
      setValue("shipper_mobile", "")
      setValue("shipper_city", "")
      setValue("shipper_address", "")
    } else {
      setSelectedSender(card.id)
      setValue("shipper_full_name", card.name)
      setValue("shipper_mobile", card.mobile)
      setValue("shipper_city", card.city)
      setValue("shipper_address", card.address)
    }
  }
  const handleSelectRecipient = (card: any) => {
    if (selectedRecipient === card.id) {
      setSelectedRecipient(null)
      setValue("recipient_full_name", "")
      setValue("recipient_mobile", "")
      setValue("recipient_city", "")
      setValue("recipient_address", "")
    } else {
      setSelectedRecipient(card.id)
      setValue("recipient_full_name", card.name)
      setValue("recipient_mobile", card.mobile)
      setValue("recipient_city", card.city)
      setValue("recipient_address", card.address)
    }
  }
  const handleDeleteSender = (id: number) => {
    setSenderCards(cards => cards.filter(card => card.id !== id))
    if (selectedSender === id) {
      setSelectedSender(null)
      setValue("shipper_full_name", "")
      setValue("shipper_mobile", "")
      setValue("shipper_city", "")
      setValue("shipper_address", "")
    }
  }
  const handleDeleteRecipient = (id: number) => {
    setRecipientCards(cards => cards.filter(card => card.id !== id))
    if (selectedRecipient === id) {
      setSelectedRecipient(null)
      setValue("recipient_full_name", "")
      setValue("recipient_mobile", "")
      setValue("recipient_city", "")
      setValue("recipient_address", "")
    }
  }
  const handleAddSender = () => {
    const id = senderCards.length + 1
    setSenderCards([...senderCards, { ...newSender, id }])
    setOpenSenderModal(false)
    setNewSender({ name: "", mobile: "", city: "", address: "", email: "" })
  }
  const handleAddRecipient = () => {
    const id = recipientCards.length + 1
    setRecipientCards([...recipientCards, { ...newRecipient, id }])
    setOpenRecipientModal(false)
    setNewRecipient({ name: "", mobile: "", city: "", address: "", email: "" })
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!selectedSender || !selectedRecipient) return
    if (await trigger(["shipper_full_name","shipper_mobile","shipper_city","shipper_address","recipient_full_name","recipient_mobile","recipient_city","recipient_address"])) nextStep();
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sender Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1a365d]">اختر عنوان الالتقاط</h2>
          <Button type="button" onClick={() => setOpenSenderModal(true)} className="bg-blue-500 text-white">+ عنوان جديد</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {senderCards.map(card => (
            <div
              key={card.id}
              className={`relative min-w-[250px] p-4 rounded-xl border cursor-pointer transition-all ${selectedSender === card.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
              onClick={() => handleSelectSender(card)}
            >
              <button
                type="button"
                className="absolute top-2 left-2 text-gray-400 hover:text-red-500 z-10"
                onClick={e => { e.stopPropagation(); handleDeleteSender(card.id) }}
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{card.name}</span>
                {selectedSender === card.id && <span className="text-blue-500">✔</span>}
              </div>
              <div className="text-sm text-gray-600">{card.mobile}</div>
              <div className="text-sm text-gray-600">{card.city}</div>
              <div className="text-sm text-gray-600">{card.address}</div>
              <div className="text-xs text-gray-400 mt-1">{card.email}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Recipient Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1a365d]">اختر عميل</h2>
          <Button type="button" onClick={() => setOpenRecipientModal(true)} className="bg-blue-500 text-white">+ عميل جديد</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {recipientCards.map(card => (
            <div
              key={card.id}
              className={`relative min-w-[250px] p-4 rounded-xl border cursor-pointer transition-all ${selectedRecipient === card.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
              onClick={() => handleSelectRecipient(card)}
            >
              <button
                type="button"
                className="absolute top-2 left-2 text-gray-400 hover:text-red-500 z-10"
                onClick={e => { e.stopPropagation(); handleDeleteRecipient(card.id) }}
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{card.name}</span>
                {selectedRecipient === card.id && <span className="text-blue-500">✔</span>}
              </div>
              <div className="text-sm text-gray-600">{card.mobile}</div>
              <div className="text-sm text-gray-600">{card.city}</div>
              <div className="text-sm text-gray-600">{card.address}</div>
              <div className="text-xs text-gray-400 mt-1">{card.email}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button type="submit" className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]">التالي</Button>
      </div>
      {/* Sender Modal */}
      <Dialog open={openSenderModal} onOpenChange={setOpenSenderModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عنوان جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="الاسم" value={newSender.name} onChange={e => setNewSender({ ...newSender, name: e.target.value })} />
            <Input placeholder="رقم الجوال" value={newSender.mobile} onChange={e => setNewSender({ ...newSender, mobile: e.target.value })} />
            <Input placeholder="المدينة" value={newSender.city} onChange={e => setNewSender({ ...newSender, city: e.target.value })} />
            <Input placeholder="العنوان" value={newSender.address} onChange={e => setNewSender({ ...newSender, address: e.target.value })} />
            <Input placeholder="البريد الإلكتروني" value={newSender.email} onChange={e => setNewSender({ ...newSender, email: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddSender} className="bg-blue-500 text-white">إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Recipient Modal */}
      <Dialog open={openRecipientModal} onOpenChange={setOpenRecipientModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="الاسم" value={newRecipient.name} onChange={e => setNewRecipient({ ...newRecipient, name: e.target.value })} />
            <Input placeholder="رقم الجوال" value={newRecipient.mobile} onChange={e => setNewRecipient({ ...newRecipient, mobile: e.target.value })} />
            <Input placeholder="المدينة" value={newRecipient.city} onChange={e => setNewRecipient({ ...newRecipient, city: e.target.value })} />
            <Input placeholder="العنوان" value={newRecipient.address} onChange={e => setNewRecipient({ ...newRecipient, address: e.target.value })} />
            <Input placeholder="البريد الإلكتروني" value={newRecipient.email} onChange={e => setNewRecipient({ ...newRecipient, email: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddRecipient} className="bg-blue-500 text-white">إضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}

// Step 2 Content
function Step2Content({ nextStep, prevStep }: { nextStep: () => void, prevStep: () => void }) {
  const { register, setValue, formState: { errors }, trigger, watch } = useFormContext()
  // Package size cards
  const defaultSizes = [
    { key: "XS", label: "صغير جدا (XS)", dims: { length: 10, width: 15, high: 5 }, desc: "حتى 3 كجم" },
    { key: "S", label: "صغير (S)", dims: { length: 15, width: 25, high: 10 }, desc: "حتى 5 كجم" },
    { key: "M", label: "متوسط (M)", dims: { length: 20, width: 35, high: 15 }, desc: "حتى 10 كجم" },
    { key: "L", label: "كبير (L)", dims: { length: 30, width: 40, high: 20 }, desc: "حتى 15 كجم" },
    { key: "XL", label: "كبير جدا (XL)", dims: { length: 60, width: 80, high: 40 }, desc: "حتى 20 كجم" },
  ]
  const [sizeCards, setSizeCards] = useState([...defaultSizes, { key: "custom", label: "حجم مخصص", dims: { length: '', width: '', high: '' }, desc: "حسب الطلب" }])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customDims, setCustomDims] = useState({ length: '', width: '', high: '' })
  const paymentMethod = watch("paymentMethod")

  // When a card is selected, fill and disable dimension inputs (unless custom)
  const handleSelectSize = (card: any) => {
    setSelectedSize(card.key)
    if (card.key !== "custom") {
      setValue("dimension_length", card.dims.length)
      setValue("dimension_width", card.dims.width)
      setValue("dimension_high", card.dims.high)
    } else {
      setValue("dimension_length", "")
      setValue("dimension_width", "")
      setValue("dimension_high", "")
    }
  }
  // Add new custom card
  const handleAddCustomCard = () => {
    if (!customDims.length || !customDims.width || !customDims.high) return
    const key = `custom_${Date.now()}`
    setSizeCards([
      ...sizeCards.filter(c => c.key !== "custom"),
      { key, label: `مخصص ${customDims.length}x${customDims.width}x${customDims.high}`, dims: { ...customDims }, desc: "مخصص" },
      sizeCards.find(c => c.key === "custom")
    ].filter((c): c is { key: string; label: string; dims: any; desc: string } => Boolean(c)))
    setShowCustomForm(false)
    setCustomDims({ length: '', width: '', high: '' })
  }
  // Watch for dimension values
  const dimension_length = watch("dimension_length")
  const dimension_width = watch("dimension_width")
  const dimension_high = watch("dimension_high")

  // On submit, validate as before
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (await trigger(["weight","Parcels","dimension_high","dimension_width","dimension_length","orderDescription","paymentMethod"])) nextStep();
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1a365d]">حجم الطرد</h2>
        <div className="flex flex-wrap gap-4">
          {sizeCards.map(card => (
            <div
              key={card.key}
              className={`relative min-w-[180px] p-4 rounded-xl border cursor-pointer flex flex-col items-center transition-all ${selectedSize === card.key ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
              onClick={() => handleSelectSize(card)}
            >
              <div className="mb-2"><Package className="w-6 h-6 text-blue-400" /></div>
              <div className="font-bold text-base text-center">{card.label}</div>
              <div className="text-xs text-gray-500 mt-1 text-center">
                {card.key !== "custom" ? (
                  <>
                    {card.dims.length} × {card.dims.width} × {card.dims.high} سم<br />{card.desc}
                  </>
                ) : (
                  <>{card.desc}</>
                )}
              </div>
              {selectedSize === card.key && <span className="absolute top-2 right-2 text-blue-500">✔</span>}
            </div>
          ))}
        </div>
        {/* Add custom card button */}
        <div className="mt-2">
          <button type="button" className="text-blue-500 underline" onClick={() => setShowCustomForm(v => !v)}>
            {showCustomForm ? "إلغاء" : "+ حجم مخصص"}
          </button>
        </div>
        {showCustomForm && (
          <div className="flex gap-2 mt-2">
            <Input placeholder="الطول (سم)" type="number" value={customDims.length} onChange={e => setCustomDims({ ...customDims, length: e.target.value })} />
            <Input placeholder="العرض (سم)" type="number" value={customDims.width} onChange={e => setCustomDims({ ...customDims, width: e.target.value })} />
            <Input placeholder="الارتفاع (سم)" type="number" value={customDims.high} onChange={e => setCustomDims({ ...customDims, high: e.target.value })} />
            <Button type="button" onClick={handleAddCustomCard}>إضافة</Button>
          </div>
        )}
      </div>
      {/* Dimensions section */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="الطول (سم)"
            {...register("dimension_length")}
            value={dimension_length}
            onChange={e => setValue("dimension_length", e.target.value)}
            disabled={!!selectedSize && selectedSize !== "custom" && !selectedSize.startsWith("custom_")}
            className="w-1/3"
          />
          <Input
            type="number"
            placeholder="العرض (سم)"
            {...register("dimension_width")}
            value={dimension_width}
            onChange={e => setValue("dimension_width", e.target.value)}
            disabled={!!selectedSize && selectedSize !== "custom" && !selectedSize.startsWith("custom_")}
            className="w-1/3"
          />
          <Input
            type="number"
            placeholder="الارتفاع (سم)"
            {...register("dimension_high")}
            value={dimension_high}
            onChange={e => setValue("dimension_high", e.target.value)}
            disabled={!!selectedSize && selectedSize !== "custom" && !selectedSize.startsWith("custom_")}
            className="w-1/3"
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          الحجم المحدد: {selectedSize && sizeCards.find(c => c.key === selectedSize) ? sizeCards.find(c => c.key === selectedSize)?.label : ''}
        </div>
      </div>
      {/* الوزن وعدد الطرود */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="weight" label="الوزن (كجم)" register={register} error={errors.weight} type="number" />
        <InputField name="Parcels" label="عدد الطرود" register={register} error={errors.Parcels} type="number" />
      </div>
      {/* وصف الطلب وطريقة الدفع */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="orderDescription" label="وصف الطلب" register={register} error={errors.orderDescription} />
        <div>
          <label className="block mb-2 font-medium text-[#1a365d]">طريقة الدفع</label>
          <div className="flex gap-4">
            <div
              className={`flex-1 rounded-xl p-4 cursor-pointer border transition-all flex flex-col items-start ${paymentMethod === "الدفع المسبق" ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}`}
              onClick={() => setValue("paymentMethod", "الدفع المسبق")}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "الدفع المسبق"}
                  onChange={() => setValue("paymentMethod", "الدفع المسبق")}
                  className="accent-blue-500"
                />
                <span className="font-bold text-blue-700">الدفع المسبق</span>
              </div>
              <span className="text-xs text-gray-500">مناسب للدفع قبل الشحن</span>
            </div>
            <div
              className={`flex-1 rounded-xl p-4 cursor-pointer border transition-all flex flex-col items-start ${paymentMethod === "الدفع عند الاستلام" ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}`}
              onClick={() => setValue("paymentMethod", "الدفع عند الاستلام")}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "الدفع عند الاستلام"}
                  onChange={() => setValue("paymentMethod", "الدفع عند الاستلام")}
                  className="accent-blue-500"
                />
                <span className="font-bold text-blue-700">الدفع عند الاستلام</span>
              </div>
              <span className="text-xs text-gray-500">مناسب للدفع عند استلام الشحنة</span>
            </div>
          </div>
          {errors.paymentMethod && <p className="text-sm text-red-500 mt-2">{errors.paymentMethod?.message}</p>}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button type="button" onClick={prevStep} variant="outline" className="border-2">السابق</Button>
        <Button type="submit" className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]">التالي</Button>
      </div>
    </form>
  )
}

// Step 3 Content
function Step3Content({ prevStep, onSubmit, selectedProvider, handleProviderSelect, shipmentType, handleShipmentTypeSelect }: any) {
  const { register, formState: { errors }, watch, getValues } = useFormContext()
  const values = getValues()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Wrap onSubmit to handle loading state
  const handleSubmit = async (e: any) => {
    setIsSubmitting(true)
    try {
      await onSubmit(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1a365d]">بيانات الطلب</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="order_id" label="معرف الطلب (ID)" register={register} error={errors.order_id} />
          <InputField name="storeId" label="معرف المتجر (Store ID)" register={register} error={errors.storeId} />
          <InputField name="platform" label="المنصة" register={register} error={errors.platform} />
          <InputField name="orderId" label="رقم الطلب" register={register} error={errors.orderId} />
          <InputField name="status" label="الحالة" register={register} error={errors.status} />
          <InputField name="total" label="الإجمالي" register={register} error={errors.total} type="number" />
          <InputField name="customerAddress" label="عنوان العميل" register={register} error={errors.customerAddress} />
          <InputField name="description" label="وصف الطلب" register={register} error={errors.description} />
          <InputField name="source" label="المصدر" register={register} error={errors.source} />
          <InputField name="direction" label="الاتجاه" register={register} error={errors.direction} />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1a365d]">اختيار الناقل</h2>
        <div className="flex gap-4">
          {providerOptions.map((provider) => (
            <button
              key={provider.key}
              type="button"
              className={`border-2 rounded-xl px-4 py-2 ${selectedProvider.key === provider.key ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => handleProviderSelect(provider)}
            >
              <span className="font-bold">{provider.label}</span>
              <div className="text-xs text-gray-500 mt-1">{provider.notes}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1a365d]">نوع الشحن</h2>
        <div className="flex gap-4">
          {[
            { key: "dry", label: "شحن جاف" },
            { key: "cold", label: "شحن مبرد" },
            { key: "express", label: "مراسيل سريع" },
            { key: "stations", label: "محطات الطرود" },
          ].map((type) => (
            <button
              key={type.key}
              type="button"
              className={`border-2 rounded-xl px-4 py-2 ${shipmentType === type.key ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onClick={() => handleShipmentTypeSelect(type.key)}
            >
              <span className="font-bold">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* ملخص الطلب */}
      <div className="v7-neu-card p-6 rounded-2xl bg-[#F9FAFB] border border-[#3498db]/10 mt-8">
        <h2 className="text-lg font-bold text-[#1a365d] mb-4 flex items-center gap-2">
          <span>ملخص الطلب</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#1a365d]">
          <div><span className="font-bold">من:</span> {values.shipper_city || "-"}</div>
          <div><span className="font-bold">إلى:</span> {values.recipient_city || "-"}</div>
          <div><span className="font-bold">نوع الشحنة:</span> {shipmentType || "-"}</div>
          <div><span className="font-bold">حجم الطرد:</span> {values.dimension_length && values.dimension_width && values.dimension_high ? `${values.dimension_length} × ${values.dimension_width} × ${values.dimension_high}` : "-"}</div>
          <div><span className="font-bold">الوزن:</span> {values.weight || "-"}</div>
          <div><span className="font-bold">عدد الصناديق:</span> {values.Parcels || "-"}</div>
          <div><span className="font-bold">خدمة التوصيل:</span> {values.company || "-"}</div>
          <div><span className="font-bold">الإجمالي:</span> {values.total ? `${values.total} ريال` : "-"}</div>
        </div>
      </div>
      {/* نصائح للشحنات القابلة للكسر */}
      <div className="mt-8 rounded-2xl border border-[#ffe9b0] bg-[#fffbe9] p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#eab308] text-xl">&#9888;</span>
          <span className="font-bold text-[#1a365d]">نصائح للشحنات القابلة للكسر</span>
        </div>
        <div className="font-bold text-[#1a365d] mb-2">كيف تحمي شحنتك القابلة للكسر؟</div>
        <ul className="list-disc pr-6 text-[#b08900] text-sm space-y-1 mb-2">
          <li>استخدم تغليف مناسب مثل الفقاعات الهوائية أو الفلين لحماية المحتويات الهشة</li>
          <li>ضع علامة "قابل للكسر" بشكل واضح على جميع جوانب الطرد</li>
          <li>اختر خدمة الشحن المصرح للتعامل مع الشحنات الحساسة بعناية إضافية</li>
          <li>نوصي بشدة بإضافة تأمين الشحنة لتفادي أي أضرار محتملة أثناء النقل</li>
        </ul>
        <div className="bg-[#fff3cd] text-[#b08900] rounded-lg px-4 py-2 text-xs mt-2">
          يمكنك إضافة تأمين على الشحنة من خلال الفرع كل ماعليك فعله عند تسليم الشحنة أخبرهم أنك تريد التأمين عليها.
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button type="button" onClick={prevStep} variant="outline" className="border-2">السابق</Button>
        <Button type="submit" className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>
              <svg className="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              جاري الإرسال...
            </span>
          ) : (
            "إنشاء الشحنة"
          )}
        </Button>
      </div>
    </form>
  )
}

// InputField and SelectField components
function InputField({ name, label, register, error, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id={name}
        type={type}
        {...register(name)}
        className={cn(
          "border-2 transition-colors w-full h-10",
          error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500"
        )}
      />
      {error?.message && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

function SelectField({ name, label, error }: any) {
  const { control } = useFormContext()
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              className={cn(
                "border-2 transition-colors w-full h-10",
                error ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500"
              )}
            >
              <SelectValue placeholder={`اختر ${label}`} />
            </SelectTrigger>
            <SelectContent className="w-[150px] max-h-[200px] overflow-y-auto" position="popper" sideOffset={4}>
              {cities.map((city: string) => (
                <SelectItem key={city} value={city} className="py-1.5 px-2 text-sm text-center">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
} 