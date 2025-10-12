/**
 * NLP Utilities - أدوات معالجة اللغة الطبيعية
 * مجموعة من الدوال المساعدة لاستخراج المعلومات من النصوص
 */

/**
 * استخراج الأرقام من النص
 */
export function extractNumbers(text: string): string[] {
  const matches = text.match(/\d+/g);
  return matches || [];
}

/**
 * استخراج رقم الهاتف السعودي
 */
export function extractSaudiPhone(text: string): string | null {
  // أنماط أرقام الهاتف السعودية
  const patterns = [
    /\+966\s*5\d{8}/,           // +966 5xxxxxxxx
    /966\s*5\d{8}/,             // 966 5xxxxxxxx
    /05\d{8}/,                  // 05xxxxxxxx
    /5\d{8}/,                   // 5xxxxxxxx
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let phone = match[0].replace(/\s/g, "");
      
      // تنسيق موحد
      if (phone.startsWith("+966")) {
        phone = phone.substring(4);
      } else if (phone.startsWith("966")) {
        phone = phone.substring(3);
      }
      
      if (!phone.startsWith("0")) {
        phone = "0" + phone;
      }
      
      return phone;
    }
  }

  return null;
}

/**
 * استخراج المدن السعودية من النص
 */
export function extractSaudiCity(text: string): string | null {
  const cities = [
    "الرياض",
    "جدة",
    "مكة",
    "المدينة",
    "الدمام",
    "الخبر",
    "الظهران",
    "تبوك",
    "أبها",
    "الطائف",
    "بريدة",
    "خميس مشيط",
    "حائل",
    "نجران",
    "جازان",
    "ينبع",
    "القطيف",
    "الجبيل",
    "الأحساء",
    "القصيم",
  ];

  const lowerText = text.toLowerCase();

  for (const city of cities) {
    if (lowerText.includes(city.toLowerCase())) {
      return city;
    }
  }

  return null;
}

/**
 * استخراج الوزن من النص
 */
export function extractWeight(text: string): number | null {
  // البحث عن أنماط مثل: 5 كيلو، 5كجم، 5kg، 5 كغ
  const patterns = [
    /(\d+\.?\d*)\s*(كيلو|كجم|كغ|kg|kilo)/i,
    /(\d+\.?\d*)\s*جرام/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let weight = parseFloat(match[1]);
      
      // تحويل الجرامات إلى كيلو
      if (match[2].toLowerCase().includes("جرام")) {
        weight = weight / 1000;
      }
      
      return weight;
    }
  }

  return null;
}

/**
 * استخراج السعر من النص
 */
export function extractPrice(text: string): number | null {
  // البحث عن أنماط مثل: 100 ريال، 100ر.س، 100 SAR
  const patterns = [
    /(\d+\.?\d*)\s*(ريال|ر\.س|SAR|sr)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1]);
    }
  }

  return null;
}

/**
 * استخراج اسم من النص
 */
