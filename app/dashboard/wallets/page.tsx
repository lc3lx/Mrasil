"use client";

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { 
  useGetAdminStatsQuery,
  useGetPendingBankTransfersQuery,
  useApproveBankTransferMutation
} from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { DollarSign, TrendingUp, TrendingDown, Users, Wallet } from 'lucide-react';

export default function WalletsManagement() {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});
  const { data: pendingTransfers, isLoading: transfersLoading, refetch: refetchTransfers } = useGetPendingBankTransfersQuery({});
  const [approveBankTransfer] = useApproveBankTransferMutation();

  const { showToast } = useToast();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح لك بالوصول</h1>
          <Link href="/dashboard" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block">
            العودة للداشبورد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 p-8 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <Link href="/dashboard" className="text-amber-100 hover:text-white mb-3 inline-flex items-center text-sm font-medium">
              ← العودة للداشبورد
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">إدارة المحافظ</h1>
            <p className="text-amber-100">إدارة المحافظ والمعاملات المالية</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="الرصيد الإجمالي"
            value={`${(stats?.data?.wallets?.totalBalance || 0).toLocaleString()} ريال`}
            icon={Wallet}
            gradientFrom="from-emerald-500"
            gradientTo="to-green-600"
            trend={{ value: 7, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="إجمالي المعاملات"
            value={stats?.data?.wallets?.totalTransactions || 0}
            icon={TrendingUp}
            gradientFrom="from-blue-500"
            gradientTo="to-cyan-600"
            trend={{ value: 23, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="إجمالي الإيداعات"
            value={`${(stats?.data?.wallets?.totalDeposits || 0).toLocaleString()} ريال`}
            icon={DollarSign}
            gradientFrom="from-orange-500"
            gradientTo="to-red-600"
            trend={{ value: 11, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="المحافظ النشطة"
            value={stats?.data?.wallets?.activeWallets || 0}
            icon={Users}
            gradientFrom="from-purple-500"
            gradientTo="to-indigo-600"
            trend={{ value: 4, isPositive: false }}
            loading={isLoading}
          />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">المعاملات الأخيرة</h3>
          <div className="text-center py-12">
            <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد معاملات حالياً</p>
            <p className="text-gray-400 text-sm mt-2">ستظهر المعاملات هنا عند توفرها</p>
          </div>
        </div>

        {/* Pending Bank Transfers */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200/60 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">طلبات التحويل البنكي المعلقة</h3>
          <DataTable
            loading={transfersLoading}
            data={pendingTransfers?.data || []}
            emptyMessage="لا توجد طلبات تحويل معلقة"
            columns={[
              {
                key: 'customer',
                title: 'العميل',
                render: (_, row) => (
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {row.customerId?.firstName} {row.customerId?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {row.customerId?.email} · {row.customerId?.phone}
                    </div>
                  </div>
                )
              },
              {
                key: 'amount',
                title: 'المبلغ',
                render: (_, row) => `${row.amount?.toLocaleString() || 0} ريال`
              },
              {
                key: 'date',
                title: 'التاريخ',
                render: (_, row) => new Date(row.createdAt).toLocaleDateString('ar-SA')
              },
              {
                key: 'actions',
                title: 'إجراءات',
                render: (_, row) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await approveBankTransfer({ transactionId: row._id, approved: true }).unwrap();
                          refetchTransfers();
                          showToast('success', 'تمت الموافقة');
                        } catch {
                          showToast('error', 'فشل التنفيذ');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200 text-sm font-medium"
                    >
                      موافقة
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await approveBankTransfer({ transactionId: row._id, approved: false }).unwrap();
                          refetchTransfers();
                          showToast('success', 'تم الرفض');
                        } catch {
                          showToast('error', 'فشل التنفيذ');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
                    >
                      رفض
                    </button>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
