"use client";

import { useState } from 'react';
import { useAuth } from '../../../providers/AuthProvider';
import Link from 'next/link';
import { Search, Filter, Clock, CheckCircle, XCircle, AlertTriangle, Package, User, MapPin, Calendar, Eye, Check, X } from 'lucide-react';

export default function OrdersApproval() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Mock data - replace with actual API call
  const [ordersData] = useState({
    orders: [
      {
        id: '1',
        orderNumber: 'ORD001234',
        customerName: 'أحمد محمد',
        customerPhone: '+966501234567',
        fromCity: 'الرياض',
        toCity: 'جدة',
        weight: 2.5,
        amount: 45,
        priority: 'high',
        requestedCompany: 'أرامكس',
        description: 'ملابس وإكسسوارات - عاجل',
        createdAt: '2024-10-12T10:30:00Z',
        estimatedCost: 45,
        notes: 'يرجى التعامل مع الطلب بحذر - قابل للكسر',
        status: 'pending_approval'
      },
      {
        id: '2',
        orderNumber: 'ORD001235',
        customerName: 'فاطمة أحمد',
        customerPhone: '+966509876543',
        fromCity: 'الدمام',
        toCity: 'الرياض',
        weight: 1.2,
        amount: 25,
        priority: 'medium',
        requestedCompany: 'سمسا',
        description: 'كتب ومجلات',
        createdAt: '2024-10-12T09:15:00Z',
        estimatedCost: 25,
        notes: '',
        status: 'pending_approval'
      },
      {
        id: '3',
        orderNumber: 'ORD001236',
        customerName: 'محمد علي',
        customerPhone: '+966512345678',
        fromCity: 'مكة',
        toCity: 'المدينة',
        weight: 3.8,
        amount: 65,
        priority: 'low',
        requestedCompany: 'ريد بوكس',
        description: 'أجهزة إلكترونية',
        createdAt: '2024-10-12T08:45:00Z',
        estimatedCost: 65,
        notes: 'يحتاج تأمين إضافي',
        status: 'pending_approval'
      },
      {
        id: '4',
        orderNumber: 'ORD001237',
        customerName: 'سارة أحمد',
        customerPhone: '+966534567890',
        fromCity: 'جدة',
        toCity: 'الطائف',
        weight: 0.8,
        amount: 15,
        priority: 'urgent',
        requestedCompany: 'لاما بوكس',
        description: 'مستحضرات تجميل - طلب عاجل جداً',
        createdAt: '2024-10-12T14:20:00Z',
        estimatedCost: 15,
        notes: 'العميل يحتاج التسليم اليوم',
        status: 'pending_approval'
      }
    ],
    stats: {
      total: 4,
      pending: 4,
      approved: 0,
      rejected: 0,
      urgent: 1,
      high: 1,
      medium: 1,
      low: 1
    }
  });

  const [isLoading] = useState(false);
  const [error] = useState(null);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل جداً';
      case 'high': return 'عاجل';
      case 'medium': return 'متوسط';
      case 'low': return 'عادي';
      default: return priority;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleApprove = (orderId: string) => {
    console.log('Approving order:', orderId);
    // Add API call here
  };

  const handleReject = (orderId: string) => {
    console.log('Rejecting order:', orderId);
    // Add API call here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 ml-4">
                ← العودة للداشبورد
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">طلبات الشحن - الموافقة</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-semibold text-gray-900">{ordersData.stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">قيد المراجعة</p>
                <p className="text-2xl font-semibold text-gray-900">{ordersData.stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عاجل جداً</p>
                <p className="text-2xl font-semibold text-gray-900">{ordersData.stats.urgent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عاجل</p>
                <p className="text-2xl font-semibold text-gray-900">{ordersData.stats.high}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">موافق عليها</p>
                <p className="text-2xl font-semibold text-gray-900">{ordersData.stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">مرفوضة</p>
                <p className="text-2xl font-semibold text-gray-900">{ordersData.stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث برقم الطلب أو اسم العميل..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Priority Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">كل الأولويات</option>
              <option value="urgent">عاجل جداً</option>
              <option value="high">عاجل</option>
              <option value="medium">متوسط</option>
              <option value="low">عادي</option>
            </select>

            {/* Date Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">كل الفترات</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>

            {/* Quick Actions */}
            <div className="flex space-x-2 space-x-reverse">
              <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                موافقة جماعية
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                رفض جماعي
              </button>
            </div>
          </div>
        </div>

        {/* Orders Cards */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">خطأ في تحميل البيانات</p>
            </div>
          ) : (
            ordersData.orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900 ml-4">
                          طلب رقم: {order.orderNumber}
                        </h3>
                        <div className={`flex items-center px-3 py-1 rounded-full border ${getPriorityColor(order.priority)}`}>
                          {getPriorityIcon(order.priority)}
                          <span className="mr-2 text-sm font-medium">
                            {getPriorityText(order.priority)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Customer Info */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">معلومات العميل</h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-900">
                              <User className="h-4 w-4 text-gray-400 ml-2" />
                              {order.customerName}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="mr-6">{order.customerPhone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Shipment Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">تفاصيل الشحنة</h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPin className="h-4 w-4 text-gray-400 ml-2" />
                              {order.fromCity} → {order.toCity}
                            </div>
                            <div className="text-sm text-gray-500">
                              الوزن: {order.weight} كجم | الشركة: {order.requestedCompany}
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              التكلفة المقدرة: {order.estimatedCost} ريال
                            </div>
                          </div>
                        </div>

                        {/* Order Info */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">معلومات الطلب</h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 text-gray-400 ml-2" />
                              {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                            </div>
                            <div className="text-sm text-gray-900">
                              {order.description}
                            </div>
                            {order.notes && (
                              <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                                <strong>ملاحظات:</strong> {order.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 mr-6">
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="h-4 w-4 ml-2" />
                        موافقة
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4 ml-2" />
                        رفض
                      </button>
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                      >
                        <Eye className="h-4 w-4 ml-2" />
                        تفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">إجراءات جماعية</h3>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="mr-2 text-sm text-gray-700">تحديد الكل</label>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              موافقة على المحدد
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              رفض المحدد
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              تصدير المحدد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
