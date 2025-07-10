import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrderDetailsLoading() {
  return (
    <V7Layout>
      <V7Content>
        <div className="p-4 md:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
              <Skeleton className="h-9 w-9 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>

          {/* Order Status Skeleton */}
          <div className="rounded-xl p-4 md:p-6 mb-4 md:mb-6 bg-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="mb-2 md:mb-0">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="mb-2 md:mb-0">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="mb-2 md:mb-0">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="border-b border-gray-200 mb-4 md:mb-6">
            <div className="flex space-x-8 rtl:space-x-reverse">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4 md:space-y-6">
            <div className="rounded-xl p-4 md:p-6 bg-gray-100">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            <div className="rounded-xl p-4 md:p-6 bg-gray-100">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
