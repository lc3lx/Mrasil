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

interface V7ShipmentCardProps {
  shipment: {
    _id: string;
    dimension: { high: number; width: number; length: number };
    customerId: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    orderId: string;
    senderAddress: {
      full_name: string;
      mobile: string;
      city: string;
      country: string;
      address: string;
    };
    boxNum: number;
    weight: number;
    orderDescription: string;
    shapmentingType: string;
    shapmentCompany: string;
    shapmentType: string;
    shapmentPrice: number;
    orderSou: string;
    priceaddedtax: number;
    byocPrice: number;
    basepickUpPrice: number;
    profitpickUpPrice: number;
    baseRTOprice: number;
    createdAt: string;
    redboxResponse?: { label: string };
    aramexResponse?: { labelURL: string };
    omniclamaResponse?: { label: string };
    smsaResponse?: { label: string };
  };
}

export function V7ShipmentCard({ shipment }: V7ShipmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!shipment || !shipment._id) {
    return null;
  }

  // Helper functions for status, etc. (use dummy logic or map as needed)
  const getStatusIcon = () => <Package className="h-5 w-5 text-violet-500" />;
  const getStatusText = () => "جاهز للشحن";
  const getStatusColor = () => "bg-violet-50 text-violet-700 border-violet-200";

  // Carrier details
  const getCarrierDetails = (carrier: string) => {
    const normalizedCarrier = carrier?.toLowerCase().trim();
    const carrierDetails: Record<
      string,
      { name: string; logo: string; color: string }
    > = {
      aramex: {
        name: "أرامكس",
        logo: "/carriers/aramex-logo.png",
        color: "text-red-600",
      },
      dhl: {
        name: "دي إتش إل",
        logo: "/carriers/dhl-logo.png",
        color: "text-yellow-600",
      },
      fedex: {
        name: "فيديكس",
        logo: "/carriers/fedex-logo.png",
        color: "text-purple-600",
      },
      ups: {
        name: "يو بي إس",
        logo: "/carriers/ups-logo.png",
        color: "text-brown-600",
      },
      smsa: {
        name: "سمسا",
        logo: "/carriers/carrier-placeholder.png",
        color: "text-blue-600",
      },
      imile: {
        name: "آي مايل",
        logo: "/carriers/imile-logo.png",
        color: "text-green-600",
      },
      redbox: {
        name: "ريد بوكس",
        logo: "/carriers/carrier-placeholder.png",
        color: "text-pink-600",
      },
    };
    return (
      carrierDetails[normalizedCarrier] || {
        name: carrier,
        logo: "/carriers/carrier-placeholder.png",
        color: "text-gray-600",
      }
    );
  };
  const carrierInfo = getCarrierDetails(
    shipment && shipment.shapmentCompany ? shipment.shapmentCompany : "unknown"
  );

  // Helper: Get label URL for printing
  const getLabelUrl = () => {
    const company = (shipment.shapmentCompany || "").toLowerCase();
    if (
      company === "redbox" &&
      shipment.redboxResponse &&
      shipment.redboxResponse.label
    ) {
      return shipment.redboxResponse.label;
    }
    if (
      company === "aramex" &&
      shipment.aramexResponse &&
      shipment.aramexResponse.labelURL
    ) {
      return shipment.aramexResponse.labelURL;
    }
    if (
      company === "omniclama" &&
      shipment.omniclamaResponse &&
      shipment.omniclamaResponse.label
    ) {
      return shipment.omniclamaResponse.label;
    }
    if (
      company === "smsa" &&
      shipment.smsaResponse &&
      shipment.smsaResponse.label
    ) {
      return shipment.smsaResponse.label;
    }
    // Add more companies as needed
    return null;
  };
  const labelUrl = getLabelUrl();

  return (
    <div
      className={`v7-neu-card-inner rounded-xl p-4 transition-all duration-300 border border-gray-100 max-w-md min-h-[340px] w-full mx-auto flex flex-col justify-center items-center ${
        isHovered ? "shadow-sm transform -translate-y-0.5" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
      style={{ position: "relative" }}
    >
      <div className="flex flex-col space-y-2 w-full items-center justify-center">
        <div className="flex flex-col gap-2 w-full items-center justify-center">
          {/* Status Icon */}
          <div
            className={`v7-neu-icon ${getStatusColor()} flex items-center justify-center self-center mb-2`}
          >
            {getStatusIcon()}
          </div>

          {/* Main Info */}
          <div className="flex flex-col gap-y-2 w-full items-center justify-center">
            <div className="flex flex-col items-center gap-y-2 w-full">
              <div className="font-bold text-sm sm:text-base whitespace-nowrap text-center">
                رقم الشحنة #{shipment._id}
              </div>
            </div>
            <div className="text-xs text-[#6d6a67] text-center mt-0.5 w-full">
              رقم الطلب:{" "}
              <span className="font-medium mr-2">{shipment.orderId}</span>
            </div>
            <div className="flex flex-col items-center gap-y-2 w-full">
              <div className="text-xs text-[#6d6a67] flex items-center gap-x-2 justify-center">
                <span>الناقل:</span>
                <span className="font-medium flex items-center">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${carrierInfo.color}`}
                  >
                    <div className="h-3.5 w-3.5 ml-2 relative overflow-hidden">
                      <Image
                        src={carrierInfo.logo || "/placeholder.svg"}
                        alt={carrierInfo.name}
                        width={14}
                        height={14}
                        className="object-contain"
                      />
                    </div>
                    {carrierInfo.name}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-y-2 mt-1 w-full">
              <div className="flex items-center gap-x-2 justify-center">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-700 font-medium">
                  {shipment.senderAddress.city}
                </span>
              </div>
              <div className="flex items-center gap-x-2 justify-center">
                <span className="text-xs text-[#294D8B] font-medium">
                  {shipment.senderAddress.address}
                </span>
              </div>
            </div>
          </div>

          {/* Status & Date */}
          <div className="flex flex-col items-center gap-y-2 mt-2 min-w-0 w-full">
            <div
              className={`inline-flex items-center gap-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()} justify-center w-full`}
            >
              <span className="ml-1">{getStatusIcon()}</span>
              <span>{getStatusText()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-2 min-w-0 w-full items-center justify-center">
            <Link
              href={`/tracking?id=${shipment._id}`}
              className="w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full v7-neu-button-sm group h-7 text-xs flex items-center justify-center gap-x-2"
              >
                <Eye className="h-3.5 w-3.5 group-hover:text-[#3498db] transition-colors" />
                <span className="sr-only sm:not-sr-only">تتبع</span>
              </Button>
            </Link>
            {labelUrl ? (
              <a
                href={labelUrl}
                className="w-full"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full v7-neu-button-sm group h-7 text-xs flex items-center justify-center gap-x-2"
                >
                  <Printer className="h-3.5 w-3.5 group-hover:text-[#3498db] transition-colors" />
                  <span className="sr-only sm:not-sr-only">
                    طباعة بوالص الشحن
                  </span>
                </Button>
              </a>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full v7-neu-button-sm group h-7 text-xs flex items-center justify-center gap-x-2 opacity-50 cursor-not-allowed"
                disabled
              >
                <Printer className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">
                  طباعة بوالص الشحن
                </span>
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-3 mt-2 border-t border-gray-100 v7-fade-in w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {/* Shipment Details */}
              <div className="text-center">
                <h4 className="text-xs font-bold mb-2 text-[#294D8B] text-center">
                  تفاصيل الشحنة
                </h4>
                <div className="space-y-2 text-xs text-center">
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">الوصف:</span>
                    <span className="font-medium">
                      {shipment.orderDescription}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">الوزن:</span>
                    <span className="font-medium">{shipment.weight} كجم</span>
                  </div>
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">الأبعاد:</span>
                    <span className="font-medium">
                      {shipment.dimension?.length ?? "-"} ×{" "}
                      {shipment.dimension?.width ?? "-"} ×{" "}
                      {shipment.dimension?.high ?? "-"} سم
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">نوع الشحن:</span>
                    <span className="font-medium">
                      {shipment.shapmentingType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">
                      نوع الخدمة:
                    </span>
                    <span className="font-medium">{shipment.shapmentType}</span>
                  </div>
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">سعر الشحن:</span>
                    <span className="font-medium">
                      {shipment.shapmentPrice?.basePrice ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-3 text-center">
                    <span className="text-[#294D8B] font-bold">الضريبة:</span>
                    <span className="font-medium">
                      {shipment.priceaddedtax * 100}%
                    </span>
                  </div>
                </div>
              </div>
              {/* Sender Info */}
              <div className="text-center">
                <h4 className="text-xs font-bold mb-1.5 text-[#294D8B] text-center">
                  معلومات المرسل
                </h4>
                <div className="space-y-1.5 text-xs text-center">
                  <div className="flex justify-between items-center gap-x-2 text-center">
                    <span className="text-[#294D8B] font-bold">الاسم:</span>
                    <span className="font-medium">
                      {shipment.senderAddress.full_name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-2 text-center">
                    <span className="text-[#294D8B] font-bold">الهاتف:</span>
                    <span className="font-medium">
                      {shipment.senderAddress.mobile}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-2 text-center">
                    <span className="text-[#294D8B] font-bold">العنوان:</span>
                    <span className="font-medium">
                      {shipment.senderAddress.address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-2 text-center">
                    <span className="text-[#294D8B] font-bold">المدينة:</span>
                    <span className="font-medium">
                      {shipment.senderAddress.city}
                    </span>
                  </div>
                </div>
              </div>
              {/* Customer Info */}
              <div className="text-center md:col-span-2">
                <h4 className="text-xs font-bold mb-1.5 text-[#294D8B] text-center">
                  معلومات المستلم
                </h4>
                <div className="space-y-1.5 text-xs text-center">
                  <div className="flex justify-between items-center gap-x-2 text-center">
                    <span className="text-[#294D8B] font-bold">الاسم:</span>
                    <span className="font-medium">
                      {shipment.customerId.firstName}{" "}
                      {shipment.customerId.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-x-2 text-center">
                    <span className="text-[#294D8B] font-bold">
                      البريد الإلكتروني:
                    </span>
                    <span className="font-medium">
                      {shipment.customerId.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#6d6a67] hover:text-[#3498db] flex items-center gap-x-2 h-6 px-3"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "عرض أقل" : "عرض المزيد"}
          </Button>
        </div>
      </div>
    </div>
  );
}
