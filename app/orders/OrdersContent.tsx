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
  Edit,
  Plus,
  ArrowUpDown,
  Send,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetAllOrdersQuery, useDeleteOrderMutation } from "../api/ordersApi";
import { useToast } from "@/hooks/use-toast";
import OrderStatsCards from "@/components/order/OrderStatsCards";
import OrderTabs from "@/components/order/OrderTabs";
import OrderConfirmModal from "@/components/order/OrderConfirmModal";

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
  const { toast } = useToast();

  // Add state for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  // Safely extract orders from the response
  const orders = data?.data || [];
  const totalOrders = orders.length;

  // Filter orders by search (email or phone)
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

  // وظيفة تحديد طلب واحد فقط
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  // Handle delete button click
  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
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
        <OrderStatsCards totalOrders={totalOrders} />
        <div className="flex justify-end mb-6">
          <Button
            className="v7-neu-button-accent"
            onClick={() => router.push("/orders/create")}
          >
            <Plus className="h-4 w-4 ml-2" />
            إنشاء طلب جديد
          </Button>
        </div>
        <OrderTabs
          search={search}
          setSearch={setSearch}
          filteredOrders={filteredOrders}
          selectedOrder={selectedOrder}
          handleSelectOrder={handleSelectOrder}
          handleDeleteClick={handleDeleteClick}
        />
        <OrderConfirmModal
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
      </V7Content>
    </V7Layout>
  );
}
