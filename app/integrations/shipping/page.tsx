import type { Metadata } from "next"
import ShippingIntegrationsContent from "@/components/v7/pages/shipping-integrations-content"

export const metadata: Metadata = {
  title: "تفاصيل التكامل مع شركات الشحن",
  description: "تعرف على كيفية التكامل مع مختلف شركات الشحن وربط نظامك معها",
}

export default function ShippingIntegrationsPage() {
  return <ShippingIntegrationsContent />
}
