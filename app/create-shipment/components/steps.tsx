"use client";

import { useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import * as yup from "yup";
import {
  Package,
  CheckCircle2,
  FileText,
  Trash2,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  Search,
  Shield,
  Box,
  Scale,
  CreditCard,
  Car,
  Check,
  Loader2,
} from "lucide-react";
import ResponseModal from "../../components/ResponseModal";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  useCreateShipmentMutation,
  useCreateShipmentOrderMutation,
  useGetMyShipmentsQuery,
  useGetSMSAOfficesQuery,
} from "../../api/shipmentApi";
import {
  useGetAllClientAddressesQuery,
  useCreateClientAddressMutation,
  useDeleteClientAddressMutation,
  useUpdateClientAddressMutation,
} from "../../api/clientAdressApi";
import { useCreateAddressMutation } from "../../api/adressesApi";
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
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useGetCustomerMeQuery } from "../../api/customerApi";
import {
  useGetAllParcelsQuery,
  useCreateParcelMutation,
} from "../../api/parcelsApi";
import { useGetAllShipmentCompaniesQuery } from "../../api/shipmentCompanyApi";
import { motion } from "framer-motion";
import { Building, Plus } from "lucide-react";
import { AddSenderAddressForm } from "./AddSenderAddressForm";
import { AddRecipientForm } from "../components/AddRecipientForm";
import { SenderAddressSection } from "./SenderAddressSection";
import { RecipientAddressSection } from "./RecipientAddressSection";
import { ParcelSizeSection } from "./ParcelSizeSection";
import CarrierCard from "./CarrierCard";
import { OrderSummaryAndFragileTips } from "./OrderSummaryAndFragileTips";
import { useSearchParams } from "next/navigation";
import Privace from "./Privace";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

const cities = [
  "الرياض",
  "جدة",
  "مكة",
  "المدينة",
  "الدمام",
  "الخبر",
  "الطائف",
  "تبوك",
  "بريدة",
  "خميس مشيط",
  "الهفوف",
  "المبرز",
  "حفر الباطن",
  "حائل",
  "نجران",
  "الجبيل",
  "أبها",
  "ينبع",
  "عرعر",
  "عنيزة",
  "سكاكا",
  "جازان",
  "القطيف",
  "الباحة",
  "بيشة",
  "الرس",
];
const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
type ErrorMessageProps = {
  error?: any;
};
const providerOptions = [
  {
    key: "redbox",
    label: "redbox",
    notes: "redbox يجب ادخال الأبعاد، الطول والعرض والإرتفاع",
  },
  { key: "smsa", label: "سمسا", notes: "سمسا لا تشحن إلى بعض المناطق" },
  {
    key: "smsapro",
    label: "سمسا برو",
    notes: "سمسا برو مع أحجام الصناديق المتاحة",
  },
  { key: "thabit", label: "ثابت", notes: "ثابت لا تشحن الى محايل" },
  // ... add more as needed
];

