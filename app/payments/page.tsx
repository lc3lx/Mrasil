import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { PaymentsContent } from "./paymentContent"

export default function PaymentsPage() {
  return (
    <V7Layout>
      <V7Content title="المدفوعات" description="إدارة المدفوعات والفواتير">
        <PaymentsContent />
      </V7Content>
    </V7Layout>
  )
}
