import { ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react";

interface OrderStatsCardsProps {
  totalOrders: number;
}

export default function OrderStatsCards({ totalOrders }: OrderStatsCardsProps) {
  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 v7-fade-in">
        <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-[#6d6a67] mb-1">إجمالي الطلبات</p>
              <h3 className="text-2xl font-bold text-[#3498db]">
                {totalOrders}
              </h3>
            </div>
            <div className="v7-neu-icon-lg ml-4">
              <ShoppingBag className="h-6 w-6 text-[#3498db]" />
            </div>
          </div>
        </div>
        <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-[#6d6a67] mb-1">طلبات مكتملة</p>
              <h3 className="text-2xl font-bold text-[#2ecc71]">187</h3>
            </div>
            <div className="v7-neu-icon-lg ml-4">
              <CheckCircle className="h-6 w-6 text-[#2ecc71]" />
            </div>
          </div>
        </div>
        <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-[#6d6a67] mb-1">طلبات قيد التنفيذ</p>
              <h3 className="text-2xl font-bold text-[#294D8B]">42</h3>
            </div>
            <div className="v7-neu-icon-lg ml-4">
              <Clock className="h-6 w-6 text-[#294D8B]" />
            </div>
          </div>
        </div>
        <div className="v7-neu-card p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-[#6d6a67] mb-1">طلبات ملغاة</p>
              <h3 className="text-2xl font-bold text-[#e74c3c]">19</h3>
            </div>
            <div className="v7-neu-icon-lg ml-4">
              <XCircle className="h-6 w-6 text-[#e74c3c]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
