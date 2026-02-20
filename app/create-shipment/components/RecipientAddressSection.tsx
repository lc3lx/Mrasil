import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Phone,
  MapPin,
  Mail,
  Search,
  UserPlus,
  Trash2,
  Edit,
  Check,
  User,
  Building,
} from "lucide-react";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddRecipientForm } from "../components/AddRecipientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ResponseModal from "../../components/ResponseModal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  useGetAllClientAddressesQuery,
  useCreateClientAddressMutation,
  useDeleteClientAddressMutation,
  useUpdateClientAddressMutation,
} from "../../api/clientAdressApi";
import { useSearchCitiesQuery } from "../../api/cityApi";
import CityAutocompleteDropdown from "./CityAutocompleteDropdown";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface RecipientAddressSectionProps {
  selectedRecipient: string | null;
  setSelectedRecipient: Dispatch<SetStateAction<string | null>>;
  setValue: (field: string, value: any) => void;
  initialValues: {
    name: string;
    location: string;
    phone: string;
    city: string;
    country: string;
    address: string;
    email: string;
  };
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const schema = yup
  .object({
    name: yup.string().required("اسم العنوان مطلوب"),
    email: yup.string(),
    location: yup.string(),
    phone: yup.string().required("رقم الجوال مطلوب"),
    city: yup.string().required("المدينة مطلوبة"),
    country: yup.string().required("الدولة مطلوبة"),
    address: yup.string(),
  })
  .required();
export function RecipientAddressSection({
  selectedRecipient,
  setSelectedRecipient,
  setValue,
  initialValues,
}: RecipientAddressSectionProps) {
  const { data: clientAddressesData } = useGetAllClientAddressesQuery();
  const [createClientAddress, { isLoading: isCreating, error: createError }] =
    useCreateClientAddressMutation();
  const [deleteClientAddress, { isLoading: isDeleting }] =
    useDeleteClientAddressMutation();
  const [updateClientAddress, { isLoading: isUpdating, error: updateError }] =
    useUpdateClientAddressMutation();

  const rawRecipientCards = clientAddressesData?.data || [];
  const getTime = (obj: any) => {
    const c = (obj as any)?.createdAt || (obj as any)?.updatedAt;
    if (c) {
      const t = new Date(c as string).getTime();
      return isNaN(t) ? 0 : t;
    }
    const id: string | undefined = (obj as any)?._id;
    if (typeof id === "string" && id.length >= 8) {
      const ts = parseInt(id.substring(0, 8), 16);
      return isNaN(ts) ? 0 : ts * 1000;
    }
    return 0;
  };
  const recipientCards = [...rawRecipientCards].sort(
    (a, b) => getTime(b) - getTime(a)
  );
  const [openRecipientModal, setOpenRecipientModal] = useState(false);
  const [editRecipientModalOpen, setEditRecipientModalOpen] = useState(false);
  const [recipientToEdit, setRecipientToEdit] = useState<any | null>(null);
  const [editRecipient, setEditRecipient] = useState({
    clientName: "",
    clientAddress: "",
    address: "",
    city: "",
    country: "",
    clientEmail: "",
    clientPhone: "",
    customer: "",
    nationalAddress: "",
  });
  const [recipientToDelete, setRecipientToDelete] = useState<string | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchRecipient, setSearchRecipient] = useState("");
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [descFocused, setDescFocused] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const [form, setForm] = useState({
    city: initialValues?.city || "",
    country: initialValues?.country || "",
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
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

  // البحث عن المدينة بالاسم العربي للحصول على الاسم الإنجليزي
  // نستخدم API البحث عن المدن للحصول على name_en مباشرة
  const selectedRecipientCity = selectedRecipient
    ? (clientAddressesData?.data || []).find(
        (addr) => addr._id === selectedRecipient
      )?.city || ""
    : "";

  // Debug للبحث عن المدينة للمستلم
  console.log("Recipient City Search Debug:", {
    selectedRecipient,
    selectedRecipientCity,
    willSkip:
      !selectedRecipient ||
      !selectedRecipientCity ||
      selectedRecipientCity.trim() === "",
  });

  const { data: cityData } = useSearchCitiesQuery(selectedRecipientCity, {
    skip:
      !selectedRecipient ||
      !selectedRecipientCity ||
      selectedRecipientCity.trim() === "",
  });

  // إذا كانت المدينة موجودة في نتائج البحث، استخدم name_en مباشرة
  useEffect(() => {
    if (selectedRecipientCity && cityData?.results?.length > 0) {
      // ابحث عن المدينة في النتائج - هذه هي الطريقة المباشرة
      const foundCity = cityData.results.find(
        (city: any) =>
          city.name_ar === selectedRecipientCity ||
          city.name_en === selectedRecipientCity ||
          calculateSimilarity(city.name_ar, selectedRecipientCity) >= 0.8 ||
          calculateSimilarity(city.name_en, selectedRecipientCity) >= 0.8
      );

      if (foundCity) {
        setValue("recipient_city_en", foundCity.name_en);
        console.log("Recipient city direct match from API:", {
          selectedCity: selectedRecipientCity,
          foundCity: foundCity.name_ar,
          englishName: foundCity.name_en,
        });
      }
    }
  }, [selectedRecipientCity, cityData, setValue]);

  // تحديث الاسم الإنجليزي عند العثور على المدينة
  useEffect(() => {
    console.log("Recipient City Update Effect:", {
      hasCityData: !!cityData?.results?.length,
      selectedRecipient,
      selectedRecipientCity,
      cityDataResults: cityData?.results?.length || 0,
    });

    if (
      cityData?.results?.length > 0 &&
      selectedRecipient &&
      selectedRecipientCity
    ) {
      const selectedCity = (clientAddressesData?.data || []).find(
        (addr) => addr._id === selectedRecipient
      );
      console.log("Recipient Selected Address:", {
        found: !!selectedCity,
        city: selectedCity?.city,
      });

      if (selectedCity && selectedCity.city) {
        // البحث عن المدينة المطابقة في النتائج باستخدام التشابه
        const matchedCity = cityData.results.find((city: any) => {
          const similarityThreshold = 0.7; // 70% تشابه

          // مقارنة التشابه مع الاسم العربي
          if (
            calculateSimilarity(city.name_ar, selectedCity.city) >=
            similarityThreshold
          ) {
            return true;
          }

          // مقارنة التشابه مع الاسم الإنجليزي
          if (
            calculateSimilarity(city.name_en, selectedCity.city) >=
            similarityThreshold
          ) {
            return true;
          }

          // المطابقة الدقيقة كخيار احتياطي
          return city.name_ar === selectedCity.city;
        });

        if (matchedCity) {
          setValue("recipient_city_en", matchedCity.name_en);
          console.log("Recipient city found (primary):", {
            selectedCity: selectedCity.city,
            matchedCity: matchedCity.name_ar,
            englishName: matchedCity.name_en,
          });
        } else {
          // إذا لم نجد مطابقة، نحاول استخدام منطق أكثر مرونة
          const alternativeCity = cityData.results.find((city: any) => {
            // نستخدم منطق أكثر مرونة
            const similarityThreshold = 0.6;
            return (
              calculateSimilarity(city.name_ar, selectedCity.city) >=
                similarityThreshold ||
              calculateSimilarity(city.name_en, selectedCity.city) >=
                similarityThreshold
            );
          });

          if (alternativeCity) {
            setValue("recipient_city_en", alternativeCity.name_en);
            console.log("Recipient city found (alternative/fallback):", {
              selectedCity: selectedCity.city,
              matchedCity: alternativeCity.name_ar,
              englishName: alternativeCity.name_en,
            });
          } else {
            // إذا لم نجد أي مطابقة، نترك الحقل فارغاً
            setValue("recipient_city_en", "");
            console.log("Recipient city not found:", {
              selectedCity: selectedCity.city,
              availableCities: cityData.results.map((c: any) => ({
                ar: c.name_ar,
                en: c.name_en,
              })),
            });
          }
        }
      }
    }
  }, [
    cityData,
    selectedRecipient,
    clientAddressesData,
    selectedRecipientCity,
    setValue,
  ]);

  const handleSelectRecipient = (card: any) => {
    if (selectedRecipient === card._id) {
      setSelectedRecipient(null);
      setValue("recipient_full_name", "");
      setValue("recipient_mobile", "");
      setValue("recipient_city", "");
      setValue("recipient_city_en", "");
      setValue("recipient_address", "");
      setValue("recipient_email", "");
      setValue("recipient_nationalAddress", "");
    } else {
      setSelectedRecipient(card._id);
      setValue("recipient_full_name", card.clientName || "");
      setValue("recipient_mobile", card.clientPhone);
      setValue("recipient_city", card.city);
      setValue("recipient_city_en", ""); // سيتم تحديده لاحقاً
      setValue("recipient_address", card.clientAddress || "");
      setValue("recipient_email", card.clientEmail || "");
      setValue("recipient_nationalAddress", card.nationalAddress || "");
      // تحذير عند اختيار مستلم بدون عنوان وطني
      const hasNationalAddress =
        card.nationalAddress != null &&
        String(card.nationalAddress).trim() !== "";
      if (!hasNationalAddress) {
        setAlertStatus("fail");
        setAlertMessage(
          "قم باضافة العنوان الوطني لتجنب مشكلة عدم استلام الشحنة"
        );
        setAlertOpen(true);
      }
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

  const handleEditRecipient = (card: any) => {
    setRecipientToEdit(card);
    setEditRecipient({
      clientName: card.clientName || "",
      clientAddress: card.clientAddress || "",
      address: card.address || "",
      city: card.city || "",
      country: card.country || "",
      clientEmail: card.clientEmail || "",
      clientPhone: card.clientPhone || "",
      customer: card.customer || "",
      nationalAddress: card.nationalAddress || "",
    });
    // تعيين قيمة المدينة للبحث
    setCitySearch(card.city || "");
    setForm({ ...form, city: card.city || "" });
    setEditRecipientModalOpen(true);
  };

  const handleEditRecipientChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Phone number validation
    if (name === "clientPhone") {
      // Only allow digits and limit to 10 characters
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setEditRecipient({ ...editRecipient, [name]: phoneValue });
    } else {
      setEditRecipient({ ...editRecipient, [name]: value });
    }
  };

  const handleEditRecipientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientToEdit) return;
    try {
      await updateClientAddress({
        id: recipientToEdit._id,
        data: {
          ...editRecipient,
          clientAddress: editRecipient.clientAddress || "",
        },
      }).unwrap();
      setEditRecipientModalOpen(false);
      setRecipientToEdit(null);
    } catch (err) {
      // error handled by updateError
    }
  };

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[\u0621-\u064A]/g, (char) => {
        const map: Record<string, string> = {
          أ: "ا",
          إ: "ا",
          آ: "ا",
          ه: "ه",
          ة: "ه",
          ي: "ي",
          ى: "ي",
        };
        return map[char] || char;
      });

  const search = normalize(searchRecipient.trim());
  const filteredRecipientCards = (recipientCards || []).filter((card: any) => {
    const cardName = normalize(card.clientName || "");
    const cardPhone = normalize(card.clientPhone || "");
    const cardEmail = normalize(card.clientEmail || "");
    const cardCity = normalize(card.city || "");
    const cardAddress = normalize(card.clientAddress || "");
    return (
      cardName.includes(search) ||
      cardPhone.includes(search) ||
      cardEmail.includes(search) ||
      cardCity.includes(search) ||
      cardAddress.includes(search)
    );
  });

  const displayedRecipientCards = showAllRecipients
    ? filteredRecipientCards
    : filteredRecipientCards.slice(0, 6);

  return (
    <motion.div variants={staggerChildren}>
      <div className="flex items-center gap-3  pb-4 ">
        <div className="v7-neu-icon-sm">
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
            className="lucide lucide-user h-5 w-5 text-[#3498db]"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800"> بيانات المستلم</h3>
      </div>
      <div className="flex  flex-col sm:flex-row  gap-3 mb-4">
        <div className="relative v7-neu-input-container flex-1 min-w-[240px]">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />

          <Input
            className="v7-neu-input w-full pr-12 pe-4 text-gry  text-base"
            placeholder="ابحث ضمن عناوين العملاء"
            type="text"
            value={searchRecipient}
            onChange={(e) => setSearchRecipient(e.target.value)}
            style={{ direction: "rtl", fontFamily: "inherit" }}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpenRecipientModal(true)}
          className="v7-neu-button-accent text-primary w-full sm:w-fit  bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] transition-all duration-300 px-8 py-2 rounded-lg  font-bold flex items-center  text-center justify-center gap-2"
        >
          + مستلم جديد
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedRecipientCards.map((card: any) => (
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
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}
            {/* Delete icon */}
            <div className="absolute top-3 left-3">
              <Button
                type="button"
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
            {/* Edit icon */}
            <div className="absolute top-3 left-12">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditRecipient(card);
                }}
              >
                <Edit className="w-4 h-4 text-[#3498db]" />
              </Button>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <div className="font-bold text-2xl">{card.clientName}</div>
              <div className="flex items-center gap-2 text-lg text-gray-700">
                <Phone className="h-4 w-4 text-[#3498db]" />
                <span>{card.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-lg text-gray-700">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                <span>{card.city}</span>
                {card.country && <span>,{card.country}</span>}
              </div>
              {card?.clientAddress && (
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <span className="font-bold">الحي/المنطقة:</span>
                  <span>{card.clientAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-base text-gray-500">
                <Mail className="h-4 w-4 text-[#3498db]" />
                <span>{card.clientEmail}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* More/Less button */}
      {filteredRecipientCards.length > 6 && (
        <div className="flex justify-center mt-4">
          <Button
            type="button"
            variant="ghost"
            className="text-blue-500 flex items-center gap-1 py-3 px-8 text-lg rounded-xl font-bold border border-blue-200 shadow-sm"
            onClick={() => setShowAllRecipients((prev) => !prev)}
          >
            {showAllRecipients ? "عرض أقل" : "المزيد +"}
          </Button>
        </div>
      )}
      {/* Add Recipient Form */}
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
            setAlertMessage("تمت إضافة المستلم بنجاح");
            setAlertOpen(true);
            setOpenRecipientModal(false);
          } catch (err: any) {
            setAlertStatus("fail");
            setAlertMessage(
              err?.data?.message || "حدث خطأ أثناء إضافة المستلم"
            );
            setAlertOpen(true);
          }
        }}
        isLoading={isCreating}
        error={createError}
        initialValues={{
          clientName: "",
          clientAddress: "",
          city: "",
          country: "",
          clientEmail: "",
          clientPhone: "",
          customer: "",
          nationalAddress: "",
        }}
      />
      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
      {/* Delete Confirm Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm">
            <div className="mb-4 text-lg font-bold text-[#1a365d]">
              تأكيد الحذف
            </div>
            <div className="mb-6 text-gray-600">
              هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء.
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setRecipientToDelete(null);
                }}
                disabled={isDeleting}
              >
                إلغاء
              </Button>
              <Button
                className="bg-red-500 text-white"
                onClick={async () => {
                  if (recipientToDelete) {
                    await deleteClientAddress(recipientToDelete);
                    setDeleteConfirmOpen(false);
                    setRecipientToDelete(null);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? "جاري الحذف..." : "حذف"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Recipient Modal */}
      <Dialog
        open={editRecipientModalOpen}
        onOpenChange={(open) => {
          setEditRecipientModalOpen(open);
          if (!open) {
            // إعادة تعيين قيم البحث عند إغلاق النموذج
            setCitySearch("");
            setForm({ ...form, city: "" });
            setRecipientToEdit(null);
          }
        }}
      >
        <DialogContent
          className=" border-none overflow-y-auto  max-h-screen  scroll"
          dir="ltr"
        >
          <DialogHeader>
            <DialogTitle
              className="sm:text-2xl text-lg font-bold text-[#1a365d] flex items-center gap-4 mt-0 sm:mt-4"
              dir="rtl"
            >
              تعديل بيانات العميل
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleEditRecipientSubmit}
            className="sm:space-y-4 space-y-2"
            dir="rtl"
          >
            {/* اسم العنوان */}
            <div className="space-y-2">
              <Label
                htmlFor="clientName"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                اسم العميل
              </Label>
              <Input
                name="clientName"
                value={editRecipient.clientName}
                onChange={handleEditRecipientChange}
                placeholder="اسم العميل"
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="clientPhone"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <Phone className="h-4 w-4 text-[#1A5889]" />
                رقم الجوال
              </Label>
              <Input
                name="clientPhone"
                placeholder="رقم الجوال"
                value={editRecipient.clientPhone}
                onChange={handleEditRecipientChange}
                required
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="clientEmail"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <Mail className="h-4 w-4 text-[#1A5889]" />
                البريد الإلكتروني
              </Label>
              <Input
                name="clientEmail"
                placeholder="البريد الإلكتروني"
                value={editRecipient.clientEmail}
                onChange={handleEditRecipientChange}
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>
            {/* الدولة*/}
            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                الدولة
              </Label>
              <Input
                name="country"
                placeholder="الدولة"
                value={editRecipient.country}
                onChange={handleEditRecipientChange}
                required
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>
            {/* المدينة*/}
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                المدينة
              </Label>
              <div className="relative">
                <input
                  id="city"
                  autoComplete="off"
                  value={citySearch || form.city}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setForm({ ...form, city: "" });
                  }}
                  required
                  placeholder="المدينة"
                  className={"v7-neu-input"}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setTimeout(() => setDescFocused(false), 200)}
                />
                {/* Dropdown results */}
                {descFocused && citySearch && (
                  <CityAutocompleteDropdown
                    search={citySearch}
                    setValue={setValue}
                    onSelect={(cityObj) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setEditRecipient({
                        ...editRecipient,
                        city: cityObj.name_ar,
                      });

                      setCitySearch("");
                      setDescFocused(false);
                    }}
                    onSelectWithEnglish={(cityObj, setValue) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setValue("recipient_city", cityObj.name_ar);
                      setValue("recipient_city_en", cityObj.name_en);
                      setEditRecipient({
                        ...editRecipient,
                        city: cityObj.name_ar,
                      });

                      setCitySearch("");
                      setDescFocused(false);
                    }}
                  />
                )}
              </div>
            </div>

            {/* العنوان التفصيلي */}
            <div className="space-y-2">
              <Label
                htmlFor="clientAddress"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                العنوان التفصيلي
              </Label>
              <Input
                id="clientAddress"
                name="clientAddress"
                placeholder="الحي/المنطقة، الشارع، رقم المبنى"
                value={editRecipient.clientAddress}
                onChange={handleEditRecipientChange}
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>
            {/* العنوان الوطني */}
            <div className="space-y-2">
              <Label
                htmlFor="nationalAddress"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                العنوان الوطني
              </Label>
              <Input
                id="nationalAddress"
                name="nationalAddress"
                placeholder="العنوان الوطني"
                value={(editRecipient as any).nationalAddress || ""}
                onChange={handleEditRecipientChange}
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>

            {updateError && (
              <div className="text-red-500 text-sm">
                {typeof updateError === "string"
                  ? updateError
                  : "حدث خطأ أثناء التعديل"}
              </div>
            )}
            <DialogFooter>
              <Button
                type="button"
                className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db] sm:text-base text-sm mt-2"
                disabled={isUpdating}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEditRecipientSubmit(e as unknown as React.FormEvent);
                }}
              >
                {isUpdating ? "جاري التعديل..." : "حفظ التعديلات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
