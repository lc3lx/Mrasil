"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

import { useGetAllClientAddressesQuery } from '@/app/api/clientAdressApi'
import { useState } from 'react'
import { useOrderForClientAddressMutation } from '@/app/api/orderForClientAddressApi'
import { useGetAllOrdersQuery } from '@/app/api/ordersApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AddRecipientForm } from './AddRecipientForm';
import { useCreateClientAddressMutation } from '@/app/api/clientAdressApi';
import { useGetCustomerMeQuery } from '@/app/api/customerApi';

const schema = yup.object({
  clientName: yup.string().required("اسم العميل مطلوب"),
  clientPhone: yup.string().required("رقم الجوال مطلوب"),
  clientEmail: yup.string().required("البريد الإلكتروني مطلوب"),
  clientAddress: yup.string().required("العنوان مطلوب"),
  country: yup.string().required("الدولة مطلوبة"),
  city: yup.string().required("المدينة مطلوبة"),
  district: yup.string().required("الحي مطلوب"),
}).required()

type FormData = yup.InferType<typeof schema>

const orderSchema = yup.object({
  number_of_boxes: yup.number().required('عدد الصناديق مطلوب').positive().integer(),
  box_dimensions: yup.object({
    width: yup.number().required('العرض مطلوب').positive(),
    height: yup.number().required('الارتفاع مطلوب').positive(),
    length: yup.number().required('الطول مطلوب').positive(),
  }),
  weight: yup.number().required('الوزن مطلوب').positive(),
  payment_method: yup.string().required('طريقة الدفع مطلوبة'),
  product_value: yup.number().required('قيمة المنتج مطلوبة').positive(),
});

type OrderFormData = yup.InferType<typeof orderSchema>;

