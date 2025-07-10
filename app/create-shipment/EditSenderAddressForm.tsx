import { useState, useEffect } from "react";
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
import { Mail, Phone, MapPin, User, Building } from "lucide-react";

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

interface EditSenderAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: {
    _id: string;
    alias: string;
    phone: string;
    city: string;
    location: string;
    email: string;
    country?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: any;
}

export function EditSenderAddressForm({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
  isLoading = false,
  error,
}: EditSenderAddressFormProps) {
  const [form, setForm] = useState(initialValues);
  useEffect(() => {
    setForm(initialValues);
  }, [initialValues, isOpen]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCityChange = (value: string) => {
    setForm({ ...form, city: value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };
  const handleClose = () => {
    setSubmitting(false);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل عنوان الالتقاط</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            name="alias"
            placeholder="اسم العنوان"
            value={form.alias}
            onChange={handleChange}
            required
          />
          <Input
            name="location"
            placeholder="العنوان التفصيلي"
            value={form.location}
            onChange={handleChange}
            required
          />
          <Input
            name="phone"
            placeholder="رقم الجوال"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-medium flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-[#3498db]" />
              المدينة
            </Label>
            <Select onValueChange={handleCityChange} value={form.city}>
              <SelectTrigger id="city" className={cn("v7-neu-input")}>
                {" "}
                <SelectValue placeholder="اختر المدينة" />{" "}
              </SelectTrigger>
              <SelectContent className="bg-white max-h-48 overflow-y-auto border border-gray-200 shadow-lg rounded-lg custom-scrollbar">
                {cities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city}
                    className="py-2 px-3 hover:bg-blue-50 focus:bg-blue-100 cursor-pointer transition-colors"
                  >
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            name="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            name="country"
            placeholder="الدولة"
            value={form.country || ""}
            onChange={handleChange}
            required
          />
          {error && (
            <div className="text-red-500 text-sm">
              {typeof error === "string" ? error : "حدث خطأ أثناء التعديل"}
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
              disabled={isLoading || submitting}
            >
              {isLoading || submitting ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
