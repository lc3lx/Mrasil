/**
 * Gemini AI Integration - تكامل مع نموذج Gemini من Google
 * نموذج AI حقيقي لفهم ومعالجة الطلبات
 */

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface GeminiResponse {
  intent: string;
  confidence: number;
  entities: any;
  response: string;
  action?: {
    type: string;
    parameters: any;
  };
}

/**
 * Gemini AI Client
 */
export class GeminiAI {
  private apiKey: string;
  private model: string;
  private apiUrl: string;
  private conversationHistory: GeminiMessage[] = [];

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || "gemini-1.5-flash";
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  /**
   * تحليل الرسالة وفهم النية
   */
  async analyzeMessage(
    userMessage: string,
    context?: any
  ): Promise<GeminiResponse> {
    const systemPrompt = this.buildSystemPrompt(context);
    
    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            {
              role: "model",
              parts: [{ text: "فهمت! أنا مساعدك الذكي في مراسل. سأساعدك في إدارة شحناتك وطلباتك." }],
            },
            ...this.conversationHistory,
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.candidates[0]?.content?.parts[0]?.text || "";

      // حفظ في السجل
      this.conversationHistory.push(
        { role: "user", parts: [{ text: userMessage }] },
        { role: "model", parts: [{ text: aiResponse }] }
      );

      // تحليل الرد لاستخراج النية والإجراءات
      return this.parseAIResponse(aiResponse, userMessage);
    } catch (error) {
      console.error("Gemini AI Error:", error);
      throw error;
    }
  }

  /**
   * بناء prompt النظام
   */
  private buildSystemPrompt(context?: any): string {
    return `أنت مساعد ذكي لمنصة مراسل للشحن واللوجستيات. اسمك "مراسل بوت".

**مهامك الأساسية:**
1. فهم طلبات المستخدمين المتعلقة بالشحن والتوصيل
2. استخراج المعلومات المطلوبة من المحادثة
3. تنفيذ الإجراءات المناسبة
4. الرد بطريقة ودية واحترافية باللغة العربية

**الإجراءات المتاحة:**
- CREATE_SHIPMENT: إنشاء شحنة جديدة
- TRACK_SHIPMENT: تتبع شحنة موجودة
- CANCEL_SHIPMENT: إلغاء شحنة
- GET_SHIPMENTS: عرض قائمة الشحنات
- GET_ORDERS: عرض قائمة الطلبات
- GET_PROFILE: عرض معلومات الحساب
- SEARCH: البحث في البيانات
- INFO: معلومات عامة

**تعليمات مهمة:**
1. عند طلب إنشاء شحنة، اطلب المعلومات التالية:
   - اسم المستلم
   - رقم هاتف المستلم (سعودي: 05xxxxxxxx)
   - المدينة
   - العنوان التفصيلي
   - الوزن (بالكيلو)
   - نوع الدفع (نقدي/بطاقة/عند الاستلام)

2. عند طلب تتبع شحنة، اطلب رقم التتبع (8 أرقام أو أكثر)

3. عند طلب إلغاء، اطلب رقم الشحنة واسم الشركة

4. استخدم الإيموجي بشكل مناسب 📦 🚚 ✅ ❌ 📍

5. كن مختصراً وواضحاً في ردودك

6. في نهاية كل رد، أضف سطر يبدأ بـ "ACTION:" متبوعاً بنوع الإجراء والمعلومات المستخرجة بصيغة JSON

**مثال على الرد:**
"تمام! بدي أنشئ لك شحنة جديدة 📦

بس أحتاج بعض المعلومات:
- اسم المستلم؟
- رقم الهاتف؟
- المدينة؟
- العنوان التفصيلي؟
- وزن الشحنة؟

ACTION: {"type": "CREATE_SHIPMENT", "status": "needs_info", "missing": ["receiverName", "receiverPhone", "city", "address", "weight"]}"

**السياق الحالي:**
${context ? JSON.stringify(context, null, 2) : "لا يوجد سياق"}

تذكر: أنت مساعد ودود ومحترف. ساعد المستخدم بأفضل طريقة ممكنة! 😊`;
  }

  /**
   * تحليل رد AI لاستخراج النية والإجراءات
   */
  private parseAIResponse(
    aiResponse: string,
    userMessage: string
  ): GeminiResponse {
    let intent = "info";
    let confidence = 0.5;
    let entities: any = {};
    let action: any = undefined;

    // البحث عن ACTION في الرد
    const actionMatch = aiResponse.match(/ACTION:\s*({[\s\S]*?})/);
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1]);
        intent = action.type?.toLowerCase() || "info";
        confidence = 0.9;
        entities = action.parameters || action.missing || {};
      } catch (e) {
        console.error("Failed to parse ACTION:", e);
      }
    }

    // إزالة ACTION من الرد النهائي
    const cleanResponse = aiResponse.replace(/ACTION:[\s\S]*$/, "").trim();

    // تحليل إضافي من النص
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes("شحنة جديدة") || lowerMsg.includes("إنشاء")) {
      intent = "create_shipment";
      confidence = Math.max(confidence, 0.8);
    } else if (lowerMsg.includes("تتبع") || lowerMsg.includes("وين")) {
      intent = "track_shipment";
      confidence = Math.max(confidence, 0.85);
    } else if (lowerMsg.includes("إلغاء") || lowerMsg.includes("الغاء")) {
      intent = "cancel_shipment";
      confidence = Math.max(confidence, 0.8);
    } else if (lowerMsg.includes("شحناتي")) {
      intent = "get_shipments";
      confidence = Math.max(confidence, 0.9);
    } else if (lowerMsg.includes("طلباتي")) {
      intent = "get_orders";
      confidence = Math.max(confidence, 0.9);
    } else if (lowerMsg.includes("حسابي") || lowerMsg.includes("ملفي")) {
      intent = "get_profile";
      confidence = Math.max(confidence, 0.9);
    }

    return {
      intent,
      confidence,
      entities,
      response: cleanResponse,
      action,
    };
  }

  /**
   * مسح سجل المحادثة
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * الحصول على سجل المحادثة
   */
  getHistory(): GeminiMessage[] {
    return this.conversationHistory;
  }
}

/**
 * إنشاء instance من Gemini AI
 */
export function createGeminiAI(apiKey: string): GeminiAI {
  return new GeminiAI({ apiKey });
}
