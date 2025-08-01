import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { AddCustomerForm } from "@/app/customers/add/add-customer-form"

export default function AddCustomerPage() {
  return (
    <V7Layout>
      <V7Content title="إضافة عميل جديد" description="إضافة عميل أو شركة جديدة إلى النظام">
        <AddCustomerForm />
      </V7Content>
    </V7Layout>
  )
}
