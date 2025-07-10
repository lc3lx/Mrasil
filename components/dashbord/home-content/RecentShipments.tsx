import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { V7ShipmentCard } from "@/components/v7/v7-shipment-card";
import { useRouter } from "next/navigation";

interface RecentShipmentsProps {
  myShipmentsLoading: boolean;
  lastTwoShipments: any[];
}

export default function RecentShipments({
  myShipmentsLoading,
  lastTwoShipments,
}: RecentShipmentsProps) {
  const router = useRouter();
  return (
    <div className="v7-fade-in" style={{ transitionDelay: "0.3s" }}>
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-bold text-[#3498db]">آخر الشحنات</h2>
      </div>
      <div className="grid gap-4">
        {myShipmentsLoading ? (
          <div className="text-center p-4">جاري تحميل الشحنات...</div>
        ) : lastTwoShipments.length === 0 ? (
          <div className="text-center p-4">لا توجد شحنات حديثة</div>
        ) : (
          lastTwoShipments.map((shipment) => (
            <div className="w-full">
              <V7ShipmentCard key={shipment._id} shipment={shipment} />
            </div>
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
  );
}
