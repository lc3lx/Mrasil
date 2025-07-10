import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { V7Content } from "@/components/v7/v7-content";
import { useGetMyWalletQuery } from "@/app/api/walletApi";
import { useGetAllOrdersQuery } from "@/app/api/ordersApi";
import { useGetMyShipmentsQuery } from "@/app/api/shipmentApi";
import {
  useGetHomePageStatisticsQuery,
  useGetShipmentStatsQuery,
} from "@/app/api/homePageApi";
import { useGetShipmentCompanyInfoQuery } from "@/app/api/shipmentCompanyApi";
import WelcomeBanner from "./WelcomeBanner";
import StatsCards from "./StatsCards";
import ShippingPrices from "./ShippingPrices";
import SideStatsCard from "./SideStatsCard";
import RecentShipments from "./RecentShipments";
import RechargeWalletDialogWrapper from "./RechargeWalletDialogWrapper";

function HomeContent({ theme = "light" }: { theme?: "light" | "dark" }) {
  const [isLoading, setIsLoading] = useState(true);
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

  const [openRecharge, setOpenRecharge] = useState(false);

  // محاكاة تحميل البيانات
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
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
      <WelcomeBanner theme={theme} />
      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 v7-fade-in"
        style={{ transitionDelay: "0.1s" }}
      >
        <StatsCards
          theme={theme}
          walletLoading={walletLoading}
          walletData={walletData}
          ordersLoading={ordersLoading}
          todayOrders={todayOrders}
          ordersData={ordersData}
          shipmentStatsLoading={shipmentStatsLoading}
          shipmentStats={shipmentStats}
          setOpenRecharge={setOpenRecharge}
        />
      </div>
      <div
        className="grid gap-6 lg:grid-cols-3 v7-fade-in"
        style={{ transitionDelay: "0.2s" }}
      >
        <div className="lg:col-span-2">
          <ShippingPrices
            shipmentCompanyInfo={shipmentCompanyInfo}
            shipmentCompanyInfoLoading={shipmentCompanyInfoLoading}
          />
        </div>
        <SideStatsCard homeStats={homeStats} statsLoading={statsLoading} />
      </div>
      <RecentShipments
        myShipmentsLoading={myShipmentsLoading}
        lastTwoShipments={lastTwoShipments}
      />
      <RechargeWalletDialogWrapper
        open={openRecharge}
        onClose={() => setOpenRecharge(false)}
      />
    </V7Content>
  );
}

export default HomeContent;