export function extractName(text: string): string | null {
  // البحث عن أنماط مثل: اسمي أحمد، الاسم: محمد
  const patterns = [
    /(?:اسمي|اسم|الاسم)\s*:?\s*([أ-ي\s]+)/i,
    /(?:name|my name is)\s*:?\s*([a-z\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * استخراج عنوان من النص
 */
export function extractAddress(text: string): string | null {
  // البحث عن أنماط مثل: العنوان: شارع الملك فهد
  const patterns = [
    /(?:العنوان|عنوان)\s*:?\s*([أ-ي\s،.0-9]+)/i,
    /(?:address)\s*:?\s*([a-z\s,.0-9]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * استخراج البريد الإلكتروني
 */
export function extractEmail(text: string): string | null {
  const pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(pattern);
  return match ? match[0] : null;
}

/**
 * تحديد نوع الدفع من النص
 */
export function extractPaymentMethod(text: string): string | null {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("كاش") || lowerText.includes("نقد") || lowerText.includes("cash")) {
    return "cash";
  }
  if (lowerText.includes("بطاقة") || lowerText.includes("card") || lowerText.includes("فيزا") || lowerText.includes("مدى")) {
    return "card";
  }
  if (lowerText.includes("تحويل") || lowerText.includes("transfer")) {
    return "transfer";
  }
  if (lowerText.includes("cod") || lowerText.includes("عند الاستلام")) {
    return "cod";
  }

  return null;
}

/**
 * تحديد نوع الشحن من النص
 */
export function extractShipmentType(text: string): string | null {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("سريع") || lowerText.includes("express") || lowerText.includes("عاجل")) {
    return "express";
  }
  if (lowerText.includes("عادي") || lowerText.includes("standard") || lowerText.includes("normal")) {
    return "standard";
  }
  if (lowerText.includes("نفس اليوم") || lowerText.includes("same day")) {
    return "same_day";
  }

  return "standard"; // افتراضي
}

/**
 * استخراج اسم شركة الشحن
 */
export function extractShippingCompany(text: string): string | null {
  const companies = [
    { names: ["aramex", "أرامكس"], value: "aramex" },
    { names: ["smsa", "سمسا"], value: "smsa" },
    { names: ["dhl", "دي اتش ال"], value: "dhl" },
    { names: ["fedex", "فيديكس"], value: "fedex" },
    { names: ["ups", "يو بي اس"], value: "ups" },
    { names: ["naqel", "ناقل"], value: "naqel" },
  ];

  const lowerText = text.toLowerCase();

  for (const company of companies) {
    for (const name of company.names) {
      if (lowerText.includes(name.toLowerCase())) {
        return company.value;
      }
    }
  }

  return null;
}

/**
 * تحليل تاريخ من النص
 */
export function extractDate(text: string): Date | null {
  // البحث عن تواريخ بصيغ مختلفة
  const patterns = [
    /(\d{4})-(\d{2})-(\d{2})/,           // 2025-01-15
    /(\d{2})\/(\d{2})\/(\d{4})/,         // 15/01/2025
    /(\d{2})-(\d{2})-(\d{4})/,           // 15-01-2025
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        continue;
      }
    }
  }

  // البحث عن كلمات مثل "اليوم"، "غداً"، "بعد غد"
  const lowerText = text.toLowerCase();
  const today = new Date();

  if (lowerText.includes("اليوم") || lowerText.includes("today")) {
    return today;
  }
  if (lowerText.includes("غداً") || lowerText.includes("غدا") || lowerText.includes("tomorrow")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  if (lowerText.includes("بعد غد")) {
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    return dayAfter;
  }

  return null;
}

/**
 * استخراج معلومات شحنة كاملة من نص
 */
export interface ShipmentInfo {
  senderName?: string;
  senderPhone?: string;
  senderCity?: string;
  senderAddress?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverCity?: string;
  receiverAddress?: string;
  weight?: number;
  price?: number;
  paymentMethod?: string;
  shipmentType?: string;
  company?: string;
  description?: string;
}

export function extractShipmentInfo(text: string): ShipmentInfo {
  const info: ShipmentInfo = {};

  // استخراج الأسماء
  const names = text.match(/([أ-ي]+\s+[أ-ي]+)/g);
  if (names && names.length >= 2) {
    info.senderName = names[0];
    info.receiverName = names[1];
  }

  // استخراج أرقام الهاتف
  const phones = text.match(/05\d{8}/g);
  if (phones && phones.length >= 2) {
    info.senderPhone = phones[0];
    info.receiverPhone = phones[1];
  } else if (phones && phones.length === 1) {
    info.receiverPhone = phones[0];
  }

  // استخراج المدن
  const cities = text.match(/(الرياض|جدة|مكة|المدينة|الدمام|الخبر|تبوك|أبها)/gi);
  if (cities && cities.length >= 2) {
    info.senderCity = cities[0];
    info.receiverCity = cities[1];
  } else if (cities && cities.length === 1) {
    info.receiverCity = cities[0];
  }

  // استخراج معلومات أخرى
  info.weight = extractWeight(text);
  info.price = extractPrice(text);
  info.paymentMethod = extractPaymentMethod(text);
  info.shipmentType = extractShipmentType(text);
  info.company = extractShippingCompany(text);

  return info;
}

/**
 * تحليل نية المستخدم من النص
 */
export function analyzeIntent(text: string): {
  intent: string;
  confidence: number;
  entities: any;
} {
  const lowerText = text.toLowerCase();
  let intent = "unknown";
  let confidence = 0;
  const entities: any = {};

  // تحليل النية
  if (
    lowerText.includes("إنشاء") ||
    lowerText.includes("شحنة جديدة") ||
    lowerText.includes("أريد شحن")
  ) {
    intent = "create_shipment";
    confidence = 0.9;
    entities.shipmentInfo = extractShipmentInfo(text);
  } else if (lowerText.includes("تتبع") || lowerText.includes("أين")) {
    intent = "track_shipment";
    confidence = 0.85;
    entities.trackingNumber = extractNumbers(text)[0];
  } else if (lowerText.includes("إلغاء") || lowerText.includes("الغاء")) {
    intent = "cancel_shipment";
    confidence = 0.8;
    entities.shipmentId = extractNumbers(text)[0];
  } else if (lowerText.includes("شحناتي") || lowerText.includes("عرض الشحنات")) {
    intent = "get_shipments";
    confidence = 0.95;
  } else if (lowerText.includes("طلباتي") || lowerText.includes("الطلبات")) {
    intent = "get_orders";
    confidence = 0.9;
  }

  return { intent, confidence, entities };
}

/**
 * تنظيف النص من الرموز والمسافات الزائدة
 */
export function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s.,!?@]/g, "");
}

/**
 * تحويل النص إلى كلمات مفتاحية
 */
export function extractKeywords(text: string): string[] {
  const stopWords = [
    "في",
    "من",
    "إلى",
    "على",
    "عن",
    "مع",
    "هذا",
    "هذه",
    "ذلك",
    "التي",
    "الذي",
    "أن",
    "أنا",
    "أنت",
    "هو",
    "هي",
  ];

  const words = cleanText(text)
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  return [...new Set(words)];
}
