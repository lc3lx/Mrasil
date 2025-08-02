import { useState } from "react";
import { useSearchCitiesQuery } from "../../api/cityApi";
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

import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, User, Search } from "lucide-react";


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
    country: "السعودية", // الدولة ثابتة
    clientEmail: initialValues?.clientEmail || "",
    clientPhone: initialValues?.clientPhone || "",
    customer: initialValues?.customer || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const { data: cityResults, isLoading: isCityLoading } = useSearchCitiesQuery(
    search,
    { skip: !search }
  );

  // cityResults?.results || []
  // إذا لم توجد خاصية results استخدم data
  const citySuggestions = cityResults?.result || cityResults?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      country: "السعودية",
      clientEmail: "",
      clientPhone: "",
      customer: "",
    });
    onClose();
  };

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

          <div className="flex-1 space-y-2">
            <Label
              htmlFor="country"
              className="text-lg font-medium flex items-center gap-2 text-[#1A5889]"
            >
              <MapPin className="h-4 w-4 text-[#1A5889]" />
              الدولة
              <span className=" text-red-500">*</span>
            </Label>
            <input
              name="country"
              value="السعودية"
              readOnly
              className="fixed-country-input"
            />
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
                onFocus={() => setWeightFocusedAAA(true)}
                onBlur={() => setTimeout(() => setWeightFocusedAAA(false), 200)}
                style={
                  weightFocusedAAA
                    ? { boxShadow: "0 2px 0 0 #3498db", fontFamily: "inherit" }
                    : {}
                }
              />
              {/* Dropdown results */}
              {weightFocusedAAA && search && (
                <div className="absolute z-50 w-full bg-white max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar mt-1">
                  {isCityLoading ? (
                    <div className="py-2 px-3 text-gray-500">جاري البحث...</div>
                  ) : citySuggestions.length > 0 ? (
                    citySuggestions.map((city: any) => (
                      <div
                        key={city.city_id}
                        className="py-2 px-3 hover:bg-blue-50 cursor-pointer text-right"
                        onMouseDown={() => {
                          setForm({ ...form, city: city.name_ar });
                          setSearch("");
                          setWeightFocusedAAA(false);
                        }}
                      >
                        <div className="font-bold text-base">{city.name_ar}</div>
                        <div className="text-xs text-gray-500">{city.region_name}</div>
                      </div>
                    ))
                  ) : search.length > 1 ? (
                    <div className="py-2 px-3 text-gray-400">لا توجد نتائج</div>
                  ) : null}
                </div>
              )}
            </div>
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
              name="clientAddress"
              value={form.clientAddress}
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
              name="district"
              value={form.district}
              type="text"
              onChange={handleChange}
              placeholder="الحي، الشارع، رقم المبنى"
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
