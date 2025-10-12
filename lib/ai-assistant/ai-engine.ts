/**
 * AI Assistant Engine - محرك الذكاء الاصطناعي للمساعد
 * يقوم بمعالجة الطلبات وتنفيذ العمليات عبر APIs
 */

import { API_BASE_URL } from "@/lib/constants";
import {
  extractNumbers,
  extractSaudiPhone,
  extractSaudiCity,
  extractWeight,
  extractPrice,
  extractName,
  extractAddress,
  extractEmail,
  extractPaymentMethod,
  extractShipmentType,
  extractShippingCompany,
  extractShipmentInfo,
  analyzeIntent,
  type ShipmentInfo,
} from "./nlp-utils";
import { LocalAI, createLocalAI } from "./local-ai";
import { BackendAI, createBackendAI } from "./backend-ai";
import { WebSocketAI, createWebSocketAI } from "./websocket-ai";

export interface AIMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  action?: AIAction;
  data?: any;
}

export interface AIAction {
  type: 
    | "create_shipment"
    | "track_shipment"
    | "cancel_shipment"
    | "get_shipments"
    | "get_orders"
    | "get_profile"
    | "search"
    | "info"
    | "none";
  status: "pending" | "processing" | "success" | "error";
  result?: any;
  error?: string;
}

export interface AIContext {
  token: string;
  userId?: string;
  conversationHistory: AIMessage[];
}

/**
 * محرك معالجة اللغة الطبيعية - يفهم نية المستخدم
 */
export class AIEngine {
  private context: AIContext;
  private localAI: LocalAI;
  private backendAI: BackendAI | null = null;
  private websocketAI: WebSocketAI | null = null;
  private useBackend: boolean = false;
  private useWebSocket: boolean = false;
  private dataConsentGranted = false;
  private pendingConsent: {
    type: AIAction["type"];
    userMessage: string;
    entities?: any;
    baseResponse: string;
  } | null = null;

  constructor(context: AIContext, useBackendModel: boolean = false) {
    this.context = context;
    this.useBackend = useBackendModel;
    
    // تهيئة النموذج المحلي (fallback)
    this.localAI = createLocalAI({
      language: "ar",
      enableLearning: true,
    });

    // تهيئة Backend AI إذا كان مفعل
    if (useBackendModel) {
      this.backendAI = createBackendAI({
        apiUrl: process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5000",
      });
      
      // فحص الاتصال
      this.checkBackendHealth();
    }
  }

  /**
   * تهيئة Backend AI (HTTP)
   */
  private initBackendAI() {
    this.backendAI = createBackendAI({
      apiUrl: process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:5000",
    });
    
    // فحص الاتصال
    this.checkBackendHealth();
  }

  /**
   * فحص صحة الاتصال بالباك اند
   */
  private async checkBackendHealth(): Promise<void> {
    if (this.backendAI) {
      const isHealthy = await this.backendAI.healthCheck();
      if (!isHealthy) {
        console.warn("⚠️ Backend AI غير متاح، سيتم استخدام النموذج المحلي");
        this.useBackend = false;
      } else {
        console.log("✅ Backend AI متصل ويعمل");
      }
    }
  }

