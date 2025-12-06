"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNotifications } from '@/hooks/useNotifications';
import { API_BASE_URL } from '@/lib/constants';
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from 'next/link';
import { 
  Bell, 
  Send, 
  Users, 
  User, 
  MessageSquare, 
  ArrowLeft, 
  Plus, 
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('send');
  const [notificationType, setNotificationType] = useState('all');
  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  // استخدام النظام الجديد للإشعارات
  const { 
    notifications, 
    sendNotification: sendNotificationHook, 
    fetchNotifications: refreshNotifications,
    isConnected 
  } = useNotifications();
  
  const [stats, setStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    failed: 0
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Fetch users for selection (direct backend)
  const fetchUsers = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : null;
      const response = await fetch(`${API_BASE_URL}/customers?activeOnly=true`, {
        headers: {
          'Content-Type': 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      const backend = await response.json();
      const users = (backend.data || backend || []).map((user: any) => ({
        id: user._id || user.id,
        name: user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : (user.name || 'مستخدم'),
        email: user.email || 'لا يوجد إيميل',
        phone: user.phone || 'لا يوجد رقم',
        active: user.active !== false,
      }));
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Update stats based on notifications
  useEffect(() => {
    if (notifications) {
      const stats = {
        total: notifications.length,
        delivered: notifications.filter((n: any) => n.readStatus).length,
        pending: notifications.filter((n: any) => !n.readStatus).length,
        failed: 0
      };
      setStats(stats);
      setIsLoadingData(false);
    }
  }, [notifications]);

  // Send notification
  const handleSendNotification = async () => {
    if (!title || !message) return;
    
    if (notificationType === 'specific' && !selectedUser) {
      alert('يرجى اختيار مستخدم');
      return;
    }

    setIsLoading(true);
    
    try {
      const selectedUserData = users.find(u => u.id === selectedUser);
      
      // استخدام النظام الجديد للإشعارات
      await sendNotificationHook({
        title,
        message,
        type: notificationType as 'all' | 'specific',
        recipientId: notificationType === 'specific' ? selectedUser : undefined,
        recipientName: notificationType === 'specific' ? selectedUserData?.name : undefined
      });

      setTitle('');
      setMessage('');
      setSelectedUser('');
      alert('تم إرسال الإشعار بنجاح!');
      
      // Refresh notifications list
      refreshNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('حدث خطأ في إرسال الإشعار');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete notification (direct backend)
  const handleDeleteNotification = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإشعار؟')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : null;
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('تم حذف الإشعار بنجاح');
        refreshNotifications();
      } else {
        const err = await response.text();
        alert(err || 'حدث خطأ في حذف الإشعار');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('حدث خطأ في حذف الإشعار');
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
        <motion.div 
          className="space-y-8 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-700 to-pink-800 rounded-2xl shadow-2xl"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <Link 
                  href="/dashboard" 
                  className="text-white/80 hover:text-white mb-2 inline-flex items-center gap-2 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  العودة للداشبورد
                </Link>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">إدارة الإشعارات</h1>
                  <p className="text-orange-100 text-lg">إرسال وإدارة الإشعارات للمستخدمين</p>
                </div>
                
                <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/20"
                  >
                    <Bell className="w-5 h-5" />
                    الإشعارات النشطة
                  </motion.button>
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-white">
                      {isConnected ? 'متصل' : 'غير متصل'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={itemVariants}
          >
            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(59, 130, 246, 0.15), 0 8px 16px -8px rgba(59, 130, 246, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">إجمالي الإشعارات</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{stats.total.toLocaleString()}</p>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                    <span className="text-sm text-green-600 font-medium">+12% هذا الشهر</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Bell className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(34, 197, 94, 0.15), 0 8px 16px -8px rgba(34, 197, 94, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">تم التسليم</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{stats.delivered.toLocaleString()}</p>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-500 ml-1" />
                    <span className="text-sm text-emerald-600 font-medium">
                      {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}% معدل التسليم
                    </span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(245, 158, 11, 0.15), 0 8px 16px -8px rgba(245, 158, 11, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">قيد الانتظار</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{stats.pending.toLocaleString()}</p>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-amber-500 ml-1" />
                    <span className="text-sm text-amber-600 font-medium">في الطابور</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <Clock className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white transition-all duration-500 group overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                boxShadow: '0 20px 40px -12px rgba(239, 68, 68, 0.15), 0 8px 16px -8px rgba(239, 68, 68, 0.1)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">فشل التسليم</p>
                  <p className="text-4xl font-bold text-gray-900 mb-3">{stats.failed.toLocaleString()}</p>
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-red-500 ml-1" />
                    <span className="text-sm text-red-600 font-medium">يحتاج مراجعة</span>
                  </div>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <AlertCircle className="h-10 w-10 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            className="flex space-x-1 space-x-reverse bg-white/90 backdrop-blur-sm p-2 rounded-2xl border border-white/20"
            variants={itemVariants}
          >
            <button
              onClick={() => setActiveTab('send')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'send'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Send className="w-5 h-5 inline ml-2" />
              إرسال إشعار
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5 inline ml-2" />
              سجل الإشعارات
            </button>
          </motion.div>

          {/* Content */}
          {activeTab === 'send' && (
            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 overflow-hidden shadow-lg"
              variants={itemVariants}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-orange-50/30"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full -translate-y-20 translate-x-20"></div>
              
              <div className="relative space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">إرسال إشعار جديد</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Notification Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">نوع الإشعار</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setNotificationType('all')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            notificationType === 'all'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Users className="w-6 h-6 mx-auto mb-2" />
                          <span className="font-medium">جميع المستخدمين</span>
                        </button>
                        <button
                          onClick={() => setNotificationType('specific')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            notificationType === 'specific'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" />
                          <span className="font-medium">مستخدم محدد</span>
                        </button>
                      </div>
                    </div>

                    {/* User Selection */}
                    {notificationType === 'specific' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اختيار المستخدم</label>
                        <select
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="">اختر مستخدم...</option>
                          {users.map((user: any) => (
                            <option key={user.id} value={user.id}>
                              {user.name} - {user.email}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الإشعار</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="أدخل عنوان الإشعار"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نص الإشعار</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="أدخل نص الإشعار"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Send Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendNotification}
                      disabled={!title || !message || isLoading}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          إرسال الإشعار
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Preview */}
                  <div className="bg-white/70 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">معاينة الإشعار</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {title || 'عنوان الإشعار'}
                          </h5>
                          <p className="text-gray-600 text-sm">
                            {message || 'نص الإشعار سيظهر هنا'}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">الآن</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 p-8 overflow-hidden shadow-lg"
              variants={itemVariants}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-orange-50/30"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full -translate-y-20 translate-x-20"></div>
              
              <div className="relative space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">سجل الإشعارات</h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="بحث في الإشعارات..."
                        className="pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all w-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {isLoadingData ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-white/70 rounded-xl p-6 border border-gray-200 animate-pulse">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : notifications.length > 0 ? (
                    notifications.map((notification: any, idx: number) => (
                      <motion.div
                        key={notification._id || idx}
                        className="bg-white/70 rounded-xl p-6 border border-gray-200 hover:bg-white transition-colors"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              notification.readStatus ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {notification.readStatus ? <CheckCircle className="w-6 h-6" /> : <Send className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{notification.title || notification.type || 'إشعار'}</h4>
                              <p className="text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>إلى: {(notification.customerId || notification.userId) ? 'مستخدم محدد' : 'جميع المستخدمين'}</span>
                                <span>•</span>
                                <span>{new Date(notification.timestamp || notification.sentAt || notification.createdAt).toLocaleString('ar-SA')}</span>
                                <span>•</span>
                                <span>قراءة: {notification.readStatus ? 1 : 0}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteNotification(notification._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bell className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
                      <p className="text-gray-500">لم يتم إرسال أي إشعارات بعد</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
