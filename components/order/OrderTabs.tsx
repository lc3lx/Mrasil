import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderTabsProps {
  search: string;
  setSearch: (v: string) => void;
  filteredOrders: any[];
  selectedOrder: string | null;
  handleSelectOrder: (id: string) => void;
  handleDeleteClick: (id: string) => void;
}

export default function OrderTabs({
  search,
  setSearch,
  filteredOrders,
  selectedOrder,
  handleSelectOrder,
  handleDeleteClick,
}: OrderTabsProps) {
  return (
    <div className="v7-neu-card overflow-hidden v7-fade-in">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b">
          <TabsList className="v7-neu-tabs">
            <TabsTrigger value="all" className="v7-neu-tab">
              جميع الطلبات
            </TabsTrigger>
            <TabsTrigger value="active" className="v7-neu-tab">
              قيد التنفيذ
            </TabsTrigger>
            <TabsTrigger value="completed" className="v7-neu-tab">
              مكتملة
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="v7-neu-tab">
              ملغاة
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative v7-neu-input-container flex-1 min-w-[200px]">
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a67]" />
              <Input
                placeholder="البحث عن بريد إلكتروني أو رقم جوال..."
                className="v7-neu-input w-full pr-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="v7-neu-button-sm hover:bg-[#e4e9f2] transition-colors duration-200"
                >
                  <Filter className="h-4 w-4 md:mr-2" />
                  <span className="sr-only md:not-sr-only">تصفية</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="v7-neu-dropdown min-w-[180px] border border-[#E4E9F2] shadow-lg bg-white rounded-lg"
              >
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  جميع الحالات
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  مكتملة
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  قيد التنفيذ
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  ملغاة
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="v7-neu-button-sm hover:bg-[#e4e9f2] transition-colors duration-200"
                >
                  <ArrowUpDown className="h-4 w-4 md:mr-2" />
                  <span className="sr-only md:not-sr-only">ترتيب</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="v7-neu-dropdown min-w-[180px] border border-[#E4E9F2] shadow-lg bg-white rounded-lg"
              >
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  الأحدث أولاً
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  الأقدم أولاً
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm p-2 hover:bg-[#e4e9f2] cursor-pointer transition-colors duration-200">
                  حسب السعر
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="all" className="mt-0">
          <div className="overflow-x-auto whitespace-nowrap">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="v7-neu-table-header">
                  <th className="p-2 sticky left-0 bg-[#f8fafc] z-10 text-center">
                    اختيار
                  </th>
                  <th className="p-2 px-4 whitespace-nowrap">رقم الطلب</th>
                  <th className="p-2 px-4 whitespace-nowrap">العميل</th>
                  <th className="p-2 px-4 whitespace-nowrap">المدينة/الدولة</th>
                  <th className="p-2 px-4 whitespace-nowrap">رقم الهاتف</th>
                  <th className="p-2 px-4 whitespace-nowrap">
                    البريد الإلكتروني
                  </th>
                  <th className="p-2 px-4 whitespace-nowrap">العنوان</th>
                  <th className="p-2 px-4 whitespace-nowrap">طريقة الدفع</th>
                  <th className="p-2 px-4 whitespace-nowrap">التاريخ</th>
                  <th className="p-2 px-4 whitespace-nowrap">حالة الطلب</th>
                  <th className="p-2 px-4 whitespace-nowrap">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className={`v7-neu-table-row cursor-pointer ${
                      selectedOrder === order._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelectOrder(order._id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleSelectOrder(order._id);
                    }}
                  >
                    <td
                      className="p-2 sticky left-0 bg-white z-10 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="radio"
                        name="selectedOrder"
                        checked={selectedOrder === order._id}
                        onChange={() => handleSelectOrder(order._id)}
                        aria-label={`تحديد الطلب ${order._id}`}
                        className="accent-[#294D8B] w-4 h-4 rounded-full border-2 border-[#294D8B] focus:ring-2 focus:ring-[#294D8B]"
                      />
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">{order._id}</td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      {order.clientAddress?.clientName || "-"}
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">{`${
                      order.clientAddress?.city || "-"
                    }، ${order.clientAddress?.country || "-"}`}</td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      {order.clientAddress?.clientPhone || "-"}
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      {order.clientAddress?.clientEmail || "-"}
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      {order.clientAddress?.clientAddress || "-"}
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      {order.payment_method}
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-[#6d6a67] flex-shrink-0" />
                        <span>{order.createdAt}</span>
                      </div>
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      {order.status?.name || "pending"}
                    </td>
                    <td className="p-2 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="v7-neu-button-sm bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 text-xs"
                          disabled={
                            order.status?.name === "completed" ||
                            order.status?.name === "cancelled"
                          }
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              localStorage.setItem(
                                "shipmentPrefill",
                                JSON.stringify(order)
                              );
                            }
                            location.href = "/create-shipment";
                          }}
                        >
                          <Send className="h-3 w-3 ml-1" />
                          اشحن الآن
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="v7-neu-button-sm bg-rose-50 text-red-600 border-rose-200 hover:bg-rose-100 text-xs"
                          disabled={
                            order.status?.name === "completed" ||
                            order.status?.name === "cancelled"
                          }
                          onClick={() => handleDeleteClick(order._id)}
                        >
                          <X className="h-3 w-3 ml-1 text-red-600" />
                          إلغاء
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="text-sm text-[#6d6a67]">
              عرض <span className="font-medium">1</span> إلى{" "}
              <span className="font-medium">10</span> من أصل{" "}
              <span className="font-medium">248</span> طلب
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="v7-neu-button-active"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="v7-neu-button-flat hover:bg-[#e4e9f2] transition-colors duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-0 p-6 text-center">
          <div className="v7-neu-icon-xl mx-auto mb-4">
            <Clock className="h-8 w-8 text-[#f39c12]" />
          </div>
          <h3 className="text-lg font-bold mb-2">الطلبات قيد التنفيذ</h3>
          <p className="text-[#6d6a67] mb-4">
            يمكنك متابعة جميع الطلبات قيد التنفيذ هنا
          </p>
          <Button className="v7-neu-button-accent">
            عرض الطلبات قيد التنفيذ
          </Button>
        </TabsContent>
        <TabsContent value="completed" className="mt-0 p-6 text-center">
          <div className="v7-neu-icon-xl mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-[#2ecc71]" />
          </div>
          <h3 className="text-lg font-bold mb-2">الطلبات المكتملة</h3>
          <p className="text-[#6d6a67] mb-4">
            يمكنك عرض سجل الطلبات المكتملة هنا
          </p>
          <Button className="v7-neu-button-accent">عرض الطلبات المكتملة</Button>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-0 p-6 text-center">
          <div className="v7-neu-icon-xl mx-auto mb-4">
            <XCircle className="h-8 w-8 text-[#e74c3c]" />
          </div>
          <h3 className="text-lg font-bold mb-2">الطلبات الملغاة</h3>
          <p className="text-[#6d6a67] mb-4">
            يمكنك عرض سجل الطلبات الملغاة هنا
          </p>
          <Button className="v7-neu-button-accent">عرض الطلبات الملغاة</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