  /**
   * معالجة رسالة المستخدم وتحديد النية
   */
  async processMessage(userMessage: string): Promise<AIMessage> {
    try {
      let aiResponse;

      // محاولة استخدام WebSocket AI أولاً (الأسرع)
      if (this.useWebSocket && this.websocketAI) {
        try {
          aiResponse = await this.websocketAI.analyzeMessage(
            userMessage,
            {
              conversationHistory: this.context.conversationHistory,
              userId: this.context.userId,
            }
          );
        } catch (error) {
          console.warn("⚠️ فشل WebSocket AI، التبديل لـ HTTP");
          this.useWebSocket = false;
          
          // محاولة HTTP Backend
          if (this.backendAI) {
            aiResponse = await this.backendAI.analyzeMessage(userMessage, {
              conversationHistory: this.context.conversationHistory,
              userId: this.context.userId,
            });
          } else {
            aiResponse = await this.localAI.analyzeMessage(userMessage, {});
          }
        }
      } else if (this.useBackend && this.backendAI) {
        // استخدام Backend AI عبر HTTP
        try {
          aiResponse = await this.backendAI.analyzeMessage(
            userMessage,
            {
              conversationHistory: this.context.conversationHistory,
              userId: this.context.userId,
            }
          );
        } catch (error) {
          console.warn("⚠️ فشل Backend AI، التبديل للنموذج المحلي");
          this.useBackend = false;
          aiResponse = await this.localAI.analyzeMessage(userMessage, {});
        }
      } else {
        // استخدام النموذج المحلي
        aiResponse = await this.localAI.analyzeMessage(
          userMessage,
          {
            conversationHistory: this.context.conversationHistory,
            userId: this.context.userId,
          }
        );
      }

      const intent = aiResponse.intent as AIAction["type"];
      let responseText = aiResponse.response;
      
      // تنفيذ الإجراء إذا كان مطلوباً
      const action = await this.executeAction(
        intent,
        userMessage,
        aiResponse.entities
      );
      
      // إذا كان هناك نتيجة من الإجراء، أضفها للرد
      if (action.status === "success" && action.result) {
        const actionResult = this.formatActionResult(intent, action.result);
        if (actionResult) {
          responseText += "\n\n" + actionResult;
        }
      } else if (action.status === "error") {
        responseText += "\n\n❌ عذراً، حدث خطأ: " + action.error;
      }

      return {
        id: `ai-${Date.now()}`,
        content: responseText,
        role: "assistant",
        timestamp: new Date(),
        action,
      };
    } catch (error) {
      console.error("Local AI Error:", error);
      
      // رد احتياطي في حالة الخطأ
      return {
        id: `ai-${Date.now()}`,
        content: "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
        role: "assistant",
        timestamp: new Date(),
        action: {
          type: "info",
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      };
    }
  }

  /**
   * كشف نية المستخدم من الرسالة
   */
  private detectIntent(message: string): AIAction["type"] {
    const msg = message.toLowerCase().trim();

    // إنشاء شحنة
    if (
      msg.includes("إنشاء شحنة") ||
      msg.includes("شحنة جديدة") ||
      msg.includes("أنشئ شحنة") ||
      msg.includes("أريد شحن") ||
      msg.includes("بدي شحن") ||
      msg.includes("create shipment")
    ) {
      return "create_shipment";
    }

    // تتبع شحنة
    if (
      msg.includes("تتبع") ||
      msg.includes("وين شحنتي") ||
      msg.includes("أين شحنتي") ||
      msg.includes("track") ||
      msg.includes("متابعة") ||
      msg.includes("موقع الشحنة")
    ) {
      return "track_shipment";
    }

    // إلغاء شحنة
    if (
      msg.includes("إلغاء") ||
      msg.includes("الغاء") ||
      msg.includes("cancel") ||
      msg.includes("ألغي") ||
      msg.includes("بدي ألغي")
    ) {
      return "cancel_shipment";
    }

    // عرض الشحنات
    if (
      msg.includes("شحناتي") ||
      msg.includes("عرض الشحنات") ||
      msg.includes("my shipments") ||
      msg.includes("قائمة الشحنات")
    ) {
      return "get_shipments";
    }

    // عرض الطلبات
    if (
      msg.includes("طلباتي") ||
      msg.includes("الطلبات") ||
      msg.includes("orders") ||
      msg.includes("قائمة الطلبات")
    ) {
      return "get_orders";
    }

    // معلومات الحساب
    if (
      msg.includes("حسابي") ||
      msg.includes("ملفي") ||
      msg.includes("profile") ||
      msg.includes("معلوماتي")
    ) {
      return "get_profile";
    }

    // بحث
    if (msg.includes("ابحث") || msg.includes("بحث") || msg.includes("search")) {
      return "search";
    }

    // معلومات عامة
    return "info";
  }

  /**
   * تنفيذ الإجراء المطلوب
   */
  private async executeAction(
    type: AIAction["type"],
    message: string,
    entities?: any
  ): Promise<AIAction> {
    const action: AIAction = {
      type,
      status: "processing",
    };

    try {
      switch (type) {
        case "create_shipment":
          action.result = await this.handleCreateShipment(message);
          action.status = "success";
          break;

        case "track_shipment":
          action.result = await this.handleTrackShipment(message);
          action.status = "success";
          break;

        case "cancel_shipment":
          action.result = await this.handleCancelShipment(message);
          action.status = "success";
          break;

        case "get_shipments":
          action.result = await this.handleGetShipments();
          action.status = "success";
          break;

        case "get_orders":
          action.result = await this.handleGetOrders();
          action.status = "success";
          break;

        case "get_profile":
          action.result = await this.handleGetProfile();
          action.status = "success";
          break;

        case "search":
          action.result = await this.handleSearch(message);
          action.status = "success";
          break;

        default:
          action.status = "success";
          action.result = { type: "info" };
      }
    } catch (error: any) {
      action.status = "error";
      action.error = error.message || "حدث خطأ أثناء تنفيذ العملية";
    }

    return action;
  }

  /**
   * معالجة إنشاء شحنة
   */
  private async handleCreateShipment(message: string): Promise<any> {
    // استخراج المعلومات من الرسالة
    const info = this.extractShipmentInfo(message);

    if (!info.hasRequiredInfo) {
      return {
        needsMoreInfo: true,
        missingFields: info.missingFields,
        message: "أحتاج بعض المعلومات الإضافية لإنشاء الشحنة",
      };
    }

    // إنشاء الشحنة عبر API
    const response = await fetch(`${API_BASE_URL}/shipment/createshipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`,
      },
      credentials: "include",
      body: JSON.stringify(info.data),
    });

