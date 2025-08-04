"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Phone, MapPin, User, Building, Search } from "lucide-react";
import ResponseModal from "../../components/ResponseModal";
import { useGetCustomerMeQuery } from "../../api/customerApi";
import CityAutocompleteDropdown from "./CityAutocompleteDropdown";
import CountryAutocompleteDropdown from "./CountryAutocompleteDropdownProps ";

const citys = [
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
const countrys = [
  "السعودية",
  "الأمارات",
  "الكويت",
  "البحرين",
  "قطر",
  "عمان",
  "مصر",
];

interface AddRecipientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: any;
  initialValues?: {
    clientName?: string;
    clientAddress?: string;
    district?: string;
    city?: string;
    country?: string;
    clientEmail?: string;
    clientPhone?: string;
    customer?: string;
  };
}

export function AddRecipientForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialValues,
}: AddRecipientFormProps) {
  const [form, setForm] = useState({
    clientName: initialValues?.clientName || "",
    clientAddress: initialValues?.clientAddress || "",
    district: initialValues?.district || "",
    city: initialValues?.city || "",
    country: initialValues?.country || "",
    clientEmail: initialValues?.clientEmail || "",
    clientPhone: initialValues?.clientPhone || "",
    customer: initialValues?.customer || "",
  });

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [search, setSearch] = useState("");
  const { data: customerMeData } = useGetCustomerMeQuery();
const [countrySearch, setCountrySearch] = useState("");
const [focused, setFocused] = useState<"" | "country" | "city">("");

  const methods = useForm({
    defaultValues: {
      clientName: "",
      clientPhone: "",
      country: "السعودية",
      city: "",
      clientEmail: "",
      district: ""
    },
  });

  const { register, handleSubmit, reset, watch } = methods;

  const handleFormSubmit = async (data: any) => {
    try {
      const clientAddress = `${data.country}, ${data.city}`;
      const clientEmail = customerMeData?.data?.email || "";
await onSubmit({
  clientName: form.clientName,
  clientPhone: form.clientPhone,
  city: form.city,
  // country: form.country || countrySearch,
  country:"السعودية",
  clientEmail,
  clientAddress,
  district: form.district,
});


      setAlertStatus("success");
      setAlertMessage("تمت إضافة العنوان بنجاح");
      setAlertOpen(true);
      reset();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      setAlertStatus("fail");
      setAlertMessage(error?.data?.message || "حدث خطأ أثناء إضافة العنوان");
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value });
  };

  const [weightFocused, setWeightFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);
  const [weightFocusedA, setWeightFocusedA] = useState(false);
  const [descFocusedA, setDescFocusedA] = useState(false);
  const [weightFocusedAA, setWeightFocusedAA] = useState(false);
  const [descFocusedAA, setDescFocusedAA] = useState(false);
  const [descFocusedMA, setDescFocusedMA] = useState(false);
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className=" border-none ">
          <DialogHeader>
            <DialogTitle className=" text-black/90 w-full sm:mt-6 mt-0 text-right sm:text-2xl text-lg flex items-center gap-4  ">
              <User className="h-[1.5rem] w-[1.5rem] text-[#1A5889] bg-[#3498db]/20  rounded-full  " />
              إضافة مستلم
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-2  flex flex-col gap-2"
          >
            {/* <Input name="clientName" placeholder="الاسم" value={form.clientName} onChange={handleChange} required /> */}
            <div className="space-y-2">
              <Label
                htmlFor="clientName"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889] " />
                اسم العميل
                <span className=" text-red-500">*</span>
              </Label>

              <input
                name="clientName"
                placeholder="الاسم"
                value={form.clientName}
                onChange={handleChange}
                required
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full "
                )}
                onFocus={() => setWeightFocused(true)}
                onBlur={() => setWeightFocused(false)}

              />
            </div>
            {/* رقم الجوال */}
            <div className="flex gap-2">
              <div className="  flex-1 space-y-2">
                <Label
                  htmlFor="clientPhone"
                  className="sm:text-lg text-basefont-medium flex items-center gap-2 text-[#1A5889]"
                >
                  <Phone className="h-4 w-4 text-[#1A5889]" />
                  رقم الجوال
                  <span className=" text-red-500">*</span>
                </Label>

                <input
                  name="clientPhone"
                  value={form.clientPhone}
                  onChange={handleChange}
                  required
                  placeholder="05xxxxxxxx"
                  className={cn(
                    "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                  )}
                  onFocus={() => setWeightFocusedA(true)}
                  onBlur={() => setWeightFocusedA(false)}
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium  flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                البريد الإلكتروني
              </Label>

              <input
                name="clientEmail"
                value={form.clientEmail}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
                onFocus={() => setWeightFocusedAA(true)}
                onBlur={() => setWeightFocusedAA(false)}
              />
            </div>

            <div className="space-y-2 ">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium  flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                الدولة
                <span className=" text-red-500">*</span>
              </Label>
              <input
                name="country"
                value="السعودية"
                readOnly
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full text-[#1A5889]"
                )}
              />
                            {/* <div className="relative">
<input
  name="country"
  // value={countrySearch || form.country}
  value={"السعودية"}
  onChange={(e) => {
    setCountrySearch(e.target.value);
    setForm({ ...form, country: "" });
  }}
  placeholder="السعودية"
  readOnly
  className={cn("v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full")}
  onFocus={() => setFocused("country")}
  onBlur={() => setTimeout(() => setFocused(""), 200)}
/>
{focused === "country" && countrySearch && (
  <CountryAutocompleteDropdown
  
    search={countrySearch}
    onSelect={(obj) => {
      setForm({ ...form, country: obj.name_ar });
      setCountrySearch("");
      setFocused("");
    }}
  />
)} */}

              {/* </div> */}
            </div>
            <div className="space-y-2 ">
              <Label
                htmlFor="city"
                className="sm:text-lg text-basefont-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889] " />
                المدينة
                <span className=" text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  name="city"
                  autoComplete="off"
                  value={search || form.city}
                  onChange={e => {
                    setSearch(e.target.value);
                    setForm({ ...form, city: "" }); // امسح قيمة المدينة والمنطقة حتى يختار المستخدم من القائمة
                  }}
                  required
                  placeholder="المدينة"
                  className={cn(
                    "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
                  )}
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setTimeout(() => setDescFocused(false), 200)}
                />
                {/* Dropdown results */}
                {descFocused && search && (
                  <CityAutocompleteDropdown
                    search={search}
                    onSelect={cityObj => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setSearch("");
                      setDescFocused(false);
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium flex items-center gap-2  text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                معلومات العنوان
              </Label>

              <input
                name="clientAddress"
                value={form.clientAddress}
                type="text"
                onChange={handleChange}
                placeholder="الحي, الشارع, رقم المبنى"
                className={cn(
                  "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full "
                )}
                onFocus={() => setDescFocusedAA(true)}
                onBlur={() => setDescFocusedAA(false)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium flex items-center gap-2  text-[#1A5889]"
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
                onFocus={() => setDescFocusedA(true)}
                onBlur={() => setDescFocusedA(false)}
              />
            </div>

            {/* removed district and customer inputs */}
            <DialogFooter className="gap-2">
              <div className=" flex items-center gap-4">

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
                disabled={isLoading}
              >
                {isLoading ? "جاري الإضافة..." : "إضافة العنوان"}
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
