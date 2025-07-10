import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>

      <div className="space-y-4 mb-8">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[150px] rounded-xl" />
          <Skeleton className="h-[150px] rounded-xl" />
          <Skeleton className="h-[150px] rounded-xl" />
          <Skeleton className="h-[150px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
