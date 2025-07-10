"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { Phone, Mail, MapPin, User, Building } from "lucide-react";
import ResponseModal from "../components/ResponseModal";

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

const schema = yup
  .object({
    clientName: yup.string().required("اسم العميل مطلوب"),
    clientAddress: yup.string().required("عنوان العميل مطلوب"),
    clientPhone: yup.string().required("رقم الجوال مطلوب"),
    clientEmail: yup
      .string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    country: yup.string().required("الدولة مطلوبة"),
    city: yup.string().required("المدينة مطلوبة"),
    district: yup.string().required("الحي/المنطقة مطلوبة"),
    customer: yup.string(), // optional for now
  })
  .required();

interface AddSenderAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function AddSenderAddressForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddSenderAddressFormProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      clientName: "",
      clientAddress: "",
      clientPhone: "",
      clientEmail: "",
      country: "السعودية",
      city: "",
      district: "",
      customer: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#3498db]" />
              إضافة عنوان جديد
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit((data) =>
              handleFormSubmit({
                clientName: data.clientName,
                clientAddress: data.clientAddress,
                clientPhone: data.clientPhone,
                clientEmail: data.clientEmail,
                country: data.country,
                city: data.city,
                district: data.district,
                customer: data.customer || "",
              })
            )}
            className="space-y-4"
          >
            {/* اسم العميل */}
            <div className="space-y-2">
              <Label
                htmlFor="clientName"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-[#3498db]" />
                اسم العميل
              </Label>
              <Input
                id="clientName"
                {...register("clientName")}
                placeholder="اسم العميل"
                className={cn(
                  "v7-neu-input",
                  errors.clientName ? "border-red-500 focus:border-red-500" : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.clientName && (
                <p className="text-sm text-red-500">
                  {errors.clientName.message}
                </p>
              )}
            </div>
            {/* عنوان العميل */}
            <div className="space-y-2">
              <Label
                htmlFor="clientAddress"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-[#3498db]" />
                عنوان العميل
              </Label>
              <Input
                id="clientAddress"
                {...register("clientAddress")}
                placeholder="العنوان التفصيلي"
                className={cn(
                  "v7-neu-input",
                  errors.clientAddress
                    ? "border-red-500 focus:border-red-500"
                    : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.clientAddress && (
                <p className="text-sm text-red-500">
                  {errors.clientAddress.message}
                </p>
              )}
            </div>
            {/* رقم الجوال */}
            <div className="space-y-2">
              <Label
                htmlFor="clientPhone"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4 text-[#3498db]" />
                رقم الجوال
              </Label>
              <Input
                id="clientPhone"
                {...register("clientPhone")}
                placeholder="05xxxxxxxx"
                className={cn(
                  "v7-neu-input",
                  errors.clientPhone
                    ? "border-red-500 focus:border-red-500"
                    : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.clientPhone && (
                <p className="text-sm text-red-500">
                  {errors.clientPhone.message}
                </p>
              )}
            </div>
            {/* البريد الإلكتروني */}
            <div className="space-y-2">
              <Label
                htmlFor="clientEmail"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Mail className="h-4 w-4 text-[#3498db]" />
                البريد الإلكتروني
              </Label>
              <Input
                id="clientEmail"
                type="email"
                {...register("clientEmail")}
                placeholder="example@email.com"
                className={cn(
                  "v7-neu-input",
                  errors.clientEmail
                    ? "border-red-500 focus:border-red-500"
                    : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.clientEmail && (
                <p className="text-sm text-red-500">
                  {errors.clientEmail.message}
                </p>
              )}
            </div>
            {/* الدولة */}
            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-[#3498db]" />
                الدولة
              </Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="الدولة"
                className={cn(
                  "v7-neu-input",
                  errors.country ? "border-red-500 focus:border-red-500" : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
            {/* المدينة */}
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-[#3498db]" />
                المدينة
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="المدينة"
                className={cn(
                  "v7-neu-input",
                  errors.city ? "border-red-500 focus:border-red-500" : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            {/* الحي/المنطقة */}
            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="text-sm font-medium flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-[#3498db]" />
                الحي/المنطقة
              </Label>
              <Input
                id="district"
                {...register("district")}
                placeholder="الحي أو المنطقة"
                className={cn(
                  "v7-neu-input",
                  errors.district ? "border-red-500 focus:border-red-500" : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.district && (
                <p className="text-sm text-red-500">
                  {errors.district.message}
                </p>
              )}
            </div>
            {/* معرف العميل (اختياري) */}
            <div className="space-y-2">
              <Label
                htmlFor="customer"
                className="text-sm font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4 text-[#3498db]" />
                معرف العميل (اختياري)
              </Label>
              <Input
                id="customer"
                {...register("customer")}
                placeholder="معرف العميل (إن وجد)"
                className={cn(
                  "v7-neu-input",
                  errors.customer ? "border-red-500 focus:border-red-500" : ""
                )}
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.customer && (
                <p className="text-sm text-red-500">
                  {errors.customer.message}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-2"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db]"
                disabled={isLoading}
              >
                {isLoading ? "جاري الإضافة..." : "إضافة العنوان"}
              </Button>
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