const schema = yup
  .object({
    shipper_full_name: yup.string(),
    shipper_mobile: yup.string(), // no validation
    shipper_city: yup.string(),
    shipper_city_en: yup.string(), // الاسم الإنجليزي للمدينة
    shipper_address: yup.string(),
    shipper_nationalAddress: yup.string(),
    recipient_full_name: yup.string(),
    recipient_mobile: yup.string(), // no validation
    recipient_city: yup.string(),
    recipient_city_en: yup.string(), // الاسم الإنجليزي للمدينة
    recipient_address: yup.string(),
    recipient_email: yup.string(),
    recipient_district: yup.string(),
    recipient_nationalAddress: yup.string(),
    weight: yup.number().required("الوزن مطلوب").typeError("الوزن مطلوب"),
    Parcels: yup.number(),
    dimension_high: yup.number(),
    dimension_width: yup.number(),
    dimension_length: yup.number(),

    company: yup.string(),
    shipmentType: yup.string(),
    orderDescription: yup.string().required("الوصف مطلوب"),
    total: yup.number().required("الاجمالي مطلوب").typeError("الأجمالي مطلوب"),
    description: yup.string().optional(),
    customerAddress: yup.string().optional(),
    paymentMethod: yup.string().required("طريقة الدفع مطلوبة"),
    senderOfficeCode: yup.string().optional(),
    recipientOfficeCode: yup.string().optional(),
  })
  .required();

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function CreateShipmentSteps() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "fail">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(providerOptions[0]);
  const [shipmentType, setShipmentType] = useState("الدفع المسبق");
  const initialStepParam = searchParams.get("step");
  const initialStep = initialStepParam ? parseInt(initialStepParam) : 1;
  const [step, setStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shipper_full_name: "",
      shipper_mobile: "",
      shipper_city: "",
      shipper_city_en: "", // الاسم الإنجليزي للمدينة
      shipper_address: "",
      shipper_nationalAddress: "",
      recipient_full_name: "",
      recipient_mobile: "",
      recipient_city: "",
      recipient_city_en: "", // الاسم الإنجليزي للمدينة
      recipient_address: "",
      recipient_email: "",
      recipient_district: "",
      recipient_nationalAddress: "",
      weight: undefined,
      Parcels: 1,
      dimension_high: 0,
      dimension_width: 0,
      dimension_length: 0,
      paymentMethod: "",
      company: providerOptions[0].label,
      shipmentType: "",
      orderDescription: "",
      total: undefined,
      description: "",
      customerAddress: "",
      senderOfficeCode: "",
      recipientOfficeCode: "",
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const [createShipment] = useCreateShipmentMutation();
  const { refetch: refetchShipments } = useGetMyShipmentsQuery({});

  // Prefill from localStorage if available
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefill = localStorage.getItem("shipmentPrefill");
    if (prefill) {
      try {
        const order = JSON.parse(prefill);
        // Map order fields to form fields
        const mapped = {
          // Step 1
          recipient_full_name: order.clientAddress?.clientName || "",
          recipient_mobile: order.clientAddress?.clientPhone || "",
          recipient_city: order.clientAddress?.city || "",
          recipient_city_en: "", // سيتم تحديده من البيانات أو تركه فارغاً
          recipient_address: order.clientAddress?.clientAddress || "",
          recipient_district: order.clientAddress?.clientAddress || "",
          // Step 2
          Parcels: order.number_of_boxes || 1,
          weight: order.weight || 1,
          // Removed Step 3 fields
        };
        methods.reset({ ...methods.getValues(), ...mapped });
      } catch {}
      localStorage.removeItem("shipmentPrefill");
    }
  }, []);

  // Stepper navigation
  const nextStep = () => {
    setStep((s) => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Provider selection
  const handleProviderSelect = (provider: (typeof providerOptions)[0]) => {
    setSelectedProvider(provider);
    setValue("company", provider.key); // استخدام key بدلاً من label
    setValue("orderDescription", provider.notes);
  };
  // Shipment type selection
  const handleShipmentTypeSelect = (type: string) => {
    setShipmentType(type);
    setValue("shipmentType", type);
  };

  // Final submit
  const onSubmit = async (data: any) => {
    // isSubmitting يتم تعيينه قبل استدعاء handleSubmit
    try {
      const payload = {
        company: data.company,
        shapmentingType:
          data.shipmentType === "الدفع المسبق"
            ? "Dry"
            : data.shipmentType === "الدفع عند الاستلام"
            ? "COD"
            : data.shipmentType,
        orderDescription: data.orderDescription,
        order: {
          paymentMethod:
            data.paymentMethod === "الدفع المسبق"
              ? "Prepaid"
              : data.paymentMethod === "الدفع عند الاستلام"
              ? "COD"
              : data.paymentMethod,
          customer: {
            full_name: data.recipient_full_name,
            mobile: data.recipient_mobile, // send as entered
            city: data.recipient_city,
            city_en: data.recipient_city_en, // الاسم الإنجليزي للمدينة
            country: "sa",
            address: data.recipient_address || data.recipient_district || "",
            email: data.recipient_email || "",
            district: data.recipient_district || data.recipient_address || "",
            nationalAddress: data.recipient_nationalAddress || "",
          },
          total: {
            amount: data.total,
            currency: "SAR",
          },
          description: data.description,
          customerAddress: data.customerAddress,
        },
        shipperAddress: {
          full_name: data.shipper_full_name,
          mobile: data.shipper_mobile, // send as entered
          city: data.shipper_city,
          city_en: data.shipper_city_en, // الاسم الإنجليزي للمدينة
          country: "sa",
          address: data.shipper_address,
          nationalAddress: data.shipper_nationalAddress || "",
        },
        weight: Number(data.weight),
        Parcels: Number(data.Parcels) || 1,
        dimension: {
          high: Number(data?.boxSize?.height || 0),
          width: Number(data?.boxSize?.width || 0),
          length: Number(data?.boxSize?.length || 0),
        },
        senderOfficeCode: data.senderOfficeCode || undefined,
        recipientOfficeCode: data.recipientOfficeCode || undefined,
      };
      const newShipment = await createShipment(payload).unwrap();
      setModalStatus("success");
      setModalMessage("تمت إضافة الشحنة بنجاح");
      setModalOpen(true);
      await refetchShipments();
      localStorage.setItem("lastShipment", JSON.stringify(newShipment));
      setTimeout(() => {
        router.push("/shipments");
      }, 1200);
    } catch (error: any) {
      setModalStatus("fail");
      setModalMessage(error?.data?.message || "حدث خطأ أثناء إضافة الشحنة");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log(errors);

  return (
    <FormProvider {...methods}>
      <div className="space-y-8  my-16  ">
        <div className="space-y-8 pb-20 ms-8 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="v7-neu-icon bg-gradient-to-br from-[#3498db]/80 to-[#3498db]">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a365d]">
                إنشاء شحنة جديدة
              </h1>
            </div>
          </div>
        </div>

        <div className="v7-neu-card p-8    md:p-10 rounded-2xl bg-[#EFF2F7] shadow-[0_10px_50px_-12px_rgba(52,152,219,0.25)] border border-[#3498db]/15 relative overflow-hidden">
          <div className="relative">
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex items-center justify-between relative">
                {/* Connection line between steps */}
                <div className="absolute top-7 left-0  right-10 h-1  "></div>
                {/* Progress line */}
                <div
                  className={`absolute top-7 rtl:right-1 ltr:left-0  `}
                  style={{
                    width: `${(() => {
                      const company = getValues("company");
                      const shipmentType = getValues("shipmentType");
                      const isSMSAOffices =
                        company === "smsa" && shipmentType === "offices";
                      const totalSteps = isSMSAOffices ? 4 : 3;
                      return ((step - 1) / (totalSteps - 1)) * 100;
                    })()}%`,
                    height: "4px",
                    background: "linear-gradient(to left, #3498db, #2980b9) ",
                    borderRadius: "2px",
                    transition: "all 0.5s",
                    overflow: "hidden",
                  }}
                />

                {/* Step 1 */}
                <div
                  className={`flex flex-col items-center   relative z-0 ${
                    step >= 1 ? "text-[#3498db]" : "text-gry"
                  }`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500   ${
                      step === 1
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : step > 1
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 1 ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <Package className="h-7 w-7" />
                    )}
                  </div>
                  <span className="mt-3 text-sm font-medium">بيانات الشحن</span>
                </div>

                {/* Step 2 */}
                <div
                  className={`flex flex-col items-center relative z-0 ${
                    step >= 2 ? "text-[#3498db]" : "text-gry"
                  }`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step === 2
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : step > 2
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 2 ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <FileText className="h-7 w-7" />
                    )}
                  </div>
                  <span className="mt-3 text-sm font-medium">
                    معلومات الطلب
                  </span>
                </div>

                {/* Step 3 */}
                <div
                  className={`flex flex-col items-center relative z-0  ${
                    step >= 3 ? "text-[#3498db] " : "text-gry"
                  }`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step === 3
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : step > 3
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                        : "v7-neu-icon-sm"
                    }`}
                  >
                    {step > 3 ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <Package className="h-7 w-7" />
                    )}
                  </div>

                  <span className="mt-3 text-sm font-medium">اختر الناقل</span>
                </div>

                {/* Step 4 - SMSA Offices (conditional) */}
                {getValues("company") === "smsa" &&
                  getValues("shipmentType") === "offices" && (
                    <div
                      className={`flex flex-col items-center relative z-0  ${
                        step >= 4 ? "text-[#3498db] " : "text-gry"
                      }`}
                    >
                      <div
                        className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                          step === 4
                            ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
                            : "v7-neu-icon-sm"
                        }`}
                      >
                        <Building className="h-7 w-7" />
                      </div>

                      <span className="mt-3 text-sm font-medium">
                        اختر المكاتب
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Step Content */}
            {step === 1 && <Step1Content nextStep={nextStep} />}
            {step === 2 && (
              <Step2Content nextStep={nextStep} prevStep={prevStep} />
            )}
            {step === 3 && (
              <Step3Content
                prevStep={prevStep}
                nextStep={nextStep}
                onSubmit={async (e: any) => {
                  const company = getValues("company");
                  const shipmentType = getValues("shipmentType");
                  console.log(
                    "Step3 onSubmit - Company:",
                    company,
                    "ShipmentType:",
                    shipmentType
                  );
                  const isSMSAOffices =
                    company === "smsa" && shipmentType === "offices";
                  if (isSMSAOffices) {
                    e.preventDefault();
                    nextStep();
                  } else {
                    // تعيين isSubmitting قبل استدعاء handleSubmit مباشرة
                    setIsSubmitting(true);
                    // handleSubmit يستدعي onSubmit فقط إذا كانت البيانات صحيحة
                    // وإلا لن يستدعيها، لذلك نحتاج callback للأخطاء
                    handleSubmit(
                      async (data) => {
                        await onSubmit(data);
                      },
                      () => {
                        // في حالة وجود أخطاء validation، reset isSubmitting
                        setIsSubmitting(false);
                      }
                    )(e);
                  }
                }}
                selectedProvider={selectedProvider}
                handleProviderSelect={handleProviderSelect}
                shipmentType={shipmentType}
                handleShipmentTypeSelect={handleShipmentTypeSelect}
                isSubmitting={isSubmitting}
              />
            )}
            {step === 4 &&
              getValues("company") === "smsa" &&
              getValues("shipmentType") === "offices" && (
                <Step4Content
                  prevStep={prevStep}
                  onSubmit={async (e: React.FormEvent) => {
                    // تعيين isSubmitting قبل استدعاء handleSubmit مباشرة
                    setIsSubmitting(true);
                    // handleSubmit يستدعي onSubmit فقط إذا كانت البيانات صحيحة
                    // وإلا لن يستدعيها، لذلك نحتاج callback للأخطاء
                    handleSubmit(
                      async (data) => {
                        await onSubmit(data);
                      },
                      () => {
                        // في حالة وجود أخطاء validation، reset isSubmitting
                        setIsSubmitting(false);
                      }
                    )(e);
                  }}
                  isSubmitting={isSubmitting}
                />
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
  );
}

// Step 1 Content
function Step1Content({ nextStep }: { nextStep: () => void }) {
  const {
    setValue,
    trigger,
    formState: { errors },
    watch,
  } = useFormContext();
  const [selectedSender, setSelectedSender] = useState<string | number | null>(
    null
  );
  // Recipient address state moved to RecipientAddressSection
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedSender || !selectedRecipient) return;
    if (
      await trigger([
        "shipper_full_name",
        "shipper_mobile",
        "shipper_city",
        "shipper_city_en",
        "shipper_address",
        "recipient_full_name",
        "recipient_mobile",
        "recipient_city",
        "recipient_city_en",
        "recipient_address",
        "recipient_email",
      ])
    )
      nextStep();
  };
  const isDisabled = !selectedSender || !selectedRecipient;
  return (
    <form onSubmit={handleSubmit} className="space-y-8 ">
      {/* Sender Section */}
      <SenderAddressSection
        selectedSender={selectedSender}
        setSelectedSender={setSelectedSender}
        setValue={setValue}
      />
      {/* Recipient Section */}
      <RecipientAddressSection
        selectedRecipient={selectedRecipient}
        setSelectedRecipient={setSelectedRecipient}
        setValue={setValue}
        initialValues={{
          name: "",
          location: "",
          phone: "",
          city: "",
          country: "",
          address: "",
          email: "",
        }}
      />
      <div className="flex justify-end mt-8">
        <button
          className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground hover:bg-primary/90 h-10 v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] px-8 py-6 text-lg relative overflow-hidden group"
          type="submit"
          disabled={isDisabled}
        >
          <span className="relative z-10 flex items-center">
            التالي
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left mr-2 h-5 w-5 transition-transform group-hover:translate-x-1"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#2980b9] to-[#3498db] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>
    </form>
  );
}

