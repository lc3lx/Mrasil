"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import { useGetAdminStatsQuery, useGetAllShipmentsQuery, useUpdateShipmentStatusMutation } from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import FilterToolbar from '@/components/ui/FilterToolbar';
import DataTable from '@/components/ui/DataTable';
import ModernPagination from '@/components/ui/ModernPagination';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { Package, Truck, MapPin, Clock, Search, Edit } from 'lucide-react';

export default function ShipmentsManagement() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = (searchParams.get('userId') || '').trim();

  // Fetch dashboard stats
  const { data: stats, isLoading, error } = useGetAdminStatsQuery({});
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { data: shipmentsResponse, isLoading: listLoading, error: listError, refetch } = useGetAllShipmentsQuery({
    page,
    limit: 10,
    status: statusFilter,
    search,
    userId,
  });
  const [updateShipmentStatus, { isLoading: updatingStatus }] = useUpdateShipmentStatusMutation();
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mb-2 inline-flex items-center">
                ← العودة للداشبورد
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">إدارة الشحنات</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي الشحنات"
            value={stats?.data?.shipments?.total || 0}
            icon={Package}
            gradientFrom="from-blue-500"
            gradientTo="to-blue-700"
            trend={{ value: 18, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="جاهزة للاستلام"
            value={stats?.data?.shipments?.pending || 0}
            icon={Clock}
            gradientFrom="from-amber-500"
            gradientTo="to-yellow-600"
            trend={{ value: 5, isPositive: false }}
            loading={isLoading}
          />
          <StatsCard
            title="في الطريق"
            value={stats?.data?.shipments?.inTransit || 0}
            icon={Truck}
            gradientFrom="from-orange-500"
            gradientTo="to-red-600"
            trend={{ value: 12, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="تم التسليم"
            value={stats?.data?.shipments?.delivered || 0}
            icon={MapPin}
            gradientFrom="from-emerald-500"
            gradientTo="to-green-600"
            trend={{ value: 25, isPositive: true }}
            loading={isLoading}
          />
        </div>

        {/* Shipments Table */}
        <div className="space-y-6">
          <FilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="بحث برقم التتبع أو رقم الشركة..."
            filters={[
              {
                value: statusFilter,
                onChange: (value) => { setStatusFilter(value); setPage(1); },
                options: [
                  { value: 'IN_TRANSIT', label: 'في الطريق' },
                  { value: 'READY_FOR_PICKUP', label: 'جاهزة للاستلام' },
                  { value: 'Delivered', label: 'تم التسليم' },
                  { value: 'Canceled', label: 'ملغية' }
                ],
                placeholder: 'كل الحالات'
              }
            ]}
          />
          <DataTable
            loading={listLoading}
            data={shipmentsResponse?.data || []}
            emptyMessage="لا توجد شحنات"
            columns={[
              {
                key: 'trackingId',
                title: 'رقم التتبع',
                render: (_, row) => row.trackingId || row.companyshipmentid || '-'
              },
              {
                key: 'customer',
                title: 'العميل',
                render: (_, row) => `${row.customerId?.firstName || ''} ${row.customerId?.lastName || ''}`.trim() || '-'
              },
              {
                key: 'company',
                title: 'شركة الشحن',
                render: (_, row) => row.shapmentCompany || '-'
              },
              {
                key: 'status',
                title: 'الحالة',
                render: (_, row) => <StatusBadge status={row.shipmentstates} type="shipment" />
              },
              {
                key: 'value',
                title: 'قيمة الطلب',
                render: (_, row) => `${(row.ordervalue ?? row.totalprice ?? 0).toLocaleString()} ريال`
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
                  <select
                    defaultValue={row.shipmentstates}
                    disabled={updatingStatus}
                    onChange={async (e) => {
                      try {
                        await updateShipmentStatus({ shipmentId: row._id, status: e.target.value }).unwrap();
                        await refetch();
                        showToast('success', 'تم تحديث الحالة');
                      } catch (err) {
                        showToast('error', 'فشل تحديث الحالة');
                      }
                    }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="IN_TRANSIT">في الطريق</option>
                    <option value="READY_FOR_PICKUP">جاهزة للاستلام</option>
                    <option value="Delivered">تم التسليم</option>
                    <option value="Canceled" disabled={row.shipmentstates !== "READY_FOR_PICKUP"}>ملغية</option>
                  </select>
                )
              }
            ]}
          />
          {shipmentsResponse?.pagination && (
            <ModernPagination
              currentPage={shipmentsResponse.pagination.currentPage}
              totalPages={shipmentsResponse.pagination.totalPages}
              totalItems={shipmentsResponse.pagination.totalItems}
              itemsPerPage={shipmentsResponse.pagination.itemsPerPage}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
