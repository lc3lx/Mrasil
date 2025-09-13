"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Real from "../../../public/real.png";
import {
  Wallet,
  ShoppingBag,
  CreditCard,
  Package,
  BarChart3,
  XCircle,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { V7StatsCard } from "@/components/v7/v7-stats-card";
import { V7ShipmentCard } from "@/app/shipments/components/v7-shipment-card";
import { V7WelcomeBanner } from "@/components/v7/v7-welcome-banner";
import { V7ShipmentLineChart } from "@/components/v7/charts/shipment-line-chart";
import { V7Content } from "@/components/v7/v7-content";
import { useGetMyWalletQuery } from "@/app/api/walletApi";
import { useGetAllOrdersQuery } from "@/app/api/ordersApi";
import { useGetMyShipmentsQuery } from "@/app/api/shipmentApi";
import {
  useGetHomePageStatisticsQuery,
  useGetShipmentStatsQuery,
} from "@/app/api/homePageApi";
import { useGetShipmentCompanyInfoQuery } from "@/app/api/shipmentCompanyApi";
import { useGetMyTransactionsQuery } from "@/app/api/transicationApi";
import Image from "next/image";
import RealBlue from "../../../public/real-blue.png";
// Remove RiyalIcon import if not used elsewhere
// import { RiyalIcon } from '@/components/icons';

export function HomeContent({ theme = "light" }: { theme?: "light" | "dark" }) {
  const router = useRouter();

  // حالات إعادة المحاولة
  const [retryCount, setRetryCount] = useState(0);
  const [lastRetryTime, setLastRetryTime] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 ثانية

  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useGetMyWalletQuery();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetAllOrdersQuery();
  const today = new Date();
  const todayOrders =
    ordersData?.data.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return (
        createdAt.getFullYear() === today.getFullYear() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getDate() === today.getDate()
      );
    }) ?? [];
  const {
    data: myShipmentsData,
    isLoading: myShipmentsLoading,
    error: shipmentsError,
    refetch: refetchShipments,
  } = useGetMyShipmentsQuery({ page: 1, itemsPerPage: 2 });
  const lastTwoShipments = myShipmentsData?.data?.slice(-2) ?? [];
  const {
    data: homeStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetHomePageStatisticsQuery();
  const {
    data: shipmentStats,
    isLoading: shipmentStatsLoading,
    error: shipmentStatsError,
    refetch: refetchShipmentStats,
  } = useGetShipmentStatsQuery();
  const {
    data: shipmentCompanyInfo,
    isLoading: shipmentCompanyInfoLoading,
    error: companyInfoError,
    refetch: refetchCompanyInfo,
  } = useGetShipmentCompanyInfoQuery();
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useGetMyTransactionsQuery();
  const lastTransaction =
    transactionsData?.data && transactionsData.data.length > 0
      ? transactionsData.data[transactionsData.data.length - 1]
      : null;

  const pendingOrdersCount =
    ordersData?.data?.filter((order) => order.status?.name === "pending")
      .length ?? 0;

  // تحديد حالة التحميل بناءً على البيانات الأساسية
  const isMainDataLoading =
    walletLoading || ordersLoading || myShipmentsLoading || statsLoading;

  // تحديد الأخطاء
  const hasErrors =
    walletError ||
    ordersError ||
    shipmentsError ||
    statsError ||
    shipmentStatsError ||
    companyInfoError ||
    transactionsError;

  // آلية إعادة المحاولة التلقائية
  const retryFailedRequests = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      console.log("تم الوصول للحد الأقصى من المحاولات");
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastRetryTime < RETRY_DELAY) {
      return; // تجنب المحاولات المتكررة بسرعة
    }

    console.log(`إعادة المحاولة ${retryCount + 1} من ${MAX_RETRIES}`);
    setRetryCount((prev) => prev + 1);
    setLastRetryTime(currentTime);

    // إعادة جلب البيانات الفاشلة فقط
    const retryPromises = [];

    if (walletError) retryPromises.push(refetchWallet());
    if (ordersError) retryPromises.push(refetchOrders());
    if (shipmentsError) retryPromises.push(refetchShipments());
    if (statsError) retryPromises.push(refetchStats());
    if (shipmentStatsError) retryPromises.push(refetchShipmentStats());
    if (companyInfoError) retryPromises.push(refetchCompanyInfo());
    if (transactionsError) retryPromises.push(refetchTransactions());

    try {
      await Promise.allSettled(retryPromises);
      console.log("تمت إعادة المحاولة بنجاح");
    } catch (error) {
      console.error("فشل في إعادة المحاولة:", error);
    }
  }, [
    retryCount,
    lastRetryTime,
    walletError,
    ordersError,
    shipmentsError,
    statsError,
    shipmentStatsError,
    companyInfoError,
    transactionsError,
    refetchWallet,
    refetchOrders,
    refetchShipments,
    refetchStats,
    refetchShipmentStats,
    refetchCompanyInfo,
    refetchTransactions,
  ]);

  // تشغيل إعادة المحاولة عند وجود أخطاء
  useEffect(() => {
    if (hasErrors && !isMainDataLoading && retryCount < MAX_RETRIES) {
      const timeoutId = setTimeout(() => {
        retryFailedRequests();
      }, RETRY_DELAY);

      return () => clearTimeout(timeoutId);
    }
  }, [hasErrors, isMainDataLoading, retryFailedRequests, retryCount]);

  // إعادة تعيين عداد المحاولات عند نجاح التحميل
  useEffect(() => {
    if (!hasErrors && !isMainDataLoading && retryCount > 0) {
      console.log("تم تحميل البيانات بنجاح، إعادة تعيين عداد المحاولات");
      setRetryCount(0);
      setLastRetryTime(0);
    }
  }, [hasErrors, isMainDataLoading, retryCount]);

  const companiesWithTypes = (shipmentCompanyInfo || []).flatMap(
    (company: any) =>
      company.shippingTypes.map((shippingType: any) => {
        let displayName = company.name;

        // إذا سمسا وDry خليها سمسا برو
        if (company.name === "smsa" && shippingType.type === "Dry") {
          displayName = "smsa Pro"; // أو أي اسم آخر حسب واجهتك
        }

        return {
          ...company,
          companyName: displayName, // استخدم هذا الاسم للعرض
          shippingType,
        };
      })
  );
  const priorityOrder = ["smsa Pro", "aramex", "smsa", "redbox", "omniclama"];

  const sortedCompanies = companiesWithTypes.sort((a: any, b: any) => {
    const aIndex = priorityOrder.indexOf(a.companyName);
    const bIndex = priorityOrder.indexOf(b.companyName);

    return (
      (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex)
    );
  });

  // عرض حالة التحميل
  if (isMainDataLoading) {
    return (
      <V7Content>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="v7-loading-spinner mb-4"></div>
          <p className="text-[#3498db] text-lg">
            {retryCount > 0
              ? `جاري إعادة تحميل البيانات... (المحاولة ${retryCount + 1})`
              : "جاري تحميل لوحة التحكم..."}
          </p>
          {retryCount > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              يتم إعادة المحاولة تلقائياً عند فشل التحميل
            </p>
          )}
        </div>
      </V7Content>
    );
  }
  return (
    <V7Content>
      <V7WelcomeBanner theme={theme} />

      <div
        className="   grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 items-center gap-6   v7-fade-in"
        style={{ transitionDelay: "0.1s" }}
      >
        <V7StatsCard
          title="المحفظة"
          icon={Wallet}
          color="primary"
          theme={theme}
          stats={[
            {
              label: "الرصيد الحالي",
              value: walletLoading ? (
                "..."
              ) : walletError ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3498db]"></div>
                </div>
              ) : walletData?.wallet.balance !== undefined ? (
                <span className="flex items-center text-[#0d904f] justify-end gap-1">
                  <span>{walletData.wallet.balance.toString() ?? "-"}</span>
                  <Image
                    src={Real}
                    alt="ريال"
                    className="w-6 h-6 align-baseline"
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />
                </span>
              ) : (
                "-"
              ),
            },
            {
              label: "آخر معاملة",
              value: transactionsLoading ? (
                "..."
              ) : transactionsError ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3498db]"></div>
                </div>
              ) : lastTransaction?.createdAt ? (
                new Date(lastTransaction.createdAt).toLocaleDateString()
              ) : (
                "-"
              ),
            },
          ]}
          action={{
            label: "شحن المحفظة الآن",
            onClick: () => router.push("/wallet/recharge"),
          }}
        />

        <V7StatsCard
          title="الطلبات"
          icon={ShoppingBag}
          color="secondary"
          theme={theme}
          centerContent={true}
          stats={[
            {
              label: "طلبات اليوم",

              value: ordersLoading ? (
                "..."
              ) : ordersError ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3498db]"></div>
                </div>
              ) : (
                <span className=" flex items-center gap-2">
                  <span>{todayOrders.length.toString()}</span>
                  طلب
                </span>
              ),
            },
            {
              label: "جميع الطلبات",
              value: ordersLoading ? (
                "..."
              ) : ordersError ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3498db]"></div>
                </div>
              ) : (
                <span className=" flex items-center gap-2">
                  <span>{ordersData?.data.length?.toString() ?? "-"}</span>
                  طلب
                </span>
              ),
            },
            {
              label: "الطلبات المعلقة",
              value: ordersLoading ? (
                "..."
              ) : ordersError ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3498db]"></div>
                </div>
              ) : (
                <span className=" flex items-center gap-2">
                  <span>{pendingOrdersCount.toString()}</span>
                  طلب
                </span>
              ),
            },
          ]}
        />
        <V7StatsCard
          title="إحصائيات الشحن"
          icon={CreditCard}
          color="success"
          theme={theme}
          stats={[
            {
              label: "إجمالي قيمة الشحنات",
              // type: "ريال",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-4">
                  <span>
                    {typeof shipmentStats?.totalValue === "number"
                      ? shipmentStats.totalValue.toLocaleString()
                      : typeof shipmentStats?.totalValue === "string"
                      ? shipmentStats.totalValue
                      : "-"}
                  </span>
                  <Image
                    src={Real}
                    alt="ريال"
                    className="w-6 h-6 align-baseline"
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />
                </span>
              ),
            },
            {
              label: "شحنات قيد الانتظار",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-2">
                  <span>
                    {typeof shipmentStats?.pendingShipments === "number"
                      ? shipmentStats.pendingShipments.toLocaleString()
                      : typeof shipmentStats?.pendingShipments === "string"
                      ? shipmentStats.pendingShipments
                      : "-"}
                  </span>
                  <span>شحنة</span>
                </span>
              ),
            },
            {
              label: "شحنات تم تسليمها",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-2">
                  <span>
                    {shipmentStats?.deliveredShipments?.toLocaleString() ?? "-"}
                  </span>
                  <span>شحنة</span>
                </span>
              ),
            },
            {
              label: "شحنات في الطريق",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-2">
                  <span>
                    {shipmentStats?.inTransitShipments?.toLocaleString() ?? "-"}
                  </span>
                  <span>شحنة</span>
                </span>
              ),
            },
          ]}
        />
      </div>
      <div
        className="grid gap-6 lg:grid-cols-3 v7-fade-in"
        style={{ transitionDelay: "0.2s" }}
      >
        <div className="lg:col-span-2">
          <Card className="v7-neu-card overflow-hidden border-none">
            <CardHeader className="pb-0">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-bold text-[#294D8B] -mt-1">
                  أسعار الشحن
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              {shipmentCompanyInfoLoading ? (
                <div className="text-center p-4 text-lg">
                  جاري تحميل أسعار الشحن...
                </div>
              ) : companiesWithTypes && Array.isArray(companiesWithTypes) ? (
                <div className="  grid  grid-cols-1 md:grid-cols-2 gap-4  w-full">
                  {sortedCompanies.map((company: any, idx: number) => {
                    const isLast = idx === companiesWithTypes.length - 1;
                    const name = company.name?.toLowerCase() || "";
                    let imgSrc = "/placeholder-logo.png";
                    if (name.includes("aramex"))
                      imgSrc = "/companies/araMex.png";
                    else if (name.includes("smsa"))
                      imgSrc = "/companies/smsa.jpg";
                    else if (name.includes("imile"))
                      imgSrc = "/carriers/imile-logo.png";
                    else if (name.includes("fedex"))
                      imgSrc = "/carriers/fedex-logo.png";
                    else if (name.includes("dhl"))
                      imgSrc = "/carriers/dhl-logo.png";
                    else if (name.includes("ups"))
                      imgSrc = "/carriers/ups-logo.png";
                    else if (name.includes("redbox"))
                      imgSrc = "/companies/redBox.png";
                    else if (name.includes("omniclama"))
                      imgSrc = "/companies/lamaBox.png";
                    return (
                      <div
                        key={company.name + idx}
                        className={`shadow-md rounded-lg p-4 flex flex-col items-center gap-2 bg-white/30 flex-1
                          ${isLast ? "md:col-span-2" : "flex-1"}
                          `}
                      >
                        <img
                          src={imgSrc}
                          alt={company.companyName}
                          className="max-h-20 max-w-20 mb-2 object-cover"
                        />
                        <div className="font-bold  text-primary text-xl">
                          {company.companyName === "omniclama"
                            ? "LLAMA BOX"
                            : company.companyName === "redbox"
                            ? "RED BOX"
                            : company.companyName == "aramex"
                            ? "ARAMEX PRO"
                            : company.companyName.toLocaleUpperCase()}
                        </div>
                        <div className="w-full">
                          <ul className="text-sm w-full text-center flex items-center justify-center flex-col">
                            <li
                              key={company.type}
                              className=" text-center border-b last:border-b-0 text-lg"
                            >
                              <span className="font-bold text-[#3498db] flex items-center">
                                {/* {company.shippingType.price} */}
                                {Number.isInteger(company.shippingType.price)
                                  ? company.shippingType.price
                                      .toString()
                                      .slice(0, 4)
                                  : parseFloat(
                                      company.shippingType.price.toPrecision(4)
                                    )}
                                <Image
                                  alt="real"
                                  src={RealBlue}
                                  width={30}
                                  height={30}
                                />
                              </span>
                            </li>
                          </ul>
                          <ul className="  mt-2 text-gry space-y-1">
                            {["smsa", "redbox", "omniclama"].includes(
                              company.companyName ?? ""
                            ) ? (
                              <>
                                <li className="flex items-center justify-center gap-2 text-center">
                                  {/* <span className="h-2 w-2 rounded-full bg-[#3498db] inline-block"></span> */}
                                  <Clock className="w-4 h-4" />3 - 2 أيام عمل
                                </li>
                                <li className="flex items-center justify-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-[#3498db] inline-block"></span>
                                  أسعار اقتصادية
                                </li>
                                <li className="flex items-center justify-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-[#3498db] inline-block"></span>
                                  تتبع مباشر
                                </li>
                              </>
                            ) : (
                              <>
                                <li className="flex items-center justify-center gap-2 text-center">
                                  <Clock className="w-4 h-4" />3 - 2 أيام عمل
                                </li>
                                <li className="flex items-center justify-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-[#3498db] inline-block"></span>
                                  توصيل من الباب للباب
                                </li>
                                <li className="flex items-center justify-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-[#3498db] inline-block"></span>
                                  تتبع مباشر
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-4 text-lg">
                  لا توجد بيانات شركات شحن
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500 text-center">
                الأسعار تشمل قيمة الضريبة المضافة
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="v7-neu-card overflow-hidden border-none h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#294D8B]">
              الإحصائيات
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="v7-neu-icon-sm p-2">
                  <Package className="h-6 w-6 text-[#294D8B]" />
                </div>
                <span className="text-lg font-medium">إجمالي الشحنات</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">
                  {statsLoading ? "..." : homeStats?.totalShipments ?? "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="v7-neu-icon-sm bg-blue-50 p-2">
                  <Package className="h-6 w-6 text-[#3498db]" />
                </div>
                <span className="text-lg font-medium">شحنات اليوم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">
                  {statsLoading ? "..." : homeStats?.todaysShipments ?? "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="v7-neu-icon-sm p-2">
                  <CheckCircle className="h-6 w-6 text-[#27ae60]" />
                </div>
                <span className="text-lg font-medium">الشحنات المستلمة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">
                  {statsLoading ? "..." : homeStats?.receivedShipments ?? "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="v7-neu-icon-sm p-2">
                  <XCircle className="h-6 w-6 text-[#e74c3c]" />
                </div>
                <span className="text-lg font-medium">الشحنات الملغاة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">
                  {statsLoading ? "..." : homeStats?.canceledShipments ?? "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="v7-neu-icon-sm p-2">
                  <BarChart3 className="h-6 w-6 text-[#3498db]" />
                </div>
                <span className="text-lg font-medium">معدل النمو</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">
                  {statsLoading
                    ? "..."
                    : homeStats?.growthRate !== undefined &&
                      `${homeStats.growthRate}%`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="v7-fade-in  " style={{ transitionDelay: "0.3s" }}>
        <div className="flex items-center mt-24 mb-10">
          <h2 className="sm:text-3xl text-2xl font-bold text-[#3498db] ms-4">
            آخر الشحنات
          </h2>
        </div>

        <div className="grid gap-4">
          {myShipmentsLoading ? (
            <div className="text-center p-4">جاري تحميل الشحنات...</div>
          ) : lastTwoShipments.length === 0 ? (
            <div className="text-center p-4">لا توجد شحنات حديثة</div>
          ) : (
            lastTwoShipments.map((shipment) => (
              <V7ShipmentCard
                key={shipment._id}
                shipment={shipment}
                allSelected={false}
                selectedShipmentId={null}
              />
            ))
          )}
        </div>

        <div className="flex justify-center mt-6 mb-20">
          <Button
            className="v7-neu-button"
            onClick={() => router.push("/shipments")}
          >
            <Eye className="mr-2 h-4 w-4" />
            عرض جميع الشحنات
          </Button>
        </div>
      </div>
    </V7Content>
  );
}