// Step 2 Content
function Step2Content({
  nextStep,
  prevStep,
}: {
  nextStep: () => void;
  prevStep: () => void;
}) {
  const {
    register,
    setValue,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext();
  // const { data: parcelsData, isLoading: isLoadingParcels } =
  //   useGetAllParcelsQuery();
  const paymentMethod = watch("paymentMethod");
  const { data: customerMeData } = useGetCustomerMeQuery();

  // At the top of Step2Content, add:
  const [weightFocused, setWeightFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  // Set customer_address from customerMeData when loaded
  useEffect(() => {
    if (customerMeData?.data?._id) {
      setValue("customerAddress", customerMeData.data._id);
    }
  }, [customerMeData, setValue]);

  // On submit, validate as before
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const valid = await trigger([
      "weight",
      "Parcels",
      "dimension_high",
      "dimension_width",
      "dimension_length",
      "orderDescription",
      "paymentMethod",
      "total",
    ]);
    if (valid == true) {
      nextStep();
    }
  };
  const ErrorMessage = ({ error }: ErrorMessageProps) => {
    const message =
      typeof error === "string"
        ? error
        : (error?.message as string | undefined);
    return message ? (
      <div className="text-red-500 text-sm mt-1">{message}</div>
    ) : null;
  };
  const [openPrivacyModal, setOpenPrivacyModal] = useState(false);
  const watchAll = watch();

  const isDisabled =
    !watchAll.weight ||
    !watchAll.Parcels ||
    !watchAll.paymentMethod ||
    !watchAll.total ||
    !watchAll.orderDescription;
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 2 Section Title */}
        <div className="flex items-center justify-start mb-8">
          <h2 className="text-2xl font-bold text-[#1a365d] ml-3">
            معلومات الطلب
          </h2>
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#3498db] shadow text-white">
            <FileText className="w-5 h-5" />
          </span>
        </div>
        {/* --- Main layout: Cards and Shipment Type --- */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Shipment type (right, 1/3) */}
          <div className="w-full   flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#3498db]" />
              <h2 className="text-xl font-bold text-[#3498db] m-0">
                طريقة الدفع{" "}
              </h2>
            </div>
            <div className="flex gap-4">
              {[
                {
                  value: "الدفع المسبق",
                  label: "الدفع المسبق",
                  desc: "مناسب للدفع قبل الشحن",
                  sendValue: "Prepaid",
                },
                {
                  value: "الدفع عند الاستلام",
                  label: "الدفع عند الاستلام",
                  desc: "مناسب للدفع عند استلام الشحنة",
                  sendValue: "COD",
                },
              ].map((option) => {
                const selected = paymentMethod === option.sendValue;
                return (
                  <div
                    key={option.value}
                    className={` v7-neu-card-inner p-4 cursor-pointer max-w-[200px]
                      flex-1 w-full  rounded-2xl  transition-all
                      flex flex-col items-start 
                      ${
                        selected
                          ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                          : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                      }
                    `}
                    onClick={() => setValue("paymentMethod", option.sendValue)}
                  >
                    <div className=" flex items-center  gap-2 mb-2">
                      <div
                        className={` w-6 h-6 rounded-full v7-neu-inset flex items-center justify-center `}
                      >
                        {selected ? (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        ) : null}
                      </div>
                      <span
                        className={`  font-bold text-lg ${
                          selected ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    <span
                      className={`text-sm ${
                        selected ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {option.desc}
                    </span>
                  </div>
                );
              })}
            </div>
            <ErrorMessage error={errors.paymentMethod} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 ">
          {/* الوزن (كجم) */}
          <motion.div variants={fadeIn}>
            <Label
              htmlFor="weight"
              className="text-xl font-bold text-[#3498db] m-0 flex  items-center gap-4"
            >
              <Scale className="h-5 w-5 text-[#3498db]" />
              الوزن (كجم)
            </Label>
            <div className="v7-neu-card-inner px-6 py-6 w-full min-w-[180px] flex items-center">
              <input
                type="number"
                min={1}
                {...register("weight", { required: true, valueAsNumber: true })}
                placeholder="أدخل الوزن بالـ KG"
                onFocus={() => setWeightFocused(true)}
                onBlur={() => setWeightFocused(false)}
                className="bg-transparent border-none shadow-none outline-none text-base w-full"
                style={weightFocused ? { boxShadow: "0 2px 0 0 #3498db" } : {}}
              />
            </div>
            <ErrorMessage error={errors.weight} />
          </motion.div>

          {/* عدد الصناديق */}
          <motion.div variants={fadeIn}>
            <Label
              htmlFor="Parcels"
              className="text-xl font-bold text-[#3498db] m-0 flex  items-center gap-4"
            >
              <Box className="h-5 w-5 text-[#3498db]" />
              عدد الصناديق
            </Label>
            <div className="v7-neu-card-inner px-6 py-6 w-full min-w-[180px] flex items-center">
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  {...register("Parcels")}
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setValue(
                      "Parcels",
                      Math.max(1, (Number(watch("Parcels")) || 1) - 1)
                    )
                  }
                >
                  <span className="text-lg font-bold">-</span>
                </Button>

                <div className="text-2xl font-bold text-[#3498db]">
                  {watch("Parcels") || 1}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setValue("Parcels", (Number(watch("Parcels")) || 1) + 1)
                  }
                >
                  <span className="text-lg font-bold">+</span>
                </Button>
              </div>
            </div>
            <ErrorMessage error={errors.Parcels} />
          </motion.div>

          {/* وصف محتويات الشحنة */}
          <motion.div variants={fadeIn} className="col-span-1 md:col-span-2">
            <Label
              htmlFor="orderDescription"
              className="text-xl font-bold text-[#3498db] m-0 flex  items-center gap-4"
            >
              <FileText className="h-5 w-5 text-[#3498db]" />
              وصف محتوى الشحنة
            </Label>

            <div className="v7-neu-input-container mt-2">
              <textarea
                placeholder="أدخل وصفاً لمحتويات الشحنة"
                rows={4}
                {...register("orderDescription", { required: "الوصف مطلوب" })}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                className="v7-neu-input text-base min-h-[120px] "
              />
            </div>
            <ErrorMessage error={errors.orderDescription} />
          </motion.div>
        </div>
        {/* الإجمالى والوصف في نفس الصف */}
        <motion.div variants={fadeIn}>
          <Label
            htmlFor="total"
            className="text-base font-medium flex items-center gap-2 mb-2"
          >
            <CreditCard className="text-xl font-bold text-[#3498db] m-0" />
            إجمالي قيمة الطلب
          </Label>
          {watch("paymentMethod") === "COD" && (
            <div className="text-sm text-red-500 my-2">
              ملاحظة مهمة: يجب كتابة المبلغ المراد من الشركة استلامه من العميل.
            </div>
          )}
          <div className="v7-neu-input-container relative overflow-hidden group sm:w-1/2 lg:w-1/3">
            <input
              type="text"
              inputMode="numeric"
              min="0"
              {...register("total", {
                required: "الحقل مطلوب",
                onChange: (e) => {
                  // Allow only numbers and decimal point
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  // Prevent multiple decimal points
                  const parts = value.split(".");
                  const filteredValue =
                    parts.length > 2
                      ? parts[0] + "." + parts.slice(1).join("")
                      : value;
                  setValue("total", filteredValue, { shouldValidate: true });
                },
              })}
              placeholder="أدخل الإجمالى"
              className="v7-neu-input text-base"
            />
          </div>
          <ErrorMessage error={errors.total} />
        </motion.div>
        {/* عنوان العميل (hidden but included in form) */}
        <Label htmlFor="customerAddress" className="hidden">
          عنوان العميل
        </Label>
        <input
          type="text"
          {...register("customerAddress", { required: "عنوان العميل مطلوب" })}
          className="hidden"
        />

        {/* Privacy/terms agreement and navigation buttons remain at the bottom as before */}
        <div className="w-full flex justify-center mt-8">
          <div className="w-full max-w-3xl bg-[#f6fbff] border border-[#b6d6f6] rounded-2xl px-6 py-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-[#1a365d] text-base text-right w-full flex items-center gap-2 justify-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#b6d6f6]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.05 10.74 8.13 11.54.53.39 1.21.39 1.74 0C13.95 21.74 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 17.88C10.19 18.09 5 14.14 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.14-5.19 7.09-7 8.88zM11 14h2v2h-2zm0-8h2v6h-2z"
                      fill="#3498db"
                    />
                  </svg>
                </span>
                بالمتابعة انت تقر بأن المواد المشحونة متوافقة مع قوانين وأنظمة
                السلطات المحلية واشتراطات الأمن والسلامة. أقر بأني أتحمل كامل
                المسؤولية القانونية في حال وجود أي مواد خطرة أو قابلة للإشتعال
                أو غير قانونية سأتحمل شخصياً التبعات القانونية
                والإدارية أو الغرامات.
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            className="border-2 flex items-center gap-2 text-lg px-8 py-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>السابق</span>
          </Button>
          <button
            className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground hover:bg-primary/90 h-10 v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] px-8 py-6 text-lg relative overflow-hidden group"
            type="submit"
            disabled={isDisabled}
          >
            <span className="relative z-10 flex items-center">
              التالي
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left mr-2 h-5 w-5 transition-transform group-hover:translate-x-1"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#2980b9] to-[#3498db] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </form>
      <Privace
        isOpen={openPrivacyModal}
        onClose={() => setOpenPrivacyModal(false)}
      />
    </>
  );
}

