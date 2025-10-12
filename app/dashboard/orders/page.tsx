"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import { useGetAdminStatsQuery, useGetAllOrdersQuery } from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import FilterToolbar from '@/components/ui/FilterToolbar';
import DataTable from '@/components/ui/DataTable';
import ModernPagination from '@/components/ui/ModernPagination';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

export default function OrdersManagement() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = (searchParams.get('userId') || '').trim();

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { data: ordersResponse, isLoading: listLoading, error: listError } = useGetAllOrdersQuery({
    page,
    limit: 10,
    status: statusFilter,
    search,
    userId,
  });


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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center">
                ← العودة للداشبورد
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي الطلبات"
            value={stats?.data?.orders?.total || 0}
            icon={Package}
            gradientFrom="from-violet-500"
            gradientTo="to-purple-600"
            trend={{ value: 14, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="قيد المراجعة"
            value={stats?.data?.orders?.pending || 0}
            icon={Clock}
            gradientFrom="from-amber-500"
            gradientTo="to-orange-600"
            trend={{ value: 3, isPositive: false }}
            loading={isLoading}
          />
          <StatsCard
            title="موافق عليها"
            value={stats?.data?.orders?.approved || 0}
            icon={CheckCircle}
            gradientFrom="from-emerald-500"
            gradientTo="to-teal-600"
            trend={{ value: 22, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="مرفوضة"
            value={stats?.data?.orders?.rejected || 0}
            icon={XCircle}
            gradientFrom="from-red-500"
            gradientTo="to-pink-600"
            trend={{ value: 8, isPositive: false }}
            loading={isLoading}
          />
        </div>

        {/* Orders Table */}
        <div className="space-y-6">
          <FilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="بحث برقم الطلب..."
            filters={[
              {
                value: statusFilter,
                onChange: (value) => { setStatusFilter(value); setPage(1); },
                options: [
                  { value: 'pending', label: 'قيد المراجعة' },
                  { value: 'approved', label: 'موافق عليها' },
                  { value: 'rejected', label: 'مرفوضة' },
                  { value: 'completed', label: 'مكتملة' }
                ],
                placeholder: 'كل الحالات'
              }
            ]}
          />

          <DataTable
            loading={listLoading}
            data={ordersResponse?.data || []}
            emptyMessage="لا توجد طلبات"
            columns={[
              {
                key: 'orderNumber',
                title: 'رقم الطلب',
                render: (_, row) => row.orderNumber || row._id || '-'
              },
              {
                key: 'customer',
                title: 'العميل',
                render: (_, row) => `${row.customerId?.firstName || ''} ${row.customerId?.lastName || ''}`.trim() || '-'
              },
              {
                key: 'status',
                title: 'الحالة',
                render: (_, row) => <StatusBadge status={row.status} type="order" />
              },
              {
                key: 'date',
                title: 'التاريخ',
                render: (_, row) => new Date(row.createdAt).toLocaleDateString('ar-SA')
              }
            ]}
          />
          {ordersResponse?.pagination && (
            <ModernPagination
              currentPage={ordersResponse.pagination.currentPage}
              totalPages={ordersResponse.pagination.totalPages}
              totalItems={ordersResponse.pagination.totalItems}
              itemsPerPage={ordersResponse.pagination.itemsPerPage}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
