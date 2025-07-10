import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { CustomersContent } from "@/components/v7/pages/customers-content"

export default function CustomersPage() {
  return (
    <V7Layout>
      <V7Content title="العملاء" description="إدارة قائمة العملاء والشركات">
        <CustomersContent />
      </V7Content>
    </V7Layout>
  )
}
