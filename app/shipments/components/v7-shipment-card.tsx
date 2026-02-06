"use client";
import {
  useCancelShipmentMutation,
  usePrintShipmentInvoiceMutation,
} from "@/app/api/shipmentApi";
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
  Lock,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import moment from "moment";

const CancelToast = ({
  trackingNumber,
  onClose,
}: {
  trackingNumber: string;
  onClose: () => void;
}) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  return (
    <>
      <div
        className={`cancel-toast-container success ${closing ? "closing" : ""}`}
      >
        <div className="cancel-toast__icon-wrapper">
          <div className="cancel-toast__icon" />
        </div>
        <div className="cancel-toast__message">
          <h4>تم إلغاء الشحنة</h4>
          <p>
            تم إلغاء الشحنة رقم <strong>{trackingNumber}</strong> بنجاح
          </p>
        </div>
        <button
          className="cancel-toast__close"
          onClick={handleClose}
          aria-label="إغلاق الإشعار"
        />
        <div className="cancel-toast__timer timer-animation" />
      </div>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

        .cancel-toast-container {
          font-family: "Poppins", sans-serif;
          display: flex;
          align-items: center;
          max-width: 400px;
          width: fit-content;
          padding: 10px 14px;
          border-radius: 5px;
          overflow: hidden;
          background: transparent;
          box-shadow: none;
          position: relative;
          isolation: isolate;
          animation: cancel-toast-open 0.4s ease forwards;
          direction: rtl;
          gap: 14px;
        }

        .cancel-toast-container.closing {
          animation: cancel-toast-close 0.3s ease forwards;
        }

        .cancel-toast__icon-wrapper {
          width: 30px;
          height: 30px;
          background: var(--secondary);
          border-radius: 5px;
          padding: 5px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cancel-toast__icon {
          background: var(--primary);
          border-radius: 50%;
          width: 100%;
          height: 100%;
          position: relative;
          transform: rotate(-45deg);
        }

        .cancel-toast__icon::before,
        .cancel-toast__icon::after {
          content: "";
          position: absolute;
          background: var(--secondary);
          border-radius: 5px;
          top: 50%;
          left: 50%;
        }

        .cancel-toast__message {
          padding: 5px 20px 5px 10px;
          color: #404040;
        }

        .cancel-toast__message h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .cancel-toast__message p {
          margin: 4px 0 0;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #606060;
        }

        .cancel-toast__close {
          position: relative;
          padding: 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background: transparent;
          transition: background 0.2s ease-in-out;
        }

        .cancel-toast__close::before,
        .cancel-toast__close::after {
          content: "";
          position: absolute;
          height: 12px;
          width: 1px;
          border-radius: 5px;
          background: #606060;
          top: 50%;
          left: 50%;
          transition: background 0.2s ease-in-out;
        }

        .cancel-toast__close::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .cancel-toast__close::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .cancel-toast__close:hover {
          background: rgba(0, 0, 0, 0.08);
        }

        .cancel-toast__close:hover::before,
        .cancel-toast__close:hover::after {
          background: #404040;
        }

        .cancel-toast__timer {
          width: 100%;
          height: 4px;
          background: var(--primary);
          position: absolute;
          bottom: 0;
          left: 0;
          border-top-right-radius: 5px;
          box-shadow: 0 0 8px var(--primary);
        }

        .timer-animation {
          animation: cancel-toast-countdown 6s linear forwards;
        }

        .cancel-toast-container.success {
          --primary: #2dd743;
          --secondary: #e3fee6;
        }

        .cancel-toast__icon::before {
          width: 10px;
          height: 3px;
          transform: translate(calc(-50% + 1px), calc(-50% + 1px));
        }

        .cancel-toast__icon::after {
          width: 3px;
          height: 6px;
          transform: translate(calc(-50% - 3px), calc(-50% - 1px));
        }

        @keyframes cancel-toast-open {
          from {
            opacity: 0;
            transform: translateY(-25px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cancel-toast-close {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(-25px) scale(0.5);
          }
        }

        @keyframes cancel-toast-countdown {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </>
  );
};

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
    isReturnShipment?: boolean;
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

  const isCancelled =
    shipment?.shipmentstates === "CANCELLED" ||
    shipment?.shipmentstates === "Canceled" ||
    shipment?.shipmentstates === "CANCELED";

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
  const [printShipmentInvoice, { isLoading: isPrintingInvoice }] =
    usePrintShipmentInvoiceMutation();

  const handlePrintInvoice = async () => {
    // التحقق من وجود عنوان المستلم
    const hasReceiverAddress =
      shipment?.receiverAddress?.clientName ||
      shipment?.receiverAddress?.clientPhone ||
      shipment?.receiverAddress?.clientAddress ||
      shipment?.orderId?.clientAddress?.clientName ||
      shipment?.orderId?.clientAddress?.clientPhone ||
      shipment?.orderId?.clientAddress?.clientAddress;

    if (!hasReceiverAddress) {
      toast.error("يجب اختيار عنوان المستلم أولاً", {
        description: "ثم ستتمكن من طباعة البوليصة",
        duration: 5000,
      });
      return;
    }

    try {
      const result = await printShipmentInvoice({
        company: shipment.shapmentCompany?.toLowerCase() || "",
        trackingNumber: trackingNumber,
      }).unwrap();

      // التحقق من وجود البوليصة في الاستجابة
      if (result?.status === "success" && result?.data) {
        const invoiceData = result.data;

        // استخراج label_link من print_results (OmniLama)
        let labelUrl = null;

        // إذا كانت الاستجابة تحتوي على print_results
        if (
          invoiceData?.print_results &&
          Array.isArray(invoiceData.print_results) &&
          invoiceData.print_results.length > 0
        ) {
          const firstResult = invoiceData.print_results[0];
          if (firstResult?.label_link) {
            labelUrl = firstResult.label_link;
          }
        }

        // إذا كانت البوليصة base64 (SMSA)
        if (
          typeof invoiceData === "string" &&
          invoiceData.startsWith("data:application/pdf")
        ) {
          downloadBase64File(invoiceData, `invoice-${trackingNumber}.pdf`);
        } else if (typeof invoiceData === "string") {
          // إذا كانت base64 بدون prefix
          const base64Data = invoiceData.includes(",")
            ? invoiceData
            : `data:application/pdf;base64,${invoiceData}`;
          downloadBase64File(base64Data, `invoice-${trackingNumber}.pdf`);
        } else if (labelUrl) {
          // إذا كان label_link موجود (OmniLama)
          window.open(labelUrl, "_blank");
          toast.success("تم فتح البوليصة", {
            description: "تم فتح البوليصة في نافذة جديدة",
            duration: 3000,
          });
        } else if (
          invoiceData?.url ||
          invoiceData?.label ||
          invoiceData?.label_link
        ) {
          // إذا كانت رابط مباشر
          const url =
            invoiceData.url || invoiceData.label || invoiceData.label_link;
          window.open(url, "_blank");
        } else {
          toast.success("تم جلب البوليصة بنجاح", {
            description: "جاري فتح البوليصة...",
            duration: 3000,
          });
        }
      } else if (result?.status === "pending") {
        toast.info("البوليصة قيد المعالجة", {
          description: result?.message || "سيتم إعادة المحاولة لاحقاً",
          duration: 5000,
        });
      } else {
        toast.error("فشل في جلب البوليصة", {
          description: result?.message || "يرجى المحاولة مرة أخرى",
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Failed to print invoice:", error);
      const errorMessage =
        error?.data?.message || error?.message || "حدث خطأ أثناء طلب البوليصة";

      // التحقق من رسالة الخطأ الخاصة بعدم وجود عنوان المستلم
      if (
        errorMessage.includes("عنوان") ||
        errorMessage.includes("address") ||
        errorMessage.includes("receiver")
      ) {
        toast.error("يجب اختيار عنوان المستلم أولاً", {
          description: "ثم ستتمكن من طباعة البوليصة",
          duration: 5000,
        });
      } else {
        toast.error("فشل في طلب البوليصة", {
          description: errorMessage,
          duration: 5000,
        });
      }
    }
  };

  const handleCancelShipment = async () => {
    if (isCancelling) return; // منع النقر المتعدد

    setIsCancelling(true);

    try {
      const result = await cancelShipment({
        id: trackingNumber, // This will be used in the URL
        company: shipment.shapmentCompany, // This will be sent in the request body
      }).unwrap();

      toast.custom(
        (t) => (
          <CancelToast
            trackingNumber={trackingNumber}
            onClose={() => toast.dismiss(t)}
          />
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
      className={`v7-neu-card-inner rounded-xl border border-gray-100 w-full bg-white relative ${
        isCancelled ? "pointer-events-none select-none opacity-75" : ""
      }`}
      dir="rtl"
    >
      {isCancelled && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-gray-900/40 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-2 rounded-lg bg-white/95 px-6 py-4 shadow-lg">
            <Lock className="h-10 w-10 text-red-600" />
            <span className="text-sm font-bold text-red-700">الشحنة ملغاة</span>
            <span className="text-xs text-gray-600">لا يمكن طباعة البوليصة أو تتبع الشحنة</span>
          </div>
        </div>
      )}
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
                  {(shipment?.shapmentType === "reverse" || shipment?.isReturnShipment) && (
                    <span className="mr-2 inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      شحنة عكسية
                    </span>
                  )}
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

            {/* زر طباعة البوليصة - يظهر فقط لأومني لاما */}
            {shipment.shapmentCompany === "omniclama" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full v7-neu-button-sm group h-8 text-xs flex items-center justify-center gap-x-2"
                onClick={handlePrintInvoice}
                disabled={isPrintingInvoice}
              >
                {isPrintingInvoice ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[#3498db] border-t-transparent rounded-full animate-spin" />
                    <span className="sr-only sm:not-sr-only">
                      جاري الطلب...
                    </span>
                  </>
                ) : (
                  <>
                    <Printer className="h-4 w-4 group-hover:text-[#3498db] transition-colors" />
                    <span className="sr-only sm:not-sr-only">
                      طباعة البوليصة
                    </span>
                  </>
                )}
              </Button>
            )}

            {/* زر تحميل البوليصة (إذا كانت موجودة) */}
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
            ) : null}

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
                      const dim =
                        shipment?.dimension ||
                        shipment?.orderId?.dimension ||
                        shipment?.orderId?.box_dimensions;
                      if (!dim) return "-";

                      const getNum = (v: any) =>
                        typeof v === "string" ? Number(v) : v;
                      const length = getNum(
                        dim.length ??
                          dim.Length ??
                          dim.long ??
                          dim.Long ??
                          dim.height
                      );
                      const width = getNum(
                        dim.width ?? dim.Width ?? dim.wide ?? dim.Wide
                      );
                      const height = getNum(
                        dim.height ?? dim.Height ?? dim.high ?? dim.High
                      );

                      if (
                        typeof length === "number" &&
                        typeof width === "number" &&
                        typeof height === "number" &&
                        isFinite(length) &&
                        isFinite(width) &&
                        isFinite(height) &&
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
                    shipment?.receiverAddress?.clientName ||
                      shipment?.orderId?.clientAddress?.clientName ||
                      shipment?.orderId?.customer?.full_name ||
                      "",
                  ],
                  [
                    "الهاتف",
                    shipment?.receiverAddress?.clientPhone ||
                      shipment?.orderId?.clientAddress?.clientPhone ||
                      shipment?.orderId?.customer?.mobile ||
                      "",
                  ],
                  [
                    "العنوان",
                    shipment?.receiverAddress?.clientAddress ||
                      shipment?.orderId?.clientAddress?.clientAddress ||
                      shipment?.orderId?.customer?.address ||
                      "",
                  ],
                  [
                    "المدينة",
                    shipment?.receiverAddress?.city ||
                      shipment?.orderId?.clientAddress?.city ||
                      shipment?.orderId?.customer?.city ||
                      "",
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
