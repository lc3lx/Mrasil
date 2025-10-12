/**
 * WebSocket AI Client - عميل الذكاء الاصطناعي عبر WebSocket
 * اتصال فوري وسريع
 */

import type { Socket } from 'socket.io-client';

export interface WebSocketAIConfig {
  apiUrl: string;
}

export interface WebSocketAIResponse {
  response: string;
  intent: string;
  entities: any;
  confidence: number;
  data?: any;
}

export class WebSocketAI {
  private socket: Socket | null = null;
  private apiUrl: string;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private isConnected = false;

  constructor(config: WebSocketAIConfig) {
    this.apiUrl = config.apiUrl;
  }

  /**
   * الاتصال بالخادم
   */
  async connect(): Promise<boolean> {
    return new Promise(async (resolve) => {
      // إذا كان متصل مسبقاً، ارجع true مباشرة
      if (this.socket && this.isConnected) {
        resolve(true);
        return;
      }

      // قطع أي اتصال سابق
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
      }

      // Dynamic import لـ socket.io-client
      const { io: socketIO } = await import('socket.io-client');
      
      this.socket = socketIO(this.apiUrl, {
        transports: ['websocket'], // WebSocket فقط للسرعة
        reconnection: false, // منع إعادة الاتصال التلقائي
        timeout: 2000, // timeout أقل
        forceNew: true, // اتصال جديد دائماً
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ متصل بـ AI Service عبر WebSocket');
        this.isConnected = true;
        resolve(true);
      });

      this.socket.on('connection_status', (data: any) => {
        console.log('📡 حالة الاتصال:', data.status);
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('❌ خطأ في الاتصال:', error);
        this.isConnected = false;
        resolve(false);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ انقطع الاتصال بـ AI Service');
        this.isConnected = false;
      });
    });
  }

  /**
   * قطع الاتصال
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * فحص الاتصال
   */
  isSocketConnected(): boolean {
    return this.isConnected && this.socket !== null;
  }

  /**
   * تحليل الرسالة عبر WebSocket
   */
  async analyzeMessage(
    userMessage: string,
    context?: any
  ): Promise<WebSocketAIResponse> {
    // التأكد من الاتصال
    if (!this.isConnected) {
      await this.connect();
    }

    if (!this.socket) {
      throw new Error('WebSocket غير متصل');
    }

    // إضافة الرسالة للسجل
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // الحصول على التوكن من localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : '';

    // الحصول على اسم المستخدم
    const userDataStr = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
    let userName = '';
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        userName = userData.firstName || userData.name || '';
      } catch (e) {
        console.warn('Failed to parse userData:', e);
      }
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('انتهت مهلة الانتظار'));
      }, 3000); // 3 ثواني فقط

      // الاستماع للرد
      this.socket!.once('chat_response', (data: any) => {
        clearTimeout(timeout);

        if (data.error) {
          reject(new Error(data.error));
          return;
        }

        // إضافة رد المساعد للسجل
        this.conversationHistory.push({
          role: 'assistant',
          content: data.response,
        });

        // الحفاظ على آخر 6 رسائل فقط
        if (this.conversationHistory.length > 6) {
          this.conversationHistory = this.conversationHistory.slice(-6);
        }

        resolve({
          response: data.response,
          intent: data.intent,
          entities: data.entities || {},
          confidence: data.confidence || 0.85,
          data: data.data,
        });
      });

      // الاستماع لحالة المعالجة
      this.socket!.on('chat_status', (status: any) => {
        console.log('📊 حالة المعالجة:', status.status);
      });

      // إرسال الرسالة (بدون سجل للسرعة)
      this.socket!.emit('chat_message', {
        message: userMessage,
        history: [], // بدون سجل للسرعة القصوى
        token: cleanToken,
        userName: userName,
        context,
      });
    });
  }

  /**
   * مسح سجل المحادثة
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}

/**
 * إنشاء عميل WebSocket AI
 */
export function createWebSocketAI(config: WebSocketAIConfig): WebSocketAI {
  return new WebSocketAI(config);
}
