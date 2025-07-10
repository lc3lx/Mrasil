import { V7StatsCard } from "@/components/v7/v7-stats-card";
import { Wallet, ShoppingBag, CreditCard } from "lucide-react";

interface StatsCardsProps {
  theme?: "light" | "dark";
  walletLoading: boolean;
  walletData: any;
  ordersLoading: boolean;
  todayOrders: any[];
  ordersData: any;
  shipmentStatsLoading: boolean;
  shipmentStats: any;
  setOpenRecharge: (open: boolean) => void;
}

export default function StatsCards({
  theme = "light",
  walletLoading,
  walletData,
  ordersLoading,
  todayOrders,
  ordersData,
  shipmentStatsLoading,
  shipmentStats,
  setOpenRecharge,
}: StatsCardsProps) {
  return (
    <>
      <V7StatsCard
        title="الرصيد الحالي"
        icon={Wallet}
        color="primary"
        theme={theme}
        stats={[
          {
            label: "الرصيد المتاح",
            value: walletLoading
              ? "..."
              : walletData?.wallet.balance !== undefined
              ? walletData.wallet.balance.toString()
              : "-",
          },
          {
            label: "تاريخ الإنشاء",
            value: walletLoading
              ? "..."
              : walletData?.wallet.createdAt
              ? new Date(walletData.wallet.createdAt).toLocaleDateString()
              : "-",
          },
        ]}
        action={{
          label: "شحن المحفظة الآن",
          onClick: () => setOpenRecharge(true),
        }}
      />

      <V7StatsCard
        title="الطلبات"
        icon={ShoppingBag}
        color="secondary"
        theme={theme}
        stats={[
          {
            label: "طلبات اليوم",
            value: ordersLoading ? "..." : todayOrders.length.toString(),
          },
          {
            label: "جميع الطلبات",
            value: ordersLoading
              ? "..."
              : ordersData?.data.length?.toString() ?? "-",
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
            value: shipmentStatsLoading
              ? "..."
              : (shipmentStats?.totalValue?.toLocaleString() ?? "-") + " ريال",
          },
          {
            label: "مجموع تكاليف الشحن",
            value: shipmentStatsLoading
              ? "..."
              : (shipmentStats?.totalShippingCost?.toLocaleString() ?? "-") +
                " ريال",
          },
          {
            label: "شحنات قيد الانتظار",
            value: shipmentStatsLoading
              ? "..."
              : shipmentStats?.pendingShipments?.toLocaleString() ?? "-",
          },
          {
            label: "شحنات تم تسليمها",
            value: shipmentStatsLoading
              ? "..."
              : shipmentStats?.deliveredShipments?.toLocaleString() ?? "-",
          },
          {
            label: "شحنات في الطريق",
            value: shipmentStatsLoading
              ? "..."
              : shipmentStats?.inTransitShipments?.toLocaleString() ?? "-",
          },
        ]}
      />
    </>
  );
}
