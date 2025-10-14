"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { websocketService } from '@/lib/websocket';
import NotificationToast from '@/components/NotificationToast';

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  showToast: (notification: any) => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentToast, setCurrentToast] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  // Show toast notification
  const showToast = (notification: any) => {
    setCurrentToast(notification);
  };

  // Close toast
  const closeToast = () => {
    setCurrentToast(null);
  };

  // Setup WebSocket connection
  useEffect(() => {
    if (user) {
      console.log('🔌 Setting up WebSocket connection for user:', user.id || user._id);
      
      // Connect to WebSocket
      const socket = websocketService.connect(user.id || user._id);
      
      if (socket) {
        // Update connection status
        socket.on('connect', () => {
          console.log('✅ WebSocket connected in provider');
          setIsConnected(true);
        });

        socket.on('disconnect', () => {
          console.log('❌ WebSocket disconnected in provider');
          setIsConnected(false);
        });

        // Listen for new notifications
        const handleNewNotification = (notification: any) => {
          console.log('📢 New notification in provider:', notification);
          
          // Add to notifications list
          setNotifications(prev => [notification, ...prev]);
          
          // Update unread count if not read
          if (!notification.readStatus) {
            setUnreadCount(prev => prev + 1);
          }

          // Show toast notification
          showToast(notification);

          // Play notification sound (optional)
          try {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Could not play notification sound:', e));
          } catch (e) {
            console.log('Notification sound not available');
          }
        };

        // Listen for read status updates
        const handleNotificationRead = (data: { notificationId: string; readStatus: boolean }) => {
          console.log('👁️ Notification read in provider:', data);
          
          setNotifications(prev =>
            prev.map(n =>
              n._id === data.notificationId
                ? { ...n, readStatus: data.readStatus }
                : n
            )
          );

          if (data.readStatus) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        };

        websocketService.onNewNotification(handleNewNotification);
        websocketService.onNotificationRead(handleNotificationRead);

        // Cleanup function
        return () => {
          websocketService.off('new_notification', handleNewNotification);
          websocketService.off('notification_read', handleNotificationRead);
        };
      }
    }
  }, [user]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
      }
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    showToast,
    isConnected
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast notification */}
      <NotificationToast
        notification={currentToast}
        onClose={closeToast}
        duration={5000}
      />
    </NotificationContext.Provider>
  );
};
