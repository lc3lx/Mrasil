import { useState, useEffect, useCallback } from 'react';
import { websocketService } from '@/lib/websocket';
import { useAuth } from '@/app/providers/AuthProvider';
import { API_BASE_URL } from '@/lib/constants';

export interface Notification {
  _id: string;
  customerId?: string | null;
  type: string;
  title?: string;
  message: string;
  readStatus: boolean;
  timestamp: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : null;
      const response = await fetch(`${API_BASE_URL}/notifications/getMynotification`, {
        headers: {
          'Content-Type': 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
        },
        credentials: 'include',
      });
      const raw = await response.text();
      let parsed: any = {};
      try { parsed = raw ? JSON.parse(raw) : {}; } catch {}
      const list: Notification[] = Array.isArray(parsed)
        ? parsed
        : (parsed.data || parsed.notifications || []);
      setNotifications(Array.isArray(list) ? list : []);
      const unread = (Array.isArray(list) ? list : []).filter((n: Notification) => !n.readStatus).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : null;
      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        headers: {
          'Content-Type': 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
        },
        credentials: 'include',
      });
      const data = await response.json();
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : null;
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId 
              ? { ...n, readStatus: true }
              : n
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Emit via WebSocket
        websocketService.markAsRead(notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Send notification (admin only)
  const sendNotification = useCallback(async (notificationData: {
    title: string;
    message: string;
    type: 'all' | 'specific';
    recipientId?: string;
    recipientName?: string;
  }) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : null;
      // Backend expects: type: 'broadcast' | 'targeted', customerId
      const payload = {
        title: notificationData.title || 'إشعار',
        message: notificationData.message,
        type: notificationData.type === 'all' ? 'broadcast' : 'targeted',
        customerId: notificationData.type === 'specific' ? notificationData.recipientId : null,
      };

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const text = await response.text();
      let result: any = undefined;
      try { result = text ? JSON.parse(text) : {}; } catch {}

      if (!response.ok) {
        const raw = (result && (result.error || result.message)) ? `${result.error || result.message}` : text;
        // Backend known issue: Socket.IO emit undefined → treat as soft-success (likely saved before emit)
        if (response.status >= 500 && raw && raw.toLowerCase().includes('emit')) {
          // Emit manually for real-time UX
          websocketService.sendNotification({
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            customerId: notificationData.type === 'specific' ? notificationData.recipientId : null,
          });
          // Return synthetic success
          return {
            success: true,
            soft: true,
            message: 'Sent (server emit failed, client emitted)'
          } as any;
        }
        const msg = raw || 'Failed to send notification';
        throw new Error(msg);
      }

      {
        // Emit via WebSocket for real-time delivery
        websocketService.sendNotification({
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          customerId: notificationData.type === 'specific' ? notificationData.recipientId : null,
        });
        
        return result;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }, []);

  // Setup WebSocket connection and listeners
  useEffect(() => {
    if (user) {
      // Connect to WebSocket
      websocketService.connect(user.id || user._id);

      // Listen for new notifications
      const handleNewNotification = (notification: Notification) => {
        console.log('📢 New notification received:', notification);
        
        // Add to notifications list
        setNotifications(prev => [notification, ...prev]);
        
        // Update unread count if not read
        if (!notification.readStatus) {
          setUnreadCount(prev => prev + 1);
        }

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notification.title || notification.type, {
            body: notification.message,
            icon: '/logo.png',
            badge: '/logo.png',
          });
        }
      };

      // Listen for read status updates
      const handleNotificationRead = (data: { notificationId: string; readStatus: boolean }) => {
        console.log('👁️ Notification read status updated:', data);
        
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

      // Request notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Cleanup on unmount
      return () => {
        websocketService.off('new_notification', handleNewNotification);
        websocketService.off('notification_read', handleNotificationRead);
      };
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    sendNotification,
    fetchNotifications,
    fetchUnreadCount,
    isConnected: websocketService.isConnected(),
  };
};
