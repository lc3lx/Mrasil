import { Skeleton } from "@/components/ui/skeleton"

export default function CreateReplacementLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="mb-6 flex justify-between">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex-1">
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
      </div>

      <Skeleton className="h-[600px] rounded-lg" />
    </div>
  )
}
