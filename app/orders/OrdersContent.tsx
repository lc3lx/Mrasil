"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import "moment/locale/ar-sa";
import V7Layout from "@/components/v7/v7-layout";
import { V7Content } from "@/components/v7/v7-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Search,
  Filter,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Truck,
  ShoppingBag,
  Edit,
  Plus,
  ArrowUpDown,
  CreditCard,
  Send,
  X,
  ChevronDown,
  Printer,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllOrdersQuery,
  useDeleteOrderMutation,
  useGetOrdersByStatusQuery,
  useUpdateOrderStatusMutation,
} from "../api/ordersApi";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/hooks/use-toast";
interface Order {
  _id: string;
  status: { name: string };
  payment_method: string;
  platform: string;
  number_of_boxes: number;
  weight: number;
  product_value: number;
  clientAddress: {
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    clientEmail: string;
    country: string;
    city: string;
    district: string;
  };
  Customer: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function OrdersContent() {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const { data, isLoading, refetch } = useGetAllOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const { toast } = useToast();

  // State for status change confirmation
  const [selectedStatusOrderId, setSelectedStatusOrderId] = useState<
    string | null
  >(null);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string | null>(
    null
  );
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { data: completedOrdersData, isLoading: isLoadingCompleted } =
    useGetOrdersByStatusQuery("completed");

  const { data: canceledOrdersData, isLoading: isLoadingCanceled } =
    useGetOrdersByStatusQuery("canceled");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const orders = data?.data || [];
  const totalOrders = orders.length;

  const completedOrdersCount = orders.filter(
    (order) => order.status?.name === "completed"
  ).length;

  const pendingOrdersCount = orders.filter(
    (order) => order.status?.name === "pending"
  ).length;

  const canceledOrdersCount = orders.filter(
    (order) => order.status?.name === "canceled"
  ).length;

  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    const email = order.clientAddress?.clientEmail?.toLowerCase() || "";
    const phone = order.clientAddress?.clientPhone?.toLowerCase() || "";
    const searchValue = search.toLowerCase();
    return email.includes(searchValue) || phone.includes(searchValue);
  });
  if (isLoading) {
    return (
      <V7Layout>
        <V7Content title="الطلبات" description="إدارة ومتابعة جميع طلباتك">
          <div className="w-full h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الطلبات...</p>
            </div>
          </div>
        </V7Content>
      </V7Layout>
    );
  }
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "process":
        alert(`تمت معالجة ${selectedOrder ? 1 : 0} طلب`);
        break;
      case "ship":
        alert(`تم شحن ${selectedOrder ? 1 : 0} طلب`);
        break;
      case "print":
        alert(`تم طباعة فواتير ${selectedOrder ? 1 : 0} طلب`);
        break;
      case "export":
        alert(`تم تصدير بيانات ${selectedOrder ? 1 : 0} طلب`);
        break;
      case "cancel":
        alert(`تم إلغاء ${selectedOrder ? 1 : 0} طلب`);
        break;
      default:
        break;
    }
  };
  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      setIsDeleting(true);
      try {
        await deleteOrder(orderToDelete).unwrap();
        setDeleteModalOpen(false);
        setOrderToDelete(null);
        toast({
          title: "تم حذف الطلب بنجاح",
        });
        refetch();
      } catch (error) {
        toast({
          title: "حدث خطأ أثناء حذف الطلب",
        });
        console.error("Error deleting order:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  return (
    <V7Layout>
      <V7Content title="الطلبات" description="إدارة ومتابعة جميع طلباتك">
        <div className="w-full px-4 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 v7-fade-in">
            <div className="v7-neu-card p-2 flex flex-col justify-center min-h-[60px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base font-medium text-gry mb-1">
                    إجمالي الطلبات
                  </p>
                  <h3 className="text-3xl font-extrabold text-[#3498db] mt-1">
                    {totalOrders}
                  </h3>
                </div>
                <div className="v7-neu-icon-lg ml-2">
                  <ShoppingBag className="h-8 w-8 text-[#3498db]" />
                </div>
              </div>
            </div>
            <div className="v7-neu-card p-2 flex flex-col justify-center min-h-[60px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base font-medium text-gry mb-1">
                    طلبات مكتملة
                  </p>
                  <h3 className="text-3xl font-extrabold text-[#2ecc71] mt-1">
                    {isLoading ? "..." : completedOrdersCount}
                  </h3>
                </div>
                <div className="v7-neu-icon-lg ml-2">
                  <CheckCircle className="h-8 w-8 text-[#2ecc71]" />
                </div>
              </div>
            </div>
            <div className="v7-neu-card p-2 flex flex-col justify-center min-h-[60px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base font-medium text-gry mb-1">
                    طلبات قيد التنفيذ
                  </p>
                  <h3 className="text-3xl font-extrabold text-[#294D8B] mt-1">
                    {isLoading ? "..." : pendingOrdersCount}
                  </h3>
                </div>
                <div className="v7-neu-icon-lg ml-2">
                  <Clock className="h-8 w-8 text-[#294D8B]" />
                </div>
              </div>
            </div>
            <div className="v7-neu-card p-2 flex flex-col justify-center min-h-[60px] transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-base font-medium text-gry mb-1">
                    طلبات ملغاة
                  </p>
                  <h3 className="text-3xl font-extrabold text-[#e74c3c] mt-1">
                    {isLoading ? "..." : canceledOrdersCount}
                  </h3>
                </div>
                <div className="v7-neu-icon-lg ml-2">
                  <XCircle className="h-8 w-8 text-[#e74c3c]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="v7-neu-card overflow-hidden v7-fade-in " dir="rtl">
          <Tabs defaultValue="all" className="w-full">
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 "
              dir="rtl"
            >
              <TabsList className="v7-neu-tabs">
                <TabsTrigger
                  value="all"
                  className="v7-neu-tab text-lg text-gry"
                >
                  جميع الطلبات
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="v7-neu-tab text-lg text-gry"
                >
                  قيد التنفيذ
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="v7-neu-tab text-lg text-gry"
                >
                  مكتملة
                </TabsTrigger>
                <TabsTrigger
                  value="cancelled"
                  className="v7-neu-tab text-lg text-gry"
                >
                  ملغاة
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2 dirc" dir="rtl">
                <div className="relative v7-neu-input-container flex-1 min-w-[240px]">
                  <Search className="absolute right-4 top-1/2 h-8 w-4 -translate-y-1/2 text-gry" />
                  <Input
                    dir="rtl"
                    placeholder=" البحث عن بريد إلكتروني أو رقم جوال ...  "
                    className="v7-neu-input w-full  text-gry  text-base "
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
                      <span className="sr-only md:not-sr-only text-lg">
                        تصفية
                      </span>
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
                      <span className="sr-only md:not-sr-only text-lg">
                        ترتيب
                      </span>
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
            <TabsContent value="all" className="mt-2  " dir="rtl">
              <div className="overflow-x-auto whitespace-nowrap ">
                <table className="w-full text-sm  ">
                  <thead className=" ">
                    <tr className="v7-neu-table-header text-base ">
                      {" "}
                      {/* Increased font size */}
                      <th className="p-2 sticky left-0  z-10 text-center">
                        اختيار
                      </th>
                      <th className="p-2 px-4 whitespace-nowrap">رقم الطلب</th>
                      <th className="p-2 px-4 whitespace-nowrap">العميل</th>
                      <th className="p-2 px-4 whitespace-nowrap">
                        المدينة/الدولة
                      </th>
                      <th className="p-2 px-4 whitespace-nowrap">رقم الهاتف</th>
                      <th className="p-2 px-4 whitespace-nowrap">
                        البريد الإلكتروني
                      </th>
                      {/* <th className="p-2 px-4 whitespace-nowrap">العنوان</th> */}
                      <th className="p-2 px-4 whitespace-nowrap">المنصة</th>{" "}
                      {/* New column */}
                      {/* <th className="p-2 px-4 whitespace-nowrap">عدد الصناديق</th> New column */}
                      <th className="p-2 px-4 whitespace-nowrap">
                        الوزن (كجم)
                      </th>{" "}
                      {/* New column */}
                      <th className="p-2 px-4 whitespace-nowrap">
                        طريقة الدفع
                      </th>
                      <th className="p-2 px-4 whitespace-nowrap">التاريخ</th>
                      {/* <th className="p-2 px-4 whitespace-nowrap">حالة الطلب</th> */}
                      <th className="p-2 px-4 whitespace-nowrap">
                        تحديث الحالة
                      </th>
                      <th className="p-2 px-4 whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className={`v7-neu-table-row cursor-pointer text-base border-none ${
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
                          className="p-2 sticky left-0  z-10 text-center border-none"
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
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order._id}
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order.clientAddress?.clientName || "-"}
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">{`${
                          order.clientAddress?.city || "-"
                        }، ${order.clientAddress?.country || "-"}`}</td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order.clientAddress?.clientPhone || "-"}
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order.clientAddress?.clientEmail || "-"}
                        </td>
                        {/* <td className="p-2 px-4 whitespace-nowrap">{order.clientAddress?.clientAddress || '-'}</td> */}
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order.platform || "-"}
                        </td>{" "}
                        {/* New cell */}
                        {/* <td className="p-2 px-4 whitespace-nowrap">{order.number_of_boxes ?? '-'}</td> New cell */}
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order.weight ?? "-"}
                        </td>{" "}
                        {/* New cell */}
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          {order.payment_method === "Prepaid"
                            ? "دفع مسبق"
                            : "دفع عند الأستلام"}
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gry flex-shrink-0" />
                            <span>
                              {moment(order.createdAt)
                                .locale("en-sa")
                                .format("DD/MM/YYYY")}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">
                          <OrderStatusBadge status={order.status?.name} />
                        </td>
                        <td className="p-2 px-4 whitespace-nowrap border-none">
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
                                    router.push("/create-shipment?step=3");
                                // router.push("/create-shipment");
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-16 ">
                <div className="text-sm text-gry">
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
              <p className="text-gry mb-4">
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
              <p className="text-gry mb-4">
                يمكنك عرض سجل الطلبات المكتملة هنا
              </p>
              <Button className="v7-neu-button-accent">
                عرض الطلبات المكتملة
              </Button>
            </TabsContent>

            <TabsContent value="cancelled" className="mt-0 p-6 text-center">
              <div className="v7-neu-icon-xl mx-auto mb-4">
                <XCircle className="h-8 w-8 text-[#e74c3c]" />
              </div>
              <h3 className="text-lg font-bold mb-2">الطلبات الملغاة</h3>
              <p className="text-gry mb-4">يمكنك عرض سجل الطلبات الملغاة هنا</p>
              <Button className="v7-neu-button-accent">
                عرض الطلبات الملغاة
              </Button>
            </TabsContent>
          </Tabs>
        </div>
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setOrderToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="تأكيد الحذف"
          description="هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
          confirmText={isDeleting ? "جاري الحذف..." : "حذف"}
        />
        <ConfirmModal
          isOpen={statusModalOpen}
          onClose={() => {
            setStatusModalOpen(false);
            setSelectedStatusOrderId(null);
            setSelectedStatusValue(null);
          }}
          onConfirm={async () => {
            if (selectedStatusOrderId && selectedStatusValue) {
              let status = "pending";
              if (selectedStatusValue === "completed") status = "completed";
              else if (selectedStatusValue === "cancelled") status = "canceled";
              else if (selectedStatusValue === "pending") status = "pending";
              try {
                await updateOrderStatus({
                  id: selectedStatusOrderId,
                  status,
                }).unwrap();
                toast({
                  title: "تم تحديث حالة الطلب بنجاح",
                  variant: "destructive",
                });
                refetch();
              } catch (err) {
                toast({
                  title: "حدث خطأ أثناء تحديث الحالة",
                  variant: "destructive",
                });
              }
            }
            setStatusModalOpen(false);
            setSelectedStatusOrderId(null);
            setSelectedStatusValue(null);
          }}
          title="تأكيد تحديث الحالة"
          description="هل تريد تغيير حالة الطلب؟"
          confirmText="تحديث"
        />
      </V7Content>
    </V7Layout>
  );
}

function OrderStatusBadge({ status }: { status?: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge className="v7-neu-badge-success bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 ml-1" />
          مكتمل
        </Badge>
      );
    case "processing":
      return (
        <Badge className="v7-neu-badge-warning bg-sky-50 text-sky-700 border border-sky-200">
          <Clock className="h-3 w-3 ml-1" />
          قيد التنفيذ
        </Badge>
      );
    case "canceled":
    case "cancelled":
      return (
        <Badge className="v7-neu-badge-error bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3 ml-1" />
          ملغى
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge className="v7-neu-badge-info bg-indigo-50 text-indigo-700 border border-indigo-200">
          <AlertCircle className="h-3 w-3 ml-1" />
          معلق
        </Badge>
      );
  }
}
function ShippingStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "delivered":
      return (
        <Badge className="v7-neu-badge-success bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="h-3 w-3 ml-1" />
          تم التوصيل
        </Badge>
      );
    case "shipped":
      return (
        <Badge className="v7-neu-badge-info bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Truck className="h-3 w-3 ml-1" />
          تم الشحن
        </Badge>
      );
    case "preparing":
      return (
        <Badge className="v7-neu-badge-warning bg-sky-50 text-sky-700 border border-sky-200">
          <Package className="h-3 w-3 ml-1" />
          قيد التجهيز
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="v7-neu-badge-error bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="h-3 w-3 ml-1" />
          ملغي
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-700 border border-slate-200">
          {status}
        </Badge>
      );
  }
}
