/**
 * Local AI Model - نموذج AI محلي خفيف
 * يعمل بدون API keys خارجية
 * يستخدم خوارزميات NLP محلية ونماذج Pattern Matching متقدمة
 */

export interface LocalAIConfig {
  language?: "ar" | "en";
  enableLearning?: boolean;
}

export interface LocalAIResponse {
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
 * Local AI Engine - محرك AI محلي
 */
export class LocalAI {
  private language: string;
  private enableLearning: boolean;
  private conversationHistory: Array<{ role: string; content: string }> = [];
  private userPatterns: Map<string, number> = new Map();
  private contextMemory: any = {};

  // قاعدة بيانات الأنماط والردود
  private patterns = {
    // إنشاء شحنة
    create_shipment: {
      keywords: [
        "إنشاء شحنة",
        "شحنة جديدة",
        "أنشئ شحنة",
        "بدي شحن",
        "أريد شحن",
        "بدي أرسل",
        "أريد إرسال",
        "create shipment",
        "new shipment",
      ],
      requiredInfo: [
        "receiverName",
        "receiverPhone",
        "city",
        "address",
        "weight",
      ],
      responses: [
        "تمام! بدي أساعدك تنشئ شحنة جديدة 📦\n\nبس أحتاج بعض المعلومات:",
        "ممتاز! خليني أنشئ لك الشحنة 🚚\n\nأعطني هالمعلومات:",
        "حاضر! بدي أجهز الشحنة 📦\n\nبس قلي:",
      ],
      followUp: {
        receiverName: [
          "- اسم المستلم؟",
          "- شو اسم الشخص يلي بدو يستلم؟",
          "- اسم المستلم الكامل؟",
        ],
        receiverPhone: [
          "- رقم هاتف المستلم؟ (مثال: 0512345678)",
          "- رقم جوال المستلم؟",
          "- كيف بقدر أتواصل مع المستلم؟",
        ],
        city: [
          "- المدينة؟ (مثال: الرياض، جدة، الدمام)",
          "- وين بدك توصل الشحنة؟",
          "- شو المدينة؟",
        ],
        address: [
          "- العنوان التفصيلي؟",
          "- وين بالضبط العنوان؟",
          "- عنوان التوصيل كامل؟",
        ],
        weight: [
          "- وزن الشحنة؟ (بالكيلو)",
          "- كم وزنها؟",
          "- الوزن التقريبي؟",
        ],
      },
    },

    // تتبع شحنة
    track_shipment: {
      keywords: [
        "تتبع",
        "وين شحنتي",
        "أين شحنتي",
        "track",
        "متابعة",
        "موقع الشحنة",
        "وين وصلت",
        "شو حالة الشحنة",
        "where is my shipment",
      ],
      responses: [
        "حاضر! بتتبع الشحنة 🔍\n\nأعطني رقم التتبع (8 أرقام أو أكثر)",
        "تمام! خليني أشوف وين وصلت 📍\n\nشو رقم الشحنة؟",
        "ماشي! بدور على الشحنة 🚚\n\nقلي رقم التتبع",
      ],
    },

    // إلغاء شحنة
    cancel_shipment: {
      keywords: [
        "إلغاء",
        "الغاء",
        "cancel",
        "ألغي",
        "بدي ألغي",
        "أريد إلغاء",
        "stop shipment",
      ],
      responses: [
        "فهمت! بدك تلغي الشحنة ❌\n\nأعطني:\n- رقم الشحنة\n- اسم الشركة (مثال: aramex، smsa)",
        "حاضر! بساعدك بالإلغاء 🛑\n\nقلي رقم الشحنة واسم الشركة",
        "تمام! بلغي الشحنة ❌\n\nبس أحتاج رقم الشحنة والشركة",
      ],
    },

    // عرض الشحنات
    get_shipments: {
      keywords: [
        "شحناتي",
        "عرض الشحنات",
        "my shipments",
        "قائمة الشحنات",
        "شو عندي شحنات",
        "كم شحنة عندي",
      ],
      responses: [
        "حاضر! بجيب لك قائمة شحناتك 📦",
        "تمام! خليني أشوف شحناتك 🚚",
        "ماشي! بعرض لك الشحنات 📋",
      ],
    },

    // عرض الطلبات
    get_orders: {
      keywords: [
        "طلباتي",
        "الطلبات",
        "orders",
        "قائمة الطلبات",
        "شو عندي طلبات",
      ],
      responses: [
        "حاضر! بجيب لك الطلبات 📋",
        "تمام! خليني أشوف طلباتك 📝",
        "ماشي! بعرض لك قائمة الطلبات 📄",
      ],
    },

    // معلومات الحساب
    get_profile: {
      keywords: [
        "حسابي",
        "ملفي",
        "profile",
        "معلوماتي",
        "بياناتي",
        "my account",
      ],
      responses: [
        "حاضر! بجيب لك معلومات حسابك 👤",
        "تمام! خليني أشوف بياناتك 📊",
        "ماشي! بعرض لك معلومات الحساب 🔐",
      ],
    },

    // بحث
    search: {
      keywords: ["ابحث", "بحث", "search", "find", "دور", "لاقي"],
      responses: [
        "حاضر! بدور لك 🔍\n\nعن شو بدك تبحث؟",
        "تمام! شو بدك تلاقي؟ 🔎",
        "ماشي! قلي شو عم تدور عليه؟ 🕵️",
      ],
    },

    // تحية
    greeting: {
      keywords: [
        "مرحبا",
        "السلام",
        "هلا",
        "أهلا",
        "hi",
        "hello",
        "hey",
        "صباح",
        "مساء",
      ],
      responses: [
        "مرحبا! 👋 أنا مساعدك الذكي في مراسل\n\nكيف بقدر أساعدك اليوم؟",
        "أهلاً وسهلاً! 😊 شو بدك تعمل اليوم؟",
        "هلا والله! 🤗 كيف بقدر أخدمك؟",
      ],
    },

    // شكر
    thanks: {
      keywords: ["شكرا", "شكراً", "thanks", "thank you", "يعطيك العافية"],
      responses: [
        "العفو! 😊 أي خدمة",
        "الله يعافيك! 🙏 دايماً في الخدمة",
        "تسلم! ❤️ أي شي ثاني؟",
      ],
    },

    // وداع
    goodbye: {
      keywords: ["باي", "وداعا", "سلام", "bye", "goodbye", "مع السلامة"],
      responses: [
        "مع السلامة! 👋 أي وقت تحتاجني أنا هون",
        "الله معك! 🌟 ارجع متى ما بدك",
        "باي باي! 😊 بنتظارك",
      ],
    },
  };

