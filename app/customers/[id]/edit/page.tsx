import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { EditCustomerForm } from "@/components/v7/pages/edit-customer-form"

interface EditCustomerPageProps {
  params: {
    id: string
  }
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  return (
    <V7Layout>
      <V7Content title="تعديل بيانات العميل" description="تعديل معلومات العميل وبيانات الاتصال">
        <EditCustomerForm id={params.id} />
      </V7Content>
    </V7Layout>
  )
}
