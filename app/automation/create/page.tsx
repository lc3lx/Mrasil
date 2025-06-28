import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { CreateAutomationForm } from "@/components/v7/pages/create-automation-form"

export default function CreateAutomationPage() {
  return (
    <V7Layout>
      <V7Content
        title="إنشاء قاعدة أتمتة جديدة"
        description="قم بإنشاء قاعدة أتمتة مخصصة لتبسيط عمليات الشحن الخاصة بك"
      >
        <CreateAutomationForm />
      </V7Content>
    </V7Layout>
  )
}