export function CreateOrderForm() {
  const router = useRouter()
  const { data: customerMe } = useGetCustomerMeQuery();
 
  const { data: clientAddresses, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useGetAllClientAddressesQuery()
  const [selectedCard, setSelectedCard] = useState<null | any>(null)
  const [step, setStep] = useState(1)
  const [orderForClientAddress, { isLoading: isOrderLoading }] = useOrderForClientAddressMutation()
  const [showSuccess, setShowSuccess] = useState(false);
  // For refreshing orders after creation
  const { refetch: refetchOrders } = useGetAllOrdersQuery();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [createClientAddress, { isLoading: isCreatingClient }] = useCreateClientAddressMutation();
  const [showAddClientSuccess, setShowAddClientSuccess] = useState(false);

  // Step 2 form
  const {
    register: registerOrder,
    handleSubmit: handleOrderSubmit,
    setValue: setOrderValue,
    formState: { errors: orderErrors },
    trigger: triggerOrder,
    reset: resetOrderForm,
    watch: orderWatch,
  } = useForm<OrderFormData>({
    resolver: yupResolver(orderSchema),
    defaultValues: {
      number_of_boxes: 1,
      box_dimensions: { width: 0, height: 0, length: 0 },
      weight: 0,
      payment_method: '',
      product_value: 0,
    },
  })

  const handleCardSelect = (address: any) => {
    setSelectedCard(address)
  }

  // Only show cards for address selection, no input fields
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6"
    >
      {step === 1 && (
        <>
          <div className="mb-8">
            <div className="flex flex-row-reverse items-center justify-between mb-4">
              <Button
                type="button"
                className="bg-[#294D8B] text-white rounded px-4 py-2 shadow-sm hover:bg-[#1e3b6f] ml-2"
                onClick={() => setShowAddClientModal(true)}
              >
                اضافة عميل جديد
              </Button>
              <h2 className="text-lg font-semibold">اختر عنوان عميل موجود</h2>
            </div>
            {isLoadingAddresses ? (
              <div>جاري التحميل...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(showAllAddresses ? clientAddresses?.data : clientAddresses?.data?.slice(0, 4))?.map((address: any) => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedCard?._id === address._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                      onClick={() => setSelectedCard(address)}
                    >
                      <div className="font-bold text-[#1a365d]">{address.clientName}</div>
                      <div className="text-sm text-gray-600">{address.clientPhone}</div>
                      <div className="text-sm text-gray-600">{address.clientEmail}</div>
                      <div className="text-sm text-gray-600">{address.clientAddress}</div>
                      <div className="text-sm text-gray-600">{address.country} - {address.city}</div>
                      <div className="text-sm text-gray-600">طريقة الدفع: {address.district}</div>
                    </div>
                  ))}
                </div>
                {clientAddresses?.data?.length && clientAddresses?.data?.length > 4 && (
                  <div className="flex justify-center mt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAllAddresses(v => !v)}>
                      {showAllAddresses ? 'عرض أقل' : 'المزيد'}
                    </Button>
                  </div>
                )}
              </>
            )}
            <AddRecipientForm
              isOpen={showAddClientModal}
              onClose={() => setShowAddClientModal(false)}
              isLoading={isCreatingClient}
              initialValues={{ customer: customerMe?.data?._id || '' }}
              onSubmit={async (data) => {
                await createClientAddress({ ...data, customer: customerMe?.data?._id }).unwrap();
                setShowAddClientModal(false);
                setShowAddClientSuccess(true);
                if (typeof refetchAddresses === 'function') refetchAddresses();
              }}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="v7-neu-button"
              onClick={() => router.push('/orders')}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              className="v7-neu-button-accent"
              disabled={!selectedCard}
              onClick={() => selectedCard && setStep(2)}
            >
              التالي
            </Button>
          </div>
        </>
      )}
      {step === 2 && (
        <form onSubmit={handleOrderSubmit(async (data: OrderFormData) => {
          if (!selectedCard) return;
          try {
            await orderForClientAddress({ id: selectedCard._id, order: data }).unwrap();
            setShowSuccess(true);
            resetOrderForm();
          } catch (error) {
            console.error('Error creating order for client address:', error);
          }
        })} className="space-y-8">
          <div className="v7-neu-card p-6">
            <h2 className="text-xl font-semibold text-[#1a365d] mb-6">تفاصيل الطلب</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="number_of_boxes">عدد الصناديق<span className="text-red-500">*</span></Label>
                <Input id="number_of_boxes" type="number" {...registerOrder('number_of_boxes')} className={cn("border-2 transition-colors w-full h-10", orderErrors.number_of_boxes ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500")}/>
                {orderErrors.number_of_boxes && <p className="text-sm text-red-500">{orderErrors.number_of_boxes.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">الوزن<span className="text-red-500">*</span></Label>
                <Input id="weight" type="number" {...registerOrder('weight')} className={cn("border-2 transition-colors w-full h-10", orderErrors.weight ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500")}/>
                {orderErrors.weight && <p className="text-sm text-red-500">{orderErrors.weight.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_value">قيمة المنتج<span className="text-red-500">*</span></Label>
                <Input id="product_value" type="number" {...registerOrder('product_value')} className={cn("border-2 transition-colors w-full h-10", orderErrors.product_value ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500")}/>
                {orderErrors.product_value && <p className="text-sm text-red-500">{orderErrors.product_value.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method">طريقة الدفع<span className="text-red-500">*</span></Label>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center transition-all ${orderWatch('payment_method') === 'Prepaid' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg font-bold">الدفع المسبق</span>
                      <input
                        type="radio"
                        value="Prepaid"
                        {...registerOrder('payment_method')}
                        className="form-radio ml-2 h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={orderWatch('payment_method') === 'Prepaid'}
                        onChange={() => setOrderValue('payment_method', 'Prepaid', { shouldValidate: true })}
                      />
                    </div>
                    <span className="text-sm text-gray-500 mt-2">مناسب للدفع قبل الشحن</span>
                  </label>
                  <label className={`flex-1 cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center transition-all ${orderWatch('payment_method') === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-lg font-bold">الدفع عند الاستلام</span>
                      <input
                        type="radio"
                        value="COD"
                        {...registerOrder('payment_method')}
                        className="form-radio ml-2 h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        checked={orderWatch('payment_method') === 'COD'}
                        onChange={() => setOrderValue('payment_method', 'COD', { shouldValidate: true })}
                      />
                    </div>
                    <span className="text-sm text-gray-500 mt-2">مناسب للدفع عند استلام الشحنة</span>
                  </label>
                </div>
                {orderErrors.payment_method && <p className="text-sm text-red-500">{orderErrors.payment_method.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>أبعاد الصندوق<span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="العرض" {...registerOrder('box_dimensions.width')} className={cn("border-2 transition-colors w-full h-10", orderErrors.box_dimensions?.width ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500")}/>
                  <Input type="number" placeholder="الارتفاع" {...registerOrder('box_dimensions.height')} className={cn("border-2 transition-colors w-full h-10", orderErrors.box_dimensions?.height ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500")}/>
                  <Input type="number" placeholder="الطول" {...registerOrder('box_dimensions.length')} className={cn("border-2 transition-colors w-full h-10", orderErrors.box_dimensions?.length ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500")}/>
                </div>
                {(orderErrors.box_dimensions?.width || orderErrors.box_dimensions?.height || orderErrors.box_dimensions?.length) && (
                  <p className="text-sm text-red-500">
                    {orderErrors.box_dimensions?.width?.message || orderErrors.box_dimensions?.height?.message || orderErrors.box_dimensions?.length?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              className="v7-neu-button"
              onClick={() => setStep(1)}
            >
              السابق
            </Button>
            <Button
              type="submit"
              className="v7-neu-button-accent"
              disabled={isOrderLoading}
            >
              {isOrderLoading ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
            </Button>
          </div>
        </form>
      )}
      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={(open) => {
        setShowSuccess(open);
        if (!open) {
          refetchOrders();
          router.push('/orders');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تم إنشاء الطلب بنجاح</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-green-600 text-lg font-bold">تمت إضافة الطلب بنجاح!</span>
            <Button className="mt-4" onClick={() => {
              setShowSuccess(false);
              refetchOrders();
              router.push('/orders');
            }}>إغلاق</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Success Modal for Add Client Address */}
      <Dialog open={showAddClientSuccess} onOpenChange={setShowAddClientSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>نجاح العملية</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <span className="text-green-600 text-lg font-bold">تمت إضافة العميل بنجاح!</span>
            <Button className="mt-4" onClick={() => setShowAddClientSuccess(false)}>
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
} 