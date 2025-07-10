import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import BlankAutomationForm from "@/components/v7/pages/blank-automation-form"
import { Suspense } from "react"
import Loading from "./loading"

export default function CreateBlankAutomationPage() {
  return (
    <V7Layout>
      <V7Content
        title="إنشاء قاعدة أتمتة جديدة من الصفر"
        description="قم بإنشاء قاعدة أتمتة مخصصة فارغة تمامًا بدون أي قوالب مسبقة"
      >
        <Suspense fallback={<Loading />}>
          <BlankAutomationForm />
        </Suspense>
      </V7Content>
    </V7Layout>
  )
}
