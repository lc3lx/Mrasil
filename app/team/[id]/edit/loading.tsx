import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto flex h-screen items-center justify-center px-4 py-6">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        <p className="text-lg text-gray-600">جاري تحميل بيانات العضو...</p>
      </div>
    </div>
  )
}
