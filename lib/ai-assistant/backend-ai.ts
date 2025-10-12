/**
 * Backend AI Integration - تكامل مع نموذج الباك اند
 * يتصل بـ API الخاص بالنموذج المحلي
 */

export interface BackendAIConfig {
  apiUrl?: string;
}

export interface BackendAIResponse {
  intent: string;
  confidence: number;
  entities: any;
  response: string;
}

/**
 * Backend AI Client
 */
export class BackendAI {
  private apiUrl: string;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(config: BackendAIConfig = {}) {
    // استخدام localhost للتطوير أو URL الإنتاج
    this.apiUrl = config.apiUrl || "http://localhost:5000";
  }

  /**
   * تحليل الرسالة عبر الباك اند
   */
  async analyzeMessage(
    userMessage: string,
    context?: any
  ): Promise<BackendAIResponse> {
    try {
      // إضافة الرسالة للسجل
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      // الحصول على التوكن من localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const cleanToken = token ? token.replace(/^Bearer\s+/i, "") : "";
      
      // الحصول على اسم المستخدم من localStorage
      const userDataStr = typeof window !== 'undefined' ? localStorage.getItem("userData") : null;
      let userName = "";
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userName = userData.firstName || userData.name || "";
        } catch (e) {
          console.warn("Failed to parse userData:", e);
        }
      }

      // إرسال الطلب للباك اند
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 ثانية لتفادي الإلغاء المبكر

      const response = await fetch(`${this.apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: [], // بدون سجل للسرعة
          token: cleanToken,
          userName: userName,
          context,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend API Error: ${response.status}`);
      }

      const data = await response.json();

      // إضافة رد النموذج للسجل
      this.conversationHistory.push({
        role: "assistant",
        content: data.response,
      });

      return {
        intent: data.intent || "info",
        confidence: data.confidence || 0.8,
        entities: data.entities || {},
        response: data.response,
      };
    } catch (error) {
      console.error("Backend AI Error:", error);
      
      // في حالة فشل الاتصال، استخدم تحليل بسيط محلي
      return this.fallbackAnalysis(userMessage);
    }
  }

  /**
   * تحليل احتياطي في حالة فشل الباك اند
   */
  private fallbackAnalysis(message: string): BackendAIResponse {
    const lowerMsg = message.toLowerCase();
    let intent = "info";
    // رسالة ودودة بدل رسالة الخطأ القاسية
    let response = "صار عندي تأخير بسيط بالخادم، بحاول لك بطريقة أسرع 😊";

    // تحليل بسيط
    if (lowerMsg.includes("شحنة") || lowerMsg.includes("إنشاء")) {
      intent = "create_shipment";
      response = "تمام! بساعدك تنشئ شحنة جديدة 📦\n\nأعطني تفاصيل المرسل والمستلم والوزن والمدينة.";
    } else if (lowerMsg.includes("تتبع") || lowerMsg.includes("وين")) {
      intent = "track_shipment";
      response = "حاضر! عطيني رقم التتبع وأشيّك لك 🔍";
    } else if (lowerMsg.includes("شحناتي")) {
      intent = "get_shipments";
      response = "تمام! أجيب لك شحناتك الآن 📦";
    }

    return {
      intent,
      confidence: 0.6,
      entities: {},
      response,
    };
  }

  /**
   * فحص صحة الاتصال بالباك اند
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: "GET",
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * مسح سجل المحادثة
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * الحصول على السجل
   */
  getHistory(): Array<{ role: string; content: string }> {
    return this.conversationHistory;
  }
}

/**
 * إنشاء instance من Backend AI
 */
export function createBackendAI(config?: BackendAIConfig): BackendAI {
  return new BackendAI(config);
}
