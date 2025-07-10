import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Package,
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SideStatsCardProps {
  homeStats: any;
  statsLoading: boolean;
}

export default function SideStatsCard({
  homeStats,
  statsLoading,
}: SideStatsCardProps) {
  const router = useRouter();
  return (
    <Card className="v7-neu-card overflow-hidden border-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#294D8B]">
          الإحصائيات
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="v7-neu-icon-sm">
              <Package className="h-4 w-4 text-[#294D8B]" />
            </div>
            <span className="text-sm">إجمالي الشحنات</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {statsLoading ? "..." : homeStats?.totalShipments ?? "-"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="v7-neu-icon-sm bg-blue-50">
              <Package className="h-4 w-4 text-[#3498db]" />
            </div>
            <span className="text-sm font-medium">شحنات اليوم</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {statsLoading ? "..." : homeStats?.todaysShipments ?? "-"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="v7-neu-icon-sm">
              <CheckCircle className="h-4 w-4 text-[#27ae60]" />
            </div>
            <span className="text-sm">الشحنات المستلمة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {statsLoading ? "..." : homeStats?.receivedShipments ?? "-"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="v7-neu-icon-sm">
              <XCircle className="h-4 w-4 text-[#e74c3c]" />
            </div>
            <span className="text-sm">الشحنات الملغاة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {statsLoading ? "..." : homeStats?.canceledShipments ?? "-"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="v7-neu-icon-sm">
              <BarChart3 className="h-4 w-4 text-[#3498db]" />
            </div>
            <span className="text-sm">معدل النمو</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {statsLoading
                ? "..."
                : homeStats?.growthRate !== undefined
                ? `${homeStats.growthRate}%`
                : "-"}
            </span>
          </div>
        </div>
        <Button
          className="mt-2 w-full v7-neu-button"
          onClick={() => router.push("/reports")}
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          تقرير مفصل
        </Button>
      </CardContent>
    </Card>
  );
}
