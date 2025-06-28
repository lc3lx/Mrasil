"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useForm as useOrderForm } from "react-hook-form"
import { yupResolver as orderYupResolver } from "@hookform/resolvers/yup"

interface Step3Props {
  formData: {
    paymentMethod: string;
    deliveryType: string;
    insuranceAmount: string;
    specialInstructions: string;
  };
  onBack: () => void;
  onFormDataChange: (data: any) => void;
  onSubmit: () => void;
}

const paymentMethods = ["الدفع عند الاستلام", "الدفع المسبق", "تحويل بنكي"];

const deliveryTypes = ["توصيل عادي", "توصيل سريع", "توصيل في نفس اليوم"];

const schema = yup
  .object({
    paymentMethod: yup.string().required("طريقة الدفع مطلوبة"),
    deliveryType: yup.string().required("نوع التوصيل مطلوب"),
    insuranceAmount: yup
      .string()
      .required("قيمة التأمين مطلوبة")
      .matches(/^\d+(\.\d{1,2})?$/, "قيمة التأمين غير صحيحة"),
    specialInstructions: yup.string().required("التعليمات الخاصة مطلوبة"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const orderSchema = yup.object({
  _id: yup.string().required("معرف الطلب مطلوب"),
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
}).required()

type OrderFormData = yup.InferType<typeof orderSchema>

const classifications = [
  { key: "dry", label: "شحن جاف", icon: "/box-seam.svg" },
  { key: "cold", label: "شحن مبرد", icon: "/brightness-high.svg" },
  { key: "express", label: "مراسيل سريع", icon: "/box2-fill.svg" },
  { key: "stations", label: "محطات الطرود", icon: "/sugar-cube.png" },
];

const serviceProviders: Record<string, Array<{
  logo: string;
  name: string;
  numberOfShipments: string;
  timeOfDelivering: string;
  notes: string;
  price: string;
}>> = {
  dry: [
    {
      logo: "/Thabit.jpg",
      name: "ثابت",
      numberOfShipments: "(5 شحنات كحد أدنى)",
      timeOfDelivering: "2 أيام",
      notes: " ثابت لا تشحن الى محايل ",
      price: "KWD 19.27",
    },
    {
      logo: "/smsa_b2c.jpg",
      name: "سمسا",
      numberOfShipments: "(50 شحنات كحد أدنى)",
      timeOfDelivering: "2 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنهصيدك غير كافي للشحن مع ثابت",
      price: "",
    },
    {
      logo: "/jandt.jpg",
      name: "J&T",
      numberOfShipments: "(5 شحنات كحد أدنى)",
      timeOfDelivering: "3 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنهالوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنهصيدك غير كافي للشحن مع ثابت",
      price: "",
    },
    {
      logo: "/iMile.jpg",
      name: "آي مايل",
      numberOfShipments: "(5 شحنات كحد أدنى)",
      timeOfDelivering: "3 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنه",
      price: "",
    },
    {
      logo: "/AyMakan.jpg",
      name: "أي مكان",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: "3 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنه",
      price: "",
    },
    {
      logo: "/Aramex.jpg",
      name: "أرامكس",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: "3 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنه",
      price: "",
    },
    {
      logo: "/Dal.jpg",
      name: "دال",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: "دال لا تلتقط من الرياض",
      price: "",
    },
    {
      logo: "/Anwan.jpg",
      name: "انوان اكسبرس",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: "انوان اكسبرس لا تشحن إلى محايل",
      price: "",
    },
    {
      logo: "/DRB.jpg",
      name: " درب",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: "درب لا تشحن إلى محايل",
      price: "",
    },
    {
      logo: "/Naqel.jpg",
      name: " ناقل إكسبرس",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 3 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنه",
      price: "",
    },
    {
      logo: "/FlowExpress.jpg",
      name: " Flow Express",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 3 أيام",
      notes:
        "الوزن اكثر من الحد المسموح. يرجى الاتصال بخدمة العملاء للمساعده في عمل الشحنه",
      price: "",
    },
    {
      logo: "/MilesSpeed.jpg",
      name: " سرعة أميال",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 2 أيام",
      notes: "سرعة أميال لا تشحن إلى محايل",
      price: "",
    },
    {
      logo: "/RedBox.jpg",
      name: " RedBox",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 2 أيام",
      notes: "RedBox يجب ادخال الأبعاد، الطول والعرض والإرتفاع",
      price: "",
    },
    {
      logo: "/Nashmi.jpg",
      name: " نشمي",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: "نشمي لا تشحن إلى محايل",
      price: "",
    },

    {
      logo: "/DeliverySupport.jpg",
      name: " دعم التوصيل",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: "دعم التوصيل لا تشحن إلى محايل",
      price: "",
    },

    {
      logo: "/Sent.jpg",
      name: "سينت",
      numberOfShipments: "لايوجد",

      timeOfDelivering: " 5 أيام",
      notes: " سينت لا تشحن إلى محايل",
      price: "",
    },

    {
      logo: "/FeeriLogis.jpg",
      name: "فيري لوجس",
      numberOfShipments: "لايوجد",

      timeOfDelivering: " 2 أيام",
      notes: " فيري لوجس لا تشحن إلى محايل",
      price: "",
    },
    {
      logo: "/Gulfpalm.jpg",
      name: "نخلة الخليج",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: " نخلة الخليج لا تشحن إلى محايل",
      price: "",
    },
    {
      logo: "/JudhurAlatiqan.jpg",
      name: "جذور الإتقان",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 3 أيام",
      notes: "     جذور الإتقان لا تشحن الى محايل  ",
      price: "",
    },
  ],

  cold: [
   {
      logo: "/Anwan.jpg",
      name: "انوان اكسبرس",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes:  "درب لا تشحن إلى محايل",
      price: "",
    },
        {
      logo: "/DRB.jpg",
      name: " درب",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 1 أيام",
      notes: "درب لا تشحن إلى محايل",
      price: "",
    },


  ],
  express: [],
  stations: [

      {
      logo: "/RedBox.jpg",
      name: " redbox",
      numberOfShipments: "(5 شحنات كحد أدنى)",

      timeOfDelivering: " 2 أيام",
      notes: "RedBox يجب ادخال الأبعاد، الطول والعرض والإرتفاع",
      price: "",
    },
  ],
};

export function Step3({
  formData,
  onBack,
  onFormDataChange,
  onSubmit,
}: Step3Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  const {
    register: orderRegister,
    handleSubmit: handleOrderSubmit,
    formState: { errors: orderErrors },
    setValue: setOrderValue,
  } = useOrderForm<OrderFormData>({
    resolver: orderYupResolver(orderSchema),
    defaultValues: {
      _id: '',
      storeId: '',
      platform: '',
      orderId: '',
      status: '',
      total: 0,
      paymentMethod: '',
      customerAddress: '',
      description: '',
      source: '',
      direction: '',
    },
  })

  const [selectedClassification, setSelectedClassification] = useState("dry");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleFormSubmit = (data: FormData) => {
    onFormDataChange(data);
    onSubmit();
  };

  const handleProviderSelect = (provider: {
    logo: string;
    name: string;
    numberOfShipments: string;
    timeOfDelivering: string;
    notes: string;
    price: string;
  }) => {
    setSelectedProvider(provider.name);
    onFormDataChange({
      company: provider.name,
      shipmentType: selectedClassification,
      orderDescription: provider.notes,
    });
  };

  const handleOrderFormSubmit = (data: OrderFormData) => {
    onFormDataChange({ order: { ...data, total: Number(data.total) } })
    onSubmit()
  }

  const InputField = ({
    name,
    label,
    type = "text",
    placeholder,
  }: {
    name: keyof FormData;
    label: string;
    type?: string;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "border-2 transition-colors w-full h-10",
          errors[name]
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-gray-200 focus-visible:ring-blue-500"
        )}
        {...register(name)}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );

  const SelectField = ({
    name,
    label,
    placeholder,
    options,
  }: {
    name: keyof FormData;
    label: string;
    placeholder: string;
    options: string[];
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Select
        defaultValue={formData[name]}
        onValueChange={(value) => setValue(name, value)}
      >
        <SelectTrigger
          id={name}
          className={cn(
            "border-2 transition-colors w-full h-10",
            errors[name]
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-gray-200 focus-visible:ring-blue-500"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="w-full max-h-[200px] overflow-y-auto"
          position="popper"
          sideOffset={4}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="py-1.5 px-2 text-sm"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );

  // OrderInputField for react-hook-form
  const OrderInputField = ({
    name,
    label,
    type = "text",
    placeholder,
  }: {
    name: keyof OrderFormData;
    label: string;
    type?: string;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          "border-2 transition-colors w-full h-10",
          orderErrors[name] ? "border-red-500 focus-visible:ring-red-500" : "border-gray-200 focus-visible:ring-blue-500"
        )}
        {...orderRegister(name)}
      />
      {orderErrors[name] && <p className="text-sm text-red-500">{orderErrors[name]?.message as string}</p>}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        {classifications.map((cls) => (
          <button
            key={cls.key}
            type="button"
            onClick={() => setSelectedClassification(cls.key)}
            className={
              `flex-1 min-w-[160px] max-w-[200px] flex flex-col items-center border-2 rounded-2xl px-4 py-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ` +
              (selectedClassification === cls.key
                ? "border-gray-800 dark:border-gray-200 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-md"
                : "border-gray-300 dark:border-gray-700 bg-[#f8fafd] dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600")
            }
            dir="auto"
          >
            {typeof cls.icon === "string" ? (
              <Image
                src={cls.icon}
                alt={cls.label}
                width={36}
                height={36}
                className="mb-3 dark:invert"
              />
            ) : (
              <span className="mb-3 text-3xl">{cls.icon}</span>
            )}
            <span className="font-medium text-base text-gray-700 dark:text-gray-300">{cls.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {serviceProviders[selectedClassification].length === 0 ? (
          <div className="text-center text-muted-foreground dark:text-muted py-12">
            لا يوجد مزودي خدمة في هذا التصنيف حالياً
          </div>
        ) : (
          <div className="space-y-4">
            {serviceProviders[selectedClassification].map((provider, idx: number) => (
              <div
                key={provider.name}
                className={
                  `flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl bg-white dark:bg-gray-800 shadow p-4 sm:p-6 border-2 transition-all duration-200 ` +
                  (selectedProvider === provider.name
                    ? "border-gray-800 dark:border-gray-200"
                    : "border-transparent")
                }
                onClick={() => handleProviderSelect(provider)}
                style={{ cursor: "pointer" }}
                dir="auto"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Image
                    src={provider.logo}
                    alt={provider.name}
                    width={80}
                    height={80}
                    className="rounded-full object-contain mx-4 my-2 bg-white dark:bg-gray-700"
                    style={{ minWidth: 80, minHeight: 80 }}
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="font-bold text-lg text-gray-700 dark:text-gray-200">
                      {provider.name}
                    </span>
                    <span className="text-sm text-muted-foreground dark:text-muted">
                      {provider.numberOfShipments}
                    </span>
                    <span className="text-sm text-muted-foreground dark:text-muted">
                      {provider.notes}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-end gap-2 min-w-[120px] mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-gray-700 dark:text-gray-200 font-bold text-xl">
                    {provider.price}
                  </span>
                  <span className="text-muted-foreground dark:text-muted text-sm">
                    {provider.timeOfDelivering}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Form */}
      <form onSubmit={handleOrderSubmit(handleOrderFormSubmit)} className="mt-10 p-6 rounded-xl bg-gray-50 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-[#1a365d]">بيانات الطلب</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OrderInputField name="_id" label="معرف الطلب (ID)" placeholder="معرف الطلب" type="text" />
          <OrderInputField name="storeId" label="معرف المتجر (Store ID)" placeholder="معرف المتجر" type="text" />
          <OrderInputField name="platform" label="المنصة" placeholder="المنصة" type="text" />
          <OrderInputField name="orderId" label="رقم الطلب" placeholder="رقم الطلب" type="text" />
          <OrderInputField name="status" label="الحالة" placeholder="الحالة" type="text" />
          <OrderInputField name="total" label="الإجمالي" placeholder="الإجمالي" type="number" />
          <OrderInputField name="paymentMethod" label="طريقة الدفع" placeholder="طريقة الدفع" type="text" />
          <OrderInputField name="customerAddress" label="عنوان العميل" placeholder="عنوان العميل" type="text" />
          <OrderInputField name="description" label="وصف الطلب" placeholder="وصف الطلب" type="text" />
          <OrderInputField name="source" label="المصدر" placeholder="المصدر" type="text" />
          <OrderInputField name="direction" label="الاتجاه" placeholder="الاتجاه" type="text" />
        </div>
        <div className="flex justify-end mt-6">
          <Button type="submit" className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]">
            حفظ بيانات الطلب
          </Button>
        </div>
      </form>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="border-2"
        >
          <ArrowRight className="ml-2 h-4 w-4" />
          السابق
        </Button>
      </div>
    </motion.div>
  );
}
