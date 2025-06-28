import V7Layout from "@/components/v7/v7-layout"

export default function CarrierIntegrationLoading() {
  return (
    <V7Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-6 bg-white h-80">
                <div className="w-full h-20 bg-gray-100 animate-pulse rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-4 mx-auto"></div>
                <div className="h-5 w-1/3 bg-gray-200 animate-pulse rounded mb-6 mx-auto"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                  <div className="h-4 w-full bg-gray-100 animate-pulse rounded"></div>
                </div>
                <div className="mt-6 h-10 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
        </div>
      </div>
    </V7Layout>
  )
}
