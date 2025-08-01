import V7Layout from "@/components/v7/v7-layout"
import { V7Content } from "@/components/v7/v7-content"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CustomerDetailsLoading() {
  return (
    <V7Layout>
      <V7Content>
        <div className="space-y-4 md:space-y-6">
          <div className="v7-neu-card p-4 md:p-6 rounded-xl">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-7 w-48 mb-2" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="grid grid-cols-3 gap-2 mb-4 md:mb-6">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardContent>
              </Card>

              <Card className="v7-neu-card-sm">
                <CardHeader className="p-3 md:p-4">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-3 md:p-4 pt-0 space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-7 w-24" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </V7Content>
    </V7Layout>
  )
}
