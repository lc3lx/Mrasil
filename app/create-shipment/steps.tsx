"use client";

import { useState, useEffect } from "react";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import ResponseModal from "../components/ResponseModal";
import {
  useCreateShipmentMutation,
  useGetMyShipmentsQuery,
} from "../api/shipmentApi";
import {
  useGetAllClientAddressesQuery,
  useCreateClientAddressMutation,
  useDeleteClientAddressMutation,
  useUpdateClientAddressMutation,
} from "../api/clientAdressApi";
import { useCreateAddressMutation } from "../api/adressesApi";
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
import { useGetCustomerMeQuery } from "../api/customerApi";
import {
  useGetAllParcelsQuery,
  useCreateParcelMutation,
} from "../api/parcelsApi";
import { useGetAllShipmentCompaniesQuery } from "../api/shipmentCompanyApi";
import { motion } from "framer-motion";
import { Building, Plus } from "lucide-react";
import { AddSenderAddressForm } from "./AddSenderAddressForm";
import { AddRecipientForm } from "./AddRecipientForm";

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
    shipper_full_name: yup.string().optional(),
    shipper_mobile: yup.string().optional(),
    shipper_city: yup.string().optional(),
    shipper_address: yup.string().optional(),
    recipient_full_name: yup.string().optional(),
    recipient_mobile: yup.string().optional(),
    recipient_city: yup.string().optional(),
    recipient_address: yup.string().optional(),
    recipient_email: yup.string().optional(),
    recipient_district: yup.string().optional(),
    weight: yup.number().optional(),
    Parcels: yup.number().optional(),
    dimension_high: yup.number().optional(),
    dimension_width: yup.number().optional(),
    dimension_length: yup.number().optional(),
    paymentMethod: yup.string().optional(),
    company: yup.string().optional(),
    shipmentType: yup.string().optional(),
    orderDescription: yup.string().optional(),
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
  const [step, setStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "fail">("success");
  const [modalMessage, setModalMessage] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(providerOptions[0]);
  const [shipmentType, setShipmentType] = useState("الدفع المسبق");
  const router = useRouter();

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
      Parcels: 0,
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
      // إذا لم يتم اختيار عدد الصناديق أو كانت القيمة فارغة أو صفر، اجعلها 1
      let parcels = Number(data.Parcels);
      if (!parcels || parcels < 1) parcels = 1;
      const payload = {
        company: data.company,
        shapmentingType: data.shipmentType,
        orderDescription: data.orderDescription,
        order: {
          total: data.total,
          paymentMethod: data.paymentMethod,
          description: data.description,
          customer: {
            full_name: data.recipient_full_name,
            mobile: data.recipient_mobile,
            city: data.recipient_city,
            country: "sa",
            address: data.recipient_address,
            email: data.recipient_email || "",
            district: data.recipient_district || undefined,
          },
        },
        shipperAddress: {
          full_name: data.shipper_full_name,
          mobile: data.shipper_mobile,
          city: data.shipper_city,
          country: "sa",
          address: data.shipper_address,
          email: data.email || "",
        },
        weight: Number(data.weight),
        Parcels: parcels,
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
      <div className="space-y-8">
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
                    height: "4px",
                    background: "linear-gradient(to left, #3498db, #2980b9)",
                    borderRadius: "2px",
                    transition: "all 0.5s",
                  }}
                />

                {/* Step 1 */}
                <div
                  className={`flex flex-col items-center relative z-10 ${
                    step >= 1 ? "text-[#3498db]" : "text-[#6d6a67]"
                  }`}
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
                    step >= 2 ? "text-[#3498db]" : "text-[#6d6a67]"
                  }`}
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
                    step >= 3 ? "text-[#3498db]" : "text-[#6d6a67]"
                  }`}
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
            {step === 1 && <Step1Content nextStep={nextStep} />}
            {step === 2 && (
              <Step2Content nextStep={nextStep} prevStep={prevStep} />
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
  const {
    data: clientAddressesData,
    isLoading,
    error,
  } = useGetAllClientAddressesQuery();
  // Fetch sender addresses from customer profile
  const { data: customerMeData, isLoading: isLoadingCustomerMe } =
    useGetCustomerMeQuery();
  // Mutation for creating a new client address
  const [createClientAddress, { isLoading: isCreating, error: createError }] =
    useCreateClientAddressMutation();
  // Mutation for creating a new sender address
  const [createAddress, { isLoading: isCreatingAddress }] =
    useCreateAddressMutation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState<string | null>(
    null
  );
  const [deleteClientAddress, { isLoading: isDeleting }] =
    useDeleteClientAddressMutation();

  // Use API data for sender cards (customer addresses)
  const senderCards = (customerMeData?.data.addresses || []).map(
    (address, idx) => ({
      id: address._id || idx,
      _id: address._id,
      name: address.alias || "-",
      mobile: address.phone || "-",
      city: address.city || "-",
      address: address.location || "-",
      email: customerMeData?.data.email || "-",
    })
  );

  // Use API data for recipient cards
  const recipientCards = clientAddressesData?.data || [];

  const [selectedSender, setSelectedSender] = useState<string | number | null>(
    null
  );
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null
  );
  const [openSenderModal, setOpenSenderModal] = useState(false);
  const [openRecipientModal, setOpenRecipientModal] = useState(false);
  const [openAddSenderModal, setOpenAddSenderModal] = useState(false);
  const [newSender, setNewSender] = useState({
    name: "",
    mobile: "",
    city: "",
    address: "",
    email: "",
  });
  const [newRecipient, setNewRecipient] = useState({
    clientName: "",
    clientAddress: "",
    district: "",
    city: "",
    country: "",
    clientEmail: "",
    clientPhone: "",
    customer: "",
  });
  const [editRecipientModalOpen, setEditRecipientModalOpen] = useState(false);
  const [recipientToEdit, setRecipientToEdit] = useState<any | null>(null);
  const [editRecipient, setEditRecipient] = useState({
    clientName: "",
    clientAddress: "",
    district: "",
    city: "",
    country: "",
    clientEmail: "",
    clientPhone: "",
    customer: "",
  });
  const [updateClientAddress, { isLoading: isUpdating, error: updateError }] =
    useUpdateClientAddressMutation();
  const [searchSender, setSearchSender] = useState("");
  const [searchRecipient, setSearchRecipient] = useState("");
  const [showAllSenders, setShowAllSenders] = useState(false);
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  // In Step1Content, before the recipient cards section:
  const [recipientName, setRecipientName] = useState("");

  const handleSelectSender = (card: any) => {
    if (selectedSender === card.id) {
      setSelectedSender(null);
      setValue("shipper_full_name", "");
      setValue("shipper_mobile", "");
      setValue("shipper_city", "");
      setValue("shipper_address", "");
    } else {
      setSelectedSender(card.id);
      setValue("shipper_full_name", card.name);
      setValue("shipper_mobile", card.mobile);
      setValue("shipper_city", card.city);
      setValue("shipper_address", card.address);
    }
  };

  const handleSelectRecipient = (card: any) => {
    if (selectedRecipient === card._id) {
      setSelectedRecipient(null);
      setRecipientName("");
      setValue("recipient_full_name", "");
      setValue("recipient_mobile", "");
      setValue("recipient_city", "");
      setValue("recipient_address", "");
      setValue("recipient_email", "");
      setValue("recipient_district", "");
    } else {
      setSelectedRecipient(card._id);
      setRecipientName(card.clientName || "");
      setValue("recipient_full_name", card.clientName || "");
      setValue("recipient_mobile", card.clientPhone);
      setValue("recipient_city", card.city);
      setValue("recipient_address", card.clientAddress);
      setValue("recipient_email", card.clientEmail || "");
      setValue("recipient_district", card.district || "");
    }
  };

  const handleDeleteRecipient = (id: string) => {
    setRecipientToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (recipientToDelete) {
      await deleteClientAddress(recipientToDelete);
      setRecipientToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleAddRecipient = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const payload = { ...newRecipient };
      if ("customer" in payload && !payload.customer) {
        delete (payload as any).customer;
      }
      await createClientAddress(payload).unwrap();
      setAlertStatus("success");
      setAlertMessage("تمت إضافة العميل بنجاح");
      setAlertOpen(true);
      setOpenRecipientModal(false);
      setNewRecipient({
        clientName: "",
        clientAddress: "",
        district: "",
        city: "",
        country: "",
        clientEmail: "",
        clientPhone: "",
        customer: "",
      });
    } catch (err: any) {
      setAlertStatus("fail");
      setAlertMessage(err?.data?.message || "حدث خطأ أثناء إضافة العميل");
      setAlertOpen(true);
    }
  };

  const handleAddSenderAddress = async (data: any) => {
    try {
      await createAddress({
        alias: data.alias,
        location: data.location,
        city: data.city,
        phone: data.phone,
        country: "sa",
      }).unwrap();
    } catch (error: any) {
      throw error;
    }
  };

  const handleEditRecipient = (card: any) => {
    setRecipientToEdit(card);
    setEditRecipient({
      clientName: card.clientName || "",
      clientAddress: card.clientAddress || "",
      district: card.district || "",
      city: card.city || "",
      country: card.country || "",
      clientEmail: card.clientEmail || "",
      clientPhone: card.clientPhone || "",
      customer: card.customer || "",
    });
    setEditRecipientModalOpen(true);
  };

  const handleEditRecipientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditRecipient({ ...editRecipient, [e.target.name]: e.target.value });
  };

  const handleEditRecipientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientToEdit) return;
    try {
      await updateClientAddress({
        id: recipientToEdit._id,
        data: { ...editRecipient, customer: editRecipient.customer || "" },
      }).unwrap();
      setEditRecipientModalOpen(false);
      setRecipientToEdit(null);
    } catch (err) {
      // error handled by updateError
    }
  };

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

  const filteredSenderCards = senderCards.filter(
    (card) =>
      card.name.toLowerCase().includes(searchSender.toLowerCase()) ||
      card.mobile.toLowerCase().includes(searchSender.toLowerCase()) ||
      card.city.toLowerCase().includes(searchSender.toLowerCase()) ||
      card.address.toLowerCase().includes(searchSender.toLowerCase()) ||
      card.email.toLowerCase().includes(searchSender.toLowerCase())
  );

  // Filter recipient cards by search
  const filteredRecipientCards = (recipientCards || []).filter(
    (card) =>
      (card.clientName || "")
        .toLowerCase()
        .includes(searchRecipient.toLowerCase()) ||
      (card.clientPhone || "")
        .toLowerCase()
        .includes(searchRecipient.toLowerCase()) ||
      (card.clientEmail || "")
        .toLowerCase()
        .includes(searchRecipient.toLowerCase())
  );

  const displayedSenderCards = showAllSenders
    ? filteredSenderCards
    : filteredSenderCards.slice(0, 6);
  const displayedRecipientCards = showAllRecipients
    ? filteredRecipientCards
    : filteredRecipientCards.slice(0, 6);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sender Section */}
      <motion.div variants={staggerChildren}>
        <div className="flex items-center gap-3">
          <div className="v7-neu-icon-sm">
            <Building className="h-5 w-5 text-[#3498db]" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            اختر عنوان الالتقاط
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-[#3498db]" />
            </span>
            <Input
              className="pr-10 v7-neu-input"
              placeholder="ابحث ضمن عناوين الالتقاط الخاصة بك"
              type="text"
              value={searchSender}
              onChange={(e) => setSearchSender(e.target.value)}
              style={{ direction: "rtl", fontFamily: "inherit" }}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpenAddSenderModal(true)}
            className="v7-neu-button-accent bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] transition-all duration-300 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2"
          >
            + عنوان جديد
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedSenderCards.map((card) => (
            <motion.div
              key={card.id}
              className={`v7-neu-card-inner p-5 cursor-pointer relative transition-all duration-300 hover:shadow-lg ${
                selectedSender === card.id
                  ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                  : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
              }`}
              onClick={() => handleSelectSender(card)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              // variants={fadeIn} // (optional: add fadeIn animation if you want)
            >
              {selectedSender === card.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-blue-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSenderModal(true);
                    setSelectedSender(card.id);
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-[#3498db]"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" />
                  </svg>
                </Button>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="font-bold text-lg">{card.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-[#3498db]" />
                  <span>{card.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-[#3498db]" />
                  <span>{card.city}</span>
                </div>
                {card.address && (
                  <div className="text-sm text-gray-700">{card.address}</div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4 text-[#3498db]" />
                  <span>{card.email}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* More button */}
        {filteredSenderCards.length > 6 && !showAllSenders && (
          <div className="flex justify-center mt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-blue-500 flex items-center gap-1 py-3 px-8 text-lg rounded-xl font-bold border border-blue-200 shadow-sm"
              onClick={() => setShowAllSenders(true)}
            >
              المزيد <span>+</span>
            </Button>
          </div>
        )}
      </motion.div>

      {/* Recipient Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1a365d]">اختر عميل</h2>
        </div>
        <div className="flex flex-row items-center gap-3 mb-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-[#3498db]" />
            </span>
            <Input
              type="text"
              placeholder="ابحث ضمن عناوين العملاء"
              value={searchRecipient}
              onChange={(e) => setSearchRecipient(e.target.value)}
              className="pr-10 v7-neu-input"
              style={{ direction: "rtl", fontFamily: "inherit" }}
            />
          </div>
          <Button
            type="button"
            onClick={() => setOpenRecipientModal(true)}
            className="bg-blue-500 text-white flex items-center gap-1 rounded-xl px-4 py-2"
          >
            <UserPlus className="w-4 h-4" /> عميل جديد +
          </Button>
        </div>

        {/* <div className="mb-4" style={{ width: '75%' }}>
          <Label htmlFor="recipient_full_name">اسم العميل <span style={{color: 'red'}}>*</span></Label>
          <Input
            id="recipient_full_name"
            value={recipientName}
            onChange={e => {
              setRecipientName(e.target.value);
              setValue("recipient_full_name", e.target.value);
            }}
            placeholder="أدخل اسم العميل"
            required
            className="pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(52,152,219,0.10)] focus:border-[#3498db33] focus:ring-1 focus:ring-[#3498db33] text-[#1a365d] text-[15px] placeholder:text-[#b0b7c3] placeholder:text-[15px] placeholder:font-normal font-normal"
            style={{ direction: 'rtl', fontFamily: 'inherit' }}
          />
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayedRecipientCards.map((card) => (
            <motion.div
              key={card._id}
              className={`v7-neu-card-inner p-5 cursor-pointer relative transition-all duration-300 hover:shadow-lg ${
                selectedRecipient === card._id
                  ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                  : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
              }`}
              onClick={() => handleSelectRecipient(card)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedRecipient === card._id && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 rounded-full bg-[#3498db] flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-blue-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRecipient(card);
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6v-2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2v-2H5a4 4 0 00-4 4v6a4 4 0 004 4z"></path>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-blue-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRecipient(card._id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="font-bold text-lg">{card.clientName}</div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-[#3498db]" />
                  <span>{card.clientPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-[#3498db]" />
                  <span>
                    {card.city}
                    {card.clientAddress ? `، ${card.clientAddress}` : ""}
                  </span>
                </div>
                {card.district && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="font-bold">الحي/المنطقة:</span>
                    <span>{card.district}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4 text-[#3498db]" />
                  <span>{card.clientEmail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* More button */}
        {filteredRecipientCards.length > 6 && !showAllRecipients && (
          <div className="flex justify-center mt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-blue-500 flex items-center gap-1 py-3 px-8 text-lg rounded-xl font-bold border border-blue-200 shadow-sm"
              onClick={() => setShowAllRecipients(true)}
            >
              المزيد <span>+</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]"
        >
          التالي
        </Button>
      </div>

      {/* Recipient Modal */}
      <Dialog open={openRecipientModal} onOpenChange={setOpenRecipientModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
          </DialogHeader>
          <AddRecipientForm
            isOpen={openRecipientModal}
            onClose={() => setOpenRecipientModal(false)}
            onSubmit={async (data) => {
              try {
                const payload = { ...data };
                if ("customer" in payload && !payload.customer) {
                  delete (payload as any).customer;
                }
                await createClientAddress(payload).unwrap();
                setAlertStatus("success");
                setAlertMessage("تمت إضافة العميل بنجاح");
                setAlertOpen(true);
                setOpenRecipientModal(false);
                setNewRecipient({
                  clientName: "",
                  clientAddress: "",
                  district: "",
                  city: "",
                  country: "",
                  clientEmail: "",
                  clientPhone: "",
                  customer: "",
                });
              } catch (err: any) {
                setAlertStatus("fail");
                setAlertMessage(
                  err?.data?.message || "حدث خطأ أثناء إضافة العميل"
                );
                setAlertOpen(true);
              }
            }}
            isLoading={isCreating}
            error={createError}
            initialValues={newRecipient}
          />
        </DialogContent>
      </Dialog>
      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setRecipientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="تأكيد الحذف"
        description="هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={isDeleting ? "جاري الحذف..." : "حذف"}
        cancelText="إلغاء"
      />
      {/* Edit Recipient Modal */}
      <Dialog
        open={editRecipientModalOpen}
        onOpenChange={setEditRecipientModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات العميل</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditRecipientSubmit} className="space-y-2">
            <Input
              name="clientName"
              placeholder="الاسم"
              value={editRecipient.clientName}
              onChange={handleEditRecipientChange}
              required
            />
            <Input
              name="clientAddress"
              placeholder="العنوان"
              value={editRecipient.clientAddress}
              onChange={handleEditRecipientChange}
              required
            />
            <Input
              name="district"
              placeholder="الحي/المنطقة (district)"
              value={editRecipient.district}
              onChange={handleEditRecipientChange}
            />
            <Input
              name="city"
              placeholder="المدينة"
              value={editRecipient.city}
              onChange={handleEditRecipientChange}
              required
            />
            <Input
              name="country"
              placeholder="الدولة"
              value={editRecipient.country}
              onChange={handleEditRecipientChange}
              required
            />
            <Input
              name="clientEmail"
              placeholder="البريد الإلكتروني"
              value={editRecipient.clientEmail}
              onChange={handleEditRecipientChange}
              required
            />
            <Input
              name="clientPhone"
              placeholder="رقم الجوال"
              value={editRecipient.clientPhone}
              onChange={handleEditRecipientChange}
              required
            />
            {updateError && (
              <div className="text-red-500 text-sm">
                {typeof updateError === "string"
                  ? updateError
                  : "حدث خطأ أثناء التعديل"}
              </div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? "جاري التعديل..." : "حفظ التعديلات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Sender Address Form */}
      <AddSenderAddressForm
        isOpen={openAddSenderModal}
        onClose={() => setOpenAddSenderModal(false)}
        onSubmit={handleAddSenderAddress}
        isLoading={isCreatingAddress}
      />
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
  const [createParcel, { isLoading: isCreatingParcel }] =
    useCreateParcelMutation();
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customParcel, setCustomParcel] = useState({
    title: "",
    length: "",
    width: "",
    height: "",
    maxWeight: "",
    price: "",
    description: "",
  });
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customDims, setCustomDims] = useState({
    length: "",
    width: "",
    high: "",
  });
  const paymentMethod = watch("paymentMethod");
  const { data: customerMeData } = useGetCustomerMeQuery();

  // Map API data to card format with unique key
  const sizeCards = (parcelsData?.data || []).map((parcel, idx) => ({
    key: parcel._id ? `${parcel._id}_${idx}` : `parcel_${idx}`,
    label: parcel.title,
    dims: {
      length: parcel.dimensions.length,
      width: parcel.dimensions.width,
      high: parcel.dimensions.height,
    },
    desc: parcel.description || "",
    maxWeight: parcel.maxWeight,
    price: parcel.price,
    examples: parcel.examples,
  }));

  // Selection logic: only one card can be selected at a time
  const handleSelectSize = (card: any) => {
    setSelectedSize((prev) => (prev === card.key ? null : card.key));
    if (card.key) {
      setValue("dimension_length", card.dims.length);
      setValue("dimension_width", card.dims.width);
      setValue("dimension_high", card.dims.high);
    }
  };

  // Handle custom parcel form submit
  const handleCustomParcelFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createParcel({
        title: customParcel.title,
        dimensions: {
          length: Number(customParcel.length),
          width: Number(customParcel.width),
          height: Number(customParcel.height),
        },
        maxWeight: customParcel.maxWeight
          ? Number(customParcel.maxWeight)
          : undefined,
        price: customParcel.price ? Number(customParcel.price) : undefined,
        description: customParcel.description,
        isPublic: false,
      }).unwrap();
      setCustomModalOpen(false);
      setCustomParcel({
        title: "",
        length: "",
        width: "",
        height: "",
        maxWeight: "",
        price: "",
        description: "",
      });
    } catch (err) {
      // handle error if needed
    }
  };

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
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-6 h-6 text-[#3498db]" />
              <h2 className="text-xl font-bold text-[#3498db] m-0">
                حجم الطرد
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {sizeCards.map((card) => {
                const selected = selectedSize === card.key;
                return (
                  <motion.div
                    key={card.key}
                    className={`v7-neu-card-inner p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                      selected
                        ? "ring-2 ring-[#3498db] bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                        : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                    }`}
                    onClick={() => handleSelectSize(card)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center gap-2 relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selected
                            ? "bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white"
                            : "bg-[#3498db]/10 text-[#3498db]"
                        }`}
                      >
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {card.label}
                        </h4>
                        <div className="text-xs text-gray-500 mt-1">
                          سم {card.dims.length} × {card.dims.width} ×{" "}
                          {card.dims.high}
                        </div>
                        {card.maxWeight && (
                          <div className="text-xs text-gray-500">
                            حتى {card.maxWeight} كجم
                          </div>
                        )}
                      </div>
                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#3498db] rounded-full flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          {/* Shipment type (right, 1/3) */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#3498db]" />
              <h2 className="text-xl font-bold text-[#3498db] m-0">
                نوع الشحنة
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
                    className={`
                      flex-1 max-w-[220px] rounded-2xl p-6 cursor-pointer transition-all
                      flex flex-col items-start border
                      ${
                        selected
                          ? "bg-blue-50 border-blue-400 shadow-md"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow"
                      }
                    `}
                    onClick={() => setValue("paymentMethod", option.sendValue)}
                  >
                    <div className="flex items-center gap-2 mb-2">
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
                        className={`font-bold text-lg ${
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
        {/* Selected parcel summary (centered, full width) */}
        {selectedSize &&
          (() => {
            const selectedCard = sizeCards.find((c) => c.key === selectedSize);
            if (!selectedCard) return null;
            return (
              <div className="mb-2 w-full flex justify-center">
                <div
                  className="flex items-center gap-6 bg-[#f6fbff] border-2 border-[#3498db] rounded-2xl shadow-md px-8 py-4 min-w-[350px] max-w-xl w-full"
                  style={{ height: 90 }}
                >
                  <div className="flex-1">
                    <div className="font-bold text-[#1a365d] text-lg mb-1 text-right">
                      الحجم المختار: {selectedCard.label}
                    </div>
                    <div className="flex items-center gap-4 text-[#7b8ca6] text-base">
                      <span className="flex items-center gap-1">
                        <span className="text-[#3498db]">
                          <Package className="w-4 h-4" />
                        </span>
                        {selectedCard.dims.length} × {selectedCard.dims.width} ×{" "}
                        {selectedCard.dims.high} سم
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="text-[#3498db]">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M3 21h18M6 21V7a6 6 0 1112 0v14" />
                          </svg>
                        </span>
                        حتى {selectedCard.maxWeight} كجم
                      </span>
                    </div>
                  </div>
                  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-[#3498db]">
                    <Package className="w-7 h-7 text-white" />
                  </span>
                </div>
              </div>
            );
          })()}
        {/* Inputs row: weight, parcels, description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* الوزن (كجم) */}
          <motion.div variants={fadeIn}>
            <Label
              htmlFor="weight"
              className="text-base font-medium flex items-center gap-2"
            >
              <Scale className="h-5 w-5 text-[#3498db]" />
              الوزن (كجم)
            </Label>
            <div className="v7-neu-input-container relative overflow-hidden group mt-2">
              <input
                type="number"
                {...register("weight")}
                placeholder="أدخل وزن الشحنة"
                onFocus={() => setWeightFocused(true)}
                onBlur={() => setWeightFocused(false)}
                className="v7-neu-input text-base"
                style={weightFocused ? { boxShadow: "0 2px 0 0 #3498db" } : {}}
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#3498db] to-[#2980b9] transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left"></div>
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
              className="text-base font-medium flex items-center gap-2"
            >
              <Box className="h-5 w-5 text-[#3498db]" />
              عدد الصناديق
            </Label>
            <div className="v7-neu-card-inner p-4 mt-2">
              <div className="flex items-center justify-between">
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
              <p className="text-sm text-gray-500 text-center mt-2">
                حدد عدد الصناديق المراد شحنها
              </p>
              {errors.Parcels && typeof errors.Parcels.message === "string" && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.Parcels.message}
                </div>
              )}
            </div>
          </motion.div>

          {/* وصف محتويات الشحنة */}
          <motion.div variants={fadeIn} className="col-span-1 md:col-span-2">
            <Label
              htmlFor="orderDescription"
              className="text-base font-medium flex items-center gap-2"
            >
              <FileText className="h-5 w-5 text-[#3498db]" />
              وصف محتويات الشحنة
            </Label>
            <div className="v7-neu-input-container mt-2">
              <textarea
                {...register("orderDescription")}
                placeholder="أدخل وصفاً لمحتويات الشحنة"
                rows={4}
                onFocus={() => setDescFocused(true)}
                onBlur={() => setDescFocused(false)}
                className="v7-neu-input text-base min-h-[120px]"
                style={descFocused ? { boxShadow: "0 0 0 2px #3498db" } : {}}
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
              <CreditCard className="h-5 w-5 text-[#3498db]" />
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

          <motion.div variants={fadeIn}>
            <Label
              htmlFor="description"
              className="text-base font-medium flex items-center gap-2 mb-2"
            >
              <FileText className="h-5 w-5 text-[#3498db]" />
              الوصف
            </Label>
            <div className="v7-neu-input-container">
              <input
                type="text"
                {...register("description")}
                placeholder="أدخل الوصف"
                className="v7-neu-input text-base"
              />
            </div>
            {errors.description &&
              typeof errors.description.message === "string" && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.description.message}
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
                شروط الخدمة
              </a>{" "}
              و{" "}
              <a
                href="#"
                className="text-[#3498db] font-bold underline hover:text-blue-700"
              >
                سياسة الخصوصية
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
            className="border-2 flex items-center gap-2"
          >
            <span>السابق</span>
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
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db] flex items-center gap-2"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
            التالي
          </Button>
        </div>
      </form>
      {/* Custom Parcel Modal */}
      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة حجم طرد مخصص</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCustomParcelFormSubmit} className="space-y-2">
            <Input
              placeholder="اسم الحجم"
              value={customParcel.title}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, title: e.target.value })
              }
              required
            />
            <Input
              placeholder="الطول (سم)"
              type="number"
              value={customParcel.length}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, length: e.target.value })
              }
              required
            />
            <Input
              placeholder="العرض (سم)"
              type="number"
              value={customParcel.width}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, width: e.target.value })
              }
              required
            />
            <Input
              placeholder="الارتفاع (سم)"
              type="number"
              value={customParcel.height}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, height: e.target.value })
              }
              required
            />
            <Input
              placeholder="الوزن الأقصى (كجم)"
              type="number"
              value={customParcel.maxWeight}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, maxWeight: e.target.value })
              }
            />
            <Input
              placeholder="السعر (اختياري)"
              type="number"
              value={customParcel.price}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, price: e.target.value })
              }
            />
            <Input
              placeholder="الوصف (اختياري)"
              value={customParcel.description}
              onChange={(e) =>
                setCustomParcel({
                  ...customParcel,
                  description: e.target.value,
                })
              }
            />
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-500 text-white"
                disabled={isCreatingParcel}
              >
                {isCreatingParcel ? "جاري الإضافة..." : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
  // Collect all unique shipment types from all companies
  const shipmentTypes = Array.from(
    new Set(
      (companiesData || []).flatMap((c) => c.shippingTypes.map((t) => t.type))
    )
  );
  // Deduplicate companies by name
  const uniqueCompanies = (companiesData || []).filter(
    (c, idx, arr) => arr.findIndex((x) => x.company === c.company) === idx
  );
  // Selection state
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Handle company select
  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setValue("company", company);
  };
  // Handle shipment type select
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setValue("shipmentType", type);
  };

  // Wrap onSubmit to handle loading state
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
        <h2 className="text-xl font-semibold text-[#1a365d] flex items-center gap-2">
          <Package className="w-5 h-5 text-[#3498db]" />
          نوع الشحنة
        </h2>
        <div className="flex gap-6 mt-4">
          {shipmentTypes.map((type) => {
            const selected = selectedType === type;
            return (
              <div
                key={type}
                className={`
                  flex-1 min-w-[220px] max-w-[320px] rounded-2xl p-6 cursor-pointer transition-all
                  flex flex-col items-start border
                  ${
                    selected
                      ? "bg-blue-50 border-blue-400 shadow-md"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow"
                  }
                `}
                onClick={() => handleTypeSelect(type)}
              >
                <div className="flex items-center gap-2 mb-2">
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
                    className={`font-bold text-lg ${
                      selected ? "text-blue-700" : "text-gray-700"
                    }`}
                  >
                    {type}
                  </span>
                </div>
                <span
                  className={`text-sm ${
                    selected ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {type === "الدفع المسبق"
                    ? "مناسب للدفع قبل الشحن"
                    : "مناسب للدفع عند استلام الشحنة"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Carrier Cards Second */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#1a365d]">اختيار الناقل</h2>
        <RadioGroup
          value={selectedCompany || ""}
          onValueChange={handleCompanySelect}
          className="flex flex-col gap-4"
        >
          {isLoadingCompanies ? (
            <div>جاري التحميل...</div>
          ) : (
            (() => {
              // Helper function to get company logo path
              function getCompanyLogo(companyName: string): string {
                const map: Record<string, string> = {
                  redbox: "/companies/RedBox.jpg",
                  smsa: "/companies/smsa.jpg",
                  omniclama: "/companies/omniclama.png",
                  aramex: "/companies/Aramex.jpg",
                };
                return (
                  map[companyName.toLowerCase()] ||
                  "/carriers/carrier-placeholder.png"
                );
              }
              return uniqueCompanies.map((company) => {
                const firstType =
                  company.shippingTypes && company.shippingTypes[0];
                const logoSrc = getCompanyLogo(company.company);
                const isSelected = selectedCompany === company.company;
                return (
                  <motion.div
                    key={company._id}
                    className={`flex items-center justify-between v7-neu-card-inner px-6 py-6 transition-all duration-300 relative overflow-hidden w-full ${
                      isSelected
                        ? "border-2 border-[#3498db]/70 bg-[#f8fafc] shadow-sm"
                        : "border border-gray-200 hover:border-[#3498db]/40 bg-white"
                    }`}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    initial={{ opacity: 0.9, y: 5 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => handleCompanySelect(company.company)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Right group: radio, price, delivery time */}
                    <div className="flex flex-col items-start min-w-[120px] gap-1">
                      <RadioGroupItem
                        value={company.company}
                        id={company.company}
                        className="text-[#3498db] mb-1"
                        checked={isSelected}
                        onChange={() => handleCompanySelect(company.company)}
                      />
                      <span className="text-[#3498db] font-bold text-lg">
                        {firstType?.basePrice
                          ? `${firstType.basePrice} ريال`
                          : "-"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {company.deliveryTime
                          ? `توصيل خلال ${company.deliveryTime}`
                          : "-"}
                      </span>
                    </div>
                    {/* Left group: company name, logo */}
                    <div className="flex items-center gap-3 min-w-[180px] justify-end">
                      <span className="text-[#3498db] font-bold text-base whitespace-nowrap">
                        {company.company}
                      </span>
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                        <img
                          src={logoSrc}
                          alt={company.company}
                          className="object-contain w-10 h-10"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/carriers/carrier-placeholder.png";
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              });
            })()
          )}
        </RadioGroup>
      </div>

      {/* ملخص الطلب */}
      <div className="bg-white rounded-2xl shadow border border-[#e5eaf2] mt-8 p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
            <span className="inline-block">
              <FileText className="w-5 h-5 text-[#1a365d]" />
            </span>
            ملخص الطلب
          </h2>
          {values.orderId && (
            <span className="bg-blue-50 text-blue-600 font-bold rounded-full px-4 py-1 text-sm">
              رقم الطلب: <span className="font-bold">{values.orderId}</span>
            </span>
          )}
        </div>
        <div className="divide-y divide-[#f3f6fa]">
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">من</span>
            <span className="text-[#1a365d]">{values.shipper_city || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">إلى</span>
            <span className="text-[#1a365d]">
              {values.recipient_city || "-"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">نوع الشحنة</span>
            <span className="text-[#1a365d]">{values.shipmentType || "-"}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">حجم الطرد</span>
            <span className="text-[#1a365d]">
              {values.dimension_length &&
              values.dimension_width &&
              values.dimension_high
                ? `${values.dimension_length} × ${values.dimension_width} × ${values.dimension_high}`
                : "-"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[#7b8ca6] font-bold">الوزن</span>
            <span className="text-[#1a365d]">
              {values.weight ? `${values.weight} كجم` : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* نصائح للشحنات القابلة للكسر */}
      <div className="mt-8 rounded-2xl border border-[#e5eaf2] bg-[#f8fafc] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#f59e42] text-2xl">
            <Package className="w-6 h-6" />
          </span>
          <span className="font-bold text-[#1a365d] text-lg">
            نصائح للشحنات القابلة للكسر
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#f59e42] text-xl">
            <FileText className="w-5 h-5" />
          </span>
          <span className="font-bold text-[#1a365d] text-base">
            كيف تحمي شحنتك القابلة للكسر؟
          </span>
        </div>
        <ol className="space-y-2 mb-4">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">
              1
            </span>
            <span className="text-[#1a365d]">
              استخدم تغليف مناسب مثل الفقاعات الهوائية أو الفلين لحماية
              المحتويات الهشة
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">
              2
            </span>
            <span className="text-[#1a365d]">
              ضع علامة "قابل للكسر" بشكل واضح على جميع جوانب الطرد
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">
              3
            </span>
            <span className="text-[#1a365d]">
              اختر خدمة الشحن المميزة للتعامل مع الشحنات الحساسة بعناية إضافية
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbeee6] text-[#f59e42] font-bold">
              4
            </span>
            <span className="text-[#1a365d]">
              نوصي بشدة بإضافة تأمين الشحنة لتغطية أي أضرار محتملة أثناء النقل
            </span>
          </li>
        </ol>
        <div className="bg-[#f3f7fa] text-[#f59e42] rounded-xl px-4 py-3 flex items-center gap-2 mt-2">
          <span>
            <Shield className="w-5 h-5" />
          </span>
          <span className="font-bold">
            يمكنك إضافة تأمين على الشحنة من خلال الفرع كل ماعليك فعله عند تسليم
            الشحنة أخبرهم أنك تريد التأمين عليها.
          </span>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={prevStep}
          variant="outline"
          className="border-2"
        >
          السابق
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]"
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
