"use client";

import { useState, useEffect } from "react";
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
import { Phone, Mail, MapPin, User, Building } from "lucide-react";
import ResponseModal from "../../components/ResponseModal";
import CityAutocompleteDropdown from "./CityAutocompleteDropdown";

const schema = yup
  .object({
    alias: yup.string().required("اسم العنوان مطلوب"),
    email: yup.string(),
    location: yup.string(),
    phone: yup
      .string()
      .required("رقم الجوال مطلوب")
      .length(10, "رقم الجوال يجب أن يكون 10 أرقام"),
    city: yup.string().required("المدينة مطلوبة"),
    country: yup.string().required("الدولة مطلوبة"),
    addressDetails: yup.string().required("العنوان الوطني مطلوب"),
  })
  .required();

interface EditSenderAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  initialValues: {
    alias: string;
    location: string;
    phone: string;
    city: string;
    country: string;
    addressDetails: string;
    email: string;
  };
}

export function EditSenderAddressForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialValues,
}: EditSenderAddressFormProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"success" | "fail">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [search, setSearch] = useState("");
  const [descFocused, setDescFocused] = useState(false);
  const [form, setForm] = useState({
    city: initialValues?.city || "",
    country: initialValues?.country || "",
  });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      setAlertStatus("success");
      setAlertMessage("تم تعديل العنوان بنجاح");
      setAlertOpen(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: any) {
      setAlertStatus("fail");
      setAlertMessage(error?.data?.message || "حدث خطأ أثناء تعديل العنوان");
      setAlertOpen(true);
    }
  };

  const handleClose = () => {
    reset(initialValues);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className=" border-none overflow-y-auto  max-h-screen  scroll z-[99]"
          dir="ltr"
        >
          <DialogHeader>
            <DialogTitle
              className="sm:text-2xl text-lg font-bold text-[#1a365d] flex items-center gap-4 mt-4  "
              dir="rtl"
            >
              <Building className="h-4 w-4 text-[#1A5889]]" />
              تعديل عنوان الالتقاط
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="sm:space-y-4 space-y-2 "
            dir="rtl"
          >
            {/* اسم العنوان */}
            <div className="space-y-2">
              <Label
                htmlFor="alias"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <User className="h-4 w-4 text-[#1A5889]" />
                اسم العميل
              </Label>
              <Input
                id="alias"
                {...register("alias")}
                placeholder="اسم العميل"
                className={
                  errors.alias
                    ? "v7-neu-input border-red-500 focus:border-red-500"
                    : "v7-neu-input"
                }
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.alias && (
                <p className="text-sm text-red-500">{errors.alias.message}</p>
              )}
            </div>
            {/* رقم الجوال */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <Phone className="h-4 w-4 text-[#1A5889]" />
                رقم الجوال
              </Label>
              <Input
                id="phone"
                {...register("phone", {
                  onChange: (e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setValue("phone", value, { shouldValidate: true });
                  },
                })}
                placeholder="05xxxxxxxx"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className={
                  errors.phone
                    ? "v7-neu-input border-red-500 focus:border-red-500"
                    : "v7-neu-input"
                }
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            {/* email */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <Mail className="h-4 w-4 text-[#1A5889]" />
                البريد الألكتروني
              </Label>
              <Input
                id="email"
                {...register("email")}
                placeholder="example@gmail.com"
                className={
                  errors.phone
                    ? "v7-neu-input border-red-500 focus:border-red-500"
                    : "v7-neu-input"
                }
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            {/* الدولة */}
            <div className="space-y-2">
              <Label
                htmlFor="country"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                الدولة
              </Label>
              <Input
                id="country"
                readOnly
                {...register("country")}
                placeholder="الدولة"
                className={
                  errors.country
                    ? "v7-neu-input border-red-500 focus:border-red-500"
                    : "v7-neu-input"
                }
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
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
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
                  className={
                    errors.city
                      ? "v7-neu-input border-red-500 focus:border-red-500"
                      : "v7-neu-input"
                  }
                  onFocus={() => setDescFocused(true)}
                  onBlur={() => setTimeout(() => setDescFocused(false), 200)}
                />
                {/* Dropdown results */}
                {descFocused && search && (
                  <CityAutocompleteDropdown
                    search={search}
                    setValue={setValue}
                    onSelect={(cityObj) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setValue("city", cityObj.name_ar, {
                        shouldValidate: true,
                      });
                      setSearch("");
                      setDescFocused(false);
                    }}
                    onSelectWithEnglish={(cityObj, setValue) => {
                      setForm({ ...form, city: cityObj.name_ar });
                      setValue("shipper_city", cityObj.name_ar);
                      setValue("shipper_city_en", cityObj.name_en);
                      setValue("city", cityObj.name_ar, {
                        shouldValidate: true,
                      });
                      setSearch("");
                      setDescFocused(false);
                    }}
                  />
                )}
              </div>
            </div>
            {/*  الرمز البريدي */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                العنوان التفصيلي
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="العنوان التفصيلي"
                className={
                  errors.location
                    ? "v7-neu-input border-red-500 focus:border-red-500"
                    : "v7-neu-input"
                }
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
            {/* العنوان الوطني */}
            <div className="space-y-2">
              <Label
                htmlFor="addressDetails"
                className="sm:text-lg text-base font-medium flex items-center gap-2 text-[#1A5889]"
              >
                <MapPin className="h-4 w-4 text-[#1A5889]" />
                العنوان الوطني
                <span className=" text-red-500">*</span>
              </Label>
              <Input
                id="addressDetails"
                {...register("addressDetails")}
                placeholder="العنوان الوطني"
                className={
                  errors.addressDetails
                    ? "v7-neu-input border-red-500 focus:border-red-500"
                    : "v7-neu-input"
                }
                style={{ direction: "rtl", fontFamily: "inherit" }}
              />
              {errors.addressDetails && (
                <p className="text-sm text-red-500">
                  {errors.addressDetails.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#3498db] to-[#2980b9] text-white hover:from-[#2980b9] hover:to-[#3498db] sm:text-base text-sm "
                disabled={isLoading}
              >
                {isLoading ? "جاري التعديل..." : "حفظ التعديلات"}
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