// Step 3 Content
function Step3Content({
  prevStep,
  onSubmit,
  selectedProvider,
  handleProviderSelect,
  shipmentType,
  handleShipmentTypeSelect,
  nextStep,
  isSubmitting: parentIsSubmitting = false,
}: any) {
  const {
    register,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useFormContext();
  const values = getValues();

  // التحقق من إذا كان SMSA offices
  const selectedCompany = watch("company");
  const selectedShipmentType = watch("shipmentType");
  const isSMSAOffices =
    selectedCompany === "smsa" && selectedShipmentType === "offices";
  // استخدام isSubmitting من الـ parent
  const isSubmitting = parentIsSubmitting;
  const [boxSizes, setBoxSizes] = useState<any[]>([]);
  const [selectedBoxSize, setSelectedBoxSize] = useState<any>(null);
  const { data: parcelsData, isLoading: isLoadingParcels } =
    useGetAllParcelsQuery();

  // Fetch companies
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetAllShipmentCompaniesQuery();
  const [createShipmentOrder, { data, isLoading, error }] =
    useCreateShipmentOrderMutation();

  // Shipment type tabs
  const shipmentTypes = [
    { label: "الشحن العادي", value: "Dry" },
    { label: "الشحن الدولي", value: "International" },
    { label: "شحن الخزائن", value: "Lockers" },
    { label: "الشحن السريع", value: "Express" },
    { label: "الشحن البارد", value: "Cold" },
  ];

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const company = getValues("company");
    const shipmentType = getValues("shipmentType");
    const isSMSAOffices = company === "smsa" && shipmentType === "offices";

    // إذا كانت SMSA مع المكاتب، اذهب للخطوة التالية (اختيار المكاتب)
    if (isSMSAOffices) {
      nextStep();
      return;
    }

    // للشركات الأخرى، أرسل البيانات مباشرة
    // isSubmitting يتم إدارته في CreateShipmentSteps
    await onSubmit(e);
  };

  const companiesWithTypes = (companiesData || [])
    .flatMap((company: any) => {
      if (!company.shippingTypes || company.shippingTypes.length === 0)
        return [];
      return company.shippingTypes.map((shippingType: any) => ({
        ...company,
        shippingType,
      }));
    })
    .sort((a: any, b: any) => {
      // نحط "Dry" أول شي
      if (a.shippingType.type === "Dry" && b.shippingType.type !== "Dry")
        return -1;
      if (a.shippingType.type !== "Dry" && b.shippingType.type === "Dry")
        return 1;
      return 0; // الباقي حسب الترتيب الأصلي
    });

  const companyData = companiesData?.find(
    (c: any) => c.company === selectedCompany
  );
  const validTypes =
    (companyData as any)?.shippingTypes?.map((t: any) => t.type) || [];
  const shipmentTypeToUse = validTypes.includes(values.shipmentType)
    ? values.shipmentType
    : validTypes[0];

  const handleCompanySelect = (company: string, shippingType: string) => {
    const selected = companiesData?.find((c: any) => c.company === company);
    if (selected) {
      setValue("company", company);
      setValue("shipmentType", shippingType);
      console.log(
        "handleCompanySelect - Company:",
        company,
        "ShippingType:",
        shippingType
      );
      // ✅ ضيف label وخلّي المعرف هو _id
      const sizes = (selected.allowedBoxSizes || []).map((s: any) => ({
        ...s,
        label: s.title || s.label || `${s.length}×${s.width}×${s.height} سم`,
      }));

      setBoxSizes(sizes);
      setSelectedBoxSize(null);
      setValue("boxSize", null); // امسح القدي
    }
  };

  // حالة جلب الأسعار
  const [prices, setPrices] = useState<any[]>([]);
  const [pricesFetched, setPricesFetched] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [priceErrors, setPriceErrors] = useState<any[]>([]);

  // مفتاح البيانات الأساسية (بدون شركة وبدون أبعاد): عند تغييره نجلّي أسعار كل الشركات
  const basePriceKey = `${values.recipient_city}-${values.weight}-${values.total}-${values.paymentMethod}`;
  // مفتاح الأبعاد: عند اختيار شركة + حجم صندوق نعيد حساب سعر تلك الشركة فقط
  const dimensionKey = values.boxSize
    ? `${values.boxSize.length}-${values.boxSize.width}-${values.boxSize.height}`
    : values.dimension_length && values.dimension_width && values.dimension_high
    ? `${values.dimension_length}-${values.dimension_width}-${values.dimension_high}`
    : "";

  const [lastBasePriceKey, setLastBasePriceKey] = useState<string>("");
  const [lastDimensionKey, setLastDimensionKey] = useState<string>("");
  const [lastSelectedCompany, setLastSelectedCompany] = useState<string>("");

  useEffect(() => {
    // تحقق من وجود البيانات المطلوبة
    if (
      !companiesData?.length ||
      !values.recipient_city ||
      !values.weight ||
      !values.total ||
      !values.paymentMethod
    ) {
      setPrices([]);
      setPricesFetched(false);
      return;
    }

    const selectedCompany = values.company || "";

    // بناء قائمة كل الشركات وأنواع الشحن مرة واحدة
    const companiesWithTypes = companiesData.flatMap((company: any) => {
      if (!company.shippingTypes || company.shippingTypes.length === 0) {
        return [];
      }
      return company.shippingTypes.map((shippingType: any) => ({
        ...company,
        shippingType,
      }));
    });

    // دالة لبناء الـ payload لطلب سعر واحد
    const buildPayload = (companyWithType: any, useDimensions: boolean) => {
      const payload: any = {
        company: companyWithType.company,
        shapmentingType: companyWithType.shippingType.type,
        order: {
          customer: {
            full_name: values.recipient_full_name || "",
            mobile: values.recipient_mobile || "",
            email: values.recipient_email || "",
            address: values.recipient_district,
            city: values.recipient_city || "",
            district: values.recipient_district,
            country: "sa",
          },
          description: values.orderDescription || "",
          direction: "straight",
          paymentMethod: values.paymentMethod,
          source: "salla",
          total: { amount: Number(values.total), currency: "SAR" },
          weight: Number(values.weight) || 1,
        },
      };
      if (useDimensions && (values.boxSize || (values.dimension_length && values.dimension_width && values.dimension_high))) {
        if (values.boxSize) {
          payload.dimension = {
            length: Number(values.boxSize.length || 0),
            width: Number(values.boxSize.width || 0),
            high: Number(values.boxSize.height || 0),
          };
        } else {
          payload.dimension = {
            length: Number(values.dimension_length || 0),
            width: Number(values.dimension_width || 0),
            high: Number(values.dimension_high || 0),
          };
        }
      }
      return payload;
    };

    // (1) تغيّر في البيانات الأساسية أو أول مرة: جلب أسعار كل الشركات
    const baseDataChanged = basePriceKey !== lastBasePriceKey;
    const isFirstFetch = !pricesFetched;

    if (baseDataChanged || isFirstFetch) {
      const fetchAllPrices = async () => {
        console.log("جلب أسعار كل الشركات، basePriceKey:", basePriceKey);
        setLoadingPrices(true);
        setPricesFetched(false);
        setPrices([]);
        setPriceErrors([]);

      const retryWithDelay = async (
        fn: () => Promise<any>,
        retries: number = 2,
        delay: number = 1000
      ): Promise<any> => {
        try {
          return await fn();
        } catch (error) {
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retryWithDelay(fn, retries - 1, delay * 1.5);
          }
          throw error;
        }
      };

      const fetchOnePrice = async (companyWithType: any, useDimensions: boolean) => {
        const payload = buildPayload(companyWithType, useDimensions);
        const response = await createShipmentOrder(payload).unwrap();
        return {
          company: companyWithType.company,
          companyId: companyWithType._id,
          type: companyWithType.shippingType.type,
          typeId: companyWithType.shippingType._id,
          price: response?.data?.total || null,
          currency: "SAR",
          success: true,
          allowedBoxSizes: companyWithType.allowedBoxSizes || [],
        };
      };

      const catchToErrorResult = (companyWithType: any, err: any) => {
        let errorMessage = err?.data?.message || err?.message || "خطأ غير معروف";
        if (err?.status === 400) errorMessage = "بيانات الطلب غير صحيحة";
        else if (err?.status === 401) errorMessage = "غير مصرح بالوصول";
        else if (err?.status === 404) errorMessage = "الخدمة غير متوفرة";
        return {
          company: companyWithType.company,
          companyId: companyWithType._id,
          type: companyWithType.shippingType.type,
          typeId: companyWithType.shippingType._id,
          error: errorMessage,
          success: false,
          allowedBoxSizes: companyWithType.allowedBoxSizes || [],
        };
      };

      try {
        const pricePromises = companiesWithTypes.map(
          async (companyWithType: any) => {
            try {
              return await retryWithDelay(() =>
                fetchOnePrice(companyWithType, true)
              );
            } catch (err: any) {
              return catchToErrorResult(companyWithType, err);
            }
          }
        );
        const results = await Promise.all(pricePromises);
        const successfulPrices = results.filter((r: any) => r.success);
        const failedPrices = results.filter((r: any) => !r.success);
        setPrices(successfulPrices);
        setPriceErrors(failedPrices);
        setPricesFetched(true);
        setLastBasePriceKey(basePriceKey);
        setLastDimensionKey(dimensionKey);
        setLastSelectedCompany(selectedCompany);
        console.log(`تم جلب أسعار كل الشركات: ${successfulPrices.length} ناجح`);
      } catch (error) {
        console.error("خطأ عام في جلب الأسعار:", error);
        setPriceErrors([{ error: "فشل في جلب الأسعار" }]);
        setPricesFetched(true);
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchAllPrices();
    return;
    }

    // (2) نفس البيانات الأساسية، لكن تغيّر الشركة المختارة أو حجم الصندوق: نحدّث سعر الشركة المختارة فقط ونبقي الباقي
    const onlyCompanyOrDimensionsChanged =
      selectedCompany &&
      (dimensionKey !== lastDimensionKey || selectedCompany !== lastSelectedCompany);

    if (onlyCompanyOrDimensionsChanged && pricesFetched) {
      const targetList = companiesWithTypes.filter(
        (c: any) => c.company === selectedCompany
      );
      if (targetList.length === 0) return;

      const refetchSelectedCompanyOnly = async () => {
        const retryWithDelay = async (
          fn: () => Promise<any>,
          retries: number = 2,
          delay: number = 1000
        ): Promise<any> => {
          try {
            return await fn();
          } catch (error) {
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay));
              return retryWithDelay(fn, retries - 1, delay * 1.5);
            }
            throw error;
          }
        };
        const fetchOne = async (companyWithType: any) => {
          const payload = buildPayload(companyWithType, true);
          const response = await createShipmentOrder(payload).unwrap();
          return {
            company: companyWithType.company,
            companyId: companyWithType._id,
            type: companyWithType.shippingType.type,
            typeId: companyWithType.shippingType._id,
            price: response?.data?.total || null,
            currency: "SAR",
            success: true,
            allowedBoxSizes: companyWithType.allowedBoxSizes || [],
          };
        };
        const toError = (companyWithType: any, err: any) => ({
          company: companyWithType.company,
          companyId: companyWithType._id,
          type: companyWithType.shippingType.type,
          typeId: companyWithType.shippingType._id,
          error: err?.data?.message || err?.message || "خطأ غير معروف",
          success: false,
          allowedBoxSizes: companyWithType.allowedBoxSizes || [],
        });
        setLoadingPrices(true);
        try {
          const newResults = await Promise.all(
            targetList.map(async (companyWithType: any) => {
              try {
                return await retryWithDelay(() => fetchOne(companyWithType));
              } catch (err: any) {
                return toError(companyWithType, err);
              }
            })
          );
          const successfulNew = newResults.filter((r: any) => r.success);
          setPrices((prev) => {
            const rest = prev.filter((p: any) => p.company !== selectedCompany);
            return [...rest, ...successfulNew];
          });
          setLastDimensionKey(dimensionKey);
          setLastSelectedCompany(selectedCompany);
          console.log(`تم تحديث سعر الشركة المختارة فقط: ${selectedCompany}`);
        } catch (e) {
          console.error("خطأ عند تحديث سعر الشركة المختارة:", e);
        } finally {
          setLoadingPrices(false);
        }
      };

      refetchSelectedCompanyOnly();
    }
  }, [
    companiesData,
    basePriceKey,
    dimensionKey,
    values.company,
    lastBasePriceKey,
    lastDimensionKey,
    lastSelectedCompany,
    pricesFetched,
    createShipmentOrder,
  ]);
  console.log("values", values);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className=" flex items-center gap-2">
          <div className=" v7-neu-icon-sm bg-gradient-to-br from-[#3498db]/80 to-[#3498db]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-truck h-5 w-5 text-white"
            >
              <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
              <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
              <circle cx="7" cy="18" r="2" />
              <path d="M15 18H9" />
              <circle cx="17" cy="18" r="2" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#1a365d]">إختر الناقل</h2>
        </div>
        {/* عرض حالة جلب الأسعار */}
        {loadingPrices && (
          <div className="v7-neu-card p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3498db]"></div>
              <span className="text-[#1a365d] font-medium">
                جاري جلب أسعار الشحن من جميع الشركات...
              </span>
            </div>
            <div className="mt-3 text-center text-sm text-gray-600">
              هذا قد يستغرق بضع ثوان
            </div>
          </div>
        )}

        {/* عرض الأخطاء إن وجدت */}
        {priceErrors.length > 0 && !loadingPrices && (
          <div className="v7-neu-card p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-red-700 font-medium">
                تعذر جلب أسعار بعض الشركات:
              </span>
            </div>
            <div className="text-sm text-red-600 space-y-2">
              {priceErrors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-200"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="font-medium text-red-800">
                      {error.company} - {error.type}
                    </div>
                    <div className="text-red-600 text-xs mt-1">
                      {error.error}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between mt-3 p-2 bg-red-50 rounded border border-red-200">
                <div className="text-xs text-red-500">
                  💡 نصيحة: إذا استمر الخطأ، جرب الرجوع للخطوة السابقة والعودة
                  مرة أخرى
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPricesFetched(false);
                    setLastBasePriceKey("");
                  }}
                  className="text-xs border-red-300 text-red-600 hover:bg-red-100"
                >
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {isLoadingCompanies ? (
            <div className="v7-neu-card p-6 rounded-2xl">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3498db]"></div>
                <span>جاري تحميل شركات الشحن...</span>
              </div>
            </div>
          ) : (
            companiesWithTypes?.map((company: any) => {
              const { shippingType } = company;
              const logoSrc = (function getCompanyLogo(
                companyName: string
              ): string {
                const map: Record<string, string> = {
                  redbox: `/companies/redBox.png`,
                  smsa: "/companies/smsa.jpg",
                  smsapro: "/companies/smsa.jpg",
                  omniclama: "/companies/lamaBox.png",
                  aramex: `/companies/araMex.png`,
                };
                return (
                  map[company.company.toLowerCase()] ||
                  "/carriers/carrier-placeholder.png"
                );
              })(company.company);

              const isSelected = selectedCompany === company.company;

              return (
                <CarrierCard
                  key={company.shippingType._id + company.shippingType.type}
                  company={company}
                  selectedCompany={selectedCompany}
                  handleCompanySelect={() =>
                    handleCompanySelect(
                      company.company,
                      company.shippingType.type
                    )
                  }
                  logoSrc={logoSrc}
                  firstType={company.shippingType}
                  values={values}
                  prices={prices}
                  loadingPrices={loadingPrices}
                  pricesFetched={pricesFetched}
                  boxSizes={boxSizes}
                  selectedBoxSize={selectedBoxSize}
                  setValue={setValue}
                  setSelectedBoxSize={setSelectedBoxSize}
                  parcelsData={
                    Array.isArray(parcelsData)
                      ? parcelsData
                      : (parcelsData as any)?.data || []
                  }
                  error={
                    typeof error === "string"
                      ? error
                      : (error as any)?.message || ""
                  }
                  setBoxSizes={setBoxSizes}
                  companiesData={companiesData}
                />
              );
            })
          )}
        </div>
      </div>
      <OrderSummaryAndFragileTips
        values={values}
        prices={prices}
        loadingPrices={loadingPrices}
        pricesFetched={pricesFetched}
        selectedCompany={selectedCompany}
      />

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="border-2 text-lg px-8 py-4"
        >
          السابق
        </Button>
        <Button
          type={isSMSAOffices ? "button" : "submit"}
          onClick={isSMSAOffices ? nextStep : undefined}
          className="bg-gradient-to-r from-[#1e3a6c]  text-white  text-lg px-8 py-4 flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري إنشاء الشحنة...</span>
            </>
          ) : isSMSAOffices ? (
            "التالي"
          ) : (
            "إنشاء الشحنة"
          )}
        </Button>
      </div>
    </form>
  );
}

