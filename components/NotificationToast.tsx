"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    _id: string;
    title?: string;
    message: string;
    type: string;
    timestamp: string;
  } | null;
  onClose: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [notification, duration, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    const type = notification.type.toLowerCase();
    if (type.includes('تحديث') || type.includes('update')) {
      return <Info className="w-5 h-5 text-blue-500" />;
    }
    if (type.includes('تأكيد') || type.includes('confirm')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (type.includes('تحذير') || type.includes('warning')) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return <Bell className="w-5 h-5 text-blue-500" />;
  };

  const getBorderColor = () => {
    const type = notification.type.toLowerCase();
    if (type.includes('تحديث') || type.includes('update')) return 'border-l-blue-500';
    if (type.includes('تأكيد') || type.includes('confirm')) return 'border-l-green-500';
    if (type.includes('تحذير') || type.includes('warning')) return 'border-l-yellow-500';
    return 'border-l-blue-500';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-l-4 ${getBorderColor()} p-4 relative overflow-hidden`}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50/20 dark:to-blue-900/20"></div>
            
            {/* Content */}
            <div className="relative flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {notification.title || notification.type}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      الآن
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(onClose, 300);
                    }}
                    className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;
