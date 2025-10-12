"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../providers/AuthProvider';
import Link from 'next/link';
import { User, Mail, Phone, Calendar, MapPin, Package, CreditCard, Activity } from 'lucide-react';
import { useGetUserWalletQuery, useGetUserActivityQuery } from '../../../api/adminApi';

export default function UserDetails() {
  const { user } = useAuth();
  const params = useParams();
  const userId = params.id as string;
  
  // Real data
  const { data: walletResp, isLoading: walletLoading } = useGetUserWalletQuery({ userId });
  const { data: activityResp, isLoading: activityLoading } = useGetUserActivityQuery({ userId });
  const profile = walletResp?.data?.user;
  const wallet = walletResp?.data?.wallet;
  const transactions = walletResp?.data?.transactions || [];
  const orders = activityResp?.data?.activity?.orders || [];
  const shipments = activityResp?.data?.activity?.shipments || [];
  const totalSpent = shipments.reduce((sum: number, s: any) => sum + (s?.ordervalue ?? s?.totalprice ?? 0), 0);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح لك بالوصول</h1>
          <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            العودة للداشبورد
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'shipment': return <Package className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'login': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard/users" className="text-gray-500 hover:text-gray-700 ml-4">
                ← العودة لقائمة المستخدمين
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">تفاصيل المستخدم</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {profile?.name || '—'}
                </h2>
                <div className="flex justify-center space-x-2 space-x-reverse mb-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(profile?.active ? 'active' : 'inactive')}`}>
                    {profile?.active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 ml-2" />
                      البريد الإلكتروني
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile?.email || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 ml-2" />
                      رقم الهاتف
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile?.phone || '—'}</dd>
                  </div>
                  <div>
                    {/* لا توجد بيانات عنوان في الاستجابة الحالية */}
                  </div>
                </dl>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex space-x-3 space-x-reverse">
                  <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    تعديل المستخدم
                  </button>
                  <button className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                    إيقاف المستخدم
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي الشحنات</p>
                    <p className="text-2xl font-semibold text-gray-900">{shipments.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalSpent.toLocaleString()} ريال</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                    <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">رصيد المحفظة</p>
                    <p className="text-2xl font-semibold text-gray-900">{(wallet?.balance ?? 0).toLocaleString()} ريال</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">النشاط الأخير</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">آخر الشحنات</h4>
                  {shipments.slice(0,5).map((s: any) => (
                    <div key={s._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="text-sm text-gray-700">شحنة: {s.trackingId || s.companyshipmentid || s._id}</div>
                      <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString('ar-SA')}</div>
                    </div>
                  ))}
                  {!shipments.length && <p className="text-sm text-gray-500">لا يوجد</p>}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">آخر الطلبات</h4>
                  {orders.slice(0,5).map((o: any) => (
                    <div key={o._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="text-sm text-gray-700">طلب: {o.orderNumber || o._id}</div>
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString('ar-SA')}</div>
                    </div>
                  ))}
                  {!orders.length && <p className="text-sm text-gray-500">لا يوجد</p>}
                </div>
              </div>
            </div>

            {/* User's Shipments */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">شحنات المستخدم</h3>
                <Link href={`/dashboard/shipments?userId=${userId}`} className="text-blue-600 hover:underline text-sm">عرض الكل</Link>
              </div>
              <div className="p-6">
                {shipments.length ? (
                  <ul className="divide-y">
                    {shipments.slice(0,5).map((s: any) => (
                      <li key={s._id} className="py-2 flex items-center justify-between">
                        <span className="text-sm text-gray-700">{s.trackingId || s.companyshipmentid || s._id}</span>
                        <span className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString('ar-SA')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد شحنات</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