    if (!response.ok) {
      throw new Error("فشل إنشاء الشحنة");
    }

    return await response.json();
  }

  /**
   * معالجة تتبع شحنة
   */
  private async handleTrackShipment(message: string): Promise<any> {
    // استخراج رقم التتبع
    const trackingNumber = this.extractTrackingNumber(message);

    if (!trackingNumber) {
      return {
        needsMoreInfo: true,
        message: "من فضلك أعطني رقم الشحنة للتتبع",
      };
    }

    const response = await fetch(`${API_BASE_URL}/shipment/traking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`,
      },
      credentials: "include",
      body: JSON.stringify({ trackingNumber }),
    });

    if (!response.ok) {
      throw new Error("فشل تتبع الشحنة");
    }

    return await response.json();
  }

  /**
   * معالجة إلغاء شحنة
   */
  private async handleCancelShipment(message: string): Promise<any> {
    const shipmentId = this.extractShipmentId(message);
    const company = this.extractCompany(message);

    if (!shipmentId || !company) {
      return {
        needsMoreInfo: true,
        message: "أحتاج رقم الشحنة واسم الشركة للإلغاء",
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/shipment/cancel/${shipmentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.context.token}`,
        },
        credentials: "include",
        body: JSON.stringify({ company }),
      }
    );

    if (!response.ok) {
      throw new Error("فشل إلغاء الشحنة");
    }

    return await response.json();
  }

  /**
   * معالجة عرض الشحنات
   */
  private async handleGetShipments(): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/shipment/my-shipments?page=1&itemsPerPage=10`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.context.token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("فشل جلب الشحنات");
    }

    return await response.json();
  }

  /**
   * معالجة عرض الطلبات
   */
  private async handleGetOrders(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/orderManually`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.context.token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("فشل جلب الطلبات");
    }

    return await response.json();
  }

  /**
   * معالجة عرض معلومات الحساب
   */
  private async handleGetProfile(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/customer/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.context.token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("فشل جلب معلومات الحساب");
    }

    return await response.json();
  }

  /**
   * معالجة البحث
   */
  private async handleSearch(message: string): Promise<any> {
    const searchTerm = this.extractSearchTerm(message);

    if (!searchTerm) {
      return {
        needsMoreInfo: true,
        message: "عن ماذا تريد البحث؟",
      };
    }

    // البحث في الشحنات
    const response = await fetch(
      `${API_BASE_URL}/shipment/search?q=${encodeURIComponent(searchTerm)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.context.token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("فشل البحث");
    }

    return await response.json();
  }

  /**
   * توليد الرد المناسب
   */
  private generateResponse(
    intent: AIAction["type"],
    action: AIAction
  ): string {
    if (action.status === "error") {
      return `عذراً، حدث خطأ: ${action.error}. هل يمكنك المحاولة مرة أخرى؟`;
    }

    if (action.result?.needsMoreInfo) {
      return action.result.message;
    }

    switch (intent) {
      case "create_shipment":
        return this.formatCreateShipmentResponse(action.result);

      case "track_shipment":
        return this.formatTrackShipmentResponse(action.result);

      case "cancel_shipment":
        return this.formatCancelShipmentResponse(action.result);

      case "get_shipments":
        return this.formatShipmentsListResponse(action.result);

      case "get_orders":
        return this.formatOrdersListResponse(action.result);

      case "get_profile":
        return this.formatProfileResponse(action.result);

      case "search":
        return this.formatSearchResponse(action.result);

      default:
        return this.getDefaultResponse();
    }
  }

  /**
   * استخراج معلومات الشحنة من الرسالة
   */
  private extractShipmentInfo(message: string): any {
    const info = extractShipmentInfo(message);
    
    // التحقق من وجود المعلومات الأساسية
    const requiredFields = [];
    if (!info.receiverName) requiredFields.push("اسم المستلم");
    if (!info.receiverPhone) requiredFields.push("رقم الهاتف");
    if (!info.receiverCity) requiredFields.push("المدينة");
    if (!info.receiverAddress) requiredFields.push("العنوان");
    if (!info.weight) requiredFields.push("الوزن");

    if (requiredFields.length > 0) {
      return {
        hasRequiredInfo: false,
        missingFields: requiredFields,
        extractedInfo: info,
      };
    }

    return {
      hasRequiredInfo: true,
      data: {
        customer: {
          full_name: info.receiverName,
          mobile: info.receiverPhone,
          city: info.receiverCity,
          address: info.receiverAddress,
          email: info.receiverName ? `${info.receiverName}@temp.com` : "",
          country: "Saudi Arabia",
          district: "",
        },
        weight: info.weight,
        total: {
          amount: info.price || 0,
          currency: "SAR",
        },
        paymentMethod: info.paymentMethod || "cash",
        description: info.description || "شحنة عبر المساعد الذكي",
        source: "AI Assistant",
        direction: "domestic",
        company: info.company || "aramex",
        shapmentingType: info.shipmentType || "standard",
      },
    };
  }

  /**
   * استخراج رقم التتبع من الرسالة
   */
  private extractTrackingNumber(message: string): string | null {
    const numbers = extractNumbers(message);
    // البحث عن رقم طويل (عادة رقم التتبع 8 أرقام أو أكثر)
    const trackingNum = numbers.find(num => num.length >= 8);
    return trackingNum || null;
  }

  /**
   * استخراج معرف الشحنة
   */
  private extractShipmentId(message: string): string | null {
    const match = message.match(/[A-Za-z0-9]{10,}/);
    return match ? match[0] : null;
  }

  /**
   * استخراج اسم الشركة
   */
  private extractCompany(message: string): string | null {
    return extractShippingCompany(message);
  }

  /**
   * استخراج مصطلح البحث
   */
  private extractSearchTerm(message: string): string | null {
    const keywords = ["ابحث عن", "بحث عن", "search for", "find"];

    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        return message.split(keyword)[1]?.trim() || null;
      }
    }

    return null;
  }

  /**
   * تنسيق رد إنشاء الشحنة
   */
  private formatCreateShipmentResponse(result: any): string {
    if (!result || !result.data) {
      return "تم إنشاء الشحنة بنجاح! ✅";
    }

    return `تم إنشاء الشحنة بنجاح! ✅

📦 رقم الشحنة: ${result.data.trackingNumber || "غير متوفر"}
💰 التكلفة: ${result.data.price || "غير متوفر"} ريال
🚚 شركة الشحن: ${result.data.company || "غير متوفر"}
📍 الوجهة: ${result.data.destination || "غير متوفر"}

يمكنك تتبع شحنتك في أي وقت!`;
  }

  /**
   * تنسيق رد تتبع الشحنة
   */
  private formatTrackShipmentResponse(result: any): string {
    if (!result || !result.data) {
      return "لم أتمكن من العثور على معلومات التتبع";
    }

    const data = result.data;
    return `📦 معلومات الشحنة:

📍 الحالة: ${data.status || "غير متوفر"}
🚚 الموقع الحالي: ${data.currentLocation || "غير متوفر"}
⏰ آخر تحديث: ${data.lastUpdate || "غير متوفر"}
📅 التسليم المتوقع: ${data.estimatedDelivery || "غير متوفر"}

${data.notes ? `📝 ملاحظات: ${data.notes}` : ""}`;
  }

  /**
   * تنسيق رد إلغاء الشحنة
   */
  private formatCancelShipmentResponse(result: any): string {
    return `تم إلغاء الشحنة بنجاح! ✅

${result.message || "تم معالجة طلب الإلغاء"}

إذا كان لديك أي استفسار، أنا هنا لمساعدتك!`;
  }

  /**
   * تنسيق رد قائمة الشحنات
   */
  private formatShipmentsListResponse(result: any): string {
    if (!result || !result.data || result.data.length === 0) {
      return "لا توجد شحنات حالياً 📦";
    }

    let response = `📦 شحناتك (${result.results || result.data.length}):\n\n`;

    result.data.slice(0, 5).forEach((shipment: any, index: number) => {
      response += `${index + 1}. 📦 ${shipment.orderId || "غير متوفر"}
   📍 الحالة: ${shipment.status || "غير متوفر"}
   🚚 الشركة: ${shipment.shapmentCompany || "غير متوفر"}
   💰 السعر: ${shipment.totalprice || "0"} ريال
   
`;
    });

    if (result.data.length > 5) {
      response += `\n... و ${result.data.length - 5} شحنة أخرى`;
    }

    return response;
  }

  /**
   * تنسيق رد قائمة الطلبات
   */
  private formatOrdersListResponse(result: any): string {
    if (!result || !result.data || result.data.length === 0) {
      return "لا توجد طلبات حالياً 📋";
    }

    let response = `📋 طلباتك (${result.results || result.data.length}):\n\n`;

    result.data.slice(0, 5).forEach((order: any, index: number) => {
      response += `${index + 1}. 📋 ${order._id || "غير متوفر"}
   📍 الحالة: ${order.status?.name || "غير متوفر"}
   💰 القيمة: ${order.product_value || "0"} ريال
   📦 عدد الصناديق: ${order.number_of_boxes || "0"}
   
`;
    });

    if (result.data.length > 5) {
      response += `\n... و ${result.data.length - 5} طلب آخر`;
    }

    return response;
  }

  /**
   * تنسيق رد معلومات الحساب
   */
  private formatProfileResponse(result: any): string {
    if (!result || !result.data) {
      return "لم أتمكن من جلب معلومات الحساب";
    }

    const profile = result.data;
    return `👤 معلومات حسابك:

📛 الاسم: ${profile.firstName || ""} ${profile.lastName || ""}
📧 البريد: ${profile.email || "غير متوفر"}
📱 الهاتف: ${profile.mobile || "غير متوفر"}
🌍 الدولة: ${profile.country || "غير متوفر"}

${profile.role ? `👔 الدور: ${profile.role}` : ""}`;
  }

  /**
   * تنسيق رد البحث
   */
  private formatSearchResponse(result: any): string {
    if (!result || !result.data || result.data.length === 0) {
      return "لم أجد نتائج للبحث 🔍";
    }

    return `🔍 نتائج البحث (${result.data.length}):\n\n${result.data
      .slice(0, 3)
      .map((item: any, index: number) => `${index + 1}. ${item.title || item.name || "عنصر"}`)
      .join("\n")}`;
  }

  /**
   * الرد الافتراضي
   */
  private getDefaultResponse(): string {
    return `مرحباً! أنا مساعدك الذكي في مراسل 🤖

يمكنني مساعدتك في:
✅ إنشاء شحنة جديدة
✅ تتبع الشحنات
✅ إلغاء الشحنات
✅ عرض شحناتك وطلباتك
✅ البحث عن معلومات
✅ معلومات حسابك

كيف يمكنني مساعدتك اليوم؟ 😊`;
  }

  /**
   * تنسيق نتيجة الإجراء بشكل مختصر
   */
  private formatActionResult(intent: AIAction["type"], result: any): string {
    switch (intent) {
      case "get_shipments":
        if (result?.data?.length > 0) {
          return `📦 لديك ${result.data.length} شحنة`;
        }
        return "لا توجد شحنات";

      case "get_orders":
        if (result?.data?.length > 0) {
          return `📋 لديك ${result.data.length} طلب`;
        }
        return "لا توجد طلبات";

      case "track_shipment":
        if (result?.data) {
          return `📍 الحالة: ${result.data.status || "غير متوفر"}`;
        }
        return "لم أتمكن من تتبع الشحنة";

      default:
        return "";
    }
  }
}
