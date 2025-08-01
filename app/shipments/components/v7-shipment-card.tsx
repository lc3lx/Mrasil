"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Eye,
  Printer,
  ArrowLeft,
  Store,
  ShoppingCart,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import moment from "moment";

const companyLogoMap: Record<string, string> = {
  smsa: "/smsa_b2c.jpg",
  jandt: "/jandt.jpg",
  aramex: "/Aramex.jpg",
  aymakan: "/AyMakan.jpg",
  imile: "/iMile.jpg",
  thabit: "/Thabit.jpg",
  redbox: "/RedBox.jpg",
  dal: "/Dal.jpg",
  omniclama: "/omniclama.png",
};

interface V7ShipmentCardProps {
  shipment: {
    _id: string;
    dimension?: { high?: number; width?: number; length?: number };
    customerId?: {
      _id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    orderId?: string;
    senderAddress?: {
      full_name?: string;
      mobile?: string;
      city?: string;
      country?: string;
      address?: string;
    };
    boxNum?: number;
    weight?: number;
    orderDescription?: string;
    shapmentingType?: string;
    shapmentCompany?: string;
    shapmentType?: string;
    shapmentPrice?: number;
    orderSou?: string;
    priceaddedtax?: number;
    byocPrice?: number;
    basepickUpPrice?: number;
    profitpickUpPrice?: number;
    baseRTOprice?: number;
    createdAt?: string;
    redboxResponse?: { label?: string; trackingNumber?: string };
    aramexResponse?: { labelURL?: string; trackingNumber?: string };
    omniclamaResponse?: { label?: string; trackingNumber?: string };
    smsaResponse?: { label?: string; trackingNumber?: string };
    pricing?: Record<string, any>;
    trackingNumber?: string;
  };
}

// Helper: Download SMSA base64 label as PDF
function downloadSmsaLabel(base64String: string, fileName = "smsa-label.pdf") {
  // Remove any data URL prefix and whitespace/line breaks
  const cleanedBase64 = base64String
    .replace(/^data:application\/pdf;base64,/, "")
    .replace(/\s/g, "");
  // Decode base64
  const byteCharacters = atob(cleanedBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  // Always save as PDF for SMSA
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function V7ShipmentCard({
  shipment,
  allSelected,
  selectedShipmentId,
}: {
  shipment: any;
  allSelected: boolean;
  selectedShipmentId: any;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!shipment || !shipment._id) {
    return null;
  }

  // Helper functions for status, etc.
  const getStatusIcon = () => <Package className="h-5 w-5 text-violet-500" />;
  const getStatusText = () => "جاهز للشحن";
  const getStatusColor = () => "bg-violet-50 text-violet-700 border-violet-200";

  // Carrier details
  const getCarrierLogo = (carrier: string) => {
    const normalizedCarrier = carrier?.toLowerCase().trim();
    return companyLogoMap[normalizedCarrier] || "/placeholder.svg";
  };
  const carrierLogo = getCarrierLogo(shipment?.shapmentCompany || "unknown");
  const carrierInfo = {
    name: shipment?.shapmentCompany || "غير معروف",
    logo: carrierLogo,
    color: "text-gray-600", // Default color
  };

  // Helper: Get label URL for printing
  const getLabelUrl = () => {
    const company = (shipment?.shapmentCompany || "").toLowerCase();
    if (company === "redbox" && shipment?.redboxResponse?.label) {
      return shipment.redboxResponse.label;
    }
    if (company === "aramex" && shipment?.aramexResponse?.labelURL) {
      return shipment.aramexResponse.labelURL;
    }
    if (company === "omniclama" && shipment?.omniclamaResponse?.label) {
      return shipment.omniclamaResponse.label;
    }
    if (company === "smsa" && shipment?.smsaResponse?.label) {
      return shipment.smsaResponse.label;
    }
    return null;
  };

  // Helper: Download base64 label as file
  function downloadBase64File(base64: string, fileName: string) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "application/pdf";
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    const blob = new Blob([u8arr], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  const labelUrl = getLabelUrl();

  // Helper: Get tracking number for the 'تتبع' button
  const getTrackingNumber = () => {
    const company = (shipment?.shapmentCompany || "").toLowerCase();
    if (company === "redbox" && shipment?.redboxResponse?.trackingNumber) {
      return shipment.redboxResponse.trackingNumber;
    }
    if (company === "aramex" && shipment?.aramexResponse?.trackingNumber) {
      return shipment.aramexResponse.trackingNumber;
    }
    if (
      company === "omniclama" &&
      shipment?.omniclamaResponse?.trackingNumber
    ) {
      return shipment.omniclamaResponse.trackingNumber;
    }
    if (company === "smsa" && shipment?.smsaResponse?.trackingNumber) {
      return shipment.smsaResponse.trackingNumber;
    }
    return shipment.trackingNumber || shipment._id || "";
  };
  const trackingNumber = getTrackingNumber();
  console.log("data:", shipment);

  return (
    <div
      className={`v7-neu-card-inner rounded-xl border border-gray-100 w-full bg-white`}
      dir="rtl"
    >
      {/* Main Card Content - Always visible */}
      <div className="p-6 flex justify-between w-full">
        <div className="flex flex-col md:flex-row items-start gap-6 sm:max-w-[20%]">
          {/* Left: Main Info */}
          <div className="flex flex-col justify-between flex-1  ">
            <div className="flex flex-col  gap-4 w-fit">
              {/* Carrier */}
              <div className="flex items-center ">
                {" "}
                {/* Increased gap for more space */}
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-lg font-bold ${carrierInfo.color}`}
                >
                  <div className="h-14 w-14  relative overflow-hidden rounded-full border-2 border-gray-200 bg-white flex items-center justify-center">
                    {" "}
                    {/* Larger, circular, spaced */}
                    <Image
                      src={carrierInfo.logo}
                      alt={carrierInfo.name}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                  <span className="ml-6">{carrierInfo.name}</span>

                  {/* زر تحميل الليبل إذا كانت الشركة smsa والليبل base64 */}
                  {carrierInfo.name.toLowerCase() === "smsa" &&
                    shipment?.smsaResponse?.label && (
                      <Button
                        className="mt-2"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadBase64File(
                            shipment.smsaResponse.label,
                            `smsa-label-${shipment._id || "label"}.pdf`
                          )
                        }
                      >
                        تحميل الليبل (SMSA)
                      </Button>
                    )}
                </span>
              </div>

              {/* Order Number */}
              {/* <RadioGroup> */}

              <div className="flex items-center gap-3">
                <span className="font-bold text-lg sm:text-2xl text-[#294D8B] whitespace-nowrap">
                  رقم الشحنة #{shipment?._id || "غير متوفر"}
                </span>
              </div>
              {/* Order ID */}
              <div className="flex items-center gap-1 text-gry">
                <span className="text-base ">رقم الطلب: </span>
                <span className="font-medium ml-2">
                  {shipment?.orderId?._id || "غير متوفر"}
                </span>
              </div>
              {/* </RadioGroup> */}
              {/* Source */}
              <div className="flex items-center gap-3">
                <span className="text-base text-gry">المصدر:</span>
                <span className="font-semibold ml-2 text-[#444]">
                  {shipment?.orderId.platform === "manual"
                    ? "Marasil"
                    : shipment?.orderId.platform || "غير متوفر"}
                </span>
              </div>
              {/* City/Address */}
              <div className="flex items-center gap-3">
                <MapPin className="h- w-5 text-[#294D8B]" />
                <span className="text-lg text-[#294D8B] font-medium">
                  {shipment?.senderAddress?.city || "غير محدد"}
                </span>
                <MapPin className="h-5 w-5 text-emerald-500" />
                <span className="text-lg   text-emerald-700 font-medium">
                  {shipment?.senderAddress?.address || "غير محدد"}
                </span>
              </div>
              {/* Status */}
              <div className="flex items-center gap-3   max-w-44 ">
                <div
                  className={`w-full flex items-center  gap-x-2 px-4 py-2 rounded-full border ${getStatusColor()} justify-center`}
                >
                  <span className="ml-2">{getStatusIcon()}</span>
                  <span className="text-[#294D8B]  ">{getStatusText()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col-reverse sm:flex-row justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gry hover:text-[#3498db]  bottom-0     mt-auto mx-auto"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "عرض أقل" : "عرض المزيد"}
          </Button>
          {/* Right: Actions and More/Less */}
          <div className="flex flex-col  items-center    gap-4">
            <Link
              href={`/tracking?id=${trackingNumber}`}
              className="w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2"
              >
                <Eye className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                <span className="sr-only sm:not-sr-only">تتبع</span>
              </Button>
            </Link>
            {labelUrl ? (
              labelUrl.includes("base64") ? (
                // إذا كانت base64 (سمسا)
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2"
                  onClick={() =>
                    downloadBase64File(
                      labelUrl,
                      `label-${shipment._id || "label"}.pdf`
                    )
                  }
                >
                  <Printer className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                  <span className="sr-only sm:not-sr-only">تحميل البوليصة</span>
                </Button>
              ) : (
                // إذا كانت رابط مباشر
                <a
                  href={labelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                  download
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2"
                  >
                    <Printer className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                    <span className="sr-only sm:not-sr-only">
                      تحميل البوليصة
                    </span>
                  </Button>
                </a>
              )
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full  v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2 opacity-50 cursor-not-allowed"
                disabled
              >
                <Printer className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">تحميل البوليصة</span>
              </Button>
            )}
            <span className=" text-gry">
              {moment(shipment?.createdAt).locale("en-sa").format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Details - Inside the same card, properly contained */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className=" rounded-lg p-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Shipment Details */}
              <div className=" v7-neu-card space-y-2 p-4 border border-gray-100 rounded-xl ">
                <div className="text-[#294D8B] font-bold mb-3 text-center text-sm">
                  تفاصيل الشحنة
                </div>
                {[
                  ["رقم التتبع", trackingNumber],
                  ["الوزن", `${shipment.weight} كجم`],
                  [
                    "الأبعاد",
                    typeof shipment.dimension?.length === "number" &&
                    typeof shipment.dimension?.width === "number" &&
                    typeof shipment.dimension?.high === "number"
                      ? `${shipment.dimension.length} × ${shipment.dimension.width} × ${shipment.dimension.high} سم`
                      : "-",
                  ],
                  [
                    "نوع الشحن",
                    (() => {
                      switch (shipment?.shapmentingType) {
                        case "Dry":
                          return "جاف";
                        case "Cold":
                          return "بارد";
                        case "Quick":
                          return "سريع";
                        case "Box":
                          return "صندوق";
                        case "offices":
                          return "اقتصادية";
                        default:
                          return "غير محدد";
                      }
                    })(),
                  ],
                ].map(([label, value]) =>
                  (typeof value === "string" || typeof value === "number") &&
                  value !== undefined &&
                  value !== null ? (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm py-1"
                    >
                      <span className="text-gry">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ) : null
                )}
              </div>

              {/* Recipient Info */}

              <div className=" v7-neu-card space-y-2 p-4 border border-gray-100 rounded-xl ">
                <div className="text-[#294D8B] font-bold mb-3 text-center text-sm">
                  بيانات المستلم
                </div>
                {[
                  [
                    "الاسم",
                    `${shipment.receiverAddress?.clientName || ""}`.trim(),
                  ],

                  ["الهاتف", shipment.receiverAddress?.clientPhone || ""],
                  ["العنوان", shipment.receiverAddress?.clientAddress || ""],
                  ["المدينة", shipment.receiverAddress?.city || ""],
                ].map(([label, value]) =>
                  (typeof value === "string" || typeof value === "number") &&
                  value !== undefined &&
                  value !== null ? (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm py-1"
                    >
                      <span className="text-gry">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ) : null
                )}
              </div>

              {/* Sender Info */}
              <div className=" v7-neu-card space-y-2 p-4 border border-gray-100 rounded-xl ">
                <div className="text-[#294D8B] font-bold mb-3 text-center text-sm">
                  بيانات المرسل
                </div>
                {[
                  ["الاسم", shipment.senderAddress?.full_name],
                  ["الهاتف", shipment.senderAddress?.mobile],
                  ["العنوان", shipment.senderAddress?.address],
                  ["المدينة", shipment.senderAddress?.city],
                ].map(([label, value]) =>
                  (typeof value === "string" || typeof value === "number") &&
                  value !== undefined &&
                  value !== null ? (
                    <div
                      key={label}
                      className="flex justify-between items-center text-sm py-1"
                    >
                      <span className="text-gry">{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
