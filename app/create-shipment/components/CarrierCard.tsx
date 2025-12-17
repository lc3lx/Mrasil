import { Check, Package, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import realBlue from "../../../public/real-blue.png";
import { motion } from "framer-motion";
import { useCreateParcelMutation } from "@/app/api/parcelsApi";
import {
  useUpdateShipmentCompanyMutation,
  useGetAllShipmentCompaniesQuery,
} from "@/app/api/shipmentCompanyApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface BoxSize {
  key?: string;
  label: string;
  title?: string;
  length: number;
  width: number;
  height: number;
}

type Company = {
  company: string;
  shippingType: { type: string };
  // add more fields if needed
};

interface CarrierCardProps {
  company: Company;
  selectedCompany: string | null;
  handleCompanySelect: (company: string) => void;
  logoSrc?: string | null;
  firstType?: any;
  values: any;
  selectedBoxSize: BoxSize | null;
  prices?: Array<{ company: string; type: string; price: number | string }>;
  loadingPrices?: boolean;
  pricesFetched?: boolean;
  boxSizes: BoxSize[];
  setSelectedBoxSize: (box: BoxSize) => void;
  setValue: (name: string, value: any) => void;
  parcelsData: BoxSize[];
  error: string;
  setBoxSizes?: (sizes: BoxSize[]) => void;
  companiesData?: any[];
}

