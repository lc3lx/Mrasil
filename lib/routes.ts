export const routes = {
  home: "/",
  orders: "/orders",
  shipments: "/shipments",
  tracking: "/tracking",
  customers: "/customers",
  balance: "/balance",
  reports: "/reports",
  settings: "/settings",
  support: "/support",
  profile: "/profile",
  createShipment: "/create-shipment",
  history: "/history",
  payments: "/payments",
  invoices: "/invoices",
  taxInvoices: "/tax-invoices", // إضافة مسار الفواتير الضريبية
  zakatInvoices: "/zakat-invoices", // إضافة مسار فواتير الزكاة
  help: "/help",
  locations: "/locations",
  returns: "/returns",
  parcels: "/parcels",
  team: "/team",
  webhooks: "/webhooks",
  api: "/api-docs",
  createReturn: "/returns/create",
  customerReturnLink: "/customer-return",
  customTracking: "/custom-tracking",
  replacements: "/replacements",
  // مسارات العملاء
  addCustomer: "/customers/add",
  customerDetails: (id: string) => `/customers/${id}`,
  editCustomer: (id: string) => `/customers/${id}/edit`,
  // مسارات شركات الشحن الجديدة
  carriers: "/carriers",
  addCarrier: "/carriers/add",
  carrierDetails: (id: string) => `/carriers/${id}`,
  editCarrier: (id: string) => `/carriers/${id}/edit`,
  // مسار الأتمتة الجديد
  automation: "/automation",
  createAutomation: "/automation/create",
  automationDetails: (id: string) => `/automation/${id}`,
  editAutomation: (id: string) => `/automation/${id}/edit`,
  // مسارات تفاصيل أخرى
  orderDetails: (id: string) => `/orders/${id}`,
  returnDetails: (id: string) => `/returns/${id}`,
  // مسارات الفريق
  addTeamMember: "/team/add",
  teamMemberDetails: (id: string) => `/team/${id}`,
  editTeamMember: (id: string) => `/team/${id}/edit`,
  // مسار شروط الشحن المتقدمة
  advancedShippingConditions: "/shipping/advanced-conditions",
  shippingConditions: "/shipping-conditions",
  salary: "/salary",
}

// تحديث نوع RouteKey ليشمل الدوال الجديدة
export type RouteKey =
  | keyof typeof routes
  | "orderDetails"
  | "returnDetails"
  | "customerDetails"
  | "editCustomer"
  | "carrierDetails"
  | "editCarrier"
  | "automationDetails"
  | "editAutomation"
  | "teamMemberDetails"
  | "editTeamMember"

// تحسين دالة التحقق من المسار النشط
export function isActiveRoute(currentPath: string, route: string): boolean {
  // للصفحة الرئيسية، نتحقق من التطابق التام
  if (route === "/") {
    return currentPath === "/"
  }

  // للمسارات الأخرى، نتحقق من أن المسار الحالي يبدأ بالمسار المطلوب
  // ونتأكد من أن المسار إما ينتهي هنا أو يتبعه "/"
  if (currentPath === route) {
    return true
  }

  // التحقق من أن المسار الحالي يبدأ بالمسار المطلوب متبوعًا بـ "/"
  return currentPath.startsWith(`${route}/`)
}
