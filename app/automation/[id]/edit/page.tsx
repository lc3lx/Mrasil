import { Suspense } from "react"
import EditAutomationForm from "@/components/v7/pages/edit-automation-form"
import Loading from "./loading"

export default function EditAutomationRulePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <EditAutomationForm id={params.id} />
      </Suspense>
    </div>
  )
}
