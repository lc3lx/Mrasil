import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/lib/constants';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId?: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Derive socket origin from API_BASE_URL (remove trailing /api if present)
    const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '');

    this.socket = io(API_ORIGIN, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      auth: {
        token: localStorage.getItem('token'),
        userId: userId
      }
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Join user room if userId provided
      if (userId) {
        this.socket?.emit('join_user_room', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      
      // Auto reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}`);
          this.connect(userId);
        }, 2000 * this.reconnectAttempts);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen for new notifications
  onNewNotification(callback: (notification: any) => void) {
    if (this.socket) {
      this.socket.on('new_notification', callback);
    }
  }

  // Listen for notification read status updates
  onNotificationRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('notification_read', callback);
    }
  }

  // Send notification (admin only)
  sendNotification(notificationData: any) {
    if (this.socket) {
      this.socket.emit('send_notification', notificationData);
    }
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    if (this.socket) {
      this.socket.emit('mark_notification_read', notificationId);
    }
  }

  // Remove event listeners
  off(event: string, callback?: any) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const websocketService = new WebSocketService();
export default websocketService;
