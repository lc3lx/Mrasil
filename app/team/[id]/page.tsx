import { V7LoadingScreen } from "@/components/v7/v7-loading-screen"
import { Suspense } from "react"
import TeamMemberDetails from "@/app/team/team-member-details"

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<V7LoadingScreen />}>
      <TeamMemberDetails id={params.id} />
    </Suspense>
  )
}
