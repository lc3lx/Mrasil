"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import V7Layout from "@/components/v7/v7-layout";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import {
  useGetMyShipmentsQuery,
  useGetShipmentByIdQuery,
} from "../api/shipmentApi";
import { useTrackShipmentMutation } from "../api/trakingApi";

interface TimelineStep {
  status: string;
  date: string;
  time: string;
  completed: boolean;
}
interface Tracking {
  trackingNumber: number;
}

export default function () {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [trackShipment, { isLoading }] = useTrackShipmentMutation();
  const hasAutoTracked = useRef(false);

  const searchParams = useSearchParams();
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setNumber(idFromUrl);
      // إعادة تعيين hasAutoTracked عند تغيير رقم التتبع
      hasAutoTracked.current = false;
    }
  }, [searchParams]);

  // إرسال طلب التتبع تلقائياً عند وجود رقم تتبع في URL
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (
      idFromUrl &&
      idFromUrl.trim() &&
      !hasAutoTracked.current &&
      !isTracking
    ) {
      hasAutoTracked.current = true;
      // إرسال طلب التتبع تلقائياً
      const autoTrack = async () => {
        try {
          setError("");
          setIsTracking(true);
          setTrackingResult(null);
          const res = await trackShipment({
            trackingNumber: idFromUrl,
          }).unwrap();
          setTrackingResult(res?.data || res);
        } catch (err: any) {
          console.error("Error", err);
          const msg = err?.data?.message || "حصل خطأ أثناء جلب بيانات الشحنة";
          setError(msg);
        } finally {
          setIsTracking(false);
        }
      };
      autoTrack();
    }
  }, [searchParams]);
  const { data: myShipmentsData, isLoading: myShipmentsLoading } =
    useGetMyShipmentsQuery({ page: 1, itemsPerPage: 5 });
  const lastFiveShipments = myShipmentsData?.data?.slice(-5) ?? [];

  // جلب الشحنة من API بناءً على trackingNumber
  const {
    data: shipmentData,
    isLoading: isLoadingShipment,
    refetch: refetchShipment,
  } = useGetShipmentByIdQuery(number || "", { skip: !number });

  // إعادة جلب الشحنة عند تغيير number
  useEffect(() => {
    if (number) {
      refetchShipment();
    }
  }, [number, refetchShipment]);

  // الحصول على بيانات الشحنة الفعلية - أولاً من API، ثم من lastFiveShipments
  // shipmentData قد يكون الشحنة مباشرة أو { status: "success", data: shipment }
  const apiShipment = shipmentData?.data || shipmentData;
  const currentShipment =
    apiShipment ||
    (number
      ? lastFiveShipments.find(
          (shipment: any) =>
            shipment.trackingId === number ||
            shipment.trackingNumber === number ||
            shipment._id === number
        )
      : null);

  console.log("shipmentData", shipmentData);
  console.log("apiShipment", apiShipment);
  console.log("currentShipment", currentShipment);
  console.log("shipmentSender", currentShipment?.senderAddress);
  console.log("shipmentReceiver", currentShipment?.receiverAddress);
  // handel Track
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) {
      setError("الرجاء إدخال رقم الشحنة");
      return;
    }

    try {
      setError("");
      setIsTracking(true);
      setTrackingResult(null);
      const res = await trackShipment({ trackingNumber: number }).unwrap();
      setTrackingResult(res?.data || res);
    } catch (err: any) {
      console.error("Error", err);
      const msg = err?.data?.message || "حصل خطأ أثناء جلب بيانات الشحنة";
      setError(msg);
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return "text-gray-500";
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered":
        return "text-green-500";
      case "in_transit":
      case "transit":
        return "text-amber-500";
      case "processing":
        return "text-blue-500";
      default:
        // التحقق من الحالات الكبيرة
        if (status === "Delivered" || status === "DELIVERED") {
          return "text-green-500";
        }
        if (status === "IN_TRANSIT") {
          return "text-amber-500";
        }
        return "text-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return "";
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered":
        return "تم التسليم";
      case "in_transit":
      case "transit":
        return "جاري التوصيل";
      case "processing":
        return "قيد المعالجة";
      case "ready":
      case "ready_for_pickup":
        return "جاهز للشحن";
      case "cancelled":
      case "canceled":
        return "ملغاة";
      default:
        // التحقق من الحالات الكبيرة
        if (status === "Delivered" || status === "DELIVERED") {
          return "تم التسليم";
        }
        if (status === "IN_TRANSIT") {
          return "جاري التوصيل";
        }
        if (status === "READY_FOR_PICKUP") {
          return "جاهز للشحن";
        }
        return status || "";
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) {
      const finalStatus = shipmentStatus || "";
      if (finalStatus === "Delivered" || finalStatus === "DELIVERED") {
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      }
      if (finalStatus === "IN_TRANSIT") {
        return <Truck className="h-6 w-6 text-amber-500" />;
      }
      if (finalStatus === "READY_FOR_PICKUP") {
        return <Package className="h-6 w-6 text-purple-500" />;
      }
      return <Package className="h-6 w-6 text-gray-500" />;
    }
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "in_transit":
      case "transit":
        return <Truck className="h-6 w-6 text-amber-500" />;
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />;
      case "ready":
      case "ready_for_pickup":
        return <Package className="h-6 w-6 text-purple-500" />;
      default:
        if (status === "Delivered" || status === "DELIVERED") {
          return <CheckCircle className="h-6 w-6 text-green-500" />;
        }
        if (status === "IN_TRANSIT") {
          return <Truck className="h-6 w-6 text-amber-500" />;
        }
        if (status === "READY_FOR_PICKUP") {
          return <Package className="h-6 w-6 text-purple-500" />;
        }
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  // استخدام بيانات الشحنة الفعلية إذا كانت متوفرة، وإلا استخدام trackingResult
  const result = trackingResult?.detail;
  const resultSmsa = trackingResult?.tracking;

  // بيانات من الشحنة الفعلية فقط
  const shipmentSender = currentShipment?.senderAddress;
  const shipmentReceiver =
    currentShipment?.receiverAddress || currentShipment?.order?.customer;
  const shipmentWeight = currentShipment?.weight;
  const shipmentCreatedAt = currentShipment?.createdAt;
  const shipmentStatus = currentShipment?.shipmentstates;
  const shipmentCompany = currentShipment?.shapmentCompany;
  const shipmentType = currentShipment?.shapmentingType;

  console.log("data", { trackingResult, currentShipment });
  return (
    <V7Layout>
      <div className="space-y-8 pb-8 md:pb-20 mt-8 md:my-16 px-4 sm:px-6 lg:px-0">
        <div className="text-center md:text-right space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#294D8B]">
            تتبع الشحنات
          </h1>
          <p className="text-sm md:text-base text-[#6d6a67]">
            تتبع شحناتك ومعرفة حالتها الحالية
          </p>
        </div>

        <div className="v7-neu-card p-4 sm:p-6 rounded-xl overflow-hidden">
          <div className="mb-6 text-center md:text-right space-y-2">
            <h2 className="text-xl font-bold text-[#3498db]">
              أدخل رقم الشحنة
            </h2>
            <p className="text-sm text-[#6d6a67]">
              أدخل رقم الشحنة المكون من 12 رقم للتتبع
            </p>
          </div>

          <form
            className="flex flex-col xl:flex-row gap-3 sm:gap-4"
            onSubmit={handleTrack}
          >
            <div className="relative flex-1 v7-neu-input-container">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="مثال: SE1002202504"
                className="v7-neu-input w-full pl-12 pr-4 text-right"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="inline-flex w-full xl:w-auto items-center justify-center hover:text-white gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-4 py-2 v7-neu-button"
              disabled={isTracking}
            >
              {isTracking ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري البحث...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>تتبع الشحنة</span>
                </div>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-500 p-4 rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          {(trackingResult || currentShipment) && (
            <>
              <div className="mt-8 space-y-6 v7-fade-in">
                <div className="flex flex-col lg:flex-row justify-between gap-6 p-4 sm:p-6 rounded-xl v7-neu-card-inner overflow-hidden flex-wrap min-w-0">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full flex-wrap min-w-0">
                    <div className="v7-neu-icon">
                      {getStatusIcon(
                        trackingResult?.status ||
                          shipmentStatus ||
                          resultSmsa?.status
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(shipmentSender || shipmentReceiver) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  {shipmentSender && (
                    <div className=" p-6 rounded-xl v7-neu-card-inner">
                      <h1 className="text-lg font-bold text-[#3498db] mb-4 ">
                        معلومات المرسل
                      </h1>
                      <div className=" space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className=" text-[#6d6a67]">الاسم:</span>
                          <span className=" text-[#1A5889] font-medium">
                            {shipmentSender?.full_name || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className=" text-[#6d6a67]">الهاتف:</span>
                          <span className=" text-[#1A5889] font-medium">
                            {shipmentSender?.mobile || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className=" text-[#6d6a67]">العنوان:</span>
                          <span className=" text-[#1A5889] font-medium">
                            {shipmentSender?.address || "-"}{" "}
                            {shipmentSender?.city || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {shipmentReceiver && (
                    <div className=" p-6 rounded-xl v7-neu-card-inner">
                      <h1 className="text-lg font-bold text-[#3498db] mb-4">
                        معلومات المستلم
                      </h1>
                      <div className=" space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className=" text-[#6d6a67]">الاسم:</span>
                          <span className=" text-[#1A5889] font-medium">
                            {shipmentReceiver?.full_name ||
                              shipmentReceiver?.clientName ||
                              "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className=" text-[#6d6a67]">الهاتف:</span>
                          <span className=" text-[#1A5889] font-medium">
                            {shipmentReceiver?.mobile ||
                              shipmentReceiver?.clientPhone ||
                              "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className=" text-[#6d6a67]">العنوان:</span>
                          <span className=" text-[#1A5889] font-medium">
                            {shipmentReceiver?.address ||
                              shipmentReceiver?.clientAddress ||
                              "-"}{" "}
                            {shipmentReceiver?.city || ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/*  */}
        </div>

        <div className="mt-8 v7-neu-card p-6 rounded-xl overflow-hidden">
          <h1 className="text-xl font-bold text-[#3498db] mb-4">
            الشحنات الأخيرة
          </h1>
          <div className=" flex flex-col gap-4">
            {lastFiveShipments?.map((data: any, idx: number) => (
              <div
                key={data?._id || data?.trackingId || idx}
                className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg v7-neu-card-inner"
              >
                <div className="flex items-center gap-3">
                  <div className="v7-neu-icon-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-circle-check-big h-6 w-6 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                  <div className=" flex flex-col">
                    <span className="text-sm text-[#6d6a67]">
                      {data?.senderAddress?.city} ←{" "}
                      {data?.receiverAddress?.city}
                    </span>
                  </div>
                </div>
                <div className=" flex flex-col">
                  <span className="text-sm font-medium text-green-500">
                    تم التسليم
                  </span>
                  <span className="text-xs text-[#6d6a67]">18 أبريل</span>
                </div>
                <div className=" flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    {data?.orderId?.status?.name}
                  </span>
                  <span className="text-xs text-[#6d6a67]">17 أبريل</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </V7Layout>
  );
}