export default function CarrierCard({
  company,
  selectedCompany,
  handleCompanySelect,
  logoSrc,
  values,
  selectedBoxSize,
  prices = [],
  loadingPrices = false,
  pricesFetched = false,
  boxSizes = [],
  setSelectedBoxSize,
  setValue,
  parcelsData = [],
  error = "",
  setBoxSizes,
  companiesData = [],
}: CarrierCardProps) {
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customParcel, setCustomParcel] = useState({
    label: "",
    length: "",
    width: "",
    height: "",
  });
  const [createParcel, { isLoading: isCreatingParcel }] =
    useCreateParcelMutation();
  const [updateShipmentCompany] = useUpdateShipmentCompanyMutation();
  const { refetch: refetchCompanies } = useGetAllShipmentCompaniesQuery();
  const [localError, setLocalError] = useState<string>("");

  const [imgSrc, setImgSrc] = useState<string>(
    (logoSrc as string) || "/carriers/carrier-placeholder.png"
  );

  useEffect(() => {
    setImgSrc((logoSrc as string) || "/carriers/carrier-placeholder.png");
  }, [logoSrc]);

  const isSelected =
    selectedCompany === company.company &&
    values?.shipmentType === company.shippingType.type;

  const displayName =
    company.company === "omniclama"
      ? "LLAMA BOX"
      : company.company === "smsa"
      ? company.shippingType.type === "Dry"
        ? "SMSA PRO"
        : "SMSA"
      : company.company === "aramex"
      ? "ARAMEX PRO"
      : company.company.toUpperCase();

  const priceObj = prices.find(
    (p) => p.company === company.company && p.type === company.shippingType.type
  );
  const priceNumber = priceObj ? Number(priceObj.price) : 0;
  const priceDisplay =
    !isNaN(priceNumber) && priceNumber !== 0
      ? Number.isInteger(priceNumber)
        ? priceNumber
        : Number(priceNumber).toPrecision(4)
      : 0;

  return (
    <>
      <div
        className={`flex items-center justify-between v7-neu-card-inner px-6 py-4 transition-all duration-300 relative overflow-hidden w-full ${
          isSelected
            ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
            : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
        }`}
        onClick={() => handleCompanySelect(company.company)}
        style={{ cursor: "pointer" }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center sm:gap-6 gap-0">
          <div className="rounded-lg overflow-hidden">
            <Image
              sizes="80px"
              width={80}
              height={40}
              src={imgSrc}
              alt={company.company}
              className="object-contain w-[5rem] sm:min-w-[7rem] sm:min-h-[10rem]"
              onError={() => setImgSrc("/carriers/carrier-placeholder.png")}
            />
          </div>

          <span className="text-[#3498db] font-bold text-xl whitespace-nowrap">
            {displayName}
          </span>
        </div>

        <div className="flex flex-col items-end min-w-[120px] gap-4">
          <input
            type="radio"
            name="company"
            value={company.company}
            checked={isSelected}
            onChange={() => handleCompanySelect(company.company)}
            className="border-none "
            style={{ width: 20, height: 20 }}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex items-center gap-4">
            {["smsa", "aramex"].includes(company.company) ? (
              <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border bg-green-50 text-[#27ae60] border-green-200 font-semibold">
                الشحن العادي
              </span>
            ) : (
              <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border bg-sky-50 text-sky-500 border-sky-200 font-semibold">
                شحن الخزائن
              </span>
            )}

            <span className="text-[#3498db] font-bold flex text-lg items-center gap-2">
              {priceDisplay}
              <Image alt="real" src={realBlue} width={20} height={20} />
            </span>
          </div>

          {["aramex"].includes(company.company) && (
            <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
              توصيل من الباب للباب (
              <span className="text-[#27ae60] flex items-center gap-1">
                <Check className="w-4 h-4" /> متوفر
              </span>
              )
            </span>
          )}

          {["omniclama", "redbox"].includes(company.company) ? (
            <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
              توصيل من الباب للباب (
              <span className="text-[#e74c3c] flex items-center gap-1">
                <X className="w-4 h-4" /> غير متوفر
              </span>
              )
            </span>
          ) : ["smsa"].includes(company.company) &&
            ["Dry"].includes(company.shippingType.type) ? (
            <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
              توصيل من الباب للباب (
              <span className="text-[#27ae60] flex items-center gap-1">
                <Check className="w-4 h-4" /> متوفر
                <span className="text-primary flex gap-1 items-center text-sm">
                  ( حد أدنى 15 شحنة )
                </span>
              </span>
              )
            </span>
          ) : (
            ["offices"].includes(company.shippingType.type) && (
              <span className="text-[#3498db] text-sm sm:text-lg font-medium flex items-center gap-1">
                توصيل من الباب للباب (
                <span className="text-[#e74c3c] flex items-center gap-1">
                  <X className="w-4 h-4" /> غير متوفر
                </span>
                )
              </span>
            )
          )}
        </div>
      </div>

      {isSelected && (boxSizes.length > 0 || company.company === "smsa") && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">أحجام الصناديق</h3>

          <div className="flex items-center gap-4 flex-wrap">
            {boxSizes.length > 0 &&
              boxSizes.map((card, idx) => {
                const selected = selectedBoxSize === card;
                const key = card.key ?? `box-${idx}`;
                return (
                  <motion.div
                    key={key}
                    className={`v7-neu-card-inner p-12 cursor-pointer w-fit ${
                      selected
                        ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                        : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent"
                    }`}
                    onClick={() => {
                      setSelectedBoxSize(card);
                      setValue("boxSize", card);
                    }}
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

                      <div className="text-center mt-1">
                        <div className="text-base font-medium text-gray-700">
                          {card.label || card.title || "صندوق مخصص"}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {card.length}×{card.width}×{card.height} سم
                        </div>
                      </div>

                      {selected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#3498db] rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

            {((["smsa", "aramex"].includes(company.company) &&
              ["Dry"].includes(company.shippingType.type)) ||
              (company.company === "smsa" &&
                company.shippingType.type === "offices")) &&
              (Array.isArray(parcelsData) ? parcelsData : []).map(
                (parcel: any) => {
                  const selected =
                    selectedBoxSize?.length === parcel.dimensions.length &&
                    selectedBoxSize?.width === parcel.dimensions.width &&
                    selectedBoxSize?.height === parcel.dimensions.height;
                  return (
                    <motion.div
                      key={parcel.id}
                      className={`v7-neu-card-inner p-12 cursor-pointer w-fit  ${
                        selected
                          ? " bg-gradient-to-br from-[#3498db]/5 to-[#3498db]/10"
                          : "hover:bg-gradient-to-br hover:from-[#3498db]/5 hover:to-transparent hover:text-white"
                      }`}
                      onClick={() => {
                        const newBox: BoxSize = {
                          key: parcel.id,
                          label: parcel.title,
                          length: parcel.dimensions.length,
                          width: parcel.dimensions.width,
                          height: parcel.dimensions.height,
                        };
                        setSelectedBoxSize(newBox);
                        setValue("boxSize", newBox);
                      }}
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

                        <div className="text-center mt-1">
                          <div className="text-base font-medium text-gray-700">
                            {parcel.title || "صندوق مخصص"}
                          </div>
                          <div className="text-sm text-gray-500 mt-0.5">
                            {parcel.dimensions.length}×{parcel.dimensions.width}
                            ×{parcel.dimensions.height} سم
                          </div>
                        </div>

                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#3498db] rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                }
              )}

            {/* زر إضافة حجم مخصص */}
            {(company.company === "smsapro" ||
              company.company === "smsa" ||
              (company.company === "aramex" &&
                ["Dry"].includes(company.shippingType.type))) && (
              <Button
                type="button"
                className="v7-neu-card-inner p-12 cursor-pointer w-fit h-40 flex flex-col gap-2"
                onClick={() => setCustomModalOpen(true)}
              >
                <span
                  className={`p-4 rounded-full flex items-center justify-center ${
                    customModalOpen
                      ? "bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white"
                      : "bg-[#3498db]/10 text-[#3498db]"
                  }`}
                >
                  <Package
                    className="w-5 h-5"
                    style={{ width: "20px", height: "20px" }}
                  />
                </span>

                <h4 className="font-bold text-gray-800 text-lg">
                  إضافة حجم طرد مخصص +
                </h4>
              </Button>
            )}

            {/* إدخال الأبعاد يدوياً لـ SMSA إذا لم تكن هناك صناديق جاهزة */}
            {company.company === "smsa" &&
              boxSizes.length === 0 &&
              (Array.isArray(parcelsData) ? parcelsData : []).length === 0 && (
                <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    أدخل أبعاد الطرد يدوياً
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="length" className="text-sm text-gray-600">
                        الطول (سم)
                      </Label>
                      <Input
                        id="length"
                        type="number"
                        placeholder="الطول"
                        value={values?.dimension_length || ""}
                        onChange={(e) => {
                          setValue(
                            "dimension_length",
                            Number(e.target.value) || 0
                          );
                          setValue("boxSize", null);
                          setSelectedBoxSize({} as BoxSize);
                        }}
                        className="mt-1"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="width" className="text-sm text-gray-600">
                        العرض (سم)
                      </Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="العرض"
                        value={values?.dimension_width || ""}
                        onChange={(e) => {
                          setValue(
                            "dimension_width",
                            Number(e.target.value) || 0
                          );
                          setValue("boxSize", null);
                          setSelectedBoxSize({} as BoxSize);
                        }}
                        className="mt-1"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-sm text-gray-600">
                        الارتفاع (سم)
                      </Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="الارتفاع"
                        value={values?.dimension_high || ""}
                        onChange={(e) => {
                          setValue(
                            "dimension_high",
                            Number(e.target.value) || 0
                          );
                          setValue("boxSize", null);
                          setSelectedBoxSize({} as BoxSize);
                        }}
                        className="mt-1"
                        min="1"
                      />
                    </div>
                  </div>
                  {(values?.dimension_length ||
                    values?.dimension_width ||
                    values?.dimension_high) && (
                    <div className="text-sm text-green-600 mt-2">
                      تم إدخال الأبعاد: {values.dimension_length || 0} ×{" "}
                      {values.dimension_width || 0} ×{" "}
                      {values.dimension_high || 0} سم
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
      {/* <div className="mt-2">
  {error && typeof error === "string" && (
    <p className="text-red-500 text-sm">{error || localError}</p>
  )}

  {error && typeof error === "object" && (
    <>
      {error.dimension_high && <p className="text-red-500 text-sm">{error.dimension_high.message}</p>}

    </>
  )}
</div> */}

      <Dialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <DialogContent className="flex flex-col gap-4 p-10 bg-[#f3f6fa] border-none">
          <DialogHeader>
            <DialogTitle className="text-start pt-2">
              إضافة حجم طرد مخصص
            </DialogTitle>
          </DialogHeader>

          <div>
            <Label>اسم الطرد</Label>
            <Input
              className="v7-neu-input w-full pr-10 py-2 text-sm"
              type="text"
              value={customParcel.label}
              onChange={(e) =>
                setCustomParcel({ ...customParcel, label: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>الطول (سم)</Label>
              <Input
                className="v7-neu-input w-full pr-10 py-2 text-sm"
                type="number"
                value={customParcel.length}
                onChange={(e) =>
                  setCustomParcel({ ...customParcel, length: e.target.value })
                }
                required
                min={0}
              />
            </div>

            <div className="flex-1">
              <Label>العرض (سم)</Label>
              <Input
                className="v7-neu-input w-full pr-10 py-2 text-sm"
                type="number"
                value={customParcel.width}
                onChange={(e) =>
                  setCustomParcel({ ...customParcel, width: e.target.value })
                }
                required
                min={0}
              />
            </div>

            <div className="flex-1">
              <Label>الارتفاع (سم)</Label>
              <Input
                className="v7-neu-input w-full pr-10 py-2 text-sm"
                type="number"
                value={customParcel.height}
                onChange={(e) =>
                  setCustomParcel({ ...customParcel, height: e.target.value })
                }
                required
                min={0}
              />
            </div>
          </div>

          {/* عرض رسالة الخطأ إن وجدت */}
          {localError && <p className="text-red-600 text-sm">{localError}</p>}

          <DialogFooter>
            <div className="flex gap-2 w-48">
              <Button
                variant="ghost"
                onClick={() => {
                  setCustomModalOpen(false);
                  setLocalError("");
                }}
              >
                إلغاء
              </Button>

              <Button
                type="button"
                className="bg-primary text-white w-full"
                disabled={isCreatingParcel}
                onClick={async () => {
                  // تحقق من الحقول
                  if (
                    !customParcel.label.trim() ||
                    !String(customParcel.length).trim() ||
                    !String(customParcel.width).trim() ||
                    !String(customParcel.height).trim()
                  ) {
                    setLocalError("جميع الحقول مطلوبة");
                    return;
                  }

                  // تحويل إلى أرقام آمنة
                  const lengthNum = Number(customParcel.length);
                  const widthNum = Number(customParcel.width);
                  const heightNum = Number(customParcel.height);

                  if (
                    [lengthNum, widthNum, heightNum].some(
                      (n) => isNaN(n) || n <= 0
                    )
                  ) {
                    setLocalError(
                      "الطول/العرض/الارتفاع يجب أن يكونوا أرقاماً صحيحة أكبر من صفر"
                    );
                    return;
                  }

                  setLocalError("");

                  try {
                    await createParcel({
                      title: customParcel.label.trim(),
                      dimensions: {
                        length: lengthNum,
                        width: widthNum,
                        height: heightNum,
                      },
                      isPublic: false,
                    }).unwrap();

                    // إضافة الصندوق إلى allowedBoxSizes لشركة الشحن
                    if (company.company && companiesData && setBoxSizes) {
                      const companyData = companiesData.find(
                        (c: any) => c.company === company.company
                      );
                      if (companyData && companyData._id) {
                        try {
                          const newBoxSize = {
                            length: lengthNum,
                            width: widthNum,
                            height: heightNum,
                          };

                          // التحقق من عدم وجود الصندوق مسبقاً
                          const existingSizes =
                            companyData.allowedBoxSizes || [];
                          const isDuplicate = existingSizes.some(
                            (size: any) =>
                              size.length === newBoxSize.length &&
                              size.width === newBoxSize.width &&
                              size.height === newBoxSize.height
                          );

                          if (!isDuplicate) {
                            const updatedSizes = [...existingSizes, newBoxSize];

                            await updateShipmentCompany({
                              id: companyData._id,
                              data: {
                                allowedBoxSizes: updatedSizes,
                              },
                            }).unwrap();

                            // تحديث boxSizes في الواجهة
                            const updatedBoxSizes = updatedSizes.map(
                              (s: any) => ({
                                ...s,
                                label:
                                  s.title ||
                                  s.label ||
                                  `${s.length}×${s.width}×${s.height} سم`,
                              })
                            );
                            setBoxSizes(updatedBoxSizes);

                            // إعادة جلب بيانات الشركات
                            refetchCompanies();
                          } else {
                            // إذا كان الصندوق موجوداً، فقط حدث boxSizes
                            const updatedBoxSizes = existingSizes.map(
                              (s: any) => ({
                                ...s,
                                label:
                                  s.title ||
                                  s.label ||
                                  `${s.length}×${s.width}×${s.height} سم`,
                              })
                            );
                            setBoxSizes(updatedBoxSizes);
                          }
                        } catch (updateErr) {
                          console.error("فشل تحديث أحجام الصناديق:", updateErr);
                          // لا نوقف العملية، فقط نسجل الخطأ
                        }
                      }
                    }

                    // أغلق المودال ونظف الحقول
                    setCustomModalOpen(false);
                    setCustomParcel({
                      label: "",
                      length: "",
                      width: "",
                      height: "",
                    });
                  } catch (err) {
                    console.error("فشل إنشاء الطرد:", err);
                    setLocalError("فشل إضافة الطرد، حاول مرة أخرى.");
                  }
                }}
              >
                {isCreatingParcel ? "جاري الإضافة..." : "إضافة"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
