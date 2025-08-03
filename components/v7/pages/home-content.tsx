"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Real from "../../../public/real.png"
import {
  Wallet,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Package,
  BarChart3,
  XCircle,
  Eye,
  CheckCircle,
} from "lucide-react";
import { MdOutlinePendingActions } from "react-icons/md";
import { RiFolderReceivedFill } from "react-icons/ri";
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
import { FaRoadCircleExclamation } from "react-icons/fa6";
import { useGetMyTransactionsQuery } from "@/app/api/transicationApi";
import Image from "next/image";
// Remove RiyalIcon import if not used elsewhere
// import { RiyalIcon } from '@/components/icons';

// بيانات وهمية للإحصائيات
const statsData = {
  balance: {
    available: "76.02 ريال",
    lastTransaction: "منذ 3 ساعات",
  },
  orders: {
    today: "12 طلب",
    total: "143 طلب",
    target: "150 طلب",
    percentage: 95,
  },
  shipping: {
    averageCost: "22.00 ريال",
    totalCost: "2,158.00 ريال",
    lastMonth: "1,876.00 ريال",
    percentageChange: 15,
  },
  monthly: {
    totalShipments: {
      value: "77",
      change: "+12%",
      positive: true,
    },
    deliveryTime: {
      value: "1.8",
      change: "-0.3 يوم",
      positive: true,
    },
    customerSatisfaction: {
      value: "96%",
      change: "+2%",
      positive: true,
    },
    deliveryLocations: {
      value: "12 موقع",
      change: "+3",
      positive: true,
    },
    growthRate: {
      value: "15%",
      change: "+3%",
      positive: true,
    },
  },
};

// بيانات وهمية للشحنات الأخيرة
const recentShipments = [
  {
    id: 1003,
    from: "الرياض",
    to: "جدة",
    status: "processing",
    date: "2023/04/25",
    time: "10:30 ص",
    priority: "عادي",
    trackingNumber: "SHP1003456",
    estimatedDelivery: "2023/04/27",
    customer: "شركة الأفق للتجارة",
    items: 3,
    weight: "5.2 كجم",
    cost: "45.00 ريال",
  },
  {
    id: 1002,
    from: "الرياض",
    to: "الدمام",
    status: "transit",
    date: "2023/04/24",
    time: "09:15 ص",
    priority: "سريع",
    trackingNumber: "SHP1002456",
    estimatedDelivery: "2023/04/26",
    customer: "مؤسسة النور",
    items: 1,
    weight: "2.7 كجم",
    cost: "35.50 ريال",
  },
  {
    id: 1001,
    from: "الرياض",
    to: "مكة",
    status: "delivered",
    date: "2023/04/23",
    time: "14:45 م",
    priority: "فائق السرعة",
    trackingNumber: "SHP1001456",
    estimatedDelivery: "2023/04/25",
    customer: "محمد أحمد",
    items: 2,
    weight: "1.5 كجم",
    cost: "60.00 ريال",
  },
  {
    id: 1000,
    from: "الرياض",
    to: "المدينة المنورة",
    status: "delivered",
    date: "2023/04/10",
    time: "11:20 ص",
    priority: "عادي",
    trackingNumber: "SHP1000456",
    estimatedDelivery: "2023/04/12",
    customer: "خالد العلي",
    items: 1,
    weight: "0.8 كجم",
    cost: "28.50 ريال",
  },
  {
    id: 999,
    from: "الرياض",
    to: "الطائف",
    status: "delivered",
    date: "2023/03/29",
    time: "16:45 م",
    priority: "عادي",
    trackingNumber: "SHP0999456",
    estimatedDelivery: "2023/03/31",
    customer: "سارة محمد",
    items: 2,
    weight: "1.2 كجم",
    cost: "32.75 ريال",
  },
];

