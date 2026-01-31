"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Phone,
  Edit,
  Trash2,
  PlusCircle,
  Star,
  StarOff,
  User,
  Mail,
} from "lucide-react";
import V7Layout from "@/components/v7/v7-layout";
import {
  useGetAllAddressesQuery,
  Address,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
  useCreateAddressMutation,
} from "@/app/api/adressesApi";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CityAutocompleteDropdown from "@/app/create-shipment/components/CityAutocompleteDropdown";
import ResponseModal from "@/app/components/ResponseModal";
import { useGetCustomerMeQuery } from "@/app/api/customerApi";

export default function LocationsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});
  const [showFavorites, setShowFavorites] = useState(false);

  const {
    data: addressesResponse,
    isLoading,
    isError,
  } = useGetAllAddressesQuery();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredAddresses = (addressesResponse?.data || []).filter(
    (address) => {
      if (showFavorites && !favorites[address._id]) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          address.alias.toLowerCase().includes(query) ||
          address.city.toLowerCase().includes(query) ||
          address.location.toLowerCase().includes(query)
        );
      }
      return true;
    }
  );

  const handleCreate = async (data: any) => {
    try {
      await createAddress({
        alias: data.alias,
        location: data.location,
        city: data.city,
        country: data.country || "السعودية",
        phone: data.phone,
        email: data.email,
      }).unwrap();
      toast.success("تم إضافة العنوان بنجاح!");
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error("فشل في إضافة العنوان.");
      console.error("Failed to create the address:", err);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!addressToEdit) return;

    try {
      await updateAddress({
        _id: addressToEdit._id,
        alias: data.alias,
        location: data.location,
        city: data.city,
        country: data.country || "السعودية",
        phone: data.phone,
        email: data.email,
      }).unwrap();
      toast.success("تم تحديث العنوان بنجاح!");
      setAddressToEdit(null);
    } catch (err) {
      toast.error("فشل في تحديث العنوان.");
      console.error("Failed to update the address:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (addressToDelete) {
      try {
        await deleteAddress(addressToDelete._id).unwrap();
        toast.success("تم حذف العنوان بنجاح!");
        setAddressToDelete(null);
      } catch (err) {
        toast.error("فشل في حذف العنوان.");
        console.error("Failed to delete the address: ", err);
      }
    }
  };

  return (
    <V7Layout>
      <div className="space-y-8 pb-20 mt-16">
        <div className="flex justify-between items-start flex-col md:flex-row gap-4">
          <div className="flex justify-start flex-col">
            <h1 className="text-2xl font-bold text-[#294D8B]">العناوين</h1>
            <p className="text-sm text-gry">مواقع الإستلام الخاصة بك</p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="v7-neu-button flex items-center gap-2"
          >
            <PlusCircle className="h-5 w-5" />
            إضافة عنوان جديد
          </Button>
        </div>

        <div
          className={`v7-neu-card p-6 rounded-xl v7-fade-in ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 mb-6">
            <div className="relative v7-neu-input-container w-full">
              <input
                type="search"
                placeholder="ابحث عن موقع..."
                className="v7-neu-input w-full pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute  right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
            </div>
          </div>

          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="v7-neu-card-inner rounded-xl p-5">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-red-500">
              <h3 className="text-xl font-medium">فشل في تحميل العناوين</h3>
              <p className="text-red-400 mt-2">
                تعذر جلب البيانات من الخادم. يرجى المحاولة مرة أخرى لاحقاً.
              </p>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    onEdit={() => setAddressToEdit(address)}
                    onDelete={() => setAddressToDelete(address)}
                    isFavorite={!!favorites[address._id]}
                    onToggleFavorite={() =>
                      setFavorites((favs) => ({
                        ...favs,
                        [address._id]: !favs[address._id],
                      }))
                    }
                  />
                ))
              ) : (
                <div className="text-center py-12 md:col-span-2 lg:col-span-3">
                  <MapPin className="mx-auto h-12 w-12 text-gry opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد مواقع</h3>
                  <p className="mt-2 text-sm text-gry">
                    لم يتم العثور على مواقع تطابق معايير البحث
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!addressToDelete}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
      >
        <AlertDialogContent
          className="bg-white border-[#E4E9F2] shadow-xl rounded-xl max-w-md dir-rtl"
          dir="rtl"
        >
          <AlertDialogHeader className="text-right gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-[#294D8B]">
                  تأكيد الحذف
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#6d6a67] mt-1">
                  هل أنت متأكد من حذف العنوان؟ لا يمكن التراجع عن هذا الإجراء.
                  {addressToDelete && (
                    <span className="block mt-3 p-3 rounded-lg bg-[#f0f4f8] text-[#294D8B] font-medium">
                      {addressToDelete.alias}
                    </span>
                  )}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2 sm:gap-2 mt-6">
            <AlertDialogCancel className="v7-neu-button-sm m-0">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white m-0"
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditAddressDialog
        isOpen={!!addressToEdit}
        onClose={() => setAddressToEdit(null)}
        address={addressToEdit}
        onSave={handleUpdate}
        isSaving={isUpdating}
      />

      <AddAddressDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleCreate}
        isSaving={isCreating}
      />
    </V7Layout>
  );
}

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  isFavorite,
  onToggleFavorite,
}: AddressCardProps) {
  return (
    <div className="v7-neu-card-inner rounded-xl p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-[#3498db]">{address.alias}</h3>
        <button
          onClick={onToggleFavorite}
          className="ml-2 p-1 rounded-full hover:bg-amber-50 transition"
        >
          {isFavorite ? (
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          ) : (
            <StarOff className="h-5 w-5 text-gry" />
          )}
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gry mt-1" />
          <div className="text-sm">{address.location}</div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gry" />
          <div className="text-sm">{address.phone}</div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-gry mt-1" />
          <div className="text-sm">
            <span className="font-medium">المدينة:</span> {address.city}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 v7-neu-button-sm flex items-center gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          تعديل
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 v7-neu-button-sm flex items-center gap-2 text-red-600 hover:text-red-700"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          حذف
        </Button>
      </div>
    </div>
  );
}

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isSaving: boolean;
  address?: Address | null;
}

function AddAddressDialog({
  isOpen,
  onClose,
  onSave,
  isSaving,
}: Omit<AddressDialogProps, "address">) {
  const [form, setForm] = useState({
    alias: "",
    location: "",
    city: "",
    country: "السعودية",
    phone: "",
    email: "",
    district: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [search, setSearch] = useState("");
  const { data: customerMeData } = useGetCustomerMeQuery();
  const [cityFocused, setCityFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [districtFocused, setDistrictFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Phone number validation
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: phoneValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.alias || !form.location || !form.city || !form.phone) {
      setAlertStatus("fail");
      setAlertMessage("الرجاء ملء جميع الحقول المطلوبة");
      setAlertOpen(true);
      return;
    }

    try {
      const email = form.email || customerMeData?.data?.email || "";
      await onSave({
        alias: form.alias,
        location: form.location,
        city: form.city,
        country: form.country || "السعودية",
        phone: form.phone,
        email: email,
        district: form.district,
      });

      setAlertStatus("success");
      setAlertMessage("تمت إضافة العنوان بنجاح");
      setAlertOpen(true);

      // Reset form
      setForm({
        alias: "",
        location: "",
        city: "",
        country: "السعودية",
        phone: "",
        email: "",
        district: "",
      });
      setSearch("");

      setTimeout(() => {
        onClose();
        setAlertOpen(false);
      }, 1500);
    } catch (error: any) {
      setAlertStatus("fail");
      setAlertMessage(error?.data?.message || "حدث خطأ أثناء إضافة العنوان");
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    setForm({
      alias: "",
      location: "",
      city: "",
      country: "السعودية",
      phone: "",
      email: "",
      district: "",
    });
    setSearch("");
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className="border-none overflow-y-auto max-h-screen scroll z-[99]"
          dir="ltr"
        >
          <DialogHeader>
            <DialogTitle
              className="text-black/90 w-full sm:mt-6 mt-0 text-right sm:text-2xl text-lg flex items-center gap-4"
              dir="rtl"
            >
              <User className="h-[1.5rem] w-[1.5rem] text-[#1A5889] bg-[#3498db]/20 rounded-full" />
              إضافة عنوان جديد
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-2 flex flex-col sm:gap-2 gap-1"
            dir="rtl"
          >
            <div className="space-y-1">
              <Label
                htmlFor="alias"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                اسم العميل
                <span className="text-red-500">*</span>
              </Label>
              <input
                name="alias"
                placeholder="الاسم"
                value={form.alias}
                onChange={handleChange}
                required
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="phone"
                  className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
                >
                  <Phone className="h-4 w-4 text-[#1A5889]" />
                  رقم الجوال
                  <span className="text-red-500">*</span>
                </Label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="05xxxxxxxx"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={cn(
                    "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                  )}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="email"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <Mail className="h-4 w-4 text-[#1A5889]" />
                البريد الإلكتروني
              </Label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                type="email"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                الدولة
                <span className="text-red-500">*</span>
              </Label>
              <input
                name="country"
                value="السعودية"
                readOnly
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                المدينة
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  name="city"
                  autoComplete="off"
                  value={search || form.city}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setForm({ ...form, city: "" });
                  }}
                  required
                  placeholder="المدينة"
                  className={cn(
                    "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                  )}
                  onFocus={() => setCityFocused(true)}
                  onBlur={() => setTimeout(() => setCityFocused(false), 200)}
                />
                {cityFocused && search && (
                  <CityAutocompleteDropdown
                    search={search}
                    onSelect={(cityObj) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setSearch("");
                      setCityFocused(false);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="location"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                معلومات العنوان
                <span className="text-red-500">*</span>
              </Label>
              <input
                name="location"
                value={form.location}
                type="text"
                required
                onChange={handleChange}
                placeholder="الحي, الشارع, رقم المبنى"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="district"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                الرمز البريدي
              </Label>
              <input
                name="district"
                value={form.district}
                type="text"
                onChange={handleChange}
                placeholder="الرمز البريدي"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setDistrictFocused(true)}
                onBlur={() => setDistrictFocused(false)}
              />
            </div>

            <DialogFooter className="gap-2 flex">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-2 text-sm sm:text-base"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db] sm:text-base text-sm"
                  disabled={isSaving}
                >
                  {isSaving ? "جاري الإضافة..." : "إضافة العنوان"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
    </>
  );
}

function EditAddressDialog({
  isOpen,
  onClose,
  address,
  onSave,
  isSaving,
}: AddressDialogProps) {
  const [form, setForm] = useState({
    alias: "",
    location: "",
    city: "",
    country: "السعودية",
    phone: "",
    email: "",
    district: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [search, setSearch] = useState("");
  const { data: customerMeData } = useGetCustomerMeQuery();
  const [cityFocused, setCityFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [addressFocused, setAddressFocused] = useState(false);
  const [districtFocused, setDistrictFocused] = useState(false);

  useEffect(() => {
    if (address) {
      setForm({
        alias: address.alias || "",
        location: address.location || "",
        city: address.city || "",
        country: address.country || "السعودية",
        phone: address.phone || "",
        email: (address as any).email || "",
        district: (address as any).district || "",
      });
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Phone number validation
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: phoneValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.alias || !form.location || !form.city || !form.phone) {
      setAlertStatus("fail");
      setAlertMessage("الرجاء ملء جميع الحقول المطلوبة");
      setAlertOpen(true);
      return;
    }

    try {
      const email = form.email || customerMeData?.data?.email || "";
      await onSave({
        ...address,
        alias: form.alias,
        location: form.location,
        city: form.city,
        country: form.country || "السعودية",
        phone: form.phone,
        email: email,
        district: form.district,
      });

      setAlertStatus("success");
      setAlertMessage("تم تحديث العنوان بنجاح");
      setAlertOpen(true);

      setTimeout(() => {
        onClose();
        setAlertOpen(false);
      }, 1500);
    } catch (error: any) {
      setAlertStatus("fail");
      setAlertMessage(error?.data?.message || "حدث خطأ أثناء تحديث العنوان");
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          className="border-none overflow-y-auto max-h-screen scroll z-[99]"
          dir="ltr"
        >
          <DialogHeader>
            <DialogTitle
              className="text-black/90 w-full sm:mt-6 mt-0 text-right sm:text-2xl text-lg flex items-center gap-4"
              dir="rtl"
            >
              <User className="h-[1.5rem] w-[1.5rem] text-[#1A5889] bg-[#3498db]/20 rounded-full" />
              تعديل العنوان
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-2 flex flex-col sm:gap-2 gap-1"
            dir="rtl"
          >
            <div className="space-y-1">
              <Label
                htmlFor="alias"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                اسم العميل
                <span className="text-red-500">*</span>
              </Label>
              <input
                name="alias"
                placeholder="الاسم"
                value={form.alias}
                onChange={handleChange}
                required
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="phone"
                  className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
                >
                  <Phone className="h-4 w-4 text-[#1A5889]" />
                  رقم الجوال
                  <span className="text-red-500">*</span>
                </Label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="05xxxxxxxx"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={cn(
                    "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                  )}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="email"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <Mail className="h-4 w-4 text-[#1A5889]" />
                البريد الإلكتروني
              </Label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                type="email"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                الدولة
                <span className="text-red-500">*</span>
              </Label>
              <input
                name="country"
                value="السعودية"
                readOnly
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                المدينة
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  name="city"
                  autoComplete="off"
                  value={search || form.city}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setForm({ ...form, city: "" });
                  }}
                  required
                  placeholder="المدينة"
                  className={cn(
                    "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                  )}
                  onFocus={() => setCityFocused(true)}
                  onBlur={() => setTimeout(() => setCityFocused(false), 200)}
                />
                {cityFocused && search && (
                  <CityAutocompleteDropdown
                    search={search}
                    onSelect={(cityObj) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setSearch("");
                      setCityFocused(false);
                    }}
                  />
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="location"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                معلومات العنوان
                <span className="text-red-500">*</span>
              </Label>
              <input
                name="location"
                value={form.location}
                type="text"
                required
                onChange={handleChange}
                placeholder="الحي, الشارع, رقم المبنى"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label
                htmlFor="district"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                الرمز البريدي
              </Label>
              <input
                name="district"
                value={form.district}
                type="text"
                onChange={handleChange}
                placeholder="الرمز البريدي"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setDistrictFocused(true)}
                onBlur={() => setDistrictFocused(false)}
              />
            </div>

            <DialogFooter className="gap-2 flex">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-2 text-sm sm:text-base"
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db] sm:text-base text-sm"
                  disabled={isSaving}
                >
                  {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ResponseModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        status={alertStatus}
        message={alertMessage}
      />
    </>
  );
}
