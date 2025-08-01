import { useState } from "react";
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
import { Mail, Phone, MapPin, User, Search } from "lucide-react";

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
  error,
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
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Combine country and city for clientAddress, and set district to '----'
    const payload = {
      ...form,
      clientAddress: `${form.country}, ${form.city}`,
      district: "----",
    };
    await onSubmit(payload);
    setSubmitting(false);
  };

  const handleClose = () => {
    setForm({
      clientName: "",
      clientAddress: "",
      district: "",
      city: "",
      country: "",
      clientEmail: "",
      clientPhone: "",
      customer: "",
    });
    onClose();
  };
  const filteredOrders = citys.filter((city) => {
    if (!search) return true;
    const filter = city || "";
    const searchValue = search;
    return filter;
  });
  const [weightFocused, setWeightFocused] = useState(false);
  const [weightFocusedA, setWeightFocusedA] = useState(false);
  const [weightFocusedAA, setWeightFocusedAA] = useState(false);
  const [weightFocusedAAA, setWeightFocusedAAA] = useState(false);
  const [weightFocusedM, setWeightFocusedM] = useState(false);
  const [weightFocusedAM, setWeightFocusedAM] = useState(false);
  const [weightFocusedMA, setWeightFocusedMA] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className=" ">
        <DialogHeader>
          <DialogTitle className=" text-black/90 w-full mt-6 text-right text-2xl flex items-center gap-4  ">
            <User className="h-[1.5rem] w-[1.5rem] text-[#1A5889] bg-[#3498db]/20  rounded-full " />
            إضافة عميل جديد
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2 flex flex-col gap-4">
          {/* <Input name="clientName" placeholder="الاسم" value={form.clientName} onChange={handleChange} required /> */}
          <div className="space-y-2">
            <Label
              htmlFor="clientName"
              className="text-lg font-medium flex items-center gap-2 text-[#1A5889]"
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
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
              )}
              onFocus={() => setWeightFocused(true)}
              onBlur={() => setWeightFocused(false)}
              style={weightFocused ? { boxShadow: "0 2px 0 0 #3498db" } : {}}
            />
          </div>
          {/* رقم الجوال */}
          <div className="flex gap-2">
            <div className="  flex-1 space-y-2">
              <Label
                htmlFor="clientPhone"
                className="text-lg font-medium flex items-center gap-2 text-[#1A5889]"
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
                style={
                  weightFocusedA
                    ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                    : {}
                }
              />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-lg font-medium flex items-center gap-2 text-[#1A5889]"
            >
              <MapPin className="h-4 w-4 text-[#1A5889]" />
              البريد الإلكتروني
            </Label>

            <input
              name="clientEmail"
              value={form.clientEmail}
              onChange={handleChange}
              required
              placeholder="example@gmail.com"
              className={cn(
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
              )}
              onFocus={() => setWeightFocusedM(true)}
              onBlur={() => setWeightFocusedM(false)}
              style={
                weightFocusedM
                  ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                  : {}
              }
            />
          </div>

          <div className="space-y-2 ">
            <Label
              htmlFor="country"
              className="text-lg font-medium flex items-center gap-2 text-[#1A5889]"
            >
              <MapPin className="h-4 w-4 text-[#1A5889] " />
              الدولة
              <span className=" text-red-500">*</span>
            </Label>
            <Select onValueChange={handleCityChange} value={form.city}>
              <SelectTrigger
                id="city"
                className={cn(
                  " v7-neu-input text-[#1A5889] bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
              >
                <SelectValue placeholder="اختر الدولة" className="  " />
              </SelectTrigger>
              <SelectContent className=" bg-white max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar ">
                <div className=" mt-2 relative flex-1">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
                  <input
                    dir="rtl"
                    type="search"
                    className="v7-neu-input w-full  py-2 text-sm"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label=" "
                  />
                </div>
                {countrys
                  .filter((country) => country.includes(search))
                  .map((country) => (
                    <SelectItem
                      dir="rtl"
                      key={country}
                      value={country}
                      className="py-2 px-3 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer  "
                    >
                      {country}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 ">
            <Label
              htmlFor="city"
              className="text-lg font-medium flex items-center gap-2 text-[#1A5889]"
            >
              <MapPin className="h-4 w-4 text-[#1A5889] " />
              المدينة
              <span className=" text-red-500">*</span>
            </Label>
            <Select onValueChange={handleCityChange} value={form.city}>
              <SelectTrigger
                id="city"
                className={cn(
                  " v7-neu-input text-[#1A5889] bg-transparent border-none shadow-none outline-none text-base w-full"
                )}
              >
                <SelectValue
                  placeholder="اختر المدينة"
                  className=" text-[#1A5889] "
                />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar ">
                <div className=" mt-2 relative flex-1">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gry" />
                  <input
                    dir="rtl"
                    type="search"
                    className="v7-neu-input w-full  py-2 text-sm"
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label=" "
                  />
                </div>
                {citys
                  ?.filter((city) => city.includes(search))
                  ?.map((city) => (
                    <SelectItem
                      dir="rtl"
                      key={city}
                      value={city}
                      className="py-2 px-3 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer  "
                    >
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-lg font-medium flex items-center gap-2  text-[#1A5889]"
            >
              <MapPin className="h-4 w-4 text-[#1A5889]" />
              معلومات العنوان
            </Label>

            <input
              name="address"
              value={form.clientAddress}
              type="text"
              onChange={handleChange}
              placeholder="الحي, الشارع, رقم المبنى"
              className={cn(
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full "
              )}
              onFocus={() => setWeightFocusedAM(true)}
              onBlur={() => setWeightFocusedAM(false)}
              style={
                weightFocusedAM
                  ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                  : {}
              }
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-lg font-medium flex items-center gap-2  text-[#1A5889]"
            >
              <MapPin className="h-4 w-4 text-[#1A5889]" />
              الرمز البريدي
            </Label>

            <input
              name=""
              value={form.district}
              type="text"
              onChange={handleChange}
              placeholder="الرمز البريدي"
              className={cn(
                "v7-neu-input bg-transparent border-none shadow-none outline-none text-base w-full"
              )}
              onFocus={() => setWeightFocusedMA(true)}
              onBlur={() => setWeightFocusedMA(false)}
              style={
                weightFocusedMA
                  ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                  : {}
              }
            />
          </div>

          {/* <Input name="country" placeholder="الدولة" value={form.country} onChange={handleChange} required /> */}
          {/* <Input name="clientEmail" placeholder="البريد الإلكتروني" value={form.clientEmail} onChange={handleChange} required />
          <Input name="clientPhone" placeholder="رقم الجوال" value={form.clientPhone} onChange={handleChange} required /> */}
          {error && (
            <div className="text-red-500 text-sm">
              {typeof error === "string" ? error : "حدث خطأ أثناء إضافة العميل"}
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
              disabled={isLoading || submitting}
            >
              {isLoading || submitting ? "جاري الإضافة..." : "إضافة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
