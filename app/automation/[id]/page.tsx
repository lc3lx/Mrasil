import { Suspense } from "react"
import AutomationRuleDetails from "@/components/v7/pages/automation-rule-details"
import Loading from "./loading"

export default function AutomationRuleDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <AutomationRuleDetails id={params.id} />
    </Suspense>
  )
}