  constructor(config: LocalAIConfig = {}) {
    this.language = config.language || "ar";
    this.enableLearning = config.enableLearning || true;
  }

  /**
   * تحليل الرسالة وفهم النية
   */
  async analyzeMessage(
    userMessage: string,
    context?: any
  ): Promise<LocalAIResponse> {
    // حفظ في السجل
    this.conversationHistory.push({
      role: "user",
      content: userMessage,
    });

    // تنظيف النص
    const cleanMessage = this.cleanText(userMessage);

    // كشف النية
    const { intent, confidence } = this.detectIntent(cleanMessage);

    // استخراج المعلومات
    const entities = this.extractEntities(cleanMessage, intent);

    // توليد الرد
    const response = this.generateResponse(intent, entities, context);

    // حفظ الرد
    this.conversationHistory.push({
      role: "assistant",
      content: response,
    });

    // التعلم من الأنماط
    if (this.enableLearning) {
      this.learnFromInteraction(cleanMessage, intent);
    }

    return {
      intent,
      confidence,
      entities,
      response,
      action: this.buildAction(intent, entities),
    };
  }

  /**
   * تنظيف النص
   */
  private cleanText(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/[^\u0600-\u06FFa-z0-9\s]/gi, " ")
      .replace(/\s+/g, " ");
  }

  /**
   * كشف النية باستخدام Pattern Matching المتقدم
   */
  private detectIntent(message: string): {
    intent: string;
    confidence: number;
  } {
    let bestMatch = { intent: "info", confidence: 0 };

    // البحث في كل الأنماط
    for (const [intentName, pattern] of Object.entries(this.patterns)) {
      let score = 0;
      const keywords = pattern.keywords || [];

      // حساب التطابق
      for (const keyword of keywords) {
        if (message.includes(keyword.toLowerCase())) {
          score += 1;

          // إذا كان تطابق تام، زيادة النقاط
          if (message === keyword.toLowerCase()) {
            score += 2;
          }
        }
      }

      // حساب الثقة
      const confidence = Math.min(score / keywords.length, 1);

      // إذا كان هذا أفضل تطابق
      if (confidence > bestMatch.confidence) {
        bestMatch = { intent: intentName, confidence };
      }
    }

    // إذا كانت الثقة منخفضة جداً
    if (bestMatch.confidence < 0.3) {
      return { intent: "info", confidence: 0.5 };
    }

    return bestMatch;
  }

