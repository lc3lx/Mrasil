"use client";
import { useCancelShipmentMutation } from "@/app/api/shipmentApi";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  Trash,
  Redo,
  X,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import moment from "moment";

const companyLogoMap: Record<string, string> = {
  smsa: "/companies/smsa.jpg",
  jandt: "/jandt.jpg",
  aramex: "/companies/araMex.png",
  aymakan: "/AyMakan.jpg",
  imile: "/iMile.jpg",
  thabit: "/Thabit.jpg",
  redbox: "/companies/redBox.png",
  dal: "/Dal.jpg",
  omniclama: "/companies/lamaBox.png",
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
  const [isCancelling, setIsCancelling] = useState(false);

  if (!shipment || !shipment._id) {
    return null;
  }

  // Helper functions for status, etc.
  const getStatusIcon = () => {
    const status = shipment.shipmentstates;
    switch (status) {
      case "READY_FOR_PICKUP":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "IN_TRANSIT":
        return <Truck className="h-5 w-5 text-orange-600" />;
      case "DELIVERED":
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "CANCELLED":
      case "Canceled":
      case "CANCELED":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };
  const getStatusText = () => {
    const status = shipment.shipmentstates;
    switch (status) {
      case "READY_FOR_PICKUP":
        return "جاهز للشحن";
      case "IN_TRANSIT":
        return "جاري التوصيل";
      case "DELIVERED":
      case "Delivered":
        return "تم التوصيل";
      case "CANCELLED":
      case "Canceled":
      case "CANCELED":
        return "ملغاة";
      default:
        return "غير محدد";
    }
  };
  const getStatusColor = () => {
    const status = shipment.shipmentstates;
    switch (status) {
      case "READY_FOR_PICKUP":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "IN_TRANSIT":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "DELIVERED":
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "CANCELLED":
      case "Canceled":
      case "CANCELED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };
  const getStatusTextColor = () => {
    const status = shipment.shipmentstates;
    switch (status) {
      case "READY_FOR_PICKUP":
        return "text-blue-700";
      case "IN_TRANSIT":
        return "text-orange-700";
      case "DELIVERED":
      case "Delivered":
        return "text-green-700";
      case "CANCELLED":
      case "Canceled":
      case "CANCELED":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  // Carrier details
  const getCarrierLogo = (carrier: string) => {
    const normalizedCarrier = carrier?.toLowerCase().trim();
    return companyLogoMap[normalizedCarrier] || "/placeholder.svg";
  };
  const carrierLogo = getCarrierLogo(shipment?.shapmentCompany || "unknown");
  const carrierInfo = {
    name: shipment?.shapmentCompany || "غير معروف",
    logo: carrierLogo,
    color: "text-gray-600",
  };
  console.log(shipment);

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

  const displayName =
    carrierInfo.name === "omniclama"
      ? "LLAMA BOX"
      : carrierInfo.name === "smsa"
      ? shipment?.shapmentingType === "Dry"
        ? "SMSA PRO"
        : "SMSA"
      : carrierInfo.name === "aramex"
      ? "ARAMEX PRO"
      : carrierInfo.name.toUpperCase();

  // Inside the V7ShipmentCard component, add this:
  const [cancelShipment] = useCancelShipmentMutation();

  const handleCancelShipment = async () => {
    if (isCancelling) return; // منع النقر المتعدد

    setIsCancelling(true);

    try {
      const result = await cancelShipment({
        id: trackingNumber, // This will be used in the URL
        company: shipment.shapmentCompany, // This will be sent in the request body
      }).unwrap();

      // رسالة إلغاء - إشعار أحمر كبير يغطي الشاشة
      toast.custom(
        (t) => (
          <div
            className="bg-red-600 text-white rounded-xl shadow-2xl p-8 w-[95%] max-w-[95vw] mx-auto text-center border-4 border-red-700"
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              zIndex: 10000,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="text-3xl mb-3 font-extrabold">⚠️ تم الإلغاء</div>
            <div className="text-xl opacity-95">
              تم إلغاء الشحنة رقم {trackingNumber} بنجاح
            </div>
          </div>
        ),
        {
          duration: 6000,
          position: "top-center",
        }
      );

      console.log("Shipment cancelled successfully:", result);
    } catch (error: any) {
      console.error("Failed to cancel shipment:", error);

      // رسالة فشل مع تفاصيل الخطأ
      const errorMessage =
        error?.data?.message || error?.message || "حدث خطأ أثناء إلغاء الشحنة";

      toast.error("❌ فشل في إلغاء الشحنة", {
        description: `${errorMessage}. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.`,
        duration: 8000,
        action: {
          label: "إعادة المحاولة",
          onClick: () => handleCancelShipment(),
        },
      });
    } finally {
      setIsCancelling(false);
    }
  };
  return (
    <div
      className={`v7-neu-card-inner rounded-xl border border-gray-100 w-full bg-white`}
      dir="rtl"
    >
      {/* Main Card Content - Always visible */}
      <div className="p-6 flex    w-full  gap-4">
        <div className="flex flex-col md:flex-row items-start gap-6  w-full ">
          {/* Left: Main Info */}
          <div className="flex flex-col justify-between flex-1  ">
            <div className="flex flex-col  gap-4 w-fit">
              {/* Carrier */}
              <div className="flex items-center  -mt-2 ms-4  ">
                {" "}
                {/* Increased gap for more space */}
                <span
                  className={`inline-flex items-center gap-4 rounded-md py-1  font-bold ${carrierInfo.color}`}
                >
                  <div className="min-h-20 min-w-20  relative overflow-hidden   flex items-center justify-center">
                    {" "}
                    {/* Larger, circular, spaced */}
                    <Image
                      src={carrierInfo.logo}
                      alt={carrierInfo.name}
                      width={75}
                      height={75}
                      className="object-contain"
                    />
                  </div>
                  <span className="sm:ml-6  text-[#294D8B] text-base sm:text-lg">
                    {" "}
                    {displayName}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm sm:text-2xl text-[#294D8B] whitespace-nowrap">
                  رقم التتبع : {trackingNumber || "غير متوفر"}
                </span>
              </div>
              {/* Order ID */}
              <div className="flex items-center gap-1 text-gry">
                <span className="text-sm sm:text-base flex items-center ">
                  رقم الطلب:{" "}
                </span>
                <span className="ml-2  sm:text-base text-sm text-[#444]">
                  {shipment?._id || "غير متوفر"}
                </span>
              </div>
              {/* </RadioGroup> */}
              {/* Source */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gry">المصدر:</span>
                <span className="font-semibold ml-2 text-[#444] text-sm sm:text-base">
                  {shipment?.orderId.platform === "manual"
                    ? "Marasil"
                    : shipment?.orderId.platform || "غير متوفر"}
                </span>
              </div>
              {/* City/Address */}
              <div className="flex items-center gap-3">
                <MapPin className="sm:h-5 sm:w-5 h-4 w-4 text-[#294D8B]" />
                <span className="text-base sm:text-lg  text-[#294D8B] font-medium">
                  {shipment?.senderAddress?.city || "غير محدد"}
                </span>
                <MapPin className="sm:h-5 sm:w-5 h-4 w-4 text-emerald-500" />
                <span className="text-base sm:text-lg   text-emerald-700 font-medium">
                  {shipment?.receiverAddress?.city || "غير محدد"}
                </span>
              </div>
              {/* Status */}
              <div className="flex items-center gap-3    w-fit ">
                <div
                  className={`w-full flex items-center  gap-x-2 px-4 sm:px-6 py-2 rounded-full border ${getStatusColor()} justify-center`}
                >
                  <span className="ml-2 w-4 h-4 sm:w-5 sm:h-5">
                    {getStatusIcon()}
                  </span>
                  <span
                    className={`${getStatusTextColor()}  text-sm sm:text-base font-medium`}
                  >
                    {getStatusText()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="   flex flex-col items-center justify-end   ms-auto  w-full  ">
          {/* Right: Actions and More/Less */}
          <div className="flex flex-col max-sm:max-w-10 items-center  ms-auto    gap-4 ">
            <Link
              href={`/tracking?id=${trackingNumber}`}
              className="w-full"
              // target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="sm:w-full v7-neu-button-sm group sm:h-8 size-3 flex items-center justify-center gap-x-2 mx-auto"
              >
                <Eye className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                <span className="sr-only sm:not-sr-only">تتبع</span>
              </Button>
            </Link>

            {labelUrl ? (
              carrierInfo.name.toLowerCase() === "smsa" ? (
                shipment?.smsaResponse?.label && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2"
                    onClick={() =>
                      downloadBase64File(
                        shipment.smsaResponse.label,
                        `smsa-label-${shipment._id || "label"}.pdf`
                      )
                    }
                  >
                    <Printer className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                    <span className="sr-only sm:not-sr-only">
                      تحميل البوليصة
                    </span>
                  </Button>
                )
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

            {shipment.shipmentstates === "Delivered" ? (
              <Button
                variant="outline"
                size="sm"
                className="sm:w-full v7-neu-button-sm group sm:h-8 size-3 text-xs flex items-center justify-center gap-x-2"
              >
                <Redo className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">طلب شحنة عكسية</span>
              </Button>
            ) : (
              <Button
                onClick={handleCancelShipment}
                disabled={isCancelling}
                variant="outline"
                size="sm"
                className="sm:w-full v7-neu-button-sm group sm:h-8 size-3 text-xs flex items-center justify-center gap-x-2"
              >
                {isCancelling ? (
                  <div className="h-4 w-4 border-2 border-[#e74c3c] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <X className="h-4 w-4 text-[#e74c3c]" />
                )}
                <span className="sr-only sm:not-sr-only text-[#e74c3c]">
                  {isCancelling ? "جاري الإلغاء..." : "إلغاء البوليصة"}
                </span>
              </Button>
            )}

            <span className=" text-gry sm:text-base text-sm">
              {moment(shipment?.createdAt).locale("en-sa").format("DD/MM/YYYY")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gry hover:text-[#3498db]  bottom-0   flex justify-center items-center text-center   mt-auto  mx-auto   sm:ms-0 -ms-6 "
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "عرض أقل" : "عرض المزيد"}
          </Button>
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
                  [
                    "سعر البوليصة",
                    `${(shipment.totalprice ?? 0).toLocaleString()} ريال`,
                  ],
                  ["الوزن", `${shipment.weight} كجم`],
                  [
                    "الأبعاد",
                    (() => {
                      const dim = shipment.dimension;
                      if (!dim) return "-";

                      const length = dim.length ?? dim.height;
                      const width = dim.width;
                      const height = dim.high ?? dim.height;

                      if (
                        typeof length === "number" &&
                        typeof width === "number" &&
                        typeof height === "number" &&
                        length > 0 &&
                        width > 0 &&
                        height > 0
                      ) {
                        return `${length} × ${width} × ${height} سم`;
                      }
                      return "-";
                    })(),
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
