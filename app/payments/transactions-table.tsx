"use client";

import { Search, Filter, Loader2, Eye, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyTransactionsQuery } from "@/app/api/transicationApi";
import { useUpdateTransactionStatusMutation } from "@/app/api/walletApi";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400";
    case "failed":
      return "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400";
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400";
  }
}

function getMethodIcon(method: string) {
  switch (method) {
    case "moyasar":
      return "💳";
    case "shipment_payment":
      return "📦";
    case "shipment_cancel_refund":
      return "↩️";
    case "return_shipment":
      return "🔄";
    case "return_shipment_refund":
      return "↩️";
    case "coupon_credit":
      return "🎫";
    case "admin_credit":
      return "👨‍💼";
    case "admin_debit":
      return "👨‍💼";
    case "manual_addition":
      return "➕";
    case "manual_removal":
      return "➖";
    default:
      return "💰";
  }
}

function getMethodLabel(method: string) {
  switch (method) {
    case "moyasar":
      return "شحن المحفظة";
    case "shipment_payment":
      return "دفع شحنة";
    case "shipment_cancel_refund":
      return "استرجاع إلغاء شحنة";
    case "return_shipment":
      return "شحنة إرجاع";
    case "return_shipment_refund":
      return "استرجاع شحنة إرجاع";
    case "coupon_credit":
      return "قسيمة خصم";
    case "admin_credit":
      return "إضافة من الإدارة";
    case "admin_debit":
      return "خصم من الإدارة";
    case "manual_addition":
      return "إضافة يدوية";
    case "manual_removal":
      return "خصم يدوي";
    default:
      return method;
  }
}

export function TransactionsTable() {
  const { data, isLoading, isError } = useGetMyTransactionsQuery();
  const [updateTransactionStatus] = useUpdateTransactionStatusMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalSuccess, setModalSuccess] = useState(true);
  const [loadingRows, setLoadingRows] = useState<{ [id: string]: boolean }>({});
  const [approvedRows, setApprovedRows] = useState<{ [id: string]: boolean }>(
    {}
  );
  const [expandedRows, setExpandedRows] = useState<{ [id: string]: boolean }>(
    {}
  );

  const toggleRowExpansion = (transactionId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [transactionId]: !prev[transactionId],
    }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-4">
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <Select defaultValue="all">
            <SelectTrigger
              className="w-full md:w-[180px] v7-neu-input pe-4 flex items-center justify-between bg-white dark:bg-gray-800 text-[#294D8B] dark:text-blue-400 font-medium shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-2 border-[#294D8B] dark:border-blue-500"
              dir="rtl"
            >
              <SelectValue placeholder="نوع المعاملة" />
              <Filter className="h-4 w-4 ml-2" />
            </SelectTrigger>
            <SelectContent
              className="dark:bg-gray-800  bg-[#f0f4f8] border-none "
              dir="rtl"
            >
              <SelectItem value="all" className="dark:text-gray-200">
                جميع المعاملات
              </SelectItem>
              <SelectItem value="deposit" className="dark:text-gray-200">
                إيداع
              </SelectItem>
              <SelectItem value="payment" className="dark:text-gray-200">
                دفع
              </SelectItem>
              <SelectItem value="refund" className="dark:text-gray-200">
                استرداد
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-grow md:flex-grow-0 md:w-64">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-gray-400" />
          <Input
            placeholder="بحث في المعاملات..."
            className="v7-neu-input-hollow pr-12  text-gry  dark:bg-gray-800 dark:text-gray-200"
            dir="rtl"
          />
        </div>
      </div>

      <div className="v7-neu-card rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead>
              <tr className="border-b  border-gray-200 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted v7-neu-table-row">
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  رقم المعاملة
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  التاريخ
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  النوع
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  نوع المعاملة
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  المبلغ
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  الحالة
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  المرجع
                </th>
                <th className="py-3 px-4 text-right font-bold text-muted-foreground dark:text-gray-400">
                  التفاصيل
                </th>
              </tr>
            </thead>
            <tbody className=" dark:bg-gray-800">
              {isLoading && (
                <tr>
                  <td colSpan={8} className="text-center py-6">
                    جاري التحميل...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="text-center text-red-500 py-6">
                    حدث خطأ أثناء جلب البيانات
                  </td>
                </tr>
              )}
              {data &&
                data.data &&
                data.data.length === 0 &&
                !isLoading &&
                !isError && (
                  <tr>
                    <td colSpan={8} className="text-center py-6">
                      لا توجد معاملات
                    </td>
                  </tr>
                )}
              {data &&
                data.data &&
                data.data.map((trx) => (
                  <>
                    <tr
                      key={trx._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-[#f0f4f8] dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 text-[#3498db] dark:text-blue-400 font-mono text-sm">
                        {trx._id.slice(-8)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground dark:text-gray-400">
                        {new Date(trx.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            trx.type === "credit" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {trx.type === "credit" ? "إيداع" : "سحب"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getMethodIcon(trx.method)}
                          </span>
                          <span className="text-sm text-muted-foreground dark:text-gray-400">
                            {getMethodLabel(trx.method)}
                          </span>
                        </div>
                      </td>
                      <td
                        className={
                          trx.amount > 0
                            ? "py-3 px-4 text-green-600 dark:text-green-400 font-semibold"
                            : "py-3 px-4 text-red-600 dark:text-red-400 font-semibold"
                        }
                      >
                        {trx.amount > 0 ? "+" : ""}
                        {trx.amount.toLocaleString()} ريال
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                            trx.status
                          )}`}
                        >
                          {trx.status === "completed"
                            ? "مكتمل"
                            : trx.status === "pending"
                            ? "قيد الانتظار"
                            : trx.status === "failed"
                            ? "فشل"
                            : trx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {trx.referenceId ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground dark:text-gray-400 font-mono">
                              {trx.referenceId.slice(-8)}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground dark:text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleRowExpansion(trx._id)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedRows[trx._id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                    {expandedRows[trx._id] && (
                      <tr>
                        <td colSpan={8} className="p-0">
                          <Card className="m-4 bg-gray-50 dark:bg-gray-900">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">
                                    تفاصيل المعاملة
                                  </h4>
                                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                                    {trx.description || "لا يوجد وصف"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm mb-2">
                                    معلومات إضافية
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <div>
                                      <span className="text-muted-foreground dark:text-gray-400">
                                        نوع المرجع:
                                      </span>
                                      <span className="mr-2">
                                        {trx.referenceType || "غير محدد"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground dark:text-gray-400">
                                        طريقة الدفع:
                                      </span>
                                      <span className="mr-2">{trx.method}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground dark:text-gray-400">
                                        تاريخ الإنشاء:
                                      </span>
                                      <span className="mr-2">
                                        {new Date(trx.createdAt).toLocaleString(
                                          "ar-EG"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for action result */}
      <AlertDialog open={modalOpen}>
        <AlertDialogContent className="text-center max-w-md w-full p-8 rounded-2xl shadow-2xl bg-gray-50 border border-gray-200">
          <h2
            className={`text-xl font-bold mb-4 ${
              modalSuccess ? "text-green-700" : "text-red-700"
            }`}
          >
            {modalSuccess ? "نجاح" : "خطأ"}
          </h2>
          <div className="mb-6 text-lg">{modalMsg}</div>
          <AlertDialogAction
            onClick={() => setModalOpen(false)}
            className="px-8 py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            موافق
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