  /**
   * استخراج المعلومات من النص
   */
  private extractEntities(message: string, intent: string): any {
    const entities: any = {};

    // استخراج الأرقام
    const numbers = message.match(/\d+/g);
    if (numbers) {
      entities.numbers = numbers;

      // رقم الهاتف
      const phone = message.match(/05\d{8}/);
      if (phone) entities.phone = phone[0];

      // رقم التتبع
      if (numbers.length > 0 && numbers[0].length >= 8) {
        entities.trackingNumber = numbers[0];
      }
    }

    // استخراج الأسماء (كلمتين متتاليتين بالعربي)
    const arabicNames = message.match(/([أ-ي]+\s+[أ-ي]+)/g);
    if (arabicNames && arabicNames.length > 0) {
      entities.name = arabicNames[0];
    }

    // استخراج المدن
    const cities = [
      "الرياض",
      "جدة",
      "مكة",
      "المدينة",
      "الدمام",
      "الخبر",
      "تبوك",
      "أبها",
    ];
    for (const city of cities) {
      if (message.includes(city.toLowerCase())) {
        entities.city = city;
        break;
      }
    }

    // استخراج الوزن
    const weight = message.match(/(\d+\.?\d*)\s*(كيلو|كجم|كغ|kg)/);
    if (weight) {
      entities.weight = parseFloat(weight[1]);
    }

    // استخراج شركات الشحن
    const companies = ["aramex", "smsa", "dhl", "fedex", "ups", "naqel"];
    for (const company of companies) {
      if (message.includes(company)) {
        entities.company = company;
        break;
      }
    }

    return entities;
  }

  /**
   * توليد الرد
   */
  private generateResponse(
    intent: string,
    entities: any,
    context?: any
  ): string {
    const pattern = this.patterns[intent as keyof typeof this.patterns];

    if (!pattern) {
      return this.getDefaultResponse();
    }

    // اختيار رد عشوائي من القائمة
    const responses = pattern.responses || [];
    let response =
      responses[Math.floor(Math.random() * responses.length)] ||
      this.getDefaultResponse();

    // إضافة معلومات إضافية حسب النية
    if (intent === "create_shipment") {
      const requiredInfo = pattern.requiredInfo || [];
      const missingInfo = requiredInfo.filter(
        (field) => !entities[field] && !this.contextMemory[field]
      );

      if (missingInfo.length > 0) {
        response += "\n";
        for (const field of missingInfo) {
          const followUpQuestions =
            pattern.followUp?.[field as keyof typeof pattern.followUp] || [];
          const question =
            followUpQuestions[
              Math.floor(Math.random() * followUpQuestions.length)
            ];
          if (question) response += "\n" + question;
        }
      } else {
        response = "ممتاز! عندي كل المعلومات 🎉\n\nبنفذ الطلب الحين...";
      }
    }

    // إضافة المعلومات المستخرجة
    if (entities.name) {
      this.contextMemory.receiverName = entities.name;
    }
    if (entities.phone) {
      this.contextMemory.receiverPhone = entities.phone;
    }
    if (entities.city) {
      this.contextMemory.city = entities.city;
    }
    if (entities.weight) {
      this.contextMemory.weight = entities.weight;
    }

    return response;
  }

  /**
   * بناء الإجراء
   */
  private buildAction(intent: string, entities: any): any {
    const actionMap: any = {
      create_shipment: "create_shipment",
      track_shipment: "track_shipment",
      cancel_shipment: "cancel_shipment",
      get_shipments: "get_shipments",
      get_orders: "get_orders",
      get_profile: "get_profile",
      search: "search",
    };

    const actionType = actionMap[intent];

    if (!actionType) {
      return undefined;
    }

    return {
      type: actionType,
      parameters: { ...entities, ...this.contextMemory },
    };
  }

  /**
   * التعلم من التفاعل
   */
  private learnFromInteraction(message: string, intent: string): void {
    const key = `${intent}:${message}`;
    const count = this.userPatterns.get(key) || 0;
    this.userPatterns.set(key, count + 1);
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

كيف بقدر أساعدك؟ 😊`;
  }

  /**
   * مسح السجل
   */
  clearHistory(): void {
    this.conversationHistory = [];
    this.contextMemory = {};
  }

  /**
   * مسح الذاكرة السياقية
   */
  clearContext(): void {
    this.contextMemory = {};
  }

  /**
   * الحصول على السجل
   */
  getHistory(): Array<{ role: string; content: string }> {
    return this.conversationHistory;
  }
}

/**
 * إنشاء instance من Local AI
 */
export function createLocalAI(config?: LocalAIConfig): LocalAI {
  return new LocalAI(config);
}
