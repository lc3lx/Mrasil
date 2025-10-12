"use client";

import { useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { 
  useGetAllUsersQuery, 
  useUpdateUserStatusMutation, 
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useAddBalanceToUserMutation 
} from '../../api/adminApi';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from '@/components/ui/StatsCard';
import StatusBadge from '@/components/ui/StatusBadge';
import FilterToolbar from '@/components/ui/FilterToolbar';
import DataTable from '@/components/ui/DataTable';
import ModernPagination from '@/components/ui/ModernPagination';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
import { Users, Shield, User, UserCheck, Search, Filter, MoreVertical, Mail, Phone, Calendar, Ban, Check, Trash2, Wallet, Eye } from 'lucide-react';

export default function UsersManagement() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Fetch users data
  const { data: usersResponse, isLoading, error, refetch } = useGetAllUsersQuery({
    page,
    limit: 10,
    search,
    status: statusFilter,
    role: roleFilter
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addBalance] = useAddBalanceToUserMutation();
  const { showToast } = useToast();

  // Modal states
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      refetch();
      showToast('success', 'تم تحديث حالة المستخدم');
    } catch (error) {
      console.error('Error updating user status:', error);
      showToast('error', 'فشل تحديث الحالة');
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole }).unwrap();
      refetch();
      showToast('success', 'تم تحديث دور المستخدم');
    } catch (error) {
      console.error('Error updating user role:', error);
      showToast('error', 'فشل تحديث الدور');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`هل أنت متأكد من حذف المستخدم ${userName}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      try {
        await deleteUser({ userId }).unwrap();
        refetch();
        showToast('success', 'تم حذف المستخدم بنجاح');
      } catch (error) {
        console.error('Error deleting user:', error);
        showToast('error', 'خطأ في حذف المستخدم');
      }
    }
  };

  const handleAddBalance = async () => {
    if (!balanceAmount || !selectedUserId) return;
    
    try {
      await addBalance({ 
        userId: selectedUserId, 
        amount: parseFloat(balanceAmount), 
        reason: balanceReason 
      }).unwrap();
      setShowAddBalanceModal(false);
      setBalanceAmount('');
      setBalanceReason('');
      setSelectedUserId('');
      refetch();
      showToast('success', 'تم إضافة الرصيد بنجاح');
    } catch (error) {
      console.error('Error adding balance:', error);
      showToast('error', 'خطأ في إضافة الرصيد');
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="إجمالي المستخدمين"
            value={usersResponse?.pagination?.totalItems || 0}
            icon={Users}
            gradientFrom="from-blue-500"
            gradientTo="to-indigo-600"
            trend={{ value: 16, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="المديرون"
            value={usersResponse?.data?.filter((u: any) => u.role === 'admin')?.length || 0}
            icon={Shield}
            gradientFrom="from-purple-500"
            gradientTo="to-violet-600"
            trend={{ value: 2, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="المستخدمون العاديون"
            value={usersResponse?.data?.filter((u: any) => u.role !== 'admin')?.length || 0}
            icon={User}
            gradientFrom="from-gray-500"
            gradientTo="to-slate-600"
            trend={{ value: 14, isPositive: true }}
            loading={isLoading}
          />
          <StatsCard
            title="المستخدمون النشطون"
            value={usersResponse?.data?.filter((u: any) => u.active)?.length || 0}
            icon={UserCheck}
            gradientFrom="from-emerald-500"
            gradientTo="to-green-600"
            trend={{ value: 9, isPositive: true }}
            loading={isLoading}
          />
        </div>

        {/* Users Table */}
        <div className="space-y-6">
          <FilterToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="بحث بالاسم أو الإيميل..."
            filters={[
              {
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { value: 'active', label: 'نشط' },
                  { value: 'inactive', label: 'غير نشط' }
                ],
                placeholder: 'كل الحالات'
              },
              {
                value: roleFilter,
                onChange: setRoleFilter,
                options: [
                  { value: 'admin', label: 'مدير' },
                  { value: 'user', label: 'مستخدم' }
                ],
                placeholder: 'كل الأدوار'
              }
            ]}
          />
          <DataTable
            loading={isLoading}
            data={usersResponse?.data || []}
            emptyMessage="لا توجد مستخدمون"
            columns={[
              {
                key: 'user',
                title: 'المستخدم',
                render: (_, row) => (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">{row.firstName} {row.lastName}</div>
                      <div className="text-sm text-gray-500">{row.email}</div>
                    </div>
                  </div>
                )
              },
              {
                key: 'role',
                title: 'الدور',
                render: (_, row) => (
                  <select
                    value={row.role}
                    onChange={(e) => handleRoleChange(row._id, e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="user">مستخدم</option>
                    <option value="admin">مدير</option>
                  </select>
                )
              },
              {
                key: 'status',
                title: 'الحالة',
                render: (_, row) => (
                  <button
                    onClick={() => handleStatusChange(row._id, row.active ? 'inactive' : 'active')}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors duration-200 ${
                      row.active 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {row.active ? 'نشط' : 'غير نشط'}
                  </button>
                )
              },
              {
                key: 'date',
                title: 'تاريخ الانضمام',
                render: (_, row) => new Date(row.createdAt).toLocaleDateString('ar-SA')
              },
              {
                key: 'actions',
                title: 'إجراءات',
                render: (_, row) => (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/users/${row._id}`}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedUserId(row._id);
                        setShowAddBalanceModal(true);
                      }}
                      className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                      title="إضافة رصيد"
                    >
                      <Wallet className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(row._id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
          />
          {usersResponse?.pagination && (
            <ModernPagination
              currentPage={usersResponse.pagination.currentPage}
              totalPages={usersResponse.pagination.totalPages}
              totalItems={usersResponse.pagination.totalItems}
              itemsPerPage={usersResponse.pagination.itemsPerPage}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* Add Balance Modal */}
      {showAddBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة رصيد للمستخدم</h3>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="المبلغ"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="السبب (اختياري)"
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowAddBalanceModal(false); setBalanceAmount(''); setBalanceReason(''); setSelectedUserId(''); }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddBalance}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

