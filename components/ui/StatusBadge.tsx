"use client";

interface StatusBadgeProps {
  status: string;
  type: 'shipment' | 'order' | 'user' | 'payment';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, type, size = 'sm' }: StatusBadgeProps) {
  const baseClasses = `inline-flex items-center font-medium rounded-full ${
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
  }`;

  const getStatusStyle = () => {
    switch (type) {
      case 'shipment':
        switch (status) {
          case 'Delivered':
          case 'DELIVERED':
            return `${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`;
          case 'IN_TRANSIT':
            return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
          case 'READY_FOR_PICKUP':
            return `${baseClasses} bg-amber-100 text-amber-800 border border-amber-200`;
          case 'Canceled':
          case 'CANCELED':
          case 'CANCELLED':
            return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
          default:
            return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        }
      
      case 'order':
        switch (status) {
          case 'pending':
            return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
          case 'approved':
            return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
          case 'rejected':
            return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
          case 'completed':
            return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
          default:
            return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        }
      
      case 'user':
        switch (status) {
          case 'active':
            return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
          case 'inactive':
            return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
          case 'suspended':
            return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
          case 'admin':
            return `${baseClasses} bg-purple-100 text-purple-800 border border-purple-200`;
          case 'user':
            return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
          default:
            return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        }
      
      case 'payment':
        switch (status) {
          case 'completed':
            return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
          case 'pending':
            return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
          case 'failed':
            return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
          default:
            return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
        }
      
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
    }
  };

  const getStatusText = () => {
    switch (type) {
      case 'shipment':
        switch (status) {
          case 'Delivered':
          case 'DELIVERED':
            return 'تم التسليم';
          case 'IN_TRANSIT':
            return 'في الطريق';
          case 'READY_FOR_PICKUP':
            return 'جاهزة للاستلام';
          case 'Canceled':
          case 'CANCELED':
          case 'CANCELLED':
            return 'ملغية';
          default: return status || '-';
        }
      
      case 'order':
        switch (status) {
          case 'pending': return 'قيد المراجعة';
          case 'approved': return 'موافق عليها';
          case 'rejected': return 'مرفوضة';
          case 'completed': return 'مكتملة';
          default: return status || '-';
        }
      
      case 'user':
        switch (status) {
          case 'active': return 'نشط';
          case 'inactive': return 'غير نشط';
          case 'suspended': return 'معلق';
          case 'admin': return 'مدير';
          case 'user': return 'مستخدم';
          default: return status || '-';
        }
      
      case 'payment':
        switch (status) {
          case 'completed': return 'مكتمل';
          case 'pending': return 'معلق';
          case 'failed': return 'فاشل';
          default: return status || '-';
        }
      
      default:
        return status || '-';
    }
  };

  return (
    <span className={getStatusStyle()}>
      {getStatusText()}
    </span>
  );
}
