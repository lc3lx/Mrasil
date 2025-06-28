import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { CustomerDetails } from "@/components/v7/pages/customer-details"

interface CustomerDetailsPageProps {
  params: {
    id: string
  }
}

export default function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  return (
    <V7Layout>
      <V7Content title="تفاصيل العميل" description="عرض معلومات العميل وسجل الشحنات">
        <CustomerDetails id={params.id} />
      </V7Content>
    </V7Layout>
  )
}
