import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    </div>
  )
}