// InputField and SelectField components
function InputField({
  name,
  label,
  register,
  error,
  type = "text",
  readOnly,
  loading = false,
  placeholder,
  icon: Icon,
}: any) {
  if (readOnly) return null;
  return (
    <div className="space-y-2">
      <label className=" mb-2 font-bold text-[#1a365d] text-center flex items-center gap-1 justify-center w-full">
        {Icon && <Icon className="w-5 h-5 text-[#3498db]" />}
        <span>{label}</span>
        <span className="text-red-500">*</span>
      </label>
      <Input
        id={name}
        type={type}
        {...register(name)}
        className={cn(
          "w-full rounded-2xl border bg-[#f6fbff] px-4 py-3 text-right text-[#1a365d] placeholder:text-[#b0b7c3] font-normal transition-all focus:outline-none",
          error
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-[#e3eaf3] focus:border-[#3498db]"
        )}
        placeholder={placeholder}
      />
      {loading && (
        <div className="text-xs text-blue-500">جاري جلب بيانات الطلب...</div>
      )}
      {error?.message && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
}

function SelectField({ name, label, error }: any) {
  const { control } = useFormContext();
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
                error
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-gray-200 focus-visible:ring-blue-500"
              )}
            >
              <SelectValue placeholder={`اختر ${label}`} />
            </SelectTrigger>
            <SelectContent
              className="w-[150px] max-h-[200px] overflow-y-auto"
              position="popper"
              sideOffset={4}
            >
              {cities.map((city: string) => (
                <SelectItem
                  key={city}
                  value={city}
                  className="py-1.5 px-2 text-sm text-center"
                >
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

// Step 4 Content - SMSA Offices Selection
function Step4Content({
  prevStep,
  onSubmit,
  isSubmitting: parentIsSubmitting = false,
}: {
  prevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}) {
  const {
    register,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useFormContext();
  // استخدام isSubmitting من الـ parent
  const isSubmitting = parentIsSubmitting;

  const {
    data: officesData,
    isLoading: isLoadingOffices,
    error: officesError,
  } = useGetSMSAOfficesQuery();

  // officesData يجب أن يكون array مباشرة بعد transformResponse
  const offices = Array.isArray(officesData) ? officesData : [];

  console.log("Step4 - Offices API Response:", {
    officesData,
    officesCount: offices.length,
    isLoadingOffices,
    officesError,
    sampleOffice: offices[0],
  });

  const shipperCity = watch("shipper_city");
  const shipperCityEn = watch("shipper_city_en");
  const recipientCity = watch("recipient_city");
  const recipientCityEn = watch("recipient_city_en");
  const senderOfficeCode = watch("senderOfficeCode");
  const recipientOfficeCode = watch("recipientOfficeCode");

  // State للبحث في المكاتب
  const [senderSearchQuery, setSenderSearchQuery] = useState("");
  const [recipientSearchQuery, setRecipientSearchQuery] = useState("");

  // دالة لحساب نسبة التشابه بين سلسلتين
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (!str1 || !str2) return 0;

    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // إذا كانا متطابقين تماماً
    if (s1 === s2) return 1;

    // إذا كان أحدهما يحتوي على الآخر
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;

    // حساب التشابه البسيط بناءً على الأحرف المشتركة
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  // دالة حساب مسافة ليفنشتاين البسيطة
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  // دالة لتطبيع أسماء المدن (إزالة الكلمات الشائعة)
  const normalizeCityName = (cityName: string): string => {
    if (!cityName) return "";
    let normalized = cityName.trim();

    // إزالة الكلمات الشائعة
    const commonWords = [
      "المكرمة",
      "المنورة",
      "المحمدية",
      "القديمة",
      "الجديدة",
      "الشمالية",
      "الجنوبية",
      "الشرقية",
      "الغربية",
    ];

    commonWords.forEach((word) => {
      normalized = normalized.replace(new RegExp(`\\s*${word}\\s*`, "gi"), "");
    });

    return normalized.trim();
  };

  // دالة للمقارنة المرنة مع cityName مع الأولوية للاسم الإنجليزي
  const matchesCity = (
    office: any,
    cityArabic: string,
    cityEnglish?: string
  ) => {
    if (!office) return false;

    const officeCity = (office.cityName || "").trim();
    const cityArabicTrimmed = (cityArabic || "").trim();
    const cityEnglishTrimmed = (cityEnglish || "").trim();

    // إذا لم يكن هناك لا اسم عربي ولا إنجليزي، نرفض
    if (!cityArabicTrimmed && !cityEnglishTrimmed) {
      console.log("matchesCity: No city names provided", {
        cityArabic,
        cityEnglish,
      });
      return false;
    }

    // تطبيع الأسماء
    const normalizedArabic = normalizeCityName(cityArabicTrimmed);
    const normalizedEnglish = normalizeCityName(cityEnglishTrimmed);
    const normalizedOfficeCity = normalizeCityName(officeCity);

    // الأولوية للاسم الإنجليزي إذا كان متوفراً
    const primaryCityName = cityEnglishTrimmed || cityArabicTrimmed;
    const normalizedPrimary = cityEnglishTrimmed
      ? normalizedEnglish
      : normalizedArabic;

    // 1. المقارنة الدقيقة مع الاسم الأساسي (الإنجليزي أو العربي)
    if (officeCity.toLowerCase() === primaryCityName.toLowerCase()) {
      return true;
    }

    // 2. المقارنة الدقيقة مع الاسم الإنجليزي إذا كان مختلفاً
    if (
      cityEnglishTrimmed &&
      officeCity.toLowerCase() === cityEnglishTrimmed.toLowerCase()
    ) {
      return true;
    }

    // 3. المقارنة الدقيقة مع الاسم العربي
    if (cityArabicTrimmed && officeCity === cityArabicTrimmed) {
      return true;
    }

    // 4. المقارنة بدون case sensitivity للعربية
    if (
      cityArabicTrimmed &&
      officeCity.toLowerCase() === cityArabicTrimmed.toLowerCase()
    ) {
      return true;
    }

    // 5. المقارنة بعد التطبيع مع الاسم الأساسي
    if (
      normalizedOfficeCity.toLowerCase() === normalizedPrimary.toLowerCase()
    ) {
      return true;
    }

    // 6. البحث الجزئي مع الاسم الأساسي
    if (officeCity.toLowerCase().includes(primaryCityName.toLowerCase())) {
      return true;
    }

    // 7. البحث الجزئي مع الاسم العربي
    if (
      cityArabicTrimmed &&
      normalizedOfficeCity
        .toLowerCase()
        .includes(normalizedArabic.toLowerCase())
    ) {
      return true;
    }

    // 8. البحث الجزئي مع الاسم الإنجليزي
    if (
      cityEnglishTrimmed &&
      normalizedOfficeCity
        .toLowerCase()
        .includes(normalizedEnglish.toLowerCase())
    ) {
      return true;
    }

    // 9. معالجة حالات خاصة
    // مكة = Makkah
    if (
      (cityArabicTrimmed === "مكة" ||
        normalizedArabic === "مكة" ||
        cityEnglishTrimmed === "Makkah" ||
        normalizedEnglish === "Makkah") &&
      (officeCity === "Makkah" || officeCity.toLowerCase().includes("makkah"))
    ) {
      return true;
    }

    // المدينة = Madinah
    if (
      (cityArabicTrimmed === "المدينة" ||
        normalizedArabic === "المدينة" ||
        cityEnglishTrimmed === "Madinah" ||
        normalizedEnglish === "Madinah") &&
      (officeCity === "Madinah" || officeCity.toLowerCase().includes("madinah"))
    ) {
      return true;
    }

    // 10. مقارنة التشابه مع الاسم الأساسي (60%)
    const similarityThreshold = 0.6;
    if (
      calculateSimilarity(primaryCityName, officeCity) >= similarityThreshold
    ) {
      return true;
    }

    // 11. مقارنة التشابه مع الاسم العربي إذا كان مختلفاً
    if (
      cityArabicTrimmed &&
      cityArabicTrimmed !== primaryCityName &&
      calculateSimilarity(cityArabicTrimmed, officeCity) >= similarityThreshold
    ) {
      return true;
    }

    // 12. مقارنة التشابه مع الاسم الإنجليزي إذا كان مختلفاً
    if (
      cityEnglishTrimmed &&
      cityEnglishTrimmed !== primaryCityName &&
      calculateSimilarity(cityEnglishTrimmed, officeCity) >= similarityThreshold
    ) {
      return true;
    }

    console.log("matchesCity: No match found", {
      officeCity,
      primaryCityName,
      cityArabicTrimmed,
      cityEnglishTrimmed,
    });

    return false;
  };

  // فلترة مكاتب المرسل منفصلة تماماً
  const shipperOfficesByCity = offices.filter((office: any) => {
    // منطق خاص للمرسل فقط
    const effectiveShipperCityEn = shipperCityEn || shipperCity;
    const result = matchesCity(office, shipperCity, effectiveShipperCityEn);

    if (result) {
      console.log("Shipper Office Match:", {
        officeCode: office.code,
        officeCity: office.cityName,
        shipperCity,
        effectiveShipperCityEn,
      });
    }

    return result;
  });

  // فلترة مكاتب المستلم منفصلة تماماً
  const recipientOfficesByCity = offices.filter((office: any) => {
    // منطق خاص للمستلم فقط
    const effectiveRecipientCityEn = recipientCityEn || recipientCity;
    const result = matchesCity(office, recipientCity, effectiveRecipientCityEn);

    if (result) {
      console.log("Recipient Office Match:", {
        officeCode: office.code,
        officeCity: office.cityName,
        recipientCity,
        effectiveRecipientCityEn,
      });
    }

    return result;
  });

  // مقارنة شاملة بين المرسل والمستلم
  console.log("Shipper vs Recipient Comparison:", {
    shipperCity,
    recipientCity,
    shipperCityEn,
    recipientCityEn,
    shipperCityEnType: typeof shipperCityEn,
    recipientCityEnType: typeof recipientCityEn,
    shipperOfficesCount: shipperOfficesByCity.length,
    recipientOfficesCount: recipientOfficesByCity.length,
    shipperHasCity: !!shipperCity,
    recipientHasCity: !!recipientCity,
    shipperHasCityEn: !!shipperCityEn,
    recipientHasCityEn: !!recipientCityEn,
    citiesMatch: shipperCity === recipientCity,
    cityEnMatch: shipperCityEn === recipientCityEn,
  });

  // مكاتب المرسل والمستلم مستقلة تماماً

  // دالة للبحث في العنوان
  const matchesSearch = (office: any, searchQuery: string) => {
    if (!searchQuery || !searchQuery.trim()) return true;

    const query = searchQuery.trim().toLowerCase();
    const addressAR = (office.addressAR || "").toLowerCase();
    const address = (office.address || "").toLowerCase();
    const code = (office.code || "").toLowerCase();

    return (
      addressAR.includes(query) ||
      address.includes(query) ||
      code.includes(query)
    );
  };

  // Filter offices by city AND search query
  const shipperOffices = shipperOfficesByCity.filter((office: any) => {
    return matchesSearch(office, senderSearchQuery);
  });

  const recipientOffices = recipientOfficesByCity.filter((office: any) => {
    return matchesSearch(office, recipientSearchQuery);
  });

  // Debug logs
  console.log("Step4 - Offices Filtering:", {
    totalOffices: offices.length,
    shipperCity,
    recipientCity,
    shipperCityEnglish: shipperCityEn || shipperCity,
    recipientCityEnglish: recipientCityEn || recipientCity,
    shipperOfficesCount: shipperOffices.length,
    recipientOfficesCount: recipientOffices.length,
    shipperOffices: shipperOffices.map((o: any) => ({
      code: o.code,
      cityName: o.cityName,
      addressAR: o.addressAR,
    })),
    recipientOffices: recipientOffices.map((o: any) => ({
      code: o.code,
      cityName: o.cityName,
      addressAR: o.addressAR,
    })),
  });

  // Debug للمقارنة بين المرسل والمستلم
  console.log("Office Filtering Debug:", {
    shipperCity,
    recipientCity,
    shipperCityEn,
    recipientCityEn,
    shipperCityEnType: typeof shipperCityEn,
    recipientCityEnType: typeof recipientCityEn,
    effectiveShipperCityEn: shipperCityEn || shipperCity,
    effectiveRecipientCityEn: recipientCityEn || recipientCity,
    shipperOfficesByCityCount: shipperOfficesByCity.length,
    recipientOfficesByCityCount: recipientOfficesByCity.length,
    shipperMatches:
      shipperOfficesByCity.length > 0 ? "يوجد مكاتب" : "لا يوجد مكاتب",
    recipientMatches:
      recipientOfficesByCity.length > 0 ? "يوجد مكاتب" : "لا يوجد مكاتب",
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Sender Office Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3498db]" />
            اختر مكتب المرسل ({shipperCity || "المدينة"})
          </h3>

          {/* Search Input for Sender Offices */}
          {!isLoadingOffices && shipperOfficesByCity.length > 0 && (
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن عنوان المكتب أو الكود..."
                value={senderSearchQuery}
                onChange={(e) => setSenderSearchQuery(e.target.value)}
                className="pr-10 w-full v7-neu-input"
              />
            </div>
          )}

          {isLoadingOffices ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3498db] mx-auto"></div>
              <p className="mt-2 text-gray-500">جاري جلب المكاتب...</p>
            </div>
          ) : shipperOfficesByCity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد مكاتب متاحة في {shipperCity || "هذه المدينة"}
            </div>
          ) : shipperOffices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد نتائج للبحث "{senderSearchQuery}" في{" "}
              {shipperCity || "هذه المدينة"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shipperOffices.map((office: any) => (
                <div
                  key={office.code}
                  onClick={() => setValue("senderOfficeCode", office.code)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    senderOfficeCode === office.code
                      ? "border-[#3498db] bg-[#3498db]/5"
                      : "border-gray-200 hover:border-[#3498db]/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1a365d] mb-1">
                        {office.addressAR ||
                          office.address ||
                          "عنوان غير متوفر"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        المدينة: {office.cityName || "غير محدد"}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        الكود: {office.code}
                      </p>
                      {office.firstShift && (
                        <p className="text-xs text-gray-500">
                          دوام: {office.firstShift}
                        </p>
                      )}
                    </div>
                    <input
                      type="radio"
                      checked={senderOfficeCode === office.code}
                      onChange={() => setValue("senderOfficeCode", office.code)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.senderOfficeCode && (
            <p className="text-sm text-red-500">
              {errors.senderOfficeCode.message as string}
            </p>
          )}
        </div>

        {/* Recipient Office Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1a365d] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#3498db]" />
            اختر مكتب المستلم ({recipientCity || "المدينة"})
          </h3>

          {/* Search Input for Recipient Offices */}
          {!isLoadingOffices && recipientOfficesByCity.length > 0 && (
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث عن عنوان المكتب أو الكود..."
                value={recipientSearchQuery}
                onChange={(e) => setRecipientSearchQuery(e.target.value)}
                className="pr-10 w-full v7-neu-input"
              />
            </div>
          )}

          {isLoadingOffices ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3498db] mx-auto"></div>
              <p className="mt-2 text-gray-500">جاري جلب المكاتب...</p>
            </div>
          ) : recipientOfficesByCity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد مكاتب متاحة في {recipientCity || "هذه المدينة"}
            </div>
          ) : recipientOffices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد نتائج للبحث "{recipientSearchQuery}" في{" "}
              {recipientCity || "هذه المدينة"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipientOffices.map((office: any) => (
                <div
                  key={office.code}
                  onClick={() => setValue("recipientOfficeCode", office.code)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    recipientOfficeCode === office.code
                      ? "border-[#3498db] bg-[#3498db]/5"
                      : "border-gray-200 hover:border-[#3498db]/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1a365d] mb-1">
                        {office.addressAR ||
                          office.address ||
                          "عنوان غير متوفر"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        المدينة: {office.cityName || "غير محدد"}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        الكود: {office.code}
                      </p>
                      {office.firstShift && (
                        <p className="text-xs text-gray-500">
                          دوام: {office.firstShift}
                        </p>
                      )}
                    </div>
                    <input
                      type="radio"
                      checked={recipientOfficeCode === office.code}
                      onChange={() =>
                        setValue("recipientOfficeCode", office.code)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.recipientOfficeCode && (
            <p className="text-sm text-red-500">
              {errors.recipientOfficeCode.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="border-2 text-lg px-8 py-4"
        >
          السابق
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#1e3a6c] text-white text-lg px-8 py-4 flex items-center justify-center gap-2"
          disabled={!senderOfficeCode || !recipientOfficeCode || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري إنشاء الشحنة...</span>
            </>
          ) : (
            "إنشاء الشحنة"
          )}
        </Button>
      </div>
    </form>
  );
}
