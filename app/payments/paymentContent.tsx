"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Filter, Plus, Search, Wallet, Calendar, ArrowRight, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PaymentLineChart } from "@/components/v7/charts/payment-line-chart";
import { monthlyPaymentData } from "@/lib/chart-data";
import { useRouter } from "next/navigation";
import { TransactionsTable } from "./transactions-table";
import {
  useGetMyWalletQuery,
  useGetPaymentStatusQuery,
  useGetWalletSummaryQuery,
} from "@/app/api/walletApi";
import { useGetMyTransactionsQuery } from "@/app/api/transicationApi";
import RechargeWalletDialog from "./RechargeWalletDialog";

import V7Wallet from "@/components/v7/pages/v7-wallet";

// تحديث ألوان الحالات في payments-content
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "processing":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "failed":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

function WalletBalanceCard() {
  const { data, isLoading, isError } = useGetMyWalletQuery();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <span>جاري التحميل...</span>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        حدث خطأ أثناء جلب البيانات
      </div>
    );
  }

  const { balance, createdAt } = data.wallet;
  return (
    <>
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-[#3498db] dark:text-blue-400" />
        <div className="text-2xl font-bold text-[#3498db] dark:text-blue-400">
          {balance.toLocaleString()} ريال
        </div>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        تاريخ الإنشاء: {new Date(createdAt).toLocaleDateString("ar-EG")}
      </div>
    </>
  );
}

function DepositsCard() {
  const {
    data: walletSummary,
    isLoading,
    isError,
  } = useGetWalletSummaryQuery();
  if (isLoading) return <div>جاري التحميل...</div>;
  if (isError || !walletSummary)
    return <div className="text-red-500">حدث خطأ أثناء جلب البيانات</div>;

  const totalDeposits = walletSummary.data.totalDeposits;
  return (
    <>
      <div className="text-2xl font-bold text-[#2ecc71] dark:text-green-400">
        {totalDeposits.toLocaleString()} ريال
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        إجمالي الإيداعات
      </div>
    </>
  );
}

function PaymentsCard() {
  const {
    data: walletSummary,
    isLoading,
    isError,
  } = useGetWalletSummaryQuery();
  if (isLoading) return <div>جاري التحميل...</div>;
  if (isError || !walletSummary)
    return <div className="text-red-500">حدث خطأ أثناء جلب البيانات</div>;

  const totalPayments = walletSummary.data.totalPayments;
  return (
    <>
      <div className="text-2xl font-bold text-[#e74c3c] dark:text-red-400">
        {totalPayments.toLocaleString()} ريال
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        إجمالي المدفوعات
      </div>
    </>
  );
}

