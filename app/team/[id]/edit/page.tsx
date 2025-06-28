import { Suspense } from "react"
// import { EditTeamMemberForm } from "@/components/v7/pages/edit-team-member-form"
import { Loader2 } from "lucide-react"

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-[#294D8B]">تعديل بيانات عضو الفريق</h1>
      <Suspense
        fallback={
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        }
      >
        {/* <EditTeamMemberForm memberId={params.id} /> */}
      </Suspense>
    </div>
  )
}
