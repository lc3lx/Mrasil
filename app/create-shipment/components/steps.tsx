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
} from "lucide-react";
import ResponseModal from "../../components/ResponseModal";
import { yupResolver } from '@hookform/resolvers/yup';

import {
  useCreateShipmentMutation,
  useGetMyShipmentsQuery,
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
import { useSearchParams } from 'next/navigation';
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

const providerOptions = [
  {
    key: "redbox",
    label: "redbox",
    notes: "redbox يجب ادخال الأبعاد، الطول والعرض والإرتفاع",
  },
  { key: "smsa", label: "سمسا", notes: "سمسا لا تشحن إلى بعض المناطق" },
  { key: "thabit", label: "ثابت", notes: "ثابت لا تشحن الى محايل" },
  // ... add more as needed
];

const schema = yup
  .object({
    shipper_full_name: yup.string(),
    shipper_mobile: yup.string(), // no validation
    shipper_city: yup.string(),
    shipper_address: yup.string(),
    recipient_full_name: yup.string(),
    recipient_mobile: yup.string(), // no validation
    recipient_city: yup.string(),
    recipient_address: yup.string(),
    recipient_email: yup.string(),
    recipient_district: yup.string(),
    weight: yup.number(),
    Parcels: yup.number(),
    dimension_high: yup.number(),
    dimension_width: yup.number(),
    dimension_length: yup.number(),
    paymentMethod: yup.string(),
    company: yup.string(),
    shipmentType: yup.string(),
    orderDescription: yup.string(),
    total: yup.number().optional(),
    description: yup.string().optional(),
    customerAddress: yup.string().optional(),
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
  const initialStepParam = searchParams.get('step');
  const initialStep = initialStepParam ? parseInt(initialStepParam) : 1;
  const [step, setStep] = useState(initialStep);

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
      recipient_email: "",
      recipient_district: "",
      // Step 2
      weight: 0,
      Parcels: 1,
      dimension_high: 0,
      dimension_width: 0,
      dimension_length: 0,
      // Step 3
      paymentMethod: "",
      // Provider
      company: providerOptions[0].label,
      shipmentType: shipmentType,
      orderDescription: providerOptions[0].notes,
      total: 0,
      description: "",
      customerAddress: "",
    },
  });
  const {
    handleSubmit,
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
          recipient_address: order.clientAddress?.clientAddress || "",
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
  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Provider selection
  const handleProviderSelect = (provider: (typeof providerOptions)[0]) => {
    setSelectedProvider(provider);
    setValue("company", provider.label);
    setValue("orderDescription", provider.notes);
  };
  // Shipment type selection
  const handleShipmentTypeSelect = (type: string) => {
    setShipmentType(type);
    setValue("shipmentType", type);
  };

  // Final submit
  const onSubmit = async (data: any) => {
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
            country: "sa",
            address: data.recipient_address,
            email: data.recipient_email || "",
            district: data.recipient_district || undefined,
          },
          total: data.total,
          description: data.description,
          customerAddress: data.customerAddress,
        },
        shipperAddress: {
          full_name: data.shipper_full_name,
          mobile: data.shipper_mobile, // send as entered
          city: data.shipper_city,
          country: "sa",
          address: data.shipper_address,
        },
        weight: Number(data.weight),
        Parcels: Number(data.Parcels) || 1,
        dimension: {
          high: Number(data.dimension_high),
          width: Number(data.dimension_width),
          length: Number(data.dimension_length),
        },
      };
      await createShipment(payload).unwrap();
      setModalStatus("success");
      setModalMessage("تمت إضافة الشحنة بنجاح");
      setModalOpen(true);
      await refetchShipments();
      setTimeout(() => {
        router.push("/shipments");
      }, 1200);
    } catch (error: any) {
      setModalStatus("fail");
      setModalMessage(error?.data?.message || "حدث خطأ أثناء إضافة الشحنة");
      setModalOpen(true);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-8  my-16 ">
        <div className="space-y-8 pb-20 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="v7-neu-icon bg-gradient-to-br from-[#3498db]/80 to-[#3498db]">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#1a365d]">
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
                <div className="absolute top-7 left-0  right-10 h-1 bg-gray-200 max-w-[80rem] "></div>
                {/* Progress line */}
                <div
                  className="absolute top-7 rtl:right-1 ltr:left-0 "
                  style={{
                    width: `${(step - 1) * 50}%  `,
                    height: "4px",
                    background: "linear-gradient(to left, #3498db, #2980b9) ",
                    borderRadius: "2px",
                    transition: "all 0.5s",
                    overflow: "hidden",
                  }}
                />

                {/* Step 1 */}
                <div
                  className={`flex flex-col items-center   relative z-10 ${
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
                  className={`flex flex-col items-center relative z-10 ${
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
                  className={`flex flex-col items-center relative z-10 ${
                    step >= 3 ? "text-[#3498db]" : "text-gry"
                  }`}
                >
                  <div
                    className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500 ${
                      step === 3
                        ? "bg-gradient-to-br from-[#3498db]/95 to-[#3498db] text-white shadow-lg shadow-[#3498db]/30"
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
            {step === 1 && <Step1Content nextStep={nextStep} />}
            {step === 2 && (<Step2Content nextStep={nextStep} prevStep={prevStep} />
            )}
            {step === 3 && (
              <Step3Content
                prevStep={prevStep}
                onSubmit={handleSubmit(onSubmit)}
                selectedProvider={selectedProvider}
                handleProviderSelect={handleProviderSelect}
                shipmentType={shipmentType}
                handleShipmentTypeSelect={handleShipmentTypeSelect}
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
  // Fetch client addresses from API
  // const { data: clientAddressesData, isLoading, error } = useGetAllClientAddressesQuery()
  // Mutation for creating a new client address
  // const [createClientAddress, { isLoading: isCreating, error: createError }] = useCreateClientAddressMutation()
  // const [deleteClientAddress, { isLoading: isDeleting }] = useDeleteClientAddressMutation()
  // const [updateClientAddress, { isLoading: isUpdating, error: updateError }] = useUpdateClientAddressMutation()

  // Sender address state moved to SenderAddressSection
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
        "shipper_address",
        "recipient_full_name",
        "recipient_mobile",
        "recipient_city",
        "recipient_address",
        "recipient_email",
      ])
    )
      nextStep();
  };

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
      />
      <div className="flex justify-end mt-8">
        <button
          className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground hover:bg-primary/90 h-10 v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] px-8 py-6 text-lg relative overflow-hidden group"
          type="submit"
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
  const { data: parcelsData, isLoading: isLoadingParcels } =
    useGetAllParcelsQuery();
  const paymentMethod = watch("paymentMethod");
  const { data: customerMeData } = useGetCustomerMeQuery();

  // Watch for dimension values
  const dimension_length = watch("dimension_length");
  const dimension_width = watch("dimension_width");
  const dimension_high = watch("dimension_high");

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
    if (
      await trigger([
        "weight",
        "Parcels",
        "dimension_high",
        "dimension_width",
        "dimension_length",
        "orderDescription",
        "paymentMethod",
      ])
    )
      nextStep();
  };
  
  
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
          {/* Parcel size cards (left, 2/3) */}
          <div className="flex-1">
            <ParcelSizeSection
              parcelsData={parcelsData}
              setValue={setValue}
              errors={errors}
            />
          </div>
          {/* Shipment type (right, 1/3) */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
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
                    className={` v7-neu-card-inner p-4 cursor-pointer
                      flex-1 max-w-[220px] rounded-2xl  transition-all
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
                      <span
                        className={`
                          flex items-center justify-center w-6 h-6 rounded-full border-2
                          ${
                            selected
                              ? "border-blue-500 bg-white"
                              : "border-gray-300 bg-white"
                          }
                          transition-all
                          `}
                      >
                        {selected ? (
                          <span className="block w-3 h-3 rounded-full bg-blue-500" />
                        ) : null}
                      </span>
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
          </div>
        </div>
        {/* Inputs row: weight, parcels, description */}
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
                {...register("weight")}
                placeholder="أدخل وزن الشحنة"
                onFocus={() => setWeightFocused(true)}
                onBlur={() => setWeightFocused(false)}
                className="bg-transparent border-none shadow-none outline-none text-base w-full"
                style={weightFocused ? { boxShadow: "0 2px 0 0 #3498db" } : {}}
              />
            </div>
            {errors.weight && typeof errors.weight.message === "string" && (
              <div className="text-red-500 text-sm mt-1">
                {errors.weight.message}
              </div>
            )}
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
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                className="v7-neu-input text-base min-h-[120px] "
              />
            </div>
            {errors.orderDescription &&
              typeof errors.orderDescription.message === "string" && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.orderDescription.message}
                </div>
              )}
          </motion.div>
        </div>
        {/* الإجمالى والوصف في نفس الصف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={fadeIn}>
            <Label
              htmlFor="total"
              className="text-base font-medium flex items-center gap-2 mb-2"
            >
              <CreditCard className="text-xl font-bold text-[#3498db] m-0" />
              الإجمالى
            </Label>
            <div className="v7-neu-input-container relative overflow-hidden group">
              <input
                type="number"
                {...register("total")}
                placeholder="أدخل الإجمالى"
                className="v7-neu-input text-base"
              />
            </div>
            {errors.total && typeof errors.total.message === "string" && (
              <div className="text-red-500 text-sm mt-1">
                {errors.total.message}
              </div>
            )}
          </motion.div>
        </div>
        {/* عنوان العميل (hidden but included in form) */}
        <Label htmlFor="customerAddress" className="hidden">
          عنوان العميل
        </Label>
        <input
          type="text"
          {...register("customerAddress")}
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
                الموافقة على سياسة الخصوصية
              </span>
            </div>
            <div className="bg-white/60 rounded-xl px-4 py-3 text-sm text-[#6b7a90] border border-[#e3eaf3] text-right">
              بالمتابعة، أنت توافق على{" "}
              <a
                href="#"
                className="text-[#3498db] font-bold underline hover:text-blue-700"
              >
                شروط الخدمة وسياسة الخصوصية
              </a>{" "}
              الخاصة بنا
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
}: any) {
  const {
    register,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useFormContext();
  const values = getValues();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fetch companies
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetAllShipmentCompaniesQuery();
  // Shipment type tabs
  const shipmentTypes = [
    { label: "الشحن العادي", value: "Dry" },
    { label: "الشحن الدولي", value: "International" },
    { label: "شحن الخزائن", value: "Lockers" },
    { label: "الشحن السريع", value: "Express" },
    { label: "الشحن البارد", value: "Cold" },
  ];
  const [selectedShipmentType, setSelectedShipmentType] = useState("Dry");
  const selectedCompany = watch("company");
  useEffect(() => {
    if (!values.shipmentType) {
      setValue("shipmentType", "Dry");
      setSelectedShipmentType("Dry");
    }
  }, []);
  const handleCompanySelect = (company: string) => {
    setValue("company", company);
  };
  const handleShipmentTypeTab = (type: string) => {
    setSelectedShipmentType(type);
    setValue("shipmentType", type);
  };

  const uniqueCompanies = (companiesData || []).filter(
    (c, idx, arr) => arr.findIndex((x) => x.company === c.company) === idx
  );

  const handleSubmit = async (e: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Type Tabs First */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#1a365d] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#3498db]" />
          نوع الشحن
        </h2>
        <div className="flex w-full rounded-full border border-[#b6d6f6] bg-[#f7fafd] overflow-hidden">
          {shipmentTypes.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`flex-1 py-2 text-center font-bold transition-all text-base ${
                selectedShipmentType === tab.value
                  ? "bg-[#eaf4fb] text-[#3498db]"
                  : "bg-transparent text-[#1a365d] hover:bg-[#f0f6fa]"
              }`}
              style={{ borderRadius: 20 }}
              onClick={() => handleShipmentTypeTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Carrier Cards Second */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#1a365d]">اختيار الناقل</h2>
        <div className="flex flex-col gap-4">
          {isLoadingCompanies ? (
            <div>جاري التحميل...</div>
          ) : (
            uniqueCompanies
              .filter(
                (company) =>
                  company.shippingTypes &&
                  company.shippingTypes.some(
                    (type) => type.type === selectedShipmentType
                  )
              )
              .map((company) => {
                const firstType =
                  company.shippingTypes.find(
                    (type) => type.type === selectedShipmentType
                  ) || company.shippingTypes[0];
                const logoSrc = (function getCompanyLogo(
                  companyName: string
                ): string {
                  const map: Record<string, string> = {
                    redbox: `/companies/redBox.png`,
                    smsa: "/companies/smsa.jpg",
                    omniclama: "/companies/lamaBox.png",
                    aramex: `/companies/araMex.png`,
                  };
                  return (
                    map[companyName.toLowerCase()] ||
                    "/carriers/carrier-placeholder.png"
                  );
                })(company.company);
                const isSelected = selectedCompany === company.company;
                return (
                  <CarrierCard
                    key={company._id}
                    company={company}
                    selectedCompany={selectedCompany}
                    handleCompanySelect={handleCompanySelect}
                    logoSrc={logoSrc}
                    firstType={firstType}
                  />
                );
              })
          )}
        </div>
      </div>

      <OrderSummaryAndFragileTips values={values} />

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
          className="bg-gradient-to-r from-[#1e3a6c]  text-white  text-lg px-8 py-4 "
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>
              <svg
                className="inline w-4 h-4 mr-2 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              جاري الإرسال...
            </span>
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
      <label className="block mb-2 font-bold text-[#1a365d] text-center flex items-center gap-1 justify-center w-full">
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