export function PaymentsContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [balance, setBalance] = useState(0);
  const router = useRouter();
  const {
    data: walletSummary,
    isLoading: isWalletSummaryLoading,
    isError: isWalletSummaryError,
  } = useGetWalletSummaryQuery();

  let totalDeposits = 0;
  let totalPayments = 0;

  if (walletSummary && walletSummary.data) {
    totalDeposits = walletSummary.data.totalDeposits;
    totalPayments = walletSummary.data.totalPayments;
  }

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleWalletRecharge = () => router.push("/wallet/recharge");

  // --- Payment Status Search ---
  const [searchId, setSearchId] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const {
    data: paymentStatusData,
    isLoading: isPaymentStatusLoading,
    isError: isPaymentStatusError,
    error: paymentStatusError,
  } = useGetPaymentStatusQuery(submittedId, { skip: !submittedId });
  const [openAddSenderModal, setOpenAddSenderModal] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedId(searchId.trim());
  };
  // --- End Payment Status Search ---

  return (
    <div className="space-y-6">
      <RechargeWalletDialog open={false} onClose={() => {}} />
      <div
        className={`v7-neu-card p-6 rounded-xl v7-fade-in bg-white dark:bg-gray-900 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.2s" }}
      >
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full md:w-auto">
            <h3 className="text-xl font-bold text-[#294D8B] dark:text-blue-400">
              المحفظة
            </h3>
            <p className="text-muted-foreground dark:text-gray-400">
              إدارة المحفظة والمعاملات المالية
            </p>
          </div>
          <div className="flex flex-row flex-wrap w-full md:w-auto gap-2 justify-end items-center" dir="rtl">
            <div className="flex items-center gap-2 flex-wrap px-4 py-2 rounded-xl bg-[#f0f4f8] border border-[#E4E9F2] shadow-inner v7-neu-inset">
              <div className="flex items-center gap-1.5 text-[#294D8B]">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">التاريخ:</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-[#6d6a67] font-medium">من</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#E4E9F2] bg-white text-[#294D8B] text-sm min-w-[130px] focus:outline-none focus:ring-2 focus:ring-[#294D8B]/40 focus:border-[#294D8B] transition-shadow"
                  dir="ltr"
                  title="اختر تاريخ البداية"
                  aria-label="تاريخ من"
                />
                <ArrowRight className="h-4 w-4 text-[#6d6a67] rotate-180" />
                <label className="text-xs text-[#6d6a67] font-medium">إلى</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-[#E4E9F2] bg-white text-[#294D8B] text-sm min-w-[130px] focus:outline-none focus:ring-2 focus:ring-[#294D8B]/40 focus:border-[#294D8B] transition-shadow"
                  dir="ltr"
                  title="اختر تاريخ النهاية"
                  aria-label="تاريخ إلى"
                />
              </div>
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#6d6a67] hover:text-red-600 transition-colors"
                  title="مسح التاريخ"
                  aria-label="مسح فلتر التاريخ"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              onClick={() => setOpenAddSenderModal(true)}
              variant="outline"
              size="sm"
              className="v7-neu-button-sm gap-1 dark:bg-gray-800 dark:text-gray-200"
            >
              <Plus className="h-4 w-4" />
              <span>شحن المحفظة</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="v7-neu-button-sm gap-1 dark:bg-gray-800 dark:text-gray-200"
            >
              <Download className="h-4 w-4" />
              <span>تصدير</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="v7-neu-card dark:bg-gray-800  border-none ">
            <CardHeader className="pb-2  dark:bg-gray-800 w-full">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                الرصيد الحالي
              </CardTitle>
            </CardHeader>
            <CardContent className=" dark:bg-gray-800">
              <WalletBalanceCard />
            </CardContent>
          </Card>

          <Card className="v7-neu-card  dark:bg-gray-800 border-none">
            <CardHeader className="pb-2  dark:bg-gray-800">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                إجمالي الإيداعات
              </CardTitle>
            </CardHeader>
            <CardContent className=" dark:bg-gray-800">
              <DepositsCard />
            </CardContent>
          </Card>

          <Card className="v7-neu-card  dark:bg-gray-800 border-none">
            <CardHeader className="pb-2  dark:bg-gray-800">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                إجمالي المدفوعات
              </CardTitle>
            </CardHeader>
            <CardContent className=" dark:bg-gray-800">
              <PaymentsCard />
            </CardContent>
          </Card>
        </div>

        <Card className="v7-neu-card mb-6 dark:bg-gray-800 border-none">
          <CardHeader className="bg-[#EFF2F7] dark:bg-gray-700">
            <CardTitle className="dark:text-gray-200">
              تحليل المدفوعات
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              الإيرادات والمصروفات خلال العام الحالي
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-[#EFF2F7] dark:bg-gray-700">
            <PaymentLineChart
              totalDeposits={totalDeposits}
              totalPayments={totalPayments}
              height={350}
              walletSummary={walletSummary?.data}
            />
          </CardContent>
        </Card>

        {/* Payment Status Search Card */}

        {/* End Payment Status Search Card */}

        <div className="bg-[#F0F2F5] dark:bg-gray-800 p-3 mb-6 rounded-2xl">
          <Tabs defaultValue="transactions" className="mb-6">
            <TabsList className="flex w-full bg-transparent gap-2 p-0 justify-end">
              <TabsTrigger
                value="transactions"
                className="flex-initial py-2 px-4 text-[#3498db] dark:text-blue-400 transition-all duration-200 font-bold text-lg data-[state=active]:text-[#3498db] dark:data-[state=active]:text-blue-400"
                style={{
                  background: "transparent",
                  boxShadow: "none",
                }}
              >
                المعاملات المالية
              </TabsTrigger>
            </TabsList>
            <TabsContent value="transactions" className="mt-6">
              <TransactionsTable dateFrom={dateFrom} dateTo={dateTo} />
            </TabsContent>
          </Tabs>

          <V7Wallet
            balance={balance}
            onBalanceUpdate={(newBalance) => setBalance(newBalance)}
            isOpen={openAddSenderModal}
            onClose={() => setOpenAddSenderModal(false)}
          />
        </div>
      </div>
    </div>
  );
}
