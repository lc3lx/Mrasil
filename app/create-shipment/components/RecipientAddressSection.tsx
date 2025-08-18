import { useState, Dispatch, SetStateAction } from "react";
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
    district: string;
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
    alias: yup.string().required("اسم العنوان مطلوب"),
    email: yup.string(),
    location: yup.string(),
    phone: yup.string().required("رقم الجوال مطلوب"),
    city: yup.string().required("المدينة مطلوبة"),
    country: yup.string().required("الدولة مطلوبة"),
    district: yup.string(),
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

  const recipientCards = clientAddressesData?.data || [];
  const [openRecipientModal, setOpenRecipientModal] = useState(false);
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
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    city: initialValues?.city || "",
    country: initialValues?.country || "",
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  const handleSelectRecipient = (card: any) => {
    if (selectedRecipient === card._id) {
      setSelectedRecipient(null);
      setValue("recipient_full_name", "");
      setValue("recipient_mobile", "");
      setValue("recipient_city", "");
      setValue("recipient_address", "");
      setValue("recipient_email", "");
      setValue("recipient_district", "");
    } else {
      setSelectedRecipient(card._id);
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
  const displayedRecipientCards = showAllRecipients
    ? filteredRecipientCards
    : filteredRecipientCards.slice(0, 6);

  return (
    <motion.div variants={staggerChildren}>
      <div className="flex items-center gap-3 pb-4">
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
        <h2 className="text-3xl font-semibold text-[#1a365d]">
          بيانات المستلم
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative v7-neu-input-container flex-1 min-w-[240px]">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />

          <Input
            type="text"
            placeholder="ابحث ضمن عناوين العملاء"
            value={searchRecipient}
            onChange={(e) => setSearchRecipient(e.target.value)}
            className="v7-neu-input w-full pr-12 pe-4 text-gry  text-base"
            style={{ direction: "rtl", fontFamily: "inherit" }}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpenRecipientModal(true)}
          className="v7-neu-button-accent w-full sm:w-fit  bg-gradient-to-r from-[#3498db] to-[#2980b9] hover:from-[#2980b9] hover:to-[#3498db] transition-all duration-300 px-8 py-2 rounded-lg text-white font-bold flex items-center  text-center justify-center gap-2"
        >
          + مستلم جديد
        </button>
      </div>
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
                  <Check className="h-4 w-4 text-white" />
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
                <Edit className="h-4 w-4 text-[#3498db]" />
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
              <div className="font-bold text-2xl">{card.clientName}</div>
              <div className="flex items-center gap-2 text-lg text-gray-700">
                <Phone className="h-4 w-4 text-[#3498db]" />
                <span>{card.clientPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-lg text-gray-700">
                <MapPin className="h-4 w-4 text-[#3498db]" />
                <span>
                  {card.city}
                  {card.clientAddress ? `، ${card.clientAddress}` : ""}
                </span>
              </div>
              {card.district && (
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <span className="font-bold">الحي/المنطقة:</span>
                  <span>{card.district}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-lg text-gray-500">
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
      {/* Recipient Modal */}
      <Dialog open={openRecipientModal} onOpenChange={setOpenRecipientModal}>
        <DialogContent className="bg-transparent shadow-none p-0 max-w-lg w-full flex items-center justify-center ">
          <div
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full relative overflow-hidden"
            style={{ opacity: 1, transform: "none" }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#3498db]/5 to-transparent rounded-full transform translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-[#3498db]/5 to-transparent rounded-full transform -translate-x-20 translate-y-20"></div>
            <div className="relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#3498db]/10 flex items-center justify-center">
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
                      className="lucide lucide-user h-4 w-4 text-[#3498db]"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  إضافة عميل جديد
                </h3>
                <button
                  className="ring-offset-background focus-visible:outline-hidden focus-visible:ring-ring inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-8 w-8 rounded-full hover:bg-[#3498db]/10"
                  onClick={() => setOpenRecipientModal(false)}
                  type="button"
                >
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
                    className="lucide lucide-x h-5 w-5"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
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
                initialValues={{
                  clientName: "",
                  clientAddress: "",
                  district: "",
                  city: "",
                  country: "",
                  clientEmail: "",
                  clientPhone: "",
                  customer: "",
                }}
              />
            </div>
          </div>
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
                  value={search || form.city}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setForm({ ...form, city: "" });
                  }}
                  required
                  placeholder="المدينة"
                  className={ "v7-neu-input"}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setTimeout(() => setDescFocused(false), 200)}
                />
                {/* Dropdown results */}
                {descFocused && search && (
                  <CityAutocompleteDropdown
                    search={search}
                    onSelect={(cityObj) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setEditRecipient({
                        ...editRecipient,
                        city: cityObj.name_ar,
                      });

                      setSearch("");
                      setDescFocused(false);
                    }}
                  />
                )}
              </div>
            </div>

            {/* العنوان*/}
            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                العنوان التفصيلي
              </Label>
              <Input
                name="district"
                placeholder="الحي/المنطقة"
                value={editRecipient.district}
                onChange={handleEditRecipientChange}
                className={"v7-neu-input"}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
            </div>
            {/* العنوان*/}
            <div className="space-y-2">
              <Label
                htmlFor="clientAddress"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                الرمز البريدي
              </Label>
              <Input
                id="clientAddress"
                name="clientAddress"
                placeholder="البريدي الرمز"
                value={editRecipient.customer}
                onChange={handleEditRecipientChange}
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
                type="submit"
                className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db] sm:text-base text-sm mt-2"
                disabled={isUpdating}
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