export function HomeContent({ theme = "light" }: { theme?: "light" | "dark" }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("weekly");
  const [userData, setUserData] = useState({
    name: "أحمد محمد",
    lastLogin: "اليوم، 09:45 ص",
    notifications: 3,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filteredShipments, setFilteredShipments] = useState(
    recentShipments.slice(0, 3)
  );
  const { data: walletData, isLoading: walletLoading } = useGetMyWalletQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();
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
  const { data: myShipmentsData, isLoading: myShipmentsLoading } =
    useGetMyShipmentsQuery({ page: 1, itemsPerPage: 2 });
  const lastTwoShipments = myShipmentsData?.data?.slice(-2) ?? [];
  const { data: homeStats, isLoading: statsLoading } =
    useGetHomePageStatisticsQuery();
  const { data: shipmentStats, isLoading: shipmentStatsLoading } =
    useGetShipmentStatsQuery();
  const { data: shipmentCompanyInfo, isLoading: shipmentCompanyInfoLoading } =
    useGetShipmentCompanyInfoQuery();
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetMyTransactionsQuery();
  const lastTransaction =
    transactionsData?.data && transactionsData.data.length > 0
      ? transactionsData.data[transactionsData.data.length - 1]
      : null;

  const pendingOrdersCount =
    ordersData?.data?.filter((order) => order.status?.name === "pending")
      .length ?? 0;

  // محاكاة تحميل البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // عند التحميل الأولي، عرض أحدث 3 شحنات
      setFilteredShipments(recentShipments.slice(0, 3));
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <V7Content>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="v7-loading-spinner mb-4"></div>
          <p className="text-[#3498db] text-lg">جاري تحميل لوحة التحكم...</p>
        </div>
      </V7Content>
    );
  }

  return (
    <V7Content>
      <V7WelcomeBanner theme={theme} />

      <div
        className=" grid gap-6 md:grid-cols-2 lg:grid-cols-3 v7-fade-in"
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
              ) : walletData?.wallet.balance !== undefined ? (
                <span className="flex items-center justify-end gap-1">
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
              // type: "ريال",
            },
            {
              label: "آخر معاملة",
              value: transactionsLoading
                ? "..."
                : lastTransaction?.createdAt
                ? new Date(lastTransaction.createdAt).toLocaleDateString()
                : "-",
              type: "ساعات",
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
              value: ordersLoading ? "..." : todayOrders.length.toString(),
              type: "طلب",
            },
            {
              label: "جميع الطلبات",
              value: ordersLoading
                ? "..."
                : ordersData?.data.length?.toString() ?? "-",
              type: "طلب",
            },
            {
              label: "الطلبات المعلقة",
              value: ordersLoading ? "..." : pendingOrdersCount.toString(),
              type: "طلب",
              // progress: 85,
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
              type: "شحنه",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-1">
                  <span>
                    {typeof shipmentStats?.pendingShipments === "number"
  ? shipmentStats.pendingShipments.toLocaleString()
  : typeof shipmentStats?.pendingShipments === "string"
    ? shipmentStats.pendingShipments
    : "-"}
                  </span>
                  <span>شحنة</span>
                  {/* <MdOutlinePendingActions className='w-6 h-6 text-yellow-500' /> */}
                </span>
              ),
            },
            {
              label: "شحنات تم تسليمها",
              type: "شحنه",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-1">
                  <span>
                    {shipmentStats?.deliveredShipments?.toLocaleString() ?? "-"}
                  </span>
                  <span>شحنة</span>

                  {/* <RiFolderReceivedFill className='w-6 h-6 text-green-600' /> */}
                </span>
              ),
            },
            {
              label: "شحنات في الطريق",
              type: "شحنه",
              value: shipmentStatsLoading ? (
                "..."
              ) : (
                <span className="flex items-center justify-end gap-1">
                  <span>
                    {shipmentStats?.inTransitShipments?.toLocaleString() ?? "-"}
                  </span>
                  <span>شحنة</span>

                  {/* <FaRoadCircleExclamation className='w-6 h-6 text-blue-600' /> */}
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
              ) : shipmentCompanyInfo && Array.isArray(shipmentCompanyInfo) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Show each company only once */}
                  {Array.from(
                    new Map(
                      shipmentCompanyInfo.map((company) => [
                        company.name?.toLowerCase(),
                        company,
                      ])
                    ).values()
                  ).map((company, idx) => {
                    // Map company name to logo file
                    const name = company.name?.toLowerCase() || "";
                    let imgSrc = "/placeholder-logo.png";
                    if (name.includes("aramex")) imgSrc = "/araMex.jpg";
                    else if (name.includes("smsa")) imgSrc = "/smsa_b2c.jpg";
                    else if (name.includes("imile"))
                      imgSrc = "/carriers/imile-logo.png";
                    else if (name.includes("fedex"))
                      imgSrc = "/carriers/fedex-logo.png";
                    else if (name.includes("dhl"))
                      imgSrc = "/carriers/dhl-logo.png";
                    else if (name.includes("ups"))
                      imgSrc = "/carriers/ups-logo.png";
                    else if (name.includes("redbox")) imgSrc = "/redBox.jpg";
                    else if (name.includes("omniclama"))
                      imgSrc = "/omniclama.png";
                    // Add more mappings as needed
                    return (
                      <div
                        key={company.name + idx}
                        className="shadow-md rounded-lg p-4 flex flex-col items-center bg-white/30"
                      >
                        <img
                          src={imgSrc}
                          alt={company.name}
                          className="h-12 mb-2 object-contain"
                        />
                        <div className="font-bold text-[#294D8B] text-xl">
                          {company.name}
                        </div>
                        <div className="w-full">
                          {company.shippingTypes &&
                          company.shippingTypes.length > 0 ? (
                            <ul className="text-sm w-full">
                              {company.shippingTypes.map(
                                (
                                  type: { type: string; price: number },
                                  i: number
                                ) => (
                                  <li
                                    key={type.type + i}
                                    className="flex flex-col items-center border-b last:border-b-0 text-lg"
                                  >
                                    <span>شحن</span>
                                    <span className="font-bold text-[#3498db]">
                                      {type.price} ريال
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <div className="text-gray-400 text-base">
                              لا توجد أنواع شحن متاحة
                            </div>
                          )}
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
                * الأسعار تشمل الضريبة وتختلف حسب الوزن والمسافة
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="v7-neu-card overflow-hidden border-none">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#294D8B]">
              الإحصائيات
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
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
                    : homeStats?.growthRate !== undefined
                    ? `${homeStats.growthRate}%`
                    : "-"}
                </span>
              </div>
            </div>

            <Button
              className="mt-3 w-full v7-neu-button text-lg py-3"
              onClick={() => router.push("/reports")}
            >
              <TrendingUp className="mr-2 h-5 w-5" />
              تقرير مفصل
            </Button>
          </CardContent> 
        </Card>
      </div>

      <div className="v7-fade-in" style={{ transitionDelay: "0.3s" }}>
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold text-[#3498db]">آخر الشحنات</h2>
        </div>

        <div className="grid gap-4">
          {myShipmentsLoading ? (
            <div className="text-center p-4">جاري تحميل الشحنات...</div>
          ) : lastTwoShipments.length === 0 ? (
            <div className="text-center p-4">لا توجد شحنات حديثة</div>
          ) : (
            lastTwoShipments.map((shipment) => (
              <V7ShipmentCard key={shipment._id} shipment={shipment} />
            ))
          )}
        </div>

        <div className="flex justify-center mt-6">
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
